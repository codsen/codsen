/* eslint no-template-curly-in-string: 0, padded-blocks: 0 */

import test from 'ava'
import jv from '../dist/json-variables.cjs'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - basic throws related to wrong input', (t) => {
  const err1 = t.throws(() => {
    jv()
  })
  t.truthy(err1.message.includes('[THROW_ID_01]'))

  const err2 = t.throws(() => {
    jv('zzzz')
  })
  t.truthy(err2.message.includes('[THROW_ID_02]'))

  const err3 = t.throws(() => {
    jv('{}') // string curlies...
  })
  t.truthy(err3.message.includes('[THROW_ID_02]'))

  // empty plain object does not throw
  t.deepEqual(
    jv({}),
    {},
    'empty plain object',
  )

  const err5 = t.throws(() => {
    jv([]) // empty array
  })
  t.truthy(err5.message.includes('[THROW_ID_02]'))
})

test('01.02 - throws when options heads and/or tails are empty', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'a',
    }, { heads: '' })
  })
  t.truthy(err1.message.includes('[THROW_ID_06]'))

  const err2 = t.throws(() => {
    jv({
      a: 'a',
    }, { tails: '' })
  })
  t.truthy(err2.message.includes('[THROW_ID_07]'))

  const err3 = t.throws(() => {
    jv({
      a: 'a',
    }, { heads: '', tails: '' })
  })
  t.truthy(err3.message.includes('[THROW_ID_06]'))
})

test('01.03 - throws when data container key lookup is enabled and container tails are given blank', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'a',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: '' })
  })
  t.truthy(err1.message.includes('[THROW_ID_08]'))

  t.deepEqual(
    jv({
      a: 'a',
    }, { lookForDataContainers: false, dataContainerIdentifierTails: '' }),
    {
      a: 'a',
    },
    'data store is off, so empty opts.dataContainerIdentifierTails is fine',
  )

  const err3 = t.throws(() => {
    jv({
      a: 'a',
    }, { dataContainerIdentifierTails: '' })
  })
  t.truthy(err3.message.includes('[THROW_ID_08]'))
})

test('01.04 - throws when heads and tails are equal', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'a',
    }, { heads: '%%', tails: '%%' })
  })
  t.truthy(err1.message.includes('[THROW_ID_09]'))
})

test('01.05 - throws when input is not a plain object', (t) => {
  const err1 = t.throws(() => {
    jv(['zzz'], { heads: '%%', tails: '%%' })
  })
  t.truthy(err1.message.includes('[THROW_ID_02]'))
})

test('01.06 - throws when keys contain variables', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      '%%_var2_%%': 'something',
      var1: 'value1',
      var2: 'value2',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_15]'))

  const err2 = t.throws(() => {
    jv({
      a: 'some text zzvar1yy more text',
      zzvar2yy: 'something',
      var1: 'value1',
      var2: 'value2',
    }, { heads: 'zz', tails: 'yy' }) // custom heads and tails
  })
  t.truthy(err2.message.includes('[THROW_ID_15]'))
})

test('01.07 - throws when there are unequal number of marker heads and tails', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more %%_text',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'some text value1 more %%_text',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '01.07.01',
  )

  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text_%%',
      b: '%%_something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'some text value1 more text_%%',
      b: '%%_something',
      var1: 'value1',
      var2: 'value2',
    },
    '01.07.02',
  )
})

test('01.08 - throws when data is missing', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_18]'))
  const err2 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
      a_data: 'zzz',
    })
  })
  t.truthy(err2.message.includes('[THROW_ID_18]'))
})

test('01.09 - throws when data container lookup is turned off and var is missing', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: false })
  })
  t.truthy(err1.message.includes('[THROW_ID_18]'))

  // since v.7 the value will be found if such key exists anywhere
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text',
      a_data: {
        var1: 'something',
      },
    }, { lookForDataContainers: false }),
    {
      a: 'some text something more text',
      a_data: {
        var1: 'something',
      },
    },
    'data store is off, so empty opts.dataContainerIdentifierTails is fine',
  )

  // now, the data stores (keys with _data) are used only to give preference
  // when the value is resolved - they will be checked first, before doing global
  // key search, which would come last. Observe:

  // "b" has a datastore, "b_data", but datastores are turned off.
  // This means, when resolving and going upwards the AST, the values-as-keys,
  // in our case, keys named "var1" will be searched for, all the way, from "c"
  // level to the root level.

  // Now, "b_data.var1" key "var1" is not at the same level as "b", it's deeper
  // in other child's path, so it will not get checked during the first checking
  // route, when algorithm will go from "c" up to root.

  // At root level, it will find "var1" and therefore will resolve "c" to "222".
  t.deepEqual(
    jv({
      a: {
        b: {
          c: 'some text %%_var1_%% more text',
        },
        b_data: {
          var1: '111',
        },
      },
      var1: '222',
    }, { lookForDataContainers: false }),
    {
      a: {
        b: {
          c: 'some text 222 more text',
        },
        b_data: {
          var1: '111',
        },
      },
      var1: '222',
    },
    'resolves to topmost root level key because data store is off',
  )

  // now if we enable data stores, "c" will resolve to "111" because data store
  // path will be checked when bubbling up to root level, where var1: '222' is.
  t.deepEqual(
    jv({
      a: {
        b: {
          c: 'some text %%_var1_%% more text',
        },
        b_data: {
          var1: '111',
        },
      },
      var1: '222',
    }, { lookForDataContainers: true }),
    {
      a: {
        b: {
          c: 'some text 111 more text',
        },
        b_data: {
          var1: '111',
        },
      },
      var1: '222',
    },
    'resolves to datastore, not using value at the root',
  )
})

test('01.10 - throws when data container name append is not string', (t) => {
  // in both tests, check-types-mini will throw:

  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: false })
  })
  t.truthy(err1.message.includes('[THROW_ID_04*]'))

  const err2 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: 1 })
  })
  t.truthy(err2.message.includes('[THROW_ID_04*]'))
})

test('01.11 - not throws when data container name append is given empty, but data container lookup is turned off', (t) => {
  t.notThrows(() => {
    jv({
      a: 'some text, more text',
      b: 'something',
    }, { lookForDataContainers: false, dataContainerIdentifierTails: '' })
  })
})

test('01.12 - throws when data container name append is given empty', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: '' })
  })
  t.truthy(err1.message.includes('[THROW_ID_08]'))
  const err2 = t.throws(() => {
    jv({
      a: 'some text, more text',
      b: 'something',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: '' })
  })
  t.truthy(err2.message.includes('[THROW_ID_08]'))
})

test('01.13 - throws when opts.wrapHeadsWith is customised to anything other than string', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { wrapHeadsWith: false })
  })
  t.truthy(err1.message.includes('[THROW_ID_04*]')) // thx to check-types-mini
})

test('01.14 - opts.wrapHeadsWith does not affect failing resolving', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { wrapHeadsWith: '' })
  })
  t.truthy(err1.message.includes('[THROW_ID_18]'))
})

test('01.15 - throws when opts.wrapTailsWith is customised to anything other than string', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { wrapTailsWith: false })
  })
  t.truthy(err1.message.includes('[THROW_ID_04*]'))
})

test('01.16 - not throws when opts.wrapTailsWith is customised to an empty string', (t) => {
  t.notThrows(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      var1: 'something',
    }, { wrapTailsWith: '' })
  })
})

test('01.17 - throws when opts.heads is not string', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { heads: 1 })
  })
  t.truthy(err1.message.includes('[THROW_ID_04*]'))
})

test('01.18 - throws when opts.tails is not string', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { tails: 1 })
  })
  t.truthy(err1.message.includes('[THROW_ID_04*]'))
})

test('01.19 - throws when all args are missing', (t) => {
  const err1 = t.throws(() => {
    jv()
  })
  t.truthy(err1.message.includes('[THROW_ID_01]'))
})

test('01.20 - throws when key references itself', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: '%%_a_%%',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_19]'))

  const err2 = t.throws(() => {
    jv({
      a: 'something %%_a_%% aaaa %%_a_%%',
    })
  })
  t.truthy(err2.message.includes('[THROW_ID_19]'))
})

test('01.21 - throws when key references itself', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'a',
      b: '%%_a_%%',
      c: '%%_c_%%',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_19]'))
})

test('01.22 - throws when key references key which references itself', (t) => {
  const err1 = t.throws(() => {
    jv({
      b: '%%_a_%%',
      a: '%%_a_%%',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_19]'))
})

test('01.23 - throws when there\'s recursion (with distraction)', (t) => {
  const err1 = t.throws(() => {
    jv({
      b: '%%_a_%%',
      a: '%%_b_%%',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_19]'))

  const err2 = t.throws(() => {
    jv({
      longerKeyName: '%%_shorterKeyN_%%',
      shorterKeyN: '%%_longerKeyName_%%',
    })
  })
  t.truthy(err2.message.includes('[THROW_ID_19]'))

  const err3 = t.throws(() => {
    jv({
      k: {
        l: {
          m: {
            n: {
              a: '%%_c_%% %%_b_%%',
              b: '%%_a_%%',
              c: 'ccc',
            },
          },
        },
      },
    })
  })
  t.truthy(err3.message.includes('[THROW_ID_19]'))

  const err4 = t.throws(() => {
    jv({
      k: {
        l: {
          m: {
            n: {
              a: '%%_c_%% %%_b_%%',
              a_data: { // with data-store
                b: '%%_a_%%',
              },
              c: 'ccc',
            },
          },
        },
      },
    })
  })
  t.truthy(err4.message.includes('[THROW_ID_19]'))
})

test('01.24 - throws when there\'s a longer recursion', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: '%%_d_%%',
      d: '%%_e_%%',
      e: '%%_b_%%',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_19]'))
})

test('01.25 - throws when opts.lookForDataContainers is not boolean', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: 1 }) // as number, should be Bool
  })
  t.truthy(err1.message.includes('[THROW_ID_04*]'))

  const err2 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: 'false' }) // as string, should be Bool
  })
  t.truthy(err2.message.includes('[THROW_ID_04*]'))
})

test('01.26 - throws when opts.preventDoubleWrapping is not boolean', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { preventDoubleWrapping: 1 })
  })
  t.truthy(err1.message.includes('[THROW_ID_04*]'))

  const err2 = t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { preventDoubleWrapping: 'false' })
  })
  t.truthy(err2.message.includes('[THROW_ID_04*]'))
})

test('01.27 - throws when opts.heads and opts.headsNoWrap are customised to be equal', (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        heads: '%%_',
        headsNoWrap: '%%_',
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_10]'))

  const err2 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        heads: 'zzzz',
        headsNoWrap: 'zzzz',
      },
    )
  })
  t.truthy(err2.message.includes('[THROW_ID_10]'))

  const err3 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        headsNoWrap: '%%_', // aiming at the default heads, "%%_"
      },
    )
  })
  t.truthy(err3.message.includes('[THROW_ID_10]'))
})

test('01.28 - throws when opts.tails and opts.tailsNoWrap are customised to be equal', (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        tails: '_%%',
        tailsNoWrap: '_%%',
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_11]'))

  const err2 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        tails: 'zzzz',
        tailsNoWrap: 'zzzz',
      },
    )
  })
  t.truthy(err2.message.includes('[THROW_ID_11]'))

  const err3 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        tailsNoWrap: '_%%', // default tails is the same "_%%"
      },
    )
  })
  t.truthy(err3.message.includes('[THROW_ID_11]'))
})

test('01.29 - empty nowraps', (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        heads: '%%_',
        headsNoWrap: '',
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_12]'))

  const err2 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        tails: '_%%',
        tailsNoWrap: '',
      },
    )
  })
  t.truthy(err2.message.includes('[THROW_ID_13]'))

  const err3 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        headsNoWrap: '',
      },
    )
  })
  t.truthy(err3.message.includes('[THROW_ID_12]'))

  const err4 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        tailsNoWrap: '',
      },
    )
  })
  t.truthy(err4.message.includes('[THROW_ID_13]'))
})

test('01.30 - equal nowraps', (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        tailsNoWrap: 'aaa',
        headsNoWrap: 'aaa',
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_14]'))

  const err2 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        tailsNoWrap: '%%-',
        headsNoWrap: '%%-',
      },
    )
  })
  t.truthy(err2.message.includes('[THROW_ID_14]'))

  const err3 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        headsNoWrap: '-%%', // same as default tailsNoWrap
      },
    )
  })
  t.truthy(err3.message.includes('[THROW_ID_14]'))
})

test('01.31 - throws there\'s simple recursion loop in array', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: '%%_a_%%',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_19]'))

  const err2 = t.throws(() => {
    jv({
      a: { b: '%%_a_%%' },
    })
  })
  t.truthy(err2.message.includes('[THROW_ID_20]'))

  const err3 = t.throws(() => {
    jv({
      a: ['%%_a_%%'],
    })
  })
  t.truthy(err3.message.includes('[THROW_ID_20]'))

  const err4 = t.throws(() => {
    jv({
      a: ['%%_b_%%'],
      b: ['%%_a_%%'],
    })
  })
  t.truthy(err4.message.includes('[THROW_ID_20]'))

  const err5 = t.throws(() => {
    jv({
      a: ['%%_b_%%', '%%_b_%%'],
    })
  })
  t.truthy(err5.message.includes('[THROW_ID_18]'))

  const err6 = t.throws(() => {
    jv({ z: ['%%_a_%%'] })
  })
  t.truthy(err6.message.includes('[THROW_ID_18]'))
})

test('01.32 - throws referencing what does not exist', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: '%%_b_%%',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_18]'))
  const err2 = t.throws(() => {
    jv({
      a: ['%%_b_%%'],
    })
  })
  t.truthy(err2.message.includes('[THROW_ID_18]'))
})

test('01.33 - throws when referencing the multi-level object keys that don\'t exist', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'some text %%_var1.key99_%% more text %%_var2.key99_%%',
      b: 'something',
      var1: { key1: 'value1' },
      var2: { key2: 'value2' },
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_18]'))

  const err2 = t.throws(() => {
    jv({
      a: 'some text %%_var1.key99_%% more text %%_var2.key99_%%',
      b: 'something',
      var1: { key1: 'value1', key2: 'value2', key3: 'value3' },
      var2: { key4: 'value4', key5: 'value5', key6: 'value6' },
    })
  })
  t.truthy(err2.message.includes('[THROW_ID_18]'))

  const err3 = t.throws(() => {
    jv({
      a: 'some text %%_var1.key99_%% more text %%_var2.key99_%%',
      b: 'something',
      var1: { key1: 'value1' },
      var2: { key2: 'value2' },
    }, {
      wrapHeadsWith: '${',
      wrapTailsWith: '}',
    })
  })
  t.truthy(err3.message.includes('[THROW_ID_18]'))
})

test('01.34 - throws when opts are given truthy but not a plain object', (t) => {
  const err1 = t.throws(() => {
    jv({
      a: 'aaa',
      b: 'bbb',
    }, 'zzz')
  })
  t.truthy(err1.message.includes('[THROW_ID_03]'))
})

// -----------------------------------------------------------------------------
// 02. B.A.U.
// -----------------------------------------------------------------------------

test('02.01 - two variables in an object\'s key', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text %%_var2_%%',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '02.01',
  )
})

test('02.02 - two variables with paths in an object\'s key', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1.key1.0_%% more text %%_var2.key2.key3.1_%%',
      b: 'something',
      var1: { key1: ['value1'] },
      var2: { key2: { key3: ['', 'value2'] } },
    }),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: { key1: ['value1'] },
      var2: { key2: { key3: ['', 'value2'] } },
    },
    '02.02 - defaults + querying object contents',
  )
})

test('02.03 - two variables, with wrapping', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text %%_var1_%% more text %%_var2_%%',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
      {
        wrapHeadsWith: '${',
        wrapTailsWith: '}',
      },
    ),
    {
      a: 'some text ${value1} more text ${value2}',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '02.03 - custom wrappers',
  )
})

test('02.04 - variables with paths being wrapped', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text %%_var1.key1_%% more text %%_var2.key2_%%',
        b: 'something',
        var1: { key1: 'value1' },
        var2: { key2: 'value2' },
      },
      {
        wrapHeadsWith: '${',
        wrapTailsWith: '}',
      },
    ),
    {
      a: 'some text ${value1} more text ${value2}',
      b: 'something',
      var1: { key1: 'value1' },
      var2: { key2: 'value2' },
    },
    '02.04 - custom wrappers + multi-level',
  )
})

test('02.05 - custom heads and tails', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text {var1} more text {var2}',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
      {
        heads: '{',
        tails: '}',
      },
    ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '02.05 - custom heads/tails',
  )
})

test('02.06 - custom heads and tails being wrapped', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text {var1.key1} more text {var2.key2}',
        b: 'something',
        var1: { key1: 'value1' },
        var2: { key2: 'value2' },
      },
      {
        heads: '{',
        tails: '}',
      },
    ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: { key1: 'value1' },
      var2: { key2: 'value2' },
    },
    '02.06 - custom heads/tails + multi-level',
  )
})

test('02.07 - whitespace within custom heads and tails', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text {  var1  } more text {  var2  }',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
      {
        heads: '{',
        tails: '}',
      },
    ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '02.07 - custom heads/tails, some whitespace inside of them',
  )
})

test('02.08 - whitespace within variables containing paths and custom heads/tails', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text {  var1.key1  } more text {  var2.key2  }',
        b: 'something',
        var1: { key1: 'value1' },
        var2: { key2: 'value2' },
      },
      {
        heads: '{',
        tails: '}',
      },
    ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: { key1: 'value1' },
      var2: { key2: 'value2' },
    },
    '02.08 - custom heads/tails, some whitespace inside of them + multi-level',
  )
})

test('02.09 - some values are equal to heads or tails', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text %%_var2_%%',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
      c: '%%_',
      d: '_%%',
      e: '_%%',
    }),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
      c: '%%_',
      d: '_%%',
      e: '_%%',
    },
    '02.09 - some keys have heads/tails exactly - defaults',
  )
})

test('02.10 - opts.noSingleMarkers - off', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text %%_var1_%% more text %%_var2_%%',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
        c: '%%_',
        d: '_%%',
        e: '_%%',
      },
      {
        noSingleMarkers: false,
      },
    ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
      c: '%%_',
      d: '_%%',
      e: '_%%',
    },
    '02.10 - some keys have heads/tails exactly - hardcoded defaults',
  )
})

test('02.11 - opts.noSingleMarkers - on', (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text %%_var2_%%',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
        c: '%%_',
        d: '_%%',
        e: '_%%',
      },
      {
        noSingleMarkers: true,
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_16]'))
})

test('02.12 - opts.noSingleMarkers - off - more throw tests', (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text %%_var2_%%',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
        c: '%%_',
      },
      {
        noSingleMarkers: true,
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_16]'))
})

test('02.13 - custom heads/tails, values equal to them are present in data', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text {var1} more text {var2}',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
        c: '{',
        d: '}',
        e: '}',
      },
      {
        heads: '{',
        tails: '}',
      },
    ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
      c: '{',
      d: '}',
      e: '}',
    },
    '02.13 - some keys have heads/tails only - custom heads/tails, defaults',
  )
})

test('02.14 - custom heads/tails - noSingleMarkers = false', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text {var1} more text {var2}',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
        c: '{',
        d: '}',
        e: '}',
      },
      {
        noSingleMarkers: false,
        heads: '{',
        tails: '}',
      },
    ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
      c: '{',
      d: '}',
      e: '}',
    },
    '02.14 - some keys have heads/tails only - custom heads/tails, hardcoded defaults',
  )
})

test('02.15 - value in an array', (t) => {
  t.deepEqual(
    jv({
      z: {
        a: ['some text %%_var1_%% more text %%_var2_%%'],
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
    }),
    {
      z: {
        a: ['some text value1 more text value2'],
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
    },
    '02.15',
  )
})

test('02.16 - data stores #1', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text %%_var3_%%.',
      b: 'something',
      a_data: {
        var1: 'value1',
        var3: '333333',
      },
    }),
    {
      a: 'some text value1 more text 333333.',
      b: 'something',
      a_data: {
        var1: 'value1',
        var3: '333333',
      },
    },
    '02.16.01',
  )
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text %%_var3_%%.',
      b: 'something',
      a_data: {
        var1: 'value1',
        var3: '333333',
      },
    }, { wrapHeadsWith: '${', wrapTailsWith: '}' }),
    {
      a: 'some text ${value1} more text ${333333}.',
      b: 'something',
      a_data: {
        var1: 'value1',
        var3: '333333',
      },
    },
    '02.16.02',
  )
  t.deepEqual(
    jv({
      a: 'some text %%_var1.key1_%% more text %%_var3.key3_%%.',
      b: 'something',
      a_data: {
        var1: { key1: 'value1' },
        var3: { key3: '333333' },
      },
    }),
    {
      a: 'some text value1 more text 333333.',
      b: 'something',
      a_data: {
        var1: { key1: 'value1' },
        var3: { key3: '333333' },
      },
    },
    '02.16.03 - data stash and multi-level, all default',
  )
  t.deepEqual(
    jv({
      a: 'some text %%_var1.key1_%% more text %%_var3.key3_%%.',
      b: 'something',
      a_data: {
        var1: { key1: 'value1' },
        var3: { key3: '333333' },
      },
    }, { wrapHeadsWith: '${', wrapTailsWith: '}' }),
    {
      a: 'some text ${value1} more text ${333333}.',
      b: 'something',
      a_data: {
        var1: { key1: 'value1' },
        var3: { key3: '333333' },
      },
    },
    '02.16.04 - data stash and multi-level, default markers, custom wrap',
  )
})

test('02.17 - top-level key and data stash clash', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text %%_var3_%%.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: 'value1',
        var3: '333333',
      },
    }),
    {
      a: 'some text value2 more text 333333.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: 'value1',
        var3: '333333',
      },
    },
    '02.17.01 - default, no wrap',
  )
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text %%_var3_%%.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: 'value1',
        var3: '333333',
      },
    }, { wrapHeadsWith: '${', wrapTailsWith: '}' }),
    {
      a: 'some text ${value2} more text ${333333}.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: 'value1',
        var3: '333333',
      },
    },
    '02.17.02 - wrap',
  )
  t.deepEqual(
    jv({
      a: 'some text %%_var1.key1_%% more text %%_var3.key3_%%.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: { key1: 'value1' },
        var3: { key3: '333333' },
      },
    }),
    {
      a: 'some text value1 more text 333333.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: { key1: 'value1' },
        var3: { key3: '333333' },
      },
    },
    '02.17.03 - root key would take precedence, but it\'s of a wrong format and therefore algorithm chooses data storage instead (which is correct type)',
  )
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text %%_var3.key3_%%.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: { key1: 'value1' },
        var3: { key3: '333333' },
      },
    }),
    {
      a: 'some text value2 more text 333333.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: { key1: 'value1' },
        var3: { key3: '333333' },
      },
    },
    '02.17.03 - mix, one var resolved from root, another from data store',
  )
})

test('02.18 - emoji in values', (t) => {
  t.deepEqual(
    jv({
      a: 'some🦄 text %%_var1_%% more text %%_var2_%%.',
      b: 'something',
      var1: 'value1',
      a_data: {
        var2: 'value2',
      },
    }),
    {
      a: 'some🦄 text value1 more text value2.',
      b: 'something',
      var1: 'value1',
      a_data: {
        var2: 'value2',
      },
    },
    '02.18',
  )
})

test('02.19 - emoji in keys', (t) => {
  t.deepEqual(
    jv({
      a: 'some🦄 text %%_var🐴_%% more text %%_var2_%%.',
      b: 'something',
      'var🐴': 'value1',
      a_data: {
        var2: 'value2',
      },
    }),
    {
      a: 'some🦄 text value1 more text value2.',
      b: 'something',
      'var🐴': 'value1',
      a_data: {
        var2: 'value2',
      },
    },
    '02.19',
  )
})

test('02.20 - emoji in variable keys', (t) => {
  t.deepEqual(
    jv({
      a: 'some🦄 text %%_var🐴_%% more text %%_var2_%%.',
      b: 'something',
      'var🐴': 'value1💘',
      a_data: {
        var2: 'value2💛',
      },
    }),
    {
      a: 'some🦄 text value1💘 more text value2💛.',
      b: 'something',
      'var🐴': 'value1💘',
      a_data: {
        var2: 'value2💛',
      },
    },
    '02.20',
  )
})

test('02.21 - empty strings in the input AST', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1_%% more text %%_var2_%%',
      b: 'something',
      c: '',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      c: '',
      var1: 'value1',
      var2: 'value2',
    },
    '02.21 - defaults',
  )
})

test('02.22 - fetching variables from parent node\'s level', (t) => {
  t.deepEqual(
    jv({
      a: {
        b: {
          c: {
            d: 'text %%_var1_%% text %%-var2-%% text',
          },
          var1: 'zzz',
          var2: 'yyy',
        },
      },
    }),
    {
      a: {
        b: {
          c: {
            d: 'text zzz text yyy text',
          },
          var1: 'zzz',
          var2: 'yyy',
        },
      },
    },
    '02.22 - defaults',
  )
})

test('02.23 - fetching variables from two levels above', (t) => {
  t.deepEqual(
    jv({
      a: {
        b: {
          c: {
            d: 'text %%_var1_%% text %%-var2-%% text',
          },
        },
        var1: 'zzz',
        var2: 'yyy',
      },
    }),
    {
      a: {
        b: {
          c: {
            d: 'text zzz text yyy text',
          },
        },
        var1: 'zzz',
        var2: 'yyy',
      },
    },
    '02.23 - defaults',
  )
})

test('02.24 - fetching variables from root, three levels above', (t) => {
  t.deepEqual(
    jv({
      a: {
        b: {
          c: {
            d: 'text %%_var1.z_%% text %%-var2-%% text',
          },
        },
      },
      var1: { z: 'zzz' },
      var2: 'yyy',
    }),
    {
      a: {
        b: {
          c: {
            d: 'text zzz text yyy text',
          },
        },
      },
      var1: { z: 'zzz' },
      var2: 'yyy',
    },
    '02.24 - defaults',
  )
})

test('02.25 - fetching variables from parent node\'s level data store', (t) => {
  t.deepEqual(
    jv({
      a: {
        b: {
          c: {
            d: 'text %%_var1.z_%% text %%-var2-%% text',
          },
          c_data: {
            var1: { z: 'zzz' },
            var2: 'yyy',
          },
        },
      },
    }),
    {
      a: {
        b: {
          c: {
            d: 'text zzz text yyy text',
          },
          c_data: {
            var1: { z: 'zzz' },
            var2: 'yyy',
          },
        },
      },
    },
    '02.25 - defaults',
  )
})

test('02.26 - fetching variables from data store two levels above', (t) => {
  t.deepEqual(
    jv({
      a: {
        b: {
          c: {
            d: 'text %%_var1_%% text %%-var2-%% text',
          },
        },
        b_data: {
          var1: 'zzz',
          var2: 'yyy',
        },
      },
    }),
    {
      a: {
        b: {
          c: {
            d: 'text zzz text yyy text',
          },
        },
        b_data: {
          var1: 'zzz',
          var2: 'yyy',
        },
      },
    },
    '02.26 - defaults',
  )
})

test('02.27 - fetching variables from data store as high as the root', (t) => {
  t.deepEqual(
    jv({
      a: {
        b: {
          c: {
            d: 'text %%_var1_%% text %%-var2-%% text',
          },
        },
      },
      a_data: {
        var1: 'zzz',
        var2: 'yyy',
      },
    }),
    {
      a: {
        b: {
          c: {
            d: 'text zzz text yyy text',
          },
        },
      },
      a_data: {
        var1: 'zzz',
        var2: 'yyy',
      },
    },
    '02.27 - defaults',
  )
})

// in the unit test below, there are two "eee"s to check can we really use
// parent keys in the path to make keys unique
test('02.28 - three level references', (t) => {
  t.deepEqual(
    jv({
      aaa: {
        bbb: {
          ccc: 'some text %%_ddd_%%',
          ggg: { zzz: '%%_hhh_%%' },
          eee: 'jjj',
          fff: 'kkk',
        },
        bbb_data: {
          ddd: '%%_eee.fff_%%',
          eee: {
            fff: '%%_ggg.zzz_%%',
          },
        },
      },
      hhh: 'iii',
    }),
    {
      aaa: {
        bbb: {
          ccc: 'some text iii',
          ggg: { zzz: 'iii' },
          eee: 'jjj',
          fff: 'kkk',
        },
        bbb_data: {
          ddd: 'iii',
          eee: {
            fff: 'iii',
          },
        },
      },
      hhh: 'iii',
    },
    '02.28',
  )
})

test('02.29 - resolves to a string', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: 1,
    }),
    {
      a: '1',
      b: 1,
    },
    '02.29.01',
  )

  t.deepEqual(
    jv({
      a: '%%_b_%%',
      a_data: {
        b: 1,
      },
    }),
    {
      a: '1',
      a_data: {
        b: 1,
      },
    },
    '02.29.02',
  )
})

// -----------------------------------------------------------------------------
// group 03. sneaky-ones, like recursion
// -----------------------------------------------------------------------------

test('03.01 - two-level variables resolved', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }),
    {
      a: 'val',
      b: 'val',
      c: 'val',
    },
    '03.01.01 - two redirects, querying strings',
  )
  t.deepEqual(
    jv({
      a: '%%_b.c_key_%%',
      b: { c_key: '%%_c_%%' },
      c: 'val',
    }),
    {
      a: 'val',
      b: { c_key: 'val' },
      c: 'val',
    },
    '03.01.02 - two redirects, querying multi-level',
  )
})

test('03.02 - two-level redirects, backwards order', (t) => {
  t.deepEqual(
    jv({
      x: 'val',
      y: '%%_x_%%',
      z: '%%_y_%%',
    }),
    {
      x: 'val',
      y: 'val',
      z: 'val',
    },
    '03.02.01',
  )
  t.deepEqual(
    jv({
      x: { key1: 'val' },
      y: { key2: '%%_x.key1_%%' },
      z: '%%_y.key2_%%',
    }),
    {
      x: { key1: 'val' },
      y: { key2: 'val' },
      z: 'val',
    },
    '03.02.02',
  )
})

test('03.03 - two-level variables resolved, mixed', (t) => {
  t.deepEqual(
    jv({
      a: 'Some text %%_b_%% some more text %%_c_%%',
      b: 'Some text %%_c_%%, some more text %%_d_%%',
      c: 'val1',
      d: 'val2',
    }),
    {
      a: 'Some text Some text val1, some more text val2 some more text val1',
      b: 'Some text val1, some more text val2',
      c: 'val1',
      d: 'val2',
    },
    '03.03.01',
  )
  t.deepEqual(
    jv({
      a: 'Some text %%_b_%% some more text %%_c.key1_%%',
      b: 'Some text %%_c.key1_%%, some more text %%_d.key2_%%',
      c: { key1: 'val1' },
      d: { key2: 'val2' },
    }),
    {
      a: 'Some text Some text val1, some more text val2 some more text val1',
      b: 'Some text val1, some more text val2',
      c: { key1: 'val1' },
      d: { key2: 'val2' },
    },
    '03.03.02',
  )
})

test('03.04 - three-level variables resolved', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%% %%_d_%%',
      b: '%%_c_%% %%_d_%%',
      c: '%%_d_%%',
      d: 'val',
    }),
    {
      a: 'val val val',
      b: 'val val',
      c: 'val',
      d: 'val',
    },
    '03.04.01',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%% %%_h_%%',
      b: '%%_c.e.f.g_%% %%_h_%%',
      c: { e: { f: { g: '%%_h_%%' } } },
      h: 'val',
    }),
    {
      a: 'val val val',
      b: 'val val',
      c: { e: { f: { g: 'val' } } },
      h: 'val',
    },
    '03.04.02',
  )
})

test('03.05 - another three-level var resolving', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%% %%_c_%%',
      b: '%%_c_%% %%_d_%%',
      c: '%%_d_%%',
      d: 'val',
    }),
    {
      a: 'val val val',
      b: 'val val',
      c: 'val',
      d: 'val',
    },
    '03.05',
  )
})

test('03.06 - multiple variables resolved', (t) => {
  t.deepEqual(
    jv({
      a: '%%_e_%% %%_d_%%',
      b: '%%_a_%%',
      c: 'c',
      d: '%%_c_%%',
      e: '%%_c_%%',
      f: '%%_b_%%',
    }),
    {
      a: 'c c',
      b: 'c c',
      c: 'c',
      d: 'c',
      e: 'c',
      f: 'c c',
    },
    '03.06',
  )
  const err1 = t.throws(() => {
    jv({
      a: '%%_e_%% %%_d_%%',
      b: '%%_a_%%',
      c: 'c',
      d: '%%_c_%%',
      e: '%%_b_%%',
      f: '%%_b_%%',
    })
  })
  t.truthy(err1.message.includes('[THROW_ID_19]'))

  const err2 = t.throws(() => {
    jv({
      a: '%%_e_%% %%_d_%%',
      b: '%%_a_%%',
      c: 'c',
      d: '%%_f_%%',
      e: '%%_c_%%',
      f: '%%_b_%%',
    })
  })
  t.truthy(err2.message.includes('[THROW_ID_19]'))
})

test('03.07 - preventDoubleWrapping: on & off', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', preventDoubleWrapping: false }),
    {
      a: '{{val}}',
      b: '{val}',
      c: 'val',
    },
    '03.07.01',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', preventDoubleWrapping: true }),
    {
      a: '{val}',
      b: '{val}',
      c: 'val',
    },
    '03.07.02',
  )

  // here values come already wrapped:

  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: '{val}',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', preventDoubleWrapping: false }),
    {
      a: '{{{val}}}',
      b: '{{val}}',
      c: '{val}',
    },
    '03.07.03',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: '{val}',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', preventDoubleWrapping: true }),
    {
      a: '{val}',
      b: '{val}',
      c: '{val}',
    },
    '03.07.04',
  )

  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'Some text {val} and another {val}',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', preventDoubleWrapping: false }),
    {
      a: '{{Some text {val} and another {val}}}',
      b: '{Some text {val} and another {val}}',
      c: 'Some text {val} and another {val}',
    },
    '03.07.05 - more real-life case',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'Some text {val} and another {val}',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', preventDoubleWrapping: true }),
    {
      a: 'Some text {val} and another {val}',
      b: 'Some text {val} and another {val}',
      c: 'Some text {val} and another {val}',
    },
    '03.07.06 - more real-life case',
  )

  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c.d_%%',
      c: { d: 'val' },
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', preventDoubleWrapping: true }),
    {
      a: '{val}',
      b: '{val}',
      c: { d: 'val' },
    },
    '03.07.07 - object multi-level values',
  )
})

test('03.08 - empty variable', (t) => {
  t.deepEqual(
    jv({
      a: '%%__%%',
      b: 'bbb',
    }),
    {
      a: '',
      b: 'bbb',
    },
    '03.08 - no value is needed if variable is empty - it\'s resolved to empty str',
  )
})

// -----------------------------------------------------------------------------
// 04. variable whitelisting
// -----------------------------------------------------------------------------

test('04.01 - wrap flipswitch works', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', wrapGlobalFlipSwitch: true }),
    {
      a: '{val}',
      b: '{val}',
      c: 'val',
    },
    '04.01.01',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', wrapGlobalFlipSwitch: false }),
    {
      a: 'val',
      b: 'val',
      c: 'val',
    },
    '04.01.02',
  )
})

test('04.02 - global wrap flipswitch and dontWrapVars combo', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, {
      wrapHeadsWith: '{', wrapTailsWith: '}', wrapGlobalFlipSwitch: true, dontWrapVars: 'c*',
    }),
    {
      a: '{val}',
      b: 'val',
      c: 'val',
    },
    '04.02.01',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, {
      wrapHeadsWith: '{', wrapTailsWith: '}', wrapGlobalFlipSwitch: true, dontWrapVars: 'b*',
    }),
    {
      a: '{val}', // variable already came pre-wrapped (on "c") by the time it reached a: "%%_b_%%"
      b: '{val}',
      c: 'val',
    },
    '04.02.02',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, {
      wrapHeadsWith: '{', wrapTailsWith: '}', wrapGlobalFlipSwitch: true, dontWrapVars: 'a*',
    }),
    {
      a: '{val}', // there's no such variable "a"
      b: '{val}',
      c: 'val',
    },
    '04.02.03',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, {
      wrapHeadsWith: '{', wrapTailsWith: '}', wrapGlobalFlipSwitch: true, dontWrapVars: ['b*', 'c*'],
    }),
    {
      a: 'val',
      b: 'val',
      c: 'val',
    },
    '04.02.04',
  )
})

test('04.03 - opts.dontWrapVars', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: ['zzzz*'] }),
    {
      a: '{val}',
      b: '{val}',
      c: 'val',
    },
    '04.03.02',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: '' }),
    {
      a: '{val}',
      b: '{val}',
      c: 'val',
    },
    '04.03.03',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: [] }),
    {
      a: '{val}',
      b: '{val}',
      c: 'val',
    },
    '04.03.04',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: 'zzzz*' }),
    {
      a: '{val}',
      b: '{val}',
      c: 'val',
    },
    '04.03.05',
  )
  t.throws(() => {
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: [1, 2, 3] })
  })
})

test('04.04 - opts.dontWrapVars, real key names', (t) => {
  t.deepEqual(
    jv({
      title_front: 'Some text %%_title_sub_%% and more text.',
      title_sub: '%%_subtitle_%%',
      subtitle: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: ['sub*'] }),
    {
      title_front: 'Some text {val} and more text.',
      title_sub: 'val',
      subtitle: 'val',
    },
    '04.04.01',
  )
  t.deepEqual(
    jv({
      title_front: 'Some text %%_title_sub_%% and more text.',
      title_sub: '%%_subtitle_%%',
      subtitle: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: 'sub*' }),
    {
      title_front: 'Some text {val} and more text.',
      title_sub: 'val',
      subtitle: 'val',
    },
    '04.04.02',
  )
  t.deepEqual(
    jv({
      title_front: 'Some text %%_title_sub_%% and more text.',
      title_sub: '%%_subtitle_%%',
      subtitle: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: '' }),
    {
      title_front: 'Some text {val} and more text.',
      title_sub: '{val}',
      subtitle: 'val',
    },
    '04.04.03',
  )
})

test('04.05 - multiple dontWrapVars values', (t) => {
  t.deepEqual(
    jv({
      front_title: '%%_lower_title_%%',
      lower_title: '%%_subtitle_%%',
      subtitle: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: ['zzz*', 'title*', 'lower*'] }),
    {
      front_title: '{val}',
      lower_title: '{val}',
      subtitle: 'val',
    },
    '04.05.01 - still wraps because child variable call ("subtitle") is not excluded',
  )
})

test('04.06 - one level var querying and whitelisting', (t) => {
  t.deepEqual(
    jv(
      {
        key: 'Some text %%_otherkey_%%',
        otherkey: 'variable',
      },
      {
        wrapHeadsWith: '{{',
        wrapTailsWith: '}}',
        wrapGlobalFlipSwitch: true,
        dontWrapVars: '*c',
      },
    ),
    {
      key: 'Some text {{variable}}',
      otherkey: 'variable',
    },
    '04.06.01',
  )
  t.deepEqual(
    jv(
      {
        key: 'Some text %%_otherkey_%%',
        otherkey: 'variable',
      },
      {
        wrapHeadsWith: '{{',
        wrapTailsWith: '}}',
        wrapGlobalFlipSwitch: false,
        dontWrapVars: '*c',
      },
    ),
    {
      key: 'Some text variable',
      otherkey: 'variable',
    },
    '04.06.02',
  )
})

test('04.07 - opts.dontWrapVars, real key names', (t) => {
  t.deepEqual(
    jv({
      title_front: 'Some text %%_title_sub_%% and more text.',
      title_sub: '%%_subtitle_%%',
      subtitle: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: ['*le'] }),
    {
      title_front: 'Some text {val} and more text.',
      title_sub: 'val',
      subtitle: 'val',
    },
    '04.07.01',
  )
  t.deepEqual(
    jv({
      title_front: 'Some text %%_title_sub_%% and more text.',
      title_sub: '%%_subtitle_%%',
      subtitle: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: ['*le', 'title_s*'] }),
    {
      title_front: 'Some text val and more text.',
      title_sub: 'val',
      subtitle: 'val',
    },
    '04.07.02',
  )
  t.deepEqual(
    jv({
      title_front: 'Some text %%_title_sub_%% and more text.',
      title_sub: '%%_subtitle_%%',
      subtitle: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: '' }),
    {
      title_front: 'Some text {val} and more text.',
      title_sub: '{val}',
      subtitle: 'val',
    },
    '04.07.03',
  )
})

// -----------------------------------------------------------------------------
// 05. involving arrays
// -----------------------------------------------------------------------------

test('05.01 - arrays referencing values which are strings', (t) => {
  t.deepEqual(
    jv({
      a: ['Some text %%_d_%% some more text %%_c_%%'],
      b: ['Some text %%_c_%%, some more text %%_d_%%'],
      c: 'cval',
      d: 'dval',
    }),
    {
      a: ['Some text dval some more text cval'],
      b: ['Some text cval, some more text dval'],
      c: 'cval',
      d: 'dval',
    },
    '05.01',
  )
})

test('05.02 - arrays referencing values which are arrays', (t) => {
  t.deepEqual(
    jv({
      a: ['Some text %%_b_%% some more text %%_c_%%', '%%_c_%%', '%%_d_%%'],
      b: ['zzz', 'Some text %%_c_%%, some more text %%_d_%%'],
      c: ['c1', 'c2'],
      d: 'dval',
    }),
    {
      a: ['Some text zzzSome text c1c2, some more text dval some more text c1c2', 'c1c2', 'dval'],
      b: ['zzz', 'Some text c1c2, some more text dval'],
      c: ['c1', 'c2'],
      d: 'dval',
    },
    '05.02',
  )
})

test('05.03 - arrays, whitelisting as string', (t) => {
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_submarine_%%', 'anything'],
        subtitle: 'text',
        submarine: 'ship',
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: [],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text {text}', '{ship}', 'anything'],
      subtitle: 'text',
      submarine: 'ship',
    },
    '05.03.01 - base - no ignores',
  )
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_submarine_%%', 'anything'],
        subtitle: 'text',
        submarine: 'ship',
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: 'sub*',
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text text', 'ship', 'anything'],
      subtitle: 'text',
      submarine: 'ship',
    },
    '05.03.02 - string whitelist startsWith',
  )
})

test('05.04 - arrays, whitelisting as array #1', (t) => {
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_submarine_%%', 'anything'],
        subtitle: 'text',
        submarine: 'ship',
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['subt*'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text text', '{ship}', 'anything'],
      subtitle: 'text',
      submarine: 'ship',
    },
    '05.04.01',
  )
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_submarine_%%', 'anything'],
        subtitle: 'text',
        submarine: 'ship',
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['zzz*', 'subt*', 'subm*'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text text', 'ship', 'anything'],
      subtitle: 'text',
      submarine: 'ship',
    },
    '05.04.02 - two ignores in an array',
  )
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_submarine_%%', 'anything'],
        subtitle: 'text',
        submarine: 'ship',
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['*zzz', '*le', '*ne'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text text', 'ship', 'anything'],
      subtitle: 'text',
      submarine: 'ship',
    },
    '05.04.03 - two ignores in an array startsWith',
  )
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_submarine_%%', 'anything'],
        subtitle: 'text',
        submarine: 'ship',
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['*zzz', '*le', '*yyy'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text text', '{ship}', 'anything'],
      subtitle: 'text',
      submarine: 'ship',
    },
    '05.04.04 - two ignores in an array, endsWith',
  )
})

test('05.05 - arrays, whitelisting as array #2', (t) => {
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_submarine_%%', 'anything'],
        title_data: {
          subtitle: 'text',
          submarine: 'ship',
        },
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['*zzz', '*le', '*yyy'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text text', '{ship}', 'anything'],
      title_data: {
        subtitle: 'text',
        submarine: 'ship',
      },
    },
    '05.05.01 - two ignores in an array, data store',
  )
  t.deepEqual(
    jv(
      {
        a: {
          title: '%%_whatnot_%%',
          title_data: {
            subtitle: 'SUB',
          },
          whatnot: '%%_submarine_%%',
          whatnot_data: {
            submarine: 'ship',
          },
        },
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['*zzz', '*le', '*yyy'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      a: {
        title: '{ship}',
        title_data: {
          subtitle: 'SUB',
        },
        whatnot: '{ship}',
        whatnot_data: {
          submarine: 'ship',
        },
      },
    },
    '05.05.02 - does not wrap SUB',
  )
  t.deepEqual(
    jv(
      {
        a: {
          title: ['something', 'Some text %%_subtitle_%%', '%%_whatnot_%%', 'anything'],
          title_data: {
            subtitle: 'SUB',
          },
          whatnot: '%%_submarine_%%',
          whatnot_data: {
            submarine: 'ship',
          },
        },
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['*zzz', '*le', '*yyy'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      a: {
        title: ['something', 'Some text SUB', '{ship}', 'anything'],
        title_data: {
          subtitle: 'SUB',
        },
        whatnot: '{ship}',
        whatnot_data: {
          submarine: 'ship',
        },
      },
    },
    '05.05.02 - does not wrap SUB',
  )
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_whatnot_%%', 'anything'],
        title_data: {
          subtitle: 'SUB',
        },
        whatnot: '%%_submarine_%%',
        whatnot_data: {
          submarine: 'ship',
        },
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['*zzz', '*yyy'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text {SUB}', '{ship}', 'anything'],
      title_data: {
        subtitle: 'SUB',
      },
      whatnot: '{ship}',
      whatnot_data: {
        submarine: 'ship',
      },
    },
    '05.05.03 - wraps SUB',
  )

  const err1 = t.throws(() => {
    jv(
      {
        title: ['something', 'Some text %%_subtitle_%%', '%%_whatnot_%%', 'anything'],
        title_data: {
          subtitle: 'SUB',
        },
        whatnot: '%%_submarine_%%',
        whatnot_data: {
          zzz: 'yyy',
        },
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['*zzz', '*yyy'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_18]'))
})

// -----------------------------------------------------------------------------
// 06. opts.noSingleMarkers
// -----------------------------------------------------------------------------

test('06.01 - UTIL > single markers in the values', (t) => {
  t.notThrows(() => {
    jv({
      a: 'z',
      b: '%%_',
    })
  })
  t.notThrows(() => {
    jv(
      {
        a: 'z',
        b: '%%_',
      },
      {
        noSingleMarkers: false,
      },
    )
  })

  const err1 = t.throws(() => {
    jv(
      {
        a: 'z',
        b: '%%_',
      },
      {
        noSingleMarkers: true,
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_16]'))

  t.notThrows(() => {
    jv({
      a: 'z',
      b: '%%-',
    })
  })
  t.notThrows(() => {
    jv(
      {
        a: 'z',
        b: '%%-',
      },
      {
        noSingleMarkers: false,
      },
    )
  })

  const err2 = t.throws(() => {
    jv(
      {
        a: 'z',
        b: '%%-',
      },
      {
        noSingleMarkers: true,
      },
    )
  })
  t.truthy(err2.message.includes('[THROW_ID_16]'))
})

// -----------------------------------------------------------------------------
// 07. opts.headsNoWrap & opts.tailsNoWrap
// -----------------------------------------------------------------------------

test('07.01 - opts.headsNoWrap & opts.tailsNoWrap work on single level vars', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'some text %%-var1-%% more text %%_var2_%%',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
      },
    ),
    {
      a: 'some text value1 more text {{ value2 }}',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '07.01.01 - defaults',
  )
  t.deepEqual(
    jv(
      {
        a: 'some text (( var1 )) more text %%_var2_%%',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
        headsNoWrap: '(( ',
        tailsNoWrap: ' ))',
      },
    ),
    {
      a: 'some text value1 more text {{ value2 }}',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '07.01.02 - custom opts.headsNoWrap & opts.tailsNoWrap',
  )
  t.deepEqual(
    jv(
      {
        a: 'some text (( var1 )) more text %%_var2_%%',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
        headsNoWrap: '(( ',
        tailsNoWrap: ' ))',
      },
    ),
    {
      a: 'some text value1 more text {{ value2 }}',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '07.01.03 - left side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap',
  )
  t.deepEqual(
    jv(
      {
        a: 'some text (( var1 )) more text %%_var2_%%',
        b: 'something',
        var1: 'value1',
        var2: 'value2',
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
        headsNoWrap: '(( ',
        tailsNoWrap: ' ))',
      },
    ),
    {
      a: 'some text value1 more text {{ value2 }}',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '07.01.04 - right side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap',
  )
})

test('07.02 - opts.headsNoWrap & opts.tailsNoWrap work on multi-level vars', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'text %%-b-%% more text %%_c_%% and more %%-b-%% text %%_b_%% more text %%-c-%%',
        b: '%%_c_%%',
        c: 'z',
      },
      {
        wrapHeadsWith: '??',
        wrapTailsWith: '!!',
      },
    ),
    {
      a: 'text z more text ??z!! and more z text ??z!! more text z',
      b: '??z!!',
      c: 'z',
    },
    '07.02.01 - two level redirects, default opts.headsNoWrap & opts.tailsNoWrap, matching var key lengths',
  )
  t.deepEqual(
    jv(
      {
        a: 'text %%-bbb-%% more text %%_c_%% and more %%-bbb-%% text',
        bbb: '%%_c_%%',
        c: 'z',
      },
      {
        wrapHeadsWith: '??',
        wrapTailsWith: '!!',
      },
    ),
    {
      a: 'text z more text ??z!! and more z text',
      bbb: '??z!!',
      c: 'z',
    },
    '07.02.02 - two level redirects, default opts.headsNoWrap & opts.tailsNoWrap, mismatching var key lengths',
  )
  t.deepEqual(
    jv(
      {
        a: 'text -yyy-bbb-zzz- more text -www-c-xxx- and more -yyy-bbb-zzz- text',
        bbb: '-www-c-xxx-',
        c: 'z',
      },
      {
        heads: '-www-',
        tails: '-xxx-',
        headsNoWrap: '-yyy-',
        tailsNoWrap: '-zzz-',
        wrapHeadsWith: '??',
        wrapTailsWith: '!!',
      },
    ),
    {
      a: 'text z more text ??z!! and more z text',
      bbb: '??z!!',
      c: 'z',
    },
    '07.02.03 - two level redirects, custom everything',
  )
})

test('07.03 - triple linking with resolving arrays and trailing new lines', (t) => {
  t.deepEqual(
    jv(
      {
        aaa: '%%-bbb-%%',
        bbb: 'ccc\n',
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
      },
    ),
    {
      aaa: 'ccc\n',
      bbb: 'ccc\n',
    },
    '07.03.01 - basic, checking are trailing line breaks retained',
  )

  t.deepEqual(
    jv(
      {
        aaa: '%%-bbb-%%',
        bbb: [
          '%%-kkk-%%',
          '%%-lll-%%',
        ],
        bbb_data: {
          kkk: 'zzz\n',
          lll: 'yyy\n',
        },
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
      },
    ),
    {
      aaa: 'zzz\nyyy\n',
      bbb: [
        'zzz\n',
        'yyy\n',
      ],
      bbb_data: {
        kkk: 'zzz\n',
        lll: 'yyy\n',
      },
    },
    '07.03.02 - line breaks on the values coming into array',
  )

  t.deepEqual(
    jv(
      {
        aaa: '%%-bbb-%%',
        bbb: [
          '%%-kkk-%%\n',
          '%%-lll-%%\n',
        ],
        bbb_data: {
          kkk: 'zzz',
          lll: 'yyy',
        },
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
      },
    ),
    {
      aaa: 'zzz\nyyy\n',
      bbb: [
        'zzz\n',
        'yyy\n',
      ],
      bbb_data: {
        kkk: 'zzz',
        lll: 'yyy',
      },
    },
    '07.03.03 - line breaks at array-level',
  )

  t.deepEqual(
    jv(
      {
        aaa: '%%_bbb_%%', // <----- regular heads/tails
        bbb: [
          '%%_kkk_%%',
          '%%_lll_%%',
        ],
        bbb_data: {
          kkk: 'zzz',
          lll: 'yyy',
        },
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
      },
    ),
    {
      aaa: '{{ zzz }}{{ yyy }}',
      bbb: [
        '{{ zzz }}',
        '{{ yyy }}',
      ],
      bbb_data: {
        kkk: 'zzz',
        lll: 'yyy',
      },
    },
    '07.03.04 - like #02 but with wrapping',
  )

  t.deepEqual(
    jv(
      {
        aaa: '%%-bbb-%%', // <-----  notice no-wrap heads/tails
        bbb: [
          '%%_kkk_%%',
          '%%_lll_%%',
        ],
        bbb_data: {
          kkk: 'zzz',
          lll: 'yyy',
        },
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
      },
    ),
    {
      aaa: '{{ zzz }}{{ yyy }}',
      bbb: [
        '{{ zzz }}',
        '{{ yyy }}',
      ],
      bbb_data: {
        kkk: 'zzz',
        lll: 'yyy',
      },
    },
    '07.03.05',
  )

  t.deepEqual(
    jv(
      {
        aaa: '%%-bbb-%%',
        bbb: [
          '%%-kkk-%%',
          '%%-lll-%%',
        ],
        bbb_data: {
          kkk: '{%- if %%-zzz-%% -%}%%_zzz_%%<br />{%- endif -%}\n',
          zzz: 'zzz_val',
          lll: '{%- if %%-yyy-%% -%}%%_yyy_%%<br />{%- endif -%}\n',
          yyy: 'yyy_val',
        },
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
      },
    ),
    {
      aaa: '{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n',
      bbb: [
        '{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n',
        '{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n',
      ],
      bbb_data: {
        kkk: '{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n',
        zzz: 'zzz_val',
        lll: '{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n',
        yyy: 'yyy_val',
      },
    },
    '07.03.06 - simple version',
  )

  t.deepEqual(
    jv(
      {
        shop_info_text: '%%-shop_info_global-%%',
        shop_info_global: [
          '%%-row0_line-%%',
          '%%_row1_line_%%',
          '%%_row2_line_%%',
          '%%_row3_line_%%',
          '%%_row4_line_%%',
          '%%_row5_line_%%',
          '%%_row6_line_%%',
          '%%_row7_line_%%',
          '%%_row8_line_%%',
        ],
        shop_info_global_data: {
          row0_line: '{%- if %%-row0_var-%% -%}%%_row0_var_%%<br />{%- endif -%}\n',
          row0_var: 'order.shopInfo.name',
          row1_line: '{%- if %%-row1_var-%% -%}%%_row1_var_%%<br />{%- endif -%}\n',
          row1_var: 'order.shopInfo.addressLine1',
          row2_line: '{%- if %%-row2_var-%% -%}%%_row2_var_%%<br />{%- endif -%}\n',
          row2_var: 'order.shopInfo.addressLine2',
          row3_line: '{%- if %%-row3_var-%% -%}%%_row3_var_%%<br />{%- endif -%}\n',
          row3_var: 'order.shopInfo.addressLine3',
          row4_line: '{%- if %%-row4_var-%% -%}%%_row4_var_%%<br />{%- endif -%}\n',
          row4_var: 'order.shopInfo.addressLine4',
          row5_line: '{%- if %%-row5_var-%% -%}%%_row5_var_%%<br />{%- endif -%}\n',
          row5_var: 'order.shopInfo.addressLine5',
          row6_line: '{%- if %%-row6_var-%% -%}%%_row6_var_%%<br />{%- endif -%}\n',
          row6_var: 'order.shopInfo.addressLine6',
          row7_line: '{%- if %%-row7_var-%% -%}%%_row7_var_%%<br />{%- endif -%}\n',
          row7_var: 'order.shopInfo.city',
          row8_line: '{%- if %%-row8_var-%% -%}%%_row8_var_%%{%- endif -%}',
          row8_var: 'order.shopInfo.zipCode',
        },
      },
      {
        wrapHeadsWith: '{{ ',
        wrapTailsWith: ' }}',
      },
    ),
    {
      shop_info_text: '{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}',
      shop_info_global: [
        '{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n',
        '{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n',
        '{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n',
        '{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n',
        '{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n',
        '{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n',
        '{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n',
        '{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n',
        '{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}',
      ],
      shop_info_global_data: {
        row0_line: '{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n',
        row0_var: 'order.shopInfo.name',
        row1_line: '{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n',
        row1_var: 'order.shopInfo.addressLine1',
        row2_line: '{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n',
        row2_var: 'order.shopInfo.addressLine2',
        row3_line: '{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n',
        row3_var: 'order.shopInfo.addressLine3',
        row4_line: '{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n',
        row4_var: 'order.shopInfo.addressLine4',
        row5_line: '{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n',
        row5_var: 'order.shopInfo.addressLine5',
        row6_line: '{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n',
        row6_var: 'order.shopInfo.addressLine6',
        row7_line: '{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n',
        row7_var: 'order.shopInfo.city',
        row8_line: '{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}',
        row8_var: 'order.shopInfo.zipCode',
      },
    },
    '07.03.07 - real-life version',
  )
})

// -----------------------------------------------------------------------------
// 08. non-string values - still valid JSON
// -----------------------------------------------------------------------------

test('08.01 - Boolean values inserted into a middle of a string', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%% %%_c_%% %%_d_%% %%_e_%%',
      b: 'stringB',
      c: true,
      d: 'stringD',
      e: false,
    }),
    {
      a: false, // <------ first Boolean value is put here. "b" was string, so "c = true" goes here.
      b: 'stringB',
      c: true,
      d: 'stringD',
      e: false,
    },
    '08.01.01 - mix of Bools and strings resolve to the value of the first encountered Bool',
  )
  t.deepEqual(
    jv(
      {
        a: '%%_b_%% %%_c_%% %%_d_%% %%_e_%%',
        b: 'stringB',
        c: true,
        d: 'stringD',
        e: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
      },
    ),
    {
      a: 'stringB  stringD ',
      b: 'stringB',
      c: true,
      d: 'stringD',
      e: false,
    },
    '08.01.02',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%% %%_c_%% %%_d_%% %%_e_%%',
      b: 'stringB',
      c: true,
      d: 'stringD',
      e: false,
    }, { resolveToFalseIfAnyValuesContainBool: false }),
    {
      a: true, // <------ first Boolean value is put here. "b" was string, so "c = true" goes here.
      b: 'stringB',
      c: true,
      d: 'stringD',
      e: false,
    },
    '08.01.03',
  )
  t.deepEqual(
    jv(
      {
        a: '%%_b_%% %%_c_%% %%_d_%% %%_e_%%',
        b: 'stringB',
        c: true,
        d: 'stringD',
        e: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
        resolveToFalseIfAnyValuesContainBool: false,
      },
    ),
    {
      a: 'stringB  stringD ',
      b: 'stringB',
      c: true,
      d: 'stringD',
      e: false,
    },
    '08.01.04',
  )
})

test('08.02 - Boolean values inserted instead of other values, in whole', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: true,
    }),
    {
      a: false,
      b: true,
    },
    '08.02.01',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: true,
    }, { resolveToFalseIfAnyValuesContainBool: true }),
    {
      a: false,
      b: true,
    },
    '08.02.02',
  )
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: true,
    }, { resolveToFalseIfAnyValuesContainBool: false }),
    {
      a: true,
      b: true,
    },
    '08.02.03',
  )
})

test('08.03 - null values inserted into a middle of a string', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%% %%_c_%% %%_d_%% %%_e_%%',
      b: 'stringB',
      c: null,
      d: 'stringD',
      e: null,
    }),
    {
      a: 'stringB  stringD ',
      b: 'stringB',
      c: null,
      d: 'stringD',
      e: null,
    },
    '08.03',
  )
})

test('08.04 - null values inserted instead of other values, in whole', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    '08.04.01',
  )
  t.deepEqual(
    jv({
      a: '  %%_b_%%  ', // <---- will "whole value is var" detection cope with whitespaces?
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    '08.04.02 - spaces around a value which would resolve to null',
  )
  t.deepEqual(
    jv({
      a: '%%-b-%%',
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    '08.04.03 - using non-wrapping heads/tails',
  )
  t.deepEqual(
    jv({
      a: '  %%-b-%%  ',
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    '08.04.04 - like #3 but with extra whitespace',
  )
  t.deepEqual(
    jv(
      {
        a: '%%_b_%%',
        b: null,
      },
      {
        wrapHeadsWith: '{{',
        wrapTailsWith: '}}',
      },
    ),
    {
      a: null,
      b: null,
    },
    '08.04.05 - doesn\'t wrap null',
  )
  t.deepEqual(
    jv(
      {
        a: '%%-b-%%', // <---- it was no-wrap markers anyway
        b: null,
      },
      {
        wrapHeadsWith: '{{',
        wrapTailsWith: '}}',
      },
    ),
    {
      a: null,
      b: null,
    },
    '08.04.06 - doesn\'t wrap null',
  )
})

// -----------------------------------------------------------------------------
// 09. opts.resolveToBoolIfAnyValuesContainBool
// -----------------------------------------------------------------------------

test('09.01 - opts.resolveToBoolIfAnyValuesContainBool, Bools and Strings mix', (t) => {
  // False

  t.deepEqual(
    jv({
      a: 'zzz %%_b_%% zzz',
      b: false,
    }),
    {
      a: false,
      b: false,
    },
    '09.01.01 - false - default (opts on)',
  )
  t.deepEqual(
    jv(
      {
        a: 'zzz %%_b_%% zzz',
        b: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: true,
      },
    ),
    {
      a: false,
      b: false,
    },
    '09.01.02 - false - hardcoded (opts on)',
  )
  t.deepEqual(
    jv(
      {
        a: 'zzz %%_b_%% zzz',
        b: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
      },
    ),
    {
      a: 'zzz  zzz',
      b: false,
    },
    '09.01.03 - false - opts off',
  )

  // True

  t.deepEqual(
    jv(
      {
        a: 'zzz %%_b_%% zzz %%_c_%%',
        b: true,
        c: false,
      },
      {
        resolveToFalseIfAnyValuesContainBool: false,
      },
    ),
    {
      a: true, // because first encountered value to be resolved was Boolean True
      b: true,
      c: false,
    },
    '09.01.04 - relying on default, opts.resolveToFalseIfAnyValuesContainBool does not matter',
  )
  t.deepEqual(
    jv(
      {
        a: 'zzz %%_b_%% zzz %%_c_%%',
        b: true,
        c: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: true,
        resolveToFalseIfAnyValuesContainBool: false,
      },
    ),
    {
      a: true,
      b: true,
      c: false,
    },
    '09.01.05 - Bools hardcoded default, not forcing false',
  )
  t.deepEqual(
    jv(
      {
        a: 'zzz %%_b_%% zzz %%_c_%%',
        b: true,
        c: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: true,
        resolveToFalseIfAnyValuesContainBool: true,
      },
    ),
    {
      a: false,
      b: true,
      c: false,
    },
    '09.01.06 - Bools hardcoded default, forcing false',
  )
})

// -----------------------------------------------------------------------------
// 10. variable resolving on a deeper levels, other than root
// -----------------------------------------------------------------------------

test('10.01 - variables resolve being in deeper levels', (t) => {
  t.deepEqual(
    jv({
      a: [
        {
          b: 'zzz %%_c_%% yyy',
          c: 'd1',
        },
      ],
      c: 'd2',
    }),
    {
      a: [
        {
          b: 'zzz d1 yyy',
          c: 'd1',
        },
      ],
      c: 'd2',
    },
    '10.01 - defaults',
  )
})

test('10.02 - deeper level variables not found, bubble up and are found', (t) => {
  t.deepEqual(
    jv({
      a: [
        {
          b: 'zzz %%_c_%% yyy',
          z: 'd1',
        },
      ],
      c: 'd2',
    }),
    {
      a: [
        {
          b: 'zzz d2 yyy',
          z: 'd1',
        },
      ],
      c: 'd2',
    },
    '10.02 - defaults',
  )
})

test('10.03 - third level resolves at its level', (t) => {
  t.deepEqual(
    jv({
      a: [
        {
          b: [
            {
              c: 'zzz %%_d_%% yyy',
              d: 'e1',
            },
          ],
        },
      ],
      d: 'e2',
    }),
    {
      a: [
        {
          b: [
            {
              c: 'zzz e1 yyy',
              d: 'e1',
            },
          ],
        },
      ],
      d: 'e2',
    },
    '10.03 - defaults',
  )
})

test('10.04 - third level falls back to root', (t) => {
  t.deepEqual(
    jv({
      a: [
        {
          b: [
            {
              c: 'zzz %%_d_%% yyy',
              z: 'e1',
            },
          ],
        },
      ],
      d: 'e2',
    }),
    {
      a: [
        {
          b: [
            {
              c: 'zzz e2 yyy',
              z: 'e1',
            },
          ],
        },
      ],
      d: 'e2',
    },
    '10.04 - defaults',
  )
})

test('10.05 - third level uses data container key', (t) => {
  t.deepEqual(
    jv({
      a: [
        {
          b: [
            {
              c: 'zzz %%_d_%% yyy',
              c_data: {
                x: 'x1',
                y: 'y1',
                d: 'e1',
              },
            },
          ],
        },
      ],
      d: 'e2',
    }),
    {
      a: [
        {
          b: [
            {
              c: 'zzz e1 yyy',
              c_data: {
                x: 'x1',
                y: 'y1',
                d: 'e1',
              },
            },
          ],
        },
      ],
      d: 'e2',
    },
    '10.05 - defaults',
  )
})

test('10.06 - third level uses data container key, but there\'s nothing there so falls back to root (successfully)', (t) => {
  t.deepEqual(
    jv({
      a: [
        {
          b: [
            {
              c: 'zzz %%_d_%% yyy',
              c_data: {
                x: 'x1',
                y: 'y1',
              },
            },
          ],
        },
      ],
      d: 'e2',
    }),
    {
      a: [
        {
          b: [
            {
              c: 'zzz e2 yyy',
              c_data: {
                x: 'x1',
                y: 'y1',
              },
            },
          ],
        },
      ],
      d: 'e2',
    },
    '10.06 - defaults',
  )
})

test('10.07 - third level uses data container key, but there\'s nothing there so falls back to root data container (successfully)', (t) => {
  t.deepEqual(
    jv({
      a: [
        {
          b: [
            {
              c: 'zzz %%_d_%% yyy',
              c_data: {
                x: 'x1',
                y: 'y1',
              },
            },
          ],
        },
      ],
      a_data: {
        d: 'e2',
      },
    }),
    {
      a: [
        {
          b: [
            {
              c: 'zzz e2 yyy',
              c_data: {
                x: 'x1',
                y: 'y1',
              },
            },
          ],
        },
      ],
      a_data: {
        d: 'e2',
      },
    },
    '10.07 - defaults - root has normal container, a_data, named by topmost parent key',
  )
  t.deepEqual(
    jv({
      a: [
        {
          b: [
            {
              c: 'zzz %%_d_%% yyy',
              c_data: {
                x: 'x1',
                y: 'y1',
              },
            },
          ],
        },
      ],
      c_data: {
        d: 'e2',
      },
    }),
    {
      a: [
        {
          b: [
            {
              c: 'zzz e2 yyy',
              c_data: {
                x: 'x1',
                y: 'y1',
              },
            },
          ],
        },
      ],
      c_data: {
        d: 'e2',
      },
    },
    '10.07.02 - root has container, named how deepest data contaienr should be named',
  )
})

// -----------------------------------------------------------------------------
// 11. two-level querying
// -----------------------------------------------------------------------------

test('11.01 - two-level querying, normal keys in the root', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1.key3_%% more text %%_var2.key6_%%',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    }),
    {
      a: 'some text value3 more text value6',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    },
    '11.01.01 - running on default notation',
  )
})

test('11.02 - two-level querying, normal keys in the root + wrapping & opts', (t) => {
  t.deepEqual(
    jv({
      a: 'some text %%_var1.key3_%% more text %%_var2.key6_%%',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    }, {
      lookForDataContainers: true,
      dataContainerIdentifierTails: '_data',
      wrapHeadsWith: '{',
      wrapTailsWith: '}',
      dontWrapVars: ['*zzz', 'var1.*', '*key6'],
      preventDoubleWrapping: true,
      wrapGlobalFlipSwitch: true,
    }),
    {
      a: 'some text value3 more text value6',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    },
    '11.02.01 - didn\'t wrap either, first level caught',
  )

  t.deepEqual(
    jv({
      a: 'some text %%_var1.key3_%% more text %%_var2.key6_%%',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    }, {
      lookForDataContainers: true,
      dataContainerIdentifierTails: '_data',
      wrapHeadsWith: '{',
      wrapTailsWith: '}',
      dontWrapVars: ['*zzz', '*3', '*9'],
      preventDoubleWrapping: true,
      wrapGlobalFlipSwitch: true,
    }),
    {
      a: 'some text value3 more text {value6}',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    },
    '11.02.02 - didn\'t wrap one, second level caught',
  )

  t.deepEqual(
    jv({
      a: 'some text %%_var1.key3_%% more text %%_var2.key6_%%',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    }, {
      lookForDataContainers: true,
      dataContainerIdentifierTails: '_data',
      dontWrapVars: ['*zzz', 'key3', 'key6'],
      preventDoubleWrapping: true,
      wrapGlobalFlipSwitch: true,
    }),
    {
      a: 'some text value3 more text value6',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    },
    '11.02.03 - didn\'t wrap either, second levels caught',
  )

  t.deepEqual(
    jv({
      a: 'some text %%-var1.key3-%% more text %%-var2.key6-%%',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    }, {
      lookForDataContainers: true,
      dataContainerIdentifierTails: '_data',
      wrapHeadsWith: 'whatever,',
      wrapTailsWith: 'it won\'t be used anyway',
      dontWrapVars: ['*zzz', '*3', '*9'],
      preventDoubleWrapping: true,
      wrapGlobalFlipSwitch: true,
    }),
    {
      a: 'some text value3 more text value6',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    },
    '11.02.04 - didn\'t wrap either because of %%- the non-wrapping notation.',
  )

  t.deepEqual(
    jv({
      a: 'some text %%-var1.key3-%% more text %%-var2.key6-%%',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    }, {
      lookForDataContainers: true,
      dataContainerIdentifierTails: '_data',
      wrapHeadsWith: 'whatever,',
      wrapTailsWith: 'it won\'t be used anyway',
      dontWrapVars: [],
      preventDoubleWrapping: true,
      wrapGlobalFlipSwitch: true,
    }),
    {
      a: 'some text value3 more text value6',
      b: 'something',
      var1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      var2: {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    },
    '11.02.05',
  )
})

test('11.03 - opts.throwWhenNonStringInsertedInString', (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text %%_var2_%%',
        b: 'something',
        var1: { key1: 'value1', key2: 'value2' },
        var2: { key3: 'value3', key4: 'value4' },
      },
      {
        throwWhenNonStringInsertedInString: true,
      },
    )
  })
  t.truthy(err1.message.includes('[THROW_ID_23]'))

  t.notThrows(() => {
    jv({
      a: 'some text %%_var1_%% more text %%_var2_%%',
      b: 'something',
      var1: { key1: 'value1', key2: 'value2' },
      var2: { key3: 'value3', key4: 'value4' },
    })
  })

  // then, also, pin the whole-value-variables

  t.deepEqual(
    jv({
      a: '%%-var1-%%',
      var1: null,
      b: '%%-var2-%%',
      var2: false,
    }),
    {
      a: null,
      var1: null,
      b: false,
      var2: false,
    },
    '11.03.03 - no path, values are variables in whole',
  )

  t.deepEqual(
    jv({
      a: '%%_var1.key1_%%',
      var1: { key1: null },
      b: '%%_var2.key2_%%',
      var2: { key2: false },
    }),
    {
      a: null,
      var1: { key1: null },
      b: false,
      var2: { key2: false },
    },
    '11.03.04 - control',
  )

  t.deepEqual(
    jv({
      a: '%%_var1.key1_%%',
      var1: { key1: null },
      b: '%%_var2.key2_%%',
      var2: { key2: false },
    }, { throwWhenNonStringInsertedInString: true }),
    {
      a: null,
      var1: { key1: null },
      b: false,
      var2: { key2: false },
    },
    '11.03.05 - opts',
  )
})

test('11.04 - multi-level + from array + root data store + ignores', (t) => {
  t.deepEqual(
    jv(
      {
        title: ['something', 'Some text %%_subtitle.aaa_%%', '%%_submarine.bbb_%%', 'anything'],
        title_data: {
          subtitle: { aaa: 'text' },
          submarine: { bbb: 'ship' },
        },
      },
      {
        heads: '%%_',
        tails: '_%%',
        lookForDataContainers: true,
        dataContainerIdentifierTails: '_data',
        wrapHeadsWith: '{',
        wrapTailsWith: '}',
        dontWrapVars: ['*zzz', '*.aaa', '*yyy'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text text', '{ship}', 'anything'],
      title_data: {
        subtitle: { aaa: 'text' },
        submarine: { bbb: 'ship' },
      },
    },
    '11.04 - two ignores in an array, data store, multi-level',
  )
})

// -----------------------------------------------------------------------------
// 12. Potentially clashing combos of characters
// -----------------------------------------------------------------------------

test('12.01 - surrounding underscores - sneaky similarity with wrong side brackets #1', (t) => {
  t.deepEqual(
    jv({
      a: 'joined with an underscores: %%_var1_%%_%%_var2_%%',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'joined with an underscores: value1_value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '12.01',
  )
})

test('12.02 - surrounding underscores - sneaky similarity with wrong side brackets #2', (t) => {
  t.deepEqual(
    jv({
      a: 'joined with an dashes: %%-var1-%%-%%-var2-%%',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'joined with an dashes: value1-value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '12.02',
  )
})

test('12.03 - surrounding underscores - sneaky similarity with wrong side brackets #3', (t) => {
  t.deepEqual(
    jv({
      a: 'zzz_%%-var1-%%_%%-var2-%%_yyy',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'zzz_value1_value2_yyy',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '12.03',
  )
})

test('12.04 - surrounding underscores - sneaky similarity with wrong side brackets #4', (t) => {
  t.deepEqual(
    jv({
      a: 'zzz_%%-var1-%%_%%-var2-%%',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'zzz_value1_value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '12.04',
  )
})

test('12.05 - surrounding dashes - sneaky similarity with wrong side brackets #1', (t) => {
  t.deepEqual(
    jv({
      a: 'zzz-%%_var1_%%-%%_var2_%%-yyy',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'zzz-value1-value2-yyy',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '12.05',
  )
})

test('12.06 - surrounding dashes - sneaky similarity with wrong side brackets #2', (t) => {
  t.deepEqual(
    jv({
      a: 'zzz-%%_var1_%%-%%_var2_%%',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    }),
    {
      a: 'zzz-value1-value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    },
    '12.06',
  )
})
