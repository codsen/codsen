TAP version 13
# Subtest: test/test.js
    # Subtest: 00.01 - [34mthrows[39m - when first arg is wrong
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        ok 4 - expected to throw
        ok 5 - should match pattern provided
        ok 6 - should match pattern provided
        1..6
    ok 1 - 00.01 - [34mthrows[39m - when first arg is wrong # time=15.492ms
    
    # Subtest: 00.02 - [34mthrows[39m - when second arg is wrong
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        ok 4 - expected to throw
        ok 5 - should match pattern provided
        ok 6 - should match pattern provided
        1..6
    ok 2 - 00.02 - [34mthrows[39m - when second arg is wrong # time=5.305ms
    
    # Subtest: 00.04 - [34mthrows[39m - when opts.breakToTheLeftOf contains non-string elements
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        ok 4 - should match pattern provided
        ok 5 - expected to not throw
        ok 6 - expected to not throw
        ok 7 - expected to not throw
        1..7
    ok 3 - 00.04 - [34mthrows[39m - when opts.breakToTheLeftOf contains non-string elements # time=6.18ms
    
    # Subtest: 01.01 - [33msmall tests[39m - deletes trailing space
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        1..3
    ok 4 - 01.01 - [33msmall tests[39m - deletes trailing space # time=10.881ms
    
    # Subtest: 01.02 - [33msmall tests[39m - retains trailing linebreak
        ok 1 - 01.02.01
        1..1
    ok 5 - 01.02 - [33msmall tests[39m - retains trailing linebreak # time=2.21ms
    
    # Subtest: 01.03 - [33msmall tests[39m - trailing line break
        ok 1 - 01.03
        1..1
    ok 6 - 01.03 - [33msmall tests[39m - trailing line break # time=2.858ms
    
    # Subtest: 01.04 - [33msmall tests[39m - multiple line breaks
        ok 1 - 01.04
        1..1
    ok 7 - 01.04 - [33msmall tests[39m - multiple line breaks # time=2.538ms
    
    # Subtest: 01.05 - [33msmall tests[39m - ends with character
        ok 1 - 01.05
        1..1
    ok 8 - 01.05 - [33msmall tests[39m - ends with character # time=2.31ms
    
    # Subtest: 01.06 - [33msmall tests[39m - string sequence breaks in front of space
        ok 1 - 01.06 - clone of 02.11.09
        1..1
    ok 9 - 01.06 - [33msmall tests[39m - string sequence breaks in front of space # time=11.32ms
    
    # Subtest: 01.07 - [33msmall tests[39m - what happens when it's impossible to break and exceeding line length limit is inevitable
        ok 1 - 01.07
        1..1
    ok 10 - 01.07 - [33msmall tests[39m - what happens when it's impossible to break and exceeding line length limit is inevitable # time=12.411ms
    
    # Subtest: 01.08 - [33msmall tests[39m - stacks lines when limiter is on
        ok 1 - 01.08
        1..1
    ok 11 - 01.08 - [33msmall tests[39m - stacks lines when limiter is on # time=5.511ms
    
    # Subtest: 01.09 - [33msmall tests[39m - stacks along with wiping whitespace
        ok 1 - 01.09
        1..1
    ok 12 - 01.09 - [33msmall tests[39m - stacks along with wiping whitespace # time=4.256ms
    
    # Subtest: 01.10 - [33msmall tests[39m - stacks unbreakable chunks, each over limit
        ok 1 - 01.10
        1..1
    ok 13 - 01.10 - [33msmall tests[39m - stacks unbreakable chunks, each over limit # time=2.308ms
    
    # Subtest: 01.11 - [33msmall tests[39m - stacks tags, wipes whitespace
        ok 1 - 01.11.01 - inline tags
        ok 2 - 01.11.02 - not inline tags
        1..2
    ok 14 - 01.11 - [33msmall tests[39m - stacks tags, wipes whitespace # time=7.236ms
    
    # Subtest: 01.12 - [33msmall tests[39m - tags and limiting
        ok 1 - 01.12.01
        ok 2 - 01.12.02 - not inline tags
        1..2
    ok 15 - 01.12 - [33msmall tests[39m - tags and limiting # time=6.546ms
    
    # Subtest: 01.13 - [33msmall tests[39m - more tags and limiting
        ok 1 - 01.13.01 - inline tags
        ok 2 - 01.13.02 - non-inline tags
        1..2
    ok 16 - 01.13 - [33msmall tests[39m - more tags and limiting # time=30.69ms
    
    # Subtest: 01.14 - [33msmall tests[39m - tags and limiting = 8
        ok 1 - 01.14
        1..1
    ok 17 - 01.14 - [33msmall tests[39m - tags and limiting = 8 # time=6.176ms
    
    # Subtest: 01.15 - [33msmall tests[39m - tags and limiting = 10
        ok 1 - 01.15
        1..1
    ok 18 - 01.15 - [33msmall tests[39m - tags and limiting = 10 # time=4.761ms
    
    # Subtest: 01.16 - [33msmall tests[39m - tags and limiting = 14
        ok 1 - 01.16
        1..1
    ok 19 - 01.16 - [33msmall tests[39m - tags and limiting = 14 # time=2.224ms
    
    # Subtest: 01.17 - [33msmall tests[39m - tag sequence without whitespace is wrapped
        ok 1 - 01.17 - duplicates 02.10.01
        1..1
    ok 20 - 01.17 - [33msmall tests[39m - tag sequence without whitespace is wrapped # time=2.538ms
    
    # Subtest: 01.18 - [33msmall tests[39m - tag sequence completely wrapped
        ok 1 - 01.18
        1..1
    ok 21 - 01.18 - [33msmall tests[39m - tag sequence completely wrapped # time=2.499ms
    
    # Subtest: 01.19 - [33msmall tests[39m - string sequence breaks in front of space
        ok 1 - clone of 02.05.14
        1..1
    ok 22 - 01.19 - [33msmall tests[39m - string sequence breaks in front of space # time=2.732ms
    
    # Subtest: 01.20 - [33msmall tests[39m - tags, end with character
        ok 1 - 01.20.01
        ok 2 - 01.20.02
        1..2
    ok 23 - 01.20 - [33msmall tests[39m - tags, end with character # time=24.009ms
    
    # Subtest: 01.21 - [33msmall tests[39m - comments
        ok 1 - 01.21.01
        1..1
    ok 24 - 01.21 - [33msmall tests[39m - comments # time=7.632ms
    
    # Subtest: 02.01 - [35mBAU[39m - nothing to minify
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        1..2
    ok 25 - 02.01 - [35mBAU[39m - nothing to minify # time=2.144ms
    
    # Subtest: 02.02 - [35mBAU[39m - minimal string of few words
        ok 1 - 02.02.01 - defaults: remove both indentations and linebreaks
        ok 2 - 02.02.02 - disabling indentation removal while keeping linebreak removal is futile
        ok 3 - 02.02.03 - only remove indentations
        ok 4 - 02.02.04 - all off so only trims leading whitespace
        ok 5 - 02.02.05 - line breaks on
        ok 6 - 02.02.06 - line breaks on
        1..6
    ok 26 - 02.02 - [35mBAU[39m - minimal string of few words # time=31.42ms
    
    # Subtest: 02.03 - [35mBAU[39m - trailing linebreaks (or their absence) at the EOF are respected
        ok 1 - 02.03.01 - default settings, single trailing line breaks at EOF
        ok 2 - 02.03.02 - default settings, double trailing line breaks at EOF
        ok 3 - 02.03.03 - default settings, no trailing line breaks at EOF
        ok 4 - 02.03.04 - default settings, single trailing line breaks at EOF
        ok 5 - 02.03.05 - default settings, double trailing line breaks at EOF
        ok 6 - 02.03.06 - default settings, no trailing line breaks at EOF
        1..6
    ok 27 - 02.03 - [35mBAU[39m - trailing linebreaks (or their absence) at the EOF are respected # time=49.344ms
    
    # Subtest: 02.04 - [35mBAU[39m - opts.lineLengthLimit
        ok 1 - 02.04.01 - default settings
        ok 2 - 02.04.02
        ok 3 - 02.04.03
        ok 4 - 02.04.04
        ok 5 - row #0
        ok 6 - row #1
        ok 7 - row #2
        ok 8 - row #3
        ok 9 - row #4
        ok 10 - row #5
        ok 11 - row #6
        ok 12 - row #7
        ok 13 - row #8
        ok 14 - row #9
        ok 15 - row #10
        ok 16 - row #11
        ok 17 - row #12
        ok 18 - row #0
        ok 19 - row #1
        ok 20 - row #2
        ok 21 - row #3
        ok 22 - row #4
        ok 23 - row #5
        ok 24 - row #6
        1..24
    ok 28 - 02.04 - [35mBAU[39m - opts.lineLengthLimit # time=50.572ms
    
    # Subtest: 02.05 - [35mBAU[39m - when chunk of characters without break points is longer than line limit - spaces
        ok 1 - 02.05.01-1
        ok 2 - 02.05.01-2
        ok 3 - 02.05.02
        ok 4 - 02.05.03
        ok 5 - 02.05.04
        ok 6 - 02.05.05
        ok 7 - 02.05.06
        ok 8 - 02.05.07
        ok 9 - 02.05.08
        ok 10 - 02.05.09
        ok 11 - 02.05.10
        ok 12 - 02.05.11
        ok 13 - 02.05.12
        ok 14 - 02.05.13 - the very edge
        ok 15 - 02.05.14
        ok 16 - 02.05.15 - double space
        ok 17 - 02.05.16 - double linebreak
        ok 18 - 02.05.17 - double linebreak with spaces
        ok 19 - 02.05.18 - double linebreak with spaces
        ok 20 - 02.05.19 - two chunks can stay on one line generously
        ok 21 - 02.05.20 - two chunks can stay on one line generously
        1..21
    ok 29 - 02.05 - [35mBAU[39m - when chunk of characters without break points is longer than line limit - spaces # time=32.479ms
    
    # Subtest: 02.06 - [35mBAU[39m - when chunk of characters without break points is longer than line limit - linebreaks
        ok 1 - 02.06.01
        ok 2 - 02.06.02
        ok 3 - 02.06.03
        ok 4 - 02.06.04
        ok 5 - 02.06.05
        ok 6 - 02.06.06
        ok 7 - 02.06.07
        ok 8 - 02.06.08
        ok 9 - 02.06.09
        ok 10 - 02.06.10
        ok 11 - 02.06.11
        ok 12 - 02.06.12
        ok 13 - 02.06.13 - the very edge
        ok 14 - 02.06.14
        1..14
    ok 30 - 02.06 - [35mBAU[39m - when chunk of characters without break points is longer than line limit - linebreaks # time=15.208ms
    
    # Subtest: 02.07 - [35mBAU[39m - when chunk of characters without break points is longer than line limit - double linebreaks
        ok 1 - 02.07.01
        ok 2 - 02.07.02
        ok 3 - 02.07.03
        ok 4 - 02.07.04
        ok 5 - 02.07.05
        ok 6 - 02.07.06
        ok 7 - 02.07.07
        ok 8 - 02.07.08
        ok 9 - 02.07.09
        ok 10 - 02.07.10
        ok 11 - 02.07.11
        ok 12 - 02.07.12
        ok 13 - 02.07.13 - the very edge
        1..13
    ok 31 - 02.07 - [35mBAU[39m - when chunk of characters without break points is longer than line limit - double linebreaks # time=15.149ms
    
    # Subtest: 02.08 - [35mBAU[39m - tags with single space between them
        ok 1 - 02.08.01 - same but with tags
        ok 2 - 02.08.02 - the very edge
        ok 3 - 02.08.03
        ok 4 - 02.08.04
        ok 5 - 02.08.05
        ok 6 - 02.08.06
        ok 7 - 02.08.07
        ok 8 - 02.08.08
        ok 9 - 02.08.09
        1..9
    ok 32 - 02.08 - [35mBAU[39m - tags with single space between them # time=13.091ms
    
    # Subtest: 02.09 - [35mBAU[39m - breaking between tags
        ok 1 - 02.09.01
        ok 2 - 02.09.02
        ok 3 - 02.09.03
        ok 4 - 02.09.04
        ok 5 - 02.09.05
        ok 6 - 02.09.06
        ok 7 - 02.09.07
        ok 8 - 02.09.08
        ok 9 - 02.09.09
        ok 10 - 02.09.10
        ok 11 - 02.09.11
        ok 12 - 02.09.12
        1..12
    ok 33 - 02.09 - [35mBAU[39m - breaking between tags # time=19.965ms
    
    # Subtest: 02.10 - [35mBAU[39m - break-position-friendly characters, not suitable for break yet - line limit 8
        ok 1 - 02.10.01
        ok 2 - 02.10.02
        ok 3 - 02.10.03
        ok 4 - 02.10.04
        ok 5 - 02.10.05
        ok 6 - 02.10.06
        1..6
    ok 34 - 02.10 - [35mBAU[39m - break-position-friendly characters, not suitable for break yet - line limit 8 # time=8.945ms
    
    # Subtest: 02.11 - [35mBAU[39m - break-position-friendly characters, not suitable for break yet - line limit 12
        ok 1 - 02.11.01
        ok 2 - 02.11.02
        ok 3 - 02.11.03
        ok 4 - 02.11.04
        ok 5 - 02.11.05
        ok 6 - 02.11.06
        ok 7 - 02.11.07
        ok 8 - 02.11.08
        ok 9 - 02.11.09
        ok 10 - 02.11.10
        ok 11 - 02.11.11
        ok 12 - 02.11.12
        ok 13 - 02.11.13
        ok 14 - 02.11.14
        ok 15 - 02.11.15
        ok 16 - 02.11.16
        1..16
    ok 35 - 02.11 - [35mBAU[39m - break-position-friendly characters, not suitable for break yet - line limit 12 # time=21.885ms
    
    # Subtest: 02.12 - [35mBAU[39m - script tags are skipped
        ok 1 - 02.12.01
        ok 2 - 02.12.02 - default
        ok 3 - 02.12.03
        ok 4 - 02.12.04
        1..4
    ok 36 - 02.12 - [35mBAU[39m - script tags are skipped # time=8.731ms
    
    # Subtest: 02.13 - [35mBAU[39m - unfinished script tags are skipped too
        ok 1 - 02.13.01
        ok 2 - 02.13.02 - default
        ok 3 - 02.13.03
        ok 4 - 02.13.04
        1..4
    ok 37 - 02.13 - [35mBAU[39m - unfinished script tags are skipped too # time=4.456ms
    
    # Subtest: 02.14 - [35mBAU[39m - code-pre blocks are not touched
        ok 1 - 02.14.01
        ok 2 - 02.14.02
        ok 3 - 02.14.03
        ok 4 - 02.14.04
        1..4
    ok 38 - 02.14 - [35mBAU[39m - code-pre blocks are not touched # time=5.211ms
    
    # Subtest: 02.15 - [35mBAU[39m - CDATA blocks are not touched
        ok 1 - 02.15.01
        ok 2 - 02.15.02
        ok 3 - 02.15.03
        ok 4 - 02.15.04
        1..4
    ok 39 - 02.15 - [35mBAU[39m - CDATA blocks are not touched # time=5.241ms
    
    # Subtest: 02.16 - [35mBAU[39m - whitespace in front of </script>
        ok 1 - 02.16.01
        ok 2 - 02.16.02
        ok 3 - 02.16.03
        ok 4 - 02.16.04
        ok 5 - 02.16.05
        ok 6 - 02.16.06
        ok 7 - 02.16.07
        ok 8 - 02.16.08
        ok 9 - 02.16.09
        ok 10 - 02.16.10
        1..10
    ok 40 - 02.16 - [35mBAU[39m - whitespace in front of </script> # time=10.008ms
    
    # Subtest: 02.17 - [35mBAU[39m - single linebreak is not replaced with a single space
        ok 1 - 02.17.01
        ok 2 - 02.17.02
        ok 3 - 02.17.03
        ok 4 - 02.17.04
        1..4
    ok 41 - 02.17 - [35mBAU[39m - single linebreak is not replaced with a single space # time=3.274ms
    
    # Subtest: 02.18 - [35mBAU[39m - single linebreak is deleted though
        ok 1 - 02.18.01
        ok 2 - 02.18.02
        ok 3 - 02.18.03
        ok 4 - 02.18.04
        1..4
    ok 42 - 02.18 - [35mBAU[39m - single linebreak is deleted though # time=4.445ms
    
    # Subtest: 02.19 - [35mBAU[39m - breaking to the right of style tag
        ok 1 - 02.19.01
        ok 2 - 02.19.02
        ok 3 - 02.19.03
        1..3
    ok 43 - 02.19 - [35mBAU[39m - breaking to the right of style tag # time=18.751ms
    
    # Subtest: 02.20 - [35mBAU[39m - doesn't delete whitespace with linebreaks between curlies
        ok 1 - 02.20.01
        ok 2 - 02.20.02
        1..2
    ok 44 - 02.20 - [35mBAU[39m - doesn't delete whitespace with linebreaks between curlies # time=2.586ms
    
    # Subtest: 03.01 - [36mopts.reportProgressFunc[39m - calls the progress function
        ok 1 - 03.01.01 - default behaviour
        ok 2 - 03.01.02
        ok 3 - 03.01.03
        ok 4 - expected to throw
        ok 5 - should match pattern provided
        ok 6 - (unnamed test)
        ok 7 - 03.01.04 - counter called
        1..7
    ok 45 - 03.01 - [36mopts.reportProgressFunc[39m - calls the progress function # time=52.656ms
    
    # Subtest: 03.02 - [36mopts.reportProgressFunc[39m - adjusted from-to range
        ok 1 - (unnamed test)
        ok 2 - checking: 21%
        ok 3 - checking: 22%
        ok 4 - checking: 23%
        ok 5 - checking: 24%
        ok 6 - checking: 25%
        ok 7 - checking: 26%
        ok 8 - checking: 27%
        ok 9 - checking: 28%
        ok 10 - checking: 29%
        ok 11 - checking: 30%
        ok 12 - checking: 31%
        ok 13 - checking: 32%
        ok 14 - checking: 33%
        ok 15 - checking: 34%
        ok 16 - checking: 35%
        ok 17 - checking: 36%
        ok 18 - checking: 37%
        ok 19 - checking: 38%
        ok 20 - checking: 39%
        ok 21 - checking: 40%
        ok 22 - checking: 41%
        ok 23 - checking: 42%
        ok 24 - checking: 43%
        ok 25 - checking: 44%
        ok 26 - checking: 45%
        ok 27 - checking: 46%
        ok 28 - checking: 47%
        ok 29 - checking: 48%
        ok 30 - checking: 49%
        ok 31 - checking: 50%
        ok 32 - checking: 51%
        ok 33 - checking: 52%
        ok 34 - checking: 53%
        ok 35 - checking: 54%
        ok 36 - checking: 55%
        ok 37 - checking: 56%
        ok 38 - checking: 57%
        ok 39 - checking: 58%
        ok 40 - checking: 59%
        ok 41 - checking: 60%
        ok 42 - checking: 61%
        ok 43 - checking: 62%
        ok 44 - checking: 63%
        ok 45 - checking: 64%
        ok 46 - checking: 65%
        ok 47 - checking: 66%
        ok 48 - checking: 67%
        ok 49 - checking: 68%
        ok 50 - checking: 69%
        ok 51 - checking: 70%
        ok 52 - checking: 71%
        ok 53 - checking: 72%
        ok 54 - checking: 73%
        ok 55 - checking: 74%
        ok 56 - checking: 75%
        ok 57 - checking: 76%
        ok 58 - checking: 77%
        ok 59 - checking: 78%
        ok 60 - checking: 79%
        ok 61 - checking: 80%
        ok 62 - checking: 81%
        ok 63 - checking: 82%
        ok 64 - checking: 83%
        ok 65 - checking: 84%
        ok 66 - should be equal
        1..66
    ok 46 - 03.02 - [36mopts.reportProgressFunc[39m - adjusted from-to range # time=397.229ms
    
    # Subtest: 04.01 - [33mopts.removeIndentations[39m - collapses whitespace on removeIndentations
        ok 1 - 04.01
        1..1
    ok 47 - 04.01 - [33mopts.removeIndentations[39m - collapses whitespace on removeIndentations # time=10.231ms
    
    # Subtest: 04.02 - [33mopts.removeIndentations[39m - trailing whitespace on removeIndentations
        ok 1 - 04.02
        1..1
    ok 48 - 04.02 - [33mopts.removeIndentations[39m - trailing whitespace on removeIndentations # time=4.808ms
    
    # Subtest: 04.03 - [33mopts.removeIndentations[39m - leading whitespace
        ok 1 - 04.03
        1..1
    ok 49 - 04.03 - [33mopts.removeIndentations[39m - leading whitespace # time=6.1ms
    
    # Subtest: 05.01 - [32mAPI's defaults[39m - plain object is exported and contains correct keys
        ok 1 - 05.01
        1..1
    ok 50 - 05.01 - [32mAPI's defaults[39m - plain object is exported and contains correct keys # time=8.914ms
    
    # Subtest: 05.02 - [32mAPI's defaults[39m - plain object is exported
        ok 1 - 05.02
        1..1
    ok 51 - 05.02 - [32mAPI's defaults[39m - plain object is exported # time=2.301ms
    
    # Subtest: 06.01 - [34mopts.breakToTheLeftOf[39m - breaks based on breakpoints (no whitespace involved)
        ok 1 - 06.01.01 - no linebreak removal
        ok 2 - 06.01.02 - default line break removal
        ok 3 - 06.01.03 - break in the middle, once
        ok 4 - 06.01.04 - break twice
        ok 5 - 06.01.05 - don't break in front
        ok 6 - 06.01.06 - don't break in front
        ok 7 - 06.01.07
        ok 8 - 06.01.08
        ok 9 - 06.01.09
        ok 10 - 06.01.10
        1..10
    ok 52 - 06.01 - [34mopts.breakToTheLeftOf[39m - breaks based on breakpoints (no whitespace involved) # time=23.556ms
    
    # Subtest: 06.02 - [34mopts.breakToTheLeftOf[39m - breaks based on breakpoints (whitespace involved)
        ok 1 - 06.02.01
        ok 2 - 06.02.02
        ok 3 - 06.02.03
        ok 4 - 06.02.04
        ok 5 - 06.02.05
        ok 6 - 06.02.06
        ok 7 - 06.02.07
        ok 8 - 06.02.08
        ok 9 - 06.02.09 - nothing in given breakpoints is useful
        ok 10 - 06.02.10
        1..10
    ok 53 - 06.02 - [34mopts.breakToTheLeftOf[39m - breaks based on breakpoints (whitespace involved) # time=56.772ms
    
    # Subtest: 07.01 - [34mCSS minification[39m - minifies around class names - minimal
        ok 1 - 07.01.01
        ok 2 - 07.01.02
        ok 3 - 07.01.03
        ok 4 - 07.01.04
        1..4
    ok 54 - 07.01 - [34mCSS minification[39m - minifies around class names - minimal # time=20.071ms
    
    # Subtest: 07.02 - [34mCSS minification[39m - minifies around class names - spaces
        ok 1 - 07.02.01
        ok 2 - 07.02.02
        ok 3 - 07.02.03
        ok 4 - 07.02.04
        1..4
    ok 55 - 07.02 - [34mCSS minification[39m - minifies around class names - spaces # time=27.241ms
    
    # Subtest: 07.03 - [34mCSS minification[39m - minifies around class names - element > element
        ok 1 - 07.03.01
        ok 2 - 07.03.02
        ok 3 - 07.03.03
        ok 4 - 07.03.04
        ok 5 - 07.03.05
        1..5
    ok 56 - 07.03 - [34mCSS minification[39m - minifies around class names - element > element # time=33.543ms
    
    # Subtest: 07.04 - [34mCSS minification[39m - minifies around class names - element + element
        ok 1 - 07.04.01
        ok 2 - 07.04.02
        ok 3 - 07.04.03
        ok 4 - 07.04.04
        ok 5 - 07.04.05
        1..5
    ok 57 - 07.04 - [34mCSS minification[39m - minifies around class names - element + element # time=24.065ms
    
    # Subtest: 07.05 - [34mCSS minification[39m - minifies around class names - element ~ element
        ok 1 - 07.05.01
        ok 2 - 07.05.02
        ok 3 - 07.05.03
        ok 4 - 07.05.04
        ok 5 - 07.05.05
        1..5
    ok 58 - 07.05 - [34mCSS minification[39m - minifies around class names - element ~ element # time=28.771ms
    
    # Subtest: 07.06 - [34mCSS minification[39m - removes CSS comments
        ok 1 - 07.06.01
        ok 2 - 07.06.02
        1..2
    ok 59 - 07.06 - [34mCSS minification[39m - removes CSS comments # time=11.459ms
    
    # Subtest: 07.07 - [34mCSS minification[39m - removes whitespace in front of !important
        ok 1 - 07.07.01 - no space
        ok 2 - 07.07.02 - one space
        ok 3 - 07.07.03 - two spaces
        ok 4 - 07.07.04 - resembling real life
        1..4
    ok 60 - 07.07 - [34mCSS minification[39m - removes whitespace in front of !important # time=14.628ms
    
    # Subtest: 07.08 - [34mCSS minification[39m - removes whitespace in front of <script>
        ok 1 - 07.08.01
        ok 2 - 07.08.02
        ok 3 - 07.08.03
        ok 4 - 07.08.04
        1..4
    ok 61 - 07.08 - [34mCSS minification[39m - removes whitespace in front of <script> # time=19.554ms
    
    # Subtest: 07.09 - [34mCSS minification[39m - does not remove the whitespace in front of !important within Outlook conditionals
        ok 1 - should be equivalent
        1..1
    ok 62 - 07.09 - [34mCSS minification[39m - does not remove the whitespace in front of !important within Outlook conditionals # time=12.481ms
    
    # Subtest: 07.10 - [34mCSS minification[39m - does not remove the whitespace in front of !important within Outlook conditionals, lineLengthLimit=off
        ok 1 - should be equivalent
        1..1
    ok 63 - 07.10 - [34mCSS minification[39m - does not remove the whitespace in front of !important within Outlook conditionals, lineLengthLimit=off # time=12.266ms
    
    # Subtest: 07.11 - [34mCSS minification[39m - does not remove the whitespace in front of !important within Outlook conditionals, mix
        ok 1 - should be equivalent
        1..1
    ok 64 - 07.11 - [34mCSS minification[39m - does not remove the whitespace in front of !important within Outlook conditionals, mix # time=18.283ms
    
    # Subtest: 07.12 - [34mCSS minification[39m - does not remove the whitespace in front of !important within Outlook conditionals, mix, lineLengthLimit=off
        ok 1 - should be equivalent
        1..1
    ok 65 - 07.12 - [34mCSS minification[39m - does not remove the whitespace in front of !important within Outlook conditionals, mix, lineLengthLimit=off # time=22.959ms
    
    # Subtest: 08.01 - [34minline CSS minification[39m - one tag, minimal - double quotes
        ok 1 - 08.01.01
        ok 2 - 08.01.02
        ok 3 - 08.01.03 - indentations are removed on default settings
        ok 4 - 08.01.04 - indentations off
        1..4
    ok 66 - 08.01 - [34minline CSS minification[39m - one tag, minimal - double quotes # time=22.396ms
    
    # Subtest: 08.02 - [34minline CSS minification[39m - inline CSS comments
        ok 1 - 08.02
        1..1
    ok 67 - 08.02 - [34minline CSS minification[39m - inline CSS comments # time=12.329ms
    
    # Subtest: 08.03 - [34minline CSS minification[39m - line length limit falls in the middle of inline CSS comment
        ok 1 - 08.03
        1..1
    ok 68 - 08.03 - [34minline CSS minification[39m - line length limit falls in the middle of inline CSS comment # time=34.323ms
    
    # Subtest: 08.04 - [34minline CSS minification[39m - line length becomes all right because of truncation
        ok 1 - 08.04 - deletion makes it to be within a limit
        1..1
    ok 69 - 08.04 - [34minline CSS minification[39m - line length becomes all right because of truncation # time=7.411ms
    
    # Subtest: 08.05 - [34minline CSS minification[39m - leading whitespace inside double quotes
        ok 1 - 08.05
        1..1
    ok 70 - 08.05 - [34minline CSS minification[39m - leading whitespace inside double quotes # time=8.152ms
    
    # Subtest: 08.06 - [34minline CSS minification[39m - leading whitespace inside single quotes
        ok 1 - 08.06
        1..1
    ok 71 - 08.06 - [34minline CSS minification[39m - leading whitespace inside single quotes # time=7.888ms
    
    # Subtest: 09.01 - [32minline tags[39m - style on sup #1
        ok 1 - 09.01
        1..1
    ok 72 - 09.01 - [32minline tags[39m - style on sup #1 # time=12.937ms
    
    # Subtest: 09.02 - [32minline tags[39m - style on sup #2
        ok 1 - 09.02
        1..1
    ok 73 - 09.02 - [32minline tags[39m - style on sup #2 # time=10.308ms
    
    # Subtest: 09.03 - [32minline tags[39m - two spans with space - space retained
        ok 1 - 09.03
        1..1
    ok 74 - 09.03 - [32minline tags[39m - two spans with space - space retained # time=6.328ms
    
    # Subtest: 09.04 - [32minline tags[39m - two spans without space - fine
        ok 1 - 09.04
        1..1
    ok 75 - 09.04 - [32minline tags[39m - two spans without space - fine # time=6.865ms
    
    # Subtest: 09.06 - [32minline tags[39m - inside tag
        ok 1 - 09.06
        1..1
    ok 76 - 09.06 - [32minline tags[39m - inside tag # time=2.671ms
    
    # Subtest: 09.07 - [32minline tags[39m - nameless attr
        ok 1 - 09.07.01
        ok 2 - 09.07.02
        1..2
    ok 77 - 09.07 - [32minline tags[39m - nameless attr # time=7.683ms
    
    # Subtest: 09.08 - [32minline tags[39m - style attr
        ok 1 - 09.08.01
        ok 2 - 09.08.02
        1..2
    ok 78 - 09.08 - [32minline tags[39m - style attr # time=7.499ms
    
    # Subtest: 09.09 - [32minline tags[39m - two spans
        ok 1 - 09.09.01
        ok 2 - 09.09.02
        ok 3 - 09.09.03
        1..3
    ok 79 - 09.09 - [32minline tags[39m - two spans # time=22.988ms
    
    # Subtest: 09.10 - [32minline tags[39m - span + sup
        ok 1 - 09.10.01
        ok 2 - 09.10.02
        1..2
    ok 80 - 09.10 - [32minline tags[39m - span + sup # time=11.608ms
    
    # Subtest: 09.11 - [32minline tags[39m - won't line break between two inline tags
        ok 1 - 09.11.01 - limit = 1
        ok 2 - 09.11.02 - limit = 2
        ok 3 - 09.11.03 - limit = 3
        ok 4 - 09.11.04 - limit = 4
        ok 5 - 09.11.05 - limit = 5
        ok 6 - 09.11.06 - limit = 6
        ok 7 - 09.11.07 - limit = 7
        ok 8 - 09.11.08 - limit = 8
        ok 9 - 09.11.09 - limit = 9
        ok 10 - 09.11.010 - limit = 10
        ok 11 - 09.11.011 - limit = 11
        ok 12 - 09.11.012 - limit = 12
        ok 13 - 09.11.013 - limit = 13
        ok 14 - 09.11.014 - limit = 14
        ok 15 - 09.11.015 - limit = 15
        ok 16 - 09.11.016 - limit = 16
        ok 17 - 09.11.017 - limit = 17
        ok 18 - 09.11.018 - limit = 18
        ok 19 - 09.11.019 - limit = 19
        ok 20 - 09.11.020 - limit = 20
        ok 21 - 09.11.021 - limit = 21
        ok 22 - 09.11.022 - limit = 22
        ok 23 - 09.11.023 - limit = 23
        ok 24 - 09.11.024 - limit = 24
        ok 25 - 09.11.025 - limit = 25
        ok 26 - 09.11.026 - limit = 26
        ok 27 - 09.11.027 - limit = 27
        ok 28 - 09.11.028 - limit = 28
        ok 29 - 09.11.029 - limit = 29
        ok 30 - 09.11.030 - limit = 30
        ok 31 - 09.11.031 - limit = 31
        ok 32 - 09.11.032 - limit = 32
        ok 33 - 09.11.033 - limit = 33
        ok 34 - 09.11.034 - limit = 34
        ok 35 - 09.11.035 - limit = 35
        ok 36 - 09.11.036 - limit = 36
        1..36
    ok 81 - 09.11 - [32minline tags[39m - won't line break between two inline tags # time=107.236ms
    
    # Subtest: 09.12 - [32minline tags[39m - 012 pt.2
        ok 1 - 09.12
        1..1
    ok 82 - 09.12 - [32minline tags[39m - 012 pt.2 # time=12.836ms
    
    # Subtest: 09.13 - [32minline tags[39m - will line break between mixed #1
        ok 1 - 09.13.01
        ok 2 - 09.13.02
        1..2
    ok 83 - 09.13 - [32minline tags[39m - will line break between mixed #1 # time=12.38ms
    
    # Subtest: 09.14 - [32minline tags[39m - will line break between mixed, #2
        ok 1 - 09.14
        1..1
    ok 84 - 09.14 - [32minline tags[39m - will line break between mixed, #2 # time=6.27ms
    
    # Subtest: 09.15 - [32minline tags[39m - will line break between mixed, space, #1
        ok 1 - 09.15.01
        ok 2 - 09.15.02
        1..2
    ok 85 - 09.15 - [32minline tags[39m - will line break between mixed, space, #1 # time=6.84ms
    
    # Subtest: 09.16 - [32minline tags[39m - will line break between mixed, space, #2
        ok 1 - 09.16.01
        ok 2 - 09.16.02
        ok 3 - 09.16.03
        ok 4 - 09.16.04
        ok 5 - 09.16.05
        1..5
    ok 86 - 09.16 - [32minline tags[39m - will line break between mixed, space, #2 # time=14.53ms
    
    # Subtest: 09.17 - [32minline tags[39m - space between inline tags
        ok 1 - 09.17.01
        ok 2 - 09.17.02
        ok 3 - 09.17.03
        ok 4 - 09.17.04
        ok 5 - 09.17.05
        ok 6 - 09.17.06
        ok 7 - 09.17.07
        1..7
    ok 87 - 09.17 - [32minline tags[39m - space between inline tags # time=18.666ms
    
    # Subtest: 09.18 - [32minline tags[39m - excessive whitespace between inline tags #1
        ok 1 - 09.18.01
        ok 2 - 09.18.02
        ok 3 - 09.18.03
        ok 4 - 09.18.04
        ok 5 - 09.18.05
        ok 6 - 09.18.06
        ok 7 - 09.18.07
        ok 8 - 09.18.08
        ok 9 - 09.18.09
        ok 10 - 09.18.10
        1..10
    ok 88 - 09.18 - [32minline tags[39m - excessive whitespace between inline tags #1 # time=24.934ms
    
    # Subtest: 09.19 - [32minline tags[39m - div and sup
        ok 1 - 09.19.01
        ok 2 - 09.19.02
        1..2
    ok 89 - 09.19 - [32minline tags[39m - div and sup # time=6.872ms
    
    # Subtest: 09.20 - [32minline tags[39m - div and sup, escessive whitespace
        ok 1 - 09.20
        1..1
    ok 90 - 09.20 - [32minline tags[39m - div and sup, escessive whitespace # time=6.632ms
    
    # Subtest: 09.21 - [32minline tags[39m - div and sup, escessive whitespace
        ok 1 - 09.21.01 - limit = 10
        ok 2 - 09.21.01 - limit = 11
        ok 3 - 09.21.01 - limit = 12
        ok 4 - 09.21.01 - limit = 13
        ok 5 - 09.21.01 - limit = 14
        ok 6 - 09.21.01 - limit = 15
        ok 7 - 09.21.01 - limit = 16
        ok 8 - 09.21.01 - limit = 17
        ok 9 - 09.21.01 - limit = 18
        ok 10 - 09.21.01 - limit = 19
        ok 11 - 09.21.01 - limit = 20
        ok 12 - 09.21.01 - limit = 21
        ok 13 - 09.21.01 - limit = 22
        ok 14 - 09.21.01 - limit = 23
        ok 15 - 09.21.01 - limit = 24
        ok 16 - 09.21.02
        ok 17 - 09.21.03
        1..17
    ok 91 - 09.21 - [32minline tags[39m - div and sup, escessive whitespace # time=105.644ms
    
    # Subtest: 09.22 - [32minline tags[39m - multiple wrapped inline tags
        ok 1 - 09.22.01
        ok 2 - 09.22.02
        ok 3 - 09.22.03* - lineLengthLimit: i = 1
        ok 4 - 09.22.03* - lineLengthLimit: i = 2
        ok 5 - 09.22.03* - lineLengthLimit: i = 3
        ok 6 - 09.22.03* - lineLengthLimit: i = 4
        ok 7 - 09.22.03* - lineLengthLimit: i = 5
        ok 8 - 09.22.03* - lineLengthLimit: i = 6
        ok 9 - 09.22.03* - lineLengthLimit: i = 7
        ok 10 - 09.22.03* - lineLengthLimit: i = 8
        ok 11 - 09.22.03* - lineLengthLimit: i = 9
        ok 12 - 09.22.03* - lineLengthLimit: i = 10
        ok 13 - 09.22.03* - lineLengthLimit: i = 11
        ok 14 - 09.22.03* - lineLengthLimit: i = 12
        ok 15 - 09.22.03* - lineLengthLimit: i = 13
        ok 16 - 09.22.03* - lineLengthLimit: i = 14
        ok 17 - 09.22.03* - lineLengthLimit: i = 15
        ok 18 - 09.22.03* - lineLengthLimit: i = 16
        ok 19 - 09.22.03* - lineLengthLimit: i = 17
        ok 20 - 09.22.03* - lineLengthLimit: i = 18
        ok 21 - 09.22.03* - lineLengthLimit: i = 19
        ok 22 - 09.22.03* - lineLengthLimit: i = 20
        ok 23 - 09.22.03* - lineLengthLimit: i = 21
        ok 24 - 09.22.03* - lineLengthLimit: i = 22
        ok 25 - 09.22.03* - lineLengthLimit: i = 23
        ok 26 - 09.22.03* - lineLengthLimit: i = 24
        ok 27 - 09.22.03* - lineLengthLimit: i = 25
        ok 28 - 09.22.03* - lineLengthLimit: i = 26
        ok 29 - 09.22.03* - lineLengthLimit: i = 27
        ok 30 - 09.22.03* - lineLengthLimit: i = 28
        ok 31 - 09.22.03* - lineLengthLimit: i = 29
        ok 32 - 09.22.03* - lineLengthLimit: i = 30
        ok 33 - 09.22.03* - lineLengthLimit: i = 31
        ok 34 - 09.22.03* - lineLengthLimit: i = 32
        ok 35 - 09.22.03* - lineLengthLimit: i = 33
        ok 36 - 09.22.03* - lineLengthLimit: i = 34
        ok 37 - 09.22.03* - lineLengthLimit: i = 35
        ok 38 - 09.22.03* - lineLengthLimit: i = 36
        ok 39 - 09.22.03* - lineLengthLimit: i = 37
        ok 40 - 09.22.03* - lineLengthLimit: i = 38
        ok 41 - 09.22.03* - lineLengthLimit: i = 39
        ok 42 - 09.22.03* - lineLengthLimit: i = 40
        ok 43 - 09.22.03* - lineLengthLimit: i = 41
        1..43
    ok 92 - 09.22 - [32minline tags[39m - multiple wrapped inline tags # time=160.161ms
    
    # Subtest: 09.23 - [32minline tags[39m - first tag name letters resemble legit inline tags
        ok 1 - 09.23.01
        ok 2 - 09.23.02
        1..2
    ok 93 - 09.23 - [32minline tags[39m - first tag name letters resemble legit inline tags # time=17.976ms
    
    # Subtest: 09.24 - [32minline tags[39m - spanner is not span
        ok 1 - 09.24.01
        ok 2 - 09.24.02
        ok 3 - 09.24.03 - insurance against whitespace-hungry matching components
        1..3
    ok 94 - 09.24 - [32minline tags[39m - spanner is not span # time=16.559ms
    
    # Subtest: 10.01 - [33mtag inner whitespace[39m - whitespace before closing bracket on opening tag
        ok 1 - 10.01.01
        ok 2 - 10.01.02
        ok 3 - 10.01.03
        1..3
    ok 95 - 10.01 - [33mtag inner whitespace[39m - whitespace before closing bracket on opening tag # time=6.486ms
    
    # Subtest: 10.02 - [33mtag inner whitespace[39m - div - block level
        ok 1 - 10.02
        1..1
    ok 96 - 10.02 - [33mtag inner whitespace[39m - div - block level # time=2.054ms
    
    # Subtest: 10.03 - [33mtag inner whitespace[39m - a - inline tag
        ok 1 - 10.03
        1..1
    ok 97 - 10.03 - [33mtag inner whitespace[39m - a - inline tag # time=5.866ms
    
    # Subtest: 10.04 - [33mtag inner whitespace[39m - removeLineBreaks = off
        ok 1 - 10.04
        1..1
    ok 98 - 10.04 - [33mtag inner whitespace[39m - removeLineBreaks = off # time=5.864ms
    
    # Subtest: 10.05 - [33mtag inner whitespace[39m - all opts off, inline tag
        ok 1 - 10.05
        1..1
    ok 99 - 10.05 - [33mtag inner whitespace[39m - all opts off, inline tag # time=0.976ms
    
    # Subtest: 10.06 - [33mtag inner whitespace[39m - all opts off, block level tag
        ok 1 - 10.06
        1..1
    ok 100 - 10.06 - [33mtag inner whitespace[39m - all opts off, block level tag # time=1.003ms
    
    # Subtest: 10.07 - [33mtag inner whitespace[39m - before closing slash
        ok 1 - 10.07
        1..1
    ok 101 - 10.07 - [33mtag inner whitespace[39m - before closing slash # time=3.958ms
    
    # Subtest: 10.08 - [33mtag inner whitespace[39m - after closing slash
        ok 1 - 10.08
        1..1
    ok 102 - 10.08 - [33mtag inner whitespace[39m - after closing slash # time=5.797ms
    
    # Subtest: 10.09 - [33mtag inner whitespace[39m - around closing slash
        ok 1 - 10.09
        1..1
    ok 103 - 10.09 - [33mtag inner whitespace[39m - around closing slash # time=6.2ms
    
    # Subtest: 10.10 - [33mtag inner whitespace[39m - around closing slash - non inline tag
        ok 1 - 10.10
        1..1
    ok 104 - 10.10 - [33mtag inner whitespace[39m - around closing slash - non inline tag # time=1.923ms
    
    # Subtest: 99.01 - [90madhoc 1[39m - a peculiar set of characters
        ok 1 - 99.01 - a peculiar set of characters
        1..1
    ok 105 - 99.01 - [90madhoc 1[39m - a peculiar set of characters # time=12.955ms
    
    # Subtest: 99.02 - [90madhoc 2[39m - another peculiar set of characters
        ok 1 - 99.02 - another peculiar set of characters
        1..1
    ok 106 - 99.02 - [90madhoc 2[39m - another peculiar set of characters # time=16.517ms
    
    # Subtest: 99.03 - [90madhoc 3[39m - yet another peculiar set of chars
        ok 1 - 99.03 - another peculiar set of characters
        1..1
    ok 107 - 99.03 - [90madhoc 3[39m - yet another peculiar set of chars # time=29.343ms
    
    # Subtest: 99.04 - [90madhoc 4[39m - result's keyset is consistent
        ok 1 - 99.04
        1..1
    ok 108 - 99.04 - [90madhoc 4[39m - result's keyset is consistent # time=2.247ms
    
    # Subtest: 99.05 - [90madhoc 5[39m - raw non-breaking spaces
        ok 1 - 99.05.01
        ok 2 - 99.05.02
        ok 3 - 99.05.03
        ok 4 - 99.05.04
        ok 5 - 99.05.05
        ok 6 - 99.05.06
        ok 7 - 99.05.07
        ok 8 - 99.05.08
        1..8
    ok 109 - 99.05 - [90madhoc 5[39m - raw non-breaking spaces # time=18.767ms
    
    # Subtest: 99.06 - [90madhoc 6[39m - raw non-breaking spaces
        ok 1 - 99.06.01
        ok 2 - 99.06.02
        ok 3 - 99.06.03
        1..3
    ok 110 - 99.06 - [90madhoc 6[39m - raw non-breaking spaces # time=9.734ms
    
    # Subtest: 99.07 - [90madhoc 7[39m - line length control
        ok 1 - 99.07
        1..1
    ok 111 - 99.07 - [90madhoc 7[39m - line length control # time=6.897ms
    
    # Subtest: 99.08 - [90madhoc 8[39m - nunjucks
        ok 1 - 99.08
        1..1
    ok 112 - 99.08 - [90madhoc 8[39m - nunjucks # time=6.801ms
    
    # Subtest: 99.09 - [90madhoc 9[39m - nunjucks
        ok 1 - 99.09
        1..1
    ok 113 - 99.09 - [90madhoc 9[39m - nunjucks # time=9.564ms
    
    1..113
    # time=3505.443ms
ok 1 - test/test.js # time=3505.443ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equal
        ok 2 - should match pattern provided
        ok 3 - expect truthy value
        1..3
    ok 1 - UMD build works fine # time=31.768ms
    
    1..1
    # time=38.09ms
ok 2 - test/umd-test.js # time=38.09ms

# Subtest: test/websites-test.js
    # Subtest: 08.01-06 - [90mreal websites[39m
        ok 1 - 08.03.01 - fetched non-empty, valid HTML source from "https://en.wikipedia.org/wiki/Doughnut"
        ok 2 - 08.03.02 - minified size is the same or less (0% size savings)
    064.03.03 - the Wikipedia page about doughnuts - only indentations removed: 0% size savings
        ok 3 - 08.03.04 - minified size is the same or less (1% size savings)
    092.03.05 - the Wikipedia page about doughnuts - linebreaks removed: 1% size savings
    099.06.xx - Non-existent URL - [31mcould not fetch the web page! Moving on...[39m
        ok 4 - request to https://sjhgldgldgjdlfgldgldflkgjd.com/ failed, reason: getaddrinfo ENOTFOUND sjhgldgldgjdlfgldgldflkgjd.com
        ok 5 - 08.02.01 - fetched non-empty, valid HTML source from "https://detergent.io"
        ok 6 - 08.02.02 - minified size is the same or less (7% size savings)
    064.02.03 - Detergent.io website - only indentations removed: 7% size savings
        ok 7 - 08.02.04 - minified size is the same or less (7% size savings)
    092.02.05 - Detergent.io website - linebreaks removed: 7% size savings
        ok 8 - 08.01.01 - fetched non-empty, valid HTML source from "https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/"
        ok 9 - 08.01.02 - minified size is the same or less (0% size savings)
    064.01.03 - html-crush on GitLab - only indentations removed: 0% size savings
        ok 10 - 08.01.04 - minified size is the same or less (1% size savings)
    092.01.05 - html-crush on GitLab - linebreaks removed: 1% size savings
        ok 11 - 08.05.01 - fetched non-empty, valid HTML source from "https://www.mozilla.org/en-GB/"
        ok 12 - 08.05.02 - minified size is the same or less (15% size savings)
    064.05.03 - Mozilla UK homepage - only indentations removed: 15% size savings
        ok 13 - 08.05.04 - minified size is the same or less (16% size savings)
    092.05.05 - Mozilla UK homepage - linebreaks removed: 16% size savings
        ok 14 - 08.04.01 - fetched non-empty, valid HTML source from "http://www.muji.eu/"
        ok 15 - 08.04.02 - minified size is the same or less (8% size savings)
    064.04.03 - Muji EU online store - only indentations removed: 8% size savings
        ok 16 - 08.04.04 - minified size is the same or less (10% size savings)
    092.04.05 - Muji EU online store - linebreaks removed: 10% size savings
        1..16
    ok 1 - 08.01-06 - [90mreal websites[39m # time=11791.724ms
    
    1..1
    # time=12197.001ms
ok 3 - test/websites-test.js # time=12197.001ms

1..3
# time=24007.989ms
