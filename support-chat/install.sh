#!/bin/bash
set -euo pipefail
cd /tmp
SOURCE=/home/ubuntu/projectchat-staging
id projectchat >/dev/null 2>&1 || useradd --system --home /nonexistent --shell /usr/sbin/nologin projectchat
install -d -m 755 /opt/projectchat
install -m 644 "$SOURCE/server.py" "$SOURCE/knowledge.json" /opt/projectchat/
if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='projectchat'" | grep -q 1; then
 runuser -u postgres -- psql -v ON_ERROR_STOP=1 -c 'CREATE ROLE projectchat LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE CONNECTION LIMIT 8;'
fi
if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_database WHERE datname='projectchat'" | grep -q 1; then
 runuser -u postgres -- createdb -O projectchat projectchat
fi
runuser -u postgres -- psql -v ON_ERROR_STOP=1 -c "ALTER SYSTEM SET listen_addresses = '';"
runuser -u postgres -- psql -v ON_ERROR_STOP=1 -c "ALTER SYSTEM SET shared_buffers = '32MB';"
runuser -u postgres -- psql -v ON_ERROR_STOP=1 -c "ALTER SYSTEM SET max_connections = 16;"
systemctl restart postgresql
runuser -u projectchat -- psql -d projectchat -v ON_ERROR_STOP=1 < "$SOURCE/schema.sql"
if [ ! -f /etc/projectchat.env ]; then
 /usr/bin/python3 -c 'import secrets; print("CHAT_SECRET="+secrets.token_hex(32)); print("AI_ENABLED=0\nOPENAI_MODEL=gpt-6-luna\nOPENAI_API_KEY=")' > /etc/projectchat.env
fi
chown root:root /etc/projectchat.env
chmod 600 /etc/projectchat.env
install -m 644 "$SOURCE/projectchat.service" /etc/systemd/system/projectchat.service
install -m 700 "$SOURCE/maintenance.sh" /usr/local/sbin/projectchat-maintenance
printf '17 4 * * * root /usr/local/sbin/projectchat-maintenance\n' > /etc/cron.d/projectchat-maintenance
chmod 644 /etc/cron.d/projectchat-maintenance
systemctl daemon-reload
systemctl enable --now projectchat
systemctl restart projectchat
curl --fail --silent --retry 3 --retry-connrefused http://127.0.0.1:8765/api/project-chat/health
