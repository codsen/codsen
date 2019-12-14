TAP version 13
# Subtest: test/api-test.js
    ok 1 - 00.01 - 1st arg missing
    ok 2 - 00.02 - 1nd arg of a wrong type
    ok 3 - 00.03 - 2nd arg (tagCb()) wrong
    ok 4 - 00.04 - 3rd arg (charCb()) wrong
    ok 5 - 00.05 - 4th arg (opts) is wrong
    ok 6 - 00.06 - opts.reportProgressFunc is wrong
    1..6
    # time=12.202ms
ok 1 - test/api-test.js # time=12.202ms

# Subtest: test/brokenhtml-test.js
    # Subtest
        ok 1 - 01.01 - [33mtag-space-after-opening-bracket[39m - 1
        1..1
    ok 1 # time=13.078ms
    
    # Subtest
        ok 1 - 02.01 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 2 # time=3.457ms
    
    # Subtest
        ok 1 - 02.02 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 3 # time=2.489ms
    
    # Subtest
        ok 1 - 02.03 - [33mtag-closing-left-slash[39m - 1
        1..1
    ok 4 # time=2.765ms
    
    1..4
    # time=90.036ms
ok 2 - test/brokenhtml-test.js # time=90.036ms

# Subtest: test/char-test.js
    # Subtest
        ok 1 - 01.01 - tag and text
        1..1
    ok 1 # time=12.309ms
    
    1..1
    # time=56.569ms
ok 3 - test/char-test.js # time=56.569ms

# Subtest: test/css-test.js
    # Subtest
        ok 1 - 01.01 - CSS in the head
        1..1
    ok 1 # time=13.558ms
    
    # Subtest
        ok 1 - 01.02 - CSS, no whitespace inside
        1..1
    ok 2 # time=3.959ms
    
    1..2
    # time=92.721ms
ok 4 - test/css-test.js # time=92.721ms

# Subtest: test/esp-test.js
    # Subtest
        ok 1 - 01.01 - ESP literals among text get reported
        1..1
    ok 1 # time=11.286ms
    
    # Subtest
        ok 1 - 01.02 - ESP literals among text get reported
        1..1
    ok 2 # time=3.087ms
    
    # Subtest
        ok 1 - 01.03 - ESP literals surrounded by HTML tags
        1..1
    ok 3 # time=4.925ms
    
    # Subtest
        ok 1 - 01.04
        1..1
    ok 4 # time=3.592ms
    
    # Subtest
        ok 1 - 01.05 - ESP literals surrounded by HTML tags, tight
        1..1
    ok 5 # time=2.893ms
    
    # Subtest
        ok 1 - 01.06
        1..1
    ok 6 # time=2.818ms
    
    # Subtest
        ok 1 - 01.07
        1..1
    ok 7 # time=3.053ms
    
    # Subtest
        ok 1 - 01.08
        1..1
    ok 8 # time=20.012ms
    
    # Subtest
        ok 1 - 01.09 - Responsys-style ESP tag
        1..1
    ok 9 # time=3.899ms
    
    # Subtest
        ok 1 - 01.10 - two nunjucks tags, same pattern set of two, tight
        1..1
    ok 10 # time=2.143ms
    
    # Subtest
        ok 1 - 01.11 - two nunjucks tags, different pattern set of two, tight
        1..1
    ok 11 # time=2.379ms
    
    # Subtest
        ok 1 - 01.12 - different set, *|zzz|*
        1..1
    ok 12 # time=2.021ms
    
    # Subtest
        ok 1 - 01.13 - error, two ESP tags joined, first one ends with heads instead of tails
        1..1
    ok 13 # time=2.308ms
    
    1..13
    # time=193.31ms
ok 5 - test/esp-test.js # time=193.31ms

# Subtest: test/html-attributes-test.js
    # Subtest
        ok 1 - 01.01 - [36mbasic[39m - single- and double-quoted attr
        1..1
    ok 1 # time=13.904ms
    
    # Subtest
        ok 1 - 01.02 - [36mbasic[39m - value-less attribute
        1..1
    ok 2 # time=3.887ms
    
    # Subtest
        ok 1 - 01.03 - [36mbasic[39m - a closing tag
        1..1
    ok 3 # time=2.676ms
    
    # Subtest
        ok 1 - 01.04 - [36mbasic[39m - a closing tag
        1..1
    ok 4 # time=2.47ms
    
    # Subtest
        ok 1 - 02.01 - [36mbroken[39m - no equals but quotes present
        1..1
    ok 5 # time=3.462ms
    
    # Subtest
        ok 1 - 02.03 - [36mbroken[39m - two equals
        1..1
    ok 6 # time=2.813ms
    
    # Subtest
        ok 1 - 03.01
        1..1
    ok 7 # time=3.137ms
    
    # Subtest
        ok 1 - 03.02
        1..1
    ok 8 # time=23.528ms
    
    # Subtest
        ok 1 - 03.03
        1..1
    ok 9 # time=24.55ms
    
    # "" has `only` set but all tests run
    # Subtest
        ok 1 - 03.04
        1..1
    ok 10 # time=4.11ms
    
    1..10
    # time=201.33ms
ok 6 - test/html-attributes-test.js # time=201.33ms

# Subtest: test/html-test.js
    # Subtest
        ok 1 - 01.01 - text-tag-text
        1..1
    ok 1 # time=19.435ms
    
    # Subtest
        ok 1 - 01.02 - text only
        1..1
    ok 2 # time=3.742ms
    
    # Subtest
        ok 1 - 01.03 - opening tag only
        1..1
    ok 3 # time=2.74ms
    
    # Subtest
        ok 1 - 01.04 - closing tag only
        1..1
    ok 4 # time=2.816ms
    
    # Subtest
        ok 1 - 01.05 - self-closing tag only
        1..1
    ok 5 # time=3.916ms
    
    # Subtest
        ok 1 - 01.06 - multiple tags
        1..1
    ok 6 # time=2.818ms
    
    # Subtest
        ok 1 - 01.07 - closing bracket in the attribute's value
        1..1
    ok 7 # time=2.951ms
    
    # Subtest
        ok 1 - 01.08 - closing bracket layers of nested quotes
        1..1
    ok 8 # time=3.414ms
    
    # Subtest
        ok 1 - 01.09 - bracket as text
        1..1
    ok 9 # time=19.052ms
    
    # Subtest
        ok 1 - 01.10 - tag followed by brackets
        1..1
    ok 10 # time=4.448ms
    
    # Subtest
        ok 1 - 01.11 - html comment
        1..1
    ok 11 # time=4.526ms
    
    # Subtest
        ok 1 - 01.12 - html5 doctype
        1..1
    ok 12 # time=3.14ms
    
    # Subtest
        ok 1 - 01.13 - xhtml doctype
        1..1
    ok 13 # time=8.366ms
    
    # Subtest
        ok 1 - 01.14 - xhtml DTD doctype
        1..1
    ok 14 # time=11.513ms
    
    # Subtest
        ok 1 - 01.15 - void tags
        1..1
    ok 15 # time=2.211ms
    
    # Subtest
        ok 1 - 01.16 - recognised tags
        1..1
    ok 16 # time=2.413ms
    
    # Subtest
        ok 1 - 01.17 - unrecognised tags
        1..1
    ok 17 # time=2.032ms
    
    # Subtest
        ok 1 - 01.18 - wrong case but still recognised tags
        1..1
    ok 18 # time=2.083ms
    
    # Subtest
        ok 1 - 01.19 - correct HTML5 doctype
        1..1
    ok 19 # time=14.206ms
    
    # Subtest
        ok 1 - 01.20 - correct HTML5 doctype
        1..1
    ok 20 # time=5.272ms
    
    # Subtest
        ok 1 - 01.21 - tag names with numbers
        1..1
    ok 21 # time=1.996ms
    
    # Subtest
        ok 1 - 02.01 - CDATA - correct
        1..1
    ok 22 # time=8.79ms
    
    # Subtest
        ok 1 - 02.02 - CDATA - messed up 1
        1..1
    ok 23 # time=2.65ms
    
    # Subtest
        ok 1 - 02.03 - CDATA - messed up 2
        1..1
    ok 24 # time=4.037ms
    
    # Subtest
        ok 1 - 02.04 - CDATA - messed up 3
        1..1
    ok 25 # time=2.716ms
    
    # Subtest
        ok 1 - 03.01 - XML - correct
        1..1
    ok 26 # time=11.601ms
    
    # Subtest
        ok 1 - 03.02 - XML - incorrect 1
        1..1
    ok 27 # time=10.262ms
    
    # Subtest
        ok 1 - 03.02 - XML - incorrect 2
        1..1
    ok 28 # time=5.8ms
    
    # Subtest
        ok 1 - 03.03 - XML - incorrect 3
        1..1
    ok 29 # time=10.939ms
    
    1..29
    # time=420.95ms
ok 7 - test/html-test.js # time=420.95ms

# Subtest: test/reportProgressFunc-test.js
    # Subtest
        ok 1 - 01.01 - [36mopts.reportProgressFunc[39m - null
        1..1
    ok 1 # time=10.321ms
    
    # Subtest
        ok 1 - 01.02 - [36mopts.reportProgressFunc[39m - false
        1..1
    ok 2 # time=2.712ms
    
    # Subtest
        ok 1 - 01.03 - [36mopts.reportProgressFunc[39m - short length reports only at 50%
        1..1
    ok 3 # time=6.514ms
    
    # Subtest
        ok 1 - (unnamed test)
        ok 2 - 01.04 - [36mopts.reportProgressFunc[39m - longer length reports at 0-100%
        1..2
    ok 4 # time=17.572ms
    
    # Subtest
        ok 1 - 01.05 - [36mopts.reportProgressFunc[39m - custom reporting range, short input
        1..1
    ok 5 # time=26.027ms
    
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
    ok 6 # time=92.694ms
    
    1..6
    # time=250.756ms
ok 8 - test/reportProgressFunc-test.js # time=250.756ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - expect truthy value
        1..1
    ok 1 - UMD build works fine # time=17.158ms
    
    1..1
    # time=66.054ms
ok 9 - test/umd-test.js # time=66.054ms

1..9
# time=15725.841ms
