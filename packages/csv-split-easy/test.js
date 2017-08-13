'use strict'

import split from './index'
import test from 'ava'

// some art first
//
//                             _.,aaPPPPPPPPaa,._
//                         ,adP"""'          `""Yb,_
//                      ,adP'                     `"Yb,
//                    ,dP'     ,aadPP"""""YYba,.     `"Y,
//                   ,P'    ,aP"'            `""Ya,     "Y,
//                  ,P'    aP'                   `"Ya    `Yb,
//                 ,P'    d"    ,adP""""""""Yba,    `Y,    "Y,
//                ,d'   ,d'   ,dP"            `Yb,   `Y,    `Y,
//                d'   ,d'   ,d'    ,dP""Yb,    `Y,   `Y,    `b
//                8    d'    d'   ,d"      "b,   `Y,   `8,    Y,
//                8    8     8    d'    .   `Y,   `8    `8    `b
//                8    8     8    8     8    `8    8     8     8
//                8    Y,    Y,   `b, ,aP     P    8    ,P     8
//                I,   `Y,   `Ya    """"     d'   ,P    d"    ,P
//                `Y,   `8,    `Ya         ,8"   ,P'   ,P'    d'
//                 `Y,   `Ya,    `Ya,,__,,d"'   ,P'   ,P"    ,P
//                  `Y,    `Ya,     `""""'     ,P'   ,d"    ,P'
//                   `Yb,    `"Ya,_          ,d"    ,P'    ,P'
//                     `Yb,      ""YbaaaaaadP"     ,P'    ,P'
//                       `Yba,                   ,d'    ,dP'
//                          `"Yba,._       _.,adP"     dP"
//                              `"""""""""""""'

// ============================================================================
// group 01 - concentrating on line breaks: varying amounts and different types
// ============================================================================
//
test('01.01 - breaks lines correctly leaving no empty lines', (t) => {
  t.deepEqual(
    split('a,b,c\nd,e,f'),
    [
      ['a', 'b', 'c'],
      ['d', 'e', 'f']
    ],
    '01.01.01 - minimal amount of chars in each col'
  )
  t.deepEqual(
    split('apples and some more apples,bananas,cherries\ndonuts,eclairs,froyos'),
    [
      ['apples and some more apples', 'bananas', 'cherries'],
      ['donuts', 'eclairs', 'froyos']
    ],
    '01.01.02 - normal words in each col'
  )
  t.deepEqual(
    split('a,b,c\n\r\n\r\r\r\r\n\n\nd,e,f'),
    [
      ['a', 'b', 'c'],
      ['d', 'e', 'f']
    ],
    '01.01.03 - minimal amount of chars in each col'
  )
  t.deepEqual(
    split('apples and some more apples,bananas,cherries\n\r\r\r\r\n\n\n\n\ndonuts,eclairs,froyos'),
    [
      ['apples and some more apples', 'bananas', 'cherries'],
      ['donuts', 'eclairs', 'froyos']
    ],
    '01.01.04 - normal words in each col'
  )
})

test('01.02 - breaks lines that have empty values', (t) => {
  t.deepEqual(
    split(',,\na,b,c'),
    [
      ['', '', ''],
      ['a', 'b', 'c']
    ],
    '01.02.01 - whole row comprises of empty values'
  )
  t.deepEqual(
    split(','),
    [
      ['', '']
    ],
    '01.02.02 - only one comma'
  )
  t.deepEqual(
    split(''),
    [
      ['']
    ],
    '01.02.03 - nothing'
  )
})

// =============================================================
// group 02 - concentrating on values wrapped with duoble quotes
// =============================================================
//
test('02.01 - breaks lines correctly leaving no empty lines', (t) => {
  t.deepEqual(
    split('"a,b",c,d\ne,f,g'),
    [
      ['a,b', 'c', 'd'],
      ['e', 'f', 'g']
    ],
    '02.01.01 - minimal amount of chars in each col'
  )
  t.deepEqual(
    split('"apples, and some other fruits",bananas,cherries\ndonuts,eclairs,froyos'),
    [
      ['apples, and some other fruits', 'bananas', 'cherries'],
      ['donuts', 'eclairs', 'froyos']
    ],
    '02.01.02 - minimal amount of chars in each col'
  )
})

test('02.02 - particular attention of combos of line breaks and double quotes', (t) => {
  t.deepEqual(
    split('"a,b",c,d\n"e,f",g,h'),
    [
      ['a,b', 'c', 'd'],
      ['e,f', 'g', 'h']
    ],
    '02.02.01 - double quotes follow line break'
  )
})

test('02.03 - particular attention of double quotes at the end', (t) => {
  t.deepEqual(
    split('"a,b",c,d\n\re,f,"g,h"'),
    [
      ['a,b', 'c', 'd'],
      ['e', 'f', 'g,h']
    ],
    '02.03.01 - double quotes follow line break'
  )
})

test('02.04 - all values are wrapped with double quotes', (t) => {
  t.deepEqual(
    split('"something here","and something there"," notice space in front"\n"and here","this is wrapped as well","and this too"'),
    [
      ['something here', 'and something there', ' notice space in front'],
      ['and here', 'this is wrapped as well', 'and this too']
    ],
    '02.04.01 - splits correctly, respecting trimm-able space around'
  )
})

// =============================================================
// group 03 - input type validation
// =============================================================
//
test('03.01 - wrong input types causes throwing up', (t) => {
  t.throws(function () {
    split(null)
  })
  t.throws(function () {
    split(1)
  })
  t.throws(function () {
    split(undefined)
  })
  t.throws(function () {
    split()
  })
  t.throws(function () {
    split(true)
  })
  t.throws(function () {
    split(NaN)
  })
  t.throws(function () {
    split({a: 'a'})
  })
  t.throws(function () {
    let f = () => null
    split(f)
  })
})
