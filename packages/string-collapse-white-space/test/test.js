import test from "ava";
import collapse from "../dist/string-collapse-white-space.esm";

const htmlTags = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "area",
  "textarea",
  "data",
  "meta",
  "b",
  "rb",
  "sub",
  "rtc",
  "head",
  "thead",
  "kbd",
  "dd",
  "embed",
  "legend",
  "td",
  "source",
  "aside",
  "code",
  "table",
  "article",
  "title",
  "style",
  "iframe",
  "time",
  "pre",
  "figure",
  "picture",
  "base",
  "template",
  "cite",
  "blockquote",
  "img",
  "strong",
  "dialog",
  "svg",
  "th",
  "math",
  "i",
  "bdi",
  "li",
  "track",
  "link",
  "mark",
  "dl",
  "label",
  "del",
  "small",
  "html",
  "ol",
  "col",
  "ul",
  "param",
  "em",
  "menuitem",
  "form",
  "span",
  "keygen",
  "dfn",
  "main",
  "section",
  "caption",
  "figcaption",
  "option",
  "button",
  "bdo",
  "video",
  "audio",
  "p",
  "map",
  "samp",
  "rp",
  "hgroup",
  "colgroup",
  "optgroup",
  "sup",
  "q",
  "var",
  "br",
  "abbr",
  "wbr",
  "header",
  "meter",
  "footer",
  "hr",
  "tr",
  "s",
  "canvas",
  "details",
  "ins",
  "address",
  "progress",
  "object",
  "select",
  "dt",
  "fieldset",
  "slot",
  "tfoot",
  "script",
  "noscript",
  "rt",
  "datalist",
  "input",
  "output",
  "u",
  "menu",
  "nav",
  "div",
  "ruby",
  "body",
  "tbody",
  "summary"
];

// https://stackoverflow.com/a/1527820/3943954
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// The further function generates random-length strings that do not contain
// anything to collapse. We use it to catch any false positives.
const nonWhitespaceBits = [
  "<br>",
  "<br/>",
  '<zzz class="yyy">',
  "zzz",
  "1",
  "_",
  "a",
  "&",
  "#",
  "."
]; // bits that each of our tests will comprise of
function nothingToCollapseGenerator() {
  const testLength = getRandomInt(2, 50); // how many bits to pick and glue together
  // final result array which will comprise of "x" strings

  // traverse backwards because direction doesn't matter, yet it's more performant
  // to go backwards:
  let temp = "";
  for (let y = testLength; y--; ) {
    temp += `${nonWhitespaceBits[getRandomInt(0, 9)]}${
      Math.random() > 0.75 && y !== 0 ? " " : ""
    }`;
  }
  return temp;
}

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong/missing input = throw`, t => {
  t.throws(() => {
    collapse();
  });
  t.throws(() => {
    collapse(1);
  });
  t.throws(() => {
    collapse(null);
  });
  t.throws(() => {
    collapse(undefined);
  });
  t.throws(() => {
    collapse(true);
  });
});

test(`01.02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong opts = throw`, t => {
  t.throws(() => {
    collapse("aaaa", true); // not object but bool
  });
  t.throws(() => {
    collapse("aaaa", 1); // not object but number
  });
  t.notThrows(() => {
    collapse("aaaa", undefined); // hardcoded "nothing" is ok!
  });
  t.notThrows(() => {
    collapse("aaaa", null); // null fine too - that's hardcoded "nothing"
  });
});

test(`01.03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - empty string`, t => {
  t.is(collapse(""), "", "01.03");
});

test(`01.04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - only letter characters, no white space`, t => {
  t.is(collapse("aaa"), "aaa", "01.04");
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`, t => {
  t.is(collapse("a b"), "a b", "02.01.01 - nothing to collapse");
  t.is(collapse("a  b"), "a b");
  t.is(collapse("aaa     bbb    ccc   dddd"), "aaa bbb ccc dddd");
});

test(`02.02 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`, t => {
  t.is(collapse("  a b  "), "a b", "02.02.01 - nothing to collapse, only trim");
  t.is(collapse(" a b "), "a b", "02.02.02 - trims single spaces");
  t.is(collapse("\ta b\t"), "a b", "02.02.03 - trims single tabs");
  t.is(collapse("  a  b  "), "a b");
  t.is(collapse("  aaa     bbb    ccc   dddd  "), "aaa bbb ccc dddd");
});

test(`02.03 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`, t => {
  // opts.trimStart
  t.is(
    collapse("  a b  ", { trimStart: false }),
    " a b",
    "02.03.01 - nothing to collapse, only trim"
  );
  t.is(
    collapse(" a b ", { trimStart: false }),
    " a b",
    "02.03.02 - trims single spaces"
  );
  t.is(
    collapse("\ta b\t", { trimStart: false }),
    "\ta b",
    "02.03.03 - trims single tabs"
  );
  t.is(
    collapse("\n \ta b\t \n", { trimStart: false }),
    "\n \ta b",
    "02.03.04 - trims with line breaks"
  );
  t.is(collapse("  a  b  ", { trimStart: false }), " a b");
  t.is(
    collapse("  aaa     bbb    ccc   dddd  ", { trimStart: false }),
    " aaa bbb ccc dddd"
  );
});

test(`02.04 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`, t => {
  // opts.trimEnd
  t.is(
    collapse("  a b  ", { trimEnd: false }),
    "a b ",
    "02.04.01 - nothing to collapse, only trim"
  );
  t.is(
    collapse(" a b ", { trimEnd: false }),
    "a b ",
    "02.04.02 - trims single spaces"
  );
  t.is(
    collapse("\ta b\t", { trimEnd: false }),
    "a b\t",
    "02.04.03 - trims single tabs"
  );
  t.is(
    collapse("\n \ta b\t \n", { trimEnd: false }),
    "a b\t \n",
    "02.04.04 - trims with line breaks"
  );
  t.is(
    collapse("\n \ta b\t    \n", { trimEnd: false }),
    "a b\t \n",
    "02.04.05 - trims with line breaks"
  );
  t.is(collapse("  a  b  ", { trimEnd: false }), "a b ");
  t.is(
    collapse("  aaa     bbb    ccc   dddd  ", { trimEnd: false }),
    "aaa bbb ccc dddd "
  );
});

test(`02.05 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of line breaks`, t => {
  t.is(collapse("a\nb\nc\n\n\n\n\nd"), "a\nb\nc\n\n\n\n\nd");
  t.is(collapse("a\nb\nc\n   \n\n\n\nd"), "a\nb\nc\n \n\n\n\nd");
});

test(`02.06 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`, t => {
  t.is(collapse("a<br>\nb"), "a<br>\nb");
  t.is(collapse("a<br>\nb<br>\nc"), "a<br>\nb<br>\nc");
  t.is(collapse("a<br>\nb<br>\nc<br>\nd"), "a<br>\nb<br>\nc<br>\nd");
});

// -----------------------------------------------------------------------------
// 03. More tests on trimming, targetting algorithm's weakest spots
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`, t => {
  // defaults
  t.is(collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t"), "aaa");
  t.is(collapse("   \t\t\t   aaa   \t\t\t   "), "aaa");
  t.is(collapse("   \t \t \t   aaa   \t \t \t   "), "aaa");
  t.is(collapse("\t \n \t \r \naaa\t \r \t \n \t \n \r \t"), "aaa");
});

test(`03.02 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`, t => {
  // defaults
  t.is(collapse("      "), "");
  t.is(collapse("\t\t\t   \t\t\t"), "");
  t.is(collapse("\t\t\t"), "");
  t.is(collapse("\n\n\n"), "");
});

test(`03.03 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`, t => {
  // defaults
  t.is(collapse("\xa0   a   \xa0"), "\xa0 a \xa0");
  t.is(collapse("    \xa0     a     \xa0      "), "\xa0 a \xa0");
});

test(`03.04 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`, t => {
  t.is(
    collapse(" \xa0 ", {
      trimStart: false,
      trimEnd: false
    }),
    " \xa0 "
  );
});

test(`03.05 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`, t => {
  t.is(
    collapse("  \xa0  ", {
      trimStart: false,
      trimEnd: false
    }),
    " \xa0 "
  );
});

test(`03.06 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - bracket`, t => {
  t.is(
    collapse(`a > b`, {
      trimLines: true,
      recogniseHTML: true
    }),
    "a > b"
  );
  t.is(
    collapse(`a > b`, {
      trimLines: false,
      recogniseHTML: true
    }),
    "a > b"
  );
  t.is(
    collapse(`a > b`, {
      trimLines: true,
      recogniseHTML: false
    }),
    "a > b"
  );
  t.is(
    collapse(`a > b`, {
      trimLines: false,
      recogniseHTML: false
    }),
    "a > b"
  );
});

test(`03.07 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - bracket`, t => {
  t.is(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 1,
      recogniseHTML: 1
    }),
    "<span>zzz</span> abc def ghij klm"
  );
  t.is(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 0,
      recogniseHTML: 1
    }),
    "<span>zzz</span> abc def ghij klm"
  );
  t.is(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 1,
      recogniseHTML: 0
    }),
    "<span>zzz</span> abc def ghij klm"
  );
  t.is(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 0,
      recogniseHTML: 0
    }),
    "<span>zzz</span> abc def ghij klm"
  );
});

// -----------------------------------------------------------------------------
// 04. Line trimming
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - does not trim each lines because it's default setting`, t => {
  t.is(
    collapse("   a   bbb  \n   c   d   "),
    "a bbb \n c d",
    "04.01.01 - defaults"
  );
});

test(`04.02 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - trim setting on, trims every line`, t => {
  t.is(
    collapse("   aaa   bbb  \n    ccc   ddd   ", { trimLines: false }),
    "aaa bbb \n ccc ddd",
    "04.02.01 - defaults"
  );
  t.is(
    collapse("   aaa   bbb  \n    ccc   ddd   ", { trimLines: true }),
    "aaa bbb\nccc ddd",
    "04.02.01 - line trim"
  );
});

test(`04.03 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and non-breaking spaces`, t => {
  t.is(
    collapse(
      "     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ",
      { trimLines: false }
    ),
    "\xa0 aaa bbb \xa0 \n \xa0 ccc ddd \xa0",
    "04.03.01 - defaults"
  );
  t.is(
    collapse(
      "     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ",
      { trimLines: true, trimnbsp: false }
    ),
    "\xa0 aaa bbb \xa0\n\xa0 ccc ddd \xa0",
    "04.03.02 - trimLines = 1, trimnbsp = 0"
  );
  t.is(
    collapse(
      "     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ",
      { trimLines: true, trimnbsp: true }
    ),
    "aaa bbb\nccc ddd",
    "04.03.03 - trimLines = 1, trimnbsp = 1"
  );
});

test(`04.04 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and \\r`, t => {
  t.is(
    collapse(
      "\n\n     a    b    \r\n    c    d      \r     e     f     \n\n\n     g    h    \r",
      { trimLines: true, trimnbsp: false }
    ),
    "a b\r\nc d\re f\n\n\ng h",
    "04.04.01 - mix of \\r and \\n"
  );
  t.is(
    collapse(
      "\n\n     a    b    \r\n    c    d      \r     e     f     \n\n\n     g    h    \r",
      { trimLines: true, trimnbsp: true }
    ),
    "a b\r\nc d\re f\n\n\ng h",
    "04.04.02 same except trimnbsp = true"
  );
  t.is(
    collapse(
      "\xa0\n\n  \xa0   a    b   \xa0 \r\n  \xa0  c    d   \xa0\xa0   \r  \xa0\xa0   e     f  \xa0\xa0   \n\n\n \xa0\xa0    g    h    \r\xa0\xa0",
      { trimLines: true, trimnbsp: true }
    ),
    "a b\r\nc d\re f\n\n\ng h",
    "04.04.03 bunch of non-breaking spaces to be trimmed"
  );
});

test(`04.05 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and \\r`, t => {
  t.is(
    collapse(
      "\n\n     a    b    \r\n    c    d      \r     e     f     \n\n\n     g    h    \r",
      { trimLines: true, trimnbsp: false }
    ),
    "a b\r\nc d\re f\n\n\ng h",
    "04.05.01 - mix of \\r and \\n"
  );
});

// -----------------------------------------------------------------------------
// group 05. `opts.recogniseHTML`
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: whitespace everywhere`, t => {
  t.is(collapse('   <   html    abc="cde"    >  '), '<html abc="cde">');
});

test(`05.02 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - longer`, t => {
  t.is(
    collapse('    <    html      blablabla="zzz"    >  '),
    '<html blablabla="zzz">'
  );
});

test(`05.03 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: as 01, but no trim`, t => {
  t.is(collapse("<   html   >"), "<html>");
});

test(`05.04 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: tab and carriage return within html tag. Pretty messed up, isn't it?`, t => {
  t.is(collapse("<\thtml\r>"), "<html>");
});

test(`05.05 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: like 03, but with more non-space white space for trimming`, t => {
  t.is(collapse("\n\n\r\r\t\t<\thtml\r\t\t>\n\r\t\n"), "<html>");
});

test(`05.06 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: like 04 but with sprinkled spaces`, t => {
  t.is(
    collapse(
      "\n \n    \r\r   \t\t  <  \t   html   \r   \t \t   >\n  \r \t    \n  "
    ),
    "<html>"
  );
});

test(`05.07 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - defaults`, t => {
  t.is(
    collapse('   <   html    abc="cde"    >  ', { recogniseHTML: false }),
    '< html abc="cde" >'
  );
});

test(`05.08 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - HTML`, t => {
  t.is(
    collapse('    <    html      blablabla="zzz"    >  ', {
      recogniseHTML: false
    }),
    '< html blablabla="zzz" >'
  );
});

test(`05.09 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but no trim`, t => {
  t.is(collapse("<   html   >", { recogniseHTML: false }), "< html >");
});

test(`05.10 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - tab and carriage return within html tag`, t => {
  t.is(collapse("<\thtml\r>", { recogniseHTML: false }), "<\thtml\r>");
});

test(`05.11 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but with more non-space white space for trimming`, t => {
  t.is(
    collapse("\n\n\r\r\t\t<\thtml\r\t\t>\n\r\t\n", { recogniseHTML: false }),
    "<\thtml\r\t\t>"
  );
});

test(`05.12 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but with sprinkled spaces`, t => {
  t.is(
    collapse(
      "\n \n    \r\r   \t\t  <  \t   html   \r   \t \t   >\n  \r \t    \n  ",
      { recogniseHTML: false }
    ),
    "< \t html \r \t \t >"
  );
});

test(`05.13 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - no attr`, t => {
  t.is(collapse("   <   html  /  >  "), "<html/>");
});

test(`05.14 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - with attr`, t => {
  t.is(
    collapse('    <    html      blablabla="zzz"  /  >  '),
    '<html blablabla="zzz"/>'
  );
});

test(`05.15 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, just spaces`, t => {
  t.is(collapse("<   html  / >"), "<html/>");
});

test(`05.16 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, CR before slash`, t => {
  t.is(collapse("<\thtml\r/>"), "<html/>");
});

test(`05.17 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, CR after slash`, t => {
  t.is(collapse("<\thtml/\r>"), "<html/>");
});

test(`05.18 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #1`, t => {
  t.is(collapse("\n\n\r\r\t\t<\thtml\r\t\t/>\n\r\t\n"), "<html/>");
});

test(`05.19 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #2`, t => {
  t.is(collapse("\n\n\r\r\t\t<\thtml\r/\t\t>\n\r\t\n"), "<html/>");
});

test(`05.20 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #3`, t => {
  t.is(collapse("\n\n\r\r\t\t<\thtml/\r\t\t>\n\r\t\n"), "<html/>");
});

test(`05.21 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #4`, t => {
  t.is(
    collapse(
      "\n \n    \r\r   \t\t  <  \t   html   \t   \t \t  / >\n  \r \t    \n  "
    ),
    "<html/>"
  );
});

test(`05.22 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - basic`, t => {
  t.is(collapse("   <   html  /  >  ", { recogniseHTML: false }), "< html / >");
});

test(`05.23 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - basic with attr`, t => {
  t.is(
    collapse('    <    html      blablabla="zzz"  /  >  ', {
      recogniseHTML: false
    }),
    '< html blablabla="zzz" / >'
  );
});

test(`05.24 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, spaces`, t => {
  t.is(collapse("<   html  / >", { recogniseHTML: false }), "< html / >");
});

test(`05.25 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, tab and CR before slash`, t => {
  t.is(collapse("<\thtml\r/>", { recogniseHTML: false }), "<\thtml\r/>");
});

test(`05.26 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, tab and CR after slash`, t => {
  t.is(collapse("<\thtml/\r>", { recogniseHTML: false }), "<\thtml/\r>");
});

test(`05.27 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #1`, t => {
  t.is(
    collapse("\n\n\r\r\t\t<\thtml\r\t\t/>\n\r\t\n", { recogniseHTML: false }),
    "<\thtml\r\t\t/>"
  );
});

test(`05.28 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #2`, t => {
  t.is(
    collapse("\n\n\r\r\t\t<\thtml\r/\t\t>\n\r\t\n", { recogniseHTML: false }),
    "<\thtml\r/\t\t>"
  );
});

test(`05.29 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #3`, t => {
  t.is(
    collapse("\n\n\r\r\t\t<\thtml/\r\t\t>\n\r\t\n", { recogniseHTML: false }),
    "<\thtml/\r\t\t>"
  );
});

test(`05.30 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #4`, t => {
  t.is(
    collapse(
      "\n \n    \r\r   \t\t  <  \t   html   \t   \t \t  / >\n  \r \t    \n  ",
      { recogniseHTML: false }
    ),
    "< \t html \t \t \t / >"
  );
});

test(`05.31 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - inner whitespace`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(collapse(`   <   ${tag}    >  `), `<${tag}>`, `05.31.${i}`);
  });
});

test(`05.32 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - inner whitespace`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(collapse(`   <   ${tag}  /  >  `), `<${tag}/>`, `05.32.${i}`);
  });
});

test(`05.33 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, spaces`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`   <    z  ${tag}  /  >  `),
      `< z ${tag} / >`, // <----- only collapses the whitespace
      `05.33.${i}`
    );
  });
});

test(`05.34 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, tight`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(collapse(`   <   z${tag}  /  >  `), `< z${tag} / >`, `05.34.${i}`);
  });
});

test(`05.35 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, tight`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(collapse(`   <   z${tag}>  `), `< z${tag}>`, `05.35.${i}`);
  });
});

test(`05.36 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - no opening bracket`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(` a      ${tag}>  `),
      `a ${tag}>`, // <------- no opening bracket
      `05.36.${i}`
    );
  });
});

test(`05.37 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - space-tag name`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(` ${tag}>  `),
      `${tag}>`, // <------- space-tagname
      `05.37.${i}`
    );
  });
});

test(`05.38 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - string starts with tagname`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(` ${tag}>  `),
      `${tag}>`, // <------- string starts with tagname
      `05.38.${i}`
    );
  });
});

test(`05.39 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - checking case when tag is at the end of string`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`  <  ${tag}  `),
      `< ${tag}`, // <------- checking case when tag is at the end of string
      `05.39.${i}`
    );
  });
});

test(`05.40 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - checking case when tag is at the end of string`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(
      collapse(`Just like a <    b, the tag  ${tag} is my <3... `),
      `Just like a < b, the tag ${tag} is my <3...`,
      `05.40.${i}`
    );
  });
});

test(`05.41 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - two closing brackets`, t => {
  htmlTags.forEach((tag, i) => {
    t.is(collapse(`   <   z${tag} >   >  `), `< z${tag} > >`, `05.41.${i}`);
  });
});

test("05.42 - testing against false positives #1", t => {
  t.is(collapse("zz a < b and c > d yy"), "zz a < b and c > d yy");
});

test(`05.43 - testing against false positives #2 - the "< b" part is sneaky close to the real thing`, t => {
  t.is(
    collapse("We have equations: a < b and c > d not to be mangled."),
    "We have equations: a < b and c > d not to be mangled."
  );
});

test("05.44 - testing against false positives #3 - with asterisks", t => {
  t.is(
    collapse("We have equations: * a < b \n * c > d \n \n and others."),
    "We have equations: * a < b \n * c > d \n \n and others."
  );
});

test("05.45 - going from right to left, tag was recognised but string follows to the left - unrecognised string to the left", t => {
  t.is(
    collapse('    < zzz   form      blablabla="zzz"  /  >  '),
    '< zzz form blablabla="zzz" / >'
  );
});

test("05.46 - going from right to left, tag was recognised but string follows to the left - even valid HTML tag to the left", t => {
  t.is(
    collapse('    < form   form      blablabla="zzz"  /  >  '),
    '< form form blablabla="zzz" / >'
  );
});

test("05.47 - HTML closing tag", t => {
  t.is(
    collapse('    <   a    class="h"  style="display:  block;"  >'),
    '<a class="h" style="display: block;">'
  );
});

test("05.48 - HTML closing tag, more attrs", t => {
  t.is(
    collapse(
      '    <   a    class="h"  style="display:  block;"  >    Something   here   < / a  >    '
    ),
    '<a class="h" style="display: block;"> Something here </a>'
  );
});

test("05.49 - HTML closing tag, word wrapped", t => {
  t.is(collapse("< a > zzz < / a >"), "<a> zzz </a>");
});

test("05.50 - some weird letter casing", t => {
  t.is(
    collapse(
      'test text is being < StRoNg >set in bold<   StRoNg class="wrong1" / > here'
    ),
    'test text is being <StRoNg>set in bold<StRoNg class="wrong1"/> here'
  );
});

test("05.51 - adhoc case #1", t => {
  t.is(
    collapse("test text is being < b >set in bold< /  b > here"),
    "test text is being <b>set in bold</b> here"
  );
});

test("05.52 - adhoc case #2", t => {
  t.is(collapse("aaa<bbb"), "aaa<bbb");
});

test("05.53 - adhoc case #3", t => {
  t.is(collapse("aaa<bbb", { trimLines: false }), "aaa<bbb");
});

test("05.54 - adhoc case #4", t => {
  t.is(collapse("aaa<bbb", { trimLines: true }), "aaa<bbb");
});

test("05.55 - detected erroneous code (space after equal sign in HTML attribute) will skip HTML recognition", t => {
  // what will happen is, error space after equal in HTML attribute will cause
  // the algorithm to freak out and that tag will be skipped, even though the
  // opts.recogniseHTML would otherwise have trimmed tightly within that tag.
  t.is(
    collapse(
      '   <   html    abc= "cde"    ><   html    fgh="hij"    ><   html    abc= "cde"    ><   html    fgh="hij"    >  '
    ),
    '< html abc= "cde" ><html fgh="hij">< html abc= "cde" ><html fgh="hij">'
  );
});

test("05.56 - detected erroneous code (space after equal sign in HTML attribute) will skip HTML recognition, recogniseHTML=off", t => {
  t.is(
    collapse(
      '   <   html    abc= "cde"    ><   html    fgh="hij"    ><   html    abc= "cde"    ><   html    fgh="hij"    >  ',
      { recogniseHTML: false }
    ),
    '< html abc= "cde" >< html fgh="hij" >< html abc= "cde" >< html fgh="hij" >'
  );
});

// -----------------------------------------------------------------------------
// 06. opts.removeEmptyLines
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - \\n - on`, t => {
  // on
  t.is(
    collapse("a\n\nb", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: true
    }),
    "a\nb"
  );
});

test(`06.02 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - \\r\\n - on`, t => {
  t.is(
    collapse("a\r\n\r\nb", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: true
    }),
    "a\r\nb"
  );
});

test(`06.03 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - \\n - off`, t => {
  t.is(
    collapse("a\n\nb", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: false
    }),
    "a\n\nb"
  );
});

test(`06.04 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - \\r\\n - off`, t => {
  t.is(
    collapse("a\r\n\r\nb", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: false
    }),
    "a\r\n\r\nb"
  );
});

test(`06.05 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - \\n - on`, t => {
  t.is(
    collapse(" a \n \n b ", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: true
    }),
    "a\nb"
  );
});

test(`06.06 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - \\r\\n - on`, t => {
  t.is(
    collapse(" a \r\n \r\n b", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: true
    }),
    "a\r\nb"
  );
});

test(`06.07 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - \\n - off`, t => {
  t.is(
    collapse(" a \n \n b ", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: false
    }),
    "a\n\nb"
  );
});

test(`06.08 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - \\r\\n - off`, t => {
  t.is(
    collapse(" a \r\n \r\n b", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: false
    }),
    "a\r\n\r\nb"
  );
});

test(`06.09 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\n - empty lines removal off + per-line trimming off`, t => {
  t.is(
    collapse(" a \n \n b ", {
      trimLines: false,
      trimnbsp: true,
      removeEmptyLines: false
    }),
    "a \n \n b"
  );
});

test(`06.10 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\r\\n - empty lines removal off + per-line trimming off`, t => {
  t.is(
    collapse(" a \r\n \r\n b", {
      trimLines: false,
      trimnbsp: true,
      removeEmptyLines: false
    }),
    "a \r\n \r\n b"
  );
});

test(`06.11 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\n - empty lines removal off + per-line trimming off - multiple spaces`, t => {
  t.is(
    collapse("  a  \n  \n  b  ", {
      trimLines: false,
      trimnbsp: true,
      removeEmptyLines: false
    }),
    "a \n \n b"
  );
});

test(`06.12 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\r\\n - empty lines removal off + per-line trimming off - multiple spaces`, t => {
  t.is(
    collapse("  a  \r\n  \r\n  b    ", {
      trimLines: false,
      trimnbsp: true,
      removeEmptyLines: false
    }),
    "a \r\n \r\n b"
  );
});

test(`06.13 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - advanced`, t => {
  t.is(
    collapse(
      "\xa0\n\n  \xa0   a    b   \xa0 \r\n  \xa0  c    d   \xa0\xa0   \r  \xa0\xa0   e     f  \xa0\xa0   \n\n\n \xa0\xa0    g    h    \r\xa0\xa0",
      { trimLines: true, trimnbsp: true, removeEmptyLines: true }
    ),
    "a b\r\nc d\re f\ng h"
  );
});

test(`06.14 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - leading/trailing empty lines - \\n`, t => {
  t.is(
    collapse("\na\n\nb\n", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: true
    }),
    "a\nb"
  );
});

test(`06.15 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - leading/trailing empty lines - \\r\\n`, t => {
  t.is(
    collapse("\r\na\r\n\r\nb\r\n", {
      trimLines: true,
      trimnbsp: true,
      removeEmptyLines: true
    }),
    "a\r\nb"
  );
});

// -----------------------------------------------------------------------------
// 07. opts.limitConsecutiveEmptyLinesTo
// -----------------------------------------------------------------------------

test(`07.01 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, LF,   removeEmptyLines=off`, t => {
  t.is(
    collapse("a\n\nb", {
      removeEmptyLines: false
    }),
    "a\n\nb"
  );
});

test(`07.02 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, CRLF, removeEmptyLines=off`, t => {
  t.is(
    collapse("a\r\n\r\nb", {
      removeEmptyLines: false
    }),
    "a\r\n\r\nb"
  );
});

test(`07.03 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, LF,   removeEmptyLines=on`, t => {
  t.is(
    collapse("a\n\nb", {
      removeEmptyLines: true
    }),
    "a\nb"
  );
});

test(`07.04 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, CRLF, removeEmptyLines=on`, t => {
  t.is(
    collapse("a\r\n\r\nb", {
      removeEmptyLines: true
    }),
    "a\r\nb"
  );
});

test(`07.05 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, LF,   removeEmptyLines=on, hardcoded default`, t => {
  t.is(
    collapse("a\n\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0
    }),
    "a\nb"
  );
});

test(`07.06 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, CRLF, removeEmptyLines=on, hardcoded default`, t => {
  t.is(
    collapse("a\r\n\r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0
    }),
    "a\r\nb"
  );
});

test(`07.07 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`, t => {
  t.is(
    collapse("a\n\n\n\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1
    }),
    "a\n\nb"
  );
});

test(`07.08 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, CRLF, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`, t => {
  t.is(
    collapse("a\r\n\r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1
    }),
    "a\r\n\r\nb"
  );
});

test(`07.09 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`, t => {
  t.is(
    collapse("a\n\n\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1
    }),
    "a\n\nb"
  );
});

test(`07.10 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  CRLF, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`, t => {
  t.is(
    collapse("a\r\n\r\n\r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1
    }),
    "a\r\n\r\nb"
  );
});

test(`07.11 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=2`, t => {
  t.is(
    collapse("a\n\n\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 2
    }),
    "a\n\n\nb"
  );
});

test(`07.12 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  CRLF, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=2`, t => {
  t.is(
    collapse("a\r\n\r\n\r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 2
    }),
    "a\r\n\r\n\r\nb"
  );
});

test(`07.13 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=3`, t => {
  t.is(
    collapse("a\n\n\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 3
    }),
    "a\n\n\nb"
  );
});

test(`07.14 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  CRLF, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=3`, t => {
  t.is(
    collapse("a\r\n\r\n\r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 3
    }),
    "a\r\n\r\n\r\nb"
  );
});

test(`07.15 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=99`, t => {
  t.is(
    collapse("a\n\n\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 99
    }),
    "a\n\n\nb"
  );
});

test(`07.16 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  CRLF, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=99`, t => {
  t.is(
    collapse("a\r\n\r\n\r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 99
    }),
    "a\r\n\r\n\r\nb"
  );
});

test(`07.17 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, LF, trimLines=off`, t => {
  t.is(
    collapse("a\n \nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: false
    }),
    "a\nb"
  );
});

test(`07.18 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, LF, trimLines=on`, t => {
  t.is(
    collapse("a\n \nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: true
    }),
    "a\nb"
  );
});

test(`07.19 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, CRLF, trimLines=off`, t => {
  t.is(
    collapse("a\r\n \r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: false
    }),
    "a\r\nb"
  );
});

test(`07.20 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, CRLF, trimLines=on`, t => {
  t.is(
    collapse("a\r\n \r\nb", {
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0,
      trimLines: true
    }),
    "a\r\nb"
  );
});

// -----------------------------------------------------------------------------
// 08. opts.returnRangesOnly
// -----------------------------------------------------------------------------

test(`08.01 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was something to remove`, t => {
  t.is(
    collapse("   a   bbb  \n   c   d   "),
    "a bbb \n c d",
    "08.01.01 - defaults"
  );
  t.is(
    collapse("   a   bbb  \n   c   d   ", { returnRangesOnly: false }),
    "a bbb \n c d",
    "08.01.02 - hardcoded default"
  );
  t.deepEqual(
    collapse("   a   bbb  \n   c   d   ", { returnRangesOnly: true }),
    [[0, 3], [4, 6], [10, 11], [13, 15], [17, 19], [21, 24]]
  );
});

test(`08.02 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was nothing to remove #1`, t => {
  t.is(collapse("a b"), "a b", "08.02.01 - defaults");
  t.is(
    collapse("a b", { returnRangesOnly: false }),
    "a b",
    "08.02.02 - hardcoded default"
  );
  t.deepEqual(collapse("a b", { returnRangesOnly: true }), []);
});

test(`08.03 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was nothing to remove #2`, t => {
  t.is(collapse("a\nb"), "a\nb", "08.03.01 - defaults");
  t.is(
    collapse("a\nb", { returnRangesOnly: false }),
    "a\nb",
    "08.03.02 - hardcoded default"
  );
  t.deepEqual(collapse("a\nb", { returnRangesOnly: true }), []);
});

// -----------------------------------------------------------------------------
// 09. check a ten thousand randomly-generated strings that don't need collapsing
// -----------------------------------------------------------------------------

test(`09.XX - ${`\u001b[${36}m${`GENERATED TESTS`}\u001b[${39}m`}`, t => {
  for (let i = 10000; i--; ) {
    let temp = nothingToCollapseGenerator();
    t.is(collapse(temp), temp);
    temp = undefined;
  }
});
