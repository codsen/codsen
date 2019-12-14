TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - string input - doesn't touch full hex codes
        ok 1 - 01.01
        1..1
    ok 1 - 01.01 - string input - doesn't touch full hex codes # time=8.21ms
    
    # Subtest: 01.02 - string input - changes one shorthand, lowercase
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        1..3
    ok 2 - 01.02 - string input - changes one shorthand, lowercase # time=3.639ms
    
    # Subtest: 01.02 - string input - changes one shorthand, uppercase
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        1..3
    ok 3 - 01.02 - string input - changes one shorthand, uppercase # time=3.037ms
    
    # Subtest: 02.01 - plain object input - simple one level object
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        1..2
    ok 4 - 02.01 - plain object input - simple one level object # time=4.856ms
    
    # Subtest: 02.02 - plain object input - nested
        ok 1 - 02.02
        1..1
    ok 5 - 02.02 - plain object input - nested # time=3.117ms
    
    # Subtest: 03.01 - array input - one level, strings inside
        ok 1 - 03.01
        1..1
    ok 6 - 03.01 - array input - one level, strings inside # time=1.695ms
    
    # Subtest: 03.02 - array input - nested objects & arrays
        ok 1 - 03.02
        1..1
    ok 7 - 03.02 - array input - nested objects & arrays # time=3.305ms
    
    # Subtest: 04.01 - function as input - returned
        ok 1 - 04.01
        1..1
    ok 8 - 04.01 - function as input - returned # time=1.933ms
    
    # Subtest: 04.02 - null input - returned
        ok 1 - 04.02
        1..1
    ok 9 - 04.02 - null input - returned # time=1.512ms
    
    # Subtest: 04.03 - undefined input - returned
        ok 1 - 04.03
        1..1
    ok 10 - 04.03 - undefined input - returned # time=11.064ms
    
    # Subtest: 04.04 - NaN input - returned
        ok 1 - 04.04
        1..1
    ok 11 - 04.04 - NaN input - returned # time=6.574ms
    
    # Subtest: 04.05 - no input - returned undefined
        ok 1 - 04.05
        1..1
    ok 12 - 04.05 - no input - returned undefined # time=1.89ms
    
    # Subtest: 05.01 - fixes mixed case three and six digit hexes
        ok 1 - 05.01
        1..1
    ok 13 - 05.01 - fixes mixed case three and six digit hexes # time=2.093ms
    
    # Subtest: 06.01 - does not mutate the input args
        ok 1 - (unnamed test)
        ok 2 - 06.01.02
        1..2
    ok 14 - 06.01 - does not mutate the input args # time=2.336ms
    
    # Subtest: 07.01 - does not remove closing slashes from XHTML, #1
        ok 1 - 07.01
        1..1
    ok 15 - 07.01 - does not remove closing slashes from XHTML, #1 # time=1.586ms
    
    # Subtest: 07.02 - does not remove closing slashes from XHTML, #2
        ok 1 - 07.02
        1..1
    ok 16 - 07.02 - does not remove closing slashes from XHTML, #2 # time=1.488ms
    
    # Subtest: 07.03 - does not mangle encoded HTML entities that look like hex codes
        ok 1 - 07.03
        1..1
    ok 17 - 07.03 - does not mangle encoded HTML entities that look like hex codes # time=1.473ms
    
    1..17
    # time=232.912ms
ok 1 - test/test.js # time=232.912ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=7.165ms
    
    1..1
    # time=13.244ms
ok 2 - test/umd-test.js # time=13.244ms

1..2
# time=4723.795ms
