TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - get - one plain object as result
        ok 1 - 01.01
        1..1
    ok 1 - 01.01 - get - one plain object as result # time=11.141ms
    
    # Subtest: 01.02 - get - two plain object as result
        ok 1 - 01.02
        1..1
    ok 2 - 01.02 - get - two plain object as result # time=2.982ms
    
    # Subtest: 01.03 - get - topmost level container is object
        ok 1 - 01.03
        1..1
    ok 3 - 01.03 - get - topmost level container is object # time=2.766ms
    
    # Subtest: 01.04 - get - search value is object
        ok 1 - 01.04
        1..1
    ok 4 - 01.04 - get - search value is object # time=10.7ms
    
    # Subtest: 01.05 - get - search value is array
        ok 1 - 01.05
        1..1
    ok 5 - 01.05 - get - search value is array # time=15.898ms
    
    # Subtest: 01.06 - get - search value is nested array
        ok 1 - 01.06
        1..1
    ok 6 - 01.06 - get - search value is nested array # time=21.196ms
    
    # Subtest: 01.07 - get - search value is nested object
        ok 1 - 01.07
        1..1
    ok 7 - 01.07 - get - search value is nested object # time=2.454ms
    
    # Subtest: 01.08 - get - numerous everything
        ok 1 - 01.08
        1..1
    ok 8 - 01.08 - get - numerous everything # time=2.175ms
    
    # Subtest: 02.01 - set - one plain object
        ok 1 - 02.01
        1..1
    ok 9 - 02.01 - set - one plain object # time=1.923ms
    
    # Subtest: 02.02 - set - two plain object
        ok 1 - 02.02
        1..1
    ok 10 - 02.02 - set - two plain object # time=2.017ms
    
    # Subtest: 02.03 - set - topmost level object, one value deleted, one changed
        ok 1 - 02.03
        1..1
    ok 11 - 02.03 - set - topmost level object, one value deleted, one changed # time=2.368ms
    
    # Subtest: 02.04 - set - search val object, updated val from plain obj to nested arr
        ok 1 - 02.04
        1..1
    ok 12 - 02.04 - set - search val object, updated val from plain obj to nested arr # time=1.97ms
    
    # Subtest: 02.05 - set - search value is array - updated value array
        ok 1 - 02.05
        1..1
    ok 13 - 02.05 - set - search value is array - updated value array # time=4.72ms
    
    # Subtest: 02.06 - set - search value is nested array - deleted finding
        ok 1 - 02.06
        1..1
    ok 14 - 02.06 - set - search value is nested array - deleted finding # time=1.998ms
    
    # Subtest: 02.07 - set - edit skipping similar, false search result
        ok 1 - 02.07
        1..1
    ok 15 - 02.07 - set - edit skipping similar, false search result # time=2.23ms
    
    # Subtest: 02.08 - set - numerous everything, wrong order
        ok 1 - 02.08
        1..1
    ok 16 - 02.08 - set - numerous everything, wrong order # time=2.168ms
    
    # Subtest: 03.01 - missing inputs - throws
        ok 1 - expected to throw
        1..1
    ok 17 - 03.01 - missing inputs - throws # time=2.109ms
    
    # Subtest: 03.02 - missing keyValPair
        ok 1 - expected to throw
        1..1
    ok 18 - 03.02 - missing keyValPair # time=1.549ms
    
    1..18
    # time=240.837ms
ok 1 - test/test.js # time=240.837ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=11.294ms
    
    1..1
    # time=17.214ms
ok 2 - test/umd-test.js # time=17.214ms

1..2
# time=5312.866ms
