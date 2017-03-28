'use strict'
/* eslint no-template-curly-in-string: 0 */
/* eslint padded-blocks: 0 */

import jv from './index'
import test from 'ava'
import { aContainsB, extractVarsFromString, findLastInArray } from './util'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - throws when there\'s no input', t => {
  t.throws(function () {
    jv()
  })
})

test('01.02 - throws when options heads and/or tails are empty', t => {
  t.throws(function () {
    jv({
      a: 'a'
    }, {heads: ''})
  })
  t.throws(function () {
    jv({
      a: 'a'
    }, {tails: ''})
  })
  t.throws(function () {
    jv({
      a: 'a'
    }, {heads: '', tails: ''})
  })
})

test('01.03 - throws when data container key lookup is enabled and container tails are given blank', t => {
  t.throws(function () {
    jv({
      a: 'a'
    }, {lookForDataContainers: true, dataContainerIdentifierTails: ''})
  })
  t.notThrows(function () {
    jv({
      a: 'a'
    }, {lookForDataContainers: false, dataContainerIdentifierTails: ''})
  })
  t.throws(function () {
    jv({
      a: 'a'
    }, {dataContainerIdentifierTails: ''})
  })
})

test('01.04 - throws when heads and tails are equal', t => {
  t.throws(function () {
    jv({
      a: 'a'
    }, {heads: '%%', tails: '%%'})
  })
})

test('01.05 - throws when input is not a plain object', t => {
  t.throws(function () {
    jv(['zzz'], {heads: '%%', tails: '%%'})
  })
})

test('01.06 - throws when keys contain variables', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      '%%_var2_%%': 'something',
      var1: 'value1',
      var2: 'value2'
    })
  })
  t.throws(function () {
    jv({
      a: 'some text zzvar1zz more text',
      'zzvar2zz': 'something',
      var1: 'value1',
      var2: 'value2'
    }, {heads: 'zz', tails: 'zz'})
  })
})

test('01.07 - throws when there are unequal number of marker heads and tails', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more %%_text',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    })
  })
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text_%%',
      b: '%%_something',
      var1: 'value1',
      var2: 'value2'
    })
  })
})

test('01.08 - throws when data is missing', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    })
  })
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
      a_data: 'zzz'
    })
  })
})

test('01.09 - throws when data container lookup is turned off and var is missing', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {lookForDataContainers: false})
  })
})

test('01.10 - throws when data container name append is not string', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {lookForDataContainers: true, dataContainerIdentifierTails: false})
  })
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {lookForDataContainers: true, dataContainerIdentifierTails: 1})
  })
})

test('01.11 - not throws when data container name append is given empty, but data container lookup is turned off', function (t) {
  t.notThrows(function () {
    jv({
      a: 'some text, more text',
      b: 'something'
    }, {lookForDataContainers: false, dataContainerIdentifierTails: ''})
  })
})

test('01.12 - throws when data container name append is given empty', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {lookForDataContainers: true, dataContainerIdentifierTails: ''})
  })
  t.throws(function () {
    jv({
      a: 'some text, more text',
      b: 'something'
    }, {lookForDataContainers: true, dataContainerIdentifierTails: ''})
  })
})

test('01.13 - throws when opts.wrapHeads is customised to anything other than string', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {wrapHeads: false})
  })
})

test('01.14 - throws when opts.wrapHeads is customised to empty string', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {wrapHeads: ''})
  })
})

test('01.15 - throws when opts.wrapTails is customised to anything other than string', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {wrapTails: false})
  })
})

test('01.16 - throws when opts.wrapTails is customised to empty string', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {wrapTails: ''})
  })
})

test('01.17 - throws when opts.heads is not string', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {heads: 1})
  })
})

test('01.18 - throws when opts.tails is not string', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {tails: 1})
  })
})

test('01.19 - throws when all args are missing', function (t) {
  t.throws(function () {
    jv()
  })
})

test('01.20 - throws when key references itself', t => {
  t.throws(function () {
    jv({
      a: '%%_a_%%'
    })
  })
  t.throws(function () {
    jv({
      a: 'something %%_a_%% aaaa %%_a_%%'
    })
  })
})

test('01.21 - throws when key references itself', t => {
  t.throws(function () {
    jv({
      a: 'a',
      b: '%%_a_%%',
      c: '%%_c_%%'
    })
  })
})

test('01.22 - throws when key references key which references itself', t => {
  t.throws(function () {
    jv({
      b: '%%_a_%%',
      a: '%%_a_%%'
    })
  })
})

test('01.23 - throws when there\'s recursion (with distraction)', t => {
  t.throws(function () {
    jv({
      a: '%%_c_%% %%_b_%%',
      b: '%%_a_%%',
      c: 'ccc'
    })
  })
})

test('01.24 - throws when there\'s a longer recursion', t => {
  t.throws(function () {
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: '%%_d_%%',
      d: '%%_e_%%',
      e: '%%_b_%%'
    })
  })
})

test('01.25 - throws when opts.lookForDataContainers is not boolean', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {lookForDataContainers: 1})
  })
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {lookForDataContainers: 'false'})
  })
})

test('01.26 - throws when opts.preventDoubleWrapping is not boolean', function (t) {
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {preventDoubleWrapping: 1})
  })
  t.throws(function () {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something'
    }, {preventDoubleWrapping: 'false'})
  })
})

test('01.27 - throws when values given for variable resolution are not strings or arrays', t => {
  t.throws(function () {
    jv({
      a: '%%_c_%%',
      b: '%%_a_%%',
      c: {
        d: 'd'
      }
    })
  })
})

// -----------------------------------------------------------------------------
// 02. BAU
// -----------------------------------------------------------------------------

test('02.01 - fills in variables found among other keys', function (t) {
  t.deepEqual(jv(
    {
      a: 'some text %%_var1_%% more text %%_var2_%%',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    }),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    },
    '02.01.01'
  )
  t.deepEqual(jv(
    {
      a: 'some text %%_var1_%% more text %%_var2_%%',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    }, { wrapHeads: '${', wrapTails: '}' }),
    {
      a: 'some text ${value1} more text ${value2}',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    },
    '02.01.02'
  )
  t.deepEqual(jv(
    {
      a: 'some text {var1} more text {var2}',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    },
    {
      heads: '{',
      tails: '}'
    }
  ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    },
  '02.01.03'
  )
  t.deepEqual(jv(
    {
      a: 'some text {  var1  } more text {  var2  }',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    },
    {
      heads: '{',
      tails: '}'
    }
  ),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: 'value1',
      var2: 'value2'
    },
  '02.01.04'
  )
})

test('02.02 - fills in all the variables found in a default data stash', function (t) {
  t.deepEqual(jv(
    {
      a: 'some text %%_var1_%% more text %%_var3_%%.',
      b: 'something',
      a_data: {
        var1: 'value1',
        var3: '333333'
      }
    }),
    {
      a: 'some text value1 more text 333333.',
      b: 'something',
      a_data: {
        var1: 'value1',
        var3: '333333'
      }
    },
    '02.02.01'
  )
  t.deepEqual(jv(
    {
      a: 'some text %%_var1_%% more text %%_var3_%%.',
      b: 'something',
      a_data: {
        var1: 'value1',
        var3: '333333'
      }
    }, { wrapHeads: '${', wrapTails: '}' }),
    {
      a: 'some text ${value1} more text ${333333}.',
      b: 'something',
      a_data: {
        var1: 'value1',
        var3: '333333'
      }
    },
    '02.02.02'
  )
})

test('02.03 - top-level key and data stash clash', function (t) {
  t.deepEqual(jv(
    {
      a: 'some text %%_var1_%% more text %%_var3_%%.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: 'value1',
        var3: '333333'
      }
    }),
    {
      a: 'some text value2 more text 333333.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: 'value1',
        var3: '333333'
      }
    },
    '02.03.01'
  )
  t.deepEqual(jv(
    {
      a: 'some text %%_var1_%% more text %%_var3_%%.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: 'value1',
        var3: '333333'
      }
    }, { wrapHeads: '${', wrapTails: '}' }),
    {
      a: 'some text ${value2} more text ${333333}.',
      b: 'something',
      var1: 'value2',
      a_data: {
        var1: 'value1',
        var3: '333333'
      }
    },
    '02.03.02'
  )
})

test('02.04 - emoji in values', function (t) {
  t.deepEqual(jv(
    {
      a: 'some🦄 text %%_var1_%% more text %%_var2_%%.',
      b: 'something',
      var1: 'value1',
      a_data: {
        var2: 'value2'
      }
    }),
    {
      a: 'some🦄 text value1 more text value2.',
      b: 'something',
      var1: 'value1',
      a_data: {
        var2: 'value2'
      }
    },
    '02.04'
  )
})

test('02.05 - emoji in keys', function (t) {
  t.deepEqual(jv(
    {
      a: 'some🦄 text %%_var🐴_%% more text %%_var2_%%.',
      b: 'something',
      'var🐴': 'value1',
      a_data: {
        var2: 'value2'
      }
    }),
    {
      a: 'some🦄 text value1 more text value2.',
      b: 'something',
      'var🐴': 'value1',
      a_data: {
        var2: 'value2'
      }
    },
    '02.05'
  )
})

test('02.06 - emoji in variable keys', function (t) {
  t.deepEqual(jv(
    {
      a: 'some🦄 text %%_var🐴_%% more text %%_var2_%%.',
      b: 'something',
      'var🐴': 'value1💘',
      a_data: {
        var2: 'value2💛'
      }
    }),
    {
      a: 'some🦄 text value1💘 more text value2💛.',
      b: 'something',
      'var🐴': 'value1💘',
      a_data: {
        var2: 'value2💛'
      }
    },
    '02.05'
  )
})

// -----------------------------------------------------------------------------
// group 03. sneaky-ones, like recursion
// -----------------------------------------------------------------------------

test('03.01 - two-level variables resolved', function (t) {
  t.deepEqual(jv(
    {
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val'
    }),
    {
      a: 'val',
      b: 'val',
      c: 'val'
    },
    '03.01'
  )
})

test('03.02 - two-level, order is backwards', function (t) {
  t.deepEqual(jv(
    {
      x: 'val',
      y: '%%_x_%%',
      z: '%%_y_%%'
    }),
    {
      x: 'val',
      y: 'val',
      z: 'val'
    },
    '03.02'
  )
})

test('03.03 - two-level variables resolved, mixed', function (t) {
  t.deepEqual(jv(
    {
      a: 'Some text %%_b_%% some more text %%_c_%%',
      b: 'Some text %%_c_%%, some more text %%_d_%%',
      c: 'val1',
      d: 'val2'
    }),
    {
      a: 'Some text Some text val1, some more text val2 some more text val1',
      b: 'Some text val1, some more text val2',
      c: 'val1',
      d: 'val2'
    },
    '03.03'
  )
})

test('03.04 - three-level variables resolved', function (t) {
  t.deepEqual(jv(
    {
      a: '%%_b_%% %%_d_%%',
      b: '%%_c_%% %%_d_%%',
      c: '%%_d_%%',
      d: 'val'
    }),
    {
      a: 'val val val',
      b: 'val val',
      c: 'val',
      d: 'val'
    },
    '03.04'
  )

})

test('03.05 - another three-level var resolving', function (t) {
  t.deepEqual(jv(
    {
      a: '%%_b_%% %%_c_%%',
      b: '%%_c_%% %%_d_%%',
      c: '%%_d_%%',
      d: 'val'
    }),
    {
      a: 'val val val',
      b: 'val val',
      c: 'val',
      d: 'val'
    },
    '03.05'
  )
})

test('03.06 - multiple variables resolved', function (t) {
  t.deepEqual(jv(
    {
      a: '%%_e_%% %%_d_%%',
      b: '%%_a_%%',
      c: 'c',
      d: '%%_c_%%',
      e: '%%_c_%%',
      f: '%%_b_%%'
    }),
    {
      a: 'c c',
      b: 'c c',
      c: 'c',
      d: 'c',
      e: 'c',
      f: 'c c'
    },
    '03.06'
  )
  t.throws(function () {
    jv(
      {
        a: '%%_e_%% %%_d_%%',
        b: '%%_a_%%',
        c: 'c',
        d: '%%_c_%%',
        e: '%%_b_%%',
        f: '%%_b_%%'
      }
    )
  })
  t.throws(function () {
    jv(
      {
        a: '%%_e_%% %%_d_%%',
        b: '%%_a_%%',
        c: 'c',
        d: '%%_f_%%',
        e: '%%_c_%%',
        f: '%%_b_%%'
      }
    )
  })
})

test('03.07 - preventDoubleWrapping: on & off', function (t) {
  t.deepEqual(jv(
    {
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val'
    }, { wrapHeads: '{', wrapTails: '}', preventDoubleWrapping: false }),
    {
      a: '{{val}}',
      b: '{val}',
      c: 'val'
    },
    '03.07.01'
  )
  t.deepEqual(jv(
    {
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val'
    }, { wrapHeads: '{', wrapTails: '}', preventDoubleWrapping: true }),
    {
      a: '{val}',
      b: '{val}',
      c: 'val'
    },
    '03.07.02'
  )
})

// -----------------------------------------------------------------------------
// 04. involving arrays
// -----------------------------------------------------------------------------

test('04.01 - arrays referencing values which are strings', function (t) {
  t.deepEqual(jv(
    {
      a: ['Some text %%_d_%% some more text %%_c_%%'],
      b: ['Some text %%_c_%%, some more text %%_d_%%'],
      c: 'cval',
      d: 'dval'
    }),
    {
      a: ['Some text dval some more text cval'],
      b: ['Some text cval, some more text dval'],
      c: 'cval',
      d: 'dval'
    },
    '04.01'
  )
})

test('04.02 - arrays referencing values which are arrays', function (t) {
  t.deepEqual(jv(
    {
      a: ['Some text %%_b_%% some more text %%_c_%%', '%%_c_%%', '%%_d_%%'],
      b: ['Some text %%_c_%%, some more text %%_d_%%', 'zzz'],
      c: ['c1', 'c2'],
      d: 'dval'
    }),
    {
      a: ['Some text Some text c1c2, some more text dvalzzz some more text c1c2', 'c1c2', 'dval'],
      b: ['Some text c1c2, some more text dval', 'zzz'],
      c: ['c1', 'c2'],
      d: 'dval'
    },
    '04.02'
  )
})

// -----------------------------------------------------------------------------
// 97. UTIL - findLastInArray()
// -----------------------------------------------------------------------------

test('97.01 - UTIL > findLastInArray - normal use', function (t) {
  t.deepEqual(findLastInArray(
      ['something', 'anything']
    ),
    null,
    '97.01'
  )
})

// -----------------------------------------------------------------------------
// 98. UTIL - aContainsB()
// -----------------------------------------------------------------------------

test('98.01 - UTIL > aContainsB - false', function (t) {
  t.deepEqual(aContainsB(),
    false,
    '98.01.01'
  )
  t.deepEqual(aContainsB('a'),
    false,
    '98.01.02'
  )
})

test('98.02 - UTIL > aContainsB - normal contains function', function (t) {
  t.deepEqual(aContainsB('a b c', 'c'),
    true,
    '98.02.01'
  )
  t.deepEqual(aContainsB('a b c', 'd'),
    false,
    '98.02.02'
  )
})

// -----------------------------------------------------------------------------
// 99. UTIL - extractVarsFromString()
// -----------------------------------------------------------------------------

test('99.01 - UTIL > extractVarsFromString - normal use', function (t) {
  t.deepEqual(extractVarsFromString(
      'text %%_var1_%% more text\n%%_var2_%% and more text', '%%_', '_%%'
    ),
    ['var1', 'var2'],
    '99.01'
  )
})

test('99.02 - UTIL > extractVarsFromString - no results => empty array', function (t) {
  t.deepEqual(extractVarsFromString(
      'text and more text', '%%_', '_%%'
    ),
    [],
    '99.02'
  )
})

test('99.03 - UTIL > extractVarsFromString - no results => empty array', function (t) {
  t.deepEqual(extractVarsFromString(
      'variables in custom notation like {this} or {that} also get extracted', '{', '}'
    ),
    ['this', 'that'],
    '99.03'
  )
})

test('99.04 - UTIL > throws when there\'s no input', t => {
  t.throws(function () {
    extractVarsFromString()
  })
})

test('99.05 - UTIL > throws when first argument is not string-type', t => {
  t.throws(function () {
    extractVarsFromString(111)
  })
})

test('99.06 - UTIL > throws when second argument (heads) is not string-type', t => {
  t.throws(function () {
    extractVarsFromString('a', 111)
  })
})

test('99.07 - UTIL > throws when third argument (tails) is not string-type', t => {
  t.throws(function () {
    extractVarsFromString('a', '%%_', 111)
  })
})

test('99.08 - UTIL > empty string gives result of empty array', function (t) {
  t.deepEqual(extractVarsFromString(
      '', '{', '}'
    ),
    [],
    '99.08'
  )
})

test('99.09 - UTIL > throws when heads and tails are not matches (count differs)', t => {
  t.throws(function () {
    extractVarsFromString('{a {b}', '{', '}')
  })
  t.throws(function () {
    extractVarsFromString('🦄🦄🦄🦄🦄{a {🦄b}', '{', '}')
  })
})
