TAP version 13
# Subtest: test/test.js
    # Subtest: 1.1 - replace letter with letter
        ok 1 - test 1.1
        ok 2 - test 1.1
        1..2
    ok 1 - 1.1 - replace letter with letter # time=16.28ms
    
    # Subtest: 1.2 - replace 1 emoji with 1 emoji
        ok 1 - test 1.2
        1..1
    ok 2 - 1.2 - replace 1 emoji with 1 emoji # time=4.766ms
    
    # Subtest: 1.3 - replace 3 consecutive emoji with emoji
        ok 1 - test 1.3
        1..1
    ok 3 - 1.3 - replace 3 consecutive emoji with emoji # time=5.085ms
    
    # Subtest: 1.4 - gorilla emoji - in escaped JS
        ok 1 - test 1.4 - http://unicode-table.com/en/1F98D/
        1..1
    ok 4 - 1.4 - gorilla emoji - in escaped JS # time=13.127ms
    
    # Subtest: 1.5 - gorilla emoji - in raw
        ok 1 - test 1.5 - http://unicode-table.com/en/1F98D/
        1..1
    ok 5 - 1.5 - gorilla emoji - in raw # time=6.281ms
    
    # Subtest: 1.6 - won't find a letter
        ok 1 - test 1.6
        1..1
    ok 6 - 1.6 - won't find a letter # time=2.75ms
    
    # Subtest: 1.7 - won't find emoji, with new lines
        ok 1 - test 1.7
        1..1
    ok 7 - 1.7 - won't find emoji, with new lines # time=2.985ms
    
    # Subtest: 1.8 - replacement with new lines
        ok 1 - test 1.8
        1..1
    ok 8 - 1.8 - replacement with new lines # time=3.438ms
    
    # Subtest: 1.9 - multiple letter findings
        ok 1 - test 1.9
        1..1
    ok 9 - 1.9 - multiple letter findings # time=3.012ms
    
    # Subtest: 1.10 - single digit of string type replaced
        ok 1 - test 1.10
        1..1
    ok 10 - 1.10 - single digit of string type replaced # time=7.8ms
    
    # Subtest: 1.11 - single digit of integer type replaced
        ok 1 - test 1.11
        1..1
    ok 11 - 1.11 - single digit of integer type replaced # time=2.556ms
    
    # Subtest: 1.12 - source and replacement are of integer type
        ok 1 - test 1.12
        1..1
    ok 12 - 1.12 - source and replacement are of integer type # time=2.484ms
    
    # Subtest: 1.13 - all raw integers: source, replacement and searchFor
        ok 1 - test 1.13
        1..1
    ok 13 - 1.13 - all raw integers: source, replacement and searchFor # time=2.431ms
    
    # Subtest: 1.14 - multiple consecutive letter replacements
        ok 1 - test 1.14
        1..1
    ok 14 - 1.14 - multiple consecutive letter replacements # time=2.401ms
    
    # Subtest: 2.1 - left maybe found
        ok 1 - test 2.1
        ok 2 - test 2.1
        1..2
    ok 15 - 2.1 - left maybe found # time=7.031ms
    
    # Subtest: 2.2 - two replacements with one leftmaybe, nearby
        ok 1 - test 2.2
        ok 2 - test 2.2
        1..2
    ok 16 - 2.2 - two replacements with one leftmaybe, nearby # time=3.908ms
    
    # Subtest: 2.3 - two consecutive maybes found/replaced
        ok 1 - test 2.3
        ok 2 - test 2.3
        1..2
    ok 17 - 2.3 - two consecutive maybes found/replaced # time=4.198ms
    
    # Subtest: 2.4 - futile left maybe
        ok 1 - test 2.4
        ok 2 - test 2.4
        1..2
    ok 18 - 2.4 - futile left maybe # time=4.219ms
    
    # Subtest: 2.5 - line break as search string
        ok 1 - test 2.5
        1..1
    ok 19 - 2.5 - line break as search string # time=4.138ms
    
    # Subtest: 2.6 - line break as both searchFor and maybe replaced
        ok 1 - test 2.6
        ok 2 - test 2.6
        1..2
    ok 20 - 2.6 - line break as both searchFor and maybe replaced # time=4.106ms
    
    # Subtest: 2.7 - operations on line breaks only
        ok 1 - test 2.7
        1..1
    ok 21 - 2.7 - operations on line breaks only # time=2.335ms
    
    # Subtest: 2.8 - three left maybes (found)
        ok 1 - test 2.8
        1..1
    ok 22 - 2.8 - three left maybes (found) # time=2.566ms
    
    # Subtest: 2.9 - three left maybes (not found)
        ok 1 - test 2.9
        1..1
    ok 23 - 2.9 - three left maybes (not found) # time=2.427ms
    
    # Subtest: 2.10 - three left maybes (multiple hungry finds)
        ok 1 - test 2.10.1
        ok 2 - test 2.10.2
        ok 3 - test 2.10.3
        1..3
    ok 24 - 2.10 - three left maybes (multiple hungry finds) # time=6.715ms
    
    # Subtest: 2.11 - sneaky array conversion situation
        ok 1 - test 2.11
        1..1
    ok 25 - 2.11 - sneaky array conversion situation # time=3.145ms
    
    # Subtest: 2.12 - sneaky array conversion situation
        ok 1 - test 2.12
        1..1
    ok 26 - 2.12 - sneaky array conversion situation # time=2.312ms
    
    # Subtest: 2.13 - normal words, few of them, leftMaybe as array
        ok 1 - test 2.13
        1..1
    ok 27 - 2.13 - normal words, few of them, leftMaybe as array # time=3.281ms
    
    # Subtest: 2.14 - normal words, few of them, leftMaybe as array
        ok 1 - test 2.14
        1..1
    ok 28 - 2.14 - normal words, few of them, leftMaybe as array # time=2.595ms
    
    # Subtest: 2.15 - leftMaybe is array, but with only 1 null value
        ok 1 - test 2.15
        1..1
    ok 29 - 2.15 - leftMaybe is array, but with only 1 null value # time=2.325ms
    
    # Subtest: 2.16 - leftMaybe is array, but with only 1 null value
        ok 1 - test 2.16
        1..1
    ok 30 - 2.16 - leftMaybe is array, but with only 1 null value # time=2.389ms
    
    # Subtest: 2.17 - leftMaybe is couple integers in an array
        ok 1 - test 2.17
        1..1
    ok 31 - 2.17 - leftMaybe is couple integers in an array # time=9.368ms
    
    # Subtest: 2.18 - leftMaybe is couple integers in an array
        ok 1 - test 2.18
        1..1
    ok 32 - 2.18 - leftMaybe is couple integers in an array # time=6.258ms
    
    # Subtest: 2.19 - sneaky case of overlapping leftMaybes
        ok 1 - test 2.19.1 - no flag
        ok 2 - test 2.19.2 - varying case
        ok 3 - test 2.19.3
        1..3
    ok 33 - 2.19 - sneaky case of overlapping leftMaybes # time=8.859ms
    
    # Subtest: 3.1 - right maybe found
        ok 1 - test 3.1.1
        ok 2 - test 3.1.2
        1..2
    ok 34 - 3.1 - right maybe found # time=13.027ms
    
    # Subtest: 3.2 - two replacements with one rightmaybe, nearby
        ok 1 - test 3.2.1
        ok 2 - test 3.2.2
        1..2
    ok 35 - 3.2 - two replacements with one rightmaybe, nearby # time=14.632ms
    
    # Subtest: 3.3 - two consecutive right maybes
        ok 1 - test 3.3.1
        ok 2 - test 3.3.2
        1..2
    ok 36 - 3.3 - two consecutive right maybes # time=14.953ms
    
    # Subtest: 3.4 - futile right maybe
        ok 1 - test 3.4.1
        ok 2 - test 3.4.2
        1..2
    ok 37 - 3.4 - futile right maybe # time=9.328ms
    
    # Subtest: 3.5 - \n as search string plus right maybe
        ok 1 - test 3.5.1
        ok 2 - test 3.5.2
        1..2
    ok 38 - 3.5 - \n as search string plus right maybe # time=3.544ms
    
    # Subtest: 3.6 - \n as both searchFor and right maybe, replaced
        ok 1 - test 3.6.1
        ok 2 - test 3.6.2
        1..2
    ok 39 - 3.6 - \n as both searchFor and right maybe, replaced # time=3.508ms
    
    # Subtest: 3.7 - rightMaybe with line breaks
        ok 1 - test 3.7.1
        ok 2 - test 3.7.2
        1..2
    ok 40 - 3.7 - rightMaybe with line breaks # time=3.396ms
    
    # Subtest: 3.8 - specific case of semi infinite loop with maybe
        ok 1 - test 3.8.1
        ok 2 - test 3.8.2
        1..2
    ok 41 - 3.8 - specific case of semi infinite loop with maybe # time=3.62ms
    
    # Subtest: 3.9 - three right maybes (some found)
        ok 1 - test 3.9
        1..1
    ok 42 - 3.9 - three right maybes (some found) # time=2.184ms
    
    # Subtest: 3.10 - three right maybes (searchFor not found)
        ok 1 - test 3.10
        1..1
    ok 43 - 3.10 - three right maybes (searchFor not found) # time=7.673ms
    
    # Subtest: 3.11 - three right maybes (maybes not found)
        ok 1 - test 3.11
        1..1
    ok 44 - 3.11 - three right maybes (maybes not found) # time=6.204ms
    
    # Subtest: 3.12.1 - three right maybes (multiple hungry finds)
        ok 1 - test 3.12.1
        1..1
    ok 45 - 3.12.1 - three right maybes (multiple hungry finds) # time=5.215ms
    
    # Subtest: 3.13 - three right maybes (multiple hungry finds)
        ok 1 - test 3.13
        1..1
    ok 46 - 3.13 - three right maybes (multiple hungry finds) # time=2.412ms
    
    # Subtest: 3.14 - three right maybes (multiple hungry finds)
        ok 1 - test 3.14
        1..1
    ok 47 - 3.14 - three right maybes (multiple hungry finds) # time=14.749ms
    
    # Subtest: 3.15 - three right maybes (multiple hungry finds)
        ok 1 - test 3.15
        1..1
    ok 48 - 3.15 - three right maybes (multiple hungry finds) # time=34.629ms
    
    # Subtest: 3.16 - three right maybes (multiple hungry finds)
        ok 1 - test 3.16
        1..1
    ok 49 - 3.16 - three right maybes (multiple hungry finds) # time=18.649ms
    
    # Subtest: 3.17 - three right maybes (multiple hungry finds)
        ok 1 - test 3.17
        1..1
    ok 50 - 3.17 - three right maybes (multiple hungry finds) # time=2.301ms
    
    # Subtest: 3.18 - three right maybes (multiple hungry finds)
        ok 1 - test 3.18
        1..1
    ok 51 - 3.18 - three right maybes (multiple hungry finds) # time=16.783ms
    
    # Subtest: 3.19 - sneaky array conversion situation
        ok 1 - test 3.19-1
        ok 2 - test 3.19-2
        1..2
    ok 52 - 3.19 - sneaky array conversion situation # time=7.499ms
    
    # Subtest: 3.20 - normal words, few of them, rightMaybe as array
        ok 1 - test 3.20
        1..1
    ok 53 - 3.20 - normal words, few of them, rightMaybe as array # time=12.022ms
    
    # Subtest: 3.21 - rightMaybe is array, but with only 1 null value
        ok 1 - test 3.21
        1..1
    ok 54 - 3.21 - rightMaybe is array, but with only 1 null value # time=2.17ms
    
    # Subtest: 3.22 - rightMaybe is couple integers in an array
        ok 1 - test 3.22
        1..1
    ok 55 - 3.22 - rightMaybe is couple integers in an array # time=2.088ms
    
    # Subtest: 3.23 - sneaky case of overlapping rightMaybes
        ok 1 - test 3.23
        1..1
    ok 56 - 3.23 - sneaky case of overlapping rightMaybes # time=2.102ms
    
    # Subtest: 3.24 - case-insensitive flag
        ok 1 - test 3.24
        1..1
    ok 57 - 3.24 - case-insensitive flag # time=2.285ms
    
    # Subtest: 4.1 - left and right maybes as emoji
        ok 1 - test 4.1.1
        ok 2 - test 4.1.2
        1..2
    ok 58 - 4.1 - left and right maybes as emoji # time=5.031ms
    
    # Subtest: 4.2 - left and right maybes as text
        ok 1 - test 4.2.1
        ok 2 - test 4.2.2
        1..2
    ok 59 - 4.2 - left and right maybes as text # time=3.517ms
    
    # Subtest: 4.3 - left+right maybes, middle & end of word #1
        ok 1 - test 4.3
        1..1
    ok 60 - 4.3 - left+right maybes, middle & end of word #1 # time=4.95ms
    
    # Subtest: 4.4 - left+right maybes, middle & end of word #2
        ok 1 - test 4.4
        1..1
    ok 61 - 4.4 - left+right maybes, middle & end of word #2 # time=2.239ms
    
    # Subtest: 4.5 - normal words
        ok 1 - test 4.5
        1..1
    ok 62 - 4.5 - normal words # time=2.187ms
    
    # Subtest: 5.1 - both outsides only, emoji, found
        ok 1 - test 5.1.1
        ok 2 - test 5.1.2
        1..2
    ok 63 - 5.1 - both outsides only, emoji, found # time=3.497ms
    
    # Subtest: 5.2 - both outsides only, emoji, not found
        ok 1 - test 5.2
        1..1
    ok 64 - 5.2 - both outsides only, emoji, not found # time=2.127ms
    
    # Subtest: 5.3 - both outsides, emoji, not found
        ok 1 - test 5.3
        1..1
    ok 65 - 5.3 - both outsides, emoji, not found # time=2.068ms
    
    # Subtest: 5.4 - both outsides, emoji, not found #1
        ok 1 - test 5.4
        1..1
    ok 66 - 5.4 - both outsides, emoji, not found #1 # time=5.34ms
    
    # Subtest: 5.5 - both outsides, emoji, not found #2
        ok 1 - test 5.5
        1..1
    ok 67 - 5.5 - both outsides, emoji, not found #2 # time=1.98ms
    
    # Subtest: 5.6 - line break as rightOutside, found
        ok 1 - test 5.6
        1..1
    ok 68 - 5.6 - line break as rightOutside, found # time=2.024ms
    
    # Subtest: 5.7 - line breaks as both outsides
        ok 1 - test 5.7
        1..1
    ok 69 - 5.7 - line breaks as both outsides # time=10.186ms
    
    # Subtest: 5.8 - \n as outsides, replacement = undefined
        ok 1 - test 5.8
        1..1
    ok 70 - 5.8 - \n as outsides, replacement = undefined # time=6.993ms
    
    # Subtest: 5.9 - line breaks as outsides, replacement = Bool
        ok 1 - test 5.9
        1..1
    ok 71 - 5.9 - line breaks as outsides, replacement = Bool # time=1.991ms
    
    # Subtest: 5.10 - line breaks as outsides, replacement = null
        ok 1 - test 5.10
        1..1
    ok 72 - 5.10 - line breaks as outsides, replacement = null # time=1.951ms
    
    # Subtest: 5.11 - left outside requirement not satisfied for replacement to happen
        ok 1 - test 5.11 - did not replace because of o.leftOutside
        1..1
    ok 73 - 5.11 - left outside requirement not satisfied for replacement to happen # time=3.4ms
    
    # Subtest: 5.12 - right outside requirement not satisfied for replacement to happen
        ok 1 - test 5.12 - did not replace because of o.rightOutside
        1..1
    ok 74 - 5.12 - right outside requirement not satisfied for replacement to happen # time=1.957ms
    
    # Subtest: 6.1 - maybes and outsides, emoji - full set
        ok 1 - test 6.1
        1..1
    ok 75 - 6.1 - maybes and outsides, emoji - full set # time=1.958ms
    
    # Subtest: 6.2 - maybes + outsides - 1 of maybes not found #1
        ok 1 - test 6.2
        1..1
    ok 76 - 6.2 - maybes + outsides - 1 of maybes not found #1 # time=1.89ms
    
    # Subtest: 6.3 - maybes + outsides - 1 of maybes not found #2
        ok 1 - test 6.3
        1..1
    ok 77 - 6.3 - maybes + outsides - 1 of maybes not found #2 # time=1.963ms
    
    # Subtest: 6.4 - maybes and outsides, emoji - neither of maybes
        ok 1 - test 6.4
        1..1
    ok 78 - 6.4 - maybes and outsides, emoji - neither of maybes # time=2.025ms
    
    # Subtest: 6.5 - multiple findings with maybes and outsides
        ok 1 - test 6.5
        1..1
    ok 79 - 6.5 - multiple findings with maybes and outsides # time=10.002ms
    
    # Subtest: 6.6 - multiple findings with maybes and not-outsides
        ok 1 - test 6.6
        1..1
    ok 80 - 6.6 - multiple findings with maybes and not-outsides # time=6.2ms
    
    # Subtest: 6.7 - maybes and outsides, arrays
        ok 1 - test 6.7
        1..1
    ok 81 - 6.7 - maybes and outsides, arrays # time=6.796ms
    
    # Subtest: 7.1 - one rightOutside, not found
        ok 1 - test 7.1
        1..1
    ok 82 - 7.1 - one rightOutside, not found # time=4.289ms
    
    # Subtest: 7.2 - one leftOutside, not found
        ok 1 - test 7.2
        1..1
    ok 83 - 7.2 - one leftOutside, not found # time=1.932ms
    
    # Subtest: 7.3 - one leftOutside, not found + null replacement
        ok 1 - test 7.3
        1..1
    ok 84 - 7.3 - one leftOutside, not found + null replacement # time=1.938ms
    
    # Subtest: 7.4 - leftOutside and replacement are null
        ok 1 - test 7.4
        1..1
    ok 85 - 7.4 - leftOutside and replacement are null # time=1.937ms
    
    # Subtest: 7.5 - left outside and replacement are undefined
        ok 1 - test 7.5
        1..1
    ok 86 - 7.5 - left outside and replacement are undefined # time=1.853ms
    
    # Subtest: 8.1 - infinite loop, no maybes, emoji
        ok 1 - test 8.1
        1..1
    ok 87 - 8.1 - infinite loop, no maybes, emoji # time=3.768ms
    
    # Subtest: 8.2 - infinite loop, maybes, multiple findings, emoji
        ok 1 - test 8.2
        1..1
    ok 88 - 8.2 - infinite loop, maybes, multiple findings, emoji # time=2.008ms
    
    # Subtest: 8.3 - infinite loop protection, emoji replaced with itself
        ok 1 - test 8.3
        1..1
    ok 89 - 8.3 - infinite loop protection, emoji replaced with itself # time=2.161ms
    
    # Subtest: 8.4 - infinite loop protection, right outside
        ok 1 - test 8.4
        1..1
    ok 90 - 8.4 - infinite loop protection, right outside # time=2.051ms
    
    # Subtest: 8.5 - infinite loop protection, multiples
        ok 1 - test 8.5
        1..1
    ok 91 - 8.5 - infinite loop protection, multiples # time=2.123ms
    
    # Subtest: 8.6 - simple infinite loop case
        ok 1 - test 8.6
        1..1
    ok 92 - 8.6 - simple infinite loop case # time=1.982ms
    
    # Subtest: 8.7 - infinite loop, not found
        ok 1 - test 8.7
        1..1
    ok 93 - 8.7 - infinite loop, not found # time=3.361ms
    
    # Subtest: 9.1 - source present, missing searchFor
        ok 1 - test 9.1
        1..1
    ok 94 - 9.1 - source present, missing searchFor # time=2.056ms
    
    # Subtest: 9.2 - everything is missing
        ok 1 - test 9.2
        1..1
    ok 95 - 9.2 - everything is missing # time=2.049ms
    
    # Subtest: 9.3 - everything seriously missing
        ok 1 - test 9.3
        1..1
    ok 96 - 9.3 - everything seriously missing # time=1.904ms
    
    # Subtest: 9.4 - everything extremely seriously missing
        ok 1 - test 9.4
        1..1
    ok 97 - 9.4 - everything extremely seriously missing # time=1.84ms
    
    # Subtest: 9.5 - everything truly extremely seriously missing
        ok 1 - test 9.5
        1..1
    ok 98 - 9.5 - everything truly extremely seriously missing # time=1.102ms
    
    # Subtest: 9.6 - everything really truly extremely seriously missing
        ok 1 - test 9.6
        1..1
    ok 99 - 9.6 - everything really truly extremely seriously missing # time=1.824ms
    
    # Subtest: 9.7 - leftOutsideNot blocking rightOutsideNot being empty
        ok 1 - test 9.7
        1..1
    ok 100 - 9.7 - leftOutsideNot blocking rightOutsideNot being empty # time=2.068ms
    
    # Subtest: 9.8 - leftOutsideNot is blank array
        ok 1 - test 9.8
        1..1
    ok 101 - 9.8 - leftOutsideNot is blank array # time=1.997ms
    
    # Subtest: 9.9 - missing key in properties obj
        ok 1 - test 9.9
        1..1
    ok 102 - 9.9 - missing key in properties obj # time=2.816ms
    
    # Subtest: 10.1 - empty string as replacement = deletion mode
        ok 1 - test 10.1
        1..1
    ok 103 - 10.1 - empty string as replacement = deletion mode # time=2.052ms
    
    # Subtest: 10.2 - null as replacement = deletion mode
        ok 1 - test 10.2
        1..1
    ok 104 - 10.2 - null as replacement = deletion mode # time=1.933ms
    
    # Subtest: 10.3 - replacement bool, nothing left
        ok 1 - test 10.3
        1..1
    ok 105 - 10.3 - replacement bool, nothing left # time=2.984ms
    
    # Subtest: 10.4 - replacement Bool, nothing left, searchFor Integer
        ok 1 - test 10.4
        1..1
    ok 106 - 10.4 - replacement Bool, nothing left, searchFor Integer # time=1.855ms
    
    # Subtest: 10.5 - nothing left, replacement undefined
        ok 1 - test 10.5
        1..1
    ok 107 - 10.5 - nothing left, replacement undefined # time=1.944ms
    
    # Subtest: 10.6 - nothing left - more undefined
        ok 1 - test 10.6
        1..1
    ok 108 - 10.6 - nothing left - more undefined # time=1.931ms
    
    # Subtest: 10.7 - emoji, null replacement, both outsides found
        ok 1 - test 10.7
        1..1
    ok 109 - 10.7 - emoji, null replacement, both outsides found # time=1.878ms
    
    # Subtest: 10.8 - raw integers everywhere must work too
        ok 1 - test 10.8
        1..1
    ok 110 - 10.8 - raw integers everywhere must work too # time=5.236ms
    
    # Subtest: 10.9 - searchFor is an array of 1 element
        ok 1 - test 10.9
        1..1
    ok 111 - 10.9 - searchFor is an array of 1 element # time=4.755ms
    
    # Subtest: 10.10 - searchFor is an array of few elements (no find)
        ok 1 - test 10.10
        1..1
    ok 112 - 10.10 - searchFor is an array of few elements (no find) # time=18.079ms
    
    # Subtest: 10.11 - searchFor is an array of few elements (won't work)
        ok 1 - test 10.11
        1..1
    ok 113 - 10.11 - searchFor is an array of few elements (won't work) # time=8.394ms
    
    # Subtest: 11.1 - left and right outsides as arrays (majority found)
        ok 1 - test 11.1
        1..1
    ok 114 - 11.1 - left and right outsides as arrays (majority found) # time=5.729ms
    
    # Subtest: 11.2 - left and right outsides as arrays (one found)
        ok 1 - test 11.2
        1..1
    ok 115 - 11.2 - left and right outsides as arrays (one found) # time=2.089ms
    
    # Subtest: 11.3 - outsides as arrays, beyond found maybes
        ok 1 - test 11.3
        1..1
    ok 116 - 11.3 - outsides as arrays, beyond found maybes # time=2.083ms
    
    # Subtest: 11.4 - outsides as arrays blocking maybes
        ok 1 - test 11.4
        1..1
    ok 117 - 11.4 - outsides as arrays blocking maybes # time=2.011ms
    
    # Subtest: 11.5 - maybes matching outsides, blocking them
        ok 1 - test 11.5
        1..1
    ok 118 - 11.5 - maybes matching outsides, blocking them # time=2.268ms
    
    # Subtest: 11.6 - maybes matching outsides, blocking them
        ok 1 - test 11.6
        1..1
    ok 119 - 11.6 - maybes matching outsides, blocking them # time=2.034ms
    
    # Subtest: 11.6 - maybes matching outsides, found
        ok 1 - test 11.6
        1..1
    ok 120 - 11.6 - maybes matching outsides, found # time=2.052ms
    
    # Subtest: 11.6 - maybes matching outsides, mismatching
        ok 1 - test 11.6
        1..1
    ok 121 - 11.6 - maybes matching outsides, mismatching # time=2.063ms
    
    # Subtest: 11.7 - rightOutside & with case-insensitive flag
        ok 1 - test 11.7.1 - nothing matches, without flag
        ok 2 - test 11.7.2 - nothing matches, with flag
        ok 3 - test 11.7.3 - one match, with flag
        1..3
    ok 122 - 11.7 - rightOutside & with case-insensitive flag # time=4.211ms
    
    # Subtest: 12.1 - rightOutsideNot satisfied thus not replaced
        ok 1 - test 12.1.1
        ok 2 - test 12.1.2
        1..2
    ok 123 - 12.1 - rightOutsideNot satisfied thus not replaced # time=2.828ms
    
    # Subtest: 12.2 - outsideNot left satisfied thus not replaced
        ok 1 - test 12.2.1
        ok 2 - test 12.2.2
        1..2
    ok 124 - 12.2 - outsideNot left satisfied thus not replaced # time=4.928ms
    
    # Subtest: 12.3 - outsideNot's satisfied thus not replaced
        ok 1 - test 12.3
        1..1
    ok 125 - 12.3 - outsideNot's satisfied thus not replaced # time=4.426ms
    
    # Subtest: 12.4 - outsideNot's not satisfied, with 1 maybe replaced
        ok 1 - test 12.4
        1..1
    ok 126 - 12.4 - outsideNot's not satisfied, with 1 maybe replaced # time=1.963ms
    
    # Subtest: 12.5 - leftOutsideNot blocked positive leftMaybe
        ok 1 - test 12.5
        1..1
    ok 127 - 12.5 - leftOutsideNot blocked positive leftMaybe # time=1.827ms
    
    # Subtest: 12.6 - rightOutsideNot blocked both L-R maybes
        ok 1 - test 12.6
        1..1
    ok 128 - 12.6 - rightOutsideNot blocked both L-R maybes # time=1.97ms
    
    # Subtest: 12.7 - rightOutsideNot last char goes outside
        ok 1 - test 12.7
        1..1
    ok 129 - 12.7 - rightOutsideNot last char goes outside # time=2.001ms
    
    # Subtest: 12.8 - right maybe is last char, outsideNot satisfied
        ok 1 - test 12.8
        1..1
    ok 130 - 12.8 - right maybe is last char, outsideNot satisfied # time=2.39ms
    
    # Subtest: 12.9 - real life scenario, missing semicol on nbsp #1
        ok 1 - test 12.9
        1..1
    ok 131 - 12.9 - real life scenario, missing semicol on nbsp #1 # time=1.997ms
    
    # Subtest: 12.10 - real life scenario, missing semicol on nbsp #2
        ok 1 - test 12.10
        1..1
    ok 132 - 12.10 - real life scenario, missing semicol on nbsp #2 # time=5.899ms
    
    # Subtest: 12.11 - real life scenario, missing ampersand, text
        ok 1 - test 12.11
        1..1
    ok 133 - 12.11 - real life scenario, missing ampersand, text # time=6.351ms
    
    # Subtest: 12.12 - as before but with emoji instead
        ok 1 - test 12.12
        1..1
    ok 134 - 12.12 - as before but with emoji instead # time=6.01ms
    
    # Subtest: 12.13 - rightOutsideNot with L-R maybes
        ok 1 - test 12.13
        1..1
    ok 135 - 12.13 - rightOutsideNot with L-R maybes # time=5.511ms
    
    # Subtest: 12.14 - all of 'em #1
        ok 1 - test 12.14
        1..1
    ok 136 - 12.14 - all of 'em #1 # time=2.384ms
    
    # Subtest: 12.14 - all of 'em #2
        ok 1 - test 12.14
        1..1
    ok 137 - 12.14 - all of 'em #2 # time=3.336ms
    
    # Subtest: 13.1 - readme example #1
        ok 1 - test 13.1
        1..1
    ok 138 - 13.1 - readme example #1 # time=1.827ms
    
    # Subtest: 13.2 - readme example #2
        ok 1 - test 13.2
        1..1
    ok 139 - 13.2 - readme example #2 # time=1.932ms
    
    # Subtest: 13.3 - readme example #3
        ok 1 - test 13.3
        1..1
    ok 140 - 13.3 - readme example #3 # time=2.056ms
    
    # Subtest: 13.4 - readme example #4
        ok 1 - test 13.4
        1..1
    ok 141 - 13.4 - readme example #4 # time=1.966ms
    
    # Subtest: 13.5 - readme example #5
        ok 1 - test 13.5
        1..1
    ok 142 - 13.5 - readme example #5 # time=1.916ms
    
    # Subtest: 13.6 - readme example #6
        ok 1 - test 13.6
        1..1
    ok 143 - 13.6 - readme example #6 # time=1.961ms
    
    # Subtest: 14.1 - special case #1
        ok 1 - test 14.1
        1..1
    ok 144 - 14.1 - special case #1 # time=1.809ms
    
    # Subtest: 14.2 - special case #2
        ok 1 - test 14.1
        1..1
    ok 145 - 14.2 - special case #2 # time=2.752ms
    
    # Subtest: 15.1 - case-insensitive flag works
        ok 1 - test 15.1.1 - all ok, flag off
        ok 2 - test 15.1.2 - case mismatch, nothing replaced because flag's off
        ok 3 - test 15.1.3 - case mismatch, but flag allows it, so replace happens
        ok 4 - test 15.1.4 - case-insensitive flag, multiple replacements
        1..4
    ok 146 - 15.1 - case-insensitive flag works # time=4.949ms
    
    # Subtest: test 15.2 - case-insensitive leftMaybe
        ok 1 - test 15.2.1 - flag off - testing leftMaybe only
        ok 2 - test 15.2.2 - flag on - testing leftMaybe only
        ok 3 - test 15.2.3 - flag on - testing searchFor + leftMaybe
        ok 4 - test 15.2.4 - flag on - testing searchFor + leftMaybe
        1..4
    ok 147 - test 15.2 - case-insensitive leftMaybe # time=7.221ms
    
    # Subtest: test 15.3 - case-insensitive rightMaybe
        ok 1 - test 15.3.1 - flag off - testing rightMaybe only
        ok 2 - test 15.3.2 - flag on - testing rightMaybe only
        ok 3 - test 15.3.3 - flag on - testing searchFor + rightMaybe
        ok 4 - test 15.3.4 - flag on - testing searchFor + rightMaybe
        1..4
    ok 148 - test 15.3 - case-insensitive rightMaybe # time=4.975ms
    
    # Subtest: test 15.4 - case-insensitive leftOutside
        ok 1 - test 15.4.1 - flag off - testing leftOutside only
        ok 2 - test 15.4.2 - flag on - testing leftOutside only
        ok 3 - test 15.4.3 - flag on - testing searchFor + leftOutside
        ok 4 - test 15.4.4 - flag on - testing searchFor + leftOutside
        1..4
    ok 149 - test 15.4 - case-insensitive leftOutside # time=4.847ms
    
    # Subtest: test 15.5 - case-insensitive rightOutside
        ok 1 - test 15.5.1 - flag off - testing rightOutside only
        ok 2 - test 15.5.2 - flag on - testing rightOutside only
        ok 3 - test 15.5.3 - flag on - testing searchFor + rightOutside
        ok 4 - test 15.5.4 - flag on - testing searchFor + rightOutside
        1..4
    ok 150 - test 15.5 - case-insensitive rightOutside # time=7.014ms
    
    # Subtest: test 15.6 - case-insensitive leftOutsideNot
        ok 1 - test 15.6.1 - flag off - testing leftOutsideNot only
        ok 2 - test 15.6.2 - flag on - testing leftOutsideNot only
        ok 3 - test 15.6.3 - flag on - testing searchFor + leftOutsideNot
        ok 4 - test 15.6.4 - flag on - testing searchFor + leftOutsideNot
        ok 5 - test 15.6.5 - flag on - testing searchFor + leftOutsideNot
        1..5
    ok 151 - test 15.6 - case-insensitive leftOutsideNot # time=6.13ms
    
    # Subtest: test 15.7 - case-insensitive rightOutsideNot
        ok 1 - test 15.7.1 - flag off - testing rightOutsideNot only
        ok 2 - test 15.7.2 - flag on - testing rightOutsideNot only
        ok 3 - test 15.7.3 - flag on - testing searchFor + rightOutsideNot
        ok 4 - test 15.7.4 - flag on - testing searchFor + rightOutsideNot
        ok 5 - test 15.7.5 - flag on - testing searchFor + rightOutsideNot
        1..5
    ok 152 - test 15.7 - case-insensitive rightOutsideNot # time=22.793ms
    
    1..152
    # time=1594.147ms
ok 1 - test/test.js # time=1594.147ms

1..1
# time=4265.745ms
