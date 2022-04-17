--DROP FUNCTION calculate_score;
CREATE OR REPLACE FUNCTION calculate_score (trials text[])
RETURNS TEXT as
$$
DECLARE  
   score integer := 0;
   idx integer := 1;  
   success integer := 0;
   winners text[];
BEGIN  
   WHILE idx <= array_length(trials, 1) LOOP  
    success = (select count(*) from words where word = trials[idx]);
    IF success > 0 THEN
      winners = winners || trials[idx];
    END IF;
    idx = idx + 1;
   END LOOP;
   RETURN array_to_string(winners, ', ');  
END  
$$
LANGUAGE PLPGSQL; -- SECURITY DEFINER;

