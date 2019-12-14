TAP version 13
ok 1 - test/test.js # time=376.114ms {
    # Subtest: 01.01 - wrong input is just being returned
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        ok 6 - expected to not throw
        ok 7 - expected to not throw
        1..7
    ok 1 - 01.01 - wrong input is just being returned # time=3.906ms
    
    # Subtest: 02.01 - single straight quotes - no whitespace
        ok 1 - should be equal
        1..1
    ok 2 - 02.01 - single straight quotes - no whitespace # time=2.419ms
    
    # Subtest: 02.02 - single straight quotes - with whitespace
        ok 1 - should be equal
        1..1
    ok 3 - 02.02 - single straight quotes - with whitespace # time=0.785ms
    
    # Subtest: 02.03 - single straight quotes - tight, no semicolon
        ok 1 - should be equal
        1..1
    ok 4 - 02.03 - single straight quotes - tight, no semicolon # time=0.676ms
    
    # Subtest: 02.04 - double quotes - tight
        ok 1 - should be equal
        1..1
    ok 5 - 02.04 - double quotes - tight # time=0.797ms
    
    # Subtest: 02.05 - double quotes - newlines
        ok 1 - should be equal
        1..1
    ok 6 - 02.05 - double quotes - newlines # time=0.674ms
    
    # Subtest: 02.06 - double quotes - with whitespace
        ok 1 - should be equal
        1..1
    ok 7 - 02.06 - double quotes - with whitespace # time=0.692ms
    
    # Subtest: 02.07 - backticks - tight
        ok 1 - should be equal
        1..1
    ok 8 - 02.07 - backticks - tight # time=0.709ms
    
    # Subtest: 02.08 - console log with ANSI escapes - one ANSI escape chunk in front
        ok 1 - should be equal
        1..1
    ok 9 - 02.08 - console log with ANSI escapes - one ANSI escape chunk in front # time=0.553ms
    
    # Subtest: 02.09 - synthetic test where colour is put in deeper curlies for easier visual grepping
        ok 1 - should be equal
        1..1
    ok 10 - 02.09 - synthetic test where colour is put in deeper curlies for easier visual grepping # time=0.555ms
    
    # Subtest: 02.10 - synthetic test where colour code is put raw
        ok 1 - should be equal
        1..1
    ok 11 - 02.10 - synthetic test where colour code is put raw # time=0.517ms
    
    # Subtest: 02.11 - bunch of whitespace 1
        ok 1 - 02.04.04 - synthetic test where colour is put in deeper curlies for easier visual grepping
        1..1
    ok 12 - 02.11 - bunch of whitespace 1 # time=0.559ms
    
    # Subtest: 02.12 - bunch of whitespace 2
        ok 1 - 02.04.05 - synthetic test where colour code is put raw
        1..1
    ok 13 - 02.12 - bunch of whitespace 2 # time=0.539ms
    
    # Subtest: 02.13 - updates console.logs within comment blocks
        ok 1 - should be equal
        1..1
    ok 14 - 02.13 - updates console.logs within comment blocks # time=0.557ms
    
    # Subtest: 02.14 - \n in front
        ok 1 - should be equal
        1..1
    ok 15 - 02.14 - \n in front # time=0.57ms
    
    # Subtest: 02.15 - automatic 4 digit padding on >45K chars
        ok 1 - should be equal
        1..1
    ok 16 - 02.15 - automatic 4 digit padding on >45K chars # time=109.423ms
    
    # Subtest: 03.01 - [36mfalse positives[39m - text that mentions console.log
        ok 1 - 03.01
        1..1
    ok 17 - 03.01 - [36mfalse positives[39m - text that mentions console.log # time=69.167ms
    
    # Subtest: 03.02 - [36mfalse positives[39m - no digits at all
        ok 1 - 03.02
        1..1
    ok 18 - 03.02 - [36mfalse positives[39m - no digits at all # time=0.695ms
    
    # Subtest: 03.03 - [36mfalse positives[39m - no opening bracket after console.log
        ok 1 - 03.03
        1..1
    ok 19 - 03.03 - [36mfalse positives[39m - no opening bracket after console.log # time=0.44ms
    
    # Subtest: 03.04 - [36mfalse positives[39m - all ASCII symbols
        ok 1 - 03.04
        1..1
    ok 20 - 03.04 - [36mfalse positives[39m - all ASCII symbols # time=0.384ms
    
    # Subtest: 03.05 - [36mfalse positives[39m - letter, then digit
        ok 1 - 03.05
        1..1
    ok 21 - 03.05 - [36mfalse positives[39m - letter, then digit # time=0.567ms
    
    # Subtest: 04.01 - [33mopts[39m - padding is set to numbers
        ok 1 - 04.01.01 - control - default is three
        ok 2 - 04.01.02
        ok 3 - 04.01.03
        ok 4 - 04.01.04
        ok 5 - 04.01.05
        ok 6 - 04.01.05
        ok 7 - 04.01.06
        ok 8 - 04.01.07 - negative numbers are ignored, default (3) is used
        1..8
    ok 22 - 04.01 - [33mopts[39m - padding is set to numbers # time=2.539ms
    
    # Subtest: 04.02 - [33mopts[39m - padding is set to be falsey
        ok 1 - 04.02.01
        ok 2 - 04.02.02
        ok 3 - 04.02.03
        1..3
    ok 23 - 04.02 - [33mopts[39m - padding is set to be falsey # time=1.337ms
    
    # Subtest: 04.03 - [33mopts[39m - letter then digit
        ok 1 - 04.03
        1..1
    ok 24 - 04.03 - [33mopts[39m - letter then digit # time=0.469ms
    
    # Subtest: 04.04 - [33mopts[39m - opts.overrideRowNum
        ok 1 - 04.04
        1..1
    ok 25 - 04.04 - [33mopts[39m - opts.overrideRowNum # time=0.672ms
    
    # Subtest: 04.05 - [33mopts[39m - opts.returnRangesOnly
        ok 1 - 04.05
        1..1
    ok 26 - 04.05 - [33mopts[39m - opts.returnRangesOnly # time=0.413ms
    
    # Subtest: 04.06 - [33mopts[39m - opts.returnRangesOnly +
        ok 1 - 04.06
        1..1
    ok 27 - 04.06 - [33mopts[39m - opts.returnRangesOnly + # time=0.408ms
    
    # Subtest: 04.07 - [33mopts[39m - opts.extractedLogContentsWereGiven
        ok 1 - 04.07
        1..1
    ok 28 - 04.07 - [33mopts[39m - opts.extractedLogContentsWereGiven # time=0.498ms
    
    # Subtest: 04.08 - [33mopts[39m - opts.extractedLogContentsWereGiven
        ok 1 - 04.08
        1..1
    ok 29 - 04.08 - [33mopts[39m - opts.extractedLogContentsWereGiven # time=0.461ms
    
    # Subtest: 04.09 - [33mopts[39m - opts.extractedLogContentsWereGiven
        ok 1 - 04.09
        1..1
    ok 30 - 04.09 - [33mopts[39m - opts.extractedLogContentsWereGiven # time=0.379ms
    
    # Subtest: 04.10 - [33mopts[39m - opts.extractedLogContentsWereGiven
        ok 1 - 04.10
        1..1
    ok 31 - 04.10 - [33mopts[39m - opts.extractedLogContentsWereGiven # time=0.435ms
    
    # Subtest: 05.01 - [35mad-hoc[39m - text that uses \r only as EOL characters
        ok 1 - 05.01.01
        ok 2 - 05.01.02
        ok 3 - 05.01.03
        1..3
    ok 32 - 05.01 - [35mad-hoc[39m - text that uses \r only as EOL characters # time=1.186ms
    
    # Subtest: 05.02 - [35mad-hoc[39m - broken ANSI - will not update
        ok 1 - 05.02 - ANSI opening sequence's m is missing
        1..1
    ok 33 - 05.02 - [35mad-hoc[39m - broken ANSI - will not update # time=0.489ms
    
    # Subtest: 05.03 - [35mad-hoc[39m - no quotes - no text
        ok 1 - 05.03
        1..1
    ok 34 - 05.03 - [35mad-hoc[39m - no quotes - no text # time=0.495ms
    
    # Subtest: 05.04 - [35mad-hoc[39m - no quotes - no text
        ok 1 - 05.04
        1..1
    ok 35 - 05.04 - [35mad-hoc[39m - no quotes - no text # time=2.053ms
    
    # Subtest: 05.05 - [35mad-hoc[39m - no quotes - with text
        ok 1 - 05.05
        1..1
    ok 36 - 05.05 - [35mad-hoc[39m - no quotes - with text # time=0.472ms
    
    # Subtest: 05.06 - [35mad-hoc[39m - no quotes - with text
        ok 1 - 05.06
        1..1
    ok 37 - 05.06 - [35mad-hoc[39m - no quotes - with text # time=0.917ms
    
    # Subtest: 05.07 - [35mad-hoc[39m - with quotes - no text
        ok 1 - 05.07
        1..1
    ok 38 - 05.07 - [35mad-hoc[39m - with quotes - no text # time=0.473ms
    
    # Subtest: 05.08 - [35mad-hoc[39m - with quotes - no text, override rownum is number
        ok 1 - 05.08
        1..1
    ok 39 - 05.08 - [35mad-hoc[39m - with quotes - no text, override rownum is number # time=0.593ms
    
    # Subtest: 05.09 - [35mad-hoc[39m - with quotes - no text, override rownum is text
        ok 1 - 05.09
        1..1
    ok 40 - 05.09 - [35mad-hoc[39m - with quotes - no text, override rownum is text # time=0.552ms
    
    # Subtest: 05.10 - [35mad-hoc[39m - with quotes - with text
        ok 1 - 05.10
        1..1
    ok 41 - 05.10 - [35mad-hoc[39m - with quotes - with text # time=0.492ms
    
    # Subtest: 05.11 - [35mad-hoc[39m - with quotes - with text
        ok 1 - 05.11
        1..1
    ok 42 - 05.11 - [35mad-hoc[39m - with quotes - with text # time=0.725ms
    
    # Subtest: 05.12 - [35mad-hoc[39m - with backticks - no text
        ok 1 - 05.12
        1..1
    ok 43 - 05.12 - [35mad-hoc[39m - with backticks - no text # time=0.458ms
    
    # Subtest: 05.13 - [35mad-hoc[39m - with backticks - no text, override rownum is number
        ok 1 - 05.13
        1..1
    ok 44 - 05.13 - [35mad-hoc[39m - with backticks - no text, override rownum is number # time=0.741ms
    
    # Subtest: 05.14 - [35mad-hoc[39m - only number, with surrounding whitespace
        ok 1 - 05.14
        1..1
    ok 45 - 05.14 - [35mad-hoc[39m - only number, with surrounding whitespace # time=0.585ms
    
    # Subtest: 05.15 - [35mad-hoc[39m - insurance 1
        ok 1 - 05.15
        1..1
    ok 46 - 05.15 - [35mad-hoc[39m - insurance 1 # time=0.394ms
    
    # Subtest: 05.16 - [35mad-hoc[39m - insurance 2
        ok 1 - 05.16
        1..1
    ok 47 - 05.16 - [35mad-hoc[39m - insurance 2 # time=0.686ms
    
    # Subtest: 06.01 - [34mopts.triggerKeywords[39m - baseline
        ok 1 - should be equal
        1..1
    ok 48 - 06.01 - [34mopts.triggerKeywords[39m - baseline # time=0.437ms
    
    # Subtest: 06.02 - [34mopts.triggerKeywords[39m - works on custom function
        ok 1 - should be equal
        1..1
    ok 49 - 06.02 - [34mopts.triggerKeywords[39m - works on custom function # time=0.627ms
    
    # Subtest: 06.03 - [34mopts.triggerKeywords[39m - non-existing log function
        ok 1 - should be equal
        ok 2 - should be equal
        ok 3 - should be equal
        ok 4 - should be equal
        1..4
    ok 50 - 06.03 - [34mopts.triggerKeywords[39m - non-existing log function # time=0.988ms
    
    1..50
    # time=376.114ms
}

1..1
# time=1122.179ms
