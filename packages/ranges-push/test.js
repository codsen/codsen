'use strict'

import Slices from './index'
import test from 'ava'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - ADD() - wrong inputs', t => {
  // missing
  t.throws(function () {
    let slices = new Slices()
    slices.add()
  })
  t.throws(function () {
    let slices = new Slices()
    slices.add('a')
  })
  // wrong types
  t.throws(function () {
    let slices = new Slices()
    slices.add('a', 'a')
  })
  t.throws(function () {
    let slices = new Slices()
    slices.add(1, 'a')
  })
  t.throws(function () {
    let slices = new Slices()
    slices.add('a', 1)
  })
  t.notThrows(function () {
    let slices = new Slices()
    slices.add(1, 1)
  })
  // hardcoded undefined
  t.throws(function () {
    let slices = new Slices()
    slices.add(undefined, 1)
  })
  // numbers but not natural integers
  t.throws(function () {
    let slices = new Slices()
    slices.add(1.2, 1)
  })
  t.throws(function () {
    let slices = new Slices()
    slices.add(1, 1.3)
  })
})

test('01.02 - ADD() - third input arg is wrong', t => {
  t.throws(function () {
    let slices = new Slices()
    slices.add(1, 2, 3)
  })
})

test('01.03 - ADD() - overloading', t => {
  t.throws(function () {
    let slices = new Slices()
    slices.add(1, 2, 'aaa', 1)
  }, `string-slices-array-push/Slices/add(): [THROW_ID_05] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: [\n    1\n]`)
})

// -----------------------------------------------------------------------------
// 02. BAU - no adding, only ranges
// -----------------------------------------------------------------------------

test('02.01 - ADD() - adds two non-overlapping ranges', (t) => {
  let slices = new Slices()
  slices.add(1, 2)
  slices.add(3, 4)
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4]
    ],
    '02.01'
  )
})

test('02.02 - ADD() - adds two overlapping ranges', (t) => {
  let slices = new Slices()
  slices.add(1, 5)
  slices.add(3, 9)
  t.deepEqual(
    slices.current(),
    [
      [1, 9]
    ],
    '02.02'
  )
})

test('02.03 - ADD() - extends range', (t) => {
  let slices = new Slices()
  slices.add(1, 5)
  slices.add(5, 9)
  t.deepEqual(
    slices.current(),
    [
      [1, 9]
    ],
    '02.03'
  )
})

test('02.04 - ADD() - new range bypasses the last range completely', (t) => {
  let slices = new Slices()
  slices.add(1, 5)
  slices.add(6, 10)
  slices.add(11, 15)
  slices.add(16, 20)
  slices.add(10, 30)
  t.deepEqual(
    slices.current(),
    [
      [1, 5],
      [6, 30]
    ],
    '02.04'
  )
})

test('02.05 - ADD() - head and tail markers in new are smaller than last one\'s', (t) => {
  let slices = new Slices()
  slices.add(10, 20)
  slices.add(1, 5)
  t.deepEqual(
    slices.current(),
    [
      [1, 20]
    ],
    '02.05'
  )
})

test('02.06 - ADD() - same value in heads and tails', (t) => {
  let slices = new Slices()
  slices.add(1, 1)
  t.deepEqual(
    slices.current(),
    [
      [1, 1]
    ],
    '02.06'
  )
})

test('02.07 - ADD() - same range again and again', (t) => {
  let slices = new Slices()
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  t.deepEqual(
    slices.current(),
    [
      [1, 10]
    ],
    '02.07'
  )
})

test('02.08 - ADD() - same range again and again, one had third arg', (t) => {
  let slices = new Slices()
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10, 'zzz')
  slices.add(1, 10)
  slices.add(1, 10)
  t.deepEqual(
    slices.current(),
    [
      [1, 10, 'zzz']
    ],
    '02.08'
  )
})

test('02.09 - ADD() - inputs as numeric strings - all OK', (t) => {
  let slices = new Slices()
  slices.add('1', '2')
  slices.add('3', '4')
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4]
    ],
    '02.09'
  )
})

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

test('03.01 - ADD() - adds third argument, blank start', (t) => {
  let slices = new Slices()
  slices.add(1, 1, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [1, 1, 'zzz']
    ],
    '03.01'
  )
})

test('03.02 - ADD() - adds third argument onto existing and stops', (t) => {
  let slices = new Slices()
  slices.add(1, 2)
  slices.add(3, 4, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4, 'zzz']
    ],
    '03.02'
  )
})

test('03.03 - ADD() - adds third argument onto existing and adds more', (t) => {
  let slices = new Slices()
  slices.add(1, 2)
  slices.add(3, 4, 'zzz')
  slices.add(5, 6)
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4, 'zzz'],
      [5, 6]
    ],
    '03.03'
  )
})

test('03.03 - ADD() - existing "add" values get concatenated with incoming-ones', (t) => {
  let slices = new Slices()
  slices.add(1, 2, 'aaa')
  slices.add(2, 4, 'zzz')
  slices.add(5, 6)
  t.deepEqual(
    slices.current(),
    [
      [1, 4, 'aaazzz'],
      [5, 6]
    ],
    '03.03'
  )
})

test('03.04 - ADD() - jumped over values have third args and they get concatenated', (t) => {
  let slices = new Slices()
  slices.add(1, 5)
  slices.add(6, 10)
  slices.add(11, 15, 'aaa')
  slices.add(16, 20, 'bbb')
  slices.add(10, 30)
  t.deepEqual(
    slices.current(),
    [
      [1, 5],
      [6, 30, 'aaabbb']
    ],
    '03.04'
  )
})

test('03.05 - ADD() - combo of third arg merging and jumping behind previous range', (t) => {
  let slices = new Slices()
  slices.add(10, 11, 'aaa')
  slices.add(3, 4, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [3, 11, 'aaazzz']
    ],
    '03.05'
  )
})

test('03.06 - ADD() - combo of third arg merging and extending previous range', (t) => {
  let slices = new Slices()
  slices.add(1, 2)
  slices.add(2, 4, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, 'zzz']
    ],
    '03.06'
  )
})

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

test('04.01 - CURRENT() - calling on blank yields null', (t) => {
  let slices = new Slices()
  t.deepEqual(
    slices.current(),
    null,
    '04.01'
  )
})

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

test('05.01 - WIPE() - wipes correctly', (t) => {
  let slices = new Slices()
  slices.add(10, 10, 'aaa')
  slices.wipe()
  slices.add(1, 2, 'bbb')
  t.deepEqual(
    slices.current(),
    [
      [1, 2, 'bbb']
    ],
    '05.01'
  )
})

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

test('06.01 - LAST() - fetches the last range from empty', (t) => {
  let slices = new Slices()
  t.deepEqual(
    slices.last(),
    null,
    '06.01'
  )
})

test('06.02 - LAST() - fetches the last range from non-empty', (t) => {
  let slices = new Slices()
  slices.add(1, 2, 'bbb')
  t.deepEqual(
    slices.last(),
    [1, 2, 'bbb'],
    '06.02'
  )
})
