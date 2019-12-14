TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - default sort, called on the whole folder
        ok 1 - should be equivalent
        1..1
    ok 1 - 01.01 - default sort, called on the whole folder # time=1589.653ms
    
    # Subtest: 01.02 - sort, -t (tabs) mode
        ok 1 - should be equivalent
        1..1
    ok 2 - 01.02 - sort, -t (tabs) mode # time=850.51ms
    
    # Subtest: 01.03 - sort, there's a broken JSON among files
        ok 1 - should match pattern provided
        ok 2 - should be equivalent
        1..2
    ok 3 - 01.03 - sort, there's a broken JSON among files # time=783.762ms
    
    # Subtest: 01.04 - silent mode
        ok 1 - should be equivalent
        1..1
    ok 4 - 01.04 - silent mode # time=834.142ms
    
    # Subtest: 01.05 - fixes minified dotfiles in JSON format
        ok 1 - should be equivalent
        1..1
    ok 5 - 01.05 - fixes minified dotfiles in JSON format # time=782.619ms
    
    # Subtest: 01.06 - topmost level is array
        ok 1 - should be equivalent
        1..1
    ok 6 - 01.06 - topmost level is array # time=650.925ms
    
    # Subtest: 01.07 - when asked, sorts arrays which contain only strings
        ok 1 - should be equivalent
        1..1
    ok 7 - 01.07 - when asked, sorts arrays which contain only strings # time=667.841ms
    
    # Subtest: 01.08 - when not asked, does not sort arrays which contain only strings
        ok 1 - should be equivalent
        1..1
    ok 8 - 01.08 - when not asked, does not sort arrays which contain only strings # time=635.475ms
    
    # Subtest: 01.09 - array in deeper levels sorted (upon request)
        ok 1 - should be equivalent
        1..1
    ok 9 - 01.09 - array in deeper levels sorted (upon request) # time=645.409ms
    
    # Subtest: 01.10 - version output mode
        ok 1 - should be equal
        ok 2 - should be equal
        1..2
    ok 10 - 01.10 - version output mode # time=1203.223ms
    
    # Subtest: 01.11 - help output mode
        ok 1 - should match pattern provided
        ok 2 - should match pattern provided
        ok 3 - should match pattern provided
        ok 4 - should match pattern provided
        ok 5 - should match pattern provided
        ok 6 - should match pattern provided
        1..6
    ok 11 - 01.11 - help output mode # time=1205.774ms
    
    # Subtest: 01.12 - no files found in the given directory
        ok 1 - should match pattern provided
        1..1
    ok 12 - 01.12 - no files found in the given directory # time=620.764ms
    
    # Subtest: 01.13 - package.json is sorted by default
        ok 1 - should be equivalent
        1..1
    ok 13 - 01.13 - package.json is sorted by default # time=777.958ms
    
    # Subtest: 01.14 - package.json is not sorted under -p flag
        ok 1 - should be equivalent
        1..1
    ok 14 - 01.14 - package.json is not sorted under -p flag # time=636.443ms
    
    # Subtest: 02.01 - CI mode, something to sort, -c flag
        ok 1 - should be equal
        1..1
    ok 15 - 02.01 - CI mode, something to sort, -c flag # time=770.406ms
    
    # Subtest: 02.02 - CI mode, something to sort, --ci flag
        ok 1 - should be equal
        1..1
    ok 16 - 02.02 - CI mode, something to sort, --ci flag # time=737.796ms
    
    1..16
    # time=13414.073ms
ok 1 - test/test.js # time=13414.073ms

1..1
# time=15509.462ms
