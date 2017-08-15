'use strict'
import test from 'ava'
var r = require('./')

// ==============================
// normal use cases
// ==============================

test('01.01 - removes Swiss-style thousand separators, single quotes', t => {
  t.deepEqual(
    r(`1'000'000.00`), '1000000.00',
    '01.01 - normal'
  )
  t.deepEqual(
    r(`1'000'000.2`), '1000000.20',
    '01.01.02 - one decimal place - padds to two decimal places (default)'
  )
  t.deepEqual(
    r(`1'000'000.2`, {padSingleDecimalPlaceNumbers: false}), '1000000.2',
    '01.01.03 - one decimal place - does not pad to two decimal places (off)'
  )
  // but,
  t.deepEqual(
    r(`1'000'000.000`), `1'000'000.000`,
    '01.01.04 - inconsistent thousand separators'
  )
})

test('01.02 - removes Russian-style thousand separators, spaces', t => {
  t.deepEqual(
    r('1 000 000.00'), '1000000.00',
    '01.02.01'
  )
  t.deepEqual(
    r('1 000 000.2'), '1000000.20',
    '01.02.02 - padds to two decimal places (default)'
  )
  t.deepEqual(
    r('1 000 000.2', {padSingleDecimalPlaceNumbers: false}), '1000000.2',
    '01.02.03 - padds to two decimal places (off)'
  )
  // but,
  t.deepEqual(
    r('1 000 000.000'), '1 000 000.000',
    '01.02.04 - inconsistent thousand separators - bail'
  )
})

test('01.03 - removes UK/US-style thousand separators, commas', t => {
  t.deepEqual(
    r('1,000,000.00'), '1000000.00',
    '01.03.01'
  )
  t.deepEqual(
    r('1,000,000.2'), '1000000.20',
    '01.03.02 - padds to two decimal places (default)'
  )
  t.deepEqual(
    r('1,000,000.2', {padSingleDecimalPlaceNumbers: false}), '1000000.2',
    '01.03.03 - padds to two decimal places (off)'
  )
  t.deepEqual(
    r('1,000,000.2'), '1000000.20',
    '01.03.04'
  )
  // but,
  t.deepEqual(
    r('1,000,000.000'), '1,000,000.000',
    '01.03.03 - inconsistent thousand separators'
  )
})

test('01.04 - removes opposite-style thousand separators, commas', t => {
  t.deepEqual(
    r('1.000.000,00'), '1000000,00',
    '01.04.01'
  )
  t.deepEqual(
    r('1.000.000,2'), '1000000,20',
    '01.04.02'
  )
  // but,
  t.deepEqual(
    r('1.000.000,000'), '1.000.000,000',
    '01.04.03 - bails when encounters inconsistent thousand separators'
  )
})

// ==============================
// false-ones
// ==============================

test('02.01 - false - includes some text characters', t => {
  t.deepEqual(
    r('The price is 1,999.99'), 'The price is 1,999.99',
    '02.02.01 - does nothing'
  )
  t.deepEqual(
    r('abc'), 'abc',
    '02.02.02 - does not freak out if it\'s text-only'
  )
})

test('02.02 - false - mixed thousand separators, two dots one comma', t => {
  t.deepEqual(
    r('1,000.000'), '1,000.000',
    '02.02.01')
  t.deepEqual(
    r('1.000,000'), '1.000,000',
    '02.02.02')
  t.deepEqual(
    r('1,000.000.000'), '1,000.000.000',
    '02.02.03')
  t.deepEqual(
    r('1.000,000,000'), '1.000,000,000',
    '02.02.04'
  )
})

test('02.03 - false - few sneaky cases', t => {
  t.deepEqual(
    r('1,a'), '1,a',
    '02.03.01 - the first char after thousands separator is wrong'
  )
  t.deepEqual(
    r('1,0a'), '1,0a',
    '02.03.02 - the second char after thousands separator is wrong'
  )
  t.deepEqual(
    r('1,01a'), '1,01a',
    '02.03.03 - the third char after thousands separator is wrong'
  )
  t.deepEqual(
    r(',,,'), ',,,',
    '02.03.04 - does nothing'
  )
  t.deepEqual(
    r('...'), '...',
    '02.03.05 - does nothing'
  )
  t.deepEqual(
    r('1,00000'), '1,00000',
    '02.03.06'
  )
  t.deepEqual(
    r('a,b'), 'a,b',
    '02.03.07'
  )
})

test('02.04 - trims', t => {
  t.deepEqual(
    r('"100,000.01"'), '100000.01',
    '02.04.01 - trims double quotes'
  )
  t.deepEqual(
    r('    100,000.01  \n  '), '100000.01',
    '02.04.02 - trims whitespace quotes'
  )
})

// ==============================
// opts.forceUKStyle
// ==============================

test('03.01 - converts Russian-style notation into UK-one', t => {
  // defaults
  t.deepEqual(
    r('1,5'), '1,50',
    '03.01.01 - one decimal place'
  )
  t.deepEqual(
    r('1,5', {padSingleDecimalPlaceNumbers: false}), '1,5',
    '03.01.02 - one decimal place'
  )
  t.deepEqual(
    r('1,51'), '1,51',
    '03.01.03 - two decimal places'
  )
  t.deepEqual(
    r('1,510'), '1510',
    '03.01.04 - this is actually thousands separator'
  )
  t.deepEqual(
    r('100 000 000,9'), '100000000,90',
    '03.01.05 - includes thousand separators, one decimal place'
  )
  t.deepEqual(
    r('100 000 000,9', {padSingleDecimalPlaceNumbers: false}), '100000000,9',
    '03.01.06 - includes thousand separators, one decimal place'
  )
  t.deepEqual(
    r('100 000 000,99'), '100000000,99',
    '03.01.07 - includes thousand separators, two decimal places'
  )
  // opts.forceUKStyle = true
  t.deepEqual(
    r('1,5', {forceUKStyle: true}), '1.50',
    '03.01.08 - one decimal place'
  )
  t.deepEqual(
    r('1,5', {forceUKStyle: true, padSingleDecimalPlaceNumbers: false}), '1.5',
    '03.01.09 - one decimal place'
  )
  t.deepEqual(
    r('1,51', {forceUKStyle: true}), '1.51',
    '03.01.10 - two decimal places'
  )
  t.deepEqual(
    r('1,510', {forceUKStyle: true}), '1510',
    '03.01.11 - this is actually thousands separator'
  )
  t.deepEqual(
    r('100 000 000,9', {forceUKStyle: true}), '100000000.90',
    '03.01.12 - includes thousand separators, one decimal place'
  )
  t.deepEqual(
    r('100 000 000,9', {forceUKStyle: true, padSingleDecimalPlaceNumbers: false}), '100000000.9',
    '03.01.13 - includes thousand separators, one decimal place'
  )
  t.deepEqual(
    r('100 000 000,99', {forceUKStyle: true}), '100000000.99',
    '03.01.14 - includes thousand separators, two decimal places'
  )
})

// ==============================
// throws
// ==============================

test('99.01 - throws when the inputs are missing', t => {
  t.throws(function () {
    r()
  })
  t.notThrows(function () {
    r('')
  })
  t.notThrows(function () {
    r('123') // nothing to do
  })
})

test('99.02 - throws when first arg is not string', t => {
  t.throws(function () {
    r(null)
  })
  t.throws(function () {
    r(true)
  })
  t.throws(function () {
    r(undefined)
  })
  t.throws(function () {
    r(1)
  })
  t.throws(function () {
    r(NaN)
  })
})

test('99.03 - throws when second arg is not a plain object', t => {
  t.notThrows(function () {
    r('aaa', {})
  })
  t.throws(function () {
    r('aaa', 'aaa')
  })
  t.throws(function () {
    r('aaa', 1)
  })
  t.throws(function () {
    r('aaa', true)
  })
  t.throws(function () {
    r('aaa', [true])
  })
  t.throws(function () {
    r('aaa', ['aaa'])
  })
})

test('99.04 - throws when opts contain unrecognised key', t => {
  t.throws(function () { // contains only that
    r('aaa', {zzz: true})
  })
  t.throws(function () { // or contains mixed, some valid keys too
    r('aaa', {zzz: true, padSingleDecimalPlaceNumbers: true})
  })
  t.notThrows(function () { // does not throw when all keys are valid
    r('aaa', {padSingleDecimalPlaceNumbers: true})
  })
})
