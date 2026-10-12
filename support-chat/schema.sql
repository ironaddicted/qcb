CREATE TABLE IF NOT EXISTS conversations (
 id uuid PRIMARY KEY, brand text NOT NULL CHECK (brand IN ('vad','qcb')),
 created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now() + interval '30 days',
 turns integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS messages (
 id bigserial PRIMARY KEY, conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
 role text NOT NULL CHECK (role IN ('user','assistant')), content text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS throttle (
 key text PRIMARY KEY, hits integer NOT NULL, expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS model_budget (
 month text PRIMARY KEY, reserved_calls integer NOT NULL DEFAULT 0
);
