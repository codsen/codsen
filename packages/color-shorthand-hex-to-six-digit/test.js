'use strict'
import test from 'ava'
var c = require('./index.js')

// ==============================
// 01. String inputs
// ==============================

test('01.01 - string input - doesn\'t touch full hex codes', t => {
  t.deepEqual(
    c('aaaa #cccccc zzzz\n\t\t\t#000000.'),
    'aaaa #cccccc zzzz\n\t\t\t#000000.',
    '01.01')
})

test('01.02 - string input - changes one shorthand, lowercase', t => {
  t.deepEqual(
    c('aaaa #f0c zzzz\n\t\t\t#ffcc00'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.01')
  t.deepEqual(
    c('aaaa #ff00cc zzzz\n\t\t\t#fc0'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.02')
  t.deepEqual(
    c('aaaa #f0c zzzz\n\t\t\t#fc0'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.03')
})

test('01.02 - string input - changes one shorthand, uppercase', t => {
  t.deepEqual(
    c('aaaa #f0c zzzz\n\t\t\t#ffcc00'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.01')
  t.deepEqual(
    c('aaaa #ff00cc zzzz\n\t\t\t#fc0'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.02')
  t.deepEqual(
    c('aaaa #f0c zzzz\n\t\t\t#fc0'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.03')
})

// ==============================
// 02. Plain object inputs
// ==============================

test('02.01 - plain object input - simple one level object', t => {
  t.deepEqual(
    c(
      {
        a: '#ffcc00',
        b: '#f0c',
        c: 'text'
      }
    ),
    {
      a: '#ffcc00',
      b: '#ff00cc',
      c: 'text'
    },
    '02.01.01')
  t.deepEqual(
    c(
      {
        a: '#fc0',
        b: '#f0c',
        c: 'text'
      }
    ),
    {
      a: '#ffcc00',
      b: '#ff00cc',
      c: 'text'
    },
    '02.01.02')
})

test('02.02 - plain object input - nested', t => {
  t.deepEqual(
    c(
      {
        a: ['#fc0'],
        b: [[['#fc0', {x: ['#f0c']}]]],
        c: 'text',
        d: null
      }
    ),
    {
      a: ['#ffcc00'],
      b: [[['#ffcc00', {x: ['#ff00cc']}]]],
      c: 'text',
      d: null
    },
    '02.02')
})

// ==============================
// 03. Array inputs
// ==============================

test('03.01 - array input - one level, strings inside', t => {
  t.deepEqual(
    c(
      [
        '#fc0', '#f0c', 'text', ''
      ]
    ),
    [
      '#ffcc00', '#ff00cc', 'text', ''
    ],
    '03.01')
})

test('03.02 - array input - nested objects & arrays', t => {
  t.deepEqual(
    c(
      [
        [[[[[{x: ['#fc0']}]]]]], {z: '#f0c'}, ['text'], {y: ''}
      ]
    ),
    [
      [[[[[{x: ['#ffcc00']}]]]]], {z: '#ff00cc'}, ['text'], {y: ''}
    ],
    '03.02')
})

// ==================================
// 04. Unaccepted inputs are returned
// ==================================

var dummy = function () {
  return null
}
test('04.01 - function as input - returned', t => {
  t.deepEqual(
    c(dummy),
    dummy,
    '04.01')
})

test('04.02 - null input - returned', t => {
  t.deepEqual(
    c(null),
    null,
    '04.02')
})

test('04.03 - undefined input - returned', t => {
  t.deepEqual(
    c(undefined),
    undefined,
    '04.03')
})

test('04.04 - NaN input - returned', t => {
  t.deepEqual(
    c(NaN),
    NaN,
    '04.04')
})

test('04.05 - no input - returned undefined', t => {
  t.deepEqual(
    c(),
    undefined,
    '04.05')
})

// ==============================
// 05. Enforces all hexes to be lowercase only
// ==============================

test('05.01 - fixes mixed case three and six digit hexes', t => {
  t.deepEqual(
    c('aaaa #cCccCc zzzz\n\t\t\t#ffF.'),
    'aaaa #cccccc zzzz\n\t\t\t#ffffff.',
    '05.01')
})

// ==============================
// 06. Does not mutate input args
// ==============================

var input1 = {
  a: 'aaaa #f0c zzzz\n\t\t\t#FFcc00',
  b: 'aaaa #ff00CC zzzz\n\t\t\t#ffcc00'
}

var unneededRes = c(input1)

test('06.01 - does not mutate the input args', t => {
  t.pass(unneededRes) // dummy to please JS Standard
  t.deepEqual(
    input1,
    {
      a: 'aaaa #f0c zzzz\n\t\t\t#FFcc00',
      b: 'aaaa #ff00CC zzzz\n\t\t\t#ffcc00'
    },
    '06.01.02') // real deal
})

// =============================
// 07. Deals with real HTML code
// =============================

test('07.01 - does not remove closing slashes from XHTML', t => {
  t.deepEqual(
    c('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <style type="text/css">\n    @media (max-width: 600px) {\n      .real-class-1#head-only-class-1[lang|en]{width:100% !important;}\n      #real-id-1.head-only-class-1:hover{display: block !important;}\n      .head-only-class-2[lang|en]{color: #CCC !important;}\n      @media (max-width: 200px) {\n        #real-id-1{background-color: #000;}\n      }\n      @media (max-width: 100px) {\n        .head-only-class-1{border: 1px solid #FfF !important;}\n      }\n    }\n  </style>\n  <title>zzzz</title>\n  <style type="text/css">\n    .real-class-1#head-only-class-1[lang|en]{color: #c0f !important;}\n    #real-id-1.head-only-class-1:hover{display: block !important;}\n    .head-only-class-3[lang|en]{background-color: #ff0 !important;}\n    div .real-class-1 a:hover {color: #00c;}\n  </style>\n</head>\n<body>\n  <table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">\n    <tr>\n      <td class="real-class-1" style="color: #ffc;">\n        <img src="spacer.gif" alt="spacer" />\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n'),

    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n  <style type="text/css">\n    @media (max-width: 600px) {\n      .real-class-1#head-only-class-1[lang|en]{width:100% !important;}\n      #real-id-1.head-only-class-1:hover{display: block !important;}\n      .head-only-class-2[lang|en]{color: #cccccc !important;}\n      @media (max-width: 200px) {\n        #real-id-1{background-color: #000000;}\n      }\n      @media (max-width: 100px) {\n        .head-only-class-1{border: 1px solid #ffffff !important;}\n      }\n    }\n  </style>\n  <title>zzzz</title>\n  <style type="text/css">\n    .real-class-1#head-only-class-1[lang|en]{color: #cc00ff !important;}\n    #real-id-1.head-only-class-1:hover{display: block !important;}\n    .head-only-class-3[lang|en]{background-color: #ffff00 !important;}\n    div .real-class-1 a:hover {color: #0000cc;}\n  </style>\n</head>\n<body>\n  <table id="real-id-1" width="100%" border="0" cellpadding="0" cellspacing="0">\n    <tr>\n      <td class="real-class-1" style="color: #ffffcc;">\n        <img src="spacer.gif" alt="spacer" />\n      </td>\n    </tr>\n  </table>\n</body>\n</html>\n',
    '07.01')
})
