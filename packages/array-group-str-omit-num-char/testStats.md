TAP version 13
ok 1 - test/test.js # time=52.232ms {
    # Subtest: 00.01 - throws when the first argument is not array
        ok 1 - 00.01
        ok 2 - 00.04
        1..2
    ok 1 - 00.01 - throws when the first argument is not array # time=4.549ms
    
    # Subtest: 00.02 - second argument can be faulty, opts is simply reset
        ok 1 - 00.02.01
        ok 2 - 00.02.02
        ok 3 - 00.02.03
        ok 4 - 00.02.04
        1..4
    ok 2 - 00.02 - second argument can be faulty, opts is simply reset # time=4.722ms
    
    # Subtest: 01.01 - groups two kinds
        ok 1 - 01.01
        1..1
    ok 3 - 01.01 - groups two kinds # time=1.661ms
    
    # Subtest: 01.02 - sneaky - wildcard pattern changes later in the traverse
        ok 1 - 01.02
        1..1
    ok 4 - 01.02 - sneaky - wildcard pattern changes later in the traverse # time=0.962ms
    
    # Subtest: 01.03 - all contain digits and all are unique
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        1..3
    ok 5 - 01.03 - all contain digits and all are unique # time=1.828ms
    
    # Subtest: 01.04 - nothing to group, one character
        ok 1 - 01.04
        1..1
    ok 6 - 01.04 - nothing to group, one character # time=0.572ms
    
    # Subtest: 01.05 - concerning dedupe
        ok 1 - 01.05.01 - default behaviour - dedupe is on
        ok 2 - 01.05.02 - dedupe is off
        1..2
    ok 7 - 01.05 - concerning dedupe # time=0.923ms
    
    # Subtest: 02.01 - does not mutate the input array
        ok 1 - (unnamed test)
        ok 2 - 02.01 - even after couple rounds the input arg is not mutated
        1..2
    ok 8 - 02.01 - does not mutate the input array # time=1.077ms
    
    # Subtest: 02.02 - does not mutate an empty given array
        ok 1 - (unnamed test)
        ok 2 - 02.02
        1..2
    ok 9 - 02.02 - does not mutate an empty given array # time=0.59ms
    
    # Subtest: 03.01 - opts.wildcard
        ok 1 - 03.01 - default, asterisk is used for wildcards
        ok 2 - 03.01.02
        1..2
    ok 10 - 03.01 - opts.wildcard # time=0.934ms
    
    1..10
    # time=52.232ms
}

ok 2 - test/umd-test.js # time=8.244ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=4.861ms
    
    1..1
    # time=8.244ms
}

1..2
# time=1467.919ms
