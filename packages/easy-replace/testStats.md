TAP version 13
ok 1 - test/test.js # time=2541.302ms {
    # Subtest: 1.1 - replace letter with letter
        ok 1 - test 1.1
        ok 2 - test 1.1
        1..2
    ok 1 - 1.1 - replace letter with letter # time=34.211ms
    
    # Subtest: 1.2 - replace 1 emoji with 1 emoji
        ok 1 - test 1.2
        1..1
    ok 2 - 1.2 - replace 1 emoji with 1 emoji # time=6.224ms
    
    # Subtest: 1.3 - replace 3 consecutive emoji with emoji
        ok 1 - test 1.3
        1..1
    ok 3 - 1.3 - replace 3 consecutive emoji with emoji # time=11.168ms
    
    # Subtest: 1.4 - gorilla emoji - in escaped JS
        ok 1 - test 1.4 - http://unicode-table.com/en/1F98D/
        1..1
    ok 4 - 1.4 - gorilla emoji - in escaped JS # time=12.731ms
    
    # Subtest: 1.5 - gorilla emoji - in raw
        ok 1 - test 1.5 - http://unicode-table.com/en/1F98D/
        1..1
    ok 5 - 1.5 - gorilla emoji - in raw # time=3.102ms
    
    # Subtest: 1.6 - won't find a letter
        ok 1 - test 1.6
        1..1
    ok 6 - 1.6 - won't find a letter # time=3.133ms
    
    # Subtest: 1.7 - won't find emoji, with new lines
        ok 1 - test 1.7
        1..1
    ok 7 - 1.7 - won't find emoji, with new lines # time=2.982ms
    
    # Subtest: 1.8 - replacement with new lines
        ok 1 - test 1.8
        1..1
    ok 8 - 1.8 - replacement with new lines # time=3.266ms
    
    # Subtest: 1.9 - multiple letter findings
        ok 1 - test 1.9
        1..1
    ok 9 - 1.9 - multiple letter findings # time=3.16ms
    
    # Subtest: 1.10 - single digit of string type replaced
        ok 1 - test 1.10
        1..1
    ok 10 - 1.10 - single digit of string type replaced # time=7.152ms
    
    # Subtest: 1.11 - single digit of integer type replaced
        ok 1 - test 1.11
        1..1
    ok 11 - 1.11 - single digit of integer type replaced # time=2.872ms
    
    # Subtest: 1.12 - source and replacement are of integer type
        ok 1 - test 1.12
        1..1
    ok 12 - 1.12 - source and replacement are of integer type # time=2.834ms
    
    # Subtest: 1.13 - all raw integers: source, replacement and searchFor
        ok 1 - test 1.13
        1..1
    ok 13 - 1.13 - all raw integers: source, replacement and searchFor # time=2.565ms
    
    # Subtest: 1.14 - multiple consecutive letter replacements
        ok 1 - test 1.14
        1..1
    ok 14 - 1.14 - multiple consecutive letter replacements # time=3.375ms
    
    # Subtest: 2.1 - left maybe found
        ok 1 - test 2.1
        ok 2 - test 2.1
        1..2
    ok 15 - 2.1 - left maybe found # time=5.528ms
    
    # Subtest: 2.2 - two replacements with one leftmaybe, nearby
        ok 1 - test 2.2
        ok 2 - test 2.2
        1..2
    ok 16 - 2.2 - two replacements with one leftmaybe, nearby # time=11.077ms
    
    # Subtest: 2.3 - two consecutive maybes found/replaced
        ok 1 - test 2.3
        ok 2 - test 2.3
        1..2
    ok 17 - 2.3 - two consecutive maybes found/replaced # time=5.354ms
    
    # Subtest: 2.4 - futile left maybe
        ok 1 - test 2.4
        ok 2 - test 2.4
        1..2
    ok 18 - 2.4 - futile left maybe # time=4.564ms
    
    # Subtest: 2.5 - line break as search string
        ok 1 - test 2.5
        1..1
    ok 19 - 2.5 - line break as search string # time=6.131ms
    
    # Subtest: 2.6 - line break as both searchFor and maybe replaced
        ok 1 - test 2.6
        ok 2 - test 2.6
        1..2
    ok 20 - 2.6 - line break as both searchFor and maybe replaced # time=7.035ms
    
    # Subtest: 2.7 - operations on line breaks only
        ok 1 - test 2.7
        1..1
    ok 21 - 2.7 - operations on line breaks only # time=2.714ms
    
    # Subtest: 2.8 - three left maybes (found)
        ok 1 - test 2.8
        1..1
    ok 22 - 2.8 - three left maybes (found) # time=2.909ms
    
    # Subtest: 2.9 - three left maybes (not found)
        ok 1 - test 2.9
        1..1
    ok 23 - 2.9 - three left maybes (not found) # time=2.925ms
    
    # Subtest: 2.10 - three left maybes (multiple hungry finds)
        ok 1 - test 2.10.1
        ok 2 - test 2.10.2
        ok 3 - test 2.10.3
        1..3
    ok 24 - 2.10 - three left maybes (multiple hungry finds) # time=17.785ms
    
    # Subtest: 2.11 - sneaky array conversion situation
        ok 1 - test 2.11
        1..1
    ok 25 - 2.11 - sneaky array conversion situation # time=3.232ms
    
    # Subtest: 2.12 - sneaky array conversion situation
        ok 1 - test 2.12
        1..1
    ok 26 - 2.12 - sneaky array conversion situation # time=2.863ms
    
    # Subtest: 2.13 - normal words, few of them, leftMaybe as array
        ok 1 - test 2.13
        1..1
    ok 27 - 2.13 - normal words, few of them, leftMaybe as array # time=3.55ms
    
    # Subtest: 2.14 - normal words, few of them, leftMaybe as array
        ok 1 - test 2.14
        1..1
    ok 28 - 2.14 - normal words, few of them, leftMaybe as array # time=2.661ms
    
    # Subtest: 2.15 - leftMaybe is array, but with only 1 null value
        ok 1 - test 2.15
        1..1
    ok 29 - 2.15 - leftMaybe is array, but with only 1 null value # time=2.796ms
    
    # Subtest: 2.16 - leftMaybe is array, but with only 1 null value
        ok 1 - test 2.16
        1..1
    ok 30 - 2.16 - leftMaybe is array, but with only 1 null value # time=2.76ms
    
    # Subtest: 2.17 - leftMaybe is couple integers in an array
        ok 1 - test 2.17
        1..1
    ok 31 - 2.17 - leftMaybe is couple integers in an array # time=9.554ms
    
    # Subtest: 2.18 - leftMaybe is couple integers in an array
        ok 1 - test 2.18
        1..1
    ok 32 - 2.18 - leftMaybe is couple integers in an array # time=4.102ms
    
    # Subtest: 2.19 - sneaky case of overlapping leftMaybes
        ok 1 - test 2.19.1 - no flag
        ok 2 - test 2.19.2 - varying case
        ok 3 - test 2.19.3
        1..3
    ok 33 - 2.19 - sneaky case of overlapping leftMaybes # time=11.196ms
    
    # Subtest: 3.1 - right maybe found
        ok 1 - test 3.1.1
        ok 2 - test 3.1.2
        1..2
    ok 34 - 3.1 - right maybe found # time=9.091ms
    
    # Subtest: 3.2 - two replacements with one rightmaybe, nearby
        ok 1 - test 3.2.1
        ok 2 - test 3.2.2
        1..2
    ok 35 - 3.2 - two replacements with one rightmaybe, nearby # time=5.845ms
    
    # Subtest: 3.3 - two consecutive right maybes
        ok 1 - test 3.3.1
        ok 2 - test 3.3.2
        1..2
    ok 36 - 3.3 - two consecutive right maybes # time=10.487ms
    
    # Subtest: 3.4 - futile right maybe
        ok 1 - test 3.4.1
        ok 2 - test 3.4.2
        1..2
    ok 37 - 3.4 - futile right maybe # time=5.405ms
    
    # Subtest: 3.5 - \n as search string plus right maybe
        ok 1 - test 3.5.1
        ok 2 - test 3.5.2
        1..2
    ok 38 - 3.5 - \n as search string plus right maybe # time=8.026ms
    
    # Subtest: 3.6 - \n as both searchFor and right maybe, replaced
        ok 1 - test 3.6.1
        ok 2 - test 3.6.2
        1..2
    ok 39 - 3.6 - \n as both searchFor and right maybe, replaced # time=4.505ms
    
    # Subtest: 3.7 - rightMaybe with line breaks
        ok 1 - test 3.7.1
        ok 2 - test 3.7.2
        1..2
    ok 40 - 3.7 - rightMaybe with line breaks # time=7.928ms
    
    # Subtest: 3.8 - specific case of semi infinite loop with maybe
        ok 1 - test 3.8.1
        ok 2 - test 3.8.2
        1..2
    ok 41 - 3.8 - specific case of semi infinite loop with maybe # time=4.289ms
    
    # Subtest: 3.9 - three right maybes (some found)
        ok 1 - test 3.9
        1..1
    ok 42 - 3.9 - three right maybes (some found) # time=3.056ms
    
    # Subtest: 3.10 - three right maybes (searchFor not found)
        ok 1 - test 3.10
        1..1
    ok 43 - 3.10 - three right maybes (searchFor not found) # time=7.988ms
    
    # Subtest: 3.11 - three right maybes (maybes not found)
        ok 1 - test 3.11
        1..1
    ok 44 - 3.11 - three right maybes (maybes not found) # time=2.493ms
    
    # Subtest: 3.12.1 - three right maybes (multiple hungry finds)
        ok 1 - test 3.12.1
        1..1
    ok 45 - 3.12.1 - three right maybes (multiple hungry finds) # time=3.099ms
    
    # Subtest: 3.13 - three right maybes (multiple hungry finds)
        ok 1 - test 3.13
        1..1
    ok 46 - 3.13 - three right maybes (multiple hungry finds) # time=3.076ms
    
    # Subtest: 3.14 - three right maybes (multiple hungry finds)
        ok 1 - test 3.14
        1..1
    ok 47 - 3.14 - three right maybes (multiple hungry finds) # time=2.345ms
    
    # Subtest: 3.15 - three right maybes (multiple hungry finds)
        ok 1 - test 3.15
        1..1
    ok 48 - 3.15 - three right maybes (multiple hungry finds) # time=5.042ms
    
    # Subtest: 3.16 - three right maybes (multiple hungry finds)
        ok 1 - test 3.16
        1..1
    ok 49 - 3.16 - three right maybes (multiple hungry finds) # time=2.301ms
    
    # Subtest: 3.17 - three right maybes (multiple hungry finds)
        ok 1 - test 3.17
        1..1
    ok 50 - 3.17 - three right maybes (multiple hungry finds) # time=2.942ms
    
    # Subtest: 3.18 - three right maybes (multiple hungry finds)
        ok 1 - test 3.18
        1..1
    ok 51 - 3.18 - three right maybes (multiple hungry finds) # time=5.814ms
    
    # Subtest: 3.19 - sneaky array conversion situation
        ok 1 - test 3.19-1
        ok 2 - test 3.19-2
        1..2
    ok 52 - 3.19 - sneaky array conversion situation # time=3.82ms
    
    # Subtest: 3.20 - normal words, few of them, rightMaybe as array
        ok 1 - test 3.20
        1..1
    ok 53 - 3.20 - normal words, few of them, rightMaybe as array # time=2.854ms
    
    # Subtest: 3.21 - rightMaybe is array, but with only 1 null value
        ok 1 - test 3.21
        1..1
    ok 54 - 3.21 - rightMaybe is array, but with only 1 null value # time=2.252ms
    
    # Subtest: 3.22 - rightMaybe is couple integers in an array
        ok 1 - test 3.22
        1..1
    ok 55 - 3.22 - rightMaybe is couple integers in an array # time=2.509ms
    
    # Subtest: 3.23 - sneaky case of overlapping rightMaybes
        ok 1 - test 3.23
        1..1
    ok 56 - 3.23 - sneaky case of overlapping rightMaybes # time=2.422ms
    
    # Subtest: 3.24 - case-insensitive flag
        ok 1 - test 3.24
        1..1
    ok 57 - 3.24 - case-insensitive flag # time=2.298ms
    
    # Subtest: 4.1 - left and right maybes as emoji
        ok 1 - test 4.1.1
        ok 2 - test 4.1.2
        1..2
    ok 58 - 4.1 - left and right maybes as emoji # time=4.922ms
    
    # Subtest: 4.2 - left and right maybes as text
        ok 1 - test 4.2.1
        ok 2 - test 4.2.2
        1..2
    ok 59 - 4.2 - left and right maybes as text # time=9.912ms
    
    # Subtest: 4.3 - left+right maybes, middle & end of word #1
        ok 1 - test 4.3
        1..1
    ok 60 - 4.3 - left+right maybes, middle & end of word #1 # time=3.448ms
    
    # Subtest: 4.4 - left+right maybes, middle & end of word #2
        ok 1 - test 4.4
        1..1
    ok 61 - 4.4 - left+right maybes, middle & end of word #2 # time=6.214ms
    
    # Subtest: 4.5 - normal words
        ok 1 - test 4.5
        1..1
    ok 62 - 4.5 - normal words # time=3.062ms
    
    # Subtest: 5.1 - both outsides only, emoji, found
        ok 1 - test 5.1.1
        ok 2 - test 5.1.2
        1..2
    ok 63 - 5.1 - both outsides only, emoji, found # time=4.981ms
    
    # Subtest: 5.2 - both outsides only, emoji, not found
        ok 1 - test 5.2
        1..1
    ok 64 - 5.2 - both outsides only, emoji, not found # time=12.198ms
    
    # Subtest: 5.3 - both outsides, emoji, not found
        ok 1 - test 5.3
        1..1
    ok 65 - 5.3 - both outsides, emoji, not found # time=10.132ms
    
    # Subtest: 5.4 - both outsides, emoji, not found #1
        ok 1 - test 5.4
        1..1
    ok 66 - 5.4 - both outsides, emoji, not found #1 # time=4.335ms
    
    # Subtest: 5.5 - both outsides, emoji, not found #2
        ok 1 - test 5.5
        1..1
    ok 67 - 5.5 - both outsides, emoji, not found #2 # time=6.271ms
    
    # Subtest: 5.6 - line break as rightOutside, found
        ok 1 - test 5.6
        1..1
    ok 68 - 5.6 - line break as rightOutside, found # time=4.577ms
    
    # Subtest: 5.7 - line breaks as both outsides
        ok 1 - test 5.7
        1..1
    ok 69 - 5.7 - line breaks as both outsides # time=6.851ms
    
    # Subtest: 5.8 - \n as outsides, replacement = undefined
        ok 1 - test 5.8
        1..1
    ok 70 - 5.8 - \n as outsides, replacement = undefined # time=4.336ms
    
    # Subtest: 5.9 - line breaks as outsides, replacement = Bool
        ok 1 - test 5.9
        1..1
    ok 71 - 5.9 - line breaks as outsides, replacement = Bool # time=5.592ms
    
    # Subtest: 5.10 - line breaks as outsides, replacement = null
        ok 1 - test 5.10
        1..1
    ok 72 - 5.10 - line breaks as outsides, replacement = null # time=2.219ms
    
    # Subtest: 5.11 - left outside requirement not satisfied for replacement to happen
        ok 1 - test 5.11 - did not replace because of o.leftOutside
        1..1
    ok 73 - 5.11 - left outside requirement not satisfied for replacement to happen # time=8.751ms
    
    # Subtest: 5.12 - right outside requirement not satisfied for replacement to happen
        ok 1 - test 5.12 - did not replace because of o.rightOutside
        1..1
    ok 74 - 5.12 - right outside requirement not satisfied for replacement to happen # time=4.61ms
    
    # Subtest: 6.1 - maybes and outsides, emoji - full set
        ok 1 - test 6.1
        1..1
    ok 75 - 6.1 - maybes and outsides, emoji - full set # time=4.622ms
    
    # Subtest: 6.2 - maybes + outsides - 1 of maybes not found #1
        ok 1 - test 6.2
        1..1
    ok 76 - 6.2 - maybes + outsides - 1 of maybes not found #1 # time=3.749ms
    
    # Subtest: 6.3 - maybes + outsides - 1 of maybes not found #2
        ok 1 - test 6.3
        1..1
    ok 77 - 6.3 - maybes + outsides - 1 of maybes not found #2 # time=2.295ms
    
    # Subtest: 6.4 - maybes and outsides, emoji - neither of maybes
        ok 1 - test 6.4
        1..1
    ok 78 - 6.4 - maybes and outsides, emoji - neither of maybes # time=2.235ms
    
    # Subtest: 6.5 - multiple findings with maybes and outsides
        ok 1 - test 6.5
        1..1
    ok 79 - 6.5 - multiple findings with maybes and outsides # time=12.8ms
    
    # Subtest: 6.6 - multiple findings with maybes and not-outsides
        ok 1 - test 6.6
        1..1
    ok 80 - 6.6 - multiple findings with maybes and not-outsides # time=17.447ms
    
    # Subtest: 6.7 - maybes and outsides, arrays
        ok 1 - test 6.7
        1..1
    ok 81 - 6.7 - maybes and outsides, arrays # time=15.528ms
    
    # Subtest: 7.1 - one rightOutside, not found
        ok 1 - test 7.1
        1..1
    ok 82 - 7.1 - one rightOutside, not found # time=5.804ms
    
    # Subtest: 7.2 - one leftOutside, not found
        ok 1 - test 7.2
        1..1
    ok 83 - 7.2 - one leftOutside, not found # time=44.787ms
    
    # Subtest: 7.3 - one leftOutside, not found + null replacement
        ok 1 - test 7.3
        1..1
    ok 84 - 7.3 - one leftOutside, not found + null replacement # time=2.074ms
    
    # Subtest: 7.4 - leftOutside and replacement are null
        ok 1 - test 7.4
        1..1
    ok 85 - 7.4 - leftOutside and replacement are null # time=2.055ms
    
    # Subtest: 7.5 - left outside and replacement are undefined
        ok 1 - test 7.5
        1..1
    ok 86 - 7.5 - left outside and replacement are undefined # time=1.994ms
    
    # Subtest: 8.1 - infinite loop, no maybes, emoji
        ok 1 - test 8.1
        1..1
    ok 87 - 8.1 - infinite loop, no maybes, emoji # time=5.368ms
    
    # Subtest: 8.2 - infinite loop, maybes, multiple findings, emoji
        ok 1 - test 8.2
        1..1
    ok 88 - 8.2 - infinite loop, maybes, multiple findings, emoji # time=2.358ms
    
    # Subtest: 8.3 - infinite loop protection, emoji replaced with itself
        ok 1 - test 8.3
        1..1
    ok 89 - 8.3 - infinite loop protection, emoji replaced with itself # time=2.709ms
    
    # Subtest: 8.4 - infinite loop protection, right outside
        ok 1 - test 8.4
        1..1
    ok 90 - 8.4 - infinite loop protection, right outside # time=2.307ms
    
    # Subtest: 8.5 - infinite loop protection, multiples
        ok 1 - test 8.5
# time=5471.881ms
        1..1
    ok 91 - 8.5 - infinite loop protection, multiples # time=2.545ms
    
    # Subtest: 8.6 - simple infinite loop case
        ok 1 - test 8.6
        1..1
    ok 92 - 8.6 - simple infinite loop case # time=2.177ms
    
    # Subtest: 8.7 - infinite loop, not found
        ok 1 - test 8.7
        1..1
    ok 93 - 8.7 - infinite loop, not found # time=3.106ms
    
    # Subtest: 9.1 - source present, missing searchFor
        ok 1 - test 9.1
        1..1
    ok 94 - 9.1 - source present, missing searchFor # time=2.208ms
    
    # Subtest: 9.2 - everything is missing
        ok 1 - test 9.2
        1..1
    ok 95 - 9.2 - everything is missing # time=8.11ms
    
    # Subtest: 9.3 - everything seriously missing
        ok 1 - test 9.3
        1..1
    ok 96 - 9.3 - everything seriously missing # time=1.865ms
    
    # Subtest: 9.4 - everything extremely seriously missing
        ok 1 - test 9.4
        1..1
    ok 97 - 9.4 - everything extremely seriously missing # time=1.808ms
    
    # Subtest: 9.5 - everything truly extremely seriously missing
        ok 1 - test 9.5
        1..1
    ok 98 - 9.5 - everything truly extremely seriously missing # time=1.937ms
    
    # Subtest: 9.6 - everything really truly extremely seriously missing
        ok 1 - test 9.6
        1..1
    ok 99 - 9.6 - everything really truly extremely seriously missing # time=2.17ms
    
    # Subtest: 9.7 - leftOutsideNot blocking rightOutsideNot being empty
        ok 1 - test 9.7
        1..1
    ok 100 - 9.7 - leftOutsideNot blocking rightOutsideNot being empty # time=2.13ms
    
    # Subtest: 9.8 - leftOutsideNot is blank array
        ok 1 - test 9.8
        1..1
    ok 101 - 9.8 - leftOutsideNot is blank array # time=2.326ms
    
    # Subtest: 9.9 - missing key in properties obj
        ok 1 - test 9.9
        1..1
    ok 102 - 9.9 - missing key in properties obj # time=2.404ms
    
    # Subtest: 10.1 - empty string as replacement = deletion mode
        ok 1 - test 10.1
        1..1
    ok 103 - 10.1 - empty string as replacement = deletion mode # time=2.157ms
    
    # Subtest: 10.2 - null as replacement = deletion mode
        ok 1 - test 10.2
        1..1
    ok 104 - 10.2 - null as replacement = deletion mode # time=2.201ms
    
    # Subtest: 10.3 - replacement bool, nothing left
        ok 1 - test 10.3
        1..1
    ok 105 - 10.3 - replacement bool, nothing left # time=4.129ms
    
    # Subtest: 10.4 - replacement Bool, nothing left, searchFor Integer
        ok 1 - test 10.4
        1..1
    ok 106 - 10.4 - replacement Bool, nothing left, searchFor Integer # time=3.228ms
    
    # Subtest: 10.5 - nothing left, replacement undefined
        ok 1 - test 10.5
        1..1
    ok 107 - 10.5 - nothing left, replacement undefined # time=9.656ms
    
    # Subtest: 10.6 - nothing left - more undefined
        ok 1 - test 10.6
        1..1
    ok 108 - 10.6 - nothing left - more undefined # time=2.242ms
    
    # Subtest: 10.7 - emoji, null replacement, both outsides found
        ok 1 - test 10.7
        1..1
    ok 109 - 10.7 - emoji, null replacement, both outsides found # time=2.154ms
    
    # Subtest: 10.8 - raw integers everywhere must work too
        ok 1 - test 10.8
        1..1
    ok 110 - 10.8 - raw integers everywhere must work too # time=2.225ms
    
    # Subtest: 10.9 - searchFor is an array of 1 element
        ok 1 - test 10.9
        1..1
    ok 111 - 10.9 - searchFor is an array of 1 element # time=3.603ms
    
    # Subtest: 10.10 - searchFor is an array of few elements (no find)
        ok 1 - test 10.10
        1..1
    ok 112 - 10.10 - searchFor is an array of few elements (no find) # time=6.967ms
    
    # Subtest: 10.11 - searchFor is an array of few elements (won't work)
        ok 1 - test 10.11
        1..1
    ok 113 - 10.11 - searchFor is an array of few elements (won't work) # time=5.243ms
    
    # Subtest: 11.1 - left and right outsides as arrays (majority found)
        ok 1 - test 11.1
        1..1
    ok 114 - 11.1 - left and right outsides as arrays (majority found) # time=2.594ms
    
    # Subtest: 11.2 - left and right outsides as arrays (one found)
        ok 1 - test 11.2
        1..1
    ok 115 - 11.2 - left and right outsides as arrays (one found) # time=2.166ms
    
    # Subtest: 11.3 - outsides as arrays, beyond found maybes
        ok 1 - test 11.3
        1..1
    ok 116 - 11.3 - outsides as arrays, beyond found maybes # time=2.507ms
    
    # Subtest: 11.4 - outsides as arrays blocking maybes
        ok 1 - test 11.4
        1..1
    ok 117 - 11.4 - outsides as arrays blocking maybes # time=2.655ms
    
    # Subtest: 11.5 - maybes matching outsides, blocking them
        ok 1 - test 11.5
        1..1
    ok 118 - 11.5 - maybes matching outsides, blocking them # time=2.4ms
    
    # Subtest: 11.6 - maybes matching outsides, blocking them
        ok 1 - test 11.6
        1..1
    ok 119 - 11.6 - maybes matching outsides, blocking them # time=2.468ms
    
    # Subtest: 11.6 - maybes matching outsides, found
        ok 1 - test 11.6
        1..1
    ok 120 - 11.6 - maybes matching outsides, found # time=3.942ms
    
    # Subtest: 11.6 - maybes matching outsides, mismatching
        ok 1 - test 11.6
        1..1
    ok 121 - 11.6 - maybes matching outsides, mismatching # time=2.565ms
    
    # Subtest: 11.7 - rightOutside & with case-insensitive flag
        ok 1 - test 11.7.1 - nothing matches, without flag
        ok 2 - test 11.7.2 - nothing matches, with flag
        ok 3 - test 11.7.3 - one match, with flag
        1..3
    ok 122 - 11.7 - rightOutside & with case-insensitive flag # time=10.953ms
    
    # Subtest: 12.1 - rightOutsideNot satisfied thus not replaced
        ok 1 - test 12.1.1
        ok 2 - test 12.1.2
        1..2
    ok 123 - 12.1 - rightOutsideNot satisfied thus not replaced # time=3.723ms
    
    # Subtest: 12.2 - outsideNot left satisfied thus not replaced
        ok 1 - test 12.2.1
        ok 2 - test 12.2.2
        1..2
    ok 124 - 12.2 - outsideNot left satisfied thus not replaced # time=3.546ms
    
    # Subtest: 12.3 - outsideNot's satisfied thus not replaced
        ok 1 - test 12.3
        1..1
    ok 125 - 12.3 - outsideNot's satisfied thus not replaced # time=6.413ms
    
    # Subtest: 12.4 - outsideNot's not satisfied, with 1 maybe replaced
        ok 1 - test 12.4
        1..1
    ok 126 - 12.4 - outsideNot's not satisfied, with 1 maybe replaced # time=4.884ms
    
    # Subtest: 12.5 - leftOutsideNot blocked positive leftMaybe
        ok 1 - test 12.5
        1..1
    ok 127 - 12.5 - leftOutsideNot blocked positive leftMaybe # time=7.338ms
    
    # Subtest: 12.6 - rightOutsideNot blocked both L-R maybes
        ok 1 - test 12.6
        1..1
    ok 128 - 12.6 - rightOutsideNot blocked both L-R maybes # time=5.05ms
    
    # Subtest: 12.7 - rightOutsideNot last char goes outside
        ok 1 - test 12.7
        1..1
    ok 129 - 12.7 - rightOutsideNot last char goes outside # time=2.405ms
    
    # Subtest: 12.8 - right maybe is last char, outsideNot satisfied
        ok 1 - test 12.8
        1..1
    ok 130 - 12.8 - right maybe is last char, outsideNot satisfied # time=2.55ms
    
    # Subtest: 12.9 - real life scenario, missing semicol on nbsp #1
        ok 1 - test 12.9
        1..1
    ok 131 - 12.9 - real life scenario, missing semicol on nbsp #1 # time=2.167ms
    
    # Subtest: 12.10 - real life scenario, missing semicol on nbsp #2
        ok 1 - test 12.10
        1..1
    ok 132 - 12.10 - real life scenario, missing semicol on nbsp #2 # time=2.021ms
    
    # Subtest: 12.11 - real life scenario, missing ampersand, text
        ok 1 - test 12.11
        1..1
    ok 133 - 12.11 - real life scenario, missing ampersand, text # time=2.168ms
    
    # Subtest: 12.12 - as before but with emoji instead
        ok 1 - test 12.12
        1..1
    ok 134 - 12.12 - as before but with emoji instead # time=2.092ms
    
    # Subtest: 12.13 - rightOutsideNot with L-R maybes
        ok 1 - test 12.13
        1..1
    ok 135 - 12.13 - rightOutsideNot with L-R maybes # time=2.201ms
    
    # Subtest: 12.14 - all of 'em #1
        ok 1 - test 12.14
        1..1
    ok 136 - 12.14 - all of 'em #1 # time=2.255ms
    
    # Subtest: 12.14 - all of 'em #2
        ok 1 - test 12.14
        1..1
    ok 137 - 12.14 - all of 'em #2 # time=2.282ms
    
    # Subtest: 13.1 - readme example #1
        ok 1 - test 13.1
        1..1
    ok 138 - 13.1 - readme example #1 # time=2.064ms
    
    # Subtest: 13.2 - readme example #2
        ok 1 - test 13.2
        1..1
    ok 139 - 13.2 - readme example #2 # time=2.1ms
    
    # Subtest: 13.3 - readme example #3
        ok 1 - test 13.3
        1..1
    ok 140 - 13.3 - readme example #3 # time=2.273ms
    
    # Subtest: 13.4 - readme example #4
        ok 1 - test 13.4
        1..1
    ok 141 - 13.4 - readme example #4 # time=2.175ms
    
    # Subtest: 13.5 - readme example #5
        ok 1 - test 13.5
        1..1
    ok 142 - 13.5 - readme example #5 # time=2.028ms
    
    # Subtest: 13.6 - readme example #6
        ok 1 - test 13.6
        1..1
    ok 143 - 13.6 - readme example #6 # time=2.202ms
    
    # Subtest: 14.1 - special case #1
        ok 1 - test 14.1
        1..1
    ok 144 - 14.1 - special case #1 # time=1.811ms
    
    # Subtest: 14.2 - special case #2
        ok 1 - test 14.1
        1..1
    ok 145 - 14.2 - special case #2 # time=2.729ms
    
    # Subtest: 15.1 - case-insensitive flag works
        ok 1 - test 15.1.1 - all ok, flag off
        ok 2 - test 15.1.2 - case mismatch, nothing replaced because flag's off
        ok 3 - test 15.1.3 - case mismatch, but flag allows it, so replace happens
        ok 4 - test 15.1.4 - case-insensitive flag, multiple replacements
        1..4
    ok 146 - 15.1 - case-insensitive flag works # time=7.61ms
    
    # Subtest: test 15.2 - case-insensitive leftMaybe
        ok 1 - test 15.2.1 - flag off - testing leftMaybe only
        ok 2 - test 15.2.2 - flag on - testing leftMaybe only
        ok 3 - test 15.2.3 - flag on - testing searchFor + leftMaybe
        ok 4 - test 15.2.4 - flag on - testing searchFor + leftMaybe
        1..4
    ok 147 - test 15.2 - case-insensitive leftMaybe # time=6.009ms
    
    # Subtest: test 15.3 - case-insensitive rightMaybe
        ok 1 - test 15.3.1 - flag off - testing rightMaybe only
        ok 2 - test 15.3.2 - flag on - testing rightMaybe only
        ok 3 - test 15.3.3 - flag on - testing searchFor + rightMaybe
        ok 4 - test 15.3.4 - flag on - testing searchFor + rightMaybe
        1..4
    ok 148 - test 15.3 - case-insensitive rightMaybe # time=8.193ms
    
    # Subtest: test 15.4 - case-insensitive leftOutside
        ok 1 - test 15.4.1 - flag off - testing leftOutside only
        ok 2 - test 15.4.2 - flag on - testing leftOutside only
        ok 3 - test 15.4.3 - flag on - testing searchFor + leftOutside
        ok 4 - test 15.4.4 - flag on - testing searchFor + leftOutside
        1..4
    ok 149 - test 15.4 - case-insensitive leftOutside # time=9.227ms
    
    # Subtest: test 15.5 - case-insensitive rightOutside
        ok 1 - test 15.5.1 - flag off - testing rightOutside only
        ok 2 - test 15.5.2 - flag on - testing rightOutside only
        ok 3 - test 15.5.3 - flag on - testing searchFor + rightOutside
        ok 4 - test 15.5.4 - flag on - testing searchFor + rightOutside
        1..4
    ok 150 - test 15.5 - case-insensitive rightOutside # time=6.829ms
    
    # Subtest: test 15.6 - case-insensitive leftOutsideNot
        ok 1 - test 15.6.1 - flag off - testing leftOutsideNot only
        ok 2 - test 15.6.2 - flag on - testing leftOutsideNot only
        ok 3 - test 15.6.3 - flag on - testing searchFor + leftOutsideNot
        ok 4 - test 15.6.4 - flag on - testing searchFor + leftOutsideNot
        ok 5 - test 15.6.5 - flag on - testing searchFor + leftOutsideNot
        1..5
    ok 151 - test 15.6 - case-insensitive leftOutsideNot # time=9.478ms
    
    # Subtest: test 15.7 - case-insensitive rightOutsideNot
        ok 1 - test 15.7.1 - flag off - testing rightOutsideNot only
        ok 2 - test 15.7.2 - flag on - testing rightOutsideNot only
        ok 3 - test 15.7.3 - flag on - testing searchFor + rightOutsideNot
        ok 4 - test 15.7.4 - flag on - testing searchFor + rightOutsideNot
        ok 5 - test 15.7.5 - flag on - testing searchFor + rightOutsideNot
        1..5
    ok 152 - test 15.7 - case-insensitive rightOutsideNot # time=13.225ms
    
    1..152
    # time=2541.302ms
}

1..1
