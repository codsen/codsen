TAP version 13
# Subtest: test/test.js
    # Subtest: 00.01 - throws on Boolean input
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        1..3
    ok 1 - 00.01 - throws on Boolean input # time=34.178ms
    
    # Subtest: 00.02 - throws on missing input
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        1..3
    ok 2 - 00.02 - throws on missing input # time=3.428ms
    
    # Subtest: 00.03 - throws on null input
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        1..3
    ok 3 - 00.03 - throws on null input # time=2.785ms
    
    # Subtest: 00.03 - throws on string input
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        1..3
    ok 4 - 00.03 - throws on string input # time=2.545ms
    
    # Subtest: 00.04 - throws on empty plain object
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        1..3
    ok 5 - 00.04 - throws on empty plain object # time=2.604ms
    
    # Subtest: 00.05 - throws when "from" is not a number
        ok 1 - expected to throw
        ok 2 - expect truthy value
        1..2
    ok 6 - 00.05 - throws when "from" is not a number # time=2.253ms
    
    # Subtest: 00.06 - throws when "to" is not a number
        ok 1 - expected to throw
        ok 2 - expect truthy value
        1..2
    ok 7 - 00.06 - throws when "to" is not a number # time=1.025ms
    
    # Subtest: 00.07 - throws when "from" is outside the str boundaries
        ok 1 - expected to throw
        ok 2 - expect truthy value
        1..2
    ok 8 - 00.07 - throws when "from" is outside the str boundaries # time=0.982ms
    
    # Subtest: 00.08 - throws when "to" is way outside the str boundaries
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to not throw
        1..3
    ok 9 - 00.08 - throws when "to" is way outside the str boundaries # time=3.28ms
    
    # Subtest: 00.09 - throws when opts.extendToOneSide is unrecognised
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 10 - 00.09 - throws when opts.extendToOneSide is unrecognised # time=3.063ms
    
    # Subtest: 01.01 - nothing to expand
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        ok 4 - 01.01.04 - addSingleSpaceToPreventAccidentalConcatenation default
        ok 5 - 01.01.05 - addSingleSpaceToPreventAccidentalConcatenation hardcoded default
        ok 6 - 01.01.06
        ok 7 - 01.01.07
        ok 8 - 01.01.08
        ok 9 - 01.01.09 - does not add space if touching EOL
        ok 10 - 01.01.10
        ok 11 - 01.01.11
        ok 12 - 01.01.12
        ok 13 - 01.01.13
        ok 14 - 01.01.14
        ok 15 - 01.01.15
        ok 16 - 01.01.16
        ok 17 - 01.01.17 - hardcoded addSingleSpaceToPreventAccidentalConcatenation default
        ok 18 - 01.01.18 - combo, no whitespace
        1..18
    ok 11 - 01.01 - nothing to expand # time=14.784ms
    
    # Subtest: 01.02 - expanding from the middle of a gap
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
        ok 11 - 01.02.11
        ok 12 - 01.02.12
        ok 13 - 01.02.13
        1..13
    ok 12 - 01.02 - expanding from the middle of a gap # time=9.596ms
    
    # Subtest: 01.03 - starting point is touching the edge (non-whitespace) even though tight cropping is not enabled
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        ok 4 - 01.03.04
        1..4
    ok 13 - 01.03 - starting point is touching the edge (non-whitespace) even though tight cropping is not enabled # time=3.499ms
    
    # Subtest: 01.04 - both ends are equal
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        1..2
    ok 14 - 01.04 - both ends are equal # time=2.302ms
    
    # Subtest: 01.05 - addSingleSpaceToPreventAccidentalConcatenation
        ok 1 - 01.05.01
        ok 2 - 01.05.02 - wipeAllWhitespaceOnLeft hardcoded default
        ok 3 - 01.05.03 - wipeAllWhitespaceOnLeft on
        ok 4 - 01.05.04
        ok 5 - 01.05.05 - combo, no whitespace
        ok 6 - 01.05.06 - true-true
        ok 7 - 01.05.07 - true-false
        ok 8 - 01.05.08 - false-true
        ok 9 - 01.05.09 - false-false
        1..9
    ok 15 - 01.05 - addSingleSpaceToPreventAccidentalConcatenation # time=6.363ms
    
    # Subtest: 01.06 - wipeAllWhitespaceOnLeft + addSingleSpaceToPreventAccidentalConcatenation
        ok 1 - 01.06.01
        ok 2 - 01.06.02
        ok 3 - 01.06.03
        ok 4 - 01.06.04
        1..4
    ok 16 - 01.06 - wipeAllWhitespaceOnLeft + addSingleSpaceToPreventAccidentalConcatenation # time=4.021ms
    
    # Subtest: 01.07 - wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation
        ok 1 - 01.07.01
        ok 2 - 01.07.02
        ok 3 - 01.07.03
        ok 4 - 01.07.04
        1..4
    ok 17 - 01.07 - wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation # time=3.598ms
    
    # Subtest: 01.08 - wipeAllWhitespaceOnLeft + wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation
        ok 1 - 01.08.01
        ok 2 - 01.08.02
        ok 3 - 01.08.03
        ok 4 - 01.08.04
        ok 5 - 01.08.05
        1..5
    ok 18 - 01.08 - wipeAllWhitespaceOnLeft + wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation # time=8.569ms
    
    # Subtest: 01.09 - addSingleSpaceToPreventAccidentalConcatenation ignored
        ok 1 - 01.09.01 - baseline
        ok 2 - 01.09.02.01 - non digits and non letters
        ok 3 - 01.09.02.02 - letters
        ok 4 - 01.09.02.03 - letter on one side
        ok 5 - 01.09.03
        ok 6 - 01.09.04
        ok 7 - 01.09.05
        ok 8 - 01.09.06
        ok 9 - 01.09.07
        ok 10 - 01.09.08
        ok 11 - 01.09.09
        1..11
    ok 19 - 01.09 - addSingleSpaceToPreventAccidentalConcatenation ignored # time=15.84ms
    
    # Subtest: 02.01 - [33mopts.ifLeftSideIncludesThisThenCropTightly[39m - normal use, both sides extended
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        1..4
    ok 20 - 02.01 - [33mopts.ifLeftSideIncludesThisThenCropTightly[39m - normal use, both sides extended # time=8ms
    
    # Subtest: 02.02 - [33mopts.ifLeftSideIncludesThisThenCropTightly[39m - normal use, mismatching value
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        ok 5 - 02.02.05
        ok 6 - 02.02.06
        1..6
    ok 21 - 02.02 - [33mopts.ifLeftSideIncludesThisThenCropTightly[39m - normal use, mismatching value # time=5.097ms
    
    # Subtest: 02.03 - [33mopts.ifLeftSideIncludesThisThenCropTightly[39m - range within characters, no whitespace
        ok 1 - 02.03.01
        ok 2 - 02.03.02
        ok 3 - 02.03.03
        1..3
    ok 22 - 02.03 - [33mopts.ifLeftSideIncludesThisThenCropTightly[39m - range within characters, no whitespace # time=2.771ms
    
    # Subtest: 03.01 - [33mopts.ifRightSideIncludesThisThenCropTightly[39m - normal use, both sides extended
        ok 1 - 03.01.01
        ok 2 - 03.01.02
        ok 3 - 03.01.03
        ok 4 - 03.01.04
        1..4
    ok 23 - 03.01 - [33mopts.ifRightSideIncludesThisThenCropTightly[39m - normal use, both sides extended # time=4.855ms
    
    # Subtest: 03.02 - [33mopts.ifRightSideIncludesThisThenCropTightly[39m - normal use, mismatching value
        ok 1 - 03.02.01
        ok 2 - 03.02.02
        ok 3 - 03.02.03
        ok 4 - 03.02.04
        ok 5 - 03.02.05
        ok 6 - 03.02.06
        1..6
    ok 24 - 03.02 - [33mopts.ifRightSideIncludesThisThenCropTightly[39m - normal use, mismatching value # time=4.185ms
    
    # Subtest: 03.03 - [33mopts.ifRightSideIncludesThisThenCropTightly[39m - range within characters, no whitespace
        ok 1 - 03.03.01
        ok 2 - 03.03.02
        ok 3 - 03.03.03
        1..3
    ok 25 - 03.03 - [33mopts.ifRightSideIncludesThisThenCropTightly[39m - range within characters, no whitespace # time=2.653ms
    
    # Subtest: 04.01 - [33mopts.ifLeftSideIncludesThisCropItToo[39m - combo with tight crop
        ok 1 - 04.01.01 - control #1
        ok 2 - 04.01.02 - control #2
        ok 3 - 04.01.03
        ok 4 - 04.01.04
        ok 5 - 04.01.05
        ok 6 - 04.01.06
        1..6
    ok 26 - 04.01 - [33mopts.ifLeftSideIncludesThisCropItToo[39m - combo with tight crop # time=4.449ms
    
    # Subtest: 05.01 - [33mopts.extendToOneSide[39m - one side only
        ok 1 - 05.01.01 - default, a control
        ok 2 - 05.01.02 - hardcoded default
        ok 3 - 05.01.03 - right only
        ok 4 - 05.01.04 - left only
        1..4
    ok 27 - 05.01 - [33mopts.extendToOneSide[39m - one side only # time=4.576ms
    
    # Subtest: 06.01 - [33mopts.wipeAllWhitespaceOnLeft[39m - extends to both sides
        ok 1 - 06.01.01 - a control
        ok 2 - 06.01.02 - left
        ok 3 - 06.01.03 - right
        ok 4 - 06.01.04 - both
        1..4
    ok 28 - 06.01 - [33mopts.wipeAllWhitespaceOnLeft[39m - extends to both sides # time=6.521ms
    
    # Subtest: 07.01 - [36mvarious[39m - adhoc #1
        ok 1 - 07.01
        1..1
    ok 29 - 07.01 - [36mvarious[39m - adhoc #1 # time=1.745ms
    
    # Subtest: 07.02 - [36mvarious[39m - adhoc #2
        ok 1 - 07.02
        1..1
    ok 30 - 07.02 - [36mvarious[39m - adhoc #2 # time=1.623ms
    
    # Subtest: 07.03 - [36mvarious[39m - adhoc #3
        ok 1 - 07.03
        1..1
    ok 31 - 07.03 - [36mvarious[39m - adhoc #3 # time=2.127ms
    
    1..31
    # time=380.327ms
ok 1 - test/test.js # time=380.327ms

1..1
# time=2923.232ms
