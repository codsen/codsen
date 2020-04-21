import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

const key = ["crlf", "cr", "lf"];
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
  "summary",
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
  ".",
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

tap.test(
  `01.01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong/missing input = throw`,
  (t) => {
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
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong opts = throw`,
  (t) => {
    t.throws(() => {
      collapse("aaaa", true); // not object but bool
    });
    t.throws(() => {
      collapse("aaaa", 1); // not object but number
    });
    t.doesNotThrow(() => {
      collapse("aaaa", undefined); // hardcoded "nothing" is ok!
    });
    t.doesNotThrow(() => {
      collapse("aaaa", null); // null fine too - that's hardcoded "nothing"
    });
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - empty string`,
  (t) => {
    t.equal(collapse(""), "", "01.03");
    t.end();
  }
);

tap.test(
  `01.04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - only letter characters, no white space`,
  (t) => {
    t.equal(collapse("aaa"), "aaa", "01.04");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test(
  `02.01 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.equal(collapse("a b"), "a b", "02.01.01 - nothing to collapse");
    t.end();
  }
);

tap.test(
  `02.02 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.equal(collapse("a  b"), "a b");
    t.end();
  }
);

tap.test(
  `02.03 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.equal(collapse("aaa     bbb    ccc   dddd"), "aaa bbb ccc dddd");
    t.end();
  }
);

tap.test(
  `02.04 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(
      collapse("  a b  "),
      "a b",
      "02.02.01 - nothing to collapse, only trim"
    );
    t.end();
  }
);

tap.test(
  `02.05 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(collapse(" a b "), "a b", "02.02.02 - trims single spaces");
    t.end();
  }
);

tap.test(
  `02.06 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(collapse("\ta b\t"), "a b", "02.02.03 - trims single tabs");
    t.end();
  }
);

tap.test(
  `02.07 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(collapse("  a  b  "), "a b");
    t.end();
  }
);

tap.test(
  `02.08 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(collapse("  aaa     bbb    ccc   dddd  "), "aaa bbb ccc dddd");
    t.end();
  }
);

tap.test(
  `02.09 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    // opts.trimStart
    t.equal(
      collapse("  a b  ", { trimStart: false }),
      " a b",
      "02.03.01 - nothing to collapse, only trim"
    );
    t.end();
  }
);

tap.test(
  `02.10 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.equal(
      collapse(" a b ", { trimStart: false }),
      " a b",
      "02.03.02 - trims single spaces"
    );
    t.end();
  }
);

tap.test(
  `02.11 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.equal(
      collapse("\ta b\t", { trimStart: false }),
      "\ta b",
      "02.03.03 - trims single tabs"
    );
    t.end();
  }
);

tap.test(
  `02.12 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType} \ta b\t ${presentEolType}`, {
          trimStart: false,
        }),
        `${presentEolType} \ta b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02.13 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.equal(collapse("  a  b  ", { trimStart: false }), " a b");
    t.end();
  }
);

tap.test(
  `02.14 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.equal(
      collapse("  aaa     bbb    ccc   dddd  ", { trimStart: false }),
      " aaa bbb ccc dddd"
    );
    t.end();
  }
);

tap.test(
  `02.15 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    // opts.trimEnd
    t.equal(
      collapse("  a b  ", { trimEnd: false }),
      "a b ",
      "02.04.01 - nothing to collapse, only trim"
    );
    t.end();
  }
);

tap.test(
  `02.16 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.equal(
      collapse(" a b ", { trimEnd: false }),
      "a b ",
      "02.04.02 - trims single spaces"
    );
    t.end();
  }
);

tap.test(
  `02.17 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.equal(
      collapse("\ta b\t", { trimEnd: false }),
      "a b\t",
      "02.04.03 - trims single tabs"
    );
    t.end();
  }
);

tap.test(
  `02.18 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType} \ta b\t ${presentEolType}`, {
          trimEnd: false,
        }),
        `a b\t ${presentEolType}`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02.19 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType} \ta b\t    ${presentEolType}`, {
          trimEnd: false,
        }),
        `a b\t ${presentEolType}`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02.20 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.equal(collapse(`  a  b  `, { trimEnd: false }), `a b `);
    t.end();
  }
);

tap.test(
  `02.21 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.equal(
      collapse(`  aaa     bbb    ccc   dddd  `, { trimEnd: false }),
      `aaa bbb ccc dddd `
    );
    t.end();
  }
);

tap.test(
  `02.22 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of line breaks`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `a${presentEolType}b${presentEolType}c${presentEolType}${presentEolType}${presentEolType}${presentEolType}${presentEolType}d`
        ),
        `a${presentEolType}b${presentEolType}c${presentEolType}${presentEolType}${presentEolType}${presentEolType}${presentEolType}d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02.23 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of line breaks`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `a${presentEolType}b${presentEolType}c${presentEolType}   ${presentEolType}${presentEolType}${presentEolType}${presentEolType}d`
        ),
        `a${presentEolType}b${presentEolType}c${presentEolType} ${presentEolType}${presentEolType}${presentEolType}${presentEolType}d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02.24 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a<br>${presentEolType}b`),
        `a<br>${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02.25 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a<br>${presentEolType}b<br>${presentEolType}c`),
        `a<br>${presentEolType}b<br>${presentEolType}c`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `02.26 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `a<br>${presentEolType}b<br>${presentEolType}c<br>${presentEolType}d`
        ),
        `a<br>${presentEolType}b<br>${presentEolType}c<br>${presentEolType}d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 03. More tests on trimming, targetting algorithm's weakest spots
// -----------------------------------------------------------------------------

tap.test(
  `03.01 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`), `aaa`);
    t.end();
  }
);

tap.test(
  `03.02 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`   \t\t\t   aaa   \t\t\t   `), `aaa`);
    t.end();
  }
);

tap.test(
  `03.03 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`   \t \t \t   aaa   \t \t \t   `), `aaa`);
    t.end();
  }
);

tap.test(
  `03.04 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `\t ${presentEolType} \t \r ${presentEolType}aaa\t \r \t ${presentEolType} \t ${presentEolType} \r\n \t \n`
        ),
        `aaa`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `03.05 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("      "), "");
    t.end();
  }
);

tap.test(
  `03.06 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("\t\t\t   \t\t\t"), "");
    t.end();
  }
);

tap.test(
  `03.07 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("\t\t\t"), "");
    t.end();
  }
);

tap.test(
  `03.08 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}${presentEolType}${presentEolType}`),
        "",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `03.09 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(collapse(`\xa0   a   \xa0`), `\xa0 a \xa0`);
    t.end();
  }
);

tap.test(
  `03.10 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(collapse(`    \xa0     a     \xa0      `), `\xa0 a \xa0`);
    t.end();
  }
);

tap.test(
  `03.11 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(
      collapse(` \xa0 `, {
        trimStart: false,
        trimEnd: false,
      }),
      ` \xa0 `
    );
    t.end();
  }
);

tap.test(
  `03.12 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(
      collapse(`  \xa0  `, {
        trimStart: false,
        trimEnd: false,
      }),
      ` \xa0 `
    );
    t.end();
  }
);

tap.test(
  `03.13 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - bracket`,
  (t) => {
    t.equal(
      collapse(`a > b`, {
        trimLines: true,
        recogniseHTML: true,
      }),
      `a > b`
    );
    t.equal(
      collapse(`a > b`, {
        trimLines: false,
        recogniseHTML: true,
      }),
      `a > b`
    );
    t.equal(
      collapse(`a > b`, {
        trimLines: true,
        recogniseHTML: false,
      }),
      `a > b`
    );
    t.equal(
      collapse(`a > b`, {
        trimLines: false,
        recogniseHTML: false,
      }),
      `a > b`
    );
    t.end();
  }
);

tap.test(
  `03.14 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - bracket`,
  (t) => {
    t.equal(
      collapse(`<span>zzz</span> abc def ghij klm`, {
        trimLines: 1,
        recogniseHTML: 1,
      }),
      `<span>zzz</span> abc def ghij klm`
    );
    t.equal(
      collapse(`<span>zzz</span> abc def ghij klm`, {
        trimLines: 0,
        recogniseHTML: 1,
      }),
      `<span>zzz</span> abc def ghij klm`
    );
    t.equal(
      collapse(`<span>zzz</span> abc def ghij klm`, {
        trimLines: 1,
        recogniseHTML: 0,
      }),
      `<span>zzz</span> abc def ghij klm`
    );
    t.equal(
      collapse(`<span>zzz</span> abc def ghij klm`, {
        trimLines: 0,
        recogniseHTML: 0,
      }),
      `<span>zzz</span> abc def ghij klm`
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 04. Line trimming
// -----------------------------------------------------------------------------

tap.test(
  `04.01 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - does not trim each lines because it's default setting`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`   a   bbb  ${presentEolType}   c   d   `),
        `a bbb ${presentEolType} c d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `04.02 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - trim setting on, trims every line`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`   aaa   bbb  ${presentEolType}    ccc   ddd   `, {
          trimLines: false,
        }),
        `aaa bbb ${presentEolType} ccc ddd`,
        `EOL ${key[idx]}`
      );
      t.equal(
        collapse(`   aaa   bbb  ${presentEolType}    ccc   ddd   `, {
          trimLines: true,
        }),
        `aaa bbb${presentEolType}ccc ddd`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `04.03 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and non-breaking spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          { trimLines: false }
        ),
        `\xa0 aaa bbb \xa0 ${presentEolType} \xa0 ccc ddd \xa0`,
        `EOL ${key[idx]}`
      );
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          { trimLines: true, trimnbsp: false }
        ),
        `\xa0 aaa bbb \xa0${presentEolType}\xa0 ccc ddd \xa0`,
        `04.03.02 - trimLines = 1, trimnbsp = 0`
      );
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          { trimLines: true, trimnbsp: true }
        ),
        `aaa bbb${presentEolType}ccc ddd`,
        `04.03.03 - trimLines = 1, trimnbsp = 1`
      );
    });
    t.end();
  }
);

tap.test(
  `04.04 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and \\r`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}${presentEolType}     a    b    ${presentEolType}    c    d      ${presentEolType}     e     f     ${presentEolType}${presentEolType}${presentEolType}     g    h    ${presentEolType}`,
          { trimLines: true, trimnbsp: false }
        ),
        `a b${presentEolType}c d${presentEolType}e f${presentEolType}${presentEolType}${presentEolType}g h`,
        `EOL ${key[idx]} - 1`
      );
      t.equal(
        collapse(
          `${presentEolType}${presentEolType}     a    b    ${presentEolType}    c    d      ${presentEolType}     e     f     ${presentEolType}${presentEolType}${presentEolType}     g    h    ${presentEolType}`,
          { trimLines: true, trimnbsp: true }
        ),
        `a b${presentEolType}c d${presentEolType}e f${presentEolType}${presentEolType}${presentEolType}g h`,
        `EOL ${key[idx]} - 2`
      );
      t.equal(
        collapse(
          `\xa0${presentEolType}${presentEolType}  \xa0   a    b   \xa0 ${presentEolType}  \xa0  c    d   \xa0\xa0   ${presentEolType}  \xa0\xa0   e     f  \xa0\xa0   ${presentEolType}${presentEolType}${presentEolType} \xa0\xa0    g    h    ${presentEolType}\xa0\xa0`,
          { trimLines: true, trimnbsp: true }
        ),
        `a b${presentEolType}c d${presentEolType}e f${presentEolType}${presentEolType}${presentEolType}g h`,
        `EOL ${key[idx]} - 3`
      );
    });
    t.end();
  }
);

tap.test(
  `04.05 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}${presentEolType}     a    b    ${presentEolType}    c    d      ${presentEolType}     e     f     ${presentEolType}${presentEolType}${presentEolType}     g    h    ${presentEolType}`,
          { trimLines: true, trimnbsp: false }
        ),
        `a b${presentEolType}c d${presentEolType}e f${presentEolType}${presentEolType}${presentEolType}g h`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// group 05. `opts.recogniseHTML`
// -----------------------------------------------------------------------------

tap.test(
  `05.01 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: whitespace everywhere`,
  (t) => {
    t.equal(collapse('   <   html    abc="cde"    >  '), '<html abc="cde">');
    t.end();
  }
);

tap.test(
  `05.02 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - longer`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"    >  '),
      '<html blablabla="zzz">'
    );
    t.end();
  }
);

tap.test(
  `05.03 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: as 01, but no trim`,
  (t) => {
    t.equal(collapse("<   html   >"), "<html>");
    t.end();
  }
);

tap.test(
  `05.04 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: tab and carriage return within html tag. Pretty messed up, isn't it?`,
  (t) => {
    t.equal(collapse("<\thtml\r>"), "<html>");
    t.end();
  }
);

tap.test(
  `05.05 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: like 03, but with more non-space white space for trimming`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `\n${presentEolType}\r\r\t\t<\thtml\r\t\t>\n\r\t${presentEolType}`
        ),
        "<html>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.06 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: like 04 but with sprinkled spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `\n ${presentEolType}    \r\r   \t\t  <  \t   html   \r   \t \t   >\n  \r \t    ${presentEolType}  `
        ),
        "<html>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.07 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - defaults`,
  (t) => {
    t.equal(
      collapse('   <   html    abc="cde"    >  ', { recogniseHTML: false }),
      '< html abc="cde" >'
    );
    t.end();
  }
);

tap.test(
  `05.08 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - HTML`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"    >  ', {
        recogniseHTML: false,
      }),
      '< html blablabla="zzz" >'
    );
    t.end();
  }
);

tap.test(
  `05.09 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but no trim`,
  (t) => {
    t.equal(collapse("<   html   >", { recogniseHTML: false }), "< html >");
    t.end();
  }
);

tap.test(
  `05.10 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - tab and carriage return within html tag`,
  (t) => {
    t.equal(collapse("<\thtml\r>", { recogniseHTML: false }), "<\thtml\r>");
    t.end();
  }
);

tap.test(
  `05.11 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but with more non-space white space for trimming`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\r\r\t\t<\thtml\r\t\t>\n\r\t\n`, {
          recogniseHTML: false,
        }),
        "<\thtml\r\t\t>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.12 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but with sprinkled spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType} \n    \r\r   \t\t  <  \t   html   \r   \t \t   >\n  \r \t    \n  `,
          { recogniseHTML: false }
        ),
        "< \t html \r \t \t >",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.13 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - no attr`,
  (t) => {
    t.equal(collapse("   <   html  /  >  "), "<html/>");
    t.end();
  }
);

tap.test(
  `05.14 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - with attr`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"  /  >  '),
      '<html blablabla="zzz"/>'
    );
    t.end();
  }
);

tap.test(
  `05.15 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, just spaces`,
  (t) => {
    t.equal(collapse("<   html  / >"), "<html/>");
    t.end();
  }
);

tap.test(
  `05.16 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, CR before slash`,
  (t) => {
    t.equal(collapse("<\thtml\r/>"), "<html/>");
    t.end();
  }
);

tap.test(
  `05.17 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, CR after slash`,
  (t) => {
    t.equal(collapse("<\thtml/\r>"), "<html/>");
    t.end();
  }
);

tap.test(
  `05.18 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #1`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\r\r\t\t<\thtml\r\t\t/>\n\r\t\n`),
        "<html/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.19 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #2`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\n\r\r\t\t<\thtml\r/\t\t>\n\r\t\n`),
        "<html/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.20 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #3`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\n\r\r\t\t<\thtml/\r\t\t>\n\r\t\n`),
        "<html/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.21 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #4`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType} \n    \r\r   \t\t  <  \t   html   \t   \t \t  / >\n  \r \t    \n  `
        ),
        "<html/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.22 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - basic`,
  (t) => {
    t.equal(
      collapse("   <   html  /  >  ", { recogniseHTML: false }),
      "< html / >"
    );
    t.end();
  }
);

tap.test(
  `05.23 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - basic with attr`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"  /  >  ', {
        recogniseHTML: false,
      }),
      '< html blablabla="zzz" / >'
    );
    t.end();
  }
);

tap.test(
  `05.24 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, spaces`,
  (t) => {
    t.equal(collapse("<   html  / >", { recogniseHTML: false }), "< html / >");
    t.end();
  }
);

tap.test(
  `05.25 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, tab and CR before slash`,
  (t) => {
    t.equal(collapse("<\thtml\r/>", { recogniseHTML: false }), "<\thtml\r/>");
    t.end();
  }
);

tap.test(
  `05.27 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #1`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\r\r\t\t<\thtml\r\t\t/>\n\r\t\n`, {
          recogniseHTML: false,
        }),
        "<\thtml\r\t\t/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.28 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #2`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\n\r\r\t\t<\thtml\r/\t\t>\n\r\t\n`, {
          recogniseHTML: false,
        }),
        "<\thtml\r/\t\t>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.29 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #3`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\n\r\r\t\t<\thtml/\r\t\t>\n\r\t\n`, {
          recogniseHTML: false,
        }),
        "<\thtml/\r\t\t>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.30 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #4`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}\n \n    \r\r   \t\t  <  \t   html   \t   \t \t  / >\n  \r \t    \n  `,
          { recogniseHTML: false }
        ),
        "< \t html \t \t \t / >",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.31 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - inner whitespace`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(collapse(`   <   ${tag}    >  `), `<${tag}>`, `05.31.${i}`);
    });
    t.end();
  }
);

tap.test(
  `05.32 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - inner whitespace`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(collapse(`   <   ${tag}  /  >  `), `<${tag}/>`, `05.32.${i}`);
    });
    t.end();
  }
);

tap.test(
  `05.33 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, spaces`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`   <    z  ${tag}  /  >  `),
        `< z ${tag} / >`, // <----- only collapses the whitespace
        `05.33.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.34 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, tight`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`   <   z${tag}  /  >  `),
        `< z${tag} / >`,
        `05.34.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.35 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, tight`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(collapse(`   <   z${tag}>  `), `< z${tag}>`, `05.35.${i}`);
    });
    t.end();
  }
);

tap.test(
  `05.36 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - no opening bracket`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(` a      ${tag}>  `),
        `a ${tag}>`, // <------- no opening bracket
        `05.36.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.37 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - space-tag name`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(` ${tag}>  `),
        `${tag}>`, // <------- space-tagname
        `05.37.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.38 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - string starts with tagname`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(` ${tag}>  `),
        `${tag}>`, // <------- string starts with tagname
        `05.38.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.39 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - checking case when tag is at the end of string`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`  <  ${tag}  `),
        `< ${tag}`, // <------- checking case when tag is at the end of string
        `05.39.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.40 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - checking case when tag is at the end of string`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`Just like a <    b, the tag  ${tag} is my <3... `),
        `Just like a < b, the tag ${tag} is my <3...`,
        `05.40.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `05.41 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - two closing brackets`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`   <   z${tag} >   >  `),
        `< z${tag} > >`,
        `05.41.${i}`
      );
    });
    t.end();
  }
);

tap.test("05.42 - testing against false positives #1", (t) => {
  t.equal(collapse("zz a < b and c > d yy"), "zz a < b and c > d yy");
  t.end();
});

tap.test(
  `05.43 - testing against false positives #2 - the "< b" part is sneaky close to the real thing`,
  (t) => {
    t.equal(
      collapse("We have equations: a < b and c > d not to be mangled."),
      "We have equations: a < b and c > d not to be mangled."
    );
    t.end();
  }
);

tap.test("05.44 - testing against false positives #3 - with asterisks", (t) => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    t.equal(
      collapse(
        `We have equations: * a < b ${presentEolType} * c > d ${presentEolType} ${presentEolType} and others.`
      ),
      `We have equations: * a < b ${presentEolType} * c > d ${presentEolType} ${presentEolType} and others.`,
      `EOL ${key[idx]}`
    );
  });
  t.end();
});

tap.test(
  "05.45 - going from right to left, tag was recognised but string follows to the left - unrecognised string to the left",
  (t) => {
    t.equal(
      collapse('    < zzz   form      blablabla="zzz"  /  >  '),
      '< zzz form blablabla="zzz" / >'
    );
    t.end();
  }
);

tap.test(
  "05.46 - going from right to left, tag was recognised but string follows to the left - even valid HTML tag to the left",
  (t) => {
    t.equal(
      collapse('    < form   form      blablabla="zzz"  /  >  '),
      '< form form blablabla="zzz" / >'
    );
    t.end();
  }
);

tap.test("05.47 - HTML closing tag", (t) => {
  t.equal(
    collapse('    <   a    class="h"  style="display:  block;"  >'),
    '<a class="h" style="display: block;">'
  );
  t.end();
});

tap.test("05.48 - HTML closing tag, more attrs", (t) => {
  t.equal(
    collapse(
      '    <   a    class="h"  style="display:  block;"  >    Something   here   < / a  >    '
    ),
    '<a class="h" style="display: block;"> Something here </a>'
  );
  t.end();
});

tap.test("05.49 - HTML closing tag, word wrapped", (t) => {
  t.equal(collapse("< a > zzz < / a >"), "<a> zzz </a>");
  t.end();
});

tap.test("05.50 - some weird letter casing", (t) => {
  t.equal(
    collapse(
      'test text is being < StRoNg >set in bold<   StRoNg class="wrong1" / > here'
    ),
    'test text is being <StRoNg>set in bold<StRoNg class="wrong1"/> here'
  );
  t.end();
});

tap.test("05.51 - adhoc case #1", (t) => {
  t.equal(
    collapse("test text is being < b >set in bold< /  b > here"),
    "test text is being <b>set in bold</b> here"
  );
  t.end();
});

tap.test("05.52 - adhoc case #2", (t) => {
  t.equal(collapse("aaa<bbb"), "aaa<bbb");
  t.end();
});

tap.test("05.53 - adhoc case #3", (t) => {
  t.equal(collapse("aaa<bbb", { trimLines: false }), "aaa<bbb");
  t.end();
});

tap.test("05.54 - adhoc case #4", (t) => {
  t.equal(collapse("aaa<bbb", { trimLines: true }), "aaa<bbb");
  t.end();
});

tap.test(
  "05.55 - detected erroneous code (space after equal sign in HTML attribute) will skip HTML recognition",
  (t) => {
    // what will happen is, error space after equal in HTML attribute will cause
    // the algorithm to freak out and that tag will be skipped, even though the
    // opts.recogniseHTML would otherwise have trimmed tightly within that tag.
    t.equal(
      collapse(
        '   <   html    abc= "cde"    ><   html    fgh="hij"    ><   html    abc= "cde"    ><   html    fgh="hij"    >  '
      ),
      '< html abc= "cde" ><html fgh="hij">< html abc= "cde" ><html fgh="hij">'
    );
    t.end();
  }
);

tap.test(
  "05.56 - detected erroneous code (space after equal sign in HTML attribute) will skip HTML recognition, recogniseHTML=off",
  (t) => {
    t.equal(
      collapse(
        '   <   html    abc= "cde"    ><   html    fgh="hij"    ><   html    abc= "cde"    ><   html    fgh="hij"    >  ',
        { recogniseHTML: false }
      ),
      '< html abc= "cde" >< html fgh="hij" >< html abc= "cde" >< html fgh="hij" >'
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 06. opts.removeEmptyLines
// -----------------------------------------------------------------------------

tap.test(
  `06.01 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          trimLines: true,
          trimnbsp: true,
          removeEmptyLines: true,
        }),
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06.02 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - don't remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          trimLines: true,
          trimnbsp: true,
          removeEmptyLines: false,
        }),
        `a${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06.03 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: true,
          trimnbsp: true,
          removeEmptyLines: true,
        }),
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06.04 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - don't remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: true,
          trimnbsp: true,
          removeEmptyLines: false,
        }),
        `a${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06.05 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - empty lines removal off + per-line trimming off`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(` a ${presentEolType} ${presentEolType} b `, {
          trimLines: false,
          trimnbsp: true,
          removeEmptyLines: false,
        }),
        `a ${presentEolType} ${presentEolType} b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06.06 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\n - empty lines removal off + per-line trimming off - multiple spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`  a  ${presentEolType}  ${presentEolType}  b  `, {
          trimLines: false,
          trimnbsp: true,
          removeEmptyLines: false,
        }),
        `a ${presentEolType} ${presentEolType} b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06.07 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - advanced`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `\xa0${presentEolType}${presentEolType}  \xa0   a    b   \xa0 \r\n  \xa0  c    d   \xa0\xa0   \r  \xa0\xa0   e     f  \xa0\xa0   ${presentEolType}${presentEolType}${presentEolType} \xa0\xa0    g    h    \r\xa0\xa0`,
          { trimLines: true, trimnbsp: true, removeEmptyLines: true }
        ),
        `a b\r\nc d\re f${presentEolType}g h`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06.08 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - leading/trailing empty lines`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}a${presentEolType}${presentEolType}b${presentEolType}`,
          {
            trimLines: true,
            trimnbsp: true,
            removeEmptyLines: true,
          }
        ),
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 07. opts.limitConsecutiveEmptyLinesTo
// -----------------------------------------------------------------------------

tap.test(
  `07.01 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, removeEmptyLines=off`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          removeEmptyLines: false,
        }),
        `a${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07.02 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, removeEmptyLines=on`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
        }),
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07.05 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `a${presentEolType}${presentEolType}${presentEolType}${presentEolType}b`,
          {
            removeEmptyLines: true,
            limitConsecutiveEmptyLinesTo: 1,
          }
        ),
        `a${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07.06 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 1,
        }),
        `a${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07.07 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=2`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 2,
        }),
        `a${presentEolType}${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07.08 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=3`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 3,
        }),
        `a${presentEolType}${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07.09 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=99`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}${presentEolType}${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 99,
        }),
        `a${presentEolType}${presentEolType}${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07.10 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, LF, trimLines=off`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType} ${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 0,
          trimLines: false,
        }),
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07.11 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, LF, trimLines=on`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType} ${presentEolType}b`, {
          removeEmptyLines: true,
          limitConsecutiveEmptyLinesTo: 0,
          trimLines: true,
        }),
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 08. opts.returnRangesOnly
// -----------------------------------------------------------------------------

tap.test(
  `08.01 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was something to remove`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`   a   bbb  ${presentEolType}   c   d   `),
        `a bbb ${presentEolType} c d`,
        `EOL ${key[idx]}`
      );
      t.equal(
        collapse(`   a   bbb  ${presentEolType}   c   d   `, {
          returnRangesOnly: false,
        }),
        `a bbb ${presentEolType} c d`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `08.02 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was something to remove`,
  (t) => {
    t.same(collapse(`   a   bbb  \n   c   d   `, { returnRangesOnly: true }), [
      [0, 3],
      [4, 6],
      [10, 11],
      [13, 15],
      [17, 19],
      [21, 24],
    ]);
    t.end();
  }
);

tap.test(
  `08.03 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was nothing to remove #1`,
  (t) => {
    t.equal(collapse("a b"), "a b", "08.02.01 - defaults");
    t.equal(
      collapse("a b", { returnRangesOnly: false }),
      "a b",
      "08.02.02 - hardcoded default"
    );
    t.same(collapse("a b", { returnRangesOnly: true }), []);
    t.end();
  }
);

tap.test(
  `08.04 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was nothing to remove #2`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`a${presentEolType}b`),
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
      t.equal(
        collapse(`a${presentEolType}b`, { returnRangesOnly: false }),
        `a${presentEolType}b`,
        `EOL ${key[idx]}`
      );
      t.same(
        collapse(`a${presentEolType}b`, { returnRangesOnly: true }),
        [],
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 09. check a ten thousand randomly-generated strings that don't need collapsing
// -----------------------------------------------------------------------------

tap.test(`09.XX - ${`\u001b[${36}m${`GENERATED TESTS`}\u001b[${39}m`}`, (t) => {
  for (let i = 10000; i--; ) {
    let temp = nothingToCollapseGenerator();
    t.equal(collapse(temp), temp);
    temp = undefined;
  }
  t.end();
});
