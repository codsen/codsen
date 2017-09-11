const test = require('ava')
const srt = require('./index')

// ==============================
// 0. THROWS
// ==============================

test('00.01 - not array', (t) => {
  t.throws(() => {
    srt(null)
  })
  t.throws(() => {
    srt(1)
  })
  t.throws(() => {
    srt(true)
  })
  t.throws(() => {
    srt({ a: true })
  })
})

test('00.02 - not two arguments in one of ranges', (t) => {
  t.throws(() => {
    srt([[1, 2, 3]])
  })
  t.throws(() => {
    srt([[1, 2, 3], [4, 5, 6]])
  })
  t.throws(() => {
    srt([[1, 2], [4, 5, 6], [7, 8]])
  })
  t.notThrows(() => {
    srt([[1, 2], [4, 5], [7, 8]])
  })
  t.notThrows(() => {
    srt([])
  })
})

test('00.03 - some/all range indexes are not natural numbers', (t) => {
  t.notThrows(() => {
    srt([[0, 3]])
  })
  t.throws(() => {
    srt([[0.2, 3]])
  })
  t.throws(() => {
    srt([[0.2, 3.3]])
  })
  t.throws(() => {
    srt([[2, 3.3]])
  })
  t.throws(() => {
    srt([[0.2, 3.3]])
  })
  t.throws(() => {
    srt([[0.2, 33]])
  })
  t.throws(() => {
    srt([[0.2, 33, 55, 66.7]])
  })
})

// ==============================
// 01. Sorting
// ==============================

test('01.01 - no ranges given', (t) => {
  t.deepEqual(
    srt([]),
    [],
    '01.01 - copes fine',
  )
})

test('01.02 - only one range given', (t) => {
  t.deepEqual(
    srt([[0, 3]]),
    [[0, 3]],
    '01.02',
  )
})

test('01.03 - two ranges', (t) => {
  t.deepEqual(
    srt([[0, 3], [5, 6]]),
    [[0, 3], [5, 6]],
    '01.03.01',
  )
  t.deepEqual(
    srt([[5, 6], [0, 3]]),
    [[0, 3], [5, 6]],
    '01.03.02',
  )
})

test('01.04 - many ranges', (t) => {
  t.deepEqual(
    srt([[0, 3], [5, 8], [5, 6]]),
    [[0, 3], [5, 6], [5, 8]],
    '01.04.01',
  )
  t.deepEqual(
    srt([[5, 8], [5, 6], [0, 3]]),
    [[0, 3], [5, 6], [5, 8]],
    '01.04.02',
  )
  t.deepEqual(
    srt([[0, 8], [5, 6], [0, 3]]),
    [[0, 3], [0, 8], [5, 6]],
    '01.04.03',
  )
  t.deepEqual(
    srt([[5, 6], [5, 6]]),
    [[5, 6], [5, 6]],
    '01.04.04 - same ranges',
  )
  t.deepEqual(
    srt([[9, 12], [9, 15]]),
    [[9, 12], [9, 15]],
    '01.04.05',
  )
})

// ==============================
// 02. Ad-Hoc
// ==============================

test('02.01 - does not mutate the input arg', (t) => {
  const original = [[5, 6], [3, 4], [1, 2]]
  srt(original)
  t.deepEqual(
    original,
    [[5, 6], [3, 4], [1, 2]],
    '02.01',
  )
})
