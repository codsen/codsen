TAP version 13
ok 1 - test/test.js # time=17.972ms {
    # Subtest: 01.01 - string input
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        1..2
    ok 1 - 01.01 - string input # time=6.132ms
    
    # Subtest: 01.02 - non-string input
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        ok 4 - 01.02.04
        ok 5 - 01.02.05
        1..5
    ok 2 - 01.02 - non-string input # time=1.962ms
    
    1..2
    # time=17.972ms
}

ok 2 - test/umd-test.js # time=10.368ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=6.076ms
    
    1..1
    # time=10.368ms
}

1..2
# time=1358.737ms
