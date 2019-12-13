TAP version 13
ok 1 - test/test.js # time=230.883ms {
    # Subtest: 01.01 - recognised HTML5 doctype
        ok 1 - 01.01
        1..1
    ok 1 - 01.01 - recognised HTML5 doctype # time=14.657ms
    
    # Subtest: 01.02 - recognised all HTML4 doctypes
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        1..3
    ok 2 - 01.02 - recognised all HTML4 doctypes # time=2.461ms
    
    # Subtest: 01.03 - recognised XHTML doctypes
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        ok 4 - 01.03.04
        ok 5 - 01.03.05
        ok 6 - 01.03.06
        ok 7 - 01.03.07
        ok 8 - 01.03.08
        ok 9 - 01.03.09
        ok 10 - 01.03.10
        ok 11 - 01.03.11
        ok 12 - 01.03.12
        ok 13 - 01.03.13
        ok 14 - 01.03.14
        1..14
    ok 3 - 01.03 - recognised XHTML doctypes # time=4.865ms
    
    # Subtest: 01.04 - recognises old HTML doctypes
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.03
        1..3
    ok 4 - 01.04 - recognises old HTML doctypes # time=1.661ms
    
    # Subtest: 02.01 - detects by image tags only, one closed image
        ok 1 - 02.01
        1..1
    ok 5 - 02.01 - detects by image tags only, one closed image # time=1.441ms
    
    # Subtest: 02.02 - detects by images, one closed image and two unclosed
        ok 1 - 02.02
        1..1
    ok 6 - 02.02 - detects by images, one closed image and two unclosed # time=1.213ms
    
    # Subtest: 02.03 - one closed, one unclosed image - leans to HTML side
        ok 1 - 02.03
        1..1
    ok 7 - 02.03 - one closed, one unclosed image - leans to HTML side # time=0.933ms
    
    # Subtest: 02.04 - detects by br tags only, one unclosed br
        ok 1 - 02.04.01
        ok 2 - 02.04.02
        ok 3 - 02.04.03
        ok 4 - 02.04.04
        ok 5 - 02.04.05
        1..5
    ok 8 - 02.04 - detects by br tags only, one unclosed br # time=2.26ms
    
    # Subtest: 02.05 - detects by br tags only, one closed br
        ok 1 - 02.05.01
        ok 2 - 02.05.02
        ok 3 - 02.05.03
        ok 4 - 02.05.04
        ok 5 - 02.05.05
        1..5
    ok 9 - 02.05 - detects by br tags only, one closed br # time=4.614ms
    
    # Subtest: 02.06 - detects by hr tags only, one unclosed hr
        ok 1 - 02.06.06
        ok 2 - 02.06.07
        ok 3 - 02.06.08
        ok 4 - 02.06.09
        ok 5 - 02.06.10
        1..5
    ok 10 - 02.06 - detects by hr tags only, one unclosed hr # time=6.116ms
    
    # Subtest: 02.07 - detects by hr tags only, one closed hr
        ok 1 - 02.07.11
        ok 2 - 02.07.12
        ok 3 - 02.07.13
        ok 4 - 02.07.14
        ok 5 - 02.07.15
        1..5
    ok 11 - 02.07 - detects by hr tags only, one closed hr # time=1.629ms
    
    # Subtest: 02.08 - real-life code
        ok 1 - 02.08
        1..1
    ok 12 - 02.08 - real-life code # time=0.848ms
    
    # Subtest: 03.01 - no tags at all, text string only
        ok 1 - 03.01
        1..1
    ok 13 - 03.01 - no tags at all, text string only # time=0.804ms
    
    # Subtest: 03.02 - unrecognised meta tag - counts as HTML
        ok 1 - 03.02
        1..1
    ok 14 - 03.02 - unrecognised meta tag - counts as HTML # time=0.882ms
    
    # Subtest: 03.03 - no meta tag, no single tags
        ok 1 - 03.03
        1..1
    ok 15 - 03.03 - no meta tag, no single tags # time=0.889ms
    
    # Subtest: 03.04 - missing input
        ok 1 - 03.04
        1..1
    ok 16 - 03.04 - missing input # time=0.889ms
    
    # Subtest: 03.05 - input is not string - throws
        ok 1 - expected to throw
        1..1
    ok 17 - 03.05 - input is not string - throws # time=3.166ms
    
    1..17
    # time=230.883ms
}

1..1
# time=2485.481ms
