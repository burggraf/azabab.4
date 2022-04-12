--DROP FUNCTION groups_delete;
CREATE OR REPLACE FUNCTION groups_delete (target uuid)
RETURNS TEXT as
$$
BEGIN
   IF (SELECT count(*) from groups where parent_id = target) > 0 THEN
      RAISE EXCEPTION 'children exist, cannot delete'; 
   END IF;
   IF (SELECT count(*) from groups_access where group_id = target AND user_id = auth.uid() AND access = 'admin') = 0 THEN
      RAISE EXCEPTION 'admin access required to delete'; 
   END IF;
   DELETE FROM groups_access WHERE group_id = target;
   DELETE FROM groups WHERE id = target;
   RETURN 'OK';
END
$$
LANGUAGE PLPGSQL SECURITY DEFINER;
