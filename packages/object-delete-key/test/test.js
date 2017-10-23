/* eslint-disable no-multi-str */

import test from 'ava'
import parser from 'posthtml-parser'
import deleteKey from '../dist/object-delete-key.cjs'

let actual
let intended

// ==============================
// One-level plain objects
// ==============================

test('1.1 - delete a value which is string', (t) => {
  actual = deleteKey(
    {
      a: 'a',
      b: 'b',
    },
    {
      key: 'b',
      val: 'b',
    },
  )
  intended = {
    a: 'a',
  }

  t.deepEqual(
    actual,
    intended,
    '1.1',
  )
})

test('1.2 - delete a value which is plain object', (t) => {
  actual = deleteKey(
    {
      a: 'a',
      b: { c: 'd' },
    },
    {
      key: 'b',
      val: { c: 'd' },
    },
  )
  intended = {
    a: 'a',
  }

  t.deepEqual(
    actual,
    intended,
    '1.2',
  )
})

test('1.3 - delete two values, plain objects, cleanup=false', (t) => {
  actual = deleteKey(
    {
      a: { e: [{ b: { c: 'd' } }] },
      b: { c: 'd' },
    },
    {
      key: 'b',
      val: { c: 'd' },
      cleanup: false,
    },
  )
  intended = {
    a: { e: [{}] },
  }

  t.deepEqual(
    actual,
    intended,
    '1.3',
  )
})

test('1.4 - delete two values, plain objects, cleanup=true', (t) => {
  actual = deleteKey(
    {
      a: { e: [{ b: { c: 'd' } }] },
      b: { c: 'd' },
    },
    {
      key: 'b',
      val: { c: 'd' },
      cleanup: true,
    },
  )
  intended = {}

  t.deepEqual(
    actual,
    intended,
    '1.4',
  )
})

test('1.5 - delete two values which are plain objects (on default)', (t) => {
  actual = deleteKey(
    {
      a: { e: [{ b: { c: 'd' } }] },
      b: { c: 'd' },
    },
    {
      key: 'b',
      val: { c: 'd' },
    },
  )
  intended = {}

  t.deepEqual(
    actual,
    intended,
    '1.5',
  )
})

test('1.6 - delete a value which is an array', (t) => {
  actual = deleteKey(
    {
      a: 'a',
      b: ['c', 'd'],
    },
    {
      key: 'b',
      val: ['c', 'd'],
    },
  )
  intended = {
    a: 'a',
  }

  t.deepEqual(
    actual,
    intended,
    '1.6',
  )
})

test('1.7 - delete two values which are arrays, cleanup=false', (t) => {
  actual = deleteKey(
    {
      a: { e: [{ b: ['c', 'd'] }] },
      b: ['c', 'd'],
    },
    {
      key: 'b',
      val: ['c', 'd'],
      cleanup: false,
    },
  )
  intended = {
    a: { e: [{}] },
  }

  t.deepEqual(
    actual,
    intended,
    '1.7',
  )
})

test('1.8 - delete two values which are arrays, cleanup=default', (t) => {
  actual = deleteKey(
    {
      a: { e: [{ b: ['c', 'd'] }] },
      b: ['c', 'd'],
    },
    {
      key: 'b',
      val: ['c', 'd'],
    },
  )
  intended = {}

  t.deepEqual(
    actual,
    intended,
    '1.8',
  )
})

// ==============================
// Omit value to target all keys
// ==============================

test('2.1 - simple plain object, couple instances found', (t) => {
  t.deepEqual(
    deleteKey(
      {
        a: 'a',
        b: 'whatever',
        c: [{ b: 'whatever as well' }],
      },
      {
        key: 'b',
      },
    ),
    {
      a: 'a',
    },
    '2.1.1 - no settings',
  )
  t.deepEqual(
    deleteKey(
      {
        a: 'a',
        b: 'whatever',
        c: [{ b: 'whatever as well' }],
      },
      {
        key: 'b',
        only: 'o', // object
      },
    ),
    {
      a: 'a',
    },
    '2.1.2 - objects only (same outcome as 2.1.1)',
  )
  t.deepEqual(
    deleteKey(
      {
        a: 'a',
        b: 'whatever',
        c: [{ b: 'whatever as well' }],
      },
      {
        key: 'b',
        only: 'a', // array
      },
    ),
    {
      a: 'a',
      b: 'whatever',
      c: [{ b: 'whatever as well' }],
    },
    '2.1.3 - arrays only (none found)',
  )
  t.deepEqual(
    deleteKey(
      {
        a: 'a',
        b: 'whatever',
        c: [{ b: 'whatever as well' }],
      },
      {
        key: 'b',
        only: 'any', // same behaviour as defaults
      },
    ),
    {
      a: 'a',
    },
    '2.1.4 - only=any',
  )
})

test('2.2 - nested array/plain objects, multiple instances found', (t) => {
  t.deepEqual(
    deleteKey(
      [{
        a: 'a',
        b: 'delete this key',
        c: [{ b: 'and this as well' }],
      },
      {
        b: ['and this key too', 'together with this'],
        d: { e: { f: { g: { b: 'and this, no matter how deep-nested' } } } },
      }],
      {
        key: 'b',
      },
    ),
    [{ a: 'a' }],
    '2.2.1, default cleanup',
  )
  t.deepEqual(
    deleteKey(
      [{
        a: 'a',
        b: 'delete this key',
        c: [{ b: 'and this as well' }],
      },
      {
        b: ['and this key too', 'together with this'],
        d: { e: { f: { g: { b: 'and this, no matter how deep-nested' } } } },
      }],
      {
        key: 'b',
        only: 'object',
      },
    ),
    [{ a: 'a' }],
    '2.2.2, only=object (same)',
  )
  t.deepEqual(
    deleteKey(
      [{
        a: 'a',
        b: 'delete this key',
        c: [{ b: 'and this as well' }],
      },
      {
        b: ['and this key too', 'together with this'],
        d: { e: { f: { g: { b: 'and this, no matter how deep-nested' } } } },
      }],
      {
        key: 'b',
        only: 'array',
      },
    ),
    [{
      a: 'a',
      b: 'delete this key',
      c: [{ b: 'and this as well' }],
    },
    {
      b: ['and this key too', 'together with this'],
      d: { e: { f: { g: { b: 'and this, no matter how deep-nested' } } } },
    }],
    '2.2.3, only=array (nothing done)',
  )
})

test('2.3 - nested array/plain objects, multiple instances found, false', (t) => {
  t.deepEqual(
    deleteKey(
      [
        {
          a: 'a',
          b: 'delete this key',
          c: [{ b: 'and this as well' }],
        },
        {
          b: ['and this key too', 'together with this'],
          d: { e: { f: { g: { b: 'and this, no matter how deep-nested' } } } },
        },
      ],
      {
        key: 'b',
        cleanup: false,
      },
    ),
    [
      {
        a: 'a',
        c: [{}],
      },
      {
        d: { e: { f: { g: {} } } },
      },
    ],
    '2.3 - cleanup=false',
  )
})

test('2.4 - mixed array and object findings', (t) => {
  t.deepEqual(
    deleteKey(
      [{
        a: 'a',
        b: 'delete this key',
        c: ['b', 'b', { b: 'd' }],
      },
      {
        b: ['and this key too', 'together with this'],
        d: { e: { f: { g: ['b', { b: 'and this, no matter how deep-nested' }] } } },
      }],
      {
        key: 'b',
      },
    ),
    [{ a: 'a' }],
    '2.4.1, default cleanup',
  )
  t.deepEqual(
    deleteKey(
      [{
        a: 'a',
        b: 'delete this key',
        c: ['b', 'b', { b: 'd' }],
      },
      {
        b: ['and this key too', 'together with this'],
        d: { e: { f: { g: ['b', { b: 'and this, no matter how deep-nested' }] } } },
      }],
      {
        key: 'b',
        only: 'whatever',
      },
    ),
    [{ a: 'a' }],
    '2.4.2, only=any',
  )
  t.deepEqual(
    deleteKey(
      [{
        a: 'a',
        b: 'delete this key',
        c: ['b', 'b', { b: 'd' }],
      }],
      {
        key: 'b',
        only: 'object',
      },
    ),
    [{
      a: 'a',
      c: ['b', 'b'],
    }],
    '2.4.3, only=object, mini case',
  )
  t.deepEqual(
    deleteKey(
      [{
        a: 'a',
        b: 'delete this key',
        c: ['b', 'b', { b: 'd' }],
      },
      {
        b: ['and this key too', 'together with this'],
        d: { e: { f: { g: ['b', { b: 'and this, no matter how deep-nested' }] } } },
      }],
      {
        key: 'b',
        only: 'arrays',
      },
    ),
    [{
      a: 'a',
      b: 'delete this key',
      c: [{ b: 'd' }],
    },
    {
      b: ['and this key too', 'together with this'],
      d: { e: { f: { g: [{ b: 'and this, no matter how deep-nested' }] } } },
    }],
    '2.4.4, only=arrays',
  )
  t.deepEqual(
    deleteKey(
      [{
        a: 'a',
        b: 'delete this key',
        c: ['b', 'b', { b: 'd' }],
      },
      {
        b: ['and this key too', 'together with this'],
        d: { e: { f: { g: ['b', { b: 'and this, no matter how deep-nested' }] } } },
      }],
      {
        key: 'b',
        only: 'object',
      },
    ),
    [{
      a: 'a',
      c: ['b', 'b'],
    },
    {
      d: { e: { f: { g: ['b'] } } },
    }],
    '2.4.5, only=object, bigger example',
  )
})

// ==============================
// Omit key to target all keys with a given value
// ==============================

test('3.1 - targets all keys by value, cleanup=true', (t) => {
  actual = deleteKey(
    {
      a: 'a',
      b: 'whatever',
      c: [{ b: 'whatever' }],
    },
    {
      val: 'whatever',
    },
  )
  intended = {
    a: 'a',
  }

  t.deepEqual(
    actual,
    intended,
    '3.1',
  )
})

test('3.2 - targets all keys by value, cleanup=false', (t) => {
  actual = deleteKey(
    {
      a: 'a',
      b: 'whatever',
      c: [{ b: 'whatever' }],
    },
    {
      val: 'whatever',
      cleanup: false,
    },
  )
  intended = {
    a: 'a',
    c: [{}],
  }

  t.deepEqual(
    actual,
    intended,
    '3.2',
  )
})

// ======================================
// Carcasses cleanup functionality checks
// ======================================

// v2.0+
// empty tag's parent will be deleted just if it does not have any non-empty values in other keys
// in the following case, key "d" is deleted because it's dead branch.
// But once we go "upstream" from "d" to higher, we don't touch "cousin" key "b":
test('4.1 - deletion limited to level where non-empty "uncles" exist', (t) => {
  actual = deleteKey(
    {
      a: 'a',
      b: [[{}]],
      c: 'c',
      d: {
        e: '',
      },
    },
    {
      key: 'e',
      val: '',
      cleanup: true,
    },
  )
  intended = {
    a: 'a',
    b: [[{}]],
    c: 'c',
  }

  t.deepEqual(
    actual,
    intended,
    '4.1',
  )
})

test('4.2 - deletion of empty things is limited in arrays too', (t) => {
  actual = deleteKey(
    [
      [{
        a: '',
      }],
      {},
      {
        b: 'b',
      },
      ['c'],
    ],
    {
      key: 'a',
      val: '',
      cleanup: true,
    },
  )
  intended = [
    {},
    {
      b: 'b',
    },
    ['c'],
  ]

  t.deepEqual(
    actual,
    intended,
    '4.2',
  )
})

// ==============================
// Throws
// ==============================

test('5.1 - both key and value missing - throws', (t) => {
  t.throws(() => {
    deleteKey(
      { a: 'a' },
      {},
    )
  })
})

test('5.2 - nonsensical options object - throws', (t) => {
  t.throws(() => {
    deleteKey(
      { a: 'a' },
      { z: 'z' },
    )
  })
  t.throws(() => {
    deleteKey(
      { a: 'a' },
      1,
    )
  })
})

test('5.3 - no input args - throws', (t) => {
  t.throws(() => {
    deleteKey()
  })
})

test('5.4 - wrong input args - throws', (t) => {
  t.throws(() => {
    deleteKey({ a: 'a' }, {
      key: 'yyy',
      val: 'zzz',
      cleanup: 1,
    })
  })
  t.throws(() => {
    deleteKey({ a: 'a' }, {
      key: 1,
      val: null,
      cleanup: true,
    })
  })
  t.throws(() => {
    deleteKey({ a: 'a' }, {
      key: 1,
      val: null,
      cleanup: 'zzz',
    })
  })
})

// ==============================
// Tests on real HTML
// ==============================

test('6.1 - deletes from real parsed HTML', (t) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<title>test</title>
</head>
<body>
<table class="" width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td class="">
<img src="spacer.gif">
</td>
</tr>
</table>
</body>
</html>
`
  actual = deleteKey(
    parser(html),
    {
      key: 'class',
      val: '',
      cleanup: true,
    },
  )
  intended = parser(`
<!DOCTYPE html>
<html lang="en">
<head>
<title>test</title>
</head>
<body>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<img src="spacer.gif">
</td>
</tr>
</table>
</body>
</html>
`)
  t.deepEqual(
    actual,
    intended,
    '6.1',
  )
})

test('6.2 - real parsed HTML #1', (t) => {
  actual = deleteKey(
    [
      '<!DOCTYPE html>',
      {
        tag: 'html',
        attrs: {
          lang: 'en',
        },
        content: [
          {
            tag: 'head',
            content: [
              {
                tag: 'div',
              },
            ],
          },
          {
            tag: 'body',
            content: [
              {
                tag: 'table',
                attrs: {
                  class: '',
                  width: '100%',
                  border: '0',
                  cellpadding: '0',
                  cellspacing: '0',
                },
                content: [
                  {
                    tag: 'tr',
                    content: [
                      {
                        tag: 'td',
                        attrs: {
                          class: '',
                        },
                        content: [
                          {
                            tag: 'img',
                            attrs: {
                              src: 'spacer.gif',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    {
      key: 'class',
      val: '',
    },
  )
  intended = [
    '<!DOCTYPE html>',
    {
      tag: 'html',
      attrs: {
        lang: 'en',
      },
      content: [
        {
          tag: 'head',
          content: [
            {
              tag: 'div',
            },
          ],
        },
        {
          tag: 'body',
          content: [
            {
              tag: 'table',
              attrs: {
                width: '100%',
                border: '0',
                cellpadding: '0',
                cellspacing: '0',
              },
              content: [
                {
                  tag: 'tr',
                  content: [
                    {
                      tag: 'td',
                      content: [
                        {
                          tag: 'img',
                          attrs: {
                            src: 'spacer.gif',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
  t.deepEqual(
    actual,
    intended,
    '6.2',
  )
})

test('6.3 - real parsed HTML #2', (t) => {
  actual = deleteKey(
    [
      {
        tag: 'table',
        attrs: {
          class: '',
          width: '100%',
        },
      },
    ],
    {
      key: 'class',
      val: '',
    },
  )
  intended = [
    {
      tag: 'table',
      attrs: {
        width: '100%',
      },
    },
  ]
  t.deepEqual(
    actual,
    intended,
    '6.3',
  )
})

test('6.4 - real parsed HTML #3', (t) => {
  actual = deleteKey(
    {
      a: {
        b: '',
        c: 'd',
        e: 'f',
      },
    },
    {
      key: 'b',
      val: '',
      cleanup: false,
    },
  )
  intended = {
    a: {
      c: 'd',
      e: 'f',
    },
  }
  t.deepEqual(
    actual,
    intended,
    '6.4',
  )
})

test('6.5 - real parsed HTML #4', (t) => {
  actual = deleteKey(
    {
      a: {
        b: '',
        c: 'd',
      },
    },
    {
      key: 'b',
      val: '',
      cleanup: true,
    },
  )
  intended = {
    a: {
      c: 'd',
    },
  }
  t.deepEqual(
    actual,
    intended,
    '6.5',
  )
})

// ======================================
// Prove input args are not being mutated
// ======================================

test('7.1 - does not mutate input args', (t) => {
  const obj1 = {
    a: 'a',
    b: 'b',
  }
  const unneededRes = deleteKey(
    obj1,
    {
      key: 'b',
      val: 'b',
    },
  )
  t.pass(unneededRes) // dummy to prevent JS Standard swearing
  t.deepEqual(
    obj1,
    {
      a: 'a',
      b: 'b',
    },
    '7.1',
  ) // real deal
})

// ===============
// Tests on arrays
// ===============

test('8.1 - delete a value which is string', (t) => {
  actual = deleteKey(
    {
      a: ['b', '', 'c'],
    },
    {
      key: '',
    },
  )
  intended = {
    a: ['b', 'c'],
  }

  t.deepEqual(
    actual,
    intended,
    '8.1',
  )
})
