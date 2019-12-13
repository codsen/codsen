TAP version 13
ok 1 - test/test.js # time=764.107ms {
    # Subtest: 00.01 - throws when first input argument is missing
        ok 1 - expected to throw
        1..1
    ok 1 - 00.01 - throws when first input argument is missing # time=27.223ms
    
    # Subtest: 00.02 - throws when first input argument is not string
        ok 1 - expected to throw
        1..1
    ok 2 - 00.02 - throws when first input argument is not string # time=2.211ms
    
    # Subtest: 00.03 - throws when second input argument is not a plain object
        ok 1 - expected to throw
        1..1
    ok 3 - 00.03 - throws when second input argument is not a plain object # time=1.97ms
    
    # Subtest: 00.04 - falsey opts does not throw
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        1..2
    ok 4 - 00.04 - falsey opts does not throw # time=12.298ms
    
    # Subtest: 01.01 - decodes multiple entities within a string, entities surrounded by other chars
        ok 1 - 01.01.01
        1..1
    ok 5 - 01.01 - decodes multiple entities within a string, entities surrounded by other chars # time=14.258ms
    
    # Subtest: 01.02 - decodes double-encoded entities
        ok 1 - 01.02
        ok 2 - 01.02
        1..2
    ok 6 - 01.02 - decodes double-encoded entities # time=10.191ms
    
    # Subtest: 01.03 - decodes triple-encoded entities
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        1..3
    ok 7 - 01.03 - decodes triple-encoded entities # time=10.23ms
    
    # Subtest: 01.04 - ampersand entity
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.03
        1..3
    ok 8 - 01.04 - ampersand entity # time=3.423ms
    
    # Subtest: 01.05 - ambiguous ampersand
        ok 1 - 01.05.01
        ok 2 - 01.05.02
        1..2
    ok 9 - 01.05 - ambiguous ampersand # time=6.087ms
    
    # Subtest: 01.06 - legacy named references (without a trailing semicolon)
        ok 1 - 01.06
        1..1
    ok 10 - 01.06 - legacy named references (without a trailing semicolon) # time=1.96ms
    
    # Subtest: 01.07 - hexadecimal escape
        ok 1 - 01.07
        1..1
    ok 11 - 01.07 - hexadecimal escape # time=1.774ms
    
    # Subtest: 01.08 - Decimal escape
        ok 1 - 01.08
        1..1
    ok 12 - 01.08 - Decimal escape # time=1.648ms
    
    # Subtest: 01.09 - Special numerical escapes (see he.js issue #4)
        ok 1 - 01.09
        1..1
    ok 13 - 01.09 - Special numerical escapes (see he.js issue #4) # time=1.758ms
    
    # Subtest: 01.10 - special numerical escapes in strict mode
        ok 1 - expected to throw
        1..1
    ok 14 - 01.10 - special numerical escapes in strict mode # time=1.909ms
    
    # Subtest: 01.11 - out-of-range hexadecimal escape in error-tolerant mode
        ok 1 - 01.11
        1..1
    ok 15 - 01.11 - out-of-range hexadecimal escape in error-tolerant mode # time=1.395ms
    
    # Subtest: 01.12 - out-of-range hexadecimal escape in strict mode
        ok 1 - expected to throw
        1..1
    ok 16 - 01.12 - out-of-range hexadecimal escape in strict mode # time=1.376ms
    
    # Subtest: 01.13 - out-of-range hexadecimal escape in error-tolerant mode
        ok 1 - 01.13
        1..1
    ok 17 - 01.13 - out-of-range hexadecimal escape in error-tolerant mode # time=1.402ms
    
    # Subtest: 01.14 - out-of-range hexadecimal escape in strict mode
        ok 1 - expected to throw
        1..1
    ok 18 - 01.14 - out-of-range hexadecimal escape in strict mode # time=1.298ms
    
    # Subtest: 01.15 - ambiguous ampersand in text context
        ok 1 - 01.15
        1..1
    ok 19 - 01.15 - ambiguous ampersand in text context # time=1.385ms
    
    # Subtest: 01.16 - ambiguous ampersand in text context in strict mode
        ok 1 - expected to throw
        1..1
    ok 20 - 01.16 - ambiguous ampersand in text context in strict mode # time=1.299ms
    
    # Subtest: 01.17 - hexadecimal escape without trailing semicolon in error-tolerant mode
        ok 1 - 01.17
        1..1
    ok 21 - 01.17 - hexadecimal escape without trailing semicolon in error-tolerant mode # time=1.42ms
    
    # Subtest: 01.18 - hexadecimal escape without trailing semicolon in strict mode
        ok 1 - expected to throw
        1..1
    ok 22 - 01.18 - hexadecimal escape without trailing semicolon in strict mode # time=1.805ms
    
    # Subtest: 01.19 - decimal escape without trailing semicolon in error-tolerant mode
        ok 1 - 01.19
        1..1
    ok 23 - 01.19 - decimal escape without trailing semicolon in error-tolerant mode # time=1.362ms
    
    # Subtest: 01.20 - decimal escape without trailing semicolon in strict mode
        ok 1 - expected to throw
        1..1
    ok 24 - 01.20 - decimal escape without trailing semicolon in strict mode # time=1.333ms
    
    # Subtest: 01.21 - attribute value context - entity without semicolon sandwitched
        ok 1 - 01.21 - nothing happens
        1..1
    ok 25 - 01.21 - attribute value context - entity without semicolon sandwitched # time=2.198ms
    
    # Subtest: 01.22 - attribute value context - entity with semicolon sandwitched with text
        ok 1 - 01.22
        1..1
    ok 26 - 01.22 - attribute value context - entity with semicolon sandwitched with text # time=1.578ms
    
    # Subtest: 01.23 - attribute value context - ends with entity with semicolon
        ok 1 - 01.23
        1..1
    ok 27 - 01.23 - attribute value context - ends with entity with semicolon # time=1.358ms
    
    # Subtest: 01.24 - entity ends with equal sign instead of semicolon
        ok 1 - 01.24
        1..1
    ok 28 - 01.24 - entity ends with equal sign instead of semicolon # time=2.935ms
    
    # Subtest: 01.25 - throws in strict mode when entity ends with equal sign instead of semicol
        ok 1 - expected to throw
        1..1
    ok 29 - 01.25 - throws in strict mode when entity ends with equal sign instead of semicol # time=1.375ms
    
    # Subtest: 01.26 - unclosed HTML entity ends the input string
        ok 1 - 01.26
        1..1
    ok 30 - 01.26 - unclosed HTML entity ends the input string # time=2.763ms
    
    # Subtest: 01.27 - false positive, not a parsing error
        ok 1 - 01.27
        1..1
    ok 31 - 01.27 - false positive, not a parsing error # time=1.28ms
    
    # Subtest: 01.28 - foo&amplol in strict mode throws in text context
        ok 1 - expected to throw
        1..1
    ok 32 - 01.28 - foo&amplol in strict mode throws in text context # time=4.83ms
    
    # Subtest: 01.29 - throws when strict mode is on isAttributeValue is false
        ok 1 - expected to throw
        1..1
    ok 33 - 01.29 - throws when strict mode is on isAttributeValue is false # time=1.574ms
    
    # Subtest: 01.30 - attribute value in error-tolerant mode, non-strict
        ok 1 - 01.30
        1..1
    ok 34 - 01.30 - attribute value in error-tolerant mode, non-strict # time=1.482ms
    
    # Subtest: 01.31 - attribute value in error-tolerant mode, strict
        ok 1 - 01.31
        1..1
    ok 35 - 01.31 - attribute value in error-tolerant mode, strict # time=1.345ms
    
    # Subtest: 01.32 - decoding `&#x8D;` in error-tolerant mode
        ok 1 - 01.32
        1..1
    ok 36 - 01.32 - decoding `&#x8D;` in error-tolerant mode # time=1.488ms
    
    # Subtest: 01.33 - decoding `&#x8D;` in strict mode
        ok 1 - expected to throw
        1..1
    ok 37 - 01.33 - decoding `&#x8D;` in strict mode # time=1.301ms
    
    # Subtest: 01.34 - decoding `&#xD;` in error-tolerant mode
        ok 1 - 01.34
        1..1
    ok 38 - 01.34 - decoding `&#xD;` in error-tolerant mode # time=1.3ms
    
    # Subtest: 01.35 - decoding `&#xD;` in strict mode
        ok 1 - expected to throw
        1..1
    ok 39 - 01.35 - decoding `&#xD;` in strict mode # time=1.248ms
    
    # Subtest: 01.36 - decoding `&#x94;` in error-tolerant mode
        ok 1 - 01.36
        1..1
    ok 40 - 01.36 - decoding `&#x94;` in error-tolerant mode # time=1.944ms
    
    # Subtest: 01.37 - decoding `&#x94;` in strict mode
        ok 1 - expected to throw
        1..1
    ok 41 - 01.37 - decoding `&#x94;` in strict mode # time=1.296ms
    
    # Subtest: 01.38 - decoding `&#x1;` in error-tolerant mode
        ok 1 - 01.38
        1..1
    ok 42 - 01.38 - decoding `&#x1;` in error-tolerant mode # time=1.253ms
    
    # Subtest: 01.39 - decoding `&#x1;` in strict mode
        ok 1 - expected to throw
        1..1
    ok 43 - 01.39 - decoding `&#x1;` in strict mode # time=1.284ms
    
    # Subtest: 01.40 - decoding `&#x10FFFF;` in error-tolerant mode
        ok 1 - 01.40
        1..1
    ok 44 - 01.40 - decoding `&#x10FFFF;` in error-tolerant mode # time=1.311ms
    
    # Subtest: 01.41 - decoding `&#x10FFFF;` in strict mode
        ok 1 - expected to throw
        1..1
    ok 45 - 01.41 - decoding `&#x10FFFF;` in strict mode # time=1.587ms
    
    # Subtest: 01.42 - decoding `&#196605;` (valid code point) in strict mode
        ok 1 - 01.42
        1..1
    ok 46 - 01.42 - decoding `&#196605;` (valid code point) in strict mode # time=1.213ms
    
    # Subtest: 01.43 - throws when decoding `&#196607;` in strict mode
        ok 1 - expected to throw
        1..1
    ok 47 - 01.43 - throws when decoding `&#196607;` in strict mode # time=1.225ms
    
    # Subtest: 01.44 - decoding &#xZ in error-tolerant mode
        ok 1 - 01.44
        1..1
    ok 48 - 01.44 - decoding &#xZ in error-tolerant mode # time=1.454ms
    
    # Subtest: 01.45 - decoding &#xZ in strict mode
        ok 1 - expected to throw
        1..1
    ok 49 - 01.45 - decoding &#xZ in strict mode # time=1.263ms
    
    # Subtest: 01.46 - decoding &#Z in error-tolerant mode
        ok 1 - 01.46
        1..1
    ok 50 - 01.46 - decoding &#Z in error-tolerant mode # time=1.219ms
    
    # Subtest: 01.47 - decoding &#Z in strict mode
        ok 1 - expected to throw
        1..1
    ok 51 - 01.47 - decoding &#Z in strict mode # time=1.179ms
    
    # Subtest: 01.48 - decoding `&#00` numeric character reference (see issue #43)
        ok 1 - 01.48
        1..1
    ok 52 - 01.48 - decoding `&#00` numeric character reference (see issue #43) # time=4.036ms
    
    # Subtest: 01.49 - decoding `0`-prefixed numeric character referencs
        ok 1 - 01.49
        1..1
    ok 53 - 01.49 - decoding `0`-prefixed numeric character referencs # time=1.267ms
    
    1..53
    # time=764.107ms
}

1..1
# time=3623.068ms
