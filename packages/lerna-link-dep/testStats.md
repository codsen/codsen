TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - [35merrors[39m - requested package does not exist (ERROR_01)
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        1..3
    ok 1 - 01.01 - [35merrors[39m - requested package does not exist (ERROR_01) # time=1123.757ms
    
    # Subtest: 01.02 - [35merrors[39m - couldn't read a's package.json (ERROR_02)
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        ok 4 - 01.02.04
        1..4
    ok 2 - 01.02 - [35merrors[39m - couldn't read a's package.json (ERROR_02) # time=582.844ms
    
    # Subtest: 01.03 - [35merrors[39m - couldn't read b's package.json (ERROR_03)
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        ok 4 - 01.03.04
        1..4
    ok 3 - 01.03 - [35merrors[39m - couldn't read b's package.json (ERROR_03) # time=563.986ms
    
    # Subtest: 01.04 - [35merrors[39m - normal dep, symlink already exists (ERROR_04)
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.03
        1..3
    ok 4 - 01.04 - [35merrors[39m - normal dep, symlink already exists (ERROR_04) # time=596.562ms
    
    # Subtest: 01.05 - [35merrors[39m - error while trying to parse package.json (ERROR_06)
        ok 1 - 01.05.01
        ok 2 - 01.05.02
        ok 3 - 01.05.03
        ok 4 - 01.05.04
        1..4
    ok 5 - 01.05 - [35merrors[39m - error while trying to parse package.json (ERROR_06) # time=578.665ms
    
    # Subtest: 01.06 - [35merrors[39m - dep is a CLI, one of symlinks already exists (ERROR_08)
        ok 1 - 01.06.01
        ok 2 - 01.06.02
        ok 3 - 01.06.03
        ok 4 - 01.06.04
        ok 5 - 01.06.04
        1..5
    ok 6 - 01.06 - [35merrors[39m - dep is a CLI, one of symlinks already exists (ERROR_08) # time=745.835ms
    
    # Subtest: 01.07 - [35merrors[39m - package.json had no main/module/browser/bin fields (ERROR_10)
        ok 1 - 01.07.01
        ok 2 - 01.07.02
        ok 3 - 01.07.03
        ok 4 - 01.07.04
        1..4
    ok 7 - 01.07 - [35merrors[39m - package.json had no main/module/browser/bin fields (ERROR_10) # time=616.832ms
    
    # Subtest: 02.01 - [33mmain functionality[39m - links normal deps
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        ok 5 - 02.01.05
        1..5
    ok 8 - 02.01 - [33mmain functionality[39m - links normal deps # time=601.899ms
    
    # Subtest: 02.02 - [33mmain functionality[39m - links CLI deps
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        ok 3 - 02.02.03
        ok 4 - 02.02.04
        ok 5 - 02.02.05
        ok 6 - 02.02.06
        1..6
    ok 9 - 02.02 - [33mmain functionality[39m - links CLI deps # time=588.628ms
    
    # Subtest: 02.03 - [33mmain functionality[39m - links normal deps, adds them as devDependencies, -d flag
        ok 1 - 02.03.01
        ok 2 - 02.03.02
        ok 3 - 02.03.03
        ok 4 - 02.03.04
        ok 5 - 02.03.05
        ok 6 - 02.03.06
        1..6
    ok 10 - 02.03 - [33mmain functionality[39m - links normal deps, adds them as devDependencies, -d flag # time=588.422ms
    
    # Subtest: 02.04 - [33mmain functionality[39m - links normal deps, adds them as devDependencies, --dev flag
        ok 1 - 02.04.01
        ok 2 - 02.04.02
        ok 3 - 02.04.03
        ok 4 - 02.04.04
        ok 5 - 02.04.05
        ok 6 - 02.04.06
        1..6
    ok 11 - 02.04 - [33mmain functionality[39m - links normal deps, adds them as devDependencies, --dev flag # time=583.593ms
    
    1..11
    # time=7184.103ms
ok 1 - test/test.js # time=7184.103ms

1..1
# time=9262.255ms
