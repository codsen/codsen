TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - one property - 1, no override
        ok 1 - 01.01
        1..1
    ok 1 - 01.01 - one property - 1, no override # time=10.165ms
    
    # Subtest: 01.02 - one property - 0, no override
        ok 1 - 01.02
        1..1
    ok 2 - 01.02 - one property - 0, no override # time=2.684ms
    
    # Subtest: 01.03 - three properties, no override
        ok 1 - 01.03
        1..1
    ok 3 - 01.03 - three properties, no override # time=2.971ms
    
    # Subtest: 02.04 - three properties 2 overrides
        ok 1 - 02.04.01
        ok 2 - 02.04.02 - override key values are strings
        1..2
    ok 4 - 02.04 - three properties 2 overrides # time=3.833ms
    
    # Subtest: 02.05 - four properties three overrides
        ok 1 - 02.05
        1..1
    ok 5 - 02.05 - four properties three overrides # time=12.968ms
    
    # Subtest: 02.06 - empty override object
        ok 1 - 02.06
        1..1
    ok 6 - 02.06 - empty override object # time=6.115ms
    
    # Subtest: 02.07 - both input and override objects empty
        ok 1 - 02.07
        1..1
    ok 7 - 02.07 - both input and override objects empty # time=2.196ms
    
    # Subtest: 03.01 - both inputs missing - throws
        ok 1 - expected to throw
        1..1
    ok 8 - 03.01 - both inputs missing - throws # time=2.297ms
    
    # Subtest: 03.02 - first input is not an object - throws
        ok 1 - expected to throw
        1..1
    ok 9 - 03.02 - first input is not an object - throws # time=1.486ms
    
    # Subtest: 03.03 - second input is not an object - throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 10 - 03.03 - second input is not an object - throws # time=2.109ms
    
    # Subtest: 03.04 - non-boolean object overrides - throws
        ok 1 - 03.04
        1..1
    ok 11 - 03.04 - non-boolean object overrides - throws # time=1.932ms
    
    1..11
    # time=194.331ms
ok 1 - test/test.js # time=194.331ms

1..1
# time=2352.763ms
