TAP version 13
ok 1 - test/test.js # time=197.635ms {
    # Subtest: 01.01 - breaks lines correctly leaving no empty lines
        ok 1 - 01.01.01 - minimal amount of chars in each col
        ok 2 - 01.01.02 - normal words in each col
        ok 3 - 01.01.03 - minimal amount of chars in each col
        ok 4 - 01.01.04 - normal words in each col
        1..4
    ok 1 - 01.01 - breaks lines correctly leaving no empty lines # time=17.84ms
    
    # Subtest: 01.02 - breaks lines that have empty values
        ok 1 - 01.02.01 - whole row comprises of empty values
        ok 2 - 01.02.02 - only first row contains real data
        ok 3 - 01.02.02 - only first row contains real data
        ok 4 - 01.02.03 - empty row all with double quotes
        ok 5 - 01.02.04 - more double quotes
        ok 6 - 01.02.05 - double quotes almost everywhere
        ok 7 - 01.02.06 - many empty rows
        ok 8 - 01.02.07 - three commas
        ok 9 - 01.02.08 - nothing
        1..9
    ok 2 - 01.02 - breaks lines that have empty values # time=11.154ms
    
    # Subtest: 01.03 - copes with leading/trailing empty space
        ok 1 - 01.03.01 - one trailing \n
        ok 2 - 01.03.02 - bunch of leading and trailing whitespace
        1..2
    ok 3 - 01.03 - copes with leading/trailing empty space # time=8.627ms
    
    # Subtest: 02.01 - breaks lines correctly leaving no empty lines
        ok 1 - 02.01.01 - minimal amount of chars in each col
        ok 2 - 02.01.02 - minimal amount of chars in each col
        1..2
    ok 4 - 02.01 - breaks lines correctly leaving no empty lines # time=4.165ms
    
    # Subtest: 02.02 - particular attention of combos of line breaks and double quotes
        ok 1 - 02.02.01 - double quotes follow line break
        1..1
    ok 5 - 02.02 - particular attention of combos of line breaks and double quotes # time=2.623ms
    
    # Subtest: 02.03 - particular attention of double quotes at the end
        ok 1 - 02.03.01 - double quotes follow line break
        1..1
    ok 6 - 02.03 - particular attention of double quotes at the end # time=4.078ms
    
    # Subtest: 02.04 - all values are wrapped with double quotes, some trailing white space
        ok 1 - 02.04.01 - splits correctly, trimming the space around
        1..1
    ok 7 - 02.04 - all values are wrapped with double quotes, some trailing white space # time=2.538ms
    
    # Subtest: 02.05 - values wrapped in double quotes that contain double quotes
        ok 1 - 02.05.01 - double quotes that contain double quotes
        1..1
    ok 8 - 02.05 - values wrapped in double quotes that contain double quotes # time=4.554ms
    
    # Subtest: 03.01 - wrong input types causes throwing up
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        ok 7 - expected to throw
        ok 8 - expected to throw
        ok 9 - expected to not throw
        ok 10 - expected to throw
        1..10
    ok 9 - 03.01 - wrong input types causes throwing up # time=5.111ms
    
    # Subtest: 04.01 - deals with (or does not) thousand separators in numbers
        ok 1 - 04.01.01 - splits correctly, understanding comma thousand separators and removing them
        ok 2 - 04.01.02 - leaves thousand separators intact
        1..2
    ok 10 - 04.01 - deals with (or does not) thousand separators in numbers # time=7.846ms
    
    # Subtest: 05.01 - to pad or not to pad
        ok 1 - 05.01.01 - default behaviour, padds
        ok 2 - 05.01.02 - padding off
        1..2
    ok 11 - 05.01 - to pad or not to pad # time=5.51ms
    
    # Subtest: 06.01 - Russian/Lithuanian/continental decimal notation style CSV that uses commas
        ok 1 - 06.01.01 - does not convert the notation by default, but does pad
        ok 2 - 06.01.02 - converts the notation as requested, and does pad by default
        ok 3 - 06.01.03 - does not convert the notation by default, and does not pad as requested
        ok 4 - 06.01.04 - converts the notation as requested, but does not pad as requested
        1..4
    ok 12 - 06.01 - Russian/Lithuanian/continental decimal notation style CSV that uses commas # time=9.077ms
    
    1..12
    # time=197.635ms
}

ok 2 - test/umd-test.js # time=23.474ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=16.118ms
    
    1..1
    # time=23.474ms
}

1..2
# time=2493.679ms
