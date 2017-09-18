import test from 'ava'

const collapse = require('./index-es5.js')

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - wrong/missing input = throw', (t) => {
  t.throws(() => {
    collapse()
  })
  t.throws(() => {
    collapse(1)
  })
  t.throws(() => {
    collapse(null)
  })
  t.throws(() => {
    collapse(undefined)
  })
  t.throws(() => {
    collapse(true)
  })
})

test('01.02 - wrong opts = throw', (t) => {
  t.throws(() => {
    collapse('aaaa', true) // not object but bool
  })
  t.throws(() => {
    collapse('aaaa', 1) // not object but number
  })
  t.notThrows(() => {
    collapse('aaaa', undefined) // hardcoded "nothing" is ok!
  })
  t.notThrows(() => {
    collapse('aaaa', null) // null fine too - that's hardcoded "nothing"
  })
  t.throws(() => {
    collapse('aaaa', { zzz: true }) // opts contain rogue keys.
  })
  t.throws(() => {
    collapse('aaaa', { zzz: true, messageOnly: false }) // one rogue key is enough to cause a throw
  })
  t.throws(() => {
    collapse('aaaa', { messageOnly: false }) // no rogue keys.
  })
})

test('01.03 - empty string', (t) => {
  t.is(
    collapse(''),
    '',
    '01.03',
  )
})

test('01.04 - only letter characters, no white space', (t) => {
  t.is(
    collapse('aaa'),
    'aaa',
    '01.04',
  )
})

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test('02.01 - simple sequences of spaces within string', (t) => {
  t.is(
    collapse('a b'),
    'a b',
    '02.01.01 - nothing to collapse',
  )
  t.is(
    collapse('a  b'),
    'a b',
    '02.01.02',
  )
  t.is(
    collapse('aaa     bbb    ccc   dddd'),
    'aaa bbb ccc dddd',
    '02.01.03',
  )
})

test('02.02 - sequences of spaces outside of string - defaults', (t) => {
  t.is(
    collapse('  a b  '),
    'a b',
    '02.02.01 - nothing to collapse, only trim',
  )
  t.is(
    collapse(' a b '),
    'a b',
    '02.02.02 - trims single spaces',
  )
  t.is(
    collapse('\ta b\t'),
    'a b',
    '02.02.03 - trims single tabs',
  )
  t.is(
    collapse('  a  b  '),
    'a b',
    '02.02.04',
  )
  t.is(
    collapse('  aaa     bbb    ccc   dddd  '),
    'aaa bbb ccc dddd',
    '02.02.05',
  )
})

test('02.03 - sequences of spaces outside of string - opts.trimStart', (t) => {
  // opts.trimStart
  t.is(
    collapse('  a b  ', { trimStart: false }),
    ' a b',
    '02.03.01 - nothing to collapse, only trim',
  )
  t.is(
    collapse(' a b ', { trimStart: false }),
    ' a b',
    '02.03.02 - trims single spaces',
  )
  t.is(
    collapse('\ta b\t', { trimStart: false }),
    '\ta b',
    '02.03.03 - trims single tabs',
  )
  t.is(
    collapse('\n \ta b\t \n', { trimStart: false }),
    '\n \ta b',
    '02.03.04 - trims with line breaks',
  )
  t.is(
    collapse('  a  b  ', { trimStart: false }),
    ' a b',
    '02.03.05',
  )
  t.is(
    collapse('  aaa     bbb    ccc   dddd  ', { trimStart: false }),
    ' aaa bbb ccc dddd',
    '02.03.06',
  )
})

test('02.04 - sequences of spaces outside of string - opts.trimEnd', (t) => {
  // opts.trimEnd
  t.is(
    collapse('  a b  ', { trimEnd: false }),
    'a b ',
    '02.04.01 - nothing to collapse, only trim',
  )
  t.is(
    collapse(' a b ', { trimEnd: false }),
    'a b ',
    '02.04.02 - trims single spaces',
  )
  t.is(
    collapse('\ta b\t', { trimEnd: false }),
    'a b\t',
    '02.04.03 - trims single tabs',
  )
  t.is(
    collapse('\n \ta b\t \n', { trimEnd: false }),
    'a b\t \n',
    '02.04.04 - trims with line breaks',
  )
  t.is(
    collapse('\n \ta b\t    \n', { trimEnd: false }),
    'a b\t \n',
    '02.04.05 - trims with line breaks',
  )
  t.is(
    collapse('  a  b  ', { trimEnd: false }),
    'a b ',
    '02.04.06',
  )
  t.is(
    collapse('  aaa     bbb    ccc   dddd  ', { trimEnd: false }),
    'aaa bbb ccc dddd ',
    '02.04.07',
  )
})

test('02.05 - sequences of line breaks', (t) => {
  t.is(
    collapse('a\nb\nc\n\n\n\n\nd'),
    'a\nb\nc\n\n\n\n\nd',
    '02.05.01',
  )
  t.is(
    collapse('a\nb\nc\n   \n\n\n\nd'),
    'a\nb\nc\n \n\n\n\nd',
    '02.05.02',
  )
})

// -----------------------------------------------------------------------------
// 03. More tests on trimming, targetting algorithm's weakest spots
// -----------------------------------------------------------------------------

test('03.01 - trimming mixed lumps of trimmable characters', (t) => {
  // defaults
  t.is(
    collapse('\t\t\t   \t\t\taaa\t\t\t   \t\t\t'),
    'aaa',
    '03.01.01',
  )
  t.is(
    collapse('   \t\t\t   aaa   \t\t\t   '),
    'aaa',
    '03.01.02',
  )
  t.is(
    collapse('   \t \t \t   aaa   \t \t \t   '),
    'aaa',
    '03.01.03',
  )
  t.is(
    collapse('\t \n \t \r \naaa\t \r \t \n \t \n \r \t'),
    'aaa',
    '03.01.04',
  )
})

test('03.02 - trims mixed white space lump into empty string', (t) => {
  // defaults
  t.is(
    collapse('      '),
    '',
    '03.02.01',
  )
  t.is(
    collapse('\t\t\t   \t\t\t'),
    '',
    '03.02.02',
  )
  t.is(
    collapse('\t\t\t'),
    '',
    '03.02.03',
  )
  t.is(
    collapse('\n\n\n'),
    '',
    '03.02.04',
  )
})

test('03.03 - trim involving non-breaking spaces', (t) => {
  // defaults
  t.is(
    collapse('\xa0   a   \xa0'),
    '\xa0 a \xa0',
    '03.03.01',
  )
  t.is(
    collapse('    \xa0     a     \xa0      '),
    '\xa0 a \xa0',
    '03.03.02',
  )
})

// -----------------------------------------------------------------------------
// 04. Line trimming
// -----------------------------------------------------------------------------

test('04.01 - does not trim each lines because it\'s default setting', (t) => {
  t.is(
    collapse('   a   bbb  \n   c   d   '),
    'a bbb \n c d',
    '04.01.01 - defaults',
  )
})

test('04.02 - trim setting on, trims every line', (t) => {
  t.is(
    collapse('   aaa   bbb  \n    ccc   ddd   ', { trimLines: false }),
    'aaa bbb \n ccc ddd',
    '04.02.01 - defaults',
  )
  t.is(
    collapse('   aaa   bbb  \n    ccc   ddd   ', { trimLines: true }),
    'aaa bbb\nccc ddd',
    '04.02.01 - line trim',
  )
})

test('04.03 - line and outer trims and non-breaking spaces', (t) => {
  t.is(
    collapse('     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ', { trimLines: false }),
    '\xa0 aaa bbb \xa0 \n \xa0 ccc ddd \xa0',
    '04.03.01 - defaults',
  )
  t.is(
    collapse('     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ', { trimLines: true, trimnbsp: false }),
    '\xa0 aaa bbb \xa0\n\xa0 ccc ddd \xa0',
    '04.03.02 - trimLines = 1, trimnbsp = 0',
  )
  t.is(
    collapse('     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ', { trimLines: true, trimnbsp: true }),
    'aaa bbb\nccc ddd',
    '04.03.03 - trimLines = 1, trimnbsp = 1',
  )
})

test('04.04 - line and outer trims and \\r', (t) => {
  t.is(
    collapse('\n\n     a    b    \r\n    c    d      \r     e     f     \n\n\n     g    h    \r', { trimLines: true, trimnbsp: false }),
    'a b\r\nc d\re f\n\n\ng h',
    '04.04.01 - mix of \\r and \\n',
  )
  t.is(
    collapse('\n\n     a    b    \r\n    c    d      \r     e     f     \n\n\n     g    h    \r', { trimLines: true, trimnbsp: true }),
    'a b\r\nc d\re f\n\n\ng h',
    '04.04.02 same except trimnbsp = true',
  )
  t.is(
    collapse('\xa0\n\n  \xa0   a    b   \xa0 \r\n  \xa0  c    d   \xa0\xa0   \r  \xa0\xa0   e     f  \xa0\xa0   \n\n\n \xa0\xa0    g    h    \r\xa0\xa0', { trimLines: true, trimnbsp: true }),
    'a b\r\nc d\re f\n\n\ng h',
    '04.04.03 bunch of non-breaking spaces to be trimmed',
  )
})
