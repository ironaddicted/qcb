#!/usr/bin/python3
"""Run with sudo in SSH. API key is entered with echo disabled, never logged."""
import getpass, json, os, subprocess
from pathlib import Path
from urllib.request import Request,urlopen
if os.geteuid()!=0:raise SystemExit('Run this script with sudo.')
key=getpass.getpass('OpenAI API key (hidden): ').strip()
if not key or '\n' in key or '\r' in key:raise SystemExit('Invalid key.')
model='gpt-6-luna'
body={'model':model,'store':False,'max_output_tokens':2048,'instructions':'Return ONLY NONE.','input':'Connection check'}
try:
 with urlopen(Request('https://api.openai.com/v1/responses',data=json.dumps(body).encode(),headers={'Authorization':'Bearer '+key,'Content-Type':'application/json'}),timeout=20) as response:
  data=json.load(response)
except Exception:raise SystemExit('API connection check failed. Configuration was not changed; check billing and model access.')
result=''.join(c.get('text','') for o in data.get('output',[]) for c in o.get('content',[]) if c.get('type')=='output_text').strip()
if data.get('status')!='completed' or result.strip('"').rstrip('.').upper()!='NONE':
 reason=(data.get('incomplete_details') or {}).get('reason','unexpected_response')
 raise SystemExit('Model check failed: status='+str(data.get('status','unknown'))+', reason='+str(reason)+'. Configuration was not changed.')
path=Path('/etc/projectchat.env')
lines=[line for line in path.read_text().splitlines() if not line.startswith(('AI_ENABLED=','OPENAI_MODEL=','OPENAI_API_KEY='))]
path.write_text('\n'.join(lines)+f'\nAI_ENABLED=1\nOPENAI_MODEL={model}\nOPENAI_API_KEY={key}\n')
path.chmod(0o600)
subprocess.run(['systemctl','restart','projectchat'],check=True)
print('AI matching enabled. Server-side budget reservations and approved-answer restrictions remain active.')
