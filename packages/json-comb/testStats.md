TAP version 13
ok 1 - test/test.js # time=4437.795ms {
    # Subtest: 01.01 - version output mode
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 1 - 01.01 - version output mode # time=1306.253ms
    
    # Subtest: 01.02 - help output mode
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        ok 4 - should match pattern provided
        1..4
    ok 2 - 01.02 - help output mode # time=1196.139ms
    
    # Subtest: 01.03 - no files found in the given directory [ID_1]
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        1..2
    ok 3 - 01.03 - no files found in the given directory [ID_1] # time=630.79ms
    
    # Subtest: 01.04 - normalisation, called on the directory with subdirectories
        ok 1 - should be equivalent
        1..1
    ok 4 - 01.04 - normalisation, called on the directory with subdirectories # time=665.026ms
    
    # Subtest: 01.05 - normalisation stops if one file is given [ID_2]
        ok 1 - should match pattern provided
        1..1
    ok 5 - 01.05 - normalisation stops if one file is given [ID_2] # time=633.283ms
    
    1..5
    # time=4437.795ms
}

1..1
# time=5884.725ms
