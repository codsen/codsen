TAP version 13
ok 1 - test/test.js # time=250.504ms {
    # Subtest: 01.01 - [34mbasics[39m - second is a subset of the first
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        1..2
    ok 1 - 01.01 - [34mbasics[39m - second is a subset of the first # time=23.073ms
    
    # Subtest: 01.02 - [34mbasics[39m - first is a subset of the second (error)
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        1..3
    ok 2 - 01.02 - [34mbasics[39m - first is a subset of the second (error) # time=7.813ms
    
    # Subtest: 01.03 - [34mbasics[39m - types mismatch
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        ok 4 - 01.02.04
        1..4
    ok 3 - 01.03 - [34mbasics[39m - types mismatch # time=3.347ms
    
    # Subtest: 01.04 - [34mbasics[39m - arrays with string values, OK
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        1..2
    ok 4 - 01.04 - [34mbasics[39m - arrays with string values, OK # time=3.924ms
    
    # Subtest: 01.05 - [34mbasics[39m - arrays with string values, not OK
        ok 1 - 01.05.01
        ok 2 - 01.05.02
        ok 3 - 01.05.03
        1..3
    ok 5 - 01.05 - [34mbasics[39m - arrays with string values, not OK # time=8.557ms
    
    # Subtest: 01.06 - [34mbasics[39m - arrays with objects, opts.skipContainers=on (default)
        ok 1 - 01.06.01
        ok 2 - 01.06.02
        1..2
    ok 6 - 01.06 - [34mbasics[39m - arrays with objects, opts.skipContainers=on (default) # time=3.082ms
    
    # Subtest: 01.07 - [34mbasics[39m - arrays with objects, opts.skipContainers=off
        ok 1 - 01.07.01
        ok 2 - 01.07.02
        1..2
    ok 7 - 01.07 - [34mbasics[39m - arrays with objects, opts.skipContainers=off # time=2.589ms
    
    # Subtest: 02.01 - [36mopts.arrayStrictComparison[39m - elements are objects, order is wrong, [32mNOT STRICT[39m + [31mskipContainers[39m
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        1..2
    ok 8 - 02.01 - [36mopts.arrayStrictComparison[39m - elements are objects, order is wrong, [32mNOT STRICT[39m + [31mskipContainers[39m # time=2.322ms
    
    # Subtest: 02.02 - [36mopts.arrayStrictComparison[39m - elements are objects, order is wrong, [31mSTRICT[39m     + [31mskipContainers[39m
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        1..2
    ok 9 - 02.02 - [36mopts.arrayStrictComparison[39m - elements are objects, order is wrong, [31mSTRICT[39m     + [31mskipContainers[39m # time=3.702ms
    
    # Subtest: 02.03 - [36mopts.arrayStrictComparison[39m - elements are objects, order is wrong, [32mNOT STRICT[39m + [32mskipContainers[39m
        ok 1 - 02.03.01
        ok 2 - 02.03.02
        1..2
    ok 10 - 02.03 - [36mopts.arrayStrictComparison[39m - elements are objects, order is wrong, [32mNOT STRICT[39m + [32mskipContainers[39m # time=2.922ms
    
    # Subtest: 02.04 - [36mopts.arrayStrictComparison[39m - elements are objects, order is wrong, [31mSTRICT[39m     + [32mskipContainers[39m
        ok 1 - 02.04.01
        ok 2 - 02.04.02
        1..2
    ok 11 - 02.04 - [36mopts.arrayStrictComparison[39m - elements are objects, order is wrong, [31mSTRICT[39m     + [32mskipContainers[39m # time=1.997ms
    
    # Subtest: 03.01 - [36mdeeper nested[39m - [31mskipContainers[39m
        ok 1 - 03.01.01
        ok 2 - 03.01.02
        1..2
    ok 12 - 03.01 - [36mdeeper nested[39m - [31mskipContainers[39m # time=3.215ms
    
    # Subtest: 03.02 - [36mdeeper nested[39m - [32mskipContainers[39m
        ok 1 - 03.02.01
        ok 2 - 03.02.02
        1..2
    ok 13 - 03.02 - [36mdeeper nested[39m - [32mskipContainers[39m # time=2.397ms
    
    # Subtest: 03.03 - [36mopts.arrayStrictComparison[39m - one object inside each array
        ok 1 - 03.03.01
        ok 2 - 03.03.02
        1..2
    ok 14 - 03.03 - [36mopts.arrayStrictComparison[39m - one object inside each array # time=1.701ms
    
    # Subtest: 03.04 - [36mopts.arrayStrictComparison[39m - one object inside each array
        ok 1 - 03.04.01
        ok 2 - 03.04.02
        1..2
    ok 15 - 03.04 - [36mopts.arrayStrictComparison[39m - one object inside each array # time=4.386ms
    
    # Subtest: 05.01 - [35mcontinuing[39m - tree 1 has one more than tree 2
        ok 1 - 05.01.01
        ok 2 - 05.01.02
        1..2
    ok 16 - 05.01 - [35mcontinuing[39m - tree 1 has one more than tree 2 # time=2.266ms
    
    1..16
    # time=250.504ms
}

ok 2 - test/umd-test.js # time=27.799ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        ok 2 - should be equivalent
        1..2
    ok 1 - UMD build works fine # time=20.242ms
    
    1..1
    # time=27.799ms
}

1..2
# time=3253.103ms
