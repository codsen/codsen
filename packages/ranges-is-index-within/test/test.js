const test = require('ava')
const wthn = require('../dist/ranges-is-index-within.cjs')

// ==============================
// 0. THROWS
// ==============================

test('00.01 - 1st arg is not a natural number', (t) => {
  t.throws(() => {
    wthn(1.2, [[0, 3]])
  })
})

test('00.02 - 1st arg is neither natural number nor string', (t) => {
  t.throws(() => {
    wthn(null, [[0, 3]])
  })
  t.throws(() => {
    wthn(undefined, [[0, 3]])
  })
  t.throws(() => {
    wthn(['a'], [[0, 3]])
  })
  t.throws(() => {
    wthn([], [[0, 3]])
  })
})

test('00.03 - 1st arg can be a natural number string', (t) => {
  t.notThrows(() => {
    wthn('1', [[0, 3]])
  })
  t.throws(() => {
    wthn('1.2', [[0, 3]])
  })
})

test('00.04 - ranges contain non-natural numbers', (t) => {
  t.throws(() => {
    wthn(1, [[0, 3.1], [4, 5]])
  })
})

test('00.05 - second input, ranges, is missing', (t) => {
  t.throws(() => {
    wthn(1)
  })
})

test('00.06 - second input, ranges, is of a wrong type', (t) => {
  t.throws(() => {
    wthn(1, 1)
  })
  t.throws(() => {
    wthn(1, ['1'])
  })
  t.throws(() => {
    wthn(1, ['1, 2'])
  })
  t.throws(() => {
    wthn(1, null)
  })
  t.throws(() => {
    wthn(1, true)
  })
  t.throws(() => {
    wthn(1, 1.5)
  })
})

test('00.07 - second input, ranges, is array, but it\'s empty', (t) => {
  t.throws(() => {
    wthn(1, [])
  })
})

test('00.08 - opts is of a wrong type', (t) => {
  t.throws(() => {
    wthn(2, [[1, 3]], 1)
  })
  t.throws(() => {
    wthn(2, [[1, 3]], [])
  })
  t.throws(() => {
    wthn(2, [[1, 3]], true)
  })
  t.throws(() => {
    wthn(2, [[1, 3]], 'a')
  })
  t.notThrows(() => {
    wthn(2, [[1, 3]], {})
  })
  t.notThrows(() => {
    wthn(2, [[1, 3]], null) // can be falsey - will be ignored
  })
  t.notThrows(() => {
    wthn(2, [[1, 3]], undefined) // can be hard-coded literal undefined - will be ignored
  })
})

// ==============================
// 01. One range
// ==============================

test('01.01 - one range, both defaults and inclusive', (t) => {
  t.deepEqual(
    wthn(1, [[0, 3]]),
    true,
    '01.01.01 - within range',
  )
  t.deepEqual(
    wthn(0, [[0, 3]]),
    false,
    '01.01.02 - on the starting of the range',
  )
  t.deepEqual(
    wthn(0, [[0, 3]], { inclusiveRangeEnds: true }),
    true,
    '01.01.03 - on the starting of the range, inclusive',
  )
  t.deepEqual(
    wthn(3, [[0, 3]]),
    false,
    '01.01.04 - on the ending of the range',
  )
  t.deepEqual(
    wthn(3, [[0, 3]], { inclusiveRangeEnds: true }),
    true,
    '01.01.05 - on the ending of the range, inclusive',
  )
  t.deepEqual(
    wthn(99, [[0, 3]]),
    false,
    '01.01.06 - outside of the range',
  )
  t.deepEqual(
    wthn(99, [[0, 3]], { inclusiveRangeEnds: true }),
    false,
    '01.01.07 - outside of the range, inclusive',
  )
})

test('01.02 - one range, opts.returnMatchedRangeInsteadOfTrue', (t) => {
  t.deepEqual(
    wthn(1, [[0, 3]], { returnMatchedRangeInsteadOfTrue: true }),
    [0, 3],
    '01.02.01 - within range',
  )
  t.deepEqual(
    wthn(0, [[0, 3]], { returnMatchedRangeInsteadOfTrue: true }),
    false,
    '01.02.02 - on the starting of the range',
  )
  t.deepEqual(
    wthn(0, [[0, 3]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [0, 3],
    '01.02.03 - on the starting of the range, inclusive',
  )
  t.deepEqual(
    wthn(3, [[0, 3]], { returnMatchedRangeInsteadOfTrue: true }),
    false,
    '01.02.04 - on the ending of the range',
  )
  t.deepEqual(
    wthn(3, [[0, 3]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [0, 3],
    '01.02.05 - on the ending of the range, inclusive',
  )
  t.deepEqual(
    wthn(99, [[0, 3]], { returnMatchedRangeInsteadOfTrue: true }),
    false,
    '01.02.06 - outside of the range',
  )
  t.deepEqual(
    wthn(99, [[0, 3]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    false,
    '01.02.07 - outside of the range, inclusive',
  )
})

// ==============================
// 02. Two ranges
// ==============================

test('02.01 - two ranges, edges on defaults', (t) => {
  t.deepEqual(
    wthn(1, [[2, 4], [6, 8]]),
    false,
    '02.01.01 - outside of the range',
  )
  t.deepEqual(
    wthn(5, [[2, 4], [6, 8]]),
    false,
    '02.01.02 - outside of the range',
  )
  t.deepEqual(
    wthn(9, [[2, 4], [6, 8]]),
    false,
    '02.01.03 - outside of the range',
  )
  t.deepEqual(
    wthn(3, [[2, 4], [6, 8]]),
    true,
    '02.01.04 - outside of the range',
  )
  t.deepEqual(
    wthn(7, [[2, 4], [6, 8]]),
    true,
    '02.01.05 - outside of the range',
  )
})

test('02.02 - two ranges, edges inclusive', (t) => {
  // same as 02.01
  t.deepEqual(
    wthn(1, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    false,
    '02.02.01 - outside of the range',
  )
  t.deepEqual(
    wthn(5, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    false,
    '02.02.02 - outside of the range',
  )
  t.deepEqual(
    wthn(9, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    false,
    '02.02.03 - outside of the range',
  )
  t.deepEqual(
    wthn(3, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    true,
    '02.02.04 - outside of the range',
  )
  t.deepEqual(
    wthn(7, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    true,
    '02.02.05 - outside of the range',
  )

  // checking range edges:
  t.deepEqual(
    wthn(2, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    true,
    '02.02.06',
  )
  t.deepEqual(
    wthn(4, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    true,
    '02.02.07',
  )
  t.deepEqual(
    wthn(6, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    true,
    '02.02.08',
  )
  t.deepEqual(
    wthn(8, [[2, 4], [6, 8]], { inclusiveRangeEnds: true }),
    true,
    '02.02.09',
  )
})

test('02.03 - two ranges, opts.returnMatchedRangeInsteadOfTrue, edges on defaults', (t) => {
  t.deepEqual(
    wthn(1, [[2, 4], [6, 8]], { returnMatchedRangeInsteadOfTrue: true }),
    false,
    '02.03.01 - outside of the range',
  )
  t.deepEqual(
    wthn(5, [[2, 4], [6, 8]], { returnMatchedRangeInsteadOfTrue: true }),
    false,
    '02.03.02 - outside of the range',
  )
  t.deepEqual(
    wthn(9, [[2, 4], [6, 8]], { returnMatchedRangeInsteadOfTrue: true }),
    false,
    '02.03.03 - outside of the range',
  )
  t.deepEqual(
    wthn(3, [[2, 4], [6, 8]], { returnMatchedRangeInsteadOfTrue: true }),
    [2, 4],
    '02.03.04 - outside of the range',
  )
  t.deepEqual(
    wthn(7, [[2, 4], [6, 8]], { returnMatchedRangeInsteadOfTrue: true }),
    [6, 8],
    '02.03.05 - outside of the range',
  )
})

test('02.04 - two ranges, opts.returnMatchedRangeInsteadOfTrue, edges inclusive', (t) => {
  // same as 02.01
  t.deepEqual(
    wthn(1, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    false,
    '02.04.01 - outside of the range',
  )
  t.deepEqual(
    wthn(5, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    false,
    '02.04.02 - outside of the range',
  )
  t.deepEqual(
    wthn(9, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    false,
    '02.04.03 - outside of the range',
  )
  t.deepEqual(
    wthn(3, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [2, 4],
    '02.04.04 - outside of the range',
  )
  t.deepEqual(
    wthn(7, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [6, 8],
    '02.04.05 - outside of the range',
  )
  // checking range edges:
  t.deepEqual(
    wthn(2, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [2, 4],
    '02.04.06',
  )
  t.deepEqual(
    wthn(4, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [2, 4],
    '02.04.07',
  )
  t.deepEqual(
    wthn(6, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [6, 8],
    '02.04.08',
  )
  t.deepEqual(
    wthn(8, [[2, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [6, 8],
    '02.04.09',
  )
  t.deepEqual(
    wthn(0, [[0, 4], [6, 8]], { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }),
    [0, 4],
    '02.04.10 - zero',
  )
})

// ==============================
// 03. Many ranges
// ==============================

test('03.01 - more than two ranges, uneven count, not inclusive', (t) => {
  t.deepEqual(
    wthn(5, [[2, 4], [6, 8], [10, 15], [20, 30], [35, 40], [45, 50], [55, 60]]),
    false,
    '03.01.01 - outside of the range',
  )
  t.deepEqual(
    wthn(
      5,
      [[2, 4], [6, 8], [10, 15], [20, 30], [35, 40], [45, 50], [55, 60]],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.01.02 - with opts, outside of the range',
  )
  t.deepEqual(
    wthn(
      5,
      [[2, 4], [6, 8], [10, 15], [20, 30], [35, 40], [45, 50], [55, 60]],
      { inclusiveRangeEnds: true },
    ),
    false,
    '03.01.03 - outside of the range',
  )
  t.deepEqual(
    wthn(
      5,
      [[2, 4], [6, 8], [10, 15], [20, 30], [35, 40], [45, 50], [55, 60]],
      { returnMatchedRangeInsteadOfTrue: true, inclusiveRangeEnds: true },
    ),
    false,
    '03.01.04 - with opts, outside of the range',
  )
})

test('03.02 - even more ranges, not inclusive', (t) => {
  t.deepEqual(
    wthn(
      0,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.00',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.00-2',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.01',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.01-2',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.02',
  )
  t.deepEqual(
    wthn(
      3,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.03',
  )
  t.deepEqual(
    wthn(
      4,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.04',
  )
  t.deepEqual(
    wthn(
      5,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.05',
  )
  t.deepEqual(
    wthn(
      5,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.05-2',
  )
  t.deepEqual(
    wthn(
      6,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.06',
  )
  t.deepEqual(
    wthn(
      6,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [5, 10],
    '03.02.06-2',
  )
  t.deepEqual(
    wthn(
      7,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.07',
  )
  t.deepEqual(
    wthn(
      7,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [5, 10],
    '03.02.07',
  )
  t.deepEqual(
    wthn(
      8,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.08',
  )
  t.deepEqual(
    wthn(
      8,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [5, 10],
    '03.02.08-2',
  )
  t.deepEqual(
    wthn(
      9,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.09',
  )
  t.deepEqual(
    wthn(
      9,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [5, 10],
    '03.02.09-2',
  )
  t.deepEqual(
    wthn(
      10,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.10',
  )
  t.deepEqual(
    wthn(
      10,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.10-2',
  )
  t.deepEqual(
    wthn(
      11,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.11',
  )
  t.deepEqual(
    wthn(
      11,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.11-2',
  )
  t.deepEqual(
    wthn(
      12,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.12',
  )
  t.deepEqual(
    wthn(
      13,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.13',
  )
  t.deepEqual(
    wthn(
      14,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.14',
  )
  t.deepEqual(
    wthn(
      15,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.15',
  )
  t.deepEqual(
    wthn(
      15,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.02.15-2',
  )
  t.deepEqual(
    wthn(
      15,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.15-3',
  )
  t.deepEqual(
    wthn(
      15,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [15, 20],
    '03.02.15-4',
  )
  t.deepEqual(
    wthn(
      16,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.16',
  )
  t.deepEqual(
    wthn(
      16,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [15, 20],
    '03.02.16-2',
  )
  t.deepEqual(
    wthn(
      17,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.17',
  )
  t.deepEqual(
    wthn(
      18,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.18',
  )
  t.deepEqual(
    wthn(
      19,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.19',
  )
  t.deepEqual(
    wthn(
      20,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.20',
  )
  t.deepEqual(
    wthn(
      20,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.02.20-2',
  )
  t.deepEqual(
    wthn(
      20,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.20-3',
  )
  t.deepEqual(
    wthn(
      20,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [15, 20],
    '03.02.20-4',
  )
  t.deepEqual(
    wthn(
      21,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.21',
  )
  t.deepEqual(
    wthn(
      22,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.22',
  )
  t.deepEqual(
    wthn(
      23,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.23',
  )
  t.deepEqual(
    wthn(
      24,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.24',
  )
  t.deepEqual(
    wthn(
      25,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.25',
  )
  t.deepEqual(
    wthn(
      26,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.26',
  )
  t.deepEqual(
    wthn(
      27,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.27',
  )
  t.deepEqual(
    wthn(
      28,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.28',
  )
  t.deepEqual(
    wthn(
      29,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.29',
  )
  t.deepEqual(
    wthn(
      30,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.30',
  )
  t.deepEqual(
    wthn(
      31,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.31',
  )
  t.deepEqual(
    wthn(
      32,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.32',
  )
  t.deepEqual(
    wthn(
      33,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.33',
  )
  t.deepEqual(
    wthn(
      34,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.34',
  )
  t.deepEqual(
    wthn(
      35,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.35',
  )
  t.deepEqual(
    wthn(
      36,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.36',
  )
  t.deepEqual(
    wthn(
      37,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.37',
  )
  t.deepEqual(
    wthn(
      38,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.38',
  )
  t.deepEqual(
    wthn(
      39,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.39',
  )
  t.deepEqual(
    wthn(
      40,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.40',
  )
  t.deepEqual(
    wthn(
      41,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.41',
  )
  t.deepEqual(
    wthn(
      42,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.42',
  )
  t.deepEqual(
    wthn(
      43,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.43',
  )
  t.deepEqual(
    wthn(
      44,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.44',
  )
  t.deepEqual(
    wthn(
      45,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.45',
  )
  t.deepEqual(
    wthn(
      46,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.46',
  )
  t.deepEqual(
    wthn(
      47,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.47',
  )
  t.deepEqual(
    wthn(
      48,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.48',
  )
  t.deepEqual(
    wthn(
      49,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.49',
  )
  t.deepEqual(
    wthn(
      50,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.50',
  )
  t.deepEqual(
    wthn(
      51,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.51',
  )
  t.deepEqual(
    wthn(
      52,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.52',
  )
  t.deepEqual(
    wthn(
      53,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.53',
  )
  t.deepEqual(
    wthn(
      54,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.54',
  )
  t.deepEqual(
    wthn(
      55,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.55-1',
  )
  t.deepEqual(
    wthn(
      55,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.02.55-2',
  )
  t.deepEqual(
    wthn(
      55,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.55-3',
  )
  t.deepEqual(
    wthn(
      55,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [55, 60],
    '03.02.55-4',
  )
  t.deepEqual(
    wthn(
      56,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.56-1',
  )
  t.deepEqual(
    wthn(
      56,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [55, 60],
    '03.02.56-2',
  )
  t.deepEqual(
    wthn(
      57,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.57',
  )
  t.deepEqual(
    wthn(
      58,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.58',
  )
  t.deepEqual(
    wthn(
      59,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.59',
  )
  t.deepEqual(
    wthn(
      60,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.60',
  )
  t.deepEqual(
    wthn(
      61,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.61',
  )
  t.deepEqual(
    wthn(
      62,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.62',
  )
  t.deepEqual(
    wthn(
      63,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.63',
  )
  t.deepEqual(
    wthn(
      64,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.64-1',
  )
  t.deepEqual(
    wthn(
      64,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.64-2',
  )
  t.deepEqual(
    wthn(
      65,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.65-1',
  )
  t.deepEqual(
    wthn(
      65,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.65-2',
  )
  t.deepEqual(
    wthn(
      66,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.66-1',
  )
  t.deepEqual(
    wthn(
      66,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [65, 70],
    '03.02.66-2',
  )
  t.deepEqual(
    wthn(
      67,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.67',
  )
  t.deepEqual(
    wthn(
      68,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.68-1',
  )
  t.deepEqual(
    wthn(
      68,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [65, 70],
    '03.02.68-2',
  )
  t.deepEqual(
    wthn(
      69,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.69',
  )
  t.deepEqual(
    wthn(
      70,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.70',
  )
  t.deepEqual(
    wthn(
      71,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.71',
  )
  t.deepEqual(
    wthn(
      72,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.72',
  )
  t.deepEqual(
    wthn(
      73,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.73',
  )
  t.deepEqual(
    wthn(
      74,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.74',
  )
  t.deepEqual(
    wthn(
      75,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.75',
  )
  t.deepEqual(
    wthn(
      76,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.76-1',
  )
  t.deepEqual(
    wthn(
      76,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [75, 80],
    '03.02.76-2',
  )
  t.deepEqual(
    wthn(
      77,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.77',
  )
  t.deepEqual(
    wthn(
      78,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.78',
  )
  t.deepEqual(
    wthn(
      79,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.79',
  )
  t.deepEqual(
    wthn(
      80,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.80',
  )
  t.deepEqual(
    wthn(
      81,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.81',
  )
  t.deepEqual(
    wthn(
      82,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.82',
  )
  t.deepEqual(
    wthn(
      83,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.83',
  )
  t.deepEqual(
    wthn(
      84,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.84',
  )
  t.deepEqual(
    wthn(
      85,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.85',
  )
  t.deepEqual(
    wthn(
      86,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.86-1',
  )
  t.deepEqual(
    wthn(
      86,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [85, 90],
    '03.02.86-2',
  )
  t.deepEqual(
    wthn(
      87,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.87',
  )
  t.deepEqual(
    wthn(
      88,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.88',
  )
  t.deepEqual(
    wthn(
      89,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.89',
  )
  t.deepEqual(
    wthn(
      90,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.90',
  )
  t.deepEqual(
    wthn(
      91,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.91',
  )
  t.deepEqual(
    wthn(
      92,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.92',
  )
  t.deepEqual(
    wthn(
      93,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.93',
  )
  t.deepEqual(
    wthn(
      94,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.94',
  )
  t.deepEqual(
    wthn(
      95,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.95',
  )
  t.deepEqual(
    wthn(
      96,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.96',
  )
  t.deepEqual(
    wthn(
      97,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.97-1',
  )
  t.deepEqual(
    wthn(
      97,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    [95, 100],
    '03.02.97-2',
  )
  t.deepEqual(
    wthn(
      98,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.98',
  )
  t.deepEqual(
    wthn(
      99,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '03.02.99',
  )
  t.deepEqual(
    wthn(
      100,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '03.02.100-1',
  )
  t.deepEqual(
    wthn(
      100,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.02.100-2',
  )
  t.deepEqual(
    wthn(
      100,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.100-3',
  )
  t.deepEqual(
    wthn(
      100,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [95, 100],
    '03.02.100-4',
  )

  //

  t.deepEqual(
    wthn(
      105,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [105, 110],
    '03.02.105',
  )
  t.deepEqual(
    wthn(
      110,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.110',
  )
  t.deepEqual(
    wthn(
      112,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: false },
    ),
    false,
    '03.02.112',
  )
  t.deepEqual(
    wthn(
      116,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: false },
    ),
    true,
    '03.02.116-1',
  )
  t.deepEqual(
    wthn(
      116,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    [115, 120],
    '03.02.116-2',
  )
  t.deepEqual(
    wthn(
      120,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.120',
  )
  t.deepEqual(
    wthn(
      124,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.124-1',
  )
  t.deepEqual(
    wthn(
      124,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: false },
    ),
    false,
    '03.02.124-2',
  )
  t.deepEqual(
    wthn(
      124,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.124-3',
  )
  t.deepEqual(
    wthn(
      124,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: false },
    ),
    false,
    '03.02.124-4',
  )
  t.deepEqual(
    wthn(
      126,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: false },
    ),
    true,
    '03.02.126-1',
  )
  t.deepEqual(
    wthn(
      126,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: false },
    ),
    true,
    '03.02.126-2',
  )
  t.deepEqual(
    wthn(
      126,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [125, 130],
    '03.02.126-3',
  )
  t.deepEqual(
    wthn(
      126,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    [125, 130],
    '03.02.126-4',
  )

  t.deepEqual(
    wthn(
      130,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.130-1',
  )
  t.deepEqual(
    wthn(
      130,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [125, 130],
    '03.02.130-2',
  )
  t.deepEqual(
    wthn(
      130,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: false },
    ),
    false,
    '03.02.130-3',
  )
  t.deepEqual(
    wthn(
      130,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: false },
    ),
    true,
    '03.02.130-4',
  )

  // outside of the range
  t.deepEqual(
    wthn(
      131,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: false },
    ),
    false,
    '03.02.131-1',
  )
  t.deepEqual(
    wthn(
      131,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.131-2',
  )
  t.deepEqual(
    wthn(
      131,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: false },
    ),
    false,
    '03.02.131-3',
  )
  t.deepEqual(
    wthn(
      131,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.131-4',
  )
  t.deepEqual(
    wthn(
      132,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: false },
    ),
    false,
    '03.02.132-1',
  )
  t.deepEqual(
    wthn(
      132,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.132-2',
  )
  t.deepEqual(
    wthn(
      132,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: false },
    ),
    false,
    '03.02.132-3',
  )
  t.deepEqual(
    wthn(
      132,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.02.132-4',
  )
})


test('03.03 - small ranges - zero', (t) => {
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
      ],
    ),
    false,
    '03.03.01 - no opts',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.03.02 - hardcoded opts defaults',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.03.03 - inclusive',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
        [2, 3],
      ],
    ),
    false,
    '03.03.04',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
        [1, 3],
      ],
    ),
    false,
    '03.03.05 - overlap',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
        [0, 3],
      ],
    ),
    false,
    '03.03.06 - overlap #2',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 10],
        [0, 3],
      ],
    ),
    false,
    '03.03.06 - overlap and wrong order',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 10],
        [0, 3],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.03.07 - overlap and wrong order - inclusive',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [1, 10],
        [0, 3],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.03.08 - overlap and wrong order - inclusive',
  )

  // returnMatchedRangeInsteadOfTrue: true

  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.03.09 - no opts',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.03.10 - hardcoded opts defaults',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [0, 1],
    '03.03.11 - inclusive',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
        [2, 3],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.03.12',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
        [1, 3],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.03.13 - overlap',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 1],
        [0, 3],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.03.14 - overlap #2',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 10],
        [0, 3],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.03.15 - overlap and wrong order',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 10],
        [0, 3],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [0, 10],
    '03.03.16 - overlap and wrong order - inclusive',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [1, 10],
        [0, 3],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [0, 3],
    '03.03.17 - overlap and wrong order - inclusive',
  )
})

test('03.04 - small ranges - one', (t) => {
  t.deepEqual(
    wthn(
      1,
      [
        [0, 1],
      ],
    ),
    false,
    '03.04.01 - no opts',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [0, 1],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.04.02 - hardcoded opts defaults',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [0, 1],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.04.03 - inclusive',
  )

  // opts.returnMatchedRangeInsteadOfTrue
  t.deepEqual(
    wthn(
      1,
      [
        [0, 1],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.04.04',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [0, 1],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.04.05 - hardcoded opts defaults',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [0, 1],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [0, 1],
    '03.04.06 - inclusive',
  )
})

test('03.05 - identical range endings', (t) => {
  t.deepEqual(
    wthn(
      0,
      [
        [0, 0],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.05.01',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.05.02',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 0],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.05.03',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.05.04',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: true },
    ),
    false,
    '03.05.05 - identical range ends, index under',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: true },
    ),
    false,
    '03.05.06 - identical range ends, index above',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.05.07 - identical range ends, index above',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.05.08 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.05.09 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      3,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.05.10 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.05.11 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.05.12 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      3,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: true },
    ),
    true,
    '03.05.13 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
        [3, 3],
        [4, 4],
      ],
      { inclusiveRangeEnds: true },
    ),
    false,
    '03.05.14 - identical consecutive with gap',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
        [3, 3],
        [4, 4],
      ],
      { inclusiveRangeEnds: false },
    ),
    false,
    '03.05.15 - identical consecutive with gap',
  )

  // opts.returnMatchedRangeInsteadOfTrue
  t.deepEqual(
    wthn(
      0,
      [
        [0, 0],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.16',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.17',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [0, 0],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [0, 0],
    '03.05.18',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [1, 1],
    '03.05.19',
  )
  t.deepEqual(
    wthn(
      0,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.20 - identical range ends, index under',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.21 - identical range ends, index above',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.22 - identical range ends, index above',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.23 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.24 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      3,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.25 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      1,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [1, 1],
    '03.05.26 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [2, 2],
    '03.05.27 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      3,
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [3, 3],
    '03.05.28 - identical consecutive',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
        [3, 3],
        [4, 4],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.29 - identical consecutive with gap',
  )
  t.deepEqual(
    wthn(
      2,
      [
        [1, 1],
        [3, 3],
        [4, 4],
      ],
      { inclusiveRangeEnds: false, returnMatchedRangeInsteadOfTrue: true },
    ),
    false,
    '03.05.30 - identical consecutive with gap',
  )
})

test('03.06 - out of whack ranges - throw', (t) => {
  t.throws(() => {
    wthn(
      1,
      [
        [10, 2],
      ],
    )
  })
  t.throws(() => {
    wthn(
      1,
      [
        [10, 2],
      ],
      { returnMatchedRangeInsteadOfTrue: true },
    )
  })
  t.throws(() => {
    wthn(
      1,
      [
        [10, 2],
      ],
      { inclusiveRangeEnds: true },
    )
  })
  t.throws(() => {
    wthn(
      1,
      [
        [10, 2],
      ],
      { returnMatchedRangeInsteadOfTrue: true, inclusiveRangeEnds: true },
    )
  })
})

// ==============================
// 4. AD-HOC
// ==============================

test('Ad-hoc #1', (t) => {
  t.deepEqual(
    wthn(
      130,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true },
    ),
    [125, 130],
    '04.01.01',
  )
  t.deepEqual(
    wthn(
      130,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
      {
        inclusiveRangeEnds: true,
        returnMatchedRangeInsteadOfTrue: true,
        skipIncomingRangeSorting: true,
      },
    ),
    [125, 130],
    '04.01.02',
  )
})

test('Ad-hoc #2', (t) => {
  t.deepEqual(
    wthn(
      21,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    false,
    '04.02',
  )
})

test('Ad-hoc #3', (t) => {
  t.deepEqual(
    wthn(
      6,
      [
        [5, 10],
        [15, 20],
        [25, 30],
        [35, 40],
        [45, 50],
        [55, 60],
        [65, 70],
        [75, 80],
        [85, 90],
        [95, 100],
        [105, 110],
        [115, 120],
        [125, 130],
      ],
    ),
    true,
    '04.03',
  )
})
