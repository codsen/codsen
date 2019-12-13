TAP version 13
ok 1 - test/test.js # time=321.636ms {
    # Subtest: 01.01 - array containing empty string
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        1..2
    ok 1 - 01.01 - array containing empty string # time=10.498ms
    
    # Subtest: 01.02 - array containing plain object with empty string
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        1..2
    ok 2 - 01.02 - array containing plain object with empty string # time=2.733ms
    
    # Subtest: 01.03 - array containing plain obj containing array containing string
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        1..2
    ok 3 - 01.03 - array containing plain obj containing array containing string # time=2.204ms
    
    # Subtest: 01.04 - ast with multiple objects containing empty space
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        1..2
    ok 4 - 01.04 - ast with multiple objects containing empty space # time=1.776ms
    
    # Subtest: 02.01 - object containing empty strings
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        1..2
    ok 5 - 02.01 - object containing empty strings # time=1.711ms
    
    # Subtest: 02.02 - object containing arrays of empty strings
        ok 1 - 02.02
        1..1
    ok 6 - 02.02 - object containing arrays of empty strings # time=1.198ms
    
    # Subtest: 02.03 - object containing arrays of empty strings
        ok 1 - 02.03
        1..1
    ok 7 - 02.03 - object containing arrays of empty strings # time=1.384ms
    
    # Subtest: 02.04 - object containing arrays of empty strings
        ok 1 - 02.04
        1..1
    ok 8 - 02.04 - object containing arrays of empty strings # time=1.049ms
    
    # Subtest: 02.05 - object containing arrays of empty strings
        ok 1 - 02.05
        1..1
    ok 9 - 02.05 - object containing arrays of empty strings # time=2.166ms
    
    # Subtest: 02.06 - object containing arrays of empty strings
        ok 1 - 02.06
        1..1
    ok 10 - 02.06 - object containing arrays of empty strings # time=1.425ms
    
    # Subtest: 02.07 - object's value is null
        ok 1 - 02.07
        1..1
    ok 11 - 02.07 - object's value is null # time=0.965ms
    
    # Subtest: 03.01 - object containing empty strings
        ok 1 - 03.01.01
        ok 2 - 03.01.02
        ok 3 - 03.01.03
        ok 4 - 03.01.04
        ok 5 - 03.01.05
        1..5
    ok 12 - 03.01 - object containing empty strings # time=2.146ms
    
    # Subtest: 04.01 - function passed
        ok 1 - 04.01
        1..1
    ok 13 - 04.01 - function passed # time=0.987ms
    
    # Subtest: 04.02 - bool passed
        ok 1 - 04.02
        1..1
    ok 14 - 04.02 - bool passed # time=0.847ms
    
    # Subtest: 04.03 - null passed
        ok 1 - 04.03
        1..1
    ok 15 - 04.03 - null passed # time=0.741ms
    
    # Subtest: 04.04 - undefined passed
        ok 1 - 04.04
        1..1
    ok 16 - 04.04 - undefined passed # time=0.791ms
    
    # Subtest: 04.05 - null deeper in an array
        ok 1 - 04.05
        1..1
    ok 17 - 04.05 - null deeper in an array # time=0.991ms
    
    1..17
    # time=321.636ms
}

ok 2 - test/umd-test.js # time=25.628ms {
    # Subtest: UMD build works fine
        ok 1 - expect truthy value
        1..1
    ok 1 - UMD build works fine # time=16.167ms
    
    1..1
    # time=25.628ms
}

1..2
# time=2641.133ms
