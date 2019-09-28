// avanotonly

import test from "ava";
import { det, opts as exportedOptsObj, version } from "../dist/detergent.esm";
import { mixer, allCombinations } from "../t-util/util";

import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../dist/util.esm";

// ==============================
// 0. throws and API bits
// ==============================

// pinning throws by throw ID:

test(`00.01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when the second argument is truthy yet not a plain object`, t => {
  const error1 = t.throws(() => {
    det(`zzz`, "zzz");
  });
  t.regex(error1.message, /THROW_ID_01/gm, "00.01.01");

  const error2 = t.throws(() => {
    det(`zzz`, ["zzz"]);
  });
  t.regex(error2.message, /THROW_ID_01/gm, "00.01.02");
});

test(`00.02 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - default opts object is exported`, t => {
  t.true(Object.keys(exportedOptsObj).length > 10);
});

test(`00.03 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - version is exported`, t => {
  t.regex(version, /\d+\.\d+\.\d+/g);
});

// ==============================
// 02. everything about line breaks
// ==============================

test(`02.01 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - \\n replacement with BR - LF`, t => {
  t.is(
    det(`aaa\n\nbbb\n\nccc`).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "02.01 - LF"
  );
});

test(`02.02 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - \\n replacement with BR - CRLF`, t => {
  t.is(
    det(`aaa\r\n\r\nbbb\r\n\r\nccc`).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "02.02 - CRLF"
  );
});

test(`02.03 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`, t => {
  t.is(
    det(`a<br>b`, {
      useXHTML: true
    }).res,
    "a<br/>b",
    "02.03.01"
  );
  t.is(
    det(`a<br>b`, {
      useXHTML: false
    }).res,
    "a<br>b",
    "02.03.02"
  );
  t.is(
    det(`a<br/>b`, {
      useXHTML: true
    }).res,
    "a<br/>b",
    "02.03.01"
  );
  t.is(
    det(`a<br/>b`, {
      useXHTML: false
    }).res,
    "a<br>b",
    "02.03.02"
  );
});

test(`02.04 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`, t => {
  t.is(
    det(`abc<br >def<br>ghi<br/>jkl<br />mno`, {
      useXHTML: true,
      replaceLineBreaks: false
    }).res,
    "abc<br/>def<br/>ghi<br/>jkl<br/>mno"
  );
});

test(`02.05 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with HTML BR`, t => {
  t.is(
    det(`abc<br >def<br>ghi<br/>jkl<br />mno`, {
      useXHTML: false,
      replaceLineBreaks: false
    }).res,
    "abc<br>def<br>ghi<br>jkl<br>mno"
  );
});

test(`02.06 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`, t => {
  t.is(det(`<BR />`).res, `<br/>`, "02.06.01");
  t.is(det(`< BR>`).res, `<br/>`, "02.06.02");
  t.is(det(`<BR class="z"/>`).res, `<br class="z"/>`, "02.06.03");
  t.is(
    det(`aaa<BR />< BR>bbb< BR ><BR>ccc< br >< Br>ddd`).res,
    "aaa<br/><br/>bbb<br/><br/>ccc<br/><br/>ddd",
    "02.06.04"
  );
});

test(`02.07 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #1`, t => {
  t.is(
    det(`a</br>b`, {
      useXHTML: false
    }).res,
    "a<br>b"
  );
  t.is(
    det(`a</br>b`, {
      useXHTML: true
    }).res,
    "a<br/>b"
  );
});

test(`02.08 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #2`, t => {
  t.is(
    det(`a< / / br>b`, {
      useXHTML: false,
      replaceLineBreaks: false
    }).res,
    "a<br>b"
  );
});

test(`02.09 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #3`, t => {
  t.is(
    det(`a< / / br style="something" / />b`, {
      useXHTML: false,
      replaceLineBreaks: false
    }).res,
    `a<br style="something">b`
  );
});

test(`02.10 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #4`, t => {
  t.is(
    det(`a< / / br style="something" / />b`, {
      useXHTML: true,
      replaceLineBreaks: false
    }).res,
    `a<br style="something"/>b`
  );
});

test(`02.11 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #5`, t => {
  t.is(
    det(`a</br class="display: none;">b`, {
      useXHTML: false,
      replaceLineBreaks: false
    }).res,
    `a<br class="display: none;">b`,
    "02.11.01"
  );
  t.is(
    det(`a</br class="display: none;">b`, {
      useXHTML: true,
      replaceLineBreaks: false
    }).res,
    `a<br class="display: none;"/>b`,
    "02.11.02"
  );
});

test(`02.12 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #6`, t => {
  t.is(
    det(`a<br class="display: none;"/>b`, {
      useXHTML: false,
      replaceLineBreaks: false
    }).res,
    `a<br class="display: none;">b`,
    "02.12.01"
  );
  t.is(
    det(`a<br class="display: none;"/>b`, {
      useXHTML: true,
      replaceLineBreaks: false
    }).res,
    `a<br class="display: none;"/>b`,
    "02.12.02"
  );
});

test(`02.13 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #7`, t => {
  t.is(
    det(`a<br class="display: none;">b`, {
      useXHTML: false,
      replaceLineBreaks: false
    }).res,
    `a<br class="display: none;">b`,
    "02.13.01"
  );
  t.is(
    det(`a<br class="display: none;">b`, {
      useXHTML: true,
      replaceLineBreaks: false
    }).res,
    `a<br class="display: none;"/>b`,
    "02.13.02"
  );
});

// ===================
// 03. rubbish removal
// ===================

test(`03.01 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - front & back spaces stripped`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det(`\n\n \t     aaaaaa   \n\t\t  `, opt).res,
      "aaaaaa",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.02 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - redundant space between words`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det(`aaaaaa     bbbbbb`, opt).res,
      "aaaaaa bbbbbb",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.03 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`&nbsp; a b`, opt).res,
      "&nbsp; a b",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.04 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`a b &nbsp;`, opt).res,
      "a b &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.05 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`&nbsp; a &nbsp;`, opt).res,
      "&nbsp; a &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.06 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`    ${rawNbsp}     a     ${rawNbsp}      `, opt).res,
      "&nbsp; a &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.07 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`, opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.08 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(` &nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp; `, opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.09 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(`&nbsp; a b`, opt).res,
      `${rawNbsp} a b`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.10 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(`a b &nbsp;`, opt).res,
      `a b ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.11 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(`    &nbsp; a &nbsp;     `, opt).res,
      `${rawNbsp} a ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.12 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(`    ${rawNbsp}     a     ${rawNbsp}           `, opt).res,
      `${rawNbsp} a ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.13 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(
        `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
        opt
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.14 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - trailing/leading whitespace, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(
        ` ${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp} `,
        opt
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.15 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - ETX - useXHTML=on`, t => {
  mixer({
    removeLineBreaks: 0,
    replaceLineBreaks: 1,
    useXHTML: 1
  }).forEach(opt => {
    t.is(
      det(`first\u0003second`, opt).res,
      "first<br/>\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.16 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - ETX - useXHTML=off`, t => {
  mixer({
    removeLineBreaks: 0,
    replaceLineBreaks: 1,
    useXHTML: 0
  }).forEach(opt => {
    t.is(
      det(`first\u0003second`, opt).res,
      "first<br>\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.17 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - ETX - replaceLineBreaks=off`, t => {
  mixer({
    removeLineBreaks: 0,
    replaceLineBreaks: 0,
    useXHTML: 0
  }).forEach(opt => {
    t.is(
      det(`first\u0003second`, opt).res,
      "first\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.18 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - strips UTF8 BOM`, t => {
  mixer({
    dontEncodeNonLatin: 1,
    keepBoldEtc: 1
  }).forEach(opt => {
    t.is(
      det(`\uFEFFunicorn`, opt).res,
      "unicorn",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.19 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - strips UTF8 BOM`, t => {
  mixer({
    dontEncodeNonLatin: 1,
    keepBoldEtc: 1
  }).forEach(opt => {
    t.is(
      det(`unicorn\uFEFF`, opt).res,
      "unicorn",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.20 - ${`\u001b[${31}m${`rubbish removal`}\u001b[${39}m`} - strips UTF8 BOM`, t => {
  mixer({
    dontEncodeNonLatin: 1,
    keepBoldEtc: 1
  }).forEach(opt => {
    t.is(
      det(`unicorn\uFEFFzzz`, opt).res,
      "unicornzzz",
      JSON.stringify(opt, null, 0)
    );
  });
});

// ==============================
// 04. opts.replaceLineBreaks
// ==============================

test(`04.01 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - minimal example - raw linebreaks, Mac`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(det(`a\nb`, opt).res, "a<br/>\nb", JSON.stringify(opt, null, 0));
  });
});

test(`04.02 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - minimal example - raw linebreaks, PC`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(det(`a\r\nb`, opt).res, "a<br/>\nb", JSON.stringify(opt, null, 0));
  });
});

test(`04.03 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - minimal example - br`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(det(`a<br/>b`, opt).res, "a<br/>b", JSON.stringify(opt, null, 0));
  });
});

test(`04.04 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - replace \\n line breaks with BR - useXHTML=on`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`\n\n\ntralala\ntralala2\n\ntralala3\n\n\ntralala4\n\n\n`, opt).res,
      "tralala<br/>\ntralala2<br/>\n<br/>\ntralala3<br/>\n<br/>\n<br/>\ntralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.05 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - replace \\n line breaks with BR - useXHTML=off`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`\n\ntralala\ntralala2\n\ntralala3\n\n\ntralala4\n\n\n\n`, opt).res,
      "tralala<br>\ntralala2<br>\n<br>\ntralala3<br>\n<br>\n<br>\ntralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.06 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - br with attribute, line break present`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`a<br class="z">\nb`, opt).res,
      `a<br class="z">\nb`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.07 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - only adds a slash, respects existing attrs`, t => {
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`a<br class="z">\nb`, opt).res,
      `a<br class="z"/>\nb`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.08 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - br with attribute, no line break, HTML`, t => {
  // HTML
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`a<br class="z">b`, opt).res,
      `a<br class="z">b`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.09 - ${`\u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m`} - br with attribute, no line break, XHTML`, t => {
  // XHTML
  mixer({
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`a<br class="z">b`, opt).res,
      `a<br class="z"/>b`,
      JSON.stringify(opt, null, 0)
    );
  });
});

// ==============================
// 05. opts.removeLineBreaks
// ==============================
// see https://en.wikipedia.org/wiki/Newline#Representation

test(`05.01 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - minimal, removeLineBreaks=on`, t => {
  mixer({
    removeLineBreaks: 1
  }).forEach(opt => {
    t.is(det(`a\nb`, opt).res, "a b", JSON.stringify(opt, null, 0));
  });
});

test(`05.02 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - minimal, removeLineBreaks=off`, t => {
  mixer({
    removeLineBreaks: 0,
    replaceLineBreaks: 0
  }).forEach(opt => {
    t.is(det(`a\nb`, opt).res, "a\nb", JSON.stringify(opt, null, 0));
  });
});

test(`05.03 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - Unix style (LF or \\n)`, t => {
  mixer({
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, opt).res,
      "tralala tralala2 tralala3 tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    removeLineBreaks: 1,
    removeWidows: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, opt).res,
      "tralala tralala2 tralala3&nbsp;tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.04 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - DOS style (CRLF or \\r\\n)`, t => {
  mixer({
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det(
        "\r\n\r\n\r\ntralala\r\ntralala2\r\ntralala3\r\n\r\n\r\ntralala4\r\n\r\n\r\n",
        opt
      ).res,
      "tralala tralala2 tralala3 tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.05 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - DOS style (CRLF or \\r\\n)`, t => {
  mixer({
    removeLineBreaks: 1,
    removeWidows: 1,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(
        "\r\n\r\n\r\ntralala\r\ntralala2\r\ntralala3\r\n\r\n\r\ntralala4\r\n\r\n\r\n",
        opt
      ).res,
      `tralala tralala2 tralala3${rawNbsp}tralala4`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.06 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - clasic Mac OS style (CR or \\r only)`, t => {
  mixer({
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det(`\r\r\rtralala\rtralala2\rtralala3\r\r\rtralala4\r\r\r`, opt).res,
      "tralala tralala2 tralala3 tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.07 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - clasic Mac OS style (CR or \\r only)`, t => {
  mixer({
    removeLineBreaks: 1,
    removeWidows: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`\r\r\rtralala\rtralala2\rtralala3\r\r\rtralala4\r\r\r`, opt).res,
      "tralala tralala2 tralala3&nbsp;tralala4",
      JSON.stringify(opt, null, 0)
    );
  });
});

// ==============================
// 06. opts.dontEncodeNonLatin
// ==============================

test(`06.01 - ${`\u001b[${36}m${`opts.dontEncodeNonLatin`}\u001b[${39}m`} - doesn't encode non-Latin`, t => {
  mixer({
    removeWidows: 0,
    dontEncodeNonLatin: 1
  }).forEach(opt => {
    t.is(
      det(
        "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
        opt
      ).res,
      "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
      JSON.stringify(opt, null, 0)
    );
  });
});

// ==============================
// 07. Clearly errors
// ==============================

test(`07.01 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off`, t => {
  mixer({
    removeWidows: 0,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal.<br/>\n<br/>\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.02 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.<br/>\n<br/>\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.03 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.<br/>\n<br/>\nText.`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.04 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeLineBreaks=off`, t => {
  mixer({
    removeWidows: 0,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal.\n\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.05 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    useXHTML: 1
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.\n\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.06 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0,
    replaceLineBreaks: 0,
    removeLineBreaks: 0,
    useXHTML: 1
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.\n\nText.`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.07 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, replaceLineBreaks=on`, t => {
  mixer({
    removeWidows: 0,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal.<br>\n<br>\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.08 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, replaceLineBreaks=on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow&nbsp;removal.<br>\n<br>\nText.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.09 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, replaceLineBreaks=on, convertEntities=off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach(opt => {
    t.is(
      det(
        "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
        opt
      ).res,
      `Very long line, long-enough to trigger widow${rawNbsp}removal.<br>\n<br>\nText.`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.10 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - LF`, t => {
  mixer({
    removeWidows: 0,
    removeLineBreaks: 1
  }).forEach(opt => {
    t.is(
      det(
        " \u000a    Very long line, long-enough to trigger widow removal   \n\n. \u000a\n Text text text text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.11 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - CR`, t => {
  mixer({
    removeWidows: 0,
    removeLineBreaks: 1
  }).forEach(opt => {
    t.is(
      det(
        " \u000a    Very long line, long-enough to trigger widow removal   \r\r. \u000a\n Text text text text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.12 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - CRLF`, t => {
  mixer({
    removeWidows: 0,
    removeLineBreaks: 1
  }).forEach(opt => {
    t.is(
      det(
        " \u000a    Very long line, long-enough to trigger widow removal   \r\n\r\n. \u000a\n Text text text text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text text.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.13 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, removeLineBreaks=on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    removeLineBreaks: 1
  }).forEach(opt => {
    t.is(
      det(
        " \u000a    Very long line, long-enough to trigger widow removal .  \n \n \u000a\n Text text text text . ",
        opt
      ).res,
      "Very long line, long-enough to trigger widow removal. Text text text&nbsp;text.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.14 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, convertEntities=off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0,
    removeLineBreaks: 1
  }).forEach(opt => {
    t.is(
      det(
        " \u000a   Very long line, long-enough to trigger widow removal .  \n \n  \u000a\n Text text text text . ",
        opt
      ).res,
      `Very long line, long-enough to trigger widow removal. Text text text${rawNbsp}text.`,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.15 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`, t => {
  t.is(det(`a. \na`).res, "a.<br/>\na");
});

test(`07.16 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`, t => {
  t.is(det(`a . \na`).res, "a.<br/>\na");
});

test(`07.17 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`, t => {
  t.is(det(`a , \na`).res, "a,<br/>\na");
});

test(`07.18 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - checking line feed being replaced with space`, t => {
  mixer({
    removeLineBreaks: 1
  }).forEach(opt => {
    t.is(
      det(`aaaa\u000Abbbbb`, opt).res,
      "aaaa bbbbb",
      JSON.stringify(opt, null, 0)
    );
  });
});

// ==============================
// 08. COPING WITH MULTIPLE ENCODING
// ==============================

test(`08.01 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(`&amp;nbsp;`, opt).res,
      `${rawNbsp}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`08.02 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(det(`&amp;pound;`, opt).res, "£", JSON.stringify(opt, null, 4));
  });
});

test(`08.03 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(`&amp;amp;amp;amp;pound;`, opt).res,
      "£",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`08.04 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(det(`&#x26;#xA9;`, opt).res, "©", JSON.stringify(opt, null, 4));
  });
});

test(`08.05 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(`a&#x26;#x26;amp;b`, opt).res,
      "a&b",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08.06 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(det(`&amp;nbsp;`, opt).res, "&nbsp;", JSON.stringify(opt, null, 4));
  });
});

test(`08.07 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(det(`&amp;pound;`, opt).res, "&pound;", JSON.stringify(opt, null, 4));
  });
});

test(`08.08 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`&amp;amp;amp;amp;pound;`, opt).res,
      "&pound;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`08.09 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(det(`&#x26;#xA9;`, opt).res, "&copy;", JSON.stringify(opt, null, 4));
  });
});

test(`08.10 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`a&#x26;#x26;amp;b`, opt).res,
      "a&amp;b",
      JSON.stringify(opt, null, 0)
    );
  });
});

// ==============================
// 09. UL/LI TAGS
// ==============================

test(`09.01 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, removeLineBreaks=on`, t => {
  mixer({
    removeLineBreaks: 1,
    removeWidows: 0,
    stripHtml: 1
  }).forEach(opt => {
    t.is(
      det(
        "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
        opt
      ).res,
      "Text First point Second point Third point Text straight after",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09.02 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=off`, t => {
  mixer({
    removeLineBreaks: 0,
    removeWidows: 0,
    replaceLineBreaks: 0,
    stripHtml: 1
  }).forEach(opt => {
    t.is(det(`a<li>b`, opt).res, "a\nb", JSON.stringify(opt, null, 0));
  });
});

test(`09.03 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=off`, t => {
  mixer({
    removeLineBreaks: 0,
    removeWidows: 0,
    replaceLineBreaks: 0,
    stripHtml: 1
  }).forEach(opt => {
    t.is(
      det(
        "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
        opt
      ).res,
      "Text\nFirst point\nSecond point\nThird point\nText straight after",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09.04 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=on`, t => {
  mixer({
    removeLineBreaks: 0,
    removeWidows: 0,
    replaceLineBreaks: 1,
    useXHTML: 1,
    stripHtml: 1
  }).forEach(opt => {
    t.is(
      det(
        "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
        opt
      ).res,
      "Text<br/>\nFirst point<br/>\nSecond point<br/>\nThird point<br/>\nText straight after",
      JSON.stringify(opt, null, 0)
    );
  });
});

// ==============================
// 10. AD-HOC
// ==============================

test(`10.01 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=off`, t => {
  mixer({
    convertEntities: 0,
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det(`something ----> anything`, opt).res,
      "something ----> anything",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.02 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=on`, t => {
  mixer({
    convertEntities: 1,
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det(`something ----> anything`, opt).res,
      "something ----&gt; anything",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.03 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=off`, t => {
  mixer({
    convertEntities: 0,
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det(`something ---> anything --> everything -> thing`, opt).res,
      "something ---> anything --> everything -> thing",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.04 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - widow removal and single space between ] and (`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(`aaaaaa bbbbbbb [cccccc] (ddddddd)`, opt).res,
      "aaaaaa bbbbbbb [cccccc]&nbsp;(ddddddd)",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.05 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - unlinked .co.uk in the text, removeWidows=on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        opt
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.06 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - unlinked .co.uk in the text, removeWidows=off`, t => {
  mixer({
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det(
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        opt
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.07 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - consecutive empty lines full of whitespace symbols`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        opt
      ).res,
      "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.08 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - less than sign`, t => {
  mixer({
    convertEntities: 1,
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(det(`a < b`, opt).res, "a &lt; b", JSON.stringify(opt, null, 0));
  });
});

test(`10.09 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - greater than sign`, t => {
  mixer({
    convertEntities: 1,
    removeLineBreaks: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(det(`a > b`, opt).res, "a &gt; b", JSON.stringify(opt, null, 0));
  });
});
