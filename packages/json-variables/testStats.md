TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - basic throws related to wrong input
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - empty plain object
        ok 5 - expected to throw
        1..5
    ok 1 - 01.01 - basic throws related to wrong input # time=14.451ms
    
    # Subtest: 01.02 - throws when options heads and/or tails are empty
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 2 - 01.02 - throws when options heads and/or tails are empty # time=4.375ms
    
    # Subtest: 01.03 - throws when data container key lookup is enabled and container tails are given blank
        ok 1 - expected to throw
        ok 2 - data store is off, so empty opts.dataContainerIdentifierTails is fine
        ok 3 - expected to throw
        1..3
    ok 3 - 01.03 - throws when data container key lookup is enabled and container tails are given blank # time=5.364ms
    
    # Subtest: 01.04 - throws when heads and tails are equal
        ok 1 - expected to throw
        1..1
    ok 4 - 01.04 - throws when heads and tails are equal # time=1.21ms
    
    # Subtest: 01.05 - throws when input is not a plain object
        ok 1 - expected to throw
        1..1
    ok 5 - 01.05 - throws when input is not a plain object # time=1.78ms
    
    # Subtest: 01.06 - throws when keys contain variables
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        1..4
    ok 6 - 01.06 - throws when keys contain variables # time=8.826ms
    
    # Subtest: 01.07 - throws when there are unequal number of marker heads and tails
        ok 1 - 01.07.01
        ok 2 - 01.07.02
        1..2
    ok 7 - 01.07 - throws when there are unequal number of marker heads and tails # time=4.235ms
    
    # Subtest: 01.08 - throws when data is missing
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        1..4
    ok 8 - 01.08 - throws when data is missing # time=4.598ms
    
    # Subtest: 01.09 - throws when data container lookup is turned off and var is missing
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - data store is off, so empty opts.dataContainerIdentifierTails is fine
        ok 4 - resolves to topmost root level key because data store is off
        ok 5 - resolves to datastore, not using value at the root
        1..5
    ok 9 - 01.09 - throws when data container lookup is turned off and var is missing # time=13.295ms
    
    # Subtest: 01.10 - not throws when data container name append is given empty, but data container lookup is turned off
        ok 1 - expected to not throw
        1..1
    ok 10 - 01.10 - not throws when data container name append is given empty, but data container lookup is turned off # time=1.917ms
    
    # Subtest: 01.11 - throws when data container name append is given empty
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        1..4
    ok 11 - 01.11 - throws when data container name append is given empty # time=3.319ms
    
    # Subtest: 01.13 - throws when opts.wrapHeadsWith is customised to anything other than string
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 12 - 01.13 - throws when opts.wrapHeadsWith is customised to anything other than string # time=2.442ms
    
    # Subtest: 01.14 - opts.wrapHeadsWith does not affect failing resolving
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 13 - 01.14 - opts.wrapHeadsWith does not affect failing resolving # time=2.3ms
    
    # Subtest: 01.15 - throws when opts.wrapTailsWith is customised to anything other than string
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 14 - 01.15 - throws when opts.wrapTailsWith is customised to anything other than string # time=2.405ms
    
    # Subtest: 01.16 - not throws when opts.wrapTailsWith is customised to an empty string
        ok 1 - expected to not throw
        1..1
    ok 15 - 01.16 - not throws when opts.wrapTailsWith is customised to an empty string # time=1.971ms
    
    # Subtest: 01.17 - throws when opts.heads is not string
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 16 - 01.17 - throws when opts.heads is not string # time=5.658ms
    
    # Subtest: 01.18 - throws when opts.tails is not string
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 17 - 01.18 - throws when opts.tails is not string # time=2.656ms
    
    # Subtest: 01.19 - throws when all args are missing
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 18 - 01.19 - throws when all args are missing # time=2.037ms
    
    # Subtest: 01.20 - throws when key references itself
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        1..4
    ok 19 - 01.20 - throws when key references itself # time=3.815ms
    
    # Subtest: 01.21 - throws when key references itself
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 20 - 01.21 - throws when key references itself # time=3.639ms
    
    # Subtest: 01.22 - throws when key references key which references itself
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 21 - 01.22 - throws when key references key which references itself # time=3.319ms
    
    # Subtest: 01.23 - throws when there's recursion (with distraction)
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        ok 7 - expected to throw
        ok 8 - should match pattern provided
        1..8
    ok 22 - 01.23 - throws when there's recursion (with distraction) # time=9.488ms
    
    # Subtest: 01.24 - throws when there's a longer recursion
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 23 - 01.24 - throws when there's a longer recursion # time=2.722ms
    
    # Subtest: 01.27 - throws when opts.heads and opts.headsNoWrap are customised to be equal
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        1..6
    ok 24 - 01.27 - throws when opts.heads and opts.headsNoWrap are customised to be equal # time=4.286ms
    
    # Subtest: 01.28 - throws when opts.tails and opts.tailsNoWrap are customised to be equal
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        1..6
    ok 25 - 01.28 - throws when opts.tails and opts.tailsNoWrap are customised to be equal # time=12.478ms
    
    # Subtest: 01.29 - empty nowraps
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        ok 7 - expected to throw
        ok 8 - should match pattern provided
        1..8
    ok 26 - 01.29 - empty nowraps # time=17.374ms
    
    # Subtest: 01.30 - equal nowraps
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        1..6
    ok 27 - 01.30 - equal nowraps # time=9.665ms
    
    # Subtest: 01.31 - throws there's simple recursion loop in array
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        ok 7 - expected to throw
        ok 8 - should match pattern provided
        ok 9 - expected to throw
        ok 10 - should match pattern provided
        ok 11 - expected to throw
        ok 12 - should match pattern provided
        1..12
    ok 28 - 01.31 - throws there's simple recursion loop in array # time=14.273ms
    
    # Subtest: 01.32 - throws referencing what does not exist
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        1..4
    ok 29 - 01.32 - throws referencing what does not exist # time=11.79ms
    
    # Subtest: 01.33 - throws when referencing the multi-level object keys that don't exist
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        1..6
    ok 30 - 01.33 - throws when referencing the multi-level object keys that don't exist # time=6.201ms
    
    # Subtest: 01.34 - throws when opts are given truthy but not a plain object
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 31 - 01.34 - throws when opts are given truthy but not a plain object # time=2.467ms
    
    # Subtest: 02.01 - two variables in an object's key
        ok 1 - 02.01
        1..1
    ok 32 - 02.01 - two variables in an object's key # time=2.677ms
    
    # Subtest: 02.02 - two variables with paths in an object's key
        ok 1 - 02.02 - defaults + querying object contents
        1..1
    ok 33 - 02.02 - two variables with paths in an object's key # time=3.249ms
    
    # Subtest: 02.03 - two variables, with wrapping
        ok 1 - 02.03 - custom wrappers
        1..1
    ok 34 - 02.03 - two variables, with wrapping # time=2.246ms
    
    # Subtest: 02.04 - variables with paths being wrapped
        ok 1 - 02.04 - custom wrappers + multi-level
        1..1
    ok 35 - 02.04 - variables with paths being wrapped # time=2.333ms
    
    # Subtest: 02.05 - custom heads and tails
        ok 1 - 02.05 - custom heads/tails
        1..1
    ok 36 - 02.05 - custom heads and tails # time=2.502ms
    
    # Subtest: 02.06 - custom heads and tails being wrapped
        ok 1 - 02.06 - custom heads/tails + multi-level
        1..1
    ok 37 - 02.06 - custom heads and tails being wrapped # time=1.604ms
    
    # Subtest: 02.07 - whitespace within custom heads and tails
        ok 1 - 02.07 - custom heads/tails, some whitespace inside of them
        1..1
    ok 38 - 02.07 - whitespace within custom heads and tails # time=5.924ms
    
    # Subtest: 02.08 - whitespace within variables containing paths and custom heads/tails
        ok 1 - 02.08 - custom heads/tails, some whitespace inside of them + multi-level
        1..1
    ok 39 - 02.08 - whitespace within variables containing paths and custom heads/tails # time=1.959ms
    
    # Subtest: 02.09 - some values are equal to heads or tails
        ok 1 - 02.09 - some keys have heads/tails exactly - defaults
        1..1
    ok 40 - 02.09 - some values are equal to heads or tails # time=3.162ms
    
    # Subtest: 02.10 - opts.noSingleMarkers - off
        ok 1 - 02.10 - some keys have heads/tails exactly - hardcoded defaults
        1..1
    ok 41 - 02.10 - opts.noSingleMarkers - off # time=5.709ms
    
    # Subtest: 02.11 - opts.noSingleMarkers - on
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 42 - 02.11 - opts.noSingleMarkers - on # time=3.654ms
    
    # Subtest: 02.12 - opts.noSingleMarkers - off - more throw tests
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 43 - 02.12 - opts.noSingleMarkers - off - more throw tests # time=3.923ms
    
    # Subtest: 02.13 - custom heads/tails, values equal to them are present in data
        ok 1 - 02.13 - some keys have heads/tails only - custom heads/tails, defaults
        1..1
    ok 44 - 02.13 - custom heads/tails, values equal to them are present in data # time=2.939ms
    
    # Subtest: 02.14 - custom heads/tails - noSingleMarkers = false
        ok 1 - 02.14 - some keys have heads/tails only - custom heads/tails, hardcoded defaults
        1..1
    ok 45 - 02.14 - custom heads/tails - noSingleMarkers = false # time=3.031ms
    
    # Subtest: 02.15 - value in an array
        ok 1 - 02.15
        1..1
    ok 46 - 02.15 - value in an array # time=3.264ms
    
    # Subtest: 02.16 - data stores #1
        ok 1 - 02.16.01
        ok 2 - 02.16.02
        ok 3 - 02.16.03 - data stash and multi-level, all default
        ok 4 - 02.16.04 - data stash and multi-level, default markers, custom wrap
        1..4
    ok 47 - 02.16 - data stores #1 # time=28.111ms
    
    # Subtest: 02.17 - top-level key and data stash clash
        ok 1 - 02.17.01 - default, no wrap
        ok 2 - 02.17.02 - wrap
        ok 3 - 02.17.03 - root key would take precedence, but it's of a wrong format and therefore algorithm chooses data storage instead (which is correct type)
        ok 4 - 02.17.03 - mix, one var resolved from root, another from data store
        1..4
    ok 48 - 02.17 - top-level key and data stash clash # time=24.541ms
    
    # Subtest: 02.18 - emoji in values
        ok 1 - 02.18
        1..1
    ok 49 - 02.18 - emoji in values # time=9.102ms
    
    # Subtest: 02.19 - emoji in keys
        ok 1 - 02.19
        1..1
    ok 50 - 02.19 - emoji in keys # time=3.377ms
    
    # Subtest: 02.20 - emoji in variable keys
        ok 1 - 02.20
        1..1
    ok 51 - 02.20 - emoji in variable keys # time=2.943ms
    
    # Subtest: 02.21 - empty strings in the input AST
        ok 1 - 02.21 - defaults
        1..1
    ok 52 - 02.21 - empty strings in the input AST # time=11.081ms
    
    # Subtest: 02.22 - fetching variables from parent node's level
        ok 1 - 02.22 - defaults
        1..1
    ok 53 - 02.22 - fetching variables from parent node's level # time=4.861ms
    
    # Subtest: 02.23 - fetching variables from two levels above
        ok 1 - 02.23 - defaults
        1..1
    ok 54 - 02.23 - fetching variables from two levels above # time=3.48ms
    
    # Subtest: 02.24 - fetching variables from root, three levels above
        ok 1 - 02.24 - defaults
        1..1
    ok 55 - 02.24 - fetching variables from root, three levels above # time=6.3ms
    
    # Subtest: 02.25 - fetching variables from parent node's level data store
        ok 1 - 02.25 - defaults
        1..1
    ok 56 - 02.25 - fetching variables from parent node's level data store # time=3.69ms
    
    # Subtest: 02.26 - fetching variables from data store two levels above
        ok 1 - 02.26 - defaults
        1..1
    ok 57 - 02.26 - fetching variables from data store two levels above # time=4.004ms
    
    # Subtest: 02.27 - fetching variables from data store as high as the root
        ok 1 - 02.27 - defaults
        1..1
    ok 58 - 02.27 - fetching variables from data store as high as the root # time=7.394ms
    
    # Subtest: 02.28 - three level references
        ok 1 - 02.28
        1..1
    ok 59 - 02.28 - three level references # time=7.057ms
    
    # Subtest: 02.29 - resolves to a string
        ok 1 - 02.29.01
        ok 2 - 02.29.02
        1..2
    ok 60 - 02.29 - resolves to a string # time=7.474ms
    
    # Subtest: 03.01 - two-level variables resolved
        ok 1 - 03.01.01 - two redirects, querying strings
        ok 2 - 03.01.02 - two redirects, querying multi-level
        1..2
    ok 61 - 03.01 - two-level variables resolved # time=8.411ms
    
    # Subtest: 03.02 - two-level redirects, backwards order
        ok 1 - 03.02.01
        ok 2 - 03.02.02
        1..2
    ok 62 - 03.02 - two-level redirects, backwards order # time=5.345ms
    
    # Subtest: 03.03 - two-level variables resolved, mixed
        ok 1 - 03.03.01
        ok 2 - 03.03.02
        1..2
    ok 63 - 03.03 - two-level variables resolved, mixed # time=5.643ms
    
    # Subtest: 03.04 - three-level variables resolved
        ok 1 - 03.04.01
        ok 2 - 03.04.02
        1..2
    ok 64 - 03.04 - three-level variables resolved # time=8.073ms
    
    # Subtest: 03.05 - another three-level var resolving
        ok 1 - 03.05
        1..1
    ok 65 - 03.05 - another three-level var resolving # time=4.516ms
    
    # Subtest: 03.06 - multiple variables resolved
        ok 1 - 03.06
        ok 2 - expected to throw
        ok 3 - should match pattern provided
        ok 4 - expected to throw
        ok 5 - should match pattern provided
        1..5
    ok 66 - 03.06 - multiple variables resolved # time=23.34ms
    
    # Subtest: 03.07 - preventDoubleWrapping: on & off
        ok 1 - 03.07.01
        ok 2 - 03.07.02
        ok 3 - 03.07.03
        ok 4 - 03.07.04
        ok 5 - 03.07.05 - more real-life case
        ok 6 - 03.07.06 - more real-life case
        ok 7 - 03.07.07 - object multi-level values
        1..7
    ok 67 - 03.07 - preventDoubleWrapping: on & off # time=41.074ms
    
    # Subtest: 03.08 - empty variable
        ok 1 - 03.08 - no value is needed if variable is empty - it's resolved to empty str
        1..1
    ok 68 - 03.08 - empty variable # time=12.202ms
    
    # Subtest: 04.01 - wrap flipswitch works
        ok 1 - 04.01.01
        ok 2 - 04.01.02
        1..2
    ok 69 - 04.01 - wrap flipswitch works # time=9.921ms
    
    # Subtest: 04.02 - global wrap flipswitch and dontWrapVars combo
        ok 1 - 04.02.01
        ok 2 - 04.02.02
        ok 3 - 04.02.03
        ok 4 - 04.02.04
        1..4
    ok 70 - 04.02 - global wrap flipswitch and dontWrapVars combo # time=8.898ms
    
    # Subtest: 04.03 - opts.dontWrapVars
        ok 1 - 04.03.02
        ok 2 - 04.03.03
        ok 3 - 04.03.04
        ok 4 - 04.03.05
        ok 5 - expected to throw
        1..5
    ok 71 - 04.03 - opts.dontWrapVars # time=14.405ms
    
    # Subtest: 04.04 - opts.dontWrapVars, real key names
        ok 1 - 04.04.01
        ok 2 - 04.04.02
        ok 3 - 04.04.03
        1..3
    ok 72 - 04.04 - opts.dontWrapVars, real key names # time=6.887ms
    
    # Subtest: 04.05 - multiple dontWrapVars values
        ok 1 - 04.05.01 - still wraps because child variable call ("subtitle") is not excluded
        1..1
    ok 73 - 04.05 - multiple dontWrapVars values # time=5.693ms
    
    # Subtest: 04.06 - one level var querying and whitelisting
        ok 1 - 04.06.01
        ok 2 - 04.06.02
        1..2
    ok 74 - 04.06 - one level var querying and whitelisting # time=6.31ms
    
    # Subtest: 04.07 - opts.dontWrapVars, real key names
        ok 1 - 04.07.01
        ok 2 - 04.07.02
        ok 3 - 04.07.03
        1..3
    ok 75 - 04.07 - opts.dontWrapVars, real key names # time=9.223ms
    
    # Subtest: 05.01 - arrays referencing values which are strings
        ok 1 - 05.01
        1..1
    ok 76 - 05.01 - arrays referencing values which are strings # time=3.619ms
    
    # Subtest: 05.02 - arrays referencing values which are arrays
        ok 1 - 05.02
        1..1
    ok 77 - 05.02 - arrays referencing values which are arrays # time=4.582ms
    
    # Subtest: 05.03 - arrays, whitelisting as string
        ok 1 - 05.03.01 - base - no ignores
        ok 2 - 05.03.02 - string whitelist startsWith
        1..2
    ok 78 - 05.03 - arrays, whitelisting as string # time=15.825ms
    
    # Subtest: 05.04 - arrays, whitelisting as array #1
        ok 1 - 05.04.01
        ok 2 - 05.04.02 - two ignores in an array
        ok 3 - 05.04.03 - two ignores in an array startsWith
        ok 4 - 05.04.04 - two ignores in an array, endsWith
        1..4
    ok 79 - 05.04 - arrays, whitelisting as array #1 # time=9.689ms
    
    # Subtest: 05.05 - arrays, whitelisting as array #2
        ok 1 - 05.05.01 - two ignores in an array, data store
        ok 2 - 05.05.02 - does not wrap SUB
        ok 3 - 05.05.02 - does not wrap SUB
        ok 4 - 05.05.03 - wraps SUB
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        1..6
    ok 80 - 05.05 - arrays, whitelisting as array #2 # time=30.164ms
    
    # Subtest: 06.01 - UTIL > single markers in the values
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - expected to not throw
        ok 6 - expected to not throw
        ok 7 - expected to throw
        ok 8 - should match pattern provided
        1..8
    ok 81 - 06.01 - UTIL > single markers in the values # time=10.82ms
    
    # Subtest: 07.01 - opts.headsNoWrap & opts.tailsNoWrap work on single level vars
        ok 1 - 07.01.01 - defaults
        ok 2 - 07.01.02 - custom opts.headsNoWrap & opts.tailsNoWrap
        ok 3 - 07.01.03 - left side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap
        ok 4 - 07.01.04 - right side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap
        1..4
    ok 82 - 07.01 - opts.headsNoWrap & opts.tailsNoWrap work on single level vars # time=7.112ms
    
    # Subtest: 07.02 - opts.headsNoWrap & opts.tailsNoWrap work on multi-level vars
        ok 1 - 07.02.01 - two level redirects, default opts.headsNoWrap & opts.tailsNoWrap, matching var key lengths
        ok 2 - 07.02.02 - two level redirects, default opts.headsNoWrap & opts.tailsNoWrap, mismatching var key lengths
        ok 3 - 07.02.03 - two level redirects, custom everything
        1..3
    ok 83 - 07.02 - opts.headsNoWrap & opts.tailsNoWrap work on multi-level vars # time=24.305ms
    
    # Subtest: 07.03 - triple linking with resolving arrays and trailing new lines
        ok 1 - 07.03.01 - basic, checking are trailing line breaks retained
        ok 2 - 07.03.02 - line breaks on the values coming into array
        ok 3 - 07.03.03 - line breaks at array-level
        ok 4 - 07.03.04 - like #02 but with wrapping
        ok 5 - 07.03.05
        ok 6 - 07.03.06 - simple version
        ok 7 - 07.03.07 - real-life version
        1..7
    ok 84 - 07.03 - triple linking with resolving arrays and trailing new lines # time=129.321ms
    
    # Subtest: 08.01 - Boolean values inserted into a middle of a string
        ok 1 - 08.01.01 - mix of Bools and strings resolve to the value of the first encountered Bool
        ok 2 - 08.01.02
        ok 3 - 08.01.03
        ok 4 - 08.01.04
        1..4
    ok 85 - 08.01 - Boolean values inserted into a middle of a string # time=31.092ms
    
    # Subtest: 08.02 - Boolean values inserted instead of other values, in whole
        ok 1 - 08.02.01
        ok 2 - 08.02.02
        ok 3 - 08.02.03
        1..3
    ok 86 - 08.02 - Boolean values inserted instead of other values, in whole # time=15.59ms
    
    # Subtest: 08.03 - null values inserted into a middle of a string
        ok 1 - 08.03
        1..1
    ok 87 - 08.03 - null values inserted into a middle of a string # time=9.282ms
    
    # Subtest: 08.04 - null values inserted instead of other values, in whole
        ok 1 - 08.04.01
        ok 2 - 08.04.02 - spaces around a value which would resolve to null
        ok 3 - 08.04.03 - using non-wrapping heads/tails
        ok 4 - 08.04.04 - like #3 but with extra whitespace
        ok 5 - 08.04.05 - doesn't wrap null
        ok 6 - 08.04.06 - doesn't wrap null
        1..6
    ok 88 - 08.04 - null values inserted instead of other values, in whole # time=8.458ms
    
    # Subtest: 09.01 - opts.resolveToBoolIfAnyValuesContainBool, Bools and Strings mix
        ok 1 - 09.01.01 - false - default (opts on)
        ok 2 - 09.01.02 - false - hardcoded (opts on)
        ok 3 - 09.01.03 - false - opts off
        ok 4 - 09.01.04 - relying on default, opts.resolveToFalseIfAnyValuesContainBool does not matter
        ok 5 - 09.01.05 - Bools hardcoded default, not forcing false
        ok 6 - 09.01.06 - Bools hardcoded default, forcing false
        1..6
    ok 89 - 09.01 - opts.resolveToBoolIfAnyValuesContainBool, Bools and Strings mix # time=5.916ms
    
    # Subtest: 10.01 - variables resolve being in deeper levels
        ok 1 - 10.01 - defaults
        1..1
    ok 90 - 10.01 - variables resolve being in deeper levels # time=2.145ms
    
    # Subtest: 10.02 - deeper level variables not found, bubble up and are found
        ok 1 - 10.02 - defaults
        1..1
    ok 91 - 10.02 - deeper level variables not found, bubble up and are found # time=2.47ms
    
    # Subtest: 10.03 - third level resolves at its level
        ok 1 - 10.03 - defaults
        1..1
    ok 92 - 10.03 - third level resolves at its level # time=2.161ms
    
    # Subtest: 10.04 - third level falls back to root
        ok 1 - 10.04 - defaults
        1..1
    ok 93 - 10.04 - third level falls back to root # time=2.293ms
    
    # Subtest: 10.05 - third level uses data container key
        ok 1 - 10.05 - defaults
        1..1
    ok 94 - 10.05 - third level uses data container key # time=2.442ms
    
    # Subtest: 10.06 - third level uses data container key, but there's nothing there so falls back to root (successfully)
        ok 1 - 10.06 - defaults
        1..1
    ok 95 - 10.06 - third level uses data container key, but there's nothing there so falls back to root (successfully) # time=2.502ms
    
    # Subtest: 10.07 - third level uses data container key, but there's nothing there so falls back to root data container (successfully)
        ok 1 - 10.07 - defaults - root has normal container, a_data, named by topmost parent key
        ok 2 - 10.07.02 - root has container, named how deepest data contaienr should be named
        1..2
    ok 96 - 10.07 - third level uses data container key, but there's nothing there so falls back to root data container (successfully) # time=4.189ms
    
    # Subtest: 11.01 - two-level querying, normal keys in the root
        ok 1 - 11.01.01 - running on default notation
        1..1
    ok 97 - 11.01 - two-level querying, normal keys in the root # time=3.943ms
    
    # Subtest: 11.02 - two-level querying, normal keys in the root + wrapping & opts
        ok 1 - 11.02.01 - didn't wrap either, first level caught
        ok 2 - 11.02.02 - didn't wrap one, second level caught
        ok 3 - 11.02.03 - didn't wrap either, second levels caught
        ok 4 - 11.02.04 - didn't wrap either because of %%- the non-wrapping notation.
        ok 5 - 11.02.05
        1..5
    ok 98 - 11.02 - two-level querying, normal keys in the root + wrapping & opts # time=19.341ms
    
    # Subtest: 11.03 - opts.throwWhenNonStringInsertedInString
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to not throw
        ok 4 - 11.03.03 - no path, values are variables in whole
        ok 5 - 11.03.04 - control
        ok 6 - 11.03.05 - opts
        1..6
    ok 99 - 11.03 - opts.throwWhenNonStringInsertedInString # time=6.862ms
    
    # Subtest: 11.04 - multi-level + from array + root data store + ignores
        ok 1 - 11.04 - two ignores in an array, data store, multi-level
        1..1
    ok 100 - 11.04 - multi-level + from array + root data store + ignores # time=7.548ms
    
    # Subtest: 12.01 - surrounding underscores - sneaky similarity with wrong side brackets #1
        ok 1 - 12.01
        1..1
    ok 101 - 12.01 - surrounding underscores - sneaky similarity with wrong side brackets #1 # time=2.496ms
    
    # Subtest: 12.02 - surrounding underscores - sneaky similarity with wrong side brackets #2
        ok 1 - 12.02
        1..1
    ok 102 - 12.02 - surrounding underscores - sneaky similarity with wrong side brackets #2 # time=5.296ms
    
    # Subtest: 12.03 - surrounding underscores - sneaky similarity with wrong side brackets #3
        ok 1 - 12.03
        1..1
    ok 103 - 12.03 - surrounding underscores - sneaky similarity with wrong side brackets #3 # time=11.178ms
    
    # Subtest: 12.04 - surrounding underscores - sneaky similarity with wrong side brackets #4
        ok 1 - 12.04
        1..1
    ok 104 - 12.04 - surrounding underscores - sneaky similarity with wrong side brackets #4 # time=2.651ms
    
    # Subtest: 12.05 - surrounding dashes - sneaky similarity with wrong side brackets #1
        ok 1 - 12.05
        1..1
    ok 105 - 12.05 - surrounding dashes - sneaky similarity with wrong side brackets #1 # time=3.709ms
    
    # Subtest: 12.06 - surrounding dashes - sneaky similarity with wrong side brackets #2
        ok 1 - 12.06
        1..1
    ok 106 - 12.06 - surrounding dashes - sneaky similarity with wrong side brackets #2 # time=2.144ms
    
    1..106
    # time=1720.275ms
ok 1 - test/test.js # time=1720.275ms

1..1
# time=4716.996ms
