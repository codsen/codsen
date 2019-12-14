TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - wrong inputs
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        ok 7 - expected to not throw
        ok 8 - expected to not throw
        ok 9 - expected to not throw
        ok 10 - expected to not throw
        ok 11 - expected to throw
        ok 12 - expected to throw
        ok 13 - expected to throw
        ok 14 - expected to throw
        ok 15 - expected to throw
        ok 16 - expected to throw
        1..16
    ok 1 - 01.01 - wrong inputs # time=41.617ms
    
    # Subtest: 01.02 - correct inputs
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to not throw
        1..3
    ok 2 - 01.02 - correct inputs # time=3.606ms
    
    # Subtest: 02.01 - deletes multiple chunks correctly
        ok 1 - 02.01
        1..1
    ok 3 - 02.01 - deletes multiple chunks correctly # time=2.062ms
    
    # Subtest: 02.02 - replaces multiple chunks correctly
        ok 1 - 02.02
        1..1
    ok 4 - 02.02 - replaces multiple chunks correctly # time=1.726ms
    
    # Subtest: 02.03 - deletes and replaces multiple chunks correctly
        ok 1 - 02.03
        1..1
    ok 5 - 02.03 - deletes and replaces multiple chunks correctly # time=1.702ms
    
    # Subtest: 02.04 - empty ranges array
        ok 1 - 02.04
        1..1
    ok 6 - 02.04 - empty ranges array # time=1.54ms
    
    # Subtest: 02.05 - deletes multiple chunks with zero indexes correctly
        ok 1 - 02.05
        1..1
    ok 7 - 02.05 - deletes multiple chunks with zero indexes correctly # time=1.634ms
    
    # Subtest: 02.06 - replaces multiple chunks with zero indexes correctly
        ok 1 - 02.06
        1..1
    ok 8 - 02.06 - replaces multiple chunks with zero indexes correctly # time=1.571ms
    
    # Subtest: 02.07 - replace with ending index zero
        ok 1 - 02.07.01 - both from and to indexes are zeros, because we're adding content in front
        ok 2 - 02.07.02 - single range, put straight into argument
        1..2
    ok 9 - 02.07 - replace with ending index zero # time=2.15ms
    
    # Subtest: 02.08 - null in third arg does nothing
        ok 1 - 02.08.01
        ok 2 - 02.08.02
        ok 3 - 02.08.03
        1..3
    ok 10 - 02.08 - null in third arg does nothing # time=2.706ms
    
    # Subtest: 02.09 - replaces multiple chunks correctly
        ok 1 - 02.09
        1..1
    ok 11 - 02.09 - replaces multiple chunks correctly # time=1.753ms
    
    # Subtest: 02.10 - replaces multiple chunks correctly given in a wrong order
        ok 1 - 02.10
        1..1
    ok 12 - 02.10 - replaces multiple chunks correctly given in a wrong order # time=1.526ms
    
    # Subtest: 02.11 - null as replacement range - does nothing
        ok 1 - 02.11.01
        1..1
    ok 13 - 02.11 - null as replacement range - does nothing # time=1.4ms
    
    # Subtest: 03.01 - basic replacement
        ok 1 - 03.01.01
        ok 2 - 03.01.02
        1..2
    ok 14 - 03.01 - basic replacement # time=2.024ms
    
    # Subtest: 03.02 - multiple replacement pieces
        ok 1 - 03.02
        1..1
    ok 15 - 03.02 - multiple replacement pieces # time=1.537ms
    
    # Subtest: 03.03 - null in replacement op - does nothing
        ok 1 - 03.03.01
        ok 2 - 03.03.02
        1..2
    ok 16 - 03.03 - null in replacement op - does nothing # time=2.131ms
    
    # Subtest: 04.01 - progressFn - basic replacement
        ok 1 - 04.01 - baseline
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        ok 4 - expect truthy value
        ok 5 - expect truthy value
        ok 6 - expect truthy value
        ok 7 - expect truthy value
        ok 8 - expect truthy value
        ok 9 - expect truthy value
        ok 10 - expect truthy value
        ok 11 - expect truthy value
        ok 12 - expect truthy value
        ok 13 - expect truthy value
        ok 14 - expect truthy value
        ok 15 - expect truthy value
        ok 16 - expect truthy value
        ok 17 - expect truthy value
        ok 18 - expect truthy value
        ok 19 - expect truthy value
        ok 20 - expect truthy value
        ok 21 - expect truthy value
        ok 22 - expect truthy value
        ok 23 - expect truthy value
        ok 24 - expect truthy value
        ok 25 - expect truthy value
        ok 26 - expect truthy value
        ok 27 - expect truthy value
        ok 28 - expect truthy value
        ok 29 - 04.02 - calls the progress function
        ok 30 - 04.03
        1..30
    ok 17 - 04.01 - progressFn - basic replacement # time=20.387ms
    
    1..17
    # time=186.874ms
ok 1 - test/test.js # time=186.874ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=8.745ms
    
    1..1
    # time=14.829ms
ok 2 - test/umd-test.js # time=14.829ms

1..2
# time=5133.61ms
