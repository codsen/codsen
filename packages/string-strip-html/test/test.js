/* eslint ava/no-only-test:0, max-len:0 */

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
    '',
    '01.01.06 - leading space is not retained',
  )
  t.deepEqual(
    stripHtml('< a> '),
    '',
    '01.01.07 - trailing space is not retained',
  )
  t.deepEqual(
    stripHtml('  <a >  '),
    '',
    '01.01.08',
  )
  t.deepEqual(
    stripHtml('\t< a >'),
    '',
    '01.01.09',
  )
  t.deepEqual(
    stripHtml('    \t   <     a     >      \n\n   '),
    '',
    '01.01.10 - lots of different whitespace chars',
  )
  t.deepEqual(
    stripHtml('<a>         <a>'),
    '',
    '01.01.11 - whitespace between tags is deleted too',
  )
  t.deepEqual(
    stripHtml('<a>         z'),
    'z',
    '01.01.12 - whitespace between tag and text is not touched',
  )
  t.deepEqual(
    stripHtml('   <b>text</b>   '),
    'text',
    '01.01.13 - leading/trailing spaces are not touched',
  )
  t.deepEqual(
    stripHtml('\n\n\n<b>text</b>\r\r\r'),
    'text',
    '01.01.14 - but leading/trailing line breaks are deleted',
  )
  t.deepEqual(
    stripHtml('z<a href="https://codsen.com" target="_blank">z<a href="xxx" target="_blank">z'),
    'z z z',
    '01.01.15 - HTML tag with attributes',
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
    '',
    '01.02.09',
  )
  t.deepEqual(
    stripHtml('< /a> '),
    '',
    '01.02.10',
  )
  t.deepEqual(
    stripHtml('  </a >  '),
    '',
    '01.02.11',
  )
  t.deepEqual(
    stripHtml('\t< /a >'),
    '',
    '01.02.12',
  )
  t.deepEqual(
    stripHtml('    \t   <   /  a     >      \n\n   '),
    '',
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
    'zzz',
    '01.03.02',
  )
  t.deepEqual(
    stripHtml(' <a> zzz </a> '),
    'zzz',
    '01.03.03',
  )
  t.deepEqual(
    stripHtml(' <a> zz\nz </a> '),
    'zz\nz',
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
    stripHtml('aaaa<<<<<<div>>>>something</div>bbbbb'),
    'aaaa something bbbbb',
    '01.08.01',
  )
  t.deepEqual(
    stripHtml('aaaa<<<<<<div>something</div>bbbbb'),
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
  t.deepEqual(
    stripHtml('aaaa something<<<<  //// div /// >>>>>>>bbbbb'),
    'aaaa something bbbbb',
    '01.08.07',
  )
})

test('01.09 - checking can script slip through in any way', (t) => {
  t.deepEqual(
    stripHtml('x<b>y</b>z', {
      stripTogetherWithTheirContents: ['b'],
    }),
    'x z',
    '01.09.01',
  )
  t.deepEqual(
    stripHtml('some text <script>console.log("<sup>>>>>>"); alert("you\'re done!");</script> more text'),
    'some text more text',
    '01.09.02',
  )
})

test('01.10 - strips style tags', (t) => {
  t.deepEqual(
    stripHtml(`<html><head>
<style type="text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`),
    'aaa',
    '01.10.01',
  )
})

test('01.11 - opts.stripTogetherWithTheirContents', (t) => {
  t.deepEqual(
    stripHtml(
      'a<b>c</b>d',
      {
        stripTogetherWithTheirContents: ['e', 'b'],
      },
    ),
    'a d',
    '01.11.01',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<   /   b   >d',
      {
        stripTogetherWithTheirContents: ['e', 'b'],
      },
    ),
    'a d',
    '01.11.02 - whitespace within the tag',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<     b   /    >d',
      {
        stripTogetherWithTheirContents: ['e', 'b'],
      },
    ),
    'a d',
    '01.11.03 - closing slash wrong side',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<   /    b   /    >d',
      {
        stripTogetherWithTheirContents: ['e', 'b'],
      },
    ),
    'a d',
    '01.11.04 - two closing slashes',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<   //    b   //    >d',
      {
        stripTogetherWithTheirContents: ['e', 'b'],
      },
    ),
    'a d',
    '01.11.05 - multiple duplicated closing slashes',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: ['e', 'b'],
      },
    ),
    'a d',
    '01.11.06 - multiple duplicated closing slashes',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<   /    b   /    >d',
      {
        stripTogetherWithTheirContents: ['e', 'b'],
      },
    ),
    'a d',
    '01.11.07 - no closing slashes',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >     c \n\n\n        <   /    b   /    >d',
      {
        stripTogetherWithTheirContents: ['e', 'b'],
      },
    ),
    'a\nd',
    '01.11.08 - no closing slashes',
  )
  t.deepEqual(
    stripHtml(
      'a<b>c</b>d<e>f</e>g',
      {
        stripTogetherWithTheirContents: ['b', 'e'],
      },
    ),
    'a d g',
    '01.11.09',
  )
  t.deepEqual(
    stripHtml(
      'a<bro>c</bro>d<e>f</e>g',
      {
        stripTogetherWithTheirContents: ['b', 'e'],
      },
    ),
    'a c d g',
    '01.11.10 - sneaky similarity, bro starts with b',
  )
  t.deepEqual(
    stripHtml(
      'Text <div class="" id="3" >here</div> and some more <article>text</article>.',
      {
        stripTogetherWithTheirContents: ['div', 'section', 'article'],
      },
    ),
    'Text and some more.',
    '01.11.11 - strips with attributes. Now resembling real life.',
  )
  t.deepEqual(
    stripHtml(
      'Text < div class="" id="3"  >here<  / div > and some more < article >text<    / article >.',
      {
        stripTogetherWithTheirContents: ['div', 'section', 'article'],
      },
    ),
    'Text and some more.',
    '01.11.12 - lots of spaces within tags',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<     b   /    >d',
      {
        stripTogetherWithTheirContents: [],
      },
    ),
    'a c d',
    '01.11.13 - override stripTogetherWithTheirContents to an empty array',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<     b   /    >d',
      {
        stripTogetherWithTheirContents: null,
      },
    ),
    'a c d',
    '01.11.14 - override stripTogetherWithTheirContents to an empty array',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<     b   /    >d',
      {
        stripTogetherWithTheirContents: false,
      },
    ),
    'a c d',
    '01.11.15 - override stripTogetherWithTheirContents to an empty array',
  )
  t.deepEqual(
    stripHtml(
      'a<    b    >c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: 'b',
      },
    ),
    'a d',
    '01.11.16 - opts.stripTogetherWithTheirContents is not array but string',
  )
  t.deepEqual(
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: 'b',
      },
    ),
    'a d',
    '01.11.17',
  )
  t.throws(() => {
    stripHtml(
      'a<    b style="display:block; color: #333">>c<   //  <  b   // >   >d',
      {
        stripTogetherWithTheirContents: ['zzz', true, 'b'],
      },
    )
  })
})

// ==============================
// XML (sprinkled within HTML)
// ==============================

test('02.01 - strips XML', (t) => {
  t.deepEqual(
    stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
    'abc\ndef',
    '02.01.01',
  )
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->def`),
    'abc\ndef',
    '02.01.02',
  )
  t.deepEqual(
    stripHtml(`abc<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
    'abc\ndef',
    '02.01.03',
  )
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]--> def`),
    'abc\ndef',
    '02.01.04',
  )
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  def`),
    'abc\ndef',
    '02.01.05',
  )
  t.deepEqual(
    stripHtml(`abc <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->

  `),
    'abc',
    '02.01.06',
  )
  t.deepEqual(
    stripHtml(`abc <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  `),
    'abc',
    '02.01.07',
  )
  t.deepEqual(
    stripHtml(`      <xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>

  abc`),
    'abc',
    '02.01.08',
  )
})

// ==============================
// false positives
// ==============================

test('03.01 - very sneaky considering b is a legit tag name', (t) => {
  t.deepEqual(
    stripHtml('Equations are: a < b and c > d'),
    'Equations are: a < b and c > d',
    '03.01',
  )
})

test('03.02 - tag never ends', (t) => {
  t.deepEqual(
    stripHtml('Look here: ---> a <---'),
    'Look here: ---> a <---',
    '03.02',
  )
})

test('03.03 - not complete tag', (t) => {
  t.deepEqual(
    stripHtml('<'),
    '<',
    '03.03.01',
  )
  t.deepEqual(
    stripHtml('>'),
    '>',
    '03.03.02',
  )
  t.deepEqual(
    stripHtml('>>>'),
    '>>>',
    '03.03.03',
  )
  t.deepEqual(
    stripHtml('<<<'),
    '<<<',
    '03.03.04',
  )
  t.deepEqual(
    stripHtml(' <<< '),
    ' <<< ',
    '03.03.05',
  )
  t.deepEqual(
    stripHtml('<a'),
    '<a',
    '03.03.06',
  )
  t.deepEqual(
    stripHtml('a>'),
    'a>',
    '03.03.07',
  )
})

test('03.04 - conditionals that appear on Outlook only', (t) => {
  t.deepEqual(
    stripHtml(`<!--[if (gte mso 9)|(IE)]>
  <table width="540" align="center" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td>
<![endif]-->
zzz
<!--[if (gte mso 9)|(IE)]>
      </td>
    </tr>
  </table>
<![endif]-->`),
    'zzz',
    '03.04',
  )
})

test('03.05 - conditionals that are visible for Outlook only', (t) => {
  t.deepEqual(
    stripHtml(`<!--[if !mso]><!-->
shown for everything except Outlook
<!--<![endif]-->`),
    'shown for everything except Outlook',
    '03.05.01 - checking also for whitespace control',
  )
  t.deepEqual(
    stripHtml(`<!--[if !mso]><!--><table width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      shown for everything except Outlook
    </td>
  </tr>
</table><!--<![endif]-->`),
    'shown for everything except Outlook',
    '03.05.02 - all those line breaks in-between the tags need to be taken care of too',
  )
})

test('03.06 - consecutive tags', (t) => {
  t.deepEqual(
    stripHtml('Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after'),
    'Text First point Second point Third point Text straight after',
    '03.06',
  )
})

// ==============================
// 04. opts.ignoreTags
// ==============================

test('04.01 - opts.ignoreTags', (t) => {
  t.deepEqual(
    stripHtml('Some <b>text</b> and some more <i>text</i>.', { ignoreTags: ['b'] }),
    'Some <b>text</b> and some more text.',
    '04.01',
  )
})

// ==============================
// 05. whitespace control
// ==============================

test('05.01 - adds a space', (t) => {
  t.deepEqual(
    stripHtml('a<div>b</div>c'),
    'a b c',
    '05.01.01',
  )
  t.deepEqual(
    stripHtml('a <div>   b    </div>    c'),
    'a b c',
    '05.01.02 - stays on one line because it was on one line',
  )
  t.deepEqual(
    stripHtml('\t\t\ta <div>   b    </div>    c\n\n\n'),
    'a b c',
    '05.01.03 - like 02 above but with trimming',
  )
})

test('05.02 - adds a linebreak between each substring piece', (t) => {
  t.deepEqual(
    stripHtml(`a


  <div>
    b
  </div>
c`),
    'a\nb\nc',
    '05.02',
  )
})

test('05.03 - multiple tag combo case #1', (t) => {
  t.deepEqual(
    stripHtml('z<a><b>c</b></a>y'),
    'z c y',
    '05.03.01',
  )
  t.deepEqual(
    stripHtml(`
      z
        <a>
          <b class="something anything">
            c
          </b>
        </a>
      y`),
    'z\nc\ny',
    '05.03.02',
  )
})

// ==============================
// 06. comments
// ==============================

test('06.01 - strips HTML comments', (t) => {
  // group #1. spaces on both outsides
  t.deepEqual(
    stripHtml('aaa <!-- <tr> --> bbb'),
    'aaa bbb',
    '06.01.01 - double space',
  )
  t.deepEqual(
    stripHtml('aaa <!-- <tr>--> bbb'),
    'aaa bbb',
    '06.01.02 - single space',
  )
  t.deepEqual(
    stripHtml('aaa <!--<tr> --> bbb'),
    'aaa bbb',
    '06.01.03 - single space',
  )
  t.deepEqual(
    stripHtml('aaa <!--<tr>--> bbb'),
    'aaa bbb',
    '06.01.04 - no space',
  )

  // group #2. spaces on right only
  t.deepEqual(
    stripHtml('aaa<!-- <tr> --> bbb'),
    'aaa bbb',
    '06.01.05 - double space',
  )
  t.deepEqual(
    stripHtml('aaa<!-- <tr>--> bbb'),
    'aaa bbb',
    '06.01.06 - single space',
  )
  t.deepEqual(
    stripHtml('aaa<!--<tr> --> bbb'),
    'aaa bbb',
    '06.01.07 - single space',
  )
  t.deepEqual(
    stripHtml('aaa<!--<tr>--> bbb'),
    'aaa bbb',
    '06.01.08 - no space',
  )

  // group #3. spaces on left only
  t.deepEqual(
    stripHtml('aaa <!-- <tr> -->bbb'),
    'aaa bbb',
    '06.01.09 - double space',
  )
  t.deepEqual(
    stripHtml('aaa <!-- <tr>-->bbb'),
    'aaa bbb',
    '06.01.10 - single space',
  )
  t.deepEqual(
    stripHtml('aaa <!--<tr> -->bbb'),
    'aaa bbb',
    '06.01.11 - single space',
  )
  t.deepEqual(
    stripHtml('aaa <!--<tr>-->bbb'),
    'aaa bbb',
    '06.01.12 - no space',
  )

  // group #4. no spaces outside
  t.deepEqual(
    stripHtml('aaa<!-- <tr> -->bbb'),
    'aaa bbb',
    '06.01.13 - double space',
  )
  t.deepEqual(
    stripHtml('aaa<!-- <tr>-->bbb'),
    'aaa bbb',
    '06.01.14 - single space',
  )
  t.deepEqual(
    stripHtml('aaa<!--<tr> -->bbb'),
    'aaa bbb',
    '06.01.15 - single space',
  )
  t.deepEqual(
    stripHtml('aaa<!--<tr>-->bbb'),
    'aaa bbb',
    '06.01.16 - no space',
  )
})

test('06.02 - HTML comments around string edges', (t) => {
  t.deepEqual(
    stripHtml('aaa <!-- <tr> --> '),
    'aaa',
    '06.02.01',
  )
  t.deepEqual(
    stripHtml('aaa <!-- <tr> -->'),
    'aaa',
    '06.02.02',
  )

  t.deepEqual(
    stripHtml(' <!-- <tr> --> aaa'),
    'aaa',
    '06.02.03',
  )
  t.deepEqual(
    stripHtml('<!-- <tr> -->aaa'),
    'aaa',
    '06.02.04',
  )

  t.deepEqual(
    stripHtml(' <!-- <tr> --> aaa <!-- <tr> -->'),
    'aaa',
    '06.02.05',
  )
  t.deepEqual(
    stripHtml('<!-- <tr> -->aaa<!-- <tr> -->'),
    'aaa',
    '06.02.06',
  )
  t.deepEqual(
    stripHtml('   <!-- <tr> -->aaa<!-- <tr> -->   '),
    'aaa',
    '06.02.07',
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

test('99.03 - non-string among whole tags to delete', (t) => {
  t.throws(() => {
    stripHtml('aaa', { stripTogetherWithTheirContents: true })
  })
  t.throws(() => {
    stripHtml('aaa', { stripTogetherWithTheirContents: [true] })
  })
  t.throws(() => {
    stripHtml('aaa', { stripTogetherWithTheirContents: ['style', 1, null] })
  })
})
