TAP version 13
ok 1 - test/test.js # time=325.103ms {
    # Subtest: 01.01 - get - one plain object as result
        ok 1 - 01.01
        1..1
    ok 1 - 01.01 - get - one plain object as result # time=30.716ms
    
    # Subtest: 01.02 - get - two plain object as result
        ok 1 - 01.02
        1..1
    ok 2 - 01.02 - get - two plain object as result # time=2.943ms
    
    # Subtest: 01.03 - get - topmost level container is object
        ok 1 - 01.03
        1..1
    ok 3 - 01.03 - get - topmost level container is object # time=3.032ms
    
    # Subtest: 01.04 - get - search value is object
        ok 1 - 01.04
        1..1
    ok 4 - 01.04 - get - search value is object # time=3.403ms
    
    # Subtest: 01.05 - get - search value is array
        ok 1 - 01.05
        1..1
    ok 5 - 01.05 - get - search value is array # time=2.385ms
    
    # Subtest: 01.06 - get - search value is nested array
        ok 1 - 01.06
        1..1
    ok 6 - 01.06 - get - search value is nested array # time=2.244ms
    
    # Subtest: 01.07 - get - search value is nested object
        ok 1 - 01.07
        1..1
    ok 7 - 01.07 - get - search value is nested object # time=2.395ms
    
    # Subtest: 01.08 - get - numerous everything
        ok 1 - 01.08
        1..1
    ok 8 - 01.08 - get - numerous everything # time=1.987ms
    
    # Subtest: 02.01 - set - one plain object
        ok 1 - 02.01
        1..1
    ok 9 - 02.01 - set - one plain object # time=1.773ms
    
    # Subtest: 02.02 - set - two plain object
        ok 1 - 02.02
        1..1
    ok 10 - 02.02 - set - two plain object # time=1.966ms
    
    # Subtest: 02.03 - set - topmost level object, one value deleted, one changed
        ok 1 - 02.03
        1..1
    ok 11 - 02.03 - set - topmost level object, one value deleted, one changed # time=2.443ms
    
    # Subtest: 02.04 - set - search val object, updated val from plain obj to nested arr
        ok 1 - 02.04
        1..1
    ok 12 - 02.04 - set - search val object, updated val from plain obj to nested arr # time=1.859ms
    
    # Subtest: 02.05 - set - search value is array - updated value array
        ok 1 - 02.05
        1..1
    ok 13 - 02.05 - set - search value is array - updated value array # time=1.858ms
    
    # Subtest: 02.06 - set - search value is nested array - deleted finding
        ok 1 - 02.06
        1..1
    ok 14 - 02.06 - set - search value is nested array - deleted finding # time=1.803ms
    
    # Subtest: 02.07 - set - edit skipping similar, false search result
        ok 1 - 02.07
        1..1
    ok 15 - 02.07 - set - edit skipping similar, false search result # time=3.557ms
    
    # Subtest: 02.08 - set - numerous everything, wrong order
        ok 1 - 02.08
        1..1
    ok 16 - 02.08 - set - numerous everything, wrong order # time=2.305ms
    
    # Subtest: 03.01 - missing inputs - throws
        ok 1 - expected to throw
        1..1
    ok 17 - 03.01 - missing inputs - throws # time=1.961ms
    
    # Subtest: 03.02 - missing keyValPair
        ok 1 - expected to throw
        1..1
    ok 18 - 03.02 - missing keyValPair # time=7.271ms
    
    1..18
    # time=325.103ms
}

ok 2 - test/umd-test.js # time=64.246ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=20.58ms
    
    1..1
    # time=64.246ms
}

1..2
# time=3312.103ms
