TAP version 13
# Subtest: test/test.js
    # Subtest: 01.01 - one range, both defaults and inclusive
        ok 1 - 01.01.01 - within range
        ok 2 - 01.01.02 - on the starting of the range
        ok 3 - 01.01.03 - on the starting of the range, inclusive
        ok 4 - 01.01.04 - on the ending of the range
        ok 5 - 01.01.05 - on the ending of the range, inclusive
        ok 6 - 01.01.06 - outside of the range
        ok 7 - 01.01.07 - outside of the range, inclusive
        ok 8 - 01.01.08 - matching against null
        ok 9 - 01.01.09 - matching against null
        1..9
    ok 1 - 01.01 - one range, both defaults and inclusive # time=20.255ms
    
    # Subtest: 01.02 - one range, opts.returnMatchedRangeInsteadOfTrue
        ok 1 - 01.02.01 - within range
        ok 2 - 01.02.02 - on the starting of the range
        ok 3 - 01.02.03 - on the starting of the range, inclusive
        ok 4 - 01.02.04 - on the ending of the range
        ok 5 - 01.02.05 - on the ending of the range, inclusive
        ok 6 - 01.02.06 - outside of the range
        ok 7 - 01.02.07 - outside of the range, inclusive
        1..7
    ok 2 - 01.02 - one range, opts.returnMatchedRangeInsteadOfTrue # time=8.665ms
    
    # Subtest: 02.01 - two ranges, edges on defaults
        ok 1 - 02.01.01 - outside of the range
        ok 2 - 02.01.02 - outside of the range
        ok 3 - 02.01.03 - outside of the range
        ok 4 - 02.01.04 - outside of the range
        ok 5 - 02.01.05 - outside of the range
        1..5
    ok 3 - 02.01 - two ranges, edges on defaults # time=5.39ms
    
    # Subtest: 02.02 - two ranges, edges inclusive
        ok 1 - 02.02.01 - outside of the range
        ok 2 - 02.02.02 - outside of the range
        ok 3 - 02.02.03 - outside of the range
        ok 4 - 02.02.04 - outside of the range
        ok 5 - 02.02.05 - outside of the range
        ok 6 - 02.02.06
        ok 7 - 02.02.07
        ok 8 - 02.02.08
        ok 9 - 02.02.09
        1..9
    ok 4 - 02.02 - two ranges, edges inclusive # time=6.371ms
    
    # Subtest: 02.03 - two ranges, opts.returnMatchedRangeInsteadOfTrue, edges on defaults
        ok 1 - 02.03.01 - outside of the range
        ok 2 - 02.03.02 - outside of the range
        ok 3 - 02.03.03 - outside of the range
        ok 4 - 02.03.04 - outside of the range
        ok 5 - 02.03.05 - outside of the range
        1..5
    ok 5 - 02.03 - two ranges, opts.returnMatchedRangeInsteadOfTrue, edges on defaults # time=5.58ms
    
    # Subtest: 02.04 - two ranges, opts.returnMatchedRangeInsteadOfTrue, edges inclusive
        ok 1 - 02.04.01 - outside of the range
        ok 2 - 02.04.02 - outside of the range
        ok 3 - 02.04.03 - outside of the range
        ok 4 - 02.04.04 - outside of the range
        ok 5 - 02.04.05 - outside of the range
        ok 6 - 02.04.06
        ok 7 - 02.04.07
        ok 8 - 02.04.08
        ok 9 - 02.04.09
        ok 10 - 02.04.10 - zero
        1..10
    ok 6 - 02.04 - two ranges, opts.returnMatchedRangeInsteadOfTrue, edges inclusive # time=8.417ms
    
    # Subtest: 03.01 - more than two ranges, uneven count, not inclusive
        ok 1 - 03.01.01 - outside of the range
        ok 2 - 03.01.02 - with opts, outside of the range
        ok 3 - 03.01.03 - outside of the range
        ok 4 - 03.01.04 - with opts, outside of the range
        1..4
    ok 7 - 03.01 - more than two ranges, uneven count, not inclusive # time=4.371ms
    
    # Subtest: 03.02 - even more ranges, not inclusive
        ok 1 - 03.02.00
        ok 2 - 03.02.00-2
        ok 3 - 03.02.01
        ok 4 - 03.02.01-2
        ok 5 - 03.02.02
        ok 6 - 03.02.03
        ok 7 - 03.02.04
        ok 8 - 03.02.05
        ok 9 - 03.02.05-2
        ok 10 - 03.02.06
        ok 11 - 03.02.06-2
        ok 12 - 03.02.07
        ok 13 - 03.02.07
        ok 14 - 03.02.08
        ok 15 - 03.02.08-2
        ok 16 - 03.02.09
        ok 17 - 03.02.09-2
        ok 18 - 03.02.10
        ok 19 - 03.02.10-2
        ok 20 - 03.02.11
        ok 21 - 03.02.11-2
        ok 22 - 03.02.12
        ok 23 - 03.02.13
        ok 24 - 03.02.14
        ok 25 - 03.02.15
        ok 26 - 03.02.15-2
        ok 27 - 03.02.15-3
        ok 28 - 03.02.15-4
        ok 29 - 03.02.16
        ok 30 - 03.02.16-2
        ok 31 - 03.02.17
        ok 32 - 03.02.18
        ok 33 - 03.02.19
        ok 34 - 03.02.20
        ok 35 - 03.02.20-2
        ok 36 - 03.02.20-3
        ok 37 - 03.02.20-4
        ok 38 - 03.02.21
        ok 39 - 03.02.22
        ok 40 - 03.02.23
        ok 41 - 03.02.24
        ok 42 - 03.02.25
        ok 43 - 03.02.26
        ok 44 - 03.02.27
        ok 45 - 03.02.28
        ok 46 - 03.02.29
        ok 47 - 03.02.30
        ok 48 - 03.02.31
        ok 49 - 03.02.32
        ok 50 - 03.02.33
        ok 51 - 03.02.34
        ok 52 - 03.02.35
        ok 53 - 03.02.36
        ok 54 - 03.02.37
        ok 55 - 03.02.38
        ok 56 - 03.02.39
        ok 57 - 03.02.40
        ok 58 - 03.02.41
        ok 59 - 03.02.42
        ok 60 - 03.02.43
        ok 61 - 03.02.44
        ok 62 - 03.02.45
        ok 63 - 03.02.46
        ok 64 - 03.02.47
        ok 65 - 03.02.48
        ok 66 - 03.02.49
        ok 67 - 03.02.50
        ok 68 - 03.02.51
        ok 69 - 03.02.52
        ok 70 - 03.02.53
        ok 71 - 03.02.54
        ok 72 - 03.02.55-1
        ok 73 - 03.02.55-2
        ok 74 - 03.02.55-3
        ok 75 - 03.02.55-4
        ok 76 - 03.02.56-1
        ok 77 - 03.02.56-2
        ok 78 - 03.02.57
        ok 79 - 03.02.58
        ok 80 - 03.02.59
        ok 81 - 03.02.60
        ok 82 - 03.02.61
        ok 83 - 03.02.62
        ok 84 - 03.02.63
        ok 85 - 03.02.64-1
        ok 86 - 03.02.64-2
        ok 87 - 03.02.65-1
        ok 88 - 03.02.65-2
        ok 89 - 03.02.66-1
        ok 90 - 03.02.66-2
        ok 91 - 03.02.67
        ok 92 - 03.02.68-1
        ok 93 - 03.02.68-2
        ok 94 - 03.02.69
        ok 95 - 03.02.70
        ok 96 - 03.02.71
        ok 97 - 03.02.72
        ok 98 - 03.02.73
        ok 99 - 03.02.74
        ok 100 - 03.02.75
        ok 101 - 03.02.76-1
        ok 102 - 03.02.76-2
        ok 103 - 03.02.77
        ok 104 - 03.02.78
        ok 105 - 03.02.79
        ok 106 - 03.02.80
        ok 107 - 03.02.81
        ok 108 - 03.02.82
        ok 109 - 03.02.83
        ok 110 - 03.02.84
        ok 111 - 03.02.85
        ok 112 - 03.02.86-1
        ok 113 - 03.02.86-2
        ok 114 - 03.02.87
        ok 115 - 03.02.88
        ok 116 - 03.02.89
        ok 117 - 03.02.90
        ok 118 - 03.02.91
        ok 119 - 03.02.92
        ok 120 - 03.02.93
        ok 121 - 03.02.94
        ok 122 - 03.02.95
        ok 123 - 03.02.96
        ok 124 - 03.02.97-1
        ok 125 - 03.02.97-2
        ok 126 - 03.02.98
        ok 127 - 03.02.99
        ok 128 - 03.02.100-1
        ok 129 - 03.02.100-2
        ok 130 - 03.02.100-3
        ok 131 - 03.02.100-4
        ok 132 - 03.02.105
        ok 133 - 03.02.110
        ok 134 - 03.02.112
        ok 135 - 03.02.116-1
        ok 136 - 03.02.116-2
        ok 137 - 03.02.120
        ok 138 - 03.02.124-1
        ok 139 - 03.02.124-2
        ok 140 - 03.02.124-3
        ok 141 - 03.02.124-4
        ok 142 - 03.02.126-1
        ok 143 - 03.02.126-2
        ok 144 - 03.02.126-3
        ok 145 - 03.02.126-4
        ok 146 - 03.02.130-1
        ok 147 - 03.02.130-2
        ok 148 - 03.02.130-3
        ok 149 - 03.02.130-4
        ok 150 - 03.02.131-1
        ok 151 - 03.02.131-2
        ok 152 - 03.02.131-3
        ok 153 - 03.02.131-4
        ok 154 - 03.02.132-1
        ok 155 - 03.02.132-2
        ok 156 - 03.02.132-3
        ok 157 - 03.02.132-4
        1..157
    ok 8 - 03.02 - even more ranges, not inclusive # time=118.223ms
    
    # Subtest: 03.03 - small ranges - zero
        ok 1 - 03.03.01 - no opts
        ok 2 - 03.03.02 - hardcoded opts defaults
        ok 3 - 03.03.03 - inclusive
        ok 4 - 03.03.04
        ok 5 - 03.03.05 - overlap
        ok 6 - 03.03.06 - overlap #2
        ok 7 - 03.03.06 - overlap and wrong order
        ok 8 - 03.03.07 - overlap and wrong order - inclusive
        ok 9 - 03.03.08 - overlap and wrong order - inclusive
        ok 10 - 03.03.09 - no opts
        ok 11 - 03.03.10 - hardcoded opts defaults
        ok 12 - 03.03.11 - inclusive
        ok 13 - 03.03.12
        ok 14 - 03.03.13 - overlap
        ok 15 - 03.03.14 - overlap #2
        ok 16 - 03.03.15 - overlap and wrong order
        ok 17 - 03.03.16 - overlap and wrong order - inclusive
        ok 18 - 03.03.17 - overlap and wrong order - inclusive
        1..18
    ok 9 - 03.03 - small ranges - zero # time=8.87ms
    
    # Subtest: 03.04 - small ranges - one
        ok 1 - 03.04.01 - no opts
        ok 2 - 03.04.02 - hardcoded opts defaults
        ok 3 - 03.04.03 - inclusive
        ok 4 - 03.04.04
        ok 5 - 03.04.05 - hardcoded opts defaults
        ok 6 - 03.04.06 - inclusive
        1..6
    ok 10 - 03.04 - small ranges - one # time=20.554ms
    
    # Subtest: 03.05 - identical range endings
        ok 1 - 03.05.01
        ok 2 - 03.05.02
        ok 3 - 03.05.03
        ok 4 - 03.05.04
        ok 5 - 03.05.05 - identical range ends, index under
        ok 6 - 03.05.06 - identical range ends, index above
        ok 7 - 03.05.07 - identical range ends, index above
        ok 8 - 03.05.08 - identical consecutive
        ok 9 - 03.05.09 - identical consecutive
        ok 10 - 03.05.10 - identical consecutive
        ok 11 - 03.05.11 - identical consecutive
        ok 12 - 03.05.12 - identical consecutive
        ok 13 - 03.05.13 - identical consecutive
        ok 14 - 03.05.14 - identical consecutive with gap
        ok 15 - 03.05.15 - identical consecutive with gap
        ok 16 - 03.05.16
        ok 17 - 03.05.17
        ok 18 - 03.05.18
        ok 19 - 03.05.19
        ok 20 - 03.05.20 - identical range ends, index under
        ok 21 - 03.05.21 - identical range ends, index above
        ok 22 - 03.05.22 - identical range ends, index above
        ok 23 - 03.05.23 - identical consecutive
        ok 24 - 03.05.24 - identical consecutive
        ok 25 - 03.05.25 - identical consecutive
        ok 26 - 03.05.26 - identical consecutive
        ok 27 - 03.05.27 - identical consecutive
        ok 28 - 03.05.28 - identical consecutive
        ok 29 - 03.05.29 - identical consecutive with gap
        ok 30 - 03.05.30 - identical consecutive with gap
        1..30
    ok 11 - 03.05 - identical range endings # time=45.147ms
    
    # Subtest: Ad-hoc #1
        ok 1 - 04.01.01
        ok 2 - 04.01.02
        1..2
    ok 12 - Ad-hoc #1 # time=3.148ms
    
    # Subtest: Ad-hoc #2
        ok 1 - 04.02
        1..1
    ok 13 - Ad-hoc #2 # time=2.144ms
    
    # Subtest: Ad-hoc #3
        ok 1 - 04.03
        1..1
    ok 14 - Ad-hoc #3 # time=2.188ms
    
    1..14
    # time=444.914ms
ok 1 - test/test.js # time=444.914ms

1..1
# time=2880.453ms
