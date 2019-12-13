TAP version 13
ok 1 - test/bau-test.js # time=231.438ms {
    # Subtest: 01.01 - simple objects, no key clash
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        1..3
    ok 1 - 01.01 - simple objects, no key clash # time=11.905ms
    
    # Subtest: 01.02 - different types, no key clash
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        1..2
    ok 2 - 01.02 - different types, no key clash # time=3.713ms
    
    # Subtest: 01.03 - string vs string value clash
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        1..2
    ok 3 - 01.03 - string vs string value clash # time=1.941ms
    
    # Subtest: 01.04 - array vs array value clash
        ok 1 - 01.04.01
        1..1
    ok 4 - 01.04 - array vs array value clash # time=1.579ms
    
    # Subtest: 01.05 - object vs object value clash
        ok 1 - 01.05
        1..1
    ok 5 - 01.05 - object vs object value clash # time=1.603ms
    
    # Subtest: 01.06 - array vs empty array
        ok 1 - 01.06.01
        ok 2 - 01.06.02
        1..2
    ok 6 - 01.06 - array vs empty array # time=2.011ms
    
    # Subtest: 01.07 - object vs empty array - object wins
        ok 1 - 01.07.01
        ok 2 - 01.07.02
        1..2
    ok 7 - 01.07 - object vs empty array - object wins # time=2.331ms
    
    # Subtest: 01.08 - string vs empty array - string wins
        ok 1 - 01.08.01
        ok 2 - 01.08.02
        1..2
    ok 8 - 01.08 - string vs empty array - string wins # time=1.784ms
    
    # Subtest: 01.09 - empty array vs empty array
        ok 1 - 01.09.01
        ok 2 - 01.09.02
        1..2
    ok 9 - 01.09 - empty array vs empty array # time=1.499ms
    
    # Subtest: 01.10 - string vs array
        ok 1 - 01.10.01
        ok 2 - 01.10.02
        ok 3 - 01.10.03
        ok 4 - 01.10.04
        1..4
    ok 10 - 01.10 - string vs array # time=7.589ms
    
    # Subtest: 01.11 - string vs object
        ok 1 - 01.11.01
        ok 2 - 01.11.02
        ok 3 - 01.11.03
        ok 4 - 01.11.04
        1..4
    ok 11 - 01.11 - string vs object # time=2.775ms
    
    # Subtest: 01.12 - object vs array
        ok 1 - 01.12.01
        ok 2 - 01.12.02
        ok 3 - 01.12.03
        ok 4 - 01.12.04
        1..4
    ok 12 - 01.12 - object vs array # time=3.92ms
    
    # Subtest: 01.13 - empty object vs empty array
        ok 1 - 01.13.01
        ok 2 - 01.13.02
        ok 3 - 01.13.03
        ok 4 - 01.13.04
        1..4
    ok 13 - 01.13 - empty object vs empty array # time=2.879ms
    
    # Subtest: 01.14 - empty string vs object
        ok 1 - 01.14.01
        ok 2 - 01.14.02
        ok 3 - 01.14.03
        ok 4 - 01.14.04
        1..4
    ok 14 - 01.14 - empty string vs object # time=3.448ms
    
    # Subtest: 01.15 - object values are arrays and get merged
        ok 1 - 01.15.01
        1..1
    ok 15 - 01.15 - object values are arrays and get merged # time=2.439ms
    
    # Subtest: 01.16 - object values are objects and get merged
        ok 1 - 01.16.01
        ok 2 - 01.16.02
        ok 3 - 01.16.03
        ok 4 - 01.16.04
        1..4
    ok 16 - 01.16 - object values are objects and get merged # time=4.296ms
    
    # Subtest: 01.17 - merging booleans
        ok 1 - 01.17.01
        ok 2 - 01.17.02
        1..2
    ok 17 - 01.17 - merging booleans # time=1.851ms
    
    # Subtest: 01.18 - merging undefined
        ok 1 - 01.18.01
        ok 2 - 01.18.02
        1..2
    ok 18 - 01.18 - merging undefined # time=1.554ms
    
    # Subtest: 01.19 - merging null
        ok 1 - 01.19.01
        ok 2 - 01.19.02
        1..2
    ok 19 - 01.19 - merging null # time=1.792ms
    
    # Subtest: 01.20 - boolean vs boolean merge (#78)
        ok 1 - 01.20.01
        ok 2 - 01.20.02
        ok 3 - 01.20.03
        ok 4 - 01.20.04
        ok 5 - 01.20.05
        ok 6 - 01.20.06
        ok 7 - 01.20.07
        ok 8 - 01.20.08
        1..8
    ok 20 - 01.20 - boolean vs boolean merge (#78) # time=4.805ms
    
    # Subtest: 01.21 - boolean vs undefined merge (#80)
        ok 1 - 01.21.01
        ok 2 - 01.21.02
        ok 3 - 01.21.03
        ok 4 - 01.21.04
        1..4
    ok 21 - 01.21 - boolean vs undefined merge (#80) # time=2.338ms
    
    # Subtest: 01.22 - null vs empty object merge (#84)
        ok 1 - 01.22.01
        ok 2 - 01.22.02
        1..2
    ok 22 - 01.22 - null vs empty object merge (#84) # time=1.899ms
    
    # Subtest: 01.23 - null vs. undefined (#90)
        ok 1 - 01.23.01
        ok 2 - 01.23.02
        1..2
    ok 23 - 01.23 - null vs. undefined (#90) # time=1.21ms
    
    # Subtest: 01.24 - no clash, just filling missing values
        ok 1 - 01.24.01
        ok 2 - 01.24.02
        1..2
    ok 24 - 01.24 - no clash, just filling missing values # time=1.574ms
    
    # Subtest: 01.25 - arrays and opts.ignoreKeys
        ok 1 - 01.25.01
        1..1
    ok 25 - 01.25 - arrays and opts.ignoreKeys # time=1.309ms
    
    # Subtest: 01.26 - arrays and opts.ignoreKeys
        ok 1 - 01.26.01
        1..1
    ok 26 - 01.26 - arrays and opts.ignoreKeys # time=1.008ms
    
    1..26
    # time=231.438ms
}

ok 2 - test/opts-cb-test.js # time=78.637ms {
    # Subtest: 18.01 - [33mOPTS[39m - opts.cb - setting hard merge if inputs are Booleans
        ok 1 - 18.01.01 - control, default behaviour (logical OR)
        ok 2 - 18.01.02 - opts.mergeBoolsUsingOrNotAnd (logical AND)
        ok 3 - 18.01.03 - cb overriding all Boolean merges
        ok 4 - 18.01.04 - cb partially overriding opts.ignoreEverything
        ok 5 - 18.01.05 - cb partially overriding opts.mergeBoolsUsingOrNotAnd: false
        1..5
    ok 1 - 18.01 - [33mOPTS[39m - opts.cb - setting hard merge if inputs are Booleans # time=17.828ms
    
    # Subtest: 18.02 - [33mOPTS[39m - opts.cb - setting ignoreAll on input Booleans
        ok 1 - 18.02.01
        ok 2 - 18.02.02
        ok 3 - 18.02.03
        1..3
    ok 2 - 18.02 - [33mOPTS[39m - opts.cb - setting ignoreAll on input Booleans # time=11.13ms
    
    # Subtest: 18.03 - [33mOPTS[39m - opts.cb - using callback to wrap string with other strings
        ok 1 - 18.03.01 - control, default behaviour (logical OR)
        ok 2 - 18.03.02 - wraps if string
        1..2
    ok 3 - 18.03 - [33mOPTS[39m - opts.cb - using callback to wrap string with other strings # time=2.522ms
    
    # Subtest: 18.04 - [33mOPTS[39m - opts.cb - pin the 4th arg values
        ok 1 - 18.04.01 - cb values pinned an object
        ok 2 - 18.04.02 - cb values pinned a key which has a value of array
        ok 3 - (unnamed test)
        1..3
    ok 4 - 18.04 - [33mOPTS[39m - opts.cb - pin the 4th arg values # time=4.976ms
    
    # Subtest: 18.05 - [33mOPTS[39m - opts.cb - using cb's 4th arg to concatenate certain key values during merge
        ok 1 - 18.05.01 - default behaviour, control
        ok 2 - 18.05.02 - cb fourth arg's path info used to override to merge strings
        1..2
    ok 5 - 18.05 - [33mOPTS[39m - opts.cb - using cb's 4th arg to concatenate certain key values during merge # time=2.745ms
    
    # Subtest: 18.06 - [33mOPTS[39m - opts.hardMergeEverything - revisiting deep-level arrays
        ok 1 - 18.06.01
        ok 2 - 18.06.02
        1..2
    ok 6 - 18.06 - [33mOPTS[39m - opts.hardMergeEverything - revisiting deep-level arrays # time=3.435ms
    
    1..6
    # time=78.637ms
}

ok 3 - test/opts-useNullAsExplicitFalse-test.js # time=71.546ms {
    # Subtest: 17.01 - [33mOPTS[39m - opts.useNullAsExplicitFalse, simple merges
        ok 1 - 17.01.01.01 - control, case #79 - false. Null is lower in rank than any Boolean.
        ok 2 - 17.01.01.02 - control, case #79 - true. Null is lower in rank than any Boolean.
        ok 3 - 17.01.02.01 - control, case #88 - false
        ok 4 - 17.01.02.02 - control, case #88 - true
        ok 5 - 17.01.03.01 - null-as-explicit-false, case #79 - false
        ok 6 - 17.01.03.02 - null-as-explicit-false, case #79 - true
        ok 7 - 17.01.04.01 - null-as-explicit-false, case #88 - false
        ok 8 - 17.01.04.02 - null-as-explicit-false, case #88 - true
        1..8
    ok 1 - 17.01 - [33mOPTS[39m - opts.useNullAsExplicitFalse, simple merges # time=12.639ms
    
    # Subtest: 17.02 - [33mOPTS[39m - opts.useNullAsExplicitFalse, null vs. non-Booleans, cases #81-90
        ok 1 - 17.02.01 - #81 - null vs non-empty array
        ok 2 - 17.02.02 - #82 - null vs. empty array
        ok 3 - 17.02.03 - #83 - null vs. non-empty plain object
        ok 4 - 17.02.04 - #84 - null vs. empty plain object
        ok 5 - 17.02.05 - #85 - null vs. non-empty string
        ok 6 - 17.02.06 - #86 - null vs. non-empty string
        ok 7 - 17.02.07 - #87 - null vs. num
        ok 8 - 17.02.08.01 - #88 - null vs. bool, true
        ok 9 - 17.02.08.02 - #88 - null vs. bool, false
        ok 10 - 17.02.09 - #89 - null vs. null
        ok 11 - 17.02.10 - #90 - null vs. null
        1..11
    ok 2 - 17.02 - [33mOPTS[39m - opts.useNullAsExplicitFalse, null vs. non-Booleans, cases #81-90 # time=9.129ms
    
    # Subtest: 17.03 - [33mOPTS[39m - opts.useNullAsExplicitFalse, non-Booleans vs. null, cases #9, 19, 29, 39, 49...99
        ok 1 - 17.03.01 - #9 - null vs non-empty array
        ok 2 - 17.03.02 - #19 - null vs. empty array
        ok 3 - 17.03.03 - #29 - null vs. non-empty plain object
        ok 4 - 17.03.04 - #39 - null vs. empty plain object
        ok 5 - 17.03.05 - #49 - null vs. non-empty string
        ok 6 - 17.03.06 - #59 - null vs. non-empty string
        ok 7 - 17.03.07 - #69 - null vs. num
        ok 8 - 17.03.08.01 - #79 - null vs. bool, true
        ok 9 - 17.03.08.02 - #79 - null vs. bool, false
        ok 10 - 17.03.09 - #89 - null vs. null
        ok 11 - 17.03.10 - #99 - null vs. null
        1..11
    ok 3 - 17.03 - [33mOPTS[39m - opts.useNullAsExplicitFalse, non-Booleans vs. null, cases #9, 19, 29, 39, 49...99 # time=10.888ms
    
    # Subtest: 17.04 - [33mOPTS[39m - opts.hardConcatKeys - basic cases
        ok 1 - 17.04.01
        ok 2 - 17.04.02
        ok 3 - 17.04.03
        ok 4 - 17.04.03
        1..4
    ok 4 - 17.04 - [33mOPTS[39m - opts.hardConcatKeys - basic cases # time=7.562ms
    
    1..4
    # time=71.546ms
}

ok 4 - test/test.js # time=334.774ms {
    # Subtest: 02.01 - missing second arg
        ok 1 - 02.01
        1..1
    ok 1 - 02.01 - missing second arg # time=8.792ms
    
    # Subtest: 02.02 - missing first arg
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        1..2
    ok 2 - 02.02 - missing first arg # time=2.618ms
    
    # Subtest: 02.03 - both args missing - throws
        ok 1 - expected to throw
        1..1
    ok 3 - 02.03 - both args missing - throws # time=1.288ms
    
    # Subtest: 02.04 - various, mixed
        ok 1 - 02.04.01
        ok 2 - 02.04.02
        ok 3 - 02.04.03
        ok 4 - 02.04.04
        ok 5 - 02.04.05
        1..5
    ok 4 - 02.04 - various, mixed # time=2.597ms
    
    # Subtest: 02.05 - third arg is not a plain object - throws
        ok 1 - expected to throw
        1..1
    ok 5 - 02.05 - third arg is not a plain object - throws # time=2.677ms
    
    # Subtest: 03.01 - testing for mutation of the input args
        ok 1 - should be equivalent
        1..1
    ok 6 - 03.01 - testing for mutation of the input args # time=1.752ms
    
    # Subtest: 04.01 - arrays, checking against dupes being added
        ok 1 - 04.01.01
        ok 2 - 04.01.02
        1..2
    ok 7 - 04.01 - arrays, checking against dupes being added # time=4.093ms
    
    # Subtest: 05.01 - merges objects within arrays if keyset and position within array matches
        ok 1 - 05.01.01
        1..1
    ok 8 - 05.01 - merges objects within arrays if keyset and position within array matches # time=1.78ms
    
    # Subtest: 05.02 - concats instead if objects within arrays are in a wrong order
        ok 1 - 05.02
        1..1
    ok 9 - 05.02 - concats instead if objects within arrays are in a wrong order # time=2.065ms
    
    # Subtest: 05.03 - concats instead if objects within arrays are in a wrong order
        ok 1 - 05.03
        1..1
    ok 10 - 05.03 - concats instead if objects within arrays are in a wrong order # time=2.028ms
    
    # Subtest: 05.04 - merges objects within arrays, key sets are a subset of one another
        ok 1 - 05.04
        1..1
    ok 11 - 05.04 - merges objects within arrays, key sets are a subset of one another # time=1.539ms
    
    # Subtest: 05.05 - merges objects within arrays, subset and no match, mixed case
        ok 1 - 05.05
        1..1
    ok 12 - 05.05 - merges objects within arrays, subset and no match, mixed case # time=2.582ms
    
    # Subtest: 05.06 - opts.mergeObjectsOnlyWhenKeysetMatches
        ok 1 - 05.06.01 - mergeObjectsOnlyWhenKeysetMatches = default
        ok 2 - 05.06.02 - mergeObjectsOnlyWhenKeysetMatches = true
        ok 3 - 05.06.03 - mergeObjectsOnlyWhenKeysetMatches = false
        1..3
    ok 13 - 05.06 - opts.mergeObjectsOnlyWhenKeysetMatches # time=3.012ms
    
    # Subtest: 05.07 - README example: opts.mergeObjectsOnlyWhenKeysetMatches
        ok 1 - 05.07.01
        ok 2 - 05.07.02
        1..2
    ok 14 - 05.07 - README example: opts.mergeObjectsOnlyWhenKeysetMatches # time=1.925ms
    
    # Subtest: 06.01 - real world use case
        ok 1 - 06.01
        1..1
    ok 15 - 06.01 - real world use case # time=2.899ms
    
    # Subtest: 06.02 - real world use case, mini
        ok 1 - 06.02
        1..1
    ok 16 - 06.02 - real world use case, mini # time=1.761ms
    
    # Subtest: 07.01 - merges two arrays of equal length
        ok 1 - 07.01
        1..1
    ok 17 - 07.01 - merges two arrays of equal length # time=0.759ms
    
    # Subtest: 07.02 - merges two arrays of different length
        ok 1 - 07.02.01
        ok 2 - 07.02.02
        1..2
    ok 18 - 07.02 - merges two arrays of different length # time=1.109ms
    
    # Subtest: 07.03 - merges non-empty array with an empty array
        ok 1 - 07.03.01
        ok 2 - 07.03.02
        ok 3 - 07.03.03
        ok 4 - 07.03.04
        ok 5 - 07.03.05
        ok 6 - 07.03.06
        1..6
    ok 19 - 07.03 - merges non-empty array with an empty array # time=5.509ms
    
    # Subtest: 08.01 - arrays in objects
        ok 1 - 08.01
        1..1
    ok 20 - 08.01 - arrays in objects # time=1.414ms
    
    # Subtest: 08.02 - arrays in objects, deeper
        ok 1 - 08.02
        1..1
    ok 21 - 08.02 - arrays in objects, deeper # time=0.873ms
    
    # Subtest: 08.03 - objects in arrays in objects
        ok 1 - 08.03
        1..1
    ok 22 - 08.03 - objects in arrays in objects # time=0.989ms
    
    # Subtest: 08.04 - objects in arrays in objects
        ok 1 - 08.04.01 - default
        ok 2 - 08.04.02 - arrays with strings merged into empty arrays
        1..2
    ok 23 - 08.04 - objects in arrays in objects # time=2.071ms
    
    # Subtest: 09.01 - empty string vs boolean #58
        ok 1 - 09.01.01
        ok 2 - 09.01.02
        1..2
    ok 24 - 09.01 - empty string vs boolean #58 # time=0.967ms
    
    # Subtest: 09.02 - empty string vs undefined #59
        ok 1 - 09.02.01
        ok 2 - 09.02.02
        1..2
    ok 25 - 09.02 - empty string vs undefined #59 # time=1.089ms
    
    # Subtest: 09.03 - empty string vs undefined #60
        ok 1 - 09.03.01
        ok 2 - 09.03.02
        1..2
    ok 26 - 09.03 - empty string vs undefined #60 # time=1.368ms
    
    # Subtest: 09.04 - number - #81-90
        ok 1 - 09.04.01
        ok 2 - 09.04.02
        ok 3 - 09.04.03
        ok 4 - 09.04.04
        ok 5 - 09.04.05
        ok 6 - 09.04.06
        1..6
    ok 27 - 09.04 - number - #81-90 # time=2.02ms
    
    # Subtest: 09.05 - empty string vs undefined #60
        ok 1 - 09.05.01
        ok 2 - 09.05.02
        1..2
    ok 28 - 09.05 - empty string vs undefined #60 # time=0.975ms
    
    # Subtest: 10.01 - [33mOPTS[39m - opts.ignoreKeys - basic cases
        ok 1 - 10.01.01 - #1, forward
        ok 2 - 10.01.02 - #1, backward
        ok 3 - 10.01.03 - #2, forward, ignoreKeys as array
        ok 4 - 10.01.04 - #2, backward, ignoreKeys as array
        ok 5 - 10.01.05
        1..5
    ok 29 - 10.01 - [33mOPTS[39m - opts.ignoreKeys - basic cases # time=3.739ms
    
    # Subtest: 10.02 - [33mOPTS[39m - opts.ignoreKeys - multiple keys ignored, multiple merged
        ok 1 - 10.02
        1..1
    ok 30 - 10.02 - [33mOPTS[39m - opts.ignoreKeys - multiple keys ignored, multiple merged # time=1.53ms
    
    # Subtest: 10.03 - [33mOPTS[39m - opts.ignoreKeys - wildcards
        ok 1 - 10.03
        1..1
    ok 31 - 10.03 - [33mOPTS[39m - opts.ignoreKeys - wildcards # time=1.164ms
    
    # Subtest: 10.04 - [33mOPTS[39m - opts.ignoreKeys - wildcard, but not found
        ok 1 - 10.04
        1..1
    ok 32 - 10.04 - [33mOPTS[39m - opts.ignoreKeys - wildcard, but not found # time=1.123ms
    
    # Subtest: 11.01 - [33mOPTS[39m - opts.hardMergeKeys
        ok 1 - 11.01.01 - default behaviour
        ok 2 - 11.01.02 - hardMergeKeys only
        ok 3 - 11.01.03 - hardMergeKeys and ignoreKeys, both
        ok 4 - 11.01.04 - hardMergeKeys and ignoreKeys both at once, both as strings
        1..4
    ok 33 - 11.01 - [33mOPTS[39m - opts.hardMergeKeys # time=4.06ms
    
    # Subtest: 11.02 - [33mOPTS[39m - opts.hardMergeKeys and opts.ignoreKeys together
        ok 1 - 11.02.01
        1..1
    ok 34 - 11.02 - [33mOPTS[39m - opts.hardMergeKeys and opts.ignoreKeys together # time=1.49ms
    
    # Subtest: 11.03 - case #10
        ok 1 - 11.03.01 - default
        ok 2 - 11.03.02.1 - default, objects
        ok 3 - 11.03.02.2 - 11.03.02 opposite order (same res.)
        ok 4 - 11.03.03 - hard merge
        1..4
    ok 35 - 11.03 - case #10 # time=4.145ms
    
    # Subtest: 11.04 - case #91
        ok 1 - 11.04.01 - useless hardMergeKeys setting
        ok 2 - 11.04.02 - checkin the ignores glob
        1..2
    ok 36 - 11.04 - case #91 # time=1.324ms
    
    # Subtest: 11.05 - case #81
        ok 1 - 11.05.01 - useless hardMergeKeys setting
        ok 2 - 11.05.01 - checkin the ignores glob
        1..2
    ok 37 - 11.05 - case #81 # time=1.264ms
    
    # Subtest: 11.06 - case #9 (mirror to #81)
        ok 1 - 11.06.01 - useless hardMergeKeys setting
        1..1
    ok 38 - 11.06 - case #9 (mirror to #81) # time=0.756ms
    
    # Subtest: 11.07 - case #8 and its mirror, #71
        ok 1 - 11.07.01 - #8
        ok 2 - 11.07.01 - #71
        1..2
    ok 39 - 11.07 - case #8 and its mirror, #71 # time=1.202ms
    
    # Subtest: 11.08 - case #7 and its mirror, #61
        ok 1 - 11.08.01 - #7
        ok 2 - 11.08.02 - #61
        ok 3 - 11.08.03 - #7 redundant hardMerge setting
        1..3
    ok 40 - 11.08 - case #7 and its mirror, #61 # time=2.558ms
    
    # Subtest: 11.09 - #27 and its mirror #63 - full obj vs number + hardMerge/ignore
        ok 1 - 11.09.01 - #27
        ok 2 - 11.09.01 - #63
        1..2
    ok 41 - 11.09 - #27 and its mirror #63 - full obj vs number + hardMerge/ignore # time=1.613ms
    
    # Subtest: 11.10 - #23 two full objects
        ok 1 - 11.10.01 - default behaviour
        ok 2 - 11.10.02 - redundant setting
        ok 3 - 11.10.03 - checking ignores
        1..3
    ok 42 - 11.10 - #23 two full objects # time=3.15ms
    
    # Subtest: 12.01 - [33mOPTS[39m - opts.oneToManyArrayObjectMerge
        ok 1 - 12.01.01 - default behaviour will merge first keys and leave second key as it is
        ok 2 - 12.01.02 - same as #01, but swapped order of input arguments. Should not differ except for string merge order.
        ok 3 - 12.01.03 - one-to-many merge, normal argument order
        ok 4 - 12.01.04 - one-to-many merge, opposite arg. order
        1..4
    ok 43 - 12.01 - [33mOPTS[39m - opts.oneToManyArrayObjectMerge # time=3.664ms
    
    # Subtest: 12.02 - [33mOPTS[39m - opts.oneToManyArrayObjectMerge - two-to-many does not work
        ok 1 - 12.02.01 - does not activate when two-to-many found
        1..1
    ok 44 - 12.02 - [33mOPTS[39m - opts.oneToManyArrayObjectMerge - two-to-many does not work # time=1.283ms
    
    # Subtest: 13.01 - [33mOPTS[39m - third argument is not a plain object
        ok 1 - expected to throw
        ok 2 - expected to not throw
        1..2
    ok 45 - 13.01 - [33mOPTS[39m - third argument is not a plain object # time=0.883ms
    
    # Subtest: 13.02 - [33mOPTS[39m - opts.ignoreKeys type checks work
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        1..5
    ok 46 - 13.02 - [33mOPTS[39m - opts.ignoreKeys type checks work # time=2.547ms
    
    # Subtest: 13.03 - [33mOPTS[39m - opts.hardMergeKeys type checks work
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        1..5
    ok 47 - 13.03 - [33mOPTS[39m - opts.hardMergeKeys type checks work # time=2.485ms
    
    # Subtest: 14.01 - objects within arrays
        ok 1 - 14.01.01 - default behaviour
        ok 2 - 14.01.02.01 - customising opts.mergeObjectsOnlyWhenKeysetMatches - one way
        ok 3 - 14.01.02.02 - customising opts.mergeObjectsOnlyWhenKeysetMatches - other way (swapped args of 14.01.02.01)
        ok 4 - 14.01.03.01 - hardMergeKeys: * in per-key settings is the same as global flag
        ok 5 - 14.01.03.02 - ignoreKeys: * in per-key settings is the same as global flag
        ok 6 - 14.01.04 - with mergeObjectsOnlyWhenKeysetMatches=false objects will clash, plus we got hard merge
        ok 7 - 14.01.05 - with mergeObjectsOnlyWhenKeysetMatches=false objects will clash, plus we got hard merge
        1..7
    ok 48 - 14.01 - objects within arrays # time=4.163ms
    
    # Subtest: 15.01 - hard merge on clashing keys only case #1
        ok 1 - 15.01.01 - default behaviour
        ok 2 - 15.01.02 - one-to-many
        ok 3 - 15.01.03 - one to many, string tries override arrays, against the food chain order
        ok 4 - 15.01.04 - hard overwrite, per-key setting
        1..4
    ok 49 - 15.01 - hard merge on clashing keys only case #1 # time=3.191ms
    
    # Subtest: 16.01 - values as arrays that contain strings
        ok 1 - 16.01.01 - default behaviour, different strings
        ok 2 - 16.01.02 - default behaviour, same string
        ok 3 - 16.01.03 - opts.concatInsteadOfMerging
        ok 4 - 16.01.04 - opts.concatInsteadOfMerging pt2.
        ok 5 - 16.01.05 - opts.concatInsteadOfMerging + opts.dedupeStringsInArrayValues
        1..5
    ok 50 - 16.01 - values as arrays that contain strings # time=2.442ms
    
    1..50
    # time=334.774ms
}

1..4
# time=1747.153ms
