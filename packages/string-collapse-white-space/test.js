'use strict'

import test from 'ava'
const collapse = require('./index.js')

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - wrong/missing input = throw', t => {
  t.throws(function () {
    collapse()
  })
  t.throws(function () {
    collapse(1)
  })
  t.throws(function () {
    collapse(null)
  })
  t.throws(function () {
    collapse(undefined)
  })
  t.throws(function () {
    collapse(true)
  })
})

test('01.02 - wrong opts = throw', t => {
  t.throws(function () {
    collapse('aaaa', true) // not object but bool
  })
  t.throws(function () {
    collapse('aaaa', 1) // not object but number
  })
  t.notThrows(function () {
    collapse('aaaa', undefined) // hardcoded "nothing" is ok!
  })
  t.notThrows(function () {
    collapse('aaaa', null) // null fine too - that's hardcoded "nothing"
  })
  t.throws(function () {
    collapse('aaaa', {zzz: true}) // opts contain rogue keys.
  })
  t.throws(function () {
    collapse('aaaa', {zzz: true, messageOnly: false}) // one rogue key is enough to cause a throw
  })
  t.throws(function () {
    collapse('aaaa', {messageOnly: false}) // no rogue keys.
  })
})

test('01.03 - empty string', t => {
  t.is(collapse(''),
  '',
  '01.03')
})

test('01.04 - only letter characters, no white space', t => {
  t.is(collapse('aaa'),
  'aaa',
  '01.04')
})

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test('02.01 - simple sequences of spaces within string', t => {
  t.is(collapse('a b'),
  'a b',
  '02.01.01 - nothing to collapse')
  t.is(collapse('a  b'),
  'a b',
  '02.01.02')
  t.is(collapse('aaa     bbb    ccc   dddd'),
  'aaa bbb ccc dddd',
  '02.01.03')
})

test('02.02 - sequences of spaces outside of string - defaults', t => {
  t.is(collapse('  a b  '),
  'a b',
  '02.02.01 - nothing to collapse, only trim')
  t.is(collapse(' a b '),
  'a b',
  '02.02.02 - trims single spaces')
  t.is(collapse('\ta b\t'),
  'a b',
  '02.02.03 - trims single tabs')
  t.is(collapse('  a  b  '),
  'a b',
  '02.02.04')
  t.is(collapse('  aaa     bbb    ccc   dddd  '),
  'aaa bbb ccc dddd',
  '02.02.05')
})

test('02.03 - sequences of spaces outside of string - opts.trimStart', t => {
  // opts.trimStart
  t.is(collapse('  a b  ', {trimStart: false}),
  ' a b',
  '02.03.01 - nothing to collapse, only trim')
  t.is(collapse(' a b ', {trimStart: false}),
  ' a b',
  '02.03.02 - trims single spaces')
  t.is(collapse('\ta b\t', {trimStart: false}),
  '\ta b',
  '02.03.03 - trims single tabs')
  t.is(collapse('\n \ta b\t \n', {trimStart: false}),
  '\ta b',
  '02.03.04 - trims with line breaks')
  t.is(collapse('  a  b  ', {trimStart: false}),
  ' a b',
  '02.03.05')
  t.is(collapse('  aaa     bbb    ccc   dddd  ', {trimStart: false}),
  ' aaa bbb ccc dddd',
  '02.03.06')
})

test('02.04 - sequences of spaces outside of string - opts.dontTouchLeadingWhiteSpace', t => {
  // only opts.dontTouchLeadingWhiteSpace
  t.is(collapse('  a b  ', {dontTouchLeadingWhiteSpace: true}),
  '  a b',
  '02.04.01 - nothing to collapse, only trim')
  t.is(collapse(' a b ', {dontTouchLeadingWhiteSpace: true}),
  ' a b',
  '02.04.02 - trims single spaces')
  t.is(collapse('\ta b\t', {dontTouchLeadingWhiteSpace: true}),
  '\ta b',
  '02.04.03 - trims single tabs')
  t.is(collapse('\n \ta b\t \n', {dontTouchLeadingWhiteSpace: true}),
  '\n \ta b',
  '02.04.04 - trims single tabs')
  t.is(collapse('  a  b  ', {dontTouchLeadingWhiteSpace: true}),
  '  a b',
  '02.04.05')
  t.is(collapse('  aaa     bbb    ccc   dddd  ', {dontTouchLeadingWhiteSpace: true}),
  '  aaa bbb ccc dddd',
  '02.04.06')
})

test('02.05 - sequences of spaces outside of string - opts.dontTouchLeadingWhiteSpace + opts.trimStart', t => {
  // opts.dontTouchLeadingWhiteSpace + opts.trimStart (latter does not matter)
  t.is(collapse('  a b  ', {dontTouchLeadingWhiteSpace: true, trimStart: false}),
  '  a b',
  '02.05.01 - nothing to collapse, only trim')
  t.is(collapse(' a b ', {dontTouchLeadingWhiteSpace: true, trimStart: false}),
  ' a b',
  '02.05.02 - trims single spaces')
  t.is(collapse('\ta b\t', {dontTouchLeadingWhiteSpace: true, trimStart: false}),
  '\ta b',
  '02.05.03 - trims single tabs')
  t.is(collapse('\n \ta b\t \n', {dontTouchLeadingWhiteSpace: true, trimStart: false}),
  '\n \ta b',
  '02.05.04 - trims single tabs')
  t.is(collapse('  a  b  ', {dontTouchLeadingWhiteSpace: true, trimStart: false}),
  '  a b',
  '02.05.04')
  t.is(collapse('  aaa     bbb    ccc   dddd  ', {dontTouchLeadingWhiteSpace: true, trimStart: false}),
  '  aaa bbb ccc dddd',
  '02.05.05')
})

test('02.06 - sequences of spaces outside of string - opts.trimEnd', t => {
  // opts.trimEnd
  t.is(collapse('  a b  ', {trimEnd: false}),
  'a b ',
  '02.06.01 - nothing to collapse, only trim')
  t.is(collapse(' a b ', {trimEnd: false}),
  'a b ',
  '02.06.02 - trims single spaces')
  t.is(collapse('\ta b\t', {trimEnd: false}),
  'a b\t',
  '02.06.03 - trims single tabs')
  t.is(collapse('\n \ta b\t \n', {trimEnd: false}),
  'a b\n',
  '02.06.04 - trims with line breaks')
  t.is(collapse('  a  b  ', {trimEnd: false}),
  'a b ',
  '02.06.05')
  t.is(collapse('  aaa     bbb    ccc   dddd  ', {trimEnd: false}),
  'aaa bbb ccc dddd ',
  '02.06.06')
})

test('02.07 - sequences of spaces outside of string - opts.dontTouchTrailingWhiteSpace', t => {
  // only opts.dontTouchTrailingWhiteSpace
  t.is(collapse('  a b  ', {dontTouchTrailingWhiteSpace: true}),
  'a b  ',
  '02.07.01 - nothing to collapse, only trim')
  t.is(collapse(' a b ', {dontTouchTrailingWhiteSpace: true}),
  'a b ',
  '02.07.02 - trims single spaces')
  t.is(collapse('\ta b\t', {dontTouchTrailingWhiteSpace: true}),
  'a b\t',
  '02.07.03 - trims single tabs')
  t.is(collapse('\n \ta b\t \n', {dontTouchTrailingWhiteSpace: true}),
  'a b\t \n',
  '02.07.04 - trims single tabs')
  t.is(collapse('  a  b  ', {dontTouchTrailingWhiteSpace: true}),
  'a b  ',
  '02.07.05')
  t.is(collapse('  aaa     bbb    ccc   dddd  ', {dontTouchTrailingWhiteSpace: true}),
  'aaa bbb ccc dddd  ',
  '02.07.06')
})

test('02.08 - sequences of spaces outside of string - opts.dontTouchTrailingWhiteSpace + opts.trimEnd', t => {
  // opts.dontTouchTrailingWhiteSpace + opts.trimEnd
  t.is(collapse('  a b  ', {dontTouchTrailingWhiteSpace: true, trimEnd: false}),
  'a b  ',
  '02.08.01 - nothing to collapse, only trim')
  t.is(collapse(' a b ', {dontTouchTrailingWhiteSpace: true, trimEnd: false}),
  'a b ',
  '02.08.02 - trims single spaces')
  t.is(collapse('\ta b\t', {dontTouchTrailingWhiteSpace: true, trimEnd: false}),
  'a b\t',
  '02.08.03 - trims single tabs')
  t.is(collapse('\n \ta b\t \n', {dontTouchTrailingWhiteSpace: true, trimEnd: false}),
  'a b\t \n',
  '02.08.04 - trims single tabs')
  t.is(collapse('  a  b  ', {dontTouchTrailingWhiteSpace: true, trimEnd: false}),
  'a b  ',
  '02.08.05')
  t.is(collapse('  aaa     bbb    ccc   dddd  ', {dontTouchTrailingWhiteSpace: true, trimEnd: false}),
  'aaa bbb ccc dddd  ',
  '02.08.06')
})
