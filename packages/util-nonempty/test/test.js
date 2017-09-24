import test from 'ava'

const nonEmpty = require('../dist/util-nonempty.cjs.js')

// ==============================
// Precautions
// ==============================

test('1.1 - inputs missing - returns undefined', (t) => {
  t.is(
    nonEmpty(), undefined,
    '1.1',
  )
})

// ==============================
// Normal use
// ==============================

test('2.1 - Array', (t) => {
  t.is(
    nonEmpty(['a']), true,
    '2.1.1',
  )
  t.is(
    nonEmpty([]), false,
    '2.1.2',
  )
})

test('2.2 - Plain object', (t) => {
  t.is(
    nonEmpty({ a: 'a' }), true,
    '2.2.1',
  )
  t.is(
    nonEmpty({}), false,
    '2.2.2',
  )
})

test('2.3 - String', (t) => {
  t.is(
    nonEmpty('a'), true,
    '2.3.1',
  )
  t.is(
    nonEmpty(''), false,
    '2.3.2',
  )
})

test('2.4 - null', (t) => {
  t.is(
    nonEmpty(null), false,
    '2.4',
  )
})

test('2.5 - undefined - same as missing input', (t) => {
  t.is(
    nonEmpty(undefined), undefined,
    '2.5',
  )
})

test('2.5 - boolean - still empty (!)', (t) => {
  t.is(
    nonEmpty(true), false,
    '2.5.1',
  )
  t.is(
    nonEmpty(false), false,
    '2.5.2',
  )
})

test('2.6 - function - still empty, no matter what\'s returned (!)', (t) => {
  const f = function dummy() { return 'a' }
  t.is(
    nonEmpty(f), false,
    '2.6',
  )
})
