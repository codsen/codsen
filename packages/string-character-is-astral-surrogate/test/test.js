import test from 'ava'
import { isHighSurrogate, isLowSurrogate } from '../dist/string-character-is-astral-surrogate.cjs'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - wrong/missing input = throw', (t) => {
  t.throws(() => {
    isHighSurrogate(1)
  })
  t.throws(() => {
    isHighSurrogate(null)
  })
  t.throws(() => {
    isHighSurrogate(true)
  })

  t.throws(() => {
    isLowSurrogate(1)
  })
  t.throws(() => {
    isLowSurrogate(null)
  })
  t.throws(() => {
    isLowSurrogate(true)
  })
})

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

// undefined must yield false - that's to make the life easier when
// checking the "next character". If it doesn't exist, it will be
// "false" and as far as the issue of surrogates is concerned, it's
// "false". This will save us from otherwise unnecessary if-else
// statements during traversal.
test('02.01 - undefined yields false', (t) => {
  t.deepEqual(
    isHighSurrogate(undefined),
    false,
    '02.01.01',
  )
  t.deepEqual(
    isLowSurrogate(undefined),
    false,
    '02.01.02',
  )
})

test('02.02 - empty string yields false', (t) => {
  t.deepEqual(
    isHighSurrogate(''),
    false,
    '02.02.01',
  )
  t.deepEqual(
    isLowSurrogate(''),
    false,
    '02.02.02',
  )
})

test('02.03 - isHighSurrogate()', (t) => {
  t.deepEqual(
    isHighSurrogate('zzz'),
    false,
    '02.03.01',
  )
  // 🧢 = \uD83E\uDDE2
  t.deepEqual(
    isHighSurrogate('\uD83E'),
    true,
    '02.03.02',
  )
  t.deepEqual(
    isHighSurrogate('\uDDE2'),
    false,
    '02.03.03',
  )
  t.deepEqual(
    isHighSurrogate('\uD83E\uDDE2'),
    true,
    '02.03.04', // second Unicode code point (and onwards) doesn't matter
  )
})

test('02.04 - isLowSurrogate()', (t) => {
  t.deepEqual(
    isLowSurrogate('zzz'),
    false,
    '02.04.01',
  )
  // 🧢 = \uD83E\uDDE2
  t.deepEqual(
    isLowSurrogate('\uD83E'),
    false,
    '02.04.02',
  )
  t.deepEqual(
    isLowSurrogate('\uDDE2'),
    true,
    '02.04.03',
  )
  t.deepEqual(
    isLowSurrogate('\uD83E\uDDE2'),
    false,
    '02.04.04', // second Unicode code point (and onwards) doesn't matter
  )
})
