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

test('01.05 - throws when the fourth argument, opts, is of a wrong type', (t) => {
  t.throws(() => {
    strFindHeadsTails('a', 'a', 'a', 'a')
  })
  t.notThrows(() => {
    strFindHeadsTails('a', 'a', 'a', null) // falsey is OK
  })
  t.notThrows(() => {
    strFindHeadsTails('a', 'a', 'a', undefined) // falsey is OK
  })
  t.notThrows(() => {
    strFindHeadsTails('a', 'a', 'a', { fromIndex: '1' }) // OK, will be parsed
  })
  t.notThrows(() => {
    strFindHeadsTails('a', 'a', 'a', { fromIndex: 1 }) // canonical
  })
  t.throws(() => {
    strFindHeadsTails('a', 'a', 'a', { fromIndex: 1.5 }) // not a natural number
  })
})

test('01.06 - unmatched heads and tails', (t) => {
  t.throws(() => {
    strFindHeadsTails('abc%%_def_%ghi', '%%_', '_%%')
  }) // sneaky - tails' second percentage char is missing, hence unrecognised and throws
  t.throws(() => {
    strFindHeadsTails('abcdef', 'x', 'e') // heads not found
  })
  t.throws(() => {
    strFindHeadsTails('abcdef', 'x', ['e', '$']) // heads not found
  })
  t.throws(() => {
    strFindHeadsTails('abcdef', ['_', 'x'], ['e', '$']) // heads not found
  })
  t.throws(() => {
    strFindHeadsTails('abcdef', 'b', 'x') // tails not found
  })
  t.throws(() => {
    strFindHeadsTails('abcdef', ['&', 'b'], 'x') // tails not found
  })
  t.notThrows(() => {
    strFindHeadsTails('abcdef', 'x', 'z') // both heads and tails not found - OK
  })
})

test('01.07 - both heads and tails found but wrong order', (t) => {
  t.throws(() => {
    strFindHeadsTails('abc___def---ghi', '---', '___') // opposite order
  })
  t.throws(() => {
    strFindHeadsTails('abc___def---ghi', ['***', '---'], '___') // opposite order
  })
  t.throws(() => {
    strFindHeadsTails('abc___def---ghi', ['***', '---'], ['^^^', '___']) // opposite order
  })
  t.throws(() => {
    strFindHeadsTails('--a__bcdef**', ['--', '__'], ['**', '^^']) // two consecutive heads
  })
  t.throws(() => {
    strFindHeadsTails('--a**bcdefghij^^', ['--', '__'], ['**', '^^']) // two consecutive tails
  })
  t.throws(() => {
    strFindHeadsTails('--a^^bc__defghij', ['--', '__'], ['**', '^^']) // second heads unmatched
  })
})

// -----------------------------------------------------------------------------
// 02. normal use, no third arg in the input
// -----------------------------------------------------------------------------

test('02.01 - single char markers', (t) => {
  t.deepEqual(
    strFindHeadsTails('abcdef', 'b', 'e'),
    [{
      headsStartAt: 1,
      headsEndAt: 2,
      tailsStartAt: 4,
      tailsEndAt: 5,
    }],
    '02.01.01 - easies',
  )
  t.deepEqual(
    strFindHeadsTails('ab', 'a', 'b'),
    [{
      headsStartAt: 0,
      headsEndAt: 1,
      tailsStartAt: 1,
      tailsEndAt: 2,
    }],
    '02.01.02 - tight',
  )
})

test('02.02 - multi-char markers', (t) => {
  t.deepEqual(
    strFindHeadsTails('abc%%_def_%%ghi', '%%_', '_%%'),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12,
      },
    ],
    '02.02.01',
  )
  t.throws(() => {
    strFindHeadsTails('abc%%_def_%%ghi', '%%_', '_%%', { fromIndex: 4 })
  }) // fromIndex prevented heads from being caught. Tails were caught, but
  // since opts.throwWhenSomethingWrongIsDetected is on, error is thrown.
  t.deepEqual(
    strFindHeadsTails('abc%%_def_%%ghi', '%%_', '_%%', { fromIndex: 4, throwWhenSomethingWrongIsDetected: false }),
    [],
    '02.02.02 - offset meant we started beyond first heads, so no tails were accepted',
  )
  t.deepEqual(
    strFindHeadsTails('abczz-def--aghi', 'zz-', '--a'),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12,
      },
    ],
    '02.02.03',
  )
  t.deepEqual(
    strFindHeadsTails('abc%%_def_%%ghi%%-jkl-%%', ['%%_', '%%-'], ['_%%', '-%%']),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12,
      },
      {
        headsStartAt: 15,
        headsEndAt: 18,
        tailsStartAt: 21,
        tailsEndAt: 24,
      },
    ],
    '02.02.04',
  )
})

test('02.03 - sneaky "casual" underscores try to blend in with legit heads/tails', (t) => {
  t.deepEqual(
    strFindHeadsTails('aaa_%%_bbb_%%_ccc', '%%_', '_%%'),
    [{
      headsStartAt: 4,
      headsEndAt: 7,
      tailsStartAt: 10,
      tailsEndAt: 13,
    }],
    '02.03',
  )
})

test('02.04 - sneaky tails precede heads', (t) => {
  t.throws(() => {
    strFindHeadsTails('aaa_%%bbb%%_ccc', '%%_', '_%%')
  })
  t.deepEqual(
    strFindHeadsTails('aaa_%%bbb%%_ccc', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: false }),
    [],
    '02.04.02',
  )
})

test('02.05 - arrays of heads and tails', (t) => {
  t.deepEqual(
    strFindHeadsTails('zzz_%%-zz_cmp_id-%%_%%-lnk_id-%%', ['%%_', '%%-'], ['_%%', '-%%']),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 16,
        tailsEndAt: 19,
      },
      {
        headsStartAt: 20,
        headsEndAt: 23,
        tailsStartAt: 29,
        tailsEndAt: 32,
      },
    ],
    '02.05',
  )
})

test('02.06 - input is equal to heads or tails', (t) => {
  t.deepEqual(
    strFindHeadsTails('%%_', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: false }),
    [],
    '02.06.01',
  )
  t.deepEqual(
    strFindHeadsTails('%%_', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: true }),
    [],
    '02.06.02',
  )
  t.deepEqual(
    strFindHeadsTails('%%_', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: true, allowWholeValueToBeOnlyHeadsOrTails: true }),
    [],
    '02.06.03',
  )
  t.deepEqual(
    strFindHeadsTails('%%_', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: false, allowWholeValueToBeOnlyHeadsOrTails: true }),
    [],
    '02.06.04',
  )
  // only this settings combo will cause a throw:
  t.throws(() => {
    strFindHeadsTails('%%_', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: true, allowWholeValueToBeOnlyHeadsOrTails: false })
  }) // equal to heads
  t.throws(() => {
    strFindHeadsTails('_%%', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: true, allowWholeValueToBeOnlyHeadsOrTails: false })
  }) // equal to tails
})
