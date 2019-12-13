TAP version 13
ok 1 - test/test.js # time=718.996ms {
    # Subtest: 01.01 - throws when inputs are missing/wrong
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 1 - 01.01 - throws when inputs are missing/wrong # time=22.301ms
    
    # Subtest: 02.01 - defaults - objects, one level
        ok 1 - 02.01.01 - defaults wrapping strings
        ok 2 - 02.01.02 - heads/tails override, wrapping with empty strings
        ok 3 - 02.01.03 - wrapping only with heads; tails empty
        ok 4 - 02.01.04 - wrapping only with heads; tails empty
        ok 5 - 02.01.05 - does not wrap because starts with "key", string opt
        ok 6 - 02.01.06 - does not wrap because starts with "key", array opt
        ok 7 - 02.01.07 - does not wrap because ends with 1 or 2
        ok 8 - 02.01.08 - mix of various wildcards, sources are strings
        ok 9 - 02.01.09 - mix of various wildcards, sources are plain objects
        ok 10 - 02.01.10 - wildcards are case sensitive since v4.3.0
        1..10
    ok 2 - 02.01 - defaults - objects, one level # time=29.137ms
    
    # Subtest: 02.02 - opts.preventDoubleWrapping
        ok 1 - 02.02.01 - preventDoubleWrapping reading default heads/tails
        ok 2 - 02.02.02 - preventDoubleWrapping off
        ok 3 - 02.02.03 - preventDoubleWrapping reading default heads/tails
        ok 4 - 02.02.04 - preventDoubleWrapping reading default heads/tails
        1..4
    ok 3 - 02.02 - opts.preventDoubleWrapping # time=6.446ms
    
    # Subtest: 02.03 - flattens an array value but doesn't touch other one
        ok 1 - 02.03.01
        ok 2 - 02.03.02
        ok 3 - 02.03.03
        ok 4 - 02.03.04
        ok 5 - 02.03.05 - does not put <br /> at all when flattening arrays
        1..5
    ok 4 - 02.03 - flattens an array value but doesn't touch other one # time=13.511ms
    
    # Subtest: 02.04 - wildcards in opts.dontWrapKeys
        ok 1 - 02.04.01 - does not wrap the key1 contents
        ok 2 - 02.04.02 - opposite key order
        ok 3 - 02.04.03 - does not touch key3 children
        ok 4 - 02.04.04 - does not wrap the key3 children
        ok 5 - 02.04.05 - nothing, because key4 is not top-level
        1..5
    ok 5 - 02.04 - wildcards in opts.dontWrapKeys # time=14.751ms
    
    # Subtest: 02.05 - array of input vs string of reference
        ok 1 - 02.05
        1..1
    ok 6 - 02.05 - array of input vs string of reference # time=1.725ms
    
    # Subtest: 02.06 - action within an array's contents
        ok 1 - 02.06.01
        1..1
    ok 7 - 02.06 - action within an array's contents # time=2.502ms
    
    # Subtest: 02.07 - doesn't wrap empty string values
        ok 1 - 02.07
        1..1
    ok 8 - 02.07 - doesn't wrap empty string values # time=2.603ms
    
    # Subtest: 02.08 - reference array as value is shorter than input's
        ok 1 - 02.08
        1..1
    ok 9 - 02.08 - reference array as value is shorter than input's # time=2.313ms
    
    # Subtest: 02.09 - one ignore works on multiple keys
        ok 1 - 02.09.01 - defaults on opts.whatToDoWhenReferenceIsMissing
        ok 2 - 02.09.02 - hardcoded defaults on opts.whatToDoWhenReferenceIsMissing
        ok 3 - 02.09.03 - defaults on opts.whatToDoWhenReferenceIsMissing
        ok 4 - 02.09.04 - normal case, where reference is provided for key "wrapme"
        ok 5 - 02.09.05 - same as #04 but with objects
        1..5
    ok 10 - 02.09 - one ignore works on multiple keys # time=5.277ms
    
    # Subtest: 02.10 - deeper level - array VS. string
        ok 1 - 02.10
        1..1
    ok 11 - 02.10 - deeper level - array VS. string # time=2.43ms
    
    # Subtest: 02.11 - deeper level - array within array VS. string
        ok 1 - 02.11
        1..1
    ok 12 - 02.11 - deeper level - array within array VS. string # time=2.588ms
    
    # Subtest: 02.12 - deeper level - array within array VS. string #2
        ok 1 - 02.12.01 - innermost array is first element
        ok 2 - 02.12.02 - innermost array is second element
        1..2
    ok 13 - 02.12 - deeper level - array within array VS. string #2 # time=2.863ms
    
    # Subtest: 02.13 - one ignore works on multiple keys
        ok 1 - 02.13.01
        1..1
    ok 14 - 02.13 - one ignore works on multiple keys # time=3.448ms
    
    # Subtest: 02.14 - opts.mergeWithoutTrailingBrIfLineContainsBr
        ok 1 - 02.14.01 - default - BRs are detected and no additional BRs are added
        ok 2 - 02.14.02 - hardcoded default - same as #01
        ok 3 - 02.14.03 - off - will add excessive BRs
        ok 4 - 02.14.04 - xhtml = false
        1..4
    ok 15 - 02.14 - opts.mergeWithoutTrailingBrIfLineContainsBr # time=3.182ms
    
    # Subtest: 03.01 - opts.ignore & wrapping function
        ok 1 - 03.01.01 - default behaviour
        ok 2 - 03.01.02 - does not wrap ignored string
        ok 3 - 03.01.03 - does not wrap ignored array
        1..3
    ok 16 - 03.01 - opts.ignore & wrapping function # time=3.372ms
    
    # Subtest: 03.02 - flattens an array value but doesn't touch other one
        ok 1 - 03.02.01
        ok 2 - 03.02.02
        ok 3 - 03.02.03 - ignore affects key1, default wrapping
        ok 4 - 03.02.04 - ignore affects key1, custom wrapping
        ok 5 - 03.02.05 - some ignored, some flattened
        1..5
    ok 17 - 03.02 - flattens an array value but doesn't touch other one # time=12.906ms
    
    # Subtest: 04.01 - opts.whatToDoWhenReferenceIsMissing
        ok 1 - 04.01.01 - no opts - opt. 0 - skips
        ok 2 - 04.01.02 - opts - opt. 0 hardcoded - skips (same as #01)
        ok 3 - expected to throw
        ok 4 - 04.01.04 - opts - opt. 2 - flattens to string anyway + wraps if permitted
        1..4
    ok 18 - 04.01 - opts.whatToDoWhenReferenceIsMissing # time=4.168ms
    
    # Subtest: 05.01 - double-wrapping prevention when markers have white space
        ok 1 - 05.01.01 - base
        ok 2 - 05.01.02 - whitespace on default heads and tails, checking double wrapping prevention
        ok 3 - 05.01.03 - whitespace on custom heads and tails, checking double wrapping prevention
        1..3
    ok 19 - 05.01 - double-wrapping prevention when markers have white space # time=3.301ms
    
    # Subtest: 05.02 - double-wrapping prevention from setting opts.preventWrappingIfContains
        ok 1 - 05.02.01 - default - double wrapping on key1 because {%...%} is not recognised
        ok 2 - 05.02.02 - opts.preventWrappingIfContains, value as string
        ok 3 - 05.02.03 - opts.preventWrappingIfContains, value as array
        ok 4 - 05.02.04 - opts.preventWrappingIfContains contents don't match and thus string get double-wrapped
        ok 5 - 05.02.05 - opts.preventWrappingIfContains and opts.wrapGlobalFlipSwitch kill switch on
        1..5
    ok 20 - 05.02 - double-wrapping prevention from setting opts.preventWrappingIfContains # time=4.327ms
    
    # Subtest: 95.01 - util.reclaimIntegerString - does what it says on strings
        ok 1 - 95.01.03
        1..1
    ok 21 - 95.01 - util.reclaimIntegerString - does what it says on strings # time=1.348ms
    
    # Subtest: 95.02 - util.reclaimIntegerString - doesn't parse non-integer strings
        ok 1 - 95.02
        1..1
    ok 22 - 95.02 - util.reclaimIntegerString - doesn't parse non-integer strings # time=1.187ms
    
    # Subtest: 95.03 - util.reclaimIntegerString - doesn't parse non-number strings either
        ok 1 - 95.03
        1..1
    ok 23 - 95.03 - util.reclaimIntegerString - doesn't parse non-number strings either # time=1.048ms
    
    # Subtest: 95.04 - util.reclaimIntegerString - doesn't parse booleans
        ok 1 - 95.04
        1..1
    ok 24 - 95.04 - util.reclaimIntegerString - doesn't parse booleans # time=0.974ms
    
    # Subtest: 96.01 - util.arrayiffyString - turns string into an array
        ok 1 - 96.01
        1..1
    ok 25 - 96.01 - util.arrayiffyString - turns string into an array # time=3.388ms
    
    # Subtest: 96.02 - util.arrayiffyString - turns empty string into an empty array
        ok 1 - 96.02
        1..1
    ok 26 - 96.02 - util.arrayiffyString - turns empty string into an empty array # time=1.083ms
    
    # Subtest: 96.03 - util.arrayiffyString - doesn't touch any other input types
        ok 1 - 96.03.01
        ok 2 - 96.03.02
        ok 3 - 96.03.03
        ok 4 - 96.03.04
        1..4
    ok 27 - 96.03 - util.arrayiffyString - doesn't touch any other input types # time=1.956ms
    
    # Subtest: 98.01 - util.flattenObject > empty input
        ok 1 - 98.01.01
        ok 2 - 98.01.02
        1..2
    ok 28 - 98.01 - util.flattenObject > empty input # time=1.501ms
    
    # Subtest: 98.02 - util.flattenObject > simple object
        ok 1 - 98.02
        1..1
    ok 29 - 98.02 - util.flattenObject > simple object # time=1.396ms
    
    # Subtest: 98.03 - util.flattenObject > nested objects
        ok 1 - 98.03
        1..1
    ok 30 - 98.03 - util.flattenObject > nested objects # time=1.699ms
    
    # Subtest: 99.01 - util.flattenArr > empty input
        ok 1 - 99.01
        1..1
    ok 31 - 99.01 - util.flattenArr > empty input # time=1.5ms
    
    # Subtest: 99.02 - util.flattenArr > simple array
        ok 1 - 99.02.01
        ok 2 - 99.02.02
        1..2
    ok 32 - 99.02 - util.flattenArr > simple array # time=1.624ms
    
    # Subtest: 99.03 - util.flattenArr + joinArraysUsingBrs
        ok 1 - 99.03.01
        ok 2 - 99.03.02
        ok 3 - 99.03.03
        ok 4 - 99.03.04
        ok 5 - 99.03.05
        ok 6 - 99.03.06
        ok 7 - 99.03.07
        ok 8 - 99.03.08
        ok 9 - 99.03.09
        ok 10 - 99.03.10
        ok 11 - 99.03.11
        ok 12 - 99.03.12
        1..12
    ok 33 - 99.03 - util.flattenArr + joinArraysUsingBrs # time=5.613ms
    
    1..33
    # time=718.996ms
}

1..1
# time=3346.776ms
