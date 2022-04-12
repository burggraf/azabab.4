--DROP FUNCTION groups_delete;
CREATE OR REPLACE FUNCTION groups_delete (target uuid)
RETURNS void as
$$
   DELETE FROM groups_access where group_id = target;
   DELETE FROM groups where id = target;
$$
language SQL;


