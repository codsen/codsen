TAP version 13
ok 1 - test/test.js # time=262.032ms {
    # Subtest: 00.01 - not array
        ok 1 - expected to throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        1..6
    ok 1 - 00.01 - not array # time=14.939ms
    
    # Subtest: 00.02 - not two arguments in one of ranges
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        ok 6 - expected to not throw
        ok 7 - expected to not throw
        ok 8 - expected to not throw
        ok 9 - expected to not throw
        ok 10 - expected to not throw
        ok 11 - expected to not throw
        1..11
    ok 2 - 00.02 - not two arguments in one of ranges # time=13.02ms
    
    # Subtest: 00.03 - some/all range indexes are not natural numbers
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        ok 7 - expected to throw
        ok 8 - expected to throw
        1..8
    ok 3 - 00.03 - some/all range indexes are not natural numbers # time=5.027ms
    
    # Subtest: 00.04 - second arg, strLen is wrong
        ok 1 - expected to not throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 4 - 00.04 - second arg, strLen is wrong # time=2.24ms
    
    # Subtest: 00.05 - zero-length ranges array
        ok 1 - expected to not throw
        1..1
    ok 5 - 00.05 - zero-length ranges array # time=1.059ms
    
    # Subtest: 01.01 - [33mone range[39m - reference string covers the range
        ok 1 - 01.01.01 - we mean what we intended
        ok 2 - 01.01.02 - chunk before is correct
        ok 3 - 01.01.03 - chunk after is correct
        ok 4 - 01.01.04 - all pieces add up
        ok 5 - 01.01
        1..5
    ok 6 - 01.01 - [33mone range[39m - reference string covers the range # time=5.345ms
    
    # Subtest: 01.02 - [33mone range[39m - is one too short
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        1..2
    ok 7 - 01.02 - [33mone range[39m - is one too short # time=2.143ms
    
    # Subtest: 01.03 - [33mone range[39m - same element range invert
        ok 1 - 01.03.01 - yields everything
        ok 2 - 01.03.02
        1..2
    ok 8 - 01.03 - [33mone range[39m - same element range invert # time=2.086ms
    
    # Subtest: 01.04 - [35mtwo ranges[39m - reference string covers the ranges
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.04 - all pieces add up
        ok 4 - 01.04.05
        1..4
    ok 9 - 01.04 - [35mtwo ranges[39m - reference string covers the ranges # time=2.75ms
    
    # Subtest: 01.05 - [35mtwo ranges[39m - ranges touch each other
        ok 1 - 01.05.01 - ranges with deltas of two indexes
        ok 2 - 01.05.02 - ranges with deltas of one index
        ok 3 - 01.05.03 - ranges with deltas of one index
        ok 4 - 01.05.04 - ranges with deltas of one index
        ok 5 - 01.05.05 - ranges with deltas of one index
        ok 6 - 01.05.06 - ranges with deltas of two indexes
        ok 7 - 01.05.07 - ranges with deltas of one index
        ok 8 - 01.05.08 - ranges with deltas of one index
        ok 9 - 01.05.09 - ranges with deltas of one index
        ok 10 - 01.05.10 - ranges with deltas of one index
        1..10
    ok 10 - 01.05 - [35mtwo ranges[39m - ranges touch each other # time=7.822ms
    
    # Subtest: 01.06 - [35mtwo ranges[39m - input was given not merged
        ok 1 - 01.06.01 - starts at zero
        ok 2 - 01.06.01 - does not start at zero
        ok 3 - 01.06.02 - does not start at zero
        ok 4 - expected to throw
        1..4
    ok 11 - 01.06 - [35mtwo ranges[39m - input was given not merged # time=3.094ms
    
    # Subtest: 01.07 - [35mtwo ranges[39m - third argument present
        ok 1 - 01.07
        1..1
    ok 12 - 01.07 - [35mtwo ranges[39m - third argument present # time=4.781ms
    
    # Subtest: 01.08 - [32mnull instead of ranges[39m
        ok 1 - 01.08.01
        ok 2 - 01.08.02
        1..2
    ok 13 - 01.08 - [32mnull instead of ranges[39m # time=1.799ms
    
    # Subtest: 01.09 - [35mad hoc[39m - range to invert is far outside #1
        ok 1 - 01.09
        1..1
    ok 14 - 01.09 - [35mad hoc[39m - range to invert is far outside #1 # time=1.337ms
    
    # Subtest: 01.10 - [35mad hoc[39m - ranges to invert is far outside #2
        ok 1 - 01.10
        1..1
    ok 15 - 01.10 - [35mad hoc[39m - ranges to invert is far outside #2 # time=1.729ms
    
    # Subtest: 01.11 - [35mad hoc[39m - ranges to invert is far outside #3
        ok 1 - 01.11
        1..1
    ok 16 - 01.11 - [35mad hoc[39m - ranges to invert is far outside #3 # time=1.407ms
    
    1..16
    # time=262.032ms
}

1..1
# time=2947.635ms
