TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - getKeysetSync() - throws when there's no input
        ok 1 - expected to throw
        1..1
    ok 1 - 01.01 - getKeysetSync() - throws when there's no input # time=7.176ms
    
    # Subtest: 01.02 - getKeysetSync() - throws when input is not an array
        ok 1 - expected to throw
        1..1
    ok 2 - 01.02 - getKeysetSync() - throws when input is not an array # time=2.214ms
    
    # Subtest: 01.03 - getKeysetSync() - throws when input array is empty
        ok 1 - expected to throw
        1..1
    ok 3 - 01.03 - getKeysetSync() - throws when input array is empty # time=1.936ms
    
    # Subtest: 01.04 - getKeysetSync() - throws when input array contains not only plain objects
        ok 1 - expected to throw
        1..1
    ok 4 - 01.04 - getKeysetSync() - throws when input array contains not only plain objects # time=4.447ms
    
    # Subtest: 01.05 - getKeysetSync() - calculates - three objects - default placeholder
        ok 1 - 01.05
        1..1
    ok 5 - 01.05 - getKeysetSync() - calculates - three objects - default placeholder # time=5.63ms
    
    # Subtest: 01.06 - getKeysetSync() - calculates - three objects - custom placeholder
        ok 1 - 01.06.01
        ok 2 - 01.06.02
        ok 3 - 01.06.03
        1..3
    ok 6 - 01.06 - getKeysetSync() - calculates - three objects - custom placeholder # time=10.134ms
    
    # Subtest: 01.07 - getKeysetSync() - settings argument is not a plain object - throws
        ok 1 - expected to throw
        1..1
    ok 7 - 01.07 - getKeysetSync() - settings argument is not a plain object - throws # time=2.134ms
    
    # Subtest: 01.08 - getKeysetSync() - multiple levels of nested arrays
        ok 1 - 01.08
        1..1
    ok 8 - 01.08 - getKeysetSync() - multiple levels of nested arrays # time=4.932ms
    
    # Subtest: 01.09 - getKeysetSync() - objects that are directly in values
        ok 1 - 01.09.01
        ok 2 - 01.09.02
        1..2
    ok 9 - 01.09 - getKeysetSync() - objects that are directly in values # time=3.893ms
    
    # Subtest: 01.10 - getKeysetSync() - deeper level arrays containing only strings
        ok 1 - 01.10.01
        1..1
    ok 10 - 01.10 - getKeysetSync() - deeper level arrays containing only strings # time=2.622ms
    
    # Subtest: 01.11 - getKeysetSync() - deeper level array with string vs false
        ok 1 - 01.11 - if arrays contain any strings, result is empty array
        1..1
    ok 11 - 01.11 - getKeysetSync() - deeper level array with string vs false # time=2.303ms
    
    # Subtest: 01.12 - getKeysetSync() - two deeper level arrays with strings
        ok 1 - 01.12 - if arrays contain any strings, result is empty array
        1..1
    ok 12 - 01.12 - getKeysetSync() - two deeper level arrays with strings # time=2.768ms
    
    # Subtest: 01.13 - getKeysetSync() - two deeper level arrays with mixed contents
        ok 1 - 01.13 - plain object vs string
        1..1
    ok 13 - 01.13 - getKeysetSync() - two deeper level arrays with mixed contents # time=3.253ms
    
    # Subtest: 01.14 - getKeysetSync() - two deeper level arrays with plain objects
        ok 1 - 01.14.01 - object vs object
        ok 2 - 01.14.02 - object vs object
        ok 3 - 01.14.03 - object vs object
        ok 4 - 01.14.04 - object vs object
        1..4
    ok 14 - 01.14 - getKeysetSync() - two deeper level arrays with plain objects # time=9.376ms
    
    # Subtest: 02.01 - enforceKeysetSync() - enforces a simple schema
        ok 1 - 02.01
        1..1
    ok 15 - 02.01 - enforceKeysetSync() - enforces a simple schema # time=4.436ms
    
    # Subtest: 02.02 - enforceKeysetSync() - enforces a more complex schema
        ok 1 - 02.02 - .getKeysetSync
        ok 2 - 02.02.01 - .enforceKeysetSync
        ok 3 - 02.02.02 - .enforceKeysetSync
        ok 4 - 02.02.03 - .enforceKeysetSync
        1..4
    ok 16 - 02.02 - enforceKeysetSync() - enforces a more complex schema # time=13.646ms
    
    # Subtest: 02.03 - enforceKeysetSync() - enforces a schema involving arrays
        ok 1 - 02.03 - .getKeysetSync
        ok 2 - 02.03.01 - .enforceKeysetSync
        ok 3 - 02.03.02 - .enforceKeysetSync
        1..3
    ok 17 - 02.03 - enforceKeysetSync() - enforces a schema involving arrays # time=10.605ms
    
    # Subtest: 02.04 - enforceKeysetSync() - another set involving arrays
        ok 1 - 02.04
        1..1
    ok 18 - 02.04 - enforceKeysetSync() - another set involving arrays # time=2.534ms
    
    # Subtest: 02.05 - enforceKeysetSync() - deep-nested arrays
        ok 1 - 02.05
        1..1
    ok 19 - 02.05 - enforceKeysetSync() - deep-nested arrays # time=7.053ms
    
    # Subtest: 02.06 - enforceKeysetSync() - enforces a schema involving arrays
        ok 1 - 02.06.01 - .getKeysetSync
        ok 2 - 02.06.02 - .enforceKeysetSync
        ok 3 - 02.06.03 - .enforceKeysetSync
        1..3
    ok 20 - 02.06 - enforceKeysetSync() - enforces a schema involving arrays # time=3.421ms
    
    # Subtest: 02.07 - enforceKeysetSync() - multiple objects within an array
        ok 1 - 02.07
        1..1
    ok 21 - 02.07 - enforceKeysetSync() - multiple objects within an array # time=5.315ms
    
    # Subtest: 02.08 - enforceKeysetSync() - multiple levels of arrays
        ok 1 - 02.08
        1..1
    ok 22 - 02.08 - enforceKeysetSync() - multiple levels of arrays # time=3.085ms
    
    # Subtest: 02.09 - enforceKeysetSync() - array vs string clashes
        ok 1 - 02.09
        1..1
    ok 23 - 02.09 - enforceKeysetSync() - array vs string clashes # time=2.196ms
    
    # Subtest: 02.10 - enforceKeysetSync() - all inputs missing - throws
        ok 1 - expected to throw
        1..1
    ok 24 - 02.10 - enforceKeysetSync() - all inputs missing - throws # time=1.6ms
    
    # Subtest: 02.11 - enforceKeysetSync() - second input arg missing - throws
        ok 1 - expected to throw
        1..1
    ok 25 - 02.11 - enforceKeysetSync() - second input arg missing - throws # time=1.428ms
    
    # Subtest: 02.12 - enforceKeysetSync() - second input arg is not a plain obj - throws
        ok 1 - expected to throw
        1..1
    ok 26 - 02.12 - enforceKeysetSync() - second input arg is not a plain obj - throws # time=1.56ms
    
    # Subtest: 02.13 - enforceKeysetSync() - first input arg is not a plain obj - throws
        ok 1 - expected to throw
        1..1
    ok 27 - 02.13 - enforceKeysetSync() - first input arg is not a plain obj - throws # time=1.392ms
    
    # Subtest: 02.14 - enforceKeysetSync() - array over empty array
        ok 1 - 02.14.01
        ok 2 - 02.14.02
        ok 3 - 02.14.03
        1..3
    ok 28 - 02.14 - enforceKeysetSync() - array over empty array # time=5.911ms
    
    # Subtest: 02.15.01 - enforceKeysetSync() - opts
        ok 1 - 02.15.01
        1..1
    ok 29 - 02.15.01 - enforceKeysetSync() - opts # time=11.931ms
    
    # Subtest: 02.15.02 - enforceKeysetSync() - opts
        ok 1 - 02.15.02 - opts-targeted key is absent
        1..1
    ok 30 - 02.15.02 - enforceKeysetSync() - opts # time=2.041ms
    
    # Subtest: 02.15.03 - enforceKeysetSync() - opts off
        ok 1 - 02.15.03
        1..1
    ok 31 - 02.15.03 - enforceKeysetSync() - opts off # time=7.905ms
    
    # Subtest: 02.16 - enforceKeysetSync() - opts.doNotFillThesePathsIfTheyContainPlaceholders is wrong
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 32 - 02.16 - enforceKeysetSync() - opts.doNotFillThesePathsIfTheyContainPlaceholders is wrong # time=2.118ms
    
    # Subtest: 02.17 - enforceKeysetSync() - opts.useNullAsExplicitFalse
        ok 1 - 02.17.01 - default behaviour
        ok 2 - 02.17.02 - off via opts
        1..2
    ok 33 - 02.17 - enforceKeysetSync() - opts.useNullAsExplicitFalse # time=2.6ms
    
    # Subtest: 03.01 - enforceKeysetSync() - does not mutate the input args
        ok 1 - (unnamed test)
        ok 2 - 03.01
        1..2
    ok 34 - 03.01 - enforceKeysetSync() - does not mutate the input args # time=11.604ms
    
    # Subtest: 04.01 - noNewKeysSync() - BAU
        ok 1 - 04.01.01 - no new keys
        ok 2 - 04.01.02 - new key, b
        1..2
    ok 35 - 04.01 - noNewKeysSync() - BAU # time=7.908ms
    
    # Subtest: 04.02 - noNewKeysSync() - objects within arrays within objects
        ok 1 - 04.02.01 - same key set, just values differ
        ok 2 - 04.02.02 - less keys
        ok 3 - 04.02.03 - key c
        1..3
    ok 36 - 04.02 - noNewKeysSync() - objects within arrays within objects # time=6.235ms
    
    # Subtest: 04.03 - noNewKeysSync() - various throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        1..5
    ok 37 - 04.03 - noNewKeysSync() - various throws # time=5.386ms
    
    # Subtest: 05.01 - findUnusedSync() - single-level plain objects
        ok 1 - 05.01.01 - running on defaults
        ok 2 - 05.01.02 - not normalised is fine as well
        1..2
    ok 38 - 05.01 - findUnusedSync() - single-level plain objects # time=3.731ms
    
    # Subtest: 05.02 - findUnusedSync() - multiple-level plain objects
        ok 1 - 05.02.01 - multiple levels, two objects, two unused keys, defaults
        ok 2 - 05.02.02 - not normalised, see third and fourth args, not normalised objects
        1..2
    ok 39 - 05.02 - findUnusedSync() - multiple-level plain objects # time=8.808ms
    
    # Subtest: 05.03 - findUnusedSync() - double-nested arrays
        ok 1 - 05.03.01
        ok 2 - 05.03.02 - value false vs values as arrays - in the context of unused-ness
        1..2
    ok 40 - 05.03 - findUnusedSync() - double-nested arrays # time=4.544ms
    
    # Subtest: 05.04 - findUnusedSync() - works on empty arrays
        ok 1 - 05.04.01
        ok 2 - 05.04.02
        ok 3 - 05.04.03
        1..3
    ok 41 - 05.04 - findUnusedSync() - works on empty arrays # time=2.849ms
    
    # Subtest: 05.05 - findUnusedSync() - various throws
        ok 1 - expected to throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        1..3
    ok 42 - 05.05 - findUnusedSync() - various throws # time=2.543ms
    
    # Subtest: 05.06 - findUnusedSync() - case of empty array within an array
        ok 1 - 05.06.01 - normal
        ok 2 - 05.06.02 - not normalised
        1..2
    ok 43 - 05.06 - findUnusedSync() - case of empty array within an array # time=3.346ms
    
    # Subtest: 05.07 - findUnusedSync() - case of empty array within an array
        ok 1 - 05.07.01 - normalised
        ok 2 - 05.07.02 - not normalised. Now that there are three inputs (even two of them empty-ish) result is the key c
        1..2
    ok 44 - 05.07 - findUnusedSync() - case of empty array within an array # time=2.696ms
    
    # Subtest: 05.08 - findUnusedSync() - objects containing objects (2 in total)
        ok 1 - 05.08.01
        ok 2 - 05.08.02
        ok 3 - 05.08.03 - not normalised
        1..3
    ok 45 - 05.08 - findUnusedSync() - objects containing objects (2 in total) # time=38.367ms
    
    # Subtest: 05.09 - findUnusedSync() - objects containing objects (3 in total)
        ok 1 - 05.09.01 - normalised, on default placeholder
        ok 2 - 05.09.02 - not normalised, on default placeholder
        1..2
    ok 46 - 05.09 - findUnusedSync() - objects containing objects (3 in total) # time=27.661ms
    
    # Subtest: 05.10 - findUnusedSync() - objects containing objects, mixed with arrays
        ok 1 - 05.10.01
        ok 2 - 05.10.02 - even deeper
        ok 3 - 05.10.03 - even deeper plus not normalised in deeper levels
        1..3
    ok 47 - 05.10 - findUnusedSync() - objects containing objects, mixed with arrays # time=35.373ms
    
    # Subtest: 05.11 - findUnusedSync() - array contents are not objects/arrays
        ok 1 - 05.11.01 - topmost level, Booleans
        ok 2 - 05.11.02 - topmost level, strings
        ok 3 - 05.11.03 - topmost level, empty plain objects
        1..3
    ok 48 - 05.11 - findUnusedSync() - array contents are not objects/arrays # time=2.644ms
    
    # Subtest: 05.12 - findUnusedSync() - array > single object > array > unused inside
        ok 1 - 05.12.01 - topmost array has a single object
        ok 2 - 05.12.02 - topmost array has multiple objects
        1..2
    ok 49 - 05.12 - findUnusedSync() - array > single object > array > unused inside # time=13.97ms
    
    # Subtest: 05.13 - findUnusedSync() - simple case of not normalised input
        ok 1 - 05.13 - default placeholder
        1..1
    ok 50 - 05.13 - findUnusedSync() - simple case of not normalised input # time=3.067ms
    
    # Subtest: 05.14 - findUnusedSync() - opts.comments
        ok 1 - 05.14.01 - defaults recognise the comment substring within the key
        ok 2 - 05.14.02 - ignores comment fields because they match default value
        ok 3 - 05.14.03 - falsey opts.comments - instruction to turn it off
        ok 4 - 05.14.04 - falsey opts.comments - instruction to turn it off
        ok 5 - 05.14.05 - falsey opts.comments - instruction to turn it off
        ok 6 - 05.14.06 - falsey opts.comments - instruction to turn it off
        ok 7 - 05.14.07 - falsey opts.comments - instruction to turn it off
        ok 8 - expected to throw
        ok 9 - expected to throw
        ok 10 - expected to throw
        ok 11 - expected to throw
        1..11
    ok 51 - 05.14 - findUnusedSync() - opts.comments # time=9.171ms
    
    # Subtest: 06.01 - sortAllObjectsSync() - plain object
        ok 1 - should not be equivalent
        ok 2 - 06.01
        1..2
    ok 52 - 06.01 - sortAllObjectsSync() - plain object # time=2.25ms
    
    # Subtest: 06.02 - sortAllObjectsSync() - non-sortable input types
        ok 1 - 06.02.01
        ok 2 - 06.02.02
        ok 3 - 06.02.03
        ok 4 - 06.02.04
        ok 5 - 06.02.05
        1..5
    ok 53 - 06.02 - sortAllObjectsSync() - non-sortable input types # time=3.432ms
    
    # Subtest: 06.03 - sortAllObjectsSync() - object-array-object
        ok 1 - 06.03
        1..1
    ok 54 - 06.03 - sortAllObjectsSync() - object-array-object # time=1.645ms
    
    # Subtest: 06.04 - sortAllObjectsSync() - object very deep
        ok 1 - 06.04
        1..1
    ok 55 - 06.04 - sortAllObjectsSync() - object very deep # time=4.146ms
    
    # Subtest: 06.05 - sortAllObjectsSync() - nested case
        ok 1 - 06.05.01
        ok 2 - 06.05.02
        1..2
    ok 56 - 06.05 - sortAllObjectsSync() - nested case # time=1.857ms
    
    # Subtest: 06.06 - sortAllObjectsSync() - nested case
        ok 1 - should be equal
        1..1
    ok 57 - 06.06 - sortAllObjectsSync() - nested case # time=2.137ms
    
    # Subtest: 07.01 - does not mutate input args: enforceKeysetSync()
        ok 1 - (unnamed test)
        ok 2 - should be equal
        1..2
    ok 58 - 07.01 - does not mutate input args: enforceKeysetSync() # time=1.737ms
    
    # Subtest: 07.02 - does not mutate input args: noNewKeysSync()
        ok 1 - (unnamed test)
        ok 2 - should be equal
        1..2
    ok 59 - 07.02 - does not mutate input args: noNewKeysSync() # time=1.695ms
    
    # Subtest: 07.03 - does not mutate input args: sortAllObjectsSync()
        ok 1 - (unnamed test)
        ok 2 - should be equal
        1..2
    ok 60 - 07.03 - does not mutate input args: sortAllObjectsSync() # time=1.727ms
    
    # Subtest: 08.01 - getKeyset() - throws when there's no input
        ok 1 - expected to throw
        1..1
    ok 61 - 08.01 - getKeyset() - throws when there's no input # time=1.379ms
    
    # Subtest: 08.02 - getKeyset() - throws when input is not an array of promises
        ok 1 - expected to throw
        1..1
    ok 62 - 08.02 - getKeyset() - throws when input is not an array of promises # time=1.363ms
    
    # Subtest: 08.03 - getKeyset() - resolves to a rejected promise when input array contains not only plain objects
        ok 1 - ok
        1..1
    ok 63 - 08.03 - getKeyset() - resolves to a rejected promise when input array contains not only plain objects # time=104.137ms
    
    # Subtest: 08.04 - getKeyset() - calculates - three objects - default placeholder
        ok 1 - 08.04
        1..1
    ok 64 - 08.04 - getKeyset() - calculates - three objects - default placeholder # time=2.453ms
    
    # Subtest: 08.05 - getKeyset() - calculates - three objects - custom placeholder
        ok 1 - 08.05.01
        ok 2 - 08.05.02
        ok 3 - 08.05.03
        1..3
    ok 65 - 08.05 - getKeyset() - calculates - three objects - custom placeholder # time=4.725ms
    
    # Subtest: 08.06 - getKeyset() - settings argument is not a plain object - throws
        ok 1 - expected to throw
        1..1
    ok 66 - 08.06 - getKeyset() - settings argument is not a plain object - throws # time=1.365ms
    
    # Subtest: 08.07 - getKeyset() - multiple levels of nested arrays
        ok 1 - 08.07
        1..1
    ok 67 - 08.07 - getKeyset() - multiple levels of nested arrays # time=2.242ms
    
    # Subtest: 08.08 - getKeyset() - objects that are directly in values
        ok 1 - 08.08.01
        ok 2 - 08.08.02
        1..2
    ok 68 - 08.08 - getKeyset() - objects that are directly in values # time=3.068ms
    
    # Subtest: 08.09 - getKeyset() - deeper level arrays containing only strings
        ok 1 - 08.09
        1..1
    ok 69 - 08.09 - getKeyset() - deeper level arrays containing only strings # time=1.827ms
    
    # Subtest: 08.10 - getKeyset() - deeper level array with string vs false
        ok 1 - 08.10 - if arrays contain any strings, result is empty array
        1..1
    ok 70 - 08.10 - getKeyset() - deeper level array with string vs false # time=1.891ms
    
    # Subtest: 08.11 - getKeyset() - two deeper level arrays with strings
        ok 1 - 08.11 - if arrays contain any strings, result is empty array
        1..1
    ok 71 - 08.11 - getKeyset() - two deeper level arrays with strings # time=1.952ms
    
    # Subtest: 08.12 - getKeyset() - two deeper level arrays with mixed contents
        ok 1 - 08.12 - plain object vs string
        1..1
    ok 72 - 08.12 - getKeyset() - two deeper level arrays with mixed contents # time=4.236ms
    
    # Subtest: 08.13 - getKeyset() - two deeper level arrays with plain objects
        ok 1 - 08.13.01 - object vs object
        ok 2 - 08.13.02 - object vs object
        ok 3 - 08.13.03 - object vs object
        ok 4 - 08.13.04 - object vs object
        1..4
    ok 73 - 08.13 - getKeyset() - two deeper level arrays with plain objects # time=7.298ms
    
    # Subtest: 09.01 - enforceKeyset() - enforces a simple schema
        ok 1 - 09.01
        1..1
    ok 74 - 09.01 - enforceKeyset() - enforces a simple schema # time=2.187ms
    
    # Subtest: 09.02 - enforceKeyset() - enforces a more complex schema
        ok 1 - 09.02.00 - .getKeyset itself
        ok 2 - 09.02.01 - .enforceKeyset
        ok 3 - 09.02.02 - .enforceKeyset
        ok 4 - 09.02.03 - .enforceKeyset
        1..4
    ok 75 - 09.02 - enforceKeyset() - enforces a more complex schema # time=4.689ms
    
    # Subtest: 09.03 - enforceKeyset() - enforces a schema involving arrays
        ok 1 - 09.03 - .getKeyset
        ok 2 - 09.03.01 - .enforceKeyset
        ok 3 - 09.03.02 - .enforceKeyset
        1..3
    ok 76 - 09.03 - enforceKeyset() - enforces a schema involving arrays # time=5.562ms
    
    # Subtest: 09.04 - enforceKeyset() - another set involving arrays
        ok 1 - 09.04
        1..1
    ok 77 - 09.04 - enforceKeyset() - another set involving arrays # time=2.18ms
    
    # Subtest: 09.05 - enforceKeyset() - deep-nested arrays
        ok 1 - 09.05
        1..1
    ok 78 - 09.05 - enforceKeyset() - deep-nested arrays # time=4.901ms
    
    # Subtest: 09.06 - enforceKeyset() - enforces a schema involving arrays
        ok 1 - 09.06.01 - .getKeyset
        ok 2 - 09.06.02 - .enforceKeyset
        ok 3 - 09.06.03 - .enforceKeyset
        1..3
    ok 79 - 09.06 - enforceKeyset() - enforces a schema involving arrays # time=3.241ms
    
    # Subtest: 09.07 - enforceKeyset() - multiple objects within an array
        ok 1 - 09.07
        1..1
    ok 80 - 09.07 - enforceKeyset() - multiple objects within an array # time=2.859ms
    
    # Subtest: 09.08 - enforceKeyset() - multiple levels of arrays
        ok 1 - 09.08
        1..1
    ok 81 - 09.08 - enforceKeyset() - multiple levels of arrays # time=5.215ms
    
    # Subtest: 09.09 - enforceKeyset() - array vs string clashes
        ok 1 - 09.09
        1..1
    ok 82 - 09.09 - enforceKeyset() - array vs string clashes # time=2.12ms
    
    # Subtest: 09.10 - enforceKeyset() - all inputs missing - resolves to rejected promise
        ok 1 - expected to throw
        1..1
    ok 83 - 09.10 - enforceKeyset() - all inputs missing - resolves to rejected promise # time=1.359ms
    
    # Subtest: 09.11 - enforceKeyset() - second input arg missing - resolves to rejected promise
        ok 1 - expected to throw
        1..1
    ok 84 - 09.11 - enforceKeyset() - second input arg missing - resolves to rejected promise # time=1.31ms
    
    # Subtest: 09.12 - enforceKeyset() - second input arg is not a plain obj - resolves to rejected promise
        ok 1 - ok
        1..1
    ok 85 - 09.12 - enforceKeyset() - second input arg is not a plain obj - resolves to rejected promise # time=1.343ms
    
    # Subtest: 09.13 - enforceKeyset() - first input arg is not a plain obj - resolves to rejected promise
        ok 1 - ok
        1..1
    ok 86 - 09.13 - enforceKeyset() - first input arg is not a plain obj - resolves to rejected promise # time=1.298ms
    
    # Subtest: 09.14 - enforceKeyset() - array over empty array
        ok 1 - 09.14.01
        ok 2 - 09.14.02
        ok 3 - 09.14.03
        1..3
    ok 87 - 09.14 - enforceKeyset() - array over empty array # time=7.149ms
    
    # Subtest: 09.15 - enforceKeyset() - wrong opts - resolves to rejected promise
        ok 1 - expect rejected Promise
        1..1
    ok 88 - 09.15 - enforceKeyset() - wrong opts - resolves to rejected promise # time=2.598ms
    
    # Subtest: 09.16 - enforceKeyset() - opts.useNullAsExplicitFalse
        ok 1 - 09.16.01 - defaults - null is explicit false
        ok 2 - 09.16.02 - off via the opts
        1..2
    ok 89 - 09.16 - enforceKeyset() - opts.useNullAsExplicitFalse # time=2.624ms
    
    1..89
    # time=984.779ms
ok 1 - test/test.js # time=984.779ms

1..1
# time=3839.428ms
