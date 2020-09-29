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

// opts.recogniseHTML
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: whitespace everywhere`,
  (t) => {
    t.equal(
      collapse('   <   html    abc="cde"    >  ').result,
      '<html abc="cde">',
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - longer`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"    >  ').result,
      '<html blablabla="zzz">',
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: as 01, but no trim`,
  (t) => {
    t.equal(collapse("<   html   >").result, "<html>", "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: tab and carriage return within html tag. Pretty messed up, isn't it?`,
  (t) => {
    t.equal(collapse("<\thtml\r>").result, "<html>", "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: like 03, but with more non-space white space for trimming`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `\n${presentEolType}\r\r\t\t<\thtml\r\t\t>\n\r\t${presentEolType}`
        ).result,
        "<html>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - defaults: like 04 but with sprinkled spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `\n ${presentEolType}    \r\r   \t\t  <  \t   html   \r   \t \t   >\n  \r \t    ${presentEolType}  `
        ).result,
        "<html>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - defaults`,
  (t) => {
    t.equal(
      collapse('   <   html    abc="cde"    >  ', { recogniseHTML: false })
        .result,
      '< html abc="cde" >',
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - HTML`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"    >  ', {
        recogniseHTML: false,
      }).result,
      '< html blablabla="zzz" >',
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but no trim`,
  (t) => {
    t.equal(
      collapse("<   html   >", { recogniseHTML: false }).result,
      "< html >",
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - tab and carriage return within html tag`,
  (t) => {
    t.equal(
      collapse("<\thtml\r>", { recogniseHTML: false }).result,
      "<\thtml\r>",
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but with more non-space white space for trimming`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\r\r\t\t<\thtml\r\t\t>\n\r\t\n`, {
          recogniseHTML: false,
        }).result,
        "<\thtml\r\t\t>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${35}m${`HTML`}\u001b[${39}m`} - recognition is off - like before but with sprinkled spaces`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType} \n    \r\r   \t\t  <  \t   html   \r   \t \t   >\n  \r \t    \n  `,
          {
            recogniseHTML: false,
          }
        ).result,
        "< \t html \r \t \t >",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - no attr`,
  (t) => {
    t.equal(collapse("   <   html  /  >  ").result, "<html/>", "13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - with attr`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"  /  >  ').result,
      '<html blablabla="zzz"/>',
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, just spaces`,
  (t) => {
    t.equal(collapse("<   html  / >").result, "<html/>", "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, CR before slash`,
  (t) => {
    t.equal(collapse("<\thtml\r/>").result, "<html/>", "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, CR after slash`,
  (t) => {
    t.equal(collapse("<\thtml/\r>").result, "<html/>", "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #1`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\r\r\t\t<\thtml\r\t\t/>\n\r\t\n`).result,
        "<html/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #2`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\n\r\r\t\t<\thtml\r/\t\t>\n\r\t\n`).result,
        "<html/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #3`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\n\r\r\t\t<\thtml/\r\t\t>\n\r\t\n`).result,
        "<html/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - inner tag whitespace, many mixed #4`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType} \n    \r\r   \t\t  <  \t   html   \t   \t \t  / >\n  \r \t    \n  `
        ).result,
        "<html/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - basic`,
  (t) => {
    t.equal(
      collapse("   <   html  /  >  ", { recogniseHTML: false }).result,
      "< html / >",
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - basic with attr`,
  (t) => {
    t.equal(
      collapse('    <    html      blablabla="zzz"  /  >  ', {
        recogniseHTML: false,
      }).result,
      '< html blablabla="zzz" / >',
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, spaces`,
  (t) => {
    t.equal(
      collapse("<   html  / >", { recogniseHTML: false }).result,
      "< html / >",
      "24"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - inner tag whitespace, tab and CR before slash`,
  (t) => {
    t.equal(
      collapse("<\thtml\r/>", { recogniseHTML: false }).result,
      "<\thtml\r/>",
      "25"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #1`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\r\r\t\t<\thtml\r\t\t/>\n\r\t\n`, {
          recogniseHTML: false,
        }).result,
        "<\thtml\r\t\t/>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #2`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\n\r\r\t\t<\thtml\r/\t\t>\n\r\t\n`, {
          recogniseHTML: false,
        }).result,
        "<\thtml\r/\t\t>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #3`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}\n\n\r\r\t\t<\thtml/\r\t\t>\n\r\t\n`, {
          recogniseHTML: false,
        }).result,
        "<\thtml/\r\t\t>",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${34}m${`opts.recogniseHTML`}\u001b[${39}m`} - ${`\u001b[${36}m${`XHTML`}\u001b[${39}m`} - recognition is off - mixed inner whitespace #4`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `${presentEolType}\n \n    \r\r   \t\t  <  \t   html   \t   \t \t  / >\n  \r \t    \n  `,
          {
            recogniseHTML: false,
          }
        ).result,
        "< \t html \t \t \t / >",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - inner whitespace`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`   <   ${tag}    >  `).result,
        `<${tag}>`,
        `05.31.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - inner whitespace`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`   <   ${tag}  /  >  `).result,
        `<${tag}/>`,
        `05.32.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, spaces`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`   <    z  ${tag}  /  >  `).result,
        `< z ${tag} / >`, // <----- only collapses the whitespace
        `05.33.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, tight`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`   <   z${tag}  /  >  `).result,
        `< z${tag} / >`,
        `05.34.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - letter in front, inner whitespace, tight`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(collapse(`   <   z${tag}>  `).result, `< z${tag}>`, `05.35.${i}`);
    });
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - no opening bracket`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(` a      ${tag}>  `).result,
        `a ${tag}>`, // <------- no opening bracket
        `05.36.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - space-tag name`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(` ${tag}>  `).result,
        `${tag}>`, // <------- space-tagname
        `05.37.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - string starts with tagname`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(` ${tag}>  `).result,
        `${tag}>`, // <------- string starts with tagname
        `05.38.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - checking case when tag is at the end of string`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`  <  ${tag}  `).result,
        `< ${tag}`, // <------- checking case when tag is at the end of string
        `05.39.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - checking case when tag is at the end of string`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`Just like a <    b, the tag  ${tag} is my <3... `).result,
        `Just like a < b, the tag ${tag} is my <3...`,
        `05.40.${i}`
      );
    });
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${35}m${`testing all recognised`}\u001b[${39}m`} - two closing brackets`,
  (t) => {
    htmlTags.forEach((tag, i) => {
      t.equal(
        collapse(`   <   z${tag} >   >  `).result,
        `< z${tag} > >`,
        `05.41.${i}`
      );
    });
    t.end();
  }
);

tap.test("41 - testing against false positives #1", (t) => {
  t.equal(
    collapse("zz a < b and c > d yy").result,
    "zz a < b and c > d yy",
    "41"
  );
  t.end();
});

tap.test(
  `42 - testing against false positives #2 - the "< b" part is sneaky close to the real thing`,
  (t) => {
    t.equal(
      collapse("We have equations: a < b and c > d not to be mangled.").result,
      "We have equations: a < b and c > d not to be mangled.",
      "42"
    );
    t.end();
  }
);

tap.test("43 - testing against false positives #3 - with asterisks", (t) => {
  ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
    t.equal(
      collapse(
        `We have equations: * a < b ${presentEolType} * c > d ${presentEolType} ${presentEolType} and others.`
      ).result,
      `We have equations: * a < b ${presentEolType} * c > d ${presentEolType} ${presentEolType} and others.`,
      `EOL ${key[idx]}`
    );
  });
  t.end();
});

tap.test(
  "44 - going from right to left, tag was recognised but string follows to the left - unrecognised string to the left",
  (t) => {
    t.equal(
      collapse('    < zzz   form      blablabla="zzz"  /  >  ').result,
      '< zzz form blablabla="zzz" / >',
      "44"
    );
    t.end();
  }
);

tap.test(
  "45 - going from right to left, tag was recognised but string follows to the left - even valid HTML tag to the left",
  (t) => {
    t.equal(
      collapse('    < form   form      blablabla="zzz"  /  >  ').result,
      '< form form blablabla="zzz" / >',
      "45"
    );
    t.end();
  }
);

tap.test("46 - HTML closing tag", (t) => {
  t.equal(
    collapse('    <   a    class="h"  style="display:  block;"  >').result,
    '<a class="h" style="display: block;">',
    "46"
  );
  t.end();
});

tap.test("47 - HTML closing tag, more attrs", (t) => {
  t.equal(
    collapse(
      '    <   a    class="h"  style="display:  block;"  >    Something   here   < / a  >    '
    ).result,
    '<a class="h" style="display: block;"> Something here </a>',
    "47"
  );
  t.end();
});

tap.test("48 - HTML closing tag, word wrapped", (t) => {
  t.equal(collapse("< a > zzz < / a >").result, "<a> zzz </a>", "48");
  t.end();
});

tap.test("49 - some weird letter casing", (t) => {
  t.equal(
    collapse(
      'test text is being < StRoNg >set in bold<   StRoNg class="wrong1" / > here'
    ).result,
    'test text is being <StRoNg>set in bold<StRoNg class="wrong1"/> here',
    "49"
  );
  t.end();
});

tap.test("50 - adhoc case #1", (t) => {
  t.equal(
    collapse("test text is being < b >set in bold< /  b > here").result,
    "test text is being <b>set in bold</b> here",
    "50"
  );
  t.end();
});

tap.test("51 - adhoc case #2", (t) => {
  t.equal(collapse("aaa<bbb").result, "aaa<bbb", "51");
  t.end();
});

tap.test("52 - adhoc case #3", (t) => {
  t.equal(collapse("aaa<bbb", { trimLines: false }).result, "aaa<bbb", "52");
  t.end();
});

tap.test("53 - adhoc case #4", (t) => {
  t.equal(collapse("aaa<bbb", { trimLines: true }).result, "aaa<bbb", "53");
  t.end();
});

tap.test(
  "54 - detected erroneous code (space after equal sign in HTML attribute) will skip HTML recognition",
  (t) => {
    // what will happen is, error space after equal in HTML attribute will cause
    // the algorithm to freak out and that tag will be skipped, even though the
    // opts.recogniseHTML would otherwise have trimmed tightly within that tag.
    t.equal(
      collapse(
        '   <   html    abc= "cde"    ><   html    fgh="hij"    ><   html    abc= "cde"    ><   html    fgh="hij"    >  '
      ).result,
      '< html abc= "cde" ><html fgh="hij">< html abc= "cde" ><html fgh="hij">',
      "54"
    );
    t.end();
  }
);

tap.test(
  "55 - detected erroneous code (space after equal sign in HTML attribute) will skip HTML recognition, recogniseHTML=off",
  (t) => {
    t.equal(
      collapse(
        '   <   html    abc= "cde"    ><   html    fgh="hij"    ><   html    abc= "cde"    ><   html    fgh="hij"    >  ',
        { recogniseHTML: false }
      ).result,
      '< html abc= "cde" >< html fgh="hij" >< html abc= "cde" >< html fgh="hij" >',
      "55"
    );
    t.end();
  }
);
