import test from 'ava'
import { nativeToUnicode, unicodeToNative } from '../dist/string-convert-indexes.cjs'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - empty string', (t) => {
  t.throws(() => {
    nativeToUnicode('', 0)
  })
  t.throws(() => {
    unicodeToNative('', 0)
  })
})

test('01.02 - indexes outside of the reference string', (t) => {
  // opts.throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString = ON
  t.throws(() => {
    nativeToUnicode('a', 1)
  })
  t.throws(() => {
    unicodeToNative('a', 1)
  })
  t.throws(() => {
    nativeToUnicode('a', '1')
  })
  t.throws(() => {
    unicodeToNative('a', '1')
  })
  // opts.throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString = OFF
  t.deepEqual(
    nativeToUnicode('a', 1, { throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false }),
    1,
    '01.02.03',
  )
  t.deepEqual(
    nativeToUnicode('a', '1', { throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false }),
    '1',
    '01.02.04',
  )
  t.deepEqual(
    unicodeToNative('a', 1, { throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false }),
    1,
    '01.02.05',
  )
  t.deepEqual(
    unicodeToNative('a', '1', { throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false }),
    '1',
    '01.02.06',
  )
})

test('01.03 - negative indexes are ignored', (t) => {
  t.deepEqual(
    nativeToUnicode('a', '-1'),
    '-1',
    '01.03.01',
  )
  t.deepEqual(
    unicodeToNative('a', '-1'),
    '-1',
    '01.03.02',
  )
  t.deepEqual(
    nativeToUnicode('a', -1),
    -1,
    '01.03.03',
  )
  t.deepEqual(
    unicodeToNative('a', -1),
    -1,
    '01.03.04',
  )
})

test('01.04 - opts is not a plain object', (t) => {
  t.throws(() => {
    nativeToUnicode('a', 1, 1)
  })
  t.throws(() => {
    unicodeToNative('a', 1, 1)
  })
})

test('01.05 - missing input args', (t) => {
  t.throws(() => {
    nativeToUnicode()
  })
  t.throws(() => {
    unicodeToNative()
  })
  t.throws(() => {
    nativeToUnicode('a')
  })
  t.throws(() => {
    unicodeToNative('a')
  })
})

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test('02.01 - two astral characters offsetting the rest', (t) => {
  t.deepEqual(
    nativeToUnicode(
      '\uD834\uDF06aa',
      [0, 1, 2, 3],
    ),
    [0, 0, 1, 2],
    '02.01.01 - all unique',
  )
  t.deepEqual(
    nativeToUnicode(
      '\uD834\uDF06aa',
      ['0', '1', '2', '3'],
    ),
    ['0', '0', '1', '2'],
    '02.01.01.02',
  )

  t.deepEqual(
    nativeToUnicode(
      '\uD834\uDF06aa',
      [0, 2, 0, 1, 2, 3],
    ),
    [0, 1, 0, 0, 1, 2],
    '02.01.02 - with dupes',
  )
  t.deepEqual(
    nativeToUnicode(
      '\uD834\uDF06aa',
      ['0', '2', '0', '1', '2', '3'],
    ),
    ['0', '1', '0', '0', '1', '2'],
    '02.01.02.02',
  )

  t.deepEqual(
    unicodeToNative(
      '\uD834\uDF06aa',
      [0, 1, 2],
    ),
    [0, 2, 3],
    '02.01.03.01 - all unique, sorted',
  )
  t.deepEqual(
    unicodeToNative(
      '\uD834\uDF06aa',
      ['0', '1', '2'],
    ),
    ['0', '2', '3'],
    '02.01.03.02',
  )

  t.deepEqual(
    unicodeToNative(
      '\uD834\uDF06aa',
      [1, 0, 2],
    ),
    [2, 0, 3],
    '02.01.04.01 - all unique, mixed up',
  )
  t.deepEqual(
    unicodeToNative(
      '\uD834\uDF06aa',
      ['1', '0', '2'],
    ),
    ['2', '0', '3'],
    '02.01.04.02',
  )

  t.throws(() => {
    unicodeToNative(
      '\uD834\uDF06aa',
      [1, 0, 2, 3],
    )
  })
  t.throws(() => {
    unicodeToNative(
      '\uD834\uDF06aa',
      ['1', '0', '2', '3'],
    )
  })

  // If you want to turn off the requirement that all indexes were covered by
  // the reference string characters, you can do it. However, results might become
  // dodgy. Observe:
  t.deepEqual(
    unicodeToNative(
      '\uD834\uDF06aa',
      [1, 0, 2, 3],
      { throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false },
    ),
    [2, 0, 3, 3], // <----- this second "3" is left untouched, which is weird now
    '02.01.06 - you don\'t want such case, notice how fourth index in source, 3 gets left untouched now',
  )
  t.deepEqual(
    unicodeToNative(
      '\uD834\uDF06aa',
      ['1', '0', '2', '3'],
      { throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false },
    ),
    ['2', '0', '3', '3'], // <----- this second "3" is left untouched, which is weird now
    '02.01.06.02',
  )
})

test('02.02 - a stray astral surrogate without second counterpart counts as symbol', (t) => {
  t.deepEqual(
    nativeToUnicode(
      '\uD834\uDF06a\uDF06a',
      [0, 1, 2, 3, 4],
    ),
    [0, 0, 1, 2, 3],
    '02.02',
  )
})

test('02.03 - one letter string', (t) => {
  t.deepEqual(
    nativeToUnicode('a', 0),
    0,
    '02.03.01',
  )
  t.deepEqual(
    unicodeToNative('a', 0),
    0,
    '02.03.02',
  )
})

test('02.04 - single astral symbol', (t) => {
  t.deepEqual(
    nativeToUnicode('\uD834\uDF06', 0),
    0,
    '02.04.01',
  )
  t.deepEqual(
    unicodeToNative('\uD834\uDF06', 0),
    0,
    '02.04.02',
  )
  t.deepEqual(
    nativeToUnicode('\uD834\uDF06', 1),
    0,
    '02.04.03',
  )
  t.throws(() => {
    unicodeToNative('\uD834\uDF06', 1)
  })
})

test('02.05 - multiple consecutive astral symbols', (t) => {
  t.deepEqual(
    nativeToUnicode('\uD834\uDF06\uD834\uDF06', 0),
    0,
    '02.05.01',
  )
  t.deepEqual(
    unicodeToNative('\uD834\uDF06\uD834\uDF06', 0),
    0,
    '02.05.02',
  )
  t.deepEqual(
    nativeToUnicode('\uD834\uDF06\uD834\uDF06', 1),
    0,
    '02.05.03',
  )
  t.deepEqual(
    unicodeToNative('\uD834\uDF06\uD834\uDF06', 1),
    2,
    '02.05.04',
  )
})
