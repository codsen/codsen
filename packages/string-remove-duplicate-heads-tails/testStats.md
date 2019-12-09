TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - wrong/missing input = throw
        ok 1 - expected to throw
        ok 2 - expected to not throw
        1..2
    ok 1 - 01.01 - wrong/missing input = throw # time=11.07ms
    
    # Subtest: 01.02 - wrong opts
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        1..4
    ok 2 - 01.02 - wrong opts # time=5.823ms
    
    # Subtest: 01.03 - empty input string
        ok 1 - 01.03.01
        ok 2 - 01.03.02
        1..2
    ok 3 - 01.03 - empty input string # time=3.607ms
    
    # Subtest: 01.04 - none of heads or tails found
        ok 1 - 01.04.01
        1..1
    ok 4 - 01.04 - none of heads or tails found # time=4.221ms
    
    # Subtest: 02.01 - trims wrapped heads and tails
        ok 1 - 02.01.01
        ok 2 - 02.01.02
        1..2
    ok 5 - 02.01 - trims wrapped heads and tails # time=7.586ms
    
    # Subtest: 02.02 - trims wrapped heads and tails, with space inside heads/tails
        ok 1 - 02.02 - heads and tails with spaces
        1..1
    ok 6 - 02.02 - trims wrapped heads and tails, with space inside heads/tails # time=3.759ms
    
    # Subtest: 02.03 - trimmed heads and tails in the source still get caught
        ok 1 - 02.03 - with spaces, and those spaces are not on str
        1..1
    ok 7 - 02.03 - trimmed heads and tails in the source still get caught # time=2.264ms
    
    # Subtest: 02.04 - excessive whitespace in opts heads/tails doesn't matter
        ok 1 - 02.04 - excessive spaces
        1..1
    ok 8 - 02.04 - excessive whitespace in opts heads/tails doesn't matter # time=3.51ms
    
    # Subtest: 02.05 - single curly brace heads/tails
        ok 1 - 02.05
        1..1
    ok 9 - 02.05 - single curly brace heads/tails # time=3.387ms
    
    # Subtest: 02.06 - custom heads and tails, whitespace both sides
        ok 1 - 02.06
        1..1
    ok 10 - 02.06 - custom heads and tails, whitespace both sides # time=3.338ms
    
    # Subtest: 02.07 - ends with tails, doesn't start with heads
        ok 1 - 02.07
        1..1
    ok 11 - 02.07 - ends with tails, doesn't start with heads # time=2.219ms
    
    # Subtest: 02.08 - starts with heads, doesn't end with tails
        ok 1 - 02.08
        1..1
    ok 12 - 02.08 - starts with heads, doesn't end with tails # time=2.576ms
    
    # Subtest: 02.09 - properly wrapped, heads/tails in array, matched
        ok 1 - 02.09
        1..1
    ok 13 - 02.09 - properly wrapped, heads/tails in array, matched # time=2.706ms
    
    # Subtest: 02.10 - starts with heads, doesn't end with tails
        ok 1 - 02.10
        1..1
    ok 14 - 02.10 - starts with heads, doesn't end with tails # time=2.502ms
    
    # Subtest: 02.11 - unclosed heads
        ok 1 - 02.11
        1..1
    ok 15 - 02.11 - unclosed heads # time=2.116ms
    
    # Subtest: 02.12 - unclosed tails
        ok 1 - 02.12
        1..1
    ok 16 - 02.12 - unclosed tails # time=2.187ms
    
    # Subtest: 02.13 - ends with empty variable
        ok 1 - 02.13
        1..1
    ok 17 - 02.13 - ends with empty variable # time=2.904ms
    
    # Subtest: 02.14 - empty variable with text both sides
        ok 1 - 02.14
        1..1
    ok 18 - 02.14 - empty variable with text both sides # time=2.607ms
    
    # Subtest: 02.15 - heads/tails in opposite order
        ok 1 - 02.15
        1..1
    ok 19 - 02.15 - heads/tails in opposite order # time=2.254ms
    
    # Subtest: 02.16 - tails with text on both sides
        ok 1 - 02.16
        1..1
    ok 20 - 02.16 - tails with text on both sides # time=2.529ms
    
    # Subtest: 02.17 - heads with text on both sides
        ok 1 - 02.17
        1..1
    ok 21 - 02.17 - heads with text on both sides # time=2.378ms
    
    # Subtest: 02.18 - multiple heads, single tails
        ok 1 - 02.18
        1..1
    ok 22 - 02.18 - multiple heads, single tails # time=2.423ms
    
    # Subtest: 02.19 - one set of custom heads and tails, single char string
        ok 1 - 02.19.01
        ok 2 - 02.19.02
        ok 3 - 02.19.03
        ok 4 - 02.19.04
        ok 5 - 02.19.05
        ok 6 - 02.19.06
        ok 7 - 02.19.07
        ok 8 - 02.19.08
        ok 9 - 02.19.09 - checking are defaults not leaking #1
        ok 10 - 02.19.10 - checking are defaults not leaking #2
        1..10
    ok 23 - 02.19 - one set of custom heads and tails, single char string # time=11.016ms
    
    # Subtest: 02.20 - two sets of custom heads and tails, single char string
        ok 1 - 02.20
        1..1
    ok 24 - 02.20 - two sets of custom heads and tails, single char string # time=3.141ms
    
    # Subtest: 02.21 - words with space, single set of custom heads and tails
        ok 1 - 02.21
        1..1
    ok 25 - 02.21 - words with space, single set of custom heads and tails # time=3.06ms
    
    # Subtest: 02.22 - double wrapped with custom heads and tails, with whitespace
        ok 1 - 02.22
        1..1
    ok 26 - 02.22 - double wrapped with custom heads and tails, with whitespace # time=2.894ms
    
    # Subtest: 02.23 - mixed sets of heads and tails #1
        ok 1 - 02.23.01 - input with spaces
        ok 2 - 02.23.02 - both input and head/tail references with spaces
        ok 3 - 02.23.03 - both input and head/tail references with spaces
        1..3
    ok 27 - 02.23 - mixed sets of heads and tails #1 # time=7.205ms
    
    # Subtest: 02.24 - mixed sets of heads and tails #2
        ok 1 - 02.24
        1..1
    ok 28 - 02.24 - mixed sets of heads and tails #2 # time=11.879ms
    
    # Subtest: 02.25 - blank heads and tails within second level being removed
        ok 1 - 02.25.01
        ok 2 - 02.25.02
        ok 3 - 02.25.03
        1..3
    ok 29 - 02.25 - blank heads and tails within second level being removed # time=7.247ms
    
    # Subtest: 02.26 - removing empty head/tail chunks from around the text #1
        ok 1 - 02.26.01
        ok 2 - 02.26.02
        ok 3 - 02.26.03
        ok 4 - 02.26.04
        ok 5 - 02.26.05
        ok 6 - 02.26.06
        1..6
    ok 30 - 02.26 - removing empty head/tail chunks from around the text #1 # time=7.585ms
    
    # Subtest: 02.27 - removing empty head/tail chunks from around the text #2 (touches end)
        ok 1 - 02.27
        1..1
    ok 31 - 02.27 - removing empty head/tail chunks from around the text #2 (touches end) # time=12.641ms
    
    # Subtest: 02.28 - removing empty head/tail chunks from around the text #3 (touches beginning)
        ok 1 - 02.28.01
        ok 2 - 02.28.02 - tab would not get trimmed, but since it was standing in the way of empty heads/tails, it was removed
        1..2
    ok 32 - 02.28 - removing empty head/tail chunks from around the text #3 (touches beginning) # time=6.585ms
    
    # Subtest: 02.29 - leading letter ruins the removal from the front
        ok 1 - 02.29 - because of the "a" the removal is terminated until trailing chunks met
        ok 2 - 02.29.02
        1..2
    ok 33 - 02.29 - leading letter ruins the removal from the front # time=13.177ms
    
    # Subtest: 02.30 - leading line break
        ok 1 - 02.30
        1..1
    ok 34 - 02.30 - leading line break # time=2.608ms
    
    # Subtest: 02.31 - leading line break
        ok 1 - 02.31
        1..1
    ok 35 - 02.31 - leading line break # time=10.964ms
    
    1..35
    # time=456.276ms
ok 1 - test/test.js # time=456.276ms

1..1
# time=3412.771ms
