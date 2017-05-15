'use strict'

import { getKeyset, enforceKeyset, noNewKeys } from './index'
import test from 'ava'
var schema, obj1, obj2, obj3, dummyResult

function prepArray (arr) {
  var keySet = getKeyset(arr)
  var res = []
  arr.forEach(function (obj) {
    // console.log('obj = ' + JSON.stringify(obj, null, 4))
    // console.log('keySet = ' + JSON.stringify(keySet, null, 4))
    res.push(enforceKeyset(obj, keySet))
  })
  return res
}

// -----------------------------------------------------------------------------
// 01. getKeyset()
// -----------------------------------------------------------------------------

test('01.01 - getKeyset() - throws when there\'s no input', t => {
  t.throws(function () {
    getKeyset()
  })
})

test('01.02 - getKeyset() - throws when input is not an array', t => {
  t.throws(function () {
    getKeyset('aa')
  })
})

test('01.03 - getKeyset() - throws when input array is empty', t => {
  t.throws(function () {
    getKeyset([])
  })
})

test('01.04 - getKeyset() - throws when input array contains not only plain objects', t => {
  t.throws(function () {
    getKeyset([
      {
        a: 'a',
        b: 'b'
      },
      {
        a: 'a'
      },
      'zzzz'
    ])
  })
})

test('01.05 - getKeyset() - calculates - three objects - default placeholder', t => {
  t.deepEqual(
    getKeyset([
      {
        a: 'a',
        b: 'c',
        c: {
          d: 'd',
          e: 'e'
        }
      },
      {
        a: 'a'
      },
      {
        c: {
          f: 'f'
        }
      }
    ]),
    {
      a: false,
      b: false,
      c: {
        d: false,
        e: false,
        f: false
      }
    },
    '01.05'
  )
})

test('01.06 - getKeyset() - calculates - three objects - custom placeholder', t => {
  t.deepEqual(
    getKeyset([
      {
        a: 'a',
        b: 'c',
        c: {
          d: 'd',
          e: 'e'
        }
      },
      {
        a: 'a'
      },
      {
        c: {
          f: 'f'
        }
      }
    ], { placeholder: true }),
    {
      a: true,
      b: true,
      c: {
        d: true,
        e: true,
        f: true
      }
    },
    '01.06.01'
  )
  t.deepEqual(
    getKeyset([
      {
        a: 'a',
        b: 'c',
        c: {
          d: 'd',
          e: 'e'
        }
      },
      {
        a: 'a'
      },
      {
        c: {
          f: 'f'
        }
      }
    ], { placeholder: '' }),
    {
      a: '',
      b: '',
      c: {
        d: '',
        e: '',
        f: ''
      }
    },
    '01.06.02'
  )
  t.deepEqual(
    getKeyset([
      {
        a: 'a',
        b: 'c',
        c: {
          d: 'd',
          e: 'e'
        }
      },
      {
        a: 'a'
      },
      {
        c: {
          f: 'f'
        }
      }
    ], { placeholder: { a: 'a' } }),
    {
      a: { a: 'a' },
      b: { a: 'a' },
      c: {
        d: { a: 'a' },
        e: { a: 'a' },
        f: { a: 'a' }
      }
    },
    '01.06.03'
  )
})

test('01.07 - getKeyset() - settings argument is not a plain object - throws', t => {
  t.throws(function () {
    getKeyset([{a: 'a'}, {b: 'b'}], 'zzz')
  })
})

test('01.08 - getKeyset() - multiple levels of nested arrays', t => {
  t.deepEqual(
    getKeyset([
      {
        'key2': [
          {
            'key5': 'val5',
            'key4': 'val4',
            'key6': [
              {
                'key8': 'val8'
              },
              {
                'key7': 'val7'
              }
            ]
          }
        ],
        'key1': 'val1'
      },
      {
        'key1': false,
        'key3': 'val3'
      }
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
              key8: false
            }
          ]
        }
      ],
      key3: false
    },
    '01.08'
  )
})

test('01.09 - getKeyset() - objects that are directly in values', t => {
  t.deepEqual(
    getKeyset([
      {
        a: {
          b: 'c',
          d: 'e'
        },
        k: 'l'
      },
      {
        a: {
          f: 'g',
          b: 'c',
          h: 'i'
        },
        m: 'n'
      }
    ]),
    {
      a: {
        b: false,
        d: false,
        f: false,
        h: false
      },
      k: false,
      m: false
    },
    '01.09.01'
  )
  t.deepEqual(
    getKeyset([
      {
        a: {
          f: 'g',
          b: 'c',
          h: 'i'
        },
        m: 'n'
      },
      {
        a: {
          b: 'c',
          d: 'e'
        },
        k: 'l'
      }
    ]),
    {
      a: {
        b: false,
        d: false,
        f: false,
        h: false
      },
      k: false,
      m: false
    },
    '01.09.02'
  )
})

test('01.10 - getKeyset() - deeper level arrays containing only strings', t => {
  t.deepEqual(
    getKeyset([
      {
        'a': false,
        'b': {
          'c': {
            'd': ['eee']
          }
        }
      },
      {
        'a': false
      }
    ]),
    {
      'a': false,
      'b': {
        'c': {
          'd': []
        }
      }
    },
    '01.10.01'
  )
})

test('01.11 - getKeyset() - deeper level array with string vs false', t => {
  t.deepEqual(
    getKeyset([
      {
        'a': false,
        'b': {
          'c': {
            'd': ['eee']
          }
        }
      },
      {
        'a': false
      }
    ]),
    {
      'a': false,
      'b': {
        'c': {
          'd': []
        }
      }
    },
    '01.11 - if arrays contain any strings, result is empty array'
  )
})

test('01.12 - getKeyset() - two deeper level arrays with strings', t => {
  t.deepEqual(
    getKeyset([
      {
        'a': false,
        'b': {
          'c': {
            'd': ['eee']
          }
        }
      },
      {
        'b': {
          'c': {
            'd': ['eee', 'fff', 'ggg']
          }
        }
      }
    ]),
    {
      'a': false,
      'b': {
        'c': {
          'd': []
        }
      }
    },
    '01.12 - if arrays contain any strings, result is empty array'
  )
})

test('01.13 - getKeyset() - two deeper level arrays with mixed contents', t => {
  t.deepEqual(
    getKeyset([
      {
        'a': false,
        'b': {
          'c': {
            'd': ['eee']
          }
        }
      },
      {
        'b': {
          'c': {
            'd': [{a: 'zzz'}]
          }
        }
      }
    ]),
    {
      'a': false,
      'b': {
        'c': {
          'd': [{a: false}]
        }
      }
    },
    '01.13 - plain object vs string'
  )
})

test('01.14 - getKeyset() - two deeper level arrays with plain objects', t => {
  t.deepEqual(
    getKeyset([
      {
        'a': false,
        'b': {
          'c': {
            'd': [{a: 'aaa'}]
          }
        }
      },
      {
        'b': {
          'c': {
            'd': [{b: 'bbb', c: 'ccc'}]
          }
        }
      },
      {
        'b': {
          'c': {
            'd': false
          }
        }
      },
      {
        'b': {
          'c': false
        }
      }
    ]),
    {
      'a': false,
      'b': {
        'c': {
          'd': [{a: false, b: false, c: false}]
        }
      }
    },
    '01.14.01 - object vs object'
  )
  t.deepEqual(
    getKeyset([
      {
        'a': false,
        'b': {
          'c': {
            'd': []
          }
        }
      },
      {
        'b': {
          'c': {
            'd': [{b: 'bbb', c: 'ccc'}]
          }
        }
      }
    ]),
    {
      'a': false,
      'b': {
        'c': {
          'd': [{b: false, c: false}]
        }
      }
    },
    '01.14.02 - object vs object'
  )
  t.deepEqual(
    getKeyset([
      {
        'a': false,
        'b': {
          'c': {
            'd': false
          }
        }
      },
      {
        'b': {
          'c': {
            'd': [{b: 'bbb', c: 'ccc'}]
          }
        }
      }
    ]),
    {
      'a': false,
      'b': {
        'c': {
          'd': [{b: false, c: false}]
        }
      }
    },
    '01.14.03 - object vs object'
  )
  t.deepEqual(
    getKeyset([
      {
        'a': false,
        'b': {
          'c': {
            'd': 'text'
          }
        }
      },
      {
        'b': {
          'c': {
            'd': [{b: 'bbb', c: 'ccc'}]
          }
        }
      }
    ]),
    {
      'a': false,
      'b': {
        'c': {
          'd': [{b: false, c: false}]
        }
      }
    },
    '01.14.04 - object vs object'
  )
})

// -----------------------------------------------------------------------------
// 02. enforceKeyset()
// -----------------------------------------------------------------------------

test('02.01 - enforceKeyset() - enforces a simple schema', t => {
  schema = getKeyset([
    {
      a: 'aaa',
      b: 'bbb'
    },
    {
      a: 'ccc'
    }
  ])
  t.deepEqual(
    enforceKeyset(
      {
        a: 'ccc'
      },
      schema
    ),
    {
      a: 'ccc',
      b: false
    },
    '02.01'
  )
})

test('02.02 - enforceKeyset() - enforces a more complex schema', t => {
  obj1 = {
    b: [
      {
        c: 'ccc',
        d: 'ddd'
      }
    ],
    a: 'aaa'
  }
  obj2 = {
    a: 'ccc',
    e: 'eee'
  }
  obj3 = {
    a: 'zzz'
  }
  schema = getKeyset([
    obj1,
    obj2,
    obj3
  ])
  t.deepEqual(
    schema,
    {
      a: false,
      b: [
        {
          c: false,
          d: false
        }
      ],
      e: false
    },
    '02.02 - .getKeyset'
  )
  t.deepEqual(
    enforceKeyset(
      obj1,
      schema
    ),
    {
      a: 'aaa',
      b: [
        {
          c: 'ccc',
          d: 'ddd'
        }
      ],
      e: false
    },
    '02.02.01 - .enforceKeyset'
  )
  t.deepEqual(
    enforceKeyset(
      obj2,
      schema
    ),
    {
      a: 'ccc',
      b: [
        {
          c: false,
          d: false
        }
      ],
      e: 'eee'
    },
    '02.02.02 - .enforceKeyset'
  )
  t.deepEqual(
    enforceKeyset(
      obj3,
      schema
    ),
    {
      a: 'zzz',
      b: [
        {
          c: false,
          d: false
        }
      ],
      e: false
    },
    '02.02.03 - .enforceKeyset'
  )
})

test('02.03 - enforceKeyset() - enforces a schema involving arrays', t => {
  obj1 = {
    'a': [
      {
        'b': 'b'
      }
    ]
  }
  obj2 = {
    'a': false
  }
  schema = getKeyset([
    obj1,
    obj2
  ])
  t.deepEqual(
    schema,
    {
      'a': [
        {
          'b': false
        }
      ]
    },
    '02.03 - .getKeyset'
  )
  t.deepEqual(
    enforceKeyset(
      obj1,
      schema
    ),
    {
      'a': [
        {
          'b': 'b'
        }
      ]
    },
    '02.03.01 - .enforceKeyset'
  )
  t.deepEqual(
    enforceKeyset(
      obj2,
      schema
    ),
    {
      'a': [
        {
          'b': false
        }
      ]
    },
    '02.03.02 - .enforceKeyset'
  )
})

test('02.04 - enforceKeyset() - another set involving arrays', function (t) {
  t.deepEqual(prepArray(
    [
      {
        'c': 'c val'
      },
      {
        'b': [
          {
            'b2': 'b2 val',
            'b1': 'b1 val'
          }
        ],
        'a': 'a val'
      }
    ]),
    [
      {
        'a': false,
        'b': [
          {
            'b1': false,
            'b2': false
          }
        ],
        'c': 'c val'
      },
      {
        'a': 'a val',
        'b': [
          {
            'b1': 'b1 val',
            'b2': 'b2 val'
          }
        ],
        'c': false
      }
    ],
    '02.04'
  )
})

test('02.05 - enforceKeyset() - deep-nested arrays', function (t) {
  t.deepEqual(prepArray(
    [
      {
        a: [{
          b: [{
            c: [{
              d: [{
                e: [{
                  f: [{
                    g: [{
                      h: 'h'
                    }]
                  }]
                }]
              }]
            }]
          }]
        }]
      },
      {
        a: 'zzz'
      }
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
                      h: 'h'
                    }]
                  }]
                }]
              }]
            }]
          }]
        }]
      },
      {
        a: [{
          b: [{
            c: [{
              d: [{
                e: [{
                  f: [{
                    g: [{
                      h: false
                    }]
                  }]
                }]
              }]
            }]
          }]
        }]
      }
    ],
    '02.05'
  )
})

test('02.06 - enforceKeyset() - enforces a schema involving arrays', t => {
  obj1 = {
    a: [{
      b: 'b'
    }]
  }
  obj2 = {
    'a': 'a'
  }
  schema = getKeyset([
    obj1,
    obj2
  ])
  t.deepEqual(
    schema,
    {
      a: [{
        b: false
      }]
    },
    '02.06.01 - .getKeyset'
  )
  t.deepEqual(
    enforceKeyset(
      obj1,
      schema
    ),
    {
      a: [{
        b: 'b'
      }]
    },
    '02.06.02 - .enforceKeyset'
  )
  t.deepEqual(
    enforceKeyset(
      obj2,
      schema
    ),
    {
      a: [{
        b: false
      }]
    },
    '02.06.03 - .enforceKeyset'
  )
})

test('02.07 - enforceKeyset() - multiple objects within an array', function (t) {
  t.deepEqual(prepArray(
    [
      {
        a: 'a'
      },
      {
        a: [
          {
            d: 'd'
          },
          {
            c: 'c'
          },
          {
            a: 'a'
          },
          {
            b: 'b'
          }
        ]
      }
    ]),
    [
      {
        a: [
          {
            a: false,
            b: false,
            c: false,
            d: false
          }
        ]
      },
      {
        a: [
          {
            a: false,
            b: false,
            c: false,
            d: 'd'
          },
          {
            a: false,
            b: false,
            c: 'c',
            d: false
          },
          {
            a: 'a',
            b: false,
            c: false,
            d: false
          },
          {
            a: false,
            b: 'b',
            c: false,
            d: false
          }
        ]
      }
    ],
    '02.07'
  )
})

test('02.08 - enforceKeyset() - multiple levels of arrays', function (t) {
  obj1 = {
    'b': [
      {
        'e': [
          {
            'f': 'fff'
          },
          {
            'g': 'ggg'
          }
        ],
        'd': 'ddd',
        'c': 'ccc'
      }
    ],
    'a': 'aaa'
  }
  obj2 = {
    'c': 'ccc',
    'a': false
  }
  t.deepEqual(prepArray(
    [
      obj1,
      obj2
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
                g: false
              },
              {
                f: false,
                g: 'ggg'
              }
            ]
          }
        ],
        c: false
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
                g: false
              }
            ]
          }
        ],
        c: 'ccc'
      }
    ],
    '02.08'
  )
})

test('02.09 - enforceKeyset() - array vs string clashes', function (t) {
  t.deepEqual(prepArray(
    [
      {
        a: 'aaa'
      },
      {
        a: [
          {
            b: 'bbb'
          }
        ]
      }
    ]),
    [
      {
        a: [
          {
            b: false
          }
        ]
      },
      {
        a: [
          {
            b: 'bbb'
          }
        ]
      }
    ],
    '02.09'
  )
})

test('02.10 - enforceKeyset() - all inputs missing - throws', t => {
  t.throws(function () {
    enforceKeyset()
  })
})

test('02.11 - enforceKeyset() - second input arg missing - throws', t => {
  t.throws(function () {
    enforceKeyset({a: 'a'})
  })
})

test('02.12 - enforceKeyset() - second input arg is not a plain obj - throws', t => {
  t.throws(function () {
    enforceKeyset({a: 'a'}, 'zzz')
  })
})

test('02.13 - enforceKeyset() - first input arg is not a plain obj - throws', t => {
  t.throws(function () {
    enforceKeyset('zzz', 'zzz')
  })
})

test('02.14 - enforceKeyset() - array over empty array', function (t) {
  obj1 = {
    'a': [
      {
        'd': 'd'
      },
      {
        'e': 'e'
      }
    ],
    'c': 'c'
  }
  obj2 = {
    'a': [],
    'b': 'b'
  }
  schema = getKeyset([
    obj1,
    obj2
  ])
  t.deepEqual(
    schema,
    {
      'a': [
        {
          'd': false,
          'e': false
        }
      ],
      'b': false,
      'c': false
    },
    '02.14.01'
  )
  t.deepEqual(
    enforceKeyset(
      obj1,
      schema
    ),
    {
      'a': [
        {
          'd': 'd',
          'e': false
        },
        {
          'd': false,
          'e': 'e'
        }
      ],
      'b': false,
      'c': 'c'
    },
    '02.14.02'
  )
  t.deepEqual(
    enforceKeyset(
      obj2,
      schema
    ),
    {
      'a': [
        {
          'd': false,
          'e': false
        }
      ],
      'b': 'b',
      'c': false
    },
    '02.14.03'
  )
})

// -----------------------------------------------------------------------------
// 03. guards against input arg mutation
// -----------------------------------------------------------------------------

test('03.01 - enforceKeyset() - does not mutate the input args', function (t) {
  obj1 = {
    'b': [
      {
        'e': [
          {
            'f': 'fff'
          },
          {
            'g': 'ggg'
          }
        ],
        'd': 'ddd',
        'c': 'ccc'
      }
    ],
    'a': 'aaa'
  }
  obj2 = {
    'c': 'ccc',
    'a': false
  }
  dummyResult = enforceKeyset(obj2, getKeyset([obj1, obj2]))
  t.pass(dummyResult) // necessary to avoid unused vars
  t.deepEqual(
    obj2,
    {
      'c': 'ccc',
      'a': false
    },
    '03.01'
  )
})

// -----------------------------------------------------------------------------
// 04. noNewKeys()
// -----------------------------------------------------------------------------

test('04.01 - noNewKeys() - BAU', function (t) {
  t.deepEqual(
    noNewKeys(
      {
        a: 'a',
        c: 'c'
      },
      {
        a: 'aaa',
        b: 'bbb',
        c: 'ccc'
      }
    ),
    [],
    '04.01.01 - no new keys'
  )
  t.deepEqual(
    noNewKeys(
      {
        a: 'a',
        b: 'b',
        c: 'c'
      },
      {
        a: 'aaa',
        c: 'ccc'
      }
    ),
    ['b'],
    '04.01.02 - new key, b'
  )
})

test('04.02 - noNewKeys() - objects within arrays within objects', function (t) {
  t.deepEqual(
    noNewKeys(
      {
        z: [
          {
            a: 'a',
            b: 'b',
            c: 'c'
          },
          {
            a: false,
            b: false,
            c: 'c'
          }
        ]
      },
      {
        z: [
          {
            a: 'a',
            b: 'b',
            c: 'c'
          },
          {
            a: false,
            b: false,
            c: 'c'
          }
        ]
      }
    ),
    [],
    '04.02.01 - same key set, just values differ'
  )
  t.deepEqual(
    noNewKeys(
      {
        z: [
          {
            a: 'a',
            b: 'b'
          },
          {
            a: false,
            b: false
          }
        ]
      },
      {
        z: [
          {
            a: 'a',
            b: 'b',
            c: 'c'
          },
          {
            a: false,
            b: false,
            c: 'c'
          }
        ]
      }
    ),
    [],
    '04.02.02 - less keys'
  )
  t.deepEqual(
    noNewKeys(
      {
        z: [
          {
            a: 'a',
            b: 'b',
            c: 'c'
          },
          {
            a: false,
            b: false,
            c: 'c'
          }
        ]
      },
      {
        z: [
          {
            a: 'a',
            b: 'b'
          },
          {
            a: false,
            b: false
          }
        ]
      }
    ),
    ['z[0].c', 'z[1].c'],
    '04.02.03 - key c'
  )
})

test('04.03 - noNewKeys() - various throws', t => {
  t.throws(function () {
    noNewKeys()
  })
  t.throws(function () {
    noNewKeys({a: 'a'})
  })
  t.throws(function () {
    noNewKeys(1, {a: 'a'})
  })
  t.throws(function () {
    noNewKeys({a: 'a'}, 1)
  })
  t.throws(function () {
    noNewKeys(['a'], ['a'])
  })
})
