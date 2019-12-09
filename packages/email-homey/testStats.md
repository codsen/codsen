TAP version 13
# Subtest: test.js
    # Subtest: generates the homepage with correct folders
        ok 1 - should be equivalent
        1..1
    ok 1 - generates the homepage with correct folders # time=1059.489ms
    
    # Subtest: unused flags are OK
        ok 1 - should be equivalent
        1..1
    ok 2 - unused flags are OK # time=632.623ms
    
    # Subtest: empty input
        ok 1 - should be equal
        ok 2 - should match pattern provided
        1..2
    ok 3 - empty input # time=1182.88ms
    
    # Subtest: too many directories given
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        1..3
    ok 4 - too many directories given # time=1875.053ms
    
    # Subtest: help and version flags work
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        1..2
    ok 5 - help and version flags work # time=1206.597ms
    
    1..5
    # time=5973.338ms
ok 1 - test.js # time=5973.338ms

1..1
# time=8050.764ms
