TAP version 13
ok 1 - test/api-test.js # time=33.415ms {
    ok 1 - 00.01 - 1st arg missing
    ok 2 - 00.02 - 1nd arg of a wrong type
    ok 3 - 00.03 - 2nd arg (tagCb()) wrong
    ok 4 - 00.04 - 3rd arg (charCb()) wrong
    ok 5 - 00.05 - 4th arg (opts) is wrong
    ok 6 - 00.06 - opts.reportProgressFunc is wrong
    1..6
    # time=33.415ms
}

ok 2 - test/brokenhtml-test.js # time=34.733ms {
    # Subtest
        ok 1 - 01.01 - [33mtag-space-after-opening-bracket[39m - 1
        1..1
    ok 1 # time=12.379ms
    
    # Subtest
        ok 1 - 02.01 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 2 # time=1.666ms
    
    # Subtest
        ok 1 - 02.02 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 3 # time=1.401ms
    
    # Subtest
        ok 1 - 02.03 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 4 # time=1.16ms
    
    1..4
    # time=34.733ms
}

ok 3 - test/esp-test.js # time=86.359ms {
    # Subtest
        ok 1 - 01.01 - ESP literals among text get reported
        1..1
    ok 1 # time=9.598ms
    
    # Subtest
        ok 1 - 01.02 - ESP literals among text get reported
        1..1
    ok 2 # time=1.833ms
    
    # Subtest
        ok 1 - 01.03 - ESP literals surrounded by HTML tags
        1..1
    ok 3 # time=3.254ms
    
    # Subtest
        ok 1 - 01.04
        1..1
    ok 4 # time=2.17ms
    
    # Subtest
        ok 1 - 01.05 - ESP literals surrounded by HTML tags, tight
        1..1
    ok 5 # time=1.73ms
    
    # Subtest
        ok 1 - 01.06
        1..1
    ok 6 # time=1.464ms
    
    # Subtest
        ok 1 - 01.07
        1..1
    ok 7 # time=1.524ms
    
    # Subtest
        ok 1 - 01.08
        1..1
    ok 8 # time=2.554ms
    
    # Subtest
        ok 1 - 01.09 - Responsys-style ESP tag
        1..1
    ok 9 # time=1.297ms
    
    # Subtest
        ok 1 - 01.10 - two nunjucks tags, same pattern set of two, tight
        1..1
    ok 10 # time=0.973ms
    
    # Subtest
        ok 1 - 01.11 - two nunjucks tags, different pattern set of two, tight
        1..1
    ok 11 # time=1.422ms
    
    # Subtest
        ok 1 - 01.12 - different set, *|zzz|*
        1..1
    ok 12 # time=0.939ms
    
    # Subtest
        ok 1 - 01.13 - error, two ESP tags joined, first one ends with heads instead of tails
        1..1
    ok 13 # time=0.92ms
    
    1..13
    # time=86.359ms
}

ok 4 - test/html-attributes-test.js # time=68.17ms {
    # Subtest
        ok 1 - 01.01 - [36mbasic[39m - single- and double-quoted attr
        1..1
    ok 1 # time=10.603ms
    
    # Subtest
        ok 1 - 01.02 - [36mbasic[39m - value-less attribute
        1..1
    ok 2 # time=2.765ms
    
    # Subtest
        ok 1 - 01.03 - [36mbasic[39m - a closing tag
        1..1
    ok 3 # time=1.347ms
    
    # Subtest
        ok 1 - 01.04 - [36mbasic[39m - a closing tag
        1..1
    ok 4 # time=1.479ms
    
    # Subtest
        ok 1 - 02.01 - [36mbroken[39m - no equals but quotes present
        1..1
    ok 5 # time=1.919ms
    
    # Subtest
        ok 1 - 02.03 - [36mbroken[39m - two equals
        1..1
    ok 6 # time=1.534ms
    
    # Subtest
        ok 1 - 03.01
        1..1
    ok 7 # time=1.822ms
    
    # Subtest
        ok 1 - 03.02
        1..1
    ok 8 # time=1.705ms
    
    # Subtest
        ok 1 - 03.03
        1..1
    ok 9 # time=1.651ms
    
    # "" has `only` set but all tests run
    # Subtest
        ok 1 - 03.04
        1..1
    ok 10 # time=2.519ms
    
    1..10
    # time=68.17ms
}

ok 5 - test/html-test.js # time=205.602ms {
    # Subtest
        ok 1 - 01.01 - text-tag-text
        1..1
    ok 1 # time=10.324ms
    
    # Subtest
        ok 1 - 01.02 - text only
        1..1
    ok 2 # time=1.564ms
    
    # Subtest
        ok 1 - 01.03 - opening tag only
        1..1
    ok 3 # time=1.382ms
    
    # Subtest
        ok 1 - 01.04 - closing tag only
        1..1
    ok 4 # time=1.178ms
    
    # Subtest
        ok 1 - 01.05 - self-closing tag only
        1..1
    ok 5 # time=1.39ms
    
    # Subtest
        ok 1 - 01.06 - multiple tags
        1..1
    ok 6 # time=1.652ms
    
    # Subtest
        ok 1 - 01.07 - closing bracket in the attribute's value
        1..1
    ok 7 # time=1.431ms
    
    # Subtest
        ok 1 - 01.08 - closing bracket layers of nested quotes
        1..1
    ok 8 # time=1.285ms
    
    # Subtest
        ok 1 - 01.09 - bracket as text
        1..1
    ok 9 # time=2.496ms
    
    # Subtest
        ok 1 - 01.10 - tag followed by brackets
        1..1
    ok 10 # time=4.529ms
    
    # Subtest
        ok 1 - 01.11 - html comment
        1..1
    ok 11 # time=2.477ms
    
    # Subtest
        ok 1 - 01.12 - html5 doctype
        1..1
    ok 12 # time=1.548ms
    
    # Subtest
        ok 1 - 01.13 - xhtml doctype
        1..1
    ok 13 # time=3.32ms
    
    # Subtest
        ok 1 - 01.14 - xhtml DTD doctype
        1..1
    ok 14 # time=4.667ms
    
    # Subtest
        ok 1 - 01.15 - void tags
        1..1
    ok 15 # time=0.789ms
    
    # Subtest
        ok 1 - 01.16 - recognised tags
        1..1
    ok 16 # time=0.815ms
    
    # Subtest
        ok 1 - 01.17 - unrecognised tags
        1..1
    ok 17 # time=0.792ms
    
    # Subtest
        ok 1 - 01.18 - wrong case but still recognised tags
        1..1
    ok 18 # time=0.847ms
    
    # Subtest
        ok 1 - 01.19 - correct HTML5 doctype
        1..1
    ok 19 # time=2.266ms
    
    # Subtest
        ok 1 - 01.20 - correct HTML5 doctype
        1..1
    ok 20 # time=1.896ms
    
    # Subtest
        ok 1 - 01.21 - tag names with numbers
        1..1
    ok 21 # time=1.027ms
    
    # Subtest
        ok 1 - 02.01 - CDATA - correct
        1..1
    ok 22 # time=2.265ms
    
    # Subtest
        ok 1 - 02.02 - CDATA - messed up 1
        1..1
    ok 23 # time=1.328ms
    
    # Subtest
        ok 1 - 02.03 - CDATA - messed up 2
        1..1
    ok 24 # time=2.082ms
    
    # Subtest
        ok 1 - 02.04 - CDATA - messed up 3
        1..1
    ok 25 # time=1.427ms
    
    # Subtest
        ok 1 - 03.01 - XML - correct
        1..1
    ok 26 # time=2.048ms
    
    # Subtest
        ok 1 - 03.02 - XML - incorrect 1
        1..1
    ok 27 # time=1.492ms
    
    # Subtest
        ok 1 - 03.02 - XML - incorrect 2
        1..1
    ok 28 # time=1.251ms
    
    # Subtest
        ok 1 - 03.03 - XML - incorrect 3
        1..1
    ok 29 # time=2.918ms
    
    1..29
    # time=205.602ms
}

ok 6 - test/char-test.js # time=12.409ms {
    # Subtest
        ok 1 - 01.01 - tag and text
        1..1
    ok 1 # time=8.673ms
    
    1..1
    # time=12.409ms
}

ok 7 - test/css-test.js # time=25.011ms {
    # Subtest
        ok 1 - 01.01 - CSS in the head
        1..1
    ok 1 # time=10.514ms
    
    # Subtest
        ok 1 - 01.02 - CSS, no whitespace inside
        1..1
    ok 2 # time=2.463ms
    
    1..2
    # time=25.011ms
}

ok 8 - test/reportProgressFunc-test.js # time=88.379ms {
    # Subtest
        ok 1 - 01.01 - [36mopts.reportProgressFunc[39m - null
        1..1
    ok 1 # time=8.194ms
    
    # Subtest
        ok 1 - 01.02 - [36mopts.reportProgressFunc[39m - false
        1..1
    ok 2 # time=1.292ms
    
    # Subtest
        ok 1 - 01.03 - [36mopts.reportProgressFunc[39m - short length reports only at 50%
        1..1
    ok 3 # time=4.244ms
    
    # Subtest
        ok 1 - (unnamed test)
        ok 2 - 01.04 - [36mopts.reportProgressFunc[39m - longer length reports at 0-100%
        1..2
    ok 4 # time=12.133ms
    
    # Subtest
        ok 1 - 01.05 - [36mopts.reportProgressFunc[39m - custom reporting range, short input
        1..1
    ok 5 # time=8.426ms
    
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
    ok 6 # time=30.44ms
    
    1..6
    # time=88.379ms
}

ok 9 - test/umd-test.js # time=8.382ms {
    # Subtest: UMD build works fine
        ok 1 - expect truthy value
        1..1
    ok 1 - UMD build works fine # time=5.548ms
    
    1..1
    # time=8.382ms
}

1..9
# time=3476.359ms
