TAP version 13
# Subtest: test/test.js
    # Subtest: 01 - empty string, defaults
        ok 1 - 01
        1..1
    ok 1 - 01 - empty string, defaults # time=9.273ms
    
    # Subtest: 02 - empty string, classicTrim=false
        ok 1 - 02 - hardcoded default
        1..1
    ok 2 - 02 - empty string, classicTrim=false # time=2.53ms
    
    # Subtest: 03 - empty string, classicTrim=true
        ok 1 - 03
        1..1
    ok 3 - 03 - empty string, classicTrim=true # time=2.245ms
    
    # Subtest: 04 - single space, defaults
        ok 1 - 04
        1..1
    ok 4 - 04 - single space, defaults # time=2.483ms
    
    # Subtest: 05 - single space, classicTrim=false
        ok 1 - 05
        1..1
    ok 5 - 05 - single space, classicTrim=false # time=2.003ms
    
    # Subtest: 06 - single space, classicTrim=true
        ok 1 - 06
        1..1
    ok 6 - 06 - single space, classicTrim=true # time=1.948ms
    
    # Subtest: 07 - single letter
        ok 1 - 07
        1..1
    ok 7 - 07 - single letter # time=13.133ms
    
    # Subtest: 08 - single letter, classicTrim=false
        ok 1 - 08
        1..1
    ok 8 - 08 - single letter, classicTrim=false # time=2.969ms
    
    # Subtest: 09 - single letter, classicTrim=true
        ok 1 - 09
        1..1
    ok 9 - 09 - single letter, classicTrim=true # time=1.997ms
    
    # Subtest: 10 - leading space, default
        ok 1 - 10
        1..1
    ok 10 - 10 - leading space, default # time=1.871ms
    
    # Subtest: 11 - leading space, classicTrim=false
        ok 1 - 11
        1..1
    ok 11 - 11 - leading space, classicTrim=false # time=1.74ms
    
    # Subtest: 12 - leading space, classicTrim=true
        ok 1 - 12
        1..1
    ok 12 - 12 - leading space, classicTrim=true # time=1.699ms
    
    # Subtest: 13 - trailing space, defaults
        ok 1 - 13
        1..1
    ok 13 - 13 - trailing space, defaults # time=1.667ms
    
    # Subtest: 14 - trailing space, defaults
        ok 1 - 14
        1..1
    ok 14 - 14 - trailing space, defaults # time=1.628ms
    
    # Subtest: 15 - trailing space, defaults
        ok 1 - 15
        1..1
    ok 15 - 15 - trailing space, defaults # time=1.602ms
    
    # Subtest: 16 - space on both sides
        ok 1 - 16
        1..1
    ok 16 - 16 - space on both sides # time=1.698ms
    
    # Subtest: 17 - space on both sides - copes with emoji
        ok 1 - 17
        1..1
    ok 17 - 17 - space on both sides - copes with emoji # time=4.84ms
    
    # Subtest: 18 - space on both sides - classicTrim=true
        ok 1 - 18
        1..1
    ok 18 - 18 - space on both sides - classicTrim=true # time=1.787ms
    
    # Subtest: 19 - space on both sides - copes with emoji - classicTrim=true
        ok 1 - 19
        1..1
    ok 19 - 19 - space on both sides - copes with emoji - classicTrim=true # time=1.726ms
    
    # Subtest: 20 - trimming hits the newline and stops
        ok 1 - 20
        1..1
    ok 20 - 20 - trimming hits the newline and stops # time=1.624ms
    
    # Subtest: 21 - trimming hits the tab and stops
        ok 1 - 21
        1..1
    ok 21 - 21 - trimming hits the tab and stops # time=1.692ms
    
    # Subtest: 22 - trimming hits the newline and stops - classicTrim
        ok 1 - 22
        1..1
    ok 22 - 22 - trimming hits the newline and stops - classicTrim # time=1.924ms
    
    # Subtest: 23 - trimming hits the tab and stops - classicTrim
        ok 1 - 23
        1..1
    ok 23 - 23 - trimming hits the tab and stops - classicTrim # time=1.676ms
    
    # Subtest: 24 - non-string input
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        ok 7 - expected to throw
        ok 8 - expected to throw
        1..8
    ok 24 - 24 - non-string input # time=6.281ms
    
    # Subtest: 25 - opts.space - default
        ok 1 - 25
        1..1
    ok 25 - 25 - opts.space - default # time=0.847ms
    
    # Subtest: 26 - opts.space - tabs
        ok 1 - 26.01
        ok 2 - 26.02
        ok 3 - 26.03 - classicTrim negates everything
        ok 4 - 26.04
        ok 5 - 26.05 - spaces trim is not enabled and stops everything
        1..5
    ok 26 - 26 - opts.space - tabs # time=4.446ms
    
    # Subtest: 27 - opts.cr
        ok 1 - 27.01
        ok 2 - 27.02
        ok 3 - 27.03 - classicTrim negates all other settings
        ok 4 - 27.04
        ok 5 - 27.05 - spaces turned off
        ok 6 - 27.06 - only CR's trimmed as requested
        1..6
    ok 27 - 27 - opts.cr # time=4.958ms
    
    # Subtest: 28 - opts.lf
        ok 1 - 28.01
        ok 2 - 28.02
        ok 3 - 28.03 - classicTrim negates all other settings
        ok 4 - 28.04
        ok 5 - 28.05 - spaces turned off
        ok 6 - 28.06 - only CR's trimmed as requested
        1..6
    ok 28 - 28 - opts.lf # time=9.123ms
    
    # Subtest: 29 - opts.tab
        ok 1 - 29.01
        ok 2 - 29.02
        ok 3 - 29.03 - classicTrim negates all other settings
        ok 4 - 29.04
        ok 5 - 29.05 - spaces turted off
        ok 6 - 29.06 - only tabs were trimmed as requested
        1..6
    ok 29 - 29 - opts.tab # time=6.187ms
    
    # Subtest: 30 - opts.nbsp
        ok 1 - 30.01
        ok 2 - 30.02
        ok 3 - 30.03 - classicTrim negates all other settings
        ok 4 - 30.04
        ok 5 - 30.05 - spaces turted off
        ok 6 - 30.06 - only tabs were trimmed as requested
        ok 7 - 30.07
        1..7
    ok 30 - 30 - opts.nbsp # time=13.392ms
    
    1..30
    # time=373.921ms
ok 1 - test/test.js # time=373.921ms

1..1
# time=2539.85ms
