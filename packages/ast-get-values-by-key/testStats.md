TAP version 13
ok 1 - test/test.js # time=407.963ms {
    # Subtest: 01.01 - just a plain object
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        1..3
    ok 1 - 01.01 - just a plain object # time=18.765ms
    
    # Subtest: 01.02 - single plain object within array
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        1..2
    ok 2 - 01.02 - single plain object within array # time=8.58ms
    
    # Subtest: 01.03 - string in array as result
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        1..2
    ok 3 - 01.03 - string in array as result # time=8.996ms
    
    # Subtest: 01.04 - two strings as result
        ok 1 - 01.04.01
        1..1
    ok 4 - 01.04 - two strings as result # time=7.731ms
    
    # Subtest: 01.05 - query by key, returns mixed results
        ok 1 - 01.05.01
        1..1
    ok 5 - 01.05 - query by key, returns mixed results # time=13.104ms
    
    # Subtest: 01.06 - deep tree
        ok 1 - 01.06.01
        ok 2 - 01.06.02
        1..2
    ok 6 - 01.06 - deep tree # time=9.016ms
    
    # Subtest: 01.07 - query returns an array
        ok 1 - 01.07
        1..1
    ok 7 - 01.07 - query returns an array # time=1.78ms
    
    # Subtest: 01.08 - query returns a string
        ok 1 - 01.08
        1..1
    ok 8 - 01.08 - query returns a string # time=1.274ms
    
    # Subtest: 01.09 - query returns array with two objects
        ok 1 - 01.09
        ok 2 - 01.09.02
        1..2
    ok 9 - 01.09 - query returns array with two objects # time=7.242ms
    
    # Subtest: 02.01 - no results query
        ok 1 - 02.01
        1..1
    ok 10 - 02.01 - no results query # time=4.047ms
    
    # Subtest: 03.01 - string replaced
        ok 1 - 03.01
        1..1
    ok 11 - 03.01 - string replaced # time=1.262ms
    
    # Subtest: 03.02 - string within array replaced
        ok 1 - 03.02
        1..1
    ok 12 - 03.02 - string within array replaced # time=1.251ms
    
    # Subtest: 03.03 - value is object and is replaced
        ok 1 - 03.03
        1..1
    ok 13 - 03.03 - value is object and is replaced # time=1.302ms
    
    # Subtest: 03.04 - two objects replaced
        ok 1 - 03.04
        1..1
    ok 14 - 03.04 - two objects replaced # time=2.77ms
    
    # Subtest: 03.05 - simple edit
        ok 1 - 03.05
        1..1
    ok 15 - 03.05 - simple edit # time=2.025ms
    
    # Subtest: 03.06 - replaced to an empty string
        ok 1 - 03.06 - empty string given as a replacement
        1..1
    ok 16 - 03.06 - replaced to an empty string # time=1.251ms
    
    # Subtest: 03.07 - not enough replacement values given
        ok 1 - 03.07 - still works
        1..1
    ok 17 - 03.07 - not enough replacement values given # time=1.895ms
    
    # Subtest: 04.01 - no results replacement
        ok 1 - 04.01
        1..1
    ok 18 - 04.01 - no results replacement # time=7.216ms
    
    # Subtest: 05.02 - input is plain object, replacement is string
        ok 1 - 05.02
        1..1
    ok 19 - 05.02 - input is plain object, replacement is string # time=1.089ms
    
    # Subtest: 06.01 - wrong type of second argument
        ok 1 - expected to throw
        ok 2 - 06.01.01
        1..2
    ok 20 - 06.01 - wrong type of second argument # time=5.656ms
    
    # Subtest: 06.02 - input is plain object, replacement is unrecognised (is a function)
        ok 1 - expected to not throw
        1..1
    ok 21 - 06.02 - input is plain object, replacement is unrecognised (is a function) # time=1.305ms
    
    # Subtest: 06.03 - one of the whatToFind array values is a sneaky non-string
        ok 1 - expected to throw
        1..1
    ok 22 - 06.03 - one of the whatToFind array values is a sneaky non-string # time=11.689ms
    
    # Subtest: 06.04 - one of the replacement array values is a sneaky non-string
        ok 1 - expected to not throw
        1..1
    ok 23 - 06.04 - one of the replacement array values is a sneaky non-string # time=1.007ms
    
    # Subtest: 06.05.01 - input present but non-container sort
        ok 1 - 05.05.01
        1..1
    ok 24 - 06.05.01 - input present but non-container sort # time=1.048ms
    
    # Subtest: 06.05.02 - input completely missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 25 - 06.05.02 - input completely missing # time=2.036ms
    
    # Subtest: 06.06 - second argument is completely missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 26 - 06.06 - second argument is completely missing # time=1.879ms
    
    1..26
    # time=407.963ms
}

ok 2 - test/umd-test.js # time=50.113ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=34.463ms
    
    1..1
    # time=50.113ms
}

1..2
# time=3414.237ms
