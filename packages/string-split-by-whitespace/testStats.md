TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - wrong/missing input = throw
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - 01.01.03
        ok 4 - 01.01.04
        ok 5 - 01.01.05
        1..5
    ok 1 - 01.01 - wrong/missing input = throw # time=12.1ms
    
    # Subtest: 01.02 - empty string as input
        ok 1 - 01.02
        1..1
    ok 2 - 01.02 - empty string as input # time=2.825ms
    
    # Subtest: 01.03 - opts contain non-array elements
        ok 1 - expected to throw
        1..1
    ok 3 - 01.03 - opts contain non-array elements # time=2.219ms
    
    # Subtest: 02.01 - splits two
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        ok 5 - 02.01.05
        ok 6 - 02.01.06
        ok 7 - 02.01.07
        ok 8 - 02.01.08
        ok 9 - 02.01.09
        1..9
    ok 4 - 02.01 - splits two # time=7.791ms
    
    # Subtest: 02.02 - single substring
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        ok 5 - 02.02.05
        ok 6 - 02.02.06
        1..6
    ok 5 - 02.02 - single substring # time=4.616ms
    
    # Subtest: 03.01 - opts.ignoreRanges offset the start
        ok 1 - 03.01.01
        1..1
    ok 6 - 03.01 - opts.ignoreRanges offset the start # time=12.749ms
    
    # Subtest: 03.02 - starts from the middle of a string
        ok 1 - 03.02.01
        1..1
    ok 7 - 03.02 - starts from the middle of a string # time=11.59ms
    
    # Subtest: 03.03 - in tandem with package "strFindHeadsTails" - ignores heads and tails
        ok 1 - 03.03.01
        1..1
    ok 8 - 03.03 - in tandem with package "strFindHeadsTails" - ignores heads and tails # time=4.568ms
    
    # Subtest: 03.04 - in tandem with package "strFindHeadsTails" - ignores whole variables
        ok 1 - 03.04
        1..1
    ok 9 - 03.04 - in tandem with package "strFindHeadsTails" - ignores whole variables # time=2.333ms
    
    1..9
    # time=199.348ms
ok 1 - test/test.js # time=199.348ms

1..1
# time=2552.108ms
