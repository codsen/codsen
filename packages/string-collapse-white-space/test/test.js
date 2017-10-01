import test from 'ava'
import collapse from '../dist/string-collapse-white-space.cjs'

const htmlTags = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'area',
  'textarea',
  'data',
  'meta',
  'b',
  'rb',
  'sub',
  'rtc',
  'head',
  'thead',
  'kbd',
  'dd',
  'embed',
  'legend',
  'td',
  'source',
  'aside',
  'code',
  'table',
  'article',
  'title',
  'style',
  'iframe',
  'time',
  'pre',
  'figure',
  'picture',
  'base',
  'template',
  'cite',
  'blockquote',
  'img',
  'strong',
  'dialog',
  'svg',
  'th',
  'math',
  'i',
  'bdi',
  'li',
  'track',
  'link',
  'mark',
  'dl',
  'label',
  'del',
  'small',
  'html',
  'ol',
  'col',
  'ul',
  'param',
  'em',
  'menuitem',
  'form',
  'span',
  'keygen',
  'dfn',
  'main',
  'section',
  'caption',
  'figcaption',
  'option',
  'button',
  'bdo',
  'video',
  'audio',
  'p',
  'map',
  'samp',
  'rp',
  'hgroup',
  'colgroup',
  'optgroup',
  'sup',
  'q',
  'var',
  'br',
  'abbr',
  'wbr',
  'header',
  'meter',
  'footer',
  'hr',
  'tr',
  's',
  'canvas',
  'details',
  'ins',
  'address',
  'progress',
  'object',
  'select',
  'dt',
  'fieldset',
  'slot',
  'tfoot',
  'script',
  'noscript',
  'rt',
  'datalist',
  'input',
  'output',
  'u',
  'menu',
  'nav',
  'div',
  'ruby',
  'body',
  'tbody',
  'summary',
]

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

// -----------------------------------------------------------------------------
// group 05. `opts.recogniseHTML`
// -----------------------------------------------------------------------------

test('05.01 - action around the HTML brackets', (t) => {
  //
  // .oO0000Oo.
  //    HTML
  // .oO0000Oo.
  //
  t.is(
    collapse('   <   html    abc="cde"    >  '),
    '<html abc="cde">',
    '05.01.01 - defaults: whitespace everywhere',
  )
  t.is(
    collapse('    <    html      blablabla="zzz"    >  '),
    '<html blablabla="zzz">',
    '05.01.02 - html',
  )
  t.is(
    collapse('<   html   >'),
    '<html>',
    '05.01.03 - defaults: as 01, but no trim',
  )
  t.is(
    collapse('<\thtml\r>'),
    '<html>',
    '05.01.04 - defaults: tab and carriage return within html tag. Pretty messed up, isn\'t it?',
  )
  t.is(
    collapse('\n\n\r\r\t\t<\thtml\r\t\t>\n\r\t\n'),
    '<html>',
    '05.01.05 - defaults: like 03, but with more non-space white space for trimming',
  )
  t.is(
    collapse('\n \n    \r\r   \t\t  <  \t   html   \r   \t \t   >\n  \r \t    \n  '),
    '<html>',
    '05.01.06 - defaults: like 04 but with sprinkled spaces',
  )

  //
  // .oO00000Oo.
  //    XHTML
  // .oO00000Oo.
  //
  t.is(
    collapse('   <   html  /  >  '),
    '<html/>',
    '05.01.07',
  )
  t.is(
    collapse('    <    html      blablabla="zzz"  /  >  '),
    '<html blablabla="zzz"/>',
    '05.01.08',
  )
  t.is(
    collapse('<   html  / >'),
    '<html/>',
    '05.01.09',
  )
  t.is(
    collapse('<\thtml\r/>'),
    '<html/>',
    '05.01.10',
  )
  t.is(
    collapse('<\thtml/\r>'),
    '<html/>',
    '05.01.11',
  )
  t.is(
    collapse('\n\n\r\r\t\t<\thtml\r\t\t/>\n\r\t\n'),
    '<html/>',
    '05.01.12',
  )
  t.is(
    collapse('\n\n\r\r\t\t<\thtml\r/\t\t>\n\r\t\n'),
    '<html/>',
    '05.01.13',
  )
  t.is(
    collapse('\n\n\r\r\t\t<\thtml/\r\t\t>\n\r\t\n'),
    '<html/>',
    '05.01.14',
  )
  t.is(
    collapse('\n \n    \r\r   \t\t  <  \t   html   \t   \t \t  / >\n  \r \t    \n  '),
    '<html/>',
    '05.01.15',
  )
})

test('05.02 - testing all recognised (X)HTML tags', (t) => {
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`   <   ${tag}    >  `),
      `<${tag}>`,
      `05.02.01.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`   <   ${tag}  /  >  `),
      `<${tag}/>`,
      `05.02.02.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`   <    z  ${tag}  /  >  `),
      `< z ${tag} / >`, // <----- only collapses the whitespace
      `05.02.03.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`   <   z${tag}  /  >  `),
      `< z${tag} / >`,
      `05.02.04.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`   <   z${tag}>  `),
      `< z${tag}>`,
      `05.02.05.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(` a      ${tag}>  `),
      `a ${tag}>`, // <------- no opening bracket
      `05.02.06.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(` ${tag}>  `),
      `${tag}>`, // <------- space-tagname
      `05.02.07.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(` ${tag}>  `),
      `${tag}>`, // <------- string starts with tagname
      `05.02.08.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`  <  ${tag}  `),
      `< ${tag}`, // <------- checking case when tag is at the end of string
      `05.02.09.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`Just like a <    b, the tag  ${tag} is my <3... `),
      `Just like a < b, the tag ${tag} is my <3...`,
      `05.02.10.${i}`,
    )
  })
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`   <   z${tag} >   >  `),
      `< z${tag} > >`,
      `05.02.11.${i}`,
    )
  })
})

test('05.03 - testing against false positives', (t) => {
  t.is(
    collapse('zz a < b and c > d yy'),
    'zz a < b and c > d yy',
    '05.03.01',
  )
  t.is(
    collapse('We have equations: a < b and c > d not to be mangled.'),
    'We have equations: a < b and c > d not to be mangled.',
    '05.03.02 - the "< b" part is sneaky close to the real thing!!!',
  )
  t.is(
    collapse('We have equations: * a < b \n * c > d \n \n and others.'),
    'We have equations: * a < b \n * c > d \n \n and others.',
    '05.03.02 - the "< b" part is sneaky close to the real thing!!!',
  )
})

test('05.04 - going from right to left, tag was recognised but string follows to the left', (t) => {
  t.is(
    collapse('    < zzz   form      blablabla="zzz"  /  >  '),
    '< zzz form blablabla="zzz" / >',
    '05.04.01 - unrecognised string to the left',
  )
  t.is(
    collapse('    < form   form      blablabla="zzz"  /  >  '),
    '< form form blablabla="zzz" / >',
    '05.04.02 - even valid HTML tag to the left - does not matter. Will not collapse around tag.',
  )
})

test('05.05 - HTML closing tag', (t) => {
  t.is(
    collapse('    <   a    class="h"  style="display:  block;"  >'),
    '<a class="h" style="display: block;">',
    '05.05.01',
  )
  t.is(
    collapse('    <   a    class="h"  style="display:  block;"  >    Something   here   < / a  >    '),
    '<a class="h" style="display: block;"> Something here </a>',
    '05.05.02',
  )
  t.is(
    collapse('< a > zzz < / a >'),
    '<a> zzz </a>',
    '05.05.03',
  )
})

test('05.06 - some weird letter casing', (t) => {
  t.is(
    collapse('test text is being < StRoNg >set in bold<   StRoNg class="wrong1" / > here'),
    'test text is being <StRoNg>set in bold<StRoNg class="wrong1"/> here',
    '05.06.01',
  )
})

test('05.07 - adhoc case #1', (t) => {
  t.is(
    collapse('test text is being < b >set in bold< /  b > here'),
    'test text is being <b>set in bold</b> here',
    '05.07',
  )
})

test.only('05.08 - adhoc case #2', (t) => {
  t.is(
    collapse('aaa<bbb'),
    'aaa<bbb',
    '05.08',
  )
})
