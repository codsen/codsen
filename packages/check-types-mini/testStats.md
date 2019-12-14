TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - [31mthrows[39m - when all/first args are missing
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        1..3
    ok 1 - 01.01 - [31mthrows[39m - when all/first args are missing # time=9.105ms
    
    # Subtest: 01.02 - [31mthrows[39m - when one of the arguments is of a wrong type
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 2 - 01.02 - [31mthrows[39m - when one of the arguments is of a wrong type # time=8.158ms
    
    # Subtest: 01.03 - [31mthrows[39m - opts.msg or opts.optsVarName args are wrong-type
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 3 - 01.03 - [31mthrows[39m - opts.msg or opts.optsVarName args are wrong-type # time=3.565ms
    
    # Subtest: 01.04 - [31mthrows[39m - if fourth argument is missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to not throw
        1..3
    ok 4 - 01.04 - [31mthrows[39m - if fourth argument is missing # time=5.224ms
    
    # Subtest: 01.05 - [31mthrows[39m - when opts are set wrong
        ok 1 - expected to not throw
        ok 2 - expected to throw
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        1..4
    ok 5 - 01.05 - [31mthrows[39m - when opts are set wrong # time=10.661ms
    
    # Subtest: 01.06 - [31mthrows[39m - nested options
        ok 1 - expected to throw
        ok 2 - expected to not throw
        1..2
    ok 6 - 01.06 - [31mthrows[39m - nested options # time=3.773ms
    
    # Subtest: 01.07 - [31mthrows[39m - opts.ignorePaths
        ok 1 - expected to throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        ok 6 - expected to not throw
        ok 7 - expected to not throw
        ok 8 - msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string
        ok 9 - expected to not throw
        ok 10 - expected to not throw
        1..10
    ok 7 - 01.07 - [31mthrows[39m - opts.ignorePaths # time=14.368ms
    
    # Subtest: 01.08 - [31mthrows[39m - opts.ignorePaths with wildcards
        ok 1 - msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string
        ok 2 - msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string
        ok 3 - expected to not throw
        1..3
    ok 8 - 01.08 - [31mthrows[39m - opts.ignorePaths with wildcards # time=7.048ms
    
    # Subtest: 01.09 - [31mthrows[39m - opts.ignoreKeys with wildcards not referenced by schema/reference obj.
        ok 1 - msg: The input object has keys which are not covered by the reference object: www1, www2
        ok 2 - msg: The reference object has keys which are not present in the input object: aaa, ccc
        ok 3 - expected to not throw
        1..3
    ok 9 - 01.09 - [31mthrows[39m - opts.ignoreKeys with wildcards not referenced by schema/reference obj. # time=28.323ms
    
    # Subtest: 01.10 - [31mthrows[39m - some keys bailed through ignoreKeys, some through ignorePaths and as a result it does not throw
        ok 1 - msg: opts.aaa.bbb was customised to "ccc" which is not boolean but string
        ok 2 - msg: opts.ddd.eee was customised to "fff" which is not boolean but string
        ok 3 - expected to not throw
        ok 4 - expected to throw
        1..4
    ok 10 - 01.10 - [31mthrows[39m - some keys bailed through ignoreKeys, some through ignorePaths and as a result it does not throw # time=10.25ms
    
    # Subtest: 02.01 - [33marrays[39m - opts.acceptArrays, strings+arrays
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to not throw
        ok 4 - expected to throw
        ok 5 - should be equal
        1..5
    ok 11 - 02.01 - [33marrays[39m - opts.acceptArrays, strings+arrays # time=4.836ms
    
    # Subtest: 02.02 - [33marrays[39m - opts.acceptArrays, Booleans+arrays
        ok 1 - expected to throw
        ok 2 - should be equal
        ok 3 - expected to not throw
        ok 4 - expected to throw
        ok 5 - expect truthy value
        ok 6 - expected to throw
        ok 7 - should be equal
        ok 8 - expected to not throw
        1..8
    ok 12 - 02.02 - [33marrays[39m - opts.acceptArrays, Booleans+arrays # time=7.277ms
    
    # Subtest: 02.03 - [33marrays[39m - opts.acceptArraysIgnore
        ok 1 - expected to not throw
        ok 2 - expected to throw
        ok 3 - expect truthy value
        ok 4 - expected to throw
        ok 5 - expect truthy value
        ok 6 - expected to throw
        ok 7 - expect truthy value
        1..7
    ok 13 - 02.03 - [33marrays[39m - opts.acceptArraysIgnore # time=12.831ms
    
    # Subtest: 02.05 - [33marrays[39m - involving null values
        ok 1 - expected to throw
        ok 2 - should be equal
        1..2
    ok 14 - 02.05 - [33marrays[39m - involving null values # time=13.005ms
    
    # Subtest: 02.06 - [33marrays[39m - throws/notThrows when keysets mismatch
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        1..4
    ok 15 - 02.06 - [33marrays[39m - throws/notThrows when keysets mismatch # time=26.199ms
    
    # Subtest: 02.07 - [33marrays[39m - opts.enforceStrictKeyset set to a wrong thing
        ok 1 - expected to throw
        1..1
    ok 16 - 02.07 - [33marrays[39m - opts.enforceStrictKeyset set to a wrong thing # time=2.153ms
    
    # Subtest: 02.08 - [33marrays[39m - throws when reference and schema are both missing
        ok 1 - expected to throw
        1..1
    ok 17 - 02.08 - [33marrays[39m - throws when reference and schema are both missing # time=2.047ms
    
    # Subtest: 02.09 - [33marrays[39m - acceptArrays + schema + nested
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        ok 4 - should match pattern provided
        ok 5 - should match pattern provided
        ok 6 - should match pattern provided
        ok 7 - expected to not throw
        ok 8 - expected to throw
        ok 9 - should match pattern provided
        ok 10 - should match pattern provided
        ok 11 - should match pattern provided
        1..11
    ok 18 - 02.09 - [33marrays[39m - acceptArrays + schema + nested # time=14.476ms
    
    # Subtest: 02.10 - [33marrays[39m - enforceStrictKeyset and nested inputs
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 19 - 02.10 - [33marrays[39m - enforceStrictKeyset and nested inputs # time=3.455ms
    
    # Subtest: 02.11 - [33marrays[39m - strict mode, customising keys
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        1..6
    ok 20 - 02.11 - [33marrays[39m - strict mode, customising keys # time=10.899ms
    
    # Subtest: 03.01 - [32mopts.acceptArrays[39m - strings + arrays
        ok 1 - expected to throw
        ok 2 - expected to not throw
        1..2
    ok 21 - 03.01 - [32mopts.acceptArrays[39m - strings + arrays # time=16.372ms
    
    # Subtest: 04.01 - [36mopts.schema[39m only - located in root
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        ok 4 - should match pattern provided
        ok 5 - expected to not throw
        ok 6 - expected to throw
        ok 7 - should match pattern provided
        ok 8 - expected to not throw
        ok 9 - expected to throw
        ok 10 - should match pattern provided
        ok 11 - should match pattern provided
        ok 12 - expected to throw
        ok 13 - should match pattern provided
        ok 14 - should match pattern provided
        ok 15 - should match pattern provided
        ok 16 - should match pattern provided
        ok 17 - expected to not throw
        ok 18 - expected to not throw
        ok 19 - expected to not throw
        ok 20 - expected to throw
        ok 21 - should match pattern provided
        ok 22 - expected to throw
        ok 23 - should match pattern provided
        ok 24 - expected to throw
        ok 25 - should match pattern provided
        ok 26 - expected to not throw
        ok 27 - expected to throw
        ok 28 - should match pattern provided
        ok 29 - expected to not throw
        ok 30 - expected to not throw
        ok 31 - expected to not throw
        ok 32 - expected to not throw
        ok 33 - expected to not throw
        ok 34 - expected to throw
        ok 35 - should match pattern provided
        1..35
    ok 22 - 04.01 - [36mopts.schema[39m only - located in root # time=62.544ms
    
    # Subtest: 04.02 - [36mopts.schema[39m only - deeper level key doesn't even exist in ref
        ok 1 - expected to throw
        ok 2 - should be equal
        ok 3 - expected to throw
        ok 4 - should be equal
        ok 5 - expected to throw
        ok 6 - should be equal
        1..6
    ok 23 - 04.02 - [36mopts.schema[39m only - deeper level key doesn't even exist in ref # time=5.021ms
    
    # Subtest: 04.03 - [36mopts.schema[39m only - deeper level key type mismatches but is allowed through a schema
        ok 1 - expected to throw
        ok 2 - should be equal
        ok 3 - expected to not throw
        1..3
    ok 24 - 04.03 - [36mopts.schema[39m only - deeper level key type mismatches but is allowed through a schema # time=3.588ms
    
    # Subtest: 04.04 - [36mopts.schema[39m only - located deeper
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to not throw
        ok 4 - expected to throw
        ok 5 - should be equal
        ok 6 - expected to throw
        ok 7 - should match pattern provided
        ok 8 - expected to throw
        ok 9 - should match pattern provided
        ok 10 - expected to not throw
        ok 11 - expected to not throw
        ok 12 - expected to not throw
        ok 13 - expected to throw
        ok 14 - should match pattern provided
        ok 15 - expected to throw
        ok 16 - should match pattern provided
        ok 17 - expected to throw
        ok 18 - should match pattern provided
        ok 19 - expected to not throw
        ok 20 - expected to throw
        ok 21 - should match pattern provided
        ok 22 - expected to not throw
        ok 23 - expected to not throw
        ok 24 - expected to not throw
        ok 25 - expected to not throw
        ok 26 - expected to not throw
        ok 27 - expected to throw
        ok 28 - should match pattern provided
        1..28
    ok 25 - 04.04 - [36mopts.schema[39m only - located deeper # time=26.309ms
    
    # Subtest: 04.05 - [36mopts.schema[39m values as strings + "whatever" keys
        ok 1 - expected to throw
        ok 2 - should be equal
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        ok 5 - expected to throw
        ok 6 - should match pattern provided
        ok 7 - expected to not throw
        ok 8 - expected to not throw
        1..8
    ok 26 - 04.05 - [36mopts.schema[39m values as strings + "whatever" keys # time=52.586ms
    
    # Subtest: 04.06 - [36mopts.schema[39m falling back to reference object
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to not throw
        1..3
    ok 27 - 04.06 - [36mopts.schema[39m falling back to reference object # time=20.092ms
    
    # Subtest: 04.07 - [36mopts.schema[39m is set to a wrong thing - throws
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - should be equal
        1..4
    ok 28 - 04.07 - [36mopts.schema[39m is set to a wrong thing - throws # time=15.257ms
    
    # Subtest: 04.08 - [36mopts.schema[39m understands opts.acceptArrays
        ok 1 - expected to throw
        ok 2 - should be equal
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        ok 5 - expected to throw
        ok 6 - should be equal
        ok 7 - expected to not throw
        ok 8 - expected to throw
        ok 9 - should match pattern provided
        ok 10 - expected to not throw
        1..10
    ok 29 - 04.08 - [36mopts.schema[39m understands opts.acceptArrays # time=8.777ms
    
    # Subtest: 04.09 - [35mad-hoc[39m #1
        ok 1 - json-variables/jsonVariables(): [THROW_ID_04*]: opts.wrapTailsWith was customised to "false" which is not string but boolean
        ok 2 - should be equal
        1..2
    ok 30 - 04.09 - [35mad-hoc[39m #1 # time=2.941ms
    
    # Subtest: 04.10 - [35mad-hoc[39m #2 - enforcing first-level key types but ignoring sub-level values
        ok 1 - expected to throw
        ok 2 - 04.10.01
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        1..4
    ok 31 - 04.10 - [35mad-hoc[39m #2 - enforcing first-level key types but ignoring sub-level values # time=4.809ms
    
    # Subtest: 04.11 - [35mopts.schema[39m type "any" applies to all deeper levels
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to not throw
        1..3
    ok 32 - 04.11 - [35mopts.schema[39m type "any" applies to all deeper levels # time=4.964ms
    
    # Subtest: 04.12 - [35mopts.schema[39m key's value is "undefined" literal, it's in schema
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        1..4
    ok 33 - 04.12 - [35mopts.schema[39m key's value is "undefined" literal, it's in schema # time=11.29ms
    
    1..33
    # time=690.828ms
ok 1 - test/test.js # time=690.828ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 1 - UMD build works fine # time=12.598ms
    
    1..1
    # time=70.291ms
ok 2 - test/umd-test.js # time=70.291ms

1..2
# time=6674.857ms
