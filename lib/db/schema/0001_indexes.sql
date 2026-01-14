CREATE INDEX IF NOT EXISTS idx_rooms_users
ON rooms
USING GIN (users);

CREATE INDEX IF NOT EXISTS idx_rooms_expired
ON rooms (expired_at);

CREATE INDEX IF NOT EXISTS idx_messages_room_id
ON messages (room_id);

CREATE INDEX IF NOT EXISTS idx_messages_room_id_created_at
ON messages (room_id, created_at DESC);
