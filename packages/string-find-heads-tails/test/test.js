import test from 'ava'
import strFindHeadsTails from '../dist/string-find-heads-tails.cjs'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - throws when there\'s no input', (t) => {
  const error = t.throws(() => {
    strFindHeadsTails()
  })
  t.truthy(error.message.includes('THROW_ID_01'))
})

test('01.02 - throws when the first argument, source string, is not a string', (t) => {
  const err1 = t.throws(() => {
    strFindHeadsTails(1)
  })
  const err2 = t.throws(() => {
    strFindHeadsTails(1, 'a', 'b')
  })
  t.truthy(err1.message.includes('THROW_ID_01'))
  t.truthy(err2.message.includes('THROW_ID_02'))
})

test('01.03 - throws when the second argument, heads, is not a string', (t) => {
  const err1 = t.throws(() => {
    strFindHeadsTails('a', 1, 'a') // THROW_ID_03
  })
  t.truthy(err1.message.includes('THROW_ID_03'))

  const err2 = t.throws(() => {
    strFindHeadsTails('a', 1, 'z') // THROW_ID_03
  })
  t.truthy(err2.message.includes('THROW_ID_03'))

  const err3 = t.throws(() => {
    strFindHeadsTails('a', 1, 'a')
  })
  t.truthy(err3.message.includes('THROW_ID_03'))

  const err4 = t.throws(() => {
    strFindHeadsTails('a', '', 'z') // THROW_ID_04
  })
  t.truthy(err4.message.includes('THROW_ID_04'))

  const err5 = t.throws(() => {
    strFindHeadsTails('a', [], 'z') // THROW_ID_05
  })
  t.truthy(err5.message.includes('THROW_ID_05'))

  const err6 = t.throws(() => {
    strFindHeadsTails('a', ['z', 1, null], ['z']) // THROW_ID_06
  })
  t.truthy(err6.message.includes('THROW_ID_06'))

  const err7 = t.throws(() => {
    strFindHeadsTails('a', ['z', 1, undefined], 'z') // THROW_ID_06
  })
  t.truthy(err7.message.includes('THROW_ID_06'))

  const err8 = t.throws(() => {
    strFindHeadsTails('a', ['z', true], 'z') // THROW_ID_06
  })
  t.truthy(err8.message.includes('THROW_ID_06'))

  const err9 = t.throws(() => {
    strFindHeadsTails('a', ['b', ''], 'c') // THROW_ID_07
  })
  t.truthy(err9.message.includes('THROW_ID_07'))
})

test('01.04 - throws when the third argument, tails, is not a string', (t) => {
  const err1 = t.throws(() => {
    strFindHeadsTails('a', 'a', null) // THROW_ID_08
  })
  t.truthy(err1.message.includes('THROW_ID_08'))

  const err2 = t.throws(() => {
    strFindHeadsTails('a', 'a', 1)
  })
  t.truthy(err2.message.includes('THROW_ID_08'))

  const err3 = t.throws(() => {
    strFindHeadsTails('a', 'a', '') // THROW_ID_09
  })
  t.truthy(err3.message.includes('THROW_ID_09'))

  const err4 = t.throws(() => {
    strFindHeadsTails('a', 'a', []) // THROW_ID_10
  })
  t.truthy(err4.message.includes('THROW_ID_10'))

  const err5 = t.throws(() => {
    strFindHeadsTails('a', 'a', ['z', 1]) // THROW_ID_11
  })
  t.truthy(err5.message.includes('THROW_ID_11'))

  const err6 = t.throws(() => {
    strFindHeadsTails('a', 'a', [null]) // THROW_ID_11
  })
  t.truthy(err6.message.includes('THROW_ID_11'))

  const err7 = t.throws(() => {
    strFindHeadsTails('a', 'a', [true]) // THROW_ID_11
  })
  t.truthy(err7.message.includes('THROW_ID_11'))

  const err8 = t.throws(() => {
    strFindHeadsTails('a', 'a', ['z', '']) // THROW_ID_12
  })
  t.truthy(err8.message.includes('THROW_ID_12'))
})

test('01.05 - throws when the fourth argument, opts, is of a wrong type', (t) => {
  const err1 = t.throws(() => {
    strFindHeadsTails('a', 'a', 'a', 'a') // THROW_ID_13
  })
  t.truthy(err1.message.includes('THROW_ID_13'))

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

  const err2 = t.throws(() => {
    strFindHeadsTails('a', 'a', 'a', { fromIndex: 1.5 }) // not a natural number
  })
  t.truthy(err2.message.includes('THROW_ID_18'))
})

test('01.06 - unmatched heads and tails', (t) => {
  const err1 = t.throws(() => {
    strFindHeadsTails('abc%%_def_%ghi', '%%_', '_%%')
  }) // sneaky - tails' second percentage char is missing, hence unrecognised and throws
  t.truthy(err1.message.includes('THROW_ID_21'))

  const err2 = t.throws(() => {
    strFindHeadsTails('abcdef', 'x', 'e') // heads not found
  })
  t.truthy(err2.message.includes('THROW_ID_20'))

  const err3 = t.throws(() => {
    strFindHeadsTails('abcdef', 'x', ['e', '$']) // heads not found
  })
  t.truthy(err3.message.includes('THROW_ID_20'))

  const err4 = t.throws(() => {
    strFindHeadsTails('abcdef', ['_', 'x'], ['e', '$']) // heads not found
  })
  t.truthy(err4.message.includes('THROW_ID_20'))

  const err5 = t.throws(() => {
    strFindHeadsTails('abcdef', 'b', 'x') // tails not found
  })
  t.truthy(err5.message.includes('THROW_ID_21'))

  const err6 = t.throws(() => {
    strFindHeadsTails('abcdef', ['&', 'b'], 'x') // tails not found
  })
  t.truthy(err6.message.includes('THROW_ID_21'))

  t.notThrows(() => {
    strFindHeadsTails('abcdef', 'x', 'z') // both heads and tails not found - OK
  })
})

test('01.07 - both heads and tails found but wrong order', (t) => {
  const err1 = t.throws(() => {
    strFindHeadsTails('abc___def---ghi', '---', '___') // opposite order
  })
  t.truthy(err1.message.includes('THROW_ID_21'))

  const err2 = t.throws(() => {
    strFindHeadsTails('abc___def---ghi', ['***', '---'], '___') // opposite order
  })
  t.truthy(err2.message.includes('THROW_ID_21'))

  const err3 = t.throws(() => {
    strFindHeadsTails('abc___def---ghi', ['***', '---'], ['^^^', '___']) // opposite order
  })
  t.truthy(err3.message.includes('THROW_ID_21'))

  const err4 = t.throws(() => {
    strFindHeadsTails('--a__bcdef**', ['--', '__'], ['**', '^^']) // two consecutive heads
  })
  t.truthy(err4.message.includes('THROW_ID_19'))

  const err5 = t.throws(() => {
    strFindHeadsTails('--a**bcdefghij^^', ['--', '__'], ['**', '^^']) // two consecutive tails
  })
  t.truthy(err5.message.includes('THROW_ID_20'))

  const err6 = t.throws(() => {
    strFindHeadsTails('--a^^bc__defghij', ['--', '__'], ['**', '^^']) // second heads unmatched
  })
  t.truthy(err6.message.includes('THROW_ID_21'))
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
  const err1 = t.throws(() => {
    strFindHeadsTails('abc%%_def_%%ghi', '%%_', '_%%', { fromIndex: 4 })
  }) // fromIndex prevented heads from being caught. Tails were caught, but
  // since opts.throwWhenSomethingWrongIsDetected is on, error is thrown.
  t.truthy(err1.message.includes('THROW_ID_20'))

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
  const err = t.throws(() => {
    strFindHeadsTails('aaa_%%bbb%%_ccc', '%%_', '_%%')
  })
  t.truthy(err.message.includes('THROW_ID_21'))

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
  const err1 = t.throws(() => {
    strFindHeadsTails('%%_', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: true, allowWholeValueToBeOnlyHeadsOrTails: false })
  }) // equal to heads
  t.truthy(err1.message.includes('THROW_ID_16'))

  const err2 = t.throws(() => {
    strFindHeadsTails(
      '%%_',
      '%%_',
      '_%%',
      {
        throwWhenSomethingWrongIsDetected: true,
        allowWholeValueToBeOnlyHeadsOrTails: false,
        source: 'someLib [CUSTOM_THROW_99]:',
      },
    )
  }) // equal to heads
  t.truthy(err2.message.includes('CUSTOM'))

  const err3 = t.throws(() => {
    strFindHeadsTails('_%%', '%%_', '_%%', { throwWhenSomethingWrongIsDetected: true, allowWholeValueToBeOnlyHeadsOrTails: false })
  }) // equal to tails
  t.truthy(err3.message.includes('THROW_ID_17'))
})
