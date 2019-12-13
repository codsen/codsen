TAP version 13
ok 1 - test/api-test.js # time=10.461ms {
    ok 1 - 00.01 - 1st arg missing
    ok 2 - 00.02 - 1nd arg of a wrong type
    ok 3 - 00.03 - 2nd arg (tagCb()) wrong
    ok 4 - 00.04 - 3rd arg (charCb()) wrong
    ok 5 - 00.05 - 4th arg (opts) is wrong
    ok 6 - 00.06 - opts.reportProgressFunc is wrong
    1..6
    # time=10.461ms
}

ok 2 - test/brokenhtml-test.js # time=66.342ms {
    # Subtest
        ok 1 - 01.01 - [33mtag-space-after-opening-bracket[39m - 1
        1..1
    ok 1 # time=20.279ms
    
    # Subtest
        ok 1 - 02.01 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 2 # time=3.374ms
    
    # Subtest
        ok 1 - 02.02 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 3 # time=2.472ms
    
    # Subtest
        ok 1 - 02.03 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 4 # time=3.432ms
    
    1..4
    # time=66.342ms
}

ok 3 - test/char-test.js # time=26.866ms {
    # Subtest
        ok 1 - 01.01 - tag and text
        1..1
    ok 1 # time=19.103ms
    
    1..1
    # time=26.866ms
}

ok 4 - test/css-test.js # time=51.87ms {
    # Subtest
        ok 1 - 01.01 - CSS in the head
        1..1
    ok 1 # time=28.114ms
    
    # Subtest
        ok 1 - 01.02 - CSS, no whitespace inside
        1..1
    ok 2 # time=4.874ms
    
    1..2
    # time=51.87ms
}

ok 5 - test/esp-test.js # time=167.241ms {
    # Subtest
        ok 1 - 01.01 - ESP literals among text get reported
        1..1
    ok 1 # time=19.288ms
    
    # Subtest
        ok 1 - 01.02 - ESP literals among text get reported
        1..1
    ok 2 # time=3.664ms
    
    # Subtest
        ok 1 - 01.03 - ESP literals surrounded by HTML tags
        1..1
    ok 3 # time=6.819ms
    
    # Subtest
        ok 1 - 01.04
        1..1
    ok 4 # time=3.863ms
    
    # Subtest
        ok 1 - 01.05 - ESP literals surrounded by HTML tags, tight
        1..1
    ok 5 # time=8.406ms
    
    # Subtest
        ok 1 - 01.06
        1..1
    ok 6 # time=3.44ms
    
    # Subtest
        ok 1 - 01.07
        1..1
    ok 7 # time=3.63ms
    
    # Subtest
        ok 1 - 01.08
        1..1
    ok 8 # time=3.83ms
    
    # Subtest
        ok 1 - 01.09 - Responsys-style ESP tag
        1..1
    ok 9 # time=2.928ms
    
    # Subtest
        ok 1 - 01.10 - two nunjucks tags, same pattern set of two, tight
        1..1
    ok 10 # time=2.052ms
    
    # Subtest
        ok 1 - 01.11 - two nunjucks tags, different pattern set of two, tight
        1..1
    ok 11 # time=2.538ms
    
    # Subtest
        ok 1 - 01.12 - different set, *|zzz|*
        1..1
    ok 12 # time=1.804ms
    
    # Subtest
        ok 1 - 01.13 - error, two ESP tags joined, first one ends with heads instead of tails
        1..1
    ok 13 # time=1.709ms
    
    1..13
    # time=167.241ms
}

ok 6 - test/html-attributes-test.js # time=159.411ms {
    # Subtest
        ok 1 - 01.01 - [36mbasic[39m - single- and double-quoted attr
        1..1
    ok 1 # time=22.333ms
    
    # Subtest
        ok 1 - 01.02 - [36mbasic[39m - value-less attribute
        1..1
    ok 2 # time=4.23ms
    
    # Subtest
        ok 1 - 01.03 - [36mbasic[39m - a closing tag
        1..1
    ok 3 # time=2.692ms
    
    # Subtest
        ok 1 - 01.04 - [36mbasic[39m - a closing tag
        1..1
    ok 4 # time=2.254ms
    
    # Subtest
        ok 1 - 02.01 - [36mbroken[39m - no equals but quotes present
        1..1
    ok 5 # time=4.026ms
    
    # Subtest
        ok 1 - 02.03 - [36mbroken[39m - two equals
        1..1
    ok 6 # time=3.654ms
    
    # Subtest
        ok 1 - 03.01
        1..1
    ok 7 # time=3.6ms
    
    # Subtest
        ok 1 - 03.02
        1..1
    ok 8 # time=3.409ms
    
    # Subtest
        ok 1 - 03.03
        1..1
    ok 9 # time=2.308ms
    
    # "" has `only` set but all tests run
    # Subtest
        ok 1 - 03.04
        1..1
    ok 10 # time=4.509ms
    
    1..10
    # time=159.411ms
}

ok 7 - test/html-test.js # time=364.977ms {
    # Subtest
        ok 1 - 01.01 - text-tag-text
        1..1
    ok 1 # time=20.357ms
    
    # Subtest
        ok 1 - 01.02 - text only
        1..1
    ok 2 # time=2.813ms
    
    # Subtest
        ok 1 - 01.03 - opening tag only
        1..1
    ok 3 # time=3.341ms
    
    # Subtest
        ok 1 - 01.04 - closing tag only
        1..1
    ok 4 # time=2.552ms
    
    # Subtest
        ok 1 - 01.05 - self-closing tag only
        1..1
    ok 5 # time=2.45ms
    
    # Subtest
        ok 1 - 01.06 - multiple tags
        1..1
    ok 6 # time=3.553ms
    
    # Subtest
        ok 1 - 01.07 - closing bracket in the attribute's value
        1..1
    ok 7 # time=2.689ms
    
    # Subtest
        ok 1 - 01.08 - closing bracket layers of nested quotes
        1..1
    ok 8 # time=3.163ms
    
    # Subtest
        ok 1 - 01.09 - bracket as text
        1..1
    ok 9 # time=2.603ms
    
    # Subtest
        ok 1 - 01.10 - tag followed by brackets
        1..1
    ok 10 # time=5.272ms
    
    # Subtest
        ok 1 - 01.11 - html comment
        1..1
    ok 11 # time=5.563ms
    
    # Subtest
        ok 1 - 01.12 - html5 doctype
        1..1
    ok 12 # time=2.446ms
    
    # Subtest
        ok 1 - 01.13 - xhtml doctype
        1..1
    ok 13 # time=7.874ms
    
    # Subtest
        ok 1 - 01.14 - xhtml DTD doctype
        1..1
    ok 14 # time=11.192ms
    
    # Subtest
        ok 1 - 01.15 - void tags
        1..1
    ok 15 # time=1.851ms
    
    # Subtest
        ok 1 - 01.16 - recognised tags
        1..1
    ok 16 # time=1.571ms
    
    # Subtest
        ok 1 - 01.17 - unrecognised tags
        1..1
    ok 17 # time=1.943ms
    
    # Subtest
        ok 1 - 01.18 - wrong case but still recognised tags
        1..1
    ok 18 # time=1.907ms
    
    # Subtest
        ok 1 - 01.19 - correct HTML5 doctype
        1..1
    ok 19 # time=10.303ms
    
    # Subtest
        ok 1 - 01.20 - correct HTML5 doctype
        1..1
    ok 20 # time=3.159ms
    
    # Subtest
        ok 1 - 01.21 - tag names with numbers
        1..1
    ok 21 # time=2.028ms
    
    # Subtest
        ok 1 - 02.01 - CDATA - correct
        1..1
    ok 22 # time=5.078ms
    
    # Subtest
        ok 1 - 02.02 - CDATA - messed up 1
        1..1
    ok 23 # time=3.142ms
    
    # Subtest
        ok 1 - 02.03 - CDATA - messed up 2
        1..1
    ok 24 # time=3.399ms
    
    # Subtest
        ok 1 - 02.04 - CDATA - messed up 3
        1..1
    ok 25 # time=3.097ms
    
    # Subtest
        ok 1 - 03.01 - XML - correct
        1..1
    ok 26 # time=5.168ms
    
    # Subtest
        ok 1 - 03.02 - XML - incorrect 1
        1..1
    ok 27 # time=2.748ms
    
    # Subtest
        ok 1 - 03.02 - XML - incorrect 2
        1..1
    ok 28 # time=2.696ms
    
    # Subtest
        ok 1 - 03.03 - XML - incorrect 3
        1..1
    ok 29 # time=6.631ms
    
    1..29
    # time=364.977ms
}

ok 8 - test/umd-test.js # time=23.558ms {
    # Subtest: UMD build works fine
        ok 1 - expect truthy value
        1..1
    ok 1 - UMD build works fine # time=15.618ms
    
    1..1
    # time=23.558ms
}

ok 9 - test/reportProgressFunc-test.js # time=135.936ms {
    # Subtest
        ok 1 - 01.01 - [36mopts.reportProgressFunc[39m - null
        1..1
    ok 1 # time=13.503ms
    
    # Subtest
        ok 1 - 01.02 - [36mopts.reportProgressFunc[39m - false
        1..1
    ok 2 # time=1.776ms
    
    # Subtest
        ok 1 - 01.03 - [36mopts.reportProgressFunc[39m - short length reports only at 50%
        1..1
    ok 3 # time=5.983ms
    
    # Subtest
        ok 1 - (unnamed test)
        ok 2 - 01.04 - [36mopts.reportProgressFunc[39m - longer length reports at 0-100%
        1..2
    ok 4 # time=17.486ms
    
    # Subtest
        ok 1 - 01.05 - [36mopts.reportProgressFunc[39m - custom reporting range, short input
        1..1
    ok 5 # time=13.894ms
    
    # Subtest
        ok 1 - (unnamed test)
        ok 2 - 21
        ok 3 - 22
        ok 4 - 23
        ok 5 - 24
        ok 6 - 25
        ok 7 - 26
        ok 8 - 27
        ok 9 - 28
        ok 10 - 29
        ok 11 - 30
        ok 12 - 31
        ok 13 - 32
        ok 14 - 33
        ok 15 - 34
        ok 16 - 35
        ok 17 - 36
        ok 18 - 37
        ok 19 - 38
        ok 20 - 39
        ok 21 - 40
        ok 22 - 41
        ok 23 - 42
        ok 24 - 43
        ok 25 - 44
        ok 26 - 45
        ok 27 - 46
        ok 28 - 47
        ok 29 - 48
        ok 30 - 49
        ok 31 - 50
        ok 32 - 51
        ok 33 - 52
        ok 34 - 53
        ok 35 - 54
        ok 36 - 55
        ok 37 - 56
        ok 38 - 57
        ok 39 - 58
        ok 40 - 59
        ok 41 - 60
        ok 42 - 61
        ok 43 - 62
        ok 44 - 63
        ok 45 - 64
        ok 46 - 65
        ok 47 - 66
        ok 48 - 67
        ok 49 - 68
        ok 50 - 69
        ok 51 - 70
        ok 52 - 71
        ok 53 - 72
        ok 54 - 73
        ok 55 - 74
        ok 56 - 75
        ok 57 - 76
        ok 58 - 77
        ok 59 - 78
        ok 60 - 79
        ok 61 - 80
        ok 62 - 81
        ok 63 - 82
        ok 64 - 83
        ok 65 - 84
        ok 66 - 85
        ok 67 - should be equal
        ok 68 - 01.06 - [36mopts.reportProgressFunc[39m - custom reporting range, longer input
        1..68
    ok 6 # time=49.094ms
    
    1..6
    # time=135.936ms
}

1..9
# time=3702.414ms
