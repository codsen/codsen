TAP version 13
ok 1 - test/test.js # time=139.883ms {
    # Subtest: 00.01 - first input argument is missing
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect truthy value
        1..8
    ok 1 - 00.01 - first input argument is missing # time=11.765ms
    
    # Subtest: 00.02 - first input argument is not a regex
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 2 - 00.02 - first input argument is not a regex # time=3.23ms
    
    # Subtest: 00.03 - second input argument is missing
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 3 - 00.03 - second input argument is missing # time=2.465ms
    
    # Subtest: 00.04 - second input argument is not string
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 4 - 00.04 - second input argument is not string # time=1.922ms
    
    # Subtest: 01.01 - crops out few ranges outside the strlen
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        ok 4 - 01.01.04 - empty string is omitted by defa
        1..4
    ok 5 - 01.01 - crops out few ranges outside the strlen # time=12.786ms
    
    # Subtest: 01.02 - nothing found
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        1..3
    ok 6 - 01.02 - nothing found # time=7.679ms
    
    # Subtest: 01.03 - result ranges are consecutive so their ranges are merged into one
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        1..2
    ok 7 - 01.03 - result ranges are consecutive so their ranges are merged into one # time=3.905ms
    
    # Subtest: 01.04 - no findings - returns null
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        1..2
    ok 8 - 01.04 - no findings - returns null # time=1.778ms
    
    1..8
    # time=139.883ms
}

1..1
# time=3110.284ms
