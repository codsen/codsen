TAP version 13
# Subtest: test/test.js
    # Subtest: 00.01 - throws when the first argument is not array
        ok 1 - 00.01
        ok 2 - 00.04
        1..2
    ok 1 - 00.01 - throws when the first argument is not array # time=8.991ms
    
    # Subtest: 00.02 - second argument can be faulty, opts is simply reset
        ok 1 - 00.02.01
        ok 2 - 00.02.02
        ok 3 - 00.02.03
        ok 4 - 00.02.04
        1..4
    ok 2 - 00.02 - second argument can be faulty, opts is simply reset # time=5.815ms
    
    # Subtest: 01.01 - groups two kinds
        ok 1 - 01.01
        1..1
    ok 3 - 01.01 - groups two kinds # time=3.329ms
    
    # Subtest: 01.02 - sneaky - wildcard pattern changes later in the traverse
        ok 1 - 01.02
        1..1
    ok 4 - 01.02 - sneaky - wildcard pattern changes later in the traverse # time=1.736ms
    
    # Subtest: 01.03 - all contain digits and all are unique
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        1..3
    ok 5 - 01.03 - all contain digits and all are unique # time=21.149ms
    
    # Subtest: 01.04 - nothing to group, one character
        ok 1 - 01.04
        1..1
    ok 6 - 01.04 - nothing to group, one character # time=2.453ms
    
    # Subtest: 01.05 - concerning dedupe
        ok 1 - 01.05.01 - default behaviour - dedupe is on
        ok 2 - 01.05.02 - dedupe is off
        1..2
    ok 7 - 01.05 - concerning dedupe # time=5.813ms
    
    # Subtest: 02.01 - does not mutate the input array
        ok 1 - (unnamed test)
        ok 2 - 02.01 - even after couple rounds the input arg is not mutated
        1..2
    ok 8 - 02.01 - does not mutate the input array # time=2.696ms
    
    # Subtest: 02.02 - does not mutate an empty given array
        ok 1 - (unnamed test)
        ok 2 - 02.02
        1..2
    ok 9 - 02.02 - does not mutate an empty given array # time=2.017ms
    
    # Subtest: 03.01 - opts.wildcard
        ok 1 - 03.01 - default, asterisk is used for wildcards
        ok 2 - 03.01.02
        1..2
    ok 10 - 03.01 - opts.wildcard # time=2.31ms
    
    1..10
    # time=189.151ms
ok 1 - test/test.js # time=189.151ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=7.684ms
    
    1..1
    # time=49.995ms
ok 2 - test/umd-test.js # time=49.995ms

1..2
# time=3541.224ms
