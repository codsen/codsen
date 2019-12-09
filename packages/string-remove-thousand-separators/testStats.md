TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - removes Swiss-style thousand separators, single quotes
        ok 1 - 01.01.01 - normal
        ok 2 - 01.01.02 - one decimal place - padds to two decimal places (default)
        ok 3 - 01.01.03 - one decimal place - does not pad to two decimal places (off)
        ok 4 - 01.01.04 - inconsistent thousand separators
        ok 5 - 01.01.05 - normal
        ok 6 - 01.01.06 - one decimal place - only padds to two decimal places (default)
        ok 7 - 01.01.07 - one decimal place - does not pad to two decimal places (off)
        ok 8 - 01.01.08 - inconsistent thousand separators - bails
        1..8
    ok 1 - 01.01 - removes Swiss-style thousand separators, single quotes # time=35.954ms
    
    # Subtest: 01.02 - removes Russian-style thousand separators, spaces
        ok 1 - 01.02.01
        ok 2 - 01.02.02 - padds to two decimal places (default)
        ok 3 - 01.02.03 - padds to two decimal places (off)
        ok 4 - 01.02.04 - inconsistent thousand separators - bail
        ok 5 - 01.02.05
        ok 6 - 01.02.06 - only padds to two decimal places (default)
        ok 7 - 01.02.07 - basically everything's off.
        ok 8 - 01.02.08 - inconsistent thousand separators - bail
        1..8
    ok 2 - 01.02 - removes Russian-style thousand separators, spaces # time=33.439ms
    
    # Subtest: 01.03 - removes UK/US-style thousand separators, commas
        ok 1 - 01.03.01
        ok 2 - 01.03.02 - padds to two decimal places (default)
        ok 3 - 01.03.03 - padds to two decimal places (off)
        ok 4 - 01.03.04 - inconsistent thousand separators
        ok 5 - 01.03.05
        ok 6 - 01.03.06 - only padds to two decimal places (default)
        ok 7 - 01.03.07 - does nothing, basically
        ok 8 - 01.03.08 - bails because of inconsistent thousand separators
        1..8
    ok 3 - 01.03 - removes UK/US-style thousand separators, commas # time=16.136ms
    
    # Subtest: 01.04 - removes opposite-style thousand separators, commas
        ok 1 - 01.04.01 - removes separators
        ok 2 - 01.04.02 - pads and removes separators
        ok 3 - 01.04.03 - only removes separators, but does not pad because of opts
        ok 4 - 01.04.04 - bails when encounters inconsistent thousand separators
        ok 5 - 01.04.05 - does not remove separators because of the opts
        ok 6 - 01.04.06 - only pads because of opts defaults
        ok 7 - 01.04.05 - neither removes separators not pads because opts turned off both
        ok 8 - 01.04.06 - bails when encounters inconsistent thousand separators
        1..8
    ok 4 - 01.04 - removes opposite-style thousand separators, commas # time=6.281ms
    
    # Subtest: 02.01 - false - includes some text characters
        ok 1 - 02.02.01 - does nothing because there are letters
        ok 2 - 02.02.02 - still does nothing because of letters
        ok 3 - 02.02.03 - still does nothing because of letters
        ok 4 - 02.02.04 - still does nothing because of letters
        ok 5 - 02.02.05 - still does nothing because of letters
        ok 6 - 02.02.06 - does not freak out if it's text-only
        ok 7 - 02.02.07 - does not freak out if it's empty-text-only
        1..7
    ok 5 - 02.01 - false - includes some text characters # time=5.206ms
    
    # Subtest: 02.02 - false - mixed thousand separators, two dots one comma
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        1..4
    ok 6 - 02.02 - false - mixed thousand separators, two dots one comma # time=3.298ms
    
    # Subtest: 02.03 - false - few sneaky cases
        ok 1 - 02.03.01 - the first char after thousands separator is wrong
        ok 2 - 02.03.02 - the second char after thousands separator is wrong
        ok 3 - 02.03.03 - the third char after thousands separator is wrong
        ok 4 - 02.03.04 - does nothing
        ok 5 - 02.03.05 - does nothing
        ok 6 - 02.03.06 - does nothing
        ok 7 - 02.03.07
        ok 8 - 02.03.08
        1..8
    ok 7 - 02.03 - false - few sneaky cases # time=5.147ms
    
    # Subtest: 02.04 - trims
        ok 1 - 02.04.01 - trims double quotes
        ok 2 - 02.04.02 - unrecognised (colon) character - bails (trims double quotes anyway)
        ok 3 - 02.04.03 - trims whitespace quotes
        ok 4 - 02.04.04 - still trims before bails
        1..4
    ok 8 - 02.04 - trims # time=3.56ms
    
    # Subtest: 03.01 - converts Russian-style notation into UK-one
        ok 1 - 03.01.01 - one decimal place
        ok 2 - 03.01.02 - one decimal place
        ok 3 - 03.01.03 - two decimal places
        ok 4 - 03.01.04 - this is actually thousands separator
        ok 5 - 03.01.05 - includes thousand separators, one decimal place
        ok 6 - 03.01.06 - includes thousand separators, one decimal place
        ok 7 - 03.01.07 - includes thousand separators, two decimal places
        ok 8 - 03.01.08 - one decimal place
        ok 9 - 03.01.09 - one decimal place
        ok 10 - 03.01.10 - two decimal places
        ok 11 - 03.01.11 - this is actually thousands separator
        ok 12 - 03.01.12 - includes thousand separators, one decimal place
        ok 13 - 03.01.13 - includes thousand separators, one decimal place
        ok 14 - 03.01.14 - includes thousand separators, two decimal places
        ok 15 - 03.01.15 - forces style, padding kicks in by default but does not remove thousand separators, just as explicitly requested
        ok 16 - 03.01.16 - forces style but does nothing else (padding or thousand separator removal)
        1..16
    ok 9 - 03.01 - converts Russian-style notation into UK-one # time=17.78ms
    
    # Subtest: 99.01 - throws when the inputs are missing
        ok 1 - expected to throw
        ok 2 - expected to not throw
        ok 3 - expected to not throw
        1..3
    ok 10 - 99.01 - throws when the inputs are missing # time=3.602ms
    
    # Subtest: 99.02 - throws when first arg is not string
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        1..5
    ok 11 - 99.02 - throws when first arg is not string # time=3.779ms
    
    # Subtest: 99.03 - throws when second arg is not a plain object
        ok 1 - expected to not throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        1..6
    ok 12 - 99.03 - throws when second arg is not a plain object # time=4.333ms
    
    1..12
    # time=235.437ms
ok 1 - test/test.js # time=235.437ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=14.084ms
    
    1..1
    # time=21.751ms
ok 2 - test/umd-test.js # time=21.751ms

1..2
# time=6188.954ms
