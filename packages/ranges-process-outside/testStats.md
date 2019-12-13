TAP version 13
ok 1 - test/test.js # time=307.366ms {
    # Subtest: 00.01 - [35mthrows[39m - first arg wrong #1
        ok 1 - expected to throw
        1..1
    ok 1 - 00.01 - [35mthrows[39m - first arg wrong #1 # time=6.94ms
    
    # Subtest: 00.02 - [35mthrows[39m - first arg wrong #2
        ok 1 - expected to throw
        1..1
    ok 2 - 00.02 - [35mthrows[39m - first arg wrong #2 # time=1.292ms
    
    # Subtest: 00.03 - [35mthrows[39m - first arg wrong #3
        ok 1 - expected to throw
        1..1
    ok 3 - 00.03 - [35mthrows[39m - first arg wrong #3 # time=1.033ms
    
    # Subtest: 00.04 - [35mthrows[39m - second arg wrong #4
        ok 1 - expected to throw
        1..1
    ok 4 - 00.04 - [35mthrows[39m - second arg wrong #4 # time=1.628ms
    
    # Subtest: 00.05 - [35mthrows[39m - second arg wrong #5
        ok 1 - expected to throw
        1..1
    ok 5 - 00.05 - [35mthrows[39m - second arg wrong #5 # time=1.281ms
    
    # Subtest: 00.06 - [35mthrows[39m - second arg null means absence of ranges
        ok 1 - expected to not throw
        1..1
    ok 6 - 00.06 - [35mthrows[39m - second arg null means absence of ranges # time=1.362ms
    
    # Subtest: 00.07 - [35mthrows[39m - third arg wrong
        ok 1 - expected to throw
        1..1
    ok 7 - 00.07 - [35mthrows[39m - third arg wrong # time=0.969ms
    
    # Subtest: 01.01 - [33mone range[39m - string covers ranges - not touching zero - checks
        ok 1 - 01.01
        1..1
    ok 8 - 01.01 - [33mone range[39m - string covers ranges - not touching zero - checks # time=7.681ms
    
    # Subtest: 01.02 - [33mone range[39m - string covers ranges - not touching zero - skip checks
        ok 1 - 01.02
        1..1
    ok 9 - 01.02 - [33mone range[39m - string covers ranges - not touching zero - skip checks # time=1.865ms
    
    # Subtest: 01.03 - [33mone range[39m - string covers ranges - touching zero - 1 range - checks
        ok 1 - 01.03
        1..1
    ok 10 - 01.03 - [33mone range[39m - string covers ranges - touching zero - 1 range - checks # time=3.269ms
    
    # Subtest: 01.04 - [33mone range[39m - string covers ranges - touching zero - 1 range - skip checks
        ok 1 - 01.04
        1..1
    ok 11 - 01.04 - [33mone range[39m - string covers ranges - touching zero - 1 range - skip checks # time=1.105ms
    
    # Subtest: 01.05 - [31mfew ranges[39m - string covers ranges - touching zero - 2 ranges
        ok 1 - 01.05
        1..1
    ok 12 - 01.05 - [31mfew ranges[39m - string covers ranges - touching zero - 2 ranges # time=1.204ms
    
    # Subtest: 01.06 - [31mfew ranges[39m - string covers ranges - touching zero - opposite order (testing ranges-merge)
        ok 1 - 01.06.01 - inputs were not mutated
        ok 2 - 01.06.02 - result is the same as in previous test
        1..2
    ok 13 - 01.06 - [31mfew ranges[39m - string covers ranges - touching zero - opposite order (testing ranges-merge) # time=2.701ms
    
    # Subtest: 01.07 - [31mfew ranges[39m - string covers ranges - touching zero - throws
        ok 1 - expected to throw
        1..1
    ok 14 - 01.07 - [31mfew ranges[39m - string covers ranges - touching zero - throws # time=5.111ms
    
    # Subtest: 01.08 - [31mfew ranges[39m - string covers ranges - touching zero - protrudes - with checks
        ok 1 - 01.08 - result is the same as in previous test
        1..1
    ok 15 - 01.08 - [31mfew ranges[39m - string covers ranges - touching zero - protrudes - with checks # time=1.987ms
    
    # Subtest: 01.09 - [31mfew ranges[39m - string covers ranges - touching zero - protrudes - with checks skip
        ok 1 - expected to throw
        1..1
    ok 16 - 01.09 - [31mfew ranges[39m - string covers ranges - touching zero - protrudes - with checks skip # time=1.104ms
    
    # Subtest: 01.10 - [33mone range[39m - absent ranges - empty array given
        ok 1 - 01.10
        1..1
    ok 17 - 01.10 - [33mone range[39m - absent ranges - empty array given # time=1.083ms
    
    # Subtest: 01.11 - [33mone range[39m - absent ranges - null given
        ok 1 - 01.11
        1..1
    ok 18 - 01.11 - [33mone range[39m - absent ranges - null given # time=1.025ms
    
    # Subtest: 01.12 - [33mone range[39m - absent ranges - null given + true (skip checks)
        ok 1 - 01.12
        1..1
    ok 19 - 01.12 - [33mone range[39m - absent ranges - null given + true (skip checks) # time=1.472ms
    
    # Subtest: 01.13 - [33mone range[39m - ranges completely cover str
        ok 1 - 01.13
        1..1
    ok 20 - 01.13 - [33mone range[39m - ranges completely cover str # time=1.343ms
    
    # Subtest: 01.14 - [33mone range[39m - ranges not cover str at all
        ok 1 - 01.14
        1..1
    ok 21 - 01.14 - [33mone range[39m - ranges not cover str at all # time=1.799ms
    
    # Subtest: 01.15 - [33mone range[39m - string covers ranges - emoji - checks on
        ok 1 - 01.15
        1..1
    ok 22 - 01.15 - [33mone range[39m - string covers ranges - emoji - checks on # time=28.432ms
    
    # Subtest: 01.16 - [33mone range[39m - string covers ranges - emoji - checks on
        ok 1 - 01.16 - sanity check
        ok 2 - 01.16.02
        1..2
    ok 23 - 01.16 - [33mone range[39m - string covers ranges - emoji - checks on # time=3.518ms
    
    # Subtest: 02.01 - [35moffsets[39m - offset once at index 5
        ok 1 - 02.01
        1..1
    ok 24 - 02.01 - [35moffsets[39m - offset once at index 5 # time=1.715ms
    
    # Subtest: 02.02 - [35moffsets[39m - offset once at index 6
        ok 1 - 02.02
        1..1
    ok 25 - 02.02 - [35moffsets[39m - offset once at index 6 # time=1.119ms
    
    # Subtest: 02.03 - [35moffsets[39m - sequential offsets
        ok 1 - 02.03
        1..1
    ok 26 - 02.03 - [35moffsets[39m - sequential offsets # time=1.402ms
    
    1..26
    # time=307.366ms
}

1..1
# time=4073.308ms
