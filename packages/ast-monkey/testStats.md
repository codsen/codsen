TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - find - throws when there's no input
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 1 - 01.01 - find - throws when there's no input # time=9.907ms
    
    # Subtest: 01.02 - get -  throws when there's no input
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 2 - 01.02 - get -  throws when there's no input # time=3.318ms
    
    # Subtest: 01.03 - set -  throws when there's no input
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 3 - 01.03 - set -  throws when there's no input # time=2.766ms
    
    # Subtest: 01.04 - drop - throws when there's no input
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 4 - 01.04 - drop - throws when there's no input # time=2.73ms
    
    # Subtest: 01.05 - info - throws when there's no input
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 5 - 01.05 - info - throws when there's no input # time=2.467ms
    
    # Subtest: 01.06 - get/set - throws when opts.index is missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        1..4
    ok 6 - 01.06 - get/set - throws when opts.index is missing # time=3.515ms
    
    # Subtest: 01.07 - get/set/drop - throws when opts.index is not a natural number (both string or number)
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        1..6
    ok 7 - 01.07 - get/set/drop - throws when opts.index is not a natural number (both string or number) # time=8.737ms
    
    # Subtest: 01.08 - set - throws when opts.key and opts.val are missing
        ok 1 - expected to throw
        1..1
    ok 8 - 01.08 - set - throws when opts.key and opts.val are missing # time=1.584ms
    
    # Subtest: 01.09 - find - throws when opts.key and opts.val are missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 9 - 01.09 - find - throws when opts.key and opts.val are missing # time=2.546ms
    
    # Subtest: 01.10 - del - throws when opts.key and opts.val are missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 10 - 01.10 - del - throws when opts.key and opts.val are missing # time=2.242ms
    
    # Subtest: 01.10 - drop - throws when there's no index
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 11 - 01.10 - drop - throws when there's no index # time=2.092ms
    
    # Subtest: 02.01.pt1 - finds by key in a simple object #1
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        1..3
    ok 12 - 02.01.pt1 - finds by key in a simple object #1 # time=10.593ms
    
    # Subtest: 02.01.pt2 - finds by key in a simple object, with glob
        ok 1 - 02.01.04
        ok 2 - 02.01.05
        ok 3 - 02.01.06
        1..3
    ok 13 - 02.01.pt2 - finds by key in a simple object, with glob # time=7.403ms
    
    # Subtest: 02.02.pt1 - finds by key in a simple object #2
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        1..3
    ok 14 - 02.02.pt1 - finds by key in a simple object #2 # time=7.092ms
    
    # Subtest: 02.02.pt2 - finds by key in a simple object, with glob
        ok 1 - 02.02.04
        ok 2 - 02.02.05
        ok 3 - 02.02.06
        1..3
    ok 15 - 02.02.pt2 - finds by key in a simple object, with glob # time=6.077ms
    
    # Subtest: 02.03.pt1 - does not find by key in a simple object
        ok 1 - 02.03.01
        1..1
    ok 16 - 02.03.pt1 - does not find by key in a simple object # time=10.602ms
    
    # Subtest: 02.03.pt2 - does not find by key in a simple object, with glob
        ok 1 - 02.03.02
        1..1
    ok 17 - 02.03.pt2 - does not find by key in a simple object, with glob # time=4.229ms
    
    # Subtest: 02.04.pt1 - finds by key in simple arrays #1
        ok 1 - 02.04.01
        1..1
    ok 18 - 02.04.pt1 - finds by key in simple arrays #1 # time=2.754ms
    
    # Subtest: 02.04.pt2 - finds by key in simple arrays, with glob
        ok 1 - 02.04.02
        1..1
    ok 19 - 02.04.pt2 - finds by key in simple arrays, with glob # time=2.875ms
    
    # Subtest: 02.05.pt1 - finds by key in simple arrays #2
        ok 1 - 02.05.01
        1..1
    ok 20 - 02.05.pt1 - finds by key in simple arrays #2 # time=2.631ms
    
    # Subtest: 02.05.pt2 - finds by key in simple arrays, with globs
        ok 1 - 02.05.02
        1..1
    ok 21 - 02.05.pt2 - finds by key in simple arrays, with globs # time=2.774ms
    
    # Subtest: 02.06.pt1 - finds by key in simple arrays #3
        ok 1 - 02.06.01
        1..1
    ok 22 - 02.06.pt1 - finds by key in simple arrays #3 # time=4.867ms
    
    # Subtest: 02.06.pt2 - finds by key in simple arrays, with glob
        ok 1 - 02.06.02
        1..1
    ok 23 - 02.06.pt2 - finds by key in simple arrays, with glob # time=14.06ms
    
    # Subtest: 02.07.pt1 - does not find by key in simple arrays
        ok 1 - 02.07.01
        1..1
    ok 24 - 02.07.pt1 - does not find by key in simple arrays # time=2.194ms
    
    # Subtest: 02.07.pt2 - does not find by key in simple arrays, with globs
        ok 1 - 02.07.02
        1..1
    ok 25 - 02.07.pt2 - does not find by key in simple arrays, with globs # time=2.844ms
    
    # Subtest: 02.08 - finds by key in simple arrays #3
        ok 1 - 02.08
        1..1
    ok 26 - 02.08 - finds by key in simple arrays #3 # time=2.319ms
    
    # Subtest: 02.09 - finds by value in a simple object - string
        ok 1 - 02.09
        1..1
    ok 27 - 02.09 - finds by value in a simple object - string # time=2.271ms
    
    # Subtest: 02.10.pt1 - finds by value in a simple object - object
        ok 1 - 02.10.01
        1..1
    ok 28 - 02.10.pt1 - finds by value in a simple object - object # time=7.014ms
    
    # Subtest: 02.10.pt2 - finds by value in a simple object - object, with globs
        ok 1 - 02.10.02
        1..1
    ok 29 - 02.10.pt2 - finds by value in a simple object - object, with globs # time=5.473ms
    
    # Subtest: 02.11 - finds by value in a simple object - array
        ok 1 - 02.11
        1..1
    ok 30 - 02.11 - finds by value in a simple object - array # time=2.458ms
    
    # Subtest: 02.12 - finds by value in a simple object - empty array
        ok 1 - 02.12
        1..1
    ok 31 - 02.12 - finds by value in a simple object - empty array # time=10.687ms
    
    # Subtest: 02.13 - finds by value in a simple object - empty object
        ok 1 - 02.13
        1..1
    ok 32 - 02.13 - finds by value in a simple object - empty object # time=14.046ms
    
    # Subtest: 02.14 - finds multiple nested keys by key and value in mixed #1
        ok 1 - 02.14
        1..1
    ok 33 - 02.14 - finds multiple nested keys by key and value in mixed #1 # time=3.509ms
    
    # Subtest: 02.15 - finds multiple nested keys by key and value in mixed #2
        ok 1 - 02.15.01 - Null is a valid value! It's not found in the input!
        ok 2 - 02.15.02 - hardcoded undefined as a value
        ok 3 - 02.15.03 - default behaviour, val is not hardcoded - should be the same as null
        ok 4 - 02.15.04 - finds only array instances and omits object-ones
        ok 5 - 02.15.05 - finds only array instances and omits object-ones
        ok 6 - 02.15.06 - finds only array instances and omits object-ones
        1..6
    ok 34 - 02.15 - finds multiple nested keys by key and value in mixed #2 # time=15.402ms
    
    # Subtest: 02.16 - like 02.15, but with sneaky objects where values are null, tricking the algorithm
        ok 1 - 02.16.01 - default behaviour, val is hardcoded `undefined`
        ok 2 - 02.16.02 - default behaviour, val is not hardcoded - should be the same as null
        ok 3 - 02.16.03 - finds only array instances and omits object-ones
        ok 4 - 02.16.04 - finds only array instances and omits object-ones
        ok 5 - 02.16.05 - finds only array instances and omits object-ones
        1..5
    ok 35 - 02.16 - like 02.15, but with sneaky objects where values are null, tricking the algorithm # time=13.157ms
    
    # Subtest: 03.01 - gets from a simple object #1
        ok 1 - 03.01
        1..1
    ok 36 - 03.01 - gets from a simple object #1 # time=2.307ms
    
    # Subtest: 03.02 - gets from a simple object #2
        ok 1 - 03.02
        1..1
    ok 37 - 03.02 - gets from a simple object #2 # time=2.277ms
    
    # Subtest: 03.03 - gets from a simple object #3
        ok 1 - 03.03
        1..1
    ok 38 - 03.03 - gets from a simple object #3 # time=2.014ms
    
    # Subtest: 03.04 - does not get
        ok 1 - 03.04
        1..1
    ok 39 - 03.04 - does not get # time=1.881ms
    
    # Subtest: 03.05 - gets from a simple array
        ok 1 - 03.05
        1..1
    ok 40 - 03.05 - gets from a simple array # time=1.816ms
    
    # Subtest: 03.06 - gets from mixed nested things, index string
        ok 1 - 03.06
        1..1
    ok 41 - 03.06 - gets from mixed nested things, index string # time=2.134ms
    
    # Subtest: 03.07 - gets from a simple object, index is string
        ok 1 - 03.07
        1..1
    ok 42 - 03.07 - gets from a simple object, index is string # time=4.131ms
    
    # Subtest: 03.08 - index is real number as string - throws
        ok 1 - expected to throw
        1..1
    ok 43 - 03.08 - index is real number as string - throws # time=1.577ms
    
    # Subtest: 04.01 - sets in mixed nested things #1
        ok 1 - 04.01
        1..1
    ok 44 - 04.01 - sets in mixed nested things #1 # time=2.645ms
    
    # Subtest: 04.02 - sets in mixed nested things #2
        ok 1 - 04.02
        1..1
    ok 45 - 04.02 - sets in mixed nested things #2 # time=2.323ms
    
    # Subtest: 04.03 - does not set
        ok 1 - 04.03
        1..1
    ok 46 - 04.03 - does not set # time=2.357ms
    
    # Subtest: 04.04 - sets when only key given instead, index as string
        ok 1 - 04.04
        1..1
    ok 47 - 04.04 - sets when only key given instead, index as string # time=2.743ms
    
    # Subtest: 04.05 - sets when only key given, numeric index
        ok 1 - 04.05
        1..1
    ok 48 - 04.05 - sets when only key given, numeric index # time=15.644ms
    
    # Subtest: 04.06 - throws when inputs are wrong
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        1..4
    ok 49 - 04.06 - throws when inputs are wrong # time=1.747ms
    
    # Subtest: 05.01 - drops in mixed things #1 - index string
        ok 1 - 05.01
        1..1
    ok 50 - 05.01 - drops in mixed things #1 - index string # time=27.874ms
    
    # Subtest: 05.02 - drops in mixed things #2 - index number
        ok 1 - 05.02
        1..1
    ok 51 - 05.02 - drops in mixed things #2 - index number # time=13.833ms
    
    # Subtest: 05.03 - does not drop - zero
        ok 1 - 05.03
        1..1
    ok 52 - 05.03 - does not drop - zero # time=22.114ms
    
    # Subtest: 05.04 - does not drop - 99
        ok 1 - 05.04
        1..1
    ok 53 - 05.04 - does not drop - 99 # time=3.578ms
    
    # Subtest: 05.05 - drops in mixed things #3 - index is not a natural number
        ok 1 - expected to throw
        1..1
    ok 54 - 05.05 - drops in mixed things #3 - index is not a natural number # time=1.571ms
    
    # Subtest: 06.01 - info
        ok 1 - 06.01
        1..1
    ok 55 - 06.01 - info # time=0.937ms
    
    # Subtest: 07.01 - deletes by key, multiple findings
        ok 1 - 07.01.01
        ok 2 - 07.01.02 - only array
        ok 3 - 07.01.03
        ok 4 - 07.01.04
        1..4
    ok 56 - 07.01 - deletes by key, multiple findings # time=6.898ms
    
    # Subtest: 07.02 - deletes by key, multiple findings at the same branch
        ok 1 - 07.02
        1..1
    ok 57 - 07.02 - deletes by key, multiple findings at the same branch # time=2.099ms
    
    # Subtest: 07.03 - can't find any to delete by key
        ok 1 - 07.03
        1..1
    ok 58 - 07.03 - can't find any to delete by key # time=2.452ms
    
    # Subtest: 07.04 - deletes by value only from mixed
        ok 1 - 07.04
        1..1
    ok 59 - 07.04 - deletes by value only from mixed # time=2.229ms
    
    # Subtest: 07.05 - deletes by value only from arrays
        ok 1 - 07.05
        1..1
    ok 60 - 07.05 - deletes by value only from arrays # time=2.059ms
    
    # Subtest: 07.06 - deletes by key and value from mixed
        ok 1 - 07.06
        1..1
    ok 61 - 07.06 - deletes by key and value from mixed # time=2.546ms
    
    # Subtest: 07.07 - does not delete by key and value from arrays
        ok 1 - 07.07
        1..1
    ok 62 - 07.07 - does not delete by key and value from arrays # time=1.989ms
    
    # Subtest: 07.08 - deletes by key and value from mixed
        ok 1 - 07.08
        1..1
    ok 63 - 07.08 - deletes by key and value from mixed # time=2.242ms
    
    # Subtest: 07.09 - sneaky-one: object keys have values as null
        ok 1 - 07.09.01
        ok 2 - 07.09.02 - only array
        ok 3 - 07.09.03
        1..3
    ok 64 - 07.09 - sneaky-one: object keys have values as null # time=4.495ms
    
    # Subtest: 08.01 - arrayFirstOnly - nested arrays
        ok 1 - 08.01
        1..1
    ok 65 - 08.01 - arrayFirstOnly - nested arrays # time=1.712ms
    
    # Subtest: 08.02 - arrayFirstOnly - arrays within arrays only, no obj
        ok 1 - 08.02
        1..1
    ok 66 - 08.02 - arrayFirstOnly - arrays within arrays only, no obj # time=1.5ms
    
    # Subtest: 08.03 - arrayFirstOnly - nested arrays #2
        ok 1 - 08.03
        1..1
    ok 67 - 08.03 - arrayFirstOnly - nested arrays #2 # time=1.637ms
    
    # Subtest: 08.04 - arrayFirstOnly leaves objects alone
        ok 1 - 08.04
        1..1
    ok 68 - 08.04 - arrayFirstOnly leaves objects alone # time=1.742ms
    
    # Subtest: 08.05 - arrayFirstOnly leaves strings alone
        ok 1 - 08.05
        1..1
    ok 69 - 08.05 - arrayFirstOnly leaves strings alone # time=1.371ms
    
    1..69
    # time=788.063ms
ok 1 - test/test.js # time=788.063ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=19.445ms
    
    1..1
    # time=25.798ms
ok 2 - test/umd-test.js # time=25.798ms

1..2
# time=7421.33ms
