TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - throws when there's no input
        ok 1 - expected to throw
        1..1
    ok 1 - 01.01 - throws when there's no input # time=8.901ms
    
    # Subtest: 01.02 - throws when the first argument is not string
        ok 1 - expected to throw
        1..1
    ok 2 - 01.02 - throws when the first argument is not string # time=2.841ms
    
    # Subtest: 01.03 - throws when the second argument is not string
        ok 1 - expected to throw
        1..1
    ok 3 - 01.03 - throws when the second argument is not string # time=23.792ms
    
    # Subtest: 01.04 - throws when the third argument is not natural number
        ok 1 - expected to throw
        ok 2 - expected to not throw
        ok 3 - expected to not throw
        1..3
    ok 4 - 01.04 - throws when the third argument is not natural number # time=27.171ms
    
    # Subtest: 02.01 - finds one char
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        ok 5 - 02.01.05
        ok 6 - 02.01.06
        ok 7 - 02.01.07
        ok 8 - 02.01.08
        1..8
    ok 5 - 02.01 - finds one char # time=9.833ms
    
    # Subtest: 02.02 - finds one emoji
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        ok 5 - 02.02.05
        ok 6 - 02.02.06
        1..6
    ok 6 - 02.02 - finds one emoji # time=5.737ms
    
    # Subtest: 02.03 - does not find a char or emoji
        ok 1 - 02.03.01
        ok 2 - 02.03.02
        ok 3 - 02.03.03
        ok 4 - 02.03.04
        ok 5 - 02.03.05
        1..5
    ok 7 - 02.03 - does not find a char or emoji # time=3.988ms
    
    # Subtest: 02.04 - finds multiple consecutive
        ok 1 - 02.04.01
        ok 2 - 02.04.02
        1..2
    ok 8 - 02.04 - finds multiple consecutive # time=2.316ms
    
    # Subtest: 02.05 - finds multiple with space in between, first char hit
        ok 1 - 02.05.01
        ok 2 - 02.05.02
        1..2
    ok 9 - 02.05 - finds multiple with space in between, first char hit # time=2.291ms
    
    # Subtest: 02.06 - finds multiple with space in between, first char is not hit
        ok 1 - 02.06.01
        ok 2 - 02.06.02
        ok 3 - 02.06.03
        ok 4 - 02.06.04
        1..4
    ok 10 - 02.06 - finds multiple with space in between, first char is not hit # time=3.496ms
    
    # Subtest: 03.01 - finds multiple consecutive, text, offset
        ok 1 - 03.01.01
        ok 2 - 03.01.02
        ok 3 - 03.01.03
        ok 4 - 03.01.04
        ok 5 - 03.01.05
        ok 6 - 03.01.06
        1..6
    ok 11 - 03.01 - finds multiple consecutive, text, offset # time=4.473ms
    
    # Subtest: 03.02 - finds multiple consecutive, emoji, offset
        ok 1 - 03.02.01
        ok 2 - 03.02.02
        ok 3 - 03.02.03
        ok 4 - 03.02.04
        ok 5 - 03.02.05
        ok 6 - 03.02.06
        1..6
    ok 12 - 03.02 - finds multiple consecutive, emoji, offset # time=5.059ms
    
    # Subtest: 03.03 - finds multiple with space in between, first char hit, offset
        ok 1 - 03.03.01
        ok 2 - 03.03.02
        ok 3 - 03.03.03
        ok 4 - 03.03.04
        ok 5 - 03.03.05
        ok 6 - 03.03.06
        ok 7 - 03.03.07
        ok 8 - 03.03.08
        1..8
    ok 13 - 03.03 - finds multiple with space in between, first char hit, offset # time=5.512ms
    
    # Subtest: 03.04 - finds multiple with space in between, first char is not hit, offset
        ok 1 - 03.04.01
        ok 2 - 03.04.02
        ok 3 - 03.04.03
        ok 4 - 03.04.04
        ok 5 - 03.04.05
        ok 6 - 03.04.06
        ok 7 - 03.04.07
        ok 8 - 03.04.08
        ok 9 - 03.04.09
        1..9
    ok 14 - 03.04 - finds multiple with space in between, first char is not hit, offset # time=6.121ms
    
    # Subtest: 04.01 - finds in real text, no offset
        ok 1 - 04.01
        ok 2 - should be equivalent
        ok 3 - should be equivalent
        ok 4 - should be equivalent
        ok 5 - should be equivalent
        ok 6 - should be equivalent
        1..6
    ok 15 - 04.01 - finds in real text, no offset # time=4.264ms
    
    1..15
    # time=251.388ms
ok 1 - test/test.js # time=251.388ms

1..1
# time=2538.87ms
