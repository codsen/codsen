'use strict'
var e = require('./index.js')
import test from 'ava'

// ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char

// ==============================
// Default chopUpToNotIncluding, that is '.'
// ==============================

test('01.01 - class: just class passed, nothing done, falls on default', t => {
  t.is(
    e('.class-name'), '.class-name',
    '01.01')
})

test('01.02 - class: tag with class', t => {
  t.is(
    e('div.class-name.whatever'), '.class-name',
    '01.02')
})

test('01.03 - class: class within tag', t => {
  t.is(
    e('div .class-name'), '.class-name',
    '01.03.01')
  t.is(
    e('div .class-name '), '.class-name',
    '01.03.02')
  t.is(
    e('div       .class-name        '), '.class-name',
    '01.03.03')
})

test('01.04 - class: class within tag\'s child tag', t => {
  t.is(
    e('div .class-name a'), '.class-name',
    '01.04')
})

test('01.05 - class: more, sandwitched', t => {
  t.is(
    e('div~!@$%^&*()+=,/\';:"?><[]{}|`#.class-name~!@$%^&*()+=,/\';:"?><[]{}|`#'), '.class-name',
    '01.05')
})

test('01.06 - class: exclamation mark', t => {
  t.is(
    e('div .class-name!a'), '.class-name',
    '01.06.01')
  t.is(
    e('div.class-name!a'), '.class-name',
    '01.06.02')
  t.is(
    e('.class-name!a'), '.class-name',
    '01.06.03')
  t.is(
    e('!.class-name!a'), '.class-name',
    '01.06.04')
})

test('01.07 - class: ampersand', t => {
  t.is(
    e('div .class-name&a'), '.class-name',
    '01.07.01')
  t.is(
    e('div.class-name&a'), '.class-name',
    '01.07.02')
  t.is(
    e('.class-name&a'), '.class-name',
    '01.07.03')
  t.is(
    e('&.class-name&a'), '.class-name',
    '01.07.04')
})

test('01.08 - class: dollar', t => {
  t.is(
    e('div .class-name$a'), '.class-name',
    '01.08.01')
  t.is(
    e('div.class-name$a'), '.class-name',
    '01.08.02')
  t.is(
    e('.class-name$a'), '.class-name',
    '01.08.03')
  t.is(
    e('$.class-name$a'), '.class-name',
    '01.08.04')
  t.is(
    e('a[title~=name] .class-name$a'), '.class-name',
    '01.08.05')
})

test('01.09 - class: percentage', t => {
  t.is(
    e('div .class-name%a'), '.class-name',
    '01.09.01')
  t.is(
    e('div.class-name%a'), '.class-name',
    '01.09.02')
  t.is(
    e('.class-name%a'), '.class-name',
    '01.09.03')
  t.is(
    e('%.class-name%a'), '.class-name',
    '01.09.04')
  t.is(
    e('[%~class-name] .class-name%a'), '.class-name',
    '01.09.05')
})

test('01.10 - class: circumflex', t => {
  t.is(
    e('a.class-name[href^="https"]'), '.class-name',
    '01.10')
})

test('01.11 - class: ampersand', t => {
  t.is(
    e('.class-name &'), '.class-name',
    '01.11')
})

test('01.12 - class: asterisk', t => {
  t.is(
    e('.class-name *'), '.class-name',
    '01.12.01')
  t.is(
    e('*.class-name *'), '.class-name',
    '01.12.02')
})

test('01.13 - class: brackets', t => {
  t.is(
    e('p.class-name:lang(it)'), '.class-name',
    '01.13.01')
  t.is(
    e('p.class-name:lang(it) p.class-name-other:lang(en)'), '.class-name',
    '01.13.02')
})

test('01.14 - class: plus', t => {
  t.is(
    e('div.class-name + p'), '.class-name',
    '01.14.01')
  t.is(
    e('div.class-name+p'), '.class-name',
    '01.14.02')
})

test('01.14 - class: plus', t => {
  t.is(
    e('div.class-name + p'), '.class-name',
    '01.14.01')
  t.is(
    e('div.class-name+p'), '.class-name',
    '01.14.02')
})

test('01.15 - class: equals', t => {
  t.is(
    e('a.class-name[href*="npmjs"]'), '.class-name',
    '01.15.01')
  t.is(
    e('a.class-name [href *= "npmjs"]'), '.class-name',
    '01.15.02')
})

test('01.16 - class: colon', t => {
  t.is(
    e('.class-name, .class-name-other'), '.class-name',
    '01.16.01')
  t.is(
    e('.class-name,.class-name-other'), '.class-name',
    '01.16.02')
})

test('01.17 - class: right slash', t => {
  t.is(
    e('.class-name, .class-name-other'), '.class-name',
    '01.17.01')
  t.is(
    e('.class-name,.class-name-other'), '.class-name',
    '01.17.02')
})

test('01.18 - class: apostrophe', t => {
  t.is(
    e('.class-name\''), '.class-name',
    '01.18.01')
  t.is(
    e('\'.class-name'), '.class-name',
    '01.18.02')
})

test('01.19 - class: semicolon', t => {
  t.is(
    e('.class-name;.class-name'), '.class-name',
    '01.19.01')
  t.is(
    e('.class-name;.class-name-other'), '.class-name',
    '01.19.02')
  t.is(
    e(';.class-name;.class-name-other;'), '.class-name',
    '01.19.03')
})

test('01.20 - class: colon', t => {
  t.is(
    e('input.class-name:read-only'), '.class-name',
    '01.20.01')
  t.is(
    e('input:out-of-range .class-name input:out-of-range'), '.class-name',
    '01.20.02')
  t.is(
    e('input:out-of-range .class-name::selection input:out-of-range::selection'), '.class-name',
    '01.20.03')
})

test('01.21 - class: double quote', t => {
  t.is(
    e('.class-name a[href^="https"]'), '.class-name',
    '01.21.01')
  t.is(
    e('a[href^="https"] .class-name a[href^="https"]'), '.class-name',
    '01.21.02')
})

test('01.22 - class: question mark', t => {
  t.is(
    e('.class-name ?'), '.class-name',
    '01.22.01')
  t.is(
    e('? .class-name?'), '.class-name',
    '01.22.02')
})

test('01.23 - class: question mark', t => {
  t.is(
    e('.class-name> p'), '.class-name',
    '01.23.01')
  t.is(
    e('* > .class-name > p > .class-name-other'), '.class-name',
    '01.23.02')
  t.is(
    e('*.class-name> .class-name-other> p > .class-name-other'), '.class-name',
    '01.23.03')
})

test('01.24 - class: square brackets', t => {
  t.is(
    e('a[target=_blank] .class-name a[target=_blank]'), '.class-name',
    '01.24.01')
  t.is(
    e('a[target=_blank] .class-name[target=_blank]'), '.class-name',
    '01.24.02')
})

test('01.25 - class: curly brackets', t => {
  t.is(
    e('a{target=_blank} .class-name a{target=_blank}'), '.class-name',
    '01.25.01')
  t.is(
    e('a{target=_blank} .class-name{target=_blank}'), '.class-name',
    '01.25.02')
})

test('01.26 - class: pipe', t => {
  t.is(
    e('|.class-name|=en]'), '.class-name',
    '01.26.01')
  t.is(
    e('a[lang|=en] .class-name[lang|=en]'), '.class-name',
    '01.26.02')
})

test('01.27 - class: tick', t => {
  t.is(
    e('`.class-name`'), '.class-name',
    '01.27.01')
})

test('01.28 - class: hash', t => {
  t.is(
    e('#.class-name#news:target`'), '.class-name',
    '01.28.01')
})

// ==============================
// Hash, in case if ID's are fitered
// ==============================

test('02.01 - id: just id passed, nothing done, falls on default', t => {
  t.is(
    e('#id-name', '#'), '#id-name',
    '02.01')
})

test('02.02 - id: tag with id', t => {
  t.is(
    e('div#id-name#whatever', '#'), '#id-name',
    '02.02')
})

test('02.03 - id: id within tag', t => {
  t.is(
    e('div #id-name', '#'), '#id-name',
    '02.03.01')
  t.is(
    e('div #id-name ', '#'), '#id-name',
    '02.03.02')
  t.is(
    e('div       #id-name        ', '#'), '#id-name',
    '02.03.03')
})

test('02.04 - id: id within tag\'s child tag', t => {
  t.is(
    e('div #id-name a', '#'), '#id-name',
    '02.04')
})

test('02.05 - id: more, sandwitched', t => {
  t.is(
    e('div.yo~!@$%^&*()+=,/\';:"?><[]{}|`#id-name.yo~!@$%^&*()+=,/\';:"?><[]{}|`', '#'), '#id-name',
    '02.05')
})

test('02.06 - id: exclamation mark', t => {
  t.is(
    e('div #id-name!a', '#'), '#id-name',
    '02.06.01')
})

test('02.07 - id: ampersand', t => {
  t.is(
    e('div #id-name&a', '#'), '#id-name',
    '02.07.01')
  t.is(
    e('div#id-name&a', '#'), '#id-name',
    '02.07.02')
  t.is(
    e('#id-name&a', '#'), '#id-name',
    '02.07.03')
  t.is(
    e('&#id-name&a', '#'), '#id-name',
    '02.07.04')
})

test('02.08 - id: dollar', t => {
  t.is(
    e('div #id-name$a', '#'), '#id-name',
    '02.08.01')
  t.is(
    e('div#id-name$a', '#'), '#id-name',
    '02.08.02')
  t.is(
    e('#id-name$a', '#'), '#id-name',
    '02.08.03')
  t.is(
    e('$#id-name$a', '#'), '#id-name',
    '02.08.04')
  t.is(
    e('a[title~=name] #id-name$a', '#'), '#id-name',
    '02.08.05')
})

test('02.09 - id: percentage', t => {
  t.is(
    e('div #id-name%a', '#'), '#id-name',
    '02.9.01')
  t.is(
    e('div#id-name%a', '#'), '#id-name',
    '02.9.02')
  t.is(
    e('#id-name%a', '#'), '#id-name',
    '02.9.03')
  t.is(
    e('%#id-name%a', '#'), '#id-name',
    '02.9.04')
  t.is(
    e('[%~class-name] #id-name%a', '#'), '#id-name',
    '02.9.05')
})

test('02.10 - id: circumflex', t => {
  t.is(
    e('a#id-name[href^="https"]', '#'), '#id-name',
    '02.10')
})

test('02.11 - id: ampersand', t => {
  t.is(
    e('#id-name &', '#'), '#id-name',
    '02.11')
})

test('02.12 - id: asterisk', t => {
  t.is(
    e('#id-name *', '#'), '#id-name',
    '02.12.01')
  t.is(
    e('*#id-name *', '#'), '#id-name',
    '02.12.02')
})

test('02.13 - id: brackets', t => {
  t.is(
    e('p#id-name:lang(it)', '#'), '#id-name',
    '02.13.01')
  t.is(
    e('p#id-name:lang(it) p#id-name-other:lang(en)', '#'), '#id-name',
    '02.13.02')
})

test('02.14 - id: plus', t => {
  t.is(
    e('div#id-name + p', '#'), '#id-name',
    '02.14.01')
  t.is(
    e('div#id-name+p', '#'), '#id-name',
    '02.14.02')
})

test('02.14 - id: plus', t => {
  t.is(
    e('div#id-name + p', '#'), '#id-name',
    '02.14.01')
  t.is(
    e('div#id-name+p', '#'), '#id-name',
    '02.14.02')
})

test('02.15 - id: equals', t => {
  t.is(
    e('a#id-name[href*="npmjs"]', '#'), '#id-name',
    '02.15.01')
  t.is(
    e('a#id-name [href *= "npmjs"]', '#'), '#id-name',
    '02.15.02')
})

test('02.16 - id: colon', t => {
  t.is(
    e('#id-name, #id-name-other', '#'), '#id-name',
    '02.16.01')
  t.is(
    e('#id-name,#id-name-other', '#'), '#id-name',
    '02.16.02')
})

test('02.17 - id: right slash', t => {
  t.is(
    e('#id-name, #id-name-other', '#'), '#id-name',
    '02.17.01')
  t.is(
    e('#id-name,#id-name-other', '#'), '#id-name',
    '02.17.02')
})

test('02.18 - id: apostrophe', t => {
  t.is(
    e('#id-name\'', '#'), '#id-name',
    '02.18.01')
  t.is(
    e('\'#id-name', '#'), '#id-name',
    '02.18.02')
})

test('02.19 - id: semicolon', t => {
  t.is(
    e('#id-name;#id-name', '#'), '#id-name',
    '02.19.01')
  t.is(
    e('#id-name;#id-name-other', '#'), '#id-name',
    '02.19.02')
  t.is(
    e(';#id-name;#id-name-other;', '#'), '#id-name',
    '02.19.03')
})

test('02.20 - id: colon', t => {
  t.is(
    e('input#id-name:read-only', '#'), '#id-name',
    '02.20.01')
  t.is(
    e('input:out-of-range #id-name input:out-of-range', '#'), '#id-name',
    '02.20.02')
  t.is(
    e('input:out-of-range #id-name::selection input:out-of-range::selection', '#'), '#id-name',
    '02.20.03')
})

test('02.21 - id: double quote', t => {
  t.is(
    e('#id-name a[href^="https"]', '#'), '#id-name',
    '02.22.01')
  t.is(
    e('a[href^="https"] #id-name a[href^="https"]', '#'), '#id-name',
    '02.22.02')
})

test('02.22 - id: question mark', t => {
  t.is(
    e('#id-name ?', '#'), '#id-name',
    '02.22.01')
  t.is(
    e('? #id-name?', '#'), '#id-name',
    '02.22.02')
})

test('02.23 - id: question mark', t => {
  t.is(
    e('#id-name> p', '#'), '#id-name',
    '02.23.01')
  t.is(
    e('* > #id-name > p > #id-name-other', '#'), '#id-name',
    '02.23.02')
  t.is(
    e('*#id-name> #id-name-other> p > #id-name-other', '#'), '#id-name',
    '02.23.03')
})

test('02.24 - id: square brackets', t => {
  t.is(
    e('a[target=_blank] #id-name a[target=_blank]', '#'), '#id-name',
    '02.24.01')
  t.is(
    e('a[target=_blank] #id-name[target=_blank]', '#'), '#id-name',
    '02.24.02')
})

test('02.25 - id: curly brackets', t => {
  t.is(
    e('a{target=_blank} #id-name a{target=_blank}', '#'), '#id-name',
    '02.25.01')
  t.is(
    e('a{target=_blank} #id-name{target=_blank}', '#'), '#id-name',
    '02.25.02')
})

test('02.26 - id: pipe', t => {
  t.is(
    e('|#id-name|=en]', '#'), '#id-name',
    '02.26.01')
  t.is(
    e('a[lang|=en] #id-name[lang|=en]', '#'), '#id-name',
    '02.26.02')
})

test('02.27 - id: tick', t => {
  t.is(
    e('`#id-name`', '#'), '#id-name',
    '02.27.01')
})

test('02.28 - id: full stop', t => {
  t.is(
    e('.#id-name.target`', '#'), '#id-name',
    '02.28.01')
})

// ==============================
// Precautions
// ==============================

test('03.01 - no params', t => {
  t.throws(() => {
    e(undefined)
  })
})
