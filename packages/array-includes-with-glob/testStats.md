TAP version 13
# Subtest: test/test.js
    # Subtest: 0.1 - throws when inputs are missing
        ok 1 - expected to throw
        1..1
    ok 1 - 0.1 - throws when inputs are missing # time=9.497ms
    
    # Subtest: 0.2 - throws when second arg is missing
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        1..3
    ok 2 - 0.2 - throws when second arg is missing # time=4.619ms
    
    # Subtest: 0.3 - first input arg is not array
        ok 1 - expected to throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        1..3
    ok 3 - 0.3 - first input arg is not array # time=4.393ms
    
    # Subtest: 0.4 - throws when second arg is not string
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 4 - 0.4 - throws when second arg is not string # time=10.416ms
    
    # Subtest: 0.5 - empty array always yields false
        ok 1 - expected to not throw
        1..1
    ok 5 - 0.5 - empty array always yields false # time=15.562ms
    
    # Subtest: 0.6 - non-empty array turned empty because of cleaning yields false too
        ok 1 - expected to not throw
        1..1
    ok 6 - 0.6 - non-empty array turned empty because of cleaning yields false too # time=2.505ms
    
    # Subtest: 0.7 - throws if options is set to nonsense
        ok 1 - expected to throw
        1..1
    ok 7 - 0.7 - throws if options is set to nonsense # time=1.977ms
    
    # Subtest: 1.1 - no wildcard, fails
        ok 1 - 1.1
        1..1
    ok 8 - 1.1 - no wildcard, fails # time=2.069ms
    
    # Subtest: 1.2 - no wildcard, succeeds
        ok 1 - 1.2
        1..1
    ok 9 - 1.2 - no wildcard, succeeds # time=1.746ms
    
    # Subtest: 1.3 - wildcard, succeeds
        ok 1 - 1.3.1
        ok 2 - 1.3.2
        ok 3 - 1.3.3
        1..3
    ok 10 - 1.3 - wildcard, succeeds # time=3.077ms
    
    # Subtest: 1.4 - wildcard, fails
        ok 1 - 1.4
        1..1
    ok 11 - 1.4 - wildcard, fails # time=1.854ms
    
    # Subtest: 1.5 - emoji everywhere
        ok 1 - 1.5.1
        ok 2 - 1.5.2
        ok 3 - 1.5.3
        ok 4 - 1.5.4
        1..4
    ok 12 - 1.5 - emoji everywhere # time=3.713ms
    
    # Subtest: 1.6 - second arg is empty string
        ok 1 - 1.6
        1..1
    ok 13 - 1.6 - second arg is empty string # time=0.948ms
    
    # Subtest: 1.7 - input is not array but string
        ok 1 - 1.7.1
        ok 2 - 1.7.2
        ok 3 - 1.7.3
        1..3
    ok 14 - 1.7 - input is not array but string # time=2.911ms
    
    # Subtest: 2.1 - both arrays, no wildcards
        ok 1 - 2.1.1 - default (opts ANY)
        ok 2 - 2.1.2 - hardcoded opts ANY
        ok 3 - 2.1.3 - opts ALL
        ok 4 - 2.1.4 - hardcoded opts ANY
        ok 5 - 2.1.5 - string source, array to search, with wildcards, found
        ok 6 - 2.1.6 - string source, array to search, with wildcards, not found
        ok 7 - 2.1.7 - opts ALL vs array
        ok 8 - 2.1.8 - opts ALL vs string
        ok 9 - 2.1.9 - opts ALL string vs string
        1..9
    ok 15 - 2.1 - both arrays, no wildcards # time=6.318ms
    
    # Subtest: 2.2 - various, #1
        ok 1 - 2.2.1 - two keys to match in a second arg, running on assumed default
        ok 2 - 2.2.2 - two keys to match in a second arg, running on hardcoded default
        ok 3 - 2.2.3 - two keys to match in a second arg, running on hardcoded default
        1..3
    ok 16 - 2.2 - various, #1 # time=2.906ms
    
    1..16
    # time=251.502ms
ok 1 - test/test.js # time=251.502ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equal
        1..1
    ok 1 - UMD build works fine # time=6.486ms
    
    1..1
    # time=12.603ms
ok 2 - test/umd-test.js # time=12.603ms

1..2
# time=4333.84ms
