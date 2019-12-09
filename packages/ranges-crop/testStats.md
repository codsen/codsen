TAP version 13
# Subtest: test/test.js
    # Subtest: 00.01 - ranges array is not array
        ok 1 - expected to throw
        ok 2 - expect truthy value
        1..2
    ok 1 - 00.01 - ranges array is not array # time=8.288ms
    
    # Subtest: 00.02 - str len is not a number
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect truthy value
        1..8
    ok 2 - 00.02 - str len is not a number # time=45.533ms
    
    # Subtest: 00.03 - array of ranges is actually a single range
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 3 - 00.03 - array of ranges is actually a single range # time=14.522ms
    
    # Subtest: 00.04 - something's wrong with range arrays's contents
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
        1..10
    ok 4 - 00.04 - something's wrong with range arrays's contents # time=7.033ms
    
    # Subtest: 00.05 - third argument within one of given ranges if of a wrong type
        ok 1 - expected to throw
        ok 2 - expect truthy value
        1..2
    ok 5 - 00.05 - third argument within one of given ranges if of a wrong type # time=2.342ms
    
    # Subtest: 01.01 - crops out few ranges outside the strlen
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        ok 4 - 01.01.04
        1..4
    ok 6 - 01.01 - crops out few ranges outside the strlen # time=8.444ms
    
    # Subtest: 01.02 - overlap on one of ranges
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        ok 4 - 01.02.04
        1..4
    ok 7 - 01.02 - overlap on one of ranges # time=4.171ms
    
    # Subtest: 01.03 - overlap on one of ranges plus some extra ranges
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        ok 4 - 01.03.04
        1..4
    ok 8 - 01.03 - overlap on one of ranges plus some extra ranges # time=4.014ms
    
    # Subtest: 01.04 - string length on the beginning of one of ranges
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.03
        ok 4 - 01.04.04
        1..4
    ok 9 - 01.04 - string length on the beginning of one of ranges # time=4.053ms
    
    # Subtest: 01.05 - string length on the ending of one of ranges
        ok 1 - 01.05.01
        ok 2 - 01.05.02
        ok 3 - 01.05.03
        ok 4 - 01.05.04
        1..4
    ok 10 - 01.05 - string length on the ending of one of ranges # time=4.176ms
    
    # Subtest: 01.06 - string length beyond any of given ranges
        ok 1 - 01.06.01
        ok 2 - 01.06.02
        ok 3 - 01.06.03
        ok 4 - 01.06.04
        1..4
    ok 11 - 01.06 - string length beyond any of given ranges # time=4.555ms
    
    # Subtest: 01.07 - no ranges
        ok 1 - 01.07.01
        ok 2 - 01.07.02
        ok 3 - 01.07.03
        ok 4 - 01.07.04
        1..4
    ok 12 - 01.07 - no ranges # time=3.317ms
    
    # Subtest: 01.08 - unsorted ranges
        ok 1 - 01.08.01
        ok 2 - 01.08.02
        ok 3 - 01.08.03
        ok 4 - 01.08.04
        1..4
    ok 13 - 01.08 - unsorted ranges # time=3.614ms
    
    # Subtest: 01.09 - lots of overlapping, unsorted and futile ranges
        ok 1 - 01.09.01
        ok 2 - 01.09.02
        ok 3 - 01.09.03
        ok 4 - 01.09.04
        1..4
    ok 14 - 01.09 - lots of overlapping, unsorted and futile ranges # time=3.986ms
    
    # Subtest: 02.01 - strlen matches the middle of some range's indexes, there's content to add (3rd arg.)
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        1..4
    ok 15 - 02.01 - strlen matches the middle of some range's indexes, there's content to add (3rd arg.) # time=3.992ms
    
    # Subtest: 02.02 - strlen matches the beginning of some range's indexes, there's content to add (3rd arg.)
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        1..4
    ok 16 - 02.02 - strlen matches the beginning of some range's indexes, there's content to add (3rd arg.) # time=3.9ms
    
    # Subtest: 02.03 - strlen matches the ending of some range's indexes, there's content to add (3rd arg.)
        ok 1 - 02.03.01
        ok 2 - 02.03.02
        ok 3 - 02.03.03
        ok 4 - 02.03.04
        1..4
    ok 17 - 02.03 - strlen matches the ending of some range's indexes, there's content to add (3rd arg.) # time=3.734ms
    
    1..17
    # time=277.288ms
ok 1 - test/test.js # time=277.288ms

1..1
# time=2538.88ms
