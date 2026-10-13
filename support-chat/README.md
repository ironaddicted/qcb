# VAD / QCB project support chat

The production widget is `public/project-chat.js`; an identical copy is maintained at VAD `js/project-chat.js`. Approved answers live in `knowledge.json`. The model selects an answer ID, never writes customer-facing prose. This deliberately trades broad conversation for predictable business answers. Topics outside the approved coverage redirect to the quote form. No browsing, code execution, uploads, price overrides, scheduling, or arbitrary model tools.

## Current installation

Ubuntu PostgreSQL 14 from the OS repository; local Unix socket only, no TCP listener. Database and dedicated unprivileged OS/DB role: `projectchat`. Application `/opt/projectchat/server.py`, private environment `/etc/projectchat.env` (root-only), systemd `projectchat`, loopback port 8765. HTTPS Apache proxy restricted to the VAD and QCB virtual hosts. Backend source stays outside website document roots; QCB build only publishes `dist`. A model key is never committed or built into browser assets.

Starts in explicitly labeled guided mode. AI requires an OpenAI API account with billing and model access. From SSH, use `sudo python3 /opt/projectchat/configure-ai.py` and enter the key at the hidden prompt. It verifies a small API request before activating. Do not paste a key into chat. To disable AI, set `AI_ENABLED=0` with `sudoedit /etc/projectchat.env` and restart `projectchat`.

## Limits

- Explicit consent before creating a conversation; no transcript fetch endpoint.
- Signed brand-bound conversation token kept in tab session storage for reload recovery; 20 messages and 30-day expiry.
- 600 characters per message; 3KB request body; 8 requests/minute and 80/day per hashed network address across both brands; 50 new sessions/day per address. Shared household networks may encounter the same limit.
- Global 1500 requests/day; six concurrent backend requests, two concurrent model requests; network/model timeouts.
- Model generation limited to 2048 tokens, including internal reasoning; model only returns an allowed FAQ ID or NONE. Unknown/malformed output is rejected. Guided responses available on model failure or allowance exhaustion.
- 1000 reserved model calls per UTC calendar month. At a conservative $0.01 reservation/call this is a $10 planning allowance for the configured model, not an account-wide provider billing limit. Failed calls retain their reservation. Recheck rates before changing models. The setup connection check is outside this small runtime allowance.
- SQL parameters and plain-text DOM rendering; same-origin checks; trusted Apache overwrite of forwarded host/network headers. Automated clients can spoof their own Origin, so rate, concurrency, fixed answer coverage, and global bounds are essential.

Daily maintenance expires anonymous conversations after 30 days, cascades message deletion, clears expired throttles, and saves root-readable PostgreSQL dumps in `/var/backups/projectchat` for seven days. A restore test was performed against a separate temporary database. These are **local, unencrypted backups**, not disaster recovery against loss of this server; encrypted off-server backup remains to configure. PostgreSQL 14 upstream support ends November 2026; schedule an upgrade to a newer supported version promptly.

## Lead handoff and privacy

Chat does not collect contacts or create conversions. The quote action copies the conversation reference and visitor questions into the existing form's optional project details. The visitor reviews and submits that form. Existing Lambda delivery and lead analytics are retained. Contacts are held by that existing inquiry pipeline, not in this chat database. This installation stores conversations only; a lead dashboard, automatic contact matching, and human takeover are later work.

Consent notice and `/chat-privacy.html` describe retention, optional OpenAI matching, and existing inquiry service. No messages/contact data sent to analytics. Server credentials, transcripts, backups, and database files are outside the public websites. Owner review currently uses authorized SSH/database access; no public admin dashboard is exposed.

## Validation / operations

Run `python support-chat/test_policy.py` locally. `test_http.py` is a prelaunch test that clears throttle counters and must **not** run against an active production chat. Check `systemctl status projectchat`, `journalctl -u projectchat` (no content logs), and the health endpoint. Apache config backups use `.before-projectchat`; disable widget includes and stop `projectchat` to roll back UI/backend without deleting records.
