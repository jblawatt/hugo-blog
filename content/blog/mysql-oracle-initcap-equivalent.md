+++
title = "MySQL Equivalent zu ORACLE's initcap"
date = "2008-04-11"
tags = ["mysql"]
+++

Die Funktion **initcap** des *DBMS ORACLE* verwandelt jedes erste
Zeichen eines Wortes in einem übergebenen String in ein Großbuchstaben,
der Rest wird klein geschrieben.

**Beispiel:**

``` sql
    select initcap('jens blawatt') from dual;
```

**Ergebnis:**

``` bash
    Jens Blawatt
```

Diese Funktion gibt es leider in MySQL nicht. Es ist jedoch möglich
eigene Funktionen zu schreiben. Hier ist also meine MySQL initcap
Version (unter dem Quellcode gibt es die Downloadmöglichkeit):

``` sql
    DELIMITER $$
    
    DROP FUNCTION IF EXISTS initcap$$
    
    CREATE FUNCTION initcap( param VARCHAR(255) )
        RETURNS VARCHAR(255)
        /*
        * Author : Jens Blawatt
        * Website : http://www.Blawatt.de
        * Description : A MySQL equivalent to ORACLE's initcap
        */
        BEGIN
            DECLARE result VARCHAR(255) default '';
            DECLARE tmp VARCHAR(255) default '';
    
            -- endless repeat
            WHILE  1 = 1 DO
                -- if it's the end of the blank spearated string
                IF INSTR(TRIM(param) , ' ') = 0 THEN
                    return trim(concat(result, UCASE(LEFT(param,1)),LOWER(SUBSTR(param,2))));
                END IF;
        
                -- split the first part to tmp
                SET tmp = SUBSTR(param, 1, INSTR(param , ' '));
    
                -- write first character in capital letter rest in small type
                SET result = CONCAT(result, UCASE(LEFT(tmp,1)),LOWER(SUBSTR(tmp,2)));
    
                -- remove splitted word from param string
                SET param = SUBSTR(param, INSTR(param , ' ') + 1);
            END WHILE;
        END$$
    
    DELIMITER ;
```