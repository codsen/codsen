TAP version 13
ok 1 - test/test.js # time=170.572ms {
    # Subtest: 1.1 - no glob
        ok 1 - 1.1
        1..1
    ok 1 - 1.1 - no glob # time=12.405ms
    
    # Subtest: 1.2 - won't find
        ok 1 - 1.2
        1..1
    ok 2 - 1.2 - won't find # time=2.667ms
    
    # Subtest: 1.3 - empty source array
        ok 1 - 1.3
        1..1
    ok 3 - 1.3 - empty source array # time=1.321ms
    
    # Subtest: 1.4 - empty source array
        ok 1 - 1.4
        1..1
    ok 4 - 1.4 - empty source array # time=0.775ms
    
    # Subtest: 1.5 - no glob, deletes last remaining thing
        ok 1 - 1.5
        1..1
    ok 5 - 1.5 - no glob, deletes last remaining thing # time=1.636ms
    
    # Subtest: 1.6 - no glob, case sensitive
        ok 1 - 1.6.1 - default
        ok 2 - 1.6.2 - opts.caseSensitive
        1..2
    ok 6 - 1.6 - no glob, case sensitive # time=2.332ms
    
    # Subtest: 2.1 - glob, normal use
        ok 1 - 2.1.1
        ok 2 - 2.1.2
        ok 3 - 2.1.3
        1..3
    ok 7 - 2.1 - glob, normal use # time=4.997ms
    
    # Subtest: 2.2 - asterisk the only input - pulls everything
        ok 1 - 2.2.1
        ok 2 - 2.2.2
        1..2
    ok 8 - 2.2 - asterisk the only input - pulls everything # time=2.221ms
    
    # Subtest: 2.3 - asterisk in the source array
        ok 1 - 2.3
        1..1
    ok 9 - 2.3 - asterisk in the source array # time=1.596ms
    
    # Subtest: 2.4 - empty arrays as inputs
        ok 1 - 2.4
        1..1
    ok 10 - 2.4 - empty arrays as inputs # time=0.967ms
    
    # Subtest: 2.5 - empty array as second arg
        ok 1 - 2.5
        1..1
    ok 11 - 2.5 - empty array as second arg # time=0.946ms
    
    # Subtest: 2.6 - pulls normal words in various ways
        ok 1 - 2.6.1
        ok 2 - 2.6.2
        ok 3 - 2.6.3
        ok 4 - 2.6.4
        ok 5 - 2.6.5
        ok 6 - 2.6.6
        1..6
    ok 12 - 2.6 - pulls normal words in various ways # time=6.691ms
    
    # Subtest: 3.1 - missing one input - throws
        ok 1 - expected to throw
        1..1
    ok 13 - 3.1 - missing one input - throws # time=1.206ms
    
    # Subtest: 3.2 - missing both inputs - throws
        ok 1 - expected to throw
        1..1
    ok 14 - 3.2 - missing both inputs - throws # time=0.798ms
    
    # Subtest: 3.3 - against asterisk
        ok 1 - 3.3
        ok 2 - expected to throw
        1..2
    ok 15 - 3.3 - against asterisk # time=1.349ms
    
    # Subtest: 3.4 - against emoji and asterisk
        ok 1 - 3.4
        ok 2 - expected to throw
        1..2
    ok 16 - 3.4 - against emoji and asterisk # time=1.749ms
    
    # Subtest: 3.5 - wrong inputs - throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        1..6
    ok 17 - 3.5 - wrong inputs - throws # time=2.04ms
    
    # Subtest: 3.6 - missing one input - throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        ok 6 - expected to throw
        1..6
    ok 18 - 3.6 - missing one input - throws # time=3.236ms
    
    # Subtest: 3.7 - 1st arg, "originalInput" is an empty array
        ok 1 - 3.7.1
        ok 2 - 3.7.2
        ok 3 - 3.7.3
        1..3
    ok 19 - 3.7 - 1st arg, "originalInput" is an empty array # time=0.95ms
    
    # Subtest: 3.8 - 2nd arg, "originalToBeRemoved" is an empty string
        ok 1 - 3.8.1
        1..1
    ok 20 - 3.8 - 2nd arg, "originalToBeRemoved" is an empty string # time=0.625ms
    
    # Subtest: 4.1 - does not mutate the input args
        ok 1 - (unnamed test)
        ok 2 - (unnamed test)
        ok 3 - 4.1.1
        ok 4 - 4.1.2
        ok 5 - 4.1.3
        1..5
    ok 21 - 4.1 - does not mutate the input args # time=3.932ms
    
    1..21
    # time=170.572ms
}

ok 2 - test/umd-test.js # time=16.809ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=12.034ms
    
    1..1
    # time=16.809ms
}

1..2
# time=1439.03ms
