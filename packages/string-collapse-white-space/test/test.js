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
  `01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong/missing input = throw`,
  (t) => {
    t.throws(() => {
      collapse();
    }, "01.01");
    t.throws(() => {
      collapse(1);
    }, "01.02");
    t.throws(() => {
      collapse(null);
    }, "01.03");
    t.throws(() => {
      collapse(undefined);
    }, "01.04");
    t.throws(() => {
      collapse(true);
    }, "01.05");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - wrong opts = throw`,
  (t) => {
    t.throws(() => {
      collapse("aaaa", true); // not object but bool
    }, "02.01");
    t.throws(() => {
      collapse("aaaa", 1); // not object but number
    }, "02.02");
    t.doesNotThrow(() => {
      collapse("aaaa", undefined); // hardcoded "nothing" is ok!
    }, "02.03");
    t.doesNotThrow(() => {
      collapse("aaaa", null); // null fine too - that's hardcoded "nothing"
    }, "02.04");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - empty string`,
  (t) => {
    t.equal(collapse(""), "", "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - only letter characters, no white space`,
  (t) => {
    t.equal(collapse("aaa"), "aaa", "04");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.equal(collapse("a b"), "a b", "05 - nothing to collapse");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.equal(collapse("a  b"), "a b", "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - simple sequences of spaces within string`,
  (t) => {
    t.equal(collapse("aaa     bbb    ccc   dddd"), "aaa bbb ccc dddd", "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(collapse("  a b  "), "a b", "08 - nothing to collapse, only trim");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(collapse(" a b "), "a b", "09 - trims single spaces");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(collapse("\ta b\t"), "a b", "10 - trims single tabs");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(collapse("  a  b  "), "a b", "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - defaults`,
  (t) => {
    t.equal(
      collapse("  aaa     bbb    ccc   dddd  "),
      "aaa bbb ccc dddd",
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    // opts.trimStart
    t.equal(
      collapse("  a b  ", { trimStart: false }),
      " a b",
      "13 - nothing to collapse, only trim"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.equal(
      collapse(" a b ", { trimStart: false }),
      " a b",
      "14 - trims single spaces"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.equal(
      collapse("\ta b\t", { trimStart: false }),
      "\ta b",
      "15 - trims single tabs"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
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
  `17 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.equal(collapse("  a  b  ", { trimStart: false }), " a b", "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimStart`,
  (t) => {
    t.equal(
      collapse("  aaa     bbb    ccc   dddd  ", { trimStart: false }),
      " aaa bbb ccc dddd",
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    // opts.trimEnd
    t.equal(
      collapse("  a b  ", { trimEnd: false }),
      "a b ",
      "19 - nothing to collapse, only trim"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.equal(
      collapse(" a b ", { trimEnd: false }),
      "a b ",
      "20 - trims single spaces"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.equal(
      collapse("\ta b\t", { trimEnd: false }),
      "a b\t",
      "21 - trims single tabs"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
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
  `23 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
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
  `24 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.equal(collapse(`  a  b  `, { trimEnd: false }), `a b `, "24");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of spaces outside of string - opts.trimEnd`,
  (t) => {
    t.equal(
      collapse(`  aaa     bbb    ccc   dddd  `, { trimEnd: false }),
      `aaa bbb ccc dddd `,
      "25"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of line breaks`,
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
  `27 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - sequences of line breaks`,
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
  `28 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
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
  `29 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
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
  `30 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - tag and linebreak chain`,
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
  `31 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`), `aaa`, "31");
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`   \t\t\t   aaa   \t\t\t   `), `aaa`, "32");
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`   \t \t \t   aaa   \t \t \t   `), `aaa`, "33");
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
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
  `35 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("      "), "", "35");
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("\t\t\t   \t\t\t"), "", "36");
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("\t\t\t"), "", "37");
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
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
  `39 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(collapse(`\xa0   a   \xa0`), `\xa0 a \xa0`, "39");
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(collapse(`    \xa0     a     \xa0      `), `\xa0 a \xa0`, "40");
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(
      collapse(` \xa0 `, {
        trimStart: false,
        trimEnd: false,
      }),
      ` \xa0 `,
      "41"
    );
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(
      collapse(`  \xa0  `, {
        trimStart: false,
        trimEnd: false,
      }),
      ` \xa0 `,
      "42"
    );
    t.end();
  }
);

tap.test(`43 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - bracket`, (t) => {
  t.equal(
    collapse(`a > b`, {
      trimLines: true,
      recogniseHTML: true,
    }),
    `a > b`,
    "43.01"
  );
  t.equal(
    collapse(`a > b`, {
      trimLines: false,
      recogniseHTML: true,
    }),
    `a > b`,
    "43.02"
  );
  t.equal(
    collapse(`a > b`, {
      trimLines: true,
      recogniseHTML: false,
    }),
    `a > b`,
    "43.03"
  );
  t.equal(
    collapse(`a > b`, {
      trimLines: false,
      recogniseHTML: false,
    }),
    `a > b`,
    "43.04"
  );
  t.end();
});

tap.test(`44 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - bracket`, (t) => {
  t.equal(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 1,
      recogniseHTML: 1,
    }),
    `<span>zzz</span> abc def ghij klm`,
    "44.01"
  );
  t.equal(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 0,
      recogniseHTML: 1,
    }),
    `<span>zzz</span> abc def ghij klm`,
    "44.02"
  );
  t.equal(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 1,
      recogniseHTML: 0,
    }),
    `<span>zzz</span> abc def ghij klm`,
    "44.03"
  );
  t.equal(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 0,
      recogniseHTML: 0,
    }),
    `<span>zzz</span> abc def ghij klm`,
    "44.04"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 04. Line trimming
// -----------------------------------------------------------------------------

tap.test(
  `45 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - does not trim each lines because it's default setting`,
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
  `46 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - trim setting on, trims every line`,
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
  `47 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and non-breaking spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          {
            trimLines: false,
          }
        ),
        `\xa0 aaa bbb \xa0 ${presentEolType} \xa0 ccc ddd \xa0`,
        `EOL ${key[idx]}`
      );
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          {
            trimLines: true,
            trimnbsp: false,
          }
        ),
        `\xa0 aaa bbb \xa0${presentEolType}\xa0 ccc ddd \xa0`,
        `04.03.02 - trimLines = 1, trimnbsp = 0`
      );
      t.equal(
        collapse(
          `     \xa0    aaa   bbb    \xa0    ${presentEolType}     \xa0     ccc   ddd   \xa0   `,
          {
            trimLines: true,
            trimnbsp: true,
          }
        ),
        `aaa bbb${presentEolType}ccc ddd`,
        `04.03.03 - trimLines = 1, trimnbsp = 1`
      );
    });
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims and \\r`,
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
  `49 - ${`\u001b[${36}m${`line trimming`}\u001b[${39}m`} - line and outer trims`,
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
  `50 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: whitespace everywhere`,
  (t) => {
    t.equal(
      collapse('   <   html    abc="cde"    >  '),
      '<html abc="cde">',
      "50"
    );
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - longer`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"    >  '),
      '<html blablabla="zzz">',
      "51"
    );
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: as 01, but no trim`,
  (t) => {
    t.equal(collapse("<   html   >"), "<html>", "52");
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: tab and carriage return within html tag. Pretty messed up, isn't it?`,
  (t) => {
    t.equal(collapse("<\thtml\r>"), "<html>", "53");
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: like 03, but with more non-space white space for trimming`,
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
  `55 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: like 04 but with sprinkled spaces`,
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
  `56 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - defaults`,
  (t) => {
    t.equal(
      collapse('   <   html    abc="cde"    >  ', { recogniseHTML: false }),
      '< html abc="cde" >',
      "56"
    );
    t.end();
  }
);

tap.test(
  `57 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - HTML`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"    >  ', {
        recogniseHTML: false,
      }),
      '< html blablabla="zzz" >',
      "57"
    );
    t.end();
  }
);

tap.test(
  `58 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but no trim`,
  (t) => {
    t.equal(
      collapse("<   html   >", { recogniseHTML: false }),
      "< html >",
      "58"
    );
    t.end();
  }
);

tap.test(
  `59 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - tab and carriage return within html tag`,
  (t) => {
    t.equal(
      collapse("<\thtml\r>", { recogniseHTML: false }),
      "<\thtml\r>",
      "59"
    );
    t.end();
  }
);

tap.test(
  `60 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but with more non-space white space for trimming`,
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
  `61 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but with sprinkled spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType} \n    \r\r   \t\t  <  \t   html   \r   \t \t   >\n  \r \t    \n  `,
          {
            recogniseHTML: false,
          }
        ),
        "< \t html \r \t \t >",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `62 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - no attr`,
  (t) => {
    t.equal(collapse("   <   html  /  >  "), "<html/>", "62");
    t.end();
  }
);

tap.test(
  `63 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - with attr`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"  /  >  '),
      '<html blablabla="zzz"/>',
      "63"
    );
    t.end();
  }
);

tap.test(
  `64 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, just spaces`,
  (t) => {
    t.equal(collapse("<   html  / >"), "<html/>", "64");
    t.end();
  }
);

tap.test(
  `65 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, CR before slash`,
  (t) => {
    t.equal(collapse("<\thtml\r/>"), "<html/>", "65");
    t.end();
  }
);

tap.test(
  `66 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, CR after slash`,
  (t) => {
    t.equal(collapse("<\thtml/\r>"), "<html/>", "66");
    t.end();
  }
);

tap.test(
  `67 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #1`,
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
  `68 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #2`,
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
  `69 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #3`,
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
  `70 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #4`,
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
  `71 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - basic`,
  (t) => {
    t.equal(
      collapse("   <   html  /  >  ", { recogniseHTML: false }),
      "< html / >",
      "71"
    );
    t.end();
  }
);

tap.test(
  `72 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - basic with attr`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"  /  >  ', {
        recogniseHTML: false,
      }),
      '< html blablabla="zzz" / >',
      "72"
    );
    t.end();
  }
);

tap.test(
  `73 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, spaces`,
  (t) => {
    t.equal(
      collapse("<   html  / >", { recogniseHTML: false }),
      "< html / >",
      "73"
    );
    t.end();
  }
);

tap.test(
  `74 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, tab and CR before slash`,
  (t) => {
    t.equal(
      collapse("<\thtml\r/>", { recogniseHTML: false }),
      "<\thtml\r/>",
      "74"
    );
    t.end();
  }
);

tap.test(
  `75 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #1`,
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
  `76 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #2`,
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
  `77 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #3`,
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
  `78 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #4`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}\n \n    \r\r   \t\t  <  \t   html   \t   \t \t  / >\n  \r \t    \n  `,
          {
            recogniseHTML: false,
          }
        ),
        "< \t html \t \t \t / >",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `79 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - inner whitespace`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(collapse(`   <   ${tag}    >  `), `<${tag}>`, `05.31.${i}`);
    });
    t.end();
  }
);

tap.test(
  `80 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - inner whitespace`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(collapse(`   <   ${tag}  /  >  `), `<${tag}/>`, `05.32.${i}`);
    });
    t.end();
  }
);

tap.test(
  `81 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, spaces`,
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
  `82 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, tight`,
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
  `83 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, tight`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(collapse(`   <   z${tag}>  `), `< z${tag}>`, `05.35.${i}`);
    });
    t.end();
  }
);

tap.test(
  `84 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - no opening bracket`,
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
  `85 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - space-tag name`,
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
  `86 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - string starts with tagname`,
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
  `87 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - checking case when tag is at the end of string`,
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
  `88 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - checking case when tag is at the end of string`,
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
  `89 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - two closing brackets`,
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

tap.test("90 - testing against false positives #1", (t) => {
  t.equal(collapse("zz a < b and c > d yy"), "zz a < b and c > d yy", "90");
  t.end();
});

tap.test(
  `91 - testing against false positives #2 - the "< b" part is sneaky close to the real thing`,
  (t) => {
    t.equal(
      collapse("We have equations: a < b and c > d not to be mangled."),
      "We have equations: a < b and c > d not to be mangled.",
      "91"
    );
    t.end();
  }
);

tap.test("92 - testing against false positives #3 - with asterisks", (t) => {
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
  "93 - going from right to left, tag was recognised but string follows to the left - unrecognised string to the left",
  (t) => {
    t.equal(
      collapse('    < zzz   form      blablabla="zzz"  /  >  '),
      '< zzz form blablabla="zzz" / >',
      "93"
    );
    t.end();
  }
);

tap.test(
  "94 - going from right to left, tag was recognised but string follows to the left - even valid HTML tag to the left",
  (t) => {
    t.equal(
      collapse('    < form   form      blablabla="zzz"  /  >  '),
      '< form form blablabla="zzz" / >',
      "94"
    );
    t.end();
  }
);

tap.test("95 - HTML closing tag", (t) => {
  t.equal(
    collapse('    <   a    class="h"  style="display:  block;"  >'),
    '<a class="h" style="display: block;">',
    "95"
  );
  t.end();
});

tap.test("96 - HTML closing tag, more attrs", (t) => {
  t.equal(
    collapse(
      '    <   a    class="h"  style="display:  block;"  >    Something   here   < / a  >    '
    ),
    '<a class="h" style="display: block;"> Something here </a>',
    "96"
  );
  t.end();
});

tap.test("97 - HTML closing tag, word wrapped", (t) => {
  t.equal(collapse("< a > zzz < / a >"), "<a> zzz </a>", "97");
  t.end();
});

tap.test("98 - some weird letter casing", (t) => {
  t.equal(
    collapse(
      'test text is being < StRoNg >set in bold<   StRoNg class="wrong1" / > here'
    ),
    'test text is being <StRoNg>set in bold<StRoNg class="wrong1"/> here',
    "98"
  );
  t.end();
});

tap.test("99 - adhoc case #1", (t) => {
  t.equal(
    collapse("test text is being < b >set in bold< /  b > here"),
    "test text is being <b>set in bold</b> here",
    "99"
  );
  t.end();
});

tap.test("100 - adhoc case #2", (t) => {
  t.equal(collapse("aaa<bbb"), "aaa<bbb", "100");
  t.end();
});

tap.test("101 - adhoc case #3", (t) => {
  t.equal(collapse("aaa<bbb", { trimLines: false }), "aaa<bbb", "101");
  t.end();
});

tap.test("102 - adhoc case #4", (t) => {
  t.equal(collapse("aaa<bbb", { trimLines: true }), "aaa<bbb", "102");
  t.end();
});

tap.test(
  "103 - detected erroneous code (space after equal sign in HTML attribute) will skip HTML recognition",
  (t) => {
    // what will happen is, error space after equal in HTML attribute will cause
    // the algorithm to freak out and that tag will be skipped, even though the
    // opts.recogniseHTML would otherwise have trimmed tightly within that tag.
    t.equal(
      collapse(
        '   <   html    abc= "cde"    ><   html    fgh="hij"    ><   html    abc= "cde"    ><   html    fgh="hij"    >  '
      ),
      '< html abc= "cde" ><html fgh="hij">< html abc= "cde" ><html fgh="hij">',
      "103"
    );
    t.end();
  }
);

tap.test(
  "104 - detected erroneous code (space after equal sign in HTML attribute) will skip HTML recognition, recogniseHTML=off",
  (t) => {
    t.equal(
      collapse(
        '   <   html    abc= "cde"    ><   html    fgh="hij"    ><   html    abc= "cde"    ><   html    fgh="hij"    >  ',
        { recogniseHTML: false }
      ),
      '< html abc= "cde" >< html fgh="hij" >< html abc= "cde" >< html fgh="hij" >',
      "104"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 06. opts.removeEmptyLines
// -----------------------------------------------------------------------------

tap.test(
  `105 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - remove`,
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
  `106 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - one - don't remove`,
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
  `107 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - remove`,
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
  `108 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - two, spaced - don't remove`,
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
  `109 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - empty lines removal off + per-line trimming off`,
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
  `110 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - \\n - empty lines removal off + per-line trimming off - multiple spaces`,
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
  `111 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - advanced`,
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
  `112 - ${`\u001b[${33}m${`opts.removeEmptyLines`}\u001b[${39}m`} - leading/trailing empty lines`,
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
  `113 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, removeEmptyLines=off`,
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
  `114 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines, removeEmptyLines=on`,
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
  `115 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - three lines,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`,
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
  `116 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines, removeEmptyLines=on, limitConsecutiveEmptyLinesTo=1`,
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
  `117 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=2`,
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
  `118 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=3`,
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
  `119 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - four lines,  LF,   removeEmptyLines=on, limitConsecutiveEmptyLinesTo=99`,
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
  `120 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, LF, trimLines=off`,
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
  `121 - ${`\u001b[${34}m${`opts.limitConsecutiveEmptyLinesTo`}\u001b[${39}m`} - space on a blank line, LF, trimLines=on`,
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
  `122 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was something to remove`,
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
  `123 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was something to remove`,
  (t) => {
    t.same(
      collapse(`   a   bbb  \n   c   d   `, { returnRangesOnly: true }),
      [
        [0, 3],
        [4, 6],
        [10, 11],
        [13, 15],
        [17, 19],
        [21, 24],
      ],
      "123"
    );
    t.end();
  }
);

tap.test(
  `124 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was nothing to remove #1`,
  (t) => {
    t.equal(collapse("a b"), "a b", "124.01 - defaults");
    t.equal(
      collapse("a b", { returnRangesOnly: false }),
      "a b",
      "124.02 - hardcoded default"
    );
    t.same(collapse("a b", { returnRangesOnly: true }), [], "124.03");
    t.end();
  }
);

tap.test(
  `125 - ${`\u001b[${35}m${`opts.returnRangesOnly`}\u001b[${39}m`} - there was nothing to remove #2`,
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

tap.test(
  `126.XX - ${`\u001b[${36}m${`GENERATED TESTS`}\u001b[${39}m`}`,
  (t) => {
    for (let i = 10000; i--; ) {
      let temp = nothingToCollapseGenerator();
      t.equal(collapse(temp), temp);
      temp = undefined;
    }
    t.end();
  }
);
