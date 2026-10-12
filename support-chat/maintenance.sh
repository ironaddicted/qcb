#!/bin/bash
set -euo pipefail
umask 077
runuser -u projectchat -- psql -d projectchat -v ON_ERROR_STOP=1 -c "DELETE FROM conversations WHERE expires_at < now(); DELETE FROM throttle WHERE expires_at < now(); DELETE FROM model_budget WHERE month < to_char(now() - interval '2 months','YYYY-MM');" >/dev/null
mkdir -p /var/backups/projectchat
chmod 700 /var/backups/projectchat
runuser -u projectchat -- pg_dump -Fc projectchat > "/var/backups/projectchat/projectchat-$(date -u +%Y%m%d).dump"
find /var/backups/projectchat -type f -name 'projectchat-*.dump' -mtime +6 -delete
