TAP version 13
ok 1 - test/test.js # time=109.538ms {
    # Subtest: 1.1 - three elements
        ok 1 - 1.1.1
        ok 2 - 1.1.2
        ok 3 - 1.1.3
        ok 4 - 1.1.4
        1..4
    ok 1 - 1.1 - three elements # time=41.925ms
    
    # Subtest: 1.2 - opts.dedupe
        ok 1 - 1.2.1
        ok 2 - 1.2.2
        1..2
    ok 2 - 1.2 - opts.dedupe # time=11.268ms
    
    # Subtest: 1.3 - throws
        ok 1 - expected to throw
        1..1
    ok 3 - 1.3 - throws # time=4.075ms
    
    # Subtest: 1.4 - empty input ends the operation quick
        ok 1 - 1.4.1
        ok 2 - 1.4.2
        1..2
    ok 4 - 1.4 - empty input ends the operation quick # time=2.553ms
    
    1..4
    # time=109.538ms
}

ok 2 - test/umd-test.js # time=53.765ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=45.899ms
    
    1..1
    # time=53.765ms
}

1..2
# time=3218.324ms
