TAP version 13
# Subtest: test/test.js
    # Subtest: 00.00 - does not throw when the first arg is wrong
        ok 1 - 00.01.01
        ok 2 - 00.01.02
        1..2
    ok 1 - 00.00 - does not throw when the first arg is wrong # time=39.721ms
    
    # Subtest: 00.01 - throws when opts.progressFn is wrong
        ok 1 - expected to throw
        1..1
    ok 2 - 00.01 - throws when opts.progressFn is wrong # time=4.009ms
    
    # Subtest: 00.02 - throws when opts.mergeType is wrong
        ok 1 - expected to throw
        1..1
    ok 3 - 00.02 - throws when opts.mergeType is wrong # time=3.293ms
    
    # Subtest: 00.03 - throws when the second arg is wrong
        ok 1 - expected to throw
        1..1
    ok 4 - 00.03 - throws when the second arg is wrong # time=5.009ms
    
    # Subtest: 00.04 - throws when opts.joinRangesThatTouchEdges is wrong
        ok 1 - expected to throw
        1..1
    ok 5 - 00.04 - throws when opts.joinRangesThatTouchEdges is wrong # time=2.911ms
    
    # Subtest: 00.05
        ok 1 - expected to not throw
        1..1
    ok 6 - 00.05 # time=3.313ms
    
    # Subtest: 01.01 - simples: merges three overlapping ranges
        ok 1 - 01.01.01 - two args
        ok 2 - 01.01.02 - two args
        ok 3 - 01.01.03 - no mutation happened
        1..3
    ok 7 - 01.01 - simples: merges three overlapping ranges # time=6.204ms
    
    # Subtest: 01.02 - nothing to merge
        ok 1 - 01.02.01 - just sorted
        ok 2 - 01.02.02
        1..2
    ok 8 - 01.02 - nothing to merge # time=3.779ms
    
    # Subtest: 01.03 - empty input
        ok 1 - 01.03.01 - empty array
        ok 2 - 01.03.02 - null
        ok 3 - 01.03.03 - empty array
        ok 4 - 01.03.04 - null
        1..4
    ok 9 - 01.03 - empty input # time=11.924ms
    
    # Subtest: 01.04 - more complex case
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.03
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
        ok 15 - 01.04.04
        ok 16 - 01.04.05
        ok 17 - 01.04.06
        ok 18 - 01.04.07
        1..18
    ok 10 - 01.04 - more complex case # time=13.487ms
    
    # Subtest: 01.05 - even more complex case
        ok 1 - expect truthy value
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
        ok 20 - 01.05.01
        ok 21 - 01.05.02
        1..21
    ok 11 - 01.05 - even more complex case # time=12.072ms
    
    # Subtest: 01.06 - more merging examples
        ok 1 - 01.06.01
        1..1
    ok 12 - 01.06 - more merging examples # time=2.659ms
    
    # Subtest: 01.07 - superset range discards to-add content of their subset ranges #1
        ok 1 - 01.07
        1..1
    ok 13 - 01.07 - superset range discards to-add content of their subset ranges #1 # time=3.495ms
    
    # Subtest: 01.08 - superset range discards to-add content of their subset ranges #2
        ok 1 - 01.08
        1..1
    ok 14 - 01.08 - superset range discards to-add content of their subset ranges #2 # time=2.577ms
    
    # Subtest: 01.09 - superset range discards to-add content of their subset ranges #3
        ok 1 - 01.09.01
        ok 2 - 01.09.02
        ok 3 - 01.09.03
        ok 4 - 01.09.04
        1..4
    ok 15 - 01.09 - superset range discards to-add content of their subset ranges #3 # time=4.763ms
    
    # Subtest: 01.10 - third arg is null
        ok 1 - 01.10.01
        ok 2 - 01.10.02
        ok 3 - 01.10.03
        ok 4 - 01.10.04
        ok 5 - 01.10.05
        1..5
    ok 16 - 01.10 - third arg is null # time=5.71ms
    
    # Subtest: 01.11 - only one range, nothing to merge
        ok 1 - 01.11.01
        ok 2 - 01.11.02
        1..2
    ok 17 - 01.11 - only one range, nothing to merge # time=3.238ms
    
    # Subtest: 01.12 - input arg mutation prevention
        ok 1 - useless test
        ok 2 - 01.12.01 - mutation didn't happen
        1..2
    ok 18 - 01.12 - input arg mutation prevention # time=3.226ms
    
    # Subtest: 01.13 - only two identical args in the range
        ok 1 - 01.13.01
        ok 2 - 01.13.02
        ok 3 - 01.13.03
        ok 4 - 01.13.04
        1..4
    ok 19 - 01.13 - only two identical args in the range # time=4.754ms
    
    # Subtest: 01.14 - third arg
        ok 1 - 01.14.01
        ok 2 - 01.14.02
        ok 3 - 01.14.03
        ok 4 - 01.14.04
        ok 5 - 01.14.05
        ok 6 - 01.14.06
        ok 7 - 01.14.07
        ok 8 - 01.14.08
        1..8
    ok 20 - 01.14 - third arg # time=9.071ms
    
    # Subtest: 02.01 - few ranges starting at the same index
        ok 1 - 02.01.01 - control #1
        ok 2 - 02.01.02 - control #2
        ok 3 - 02.01.03 - hardcoded correct default value
        ok 4 - 02.01.04 - hardcoded incorrect type default value
        ok 5 - 02.01.05
        ok 6 - 02.01.06
        ok 7 - 02.01.07
        1..7
    ok 21 - 02.01 - few ranges starting at the same index # time=20.484ms
    
    # Subtest: 03.01 - third arg
        ok 1 - 03.01.01
        ok 2 - 03.01.02
        ok 3 - 03.01.03
        1..3
    ok 22 - 03.01 - third arg # time=11.323ms
    
    1..22
    # time=397.677ms
ok 1 - test/test.js # time=397.677ms

1..1
# time=3396.382ms
