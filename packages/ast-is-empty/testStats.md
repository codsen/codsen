TAP version 13
# Subtest: test/test.js
    # Subtest: 1.1 - plain object - true
        ok 1 - 1.1.1
        ok 2 - 1.1.2
        1..2
    ok 1 - 1.1 - plain object - true # time=8.914ms
    
    # Subtest: 1.2 - plain object - false
        ok 1 - 1.2
        1..1
    ok 2 - 1.2 - plain object - false # time=2.378ms
    
    # Subtest: 1.3 - array - true
        ok 1 - 1.3.1
        ok 2 - 1.3.2
        1..2
    ok 3 - 1.3 - array - true # time=2.445ms
    
    # Subtest: 1.4 - array - false
        ok 1 - 1.4
        1..1
    ok 4 - 1.4 - array - false # time=2.588ms
    
    # Subtest: 1.5 - nested array - true
        ok 1 - 1.5
        1..1
    ok 5 - 1.5 - nested array - true # time=1.582ms
    
    # Subtest: 1.6 - nested array - false
        ok 1 - 1.6
        1..1
    ok 6 - 1.6 - nested array - false # time=1.64ms
    
    # Subtest: 1.7 - nested plain object - true
        ok 1 - 1.7
        1..1
    ok 7 - 1.7 - nested plain object - true # time=5.72ms
    
    # Subtest: 1.8 - nested plain object - true
        ok 1 - 1.8
        1..1
    ok 8 - 1.8 - nested plain object - true # time=1.632ms
    
    # Subtest: 1.9 - nested many things - true
        ok 1 - 1.9
        1..1
    ok 9 - 1.9 - nested many things - true # time=1.508ms
    
    # Subtest: 1.10 - nested many things - true
        ok 1 - 1.10
        1..1
    ok 10 - 1.10 - nested many things - true # time=1.891ms
    
    # Subtest: 1.11 - string - true
        ok 1 - 1.11
        1..1
    ok 11 - 1.11 - string - true # time=1.525ms
    
    # Subtest: 1.12 - string - false
        ok 1 - 1.12
        1..1
    ok 12 - 1.12 - string - false # time=1.489ms
    
    # Subtest: 2.13 - function as input - returns null
        ok 1 - 2.13
        1..1
    ok 13 - 2.13 - function as input - returns null # time=1.701ms
    
    # Subtest: 2.14 - function as input - returns null
        ok 1 - 2.14.1
        ok 2 - 2.14.2
        1..2
    ok 14 - 2.14 - function as input - returns null # time=7.824ms
    
    # Subtest: 2.15 - null - returns null
        ok 1 - 2.15
        1..1
    ok 15 - 2.15 - null - returns null # time=9.326ms
    
    1..15
    # time=222.088ms
ok 1 - test/test.js # time=222.088ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - expect truthy value
        1..1
    ok 1 - UMD build works fine # time=5.858ms
    
    1..1
    # time=11.968ms
ok 2 - test/umd-test.js # time=11.968ms

1..2
# time=3867.626ms
