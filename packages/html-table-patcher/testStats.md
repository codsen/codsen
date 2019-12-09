TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - [31mtype 1[39m[33m - code between TABLE and TR[39m - the beginning
        ok 1 - 01.01 - str before tr - 1 col
        1..1
    ok 1 - 01.01 - [31mtype 1[39m[33m - code between TABLE and TR[39m - the beginning # time=46.468ms
    
    # Subtest: 01.02 - [31mtype 1[39m[33m - code between TABLE and TR[39m - the ending
        ok 1 - 01.02 - string after the tr - 1 col
        1..1
    ok 2 - 01.02 - [31mtype 1[39m[33m - code between TABLE and TR[39m - the ending # time=31.928ms
    
    # Subtest: 01.03 - [31mtype 1[39m[33m - code between TR and TR[39m - code between two tr's
        ok 1 - 01.03 - string between the tr's - 1 col
        1..1
    ok 3 - 01.03 - [31mtype 1[39m[33m - code between TR and TR[39m - code between two tr's # time=11.861ms
    
    # Subtest: 01.04 - [31mtype 1[39m[33m - code between TABLE and TR[39m - mess within comment block
        ok 1 - 01.04 - notice comment is never closed, yet wrapping occurs before it
        1..1
    ok 4 - 01.04 - [31mtype 1[39m[33m - code between TABLE and TR[39m - mess within comment block # time=5.36ms
    
    # Subtest: 01.05 - [31mtype 1[39m[33m - code between TR and TR[39m - commented-out code + raw code
        ok 1 - 01.05 - code + comments
        1..1
    ok 5 - 01.05 - [31mtype 1[39m[33m - code between TR and TR[39m - commented-out code + raw code # time=5.647ms
    
    # Subtest: 01.06 - [31mtype 1[39m[33m - code between TR and TR[39m - colspan=2
        ok 1 - 01.06
        1..1
    ok 6 - 01.06 - [31mtype 1[39m[33m - code between TR and TR[39m - colspan=2 # time=5.24ms
    
    # Subtest: 01.07 - [31mtype 1[39m[33m - code between TR and TR[39m - detects centering, HTML align attribute
        ok 1 - 01.07 - string between the tr's - 1 col
        1..1
    ok 7 - 01.07 - [31mtype 1[39m[33m - code between TR and TR[39m - detects centering, HTML align attribute # time=8.544ms
    
    # Subtest: 01.08 - [31mtype 1[39m[33m - code between TR and TR[39m - detects centering, inline CSS text-align
        ok 1 - 01.08 - string between the tr's - 1 col
        1..1
    ok 8 - 01.08 - [31mtype 1[39m[33m - code between TR and TR[39m - detects centering, inline CSS text-align # time=5.343ms
    
    # Subtest: 01.09 - [31mtype 1[39m[33m - code between TR and TR[39m - single quote as TD content
        ok 1 - 01.09
        1..1
    ok 9 - 01.09 - [31mtype 1[39m[33m - code between TR and TR[39m - single quote as TD content # time=6.758ms
    
    # Subtest: 01.10 - [31mtype 1[39m[33m - code between TR and TR[39m - styling via opts
        ok 1 - 01.10
        1..1
    ok 10 - 01.10 - [31mtype 1[39m[33m - code between TR and TR[39m - styling via opts # time=9.691ms
    
    # Subtest: 01.11 - [31mtype 1[39m[33m - code between TR and TR[39m - styling via opts, #2
        ok 1 - 01.11
        1..1
    ok 11 - 01.11 - [31mtype 1[39m[33m - code between TR and TR[39m - styling via opts, #2 # time=15.839ms
    
    # Subtest: 01.12 - [31mtype 1[39m[33m - code between TR and TR[39m - styling via opts, #3
        ok 1 - 01.12
        1..1
    ok 12 - 01.12 - [31mtype 1[39m[33m - code between TR and TR[39m - styling via opts, #3 # time=45.013ms
    
    # Subtest: 01.13 - [31mtype 1[39m[33m - code between TR and TR[39m - deeper nesting
        ok 1 - 01.13
        1..1
    ok 13 - 01.13 - [31mtype 1[39m[33m - code between TR and TR[39m - deeper nesting # time=15.165ms
    
    # Subtest: 01.14 - [31mtype 1[39m[33m - code between TR and TR[39m - deeper nesting
        ok 1 - 01.14
        1..1
    ok 14 - 01.14 - [31mtype 1[39m[33m - code between TR and TR[39m - deeper nesting # time=21.113ms
    
    # Subtest: 02.01 - [36mtype 2[39m[33m - code between TR and [34mTD[39m[39m - first TD after TR
        ok 1 - 02.01 - str before tr - 1 col
        1..1
    ok 15 - 02.01 - [36mtype 2[39m[33m - code between TR and [34mTD[39m[39m - first TD after TR # time=10.718ms
    
    # Subtest: 02.02 - [36mtype 2[39m[33m - code between TR and [34mTD[39m[39m - colspan=2
        ok 1 - 02.02 - str before tr - colspan=2
        1..1
    ok 16 - 02.02 - [36mtype 2[39m[33m - code between TR and [34mTD[39m[39m - colspan=2 # time=12.438ms
    
    # Subtest: 02.03 - [36mtype 2[39m[33m - code between TR and [34mTD[39m[39m - align="center", one TD
        ok 1 - 02.03
        1..1
    ok 17 - 02.03 - [36mtype 2[39m[33m - code between TR and [34mTD[39m[39m - align="center", one TD # time=7.492ms
    
    # Subtest: 02.04 - [36mtype 2[39m[33m - code between TR and [34mTD[39m[39m - align="center" on one of two TD's
        ok 1 - 02.04
        1..1
    ok 18 - 02.04 - [36mtype 2[39m[33m - code between TR and [34mTD[39m[39m - align="center" on one of two TD's # time=11.676ms
    
    # Subtest: 03.01 - [32mtype 3[39m[33m - code between [34mTD[39m [33mand[39m [34mTD[39m - between two TD's
        ok 1 - 03.01 - str before tr - 1 col
        1..1
    ok 19 - 03.01 - [32mtype 3[39m[33m - code between [34mTD[39m [33mand[39m [34mTD[39m - between two TD's # time=11.647ms
    
    # Subtest: 03.02 - [32mtype 3[39m[33m - code between [34mTD[39m [33mand[39m [34mTD[39m - 3 places
        ok 1 - 03.02
        1..1
    ok 20 - 03.02 - [32mtype 3[39m[33m - code between [34mTD[39m [33mand[39m [34mTD[39m - 3 places # time=4.088ms
    
    # Subtest: 04.01 - [35mtype 4[39m[33m - code closing TD and closing TR[39m - two tags
        ok 1 - 04.01 - 1 col
        1..1
    ok 21 - 04.01 - [35mtype 4[39m[33m - code closing TD and closing TR[39m - two tags # time=9.732ms
    
    # Subtest: 05.01 - [36mfalse positives[39m[33m - comments[39m - various HTML comments
        ok 1 - 05.01.01 - tight comments
        ok 2 - 05.01.02 - comments include line breaks
        ok 3 - 05.01.03 - comments include line breaks
        1..3
    ok 22 - 05.01 - [36mfalse positives[39m[33m - comments[39m - various HTML comments # time=10.979ms
    
    # Subtest: 06.01 - [34mAPI bits[39m - defaults
        ok 1 - 06.01.01
        ok 2 - 06.01.02
        1..2
    ok 23 - 06.01 - [34mAPI bits[39m - defaults # time=1.863ms
    
    # Subtest: 06.02 - [34mAPI bits[39m - version
        ok 1 - 06.02.01
        1..1
    ok 24 - 06.02 - [34mAPI bits[39m - version # time=1.935ms
    
    1..24
    # time=504.609ms
ok 1 - test/test.js # time=504.609ms

1..1
# time=3221.388ms
