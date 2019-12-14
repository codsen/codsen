TAP version 13
# Subtest: test/test.js
    # Subtest: 00.01 - [35mthrows[39m - first arg wrong #1
        ok 1 - expected to throw
        1..1
    ok 1 - 00.01 - [35mthrows[39m - first arg wrong #1 # time=9.621ms
    
    # Subtest: 00.02 - [35mthrows[39m - first arg wrong #2
        ok 1 - expected to throw
        1..1
    ok 2 - 00.02 - [35mthrows[39m - first arg wrong #2 # time=2.606ms
    
    # Subtest: 00.03 - [35mthrows[39m - first arg wrong #3
        ok 1 - expected to throw
        1..1
    ok 3 - 00.03 - [35mthrows[39m - first arg wrong #3 # time=2.033ms
    
    # Subtest: 00.04 - [35mthrows[39m - second arg wrong #4
        ok 1 - expected to throw
        1..1
    ok 4 - 00.04 - [35mthrows[39m - second arg wrong #4 # time=1.99ms
    
    # Subtest: 00.05 - [35mthrows[39m - second arg wrong #5
        ok 1 - expected to throw
        1..1
    ok 5 - 00.05 - [35mthrows[39m - second arg wrong #5 # time=1.142ms
    
    # Subtest: 00.06 - [35mthrows[39m - second arg null means absence of ranges
        ok 1 - expected to not throw
        1..1
    ok 6 - 00.06 - [35mthrows[39m - second arg null means absence of ranges # time=2.131ms
    
    # Subtest: 00.07 - [35mthrows[39m - third arg wrong
        ok 1 - expected to throw
        1..1
    ok 7 - 00.07 - [35mthrows[39m - third arg wrong # time=1.737ms
    
    # Subtest: 01.01 - [33mone range[39m - string covers ranges - not touching zero - checks
        ok 1 - 01.01
        1..1
    ok 8 - 01.01 - [33mone range[39m - string covers ranges - not touching zero - checks # time=4.341ms
    
    # Subtest: 01.02 - [33mone range[39m - string covers ranges - not touching zero - skip checks
        ok 1 - 01.02
        1..1
    ok 9 - 01.02 - [33mone range[39m - string covers ranges - not touching zero - skip checks # time=1.97ms
    
    # Subtest: 01.03 - [33mone range[39m - string covers ranges - touching zero - 1 range - checks
        ok 1 - 01.03
        1..1
    ok 10 - 01.03 - [33mone range[39m - string covers ranges - touching zero - 1 range - checks # time=1.859ms
    
    # Subtest: 01.04 - [33mone range[39m - string covers ranges - touching zero - 1 range - skip checks
        ok 1 - 01.04
        1..1
    ok 11 - 01.04 - [33mone range[39m - string covers ranges - touching zero - 1 range - skip checks # time=1.759ms
    
    # Subtest: 01.05 - [31mfew ranges[39m - string covers ranges - touching zero - 2 ranges
        ok 1 - 01.05
        1..1
    ok 12 - 01.05 - [31mfew ranges[39m - string covers ranges - touching zero - 2 ranges # time=1.837ms
    
    # Subtest: 01.06 - [31mfew ranges[39m - string covers ranges - touching zero - opposite order (testing ranges-merge)
        ok 1 - 01.06.01 - inputs were not mutated
        ok 2 - 01.06.02 - result is the same as in previous test
        1..2
    ok 13 - 01.06 - [31mfew ranges[39m - string covers ranges - touching zero - opposite order (testing ranges-merge) # time=4.943ms
    
    # Subtest: 01.07 - [31mfew ranges[39m - string covers ranges - touching zero - throws
        ok 1 - expected to throw
        1..1
    ok 14 - 01.07 - [31mfew ranges[39m - string covers ranges - touching zero - throws # time=1.623ms
    
    # Subtest: 01.08 - [31mfew ranges[39m - string covers ranges - touching zero - protrudes - with checks
        ok 1 - 01.08 - result is the same as in previous test
        1..1
    ok 15 - 01.08 - [31mfew ranges[39m - string covers ranges - touching zero - protrudes - with checks # time=1.802ms
    
    # Subtest: 01.09 - [31mfew ranges[39m - string covers ranges - touching zero - protrudes - with checks skip
        ok 1 - expected to throw
        1..1
    ok 16 - 01.09 - [31mfew ranges[39m - string covers ranges - touching zero - protrudes - with checks skip # time=1.539ms
    
    # Subtest: 01.10 - [33mone range[39m - absent ranges - empty array given
        ok 1 - 01.10
        1..1
    ok 17 - 01.10 - [33mone range[39m - absent ranges - empty array given # time=1.708ms
    
    # Subtest: 01.11 - [33mone range[39m - absent ranges - null given
        ok 1 - 01.11
        1..1
    ok 18 - 01.11 - [33mone range[39m - absent ranges - null given # time=1.783ms
    
    # Subtest: 01.12 - [33mone range[39m - absent ranges - null given + true (skip checks)
        ok 1 - 01.12
        1..1
    ok 19 - 01.12 - [33mone range[39m - absent ranges - null given + true (skip checks) # time=1.709ms
    
    # Subtest: 01.13 - [33mone range[39m - ranges completely cover str
        ok 1 - 01.13
        1..1
    ok 20 - 01.13 - [33mone range[39m - ranges completely cover str # time=1.606ms
    
    # Subtest: 01.14 - [33mone range[39m - ranges not cover str at all
        ok 1 - 01.14
        1..1
    ok 21 - 01.14 - [33mone range[39m - ranges not cover str at all # time=1.803ms
    
    # Subtest: 01.15 - [33mone range[39m - string covers ranges - emoji - checks on
        ok 1 - 01.15
        1..1
    ok 22 - 01.15 - [33mone range[39m - string covers ranges - emoji - checks on # time=2.161ms
    
    # Subtest: 01.16 - [33mone range[39m - string covers ranges - emoji - checks on
        ok 1 - 01.16 - sanity check
        ok 2 - 01.16.02
        1..2
    ok 23 - 01.16 - [33mone range[39m - string covers ranges - emoji - checks on # time=2.645ms
    
    # Subtest: 02.01 - [35moffsets[39m - offset once at index 5
        ok 1 - 02.01
        1..1
    ok 24 - 02.01 - [35moffsets[39m - offset once at index 5 # time=2.086ms
    
    # Subtest: 02.02 - [35moffsets[39m - offset once at index 6
        ok 1 - 02.02
        1..1
    ok 25 - 02.02 - [35moffsets[39m - offset once at index 6 # time=1.781ms
    
    # Subtest: 02.03 - [35moffsets[39m - sequential offsets
        ok 1 - 02.03
        1..1
    ok 26 - 02.03 - [35moffsets[39m - sequential offsets # time=2.021ms
    
    1..26
    # time=230.56ms
ok 1 - test/test.js # time=230.56ms

1..1
# time=2547.302ms
