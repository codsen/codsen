TAP version 13
ok 1 - test/test.js # time=555.932ms {
    # Subtest: 01.01 - wrong/missing input = throw
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to throw
        ok 4 - expected to throw
        ok 5 - expected to throw
        1..5
    ok 1 - 01.01 - wrong/missing input = throw # time=16.775ms
    
    # Subtest: 01.02 - wrong opts = throw
        ok 1 - expected to throw
        ok 2 - expected to throw
        ok 3 - expected to not throw
        ok 4 - expected to not throw
        ok 5 - expected to not throw
        1..5
    ok 2 - 01.02 - wrong opts = throw # time=7.744ms
    
    # Subtest: 01.03 - 1000 chars line = throw
        ok 1 - expected to throw
        ok 2 - expected to not throw
        ok 3 - expected to not throw
        ok 4 - expected to throw
        ok 5 - expected to not throw
        ok 6 - expected to not throw
        1..6
    ok 3 - 01.03 - 1000 chars line = throw # time=34.905ms
    
    # Subtest: 02.00 - NULL control char (dec. 0) is not ok
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 4 - 02.00 - NULL control char (dec. 0) is not ok # time=9.779ms
    
    # Subtest: 02.01 - SOH control char (dec. 1) is not ok
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 5 - 02.01 - SOH control char (dec. 1) is not ok # time=1.926ms
    
    # Subtest: 02.02 - STX control char (dec. 2) is not ok
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 6 - 02.02 - STX control char (dec. 2) is not ok # time=1.851ms
    
    # Subtest: 02.03 - ETX control char (dec. 3) is not ok
        ok 1 - expected to throw
        1..1
    ok 7 - 02.03 - ETX control char (dec. 3) is not ok # time=1.251ms
    
    # Subtest: 02.04 - EOT control char (dec. 4) is not ok
        ok 1 - expected to throw
        1..1
    ok 8 - 02.04 - EOT control char (dec. 4) is not ok # time=1.406ms
    
    # Subtest: 02.05 - ENQ control char (dec. 5) is not ok
        ok 1 - expected to throw
        1..1
    ok 9 - 02.05 - ENQ control char (dec. 5) is not ok # time=1.144ms
    
    # Subtest: 02.06 - ACK control char (dec. 6) is not ok
        ok 1 - expected to throw
        1..1
    ok 10 - 02.06 - ACK control char (dec. 6) is not ok # time=1.268ms
    
    # Subtest: 02.07 - BEL control char (dec. 7) is not ok
        ok 1 - expected to throw
        1..1
    ok 11 - 02.07 - BEL control char (dec. 7) is not ok # time=1.014ms
    
    # Subtest: 02.08 - BS control char (dec. 8) is not ok
        ok 1 - expected to throw
        1..1
    ok 12 - 02.08 - BS control char (dec. 8) is not ok # time=1.097ms
    
    # Subtest: 02.09 - HT control char horizontal tabulation (dec. 9) is ok
        ok 1 - expected to not throw
        ok 2 - expected to not throw
        1..2
    ok 13 - 02.09 - HT control char horizontal tabulation (dec. 9) is ok # time=2.259ms
    
    # Subtest: 02.10 - LF new line control character (dec. 10) is ok
        ok 1 - expected to not throw
        1..1
    ok 14 - 02.10 - LF new line control character (dec. 10) is ok # time=1.095ms
    
    # Subtest: 02.11 - VT control char (dec. 11) is not ok
        ok 1 - expected to throw
        1..1
    ok 15 - 02.11 - VT control char (dec. 11) is not ok # time=3.547ms
    
    # Subtest: 02.12 - FF control char (dec. 12) is not ok
        ok 1 - expected to throw
        1..1
    ok 16 - 02.12 - FF control char (dec. 12) is not ok # time=1.12ms
    
    # Subtest: 02.13 - CR control char (dec. 13) is ok
        ok 1 - expected to not throw
        1..1
    ok 17 - 02.13 - CR control char (dec. 13) is ok # time=0.994ms
    
    # Subtest: 02.14 - SO control char (dec. 14) is not ok
        ok 1 - expected to throw
        1..1
    ok 18 - 02.14 - SO control char (dec. 14) is not ok # time=1.083ms
    
    # Subtest: 02.15 - SI control char (dec. 15) is not ok
        ok 1 - expected to throw
        1..1
    ok 19 - 02.15 - SI control char (dec. 15) is not ok # time=1.128ms
    
    # Subtest: 02.16 - DLE control char (dec. 16) is not ok
        ok 1 - expected to throw
        1..1
    ok 20 - 02.16 - DLE control char (dec. 16) is not ok # time=1.115ms
    
    # Subtest: 02.17 - DC1 control char (dec. 17) is not ok
        ok 1 - expected to throw
        1..1
    ok 21 - 02.17 - DC1 control char (dec. 17) is not ok # time=1.112ms
    
    # Subtest: 02.18 - DC2 control char (dec. 18) is not ok
        ok 1 - expected to throw
        1..1
    ok 22 - 02.18 - DC2 control char (dec. 18) is not ok # time=2.334ms
    
    # Subtest: 02.19 - DC3 control char (dec. 19) is not ok
        ok 1 - expected to throw
        1..1
    ok 23 - 02.19 - DC3 control char (dec. 19) is not ok # time=1.173ms
    
    # Subtest: 02.20 - DC4 control char (dec. 20) is not ok
        ok 1 - expected to throw
        1..1
    ok 24 - 02.20 - DC4 control char (dec. 20) is not ok # time=1.509ms
    
    # Subtest: 02.21 - NA control char (dec. 21) is not ok
        ok 1 - expected to throw
        1..1
    ok 25 - 02.21 - NA control char (dec. 21) is not ok # time=1.162ms
    
    # Subtest: 02.22 - SI control char (dec. 22) is not ok
        ok 1 - expected to throw
        1..1
    ok 26 - 02.22 - SI control char (dec. 22) is not ok # time=2.038ms
    
    # Subtest: 02.23 - EOTB control char (dec. 23) is not ok
        ok 1 - expected to throw
        1..1
    ok 27 - 02.23 - EOTB control char (dec. 23) is not ok # time=1.088ms
    
    # Subtest: 02.24 - CANCL control char (dec. 24) is not ok
        ok 1 - expected to throw
        1..1
    ok 28 - 02.24 - CANCL control char (dec. 24) is not ok # time=1.1ms
    
    # Subtest: 02.25 - EOM control char (dec. 25) is not ok
        ok 1 - expected to throw
        1..1
    ok 29 - 02.25 - EOM control char (dec. 25) is not ok # time=1.122ms
    
    # Subtest: 02.26 - SUBS control char (dec. 26) is not ok
        ok 1 - expected to throw
        1..1
    ok 30 - 02.26 - SUBS control char (dec. 26) is not ok # time=2.08ms
    
    # Subtest: 02.27 - ESC control char (dec. 27) is not ok
        ok 1 - expected to throw
        1..1
    ok 31 - 02.27 - ESC control char (dec. 27) is not ok # time=1.178ms
    
    # Subtest: 02.28 - IS4 control char (dec. 28) is not ok
        ok 1 - expected to throw
        1..1
    ok 32 - 02.28 - IS4 control char (dec. 28) is not ok # time=1.099ms
    
    # Subtest: 02.29 - IS3 control char (dec. 29) is not ok
        ok 1 - expected to throw
        1..1
    ok 33 - 02.29 - IS3 control char (dec. 29) is not ok # time=1.053ms
    
    # Subtest: 02.30 - IS2 control char (dec. 30) is not ok
        ok 1 - expected to throw
        1..1
    ok 34 - 02.30 - IS2 control char (dec. 30) is not ok # time=1.036ms
    
    # Subtest: 02.31 - IS1 control char (dec. 31) is not ok
        ok 1 - expected to throw
        1..1
    ok 35 - 02.31 - IS1 control char (dec. 31) is not ok # time=1.619ms
    
    # Subtest: 02.32 - space (dec. 32) is ok
        ok 1 - expected to not throw
        1..1
    ok 36 - 02.32 - space (dec. 32) is ok # time=1.087ms
    
    # Subtest: 02.33 - delete (dec. 127) is not cool!
        ok 1 - expected to throw
        ok 2 - expected to throw
        1..2
    ok 37 - 02.33 - delete (dec. 127) is not cool! # time=1.806ms
    
    # Subtest: 03.01 - some random HTML for fun - whole EMAILCOMB.COM website
        ok 1 - expected to not throw
        1..1
    ok 38 - 03.01 - some random HTML for fun - whole EMAILCOMB.COM website # time=11.838ms
    
    1..38
    # time=555.932ms
}

1..1
# time=3224.441ms
