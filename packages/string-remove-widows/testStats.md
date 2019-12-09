TAP version 13
# Subtest: test/test.js
    # Subtest: 00.01 - [36mapi bits[39m - exported removeWidows() is a function
        ok 1 - 00.01
        1..1
    ok 1 - 00.01 - [36mapi bits[39m - exported removeWidows() is a function # time=7.636ms
    
    # Subtest: 00.02 - [36mapi bits[39m - exported version is a semver version
        ok 1 - 00.02
        1..1
    ok 2 - 00.02 - [36mapi bits[39m - exported version is a semver version # time=5.889ms
    
    # Subtest: 00.03 - [36mapi bits[39m - sanity check
        ok 1 - 00.03.01
        ok 2 - 00.03.02
        1..2
    ok 3 - 00.03 - [36mapi bits[39m - sanity check # time=3.101ms
    
    # Subtest: 00.04 - [36mapi bits[39m - empty opts obj
        ok 1 - should be equal
        1..1
    ok 4 - 00.04 - [36mapi bits[39m - empty opts obj # time=4.963ms
    
    # Subtest: 01.01 - [32mbasic tests[39m - most basic
        ok 1 - should be equal
        ok 2 - should be equivalent
        ok 3 - should be equivalent
        1..3
    ok 5 - 01.01 - [32mbasic tests[39m - most basic # time=16.605ms
    
    # Subtest: 01.02 - [32mbasic tests[39m - most basic
        ok 1 - should be equal
        ok 2 - should be equivalent
        ok 3 - should be equivalent
        1..3
    ok 6 - 01.02 - [32mbasic tests[39m - most basic # time=19.438ms
    
    # Subtest: 01.03 - [32mbasic tests[39m - single sentence, no full stop
        ok 1 - 01.03.01 - html`, `css`, `js
        ok 2 - 01.03.02 - html`, `css`, `js
        ok 3 - 01.03.03 - html`, `css`, `js
        1..3
    ok 7 - 01.03 - [32mbasic tests[39m - single sentence, no full stop # time=4.699ms
    
    # Subtest: 01.04 - [32mbasic tests[39m - single sentence, full stop
        ok 1 - 01.04.01 - html`, `css`, `js
        ok 2 - 01.04.02 - html`, `css`, `js
        ok 3 - 01.04.03 - html`, `css`, `js
        1..3
    ok 8 - 01.04 - [32mbasic tests[39m - single sentence, full stop # time=4.345ms
    
    # Subtest: 01.05 - [32mbasic tests[39m - paragraphs, full stops
        ok 1 - 01.05.01 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=true
        ok 2 - 01.05.02 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=false
        ok 3 - 01.05.03 - html`, `css`, `js - LF`, `CR`, `CRLF
        ok 4 - 01.05.04 - html`, `css`, `js - LF`, `CR`, `CRLF
        ok 5 - 01.05.05 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=false
        ok 6 - 01.05.06 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=true
        1..6
    ok 9 - 01.05 - [32mbasic tests[39m - paragraphs, full stops # time=14.593ms
    
    # Subtest: 01.06 - [32mbasic tests[39m - raw non-breaking space already there
        ok 1 - 01.06.01 - html`, `css`, `js
        ok 2 - should be equivalent
        ok 3 - 01.06.02 - html`, `css`, `js
        ok 4 - should be equivalent
        ok 5 - 01.06.03 - html`, `css`, `js
        ok 6 - should be equivalent
        1..6
    ok 10 - 01.06 - [32mbasic tests[39m - raw non-breaking space already there # time=6.471ms
    
    # Subtest: 01.07 - [32mbasic tests[39m - paragraphs, coming already fixed
        ok 1 - 01.07.01 - html`, `css`, `js - LF`, `CR`, `CRLF
        ok 2 - 01.07.02 - html`, `css`, `js - LF`, `CR`, `CRLF
        ok 3 - 01.07.03 - html`, `css`, `js - LF`, `CR`, `CRLF - removeWidowPreventionMeasures
        ok 4 - 01.07.04 - html`, `css`, `js - LF`, `CR`, `CRLF - removeWidowPreventionMeasures
        1..4
    ok 11 - 01.07 - [32mbasic tests[39m - paragraphs, coming already fixed # time=7.119ms
    
    # Subtest: 01.08 - [32mbasic tests[39m - paragraphs, coming already fixed and encoded but in wrong format
        ok 1 - 01.08.01 - requested lang. html`, `css`, `js - existing lang. html`, `css`, `js - LF`, `CR`, `CRLF
        ok 2 - 01.08.02 - requested lang. html`, `css`, `js - existing lang. html`, `css`, `js - LF`, `CR`, `CRLF
        ok 3 - 01.08.02 - requested lang. html`, `css`, `js - existing lang. undefined - LF`, `CR`, `CRLF
        ok 4 - 01.08.03 - requested lang. html`, `css`, `js - existing lang. undefined - LF`, `CR`, `CRLF
        ok 5 - 01.08.03 - requested lang. html`, `css`, `js - existing lang. undefined - LF`, `CR`, `CRLF
        ok 6 - 01.08.04 - requested lang. html`, `css`, `js - existing lang. undefined - LF`, `CR`, `CRLF
        1..6
    ok 12 - 01.08 - [32mbasic tests[39m - paragraphs, coming already fixed and encoded but in wrong format # time=44.289ms
    
    # Subtest: 01.09 - [32mbasic tests[39m - single word
        ok 1 - 01.09.01 - html`, `css`, `js
        ok 2 - 01.09.02 - html`, `css`, `js
        ok 3 - 01.09.03 - html`, `css`, `js
        ok 4 - 01.09.04 - html`, `css`, `js
        ok 5 - 01.09.05 - html`, `css`, `js
        1..5
    ok 13 - 01.09 - [32mbasic tests[39m - single word # time=16.613ms
    
    # Subtest: 01.10 - [32mbasic tests[39m - doesn't touch empty strings
        ok 1 - 01.10 - ""
        ok 2 - 01.10 - " "
        ok 3 - 01.10 - "\t"
        ok 4 - 01.10 - " \t"
        ok 5 - 01.10 - "\t "
        ok 6 - 01.10 - " \t "
        ok 7 - 01.10 - " \t\t\t\t"
        ok 8 - 01.10 - "\n"
        ok 9 - 01.10 - "\r"
        ok 10 - 01.10 - "\r\n"
        ok 11 - 01.10 - "\n\n"
        ok 12 - 01.10 - "\r\r"
        ok 13 - 01.10 - "\r\n\r\n"
        ok 14 - 01.10 - "\r\n"
        ok 15 - 01.10 - "\n \n"
        ok 16 - 01.10 - "\r \r"
        ok 17 - 01.10 - "\r\n \r\n"
        ok 18 - 01.10 - "\n \t \n"
        ok 19 - 01.10 - "\r \t \r"
        ok 20 - 01.10 - "\r\n \t \r\n"
        1..20
    ok 14 - 01.10 - [32mbasic tests[39m - doesn't touch empty strings # time=20.977ms
    
    # Subtest: 01.11 - [32mbasic tests[39m - doesn't break within tag
        ok 1 - 01.11
        1..1
    ok 15 - 01.11 - [32mbasic tests[39m - doesn't break within tag # time=3.869ms
    
    # Subtest: 01.12 - [32mbasic tests[39m - doesn't add nbsp after line breaks
        ok 1 - 01.12
        1..1
    ok 16 - 01.12 - [32mbasic tests[39m - doesn't add nbsp after line breaks # time=5.518ms
    
    # Subtest: 01.13 - [32mbasic tests[39m - line breaks and spaces
        ok 1 - 01.13
        1..1
    ok 17 - 01.13 - [32mbasic tests[39m - line breaks and spaces # time=7.36ms
    
    # Subtest: 01.14 - [32mbasic tests[39m - ad hoc case
        ok 1 - should be equivalent
        1..1
    ok 18 - 01.14 - [32mbasic tests[39m - ad hoc case # time=7.085ms
    
    # Subtest: 01.15 - [32mbasic tests[39m - non-widow nbsp is decoded and reported correctly, mixed with widow case
        ok 1 - should be equal
        ok 2 - should be equivalent
        1..2
    ok 19 - 01.15 - [32mbasic tests[39m - non-widow nbsp is decoded and reported correctly, mixed with widow case # time=8.675ms
    
    # Subtest: 01.16 - [32mbasic tests[39m - non-widow nbsp only
        ok 1 - should be equal
        ok 2 - should be equivalent
        1..2
    ok 20 - 01.16 - [32mbasic tests[39m - non-widow nbsp only # time=8.069ms
    
    # Subtest: 01.17 - [32mbasic tests[39m - nbsp only, nothing else
        ok 1 - should be equal
        ok 2 - should be equivalent
        1..2
    ok 21 - 01.17 - [32mbasic tests[39m - nbsp only, nothing else # time=7.927ms
    
    # Subtest: 02.01 - [33mopts.convertEntities[39m - four chunks of text - entities, one line string no full stop
        ok 1 - should be equal
        1..1
    ok 22 - 02.01 - [33mopts.convertEntities[39m - four chunks of text - entities, one line string no full stop # time=7.779ms
    
    # Subtest: 02.02 - [33mopts.convertEntities[39m - four chunks of text - entities, one line string with full stop
        ok 1 - should be equal
        1..1
    ok 23 - 02.02 - [33mopts.convertEntities[39m - four chunks of text - entities, one line string with full stop # time=2.814ms
    
    # Subtest: 02.03 - [33mopts.convertEntities[39m - four chunks of text - no entities, one line string no full stop
        ok 1 - should be equal
        1..1
    ok 24 - 02.03 - [33mopts.convertEntities[39m - four chunks of text - no entities, one line string no full stop # time=13.702ms
    
    # Subtest: 02.04 - [33mopts.convertEntities[39m - four chunks of text - no entities, one line string with full stop
        ok 1 - should be equal
        1..1
    ok 25 - 02.04 - [33mopts.convertEntities[39m - four chunks of text - no entities, one line string with full stop # time=9.145ms
    
    # Subtest: 02.05 - [33mopts.convertEntities[39m - single line break - widow fix needed
        ok 1 - should be equal
        1..1
    ok 26 - 02.05 - [33mopts.convertEntities[39m - single line break - widow fix needed # time=17.365ms
    
    # Subtest: 02.06 - [33mopts.convertEntities[39m - single line break -  - one line break, with full stop - widow fix needed
        ok 1 - should be equal
        1..1
    ok 27 - 02.06 - [33mopts.convertEntities[39m - single line break -  - one line break, with full stop - widow fix needed # time=9.307ms
    
    # Subtest: 02.07 - [33mopts.convertEntities[39m - trailing space
        ok 1 - should be equal
        1..1
    ok 28 - 02.07 - [33mopts.convertEntities[39m - trailing space # time=1.728ms
    
    # Subtest: 02.08 - [33mopts.convertEntities[39m - trailing tabs
        ok 1 - should be equal
        1..1
    ok 29 - 02.08 - [33mopts.convertEntities[39m - trailing tabs # time=12.772ms
    
    # Subtest: 02.09 - [33mopts.convertEntities[39m - nbsp's not added within hidden HTML tags
        ok 1 - 02.09.01
        ok 2 - 02.09.02
        ok 3 - 02.09.03
        ok 4 - 02.09.04
        1..4
    ok 30 - 02.09 - [33mopts.convertEntities[39m - nbsp's not added within hidden HTML tags # time=64.978ms
    
    # Subtest: 02.10 - [33mopts.convertEntities[39m - numeric HTML entity #160
        ok 1 - should be equal
        1..1
    ok 31 - 02.10 - [33mopts.convertEntities[39m - numeric HTML entity #160 # time=1.443ms
    
    # Subtest: 02.11 - [33mopts.convertEntities[39m - numeric HTML entity #160
        ok 1 - should be equal
        1..1
    ok 32 - 02.11 - [33mopts.convertEntities[39m - numeric HTML entity #160 # time=2.946ms
    
    # Subtest: 02.12 - [33mopts.convertEntities[39m - doesn't touch other nbsp's
        ok 1 - should be equal
        1..1
    ok 33 - 02.12 - [33mopts.convertEntities[39m - doesn't touch other nbsp's # time=2.671ms
    
    # Subtest: 02.13 - [33mopts.convertEntities[39m - doesn't touch other nbsp's
        ok 1 - should be equal
        1..1
    ok 34 - 02.13 - [33mopts.convertEntities[39m - doesn't touch other nbsp's # time=10.611ms
    
    # Subtest: 02.14 - [33mopts.convertEntities[39m - two spaces
        ok 1 - should be equal
        1..1
    ok 35 - 02.14 - [33mopts.convertEntities[39m - two spaces # time=7.724ms
    
    # Subtest: 02.15 - [33mopts.convertEntities[39m - two spaces
        ok 1 - should be equal
        1..1
    ok 36 - 02.15 - [33mopts.convertEntities[39m - two spaces # time=6.997ms
    
    # Subtest: 02.16 - [33mopts.convertEntities[39m - tabs
        ok 1 - should be equal
        1..1
    ok 37 - 02.16 - [33mopts.convertEntities[39m - tabs # time=3.084ms
    
    # Subtest: 02.17 - [33mopts.convertEntities[39m - tabs
        ok 1 - should be equal
        1..1
    ok 38 - 02.17 - [33mopts.convertEntities[39m - tabs # time=2.559ms
    
    # Subtest: 02.18 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 39 - 02.18 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces # time=2.624ms
    
    # Subtest: 02.19 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 40 - 02.19 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces # time=6.341ms
    
    # Subtest: 02.20 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 41 - 02.20 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces # time=6.09ms
    
    # Subtest: 02.21 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 42 - 02.21 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces # time=2.482ms
    
    # Subtest: 02.22 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 43 - 02.22 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces # time=10.287ms
    
    # Subtest: 02.23 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 44 - 02.23 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces # time=2.372ms
    
    # Subtest: 02.24 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 45 - 02.24 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces # time=6.012ms
    
    # Subtest: 03.01 - [31mopts.hyphens[39m - in front of dashes
        ok 1 - 03.01.01 - — - html`, `css`, `js
        ok 2 - 03.01.02 - — - html`, `css`, `js
        ok 3 - 03.01.03 - — - html`, `css`, `js
        ok 4 - 03.01.04 - — - html`, `css`, `js
        ok 5 - 03.01.01 - – - html`, `css`, `js
        ok 6 - 03.01.02 - – - html`, `css`, `js
        ok 7 - 03.01.03 - – - html`, `css`, `js
        ok 8 - 03.01.04 - – - html`, `css`, `js
        ok 9 - 03.01.01 - - - html`, `css`, `js
        ok 10 - 03.01.02 - - - html`, `css`, `js
        ok 11 - 03.01.03 - - - html`, `css`, `js
        ok 12 - 03.01.04 - - - html`, `css`, `js
        1..12
    ok 46 - 03.01 - [31mopts.hyphens[39m - in front of dashes # time=45.31ms
    
    # Subtest: 03.02 - [31mopts.hyphens[39m - hyphen is minus where currency follows
        ok 1 - 03.02.00 - — - html`, `css`, `js
        ok 2 - 03.02.01 - – - html`, `css`, `js
        ok 3 - 03.02.02 - - - html`, `css`, `js
        1..3
    ok 47 - 03.02 - [31mopts.hyphens[39m - hyphen is minus where currency follows # time=8.735ms
    
    # Subtest: 03.03 - [31mopts.hyphens[39m - with &nbsp; and double space
        ok 1 - 03.03.00 - html`, `css`, `js
        1..1
    ok 48 - 03.03 - [31mopts.hyphens[39m - with &nbsp; and double space # time=6.944ms
    
    # Subtest: 04.01 - [34mline endings[39m - does not mangle string with consistent line endings
        ok 1 - 04.01.01.01 - html`, `css`, `js - raw - two LF`, `CR`, `CRLF
        ok 2 - 04.01.02.02 - html`, `css`, `js - encoded - two LF`, `CR`, `CRLF
        ok 3 - 04.01.03.03 - html`, `css`, `js - raw - two LF`, `CR`, `CRLF - trailing line breaks
        ok 4 - 04.01.04.04 - html`, `css`, `js - encoded - two LF`, `CR`, `CRLF - trailing line breaks
        1..4
    ok 49 - 04.01 - [34mline endings[39m - does not mangle string with consistent line endings # time=26.543ms
    
    # Subtest: 05.01 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and nothing happens
        ok 1 - 05.01.01 - templating chunks
        ok 2 - 05.01.02 - templating chunks
        ok 3 - 05.01.03 - templating chunks
        ok 4 - 05.01.04 - templating chunks
        ok 5 - 05.01.05 - templating chunks
        1..5
    ok 50 - 05.01 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and nothing happens # time=29.656ms
    
    # Subtest: 05.02 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and widows are prevented
        ok 1 - 05.02.01 - words under threshold outside templating chunk which completes the threshold
        ok 2 - 05.02.02
        1..2
    ok 51 - 05.02 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and widows are prevented # time=13.344ms
    
    # Subtest: 05.03 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and widows are prevented
        ok 1 - 05.03.01 - min word count threshold + ignore jinja combo
        ok 2 - 05.03.02 - min word count threshold + ignore jinja combo
        ok 3 - 05.03.01 - min word count threshold + ignore jinja combo
        ok 4 - 05.03.02 - min word count threshold + ignore jinja combo
        1..4
    ok 52 - 05.03 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and widows are prevented # time=26.059ms
    
    # Subtest: 06.01 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 53 - 06.01 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=8.747ms
    
    # Subtest: 06.02 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 54 - 06.02 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=3.118ms
    
    # Subtest: 06.03 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 55 - 06.03 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=7.64ms
    
    # Subtest: 06.04 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 56 - 06.04 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=6.594ms
    
    # Subtest: 06.05 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes
        ok 1 - should be equal
        1..1
    ok 57 - 06.05 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes # time=7.686ms
    
    # Subtest: 06.06 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes
        ok 1 - should be equal
        1..1
    ok 58 - 06.06 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes # time=11.054ms
    
    # Subtest: 06.07 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 59 - 06.07 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop) # time=6.255ms
    
    # Subtest: 06.08 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 60 - 06.08 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop) # time=7.261ms
    
    # Subtest: 06.09 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 61 - 06.09 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop) # time=3.007ms
    
    # Subtest: 06.10 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 62 - 06.10 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=8.088ms
    
    # Subtest: 06.11 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) - default minimum word count (4) kicks in
        ok 1 - should be equal
        1..1
    ok 63 - 06.11 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) - default minimum word count (4) kicks in # time=6.425ms
    
    # Subtest: 06.12 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 64 - 06.12 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=6.416ms
    
    # Subtest: 06.13 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 65 - 06.13 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=6.877ms
    
    # Subtest: 06.14 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 66 - 06.14 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=3.114ms
    
    # Subtest: 06.15 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 67 - 06.15 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=2.767ms
    
    # Subtest: 06.16 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures
        ok 1 - should be equal
        1..1
    ok 68 - 06.16 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures # time=2.688ms
    
    # Subtest: 06.17 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures
        ok 1 - should be equal
        1..1
    ok 69 - 06.17 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures # time=2.97ms
    
    # Subtest: 06.18 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures
        ok 1 - should be equal
        1..1
    ok 70 - 06.18 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures # time=2.809ms
    
    # Subtest: 06.19 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures
        ok 1 - should be equal
        1..1
    ok 71 - 06.19 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures # time=2.786ms
    
    # Subtest: 06.20 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji
        ok 1 - should be equal
        1..1
    ok 72 - 06.20 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji # time=3.081ms
    
    # Subtest: 06.21 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji
        ok 1 - should be equal
        1..1
    ok 73 - 06.21 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji # time=2.827ms
    
    # Subtest: 06.22 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji
        ok 1 - should be equal
        1..1
    ok 74 - 06.22 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji # time=2.945ms
    
    # Subtest: 06.23 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji
        ok 1 - should be equal
        1..1
    ok 75 - 06.23 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji # time=5.375ms
    
    # Subtest: 06.24 - [36mopts.UKPostcodes[39m - improperly formatted UK postcode
        ok 1 - should be equal
        1..1
    ok 76 - 06.24 - [36mopts.UKPostcodes[39m - improperly formatted UK postcode # time=11.176ms
    
    # Subtest: 06.25 - [36mopts.UKPostcodes[39m - improperly formatted UK postcode
        ok 1 - should be equal
        1..1
    ok 77 - 06.25 - [36mopts.UKPostcodes[39m - improperly formatted UK postcode # time=7.213ms
    
    # Subtest: 06.26 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 78 - 06.26 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=3.214ms
    
    # Subtest: 06.27 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 79 - 06.27 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=2.682ms
    
    # Subtest: 06.28 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes
        ok 1 - should be equal
        1..1
    ok 80 - 06.28 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes # time=3.253ms
    
    # Subtest: 06.29 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes
        ok 1 - should be equal
        1..1
    ok 81 - 06.29 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes # time=3.083ms
    
    # Subtest: 06.30 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, some emoji
        ok 1 - should be equal
        1..1
    ok 82 - 06.30 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, some emoji # time=37.587ms
    
    # Subtest: 06.31 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, some emoji
        ok 1 - should be equal
        1..1
    ok 83 - 06.31 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, some emoji # time=7.313ms
    
    # Subtest: 07.01 - [31mopts.removeWidowPreventionMeasures[39m - baseline
        ok 1 - 07.01
        1..1
    ok 84 - 07.01 - [31mopts.removeWidowPreventionMeasures[39m - baseline # time=21.275ms
    
    # Subtest: 07.02 - [31mopts.removeWidowPreventionMeasures[39m - comes in without nbsp's
        ok 1 - 07.02
        1..1
    ok 85 - 07.02 - [31mopts.removeWidowPreventionMeasures[39m - comes in without nbsp's # time=24.403ms
    
    # Subtest: 07.03 - [31mopts.removeWidowPreventionMeasures[39m - comes in with nbsp's
        ok 1 - 07.03.01 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=true
        1..1
    ok 86 - 07.03 - [31mopts.removeWidowPreventionMeasures[39m - comes in with nbsp's # time=28.445ms
    
    # Subtest: 08.01 - [32mopts.minWordCount[39m - opts.minWordCount = zero
        ok 1 - should be equal
        1..1
    ok 87 - 08.01 - [32mopts.minWordCount[39m - opts.minWordCount = zero # time=5.922ms
    
    # Subtest: 08.02 - [32mopts.minWordCount[39m - opts.minWordCount = falsey
        ok 1 - should be equal
        1..1
    ok 88 - 08.02 - [32mopts.minWordCount[39m - opts.minWordCount = falsey # time=2.448ms
    
    # Subtest: 08.03 - [32mopts.minWordCount[39m - opts.minWordCount = falsey
        ok 1 - should be equal
        1..1
    ok 89 - 08.03 - [32mopts.minWordCount[39m - opts.minWordCount = falsey # time=6.483ms
    
    # Subtest: 08.04 - [32mopts.minWordCount[39m - setting is less than words in the input
        ok 1 - should be equal
        1..1
    ok 90 - 08.04 - [32mopts.minWordCount[39m - setting is less than words in the input # time=6.11ms
    
    # Subtest: 08.05 - [32mopts.minWordCount[39m - setting is equal to words count in the input
        ok 1 - should be equal
        1..1
    ok 91 - 08.05 - [32mopts.minWordCount[39m - setting is equal to words count in the input # time=11.478ms
    
    # Subtest: 08.06 - [32mopts.minWordCount[39m - setting is more than words in the input
        ok 1 - should be equal
        1..1
    ok 92 - 08.06 - [32mopts.minWordCount[39m - setting is more than words in the input # time=5.956ms
    
    # Subtest: 09.01 - [33mopts.minCharCount[39m - opts.minCharCount = zero
        ok 1 - 09.01.01 - default word count 4 kicks in and makes program skip this
        ok 2 - 09.01.02
        ok 3 - 09.01.03
        ok 4 - 09.01.04
        ok 5 - 09.01.05
        ok 6 - 09.01.06
        1..6
    ok 93 - 09.01 - [33mopts.minCharCount[39m - opts.minCharCount = zero # time=15.285ms
    
    # Subtest: 09.02 - [33mopts.minCharCount[39m - opts.minCharCount = falsey
        ok 1 - 09.02.01
        ok 2 - 09.02.02
        ok 3 - 09.02.03
        ok 4 - 09.02.04
        ok 5 - 09.02.05
        1..5
    ok 94 - 09.02 - [33mopts.minCharCount[39m - opts.minCharCount = falsey # time=11.835ms
    
    # Subtest: 10.01 - [36mopts.reportProgressFunc[39m - calls the progress function
        ok 1 - 10.01.01 - default behaviour
        ok 2 - 10.01.02
        ok 3 - 10.01.03
        ok 4 - (unnamed test)
        ok 5 - 10.01.04 - counter called
        1..5
    ok 95 - 10.01 - [36mopts.reportProgressFunc[39m - calls the progress function # time=99.597ms
    
    # Subtest: 10.02 - [36mopts.reportProgressFunc[39m - adjusted from-to range
        ok 1 - (unnamed test)
        ok 2 - checking: 21%
        ok 3 - checking: 22%
        ok 4 - checking: 23%
        ok 5 - checking: 24%
        ok 6 - checking: 25%
        ok 7 - checking: 26%
        ok 8 - checking: 27%
        ok 9 - checking: 28%
        ok 10 - checking: 29%
        ok 11 - checking: 30%
        ok 12 - checking: 31%
        ok 13 - checking: 32%
        ok 14 - checking: 33%
        ok 15 - checking: 34%
        ok 16 - checking: 35%
        ok 17 - checking: 36%
        ok 18 - checking: 37%
        ok 19 - checking: 38%
        ok 20 - checking: 39%
        ok 21 - checking: 40%
        ok 22 - checking: 41%
        ok 23 - checking: 42%
        ok 24 - checking: 43%
        ok 25 - checking: 44%
        ok 26 - checking: 45%
        ok 27 - checking: 46%
        ok 28 - checking: 47%
        ok 29 - checking: 48%
        ok 30 - checking: 49%
        ok 31 - checking: 50%
        ok 32 - checking: 51%
        ok 33 - checking: 52%
        ok 34 - checking: 53%
        ok 35 - checking: 54%
        ok 36 - checking: 55%
        ok 37 - checking: 56%
        ok 38 - checking: 57%
        ok 39 - checking: 58%
        ok 40 - checking: 59%
        ok 41 - checking: 60%
        ok 42 - checking: 61%
        ok 43 - checking: 62%
        ok 44 - checking: 63%
        ok 45 - checking: 64%
        ok 46 - checking: 65%
        ok 47 - checking: 66%
        ok 48 - checking: 67%
        ok 49 - checking: 68%
        ok 50 - checking: 69%
        ok 51 - checking: 70%
        ok 52 - checking: 71%
        ok 53 - checking: 72%
        ok 54 - checking: 73%
        ok 55 - checking: 74%
        ok 56 - checking: 75%
        ok 57 - checking: 76%
        ok 58 - checking: 77%
        ok 59 - checking: 78%
        ok 60 - checking: 79%
        ok 61 - checking: 80%
        ok 62 - checking: 81%
        ok 63 - checking: 82%
        ok 64 - checking: 61%
        ok 65 - checking: 62%
        ok 66 - checking: 63%
        ok 67 - checking: 64%
        ok 68 - should be equal
        1..68
    ok 96 - 10.02 - [36mopts.reportProgressFunc[39m - adjusted from-to range # time=320.64ms
    
    # Subtest: 11.01 - [33mopts.tagRanges[39m - accepts known tag ranges and ignores everything
        ok 1 - 11.01 - everything ignored because everything is a tag
        1..1
    ok 97 - 11.01 - [33mopts.tagRanges[39m - accepts known tag ranges and ignores everything # time=21.373ms
    
    # Subtest: 11.02 - [33mopts.tagRanges[39m - widow space between tags
        ok 1 - 11.02.01 - default behaviour
        ok 2 - 11.02 - tags skipped
        1..2
    ok 98 - 11.02 - [33mopts.tagRanges[39m - widow space between tags # time=15.868ms
    
    # Subtest: 11.03 - [33mopts.tagRanges[39m - widow space between tags
        ok 1 - 11.03.01
        ok 2 - 11.03.02
        1..2
    ok 99 - 11.03 - [33mopts.tagRanges[39m - widow space between tags # time=13.633ms
    
    1..99
    # time=2578.666ms
ok 1 - test/test.js # time=2578.666ms

1..1
# time=5828.668ms
