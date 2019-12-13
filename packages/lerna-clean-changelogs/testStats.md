TAP version 13
ok 1 - test/test.js # time=80.974ms {
    # Subtest: 00.01 - [33mbasics[39m - missing 1st arg
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 1 - 00.01 - [33mbasics[39m - missing 1st arg # time=10.337ms
    
    # Subtest: 00.02 - [33mbasics[39m - 1st arg of a wrong type
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        1..5
    ok 2 - 00.02 - [33mbasics[39m - 1st arg of a wrong type # time=3.695ms
    
    # Subtest: 00.03 - [33mbasics[39m - 1st arg is empty string
        ok 1 - 00.03
        1..1
    ok 3 - 00.03 - [33mbasics[39m - 1st arg is empty string # time=3.328ms
    
    # Subtest: 01.01 - [35mcleaning[39m - deletes bump-only entries together with their headings
        ok 1 - should be equal
        1..1
    ok 4 - 01.01 - [35mcleaning[39m - deletes bump-only entries together with their headings # time=2.497ms
    
    # Subtest: 01.02 - [35mcleaning[39m - turns h1 headings within body into h2
        ok 1 - should be equal
        1..1
    ok 5 - 01.02 - [35mcleaning[39m - turns h1 headings within body into h2 # time=2.132ms
    
    # Subtest: 01.03 - [35mcleaning[39m - cleans whitespace and replaces bullet dashes with asterisks
        ok 1 - should be equal
        1..1
    ok 6 - 01.03 - [35mcleaning[39m - cleans whitespace and replaces bullet dashes with asterisks # time=1.632ms
    
    # Subtest: 01.04 - [35mcleaning[39m - removes WIP entries
        ok 1 - should be equal
        1..1
    ok 7 - 01.04 - [35mcleaning[39m - removes WIP entries # time=1.435ms
    
    1..7
    # time=80.974ms
}

1..1
# time=2271.738ms
