TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - [31mthrows[39m - wrong/missing input
        ok 1 - expected to throw
        1..1
    ok 1 - 01.01 - [31mthrows[39m - wrong/missing input # time=9.539ms
    
    # Subtest: 01.02 - [31mthrows[39m - undefined literal
        ok 1 - expected to throw
        1..1
    ok 2 - 01.02 - [31mthrows[39m - undefined literal # time=2.768ms
    
    # Subtest: 01.03 - [31mthrows[39m - numbers
        ok 1 - expected to throw
        1..1
    ok 3 - 01.03 - [31mthrows[39m - numbers # time=2.221ms
    
    # Subtest: 01.04 - [31mthrows[39m - null
        ok 1 - expected to throw
        1..1
    ok 4 - 01.04 - [31mthrows[39m - null # time=2.518ms
    
    # Subtest: 01.05 - [31mthrows[39m - bools
        ok 1 - expected to throw
        1..1
    ok 5 - 01.05 - [31mthrows[39m - bools # time=2.109ms
    
    # Subtest: 02.01 - [33mtaster[39m - no $$$ - oneliner
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        1..4
    ok 6 - 02.01 - [33mtaster[39m - no $$$ - oneliner # time=5.857ms
    
    # Subtest: 02.02 - [33mtaster[39m - no $$$ - multiliner
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        1..4
    ok 7 - 02.02 - [33mtaster[39m - no $$$ - multiliner # time=1.328ms
    
    # Subtest: 02.03 - [33mtaster[39m - defaults, empty content
        ok 1 - 02.03
        1..1
    ok 8 - 02.03 - [33mtaster[39m - defaults, empty content # time=5.337ms
    
    # Subtest: 02.04 - [33mtaster[39m - defaults, empty content, no pad
        ok 1 - 02.04
        1..1
    ok 9 - 02.04 - [33mtaster[39m - defaults, empty content, no pad # time=2.596ms
    
    # Subtest: 02.05 - [33mtaster[39m - placeholder in the middle of the name, ends with px
        ok 1 - 02.05
        1..1
    ok 10 - 02.05 - [33mtaster[39m - placeholder in the middle of the name, ends with px # time=2.571ms
    
    # Subtest: 02.06 - [33mtaster[39m - placeholder in the middle of the name, ends with px
        ok 1 - 02.06
        1..1
    ok 11 - 02.06 - [33mtaster[39m - placeholder in the middle of the name, ends with px # time=2.641ms
    
    # Subtest: 02.07 - [33mtaster[39m - placeholder in the middle of the name, ends with p
        ok 1 - 02.07
        1..1
    ok 12 - 02.07 - [33mtaster[39m - placeholder in the middle of the name, ends with p # time=4.88ms
    
    # Subtest: 02.08 - [33mtaster[39m - starts with a placeholder (not legit)
        ok 1 - 02.08
        1..1
    ok 13 - 02.08 - [33mtaster[39m - starts with a placeholder (not legit) # time=2.087ms
    
    # Subtest: 03.01 - [33mno config, no heads/tails requested[39m - defaults, empty content
        ok 1 - 03.01.01
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        ok 4 - expect truthy value
        1..4
    ok 14 - 03.01 - [33mno config, no heads/tails requested[39m - defaults, empty content # time=70.625ms
    
    # Subtest: 03.02 - [33mno config, no heads/tails requested[39m - min max set #1
        ok 1 - 03.02.01
        ok 2 - 03.02.02
        1..2
    ok 15 - 03.02 - [33mno config, no heads/tails requested[39m - min max set #1 # time=10.373ms
    
    # Subtest: 03.03 - [33mno config, no heads/tails requested[39m - min max set #2
        ok 1 - 03.03.01
        1..1
    ok 16 - 03.03 - [33mno config, no heads/tails requested[39m - min max set #2 # time=2.865ms
    
    # Subtest: 04.01 - [35mno config, only heads/tails requested[39m - but no heads tails incoming, default range
        ok 1 - 04.01.01
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        ok 4 - expect truthy value
        1..4
    ok 17 - 04.01 - [35mno config, only heads/tails requested[39m - but no heads tails incoming, default range # time=20.449ms
    
    # Subtest: 04.02 - [35mno config, only heads/tails requested[39m - but no heads tails incoming, capped upper
        ok 1 - 04.02.01
        ok 2 - 04.02.02
        1..2
    ok 18 - 04.02 - [35mno config, only heads/tails requested[39m - but no heads tails incoming, capped upper # time=2.586ms
    
    # Subtest: 04.03 - [35mno config, only heads/tails requested[39m - but no heads tails incoming, fully custom range
        ok 1 - 04.03
        1..1
    ok 19 - 04.03 - [35mno config, only heads/tails requested[39m - but no heads tails incoming, fully custom range # time=1.796ms
    
    # Subtest: 04.04 - [35mno config, only heads/tails requested[39m - incoming content heads without opening comment and content in front
        ok 1 - 04.04
        1..1
    ok 20 - 04.04 - [35mno config, only heads/tails requested[39m - incoming content heads without opening comment and content in front # time=2.384ms
    
    # Subtest: 04.05 - [35mno config, only heads/tails requested[39m - incoming content heads without opening comment and comments clash
        ok 1 - 04.05
        1..1
    ok 21 - 04.05 - [35mno config, only heads/tails requested[39m - incoming content heads without opening comment and comments clash # time=1.771ms
    
    # Subtest: 04.06 - [35mno config, only heads/tails requested[39m - content's heads and tails instead of config's heads and tails
        ok 1 - 04.06
        1..1
    ok 22 - 04.06 - [35mno config, only heads/tails requested[39m - content's heads and tails instead of config's heads and tails # time=1.808ms
    
    # Subtest: 04.07 - [35mno config, only heads/tails requested[39m - blank content heads/tails
        ok 1 - 04.07.01
        ok 2 - 04.07.02
        ok 3 - 04.07.03
        ok 4 - 04.07.04
        1..4
    ok 23 - 04.07 - [35mno config, only heads/tails requested[39m - blank content heads/tails # time=3.118ms
    
    # Subtest: 04.08 - [35mno config, only heads/tails requested[39m - blank config heads/tails
        ok 1 - 04.08.01
        ok 2 - 04.08.02
        ok 3 - 04.08.03
        ok 4 - 04.08.04
        1..4
    ok 24 - 04.08 - [35mno config, only heads/tails requested[39m - blank config heads/tails # time=8.876ms
    
    # Subtest: 04.09 - [35mno config, only heads/tails requested[39m - retains content around
        ok 1 - 04.09
        1..1
    ok 25 - 04.09 - [35mno config, only heads/tails requested[39m - retains content around # time=1.859ms
    
    # Subtest: 04.10 - [35mno config, only heads/tails requested[39m - retains content around, incl. tails
        ok 1 - 04.10.01
        ok 2 - 04.10.02
        1..2
    ok 26 - 04.10 - [35mno config, only heads/tails requested[39m - retains content around, incl. tails # time=2.26ms
    
    # Subtest: 04.11 - [35mno config, only heads/tails requested[39m - retains content around, incl. config tails
        ok 1 - 04.11
        1..1
    ok 27 - 04.11 - [35mno config, only heads/tails requested[39m - retains content around, incl. config tails # time=1.902ms
    
    # Subtest: 04.12 - [35mno config, only heads/tails requested[39m - incl. config tails, one comment block
        ok 1 - 04.12
        1..1
    ok 28 - 04.12 - [35mno config, only heads/tails requested[39m - incl. config tails, one comment block # time=2.034ms
    
    # Subtest: 04.13 - [31mconfig, heads/tails requested[39m - retains content around
        ok 1 - 04.13
        1..1
    ok 29 - 04.13 - [31mconfig, heads/tails requested[39m - retains content around # time=1.865ms
    
    # Subtest: 04.14 - [31mconfig, heads/tails requested[39m - retains content around, incl. tails
        ok 1 - 04.14
        1..1
    ok 30 - 04.14 - [31mconfig, heads/tails requested[39m - retains content around, incl. tails # time=1.854ms
    
    # Subtest: 04.15 - [31mconfig, heads/tails requested[39m - retains content around, incl. config tails
        ok 1 - 04.15
        1..1
    ok 31 - 04.15 - [31mconfig, heads/tails requested[39m - retains content around, incl. config tails # time=0.993ms
    
    # Subtest: 04.16 - [31mconfig, heads/tails requested[39m - incl. config tails, one comment block
        ok 1 - 04.16
        1..1
    ok 32 - 04.16 - [31mconfig, heads/tails requested[39m - incl. config tails, one comment block # time=7.234ms
    
    # Subtest: 04.19 - [35mconfig present no config requested[39m - comments surrounding
        ok 1 - 04.19
        1..1
    ok 33 - 04.19 - [35mconfig present no config requested[39m - comments surrounding # time=1.92ms
    
    # Subtest: 04.20 - [35mcontent tails present no config requested[39m - comments surrounding
        ok 1 - 04.20
        1..1
    ok 34 - 04.20 - [35mcontent tails present no config requested[39m - comments surrounding # time=7.606ms
    
    # Subtest: 04.21 - [35mno config, only heads/tails requested[39m - but no heads tails incoming, capped upper
        ok 1 - 04.21
        1..1
    ok 35 - 04.21 - [35mno config, only heads/tails requested[39m - but no heads tails incoming, capped upper # time=5.357ms
    
    # Subtest: 04.22 - [35mno config, only heads/tails requested[39m - head missing
        ok 1 - 04.22
        1..1
    ok 36 - 04.22 - [35mno config, only heads/tails requested[39m - head missing # time=1.984ms
    
    # Subtest: 05.01 - [34mconfig requested but not present[39m - but no heads tails incoming, default range
        ok 1 - 05.01.01
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        ok 4 - expect truthy value
        ok 5 - expect truthy value
        ok 6 - expect truthy value
        ok 7 - expect truthy value
        ok 8 - expect truthy value
        ok 9 - expect truthy value
        ok 10 - expect truthy value
        1..10
    ok 37 - 05.01 - [34mconfig requested but not present[39m - but no heads tails incoming, default range # time=8.518ms
    
    # Subtest: 05.02 - [34mconfig requested but not present[39m - but no heads tails incoming, capped upper
        ok 1 - 05.02.01
        ok 2 - 05.02.02
        1..2
    ok 38 - 05.02 - [34mconfig requested but not present[39m - but no heads tails incoming, capped upper # time=13.68ms
    
    # Subtest: 05.03 - [34mconfig requested but not present[39m - but no heads tails incoming, capped upper - second cycle
        ok 1 - 05.03.01
        ok 2 - 05.03.02
        ok 3 - 05.03.03
        1..3
    ok 39 - 05.03 - [34mconfig requested but not present[39m - but no heads tails incoming, capped upper - second cycle # time=2.323ms
    
    # Subtest: 05.04 - [34mconfig requested but not present[39m - but no heads tails incoming, capped upper - second cycle
        ok 1 - 05.04.01
        ok 2 - 05.04.02
        1..2
    ok 40 - 05.04 - [34mconfig requested but not present[39m - but no heads tails incoming, capped upper - second cycle # time=5.907ms
    
    # Subtest: 05.05 - [34mconfig requested but not present[39m - but no heads tails incoming, fully custom range
        ok 1 - 05.05.01
        ok 2 - 05.05.02
        1..2
    ok 41 - 05.05 - [34mconfig requested but not present[39m - but no heads tails incoming, fully custom range # time=5.308ms
    
    # Subtest: 05.06 - [34mconfig requested but not present[39m - only content heads/tails, no content around
        ok 1 - 05.06.01
        ok 2 - 05.06.02
        1..2
    ok 42 - 05.06 - [34mconfig requested but not present[39m - only content heads/tails, no content around # time=1.351ms
    
    # Subtest: 05.07 - [34mconfig requested but not present[39m - only content heads/tails, content on top
        ok 1 - 05.07.01
        ok 2 - 05.07.02
        1..2
    ok 43 - 05.07 - [34mconfig requested but not present[39m - only content heads/tails, content on top # time=2.568ms
    
    # Subtest: 05.08 - [34mconfig requested but not present[39m - retains content around, content tails
        ok 1 - 05.08
        1..1
    ok 44 - 05.08 - [34mconfig requested but not present[39m - retains content around, content tails # time=1.689ms
    
    # Subtest: 05.09 - [34mconfig requested but not present[39m - retains content around, config tails
        ok 1 - 05.09
        1..1
    ok 45 - 05.09 - [34mconfig requested but not present[39m - retains content around, config tails # time=1.687ms
    
    # Subtest: 05.10 - [34mconfig requested but not present[39m - retains content around
        ok 1 - 05.10
        1..1
    ok 46 - 05.10 - [34mconfig requested but not present[39m - retains content around # time=1.82ms
    
    # Subtest: 05.11 - [34mconfig requested but not present[39m - above there are comments followed by content
        ok 1 - 05.11
        1..1
    ok 47 - 05.11 - [34mconfig requested but not present[39m - above there are comments followed by content # time=1.616ms
    
    # Subtest: 05.12 - [34mconfig requested but not present[39m - but no heads tails incoming, fully custom range, no pad
        ok 1 - 05.12.01
        ok 2 - 05.12.02
        1..2
    ok 48 - 05.12 - [34mconfig requested but not present[39m - but no heads tails incoming, fully custom range, no pad # time=4.157ms
    
    # Subtest: 05.13 - [34mconfig requested but not present[39m - style with no $$$
        ok 1 - 05.13.01
        ok 2 - 05.13.02
        1..2
    ok 49 - 05.13 - [34mconfig requested but not present[39m - style with no $$$ # time=16.343ms
    
    # Subtest: 05.14 - [34mconfig requested but not present[39m - style with no $$$
        ok 1 - 05.14.01
        ok 2 - 05.14.02
        1..2
    ok 50 - 05.14 - [34mconfig requested but not present[39m - style with no $$$ # time=7.002ms
    
    # Subtest: 05.15 - [34mno config requested, not present[39m - style with no $$$
        ok 1 - 05.15
        1..1
    ok 51 - 05.15 - [34mno config requested, not present[39m - style with no $$$ # time=6.03ms
    
    # Subtest: 05.16 - [34mconfig requested but not present[39m - style with no $$$, no pad
        ok 1 - 05.16
        1..1
    ok 52 - 05.16 - [34mconfig requested but not present[39m - style with no $$$, no pad # time=6.057ms
    
    # Subtest: 05.17 - [34mconfig requested but not present[39m - via opts.configOverride
        ok 1 - 05.17 - no content heads and tails - replaces whole thing with result
        1..1
    ok 53 - 05.17 - [34mconfig requested but not present[39m - via opts.configOverride # time=1.975ms
    
    # Subtest: 05.18 - [34mno config requested, not present[39m - via opts.configOverride
        ok 1 - 05.18 - with heads and tails - places generated content between content heads/tails
        1..1
    ok 54 - 05.18 - [34mno config requested, not present[39m - via opts.configOverride # time=5.63ms
    
    # Subtest: 05.19 - [34mconfig requested but not present[39m - via opts.configOverride
        ok 1 - 05.19 - with heads and tails - places generated content between content heads/tails
        1..1
    ok 55 - 05.19 - [34mconfig requested but not present[39m - via opts.configOverride # time=6.034ms
    
    # Subtest: 05.20 - [34mno config requested, not present[39m - via opts.configOverride #2
        ok 1 - 05.20 - with heads and tails - places generated content between content heads/tails
        1..1
    ok 56 - 05.20 - [34mno config requested, not present[39m - via opts.configOverride #2 # time=2.125ms
    
    # Subtest: 05.21 - [34mno config requested, not present[39m - via opts.configOverride #3
        ok 1 - 05.21 - with heads and tails - places generated content between content heads/tails
        1..1
    ok 57 - 05.21 - [34mno config requested, not present[39m - via opts.configOverride #3 # time=1.867ms
    
    # Subtest: 06.01 - [35mconfig present, not requested (neither tails)[39m - case #1
        ok 1 - 06.01
        1..1
    ok 58 - 06.01 - [35mconfig present, not requested (neither tails)[39m - case #1 # time=1.824ms
    
    # Subtest: 06.02 - [35mconfig present, not requested (neither tails)[39m - case #2
        ok 1 - 06.02
        1..1
    ok 59 - 06.02 - [35mconfig present, not requested (neither tails)[39m - case #2 # time=2.103ms
    
    # Subtest: 06.03 - [35mconfig present, not requested (neither tails)[39m - case #3
        ok 1 - 06.03
        1..1
    ok 60 - 06.03 - [35mconfig present, not requested (neither tails)[39m - case #3 # time=4.451ms
    
    # Subtest: 07.01 - [36mconfig override[39m - no $$$ anywhere (both in override and existing) - control
        ok 1 - 07.01
        1..1
    ok 61 - 07.01 - [36mconfig override[39m - no $$$ anywhere (both in override and existing) - control # time=1.454ms
    
    # Subtest: 07.02 - [36mconfig override[39m - no $$$ anywhere (both in override and existing) - config/tails off
        ok 1 - 07.02
        1..1
    ok 62 - 07.02 - [36mconfig override[39m - no $$$ anywhere (both in override and existing) - config/tails off # time=1.714ms
    
    # Subtest: 07.03 - [36mconfig override[39m - no $$$ anywhere (both in override and existing) - only tails on
        ok 1 - 07.03
        1..1
    ok 63 - 07.03 - [36mconfig override[39m - no $$$ anywhere (both in override and existing) - only tails on # time=1.737ms
    
    # Subtest: 07.04 - [36mconfig override[39m - no $$$ anywhere (both in override and existing) - config & tails on
        ok 1 - 07.04
        1..1
    ok 64 - 07.04 - [36mconfig override[39m - no $$$ anywhere (both in override and existing) - config & tails on # time=1.693ms
    
    # Subtest: 08.01 - [33mheads on, config on[39m - combo styles
        ok 1 - 08.01
        1..1
    ok 65 - 08.01 - [33mheads on, config on[39m - combo styles # time=1.812ms
    
    # Subtest: 08.02 - [33mheads on, config on[39m - combo styles #2, tighter
        ok 1 - 08.02
        1..1
    ok 66 - 08.02 - [33mheads on, config on[39m - combo styles #2, tighter # time=1.8ms
    
    # Subtest: 08.03 - [33mheads on, config on[39m - reports 5 generated - control
        ok 1 - 08.03
        1..1
    ok 67 - 08.03 - [33mheads on, config on[39m - reports 5 generated - control # time=1.645ms
    
    # Subtest: 08.04 - [33mheads on, config on[39m - reports 5 generated - log/count - dollars last
        ok 1 - 08.04.10 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 2 - 08.04.20 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 3 - 08.04.30 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 4 - 08.04.11 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 5 - 08.04.21 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 6 - 08.04.31 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 7 - 08.04.12 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 8 - 08.04.22 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 9 - 08.04.32 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 10 - 08.04.13 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 11 - 08.04.23 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 12 - 08.04.33 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 13 - 08.04.14 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 14 - 08.04.24 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 15 - 08.04.34 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 16 - 08.04.15 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 17 - 08.04.25 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 18 - 08.04.35 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 19 - 08.04.16 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 20 - 08.04.26 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 21 - 08.04.36 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 22 - 08.04.17 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        ok 23 - 08.04.27 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        ok 24 - 08.04.37 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        1..24
    ok 68 - 08.04 - [33mheads on, config on[39m - reports 5 generated - log/count - dollars last # time=33.524ms
    
    # Subtest: 08.05 - [33mheads on, config on[39m - reports 5 generated - log/count - dollars last - content via opts.configOverride
        ok 1 - 08.05.10 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 2 - 08.05.20 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 3 - 08.05.30 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 4 - 08.05.40 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 5 - 08.05.50 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 6 - 08.05.60 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":true}
        ok 7 - 08.05.11 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 8 - 08.05.21 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 9 - 08.05.31 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 10 - 08.05.41 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 11 - 08.05.51 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 12 - 08.05.61 - {"includeConfig":true,"includeHeadsAndTails":true,"pad":false}
        ok 13 - 08.05.12 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 14 - 08.05.22 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 15 - 08.05.32 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 16 - 08.05.42 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 17 - 08.05.52 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 18 - 08.05.62 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":true}
        ok 19 - 08.05.13 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 20 - 08.05.23 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 21 - 08.05.33 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 22 - 08.05.43 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 23 - 08.05.53 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 24 - 08.05.63 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":true}
        ok 25 - 08.05.14 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 26 - 08.05.24 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 27 - 08.05.34 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 28 - 08.05.44 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 29 - 08.05.54 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 30 - 08.05.64 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":true}
        ok 31 - 08.05.15 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 32 - 08.05.25 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 33 - 08.05.35 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 34 - 08.05.45 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 35 - 08.05.55 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 36 - 08.05.65 - {"includeConfig":false,"includeHeadsAndTails":true,"pad":false}
        ok 37 - 08.05.16 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 38 - 08.05.26 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 39 - 08.05.36 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 40 - 08.05.46 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 41 - 08.05.56 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 42 - 08.05.66 - {"includeConfig":true,"includeHeadsAndTails":false,"pad":false}
        ok 43 - 08.05.17 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        ok 44 - 08.05.27 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        ok 45 - 08.05.37 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        ok 46 - 08.05.47 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        ok 47 - 08.05.57 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        ok 48 - 08.05.67 - {"includeConfig":false,"includeHeadsAndTails":false,"pad":false}
        1..48
    ok 69 - 08.05 - [33mheads on, config on[39m - reports 5 generated - log/count - dollars last - content via opts.configOverride # time=61.53ms
    
    # Subtest: 08.06 - [33mheads on, config on[39m - two levels of curlies wrapping the source
        ok 1 - 08.06
        1..1
    ok 70 - 08.06 - [33mheads on, config on[39m - two levels of curlies wrapping the source # time=5.178ms
    
    # Subtest: 08.07 - [33mheads on, config on[39m - only content heads/tails
        ok 1 - 08.07
        1..1
    ok 71 - 08.07 - [33mheads on, config on[39m - only content heads/tails # time=5.239ms
    
    # Subtest: 08.08 - [33mheads on, config on[39m - no heads/tails
        ok 1 - 08.08
        1..1
    ok 72 - 08.08 - [33mheads on, config on[39m - no heads/tails # time=1.908ms
    
    # Subtest: 98.01 - [33mAPI bits[39m - extractFromToSource - wizard case, 1 arg
        ok 1 - 98.01.01
        ok 2 - 98.01.02
        ok 3 - 98.01.03
        ok 4 - 98.01.04
        ok 5 - 98.01.05
        ok 6 - 98.01.06
        ok 7 - 98.01.06
        1..7
    ok 73 - 98.01 - [33mAPI bits[39m - extractFromToSource - wizard case, 1 arg # time=5.793ms
    
    # Subtest: 98.02 - [33mAPI bits[39m - extractFromToSource - wizard case, 2 args
        ok 1 - 98.02.01
        ok 2 - 98.02.02
        ok 3 - 98.02.03
        ok 4 - 98.02.04
        ok 5 - 98.02.05
        ok 6 - 98.02.06
        ok 7 - 98.02.07
        ok 8 - 98.02.08
        ok 9 - 98.02.09
        1..9
    ok 74 - 98.02 - [33mAPI bits[39m - extractFromToSource - wizard case, 2 args # time=6.778ms
    
    # Subtest: 98.03 - [33mAPI bits[39m - extractFromToSource - wizard case, 3 args
        ok 1 - 98.03.01
        ok 2 - 98.03.02
        ok 3 - 98.03.03
        ok 4 - 98.03.04
        1..4
    ok 75 - 98.03 - [33mAPI bits[39m - extractFromToSource - wizard case, 3 args # time=3.129ms
    
    # Subtest: 98.04 - [33mAPI bits[39m - extractFromToSource - wizard case, 3 args - taster
        ok 1 - 98.04.01
        1..1
    ok 76 - 98.04 - [33mAPI bits[39m - extractFromToSource - wizard case, 3 args - taster # time=1.508ms
    
    # Subtest: 98.04 - [33mAPI bits[39m - extractFromToSource - wizard case, 3 args
        ok 1 - 98.04.02
        ok 2 - 98.04.03
        ok 3 - 98.04.04
        ok 4 - 98.04.05
        ok 5 - 98.04.06
        ok 6 - 98.04.07
        ok 7 - 98.04.08
        1..7
    ok 77 - 98.04 - [33mAPI bits[39m - extractFromToSource - wizard case, 3 args # time=8.241ms
    
    # Subtest: 98.05 - [33mAPI bits[39m - extractFromToSource - generator case, 1 arg
        ok 1 - 98.05.01
        ok 2 - 98.05.02
        ok 3 - 98.05.03
        ok 4 - 98.05.04
        ok 5 - 98.05.05
        ok 6 - 98.05.06
        ok 7 - 98.05.07
        1..7
    ok 78 - 98.05 - [33mAPI bits[39m - extractFromToSource - generator case, 1 arg # time=6.494ms
    
    # Subtest: 98.06 - [33mAPI bits[39m - extractFromToSource - generator case, 2 arg
        ok 1 - 98.06.01
        ok 2 - 98.06.02
        ok 3 - 98.06.03
        ok 4 - 98.06.04
        ok 5 - 98.06.05
        ok 6 - 98.06.06
        ok 7 - 98.06.07
        1..7
    ok 79 - 98.06 - [33mAPI bits[39m - extractFromToSource - generator case, 2 arg # time=4.471ms
    
    # Subtest: 98.07 - [33mAPI bits[39m - extractFromToSource - pipe in CSS
        ok 1 - 98.07.01
        ok 2 - 98.07.02
        ok 3 - 98.07.03
        ok 4 - 98.07.04
        ok 5 - 98.07.05
        1..5
    ok 80 - 98.07 - [33mAPI bits[39m - extractFromToSource - pipe in CSS # time=3.609ms
    
    # Subtest: 99.01 - [33mAPI bits[39m - version is exported
        ok 1 - 99.01
        1..1
    ok 81 - 99.01 - [33mAPI bits[39m - version is exported # time=1.466ms
    
    # Subtest: 99.02 - [33mAPI bits[39m - heads and tails are exported
        ok 1 - 99.02
        1..1
    ok 82 - 99.02 - [33mAPI bits[39m - heads and tails are exported # time=1.225ms
    
    # Subtest: 99.03 - [33mAPI bits[39m - exports reportProgressFunc which works
        ok 1 - 99.03.01
        ok 2 - 99.03.02
        1..2
    ok 83 - 99.03 - [33mAPI bits[39m - exports reportProgressFunc which works # time=82.01ms
    
    1..83
    # time=1187.022ms
ok 1 - test/test.js # time=1187.022ms

1..1
# time=4439.978ms
