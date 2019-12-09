TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - there are no usable files at all
        ok 1 - should be equal
        1..1
    ok 1 - 01.01 - there are no usable files at all # time=1340.943ms
    
    # Subtest: 01.02 - cli.js in the root
        ok 1 - should be equal
        1..1
    ok 2 - 01.02 - cli.js in the root # time=769.109ms
    
    # Subtest: 01.03/1 - pad override, -p
        ok 1 - should be equal
        1..1
    ok 3 - 01.03/1 - pad override, -p # time=809.764ms
    
    # Subtest: 01.03/2 - pad override, --pad
        ok 1 - should be equal
        1..1
    ok 4 - 01.03/2 - pad override, --pad # time=757.241ms
    
    # Subtest: 01.04 - one file called with glob, another not processed
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 5 - 01.04 - one file called with glob, another not processed # time=875.129ms
    
    # Subtest: 01.05 - two files processed by calling glob with wildcard
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 6 - 01.05 - two files processed by calling glob with wildcard # time=819.781ms
    
    # Subtest: 01.06/1 - "t" flag, -t
        ok 1 - should be equal
        1..1
    ok 7 - 01.06/1 - "t" flag, -t # time=729.87ms
    
    # Subtest: 01.06/2 - "t" flag, --trigger
        ok 1 - should be equal
        1..1
    ok 8 - 01.06/2 - "t" flag, --trigger # time=736.363ms
    
    1..8
    # time=6855.905ms
ok 1 - test/test.js # time=6855.905ms

1..1
# time=9377.443ms
