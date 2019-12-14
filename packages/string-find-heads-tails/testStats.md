TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - throws when there's no input
        ok 1 - expected to throw
        ok 2 - expect truthy value
        1..2
    ok 1 - 01.01 - throws when there's no input # time=9.064ms
    
    # Subtest: 01.02 - throws when the first argument, source string, is not a string
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expect truthy value
        ok 4 - expect truthy value
        1..4
    ok 2 - 01.02 - throws when the first argument, source string, is not a string # time=4.071ms
    
    # Subtest: 01.03 - throws when the second argument, heads, is not a string
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect truthy value
        ok 9 - expected to throw
        ok 10 - expect truthy value
        ok 11 - expected to throw
        ok 12 - expect truthy value
        ok 13 - expected to throw
        ok 14 - expect truthy value
        ok 15 - expected to throw
        ok 16 - expect truthy value
        ok 17 - expected to throw
        ok 18 - expect truthy value
        1..18
    ok 3 - 01.03 - throws when the second argument, heads, is not a string # time=10.42ms
    
    # Subtest: 01.04 - throws when the third argument, tails, is not a string
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect truthy value
        ok 9 - expected to throw
        ok 10 - expect truthy value
        ok 11 - expected to throw
        ok 12 - expect truthy value
        ok 13 - expected to throw
        ok 14 - expect truthy value
        ok 15 - expected to throw
        ok 16 - expect truthy value
        ok 17 - expected to throw
        ok 18 - expect truthy value
        1..18
    ok 4 - 01.04 - throws when the third argument, tails, is not a string # time=9.793ms
    
    # Subtest: 01.05 - throws when the fourth argument, opts, is of a wrong type
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        ok 6 - expected to not throw
        ok 7 - expected to throw
        ok 8 - expect truthy value
        ok 9 - expected to throw
        ok 10 - expect falsey value
        ok 11 - expect truthy value
        1..11
    ok 5 - 01.05 - throws when the fourth argument, opts, is of a wrong type # time=9.831ms
    
    # Subtest: 01.06 - unmatched heads and tails
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect truthy value
        ok 9 - expected to throw
        ok 10 - expect falsey value
        ok 11 - expect truthy value
        ok 12 - expected to throw
        ok 13 - expect truthy value
        ok 14 - expected to throw
        ok 15 - expect falsey value
        ok 16 - expect truthy value
        ok 17 - expected to throw
        ok 18 - expect truthy value
        ok 19 - expected to not throw
        1..19
    ok 6 - 01.06 - unmatched heads and tails # time=10.72ms
    
    # Subtest: 01.07 - both heads and tails found but wrong order
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect truthy value
        ok 9 - expected to throw
        ok 10 - expect falsey value
        ok 11 - expect truthy value
        ok 12 - expected to throw
        ok 13 - expect truthy value
        ok 14 - expected to throw
        ok 15 - expect truthy value
        1..15
    ok 7 - 01.07 - both heads and tails found but wrong order # time=9.006ms
    
    # Subtest: 01.08 - heads of one type, tails of another
        ok 1 - 01.08 - default behaviour - not strict pair matching
        ok 2 - expected to throw
        ok 3 - expect truthy value
        ok 4 - expected to throw
        ok 5 - expect falsey value
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect truthy value
        1..8
    ok 8 - 01.08 - heads of one type, tails of another # time=8.001ms
    
    # Subtest: 01.09 - sequences are treated correctly by opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder
        ok 1 - 01.09.01 - default behaviour - no strict pair matching
        ok 2 - 01.09.02 - strict pair matching
        ok 3 - 01.09.03 - strict pair matching
        1..3
    ok 9 - 01.09 - sequences are treated correctly by opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder # time=8.236ms
    
    # Subtest: 02.01 - single char markers
        ok 1 - 02.01.01 - easies
        ok 2 - 02.01.02 - tight
        1..2
    ok 10 - 02.01 - single char markers # time=2.457ms
    
    # Subtest: 02.02 - multi-char markers
        ok 1 - 02.02.01
        ok 2 - expected to throw
        ok 3 - expect truthy value
        ok 4 - 02.02.02 - offset meant we started beyond first heads, so no tails were accepted
        ok 5 - 02.02.03
        ok 6 - 02.02.04
        1..6
    ok 11 - 02.02 - multi-char markers # time=13.595ms
    
    # Subtest: 02.03 - sneaky "casual" underscores try to blend in with legit heads/tails
        ok 1 - 02.03
        1..1
    ok 12 - 02.03 - sneaky "casual" underscores try to blend in with legit heads/tails # time=1.705ms
    
    # Subtest: 02.04 - sneaky tails precede heads
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - 02.04.02
        1..3
    ok 13 - 02.04 - sneaky tails precede heads # time=8.674ms
    
    # Subtest: 02.05 - arrays of heads and tails
        ok 1 - 02.05
        1..1
    ok 14 - 02.05 - arrays of heads and tails # time=7.526ms
    
    # Subtest: 02.06 - input is equal to heads or tails
        ok 1 - 02.06.01
        ok 2 - 02.06.02
        ok 3 - 02.06.03
        ok 4 - 02.06.04
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect falsey value
        ok 9 - expect truthy value
        ok 10 - expected to throw
        ok 11 - expect truthy value
        ok 12 - expected to throw
        ok 13 - expect truthy value
        ok 14 - expected to throw
        ok 15 - expect falsey value
        ok 16 - expect truthy value
        1..16
    ok 15 - 02.06 - input is equal to heads or tails # time=19.659ms
    
    # Subtest: 02.07 - more clashing with outside characters
        ok 1 - 02.07.01
        ok 2 - 02.07.02
        1..2
    ok 16 - 02.07 - more clashing with outside characters # time=4.256ms
    
    # Subtest: 03.01 - opts.relaxedAPI - input string
        ok 1 - 03.01.01
        ok 2 - 03.01.02
        ok 3 - 03.01.03
        1..3
    ok 17 - 03.01 - opts.relaxedAPI - input string # time=2.538ms
    
    # Subtest: 03.02 - opts.relaxedAPI - heads
        ok 1 - 03.02.01
        ok 2 - 03.02.02
        ok 3 - 03.02.03
        ok 4 - 03.02.04
        ok 5 - 03.02.05
        ok 6 - 03.02.06
        ok 7 - 03.02.07
        1..7
    ok 18 - 03.02 - opts.relaxedAPI - heads # time=5.385ms
    
    # Subtest: 03.03 - opts.relaxedAPI - tails
        ok 1 - 03.03.01
        ok 2 - 03.03.02
        ok 3 - 03.03.03
        ok 4 - 03.03.04
        ok 5 - 03.03.05
        ok 6 - 03.03.06
        1..6
    ok 19 - 03.03 - opts.relaxedAPI - tails # time=3.981ms
    
    1..19
    # time=264.094ms
ok 1 - test/test.js # time=264.094ms

1..1
# time=3020.769ms
