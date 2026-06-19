CREATE FUNCTION update_last_active()
RETURNS trigger AS $$
BEGIN
  UPDATE rooms
  SET last_active = NEW.created_at
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER messages_update_room
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_last_active();
