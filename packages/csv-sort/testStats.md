TAP version 13
ok 1 - test/test.js # time=355.676ms {
    # Subtest: 01.01. sorts a basic file, empty extra column in header
        ok 1 - should be equivalent
        1..1
    ok 1 - 01.01. sorts a basic file, empty extra column in header # time=38.383ms
    
    # Subtest: 01.02. sorts a basic file, no headers
        ok 1 - should be equivalent
        1..1
    ok 2 - 01.02. sorts a basic file, no headers # time=17.325ms
    
    # Subtest: 01.03. sorts a basic file with opposite order of the CSV entries
        ok 1 - should be equivalent
        1..1
    ok 3 - 01.03. sorts a basic file with opposite order of the CSV entries # time=11.478ms
    
    # Subtest: 02.01. blank row above header
        ok 1 - should be equivalent
        1..1
    ok 4 - 02.01. blank row above header # time=9.265ms
    
    # Subtest: 02.02. blank row above content, header row above it
        ok 1 - should be equivalent
        1..1
    ok 5 - 02.02. blank row above content, header row above it # time=7.597ms
    
    # Subtest: 02.03. blank row in the middle
        ok 1 - should be equivalent
        1..1
    ok 6 - 02.03. blank row in the middle # time=8.255ms
    
    # Subtest: 02.04. blank row at the bottom
        ok 1 - should be equivalent
        1..1
    ok 7 - 02.04. blank row at the bottom # time=7.708ms
    
    # Subtest: 02.05. one messed up field CSV will result in missing rows on that row and higher
        ok 1 - should be equivalent
        1..1
    ok 8 - 02.05. one messed up field CSV will result in missing rows on that row and higher # time=7.933ms
    
    # Subtest: 02.06. one data row has extra column with data there
        ok 1 - should be equivalent
        1..1
    ok 9 - 02.06. one data row has extra column with data there # time=8.093ms
    
    # Subtest: 02.07. extra column with data there, then an extra empty column everywhere (will trim it)
        ok 1 - should be equivalent
        1..1
    ok 10 - 02.07. extra column with data there, then an extra empty column everywhere (will trim it) # time=17.43ms
    
    # Subtest: 02.08. extra column with data there, then an extra empty column everywhere (will trim it)
        ok 1 - 02.08
        1..1
    ok 11 - 02.08. extra column with data there, then an extra empty column everywhere (will trim it) # time=1.184ms
    
    # Subtest: 03.01. throws when it can't detect Balance column (one field is empty in this case)
        ok 1 - expected to throw
        1..1
    ok 12 - 03.01. throws when it can't detect Balance column (one field is empty in this case) # time=5.971ms
    
    # Subtest: 03.02. throws when all exclusively-numeric columns contain same values per-column
        ok 1 - expected to throw
        1..1
    ok 13 - 03.02. throws when all exclusively-numeric columns contain same values per-column # time=5.249ms
    
    # Subtest: 03.03. offset columns - will throw
        ok 1 - expected to throw
        1..1
    ok 14 - 03.03. offset columns - will throw # time=4.097ms
    
    # Subtest: 03.04. throws because there are no numeric-only columns
        ok 1 - expected to throw
        1..1
    ok 15 - 03.04. throws because there are no numeric-only columns # time=5.364ms
    
    # Subtest: 03.05. throws when input types are wrong
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        1..6
    ok 16 - 03.05. throws when input types are wrong # time=4.264ms
    
    # Subtest: 04.01. trims right side cols and bottom rows
        ok 1 - should be equivalent
        1..1
    ok 17 - 04.01. trims right side cols and bottom rows # time=20.651ms
    
    # Subtest: 04.02. trims all around, including left-side empty columns
        ok 1 - should be equivalent
        1..1
    ok 18 - 04.02. trims all around, including left-side empty columns # time=17.52ms
    
    1..18
    # time=355.676ms
}

ok 2 - test/umd-test.js # time=20.041ms {
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=11.977ms
    
    1..1
    # time=20.041ms
}

1..2
# time=2880.323ms
