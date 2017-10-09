import test from 'ava'
import { getKeyset, enforceKeyset, noNewKeys, findUnused, sortAllObjects } from '../dist/json-comb-core.cjs'

let schema
let obj1
let obj2
let obj3

function prepArray(arr) {
  const keySet = getKeyset(arr)
  const res = []
  arr.forEach((obj) => {
    // console.log('obj = ' + JSON.stringify(obj, null, 4))
    // console.log('keySet = ' + JSON.stringify(keySet, null, 4))
    res.push(enforceKeyset(obj, keySet))
  })
  return res
}

// -----------------------------------------------------------------------------
// 01. getKeyset()
// -----------------------------------------------------------------------------

test('01.01 - getKeyset() - throws when there\'s no input', (t) => {
  t.throws(() => {
    getKeyset()
  })
})

test('01.02 - getKeyset() - throws when input is not an array', (t) => {
  t.throws(() => {
    getKeyset('aa')
  })
})

test('01.03 - getKeyset() - throws when input array is empty', (t) => {
  t.throws(() => {
    getKeyset([])
  })
})

test('01.04 - getKeyset() - throws when input array contains not only plain objects', (t) => {
  t.throws(() => {
    getKeyset([
      {
        a: 'a',
        b: 'b',
      },
      {
        a: 'a',
      },
      'zzzz',
    ])
  })
})

test('01.05 - getKeyset() - calculates - three objects - default placeholder', (t) => {
  t.deepEqual(
    getKeyset([
      {
        a: 'a',
        b: 'c',
        c: {
          d: 'd',
          e: 'e',
        },
      },
      {
        a: 'a',
      },
      {
        c: {
          f: 'f',
        },
      },
    ]),
    {
      a: false,
      b: false,
      c: {
        d: false,
        e: false,
        f: false,
      },
    },
    '01.05',
  )
})

test('01.06 - getKeyset() - calculates - three objects - custom placeholder', (t) => {
  t.deepEqual(
    getKeyset(
      [
        {
          a: 'a',
          b: 'c',
          c: {
            d: 'd',
            e: 'e',
          },
        },
        {
          a: 'a',
        },
        {
          c: {
            f: 'f',
          },
        },
      ],
      { placeholder: true },
    ),
    {
      a: true,
      b: true,
      c: {
        d: true,
        e: true,
        f: true,
      },
    },
    '01.06.01',
  )
  t.deepEqual(
    getKeyset([
      {
        a: 'a',
        b: 'c',
        c: {
          d: 'd',
          e: 'e',
        },
      },
      {
        a: 'a',
      },
      {
        c: {
          f: 'f',
        },
      },
    ], { placeholder: '' }),
    {
      a: '',
      b: '',
      c: {
        d: '',
        e: '',
        f: '',
      },
    },
    '01.06.02',
  )
  t.deepEqual(
    getKeyset([
      {
        a: 'a',
        b: 'c',
        c: {
          d: 'd',
          e: 'e',
        },
      },
      {
        a: 'a',
      },
      {
        c: {
          f: 'f',
        },
      },
    ], { placeholder: { a: 'a' } }),
    {
      a: { a: 'a' },
      b: { a: 'a' },
      c: {
        d: { a: 'a' },
        e: { a: 'a' },
        f: { a: 'a' },
      },
    },
    '01.06.03',
  )
})

test('01.07 - getKeyset() - settings argument is not a plain object - throws', (t) => {
  t.throws(() => {
    getKeyset([{ a: 'a' }, { b: 'b' }], 'zzz')
  })
})

test('01.08 - getKeyset() - multiple levels of nested arrays', (t) => {
  t.deepEqual(
    getKeyset([
      {
        key2: [
          {
            key5: 'val5',
            key4: 'val4',
            key6: [
              {
                key8: 'val8',
              },
              {
                key7: 'val7',
              },
            ],
          },
        ],
        key1: 'val1',
      },
      {
        key1: false,
        key3: 'val3',
      },
    ]),
    {
      key1: false,
      key2: [
        {
          key4: false,
          key5: false,
          key6: [
            {
              key7: false,
              key8: false,
            },
          ],
        },
      ],
      key3: false,
    },
    '01.08',
  )
})

test('01.09 - getKeyset() - objects that are directly in values', (t) => {
  t.deepEqual(
    getKeyset([
      {
        a: {
          b: 'c',
          d: 'e',
        },
        k: 'l',
      },
      {
        a: {
          f: 'g',
          b: 'c',
          h: 'i',
        },
        m: 'n',
      },
    ]),
    {
      a: {
        b: false,
        d: false,
        f: false,
        h: false,
      },
      k: false,
      m: false,
    },
    '01.09.01',
  )
  t.deepEqual(
    getKeyset([
      {
        a: {
          f: 'g',
          b: 'c',
          h: 'i',
        },
        m: 'n',
      },
      {
        a: {
          b: 'c',
          d: 'e',
        },
        k: 'l',
      },
    ]),
    {
      a: {
        b: false,
        d: false,
        f: false,
        h: false,
      },
      k: false,
      m: false,
    },
    '01.09.02',
  )
})

test('01.10 - getKeyset() - deeper level arrays containing only strings', (t) => {
  t.deepEqual(
    getKeyset([
      {
        a: false,
        b: {
          c: {
            d: ['eee'],
          },
        },
      },
      {
        a: false,
      },
    ]),
    {
      a: false,
      b: {
        c: {
          d: [],
        },
      },
    },
    '01.10.01',
  )
})

test('01.11 - getKeyset() - deeper level array with string vs false', (t) => {
  t.deepEqual(
    getKeyset([
      {
        a: false,
        b: {
          c: {
            d: ['eee'],
          },
        },
      },
      {
        a: false,
      },
    ]),
    {
      a: false,
      b: {
        c: {
          d: [],
        },
      },
    },
    '01.11 - if arrays contain any strings, result is empty array',
  )
})

test('01.12 - getKeyset() - two deeper level arrays with strings', (t) => {
  t.deepEqual(
    getKeyset([
      {
        a: false,
        b: {
          c: {
            d: ['eee'],
          },
        },
      },
      {
        b: {
          c: {
            d: ['eee', 'fff', 'ggg'],
          },
        },
      },
    ]),
    {
      a: false,
      b: {
        c: {
          d: [],
        },
      },
    },
    '01.12 - if arrays contain any strings, result is empty array',
  )
})

test('01.13 - getKeyset() - two deeper level arrays with mixed contents', (t) => {
  t.deepEqual(
    getKeyset([
      {
        a: false,
        b: {
          c: {
            d: ['eee'],
          },
        },
      },
      {
        b: {
          c: {
            d: [{ a: 'zzz' }],
          },
        },
      },
    ]),
    {
      a: false,
      b: {
        c: {
          d: [{ a: false }],
        },
      },
    },
    '01.13 - plain object vs string',
  )
})

test('01.14 - getKeyset() - two deeper level arrays with plain objects', (t) => {
  t.deepEqual(
    getKeyset([
      {
        a: false,
        b: {
          c: {
            d: [{ a: 'aaa' }],
          },
        },
      },
      {
        b: {
          c: {
            d: [{ b: 'bbb', c: 'ccc' }],
          },
        },
      },
      {
        b: {
          c: {
            d: false,
          },
        },
      },
      {
        b: {
          c: false,
        },
      },
    ]),
    {
      a: false,
      b: {
        c: {
          d: [{ a: false, b: false, c: false }],
        },
      },
    },
    '01.14.01 - object vs object',
  )
  t.deepEqual(
    getKeyset([
      {
        a: false,
        b: {
          c: {
            d: [],
          },
        },
      },
      {
        b: {
          c: {
            d: [{ b: 'bbb', c: 'ccc' }],
          },
        },
      },
    ]),
    {
      a: false,
      b: {
        c: {
          d: [{ b: false, c: false }],
        },
      },
    },
    '01.14.02 - object vs object',
  )
  t.deepEqual(
    getKeyset([
      {
        a: false,
        b: {
          c: {
            d: false,
          },
        },
      },
      {
        b: {
          c: {
            d: [{ b: 'bbb', c: 'ccc' }],
          },
        },
      },
    ]),
    {
      a: false,
      b: {
        c: {
          d: [{ b: false, c: false }],
        },
      },
    },
    '01.14.03 - object vs object',
  )
  t.deepEqual(
    getKeyset([
      {
        a: false,
        b: {
          c: {
            d: 'text',
          },
        },
      },
      {
        b: {
          c: {
            d: [{ b: 'bbb', c: 'ccc' }],
          },
        },
      },
    ]),
    {
      a: false,
      b: {
        c: {
          d: [{ b: false, c: false }],
        },
      },
    },
    '01.14.04 - object vs object',
  )
})

// -----------------------------------------------------------------------------
// 02. enforceKeyset()
// -----------------------------------------------------------------------------

test('02.01 - enforceKeyset() - enforces a simple schema', (t) => {
  schema = getKeyset([
    {
      a: 'aaa',
      b: 'bbb',
    },
    {
      a: 'ccc',
    },
  ])
  t.deepEqual(
    enforceKeyset(
      {
        a: 'ccc',
      },
      schema,
    ),
    {
      a: 'ccc',
      b: false,
    },
    '02.01',
  )
})

test('02.02 - enforceKeyset() - enforces a more complex schema', (t) => {
  obj1 = {
    b: [
      {
        c: 'ccc',
        d: 'ddd',
      },
    ],
    a: 'aaa',
  }
  obj2 = {
    a: 'ccc',
    e: 'eee',
  }
  obj3 = {
    a: 'zzz',
  }
  schema = getKeyset([
    obj1,
    obj2,
    obj3,
  ])
  t.deepEqual(
    schema,
    {
      a: false,
      b: [
        {
          c: false,
          d: false,
        },
      ],
      e: false,
    },
    '02.02 - .getKeyset',
  )
  t.deepEqual(
    enforceKeyset(
      obj1,
      schema,
    ),
    {
      a: 'aaa',
      b: [
        {
          c: 'ccc',
          d: 'ddd',
        },
      ],
      e: false,
    },
    '02.02.01 - .enforceKeyset',
  )
  t.deepEqual(
    enforceKeyset(
      obj2,
      schema,
    ),
    {
      a: 'ccc',
      b: [
        {
          c: false,
          d: false,
        },
      ],
      e: 'eee',
    },
    '02.02.02 - .enforceKeyset',
  )
  t.deepEqual(
    enforceKeyset(
      obj3,
      schema,
    ),
    {
      a: 'zzz',
      b: [
        {
          c: false,
          d: false,
        },
      ],
      e: false,
    },
    '02.02.03 - .enforceKeyset',
  )
})

test('02.03 - enforceKeyset() - enforces a schema involving arrays', (t) => {
  obj1 = {
    a: [
      {
        b: 'b',
      },
    ],
  }
  obj2 = {
    a: false,
  }
  schema = getKeyset([
    obj1,
    obj2,
  ])
  t.deepEqual(
    schema,
    {
      a: [
        {
          b: false,
        },
      ],
    },
    '02.03 - .getKeyset',
  )
  t.deepEqual(
    enforceKeyset(
      obj1,
      schema,
    ),
    {
      a: [
        {
          b: 'b',
        },
      ],
    },
    '02.03.01 - .enforceKeyset',
  )
  t.deepEqual(
    enforceKeyset(
      obj2,
      schema,
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    '02.03.02 - .enforceKeyset',
  )
})

test('02.04 - enforceKeyset() - another set involving arrays', (t) => {
  t.deepEqual(
    prepArray([
      {
        c: 'c val',
      },
      {
        b: [
          {
            b2: 'b2 val',
            b1: 'b1 val',
          },
        ],
        a: 'a val',
      },
    ]),
    [
      {
        a: false,
        b: [
          {
            b1: false,
            b2: false,
          },
        ],
        c: 'c val',
      },
      {
        a: 'a val',
        b: [
          {
            b1: 'b1 val',
            b2: 'b2 val',
          },
        ],
        c: false,
      },
    ],
    '02.04',
  )
})

test('02.05 - enforceKeyset() - deep-nested arrays', (t) => {
  t.deepEqual(
    prepArray([
      {
        a: [{
          b: [{
            c: [{
              d: [{
                e: [{
                  f: [{
                    g: [{
                      h: 'h',
                    }],
                  }],
                }],
              }],
            }],
          }],
        }],
      },
      {
        a: 'zzz',
      },
    ]),
    [
      {
        a: [{
          b: [{
            c: [{
              d: [{
                e: [{
                  f: [{
                    g: [{
                      h: 'h',
                    }],
                  }],
                }],
              }],
            }],
          }],
        }],
      },
      {
        a: [{
          b: [{
            c: [{
              d: [{
                e: [{
                  f: [{
                    g: [{
                      h: false,
                    }],
                  }],
                }],
              }],
            }],
          }],
        }],
      },
    ],
    '02.05',
  )
})

test('02.06 - enforceKeyset() - enforces a schema involving arrays', (t) => {
  obj1 = {
    a: [{
      b: 'b',
    }],
  }
  obj2 = {
    a: 'a',
  }
  schema = getKeyset([
    obj1,
    obj2,
  ])
  t.deepEqual(
    schema,
    {
      a: [{
        b: false,
      }],
    },
    '02.06.01 - .getKeyset',
  )
  t.deepEqual(
    enforceKeyset(
      obj1,
      schema,
    ),
    {
      a: [{
        b: 'b',
      }],
    },
    '02.06.02 - .enforceKeyset',
  )
  t.deepEqual(
    enforceKeyset(
      obj2,
      schema,
    ),
    {
      a: [{
        b: false,
      }],
    },
    '02.06.03 - .enforceKeyset',
  )
})

test('02.07 - enforceKeyset() - multiple objects within an array', (t) => {
  t.deepEqual(
    prepArray([
      {
        a: 'a',
      },
      {
        a: [
          {
            d: 'd',
          },
          {
            c: 'c',
          },
          {
            a: 'a',
          },
          {
            b: 'b',
          },
        ],
      },
    ]),
    [
      {
        a: [
          {
            a: false,
            b: false,
            c: false,
            d: false,
          },
        ],
      },
      {
        a: [
          {
            a: false,
            b: false,
            c: false,
            d: 'd',
          },
          {
            a: false,
            b: false,
            c: 'c',
            d: false,
          },
          {
            a: 'a',
            b: false,
            c: false,
            d: false,
          },
          {
            a: false,
            b: 'b',
            c: false,
            d: false,
          },
        ],
      },
    ],
    '02.07',
  )
})

test('02.08 - enforceKeyset() - multiple levels of arrays', (t) => {
  obj1 = {
    b: [
      {
        e: [
          {
            f: 'fff',
          },
          {
            g: 'ggg',
          },
        ],
        d: 'ddd',
        c: 'ccc',
      },
    ],
    a: 'aaa',
  }
  obj2 = {
    c: 'ccc',
    a: false,
  }
  t.deepEqual(
    prepArray([
      obj1,
      obj2,
    ]),
    [
      {
        a: 'aaa',
        b: [
          {
            c: 'ccc',
            d: 'ddd',
            e: [
              {
                f: 'fff',
                g: false,
              },
              {
                f: false,
                g: 'ggg',
              },
            ],
          },
        ],
        c: false,
      },
      {
        a: false,
        b: [
          {
            c: false,
            d: false,
            e: [
              {
                f: false,
                g: false,
              },
            ],
          },
        ],
        c: 'ccc',
      },
    ],
    '02.08',
  )
})

test('02.09 - enforceKeyset() - array vs string clashes', (t) => {
  t.deepEqual(
    prepArray([
      {
        a: 'aaa',
      },
      {
        a: [
          {
            b: 'bbb',
          },
        ],
      },
    ]),
    [
      {
        a: [
          {
            b: false,
          },
        ],
      },
      {
        a: [
          {
            b: 'bbb',
          },
        ],
      },
    ],
    '02.09',
  )
})

test('02.10 - enforceKeyset() - all inputs missing - throws', (t) => {
  t.throws(() => {
    enforceKeyset()
  })
})

test('02.11 - enforceKeyset() - second input arg missing - throws', (t) => {
  t.throws(() => {
    enforceKeyset({ a: 'a' })
  })
})

test('02.12 - enforceKeyset() - second input arg is not a plain obj - throws', (t) => {
  t.throws(() => {
    enforceKeyset({ a: 'a' }, 'zzz')
  })
})

test('02.13 - enforceKeyset() - first input arg is not a plain obj - throws', (t) => {
  t.throws(() => {
    enforceKeyset('zzz', 'zzz')
  })
})

test('02.14 - enforceKeyset() - array over empty array', (t) => {
  obj1 = {
    a: [
      {
        d: 'd',
      },
      {
        e: 'e',
      },
    ],
    c: 'c',
  }
  obj2 = {
    a: [],
    b: 'b',
  }
  schema = getKeyset([
    obj1,
    obj2,
  ])
  t.deepEqual(
    schema,
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: false,
      c: false,
    },
    '02.14.01',
  )
  t.deepEqual(
    enforceKeyset(
      obj1,
      schema,
    ),
    {
      a: [
        {
          d: 'd',
          e: false,
        },
        {
          d: false,
          e: 'e',
        },
      ],
      b: false,
      c: 'c',
    },
    '02.14.02',
  )
  t.deepEqual(
    enforceKeyset(
      obj2,
      schema,
    ),
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: 'b',
      c: false,
    },
    '02.14.03',
  )
})

// -----------------------------------------------------------------------------
// 03. guards against input arg mutation
// -----------------------------------------------------------------------------

test('03.01 - enforceKeyset() - does not mutate the input args', (t) => {
  obj1 = {
    b: [
      {
        e: [
          {
            f: 'fff',
          },
          {
            g: 'ggg',
          },
        ],
        d: 'ddd',
        c: 'ccc',
      },
    ],
    a: 'aaa',
  }
  obj2 = {
    c: 'ccc',
    a: false,
  }
  const dummyResult = enforceKeyset(obj2, getKeyset([obj1, obj2]))
  t.pass(dummyResult) // necessary to avoid unused vars
  t.deepEqual(
    obj2,
    {
      c: 'ccc',
      a: false,
    },
    '03.01',
  )
})

// -----------------------------------------------------------------------------
// 04. noNewKeys()
// -----------------------------------------------------------------------------

test('04.01 - noNewKeys() - BAU', (t) => {
  t.deepEqual(
    noNewKeys(
      {
        a: 'a',
        c: 'c',
      },
      {
        a: 'aaa',
        b: 'bbb',
        c: 'ccc',
      },
    ),
    [],
    '04.01.01 - no new keys',
  )
  t.deepEqual(
    noNewKeys(
      {
        a: 'a',
        b: 'b',
        c: 'c',
      },
      {
        a: 'aaa',
        c: 'ccc',
      },
    ),
    ['b'],
    '04.01.02 - new key, b',
  )
})

test('04.02 - noNewKeys() - objects within arrays within objects', (t) => {
  t.deepEqual(
    noNewKeys(
      {
        z: [
          {
            a: 'a',
            b: 'b',
            c: 'c',
          },
          {
            a: false,
            b: false,
            c: 'c',
          },
        ],
      },
      {
        z: [
          {
            a: 'a',
            b: 'b',
            c: 'c',
          },
          {
            a: false,
            b: false,
            c: 'c',
          },
        ],
      },
    ),
    [],
    '04.02.01 - same key set, just values differ',
  )
  t.deepEqual(
    noNewKeys(
      {
        z: [
          {
            a: 'a',
            b: 'b',
          },
          {
            a: false,
            b: false,
          },
        ],
      },
      {
        z: [
          {
            a: 'a',
            b: 'b',
            c: 'c',
          },
          {
            a: false,
            b: false,
            c: 'c',
          },
        ],
      },
    ),
    [],
    '04.02.02 - less keys',
  )
  t.deepEqual(
    noNewKeys(
      {
        z: [
          {
            a: 'a',
            b: 'b',
            c: 'c',
          },
          {
            a: false,
            b: false,
            c: 'c',
          },
        ],
      },
      {
        z: [
          {
            a: 'a',
            b: 'b',
          },
          {
            a: false,
            b: false,
          },
        ],
      },
    ),
    ['z[0].c', 'z[1].c'],
    '04.02.03 - key c',
  )
})

test('04.03 - noNewKeys() - various throws', (t) => {
  t.throws(() => {
    noNewKeys()
  })
  t.throws(() => {
    noNewKeys({ a: 'a' })
  })
  t.throws(() => {
    noNewKeys(1, { a: 'a' })
  })
  t.throws(() => {
    noNewKeys({ a: 'a' }, 1)
  })
  t.throws(() => {
    noNewKeys(['a'], ['a'])
  })
})

// -----------------------------------------------------------------------------
// 05. findUnused()
// -----------------------------------------------------------------------------

test('05.01 - findUnused() - single-level plain objects', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: false,
        b: 'bbb1',
        c: false,
      },
      {
        a: 'aaa',
        b: 'bbb2',
        c: false,
      },
    ]),
    ['c'],
    '05.01.01 - running on defaults',
  )
  t.deepEqual(
    findUnused([
      {
        a: false,
        b: 'bbb1',
        c: false,
      },
      {
        a: 'aaa',
        b: 'bbb2',
        c: false,
      },
      {},
    ]),
    ['c'],
    '05.01.02 - not normalised is fine as well',
  )
})

test('05.02 - findUnused() - multiple-level plain objects', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: [
          {
            k: false,
            l: false,
            m: false,
          },
          {
            k: 'k',
            l: false,
            m: 'm',
          },
        ],
        b: 'bbb1',
        c: false,
      },
      {
        a: [
          {
            k: 'k',
            l: false,
            m: 'm',
          },
          {
            k: 'k',
            l: false,
            m: 'm',
          },
        ],
        b: 'bbb2',
        c: false,
      },
    ]),
    ['c', 'a[0].l'],
    '05.02.01 - multiple levels, two objects, two unused keys, defaults',
  )
  t.deepEqual(
    findUnused([
      {
        a: [
          {
            k: false,
            l: false,
            m: false,
          },
          {
            k: 'k',
            l: false,
            m: 'm',
          },
        ],
        b: 'bbb1',
        c: false,
      },
      {
        a: [
          {
            k: 'k',
            l: false,
            m: 'm',
          },
          {
            k: 'k',
            l: false,
            m: 'm',
          },
        ],
        b: 'bbb2',
        c: false,
      },
      { b: false },
      { c: false },
    ]),
    ['c', 'a[0].l'],
    '05.02.02 - not normalised, see third and fourth args, not normalised objects',
  )
})

test('05.03 - findUnused() - double-nested arrays', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: [
          [
            {
              k: false,
              l: false,
              m: false,
            },
            {
              k: 'k',
              l: false,
              m: 'm',
            },
          ],
        ],
        b: 'bbb1',
        c: false,
      },
      {
        a: [
          [
            {
              k: false,
              l: 'l',
              m: 'm',
            },
            {
              k: false,
              l: 'l',
              m: 'm',
            },
          ],
        ],
        b: 'bbb2',
        c: false,
      },
    ]),
    ['c', 'a[0][0].l', 'a[0][1].k'],
    '05.03.01',
  )
  t.deepEqual(
    findUnused([
      {
        a: [
          [
            {
              k: false,
              l: false,
              m: false,
            },
            {
              k: 'k',
              l: false,
              m: 'm',
            },
          ],
        ],
        b: 'bbb1',
        c: false,
      },
      {
        a: [
          [
            {
              k: false,
              l: 'l',
              m: 'm',
            },
            {
              k: false,
              l: 'l',
              m: 'm',
            },
          ],
        ],
        b: 'bbb2',
        c: false,
      },
      {
        a: false,
      },
    ]),
    ['c', 'a[0][0].l', 'a[0][1].k'],
    '05.03.02 - value false vs values as arrays - in the context of unused-ness',
  )
})

test('05.04 - findUnused() - works on empty arrays', (t) => {
  t.deepEqual(
    findUnused([]),
    [],
    '05.04.01',
  )
  t.deepEqual(
    findUnused([{}]),
    [],
    '05.04.02',
  )
  t.deepEqual(
    findUnused([{}, {}]),
    [],
    '05.04.03',
  )
})

test('05.05 - findUnused() - various throws', (t) => {
  t.throws(() => {
    findUnused(1, { placeholder: false })
  })
  t.notThrows(() => {
    findUnused([1, 2, 3])
  })
  t.throws(() => {
    findUnused([{ a: 'a' }, { a: 'b' }], 1)
  })
})

test('05.06 - findUnused() - case of empty array within an array', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: [[]],
        b: 'bbb1',
        c: false,
      },
      {
        a: [[]],
        b: 'bbb2',
        c: false,
      },
    ]),
    ['c'],
    '05.06.01 - normal',
  )
  t.deepEqual(
    findUnused([
      {
        a: [[]],
        b: 'bbb1',
        c: false,
      },
      {
        a: [[]],
        b: 'bbb2',
        c: false,
      },
      {},
      {},
    ]),
    ['c'],
    '05.06.02 - not normalised',
  )
})

test('05.07 - findUnused() - case of empty array within an array', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: [[]],
        b: 'bbb1',
        c: false,
      },
    ]),
    [],
    '05.07.01 - normalised',
  )
  t.deepEqual(
    findUnused([
      {
        a: [[]],
        b: 'bbb1',
        c: false,
      },
      {},
      { a: false },
    ]),
    ['c'],
    '05.07.02 - not normalised. Now that there are three inputs (even two of them empty-ish) result is the key c',
  )
})

test('05.08 - findUnused() - objects containing objects (2 in total)', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: {
          x: false,
          y: 'y',
        },
        b: 'bbb1',
        c: false,
      },
      {
        a: {
          x: false,
          y: 'z',
        },
        b: 'bbb2',
        c: false,
      },
    ]),
    ['c', 'a.x'],
    '05.08.01',
  )
  t.deepEqual(
    findUnused([
      {
        a: {
          x: false,
          y: 'y',
        },
        b: 'bbb1',
        c: false,
        d: {
          y: 'y',
          x: false,
        },
        e: false,
      },
      {
        a: {
          x: false,
          y: 'z',
        },
        b: 'bbb2',
        c: false,
        d: {
          y: 'y',
          x: false,
        },
        e: false,
      },
    ]),
    ['c', 'e', 'a.x', 'd.x'],
    '05.08.02',
  )
  t.deepEqual(
    findUnused([
      {
        a: {
          x: false,
          y: 'y',
        },
        b: 'bbb1',
        c: false,
        d: {
          y: 'y',
          x: false,
        },
        e: false,
      },
      {
        a: {
          x: false,
          y: 'z',
        },
        b: 'bbb2',
        c: false,
        d: {
          y: 'y',
          x: false,
        },
        e: false,
      },
      { c: false },
    ]),
    ['c', 'e', 'a.x', 'd.x'],
    '05.08.03 - not normalised',
  )
})

test('05.09 - findUnused() - objects containing objects (3 in total)', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: {
          x: false,
          y: 'y',
          k: {
            l: false,
            m: 'zzz',
          },
        },
        b: 'bbb1',
        c: false,
      },
      {
        a: {
          x: false,
          y: 'z',
          k: {
            l: false,
            m: 'yyy',
          },
        },
        b: 'bbb2',
        c: false,
      },
    ]),
    ['c', 'a.x', 'a.k.l'],
    '05.09.01 - normalised, on default placeholder',
  )
  t.deepEqual(
    findUnused([
      {
        a: {
          x: false,
          y: 'y',
          k: {
            l: false,
            m: 'zzz',
          },
        },
        b: 'bbb1',
        c: false,
      },
      {
        a: {
          x: false,
          y: 'z',
          k: {
            l: false,
            m: 'yyy',
          },
        },
        b: 'bbb2',
        c: false,
      },
      {},
      { c: false },
    ]),
    ['c', 'a.x', 'a.k.l'],
    '05.09.02 - not normalised, on default placeholder',
  )
})

test('05.10 - findUnused() - objects containing objects, mixed with arrays', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: {
          x: false,
          y: 'y',
          k: {
            l: false,
            m: 'zzz',
            p: {
              r: [
                {
                  w: false,
                  x: 'zzz',
                },
                {
                  w: false,
                  x: 'zzz',
                },
              ],
            },
          },
        },
        b: 'bbb1',
        c: false,
      },
      {
        a: {
          x: false,
          y: 'z',
          k: {
            l: false,
            m: false,
            p: {
              r: [
                {
                  w: 'www',
                  x: false,
                },
                {
                  w: 'zzz',
                  x: false,
                },
              ],
            },
          },
        },
        b: 'bbb2',
        c: false,
      },
    ]),
    ['c', 'a.x', 'a.k.l'],
    '05.10.01',
  )
  t.deepEqual(
    findUnused([
      {
        a: {
          x: false,
          y: 'y',
          k: {
            l: false,
            m: 'zzz',
            p: {
              r: [
                {
                  w: 'xxx',
                  x: false,
                },
                {
                  w: 'w2',
                  x: false,
                },
              ],
            },
          },
        },
        b: 'bbb1',
        c: false,
      },
      {
        a: {
          x: false,
          y: 'z',
          k: {
            l: false,
            m: false,
            p: {
              r: [
                {
                  w: 'www',
                  x: false,
                },
                {
                  w: 'zzz',
                  x: false,
                },
              ],
            },
          },
        },
        b: 'bbb2',
        c: false,
      },
    ]),
    ['c', 'a.x', 'a.k.l', 'a.k.p.r[0].x'],
    '05.10.02 - even deeper',
  )
  t.deepEqual(
    findUnused([
      {
        a: {
          x: false,
          y: 'y',
          k: {
            l: false,
            m: 'zzz',
            p: {
              r: [
                {
                  w: 'xxx',
                  x: false,
                },
                {
                  w: 'w2',
                  x: false,
                },
              ],
            },
          },
        },
        b: 'bbb1',
        c: false,
      },
      {
        a: {
          x: false,
          y: 'z',
          k: {
            l: false,
            m: false,
            p: {
              r: [
                {
                  w: 'www',
                  x: false,
                },
                {
                  w: 'zzz',
                  x: false,
                },
                {},
              ],
            },
          },
        },
        b: 'bbb2',
        c: false,
      },
      {},
    ]),
    ['c', 'a.x', 'a.k.l', 'a.k.p.r[0].x'],
    '05.10.03 - even deeper plus not normalised in deeper levels',
  )
})

test('05.11 - findUnused() - array contents are not objects/arrays', (t) => {
  t.deepEqual(
    findUnused([
      false,
      false,
      false,
    ]),
    [],
    '05.11.01 - topmost level, Booleans',
  )
  t.deepEqual(
    findUnused([
      'zzz',
      'zzz',
      'zzz',
    ]),
    [],
    '05.11.02 - topmost level, strings',
  )
  t.deepEqual(
    findUnused([
      {},
      {},
      {},
    ]),
    [],
    '05.11.03 - topmost level, empty plain objects',
  )
})

test('05.12 - findUnused() - array > single object > array > unused inside', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: [
          {
            k: false,
            l: 'l1',
          },
          {
            k: false,
            l: 'l2',
          },
          {
            k: false,
            l: false,
          },
          {
            k: false,
            l: 'l4',
          },
        ],
        b: 'b',
      },
    ]),
    ['a[0].k'],
    '05.12.01 - topmost array has a single object',
  )
  t.deepEqual(
    findUnused([
      {
        a: [
          {
            k: false,
            l: 'l1',
          },
          {
            k: false,
            l: 'l2',
          },
          {
            k: false,
            l: false,
          },
          {
            k: false,
            l: 'l4',
          },
        ],
        b: 'b',
      },
      {
        a: [
          {
            k: false,
            l: 'l1',
          },
          {
            k: false,
            l: 'l2',
          },
          {
            k: false,
            l: false,
          },
          {
            k: false,
            l: 'l4',
          },
        ],
        b: 'b',
      },
    ]),
    ['a[0].k'],
    '05.12.02 - topmost array has multiple objects',
  )
})

test('05.13 - findUnused() - simple case of not normalised input', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: false,
        b: false,
        c: 'c',
      },
      {
        a: false,
        b: false,
        c: 'c',
      },
      {
        c: 'c',
      },
    ]),
    ['a', 'b'],
    '05.13 - default placeholder',
  )
})

test('05.14 - findUnused() - opts.comments', (t) => {
  t.deepEqual(
    findUnused([
      {
        a: false,
        b: 'bbb1',
        b__comment__this_is_a_comment_for_key_b: false,
        c: false,
      },
      {
        a: 'aaa',
        b: 'bbb2',
        b__comment__this_is_a_comment_for_key_b: false,
        c: false,
      },
    ]),
    ['c'],
    '05.14.01 - defaults recognise the comment substring within the key',
  )
  t.deepEqual(
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: 'zzz' },
    ),
    ['b__comment__this_is_a_comment_for_key_b', 'c'],
    '05.14.02 - ignores comment fields because they match default value',
  )
  t.deepEqual(
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: false },
    ),
    ['b__comment__this_is_a_comment_for_key_b', 'c'],
    '05.14.03 - falsey opts.comments - instruction to turn it off',
  )
  t.deepEqual(
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: 0 },
    ),
    ['b__comment__this_is_a_comment_for_key_b', 'c'],
    '05.14.04 - falsey opts.comments - instruction to turn it off',
  )
  t.deepEqual(
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: null },
    ),
    ['b__comment__this_is_a_comment_for_key_b', 'c'],
    '05.14.05 - falsey opts.comments - instruction to turn it off',
  )
  t.deepEqual(
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: undefined },
    ),
    ['b__comment__this_is_a_comment_for_key_b', 'c'],
    '05.14.06 - falsey opts.comments - instruction to turn it off',
  )
  t.deepEqual(
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: '' },
    ),
    ['b__comment__this_is_a_comment_for_key_b', 'c'],
    '05.14.07 - falsey opts.comments - instruction to turn it off',
  )
  t.throws(() => {
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: 1 },
    )
  })
  t.throws(() => {
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: '1' },
    )
  })
  t.throws(() => {
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: true },
    )
  })
  t.throws(() => {
    findUnused(
      [
        {
          a: false,
          b: 'bbb1',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
        {
          a: 'aaa',
          b: 'bbb2',
          b__comment__this_is_a_comment_for_key_b: false,
          c: false,
        },
      ],
      { comments: 'true' },
    )
  })
})

// -----------------------------------------------------------------------------
// 06. sortAllObjects()
// -----------------------------------------------------------------------------

test('06.01 - sortAllObjects() - plain object', (t) => {
  t.deepEqual(
    sortAllObjects({
      a: 'a',
      c: 'c',
      b: 'b',
    }),
    {
      a: 'a',
      b: 'b',
      c: 'c',
    },
    '06.01',
  )
})

test('06.02 - sortAllObjects() - non-sortable input types', (t) => {
  t.deepEqual(
    sortAllObjects(null),
    null,
    '06.02.01',
  )
  t.deepEqual(
    sortAllObjects(1),
    1,
    '06.02.02',
  )
  t.deepEqual(
    sortAllObjects('zzz'),
    'zzz',
    '06.02.03',
  )
  t.deepEqual(
    sortAllObjects(undefined),
    undefined,
    '06.02.04',
  )
  const f = a => a
  t.deepEqual(
    sortAllObjects(f),
    f,
    '06.02.05',
  )
})

test('06.03 - sortAllObjects() - object-array-object', (t) => {
  t.deepEqual(
    sortAllObjects({
      a: 'a',
      c: [
        {
          m: 'm',
          l: 'l',
          k: 'k',
        },
        {
          s: 's',
          r: 'r',
          p: 'p',
        },
      ],
      b: 'b',
    }),
    {
      a: 'a',
      b: 'b',
      c: [
        {
          k: 'k',
          l: 'l',
          m: 'm',
        },
        {
          p: 'p',
          r: 'r',
          s: 's',
        },
      ],
    },
    '06.03',
  )
})

test('06.04 - sortAllObjects() - object very deep', (t) => {
  t.deepEqual(
    sortAllObjects({
      a: [[[[[[[[[[[[[[{
        b: {
          c: [[[[[[
            {
              n: 'kdjfsjf;j',
              m: 'flslfjlsjdf',
            },
          ]]]]]],
        },
      }]]]]]]]]]]]]]],
    }),
    {
      a: [[[[[[[[[[[[[[{
        b: {
          c: [[[[[[
            {
              m: 'flslfjlsjdf',
              n: 'kdjfsjf;j',
            },
          ]]]]]],
        },
      }]]]]]]]]]]]]]],
    },
    '06.04',
  )
})

// -----------------------------------------------------------------------------
// 07. input arg mutation tests
// -----------------------------------------------------------------------------

/* eslint prefer-const:0 */
// we deliberately use VAR to "allow" mutation. In theory, of course, because it does not happen.

test('07.01 - does not mutate input args: enforceKeyset()', (t) => {
  let source = {
    a: 'a',
  }
  let frozen = {
    a: 'a',
  }
  let dummyResult = enforceKeyset(source, { a: false, b: false })
  t.pass(dummyResult) // a mickey assertion to trick the Standard
  t.deepEqual(source, frozen)
})

test('07.02 - does not mutate input args: noNewKeys()', (t) => {
  let source = {
    a: 'a',
  }
  let frozen = {
    a: 'a',
  }
  let dummyResult = noNewKeys(source, { a: false, b: false })
  t.pass(dummyResult) // a mickey assertion to trick ESLint to think it's used
  t.deepEqual(source, frozen)
})

test('07.03 - does not mutate input args: sortAllObjects()', (t) => {
  let source = {
    a: 'a',
    c: 'c',
    b: 'b',
  }
  let frozen = {
    a: 'a',
    c: 'c',
    b: 'b',
  }
  let dummyResult = sortAllObjects(source)
  t.pass(dummyResult) // a mickey assertion to trick ESLint to think it's used
  t.deepEqual(source, frozen)
})
