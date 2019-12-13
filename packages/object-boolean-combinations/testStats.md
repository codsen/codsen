TAP version 13
ok 1 - test/test.js # time=184.785ms {
    # Subtest: 01.01 - one property - 1, no override
        ok 1 - 01.01
        1..1
    ok 1 - 01.01 - one property - 1, no override # time=19.628ms
    
    # Subtest: 01.02 - one property - 0, no override
        ok 1 - 01.02
        1..1
    ok 2 - 01.02 - one property - 0, no override # time=6.092ms
    
    # Subtest: 01.03 - three properties, no override
        ok 1 - 01.03
        1..1
    ok 3 - 01.03 - three properties, no override # time=3.56ms
    
    # Subtest: 02.04 - three properties 2 overrides
        ok 1 - 02.04.01
        ok 2 - 02.04.02 - override key values are strings
        1..2
    ok 4 - 02.04 - three properties 2 overrides # time=4.399ms
    
    # Subtest: 02.05 - four properties three overrides
        ok 1 - 02.05
        1..1
    ok 5 - 02.05 - four properties three overrides # time=2.154ms
    
    # Subtest: 02.06 - empty override object
        ok 1 - 02.06
        1..1
    ok 6 - 02.06 - empty override object # time=2.578ms
    
    # Subtest: 02.07 - both input and override objects empty
        ok 1 - 02.07
        1..1
    ok 7 - 02.07 - both input and override objects empty # time=1.745ms
    
    # Subtest: 03.01 - both inputs missing - throws
        ok 1 - expected to throw
        1..1
    ok 8 - 03.01 - both inputs missing - throws # time=1.533ms
    
    # Subtest: 03.02 - first input is not an object - throws
        ok 1 - expected to throw
        1..1
    ok 9 - 03.02 - first input is not an object - throws # time=1.142ms
    
    # Subtest: 03.03 - second input is not an object - throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 10 - 03.03 - second input is not an object - throws # time=1.73ms
    
    # Subtest: 03.04 - non-boolean object overrides - throws
        ok 1 - 03.04
        1..1
    ok 11 - 03.04 - non-boolean object overrides - throws # time=1.853ms
    
    1..11
    # time=184.785ms
}

1..1
# time=3251.941ms
