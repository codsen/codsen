import test from 'ava'

const i = require('../dist/array-includes-with-glob.cjs')

// ==============
// various throws
// ==============

test('0.1 - throws when inputs are missing', (t) => {
  t.throws(() => {
    i()
  })
})

test('0.2 - throws when second arg is missing', (t) => {
  t.throws(() => {
    i(['zzz'])
  })
})

test('0.3 - first input arg is not array', (t) => {
  t.throws(() => {
    i({ a: 'a' }, 'a')
  })
  t.notThrows(() => {
    i('zzz', 'a')
  })
  t.throws(() => {
    i(1, 'a')
  })
  t.throws(() => {
    i({ a: 'a' })
  })
  t.throws(() => {
    i(1)
  })
})

test('0.4 - throws when second arg is not string', (t) => {
  t.throws(() => {
    i(['zzz'], 1)
  })
  t.throws(() => {
    i(['zzz'], false)
  })
})

test('0.5 - empty array always yields false', (t) => {
  t.notThrows(() => {
    i([], 'zzz', false)
  })
})

test('0.6 - non-empty array turned empty because of cleaning yields false too', (t) => {
  t.notThrows(() => {
    i([null, null], 'zzz', false)
  })
})

test('0.7 - throws if options is set to nonsense', (t) => {
  t.throws(() => {
    i(['aaa', 'bbb', 'ccc'], 'zzz', { arrayVsArrayAllMustBeFound: 'x' })
  })
})

// ===
// BAU
// ===

test('1.1 - no wildcard, fails', (t) => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      'thing',
    ),
    false,
    '1.1',
  )
})

test('1.2 - no wildcard, succeeds', (t) => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      'something',
    ),
    true,
    '1.2',
  )
})

test('1.3 - wildcard, succeeds', (t) => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      '*thing',
    ),
    true,
    '1.3.1',
  )
  t.is(
    i(
      ['someTHING', 'anyTHING', 'everyTHING'],
      '*thing',
    ),
    false,
    '1.3.2',
  )
  t.is(
    i(
      ['someThInG', 'anytHInG', 'everyThINg'],
      '*thing',
    ),
    false,
    '1.3.3',
  )
})

test('1.4 - wildcard, fails', (t) => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      'zzz',
    ),
    false,
    '1.4',
  )
})

test('1.5 - emoji everywhere', (t) => {
  t.is(
    i(
      ['xxxaxxx', 'zxxxzzzzxz', 'xxz'],
      '*a*',
    ),
    true,
    '1.5.1',
  )
  t.is(
    i(
      ['🦄🦄🦄a🦄🦄🦄', 'z🦄🦄🦄zzzz🦄z', '🦄🦄z'],
      '*a*',
    ),
    true,
    '1.5.2',
  )
  t.is(
    i(
      ['🦄🦄🦄a🦄🦄🦄', 'z🦄🦄🦄zzzz🦄z', '🦄🦄z'],
      '*🦄z',
    ),
    true,
    '1.5.3',
  )
  t.is(
    i(
      ['🦄🦄🦄a🦄🦄🦄', 'z🦄🦄🦄zzzz🦄z', '🦄🦄z'],
      '%%%',
    ),
    false,
    '1.5.4',
  )
})

test('1.6 - second arg is empty string', (t) => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      '',
    ),
    false,
    '1.6',
  )
})

test('1.7 - input is not array but string', (t) => {
  t.is(
    i(
      ['something'],
      '*thing',
    ),
    true,
    '1.7.1',
  )
  t.is(
    i(
      'something',
      '*thing',
    ),
    true,
    '1.7.2',
  )
  t.is(
    i(
      'something',
      'thing',
    ),
    false,
    '1.7.3',
  )
})

// =======================================================
// various combinations of different types including globs
// =======================================================

test('2.1 - both arrays, no wildcards', (t) => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      ['anything', 'zzz'],
    ),
    true,
    '2.1.1 - default (opts ANY)',
  )
  t.is(
    i(
      ['something', 'anything', 'everything'],
      ['anything', 'zzz'],
      { arrayVsArrayAllMustBeFound: 'any' },
    ),
    true,
    '2.1.2 - hardcoded opts ANY',
  )
  t.is(
    i(
      ['something', 'anything', 'everything'],
      ['anything', 'zzz'],
      { arrayVsArrayAllMustBeFound: 'all' },
    ),
    false,
    '2.1.3 - opts ALL',
  )
  t.is(
    i(
      ['something', 'anything', 'everything'],
      ['*thing', 'zzz'],
    ),
    true,
    '2.1.4 - hardcoded opts ANY',
  )
  t.is(
    i(
      'something',
      ['*thing', 'zzz'],
    ),
    true,
    '2.1.5 - string source, array to search, with wildcards, found',
  )
  t.is(
    i(
      'something',
      ['thing', '*zzz'],
    ),
    false,
    '2.1.6 - string source, array to search, with wildcards, not found',
  )
  t.is(
    i(
      ['something', 'anything', 'everything'],
      ['*thing', 'zzz'],
      { arrayVsArrayAllMustBeFound: 'all' },
    ),
    false,
    '2.1.7 - opts ALL vs array',
  )
  t.is(
    i(
      'something',
      ['*thing', 'zzz'],
      { arrayVsArrayAllMustBeFound: 'all' },
    ),
    false,
    '2.1.8 - opts ALL vs string',
  )
  t.is(
    i(
      'something',
      '*thing',
      { arrayVsArrayAllMustBeFound: 'all' },
    ),
    true,
    '2.1.9 - opts ALL string vs string',
  )
})

test('2.2 - various, #1', (t) => {
  t.is(
    i(
      'zzz',
      ['*thing', '*zz'],
    ),
    true,
    '2.2.1 - two keys to match in a second arg, running on assumed default',
  )
  t.is(
    i(
      'zzz',
      ['*thing', '*zz'],
      { arrayVsArrayAllMustBeFound: 'any' },
    ),
    true,
    '2.2.2 - two keys to match in a second arg, running on hardcoded default',
  )
  t.is(
    i(
      'zzz',
      ['*thing', '*zz'],
      { arrayVsArrayAllMustBeFound: 'all' },
    ),
    false,
    '2.2.3 - two keys to match in a second arg, running on hardcoded default',
  )
})

// 👍
