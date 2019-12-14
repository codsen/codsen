TAP version 13
# Subtest: test.js
    # Subtest: generates the homepage with correct folders
        ok 1 - should be equivalent
        1..1
    ok 1 - generates the homepage with correct folders # time=1032.91ms
    
    # Subtest: unused flags are OK
        ok 1 - should be equivalent
        1..1
    ok 2 - unused flags are OK # time=594.957ms
    
    # Subtest: empty input
        ok 1 - should be equal
        ok 2 - should match pattern provided
        1..2
    ok 3 - empty input # time=1194.308ms
    
    # Subtest: too many directories given
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        1..3
    ok 4 - too many directories given # time=1823.988ms
    
    # Subtest: help and version flags work
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        1..2
    ok 5 - help and version flags work # time=1168.251ms
    
    1..5
    # time=5826.133ms
ok 1 - test.js # time=5826.133ms

1..1
# time=7865.82ms
