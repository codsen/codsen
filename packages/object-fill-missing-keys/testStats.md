TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - filling in missing keys, simple plain object
        ok 1 - 01.01
        1..1
    ok 1 - 01.01 - filling in missing keys, simple plain object # time=11.637ms
    
    # Subtest: 01.02 - filling in missing keys, nested, with arrays
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        1..2
    ok 2 - 01.02 - filling in missing keys, nested, with arrays # time=5.191ms
    
    # Subtest: 01.03 - multiple values, sorting as well
        ok 1 - 01.03
        1..1
    ok 3 - 01.03 - multiple values, sorting as well # time=2.436ms
    
    # Subtest: 01.04 - nested arrays as values (array in schema overwrites Boolean)
        ok 1 - 01.04
        1..1
    ok 4 - 01.04 - nested arrays as values (array in schema overwrites Boolean) # time=2.287ms
    
    # Subtest: 01.05 - more complex nested arrays
        ok 1 - 01.05
        1..1
    ok 5 - 01.05 - more complex nested arrays # time=2.547ms
    
    # Subtest: 01.06 - ridiculously deep nesting
        ok 1 - 01.06
        1..1
    ok 6 - 01.06 - ridiculously deep nesting # time=3.098ms
    
    # Subtest: 01.07 - cheeky case, custom placeholder on schema has value null
        ok 1 - 01.07
        1..1
    ok 7 - 01.07 - cheeky case, custom placeholder on schema has value null # time=1.847ms
    
    # Subtest: 02.01 - array one level-deep
        ok 1 - 02.01
        1..1
    ok 8 - 02.01 - array one level-deep # time=3.289ms
    
    # Subtest: 02.02 - multiple levels of nested arrays
        ok 1 - 02.02
        1..1
    ok 9 - 02.02 - multiple levels of nested arrays # time=2.193ms
    
    # Subtest: 03.01 - string vs array clash
        ok 1 - 03.01
        1..1
    ok 10 - 03.01 - string vs array clash # time=1.966ms
    
    # Subtest: 03.02 - string vs object clash
        ok 1 - 03.02
        1..1
    ok 11 - 03.02 - string vs object clash # time=2.131ms
    
    # Subtest: 03.03 - object vs array clash
        ok 1 - 03.03
        1..1
    ok 12 - 03.03 - object vs array clash # time=2.073ms
    
    # Subtest: 03.04 - array vs empty array
        ok 1 - 03.04
        1..1
    ok 13 - 03.04 - array vs empty array # time=2.298ms
    
    # Subtest: 03.05 - array vs string
        ok 1 - 03.05
        1..1
    ok 14 - 03.05 - array vs string # time=2.159ms
    
    # Subtest: 03.06 - array vs bool
        ok 1 - 03.06
        1..1
    ok 15 - 03.06 - array vs bool # time=1.176ms
    
    # Subtest: 03.06 - multiple levels of nested arrays #1
        ok 1 - 03.06
        1..1
    ok 16 - 03.06 - multiple levels of nested arrays #1 # time=2.274ms
    
    # Subtest: 03.07 - multiple levels of nested arrays #2
        ok 1 - 03.07
        1..1
    ok 17 - 03.07 - multiple levels of nested arrays #2 # time=2.65ms
    
    # Subtest: 04.01 - number as input
        ok 1 - expected to throw
        1..1
    ok 18 - 04.01 - number as input # time=2.427ms
    
    # Subtest: 04.02 - boolean as input
        ok 1 - expected to throw
        1..1
    ok 19 - 04.02 - boolean as input # time=1.643ms
    
    # Subtest: 04.03 - null as input
        ok 1 - expected to throw
        1..1
    ok 20 - 04.03 - null as input # time=1.569ms
    
    # Subtest: 04.04 - both args missing (as in hardcoded undefined)
        ok 1 - expected to throw
        1..1
    ok 21 - 04.04 - both args missing (as in hardcoded undefined) # time=1.912ms
    
    # Subtest: 04.05 - both args completely missing
        ok 1 - expected to throw
        1..1
    ok 22 - 04.05 - both args completely missing # time=0.826ms
    
    # Subtest: 04.06 - second arg is not a plain object
        ok 1 - expected to throw
        1..1
    ok 23 - 04.06 - second arg is not a plain object # time=1.884ms
    
    # Subtest: 04.07 - opts is not a plain object
        ok 1 - expected to throw
        ok 2 - expected to not throw
        1..2
    ok 24 - 04.07 - opts is not a plain object # time=2.674ms
    
    # Subtest: 04.08 - opts.doNotFillThesePathsIfTheyContainPlaceholders
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 25 - 04.08 - opts.doNotFillThesePathsIfTheyContainPlaceholders # time=3.239ms
    
    # Subtest: 05.01 - does not mutate the input args
        ok 1 - (unnamed test)
        ok 2 - 05.01
        1..2
    ok 26 - 05.01 - does not mutate the input args # time=2.387ms
    
    # Subtest: 06.01 - some keys filled, some ignored because they have placeholders-only
        ok 1 - 06.01.01 - default behaviour - keys are added
        ok 2 - 06.01.02 - opts.doNotFillThesePathsIfTheyContainPlaceholders
        ok 3 - 06.01.03 - triggering the normalisation when it's off from opts
        ok 4 - 06.01.04 - key in given path is missing completely
        ok 5 - 06.01.05
        ok 6 - 06.01.06
        ok 7 - 06.01.07
        1..7
    ok 27 - 06.01 - some keys filled, some ignored because they have placeholders-only # time=8.191ms
    
    # Subtest: 07.01 - opts.useNullAsExplicitFalse - case #1
        ok 1 - 07.01.01
        ok 2 - 07.01.02
        1..2
    ok 28 - 07.01 - opts.useNullAsExplicitFalse - case #1 # time=6.109ms
    
    # Subtest: 07.02 - opts.useNullAsExplicitFalse - case #2
        ok 1 - 07.02.01
        ok 2 - 07.02.02
        1..2
    ok 29 - 07.02 - opts.useNullAsExplicitFalse - case #2 # time=2.685ms
    
    # Subtest: 07.03 - opts.useNullAsExplicitFalse - case #3
        ok 1 - 07.03.01
        ok 2 - 07.03.02
        1..2
    ok 30 - 07.03 - opts.useNullAsExplicitFalse - case #3 # time=2.585ms
    
    1..30
    # time=278.339ms
ok 1 - test/test.js # time=278.339ms

1..1
# time=2779.807ms
