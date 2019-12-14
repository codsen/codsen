TAP version 13
# Subtest: test/test.js
    # Subtest: 1.1 - three elements
        ok 1 - 1.1.1
        ok 2 - 1.1.2
        ok 3 - 1.1.3
        ok 4 - 1.1.4
        1..4
    ok 1 - 1.1 - three elements # time=21.192ms
    
    # Subtest: 1.2 - opts.dedupe
        ok 1 - 1.2.1
        ok 2 - 1.2.2
        1..2
    ok 2 - 1.2 - opts.dedupe # time=4.763ms
    
    # Subtest: 1.3 - throws
        ok 1 - expected to throw
        1..1
    ok 3 - 1.3 - throws # time=15.454ms
    
    # Subtest: 1.4 - empty input ends the operation quick
        ok 1 - 1.4.1
        ok 2 - 1.4.2
        1..2
    ok 4 - 1.4 - empty input ends the operation quick # time=17.474ms
    
    1..4
    # time=133.104ms
ok 1 - test/test.js # time=133.104ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=17.562ms
    
    1..1
    # time=23.747ms
ok 2 - test/umd-test.js # time=23.747ms

1..2
# time=6223.213ms
