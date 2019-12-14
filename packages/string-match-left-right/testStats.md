TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - throws
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - bypassing THROW_ID_02
        ok 8 - expected to throw
        ok 9 - expect truthy value
        ok 10 - expected to throw
        ok 11 - expect truthy value
        ok 12 - expected to throw
        ok 13 - expect truthy value
        ok 14 - expected to throw
        ok 15 - expect truthy value
        ok 16 - expected to throw
        ok 17 - expect truthy value
        ok 18 - bypassing THROW_ID_03
        ok 19 - expected to throw
        ok 20 - expect truthy value
        ok 21 - expected to throw
        ok 22 - expect truthy value
        ok 23 - expected to throw
        ok 24 - expect truthy value
        ok 25 - expected to throw
        ok 26 - expect truthy value
        ok 27 - expected to throw
        ok 28 - expect truthy value
        ok 29 - expected to throw
        ok 30 - expect truthy value
        ok 31 - expected to throw
        ok 32 - expect truthy value
        ok 33 - bypassing THROW_ID_01
        ok 34 - expected to throw
        ok 35 - expect truthy value
        ok 36 - expected to throw
        ok 37 - expect truthy value
        ok 38 - expected to throw
        ok 39 - expect truthy value
        ok 40 - expected to throw
        ok 41 - expect truthy value
        ok 42 - expected to throw
        ok 43 - expect truthy value
        ok 44 - expected to throw
        ok 45 - expect truthy value
        ok 46 - expected to throw
        ok 47 - expect truthy value
        ok 48 - expected to throw
        ok 49 - expect truthy value
        ok 50 - expected to throw
        ok 51 - expect truthy value
        ok 52 - expected to throw
        ok 53 - expect truthy value
        ok 54 - expected to throw
        ok 55 - expect truthy value
        ok 56 - expect truthy value
        1..56
    ok 1 - 01.01 - throws # time=38.03ms
    
    # Subtest: 02.01 - [33mmatchLeftIncl()[39m      on a simple string
        ok 1 - 02.01.01 - pointless, but still
        ok 2 - 02.01.02 - one elem to match
        ok 3 - 02.01.03 - multiple to match
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - expected to throw
        ok 7 - should be equal
        ok 8 - 02.01.07.1
        ok 9 - 02.01.07.2
        ok 10 - should be equal
        ok 11 - should be equal
        ok 12 - should be equal
        1..12
    ok 2 - 02.01 - [33mmatchLeftIncl()[39m      on a simple string # time=8.461ms
    
    # Subtest: 02.02 - [33mmatchLeftIncl()[39m      case insensitive
        ok 1 - 02.02.01 - control
        ok 2 - 02.02.02 - opts.i
        ok 3 - should be equal
        ok 4 - 02.02.04 - source is uppercase, needle is lowercase
        1..4
    ok 3 - 02.02 - [33mmatchLeftIncl()[39m      case insensitive # time=3.322ms
    
    # Subtest: 02.03 - [33mmatchLeftIncl()[39m      left substring to check is longer than what's on the left
        ok 1 - should be equal
        ok 2 - 02.03.02 - opts should not affect anything here
        1..2
    ok 4 - 02.03 - [33mmatchLeftIncl()[39m      left substring to check is longer than what's on the left # time=2.283ms
    
    # Subtest: 02.04 - [33mmatchLeftIncl()[39m     cb gives outside index which is outside of string length
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - 02.04
        1..4
    ok 5 - 02.04 - [33mmatchLeftIncl()[39m     cb gives outside index which is outside of string length # time=3.112ms
    
    # Subtest: 03.01 - [31mmatchLeft()[39m          on a simple string
        ok 1 - should be equal
        ok 2 - 03.01.02 - one elem to match
        ok 3 - 03.01.03 - multiple to match
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - expected to throw
        ok 7 - should be equal
        ok 8 - should be equal
        1..8
    ok 6 - 03.01 - [31mmatchLeft()[39m          on a simple string # time=5.345ms
    
    # Subtest: 03.02 - [31mmatchLeft()[39m          case insensitive
        ok 1 - 03.02.01 - control
        ok 2 - 03.02.02 - opts.i
        1..2
    ok 7 - 03.02 - [31mmatchLeft()[39m          case insensitive # time=2.227ms
    
    # Subtest: 04.01 - [35mmatchRightIncl()[39m     on a simple string, non zero arg
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - expected to throw
        ok 6 - should be equal
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        1..10
    ok 8 - 04.01 - [35mmatchRightIncl()[39m     on a simple string, non zero arg # time=8.646ms
    
    # Subtest: 04.02 - [35mmatchRightIncl()[39m     on a simple string, index zero
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        1..4
    ok 9 - 04.02 - [35mmatchRightIncl()[39m     on a simple string, index zero # time=2.908ms
    
    # Subtest: 04.03 - [35mmatchRightIncl()[39m     on a simple string, case insensitive
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        1..4
    ok 10 - 04.03 - [35mmatchRightIncl()[39m     on a simple string, case insensitive # time=3.095ms
    
    # Subtest: 04.04 - [35mmatchRightIncl()[39m     cb gives outside index which is outside of string length
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - 04.04
        1..4
    ok 11 - 04.04 - [35mmatchRightIncl()[39m     cb gives outside index which is outside of string length # time=2.728ms
    
    # Subtest: 05.01 - [32mmatchRight()[39m         on a simple string, non zero arg
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - expected to throw
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        1..11
    ok 12 - 05.01 - [32mmatchRight()[39m         on a simple string, non zero arg # time=18.638ms
    
    # Subtest: 05.02 - [32mmatchRight()[39m         on a simple string, non zero arg
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        1..4
    ok 13 - 05.02 - [32mmatchRight()[39m         on a simple string, non zero arg # time=5.437ms
    
    # Subtest: 05.03 - [32mmatchRight()[39m         on a simple string, case insensitive
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        1..4
    ok 14 - 05.03 - [32mmatchRight()[39m         on a simple string, case insensitive # time=2.933ms
    
    # Subtest: 05.04 - [32mmatchRight()[39m         adhoc test #1
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 15 - 05.04 - [32mmatchRight()[39m         adhoc test #1 # time=1.838ms
    
    # Subtest: 06.01 - [36mopts.cb()[39m            callback is called back. haha!
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - expected to throw
        ok 6 - 06.01.05 - result will fail because substring is not matched
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        1..11
    ok 16 - 06.01 - [36mopts.cb()[39m            callback is called back. haha! # time=6.638ms
    
    # Subtest: 06.02 - [36mopts.cb()[39m            opts.matchLeft() - various combos
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - should be equal
        1..6
    ok 17 - 06.02 - [36mopts.cb()[39m            opts.matchLeft() - various combos # time=3.951ms
    
    # Subtest: 06.03 - [36mopts.cb()[39m            opts.matchLeftIncl() - callback and trimming
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        1..11
    ok 18 - 06.03 - [36mopts.cb()[39m            opts.matchLeftIncl() - callback and trimming # time=13.142ms
    
    # Subtest: 06.03 - [36mopts.cb()[39m            callback is called back, pt.1
        ok 1 - 06.03.01.01
        ok 2 - 06.03.01.02
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - should be equal
        1..7
    ok 19 - 06.03 - [36mopts.cb()[39m            callback is called back, pt.1 # time=7.793ms
    
    # Subtest: 06.04 - [36mopts.cb()[39m            callback is called, pt.2
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        ok 12 - should be equal
        ok 13 - should be equal
        ok 14 - should be equal
        ok 15 - should be equal
        ok 16 - should be equal
        1..16
    ok 20 - 06.04 - [36mopts.cb()[39m            callback is called, pt.2 # time=10.218ms
    
    # Subtest: 06.05 - [36mopts.cb()[39m            matchRight - third callback argument (index)
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        ok 12 - should be equal
        ok 13 - should be equal
        ok 14 - should be equal
        ok 15 - should be equal
        ok 16 - should be equal
        ok 17 - should be equal
        ok 18 - should be equal
        1..18
    ok 21 - 06.05 - [36mopts.cb()[39m            matchRight - third callback argument (index) # time=8.186ms
    
    # Subtest: 06.06 - [36mopts.cb()[39m            matchLeft -  third callback argument (index)
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - should be equal
        1..6
    ok 22 - 06.06 - [36mopts.cb()[39m            matchLeft -  third callback argument (index) # time=5.08ms
    
    # Subtest: 07.01 - [34mopts.trimCharsBeforeMatching[39m       pt.1
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - expected to throw
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        1..11
    ok 23 - 07.01 - [34mopts.trimCharsBeforeMatching[39m       pt.1 # time=6.913ms
    
    # Subtest: 07.02 - [34mopts.trimCharsBeforeMatching[39m       pt.2
        ok 1 - should be equal
        ok 2 - 07.02.02 - opts.trimCharsBeforeMatching given as string
        ok 3 - 07.02.03 - opts.trimCharsBeforeMatching given within array
        ok 4 - 07.02.04 - opts.trimCharsBeforeMatching given within array
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - 07.02.07 - case insensitive affects trimCharsBeforeMatching too and yields results
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        ok 12 - should be equal
        ok 13 - should be equal
        ok 14 - should be equal
        ok 15 - should be equal
        ok 16 - should be equal
        ok 17 - should be equal
        ok 18 - should be equal
        ok 19 - should be equal
        ok 20 - should be equal
        ok 21 - should be equal
        ok 22 - should be equal
        ok 23 - should be equal
        ok 24 - should be equal
        ok 25 - should be equal
        ok 26 - should be equal
        ok 27 - should be equal
        ok 28 - should be equal
        ok 29 - should be equal
        ok 30 - should be equal
        1..30
    ok 24 - 07.02 - [34mopts.trimCharsBeforeMatching[39m       pt.2 # time=18.248ms
    
    # Subtest: 07.03 - [34mopts.trimCharsBeforeMatching[39m       throws
        ok 1 - should be equal
        ok 2 - expected to throw
        ok 3 - should be equal
        ok 4 - expected to throw
        ok 5 - should be equal
        ok 6 - expected to throw
        ok 7 - should be equal
        ok 8 - expected to throw
        1..8
    ok 25 - 07.03 - [34mopts.trimCharsBeforeMatching[39m       throws # time=7.282ms
    
    # Subtest: 07.04 - [34memoji[39m - [36mmarching across emoji[39m - matchRight()
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - 07.04.03* - pinning all cb values
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - 07.04.07* - pinning all cb values
        1..10
    ok 26 - 07.04 - [34memoji[39m - [36mmarching across emoji[39m - matchRight() # time=16.092ms
    
    # Subtest: 07.05 - [34memoji[39m - [35mtrimming emoji[39m - matchLeft()
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - 07.05.01* - jumps past two spaces and emoji - simplified
        ok 5 - 07.05.06
        ok 6 - 07.05.07
        ok 7 - should be equal
        ok 8 - 07.05.05* - jumps past two spaces and emoji - complete, proper
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        ok 12 - 07.05.09*
        ok 13 - should be equal
        ok 14 - should be equal
        ok 15 - should be equal
        ok 16 - 07.05.13*
        ok 17 - should be equal
        ok 18 - should be equal
        ok 19 - should be equal
        ok 20 - 07.05.17*
        ok 21 - should be equal
        ok 22 - should be equal
        ok 23 - should be equal
        ok 24 - 07.05.21*
        ok 25 - should be equal
        ok 26 - should be equal
        ok 27 - should be equal
        ok 28 - 07.05.25*
        1..28
    ok 27 - 07.05 - [34memoji[39m - [35mtrimming emoji[39m - matchLeft() # time=43.763ms
    
    # Subtest: 07.06 - [34memoji[39m - [35mtrimming emoji[39m - matchRight()
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - 07.06.04
        ok 4 - 07.06.01* - jumps past two spaces and emoji - simplified
        ok 5 - should be equal
        ok 6 - 07.06.07
        ok 7 - should be equal
        ok 8 - 07.06.05* - jumps past two spaces and emoji - complete, proper
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - 07.06.12
        ok 12 - 07.06.09*
        ok 13 - should be equal
        ok 14 - should be equal
        ok 15 - 07.06.16
        ok 16 - 07.06.13*
        ok 17 - should be equal
        ok 18 - should be equal
        ok 19 - 07.06.20
        ok 20 - 07.06.17*
        1..20
    ok 28 - 07.06 - [34memoji[39m - [35mtrimming emoji[39m - matchRight() # time=21.683ms
    
    # Subtest: 07.07 - [34memoji[39m - [35mtrimming emoji[39m - matchLeftIncl()
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - 07.07.01*
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - should be equal
        ok 8 - 07.07.05*
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        ok 12 - 07.07.09* - inclusive, starting in the middle between the surrogates
        ok 13 - should be equal
        ok 14 - should be equal
        ok 15 - should be equal
        ok 16 - 07.07.10* - inclusive, starting in the middle between the surrogates
        ok 17 - should be equal
        ok 18 - should be equal
        ok 19 - should be equal
        ok 20 - 07.07.14*
        ok 21 - should be equal
        ok 22 - should be equal
        ok 23 - should be equal
        ok 24 - 07.07.18*
        ok 25 - 07.07.23
        ok 26 - 07.07.24
        ok 27 - should be equal
        ok 28 - 07.07.22*
        ok 29 - should be equal
        ok 30 - should be equal
        ok 31 - should be equal
        ok 32 - 07.07.26*
        1..32
    ok 29 - 07.07 - [34memoji[39m - [35mtrimming emoji[39m - matchLeftIncl() # time=16.069ms
    
    # Subtest: 07.08 - [34memoji[39m - [35mtrimming emoji[39m - matchRightIncl()
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - 07.08.01*
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - should be equal
        ok 8 - 07.08.05*
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        ok 12 - 07.08.09*
        ok 13 - should be equal
        ok 14 - should be equal
        ok 15 - should be equal
        ok 16 - 07.08.13*
        ok 17 - should be equal
        ok 18 - should be equal
        ok 19 - should be equal
        ok 20 - 07.08.14*
        ok 21 - 07.08.23
        ok 22 - 07.08.24
        ok 23 - should be equal
        ok 24 - 07.08.22*
        ok 25 - should be equal
        ok 26 - should be equal
        ok 27 - should be equal
        ok 28 - 07.08.26*
        ok 29 - should be equal
        ok 30 - should be equal
        ok 31 - should be equal
        ok 32 - 07.07.30*
        1..32
    ok 30 - 07.08 - [34memoji[39m - [35mtrimming emoji[39m - matchRightIncl() # time=14.403ms
    
    # Subtest: 08.01 - new in v1.5.0 - [33msecond arg in callback[39m - matchRight()
        ok 1 - 08.01.02
        ok 2 - 08.01.03
        ok 3 - 08.01.04
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - should be equal
        ok 7 - should be equal
        ok 8 - should be equal
        ok 9 - should be equal
        ok 10 - should be equal
        ok 11 - should be equal
        ok 12 - should be equal
        ok 13 - should be equal
        ok 14 - should be equal
        ok 15 - should be equal
        1..15
    ok 31 - 08.01 - new in v1.5.0 - [33msecond arg in callback[39m - matchRight() # time=9.361ms
    
    # Subtest: 08.02 - new in v1.5.0 - [33msecond arg in callback[39m - matchRightIncl()
        ok 1 - 08.02.01
        ok 2 - 08.02.02
        ok 3 - 08.02.03
        ok 4 - 08.02.04
        ok 5 - 08.02.05
        1..5
    ok 32 - 08.02 - new in v1.5.0 - [33msecond arg in callback[39m - matchRightIncl() # time=5.837ms
    
    # Subtest: 08.03 - new in v1.5.0 - [33msecond arg in callback[39m - matchLeft()
        ok 1 - 08.03.01
        ok 2 - 08.03.02
        ok 3 - 08.03.03
        ok 4 - 08.03.04
        ok 5 - 08.03.05
        1..5
    ok 33 - 08.03 - new in v1.5.0 - [33msecond arg in callback[39m - matchLeft() # time=1.694ms
    
    # Subtest: 08.04 - new in v1.5.0 - [33msecond arg in callback[39m - matchLeftIncl()
        ok 1 - 08.04.01
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        ok 5 - should be equal
        ok 6 - 08.04.06 - cheeky - nothing for callback to hang onto
        1..6
    ok 34 - 08.04 - new in v1.5.0 - [33msecond arg in callback[39m - matchLeftIncl() # time=3.744ms
    
    # Subtest: 09.01 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeft()
        ok 1 - expect truthy value
        ok 2 - expect falsey value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 35 - 09.01 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeft() # time=2.997ms
    
    # Subtest: 09.02 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()
        ok 1 - expect falsey value
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 36 - 09.02 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl() # time=3.126ms
    
    # Subtest: 09.03 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight()
        ok 1 - expect truthy value
        ok 2 - expect falsey value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 37 - 09.03 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight() # time=4.141ms
    
    # Subtest: 09.04 - [36mopts.cb()[39m   [32mcallback only[39m - matchRightIncl()
        ok 1 - expect falsey value
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 38 - 09.04 - [36mopts.cb()[39m   [32mcallback only[39m - matchRightIncl() # time=3.275ms
    
    # Subtest: 09.05 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight() other cb args
        ok 1 - expect truthy value
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        1..3
    ok 39 - 09.05 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight() other cb args # time=2.655ms
    
    # Subtest: 09.06 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight()     + [33mopts.trimBeforeMatching[39m
        ok 1 - expect falsey value
        ok 2 - expect falsey value
        ok 3 - expect falsey value
        ok 4 - expect truthy value
        ok 5 - expect truthy value
        ok 6 - expect truthy value
        1..6
    ok 40 - 09.06 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight()     + [33mopts.trimBeforeMatching[39m # time=12.966ms
    
    # Subtest: 09.07 - [36mopts.cb()[39m   [32mcallback only[39m - matchRightIncl() + [33mopts.trimBeforeMatching[39m
        ok 1 - expect falsey value
        ok 2 - expect falsey value
        ok 3 - expect falsey value
        ok 4 - expect truthy value
        ok 5 - expect truthy value
        ok 6 - expect truthy value
        1..6
    ok 41 - 09.07 - [36mopts.cb()[39m   [32mcallback only[39m - matchRightIncl() + [33mopts.trimBeforeMatching[39m # time=4.123ms
    
    # Subtest: 09.08 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeft()      + [33mopts.trimBeforeMatching[39m
        ok 1 - expect falsey value
        ok 2 - expect falsey value
        ok 3 - expect falsey value
        ok 4 - expect truthy value
        ok 5 - expect truthy value
        ok 6 - expect truthy value
        1..6
    ok 42 - 09.08 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeft()      + [33mopts.trimBeforeMatching[39m # time=6.559ms
    
    # Subtest: 09.09 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()  + [33mopts.trimBeforeMatching[39m
        ok 1 - expect falsey value
        ok 2 - expect falsey value
        ok 3 - expect falsey value
        ok 4 - expect truthy value
        ok 5 - expect truthy value
        ok 6 - expect truthy value
        1..6
    ok 43 - 09.09 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()  + [33mopts.trimBeforeMatching[39m # time=3.839ms
    
    # Subtest: 09.10 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()  + [33mopts.trimBeforeMatching[39m - trims to nothing
        ok 1 - expect truthy value
        ok 2 - expect falsey value
        1..2
    ok 44 - 09.10 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()  + [33mopts.trimBeforeMatching[39m - trims to nothing # time=1.913ms
    
    # Subtest: 09.11 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()  + [35mopts.trimCharsBeforeMatching[39m
        ok 1 - expect falsey value
        ok 2 - expect truthy value
        1..2
    ok 45 - 09.11 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()  + [35mopts.trimCharsBeforeMatching[39m # time=3.864ms
    
    # Subtest: 09.12 - [36mopts.cb()[39m   [32mcallback only[39m - matchRightIncl() + [35mopts.trimCharsBeforeMatching[39m
        ok 1 - expect falsey value
        ok 2 - expect truthy value
        1..2
    ok 46 - 09.12 - [36mopts.cb()[39m   [32mcallback only[39m - matchRightIncl() + [35mopts.trimCharsBeforeMatching[39m # time=1.995ms
    
    # Subtest: 09.11 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeft()      + [35mopts.trimCharsBeforeMatching[39m
        ok 1 - expect falsey value
        ok 2 - expect truthy value
        1..2
    ok 47 - 09.11 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeft()      + [35mopts.trimCharsBeforeMatching[39m # time=1.978ms
    
    # Subtest: 09.12 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight()     + [35mopts.trimCharsBeforeMatching[39m
        ok 1 - expect falsey value
        ok 2 - expect truthy value
        1..2
    ok 48 - 09.12 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight()     + [35mopts.trimCharsBeforeMatching[39m # time=2.059ms
    
    # Subtest: 09.13 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeft()      - [32memoji[39m + [36mtrims[39m
        ok 1 - expect falsey value
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        ok 4 - expect truthy value
        ok 5 - expect falsey value
        ok 6 - expect truthy value
        1..6
    ok 49 - 09.13 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeft()      - [32memoji[39m + [36mtrims[39m # time=5.383ms
    
    # Subtest: 09.14 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight()     - [32memoji[39m + [36mtrims[39m
        ok 1 - expect falsey value
        ok 2 - expect falsey value
        ok 3 - expect falsey value
        ok 4 - expect falsey value
        ok 5 - expect truthy value
        ok 6 - expect truthy value
        ok 7 - expect truthy value
        ok 8 - expect truthy value
        ok 9 - expect truthy value
        ok 10 - expect falsey value
        ok 11 - expect falsey value
        ok 12 - expect truthy value
        ok 13 - expect falsey value
        ok 14 - expect truthy value
        ok 15 - expect truthy value
        ok 16 - expect falsey value
        ok 17 - expect truthy value
        ok 18 - expect falsey value
        ok 19 - expect falsey value
        ok 20 - expect truthy value
        ok 21 - expect truthy value
        ok 22 - expect falsey value
        ok 23 - expect truthy value
        ok 24 - expect truthy value
        ok 25 - expect falsey value
        ok 26 - expect falsey value
        ok 27 - expect falsey value
        ok 28 - expect truthy value
        ok 29 - expect falsey value
        ok 30 - expect truthy value
        ok 31 - expect falsey value
        ok 32 - expect truthy value
        ok 33 - expect falsey value
        ok 34 - expect truthy value
        1..34
    ok 50 - 09.14 - [36mopts.cb()[39m   [32mcallback only[39m - matchRight()     - [32memoji[39m + [36mtrims[39m # time=18.551ms
    
    # Subtest: 09.15 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()  - [32memoji[39m + [36mtrims[39m
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - expect falsey value
        ok 5 - expect falsey value
        ok 6 - expect truthy value
        1..6
    ok 51 - 09.15 - [36mopts.cb()[39m   [32mcallback only[39m - matchLeftIncl()  - [32memoji[39m + [36mtrims[39m # time=3.649ms
    
    # Subtest: 10.01 - [32mmatchLeft()[39m       [33mEOL[39m matching
        ok 1 - should be equal
        1..1
    ok 52 - 10.01 - [32mmatchLeft()[39m       [33mEOL[39m matching # time=4.191ms
    
    # Subtest: 10.02 - [32mmatchLeft()[39m       [33mEOL[39m matching
        ok 1 - should be equal
        1..1
    ok 53 - 10.02 - [32mmatchLeft()[39m       [33mEOL[39m matching # time=1.429ms
    
    # Subtest: 10.03 - [32mmatchLeft()[39m       [33mEOL[39m matching - cb blocking result
        ok 1 - should be equal
        1..1
    ok 54 - 10.03 - [32mmatchLeft()[39m       [33mEOL[39m matching - cb blocking result # time=1.466ms
    
    # Subtest: 10.04 - [32mmatchLeft()[39m       [33mEOL[39m matching - useless cb
        ok 1 - should be equal
        1..1
    ok 55 - 10.04 - [32mmatchLeft()[39m       [33mEOL[39m matching - useless cb # time=1.338ms
    
    # Subtest: 10.05 - [32mmatchLeft()[39m       [33mEOL[39m matching - useless cb
        ok 1 - should be equivalent
        1..1
    ok 56 - 10.05 - [32mmatchLeft()[39m       [33mEOL[39m matching - useless cb # time=2.435ms
    
    # Subtest: 10.06 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opts control
        ok 1 - should be equal
        1..1
    ok 57 - 10.06 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opts control # time=1.616ms
    
    # Subtest: 10.07 - [32mmatchLeft()[39m       [33mEOL[39m matching - CHEEKY!!!
        ok 1 - should be equal
        1..1
    ok 58 - 10.07 - [32mmatchLeft()[39m       [33mEOL[39m matching - CHEEKY!!! # time=1.622ms
    
    # Subtest: 10.08 - [32mmatchLeft()[39m       [33mEOL[39m matching - !!!
        ok 1 - should be equal
        1..1
    ok 59 - 10.08 - [32mmatchLeft()[39m       [33mEOL[39m matching - !!! # time=1.42ms
    
    # Subtest: 10.09 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opt on
        ok 1 - should be equal
        1..1
    ok 60 - 10.09 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opt on # time=1.524ms
    
    # Subtest: 10.10 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opts control
        ok 1 - should be equal
        1..1
    ok 61 - 10.10 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opts control # time=1.546ms
    
    # Subtest: 10.11 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opt on
        ok 1 - should be equal
        1..1
    ok 62 - 10.11 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opt on # time=1.567ms
    
    # Subtest: 10.12 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opts control
        ok 1 - should be equal
        1..1
    ok 63 - 10.12 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opts control # time=1.394ms
    
    # Subtest: 10.13 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opt on
        ok 1 - should be equal
        1..1
    ok 64 - 10.13 - [32mmatchLeft()[39m       [33mEOL[39m matching - whitespace trim opt on # time=1.374ms
    
    # Subtest: 11.01 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m
        ok 1 - should be equal
        1..1
    ok 65 - 11.01 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m # time=1.513ms
    
    # Subtest: 11.02 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m
        ok 1 - should be equal
        1..1
    ok 66 - 11.02 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m # time=1.414ms
    
    # Subtest: 11.03 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m
        ok 1 - should be equal
        1..1
    ok 67 - 11.03 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m # time=1.229ms
    
    # Subtest: 11.04 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m
        ok 1 - should be equal
        1..1
    ok 68 - 11.04 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m # time=1.304ms
    
    # Subtest: 11.05 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m
        ok 1 - should be equal
        1..1
    ok 69 - 11.05 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m # time=1.276ms
    
    # Subtest: 11.06 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m whitespace trims - whitespace trim opts control - one special
        ok 1 - should be equal
        1..1
    ok 70 - 11.06 - [32mmatchLeft()[39m       [33mEOL mixed with strings[39m whitespace trims - whitespace trim opts control - one special # time=1.521ms
    
    # Subtest: 12.01 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.07 - whitespace trim opts control - two specials
        1..1
    ok 71 - 12.01 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=1.29ms
    
    # Subtest: 12.02 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.08 - whitespace trim opts control - special mixed with cheeky
        1..1
    ok 72 - 12.02 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=1.549ms
    
    # Subtest: 12.03 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.09 - whitespace trim opts control - cheeky only
        1..1
    ok 73 - 12.03 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=1.285ms
    
    # Subtest: 12.04 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.10 - CHEEKY!!!
        1..1
    ok 74 - 12.04 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=1.328ms
    
    # Subtest: 12.05 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - should be equal
        1..1
    ok 75 - 12.05 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=1.298ms
    
    # Subtest: 12.06 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.12 - CHEEKY!!!
        1..1
    ok 76 - 12.06 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=9.136ms
    
    # Subtest: 12.07 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - should be equal
        1..1
    ok 77 - 12.07 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=6.415ms
    
    # Subtest: 12.08 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.14 - whitespace trim opt on
        1..1
    ok 78 - 12.08 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=1.63ms
    
    # Subtest: 12.09 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.15 - whitespace trim opt on
        1..1
    ok 79 - 12.09 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=1.52ms
    
    # Subtest: 12.10 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.16 - whitespace trim opt on
        1..1
    ok 80 - 12.10 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=6.511ms
    
    # Subtest: 12.11 - [32mmatchLeft()[39m       [33mwhitespace trims[39m
        ok 1 - 12.02.17 - whitespace trim opt on
        1..1
    ok 81 - 12.11 - [32mmatchLeft()[39m       [33mwhitespace trims[39m # time=4.467ms
    
    # Subtest: 13.01 - [32mmatchLeft()[39m       [33mcharacter trims[39m
        ok 1 - 10.02.18 - whitespace trim opts control
        1..1
    ok 82 - 13.01 - [32mmatchLeft()[39m       [33mcharacter trims[39m # time=1.732ms
    
    # Subtest: 13.02 - [32mmatchLeft()[39m       [33mcharacter trims[39m
        ok 1 - 10.02.19 - whitespace trim opt on
        1..1
    ok 83 - 13.02 - [32mmatchLeft()[39m       [33mcharacter trims[39m # time=1.313ms
    
    # Subtest: 13.03 - [32mmatchLeft()[39m       [33mcharacter trims[39m
        ok 1 - 10.02.20 - whitespace trim opts control
        1..1
    ok 84 - 13.03 - [32mmatchLeft()[39m       [33mcharacter trims[39m # time=1.249ms
    
    # Subtest: 13.04 - [32mmatchLeft()[39m       [33mcharacter trims[39m
        ok 1 - 10.02.21 - z caught
        1..1
    ok 85 - 13.04 - [32mmatchLeft()[39m       [33mcharacter trims[39m # time=1.174ms
    
    # Subtest: 13.05 - [32mmatchLeft()[39m       [33mcharacter trims[39m
        ok 1 - 10.02.22 - whitespace trim opt on
        1..1
    ok 86 - 13.05 - [32mmatchLeft()[39m       [33mcharacter trims[39m # time=1.353ms
    
    # Subtest: 14.01 - [32mmatchLeft()[39m       [33mtrim combos[39m
        ok 1 - 10.02.23 - whitespace trim opts control
        1..1
    ok 87 - 14.01 - [32mmatchLeft()[39m       [33mtrim combos[39m # time=1.244ms
    
    # Subtest: 14.02 - [32mmatchLeft()[39m       [33mtrim combos[39m
        ok 1 - 10.02.24 - whitespace trim opt on
        1..1
    ok 88 - 14.02 - [32mmatchLeft()[39m       [33mtrim combos[39m # time=1.393ms
    
    # Subtest: 14.03 - [32mmatchLeft()[39m       [33mtrim combos[39m
        ok 1 - 10.02.25 - whitespace trim opts control
        1..1
    ok 89 - 14.03 - [32mmatchLeft()[39m       [33mtrim combos[39m # time=1.284ms
    
    # Subtest: 14.04 - [32mmatchLeft()[39m       [33mtrim combos[39m
        ok 1 - 10.02.26 - whitespace trim opt on
        1..1
    ok 90 - 14.04 - [32mmatchLeft()[39m       [33mtrim combos[39m # time=1.29ms
    
    # Subtest: 14.05 - [32mmatchLeft()[39m       [33mtrim combos[39m
        ok 1 - 10.02.27 - whitespace trim opts control
        1..1
    ok 91 - 14.05 - [32mmatchLeft()[39m       [33mtrim combos[39m # time=1.931ms
    
    # Subtest: 14.06 - [32mmatchLeft()[39m       [33mtrim combos[39m
        ok 1 - 10.02.28 - whitespace trim opt on
        1..1
    ok 92 - 14.06 - [32mmatchLeft()[39m       [33mtrim combos[39m # time=3.103ms
    
    # Subtest: 14.07 - [32mmatchLeft()[39m       [33mtrim combos[39m
        ok 1 - should be equal
        1..1
    ok 93 - 14.07 - [32mmatchLeft()[39m       [33mtrim combos[39m # time=5.265ms
    
    # Subtest: 15.01 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching
        ok 1 - should be equal
        1..1
    ok 94 - 15.01 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching # time=1.189ms
    
    # Subtest: 15.02 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching
        ok 1 - should be equal
        1..1
    ok 95 - 15.02 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching # time=10.456ms
    
    # Subtest: 15.03 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching
        ok 1 - 10.03.03 - cb blocking result
        1..1
    ok 96 - 15.03 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching # time=2.717ms
    
    # Subtest: 15.04 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching
        ok 1 - 10.03.04 - useless cb
        1..1
    ok 97 - 15.04 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching # time=1.572ms
    
    # Subtest: 15.05 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - whitespace trims
        ok 1 - 10.03.06 - whitespace trim opts control
        1..1
    ok 98 - 15.05 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - whitespace trims # time=1.175ms
    
    # Subtest: 15.06 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - whitespace trims
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 99 - 15.06 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - whitespace trims # time=1.493ms
    
    # Subtest: 15.07 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - whitespace trims
        ok 1 - 10.03.09 - whitespace trim opt on
        1..1
    ok 100 - 15.07 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - whitespace trims # time=1.509ms
    
    # Subtest: 15.08 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - character trims
        ok 1 - 10.03.10 - whitespace trim opts control
        1..1
    ok 101 - 15.08 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - character trims # time=1.278ms
    
    # Subtest: 15.09 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - character trims
        ok 1 - 10.03.11 - whitespace trim opt on
        1..1
    ok 102 - 15.09 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - character trims # time=1.301ms
    
    # Subtest: 15.10 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - trim combos
        ok 1 - 10.03.12 - whitespace trim opts control
        1..1
    ok 103 - 15.10 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - trim combos # time=1.172ms
    
    # Subtest: 15.11 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - trim combos
        ok 1 - 10.03.13 - whitespace trim opt on
        1..1
    ok 104 - 15.11 - [32mmatchLeftIncl()[39m   [33mEOL[39m matching - trim combos # time=0.641ms
    
    # Subtest: 16.01 - [32mmatchRight()[39m      [33mEOL[39m matching
        ok 1 - should be equal
        1..1
    ok 105 - 16.01 - [32mmatchRight()[39m      [33mEOL[39m matching # time=1.142ms
    
    # Subtest: 16.02 - [32mmatchRight()[39m      [33mEOL[39m matching
        ok 1 - should be equal
        1..1
    ok 106 - 16.02 - [32mmatchRight()[39m      [33mEOL[39m matching # time=1.131ms
    
    # Subtest: 16.03 - [32mmatchRight()[39m      [33mEOL[39m matching
        ok 1 - 10.04.03 - cb blocking result
        1..1
    ok 107 - 16.03 - [32mmatchRight()[39m      [33mEOL[39m matching # time=1.216ms
    
    # Subtest: 16.04 - [32mmatchRight()[39m      [33mEOL[39m matching
        ok 1 - 10.04.04 - useless cb, just confirms the incoming truthy result
        1..1
    ok 108 - 16.04 - [32mmatchRight()[39m      [33mEOL[39m matching # time=1.214ms
    
    # Subtest: 16.05 - [32mmatchRight()[39m      [33mEOL[39m matching
        ok 1 - 10.04.05 - useless cb
        1..1
    ok 109 - 16.05 - [32mmatchRight()[39m      [33mEOL[39m matching # time=1.455ms
    
    # Subtest: 16.06 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims
        ok 1 - 10.04.06-1
        1..1
    ok 110 - 16.06 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims # time=1.144ms
    
    # Subtest: 16.07 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims
        ok 1 - 10.04.06-2
        1..1
    ok 111 - 16.07 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims # time=1.131ms
    
    # Subtest: 16.08 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims
        ok 1 - 10.04.07 - CHEEKY!!!
        1..1
    ok 112 - 16.08 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims # time=9.914ms
    
    # Subtest: 16.09 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims
        ok 1 - 10.04.08 - !!!
        1..1
    ok 113 - 16.09 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims # time=4.492ms
    
    # Subtest: 16.10 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims
        ok 1 - 10.04.09 - whitespace trim opt on
        1..1
    ok 114 - 16.10 - [32mmatchRight()[39m      [33mEOL[39m matching - whitespace trims # time=1.786ms
    
    # Subtest: 16.11 - [32mmatchRight()[39m      [33mEOL[39m matching - character trims
        ok 1 - 10.04.10 - whitespace trim opts control
        1..1
    ok 115 - 16.11 - [32mmatchRight()[39m      [33mEOL[39m matching - character trims # time=1.172ms
    
    # Subtest: 16.12 - [32mmatchRight()[39m      [33mEOL[39m matching - character trims
        ok 1 - 10.04.11 - whitespace trim opt on
        1..1
    ok 116 - 16.12 - [32mmatchRight()[39m      [33mEOL[39m matching - character trims # time=1.356ms
    
    # Subtest: 16.13 - [32mmatchRight()[39m      [33mEOL[39m matching - trim combos
        ok 1 - 10.04.12 - whitespace trim opts control
        1..1
    ok 117 - 16.13 - [32mmatchRight()[39m      [33mEOL[39m matching - trim combos # time=1.129ms
    
    # Subtest: 16.14 - [32mmatchRight()[39m      [33mEOL[39m matching - trim combos
        ok 1 - 10.04.13 - whitespace trim opt on
        1..1
    ok 118 - 16.14 - [32mmatchRight()[39m      [33mEOL[39m matching - trim combos # time=1.23ms
    
    # Subtest: 17.01 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings
        ok 1 - should be equal
        1..1
    ok 119 - 17.01 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings # time=1.096ms
    
    # Subtest: 17.02 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings
        ok 1 - should be equal
        1..1
    ok 120 - 17.02 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings # time=1.132ms
    
    # Subtest: 17.03 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings
        ok 1 - should be equal
        1..1
    ok 121 - 17.03 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings # time=1.121ms
    
    # Subtest: 17.04 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings
        ok 1 - should be equal
        1..1
    ok 122 - 17.04 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings # time=1.421ms
    
    # Subtest: 17.05 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings
        ok 1 - should be equal
        1..1
    ok 123 - 17.05 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings # time=1.15ms
    
    # Subtest: 17.06 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.06 - whitespace trim opts control - one special
        1..1
    ok 124 - 17.06 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=1.144ms
    
    # Subtest: 17.07 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.07 - whitespace trim opts control - two specials
        1..1
    ok 125 - 17.07 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=1.145ms
    
    # Subtest: 17.08 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.08 - whitespace trim opts control - special mixed with cheeky
        1..1
    ok 126 - 17.08 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=1.183ms
    
    # Subtest: 17.09 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.09 - whitespace trim opts control - cheeky only
        1..1
    ok 127 - 17.09 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=4.478ms
    
    # Subtest: 17.10 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.10 - CHEEKY!!!
        1..1
    ok 128 - 17.10 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=1.165ms
    
    # Subtest: 17.11 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - should be equal
        1..1
    ok 129 - 17.11 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=1.121ms
    
    # Subtest: 17.12 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.12 - CHEEKY!!!
        1..1
    ok 130 - 17.12 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=1.137ms
    
    # Subtest: 17.13 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - should be equal
        1..1
    ok 131 - 17.13 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=4.844ms
    
    # Subtest: 17.14 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.14 - array
        1..1
    ok 132 - 17.14 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=10.952ms
    
    # Subtest: 17.15 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.15 - other values to match
        1..1
    ok 133 - 17.15 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=6.462ms
    
    # Subtest: 17.16 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.16 - two identical arrow functions in array, both positive
        1..1
    ok 134 - 17.16 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=4.819ms
    
    # Subtest: 17.17 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims
        ok 1 - 10.05.17 - two arrow f's in arrray + non-found
        1..1
    ok 135 - 17.17 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - whitespace trims # time=2.608ms
    
    # Subtest: 17.18 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims
        ok 1 - 10.05.18 - trim off
        1..1
    ok 136 - 17.18 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims # time=1.184ms
    
    # Subtest: 17.19 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims
        ok 1 - 10.05.19 - character trim opt on
        1..1
    ok 137 - 17.19 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims # time=1.307ms
    
    # Subtest: 17.20 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims
        ok 1 - 10.05.20 - wrong character to trim
        1..1
    ok 138 - 17.20 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims # time=3.372ms
    
    # Subtest: 17.21 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims
        ok 1 - 10.05.21 - z caught first, before EOL
        1..1
    ok 139 - 17.21 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims # time=1.158ms
    
    # Subtest: 17.22 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims
        ok 1 - 10.05.22 - whitespace trim opt on
        1..1
    ok 140 - 17.22 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - character trims # time=1.312ms
    
    # Subtest: 17.23 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos
        ok 1 - 10.05.23 - whitespace trim opts control
        1..1
    ok 141 - 17.23 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos # time=1.127ms
    
    # Subtest: 17.24 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos
        ok 1 - 10.05.24 - whitespace trim opt on
        1..1
    ok 142 - 17.24 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos # time=1.257ms
    
    # Subtest: 17.25 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos
        ok 1 - 10.05.25 - whitespace trim opts control
        1..1
    ok 143 - 17.25 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos # time=1.338ms
    
    # Subtest: 17.26 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos
        ok 1 - 10.05.26 - whitespace trim opt on
        1..1
    ok 144 - 17.26 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos # time=1.308ms
    
    # Subtest: 17.27 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos
        ok 1 - 10.05.27 - whitespace trim opts control
        1..1
    ok 145 - 17.27 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos # time=1.225ms
    
    # Subtest: 17.28 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos
        ok 1 - 10.05.28 - unused char to trim
        1..1
    ok 146 - 17.28 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos # time=1.218ms
    
    # Subtest: 17.29 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos
        ok 1 - 10.05.29 - y stands in the way
        1..1
    ok 147 - 17.29 - [32mmatchRight()[39m      [33mEOL[39m EOL mixed with strings - trim combos # time=1.246ms
    
    # Subtest: 18.01 - [32mmatchRightIncl()[39m  [33mEOL[39m matching
        ok 1 - should be equal
        1..1
    ok 148 - 18.01 - [32mmatchRightIncl()[39m  [33mEOL[39m matching # time=1.247ms
    
    # Subtest: 18.02 - [32mmatchRightIncl()[39m  [33mEOL[39m matching
        ok 1 - should be equal
        1..1
    ok 149 - 18.02 - [32mmatchRightIncl()[39m  [33mEOL[39m matching # time=1.168ms
    
    # Subtest: 18.03 - [32mmatchRightIncl()[39m  [33mEOL[39m matching
        ok 1 - 10.06.03 - cb blocking, but still useless, result was false before cb kicked in
        1..1
    ok 150 - 18.03 - [32mmatchRightIncl()[39m  [33mEOL[39m matching # time=1.241ms
    
    # Subtest: 18.04 - [32mmatchRightIncl()[39m  [33mEOL[39m matching
        ok 1 - 10.06.04 - useless cb
        1..1
    ok 151 - 18.04 - [32mmatchRightIncl()[39m  [33mEOL[39m matching # time=2.802ms
    
    # Subtest: 18.05 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - whitespace trims
        ok 1 - 10.06.05 - whitespace trim opts control
        1..1
    ok 152 - 18.05 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - whitespace trims # time=1.178ms
    
    # Subtest: 18.06 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - whitespace trims
        ok 1 - should be equal
        1..1
    ok 153 - 18.06 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - whitespace trims # time=1.123ms
    
    # Subtest: 18.07 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - whitespace trims
        ok 1 - should be equal
        1..1
    ok 154 - 18.07 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - whitespace trims # time=1.117ms
    
    # Subtest: 18.08 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - whitespace trims
        ok 1 - 10.06.08 - whitespace trim opt on
        1..1
    ok 155 - 18.08 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - whitespace trims # time=1.18ms
    
    # Subtest: 18.09 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - character trims
        ok 1 - 10.06.10 - whitespace trim opts control
        1..1
    ok 156 - 18.09 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - character trims # time=1.132ms
    
    # Subtest: 18.10 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - character trims
        ok 1 - 10.06.11 - whitespace trim opt on
        1..1
    ok 157 - 18.10 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - character trims # time=1.222ms
    
    # Subtest: 18.11 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - trim combos
        ok 1 - 10.06.12 - whitespace trim opts control
        1..1
    ok 158 - 18.11 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - trim combos # time=1.18ms
    
    # Subtest: 18.12 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - trim combos
        ok 1 - 10.06.13 - whitespace trim + character trim
        1..1
    ok 159 - 18.12 - [32mmatchRightIncl()[39m  [33mEOL[39m matching - trim combos # time=1.196ms
    
    # Subtest: 13.01 - [35mADHOC[39m, tests set #01
        ok 1 - should be equal
        1..1
    ok 160 - 13.01 - [35mADHOC[39m, tests set #01 # time=1.209ms
    
    # Subtest: 13.02 - [35mADHOC[39m, tests set #01
        ok 1 - should be equal
        1..1
    ok 161 - 13.02 - [35mADHOC[39m, tests set #01 # time=1.306ms
    
    # Subtest: 13.03 - [35mADHOC[39m, tests set #01
        ok 1 - should be equal
        1..1
    ok 162 - 13.03 - [35mADHOC[39m, tests set #01 # time=1.366ms
    
    # Subtest: 13.04 - [35mADHOC[39m, tests set #01
        ok 1 - should be equal
        1..1
    ok 163 - 13.04 - [35mADHOC[39m, tests set #01 # time=1.233ms
    
    # Subtest: 13.05 - [35mADHOC[39m, tests set #01
        ok 1 - should be equal
        1..1
    ok 164 - 13.05 - [35mADHOC[39m, tests set #01 # time=1.316ms
    
    # Subtest: 13.06 - [35mADHOC[39m, tests set #01
        ok 1 - should be equal
        1..1
    ok 165 - 13.06 - [35mADHOC[39m, tests set #01 # time=1.372ms
    
    # Subtest: 13.07 - [35mADHOC[39m, tests set #01
        ok 1 - should be equal
        1..1
    ok 166 - 13.07 - [35mADHOC[39m, tests set #01 # time=1.268ms
    
    # Subtest: 13.08 - [35mADHOC[39m, tests set #01
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        1..3
    ok 167 - 13.08 - [35mADHOC[39m, tests set #01 # time=1.884ms
    
    # Subtest: 13.09 - [35mADHOC[39m, set #02
        ok 1 - should be equal
        1..1
    ok 168 - 13.09 - [35mADHOC[39m, set #02 # time=1.296ms
    
    1..168
    # time=1602.469ms
ok 1 - test/test.js # time=1602.469ms

1..1
# time=4473.518ms
