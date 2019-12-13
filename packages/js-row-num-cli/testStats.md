TAP version 13
ok 1 - test/test.js # time=6232.919ms {
    # Subtest: 01.01 - there are no usable files at all
        ok 1 - should be equal
        1..1
    ok 1 - 01.01 - there are no usable files at all # time=1361.994ms
    
    # Subtest: 01.02 - cli.js in the root
        ok 1 - should be equal
        1..1
    ok 2 - 01.02 - cli.js in the root # time=680.832ms
    
    # Subtest: 01.03/1 - pad override, -p
        ok 1 - should be equal
        1..1
    ok 3 - 01.03/1 - pad override, -p # time=662.37ms
    
    # Subtest: 01.03/2 - pad override, --pad
        ok 1 - should be equal
        1..1
    ok 4 - 01.03/2 - pad override, --pad # time=741.737ms
    
    # Subtest: 01.04 - one file called with glob, another not processed
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 5 - 01.04 - one file called with glob, another not processed # time=627.858ms
    
    # Subtest: 01.05 - two files processed by calling glob with wildcard
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 6 - 01.05 - two files processed by calling glob with wildcard # time=679.915ms
    
    # Subtest: 01.06/1 - "t" flag, -t
        ok 1 - should be equal
        1..1
    ok 7 - 01.06/1 - "t" flag, -t # time=738.994ms
    
    # Subtest: 01.06/2 - "t" flag, --trigger
        ok 1 - should be equal
        1..1
    ok 8 - 01.06/2 - "t" flag, --trigger # time=730.403ms
    
    1..8
    # time=6232.919ms
}

1..1
# time=7857.515ms
