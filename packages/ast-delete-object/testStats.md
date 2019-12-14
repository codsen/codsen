TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - delete one object within an array
        ok 1 - 01.01.01 - defaults
        ok 2 - 01.01.02 - strict matching
        ok 3 - 01.01.03 - hungry for whitespace
        ok 4 - 01.01.04 - hungry for whitespace, strict match
        1..4
    ok 1 - 01.01 - delete one object within an array # time=19.012ms
    
    # Subtest: 01.02 - delete one object, involves white space
        ok 1 - 01.02.01 - won't delete because of white space mismatching strictly
        ok 2 - 01.02.02 - won't delete because of strict match is on
        ok 3 - 01.02.03 - will delete because match is not strict and hungry is on
        ok 4 - 01.02.04 - won't delete because of strict match, hungry does not matter
        1..4
    ok 2 - 01.02 - delete one object, involves white space # time=7.875ms
    
    # Subtest: 01.03 - multiple findings, object within array
        ok 1 - 01.03.01
        ok 2 - 01.03.02 - some not deleted because of strict match
        ok 3 - 01.03.03
        ok 4 - 01.03.04 - some not deleted because of strict match
        1..4
    ok 3 - 01.03 - multiple findings, object within array # time=57.328ms
    
    # Subtest: 01.04 - delete object within an arrays
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.03
        ok 4 - 01.04.04
        1..4
    ok 4 - 01.04 - delete object within an arrays # time=49.701ms
    
    # Subtest: 01.05 - delete object within an array, wrong order of keys, pt.1
        ok 1 - 01.05.01 - defaults (not strict match, not white space hungry)
        ok 2 - 01.05.02 - strict match
        ok 3 - 01.05.03 - whitespace hungry
        ok 4 - 01.05.04 - white space hungry with strict match
        ok 5 - 01.05.05 - strict match, different input
        1..5
    ok 5 - 01.05 - delete object within an array, wrong order of keys, pt.1 # time=9.13ms
    
    # Subtest: 01.06 - delete object within an array, wrong order of keys, pt.2
        ok 1 - 01.06
        1..1
    ok 6 - 01.06 - delete object within an array, wrong order of keys, pt.2 # time=3.063ms
    
    # Subtest: 01.07 - special case, not strict
        ok 1 - 01.07
        1..1
    ok 7 - 01.07 - special case, not strict # time=2.016ms
    
    # Subtest: 01.08 - special case, strict
        ok 1 - 01.08
        1..1
    ok 8 - 01.08 - special case, strict # time=1.981ms
    
    # Subtest: 01.09 - real-life situation #1
        ok 1 - 01.09
        1..1
    ok 9 - 01.09 - real-life situation #1 # time=2.491ms
    
    # Subtest: 01.10 - real-life situation #2
        ok 1 - 01.10
        1..1
    ok 10 - 01.10 - real-life situation #2 # time=6.897ms
    
    # Subtest: 01.11 - multiple empty values blank arrays #1
        ok 1 - 01.11
        1..1
    ok 11 - 01.11 - multiple empty values blank arrays #1 # time=2.252ms
    
    # Subtest: 01.12 - multiple empty values blank arrays #2
        ok 1 - 01.12
        1..1
    ok 12 - 01.12 - multiple empty values blank arrays #2 # time=2.166ms
    
    # Subtest: 01.13 - object's value is a blank array, looking in an array
        ok 1 - 01.13
        1..1
    ok 13 - 01.13 - object's value is a blank array, looking in an array # time=2.217ms
    
    # Subtest: 01.14 - object's value is a blank array, looking in an object
        ok 1 - 01.14
        1..1
    ok 14 - 01.14 - object's value is a blank array, looking in an object # time=1.878ms
    
    # Subtest: 02.01 - delete object within object - simple #1
        ok 1 - 02.01
        1..1
    ok 15 - 02.01 - delete object within object - simple #1 # time=1.939ms
    
    # Subtest: 02.02 - multiple objects to find - simple #1
        ok 1 - 02.02
        1..1
    ok 16 - 02.02 - multiple objects to find - simple #1 # time=1.967ms
    
    # Subtest: 02.03 - multiple objects to find within objects
        ok 1 - 02.03
        1..1
    ok 17 - 02.03 - multiple objects to find within objects # time=2.159ms
    
    # Subtest: 02.04 - real-life scenario
        ok 1 - 02.04
        1..1
    ok 18 - 02.04 - real-life scenario # time=3.035ms
    
    # Subtest: 02.05 - delete object within object - simple #1
        ok 1 - 02.05
        1..1
    ok 19 - 02.05 - delete object within object - simple #1 # time=3.96ms
    
    # Subtest: 03.01 - the input is the finding
        ok 1 - 03.01.01
        1..1
    ok 20 - 03.01 - the input is the finding # time=4.54ms
    
    # Subtest: 03.02 - the input is boolean
        ok 1 - 03.02
        1..1
    ok 21 - 03.02 - the input is boolean # time=1.712ms
    
    # Subtest: 03.03 - the input is string
        ok 1 - 03.03
        1..1
    ok 22 - 03.03 - the input is string # time=1.811ms
    
    # Subtest: 03.04 - no input - throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 23 - 03.04 - no input - throws # time=2.799ms
    
    # Subtest: 03.05 - the input is the finding (right within array)
        ok 1 - 03.05
        1..1
    ok 24 - 03.05 - the input is the finding (right within array) # time=2.113ms
    
    # Subtest: 03.06 - pt1. empty object to find
        ok 1 - 03.06.01
        ok 2 - 03.06.02
        ok 3 - 03.06.03
        ok 4 - 03.06.04
        1..4
    ok 25 - 03.06 - pt1. empty object to find # time=5.085ms
    
    # Subtest: 03.06 - pt2. empty object to find
        ok 1 - 03.06.05
        ok 2 - 03.06.06 - rare case - both opts on, matching against blank object - will yield positive against other blank objects, disregarding the STRICTLY flag
        ok 3 - 03.06.07
        ok 4 - 03.06.08
        1..4
    ok 26 - 03.06 - pt2. empty object to find # time=9.511ms
    
    # Subtest: 03.06 - pt3. empty object to find
        ok 1 - 03.06.09
        ok 2 - 03.06.10
        ok 3 - 03.06.11
        ok 4 - 03.06.12
        1..4
    ok 27 - 03.06 - pt3. empty object to find # time=6.333ms
    
    # Subtest: 03.07 - to find is undefined - throws
        ok 1 - expected to throw
        1..1
    ok 28 - 03.07 - to find is undefined - throws # time=4.99ms
    
    # Subtest: 03.08 - to find is null - throws
        ok 1 - expected to throw
        1..1
    ok 29 - 03.08 - to find is null - throws # time=1.554ms
    
    # Subtest: 03.09 - to find is string - returns input
        ok 1 - 03.09
        1..1
    ok 30 - 03.09 - to find is string - returns input # time=7.766ms
    
    # Subtest: 04.01 - won't delete object within an array because of strict mode
        ok 1 - 04.01
        1..1
    ok 31 - 04.01 - won't delete object within an array because of strict mode # time=6.413ms
    
    # Subtest: 04.02 - won't find multiple findings because of strict mode
        ok 1 - 04.02
        1..1
    ok 32 - 04.02 - won't find multiple findings because of strict mode # time=2.473ms
    
    # Subtest: 04.03 - strict mode: deletes some and skips some because of strict mode
        ok 1 - 04.03
        1..1
    ok 33 - 04.03 - strict mode: deletes some and skips some because of strict mode # time=5.697ms
    
    # Subtest: 04.04 - won't delete object within an arrays because of strict mode
        ok 1 - 04.04
        1..1
    ok 34 - 04.04 - won't delete object within an arrays because of strict mode # time=5.797ms
    
    # Subtest: 05.01 - recognises array containing only empty space - default
        ok 1 - 05.01.01
        ok 2 - 05.01.02
        1..2
    ok 35 - 05.01 - recognises array containing only empty space - default # time=3.069ms
    
    # Subtest: 05.02 - recognises array containing only empty space - strict
        ok 1 - 05.02.01
        ok 2 - 05.02.02
        1..2
    ok 36 - 05.02 - recognises array containing only empty space - strict # time=4.273ms
    
    # Subtest: 05.03 - recognises array containing only empty space - not found
        ok 1 - 05.03
        1..1
    ok 37 - 05.03 - recognises array containing only empty space - not found # time=1.986ms
    
    # Subtest: 05.04 - two keys in objToDelete - default
        ok 1 - 05.04.01
        ok 2 - expected to throw
        1..2
    ok 38 - 05.04 - two keys in objToDelete - default # time=14.803ms
    
    # Subtest: 05.05 - two keys in objToDelete - strict, not found
        ok 1 - 05.05.01
        ok 2 - 05.05.02
        1..2
    ok 39 - 05.05 - two keys in objToDelete - strict, not found # time=11.458ms
    
    # Subtest: 05.06 - two keys in objToDelete - strict
        ok 1 - 05.06
        1..1
    ok 40 - 05.06 - two keys in objToDelete - strict # time=2.058ms
    
    # Subtest: 05.07 - array with strings containing emptiness - default
        ok 1 - 05.07.01
        ok 2 - 05.07.02
        1..2
    ok 41 - 05.07 - array with strings containing emptiness - default # time=5.875ms
    
    # Subtest: 05.08 - array with strings containing emptiness - strict
        ok 1 - 05.08
        1..1
    ok 42 - 05.08 - array with strings containing emptiness - strict # time=1.922ms
    
    # Subtest: 05.09 - array with strings containing emptiness - strict found
        ok 1 - 05.09.01
        ok 2 - 05.09.02
        1..2
    ok 43 - 05.09 - array with strings containing emptiness - strict found # time=16.296ms
    
    # Subtest: 05.10 - recognises string containing only empty space (queried array)
        ok 1 - 05.10.01
        ok 2 - 05.10.02
        1..2
    ok 44 - 05.10 - recognises string containing only empty space (queried array) # time=37.929ms
    
    # Subtest: 05.11 - recognises string containing only empty space - strict
        ok 1 - 05.11
        1..1
    ok 45 - 05.11 - recognises string containing only empty space - strict # time=5.846ms
    
    # Subtest: 05.12 - recognises string containing only empty space - won't find
        ok 1 - 05.12
        1..1
    ok 46 - 05.12 - recognises string containing only empty space - won't find # time=2.117ms
    
    # Subtest: 05.13 - recognises string containing only empty space - won't find
        ok 1 - 05.13.01
        ok 2 - 05.13.02
        1..2
    ok 47 - 05.13 - recognises string containing only empty space - won't find # time=3.33ms
    
    # Subtest: 05.14 - recognises a string containing only empty space (queried array with empty string)
        ok 1 - 05.14
        1..1
    ok 48 - 05.14 - recognises a string containing only empty space (queried array with empty string) # time=8.429ms
    
    # Subtest: 05.15 - a string containing only empty space (queried array) - strict
        ok 1 - 05.15
        1..1
    ok 49 - 05.15 - a string containing only empty space (queried array) - strict # time=2.005ms
    
    # Subtest: 05.16 - a string containing only empty space (queried array) - not found
        ok 1 - 05.16
        1..1
    ok 50 - 05.16 - a string containing only empty space (queried array) - not found # time=1.93ms
    
    # Subtest: 05.17 - recognises string containing only empty space string (queried empty string)
        ok 1 - 05.17
        1..1
    ok 51 - 05.17 - recognises string containing only empty space string (queried empty string) # time=1.975ms
    
    # Subtest: 05.18 - multiple string values in objToDelete
        ok 1 - 05.18
        1..1
    ok 52 - 05.18 - multiple string values in objToDelete # time=7.308ms
    
    # Subtest: 05.19 - multiple string values in objToDelete - not found
        ok 1 - 05.19
        1..1
    ok 53 - 05.19 - multiple string values in objToDelete - not found # time=1.93ms
    
    # Subtest: 05.20 - multiple string values in objToDelete - strict
        ok 1 - 05.20
        1..1
    ok 54 - 05.20 - multiple string values in objToDelete - strict # time=1.995ms
    
    # Subtest: 05.21 - won't find, queried object with empty string value
        ok 1 - 05.21
        1..1
    ok 55 - 05.21 - won't find, queried object with empty string value # time=1.896ms
    
    # Subtest: 05.22 - recognises array of strings each containing only empty space (queried empty string)
        ok 1 - 05.22
        1..1
    ok 56 - 05.22 - recognises array of strings each containing only empty space (queried empty string) # time=2.118ms
    
    # Subtest: 05.23 - recognises array with multiple strings containing emptiness
        ok 1 - 05.23
        1..1
    ok 57 - 05.23 - recognises array with multiple strings containing emptiness # time=2.055ms
    
    # Subtest: 05.24 - empty array finding empty string
        ok 1 - 05.24
        1..1
    ok 58 - 05.24 - empty array finding empty string # time=2.081ms
    
    # Subtest: 05.25 - empty string finding empty array
        ok 1 - 05.25
        1..1
    ok 59 - 05.25 - empty string finding empty array # time=1.957ms
    
    # Subtest: 05.26 - object deleted from an array, strict mode
        ok 1 - 05.26
        1..1
    ok 60 - 05.26 - object deleted from an array, strict mode # time=2.49ms
    
    # Subtest: 06.01 - real life situation #1
        ok 1 - 06.01
        1..1
    ok 61 - 06.01 - real life situation #1 # time=1.833ms
    
    # Subtest: 06.02 - real life situation #2
        ok 1 - 06.02
        1..1
    ok 62 - 06.02 - real life situation #2 # time=1.929ms
    
    # Subtest: 06.03 - real life situation #3
        ok 1 - 06.03
        1..1
    ok 63 - 06.03 - real life situation #3 # time=2.421ms
    
    # Subtest: 06.04 - real life situation #4
        ok 1 - 06.04
        1..1
    ok 64 - 06.04 - real life situation #4 # time=6.41ms
    
    # Subtest: 06.05 - empty strings within arrays
        ok 1 - 06.05.01 - defaults
        ok 2 - 06.05.02 - hungryForWhitespace
        ok 3 - 06.05.03 - matchKeysStrictly
        ok 4 - 06.05.04 - matchKeysStrictly + hungryForWhitespace
        1..4
    ok 65 - 06.05 - empty strings within arrays # time=5.507ms
    
    # Subtest: 06.06 - strict mode, deletes everything
        ok 1 - 06.06.01
        ok 2 - 06.06.02
        1..2
    ok 66 - 06.06 - strict mode, deletes everything # time=2.362ms
    
    # Subtest: 06.07 - treats holes in arrays - ast-monkey will fix them
        ok 1 - 06.07
        1..1
    ok 67 - 06.07 - treats holes in arrays - ast-monkey will fix them # time=1.791ms
    
    # Subtest: 07.01 - does not mutate input args
        ok 1 - (unnamed test)
        ok 2 - 07.01.01
        ok 3 - 07.01.02
        1..3
    ok 68 - 07.01 - does not mutate input args # time=2.622ms
    
    # Subtest: 08.01 - wrong input args
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        1..4
    ok 69 - 08.01 - wrong input args # time=4.495ms
    
    1..69
    # time=876.705ms
ok 1 - test/test.js # time=876.705ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=14.83ms
    
    1..1
    # time=78.776ms
ok 2 - test/umd-test.js # time=78.776ms

1..2
# time=6322.462ms
