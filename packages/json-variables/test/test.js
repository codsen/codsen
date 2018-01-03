/* eslint no-template-curly-in-string: 0, padded-blocks: 0 */

import test from 'ava'
import jv from '../dist/json-variables.cjs'
import { extractVarsFromString, findLastInArray, fixOffset, front, splitObjectPath } from '../dist/utils.cjs'

// -----------------------------------------------------------------------------
// 02. BAU
// -----------------------------------------------------------------------------

test('02.01 - fills in variables found among other keys', (t) => {
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
    '02.01.01 - defaults',
  )
  t.deepEqual(
    jv({
      a: 'some text %%_var1.key1_%% more text %%_var2.key2_%%',
      b: 'something',
      var1: { key1: 'value1' },
      var2: { key2: 'value2' },
    }),
    {
      a: 'some text value1 more text value2',
      b: 'something',
      var1: { key1: 'value1' },
      var2: { key2: 'value2' },
    },
    '02.01.02 - defaults + querying object contents',
  )
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
    '02.01.03 - custom wrappers',
  )
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
    '02.01.04 - custom wrappers + multi-level',
  )
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
    '02.01.05 - custom heads/tails',
  )
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
    '02.01.06 - custom heads/tails + multi-level',
  )
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
    '02.01.07 - custom heads/tails, some whitespace inside of them',
  )
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
    '02.01.08 - custom heads/tails, some whitespace inside of them + multi-level',
  )
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
    '02.01.09 - some keys have heads/tails exactly - defaults',
  )
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
    '02.01.10 - some keys have heads/tails exactly - hardcoded defaults',
  )
  t.throws(() => {
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
  t.throws(() => {
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
    '02.01.13 - some keys have heads/tails only - custom heads/tails, defaults',
  )
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
    '02.01.14 - some keys have heads/tails only - custom heads/tails, hardcoded defaults',
  )
})

test('02.02 - fills in all the variables found in a default data stash', (t) => {
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
    '02.02.01',
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
    '02.02.02',
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
    '02.02.03 - data stash and multi-level, all default',
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
    '02.02.04 - data stash and multi-level, default markers, custom wrap',
  )
})

test('02.03 - top-level key and data stash clash', (t) => {
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
    '02.03.01 - default, no wrap',
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
    '02.03.02 - wrap',
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
    '02.03.03 - root key would take precedence, but it\'s of a wrong format and therefore algorithm chooses data storage instead (which is correct type)',
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
    '02.03.03 - mix, one var resolved from root, another from data store',
  )
})

test('02.04 - emoji in values', (t) => {
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
    '02.04',
  )
})

test('02.05 - emoji in keys', (t) => {
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
    '02.05',
  )
})

test('02.06 - emoji in variable keys', (t) => {
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
    '02.05',
  )
})

test('02.06 - empty strings with the input AST', (t) => {
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
    '02.06.01 - defaults',
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
  t.throws(() => {
    jv({
      a: '%%_e_%% %%_d_%%',
      b: '%%_a_%%',
      c: 'c',
      d: '%%_c_%%',
      e: '%%_b_%%',
      f: '%%_b_%%',
    })
  })
  t.throws(() => {
    jv({
      a: '%%_e_%% %%_d_%%',
      b: '%%_a_%%',
      c: 'c',
      d: '%%_f_%%',
      e: '%%_c_%%',
      f: '%%_b_%%',
    })
  })
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
    '03.07.03 - object multi-level values',
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
      a: 'val',
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
      wrapHeadsWith: '{', wrapTailsWith: '}', wrapGlobalFlipSwitch: false, dontWrapVars: 'c*',
    }),
    {
      a: 'val',
      b: 'val',
      c: 'val',
    },
    '04.02.02',
  )
})

test('04.03 - opts.dontWrapVars', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: ['b*', 'c*'] }),
    {
      a: 'val',
      b: 'val',
      c: 'val',
    },
    '04.03.01',
  )
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
})

test('04.04 - opts.dontWrapVars, real key names', (t) => {
  t.deepEqual(
    jv({
      title_front: 'Some text %%_title_sub_%% and more text.',
      title_sub: '%%_subtitle_%%',
      subtitle: 'val',
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: ['sub*'] }),
    {
      title_front: 'Some text val and more text.',
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
      title_front: 'Some text val and more text.',
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
      title_front: 'Some text val and more text.',
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
    }, { wrapHeadsWith: '{', wrapTailsWith: '}', dontWrapVars: '*le' }),
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
      b: ['Some text %%_c_%%, some more text %%_d_%%', 'zzz'],
      c: ['c1', 'c2'],
      d: 'dval',
    }),
    {
      a: ['Some text Some text c1c2, some more text dvalzzz some more text c1c2', 'c1c2', 'dval'],
      b: ['Some text c1c2, some more text dval', 'zzz'],
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

test('05.04 - arrays, whitelisting as array', (t) => {
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

test('05.05 - arrays, whitelisting as array', (t) => {
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
        dontWrapVars: ['*zzz', '*le', '*yyy'],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      },
    ),
    {
      title: ['something', 'Some text SUB', '{ship}', 'anything'],
      title_data: {
        subtitle: 'SUB',
      },
      whatnot: '{ship}',
      whatnot_data: {
        submarine: 'ship',
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
  t.throws(() => {
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
  t.throws(() => {
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
  t.throws(() => {
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
    '07.01.04 - custom opts.headsNoWrap & opts.tailsNoWrap',
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
    '07.01.05 - left side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap',
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
    '07.01.05 - right side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap',
  )
})

test('07.02 - opts.headsNoWrap & opts.tailsNoWrap work on multi-level vars', (t) => {
  t.deepEqual(
    jv(
      {
        a: 'text %%-b-%% more text %%_c_%% and more %%-b-%% text',
        b: '%%_c_%%',
        c: 'z',
      },
      {
        wrapHeadsWith: '??',
        wrapTailsWith: '!!',
      },
    ),
    {
      a: 'text z more text ??z!! and more z text',
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
      a: false,
      b: 'stringB',
      c: true,
      d: 'stringD',
      e: false,
    },
    '08.01.01',
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
})

test('08.02 - Boolean values inserted instead of other values, in whole', (t) => {
  t.deepEqual(
    jv({
      a: '%%_b_%%',
      b: true,
    }),
    {
      a: true,
      b: true,
    },
    '08.02',
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
    '08.04',
  )
})

// -----------------------------------------------------------------------------
// 09. opts.resolveToBoolIfAnyValuesContainBool
// -----------------------------------------------------------------------------

test('09.01 - opts.resolveToBoolIfAnyValuesContainBool, Bools and Strings mix', (t) => {
  t.deepEqual(
    jv({
      a: 'zzz %%_b_%% zzz',
      b: true,
    }),
    {
      a: false,
      b: true,
    },
    '09.01.01 - relying on default',
  )
  t.deepEqual(
    jv(
      {
        a: 'zzz %%_b_%% zzz',
        b: true,
      },
      {
        resolveToBoolIfAnyValuesContainBool: true,
      },
    ),
    {
      a: false,
      b: true,
    },
    '09.01.02 - Bools hardcoded default',
  )
  t.deepEqual(
    jv(
      {
        a: 'zzz %%_b_%% zzz',
        b: true,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
      },
    ),
    {
      a: 'zzz  zzz',
      b: true,
    },
    '09.01.03 - Bools turned off',
  )
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
      dontWrapVars: ['*zzz', '*1', '*6'],
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
      dontWrapVars: ['*zzz', '*3', '*6'],
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
})

test('11.03 - two-level queried, string found => throws', (t) => {
  t.throws(() => {
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
  t.notThrows(() => {
    jv({
      a: 'some text %%_var1_%% more text %%_var2_%%',
      b: 'something',
      var1: { key1: 'value1', key2: 'value2' },
      var2: { key3: 'value3', key4: 'value4' },
    })
  })
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
        dontWrapVars: ['*zzz', '*le', '*yyy'],
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
    '11.04.01 - two ignores in an array, data store, multi-level',
  )
})

// -----------------------------------------------------------------------------
// 12. Potentially clashing combos of characters
// -----------------------------------------------------------------------------

test('12.01 - surrounding underscores - sneaky similarity with wrong side brackets', (t) => {
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
    '12.01.01',
  )
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
    '12.01.02',
  )
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
    '12.01.03',
  )
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
    '12.01.04',
  )
})

// -----------------------------------------------------------------------------
// 93. UTIL - splitObjectPath()
// -----------------------------------------------------------------------------

test('93.01 - UTIL > splitObjectPath - dot notation', (t) => {
  t.deepEqual(
    splitObjectPath('something.anything'),
    ['something', 'anything'],
    '93.01',
  )
})

test('93.02 - UTIL > splitObjectPath - brackets', (t) => {
  t.deepEqual(
    splitObjectPath('something[anything.everything]'),
    ['something', 'anything', 'everything'],
    '93.02',
  )
})

test('93.03 - UTIL > splitObjectPath - more brackets', (t) => {
  t.deepEqual(
    splitObjectPath('something[anything.everything[nothing]]'),
    ['something', 'anything', 'everything', 'nothing'],
    '93.03.01',
  )
  t.deepEqual(
    splitObjectPath('    something[  anything.everything[ nothing ]  ]   '),
    ['something', 'anything', 'everything', 'nothing'],
    '93.03.02',
  )
  t.deepEqual(
    splitObjectPath('  \n  something  \t\n  [   \n  \t  anything  \n \t. \t\t everything \n\n   [   \nnothing\t  ] \n  ]  \t\t \n'),
    ['something', 'anything', 'everything', 'nothing'],
    '93.03.03 - and as crazy as it might look, even this ^^^',
  )
  t.deepEqual(
    splitObjectPath('shfgldhfgdg'),
    ['shfgldhfgdg'],
    '93.03.04 - should also work on normal strings',
  )
})

test('93.04 - UTIL > splitObjectPath - returns intact non-string input', (t) => {
  t.is(
    splitObjectPath(1),
    1,
    '93.04',
  )
})

// -----------------------------------------------------------------------------
// 94. UTIL - front()
// -----------------------------------------------------------------------------

test('94.01 - UTIL > front', (t) => {
  t.is(
    front('something.anything'),
    'something',
    '94.01.01',
  )
  t.is(
    front('something[anything]'),
    'something',
    '94.01.02',
  )
  t.is(
    front('.'),
    '',
    '94.01.03',
  )
  t.is(
    front(''),
    '',
    '94.01.04',
  )
  t.is(
    front(),
    undefined,
    '94.01.05',
  )
})

// -----------------------------------------------------------------------------
// 95. UTIL - fixOffset()
// -----------------------------------------------------------------------------

test('95.01 - UTIL > fixOffset', (t) => {
  t.deepEqual(
    fixOffset(
      [[0, 1], [5, 8], [10, 15]],
      1,
      2,
    ),
    [[0, 1], [7, 10], [12, 17]],
    '95.01.01',
  )
  t.deepEqual(
    fixOffset(
      [[0, 1], [5, 8], [10, 15]],
      20,
      2,
    ),
    [[0, 1], [5, 8], [10, 15]],
    '95.01.02',
  )
})

// -----------------------------------------------------------------------------
// 97. UTIL - findLastInArray()
// -----------------------------------------------------------------------------

test('97.01 - UTIL > findLastInArray - normal use', (t) => {
  t.deepEqual(
    findLastInArray(['something', 'anything']),
    null,
    '97.01',
  )
})

// -----------------------------------------------------------------------------
// 99. UTIL - extractVarsFromString()
// -----------------------------------------------------------------------------

test('99.01 - UTIL > extractVarsFromString - normal use', (t) => {
  t.deepEqual(
    extractVarsFromString('text %%_var1_%% more text\n%%_var2_%% and more text'),
    ['var1', 'var2'],
    '99.01 - relying on default heads/tails',
  )
})

test('99.02 - UTIL > extractVarsFromString - no results => empty array', (t) => {
  t.deepEqual(
    extractVarsFromString('text and more text', '%%_', '_%%'),
    [],
    '99.02',
  )
})

test('99.03 - UTIL > extractVarsFromString - no results => empty array', (t) => {
  t.deepEqual(
    extractVarsFromString('variables in custom notation like {this} or {that} also get extracted', '{', '}'),
    ['this', 'that'],
    '99.03',
  )
})

test('99.04 - UTIL > extractVarsFromString - throws when there\'s no input', (t) => {
  t.throws(() => {
    extractVarsFromString()
  })
})

test('99.05 - UTIL > extractVarsFromString - throws when first argument is not string-type', (t) => {
  t.throws(() => {
    extractVarsFromString(111)
  })
})

test('99.06 - UTIL > extractVarsFromString - throws when second argument (heads) is not string-type', (t) => {
  t.throws(() => {
    extractVarsFromString('a', 111)
  })
})

test('99.07 - UTIL > extractVarsFromString - throws when third argument (tails) is not string-type', (t) => {
  t.throws(() => {
    extractVarsFromString('a', '%%_', 111)
  })
})

test('99.08 - UTIL > extractVarsFromString - empty string gives result of empty array', (t) => {
  t.deepEqual(
    extractVarsFromString('', '{', '}'),
    [],
    '99.08',
  )
})

test('99.09 - UTIL > extractVarsFromString - throws when heads and tails are not matches (count differs)', (t) => {
  t.throws(() => {
    extractVarsFromString('{a {b}', '{', '}')
  })
  t.throws(() => {
    extractVarsFromString('🦄🦄🦄🦄🦄{a {🦄b}', '{', '}')
  })
  t.notThrows(() => {
    extractVarsFromString('%%_', '%%_', '_%%')
  })
  t.notThrows(() => {
    extractVarsFromString('_%%', '%%_', '_%%')
  })
})

test('99.10 - UTIL > extractVarsFromString - copes when heads/tails are given as input', (t) => {
  t.deepEqual(
    extractVarsFromString('%%_', '%%_', '_%%'),
    [],
    '99.10.01',
  )
  t.deepEqual(
    extractVarsFromString('_%%', '%%_', '_%%'),
    [],
    '99.10.02',
  )
})

test('99.11 - UTIL > extractVarsFromString - multiple heads/tails', (t) => {
  t.deepEqual(
    extractVarsFromString(
      'text %%-var1-%% more text\n%%_var2_%% and more text',
      ['%%-', '%%_'],
      ['-%%', '_%%'],
    ),
    ['var1', 'var2'],
    '99.11',
  )
})

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - basic throws related to wrong input', (t) => {
  t.throws(() => {
    jv()
  })
  t.throws(() => {
    jv('zzzz')
  })
  t.throws(() => {
    jv('{}')
  })
  t.throws(() => {
    jv('[]')
  })
})

test('01.02 - throws when options heads and/or tails are empty', (t) => {
  t.throws(() => {
    jv({
      a: 'a',
    }, { heads: '' })
  })
  t.throws(() => {
    jv({
      a: 'a',
    }, { tails: '' })
  })
  t.throws(() => {
    jv({
      a: 'a',
    }, { heads: '', tails: '' })
  })
})

test('01.03 - throws when data container key lookup is enabled and container tails are given blank', (t) => {
  t.throws(() => {
    jv({
      a: 'a',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: '' })
  })
  t.notThrows(() => {
    jv({
      a: 'a',
    }, { lookForDataContainers: false, dataContainerIdentifierTails: '' })
  })
  t.throws(() => {
    jv({
      a: 'a',
    }, { dataContainerIdentifierTails: '' })
  })
})

test('01.04 - throws when heads and tails are equal', (t) => {
  t.throws(() => {
    jv({
      a: 'a',
    }, { heads: '%%', tails: '%%' })
  })
})

test('01.05 - throws when input is not a plain object', (t) => {
  t.throws(() => {
    jv(['zzz'], { heads: '%%', tails: '%%' })
  })
})

test('01.06 - throws when keys contain variables', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      '%%_var2_%%': 'something',
      var1: 'value1',
      var2: 'value2',
    })
  })
  t.throws(() => {
    jv({
      a: 'some text zzvar1zz more text',
      zzvar2zz: 'something',
      var1: 'value1',
      var2: 'value2',
    }, { heads: 'zz', tails: 'zz' })
  })
})

test('01.07 - throws when there are unequal number of marker heads and tails', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more %%_text',
      b: 'something',
      var1: 'value1',
      var2: 'value2',
    })
  })
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text_%%',
      b: '%%_something',
      var1: 'value1',
      var2: 'value2',
    })
  })
})

test('01.08 - throws when data is missing', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    })
  })
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
      a_data: 'zzz',
    })
  })
})

test('01.09 - throws when data container lookup is turned off and var is missing', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: false })
  })
})

test('01.10 - throws when data container name append is not string', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: false })
  })
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: 1 })
  })
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
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: '' })
  })
  t.throws(() => {
    jv({
      a: 'some text, more text',
      b: 'something',
    }, { lookForDataContainers: true, dataContainerIdentifierTails: '' })
  })
})

test('01.13 - throws when opts.wrapHeadsWith is customised to anything other than string', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { wrapHeadsWith: false })
  })
})

test('01.14 - throws when opts.wrapHeadsWith is customised to empty string', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { wrapHeadsWith: '' })
  })
})

test('01.15 - throws when opts.wrapTailsWith is customised to anything other than string', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { wrapTailsWith: false })
  })
})

test('01.16 - throws when opts.wrapTailsWith is customised to empty string', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { wrapTailsWith: '' })
  })
})

test('01.17 - throws when opts.heads is not string', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { heads: 1 })
  })
})

test('01.18 - throws when opts.tails is not string', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { tails: 1 })
  })
})

test('01.19 - throws when all args are missing', (t) => {
  t.throws(() => {
    jv()
  })
})

test('01.20 - throws when key references itself', (t) => {
  t.throws(() => {
    jv({
      a: '%%_a_%%',
    })
  })
  t.throws(() => {
    jv({
      a: 'something %%_a_%% aaaa %%_a_%%',
    })
  })
})

test('01.21 - throws when key references itself', (t) => {
  t.throws(() => {
    jv({
      a: 'a',
      b: '%%_a_%%',
      c: '%%_c_%%',
    })
  })
})

test('01.22 - throws when key references key which references itself', (t) => {
  t.throws(() => {
    jv({
      b: '%%_a_%%',
      a: '%%_a_%%',
    })
  })
})

test('01.23 - throws when there\'s recursion (with distraction)', (t) => {
  t.throws(() => {
    jv({
      a: '%%_c_%% %%_b_%%',
      b: '%%_a_%%',
      c: 'ccc',
    })
  })
})

test('01.24 - throws when there\'s a longer recursion', (t) => {
  t.throws(() => {
    jv({
      a: '%%_b_%%',
      b: '%%_c_%%',
      c: '%%_d_%%',
      d: '%%_e_%%',
      e: '%%_b_%%',
    })
  })
})

test('01.25 - throws when opts.lookForDataContainers is not boolean', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: 1 })
  })
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { lookForDataContainers: 'false' })
  })
})

test('01.26 - throws when opts.preventDoubleWrapping is not boolean', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { preventDoubleWrapping: 1 })
  })
  t.throws(() => {
    jv({
      a: 'some text %%_var1_%% more text',
      b: 'something',
    }, { preventDoubleWrapping: 'false' })
  })
})

test('01.27 - throws when opts.heads and opts.headsNoWrap are customised to be equal', (t) => {
  t.throws(() => {
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
  t.throws(() => {
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
  t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        headsNoWrap: '%%_',
      },
    )
  })
})

test('01.28 - throws when opts.tails and opts.tailsNoWrap are customised to be equal', (t) => {
  t.throws(() => {
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
  t.throws(() => {
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
  t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        tailsNoWrap: '_%%',
      },
    )
  })
})

test('01.29 - empty nowraps', (t) => {
  t.throws(() => {
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
  t.throws(() => {
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
  t.throws(() => {
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
  t.throws(() => {
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
})

test('01.30 - equal nowraps', (t) => {
  t.throws(() => {
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
  t.throws(() => {
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
  t.throws(() => {
    jv(
      {
        a: 'some text %%_var1_%% more text',
        b: 'something',
      },
      {
        headsNoWrap: '%%-',
      },
    )
  })
})

test('01.31 - throws there\'s simple recursion loop', (t) => {
  t.throws(() => {
    jv({
      a: '%%_a_%%',
    })
  })
  t.throws(() => {
    jv({
      a: ['%%_a_%%'],
    })
  })
  t.throws(() => {
    jv({
      a: ['%%_b_%%'],
      b: ['%%_a_%%'],
    })
  })
  t.throws(() => {
    jv({
      a: ['%%_b_%%', '%%_b_%%'],
    })
  })
  t.throws(() => {
    jv(['%%_a_%%'])
  })
})

test('01.32 - throws referencing what does not exist', (t) => {
  t.throws(() => {
    jv({
      a: '%%_b_%%',
    })
  })
  t.throws(() => {
    jv({
      a: ['%%_b_%%'],
    })
  })
})

test('01.33 - throws when referencing the multi-level object keys that don\'t exist', (t) => {
  t.throws(() => {
    jv({
      a: 'some text %%_var1.key99_%% more text %%_var2.key99_%%',
      b: 'something',
      var1: { key1: 'value1' },
      var2: { key2: 'value2' },
    })
  })
  t.throws(() => {
    jv({
      a: 'some text %%_var1.key99_%% more text %%_var2.key99_%%',
      b: 'something',
      var1: { key1: 'value1', key2: 'value2', key3: 'value3' },
      var2: { key4: 'value4', key5: 'value5', key6: 'value6' },
    })
  })
  t.throws(() => {
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
})
