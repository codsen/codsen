TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - empty string
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 1 - 01.01 - empty string # time=17.247ms
    
    # Subtest: 01.02 - indexes outside of the reference string
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        ok 4 - 01.02.04
        ok 5 - 01.02.05
        ok 6 - 01.02.06
        ok 7 - 01.02.07
        ok 8 - 01.02.08
        ok 9 - expected to throw
        ok 10 - expected to throw
        ok 11 - expected to throw
        ok 12 - expected to throw
        ok 13 - 01.02.13
        ok 14 - 01.02.14
        ok 15 - 01.02.15
        ok 16 - 01.02.16
        1..16
    ok 2 - 01.02 - indexes outside of the reference string # time=25.516ms
    
    # Subtest: 01.03 - negative indexes are ignored
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        ok 4 - 01.03.04
        1..4
    ok 3 - 01.03 - negative indexes are ignored # time=10.193ms
    
    # Subtest: 01.04 - opts is not a plain object
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 4 - 01.04 - opts is not a plain object # time=3.499ms
    
    # Subtest: 01.05 - missing input args
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        1..4
    ok 5 - 01.05 - missing input args # time=5.223ms
    
    # Subtest: 02.01 - two astral characters offsetting the rest
        ok 1 - 02.01.01 - all unique
        ok 2 - 02.01.01.02
        ok 3 - 02.01.02 - with dupes
        ok 4 - 02.01.02.02
        ok 5 - 02.01.03.01 - all unique, sorted
        ok 6 - 02.01.03.02
        ok 7 - 02.01.04.01 - all unique, mixed up
        ok 8 - 02.01.04.02
        ok 9 - 02.01.04.03
        ok 10 - expected to throw
        ok 11 - expected to throw
        ok 12 - 02.01.06.01 - you don't want such case, notice how fourth index in source, 3 gets left untouched now
        ok 13 - 02.01.06.02
        1..13
    ok 6 - 02.01 - two astral characters offsetting the rest # time=78.506ms
    
    # Subtest: 02.02 - a stray astral surrogate without second counterpart counts as symbol
        ok 1 - 02.02
        1..1
    ok 7 - 02.02 - a stray astral surrogate without second counterpart counts as symbol # time=4.712ms
    
    # Subtest: 02.03 - one letter string
        ok 1 - 02.03.01
        ok 2 - 02.03.02
        1..2
    ok 8 - 02.03 - one letter string # time=6.258ms
    
    # Subtest: 02.04 - single astral symbol
        ok 1 - 02.04.01
        ok 2 - 02.04.02
        ok 3 - 02.04.03
        ok 4 - 02.04.03
        ok 5 - expected to throw
        ok 6 - 02.04.02
        ok 7 - expected to throw
        1..7
    ok 9 - 02.04 - single astral symbol # time=6.098ms
    
    # Subtest: 02.05 - multiple consecutive astral symbols
        ok 1 - 02.05.01
        ok 2 - 02.05.02
        ok 3 - 02.05.03
        ok 4 - 02.05.04
        1..4
    ok 10 - 02.05 - multiple consecutive astral symbols # time=4.73ms
    
    1..10
    # time=231ms
ok 1 - test/test.js # time=231ms

1..1
# time=3303.712ms
