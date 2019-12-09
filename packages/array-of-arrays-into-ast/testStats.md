TAP version 13
# Subtest: test/test.js
    # Subtest: 1.1 - three elements
        ok 1 - 1.1.1
        ok 2 - 1.1.2
        ok 3 - 1.1.3
        ok 4 - 1.1.4
        1..4
    ok 1 - 1.1 - three elements # time=22.132ms
    
    # Subtest: 1.2 - opts.dedupe
        ok 1 - 1.2.1
        ok 2 - 1.2.2
        1..2
    ok 2 - 1.2 - opts.dedupe # time=5.161ms
    
    # Subtest: 1.3 - throws
        ok 1 - expected to throw
        1..1
    ok 3 - 1.3 - throws # time=2.733ms
    
    # Subtest: 1.4 - empty input ends the operation quick
        ok 1 - 1.4.1
        ok 2 - 1.4.2
        1..2
    ok 4 - 1.4 - empty input ends the operation quick # time=13.441ms
    
    1..4
    # time=153.925ms
ok 1 - test/test.js # time=153.925ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=21.735ms
    
    1..1
    # time=30.517ms
ok 2 - test/umd-test.js # time=30.517ms

1..2
# time=6316.687ms
