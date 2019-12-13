TAP version 13
ok 1 - test/test.js # time=1003.439ms {
    # Subtest: 00.01 - [33mnull[39m - missing input
        ok 1 - 00.01.01
        ok 2 - 00.01.02
        ok 3 - 00.01.03
        ok 4 - 00.01.04
        1..4
    ok 1 - 00.01 - [33mnull[39m - missing input # time=19.446ms
    
    # Subtest: 00.02 - [33mnull[39m - non-string input
        ok 1 - 00.02.01
        ok 2 - 00.02.02
        ok 3 - 00.02.03
        ok 4 - 00.02.04
        1..4
    ok 2 - 00.02 - [33mnull[39m - non-string input # time=3.733ms
    
    # Subtest: 00.03 - [33mnull[39m - non-string input
        ok 1 - 00.03.01
        ok 2 - 00.03.02
        ok 3 - 00.03.03
        ok 4 - 00.03.04
        ok 5 - 00.03.05
        ok 6 - 00.03.06
        ok 7 - 00.03.07
        ok 8 - 00.03.08
        1..8
    ok 3 - 00.03 - [33mnull[39m - non-string input # time=3.472ms
    
    # Subtest: 01.01 - [31mleft[39m - null result cases
        ok 1 - 01.01.01 - assumed default
        ok 2 - 01.01.02 - hardcoded default
        ok 3 - 01.01.03 - hardcoded default
        ok 4 - 01.01.04 - at string.length + 1
        ok 5 - 01.01.05 - outside of the string.length
        ok 6 - 01.01.06
        ok 7 - 01.01.07
        ok 8 - 01.01.08
        ok 9 - 01.01.09
        ok 10 - 01.01.10
        1..10
    ok 4 - 01.01 - [31mleft[39m - null result cases # time=5.725ms
    
    # Subtest: 01.02 - [31mleft[39m - normal use
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        ok 4 - 01.02.04
        ok 5 - 01.02.05
        ok 6 - 01.02.06
        ok 7 - 01.02.07
        ok 8 - 01.02.08
        ok 9 - 01.02.09
        ok 10 - 01.02.10
        1..10
    ok 5 - 01.02 - [31mleft[39m - normal use # time=6.099ms
    
    # Subtest: 02.01 - [34mright[39m - calling at string length
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        ok 5 - 02.01.05
        ok 6 - 02.01.06
        ok 7 - 02.01.07
        ok 8 - 02.01.08
        1..8
    ok 6 - 02.01 - [34mright[39m - calling at string length # time=4.251ms
    
    # Subtest: 02.02 - [34mright[39m - normal use
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        ok 5 - 02.02.05
        ok 6 - 02.02.06
        1..6
    ok 7 - 02.02 - [34mright[39m - normal use # time=2.682ms
    
    # Subtest: 03.01 - [35mrightSeq[39m - normal use
        ok 1 - 03.01.01
        ok 2 - 03.01.02
        ok 3 - 03.01.03
        1..3
    ok 8 - 03.01 - [35mrightSeq[39m - normal use # time=11.185ms
    
    # Subtest: 03.02 - [35mrightSeq[39m - no findings
        ok 1 - 03.02.01
        1..1
    ok 9 - 03.02 - [35mrightSeq[39m - no findings # time=4.695ms
    
    # Subtest: 03.03 - [35mrightSeq[39m - absent skips to right()
        ok 1 - 03.03.01
        ok 2 - 03.03.02
        ok 3 - 03.03.03
        1..3
    ok 10 - 03.03 - [35mrightSeq[39m - absent skips to right() # time=2.39ms
    
    # Subtest: 03.04 - [35mrightSeq[39m - no sequence arguments - turns into right()
        ok 1 - 03.04.01
        ok 2 - 03.04.02
        ok 3 - 03.04.03
        1..3
    ok 11 - 03.04 - [35mrightSeq[39m - no sequence arguments - turns into right() # time=1.537ms
    
    # Subtest: 03.05 - [35mrightSeq[39m - starting point outside of the range
        ok 1 - 03.05
        1..1
    ok 12 - 03.05 - [35mrightSeq[39m - starting point outside of the range # time=1.143ms
    
    # Subtest: 03.06 - [35mrightSeq[39m - optional - existing
        ok 1 - 03.06
        1..1
    ok 13 - 03.06 - [35mrightSeq[39m - optional - existing # time=4.953ms
    
    # Subtest: 03.07 - [35mrightSeq[39m - [31moptional[39m - 1 not existing, no whitespace
        ok 1 - 03.07
        1..1
    ok 14 - 03.07 - [35mrightSeq[39m - [31moptional[39m - 1 not existing, no whitespace # time=4.187ms
    
    # Subtest: 03.08 - [35mrightSeq[39m - [31moptional[39m - 1 not existing, with whitespace
        ok 1 - 03.08
        1..1
    ok 15 - 03.08 - [35mrightSeq[39m - [31moptional[39m - 1 not existing, with whitespace # time=6.608ms
    
    # Subtest: 03.09 - [35mrightSeq[39m - [31moptional[39m - ends with non-existing optional
        ok 1 - 03.09
        1..1
    ok 16 - 03.09 - [35mrightSeq[39m - [31moptional[39m - ends with non-existing optional # time=11.51ms
    
    # Subtest: 03.10 - [35mrightSeq[39m - all optional, existing
        ok 1 - 03.10
        1..1
    ok 17 - 03.10 - [35mrightSeq[39m - all optional, existing # time=1.376ms
    
    # Subtest: 03.11 - [35mrightSeq[39m - all optional, not existing
        ok 1 - 03.11.01
        ok 2 - 03.11.02
        ok 3 - 03.11.03
        1..3
    ok 18 - 03.11 - [35mrightSeq[39m - all optional, not existing # time=2.132ms
    
    # Subtest: 03.12 - [35mrightSeq[39m - no findings
        ok 1 - 03.12
        ok 2 - 03.12
        1..2
    ok 19 - 03.12 - [35mrightSeq[39m - no findings # time=1.913ms
    
    # Subtest: 04.01 - [36mleftSeq[39m - normal use
        ok 1 - 04.01.01
        ok 2 - 04.01.02
        ok 3 - 04.01.03
        ok 4 - 04.01.04
        1..4
    ok 20 - 04.01 - [36mleftSeq[39m - normal use # time=5.455ms
    
    # Subtest: 04.02 - [36mleftSeq[39m - no findings
        ok 1 - 04.02.01
        ok 2 - 04.02.02
        ok 3 - 04.02.03
        ok 4 - 04.02.04
        ok 5 - 04.02.05
        1..5
    ok 21 - 04.02 - [36mleftSeq[39m - no findings # time=2.675ms
    
    # Subtest: 04.03 - [36mleftSeq[39m - no sequence arguments
        ok 1 - 04.03.01
        ok 2 - 04.03.02
        ok 3 - 04.03.03
        ok 4 - 04.03.04
        ok 5 - 04.03.05
        1..5
    ok 22 - 04.03 - [36mleftSeq[39m - no sequence arguments # time=3.819ms
    
    # Subtest: 04.04 - [36mleftSeq[39m - starting point outside of the range
        ok 1 - 04.04
        1..1
    ok 23 - 04.04 - [36mleftSeq[39m - starting point outside of the range # time=1.042ms
    
    # Subtest: 04.05 - [36mleftSeq[39m - case insensitive
        ok 1 - 04.05.01
        ok 2 - 04.05.02
        1..2
    ok 24 - 04.05 - [36mleftSeq[39m - case insensitive # time=1.792ms
    
    # Subtest: 05.01 - [32mchompRight[39m - [34mfound[39m - mode: 0
        ok 1 - 05.01.01
        ok 2 - 05.01.02
        ok 3 - 05.01.03
        ok 4 - 05.01.04
        ok 5 - 05.01.05
        ok 6 - 05.01.06
        ok 7 - 05.01.07
        ok 8 - 05.01.08
        ok 9 - 05.01.09
        ok 10 - 05.01.10
        ok 11 - 05.01.11
        ok 12 - 05.01.12 - falsey values default to 0
        ok 13 - 05.01.13 - falsey values default to 0
        ok 14 - 05.01.14 - falsey values default to 0
        1..14
    ok 25 - 05.01 - [32mchompRight[39m - [34mfound[39m - mode: 0 # time=19.075ms
    
    # Subtest: 05.02 - [32mchompRight[39m - [34mfound[39m - mode: 1
        ok 1 - 05.02.01
        ok 2 - 05.02.02
        ok 3 - 05.02.03
        ok 4 - 05.02.04
        ok 5 - 05.02.05
        ok 6 - 05.02.06
        ok 7 - 05.02.07
        1..7
    ok 26 - 05.02 - [32mchompRight[39m - [34mfound[39m - mode: 1 # time=13.006ms
    
    # Subtest: 05.03 - [32mchompRight[39m - [34mfound[39m - mode: 2
        ok 1 - 05.03.01
        ok 2 - 05.03.02
        ok 3 - 05.03.03
        ok 4 - 05.03.04
        ok 5 - 05.03.05
        ok 6 - 05.03.06
        ok 7 - 05.03.07
        1..7
    ok 27 - 05.03 - [32mchompRight[39m - [34mfound[39m - mode: 2 # time=4.933ms
    
    # Subtest: 05.04 - [32mchompRight[39m - [34mfound[39m - mode: 3
        ok 1 - 05.04.01
        ok 2 - 05.04.02
        ok 3 - 05.04.03
        ok 4 - 05.04.04
        ok 5 - 05.04.05
        ok 6 - 05.04.06
        ok 7 - 05.04.07
        1..7
    ok 28 - 05.04 - [32mchompRight[39m - [34mfound[39m - mode: 3 # time=4.788ms
    
    # Subtest: 05.05 - [32mchompRight[39m - [31mnot found[39m - all modes
        ok 1 - 05.05.00
        ok 2 - 05.05.01
        ok 3 - 05.05.02
        ok 4 - 05.05.03
        ok 5 - 05.05.04
        ok 6 - 05.05.05
        ok 7 - 05.05.06
        ok 8 - 05.05.07
        ok 9 - 05.05.08
        ok 10 - 05.05.09
        ok 11 - 05.05.10
        ok 12 - 05.05.11
        ok 13 - 05.05.12
        ok 14 - 05.05.13
        ok 15 - 05.05.14
        ok 16 - 05.05.15
        ok 17 - 05.05.16
        ok 18 - 05.05.17
        1..18
    ok 29 - 05.05 - [32mchompRight[39m - [31mnot found[39m - all modes # time=9.765ms
    
    # Subtest: 05.06 - [32mchompRight[39m - [33mthrows[39m
        ok 1 - expected to throw
        1..1
    ok 30 - 05.06 - [32mchompRight[39m - [33mthrows[39m # time=4.573ms
    
    # Subtest: 05.07 - [32mchompRight[39m - [33madhoc[39m #1
        ok 1 - 05.07
        1..1
    ok 31 - 05.07 - [32mchompRight[39m - [33madhoc[39m #1 # time=1.275ms
    
    # Subtest: 05.08 - [32mchompRight[39m - [33madhoc[39m #2
        ok 1 - 05.08
        1..1
    ok 32 - 05.08 - [32mchompRight[39m - [33madhoc[39m #2 # time=1.104ms
    
    # Subtest: 05.09 - [32mchompRight[39m - [33madhoc[39m #3
        ok 1 - 05.09
        1..1
    ok 33 - 05.09 - [32mchompRight[39m - [33madhoc[39m #3 # time=1.062ms
    
    # Subtest: 05.10 - [32mchompRight[39m - [33madhoc[39m #4
        ok 1 - 05.10.01
        ok 2 - 05.10.02
        ok 3 - 05.10.03
        1..3
    ok 34 - 05.10 - [32mchompRight[39m - [33madhoc[39m #4 # time=2.408ms
    
    # Subtest: 05.11 - [32mchompRight[39m - [31madhoc[39m #5 - real life
        ok 1 - 05.11.01
        ok 2 - 05.11.02
        ok 3 - 05.11.03
        ok 4 - 05.11.04
        ok 5 - 05.11.05
        ok 6 - 05.11.06
        ok 7 - 05.11.07
        ok 8 - 05.11.08
        ok 9 - 05.11.09
        ok 10 - 05.11.10
        ok 11 - 05.11.11
        ok 12 - 05.11.12
        ok 13 - 05.11.13
        ok 14 - 05.11.14
        ok 15 - 05.11.15
        ok 16 - 05.11.16
        ok 17 - 05.11.17
        ok 18 - 05.11.18
        ok 19 - 05.11.19
        ok 20 - 05.11.20
        ok 21 - 05.11.21
        ok 22 - 05.11.22
        ok 23 - 05.11.23
        ok 24 - 05.11.24
        ok 25 - 05.11.25
        ok 26 - 05.11.26
        ok 27 - 05.11.27
        ok 28 - 05.11.28
        ok 29 - 05.11.29
        ok 30 - 05.11.30
        ok 31 - 05.11.31
        ok 32 - 05.11.32
        ok 33 - 05.11.33
        ok 34 - 05.11.34
        ok 35 - 05.11.35
        1..35
    ok 35 - 05.11 - [32mchompRight[39m - [31madhoc[39m #5 - real life # time=29.665ms
    
    # Subtest: 06.01 - [34mchompLeft[39m - [32mfound[39m - mode: 0
        ok 1 - 06.01.01
        ok 2 - 06.01.02
        ok 3 - 06.01.03
        ok 4 - 06.01.04
        ok 5 - 06.01.05
        ok 6 - 06.01.06
        ok 7 - 06.01.07
        ok 8 - 06.01.08
        ok 9 - 06.01.09
        ok 10 - 06.01.10
        ok 11 - 06.01.11
        ok 12 - 06.01.12
        ok 13 - 06.01.13
        ok 14 - 06.01.14
        ok 15 - 06.01.15
        ok 16 - 06.01.16
        1..16
    ok 36 - 06.01 - [34mchompLeft[39m - [32mfound[39m - mode: 0 # time=12.392ms
    
    # Subtest: 06.02 - [34mchompLeft[39m - [32mfound[39m - mode: 1
        ok 1 - 06.02.06
        ok 2 - 06.02.07
        ok 3 - 06.02.08
        ok 4 - 06.02.09
        ok 5 - 06.02.10
        ok 6 - 06.02.11
        1..6
    ok 37 - 06.02 - [34mchompLeft[39m - [32mfound[39m - mode: 1 # time=6.458ms
    
    # Subtest: 06.03 - [34mchompLeft[39m - [32mfound[39m - mode: 2
        ok 1 - 06.03.06
        ok 2 - 06.03.07
        ok 3 - 06.03.08
        ok 4 - 06.03.09
        ok 5 - 06.03.10
        ok 6 - 06.03.11
        1..6
    ok 38 - 06.03 - [34mchompLeft[39m - [32mfound[39m - mode: 2 # time=7.633ms
    
    # Subtest: 06.04 - [34mchompLeft[39m - [32mfound[39m - mode: 3
        ok 1 - 06.04.06
        ok 2 - 06.04.07
        ok 3 - 06.04.08
        ok 4 - 06.04.09
        ok 5 - 06.04.10
        ok 6 - 06.04.11
        ok 7 - 06.04.12
        1..7
    ok 39 - 06.04 - [34mchompLeft[39m - [32mfound[39m - mode: 3 # time=12.485ms
    
    # Subtest: 06.05 - [34mchompLeft[39m - [31mnot found[39m - all modes
        ok 1 - 06.05.00
        ok 2 - 06.05.00
        ok 3 - 06.05.00
        ok 4 - 06.05.01
        ok 5 - 06.05.02
        ok 6 - 06.05.03
        ok 7 - 06.05.04
        ok 8 - 06.05.05
        ok 9 - 05.05.06
        ok 10 - 05.05.07
        ok 11 - 05.05.08
        ok 12 - 05.05.09
        ok 13 - 05.05.10
        ok 14 - 05.05.11
        ok 15 - 05.05.12
        ok 16 - 05.05.13
        ok 17 - 05.05.14
        ok 18 - 05.05.15
        ok 19 - 05.05.16
        ok 20 - 05.05.17
        ok 21 - 05.05.18
        ok 22 - 05.05.19
        ok 23 - 05.05.20
        1..23
    ok 40 - 06.05 - [34mchompLeft[39m - [31mnot found[39m - all modes # time=9ms
    
    # Subtest: 06.06 - [34mchompLeft[39m - [33mthrows[39m
        ok 1 - expected to throw
        1..1
    ok 41 - 06.06 - [34mchompLeft[39m - [33mthrows[39m # time=1.217ms
    
    # Subtest: 06.07 - [34mchompLeft[39m - [33madhoc[39m #1
        ok 1 - 06.07.01
        1..1
    ok 42 - 06.07 - [34mchompLeft[39m - [33madhoc[39m #1 # time=1.182ms
    
    # Subtest: 06.08 - [34mchompLeft[39m - [33madhoc[39m #2
        ok 1 - 06.08
        1..1
    ok 43 - 06.08 - [34mchompLeft[39m - [33madhoc[39m #2 # time=1.252ms
    
    # Subtest: 06.09 - [34mchompLeft[39m - [33madhoc[39m #3
        ok 1 - 06.09.01
        ok 2 - 06.09.02
        1..2
    ok 44 - 06.09 - [34mchompLeft[39m - [33madhoc[39m #3 # time=1.869ms
    
    # Subtest: 06.10 - [34mchompLeft[39m - [33madhoc[39m #4
        ok 1 - 06.10
        1..1
    ok 45 - 06.10 - [34mchompLeft[39m - [33madhoc[39m #4 # time=1.02ms
    
    # Subtest: 06.11 - [34mchompLeft[39m - [33madhoc[39m #5
        ok 1 - 06.11.01
        ok 2 - 06.11.02
        ok 3 - 06.11.03
        1..3
    ok 46 - 06.11 - [34mchompLeft[39m - [33madhoc[39m #5 # time=5.63ms
    
    # Subtest: 06.12 - [34mchompLeft[39m - [33madhoc[39m #5
        ok 1 - 06.12.01
        ok 2 - 06.12.02
        ok 3 - 06.12.03
        1..3
    ok 47 - 06.12 - [34mchompLeft[39m - [33madhoc[39m #5 # time=2.557ms
    
    # Subtest: 05.13 - [34mchompLeft[39m - [33madhoc[39m #6 - real life
        ok 1 - 05.13.01
        ok 2 - 05.13.02
        ok 3 - 05.13.03
        ok 4 - 05.13.04
        ok 5 - 05.13.05
        ok 6 - 05.13.06
        ok 7 - 05.13.07
        ok 8 - 05.13.08
        ok 9 - 05.13.09
        ok 10 - 05.13.10
        ok 11 - 05.13.11
        ok 12 - 05.13.12
        ok 13 - 05.13.13
        ok 14 - 05.13.14
        ok 15 - 05.13.15
        ok 16 - 05.13.16
        ok 17 - 05.13.17
        ok 18 - 05.13.18
        ok 19 - 05.13.19
        ok 20 - 05.13.20
        ok 21 - 05.13.21
        ok 22 - 05.13.22
        ok 23 - 05.13.23
        ok 24 - 05.13.24
        ok 25 - 05.13.25
        1..25
    ok 48 - 05.13 - [34mchompLeft[39m - [33madhoc[39m #6 - real life # time=13.942ms
    
    # Subtest: 05.14 - [34mchompLeft[39m - [33madhoc[39m #7 - real life
        ok 1 - 05.14.01
        ok 2 - 05.14.02
        ok 3 - 05.14.03
        ok 4 - 05.14.04
        1..4
    ok 49 - 05.14 - [34mchompLeft[39m - [33madhoc[39m #7 - real life # time=7.779ms
    
    # Subtest: 05.15 - [34mchompLeft[39m - [33mhungry[39m sequence
        ok 1 - 05.15
        1..1
    ok 50 - 05.15 - [34mchompLeft[39m - [33mhungry[39m sequence # time=1.196ms
    
    # Subtest: 05.16 - [34mchompLeft[39m - [33mhungry[39m sequence
        ok 1 - 05.16
        1..1
    ok 51 - 05.16 - [34mchompLeft[39m - [33mhungry[39m sequence # time=1.227ms
    
    # Subtest: 06.01 - [35mleftStopAtNewLines[39m - null result cases
        ok 1 - 06.01.01 - assumed default
        ok 2 - 06.01.02 - hardcoded default
        ok 3 - 06.01.03 - hardcoded default
        ok 4 - 06.01.04 - at string.length + 1
        ok 5 - 06.01.05 - outside of the string.length
        ok 6 - 06.01.06
        ok 7 - 06.01.07
        ok 8 - 06.01.08
        ok 9 - 06.01.09
        ok 10 - 06.01.10
        1..10
    ok 52 - 06.01 - [35mleftStopAtNewLines[39m - null result cases # time=2.969ms
    
    # Subtest: 06.02 - [35mleftStopAtNewLines[39m - normal use
        ok 1 - 06.02.01
        ok 2 - 06.02.02
        ok 3 - 06.02.03
        ok 4 - 06.02.04
        ok 5 - 06.02.05
        ok 6 - 06.02.06
        ok 7 - 06.02.07
        ok 8 - 06.02.08
        ok 9 - 06.02.09
        ok 10 - 06.02.10
# time=4521.021ms
        ok 11 - 06.02.11
        ok 12 - 06.02.12
        ok 13 - 06.02.13
        ok 14 - 06.02.14
        1..14
    ok 53 - 06.02 - [35mleftStopAtNewLines[39m - normal use # time=4.158ms
    
    # Subtest: 07.01 - [36mrirightStopAtNewLinesght[39m - calling at string length
        ok 1 - 07.01.01
        ok 2 - 07.01.02
        ok 3 - 07.01.03
        ok 4 - 07.01.04
        ok 5 - 07.01.05
        ok 6 - 07.01.06
        ok 7 - 07.01.07
        ok 8 - 07.01.08
        1..8
    ok 54 - 07.01 - [36mrirightStopAtNewLinesght[39m - calling at string length # time=2.663ms
    
    # Subtest: 07.02 - [36mrightStopAtNewLines[39m - normal use
        ok 1 - 07.02.01
        ok 2 - 07.02.02
        ok 3 - 07.02.03
        ok 4 - 07.02.04
        ok 5 - 07.02.05
        ok 6 - 07.02.06
        ok 7 - 07.02.07
        ok 8 - 07.02.08
        ok 9 - 07.02.09
        ok 10 - 07.02.10
        ok 11 - 07.02.11
        ok 12 - 07.02.12
        ok 13 - 07.02.13
        ok 14 - 07.02.14
        ok 15 - 07.02.15
        ok 16 - 07.02.16
        ok 17 - 07.02.17
        ok 18 - 07.02.18
        ok 19 - 07.02.19
        ok 20 - 07.02.20
        1..20
    ok 55 - 07.02 - [36mrightStopAtNewLines[39m - normal use # time=18.025ms
    
    1..55
    # time=1003.439ms
}

1..1
