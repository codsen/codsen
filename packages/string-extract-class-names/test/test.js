import test from 'ava'
import e from '../dist/string-extract-class-names.cjs'

// ~!@$%^&*()+=,./';:"?><[]\{}|`# ++++ space char

// ==============================
// normal use cases
// ==============================

test('01.01 - class: just class passed, nothing done, falls on default', (t) => {
  t.deepEqual(
    e('.class-name'), ['.class-name'],
    '01.01',
  )
})

test('01.02 - tag with two classes', (t) => {
  t.deepEqual(
    e('div.first-class.second-class'),
    ['.first-class', '.second-class'],
    '01.02',
  )
})

test('01.03 - class: class within tag', (t) => {
  t.deepEqual(
    e('div .class-name'), ['.class-name'],
    '01.03.01',
  )
  t.deepEqual(
    e('div .class-name '), ['.class-name'],
    '01.03.02',
  )
  t.deepEqual(
    e('div       .class-name        '), ['.class-name'],
    '01.03.03',
  )
  t.deepEqual(
    e('div       .first-class.second-class        '), ['.first-class', '.second-class'],
    '01.03.04',
  )
})

test('01.04 - class: class within tag\'s child tag', (t) => {
  t.deepEqual(
    e('div .class-name a'), ['.class-name'],
    '01.04.01',
  )
  t.deepEqual(
    e('div .first-class.second-class a'), ['.first-class', '.second-class'],
    '01.04.02',
  )
})

test('01.05 - class: more, sandwitched', (t) => {
  t.deepEqual(
    e('div~!@$%^&*()+=,/\';:"?><[]{}|`.class-name~!@$%^&*()+=,/\';:"?><[]{}|`#'), ['.class-name'],
    '01.05',
  )
})

test('01.06 - class: exclamation mark', (t) => {
  t.deepEqual(
    e('div .class-name!a'), ['.class-name'],
    '01.06.01',
  )
  t.deepEqual(
    e('div.class-name!a'), ['.class-name'],
    '01.06.02',
  )
  t.deepEqual(
    e('.class-name!a'), ['.class-name'],
    '01.06.03',
  )
  t.deepEqual(
    e('!.class-name!a'), ['.class-name'],
    '01.06.04',
  )
  t.deepEqual(
    e('!.first-class.second-class!a'), ['.first-class', '.second-class'],
    '01.06.05',
  )
})

test('01.07 - class: ampersand', (t) => {
  t.deepEqual(
    e('div .class-name&a'), ['.class-name'],
    '01.07.01',
  )
  t.deepEqual(
    e('div.class-name&a'), ['.class-name'],
    '01.07.02',
  )
  t.deepEqual(
    e('.class-name&a'), ['.class-name'],
    '01.07.03',
  )
  t.deepEqual(
    e('&.class-name&a'), ['.class-name'],
    '01.07.04',
  )
  t.deepEqual(
    e('&.first-class.second-class&a'), ['.first-class', '.second-class'],
    '01.07.05',
  )
})

test('01.08 - class: dollar', (t) => {
  t.deepEqual(
    e('div .class-name$a'), ['.class-name'],
    '01.08.01',
  )
  t.deepEqual(
    e('div.class-name$a'), ['.class-name'],
    '01.08.02',
  )
  t.deepEqual(
    e('.class-name$a'), ['.class-name'],
    '01.08.03',
  )
  t.deepEqual(
    e('$.class-name$a'), ['.class-name'],
    '01.08.04',
  )
  t.deepEqual(
    e('a[title~=name] .class-name$a'), ['.class-name'],
    '01.08.05',
  )
  t.deepEqual(
    e('a[title~=name] .first-class.second-class$a'), ['.first-class', '.second-class'],
    '01.08.06',
  )
})

test('01.09 - class: percentage', (t) => {
  t.deepEqual(
    e('div .class-name%a'), ['.class-name'],
    '01.09.01',
  )
  t.deepEqual(
    e('div.class-name%a'), ['.class-name'],
    '01.09.02',
  )
  t.deepEqual(
    e('.class-name%a'), ['.class-name'],
    '01.09.03',
  )
  t.deepEqual(
    e('%.class-name%a'), ['.class-name'],
    '01.09.04',
  )
  t.deepEqual(
    e('[%~class-name] .class-name%a'), ['.class-name'],
    '01.09.05',
  )
  t.deepEqual(
    e('[%~class-name] .first-class.second-class%a'), ['.first-class', '.second-class'],
    '01.09.06',
  )
})

test('01.10 - class: circumflex', (t) => {
  t.deepEqual(
    e('a.class-name[href^="https"]'), ['.class-name'],
    '01.10.01',
  )
  t.deepEqual(
    e('a.first-class.second-class[href^="https"]'), ['.first-class', '.second-class'],
    '01.10.02',
  )
})

test('01.11 - class: ampersand', (t) => {
  t.deepEqual(
    e('.class-name &'), ['.class-name'],
    '01.11.01',
  )
  t.deepEqual(
    e('.first-class.second-class &'), ['.first-class', '.second-class'],
    '01.11.02',
  )
})

test('01.12 - class: asterisk', (t) => {
  t.deepEqual(
    e('.class-name *'), ['.class-name'],
    '01.12.01',
  )
  t.deepEqual(
    e('*.class-name *'), ['.class-name'],
    '01.12.02',
  )
  t.deepEqual(
    e('*.first-class.second-class*'), ['.first-class', '.second-class'],
    '01.12.03',
  )
})

test('01.13 - class: brackets', (t) => {
  t.deepEqual(
    e('p.class-name:lang(it)'), ['.class-name'],
    '01.13.01',
  )
  t.deepEqual(
    e('p.class-name:lang(it) p.class-name-other:lang(en)'), ['.class-name', '.class-name-other'],
    '01.13.02',
  )
  t.deepEqual(
    e(':.first-class.second-class:'), ['.first-class', '.second-class'],
    '01.13.03',
  )
})

test('01.14 - class: plus', (t) => {
  t.deepEqual(
    e('div.class-name + p'), ['.class-name'],
    '01.14.01',
  )
  t.deepEqual(
    e('div.class-name+p'), ['.class-name'],
    '01.14.02',
  )
  t.deepEqual(
    e('+.first-class.second-class+'), ['.first-class', '.second-class'],
    '01.14.03',
  )
})

test('01.15 - class: equals', (t) => {
  t.deepEqual(
    e('a.class-name[href*="npmjs"]'), ['.class-name'],
    '01.15.01',
  )
  t.deepEqual(
    e('a.class-name [href *= "npmjs"]'), ['.class-name'],
    '01.15.02',
  )
  t.deepEqual(
    e('=.first-class.second-class='), ['.first-class', '.second-class'],
    '01.15.03',
  )
})

test('01.16 - class: colon', (t) => {
  t.deepEqual(
    e('.class-name, .class-name-other'), ['.class-name', '.class-name-other'],
    '01.16.01',
  )
  t.deepEqual(
    e('.class-name,.class-name-other'), ['.class-name', '.class-name-other'],
    '01.16.02',
  )
  t.deepEqual(
    e(',.first-class.second-class,'), ['.first-class', '.second-class'],
    '01.16.03',
  )
})

test('01.17 - class: right slash', (t) => {
  t.deepEqual(
    e('.class-name/class-name-other'), ['.class-name'],
    '01.17.01',
  )
  t.deepEqual(
    e('.class-name/class-name-other'), ['.class-name'],
    '01.17.02',
  )
  t.deepEqual(
    e('/.first-class.second-class/'), ['.first-class', '.second-class'],
    '01.17.03',
  )
})

test('01.18 - class: apostrophe', (t) => {
  t.deepEqual(
    e('.class-name\''), ['.class-name'],
    '01.18.01',
  )
  t.deepEqual(
    e('\'.class-name'), ['.class-name'],
    '01.18.02',
  )
  t.deepEqual(
    e('\'.first-class.second-class\''), ['.first-class', '.second-class'],
    '01.18.03',
  )
})

test('01.19 - class: semicolon', (t) => {
  t.deepEqual(
    e('.class-name-1;.class-name-2'), ['.class-name-1', '.class-name-2'],
    '01.19.01',
  )
  t.deepEqual(
    e('.class-name-1;.class-name-2'), ['.class-name-1', '.class-name-2'],
    '01.19.02',
  )
  t.deepEqual(
    e(';.class-name-1;.class-name-2;'), ['.class-name-1', '.class-name-2'],
    '01.19.03',
  )
  t.deepEqual(
    e(';.first-class.second-class;'), ['.first-class', '.second-class'],
    '01.19.04',
  )
})

test('01.20 - class: colon', (t) => {
  t.deepEqual(
    e('input.class-name:read-only'), ['.class-name'],
    '01.20.01',
  )
  t.deepEqual(
    e('input:out-of-range .class-name input:out-of-range'), ['.class-name'],
    '01.20.02',
  )
  t.deepEqual(
    e('input:out-of-range .class-name::selection input:out-of-range::selection'), ['.class-name'],
    '01.20.03',
  )
  t.deepEqual(
    e(':.first-class.second-class:'), ['.first-class', '.second-class'],
    '01.20.04',
  )
})

test('01.21 - class: double quote', (t) => {
  t.deepEqual(
    e('.class-name a[href^="https"]'), ['.class-name'],
    '01.21.01',
  )
  t.deepEqual(
    e('a[href^="https"] .class-name a[href^="https"]'), ['.class-name'],
    '01.21.02',
  )
  t.deepEqual(
    e('"https".class-name"https"'), ['.class-name'],
    '01.21.03',
  )
  t.deepEqual(
    e('"https".first-class.second-class"https"'), ['.first-class', '.second-class'],
    '01.21.04',
  )
})

test('01.22 - class: question mark', (t) => {
  t.deepEqual(
    e('.class-name ?'), ['.class-name'],
    '01.22.01',
  )
  t.deepEqual(
    e('? .class-name?'), ['.class-name'],
    '01.22.02',
  )
  t.deepEqual(
    e('?.class-name?'), ['.class-name'],
    '01.22.03',
  )
  t.deepEqual(
    e('?.first-class.second-class?'), ['.first-class', '.second-class'],
    '01.22.04',
  )
})

test('01.23 - class: greater than sign', (t) => {
  t.deepEqual(
    e('.class-name> p'), ['.class-name'],
    '01.23.01',
  )
  t.deepEqual(
    e('* > .class-name > p > .class-name-other'), ['.class-name', '.class-name-other'],
    '01.23.02',
  )
  t.deepEqual(
    e('*.class-name> .class-name-other> p > .class-name-another'), ['.class-name', '.class-name-other', '.class-name-another'],
    '01.23.03',
  )
  t.deepEqual(
    e('>.class1.class2> .class3.class4> p > .class5.class6'), ['.class1', '.class2', '.class3', '.class4', '.class5', '.class6'],
    '01.23.04',
  )
})

test('01.24 - class: square brackets', (t) => {
  t.deepEqual(
    e('a[target=_blank] .class-name a[target=_blank]'), ['.class-name'],
    '01.24.01',
  )
  t.deepEqual(
    e('a[target=_blank] .class-name[target=_blank]'), ['.class-name'],
    '01.24.02',
  )
  t.deepEqual(
    e('a[target=_blank].class-name[target=_blank]'), ['.class-name'],
    '01.24.03',
  )
  t.deepEqual(
    e('a[target=_blank].first-class.second-class[target=_blank]'), ['.first-class', '.second-class'],
    '01.24.04',
  )
})

test('01.25 - class: curly brackets', (t) => {
  t.deepEqual(
    e('a{target=_blank} .class-name a{target=_blank}'), ['.class-name'],
    '01.25.01',
  )
  t.deepEqual(
    e('a{target=_blank} .class-name{target=_blank}'), ['.class-name'],
    '01.25.02',
  )
  t.deepEqual(
    e('a{target=_blank}.class-name{target=_blank}'), ['.class-name'],
    '01.25.03',
  )
  t.deepEqual(
    e('a{target=_blank}.first-class.second-class{target=_blank}'), ['.first-class', '.second-class'],
    '01.25.04',
  )
})

test('01.26 - class: pipe', (t) => {
  t.deepEqual(
    e('|.class-name|=en]'), ['.class-name'],
    '01.26.01',
  )
  t.deepEqual(
    e('a[lang|=en] .class-name[lang|=en]'), ['.class-name'],
    '01.26.02',
  )
  t.deepEqual(
    e('|.class-name|'), ['.class-name'],
    '01.26.03',
  )
  t.deepEqual(
    e('|.first-class.second-class|'), ['.first-class', '.second-class'],
    '01.26.04',
  )
})

test('01.27 - class: tick', (t) => {
  t.deepEqual(
    e('`.class-name`'), ['.class-name'],
    '01.27.01',
  )
  t.deepEqual(
    e('`.first-class.second-class`'), ['.first-class', '.second-class'],
    '01.27.02',
  )
})

test('01.28 - one-letter class names', (t) => {
  t.deepEqual(
    e('.h'), ['.h'],
    '01.28.01',
  )
  t.deepEqual(
    e('.a.b.c'), ['.a', '.b', '.c'],
    '01.28.02',
  )
})

// ==============================
// Hash, in case if ID's are found
// ==============================

test('02.01 - id: just id passed, nothing done, falls on default', (t) => {
  t.deepEqual(
    e('#id-name'), ['#id-name'],
    '02.01',
  )
})

test('02.02 - id: tag with id', (t) => {
  t.deepEqual(
    e('div#id-name#whatever'), ['#id-name', '#whatever'],
    '02.02.01',
  )
  t.deepEqual(
    e('div#id-name.class.another'), ['#id-name', '.class', '.another'],
    '02.02.02',
  )
})

test('02.03 - id: id within tag', (t) => {
  t.deepEqual(
    e('div #id-name'), ['#id-name'],
    '02.03.01',
  )
  t.deepEqual(
    e('div #id-name '), ['#id-name'],
    '02.03.02',
  )
  t.deepEqual(
    e('div       #id-name        '), ['#id-name'],
    '02.03.03',
  )
  t.deepEqual(
    e('div       #first-id#second-id        '), ['#first-id', '#second-id'],
    '02.03.04',
  )
})

test('02.04 - id: id within tag\'s child tag', (t) => {
  t.deepEqual(
    e('div #id-name a'), ['#id-name'],
    '02.04.01',
  )
  t.deepEqual(
    e('div #id-name#second#third a'), ['#id-name', '#second', '#third'],
    '02.04.02',
  )
  t.deepEqual(
    e('div #id-name.second.third a'), ['#id-name', '.second', '.third'],
    '02.04.03',
  )
})

test('02.05 - id: more, sandwitched', (t) => {
  t.deepEqual(
    e('~!@$%^&*()+=,/\';:"?><[]{}|`#id-name#second#third[]yo~!@$%^&*()+=,/\';:"?><[]{}|`'), ['#id-name', '#second', '#third'],
    '02.05',
  )
})

test('02.06 - id: exclamation mark', (t) => {
  t.deepEqual(
    e('div #id-name!a'), ['#id-name'],
    '02.06.01',
  )
  t.deepEqual(
    e('!#id-name!'), ['#id-name'],
    '02.06.02',
  )
  t.deepEqual(
    e('!#id-name#second#third!'), ['#id-name', '#second', '#third'],
    '02.06.03',
  )
  t.deepEqual(
    e('!#id-name.second#third.fourth!'), ['#id-name', '.second', '#third', '.fourth'],
    '02.06.04',
  )
})

test('02.07 - id: ampersand', (t) => {
  t.deepEqual(
    e('div #id-name&a'), ['#id-name'],
    '02.07.01',
  )
  t.deepEqual(
    e('div#id-name&a'), ['#id-name'],
    '02.07.02',
  )
  t.deepEqual(
    e('#id-name&a'), ['#id-name'],
    '02.07.03',
  )
  t.deepEqual(
    e('&#id-name&a'), ['#id-name'],
    '02.07.04',
  )
  t.deepEqual(
    e('&#id-name#second.third&a'), ['#id-name', '#second', '.third'],
    '02.07.05',
  )
})

test('02.08 - id: dollar', (t) => {
  t.deepEqual(
    e('div #id-name$a'), ['#id-name'],
    '02.08.01',
  )
  t.deepEqual(
    e('div#id-name$a'), ['#id-name'],
    '02.08.02',
  )
  t.deepEqual(
    e('#id-name$a'), ['#id-name'],
    '02.08.03',
  )
  t.deepEqual(
    e('$#id-name$a'), ['#id-name'],
    '02.08.04',
  )
  t.deepEqual(
    e('a[title~=name] #id-name$a'), ['#id-name'],
    '02.08.05',
  )
  t.deepEqual(
    e('$#id-name$'), ['#id-name'],
    '02.08.06',
  )
  t.deepEqual(
    e('$#id-name#second$'), ['#id-name', '#second'],
    '02.08.07',
  )
})

test('02.09 - id: percentage', (t) => {
  t.deepEqual(
    e('div #id-name%a'), ['#id-name'],
    '02.09.01',
  )
  t.deepEqual(
    e('div#id-name%a'), ['#id-name'],
    '02.09.02',
  )
  t.deepEqual(
    e('#id-name%a'), ['#id-name'],
    '02.09.03',
  )
  t.deepEqual(
    e('%#id-name%a'), ['#id-name'],
    '02.09.04',
  )
  t.deepEqual(
    e('[%~class-name] #id-name%a'), ['#id-name'],
    '02.09.05',
  )
  t.deepEqual(
    e('%#id-name%'), ['#id-name'],
    '02.09.06',
  )
  t.deepEqual(
    e('%#id-name#second%'), ['#id-name', '#second'],
    '02.09.07',
  )
})

test('02.10 - id: circumflex', (t) => {
  t.deepEqual(
    e('a#id-name[href^="https"]'), ['#id-name'],
    '02.10.01',
  )
  t.deepEqual(
    e('^#id-name^'), ['#id-name'],
    '02.10.02',
  )
  t.deepEqual(
    e('^#id-name#second^'), ['#id-name', '#second'],
    '02.10.03',
  )
})

test('02.11 - id: ampersand', (t) => {
  t.deepEqual(
    e('#id-name &'), ['#id-name'],
    '02.11.01',
  )
  t.deepEqual(
    e('&#id-name&'), ['#id-name'],
    '02.11.02',
  )
  t.deepEqual(
    e('&#id-name#second&'), ['#id-name', '#second'],
    '02.11.03',
  )
})

test('02.12 - id: asterisk', (t) => {
  t.deepEqual(
    e('#id-name *'), ['#id-name'],
    '02.12.01',
  )
  t.deepEqual(
    e('*#id-name *'), ['#id-name'],
    '02.12.02',
  )
  t.deepEqual(
    e('*#id-name*'), ['#id-name'],
    '02.12.03',
  )
  t.deepEqual(
    e('*#id-name#second*'), ['#id-name', '#second'],
    '02.12.04',
  )
})

test('02.13 - id: brackets', (t) => {
  t.deepEqual(
    e('p#id-name:lang(it)'), ['#id-name'],
    '02.13.01',
  )
  t.deepEqual(
    e('p#id-name:lang(it) p#id-name-other:lang(en)'), ['#id-name', '#id-name-other'],
    '02.13.02',
  )
  t.deepEqual(
    e('()#id-name()'), ['#id-name'],
    '02.13.03',
  )
  t.deepEqual(
    e('(#id-name)'), ['#id-name'],
    '02.13.04',
  )
  t.deepEqual(
    e('(#id-name#second.class)'), ['#id-name', '#second', '.class'],
    '02.13.05',
  )
})

test('02.14 - id: plus', (t) => {
  t.deepEqual(
    e('div#id-name + p'), ['#id-name'],
    '02.14.01',
  )
  t.deepEqual(
    e('div#id-name+p'), ['#id-name'],
    '02.14.02',
  )
  t.deepEqual(
    e('+#id-name+'), ['#id-name'],
    '02.14.03',
  )
  t.deepEqual(
    e('+#id-name#second+'), ['#id-name', '#second'],
    '02.14.04',
  )
})

test('02.15 - id: equals', (t) => {
  t.deepEqual(
    e('a#id-name[href*="npmjs"]'), ['#id-name'],
    '02.15.01',
  )
  t.deepEqual(
    e('a#id-name [href *= "npmjs"]'), ['#id-name'],
    '02.15.02',
  )
  t.deepEqual(
    e('a#id-name [href *= "npmjs"]'), ['#id-name'],
    '02.15.03',
  )
  t.deepEqual(
    e('=#id-name#second='), ['#id-name', '#second'],
    '02.15.04',
  )
})

test('02.16 - id: colon', (t) => {
  t.deepEqual(
    e('#id-name, #id-name-other'), ['#id-name', '#id-name-other'],
    '02.16.01',
  )
  t.deepEqual(
    e('#id-name,#id-name-other'), ['#id-name', '#id-name-other'],
    '02.16.02',
  )
  t.deepEqual(
    e(',#id-name,'), ['#id-name'],
    '02.16.03',
  )
  t.deepEqual(
    e(',#id-name#second,'), ['#id-name', '#second'],
    '02.16.04',
  )
})

test('02.17 - id: right slash', (t) => {
  t.deepEqual(
    e('#id-name/#id-name-other'), ['#id-name', '#id-name-other'],
    '02.17.01',
  )
  t.deepEqual(
    e('/#id-name/#id-name-other'), ['#id-name', '#id-name-other'],
    '02.17.02',
  )
  t.deepEqual(
    e('/#id-name/'), ['#id-name'],
    '02.17.03',
  )
  t.deepEqual(
    e('/#id-name#second/'), ['#id-name', '#second'],
    '02.17.04',
  )
})

test('02.18 - id: apostrophe', (t) => {
  t.deepEqual(
    e('#id-name\''), ['#id-name'],
    '02.18.01',
  )
  t.deepEqual(
    e('\'#id-name'), ['#id-name'],
    '02.18.02',
  )
  t.deepEqual(
    e('\'#id-name#second'), ['#id-name', '#second'],
    '02.18.03',
  )
})

test('02.19 - id: semicolon', (t) => {
  t.deepEqual(
    e('#id1;#id2'), ['#id1', '#id2'],
    '02.19.01',
  )
  t.deepEqual(
    e('#id-name;#id-name-other'), ['#id-name', '#id-name-other'],
    '02.19.02',
  )
  t.deepEqual(
    e(';#id-name;#id-name-other;'), ['#id-name', '#id-name-other'],
    '02.19.03',
  )
  t.deepEqual(
    e(';#id1#id2;#id3#id4;'), ['#id1', '#id2', '#id3', '#id4'],
    '02.19.04',
  )
})

test('02.20 - id: colon', (t) => {
  t.deepEqual(
    e('input#id-name:read-only'), ['#id-name'],
    '02.20.01',
  )
  t.deepEqual(
    e('input:out-of-range #id-name input:out-of-range'), ['#id-name'],
    '02.20.02',
  )
  t.deepEqual(
    e('input:out-of-range #id-name::selection input:out-of-range::selection'), ['#id-name'],
    '02.20.03',
  )
  t.deepEqual(
    e('input:out-of-range #id-name#second.third::selection input:out-of-range::selection'), ['#id-name', '#second', '.third'],
    '02.20.04',
  )
})

test('02.21 - id: double quote', (t) => {
  t.deepEqual(
    e('#id-name a[href^="https"]'), ['#id-name'],
    '02.21.01',
  )
  t.deepEqual(
    e('a[href^="https"] #id-name a[href^="https"]'), ['#id-name'],
    '02.21.02',
  )
  t.deepEqual(
    e('a[href^="https"] #id-name#second a[href^="https"]'), ['#id-name', '#second'],
    '02.21.03',
  )
})

test('02.22 - id: question mark', (t) => {
  t.deepEqual(
    e('#id-name ?'), ['#id-name'],
    '02.22.01',
  )
  t.deepEqual(
    e('?#id-name?'), ['#id-name'],
    '02.22.02',
  )
  t.deepEqual(
    e('?#id-name#second?'), ['#id-name', '#second'],
    '02.22.03',
  )
})

test('02.23 - id: question mark', (t) => {
  t.deepEqual(
    e('?#id-name?'), ['#id-name'],
    '02.23.01',
  )
  t.deepEqual(
    e('?#id-name? > p > #id-name-other'), ['#id-name', '#id-name-other'],
    '02.23.02',
  )
  t.deepEqual(
    e('?#id-name-1? #id-name-2> p > #id-name-3'), ['#id-name-1', '#id-name-2', '#id-name-3'],
    '02.23.03',
  )
  t.deepEqual(
    e('?#id1#id2? #id3#id4> p > #id5#id6'), ['#id1', '#id2', '#id3', '#id4', '#id5', '#id6'],
    '02.23.04',
  )
})

test('02.24 - id: square brackets', (t) => {
  t.deepEqual(
    e('a[target=_blank] #id-name a[target=_blank]'), ['#id-name'],
    '02.24.01',
  )
  t.deepEqual(
    e('a[target=_blank] #id-name[target=_blank]'), ['#id-name'],
    '02.24.02',
  )
  t.deepEqual(
    e('[zzz]#id-name#second[target=_blank]'), ['#id-name', '#second'],
    '02.24.03',
  )
  t.deepEqual(
    e('zzz[#id-name#second]zzz'), ['#id-name', '#second'],
    '02.24.04',
  )
})

test('02.25 - id: curly brackets', (t) => {
  t.deepEqual(
    e('a{target=_blank} #id-name a{target=_blank}'), ['#id-name'],
    '02.25.01',
  )
  t.deepEqual(
    e('a{target=_blank} #id-name{target=_blank}'), ['#id-name'],
    '02.25.02',
  )
  t.deepEqual(
    e('aaa{bbb}#id-name#second{ccc}ddd'), ['#id-name', '#second'],
    '02.25.03',
  )
  t.deepEqual(
    e('{#id-name#second}'), ['#id-name', '#second'],
    '02.25.04',
  )
  t.deepEqual(
    e('zz{#id-name#second}zzz'), ['#id-name', '#second'],
    '02.25.05',
  )
})

test('02.26 - id: pipe', (t) => {
  t.deepEqual(
    e('|#id-name|=en]'), ['#id-name'],
    '02.26.01',
  )
  t.deepEqual(
    e('a[lang|=en] #id-name[lang|=en]'), ['#id-name'],
    '02.26.02',
  )
  t.deepEqual(
    e('|#id-name#second|'), ['#id-name', '#second'],
    '02.26.03',
  )
})

test('02.27 - id: tick', (t) => {
  t.deepEqual(
    e('`#id-name`'), ['#id-name'],
    '02.27.01',
  )
  t.deepEqual(
    e('`#id-name#second`'), ['#id-name', '#second'],
    '02.27.02',
  )
})

// ==============================
// Recognising class/id names after any character which is not allowed in class/id names
// ==============================

test('03.01 - classes separated with a space should be recognised', (t) => {
  t.deepEqual(
    e('div.first-class .second-class'),
    ['.first-class', '.second-class'],
    '03.01.01',
  )
  t.deepEqual(
    e('div.first-class div.second-class'),
    ['.first-class', '.second-class'],
    '03.01.02',
  )
  t.deepEqual(
    e('.first-class .second-class'),
    ['.first-class', '.second-class'],
    '03.01.03',
  )
})

test('03.02 - classes recognised after brackets', (t) => {
  t.deepEqual(
    e('div.class1[lang|=en]#id1[something] .class2[lang|=en] #id2'),
    ['.class1', '#id1', '.class2', '#id2'],
    '03.02.01',
  )
  t.deepEqual(
    e('div.first-class[lang|=en] div.second-class[lang|=en]'),
    ['.first-class', '.second-class'],
    '03.02.02',
  )
  t.deepEqual(
    e('.first-class[lang|=en] .second-class[lang|=en]'),
    ['.first-class', '.second-class'],
    '03.02.03',
  )
})

// ==============================
// Precautions
// ==============================

test('04.01 - no params', (t) => {
  t.throws(() => {
    e(undefined)
  })
})

// ==============================
// encoded strings given by JS
// discovered working on emailcomb.com
// ==============================

test('05.01 - encoded line breaks', (t) => {
  t.deepEqual(
    e('#unused-1\n\n\n\n\t\t\t\t\nz\t\ta'),
    ['#unused-1'],
    '05.01',
  )
})

test('05.02 - recognises JS escaped strings and repeated dots & hashes', (t) => {
  t.deepEqual(
    e('\naaa\n...    .unused-1\n\n\n.unused-2, .unused-3\n\t\t,,,\t###\t\nz\t\ta'),
    ['.unused-1', '.unused-2', '.unused-3'],
    '05.02',
  )
})
