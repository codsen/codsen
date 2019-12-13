TAP version 13
ok 1 - test/test.js # time=1985.223ms {
    # Subtest: 00.01 - [36mapi bits[39m - exported removeWidows() is a function
        ok 1 - 00.01
        1..1
    ok 1 - 00.01 - [36mapi bits[39m - exported removeWidows() is a function # time=9.137ms
    
    # Subtest: 00.02 - [36mapi bits[39m - exported version is a semver version
        ok 1 - 00.02
        1..1
    ok 2 - 00.02 - [36mapi bits[39m - exported version is a semver version # time=2.297ms
    
    # Subtest: 00.03 - [36mapi bits[39m - sanity check
        ok 1 - 00.03.01
        ok 2 - 00.03.02
        1..2
    ok 3 - 00.03 - [36mapi bits[39m - sanity check # time=1.608ms
    
    # Subtest: 00.04 - [36mapi bits[39m - empty opts obj
        ok 1 - should be equal
        1..1
    ok 4 - 00.04 - [36mapi bits[39m - empty opts obj # time=5.343ms
    
    # Subtest: 01.01 - [32mbasic tests[39m - most basic
        ok 1 - should be equal
        ok 2 - should be equivalent
        ok 3 - should be equivalent
        1..3
    ok 5 - 01.01 - [32mbasic tests[39m - most basic # time=10.227ms
    
    # Subtest: 01.02 - [32mbasic tests[39m - most basic
        ok 1 - should be equal
        ok 2 - should be equivalent
        ok 3 - should be equivalent
        1..3
    ok 6 - 01.02 - [32mbasic tests[39m - most basic # time=3.429ms
    
    # Subtest: 01.03 - [32mbasic tests[39m - single sentence, no full stop
        ok 1 - 01.03.01 - html`, `css`, `js
        ok 2 - 01.03.02 - html`, `css`, `js
        ok 3 - 01.03.03 - html`, `css`, `js
        1..3
    ok 7 - 01.03 - [32mbasic tests[39m - single sentence, no full stop # time=2.593ms
    
    # Subtest: 01.04 - [32mbasic tests[39m - single sentence, full stop
        ok 1 - 01.04.01 - html`, `css`, `js
        ok 2 - 01.04.02 - html`, `css`, `js
        ok 3 - 01.04.03 - html`, `css`, `js
        1..3
    ok 8 - 01.04 - [32mbasic tests[39m - single sentence, full stop # time=3.74ms
    
    # Subtest: 01.05 - [32mbasic tests[39m - paragraphs, full stops
        ok 1 - 01.05.01 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=true
        ok 2 - 01.05.02 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=false
        ok 3 - 01.05.03 - html`, `css`, `js - LF`, `CR`, `CRLF
        ok 4 - 01.05.04 - html`, `css`, `js - LF`, `CR`, `CRLF
        ok 5 - 01.05.05 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=false
        ok 6 - 01.05.06 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=true
        1..6
    ok 9 - 01.05 - [32mbasic tests[39m - paragraphs, full stops # time=17.392ms
    
    # Subtest: 01.06 - [32mbasic tests[39m - raw non-breaking space already there
        ok 1 - 01.06.01 - html`, `css`, `js
        ok 2 - should be equivalent
        ok 3 - 01.06.02 - html`, `css`, `js
        ok 4 - should be equivalent
        ok 5 - 01.06.03 - html`, `css`, `js
        ok 6 - should be equivalent
        1..6
    ok 10 - 01.06 - [32mbasic tests[39m - raw non-breaking space already there # time=5.403ms
    
    # Subtest: 01.07 - [32mbasic tests[39m - paragraphs, coming already fixed
        ok 1 - 01.07.01 - html`, `css`, `js - LF`, `CR`, `CRLF
        ok 2 - 01.07.02 - html`, `css`, `js - LF`, `CR`, `CRLF
        ok 3 - 01.07.03 - html`, `css`, `js - LF`, `CR`, `CRLF - removeWidowPreventionMeasures
        ok 4 - 01.07.04 - html`, `css`, `js - LF`, `CR`, `CRLF - removeWidowPreventionMeasures
        1..4
    ok 11 - 01.07 - [32mbasic tests[39m - paragraphs, coming already fixed # time=9.687ms
    
    # Subtest: 01.08 - [32mbasic tests[39m - paragraphs, coming already fixed and encoded but in wrong format
        ok 1 - 01.08.01 - requested lang. html`, `css`, `js - existing lang. html`, `css`, `js - LF`, `CR`, `CRLF
        ok 2 - 01.08.02 - requested lang. html`, `css`, `js - existing lang. html`, `css`, `js - LF`, `CR`, `CRLF
        ok 3 - 01.08.02 - requested lang. html`, `css`, `js - existing lang. undefined - LF`, `CR`, `CRLF
        ok 4 - 01.08.03 - requested lang. html`, `css`, `js - existing lang. undefined - LF`, `CR`, `CRLF
        ok 5 - 01.08.03 - requested lang. html`, `css`, `js - existing lang. undefined - LF`, `CR`, `CRLF
        ok 6 - 01.08.04 - requested lang. html`, `css`, `js - existing lang. undefined - LF`, `CR`, `CRLF
        1..6
    ok 12 - 01.08 - [32mbasic tests[39m - paragraphs, coming already fixed and encoded but in wrong format # time=31.099ms
    
    # Subtest: 01.09 - [32mbasic tests[39m - single word
        ok 1 - 01.09.01 - html`, `css`, `js
        ok 2 - 01.09.02 - html`, `css`, `js
        ok 3 - 01.09.03 - html`, `css`, `js
        ok 4 - 01.09.04 - html`, `css`, `js
        ok 5 - 01.09.05 - html`, `css`, `js
        1..5
    ok 13 - 01.09 - [32mbasic tests[39m - single word # time=7.189ms
    
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
    ok 14 - 01.10 - [32mbasic tests[39m - doesn't touch empty strings # time=9.32ms
    
    # Subtest: 01.11 - [32mbasic tests[39m - doesn't break within tag
        ok 1 - 01.11
        1..1
    ok 15 - 01.11 - [32mbasic tests[39m - doesn't break within tag # time=5.766ms
    
    # Subtest: 01.12 - [32mbasic tests[39m - doesn't add nbsp after line breaks
        ok 1 - 01.12
        1..1
    ok 16 - 01.12 - [32mbasic tests[39m - doesn't add nbsp after line breaks # time=1.242ms
    
    # Subtest: 01.13 - [32mbasic tests[39m - line breaks and spaces
        ok 1 - 01.13
        1..1
    ok 17 - 01.13 - [32mbasic tests[39m - line breaks and spaces # time=1.691ms
    
    # Subtest: 01.14 - [32mbasic tests[39m - ad hoc case
        ok 1 - should be equivalent
        1..1
    ok 18 - 01.14 - [32mbasic tests[39m - ad hoc case # time=2.853ms
    
    # Subtest: 01.15 - [32mbasic tests[39m - non-widow nbsp is decoded and reported correctly, mixed with widow case
        ok 1 - should be equal
        ok 2 - should be equivalent
        1..2
    ok 19 - 01.15 - [32mbasic tests[39m - non-widow nbsp is decoded and reported correctly, mixed with widow case # time=2.697ms
    
    # Subtest: 01.16 - [32mbasic tests[39m - non-widow nbsp only
        ok 1 - should be equal
        ok 2 - should be equivalent
        1..2
    ok 20 - 01.16 - [32mbasic tests[39m - non-widow nbsp only # time=4.713ms
    
    # Subtest: 01.17 - [32mbasic tests[39m - nbsp only, nothing else
        ok 1 - should be equal
        ok 2 - should be equivalent
        1..2
    ok 21 - 01.17 - [32mbasic tests[39m - nbsp only, nothing else # time=1.944ms
    
    # Subtest: 02.01 - [33mopts.convertEntities[39m - four chunks of text - entities, one line string no full stop
        ok 1 - should be equal
        1..1
    ok 22 - 02.01 - [33mopts.convertEntities[39m - four chunks of text - entities, one line string no full stop # time=2.621ms
    
    # Subtest: 02.02 - [33mopts.convertEntities[39m - four chunks of text - entities, one line string with full stop
        ok 1 - should be equal
        1..1
    ok 23 - 02.02 - [33mopts.convertEntities[39m - four chunks of text - entities, one line string with full stop # time=5.505ms
    
    # Subtest: 02.03 - [33mopts.convertEntities[39m - four chunks of text - no entities, one line string no full stop
        ok 1 - should be equal
        1..1
    ok 24 - 02.03 - [33mopts.convertEntities[39m - four chunks of text - no entities, one line string no full stop # time=4.608ms
    
    # Subtest: 02.04 - [33mopts.convertEntities[39m - four chunks of text - no entities, one line string with full stop
        ok 1 - should be equal
        1..1
    ok 25 - 02.04 - [33mopts.convertEntities[39m - four chunks of text - no entities, one line string with full stop # time=1.366ms
    
    # Subtest: 02.05 - [33mopts.convertEntities[39m - single line break - widow fix needed
        ok 1 - should be equal
        1..1
    ok 26 - 02.05 - [33mopts.convertEntities[39m - single line break - widow fix needed # time=1.977ms
    
    # Subtest: 02.06 - [33mopts.convertEntities[39m - single line break -  - one line break, with full stop - widow fix needed
        ok 1 - should be equal
        1..1
    ok 27 - 02.06 - [33mopts.convertEntities[39m - single line break -  - one line break, with full stop - widow fix needed # time=2.267ms
    
    # Subtest: 02.07 - [33mopts.convertEntities[39m - trailing space
        ok 1 - should be equal
        1..1
    ok 28 - 02.07 - [33mopts.convertEntities[39m - trailing space # time=2.013ms
    
    # Subtest: 02.08 - [33mopts.convertEntities[39m - trailing tabs
        ok 1 - should be equal
        1..1
    ok 29 - 02.08 - [33mopts.convertEntities[39m - trailing tabs # time=2.047ms
    
    # Subtest: 02.09 - [33mopts.convertEntities[39m - nbsp's not added within hidden HTML tags
        ok 1 - 02.09.01
        ok 2 - 02.09.02
        ok 3 - 02.09.03
        ok 4 - 02.09.04
        1..4
    ok 30 - 02.09 - [33mopts.convertEntities[39m - nbsp's not added within hidden HTML tags # time=42.019ms
    
    # Subtest: 02.10 - [33mopts.convertEntities[39m - numeric HTML entity #160
        ok 1 - should be equal
        1..1
    ok 31 - 02.10 - [33mopts.convertEntities[39m - numeric HTML entity #160 # time=1.85ms
    
    # Subtest: 02.11 - [33mopts.convertEntities[39m - numeric HTML entity #160
        ok 1 - should be equal
        1..1
    ok 32 - 02.11 - [33mopts.convertEntities[39m - numeric HTML entity #160 # time=1.498ms
    
    # Subtest: 02.12 - [33mopts.convertEntities[39m - doesn't touch other nbsp's
        ok 1 - should be equal
        1..1
    ok 33 - 02.12 - [33mopts.convertEntities[39m - doesn't touch other nbsp's # time=1.616ms
    
    # Subtest: 02.13 - [33mopts.convertEntities[39m - doesn't touch other nbsp's
        ok 1 - should be equal
        1..1
    ok 34 - 02.13 - [33mopts.convertEntities[39m - doesn't touch other nbsp's # time=1.785ms
    
    # Subtest: 02.14 - [33mopts.convertEntities[39m - two spaces
        ok 1 - should be equal
        1..1
    ok 35 - 02.14 - [33mopts.convertEntities[39m - two spaces # time=1.928ms
    
    # Subtest: 02.15 - [33mopts.convertEntities[39m - two spaces
        ok 1 - should be equal
        1..1
    ok 36 - 02.15 - [33mopts.convertEntities[39m - two spaces # time=1.616ms
    
    # Subtest: 02.16 - [33mopts.convertEntities[39m - tabs
        ok 1 - should be equal
        1..1
    ok 37 - 02.16 - [33mopts.convertEntities[39m - tabs # time=1.855ms
    
    # Subtest: 02.17 - [33mopts.convertEntities[39m - tabs
        ok 1 - should be equal
        1..1
    ok 38 - 02.17 - [33mopts.convertEntities[39m - tabs # time=1.903ms
    
    # Subtest: 02.18 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 39 - 02.18 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces # time=1.662ms
    
    # Subtest: 02.19 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 40 - 02.19 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces # time=1.821ms
    
    # Subtest: 02.20 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 41 - 02.20 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces # time=1.874ms
    
    # Subtest: 02.21 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 42 - 02.21 - [33mopts.convertEntities[39m - converts non-widow non-breaking spaces # time=1.707ms
    
    # Subtest: 02.22 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 43 - 02.22 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces # time=1.468ms
    
    # Subtest: 02.23 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 44 - 02.23 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces # time=1.495ms
    
    # Subtest: 02.24 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces
        ok 1 - should be equal
        1..1
    ok 45 - 02.24 - [33mopts.convertEntities[39m - removeWidowPreventionMeasures - converts non-widow non-breaking spaces # time=4.488ms
    
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
    ok 46 - 03.01 - [31mopts.hyphens[39m - in front of dashes # time=31.449ms
    
    # Subtest: 03.02 - [31mopts.hyphens[39m - hyphen is minus where currency follows
        ok 1 - 03.02.00 - — - html`, `css`, `js
        ok 2 - 03.02.01 - – - html`, `css`, `js
        ok 3 - 03.02.02 - - - html`, `css`, `js
        1..3
    ok 47 - 03.02 - [31mopts.hyphens[39m - hyphen is minus where currency follows # time=4.259ms
    
    # Subtest: 03.03 - [31mopts.hyphens[39m - with &nbsp; and double space
        ok 1 - 03.03.00 - html`, `css`, `js
        1..1
    ok 48 - 03.03 - [31mopts.hyphens[39m - with &nbsp; and double space # time=4.769ms
    
    # Subtest: 04.01 - [34mline endings[39m - does not mangle string with consistent line endings
        ok 1 - 04.01.01.01 - html`, `css`, `js - raw - two LF`, `CR`, `CRLF
        ok 2 - 04.01.02.02 - html`, `css`, `js - encoded - two LF`, `CR`, `CRLF
        ok 3 - 04.01.03.03 - html`, `css`, `js - raw - two LF`, `CR`, `CRLF - trailing line breaks
        ok 4 - 04.01.04.04 - html`, `css`, `js - encoded - two LF`, `CR`, `CRLF - trailing line breaks
        1..4
    ok 49 - 04.01 - [34mline endings[39m - does not mangle string with consistent line endings # time=40.05ms
    
    # Subtest: 05.01 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and nothing happens
        ok 1 - 05.01.01 - templating chunks
        ok 2 - 05.01.02 - templating chunks
        ok 3 - 05.01.03 - templating chunks
        ok 4 - 05.01.04 - templating chunks
        ok 5 - 05.01.05 - templating chunks
        1..5
    ok 50 - 05.01 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and nothing happens # time=8.484ms
    
    # Subtest: 05.02 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and widows are prevented
        ok 1 - 05.02.01 - words under threshold outside templating chunk which completes the threshold
        ok 2 - 05.02.02
        1..2
    ok 51 - 05.02 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and widows are prevented # time=4.375ms
    
    # Subtest: 05.03 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and widows are prevented
        ok 1 - 05.03.01 - min word count threshold + ignore jinja combo
        ok 2 - 05.03.02 - min word count threshold + ignore jinja combo
        ok 3 - 05.03.01 - min word count threshold + ignore jinja combo
# time=4793.138ms
        ok 4 - 05.03.02 - min word count threshold + ignore jinja combo
        1..4
    ok 52 - 05.03 - [35mopts.ignore, nunjucks[39m - widow removal detects template code and widows are prevented # time=12.167ms
    
    # Subtest: 06.01 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 53 - 06.01 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=1.949ms
    
    # Subtest: 06.02 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 54 - 06.02 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=2.057ms
    
    # Subtest: 06.03 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 55 - 06.03 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=1.902ms
    
    # Subtest: 06.04 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 56 - 06.04 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=1.912ms
    
    # Subtest: 06.05 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes
        ok 1 - should be equal
        1..1
    ok 57 - 06.05 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes # time=2.444ms
    
    # Subtest: 06.06 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes
        ok 1 - should be equal
        1..1
    ok 58 - 06.06 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes # time=2.68ms
    
    # Subtest: 06.07 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 59 - 06.07 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop) # time=2.405ms
    
    # Subtest: 06.08 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 60 - 06.08 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop) # time=1.019ms
    
    # Subtest: 06.09 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 61 - 06.09 - [36mopts.UKPostcodes[39m - line ends with a postcode (full stop) # time=2.267ms
    
    # Subtest: 06.10 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 62 - 06.10 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=2.445ms
    
    # Subtest: 06.11 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) - default minimum word count (4) kicks in
        ok 1 - should be equal
        1..1
    ok 63 - 06.11 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) - default minimum word count (4) kicks in # time=1.344ms
    
    # Subtest: 06.12 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 64 - 06.12 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=2.01ms
    
    # Subtest: 06.13 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 65 - 06.13 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=2.31ms
    
    # Subtest: 06.14 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 66 - 06.14 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=2.237ms
    
    # Subtest: 06.15 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop)
        ok 1 - should be equal
        1..1
    ok 67 - 06.15 - [36mopts.UKPostcodes[39m - [33mjs[39m - line ends with a postcode (full stop) # time=2.421ms
    
    # Subtest: 06.16 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures
        ok 1 - should be equal
        1..1
    ok 68 - 06.16 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures # time=2.962ms
    
    # Subtest: 06.17 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures
        ok 1 - should be equal
        1..1
    ok 69 - 06.17 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures # time=3.931ms
    
    # Subtest: 06.18 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures
        ok 1 - should be equal
        1..1
    ok 70 - 06.18 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures # time=2.278ms
    
    # Subtest: 06.19 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures
        ok 1 - should be equal
        1..1
    ok 71 - 06.19 - [36mopts.UKPostcodes[39m - vs. removeWidowPreventionMeasures # time=2.635ms
    
    # Subtest: 06.20 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji
        ok 1 - should be equal
        1..1
    ok 72 - 06.20 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji # time=3.319ms
    
    # Subtest: 06.21 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji
        ok 1 - should be equal
        1..1
    ok 73 - 06.21 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji # time=2.638ms
    
    # Subtest: 06.22 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji
        ok 1 - should be equal
        1..1
    ok 74 - 06.22 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji # time=2.697ms
    
    # Subtest: 06.23 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji
        ok 1 - should be equal
        1..1
    ok 75 - 06.23 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, horse emoji # time=2.796ms
    
    # Subtest: 06.24 - [36mopts.UKPostcodes[39m - improperly formatted UK postcode
        ok 1 - should be equal
        1..1
    ok 76 - 06.24 - [36mopts.UKPostcodes[39m - improperly formatted UK postcode # time=2.193ms
    
    # Subtest: 06.25 - [36mopts.UKPostcodes[39m - improperly formatted UK postcode
        ok 1 - should be equal
        1..1
    ok 77 - 06.25 - [36mopts.UKPostcodes[39m - improperly formatted UK postcode # time=1.913ms
    
    # Subtest: 06.26 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 78 - 06.26 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=1.893ms
    
    # Subtest: 06.27 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps
        ok 1 - should be equal
        1..1
    ok 79 - 06.27 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, in caps # time=1.857ms
    
    # Subtest: 06.28 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes
        ok 1 - should be equal
        1..1
    ok 80 - 06.28 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes # time=1.695ms
    
    # Subtest: 06.29 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes
        ok 1 - should be equal
        1..1
    ok 81 - 06.29 - [36mopts.UKPostcodes[39m - multiple properly formatted postcodes # time=2.415ms
    
    # Subtest: 06.30 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, some emoji
        ok 1 - should be equal
        1..1
    ok 82 - 06.30 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, some emoji # time=5.717ms
    
    # Subtest: 06.31 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, some emoji
        ok 1 - should be equal
        1..1
    ok 83 - 06.31 - [36mopts.UKPostcodes[39m - properly formatted UK postcode, some emoji # time=4.372ms
    
    # Subtest: 07.01 - [31mopts.removeWidowPreventionMeasures[39m - baseline
        ok 1 - 07.01
        1..1
    ok 84 - 07.01 - [31mopts.removeWidowPreventionMeasures[39m - baseline # time=56.984ms
    
    # Subtest: 07.02 - [31mopts.removeWidowPreventionMeasures[39m - comes in without nbsp's
        ok 1 - 07.02
        1..1
    ok 85 - 07.02 - [31mopts.removeWidowPreventionMeasures[39m - comes in without nbsp's # time=28.917ms
    
    # Subtest: 07.03 - [31mopts.removeWidowPreventionMeasures[39m - comes in with nbsp's
        ok 1 - 07.03.01 - html`, `css`, `js - LF`, `CR`, `CRLF - convertEntities=true
        1..1
    ok 86 - 07.03 - [31mopts.removeWidowPreventionMeasures[39m - comes in with nbsp's # time=27.28ms
    
    # Subtest: 08.01 - [32mopts.minWordCount[39m - opts.minWordCount = zero
        ok 1 - should be equal
        1..1
    ok 87 - 08.01 - [32mopts.minWordCount[39m - opts.minWordCount = zero # time=1.427ms
    
    # Subtest: 08.02 - [32mopts.minWordCount[39m - opts.minWordCount = falsey
        ok 1 - should be equal
        1..1
    ok 88 - 08.02 - [32mopts.minWordCount[39m - opts.minWordCount = falsey # time=1.405ms
    
    # Subtest: 08.03 - [32mopts.minWordCount[39m - opts.minWordCount = falsey
        ok 1 - should be equal
        1..1
    ok 89 - 08.03 - [32mopts.minWordCount[39m - opts.minWordCount = falsey # time=1.246ms
    
    # Subtest: 08.04 - [32mopts.minWordCount[39m - setting is less than words in the input
        ok 1 - should be equal
        1..1
    ok 90 - 08.04 - [32mopts.minWordCount[39m - setting is less than words in the input # time=3.59ms
    
    # Subtest: 08.05 - [32mopts.minWordCount[39m - setting is equal to words count in the input
        ok 1 - should be equal
        1..1
    ok 91 - 08.05 - [32mopts.minWordCount[39m - setting is equal to words count in the input # time=2.119ms
    
    # Subtest: 08.06 - [32mopts.minWordCount[39m - setting is more than words in the input
        ok 1 - should be equal
        1..1
    ok 92 - 08.06 - [32mopts.minWordCount[39m - setting is more than words in the input # time=1.286ms
    
    # Subtest: 09.01 - [33mopts.minCharCount[39m - opts.minCharCount = zero
        ok 1 - 09.01.01 - default word count 4 kicks in and makes program skip this
        ok 2 - 09.01.02
        ok 3 - 09.01.03
        ok 4 - 09.01.04
        ok 5 - 09.01.05
        ok 6 - 09.01.06
        1..6
    ok 93 - 09.01 - [33mopts.minCharCount[39m - opts.minCharCount = zero # time=3.985ms
    
    # Subtest: 09.02 - [33mopts.minCharCount[39m - opts.minCharCount = falsey
        ok 1 - 09.02.01
        ok 2 - 09.02.02
        ok 3 - 09.02.03
        ok 4 - 09.02.04
        ok 5 - 09.02.05
        1..5
    ok 94 - 09.02 - [33mopts.minCharCount[39m - opts.minCharCount = falsey # time=4.878ms
    
    # Subtest: 10.01 - [36mopts.reportProgressFunc[39m - calls the progress function
        ok 1 - 10.01.01 - default behaviour
        ok 2 - 10.01.02
        ok 3 - 10.01.03
        ok 4 - (unnamed test)
        ok 5 - 10.01.04 - counter called
        1..5
    ok 95 - 10.01 - [36mopts.reportProgressFunc[39m - calls the progress function # time=88.39ms
    
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
    ok 96 - 10.02 - [36mopts.reportProgressFunc[39m - adjusted from-to range # time=318.906ms
    
    # Subtest: 11.01 - [33mopts.tagRanges[39m - accepts known tag ranges and ignores everything
        ok 1 - 11.01 - everything ignored because everything is a tag
        1..1
    ok 97 - 11.01 - [33mopts.tagRanges[39m - accepts known tag ranges and ignores everything # time=8.774ms
    
    # Subtest: 11.02 - [33mopts.tagRanges[39m - widow space between tags
        ok 1 - 11.02.01 - default behaviour
        ok 2 - 11.02 - tags skipped
        1..2
    ok 98 - 11.02 - [33mopts.tagRanges[39m - widow space between tags # time=4.103ms
    
    # Subtest: 11.03 - [33mopts.tagRanges[39m - widow space between tags
        ok 1 - 11.03.01
        ok 2 - 11.03.02
        1..2
    ok 99 - 11.03 - [33mopts.tagRanges[39m - widow space between tags # time=6.31ms
    
    1..99
    # time=1985.223ms
}

1..1
