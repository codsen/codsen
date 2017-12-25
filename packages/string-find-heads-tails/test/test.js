import test from 'ava'
import strFindHeadsTails from '../dist/string-find-heads-tails.cjs'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - throws when there\'s no input', (t) => {
  t.throws(() => {
    strFindHeadsTails()
  })
})

test('01.02 - throws when the first argument, source string, is not a string', (t) => {
  t.throws(() => {
    strFindHeadsTails(1)
  })
  t.throws(() => {
    strFindHeadsTails(1, 'a', 'b')
  })
})

test('01.03 - throws when the second argument, heads, is not a string', (t) => {
  t.throws(() => {
    strFindHeadsTails('a', 1) // THROW_ID_03
  })
  t.throws(() => {
    strFindHeadsTails('a', 1, 'z') // THROW_ID_03
  })
  t.throws(() => {
    strFindHeadsTails('a', '', 'z') // THROW_ID_04
  })
  t.throws(() => {
    strFindHeadsTails('a', [], 'z') // THROW_ID_05
  })
  t.throws(() => {
    strFindHeadsTails('a', ['z', 1, null], ['z']) // THROW_ID_06
  })
  t.throws(() => {
    strFindHeadsTails('a', ['z', 1, undefined], 'z') // THROW_ID_06
  })
  t.throws(() => {
    strFindHeadsTails('a', ['z', true], 'z') // THROW_ID_06
  })
  t.throws(() => {
    strFindHeadsTails('a', ['b', ''], 'c') // THROW_ID_07
  })
  t.throws(() => {
    strFindHeadsTails('a', 1, 'a')
  })
})

test('01.04 - throws when the third argument, tails, is not a string', (t) => {
  t.throws(() => {
    strFindHeadsTails('a', 'a') // THROW_ID_08
  })
  t.throws(() => {
    strFindHeadsTails('a', 'a', '') // THROW_ID_09
  })
  t.throws(() => {
    strFindHeadsTails('a', 'a', []) // THROW_ID_10
  })
  t.throws(() => {
    strFindHeadsTails('a', 'a', ['z', 1]) // THROW_ID_11
  })
  t.throws(() => {
    strFindHeadsTails('a', 'a', [null]) // THROW_ID_11
  })
  t.throws(() => {
    strFindHeadsTails('a', 'a', [true]) // THROW_ID_11
  })
  t.throws(() => {
    strFindHeadsTails('a', 'a', ['z', '']) // THROW_ID_12
  })
  t.throws(() => {
    strFindHeadsTails('a', 'a', 1)
  })
})

test('01.05 - throws when the fourth argument is not a natural number', (t) => {
  t.throws(() => {
    strFindHeadsTails('a', 'a', 'a', 'a')
  })
  t.notThrows(() => {
    strFindHeadsTails('a', 'a', 'a', '1') // OK, will be parsed
  })
  t.notThrows(() => {
    strFindHeadsTails('a', 'a', 'a', 1) // OK
  })
})

// -----------------------------------------------------------------------------
// 02. normal use, no third arg in the input
// -----------------------------------------------------------------------------

test('02.01 - single char markers', (t) => {
  t.deepEqual(
    strFindHeadsTails('abcdef', 'b', 'e'),
    [[1], [4]],
    '02.01.01 - easies',
  )
})

test('02.02 - multi-char markers', (t) => {
  t.deepEqual(
    strFindHeadsTails('abc%%_def_%%ghi', '%%_', '_%%'),
    [[3], [9]],
    '02.02.01',
  )
  t.deepEqual(
    strFindHeadsTails('abc%%_def_%%ghi', '%%_', '_%%', 4),
    [[], []],
    '02.02.02 - offset meant we started beyond first heads, so no tails were accepted',
  )
  t.deepEqual(
    strFindHeadsTails('abczz-def--aghi', 'zz-', '--a'),
    [[3], [9]],
    '02.02.03',
  )
})

test('02.03 - sneaky "casual" underscores try to blend in with legit heads/tails', (t) => {
  t.deepEqual(
    strFindHeadsTails('aaa_%%_bbb_%%_ccc', '%%_', '_%%'),
    [[4], [10]],
    '02.03',
  )
})

test('02.04 - sneaky tails precede heads', (t) => {
  t.deepEqual(
    strFindHeadsTails('aaa_%%bbb%%_ccc', '%%_', '_%%'),
    [[9], []],
    '02.04',
  )
})

test('02.05 - arrays of heads and tails', (t) => {
  t.deepEqual(
    strFindHeadsTails('zzz_%%-zz_cmp_id-%%_%%-lnk_id-%%', ['%%_', '%%-'], ['_%%', '-%%']),
    [[4, 20], [16, 29]],
    '02.05',
  )
})
