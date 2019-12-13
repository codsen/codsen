TAP version 13
ok 1 - test/test.js # time=721.601ms {
    # Subtest: 1.1 - both inputs missing
        ok 1 - 1.1
        1..1
    ok 1 - 1.1 - both inputs missing # time=7.687ms
    
    # Subtest: 1.2 - first input missing
        ok 1 - 1.2
        1..1
    ok 2 - 1.2 - first input missing # time=12.444ms
    
    # Subtest: 1.3 - second input missing
        ok 1 - 1.3
        1..1
    ok 3 - 1.3 - second input missing # time=5.277ms
    
    # Subtest: 1.4 - null as input
        ok 1 - 1.4
        1..1
    ok 4 - 1.4 - null as input # time=1.141ms
    
    # Subtest: 1.5 - falsey inputs
        ok 1 - 1.5
        1..1
    ok 5 - 1.5 - falsey inputs # time=1.112ms
    
    # Subtest: 1.6 - undefined in a second-level depth
        ok 1 - 1.6
        1..1
    ok 6 - 1.6 - undefined in a second-level depth # time=1.649ms
    
    # Subtest: 2.1 - simple plain objects
        ok 1 - 2.1
        1..1
    ok 7 - 2.1 - simple plain objects # time=1.301ms
    
    # Subtest: 2.2 - simple plain objects #2
        ok 1 - 2.2
        1..1
    ok 8 - 2.2 - simple plain objects #2 # time=1.096ms
    
    # Subtest: 2.3 - comparison against empty plain objects
        ok 1 - 2.3
        ok 2 - 2.3
        1..2
    ok 9 - 2.3 - comparison against empty plain objects # time=7.342ms
    
    # Subtest: 2.4 - comparing two empty plain objects
        ok 1 - 2.4
        1..1
    ok 10 - 2.4 - comparing two empty plain objects # time=0.961ms
    
    # Subtest: 2.5 - false match involving empty arrays, sneaky similarity
        ok 1 - 2.5
        ok 2 - 2.5
        ok 3 - 2.5
        1..3
    ok 11 - 2.5 - false match involving empty arrays, sneaky similarity # time=1.834ms
    
    # Subtest: 2.6 - simple plain arrays, integer, match
        ok 1 - 2.6
        1..1
    ok 12 - 2.6 - simple plain arrays, integer, match # time=0.996ms
    
    # Subtest: 2.7 - simple plain arrays, integer, no match
        ok 1 - 2.7
        1..1
    ok 13 - 2.7 - simple plain arrays, integer, no match # time=0.983ms
    
    # Subtest: 3.1 - simple nested plain objects
        ok 1 - 3.1
        1..1
    ok 14 - 3.1 - simple nested plain objects # time=1.024ms
    
    # Subtest: 3.2 - simple nested plain objects + array wrapper
        ok 1 - 3.2
        1..1
    ok 15 - 3.2 - simple nested plain objects + array wrapper # time=1.322ms
    
    # Subtest: 3.3 - simple nested plain objects, won't find
        ok 1 - 3.3
        1..1
    ok 16 - 3.3 - simple nested plain objects, won't find # time=1.246ms
    
    # Subtest: 3.4 - simple nested plain objects + array wrapper, won't find
        ok 1 - 3.4
        1..1
    ok 17 - 3.4 - simple nested plain objects + array wrapper, won't find # time=1.055ms
    
    # Subtest: 3.5 - obj, multiple nested levels, bigObj has more
        ok 1 - 3.5
        1..1
    ok 18 - 3.5 - obj, multiple nested levels, bigObj has more # time=1.306ms
    
    # Subtest: 3.6 - obj, multiple nested levels, equal
        ok 1 - 3.6
        1..1
    ok 19 - 3.6 - obj, multiple nested levels, equal # time=3.636ms
    
    # Subtest: 3.7 - obj, multiple nested levels, smallObj has more
        ok 1 - 3.7
        1..1
    ok 20 - 3.7 - obj, multiple nested levels, smallObj has more # time=1.276ms
    
    # Subtest: 4.1 - simple arrays with strings
        ok 1 - 4.1.1
        ok 2 - 4.1.2
        1..2
    ok 21 - 4.1 - simple arrays with strings # time=2.971ms
    
    # Subtest: 4.2 - simple arrays with plain objects
        ok 1 - 4.2.1
        ok 2 - 4.2.2
        1..2
    ok 22 - 4.2 - simple arrays with plain objects # time=1.614ms
    
    # Subtest: 4.3 - arrays, nested with strings and objects
        ok 1 - 4.3.1
        ok 2 - 4.3.2
        1..2
    ok 23 - 4.3 - arrays, nested with strings and objects # time=2.085ms
    
    # Subtest: 4.3 - comparing empty arrays (variations)
        ok 1 - 4.3.1
        ok 2 - 4.3.2
        ok 3 - 4.3.3
        ok 4 - 4.3.3
        1..4
    ok 24 - 4.3 - comparing empty arrays (variations) # time=1.96ms
    
    # Subtest: 5.1 - simple strings
        ok 1 - 5.1.1
        ok 2 - 5.1.2
        1..2
    ok 25 - 5.1 - simple strings # time=1.204ms
    
    # Subtest: 5.2 - strings compared and fails
        ok 1 - 5.2
        1..1
    ok 26 - 5.2 - strings compared and fails # time=0.879ms
    
    # Subtest: 5.3 - strings compared, positive
        ok 1 - 5.3
        1..1
    ok 27 - 5.3 - strings compared, positive # time=0.94ms
    
    # Subtest: 5.4 - strings compared, positive
        ok 1 - 5.4
        1..1
    ok 28 - 5.4 - strings compared, positive # time=2.87ms
    
    # Subtest: 6.1 - weird comparisons
        ok 1 - 6.1.1
        ok 2 - 6.1.2
        ok 3 - 6.1.3
        1..3
    ok 29 - 6.1 - weird comparisons # time=1.393ms
    
    # Subtest: 6.2 - real-life - won't find
        ok 1 - 6.2
        1..1
    ok 30 - 6.2 - real-life - won't find # time=1.05ms
    
    # Subtest: 6.3 - real-life - will find
        ok 1 - 6.3
        1..1
    ok 31 - 6.3 - real-life - will find # time=1.083ms
    
    # Subtest: 6.4 - from README
        ok 1 - 6.4
        1..1
    ok 32 - 6.4 - from README # time=1.579ms
    
    # Subtest: 6.5 - from real-life, precaution against false-positives
        ok 1 - 6.5
        1..1
    ok 33 - 6.5 - from real-life, precaution against false-positives # time=4.527ms
    
    # Subtest: 7.1 - simple plain objects #1
        ok 1 - 7.1.1
        ok 2 - 7.1.2
        ok 3 - 7.1.3
        ok 4 - 7.1.4
        ok 5 - 7.1.5
        1..5
    ok 34 - 7.1 - simple plain objects #1 # time=3.096ms
    
    # Subtest: 7.2 - simple plain objects #2
        ok 1 - 7.2.1
        ok 2 - 7.2.2
        ok 3 - 7.2.3
        1..3
    ok 35 - 7.2 - simple plain objects #2 # time=1.953ms
    
    # Subtest: 7.3 - simple plain objects #3
        ok 1 - 7.3
        1..1
    ok 36 - 7.3 - simple plain objects #3 # time=1.487ms
    
    # Subtest: 7.4 - simple plain objects #4
        ok 1 - 7.4
        1..1
    ok 37 - 7.4 - simple plain objects #4 # time=1.339ms
    
    # Subtest: 7.5 - simple plain objects #5
        ok 1 - 7.5
        1..1
    ok 38 - 7.5 - simple plain objects #5 # time=1.125ms
    
    # Subtest: 8.1 - simple nested plain objects - will find
        ok 1 - 8.1.1
        ok 2 - 8.1.2
        ok 3 - 8.1.3
        1..3
    ok 39 - 8.1 - simple nested plain objects - will find # time=10.184ms
    
    # Subtest: 8.2 - simple nested plain objects - won't find
        ok 1 - 8.2.1
        ok 2 - 8.2.2
        ok 3 - 8.2.3
        1..3
    ok 40 - 8.2 - simple nested plain objects - won't find # time=1.642ms
    
    # Subtest: 9.1 - Strings vs strings
        ok 1 - 9.1
        1..1
    ok 41 - 9.1 - Strings vs strings # time=0.902ms
    
    # Subtest: 9.2 - Comparing empty string to string
        ok 1 - 9.2
        1..1
    ok 42 - 9.2 - Comparing empty string to string # time=0.884ms
    
    # Subtest: 9.3 - Comparing string to empty string in an array
        ok 1 - 9.3
        1..1
    ok 43 - 9.3 - Comparing string to empty string in an array # time=0.884ms
    
    # Subtest: 9.4 - Comparing empty to empty string
        ok 1 - 9.4.1
        ok 2 - 9.4.2
        ok 3 - 9.4.3
        1..3
    ok 44 - 9.4 - Comparing empty to empty string # time=1.511ms
    
    # Subtest: 9.5 - Comparing empty array to empty plain object
        ok 1 - 9.5
        1..1
    ok 45 - 9.5 - Comparing empty array to empty plain object # time=1ms
    
    # Subtest: 10.1 - both are plain objects, didn't match - returns false
        ok 1 - 10.1
        1..1
    ok 46 - 10.1 - both are plain objects, didn't match - returns false # time=0.993ms
    
    # Subtest: 10.2 - two functions given - returns false
        ok 1 - 10.2
        1..1
    ok 47 - 10.2 - two functions given - returns false # time=0.878ms
    
    1..47
    # time=721.601ms
}

ok 2 - test/umd-test.js # time=28.655ms {
    # Subtest: UMD build works fine
        ok 1 - expect falsey value
        1..1
    ok 1 - UMD build works fine # time=18.69ms
    
    1..1
    # time=28.655ms
}

1..2
# time=3718.455ms
