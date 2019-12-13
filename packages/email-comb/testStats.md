TAP version 13
ok 1 - test/test.js # time=5845.831ms {
    # Subtest: 01.01 - mvp #1
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        1..3
    ok 1 - 01.01 - mvp #1 # time=66.638ms
    
    # Subtest: 01.02 - mvp #2
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        1..3
    ok 2 - 01.02 - mvp #2 # time=33.482ms
    
    # Subtest: 01.03 - removes @charset
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        1..3
    ok 3 - 01.03 - removes @charset # time=40.546ms
    
    # Subtest: 01.04 - multiple classes and id's
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.03
        1..3
    ok 4 - 01.04 - multiple classes and id's # time=25.086ms
    
    # Subtest: 01.05 - mixed classes and non-classes
        ok 1 - 01.05.01
        ok 2 - 01.05.02
        ok 3 - 01.05.03
        1..3
    ok 5 - 01.05 - mixed classes and non-classes # time=28.664ms
    
    # Subtest: 01.06 - mixed classes and non-classes
        ok 1 - 01.06.01
        ok 2 - 01.06.02
        ok 3 - 01.06.03
        1..3
    ok 6 - 01.06 - mixed classes and non-classes # time=26.503ms
    
    # Subtest: 01.07 - sandwitched used and unused
        ok 1 - 01.07.01
        ok 2 - 01.07.02
        ok 3 - 01.07.03
        1..3
    ok 7 - 01.07 - sandwitched used and unused # time=28.87ms
    
    # Subtest: 01.08 - sandwitched used and unused
        ok 1 - 01.08.01
        ok 2 - 01.08.02
        ok 3 - 01.08.03
        1..3
    ok 8 - 01.08 - sandwitched used and unused # time=9.425ms
    
    # Subtest: 01.09 - sandwitched used and unused
        ok 1 - 01.09.01
        ok 2 - 01.09.02
        ok 3 - 01.09.03
        1..3
    ok 9 - 01.09 - sandwitched used and unused # time=10.982ms
    
    # Subtest: 01.10 - sandwitched used and unused
        ok 1 - 01.10.01
        ok 2 - 01.10.02
        ok 3 - 01.10.03
        1..3
    ok 10 - 01.10 - sandwitched used and unused # time=9.185ms
    
    # Subtest: 01.11 - mixed: classes and tag names
        ok 1 - 01.11.01
        ok 2 - 01.11.02
        ok 3 - 01.11.03
        1..3
    ok 11 - 01.11 - mixed: classes and tag names # time=8.788ms
    
    # Subtest: 01.12 - removes unused classes and uglifies at the same time
        ok 1 - 01.12.01
        ok 2 - 01.12.02
        ok 3 - 01.12.03
        ok 4 - 01.12.04
        ok 5 - 01.12.05
        ok 6 - 01.12.06
        ok 7 - 01.12.07
        ok 8 - 01.12.08
        ok 9 - 01.12.09
        ok 10 - 01.12.10
        ok 11 - 01.12.11
        ok 12 - 01.12.12
        1..12
    ok 12 - 01.12 - removes unused classes and uglifies at the same time # time=78.641ms
    
    # Subtest: 01.13 - adhoc #1
        ok 1 - 01.13.01
        ok 2 - 01.13.02
        ok 3 - 01.13.03
        1..3
    ok 13 - 01.13 - adhoc #1 # time=12.715ms
    
    # Subtest: 01.14 - adhoc 2
        ok 1 - 01.14.01
        ok 2 - 01.14.02
        ok 3 - 01.14.03
        1..3
    ok 14 - 01.14 - adhoc 2 # time=7.908ms
    
    # Subtest: 01.15 - adhoc 3
        ok 1 - 01.15.01
        ok 2 - 01.15.02
        ok 3 - 01.15.03
        1..3
    ok 15 - 01.15 - adhoc 3 # time=12.038ms
    
    # Subtest: 01.16 - mixed classes and non-classes
        ok 1 - 01.16.01
        ok 2 - 01.16.02
        ok 3 - 01.16.03
        1..3
    ok 16 - 01.16 - mixed classes and non-classes # time=8.375ms
    
    # Subtest: 01.17 - removes classes and id's from HTML5 (normal input)
        ok 1 - 01.17
        1..1
    ok 17 - 01.17 - removes classes and id's from HTML5 (normal input) # time=62.625ms
    
    # Subtest: 01.18 - removes classes and id's from HTML5 - uglifies
        ok 1 - 01.18
        1..1
    ok 18 - 01.18 - removes classes and id's from HTML5 - uglifies # time=50.607ms
    
    # Subtest: 01.19 - deletes blank class/id attrs
        ok 1 - 01.19
        1..1
    ok 19 - 01.19 - deletes blank class/id attrs # time=45.912ms
    
    # Subtest: 01.20 - class present in both head and body, but head has it joined with nonexistent id
        ok 1 - 01.20
        1..1
    ok 20 - 01.20 - class present in both head and body, but head has it joined with nonexistent id # time=28.476ms
    
    # Subtest: 01.21 - multiple style tags recognised and transformed
        ok 1 - 01.21
        1..1
    ok 21 - 01.21 - multiple style tags recognised and transformed # time=45.901ms
    
    # Subtest: 01.22 - multiple levels of media queries cleaned
        ok 1 - 01.22
        1..1
    ok 22 - 01.22 - multiple levels of media queries cleaned # time=50.329ms
    
    # Subtest: 01.23 - multiple levels of media queries cleaned + @supports wrap
        ok 1 - 01.23
        1..1
    ok 23 - 01.23 - multiple levels of media queries cleaned + @supports wrap # time=42.833ms
    
    # Subtest: 01.24 - empty media queries removed
        ok 1 - 01.24
        1..1
    ok 24 - 01.24 - empty media queries removed # time=28.803ms
    
    # Subtest: 01.25 - style tags are outside HEAD
        ok 1 - 01.25
        1..1
    ok 25 - 01.25 - style tags are outside HEAD # time=29.369ms
    
    # Subtest: 01.26 - removes media query together with the whole style tag #1
        ok 1 - 01.26
        1..1
    ok 26 - 01.26 - removes media query together with the whole style tag #1 # time=12.785ms
    
    # Subtest: 01.27 - removes media query together with the whole style tag #2
        ok 1 - 01.27
        1..1
    ok 27 - 01.27 - removes media query together with the whole style tag #2 # time=10.102ms
    
    # Subtest: 01.28 - removes three media queries together with the style tags
        ok 1 - 01.28
        1..1
    ok 28 - 01.28 - removes three media queries together with the style tags # time=20.874ms
    
    # Subtest: 01.29 - removes last styles together with the whole style tag
        ok 1 - 01.29
        1..1
    ok 29 - 01.29 - removes last styles together with the whole style tag # time=16.29ms
    
    # Subtest: 01.30 - media query with asterisk
        ok 1 - 01.30
        1..1
    ok 30 - 01.30 - media query with asterisk # time=15.956ms
    
    # Subtest: 01.31 - complex media query #1
        ok 1 - 01.31
        1..1
    ok 31 - 01.31 - complex media query #1 # time=14.091ms
    
    # Subtest: 01.32 - complex media query #2
        ok 1 - 01.32
        1..1
    ok 32 - 01.32 - complex media query #2 # time=14.392ms
    
    # Subtest: 01.33 - deletes multiple empty style tags
        ok 1 - 01.33
        1..1
    ok 33 - 01.33 - deletes multiple empty style tags # time=19.685ms
    
    # Subtest: 01.34 - does not touch @font-face
        ok 1 - 01.34
        1..1
    ok 34 - 01.34 - does not touch @font-face # time=29.486ms
    
    # Subtest: 01.35 - does not touch @import with query strings containing commas
        ok 1 - 01.35
        1..1
    ok 35 - 01.35 - does not touch @import with query strings containing commas # time=12.595ms
    
    # Subtest: 01.36 - @media contains classes to remove, @import present in the vicinity
        ok 1 - 01.36
        1..1
    ok 36 - 01.36 - @media contains classes to remove, @import present in the vicinity # time=26.53ms
    
    # Subtest: 01.37 - @charset #1
        ok 1 - 01.37
        1..1
    ok 37 - 01.37 - @charset #1 # time=16.209ms
    
    # Subtest: 01.38 - @charset #2
        ok 1 - 01.38
        1..1
    ok 38 - 01.38 - @charset #2 # time=8.58ms
    
    # Subtest: 01.39 - @charset #3
        ok 1 - 01.39
        1..1
    ok 39 - 01.39 - @charset #3 # time=12.27ms
    
    # Subtest: 01.40 - @charset #4
        ok 1 - 01.40
        1..1
    ok 40 - 01.40 - @charset #4 # time=18.778ms
    
    # Subtest: 01.41 - @charset #5
        ok 1 - 01.41
        1..1
    ok 41 - 01.41 - @charset #5 # time=13.886ms
    
    # Subtest: 01.42 - at-rule is followed by whitespace and another at-rule
        ok 1 - 01.42
        1..1
    ok 42 - 01.42 - at-rule is followed by whitespace and another at-rule # time=17.415ms
    
    # Subtest: 01.43 - at-rule is followed by whitespace and another at-rule
        ok 1 - 01.43
        1..1
    ok 43 - 01.43 - at-rule is followed by whitespace and another at-rule # time=16.649ms
    
    # Subtest: 01.44 - at-rule followed by closing </style>
        ok 1 - 01.44
        1..1
    ok 44 - 01.44 - at-rule followed by closing </style> # time=15.51ms
    
    # Subtest: 01.45 - at-rule followed by semicolon without contents
        ok 1 - 01.45
        1..1
    ok 45 - 01.45 - at-rule followed by semicolon without contents # time=23.209ms
    
    # Subtest: 01.46 - at-rule with single quotes
        ok 1 - 01.46
        1..1
    ok 46 - 01.46 - at-rule with single quotes # time=18.87ms
    
    # Subtest: 01.47 - removes classes wrapped with conditional Outlook comments
        ok 1 - 01.47.01
        ok 2 - 01.47.02
        1..2
    ok 47 - 01.47 - removes classes wrapped with conditional Outlook comments # time=146.243ms
    
    # Subtest: 01.48 - removes comments from style blocks - opts.removeHTMLComments + opts.removeCSSComments
        ok 1 - 01.48.01 - defaults
        ok 2 - 01.48.02 - hardcoded defaults
        ok 3 - 01.48.03 - off
        ok 4 - 01.48.04 - html on, css on
        ok 5 - 01.48.05 - html on, css off
        ok 6 - 01.48.06 - html off, css on
        ok 7 - 01.48.07 - html off, css off
        1..7
    ok 48 - 01.48 - removes comments from style blocks - opts.removeHTMLComments + opts.removeCSSComments # time=340.899ms
    
    # Subtest: 01.49 - false real class is commented-out and therefore gets removed
        ok 1 - 01.49
        1..1
    ok 49 - 01.49 - false real class is commented-out and therefore gets removed # time=40.241ms
    
    # Subtest: 01.50 - copes with @font-face within media query
        ok 1 - 01.50
        1..1
    ok 50 - 01.50 - copes with @font-face within media query # time=47.291ms
    
    # Subtest: 01.51 - copes with @font-face not within media query
        ok 1 - 01.51
        1..1
    ok 51 - 01.51 - copes with @font-face not within media query # time=48.422ms
    
    # Subtest: 01.52 - peculiar pattern - two classes to be removed, then used class
        ok 1 - 01.52
        1..1
    ok 52 - 01.52 - peculiar pattern - two classes to be removed, then used class # time=20.132ms
    
    # Subtest: 01.53 - head CSS is given minified
        ok 1 - 01.53.01
        ok 2 - 01.53.02
        1..2
    ok 53 - 01.53 - head CSS is given minified # time=14.837ms
    
    # Subtest: 01.54 - head CSS is given minified, comma separated
        ok 1 - 01.54.01
        ok 2 - 01.54.02
        ok 3 - 01.54.03
        1..3
    ok 54 - 01.54 - head CSS is given minified, comma separated # time=22.349ms
    
    # Subtest: 01.55 - head CSS is expanded
        ok 1 - 01.55
        1..1
    ok 55 - 01.55 - head CSS is expanded # time=9.594ms
    
    # Subtest: 01.56 - retains media queries
        ok 1 - 01.56.01
        ok 2 - 01.56.02
        ok 3 - 01.56.03
        ok 4 - 01.56.04
        ok 5 - 01.56.05
        ok 6 - 01.56.06
        ok 7 - 01.56.07
        ok 8 - 01.56.08
        1..8
    ok 56 - 01.56 - retains media queries # time=55.121ms
    
    # Subtest: 01.57 - empty string produces empty string
        ok 1 - 01.57
        1..1
    ok 57 - 01.57 - empty string produces empty string # time=0.831ms
    
    # Subtest: 01.58 - issue no.2 - mini
        ok 1 - 01.58
        1..1
    ok 58 - 01.58 - issue no.2 - mini # time=15.361ms
    
    # Subtest: 01.59 - issue no.2 - full
        ok 1 - 01.59
        1..1
    ok 59 - 01.59 - issue no.2 - full # time=40.193ms
    
    # Subtest: 01.60 - separate style tags, wrapped with Outlook comments - used CSS
        ok 1 - 01.60.01
        ok 2 - 01.60.02
        1..2
    ok 60 - 01.60 - separate style tags, wrapped with Outlook comments - used CSS # time=54.724ms
    
    # Subtest: 01.61 - separate style tags, wrapped with Outlook comments - unused CSS
        ok 1 - 01.61.01
        ok 2 - 01.61.02
        1..2
    ok 61 - 01.61 - separate style tags, wrapped with Outlook comments - unused CSS # time=62.897ms
    
    # Subtest: 01.62 - separate style tags, wrapped with Outlook comments - part-used CSS
        ok 1 - 01.62.01
        ok 2 - 01.62.02
        ok 3 - 01.62.03
        ok 4 - 01.62.04
        ok 5 - 01.62.05
        ok 6 - 01.62.06
        ok 7 - 01.62.07
        1..7
    ok 62 - 01.62 - separate style tags, wrapped with Outlook comments - part-used CSS # time=256.17ms
    
    # Subtest: 01.63 - comments in the inline styles
        ok 1 - 01.63
        1..1
    ok 63 - 01.63 - comments in the inline styles # time=5.283ms
    
    # Subtest: 01.64 - dirty code - space between class and =
        ok 1 - 01.64
        1..1
    ok 64 - 01.64 - dirty code - space between class and = # time=4.625ms
    
    # Subtest: 01.65 - dirty code - blank class attribute name
        ok 1 - 01.65.01
        ok 2 - 01.65.02
        1..2
    ok 65 - 01.65 - dirty code - blank class attribute name # time=10.616ms
    
    # Subtest: 01.66 - dirty code - blank class attribute name
        ok 1 - 01.66
        1..1
    ok 66 - 01.66 - dirty code - blank class attribute name # time=5.229ms
    
    # Subtest: 01.67 - plus selector
        ok 1 - 01.67
        1..1
    ok 67 - 01.67 - plus selector # time=17.448ms
    
    # Subtest: 01.68 - double curlies around values
        ok 1 - 01.68
        1..1
    ok 68 - 01.68 - double curlies around values # time=11.737ms
    
    # Subtest: 03.01 - missing closing TD, TR, TABLE will not throw
        ok 1 - 03.01 - does nothing as head has no styles
        1..1
    ok 69 - 03.01 - missing closing TD, TR, TABLE will not throw # time=5.148ms
    
    # Subtest: 03.02 - doesn't remove any other empty attributes besides class/id (mini)
        ok 1 - 03.02
        1..1
    ok 70 - 03.02 - doesn't remove any other empty attributes besides class/id (mini) # time=4.901ms
    
    # Subtest: 03.03 - doesn't remove any other empty attributes besides class/id
        ok 1 - 03.03
        1..1
    ok 71 - 03.03 - doesn't remove any other empty attributes besides class/id # time=13.211ms
    
    # Subtest: 03.04 - removes classes and id's from HTML even if it's heavily messed up
        ok 1 - 03.04 - rubbish in, rubbish out, only rubbish-with-unused-CSS-removed-out!
        1..1
    ok 72 - 03.04 - removes classes and id's from HTML even if it's heavily messed up # time=39.065ms
    
    # Subtest: 03.05 - missing last @media curlie
        ok 1 - 03.05
        1..1
    ok 73 - 03.05 - missing last @media curlie # time=13.363ms
    
    # Subtest: 04.01 - doesn't affect emoji characters within the code
        ok 1 - 04.01
        1..1
    ok 74 - 04.01 - doesn't affect emoji characters within the code # time=3.206ms
    
    # Subtest: 04.02 - doesn't affect emoji characters within the attribute names
        ok 1 - 04.02
        1..1
    ok 75 - 04.02 - doesn't affect emoji characters within the attribute names # time=3.396ms
    
    # Subtest: 05.01 - wrong inputs result in throw'ing
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to throw
        ok 8 - expect truthy value
        ok 9 - expected to not throw
        ok 10 - expected to not throw
        1..10
    ok 76 - 05.01 - wrong inputs result in throw'ing # time=4.098ms
    
    # Subtest: 05.02 - wrong opts
        ok 1 - expected to throw
        ok 2 - expect truthy value
        ok 3 - expected to throw
        ok 4 - expect truthy value
        ok 5 - expected to throw
        ok 6 - expect truthy value
        ok 7 - expected to not throw
        ok 8 - expected to not throw
        ok 9 - expected to not throw
        ok 10 - expected to throw
        ok 11 - expect truthy value
        ok 12 - expected to not throw
        ok 13 - expected to not throw
        ok 14 - expected to not throw
        ok 15 - expected to throw
        ok 16 - expect truthy value
        ok 17 - expected to throw
        ok 18 - expect truthy value
        ok 19 - expected to throw
        ok 20 - expect truthy value
        ok 21 - expected to throw
        ok 22 - expect truthy value
        ok 23 - expected to not throw
        ok 24 - expected to throw
        ok 25 - expect truthy value
        1..25
    ok 77 - 05.02 - wrong opts # time=14.69ms
# time=8636.128ms
    
    # Subtest: 05.03 - opts.uglify wrong
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 78 - 05.03 - opts.uglify wrong # time=3.94ms
    
    # Subtest: 05.04 - opts.reportProgressFunc wrong
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        ok 3 - expected to throw
        ok 4 - expect truthy value
        1..4
    ok 79 - 05.04 - opts.reportProgressFunc wrong # time=8.058ms
    
    # Subtest: 06.01 - returned correct info object, nothing to delete from body, damaged HTML
        ok 1 - 06.01.01
        ok 2 - 06.01.02
        ok 3 - 06.01.03
        ok 4 - 06.01.04
        1..4
    ok 80 - 06.01 - returned correct info object, nothing to delete from body, damaged HTML # time=34.155ms
    
    # Subtest: 06.02 - returned correct info object, clean HTML
        ok 1 - 06.02.01
        ok 2 - 06.02.02
        ok 3 - 06.02.03
        ok 4 - 06.02.04
        1..4
    ok 81 - 06.02 - returned correct info object, clean HTML # time=36.695ms
    
    # Subtest: 06.03 - as 06.02 but now with whitelist, dirty HTML
        ok 1 - 06.03.01
        ok 2 - 06.03.02
        ok 3 - 06.03.03 - nothing removed because of whitelist
        ok 4 - 06.03.04 - nothing removed because of whitelist
        1..4
    ok 82 - 06.03 - as 06.02 but now with whitelist, dirty HTML # time=30.135ms
    
    # Subtest: 06.04 - correct classes reported in info/deletedFromBody
        ok 1 - 06.04.01
        ok 2 - 06.04.02
        ok 3 - 06.04.03
        ok 4 - 06.04.04 - sneaky case - it is within head, but it is sandwitched with an unused class, so it does not count!
        1..4
    ok 83 - 06.04 - correct classes reported in info/deletedFromBody # time=18.785ms
    
    # Subtest: 06.05 - more sandwitched classes/ids cases
        ok 1 - 06.05.01
        ok 2 - 06.05.02
        ok 3 - 06.05.03 - deleted because they'e sandwitched with unused classes/ids
        ok 4 - 06.05.04 - deleted because they'e sandwitched with unused classes/ids
        1..4
    ok 84 - 06.05 - more sandwitched classes/ids cases # time=31.354ms
    
    # Subtest: 07.01 - nothing removed because of settings.whitelist
        ok 1 - 07.01
        1..1
    ok 85 - 07.01 - nothing removed because of settings.whitelist # time=42.135ms
    
    # Subtest: 07.02 - some removed, some whitelisted
        ok 1 - 07.02
        1..1
    ok 86 - 07.02 - some removed, some whitelisted # time=50.012ms
    
    # Subtest: 07.03 - case of whitelisting everything
        ok 1 - 07.03
        1..1
    ok 87 - 07.03 - case of whitelisting everything # time=43.391ms
    
    # Subtest: 07.04 - special case - checking adjacent markers #1
        ok 1 - 07.04
        1..1
    ok 88 - 07.04 - special case - checking adjacent markers #1 # time=15.499ms
    
    # Subtest: 07.05 - special case - checking adjacent markers #2
        ok 1 - 07.05
        1..1
    ok 89 - 07.05 - special case - checking adjacent markers #2 # time=8.492ms
    
    # Subtest: 07.06 - special case - checking commas within curly braces
        ok 1 - 07.06
        1..1
    ok 90 - 07.06 - special case - checking commas within curly braces # time=5.988ms
    
    # Subtest: 08.01 - color code hashes within head styles with no selectors
        ok 1 - 08.01 - there are no classes or id's in the query selector, checking false positives
        1..1
    ok 91 - 08.01 - color code hashes within head styles with no selectors # time=9.341ms
    
    # Subtest: 08.02 - selectors in head styles without classes or ids
        ok 1 - 08.02 - there are no classes or id's in the query selector, checking false positives
        1..1
    ok 92 - 08.02 - selectors in head styles without classes or ids # time=5.217ms
    
    # Subtest: 08.03 - sneaky attributes that end with characters "id"
        ok 1 - 08.03 - sneaky urlid attribute
        1..1
    ok 93 - 08.03 - sneaky attributes that end with characters "id" # time=37.488ms
    
    # Subtest: 08.04 - mini version of 08.05, sneaky attributes ending with "class"
        ok 1 - 08.04 - sneaky superclass attribute
        1..1
    ok 94 - 08.04 - mini version of 08.05, sneaky attributes ending with "class" # time=4.113ms
    
    # Subtest: 08.05 - sneaky attributes that end with characters "class"
        ok 1 - 08.05 - sneaky superclass attribute
        1..1
    ok 95 - 08.05 - sneaky attributes that end with characters "class" # time=39.315ms
    
    # Subtest: 08.06 - color code hashes interpreted correctly, not as id's
        ok 1 - 08.06 - look for #525252 in head styles, it should not be among results - v2.6.0+
        1..1
    ok 96 - 08.06 - color code hashes interpreted correctly, not as id's # time=74.16ms
    
    # Subtest: 08.07 - one-letter classes (modern notation)
        ok 1 - 08.07 - class .h should not get removed
        1..1
    ok 97 - 08.07 - one-letter classes (modern notation) # time=10.006ms
    
    # Subtest: 08.08 - one-letter classes (old notation)
        ok 1 - 08.08 - class .h should not get removed
        1..1
    ok 98 - 08.08 - one-letter classes (old notation) # time=8.199ms
    
    # Subtest: 08.09 - one-letter classes - comprehensive comparison
        ok 1 - 08.09.01 - allInHead
        ok 2 - 08.09.02 - allInBody
        ok 3 - 08.09.03 - deletedFromHead
        ok 4 - 08.09.04 - deletedFromBody
        ok 5 - 08.09.05 - result
        1..5
    ok 99 - 08.09 - one-letter classes - comprehensive comparison # time=37.58ms
    
    # Subtest: 08.10 - checking whole results object, all its keys #1
        ok 1 - 08.10.01 - allInHead
        ok 2 - 08.10.02 - allInBody
        ok 3 - 08.10.03 - deletedFromHead
        ok 4 - 08.10.04 - deletedFromBody
        ok 5 - 08.10.05 - result
        1..5
    ok 100 - 08.10 - checking whole results object, all its keys #1 # time=15.332ms
    
    # Subtest: 08.11 - checking whole results object, all its keys #2
        ok 1 - 08.11.01 - allInHead
        ok 2 - 08.11.02 - allInBody
        ok 3 - 08.11.03 - deletedFromHead
        ok 4 - 08.11.04 - deletedFromBody
        ok 5 - 08.11.05 - result
        1..5
    ok 101 - 08.11 - checking whole results object, all its keys #2 # time=13.214ms
    
    # Subtest: 08.12 - Cosmin's reported bug
        ok 1 - should be equivalent
        ok 2 - should be equivalent
        1..2
    ok 102 - 08.12 - Cosmin's reported bug # time=6.075ms
    
    # Subtest: 08.13 - inner whitespace #1
        ok 1 - should be equivalent
        1..1
    ok 103 - 08.13 - inner whitespace #1 # time=6.141ms
    
    # Subtest: 08.14 - inner whitespace #2
        ok 1 - should be equivalent
        1..1
    ok 104 - 08.14 - inner whitespace #2 # time=6.078ms
    
    # Subtest: 08.15 - inner whitespace #3
        ok 1 - should be equivalent
        1..1
    ok 105 - 08.15 - inner whitespace #3 # time=5.828ms
    
    # Subtest: 08.16 - adhoc
        ok 1 - should be equivalent
        1..1
    ok 106 - 08.16 - adhoc # time=8.29ms
    
    # Subtest: 08.17 - adhoc
        ok 1 - should be equivalent
        1..1
    ok 107 - 08.17 - adhoc # time=18.884ms
    
    # Subtest: 08.18 - adhoc
        ok 1 - should be equivalent
        1..1
    ok 108 - 08.18 - adhoc # time=11.97ms
    
    # Subtest: 09.01 - nunjucks variable as a class name
        ok 1 - 09.01 - default behaviour - lib will extract var1
        1..1
    ok 109 - 09.01 - nunjucks variable as a class name # time=9.698ms
    
    # Subtest: 09.02 - nunjucks variable as a class name
        ok 1 - 09.02 - default behaviour - curlies are not legal characters to be used as class names
        1..1
    ok 110 - 09.02 - nunjucks variable as a class name # time=7.631ms
    
    # Subtest: 09.03 - nunjucks variable as a class name (simplified version)
        ok 1 - 09.03 - we taught it how heads and tails look so it skips them now
        1..1
    ok 111 - 09.03 - nunjucks variable as a class name (simplified version) # time=5.702ms
    
    # Subtest: 09.04 - nunjucks variable as a class name (full version)
        ok 1 - 09.04 - we taught it how heads and tails look so it skips them now
        1..1
    ok 112 - 09.04 - nunjucks variable as a class name (full version) # time=9.704ms
    
    # Subtest: 09.05 - nunjucks variables mixed with classes and id's (minimal version)
        ok 1 - 09.05 - we taught it how heads and tails look so it skips them now
        1..1
    ok 113 - 09.05 - nunjucks variables mixed with classes and id's (minimal version) # time=6.58ms
    
    # Subtest: 09.06 - nunjucks variables mixed with classes and id's (full version)
        ok 1 - 09.06
        1..1
    ok 114 - 09.06 - nunjucks variables mixed with classes and id's (full version) # time=46.174ms
    
    # Subtest: 10.01 - bug #01
        ok 1 - 10.01.01
        ok 2 - 10.01.02
        ok 3 - 10.01.03
        ok 4 - 10.01.04
        ok 5 - 10.01.05
        1..5
    ok 115 - 10.01 - bug #01 # time=10.909ms
    
    # Subtest: 10.02 - working on early (stage I) per-line removal
        ok 1 - 10.02
        1..1
    ok 116 - 10.02 - working on early (stage I) per-line removal # time=32.448ms
    
    # Subtest: 10.03 - HTML inline CSS comments are removed - commented out selectors - semicols clean and inside comments
        ok 1 - 01.03
        1..1
    ok 117 - 10.03 - HTML inline CSS comments are removed - commented out selectors - semicols clean and inside comments # time=7.033ms
    
    # Subtest: 10.04 - HTML inline CSS comments are removed - commented out selectors - removing comments will result in missing semicol
        ok 1 - 01.04
        1..1
    ok 118 - 10.04 - HTML inline CSS comments are removed - commented out selectors - removing comments will result in missing semicol # time=10.757ms
    
    # Subtest: 10.05 - HTML inline CSS comments are removed - commented out selectors - very cheeky contents within comments
        ok 1 - 01.05
        1..1
    ok 119 - 10.05 - HTML inline CSS comments are removed - commented out selectors - very cheeky contents within comments # time=12.588ms
    
    # Subtest: 10.06 - Even without backend heads/tails set, it should recognise double curlies and curly-percentage -type heads
        ok 1 - 10.06
        1..1
    ok 120 - 10.06 - Even without backend heads/tails set, it should recognise double curlies and curly-percentage -type heads # time=6.26ms
    
    # Subtest: 10.07 - empty class/id without equals and value gets deleted
        ok 1 - 10.07
        1..1
    ok 121 - 10.07 - empty class/id without equals and value gets deleted # time=6.377ms
    
    # Subtest: 10.08 - empty class/id with equals but without value gets deleted
        ok 1 - 10.08
        1..1
    ok 122 - 10.08 - empty class/id with equals but without value gets deleted # time=5.407ms
    
    # Subtest: 10.09 - cleans spaces within classes and id's
        ok 1 - 10.09
        1..1
    ok 123 - 10.09 - cleans spaces within classes and id's # time=10.78ms
    
    # Subtest: 10.10 - does not mangle different-type line endings
        ok 1 - 10.10.01
        ok 2 - 10.10.02
        ok 3 - 10.10.03
        1..3
    ok 124 - 10.10 - does not mangle different-type line endings # time=5.07ms
    
    # Subtest: 10.11 - dirty code #1
        ok 1 - 10.11
        1..1
    ok 125 - 10.11 - dirty code #1 # time=42.294ms
    
    # Subtest: 11.01 - removes HTML comments - healthy code
        ok 1 - 11.01.01
        ok 2 - 11.01.02 - hardcoded default
        ok 3 - 11.01.03
        ok 4 - 11.01.04
        ok 5 - 11.01.05 - hardcoded default
        ok 6 - 11.01.06
        1..6
    ok 126 - 11.01 - removes HTML comments - healthy code # time=26.565ms
    
    # Subtest: 11.02 - removes bogus HTML comments
        ok 1 - 11.02.01
        ok 2 - 11.02.02
        ok 3 - 11.02.03
        1..3
    ok 127 - 11.02 - removes bogus HTML comments # time=21.54ms
    
    # Subtest: 11.03 - removes HTML comments - healthy code with mso conditional - one liner
        ok 1 - 11.03.01
        ok 2 - 11.03.02 - hardcoded default
        ok 3 - 11.03.03
        ok 4 - 11.03.04 - both mso and ie ignores cause a complete skip
        ok 5 - 11.03.05 - mso ignore causes a complete skip
        ok 6 - 11.03.06 - ie ignore is redundant and comment is removed
        ok 7 - 11.03.07 - empty string
        ok 8 - 11.03.08 - empty array
        1..8
    ok 128 - 11.03 - removes HTML comments - healthy code with mso conditional - one liner # time=25.857ms
    
    # Subtest: 11.04 - removes HTML comments - everywhere-except-outlook conditional - type 1
        ok 1 - 11.04.01
        ok 2 - 11.04.02 - hardcoded default
        ok 3 - 11.04.03
        ok 4 - 11.04.04 - completely strips all comments, including outlook conditionals
        1..4
    ok 129 - 11.04 - removes HTML comments - everywhere-except-outlook conditional - type 1 # time=19.574ms
    
    # Subtest: 11.05 - removes HTML comments - everywhere-except-outlook conditional - type 2
        ok 1 - 11.05.01
        ok 2 - 11.05.02 - hardcoded default
        ok 3 - 11.05.03
        ok 4 - 11.05.04 - completely strips all comments, including outlook conditionals
        1..4
    ok 130 - 11.05 - removes HTML comments - everywhere-except-outlook conditional - type 2 # time=17.751ms
    
    # Subtest: 11.06 - removes HTML comments - everywhere-except-outlook conditional - alternative
        ok 1 - 11.06.01
        ok 2 - 11.06.02
        1..2
    ok 131 - 11.06 - removes HTML comments - everywhere-except-outlook conditional - alternative # time=10.253ms
    
    # Subtest: 11.07 - does not touch a table with conditional comment on the columns
        ok 1 - 11.07.01
        ok 2 - 11.07.02 - hardcoded default
        ok 3 - 11.07.03
        1..3
    ok 132 - 11.07 - does not touch a table with conditional comment on the columns # time=24.852ms
    
    # Subtest: 11.08 - trims commented-out HTML
        ok 1 - 11.08.01
        ok 2 - 11.08.02 - hardcoded default
        ok 3 - 11.08.03
        1..3
    ok 133 - 11.08 - trims commented-out HTML # time=16.608ms
    
    # Subtest: 11.09 - outer trims - single leading space
        ok 1 - 11.09
        1..1
    ok 134 - 11.09 - outer trims - single leading space # time=1.497ms
    
    # Subtest: 11.10 - outer trims - doctype with leading line break
        ok 1 - 11.10
        1..1
    ok 135 - 11.10 - outer trims - doctype with leading line break # time=2.278ms
    
    # Subtest: 11.11 - outer trims - trailing line breaks
        ok 1 - 11.11
        1..1
    ok 136 - 11.11 - outer trims - trailing line breaks # time=1.477ms
    
    # Subtest: 11.12 - comment surrounded by tags
        ok 1 - 11.12
        1..1
    ok 137 - 11.12 - comment surrounded by tags # time=2.395ms
    
    # Subtest: 11.13 - leading comment
        ok 1 - 11.13
        1..1
    ok 138 - 11.13 - leading comment # time=4.599ms
    
    # Subtest: 11.14 - leading spaces #1 - just text
        ok 1 - 11.14
        1..1
    ok 139 - 11.14 - leading spaces #1 - just text # time=1.301ms
    
    # Subtest: 11.15 - leading spaces #2 - no body
        ok 1 - 11.15
        1..1
    ok 140 - 11.15 - leading spaces #2 - no body # time=6.428ms
    
    # Subtest: 11.16 - outer trims - some leading tabs
        ok 1 - 11.16
        1..1
    ok 141 - 11.16 - outer trims - some leading tabs # time=1.671ms
    
    # Subtest: 11.17 - outer trims - doctype with leading space
        ok 1 - 11.17
        1..1
    ok 142 - 11.17 - outer trims - doctype with leading space # time=1.915ms
    
    # Subtest: 12.01 - [31muglify[39m - ignores
        ok 1 - 12.01.01 - default settings (no uglify, no ignores)
        ok 2 - 12.01.02 - uglified, no ignores
        ok 3 - 12.01.03 - no uglify, with ignores
        ok 4 - 12.01.04 - uglified + with ignores
        1..4
    ok 143 - 12.01 - [31muglify[39m - ignores # time=30.389ms
    
    # Subtest: 12.02 - [31muglify[39m - class name exceeds library's length (all 26 letters used up)
        ok 1 - 12.02.01 - uglify is off
        ok 2 - 12.02.02 - uglify is on
        ok 3 - 12.02.03
        1..3
    ok 144 - 12.02 - [31muglify[39m - class name exceeds library's length (all 26 letters used up) # time=77.452ms
    
    # Subtest: 12.03 - [31muglify[39m - style tag within Outlook conditionals, used CSS
        ok 1 - 12.03.01
        ok 2 - 12.03.02
        1..2
    ok 145 - 12.03 - [31muglify[39m - style tag within Outlook conditionals, used CSS # time=17.877ms
    
    # Subtest: 12.04 - [31muglify[39m - style tag within Outlook conditionals, unused CSS
        ok 1 - 12.04.01
        ok 2 - 12.04.02
        ok 3 - 12.04.03
        ok 4 - 12.04.04
        1..4
    ok 146 - 12.04 - [31muglify[39m - style tag within Outlook conditionals, unused CSS # time=41.002ms
    
    # Subtest: 12.05 - [31muglify[39m - ignores on used id's
        ok 1 - 12.05.01
        ok 2 - 12.05.02
        1..2
    ok 147 - 12.05 - [31muglify[39m - ignores on used id's # time=9.578ms
    
    # Subtest: 12.06 - [31muglify[39m - ignores on used classes
        ok 1 - 12.06.01
        ok 2 - 12.06.02
        1..2
    ok 148 - 12.06 - [31muglify[39m - ignores on used classes # time=12.883ms
    
    # Subtest: 12.07 - [31muglify[39m - ignored values don't appear among uglified legend entries
        ok 1 - 12.07.01
        ok 2 - 12.07.02
        ok 3 - 12.07.03
        ok 4 - 12.07.04
        1..4
    ok 149 - 12.07 - [31muglify[39m - ignored values don't appear among uglified legend entries # time=17.745ms
    
    # Subtest: 13.01 - [36mopts.reportProgressFunc[39m - calls the progress function
        ok 1 - 13.01.01 - default behaviour
        ok 2 - 13.01.02
        ok 3 - 13.01.03
        ok 4 - expected to throw
        ok 5 - should match pattern provided
        ok 6 - (unnamed test)
        ok 7 - 13.01.04 - counter called
        1..7
    ok 150 - 13.01 - [36mopts.reportProgressFunc[39m - calls the progress function # time=107.443ms
    
    # Subtest: 13.02 - [36mopts.reportProgressFunc[39m - reports when passing at 50% only
        ok 1 - expected to throw
        ok 2 - should match pattern provided
        1..2
    ok 151 - 13.02 - [36mopts.reportProgressFunc[39m - reports when passing at 50% only # time=4.834ms
    
    # Subtest: 13.03 - [36mopts.reportProgressFunc[39m - adjusted from-to range
        ok 1 - (unnamed test)
        ok 2 - expect truthy value
        ok 3 - expect truthy value
        ok 4 - expect truthy value
        ok 5 - expect truthy value
        ok 6 - expect truthy value
        ok 7 - expect truthy value
        ok 8 - expect truthy value
        ok 9 - expect truthy value
        ok 10 - expect truthy value
        ok 11 - expect truthy value
        ok 12 - expect truthy value
        ok 13 - expect truthy value
        ok 14 - expect truthy value
        ok 15 - expect truthy value
        ok 16 - expect truthy value
        ok 17 - expect truthy value
        ok 18 - expect truthy value
        ok 19 - expect truthy value
        ok 20 - expect truthy value
        ok 21 - expect truthy value
        ok 22 - expect truthy value
        ok 23 - expect truthy value
        ok 24 - expect truthy value
        ok 25 - expect truthy value
        ok 26 - expect truthy value
        ok 27 - expect truthy value
        ok 28 - expect truthy value
        ok 29 - expect truthy value
        ok 30 - expect truthy value
        ok 31 - expect truthy value
        ok 32 - expect truthy value
        ok 33 - expect truthy value
        ok 34 - expect truthy value
        ok 35 - expect truthy value
        ok 36 - expect truthy value
        ok 37 - expect truthy value
        ok 38 - expect truthy value
        ok 39 - expect truthy value
        ok 40 - expect truthy value
        ok 41 - expect truthy value
        ok 42 - expect truthy value
        ok 43 - expect truthy value
        ok 44 - expect truthy value
        ok 45 - expect truthy value
        ok 46 - expect truthy value
        ok 47 - expect truthy value
        ok 48 - expect truthy value
        ok 49 - expect truthy value
        ok 50 - expect truthy value
        ok 51 - expect truthy value
        ok 52 - expect truthy value
        ok 53 - expect truthy value
        ok 54 - expect truthy value
        ok 55 - expect truthy value
        ok 56 - expect truthy value
        ok 57 - expect truthy value
        ok 58 - expect truthy value
        ok 59 - expect truthy value
        ok 60 - expect truthy value
        ok 61 - expect truthy value
        ok 62 - expect truthy value
        ok 63 - expect truthy value
        ok 64 - expect truthy value
        ok 65 - expect truthy value
        ok 66 - expect truthy value
        ok 67 - should be equal
        ok 68 - 13.03
        1..68
    ok 152 - 13.03 - [36mopts.reportProgressFunc[39m - adjusted from-to range # time=507.014ms
    
    # Subtest: 14.01 - [35mquoteless attr[39m - class - retained, quoteless attr is the last
        ok 1 - 14.01
        1..1
    ok 153 - 14.01 - [35mquoteless attr[39m - class - retained, quoteless attr is the last # time=5.102ms
    
    # Subtest: 14.02 - [35mquoteless attr[39m - class - retained, just patches up
        ok 1 - 14.02
        1..1
    ok 154 - 14.02 - [35mquoteless attr[39m - class - retained, just patches up # time=4.827ms
    
    # Subtest: 14.03 - [35mquoteless attr[39m - class - removed
        ok 1 - 14.03
        1..1
    ok 155 - 14.03 - [35mquoteless attr[39m - class - removed # time=8.202ms
    
    # Subtest: 14.04 - [35mquoteless attr[39m - id - retained, quoteless attr is the last
        ok 1 - 14.04
        1..1
    ok 156 - 14.04 - [35mquoteless attr[39m - id - retained, quoteless attr is the last # time=5.098ms
    
    # Subtest: 14.05 - [35mquoteless attr[39m - id - retained, just patches up
        ok 1 - 14.05
        1..1
    ok 157 - 14.05 - [35mquoteless attr[39m - id - retained, just patches up # time=7.933ms
    
    # Subtest: 14.06 - [35mquoteless attr[39m - id - removed
        ok 1 - 14.06
        1..1
    ok 158 - 14.06 - [35mquoteless attr[39m - id - removed # time=4.359ms
    
    # Subtest: 14.07 - [35mquoteless attr[39m - class - one removed, one retainer quoteless neighbour - dashes
        ok 1 - 14.07
        1..1
    ok 159 - 14.07 - [35mquoteless attr[39m - class - one removed, one retainer quoteless neighbour - dashes # time=6.6ms
    
    # Subtest: 14.08 - [35mquoteless attr[39m - class - one removed, one retainer quoteless neighbour - dashes
        ok 1 - 14.08
        1..1
    ok 160 - 14.08 - [35mquoteless attr[39m - class - one removed, one retainer quoteless neighbour - dashes # time=5.993ms
    
    # Subtest: 14.09 - [35mquoteless attr[39m - class - one removed, one retainer quoteless neighbour - underscores
        ok 1 - 14.09
        1..1
    ok 161 - 14.09 - [35mquoteless attr[39m - class - one removed, one retainer quoteless neighbour - underscores # time=6.822ms
    
    # Subtest: 14.10 - [35mquoteless attr[39m - id - one removed, one retainer quoteless neighbour - underscores
        ok 1 - 14.10
        1..1
    ok 162 - 14.10 - [35mquoteless attr[39m - id - one removed, one retainer quoteless neighbour - underscores # time=7.943ms
    
    # Subtest: 14.11 - [35mquoteless attr[39m - trailing whitespace control
        ok 1 - 14.11
        1..1
    ok 163 - 14.11 - [35mquoteless attr[39m - trailing whitespace control # time=6.182ms
    
    # Subtest: 15.01 - [34mbracket notation[39m - classes
        ok 1 - 15.01
        1..1
    ok 164 - 15.01 - [34mbracket notation[39m - classes # time=11.745ms
    
    # Subtest: 15.02 - [34mbracket notation[39m - bracket notation - id's
        ok 1 - 15.02
        1..1
    ok 165 - 15.02 - [34mbracket notation[39m - bracket notation - id's # time=8.963ms
    
    1..165
    # time=5845.831ms
}

ok 2 - test/umd-test.js # time=30.019ms {
    # Subtest: UMD build works fine
        ok 1 - should be equal
        ok 2 - expect truthy value
        ok 3 - should match pattern provided
        1..3
    ok 1 - UMD build works fine # time=22.215ms
    
    1..1
    # time=30.019ms
}

1..2
