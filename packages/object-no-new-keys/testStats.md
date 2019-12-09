TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - first level keys
        ok 1 - 01.01
        1..1
    ok 1 - 01.01 - first level keys # time=14.738ms
    
    # Subtest: 01.02 - two level object
        ok 1 - 01.02
        1..1
    ok 2 - 01.02 - two level object # time=3.795ms
    
    # Subtest: 01.03 - object does not even exist on a reference
        ok 1 - 01.03
        1..1
    ok 3 - 01.03 - object does not even exist on a reference # time=21.949ms
    
    # Subtest: 01.04 - same as 01.03 but deeper levels
        ok 1 - 01.04
        1..1
    ok 4 - 01.04 - same as 01.03 but deeper levels # time=11.682ms
    
    # Subtest: 02.01 - objects within arrays
        ok 1 - 02.01.01 - basic
        ok 2 - 02.01.02 - proper
        ok 3 - 02.01.03 - array in the reference has lesser number of elements (default, MODE #2)
        ok 4 - 02.01.04 - MODE #1 - array in the reference has lesser number of elements
        ok 5 - 02.01.05 - same as #4, but with mode identifier as string
        1..5
    ok 5 - 02.01 - objects within arrays # time=7.864ms
    
    # Subtest: 02.02 - other cases
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        1..3
    ok 6 - 02.02 - other cases # time=4.333ms
    
    # Subtest: 03.01 - array vs ..., can be inner recursion situation
        ok 1 - 03.01.01 - array vs undefined
        ok 2 - 03.01.02 - array vs string
        ok 3 - 03.01.03 - array vs plain object
        ok 4 - 02.02.04
        1..4
    ok 7 - 03.01 - array vs ..., can be inner recursion situation # time=4.892ms
    
    # Subtest: 03.02 - plain object vs ..., can be inner recursion situation
        ok 1 - 03.02.01 - object vs undefined
        ok 2 - 03.02.02 - object vs array
        1..2
    ok 8 - 03.02 - plain object vs ..., can be inner recursion situation # time=3.136ms
    
    # Subtest: 03.03 - more complex plain object vs ...
        ok 1 - 03.03.01 - vs undefined (deeper levels won't be traversed if parents are not matching)
        ok 2 - 03.03.02 - vs empty object
        1..2
    ok 9 - 03.03 - more complex plain object vs ... # time=3.061ms
    
    # Subtest: 03.04 - more complex plain object vs ...
        ok 1 - 03.04
        1..1
    ok 10 - 03.04 - more complex plain object vs ... # time=2.856ms
    
    # Subtest: 04.01 - mode.opts customised to a wrong type - throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 11 - 04.01 - mode.opts customised to a wrong type - throws # time=3.668ms
    
    # Subtest: 04.02 - mode is given as integer - throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 12 - 04.02 - mode is given as integer - throws # time=3.363ms
    
    1..12
    # time=280.641ms
ok 1 - test/test.js # time=280.641ms

1..1
# time=2734.586ms
