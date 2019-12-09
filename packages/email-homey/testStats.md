TAP version 13
ok 1 - test.js # time=6550.008ms {
    # Subtest: generates the homepage with correct folders
        ok 1 - should be equivalent
        1..1
    ok 1 - generates the homepage with correct folders # time=1242.075ms
    
    # Subtest: unused flags are OK
        ok 1 - should be equivalent
        1..1
    ok 2 - unused flags are OK # time=820.39ms
    
    # Subtest: empty input
        ok 1 - should be equal
        ok 2 - should match pattern provided
        1..2
    ok 3 - empty input # time=1470.786ms
    
    # Subtest: too many directories given
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        1..3
    ok 4 - too many directories given # time=1821.05ms
    
    # Subtest: help and version flags work
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        1..2
    ok 5 - help and version flags work # time=1188.2ms
    
    1..5
    # time=6550.008ms
}

1..1
# time=8724.755ms
