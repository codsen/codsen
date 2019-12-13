TAP version 13
ok 1 - test/test.js # time=123.084ms {
    # Subtest: 1.1 - inputs missing - returns false
        ok 1 - 1.1
        1..1
    ok 1 - 1.1 - inputs missing - returns false # time=8.209ms
    
    # Subtest: 2.1 - Array
        ok 1 - 2.1.1
        ok 2 - 2.1.2
        1..2
    ok 2 - 2.1 - Array # time=1.886ms
    
    # Subtest: 2.2 - Plain object
        ok 1 - 2.2.1
        ok 2 - 2.2.2
        1..2
    ok 3 - 2.2 - Plain object # time=1.797ms
    
    # Subtest: 2.3 - String
        ok 1 - 2.3.1
        ok 2 - 2.3.2
        1..2
    ok 4 - 2.3 - String # time=1.361ms
    
    # Subtest: 2.4 - null
        ok 1 - 2.4
        1..1
    ok 5 - 2.4 - null # time=1.029ms
    
    # Subtest: 2.5 - hardcoded "undefined" - same as missing input
        ok 1 - 2.5
        1..1
    ok 6 - 2.5 - hardcoded "undefined" - same as missing input # time=1.048ms
    
    # Subtest: 2.5 - boolean - still empty (!)
        ok 1 - 2.5.1
        ok 2 - 2.5.2
        1..2
    ok 7 - 2.5 - boolean - still empty (!) # time=1.959ms
    
    # Subtest: 2.6 - function - still empty, no matter what's returned (!)
        ok 1 - 2.6
        1..1
    ok 8 - 2.6 - function - still empty, no matter what's returned (!) # time=1.126ms
    
    # Subtest: 2.7 - Number
        ok 1 - 2.7.1
        ok 2 - 2.7.2
        1..2
    ok 9 - 2.7 - Number # time=1.144ms
    
    1..9
    # time=123.084ms
}

1..1
# time=2361.089ms
