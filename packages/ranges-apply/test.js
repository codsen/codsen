'use strict'

import repl from './index'
import test from 'ava'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - wrong inputs', t => {
  // no input
  t.throws(function () {
    repl()
  })

  // first arg not string
  t.throws(function () {
    repl(1)
  })

  // second arg not array
  t.throws(function () {
    repl('aaa', 1)
  })

  // third arg not a plain obj
  t.throws(function () {
    repl('aaa', [], 1)
  })
  t.throws(function () {
    repl('aaa', [], 'a')
  })
  t.throws(function () {
    repl('aaa', [], ['a'])
  })
  t.throws(function () {
    repl('aaa', [], true)
  })

  // ranges array contain something else than arrays
  t.throws(function () {
    repl('aaa', [1], {})
  })
  t.throws(function () {
    repl('aaa', [[1, 'a']], {})
  })
  t.notThrows(function () {
    repl('aaa', [['1', 2]], {})
  })
  t.notThrows(function () {
    repl('aaa', [[1, '2']], {})
  })
  t.notThrows(function () {
    repl('aaa', [[1, '2'], ['3', '4']], {})
  })
  t.notThrows(function () {
    repl('aaa', [[1, 2]], {})
  })
  t.throws(function () {
    repl('aaa', [[1], [10, 20]], {})
  })
  t.throws(function () {
    repl('aaa', [[10, 20], [30]], {})
  })
  t.throws(function () {
    repl('aaa', [[10.1, 20]], {})
  })
  t.throws(function () {
    repl('aaa', [['10.1', '20']], {})
  })
})

test('01.02 - correct inputs', t => {
  // all inputs can be empty as long as types are correct
  t.notThrows(function () {
    repl('', [], {})
  })

  // opts can be falsey, the absence being hardcoded
  t.notThrows(function () {
    repl('', [], null)
  })
  t.notThrows(function () {
    repl('', [], undefined)
  })
})

// -----------------------------------------------------------------------------
// 02. normal use, no opts
// -----------------------------------------------------------------------------

test('02.01 - deletes multiple chunks correctly', function (t) {
  let str = 'aaa delete me bbb and me too ccc'
  // console.log('\n===============\n02.01')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  t.deepEqual(
    repl(
      str,
      [
        [4, 14],
        [18, 29]
      ]
    ),
    'aaa bbb ccc',
    '02.01'
  )
})

test('02.02 - replaces multiple chunks correctly', function (t) {
  let str = 'aaa delete me bbb and me too ccc'
  // console.log('\n===============\n02.02')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.deepEqual(
    repl(
      str,
      [
        [4, 13, 'zzz'],
        [18, 28, 'yyy']
      ]
    ),
    'aaa zzz bbb yyy ccc',
    '02.02'
  )
})

test('02.03 - deletes and replaces multiple chunks correctly', function (t) {
  let str = 'aaa delete me bbb replace me ccc'
  // console.log('\n===============\n02.03')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.deepEqual(
    repl(
      str,
      [
        [4, 13],
        [18, 28, 'zzz']
      ]
    ),
    'aaa  bbb zzz ccc',
    '02.03'
  )
})

test('02.04 - empty ranges array', function (t) {
  t.deepEqual(
    repl(
      'some text',
      []
    ),
    'some text',
    '02.04'
  )
})

test('02.05 - deletes multiple chunks with zero indexes correctly', function (t) {
  let str = 'delete me bbb and me too ccc'
  // console.log('\n===============\n02.05')
  // console.log('slice 1: >>>' + str.slice(0, 10) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  t.deepEqual(
    repl(
      str,
      [
        [0, 10],
        [14, 25]
      ]
    ),
    'bbb ccc',
    '02.05'
  )
})

test('02.06 - replaces multiple chunks with zero indexes correctly', function (t) {
  let str = 'delete me bbb and me too ccc'
  // console.log('\n===============\n02.06')
  // console.log('slice 1: >>>' + str.slice(0, 9) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  t.deepEqual(
    repl(
      str,
      [
        [0, 9, 'aaa'],
        [14, 25]
      ]
    ),
    'aaa bbb ccc',
    '02.06'
  )
})

test('02.07 - replace with ending index zero', function (t) {
  let str = 'bbb ccc'
  t.deepEqual(
    repl(
      str,
      [
        [0, 0, 'aaa ']
      ]
    ),
    'aaa bbb ccc',
    '02.07 - both from and to indexes are zeros, because we\'re adding content in front'
  )
})

// -----------------------------------------------------------------------------
// 03. replacement - both "from" and "to" markers are equal
// -----------------------------------------------------------------------------

test('03.01 - basic replacement', function (t) {
  t.deepEqual(
    repl(
      'aaa  ccc',
      [
        [4, 4, 'bbb']
      ]
    ),
    'aaa bbb ccc',
    '03.01'
  )
})

test('03.02 - multiple replacement pieces', function (t) {
  // let str = 'aaa  ccc  eee'
  // console.log('previewing: >>>' + str.slice(4, 15) + '<<<')
  // console.log('previewing: >>>' + str.slice(9, 15) + '<<<')
  t.deepEqual(
    repl(
      'aaa  ccc  eee',
      [
        [4, 4, 'bbb'],
        [9, 9, 'ddd']
      ]
    ),
    'aaa bbb ccc ddd eee',
    '03.02'
  )
})
