import test from 'ava'
import stripHtml from '../dist/string-strip-html.cjs'

// ==============================
// normal use cases
// ==============================

test('01.01 - string is whole (opening) tag', (t) => {
  t.deepEqual(
    stripHtml('<a>'),
    '',
    '01.01.01',
  )
  t.deepEqual(
    stripHtml('< a>'),
    '',
    '01.01.02',
  )
  t.deepEqual(
    stripHtml('<a >'),
    '',
    '01.01.03',
  )
  t.deepEqual(
    stripHtml('< a >'),
    '',
    '01.01.04',
  )
  t.deepEqual(
    stripHtml('<     a     >'),
    '',
    '01.01.05',
  )
  t.deepEqual(
    stripHtml(' <a>'),
    ' ',
    '01.01.06 - leading space is retained',
  )
  t.deepEqual(
    stripHtml('< a> '),
    ' ',
    '01.01.07 - trailing space is retained',
  )
  t.deepEqual(
    stripHtml('  <a >  '),
    '    ',
    '01.01.08',
  )
  t.deepEqual(
    stripHtml('\t< a >'),
    '\t',
    '01.01.09',
  )
  t.deepEqual(
    stripHtml('    \t   <     a     >      \n\n   '),
    '    \t         \n\n   ',
    '01.01.10 - lots of different whitespace chars',
  )
})

test('01.02 - string is whole (closing) tag', (t) => {
  t.deepEqual(
    stripHtml('</a>'),
    '',
    '01.02.01',
  )
  t.deepEqual(
    stripHtml('< /a>'),
    '',
    '01.02.02',
  )
  t.deepEqual(
    stripHtml('</ a>'),
    '',
    '01.02.03',
  )
  t.deepEqual(
    stripHtml('</a >'),
    '',
    '01.02.04',
  )
  t.deepEqual(
    stripHtml('< /a >'),
    '',
    '01.02.05',
  )
  t.deepEqual(
    stripHtml('</ a >'),
    '',
    '01.02.06',
  )
  t.deepEqual(
    stripHtml('< / a >'),
    '',
    '01.02.07',
  )
  t.deepEqual(
    stripHtml('<  /   a     >'),
    '',
    '01.02.08',
  )
  t.deepEqual(
    stripHtml(' </a>'),
    ' ',
    '01.02.09',
  )
  t.deepEqual(
    stripHtml('< /a> '),
    ' ',
    '01.02.10',
  )
  t.deepEqual(
    stripHtml('  </a >  '),
    '    ',
    '01.02.11',
  )
  t.deepEqual(
    stripHtml('\t< /a >'),
    '\t',
    '01.02.12',
  )
  t.deepEqual(
    stripHtml('    \t   <   /  a     >      \n\n   '),
    '    \t         \n\n   ',
    '01.02.13',
  )
})

// now tag pairs vs content

test('01.03 - tag pairs', (t) => {
  t.deepEqual(
    stripHtml('<a>zzz</a>'),
    'zzz',
    '01.03.01',
  )
  t.deepEqual(
    stripHtml(' <a>zzz</a> '),
    ' zzz ',
    '01.03.02',
  )
  t.deepEqual(
    stripHtml(' <a> zzz </a> '),
    '  zzz  ',
    '01.03.03',
  )
  t.deepEqual(
    stripHtml(' <a> zz\nz </a> '),
    '  zz\nz  ',
    '01.03.04',
  )
})

test('01.04 - multiple tag pairs - adds spaces - #1', (t) => {
  t.deepEqual(
    stripHtml('rrr <a>zzz</a> something\nelse<img/>zzz<div>yyy</div>uuu'),
    'rrr zzz something\nelse zzz yyy uuu',
    '01.04',
  )
})

test('01.05 - multiple tag pairs - adds spaces - #2', (t) => {
  t.deepEqual(
    stripHtml('aaaaaaa<a>bbbbbbbb'),
    'aaaaaaa bbbbbbbb',
    '01.05.01',
  )
  t.deepEqual(
    stripHtml('<a>bbbbbbbb'),
    'bbbbbbbb',
    '01.05.02',
  )
  t.deepEqual(
    stripHtml('aaaaaaa<a>'),
    'aaaaaaa',
    '01.05.03',
  )
})

test('01.06 - deletion while being on sensitive mode', (t) => {
  t.deepEqual(
    stripHtml('< div >x</div>'),
    'x',
    '01.06.01',
  )
  t.deepEqual(
    stripHtml('aaaaaaa< br >bbbbbbbb'),
    'aaaaaaa bbbbbbbb',
    '01.06.02',
  )
  t.deepEqual(
    stripHtml('aaaaaaa< div >x</div>'),
    'aaaaaaa x',
    '01.06.03',
  )
  t.deepEqual(
    stripHtml('aaaaaaa < div >x</div>'),
    'aaaaaaa x',
    '01.06.04',
  )
  t.deepEqual(
    stripHtml('aaaaaaa< div >x</div>'),
    'aaaaaaa x',
    '01.06.05',
  )
})

test('01.07 - tags with attributes', (t) => {
  t.deepEqual(
    stripHtml('aaaaaaa<div class="zzzz">x</div>bbbbbbbb'),
    'aaaaaaa x bbbbbbbb',
    '01.07.01',
  )
  t.deepEqual(
    stripHtml('aaaaaaa< br class="zzzz">bbbbbbbb'),
    'aaaaaaa bbbbbbbb',
    '01.07.02',
  )
  t.deepEqual(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    'aaaaaaa x',
    '01.07.03',
  )
  t.deepEqual(
    stripHtml('aaaaaaa < div class="zzzz">x</div>'),
    'aaaaaaa x',
    '01.07.04',
  )
  t.deepEqual(
    stripHtml('aaaaaaa< div class="zzzz">x</div>'),
    'aaaaaaa x',
    '01.07.05',
  )
  t.deepEqual(
    stripHtml('< div class="zzzz">x</div>'),
    'x',
    '01.07.06',
  )
})

test('01.08 - multiple brackets repeated', (t) => {
  t.deepEqual(
    stripHtml('aaaa<<<<<<div>something</div>bbbbb'),
    'aaaa something bbbbb',
    '01.08.01',
  )
  t.deepEqual(
    stripHtml('aaaa<<<<<<div>>>>something</div>bbbbb'),
    'aaaa something bbbbb',
    '01.08.02',
  )
  t.deepEqual(
    stripHtml('aaaa<<<<<<div>>>>something<<<</div>bbbbb'),
    'aaaa something bbbbb',
    '01.08.03',
  )
  t.deepEqual(
    stripHtml('aaaa<<<<<<div>>>>something<<<</div>>>>>>>bbbbb'),
    'aaaa something bbbbb',
    '01.08.04',
  )
  t.deepEqual(
    stripHtml('aaaa something<<<</div>>>>>>>bbbbb'),
    'aaaa something bbbbb',
    '01.08.05',
  )
  t.deepEqual(
    stripHtml('aaaa something<<<<  / div>>>>>>>bbbbb'),
    'aaaa something bbbbb',
    '01.08.06',
  )
})

// test.only('01.09 - checking can script slip through in any way', (t) => {
//   t.deepEqual(
//     stripHtml('some text <script>alert()</script> more text'),
//     'some text more text',
//     '01.09.01',
//   )
// })

// ==============================
// false positives
// ==============================

test('02.01 - very sneaky considering b is legit tag name', (t) => {
  t.deepEqual(
    stripHtml('Equations are: a < b and c > d'),
    'Equations are: a < b and c > d',
    '02.01',
  )
})

test('02.02 - tag never ends', (t) => {
  t.deepEqual(
    stripHtml('Look here: ---> a <---'),
    'Look here: ---> a <---',
    '02.02',
  )
})

// ==============================
// opts.ignoreTags
// ==============================

test('03.01 - very sneaky considering b is legit tag name', (t) => {
  t.deepEqual(
    stripHtml('Some <b>text</b> and some more <i>text</i>.', { ignoreTags: ['b'] }),
    'Some <b>text</b> and some more text.',
    '03.01',
  )
})

// ==============================
// throws
// ==============================

test('99.01 - missing/wrong type input args', (t) => {
  t.throws(() => {
    stripHtml()
  })
  t.throws(() => {
    stripHtml(null)
  })
  t.throws(() => {
    stripHtml(1)
  })
  t.throws(() => {
    stripHtml(undefined)
  })
  t.throws(() => {
    stripHtml(true)
  })
  t.notThrows(() => {
    stripHtml('')
  })
  t.notThrows(() => {
    stripHtml('zzz')
  })
  // opts:
  t.throws(() => {
    stripHtml('zzz', 'aaa')
  })
  t.throws(() => {
    stripHtml('zzz', 1)
  })
  t.throws(() => {
    stripHtml('zzz', true)
  })
})

test('99.02 - rogue keys in opts', (t) => {
  t.throws(() => {
    stripHtml('aaa', { zzz: true })
  })
})
