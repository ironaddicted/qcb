"""Run as root after reviewing the explicitly targeted virtual hosts."""
from pathlib import Path
targets=['qcb-le-ssl.conf','vadconstructions.com-le-ssl.conf','vadconstructions.com.conf']
block='''
    # BEGIN PROJECT CHAT
    ProxyPass /api/project-chat/ http://127.0.0.1:8765/api/project-chat/ connectiontimeout=3 timeout=25
    ProxyPassReverse /api/project-chat/ http://127.0.0.1:8765/api/project-chat/
    <Location /api/project-chat/>
        LimitRequestBody 3000
        RequestHeader set X-Real-IP "expr=%{REMOTE_ADDR}"
        RequestHeader set X-Forwarded-Host "expr=%{HTTP_HOST}"
        Header always set Cache-Control "no-store"
    </Location>
    # END PROJECT CHAT
'''
for name in targets:
    path=Path('/etc/apache2/sites-enabled')/name
    original=path.read_text()
    if '# BEGIN PROJECT CHAT' in original: continue
    backup=path.with_name(path.name+'.before-projectchat')
    if not backup.exists(): backup.write_text(original)
    # Insert in HTTPS blocks only; HTTP continues to redirect.
    chunks=original.split('</VirtualHost>')
    changed='</VirtualHost>'.join(chunk+block if '<VirtualHost *:443>' in chunk else chunk for chunk in chunks)
    path.write_text(changed)
