'use strict'

import { find, get, set, drop, info, del, arrayFirstOnly, traverse, existy } from './index'

import test from 'ava'
var actual, intended, key, val, index

var input = {
  a: {b: [{c: {d: 'e'}}]},
  c: {d: 'e'}
}
const isEqual = require('lodash.isequal')

// -----------------------------------------------------------------------------
// all throws
// -----------------------------------------------------------------------------

test('01.01 - find - throws when there\'s no input', t => {
  t.throws(function () {
    find()
  })
  t.throws(function () {
    find(null, {})
  })
})

test('01.02 - get -  throws when there\'s no input', t => {
  t.throws(function () {
    get()
  })
  t.throws(function () {
    get(null, {})
  })
})

test('01.03 - set -  throws when there\'s no input', t => {
  t.throws(function () {
    set()
  })
  t.throws(function () {
    set(null, {})
  })
})

test('01.04 - drop - throws when there\'s no input', t => {
  t.throws(function () {
    drop()
  })
  t.throws(function () {
    drop(null, {})
  })
})

test('01.05 - info - throws when there\'s no input', t => {
  t.throws(function () {
    info()
  })
  t.throws(function () {
    info(null, {})
  })
})

test('01.06 - get/set - throws when opts.index is missing', t => {
  t.throws(function () {
    get(input)
  })
  t.throws(function () {
    get(input, {a: 'a'})
  })
  t.throws(function () {
    set(input)
  })
  t.throws(function () {
    set(input, {a: 'a'})
  })
})

test('01.07 - set - throws when opts.key and opts.val are missing', t => {
  t.throws(function () {
    set(input, {index: '3'})
  })
})

test('01.08 - find - throws when opts.key and opts.val are missing', t => {
  t.throws(function () {
    find(input, {index: '3'})
  })
  t.throws(function () {
    find(input, {index: 3})
  })
})

test('01.09 - del - throws when opts.key and opts.val are missing', t => {
  t.throws(function () {
    del(input, {index: '3'})
  })
  t.throws(function () {
    del(input, {index: 3})
  })
})

test('01.10 - drop - throws when there\'s no index', t => {
  t.throws(function () {
    drop(['a'], 'a')
  })
  t.throws(function () {
    drop({a: 'a'}, {b: 'b'})
  })
})

// -----------------------------------------------------------------------------
// find
// -----------------------------------------------------------------------------

test('02.01 - finds by key in a simple object #1', t => {
  input = {
    a: {
      b: 'c'
    }
  }
  key = 'a'
  val = null
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 1,
      key: 'a',
      val: {
        'b': 'c'
      },
      path: [1]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.01.01')

  // absence of the second arg:
  actual = find(input, {key: key})
  t.deepEqual(
    actual,
    intended,
    '02.01.02')
})

test('02.02 - finds by key in a simple object #2', t => {
  input = {
    a: {
      b: 'c'
    }
  }
  key = 'b'
  val = null
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 2,
      key: 'b',
      val: 'c',
      path: [1, 2]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.02.01')

  // absence of the second arg:
  actual = find(input, {key: key})
  t.deepEqual(
    actual,
    intended,
    '02.02.02')
})

test('02.03 - does not find by key in a simple object', t => {
  input = {
    a: {
      b: 'c'
    }
  }
  key = 'z'
  val = null
  actual = find(input, {key: key})
  intended = null

  t.deepEqual(
    actual,
    intended,
    '02.03')
})

test('02.04 - finds by key in simple arrays #1', t => {
  input = ['a', [['b'], 'c']]
  key = 'a'
  actual = find(input, {key: key})
  intended = [
    {
      index: 1,
      key: 'a',
      val: null,
      path: [1]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.04')
})

test('02.05 - finds by key in simple arrays #2', t => {
  input = ['a', [['b'], 'c']]
  key = 'b'
  actual = find(input, {key: key})
  intended = [
    {
      index: 4,
      key: 'b',
      val: null,
      path: [2, 3, 4]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.05')
})

test('02.06 - finds by key in simple arrays #3', t => {
  input = ['a', [['b'], 'c']]
  key = 'c'
  actual = find(input, {key: key, val: null})
  intended = [
    {
      index: 5,
      key: 'c',
      val: null,
      path: [2, 5]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.06')
})

test('02.07 - does not find by key in simple arrays', t => {
  input = ['a', [['b'], 'c']]
  key = 'd'
  actual = find(input, {key: key})
  intended = null
  t.deepEqual(
    actual,
    intended,
    '02.07')
})

test('02.08 - finds by key in simple arrays #3', t => {
  input = ['a', [['b'], 'c']]
  key = 'c'
  actual = find(input, {key: key})
  intended = [
    {
      index: 5,
      key: 'c',
      val: null,
      path: [2, 5]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.08')
})

test('02.09 - finds by value in a simple object - string', t => {
  input = {
    a: {
      b: 'c'
    }
  }
  key = null
  val = 'c'
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 2,
      key: 'b',
      val: 'c',
      path: [1, 2]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.09')
})

test('02.10 - finds by value in a simple object - object', t => {
  input = {
    a: {
      b: 'c'
    }
  }
  key = null
  val = {b: 'c'}
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 1,
      key: 'a',
      val: {b: 'c'},
      path: [1]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.10')
})

test('02.11 - finds by value in a simple object - array', t => {
  input = {
    a: {
      b: ['c']
    }
  }
  key = null
  val = ['c']
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 2,
      key: 'b',
      val: ['c'],
      path: [1, 2]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.11')
})

test('02.12 - finds by value in a simple object - empty array', t => {
  input = {
    a: {
      b: [],
      c: []
    }
  }
  key = null
  val = []
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 2,
      key: 'b',
      val: [],
      path: [1, 2]
    },
    {
      index: 3,
      key: 'c',
      val: [],
      path: [1, 3]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.12')
})

test('02.13 - finds by value in a simple object - empty object', t => {
  input = {
    a: {
      b: {},
      c: {}
    }
  }
  key = null
  val = {}
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 2,
      key: 'b',
      val: {},
      path: [1, 2]
    },
    {
      index: 3,
      key: 'c',
      val: {},
      path: [1, 3]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.13')
})

test('02.14 - finds multiple nested keys by key and value in mixed #1', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    c: {d: 'e'}
  }
  key = 'c'
  val = {d: 'e'}
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 4,
      key: 'c',
      val: {
        'd': 'e'
      },
      'path': [1, 2, 3, 4]
    },
    {
      index: 6,
      key: 'c',
      val: {
        'd': 'e'
      },
      'path': [6]
    }
  ]
  t.deepEqual(
    actual,
    intended,
    '02.14')
})

test('02.15 - finds multiple nested keys by key and value in mixed #2', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    c: {d: ['d']}
  }
  key = 'd'
  val = null
  actual = find(input, {key: key, val: val})
  intended = [
    {
      index: 5,
      key: 'd',
      val: 'e',
      path: [1, 2, 3, 4, 5]
    },
    {
      index: 7,
      key: 'd',
      val: ['d'],
      path: [6, 7]
    },
    {
      index: 8,
      key: 'd',
      val: null,
      path: [6, 7, 8]
    }
  ]

  t.deepEqual(
    actual,
    intended,
    '02.15')
})

// -----------------------------------------------------------------------------
// get
// -----------------------------------------------------------------------------

test('03.01 - gets from a simple object #1', t => {
  input = {
    a: {
      b: 'c'
    }
  }
  index = 1
  actual = get(input, {index: index})
  intended = {
    a: {b: 'c'}
  }
  t.deepEqual(
    actual,
    intended,
    '03.01')
})

test('03.02 - gets from a simple object #2', t => {
  input = {
    a: {
      b: 'c'
    }
  }
  index = 2
  actual = get(input, {index: index})
  intended = {
    b: 'c'
  }
  t.deepEqual(
    actual,
    intended,
    '03.02')
})

test('03.03 - gets from a simple object #3', t => {
  input = {
    a: {
      b: ['c']
    }
  }
  index = 3
  actual = get(input, {index: index})
  intended = 'c'
  t.deepEqual(
    actual,
    intended,
    '03.03')
})

test('03.04 - does not get', t => {
  input = {
    a: {
      b: ['c']
    }
  }
  index = 4
  actual = get(input, {index: index})
  intended = null
  t.deepEqual(
    actual,
    intended,
    '03.04')
})

test('03.05 - gets from a simple array', t => {
  input = ['a', [['b'], 'c']]
  index = 4
  actual = get(input, {index: index})
  intended = 'b'
  t.deepEqual(
    actual,
    intended,
    '03.05')
})

test('03.06 - gets from mixed nested things, index string', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = '7'
  actual = get(input, {index: index})
  intended = {
    g: ['h']
  }

  t.deepEqual(
    actual,
    intended,
    '03.06')
})

// -----------------------------------------------------------------------------
// set
// -----------------------------------------------------------------------------

test('04.01 - sets in mixed nested things #1', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = '7'
  val = 'zzz'
  actual = set(input, {index: index, val: val})
  intended = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: 'zzz'}
  }

  t.deepEqual(
    actual,
    intended,
    '04.01')
})

test('04.02 - sets in mixed nested things #2', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = '8'
  val = 'zzz'
  actual = set(input, {index: index, val: val})
  intended = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['zzz']}
  }

  t.deepEqual(
    actual,
    intended,
    '04.02')
})

test('04.03 - does not set', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = '99'
  val = 'zzz'
  actual = set(input, {index: index, val: val})
  intended = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }

  t.deepEqual(
    actual,
    intended,
    '04.03')
})

test('04.04 - sets when only key given instead', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = '8'
  key = 'zzz'
  actual = set(input, {index: index, key: key})
  intended = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['zzz']}
  }

  t.deepEqual(
    actual,
    intended,
    '04.04')
})

// -----------------------------------------------------------------------------
// drop
// -----------------------------------------------------------------------------

test('05.01 - drops in mixed things #1 - index string', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = '8'
  actual = drop(input, {index: index})
  intended = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: []}
  }

  t.deepEqual(
    actual,
    intended,
    '05.01')
})

test('05.02 - drops in mixed things #2 - index number', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = 7
  actual = drop(input, {index: index})
  intended = {
    a: {b: [{c: {d: 'e'}}]},
    f: {}
  }

  t.deepEqual(
    actual,
    intended,
    '05.02')
})

test('05.03 - does not drop - zero', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = '0'
  actual = drop(input, {index: index})
  intended = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }

  t.deepEqual(
    actual,
    intended,
    '05.03')
})

test('05.04 - does not drop - 99', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  index = '99'
  actual = drop(input, {index: index})
  intended = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }

  t.deepEqual(
    actual,
    intended,
    '05.04')
})

// -----------------------------------------------------------------------------
// info
// -----------------------------------------------------------------------------

test('06.01 - info returns undefined', t => {
  input = {
    a: 'a'
  }
  actual = info(input)
  intended = {a: 'a'}

  t.deepEqual(
    actual,
    intended,
    '06.01')
})

// -----------------------------------------------------------------------------
// del
// -----------------------------------------------------------------------------

test('07.01 - deletes by key, multiple findings', t => {
  input = {
    a: {b: [{c: {d: 'e'}}]},
    c: {d: ['h']}
  }
  key = 'c'
  actual = del(input, {key: key})
  intended = {
    a: {b: [{}]}
  }

  t.deepEqual(
    actual,
    intended,
    '07.01')
})

test('07.02 - deletes by key, multiple findings at the same branch', t => {
  input = {
    a: {b: [{c: {c: 'e'}}]},
    c: {d: ['h']}
  }
  key = 'c'
  actual = del(input, {key: key})
  intended = {
    a: {b: [{}]}
  }

  t.deepEqual(
    actual,
    intended,
    '07.02')
})

test('07.03 - can\'t find any to delete by key', t => {
  input = {
    a: {b: [{c: {c: 'e'}}]},
    c: {d: ['h']}
  }
  key = 'zzz'
  actual = del(input, {key: key})
  intended = {
    a: {b: [{c: {c: 'e'}}]},
    c: {d: ['h']}
  }

  t.deepEqual(
    actual,
    intended,
    '07.03')
})

test('07.04 - deletes by value only from mixed', t => {
  input = {
    a: {b: [{ktjyklrjtyjlkl: {c: 'e'}}]},
    dflshgdlfgh: {c: 'e'}
  }
  val = {c: 'e'}
  actual = del(input, {val: val})
  intended = {
    a: {b: [{}]}
  }

  t.deepEqual(
    actual,
    intended,
    '07.04')
})

test('07.05 - deletes by value only from arrays', t => {
  input = ['a', 'b', 'c', ['a', ['b'], 'c']]
  key = 'b'
  actual = del(input, {key: key})
  intended = ['a', 'c', ['a', [], 'c']]

  t.deepEqual(
    actual,
    intended,
    '07.05')
})

test('07.06 - deletes by value only from arrays', t => {
  input = ['a', 'b', 'c', ['a', ['b'], 'c']]
  key = 'b'
  actual = del(input, {key: key})
  intended = ['a', 'c', ['a', [], 'c']]

  t.deepEqual(
    actual,
    intended,
    '07.06')
})

test('07.07 - deletes by key and value from mixed', t => {
  input = {
    a: {b: [{c: {d: {e: 'f'}}}]},
    f: {d: {zzz: 'f'}}
  }
  key = 'd'
  val = {e: 'f'}
  actual = del(input, {key: key, val: val})
  intended = {
    a: {b: [{c: {}}]},
    f: {d: {zzz: 'f'}}
  }

  t.deepEqual(
    actual,
    intended,
    '07.07')
})

test('07.08 - does not delete by key and value from arrays', t => {
  input = ['a', 'b', 'c', ['a', ['b'], 'c']]
  key = 'b'
  val = 'zzz'
  actual = del(input, {key: key, val: val})
  intended = ['a', 'b', 'c', ['a', ['b'], 'c']]

  t.deepEqual(
    actual,
    intended,
    '07.08')
})

test('07.09 - deletes by key and value from mixed', t => {
  input = {
    a: {
      b: '',
      c: 'd',
      e: 'f'
    }
  }
  key = 'b'
  val = ''
  actual = del(input, {key: key, val: val})
  intended = {
    a: {
      c: 'd',
      e: 'f'
    }
  }

  t.deepEqual(
    actual,
    intended,
    '07.09')
})

// -----------------------------------------------------------------------------
// arrayFirstOnly
// -----------------------------------------------------------------------------

test('08.01 - arrayFirstOnly - nested arrays', t => {
  input = {
    a: {b: ['c', 'd', 'e']},
    f: ['g', 'h']
  }

  actual = arrayFirstOnly(input)
  intended = {
    a: {b: ['c']},
    f: ['g']
  }

  t.deepEqual(
    actual,
    intended,
    '08.01')
})

test('08.02 - arrayFirstOnly — arrays within arrays only, no obj', t => {
  input = [
    ['a', 'b', 'c'],
    ['d', ['e']]
  ]
  actual = arrayFirstOnly(input)
  intended = [
    ['a']
  ]

  t.deepEqual(
    actual,
    intended,
    '08.02')
})

test('08.03 - arrayFirstOnly - nested arrays #2', t => {
  input = [
    {
      a: 'a'
    },
    {
      b: 'b'
    }
  ]
  actual = arrayFirstOnly(input)
  intended = [
    {
      a: 'a'
    }
  ]

  t.deepEqual(
    actual,
    intended,
    '08.03')
})

test('08.04 - arrayFirstOnly leaves objects alone', t => {
  input = {
    a: 'a',
    b: {
      c: 'c'
    }
  }
  actual = arrayFirstOnly(input)
  intended = {
    a: 'a',
    b: {
      c: 'c'
    }
  }

  t.deepEqual(
    actual,
    intended,
    '08.04')
})

test('08.05 - arrayFirstOnly leaves strings alone', t => {
  input = 'zzz'
  actual = arrayFirstOnly(input)
  intended = 'zzz'

  t.deepEqual(
    actual,
    intended,
    '08.05')
})

// -----------------------------------------------------------------------------
// traverse
// -----------------------------------------------------------------------------

test('09.01 - use traverse to delete one key from an array', t => {
  input = [
    {
      a: 'b'
    },
    {
      c: 'd'
    },
    {
      e: 'f'
    }
  ]

  var actual01 = traverse(input, function (key, val, innerObj) {
    var current = existy(val) ? val : key
    if (isEqual(current, { a: 'b' })) {
      return null
    } else {
      return current
    }
  })
  var intended01 = [
    {
      c: 'd'
    },
    {
      e: 'f'
    }
  ]
  t.deepEqual(
    actual01,
    intended01,
    '09.01.01')

  var actual02 = traverse(input, function (key, val, innerObj) {
    var current = existy(val) ? val : key
    if (isEqual(current, { c: 'd' })) {
      return null
    } else {
      return current
    }
  })
  var intended02 = [
    {
      a: 'b'
    },
    {
      e: 'f'
    }
  ]
  t.deepEqual(
    actual02,
    intended02,
    '09.01.02')

  var actual03 = traverse(input, function (key, val, innerObj) {
    var current = existy(val) ? val : key
    if (isEqual(current, { e: 'f' })) {
      return null
    } else {
      return current
    }
  })
  var intended03 = [
    {
      a: 'b'
    },
    {
      c: 'd'
    }
  ]
  t.deepEqual(
    actual03,
    intended03,
    '09.01.03')
})

test('09.02 - use traverse, passing null, write over objects within an array/delete them', t => {
  input = [
    {
      a: 'b'
    },
    {
      a: 'b'
    },
    {
      c: 'd'
    }
  ]

  var actual01 = traverse(input, function (key, val, innerObj) {
    // console.log('\n\n------\n')
    // console.log('key = ' + JSON.stringify(key, null, 4))
    // console.log('val = ' + JSON.stringify(val, null, 4))
    var current = existy(val) ? val : key
    if (isEqual(current, { a: 'b' })) {
      // console.log('returning null')
      return null
    } else {
      // console.log('returning current: ' + JSON.stringify(current, null, 4))
      return current
    }
  })
  var intended01 = [
    {
      c: 'd'
    }
  ]
  t.deepEqual(
    actual01,
    intended01,
    '09.02.01')

  var actual02 = traverse(input, function (key, val, innerObj) {
    var current = existy(val) ? val : key
    if (isEqual(current, { a: 'b' })) {
      // console.log('returning null')
      return null
    } else {
      // console.log('returning current: ' + JSON.stringify(current, null, 4))
      return current
    }
  }, { nullDeletes: false })
  var intended02 = [
    null,
    null,
    {
      c: 'd'
    }
  ]
  t.deepEqual(
    actual02,
    intended02,
    '09.02.02')
})

test('09.03 - use traverse, passing null, write over values', t => {
  input = [
    {
      a: 'b'
    },
    {
      a: 'b'
    },
    {
      c: 'd'
    }
  ]

  var actual01 = traverse(input, function (key, val, innerObj) {
    // console.log('\n\n------\n')
    // console.log('key = ' + JSON.stringify(key, null, 4))
    // console.log('val = ' + JSON.stringify(val, null, 4))
    var current = existy(val) ? val : key
    if (current === 'b') {
      // console.log('returning null')
      return null
    } else {
      // console.log('returning current: ' + JSON.stringify(current, null, 4))
      return current
    }
  }, { nullDeletes: false })
  var intended01 = [
    {
      a: null
    },
    {
      a: null
    },
    {
      c: 'd'
    }
  ]
  t.deepEqual(
    actual01,
    intended01,
    '09.03')
})

test('09.04 - traverse() throws when opts.nullDeletes are not Boolean', t => {
  t.throws(function () {
    traverse({a: 'a'}, function (key, val, innerObj) {
      var current = existy(val) ? val : key
      return current
    }, 1)
  })
  t.throws(function () {
    traverse({a: 'a'}, function (key, val, innerObj) {
      var current = existy(val) ? val : key
      return current
    }, 'true')
  })
  t.throws(function () {
    traverse({a: 'a'}, function (key, val, innerObj) {
      var current = existy(val) ? val : key
      return current
    }, true)
  })
  t.notThrows(function () {
    traverse({a: 'a'}, function (key, val, innerObj) {
      var current = existy(val) ? val : key
      return current
    }, {nullDeletes: true})
  })
  t.notThrows(function () {
    traverse({a: 'a'}, function (key, val, innerObj) {
      var current = existy(val) ? val : key
      return current
    }, {nullDeletes: false})
  })
  t.throws(function () {
    traverse({a: 'a'}, function (key, val, innerObj) {
      var current = existy(val) ? val : key
      return current
    }, {nullDeletes: 'false'})
  })
  t.throws(function () {
    traverse({a: 'a'}, function (key, val, innerObj) {
      var current = existy(val) ? val : key
      return current
    }, {nullDeletes: [false]})
  })
})
