import test from 'ava'
import split from '../dist/string-split-by-whitespace.cjs'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - wrong/missing input = throw', (t) => {
  t.throws(() => {
    split()
  })
  t.throws(() => {
    split(undefined)
  })

  t.deepEqual(
    split(1),
    1,
    '01.01.03',
  )
  t.deepEqual(
    split(null),
    null,
    '01.01.04',
  )
  t.deepEqual(
    split(true),
    true,
    '01.01.05',
  )
})

test('01.02 - empty string as input', (t) => {
  t.deepEqual(
    split(''),
    [],
    '01.02',
  )
})

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test('02.01 - splits two', (t) => {
  t.deepEqual(
    split('a b'),
    ['a', 'b'],
    '02.01.01',
  )
  t.deepEqual(
    split(' a  b '),
    ['a', 'b'],
    '02.01.02',
  )
  t.deepEqual(
    split('a  b '),
    ['a', 'b'],
    '02.01.03',
  )
  t.deepEqual(
    split('  a  b'),
    ['a', 'b'],
    '02.01.04',
  )
  t.deepEqual(
    split('\na\nb\n'),
    ['a', 'b'],
    '02.01.05',
  )
  t.deepEqual(
    split('\ta\tb\t'),
    ['a', 'b'],
    '02.01.06',
  )
  t.deepEqual(
    split('0\t0\t'),
    ['0', '0'],
    '02.01.07',
  )
  t.deepEqual(
    split('\n\n\n a      \n\n\n \t\t\t\t       b  \n\n\n \t\t\t\t   c   \n\n\n\n \t\t\t\t '),
    ['a', 'b', 'c'],
    '02.01.08',
  )
  t.deepEqual(
    split('  some   text'),
    ['some', 'text'],
    '02.01.09',
  )
})

test('02.02 - single substring', (t) => {
  t.deepEqual(
    split('a'),
    ['a'],
    '02.02.01',
  )
  t.deepEqual(
    split(' a'),
    ['a'],
    '02.02.02',
  )
  t.deepEqual(
    split('a '),
    ['a'],
    '02.02.03',
  )
  t.deepEqual(
    split(' a '),
    ['a'],
    '02.02.04',
  )
  t.deepEqual(
    split('\na\n'),
    ['a'],
    '02.02.05',
  )
  t.deepEqual(
    split('0'),
    ['0'],
    '02.02.06',
  )
})
