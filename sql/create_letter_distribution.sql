insert into letters (wordlength, letter, total, pct)
  select distinct
    6 as wordlength,
    substring(word,1,1) as letter,
    0 as total,
    0 as pct from words where wordlength = 6 order by letter;

update letters
  set total = total + (select count(*) from words where wordlength = 6 and substring(word,1,1) = letter);
update letters
  set total = total + (select count(*) from words where wordlength = 6 and substring(word,2,1) = letter);
update letters
  set total = total + (select count(*) from words where wordlength = 6 and substring(word,3,1) = letter);    
update letters
  set total = total + (select count(*) from words where wordlength = 6 and substring(word,4,1) = letter);    
update letters
  set total = total + (select count(*) from words where wordlength = 6 and substring(word,5,1) = letter);    
update letters
  set total = total + (select count(*) from words where wordlength = 6 and substring(word,6,1) = letter);    

update letters 
  set pct = total::float / (select sum(total) from letters as l where l.wordlength = letters.wordlength)::float;

update letters
set cutoff = 
  (select sum(pct) from letters as ll where ll.wordlength = letters.wordlength and ll.letter BETWEEN 'A' and letters.letter);

update letters set cutoff = 1 where letter = 'Z';