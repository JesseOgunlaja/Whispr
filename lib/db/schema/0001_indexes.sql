CREATE INDEX IF NOT EXISTS idx_rooms_expired
ON rooms (expired_at);

CREATE INDEX IF NOT EXISTS idx_rooms_users_pathops
ON rooms USING GIN (users jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_messages_room_created_cover
ON messages (room_id, created_at DESC)
INCLUDE (id, user_id);
