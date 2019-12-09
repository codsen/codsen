TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - both inputs missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 1 - 01.01 - both inputs missing # time=12.048ms
    
    # Subtest: 01.02 - second input missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 2 - 01.02 - second input missing # time=4.274ms
    
    # Subtest: 01.03 - first input missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 3 - 01.03 - first input missing # time=3.514ms
    
    # Subtest: 01.04 - null as input
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 4 - 01.04 - null as input # time=3.484ms
    
    # Subtest: 01.05 - falsey inputs
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 5 - 01.05 - falsey inputs # time=3.22ms
    
    # Subtest: 01.06 - undefined in a second-level depth
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        1..4
    ok 6 - 01.06 - undefined in a second-level depth # time=14.213ms
    
    # Subtest: 01.07 - wrong types of input args
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 7 - 01.07 - wrong types of input args # time=3.492ms
    
    # Subtest: 02.01 - simple plain objects
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        ok 5 - 02.01.05
        ok 6 - 02.01.06
        ok 7 - 02.01.07 - matchStrictly trumps hungryForWhitespace if key count does not match
        ok 8 - 02.01.08 - matchStrictly trumps hungryForWhitespace if key count does not match
        ok 9 - 02.01.09 - keys match exactly, different white space matched
        ok 10 - 02.01.10 - keys match exactly, white space matches to empty string
        ok 11 - 02.01.11 - keys match exactly, empty string matches to white space
        ok 12 - 02.01.12 - keys match exactly, string does not match to empty string
        ok 13 - 02.01.13 - keys match exactly, string does not match to empty string
        ok 14 - 02.01.14 - keys match exactly, different white space matched
        ok 15 - 02.01.15 - keys match exactly, different white space matched
        1..15
    ok 8 - 02.01 - simple plain objects # time=13.885ms
    
    # Subtest: 02.02 - comparison of empty plain objects
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        ok 5 - 02.02.05
        ok 6 - 02.02.06
        ok 7 - 02.02.07
        ok 8 - 02.02.08
        ok 9 - 02.02.09
        ok 10 - 02.02.10
        ok 11 - 02.02.11
        ok 12 - 02.02.12
        1..12
    ok 9 - 02.02 - comparison of empty plain objects # time=9.673ms
    
    # Subtest: 02.03 - comparing two empty plain objects
        ok 1 - 02.03.01
        ok 2 - 02.03.02
        ok 3 - 02.03.03
        1..3
    ok 10 - 02.03 - comparing two empty plain objects # time=1.69ms
    
    # Subtest: 02.04 - catching row 199 for 100% coverage
        ok 1 - 02.04.01
        1..1
    ok 11 - 02.04 - catching row 199 for 100% coverage # time=3.19ms
    
    # Subtest: 02.05 - sneaky similarity
        ok 1 - 02.05.01
        ok 2 - 02.05.02
        ok 3 - 02.05.03
        1..3
    ok 12 - 02.05 - sneaky similarity # time=4.854ms
    
    # Subtest: 02.06 - big object has one element extra
        ok 1 - 02.06
        1..1
    ok 13 - 02.06 - big object has one element extra # time=2.407ms
    
    # Subtest: 02.07 - small object has one element extra
        ok 1 - 02.07
        1..1
    ok 14 - 02.07 - small object has one element extra # time=2.571ms
    
    # Subtest: 02.08 - object values are arrays, one has a string, another has none
        ok 1 - 02.08.01 - relying on default
        ok 2 - 02.08.02 - relying on default
        ok 3 - 02.08.03 - same, default hardcoded
        ok 4 - 02.08.04 - hungryForWhitespace
        ok 5 - 02.08.05 - same, default hardcoded
        ok 6 - 02.08.06 - matchStrictly trump hungryForWhitespace - element count is uneven hence a falsey result
        1..6
    ok 15 - 02.08 - object values are arrays, one has a string, another has none # time=6.353ms
    
    # Subtest: 02.09 - empty object with keys vs object with no keys
        ok 1 - 02.09.01
        ok 2 - 02.09.02
        ok 3 - 02.09.03
        ok 4 - 02.09.04
        1..4
    ok 16 - 02.09 - empty object with keys vs object with no keys # time=5.887ms
    
    # Subtest: 02.10 - Boolean and numeric values
        ok 1 - 02.10.01 - control - booleans and numbers as obj values
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        1..4
    ok 17 - 02.10 - Boolean and numeric values # time=4.673ms
    
    # Subtest: 02.11 - s is zero length, b is empty
        ok 1 - 02.11.01 - defaults
        ok 2 - 02.11.02 - opts.hungryForWhitespace
        ok 3 - 02.11.03 - opts.hungryForWhitespace, no keys array vs array with all empty vales
        1..3
    ok 18 - 02.11 - s is zero length, b is empty # time=4.304ms
    
    # Subtest: 02.12 - matching empty arrays
        ok 1 - 02.12.01 - blank vs. normal - defaults
        ok 2 - 02.12.02 - blank vs. empty - defaults
        ok 3 - 02.12.03 - blank vs. normal - opts.hungryForWhitespace
        ok 4 - 02.12.04 - blank vs. empty - opts.hungryForWhitespace
        ok 5 - 02.12.05 - blank vs. normal - opts.matchStrictly
        ok 6 - 02.12.06 - blank vs. empty - opts.matchStrictly
        ok 7 - 02.12.07 - blank vs. normal - both opts
        ok 8 - 02.12.08 - blank vs. empty - both opts
        1..8
    ok 19 - 02.12 - matching empty arrays # time=6.905ms
    
    # Subtest: 03.01 - simple nested plain objects
        ok 1 - 03.01
        1..1
    ok 20 - 03.01 - simple nested plain objects # time=1.161ms
    
    # Subtest: 03.02 - simple nested plain objects + array wrapper
        ok 1 - 03.02
        1..1
    ok 21 - 03.02 - simple nested plain objects + array wrapper # time=3.446ms
    
    # Subtest: 03.03 - simple nested plain objects, won't find
        ok 1 - 03.03
        1..1
    ok 22 - 03.03 - simple nested plain objects, won't find # time=3.494ms
    
    # Subtest: 03.04 - simple nested plain objects + array wrapper, won't find
        ok 1 - 03.04
        1..1
    ok 23 - 03.04 - simple nested plain objects + array wrapper, won't find # time=5.482ms
    
    # Subtest: 03.05 - obj, multiple nested levels, bigObj has more
        ok 1 - 03.05
        1..1
    ok 24 - 03.05 - obj, multiple nested levels, bigObj has more # time=3.818ms
    
    # Subtest: 03.06 - obj, multiple nested levels, equal
        ok 1 - 03.06
        1..1
    ok 25 - 03.06 - obj, multiple nested levels, equal # time=12.026ms
    
    # Subtest: 03.07 - obj, multiple nested levels, smallObj has more
        ok 1 - 03.07
        1..1
    ok 26 - 03.07 - obj, multiple nested levels, smallObj has more # time=7.655ms
    
    # Subtest: 03.08 - obj, deeper level doesn't match
        ok 1 - 03.08
        1..1
    ok 27 - 03.08 - obj, deeper level doesn't match # time=2.263ms
    
    # Subtest: 03.09 - empty string and empty nested object
        ok 1 - 03.09.01 - defaults
        ok 2 - 03.09.02 - hungryForWhitespace
        ok 3 - 03.09.03 - matchStrictly
        ok 4 - 03.09.04 - hungryForWhitespace + matchStrictly
        ok 5 - 03.09.04 - hungryForWhitespace + matchStrictly
        1..5
    ok 28 - 03.09 - empty string and empty nested object # time=10.1ms
    
    # Subtest: 03.10 - multiple keys
        ok 1 - 03.10.01
        ok 2 - 03.10.02
        1..2
    ok 29 - 03.10 - multiple keys # time=3.617ms
    
    # Subtest: 04.01 - simple arrays with strings
        ok 1 - 04.01.01
        ok 2 - 04.01.02
        ok 3 - 04.01.03
        ok 4 - 04.01.04
        ok 5 - 04.01.05
        ok 6 - 04.01.06
        ok 7 - 04.01.07
        ok 8 - 04.01.08
        ok 9 - 04.01.09
        ok 10 - 04.01.10
        1..10
    ok 30 - 04.01 - simple arrays with strings # time=12.656ms
    
    # Subtest: 04.02 - simple arrays with plain objects
        ok 1 - 04.02.01
        ok 2 - 04.02.02
        1..2
    ok 31 - 04.02 - simple arrays with plain objects # time=2.864ms
    
    # Subtest: 04.03 - arrays, nested with strings and objects
        ok 1 - 04.03.01
        ok 2 - 04.03.02
        1..2
    ok 32 - 04.03 - arrays, nested with strings and objects # time=5.13ms
    
    # Subtest: 04.04 - comparing empty arrays (variations)
        ok 1 - 04.04.01
        ok 2 - 04.04.02
        ok 3 - 04.04.03
        ok 4 - 04.04.04
        ok 5 - 04.04.05
        ok 6 - 04.04.06
        ok 7 - 04.04.07
        ok 8 - 04.04.08
        ok 9 - 04.04.09
        ok 10 - 04.04.10
        1..10
    ok 33 - 04.04 - comparing empty arrays (variations) # time=7.708ms
    
    # Subtest: 04.05 - empty arrays within obj key values
        ok 1 - 04.05.01
        ok 2 - 04.05.02
        ok 3 - 04.05.03
        ok 4 - 04.05.04
        ok 5 - 04.05.05
        1..5
    ok 34 - 04.05 - empty arrays within obj key values # time=11.576ms
    
    # Subtest: 04.06 - empty arrays vs empty objects
        ok 1 - 04.06.01
        ok 2 - 04.06.02
        ok 3 - 04.06.03
        ok 4 - 04.06.04
        ok 5 - 04.06.05
        ok 6 - 04.06.06
        1..6
    ok 35 - 04.06 - empty arrays vs empty objects # time=23.529ms
    
    # Subtest: 04.07 - empty arrays vs empty strings
        ok 1 - 04.07.01
        ok 2 - 04.07.02
        ok 3 - 04.07.03
        ok 4 - 04.07.04
        1..4
    ok 36 - 04.07 - empty arrays vs empty strings # time=3.867ms
    
    # Subtest: 04.08 - two arrays, matches middle, string within
        ok 1 - 04.08.01
        ok 2 - 04.08.01 opposite
        ok 3 - 04.08.02
        ok 4 - 04.08.02 opposite
        ok 5 - 04.08.03
        ok 6 - 04.08.03 opposite
        ok 7 - 04.08.04
        ok 8 - 04.08.04 opposite
        ok 9 - 04.08.05
        ok 10 - 04.08.05 opposite
        1..10
    ok 37 - 04.08 - two arrays, matches middle, string within # time=2.76ms
    
    # Subtest: 04.09 - two arrays, matches middle, objects within
        ok 1 - 04.09.01
        ok 2 - 04.09.01 opposite
        ok 3 - 04.09.02
        ok 4 - 04.09.02 opposite
        ok 5 - 04.09.03
        ok 6 - 04.09.03 opposite
        ok 7 - 04.09.04
        ok 8 - 04.09.04 opposite
        ok 9 - 04.09.05
        ok 10 - 04.09.05 opposite
        ok 11 - 04.09.06
        ok 12 - 04.09.07
        ok 13 - 04.09.08
        ok 14 - 04.09.09
        ok 15 - 04.09.10
        1..15
    ok 38 - 04.09 - two arrays, matches middle, objects within # time=12.434ms
    
    # Subtest: 04.10 - two arrays, one empty, string within
        ok 1 - 04.10.01
        ok 2 - 04.10.02
        ok 3 - 04.10.03
        1..3
    ok 39 - 04.10 - two arrays, one empty, string within # time=9.788ms
    
    # Subtest: 05.01 - simple strings
        ok 1 - 05.01.01
        ok 2 - 05.01.02
        ok 3 - 05.01.03
        ok 4 - 05.01.04
        ok 5 - 05.01.05
        ok 6 - 05.01.06
        ok 7 - 05.01.07
        ok 8 - 05.01.08
        1..8
    ok 40 - 05.01 - simple strings # time=11.571ms
    
    # Subtest: 05.02 - strings compared and fails
        ok 1 - 05.02.01
        ok 2 - 05.02.02
        1..2
    ok 41 - 05.02 - strings compared and fails # time=2.252ms
    
    # Subtest: 05.03 - strings in arrays compared, positive
        ok 1 - 05.03
        1..1
    ok 42 - 05.03 - strings in arrays compared, positive # time=1.56ms
    
    # Subtest: 05.04 - string against empty array or empty string within an array
        ok 1 - 05.04.01
        ok 2 - 05.04.02
        ok 3 - 05.04.03
        ok 4 - 05.04.04
        1..4
    ok 43 - 05.04 - string against empty array or empty string within an array # time=3.558ms
    
    # Subtest: 05.05 - string vs empty space
        ok 1 - 05.05.01
        ok 2 - 05.05.02
        ok 3 - 05.05.03
        ok 4 - 05.05.04
        1..4
    ok 44 - 05.05 - string vs empty space # time=3.001ms
    
    # Subtest: 05.06 - empty space vs different empty space
        ok 1 - 05.06.01
        ok 2 - 05.06.02
        ok 3 - 05.06.03
        ok 4 - 05.06.04
        1..4
    ok 45 - 05.06 - empty space vs different empty space # time=2.947ms
    
    # Subtest: 05.07 - two arrays, one empty
        ok 1 - 05.07.01 - in root, defaults
        ok 2 - 05.07.02 - in root, defaults
        ok 3 - 05.07.03 - in root, defaults, opposite from #2
        1..3
    ok 46 - 05.07 - two arrays, one empty # time=4.015ms
    
    # Subtest: 05.08 - opts.matchStrictly
        ok 1 - 05.08.01 - key count mismatch
        ok 2 - 05.08.01 - key count mismatch
        1..2
    ok 47 - 05.08 - opts.matchStrictly # time=2.208ms
    
    # Subtest: 06.01 - null vs null
        ok 1 - 06.01.01
        1..1
    ok 48 - 06.01 - null vs null # time=1.691ms
    
    # Subtest: 06.02 - real-life #1
        ok 1 - 06.02.01
        ok 2 - 06.02.02
        ok 3 - 06.02.03
        1..3
    ok 49 - 06.02 - real-life #1 # time=3.387ms
    
    # Subtest: 06.03 - real-life #2
        ok 1 - 06.03.01
        ok 2 - 06.03.02
        1..2
    ok 50 - 06.03 - real-life #2 # time=2.294ms
    
    # Subtest: 06.05 - function as input
        ok 1 - expected to throw
        1..1
    ok 51 - 06.05 - function as input # time=1.629ms
    
    # Subtest: 06.06 - sneaky function within object literal
        ok 1 - expected to throw
        1..1
    ok 52 - 06.06 - sneaky function within object literal # time=1.716ms
    
    # Subtest: 06.07 - another sneaky function within object literal
        ok 1 - expected to throw
        1..1
    ok 53 - 06.07 - another sneaky function within object literal # time=1.766ms
    
    # Subtest: 06.08 - real-life #3
        ok 1 - 06.08.01
        ok 2 - 06.08.02
        ok 3 - 06.08.03
        1..3
    ok 54 - 06.08 - real-life #3 # time=12.175ms
    
    # Subtest: 06.09 - real-life #3 reduced case
        ok 1 - 06.09.01
        ok 2 - 06.09.02
        ok 3 - 06.09.03
        ok 4 - 06.09.04
        1..4
    ok 55 - 06.09 - real-life #3 reduced case # time=12.318ms
    
    # Subtest: 06.10 - input args of mismatching type - easy win
        ok 1 - 06.10.01
        ok 2 - 06.10.02
        ok 3 - 06.10.03
        ok 4 - 06.10.04
        ok 5 - 06.10.05
        ok 6 - 06.10.06
        ok 7 - 06.10.07
        ok 8 - 06.10.08
        1..8
    ok 56 - 06.10 - input args of mismatching type - easy win # time=5.656ms
    
    # Subtest: 07.01 - fourth argument doesn't break anything
        ok 1 - 07.01.01
        ok 2 - 07.01.02
        1..2
    ok 57 - 07.01 - fourth argument doesn't break anything # time=2.034ms
    
    # Subtest: 08.01 - hungryForWhitespace, empty strings within arrays
        ok 1 - 08.01.01
        ok 2 - 08.01.02
        ok 3 - 08.01.03
        ok 4 - 08.01.04
        1..4
    ok 58 - 08.01 - hungryForWhitespace, empty strings within arrays # time=3.393ms
    
    # Subtest: 09.01 - wildcards against values within object
        ok 1 - 09.01.01 - default
        ok 2 - 09.01.02 - hardcoded default
        ok 3 - 09.01.03 - wildcards enabled
        ok 4 - 09.01.04 - with letters and wildcards
        ok 5 - 09.01.05 - won't match because it's now case-sensitive in wildcards too
        ok 6 - 09.01.06 - won't match because it's now case-sensitive in wildcards too
        ok 7 - 09.01.07 - weird
        ok 8 - 09.01.08 - weird, false anyway
        1..8
    ok 59 - 09.01 - wildcards against values within object # time=6.079ms
    
    # Subtest: 09.02 - wildcards against keys within object
        ok 1 - 09.02.01 - default
        ok 2 - 09.02.02 - wildcards on
        ok 3 - 09.02.03 - won't find, despite wildcards, which are turned off
        ok 4 - 09.02.04 - won't find, despite wildcards, which are turned on
        1..4
    ok 60 - 09.02 - wildcards against keys within object # time=3.439ms
    
    # Subtest: 09.03 - wildcards in deeper levels
        ok 1 - 09.03.01 - default (control), wildcards are turned off
        ok 2 - 09.03.02 - default (control), wildcards are turned off
        1..2
    ok 61 - 09.03 - wildcards in deeper levels # time=3.063ms
    
    # Subtest: 09.04 - wildcards in deeper levels within arrays
        ok 1 - 09.04.01
        ok 2 - 09.04.02
        ok 3 - 09.04.03
        ok 4 - 09.04.04
        ok 5 - 09.04.05
        1..5
    ok 62 - 09.04 - wildcards in deeper levels within arrays # time=4.443ms
    
    1..62
    # time=900.88ms
ok 1 - test/test.js # time=900.88ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - expect truthy value
        1..1
    ok 1 - UMD build works fine # time=10.286ms
    
    1..1
    # time=19.161ms
ok 2 - test/umd-test.js # time=19.161ms

1..2
# time=7180.423ms
