TAP version 13
ok 1 - test/test.js # time=5434.004ms {
    # Subtest: 01.01 - there are no usable files at all
        ok 1 - should be equal
        1..1
    ok 1 - 01.01 - there are no usable files at all # time=756.564ms
    
    # Subtest: 01.02 - cli.js in the root
        ok 1 - should be equal
        1..1
    ok 2 - 01.02 - cli.js in the root # time=647.311ms
    
    # Subtest: 01.03/1 - pad override, -p
        ok 1 - should be equal
        1..1
    ok 3 - 01.03/1 - pad override, -p # time=665.199ms
    
    # Subtest: 01.03/2 - pad override, --pad
        ok 1 - should be equal
        1..1
    ok 4 - 01.03/2 - pad override, --pad # time=726.241ms
    
    # Subtest: 01.04 - one file called with glob, another not processed
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 5 - 01.04 - one file called with glob, another not processed # time=666.812ms
    
    # Subtest: 01.05 - two files processed by calling glob with wildcard
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 6 - 01.05 - two files processed by calling glob with wildcard # time=676.878ms
    
    # Subtest: 01.06/1 - "t" flag, -t
        ok 1 - should be equal
        1..1
    ok 7 - 01.06/1 - "t" flag, -t # time=652.182ms
    
    # Subtest: 01.06/2 - "t" flag, --trigger
        ok 1 - should be equal
        1..1
    ok 8 - 01.06/2 - "t" flag, --trigger # time=635.397ms
    
    1..8
    # time=5434.004ms
}

1..1
# time=7083.898ms
