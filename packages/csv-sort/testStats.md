TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01. sorts a basic file, empty extra column in header
        ok 1 - should be equivalent
        1..1
    ok 1 - 01.01. sorts a basic file, empty extra column in header # time=25.797ms
    
    # Subtest: 01.02. sorts a basic file, no headers
        ok 1 - should be equivalent
        1..1
    ok 2 - 01.02. sorts a basic file, no headers # time=14.561ms
    
    # Subtest: 01.03. sorts a basic file with opposite order of the CSV entries
        ok 1 - should be equivalent
        1..1
    ok 3 - 01.03. sorts a basic file with opposite order of the CSV entries # time=6.812ms
    
    # Subtest: 02.01. blank row above header
        ok 1 - should be equivalent
        1..1
    ok 4 - 02.01. blank row above header # time=8.924ms
    
    # Subtest: 02.02. blank row above content, header row above it
        ok 1 - should be equivalent
        1..1
    ok 5 - 02.02. blank row above content, header row above it # time=6.381ms
    
    # Subtest: 02.03. blank row in the middle
        ok 1 - should be equivalent
        1..1
    ok 6 - 02.03. blank row in the middle # time=6.109ms
    
    # Subtest: 02.04. blank row at the bottom
        ok 1 - should be equivalent
        1..1
    ok 7 - 02.04. blank row at the bottom # time=6.173ms
    
    # Subtest: 02.05. one messed up field CSV will result in missing rows on that row and higher
        ok 1 - should be equivalent
        1..1
    ok 8 - 02.05. one messed up field CSV will result in missing rows on that row and higher # time=14.318ms
    
    # Subtest: 02.06. one data row has extra column with data there
        ok 1 - should be equivalent
        1..1
    ok 9 - 02.06. one data row has extra column with data there # time=6.017ms
    
    # Subtest: 02.07. extra column with data there, then an extra empty column everywhere (will trim it)
        ok 1 - should be equivalent
        1..1
    ok 10 - 02.07. extra column with data there, then an extra empty column everywhere (will trim it) # time=7.844ms
    
    # Subtest: 02.08. extra column with data there, then an extra empty column everywhere (will trim it)
        ok 1 - 02.08
        1..1
    ok 11 - 02.08. extra column with data there, then an extra empty column everywhere (will trim it) # time=2.34ms
    
    # Subtest: 03.01. throws when it can't detect Balance column (one field is empty in this case)
        ok 1 - expected to throw
        1..1
    ok 12 - 03.01. throws when it can't detect Balance column (one field is empty in this case) # time=5.018ms
    
    # Subtest: 03.02. throws when all exclusively-numeric columns contain same values per-column
        ok 1 - expected to throw
        1..1
    ok 13 - 03.02. throws when all exclusively-numeric columns contain same values per-column # time=6.586ms
    
    # Subtest: 03.03. offset columns - will throw
        ok 1 - expected to throw
        1..1
    ok 14 - 03.03. offset columns - will throw # time=4.525ms
    
    # Subtest: 03.04. throws because there are no numeric-only columns
        ok 1 - expected to throw
        1..1
    ok 15 - 03.04. throws because there are no numeric-only columns # time=4.632ms
    
    # Subtest: 03.05. throws when input types are wrong
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        1..6
    ok 16 - 03.05. throws when input types are wrong # time=7.467ms
    
    # Subtest: 04.01. trims right side cols and bottom rows
        ok 1 - should be equivalent
        1..1
    ok 17 - 04.01. trims right side cols and bottom rows # time=18.742ms
    
    # Subtest: 04.02. trims all around, including left-side empty columns
        ok 1 - should be equivalent
        1..1
    ok 18 - 04.02. trims all around, including left-side empty columns # time=20.341ms
    
    1..18
    # time=290.565ms
ok 1 - test/test.js # time=290.565ms

# Subtest: test/umd-test.js
    # Subtest: UMD build works fine
        ok 1 - should be equivalent
        1..1
    ok 1 - UMD build works fine # time=8.415ms
    
    1..1
    # time=67.16ms
ok 2 - test/umd-test.js # time=67.16ms

1..2
# time=6842.743ms
