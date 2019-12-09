TAP version 13
# Subtest: test/test-end2end.js
    # Subtest: 00. if no input, will silently return indefined
        ok 1 - 00.01
        1..1
    ok 1 - 00. if no input, will silently return indefined # time=9.385ms
    
    # Subtest: 01. ascending order, with wrong package names
        ok 1 - should be equivalent
        1..1
    ok 2 - 01. ascending order, with wrong package names # time=34.852ms
    
    # Subtest: 02. ascending order, with correct package names
        ok 1 - should be equivalent
        1..1
    ok 3 - 02. ascending order, with correct package names # time=8.773ms
    
    # Subtest: 03. correct package names, no footer links at all
        ok 1 - should be equivalent
        1..1
    ok 4 - 03. correct package names, no footer links at all # time=10.902ms
    
    # Subtest: 04. descending order, with wrong package names
        ok 1 - should be equivalent
        1..1
    ok 5 - 04. descending order, with wrong package names # time=7.417ms
    
    # Subtest: 05. descending order, with correct package names
        ok 1 - should be equivalent
        1..1
    ok 6 - 05. descending order, with correct package names # time=10.015ms
    
    # Subtest: 06. there are no linked titles
        ok 1 - should be equivalent
        1..1
    ok 7 - 06. there are no linked titles # time=28.569ms
    
    # Subtest: 07. non-GitHub package.json - throws
        ok 1 - expected to throw
        1..1
    ok 8 - 07. non-GitHub package.json - throws # time=5.13ms
    
    # Subtest: 08. mid links missing in changelog.md
        ok 1 - should be equivalent
        1..1
    ok 9 - 08. mid links missing in changelog.md # time=7.337ms
    
    # Subtest: 09. sneaky cases with tight spacing
        ok 1 - should be equivalent
        1..1
    ok 10 - 09. sneaky cases with tight spacing # time=24.363ms
    
    # Subtest: 10. redundant footer links present, no git logs in context
        ok 1 - should be equivalent
        1..1
    ok 11 - 10. redundant footer links present, no git logs in context # time=11.999ms
    
    # Subtest: 11. title dates are in wrong formats, no git logs in context
        ok 1 - should be equivalent
        1..1
    ok 12 - 11. title dates are in wrong formats, no git logs in context # time=8.635ms
    
    # Subtest: 12. footer links match titles but have wrong versions in URLs
        ok 1 - should be equivalent
        1..1
    ok 13 - 12. footer links match titles but have wrong versions in URLs # time=4.786ms
    
    # Subtest: 13. Real world case - https://github.com/guigrpa/giu/
        ok 1 - should be equivalent
        1..1
    ok 14 - 13. Real world case - https://github.com/guigrpa/giu/ # time=97.548ms
    
    # Subtest: 14. Real world case with slashes and letter v - https://github.com/keystonejs/keystone/
        ok 1 - should be equivalent
        1..1
    ok 15 - 14. Real world case with slashes and letter v - https://github.com/keystonejs/keystone/ # time=173.416ms
    
    # Subtest: 15. Unrecogniseable date - version gets still linked!
        ok 1 - should be equivalent
        1..1
    ok 16 - 15. Unrecogniseable date - version gets still linked! # time=6.241ms
    
    # Subtest: 16. Git Tags supplemented
        ok 1 - should be equivalent
        1..1
    ok 17 - 16. Git Tags supplemented # time=9.238ms
    
    # Subtest: 17. Unit test from chlu-cli
        ok 1 - should be equivalent
        1..1
    ok 18 - 17. Unit test from chlu-cli # time=9.416ms
    
    # Subtest: 18. Both package.json and Git data are missing - [32mgithub[39m
        ok 1 - 18
        1..1
    ok 19 - 18. Both package.json and Git data are missing - [32mgithub[39m # time=16.333ms
    
    # Subtest: 19. Both package.json and Git data are missing - [32mbitbucket[39m
        ok 1 - 18 - result has descending order links because source had one row only
        1..1
    ok 20 - 19. Both package.json and Git data are missing - [32mbitbucket[39m # time=6.618ms
    
    1..20
    # time=627.9ms
ok 1 - test/test-end2end.js # time=627.9ms

# Subtest: test/test-util.js
    # Subtest: 01.01 - [35misTitle()[39m - negative result
        ok 1 - 01.01.01
        ok 2 - 01.01.02
        ok 3 - 01.01.03
        ok 4 - 01.01.04
        ok 5 - 01.01.05
        ok 6 - 01.01.06
        ok 7 - 01.01.07
        ok 8 - 01.01.08
        ok 9 - 01.01.09
        ok 10 - 01.01.10
        ok 11 - 01.01.11
        ok 12 - 01.01.12
        ok 13 - 01.01.13
        ok 14 - 01.01.14
        ok 15 - 01.01.15
        ok 16 - 01.01.14
        ok 17 - 01.01.15
        ok 18 - 01.02.16
        ok 19 - 01.02.17
        ok 20 - 01.02.18
        1..20
    ok 1 - 01.01 - [35misTitle()[39m - negative result # time=18.37ms
    
    # Subtest: 01.02 - [35misTitle()[39m - positive result
        ok 1 - 01.02.01
        ok 2 - 01.02.02
        ok 3 - 01.02.03
        ok 4 - 01.02.04
        ok 5 - 01.02.05
        ok 6 - 01.02.06
        1..6
    ok 2 - 01.02 - [35misTitle()[39m - positive result # time=4.526ms
    
    # Subtest: 01.03 - [35misTitle()[39m - non-semver, 2 digits only
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        ok 3 - 01.03.03
        ok 4 - 01.03.04
        ok 5 - 01.03.05
        ok 6 - 01.03.06
        ok 7 - 01.03.07
        ok 8 - 01.03.08
        ok 9 - 01.03.09
        ok 10 - 01.03.10
        1..10
    ok 3 - 01.03 - [35misTitle()[39m - non-semver, 2 digits only # time=6.08ms
    
    # Subtest: 01.04 - [35misTitle()[39m - three hashes, H3
        ok 1 - 01.04.01
        ok 2 - 01.04.02
        ok 3 - 01.04.03
        1..3
    ok 4 - 01.04 - [35misTitle()[39m - three hashes, H3 # time=2.612ms
    
    # Subtest: 01.05 - [35misTitle()[39m - four hashes, H4
        ok 1 - 01.05.01
        ok 2 - 01.05.02
        ok 3 - 01.05.03
        1..3
    ok 5 - 01.05 - [35misTitle()[39m - four hashes, H4 # time=5.964ms
    
    # Subtest: 01.05 - [35misTitle()[39m - all kinds of throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        1..5
    ok 6 - 01.05 - [35misTitle()[39m - all kinds of throws # time=8.39ms
    
    # Subtest: 02.01 - [33misFooterLink()[39m - negative result
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        ok 3 - 02.01.03
        ok 4 - 02.01.04
        ok 5 - 02.01.05
        ok 6 - 02.01.06
        1..6
    ok 7 - 02.01 - [33misFooterLink()[39m - negative result # time=9.876ms
    
    # Subtest: 02.02 - [33misFooterLink()[39m - positive result
        ok 1 - 02.02.01
        ok 2 - 02.02.02
        1..2
    ok 8 - 02.02 - [33misFooterLink()[39m - positive result # time=2.457ms
    
    # Subtest: 02.03 - [33misFooterLink()[39m - all kinds of throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        1..5
    ok 9 - 02.03 - [33misFooterLink()[39m - all kinds of throws # time=3.652ms
    
    # Subtest: 03.01 - [35mgetPreviousVersion()[39m - various throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        ok 6 - expected to throw
        ok 7 - expected to throw
        1..7
    ok 10 - 03.01 - [35mgetPreviousVersion()[39m - various throws # time=5.39ms
    
    # Subtest: 03.02 - [35mgetPreviousVersion()[39m - BAU
        ok 1 - 03.02.01
        ok 2 - 03.02.02
        ok 3 - 03.02.03
        ok 4 - 03.02.04
        ok 5 - 03.02.05
        ok 6 - 03.02.06
        ok 7 - 03.02.07
        ok 8 - 03.02.08
        ok 9 - 03.02.09
        1..9
    ok 11 - 03.02 - [35mgetPreviousVersion()[39m - BAU # time=5.884ms
    
    # Subtest: 03.03 - [35mgetPreviousVersion()[39m - requesting previous of a first
        ok 1 - 03.03
        1..1
    ok 12 - 03.03 - [35mgetPreviousVersion()[39m - requesting previous of a first # time=9.023ms
    
    # Subtest: 04.01 - [33maContainsB()[39m - BAU
        ok 1 - 04.01.01
        ok 2 - 04.01.02
        ok 3 - 04.01.03
        1..3
    ok 13 - 04.01 - [33maContainsB()[39m - BAU # time=6.659ms
    
    # Subtest: 05.01 - [35mgetSetFooterLink()[39m - [33msets[39m correctly GitHub
        ok 1 - 05.01.01
        ok 2 - 05.01.02 - user only
        ok 3 - 05.01.03 - package only
        ok 4 - 05.01.04 - versBefore only
        ok 5 - 05.01.05 - versAfter only
        ok 6 - 05.01.06 - version only
        ok 7 - 05.01.07 - all variables given, Github -> Github
        ok 8 - 05.01.08 - all variables given, Github -> Bitbucket
        1..8
    ok 14 - 05.01 - [35mgetSetFooterLink()[39m - [33msets[39m correctly GitHub # time=7.097ms
    
    # Subtest: 05.02 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly GitHub
        ok 1 - 05.02.01
        ok 2 - 05.02.02 - null as second arg
        ok 3 - 05.02.03 - error with double v - still OK
        ok 4 - 05.02.04 - characters "v" missing completely
        ok 5 - 05.02.05 - one missing, one double v
        1..5
    ok 15 - 05.02 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly GitHub # time=6.635ms
    
    # Subtest: 05.03 - [35mgetSetFooterLink()[39m - [33msets[39m correctly Bitbucket
        ok 1 - 05.03.01
        ok 2 - 05.03.02 - user only
        ok 3 - 05.03.03 - package only
        ok 4 - 05.03.04 - versBefore only
        ok 5 - 05.03.05 - versAfter only
        ok 6 - 05.03.06 - version only
        ok 7 - 05.03.07 - all
        ok 8 - 05.03.08 - all + conversion from GitHub to Bitbucket
        1..8
    ok 16 - 05.03 - [35mgetSetFooterLink()[39m - [33msets[39m correctly Bitbucket # time=5.338ms
    
    # Subtest: 05.04 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly Bitbucket, url is with ... - without diff
        ok 1 - 05.04.01 - URL IS WRONG! It should contain %0D not ...
        ok 2 - 05.04.02 - error with double v - still OK
        ok 3 - 05.04.03 - characters "v" missing completely
        ok 4 - 05.04.04 - one missing, one double v
        ok 5 - 05.04.05 - URL IS WRONG! It should contain %0D not ...
        ok 6 - 05.04.06 - error with double v - still OK
        ok 7 - 05.04.07 - characters "v" missing completely
        ok 8 - 05.04.08 - one missing, one double v
        1..8
    ok 17 - 05.04 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly Bitbucket, url is with ... - without diff # time=14.599ms
    
    # Subtest: 05.05 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly Bitbucket, url is with %0D - without diff
        ok 1 - 05.05.01 - diff is separated by %0D not ...
        ok 2 - 05.05.02 - error with double v - still OK
        ok 3 - 05.05.03 - characters "v" missing completely
        ok 4 - 05.05.04 - one missing, one double v
        1..4
    ok 18 - 05.05 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly Bitbucket, url is with %0D - without diff # time=9.355ms
    
    # Subtest: 05.06 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly Bitbucket, url is with ... - with diff
        ok 1 - 05.06.01 - URL IS WRONG! It should contain %0D not ...
        ok 2 - 05.06.02 - error with double v - still OK
        ok 3 - 05.06.03 - characters "v" missing completely
        ok 4 - 05.06.04 - one missing, one double v
        ok 5 - 05.06.05 - URL IS WRONG! It should contain %0D not ...
        ok 6 - 05.06.06 - error with double v - still OK
        ok 7 - 05.06.07 - characters "v" missing completely
        ok 8 - 05.06.08 - one missing, one double v
        1..8
    ok 19 - 05.06 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly Bitbucket, url is with ... - with diff # time=5.978ms
    
    # Subtest: 05.07 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly Bitbucket, url is with %0D - with diff
        ok 1 - 05.07.01 - diff is separated by %0D not ...
        ok 2 - 05.07.02 - error with double v - still OK
        ok 3 - 05.07.03 - characters "v" missing completely
        ok 4 - 05.07.04 - one missing, one double v
        ok 5 - 05.07.05 - diff is separated by %0D not ...
        ok 6 - 05.07.06 - error with double v - still OK
        ok 7 - 05.07.07 - characters "v" missing completely
        ok 8 - 05.07.08 - one missing, one double v
        1..8
    ok 20 - 05.07 - [35mgetSetFooterLink()[39m - [31mgets[39m correctly Bitbucket, url is with %0D - with diff # time=6.074ms
    
    # Subtest: 05.08 - [35mgetSetFooterLink()[39m - [36mget[39m errors-out, returning null, when link is erroneous
        ok 1 - 05.08
        1..1
    ok 21 - 05.08 - [35mgetSetFooterLink()[39m - [36mget[39m errors-out, returning null, when link is erroneous # time=1.687ms
    
    # Subtest: 06.01 - [33mgetRow()[39m - all kinds of throws
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        1..4
    ok 22 - 06.01 - [33mgetRow()[39m - all kinds of throws # time=20.979ms
    
    # Subtest: 06.02 - [33mgetRow()[39m - BAU
        ok 1 - 07.02.01 - found
        ok 2 - 07.02.01 - not found
        1..2
    ok 23 - 06.02 - [33mgetRow()[39m - BAU # time=2.121ms
    
    # Subtest: 07.01 - [35mfilterDate()[39m - filters out date string
        ok 1 - 07.01.01
        ok 2 - 07.01.02
        ok 3 - 07.01.03
        ok 4 - 07.01.04
        ok 5 - 07.01.05
        ok 6 - 07.01.06
        ok 7 - 07.01.07
        ok 8 - 07.01.08
        ok 9 - 07.01.09
        ok 10 - 07.01.10
        ok 11 - 07.01.11
        ok 12 - 07.01.12
        ok 13 - 07.01.13
        ok 14 - 07.01.14
        ok 15 - 07.01.15
        ok 16 - 07.01.16
        ok 17 - 07.01.17
        ok 18 - 07.01.18
        ok 19 - 07.01.19 - many spaces
        ok 20 - 07.01.20
        ok 21 - 07.01.21
        ok 22 - 07.01.22
        ok 23 - 07.01.23
        ok 24 - 07.01.24
        1..24
    ok 24 - 07.01 - [35mfilterDate()[39m - filters out date string # time=69.856ms
    
    1..24
    # time=399.665ms
ok 2 - test/test-util.js # time=399.665ms

1..2
# time=6506.112ms
