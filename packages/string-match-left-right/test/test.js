import test from 'ava'
import { matchLeftIncl, matchRightIncl, matchLeft, matchRight } from '../dist/string-match-left-right.cjs'

// 1. Input arg validation
// -----------------------------------------------------------------------------

test('01.01 - throws', (t) => {
  // no third arg
  t.throws(() => {
    matchLeftIncl('zzz', 1)
  })
  t.throws(() => {
    matchRightIncl('zzz', 1)
  })
  // no second arg
  t.throws(() => {
    matchLeftIncl('zzz', null, ['aaa'])
  })
  t.throws(() => {
    matchRightIncl('zzz', null, ['aaa'])
  })
  t.throws(() => {
    matchRightIncl('zzz', null, [])
  })
  t.throws(() => {
    matchRightIncl('zzz', null, '')
  })
  // second arg completely missing onwards
  t.throws(() => {
    matchLeftIncl('zzz')
  })
  t.throws(() => {
    matchRightIncl('zzz')
  })
  // first arg not string
  t.throws(() => {
    matchLeftIncl(1)
  })
  t.throws(() => {
    matchRightIncl(1)
  })
  t.throws(() => {
    matchLeftIncl([1])
  })
  t.throws(() => {
    matchRightIncl([1])
  })
  t.throws(() => {
    matchLeftIncl(null)
  })
  t.throws(() => {
    matchRightIncl(null)
  })
  t.throws(() => {
    matchLeftIncl()
  })
  t.throws(() => {
    matchRightIncl()
  })
  t.throws(() => {
    matchLeftIncl(-1)
  })
})

// 2. matchLeftIncl()
// -----------------------------------------------------------------------------

test('02.01 - matchLeftIncl()  on a simple string', (t) => {
  t.is(
    matchLeftIncl('abc', 2, 'c'),
    true,
    '02.01.01 - pointless, but still',
  )
  t.is(
    matchLeftIncl('abcdefghi', 3, ['bcd']),
    true,
    '02.01.02 - one elem to match',
  )
  t.is(
    matchLeftIncl('abcdefghi', 3, ['cd', 'bcd']),
    true,
    '02.01.03 - multiple to match',
  )
  t.is(
    matchLeftIncl('abcdefghi', 3, ['aaa', 'bcd']),
    true,
    '02.01.04',
  )
  t.is(
    matchLeftIncl('abcdefghi', 3, ['aaa', 'zzz']),
    false,
    '02.01.05',
  )
})

test('02.02 - matchLeftIncl()  case insensitive', (t) => {
  t.is(
    matchLeftIncl('abc', 2, 'C'),
    false,
    '02.02.01 - control',
  )
  t.is(
    matchLeftIncl('abc', 2, 'C', { i: true }),
    true,
    '02.02.02 - opts.i',
  )
  t.is(
    matchLeftIncl('abc', 2, 'BC', { i: true }),
    true,
    '02.02.03 - opts.i',
  )
})

// 3. matchLeft()
// -----------------------------------------------------------------------------

test('03.01 - matchLeft()      on a simple string', (t) => {
  t.is(
    matchLeft('abc', 2, 'b'),
    true,
    '03.01.01',
  )
  t.is(
    matchLeft('abcdefghi', 3, ['abc']),
    true,
    '03.01.02 - one elem to match',
  )
  t.is(
    matchLeft('abcdefghi', 3, ['c', 'bc']),
    true,
    '03.01.03 - multiple to match',
  )
  t.is(
    matchLeft('abcdefghi', 3, ['aaa', 'bc']),
    true,
    '03.01.04',
  )
  t.is(
    matchLeft('abcdefghi', 3, ['aaa', 'zzz']),
    false,
    '03.01.05',
  )
})

test('03.02 - matchLeft()      case insensitive', (t) => {
  t.is(
    matchLeft('abc', 2, 'B'),
    false,
    '03.02.01 - control',
  )
  t.is(
    matchLeft('abc', 2, 'B', { i: true }),
    true,
    '03.02.02 - opts.i',
  )
})

// 4. matchRightIncl()
// -----------------------------------------------------------------------------

test('04.01 - matchRightIncl() on a simple string, non zero arg', (t) => {
  t.is(
    matchRightIncl('abcdef', 2, 'c'),
    true,
    '04.01.01',
  )
  t.is(
    matchRightIncl('abcdef', 2, 'cde'),
    true,
    '04.01.02',
  )
  t.is(
    matchRightIncl('abcdef', 2, ['cde']),
    true,
    '04.01.03',
  )
})

test('04.02 - matchRightIncl() on a simple string, index zero', (t) => {
  t.is(
    matchRightIncl('abcdef', 0, 'a'),
    true,
    '04.02.01',
  )
  t.is(
    matchRightIncl('abcdef', 0, 'abc'),
    true,
    '04.02.02',
  )
  t.is(
    matchRightIncl('abcdef', 0, ['abc']),
    true,
    '04.02.03',
  )
})


test('04.03 - matchRightIncl() on a simple string, case insensitive', (t) => {
  t.is(
    matchRightIncl('abcdef', 2, 'C'),
    false,
    '04.03.01',
  )
  t.is(
    matchRightIncl('abcdef', 2, 'C', { i: true }),
    true,
    '04.03.02',
  )
})

// 5. matchRight()
// -----------------------------------------------------------------------------

test('05.01 - matchRight()     on a simple string, non zero arg', (t) => {
  t.is(
    matchRight('abcdef', 2, 'd'),
    true,
    '05.01.01',
  )
  t.is(
    matchRight('abcdef', 2, ['d']),
    true,
    '05.01.02',
  )
  t.is(
    matchRight('abcdef', 2, 'def'),
    true,
    '05.01.03',
  )
  t.is(
    matchRight('abcdef', 2, ['def']),
    true,
    '05.01.04',
  )
  t.is(
    matchRight('abcdef', 2, ['defg']),
    false,
    '05.01.05',
  )
})

test('05.02 - matchRight()     on a simple string, non zero arg', (t) => {
  t.is(
    matchRight('abcdef', 0, 'b'),
    true,
    '05.02.01',
  )
  t.is(
    matchRight('abcdef', 0, ['b']),
    true,
    '05.02.02',
  )
  t.is(
    matchRight('abcdef', 0, ['bc']),
    true,
    '05.02.03',
  )
})

test('05.03 - matchRight()     on a simple string, case insensitive', (t) => {
  t.is(
    matchRight('abcdef', 2, 'D'),
    false,
    '05.03.01',
  )
  t.is(
    matchRight('abcdef', 2, 'D', { i: true }),
    true,
    '05.03.02',
  )
})
