TAP version 13
# Subtest: test/test.js
    # Subtest: 1.1 - wrong/missing inputs - throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to not throw
        ok 5 - expected to throw
        ok 6 - expected to not throw
        1..6
    ok 1 - 1.1 - wrong/missing inputs - throws # time=13.578ms
    
    # Subtest: 2.1 - arrays
        ok 1 - 2.1.1
        ok 2 - 2.1.2
        ok 3 - 2.1.3
        ok 4 - 2.1.4
        ok 5 - 2.1.5
        ok 6 - 2.1.6
        1..6
    ok 2 - 2.1 - arrays # time=5.846ms
    
    # Subtest: 2.2 - objects
        ok 1 - 2.2.1
        ok 2 - 2.2.2
        ok 3 - 2.2.3
        ok 4 - 2.2.4
        ok 5 - 2.2.5
        ok 6 - 2.2.6
        ok 7 - 2.2.7
        ok 8 - 2.2.8
        ok 9 - 2.2.9
        1..9
    ok 3 - 2.2 - objects # time=6.94ms
    
    # Subtest: 2.3 - any
        ok 1 - 2.3.1
        ok 2 - 2.3.2
        ok 3 - 2.3.3
        ok 4 - 2.3.4
        ok 5 - 2.3.5
        ok 6 - 2.3.6
        1..6
    ok 4 - 2.3 - any # time=4.991ms
    
    # Subtest: 3.1 - opts.msg
        ok 1 - 2.2.1
        ok 2 - z The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.
        ok 3 - some-library/some-function(): [THROW_ID_99] The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.
        ok 4 - some-library/some-function(): [THROW_ID_99] The variable "only" was customised to an unrecognised value: bbb. Please check it against the API documentation.
        1..4
    ok 5 - 3.1 - opts.msg # time=6.486ms
    
    1..5
    # time=138.425ms
ok 1 - test/test.js # time=138.425ms

1..1
# time=2515.949ms
