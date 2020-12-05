import tap from "tap";
import {
  det as det1,
  opts as exportedOptsObj,
  version,
} from "../dist/detergent.esm";
import { det, mixer } from "../t-util/util";
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../src/util";

// ==============================
// 0. throws and API bits
// ==============================

// pinning throws by throw ID:

tap.test(
  `01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when the first argument is not string`,
  (t) => {
    t.throws(() => {
      det(t, 0, 1, "zzz");
    }, /THROW_ID_01/gm);

    t.throws(() => {
      det(t, 0, true, "zzz");
    }, /THROW_ID_01/gm);

    function fn() {
      return true;
    }
    t.throws(() => {
      det(t, 0, fn, "zzz");
    }, /THROW_ID_01/gm);

    t.throws(() => {
      det(t, 0, { a: "b" }, "zzz");
    }, /THROW_ID_01/gm);

    t.throws(() => {
      det(t, 0, null, "zzz");
    }, /THROW_ID_01/gm);

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when the second argument is truthy yet not a plain object`,
  (t) => {
    t.throws(() => {
      det(t, 0, `zzz`, "zzz");
    }, /THROW_ID_02/gm);
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - default opts object is exported`,
  (t) => {
    t.ok(Object.keys(exportedOptsObj).length > 10, "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - version is exported`,
  (t) => {
    t.match(version, /\d+\.\d+\.\d+/g, "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when opts.cb is truthy and not a function`,
  (t) => {
    t.throws(() => {
      det(t, 0, `zzz`, { cb: true });
    }, /THROW_ID_03/gm);
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - not throws when opts.cb is falsey`,
  (t) => {
    // original function det1():
    t.doesNotThrow(() => {
      det1(`zzz`, { cb: null });
    }, "06.01");
    t.doesNotThrow(() => {
      det1(`zzz`, { cb: false });
    }, "06.02");
    t.doesNotThrow(() => {
      det1(`zzz`, { cb: false });
    }, "06.03");

    // mixer det()
    t.doesNotThrow(() => {
      det(t, 0, `zzz`, { cb: null });
    }, "06.04");
    t.doesNotThrow(() => {
      det(t, 0, `zzz`, { cb: false });
    }, "06.05");
    t.doesNotThrow(() => {
      det(t, 0, `zzz`, { cb: false });
    }, "06.06");

    t.end();
  }
);

// ==============================
// 02. everything about line breaks
// ==============================

tap.test(
  `07 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - \\n replacement with BR - LF`,
  (t) => {
    t.equal(
      det(t, 0, `aaa\n\nbbb\n\nccc`).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - \\n replacement with BR - CRLF`,
  (t) => {
    t.equal(
      det(t, 0, `aaa\r\n\r\nbbb\r\n\r\nccc`).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "08 - CRLF"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `a<br>b`, {
        useXHTML: true,
      }).res,
      "a<br/>b",
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `a<br>b`, {
        useXHTML: false,
      }).res,
      "a<br>b",
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.match(
      det(t, 0, `a<br/>b`, {
        useXHTML: true,
      }),
      {
        res: "a<br/>b",
        applicableOpts: {
          fixBrokenEntities: false,
          removeWidows: false,
          convertEntities: false,
          convertDashes: false,
          convertApostrophes: false,
          replaceLineBreaks: false,
          removeLineBreaks: false,
          useXHTML: true,
          dontEncodeNonLatin: false,
          addMissingSpaces: false,
          convertDotsToEllipsis: false,
          stripHtml: true,
          eol: false,
        },
      },
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `a<br/>b`, {
        useXHTML: false,
      }).res,
      "a<br>b",
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `abc<br >def<br>ghi<br/>jkl<br />mno`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      "abc<br/>def<br/>ghi<br/>jkl<br/>mno",
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with HTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `abc<br >def<br>ghi<br/>jkl<br />mno`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      "abc<br>def<br>ghi<br>jkl<br>mno",
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`,
  (t) => {
    t.equal(det(t, 0, `<BR />`).res, `<br/>`, "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`,
  (t) => {
    t.equal(det(t, 0, `< BR>`).res, `<br/>`, "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`,
  (t) => {
    t.equal(det(t, 0, `<BR class="z"/>`).res, `<br class="z"/>`, "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`,
  (t) => {
    t.equal(
      det(t, 0, `aaa<BR />< BR>bbb< BR ><BR>ccc< br >< Br>ddd`).res,
      "aaa<br/><br/>bbb<br/><br/>ccc<br/><br/>ddd",
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #1`,
  (t) => {
    t.equal(
      det(t, 0, `a</br>b`, {
        useXHTML: false,
      }).res,
      "a<br>b",
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #1`,
  (t) => {
    t.equal(
      det(t, 0, `a</br>b`, {
        useXHTML: true,
      }).res,
      "a<br/>b",
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #2`,
  (t) => {
    t.equal(
      det(t, 0, `a< / / br>b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      "a<br>b",
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #3`,
  (t) => {
    t.equal(
      det(t, 0, `a< / / br style="something" / />b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      `a<br style="something">b`,
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #4`,
  (t) => {
    t.equal(
      det(t, 0, `a< / / br style="something" / />b`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      `a<br style="something"/>b`,
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #5`,
  (t) => {
    t.equal(
      det(t, 0, `a</br class="display: none;">b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;">b`,
      "24"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #5`,
  (t) => {
    t.equal(
      det(t, 0, `a</br class="display: none;">b`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;"/>b`,
      "25"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #6`,
  (t) => {
    t.equal(
      det(t, 0, `a<br class="display: none;"/>b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;">b`,
      "26"
    );
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #6`,
  (t) => {
    t.equal(
      det(t, 0, `a<br class="display: none;"/>b`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;"/>b`,
      "27"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #7`,
  (t) => {
    t.equal(
      det(t, 0, `a<br class="display: none;">b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;">b`,
      "28"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #7`,
  (t) => {
    t.equal(
      det(t, 0, `a<br class="display: none;">b`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;"/>b`,
      "29"
    );
    t.end();
  }
);

// ===================
// 03. rubbish removal
// ===================

tap.test(`30 - front & back spaces stripped`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `\n\n \t     aaaaaa   \n\t\t  `, opt).res,
      "aaaaaa",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`31 - redundant space between words`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `aaaaaa     bbbbbb`, opt).res,
      "aaaaaa bbbbbb",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`32 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&nbsp; a b`, opt).res,
      "&nbsp; a b",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`33 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a b &nbsp;`, opt).res,
      "a b &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`34 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&nbsp; a &nbsp;`, opt).res,
      "&nbsp; a &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`35 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `    ${rawNbsp}     a     ${rawNbsp}      `, opt).res,
      "&nbsp; a &nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`36 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;`, opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`37 - trailing/leading whitespace, convertEntities=on`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, ` &nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp; `, opt).res,
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`38 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `&nbsp; a b`, opt).res,
      `${rawNbsp} a b`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`39 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a b &nbsp;`, opt).res,
      `a b &nbsp;`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `a b &nbsp;`, opt).res,
      `a b ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`40`, (t) => {
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `    &nbsp; a &nbsp;     `, opt).res,
      `&nbsp; a &nbsp;`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `    &nbsp; a &nbsp;     `, opt).res,
      `${rawNbsp} a ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`41 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `    ${rawNbsp}     a     ${rawNbsp}           `, opt).res,
      `${rawNbsp} a ${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`42 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
        opt
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`43 - trailing/leading whitespace, convertEntities=off`, (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        ` ${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp} `,
        opt
      ).res,
      `${rawNbsp}${rawNbsp}${rawNbsp} a ${rawNbsp}${rawNbsp}${rawNbsp}`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`44 - ETX - useXHTML=on`, (t) => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `first\u0003second`, opt).res,
      `first<br/>\nsecond`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`45 - ETX - useXHTML=off`, (t) => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: true,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `first\u0003second`, opt).res,
      "first<br>\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`46 - ETX - replaceLineBreaks=off`, (t) => {
  mixer({
    removeLineBreaks: false,
    replaceLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `first\u0003second`, opt).res,
      "first\nsecond",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`47 - strips UTF8 BOM`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `\uFEFFunicorn`, opt).res,
      "unicorn",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`48 - strips UTF8 BOM`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `unicorn\uFEFF`, opt).res,
      "unicorn",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`49 - strips UTF8 BOM`, (t) => {
  mixer().forEach((opt, n) => {
    t.equal(
      det(t, n, `unicorn\uFEFFzzz`, opt).res,
      "unicornzzz",
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

// ==============================
// 05. opts.removeLineBreaks
// ==============================
// see https://en.wikipedia.org/wiki/Newline#Representation

tap.test(
  `50 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - minimal, removeLineBreaks=on`,
  (t) => {
    mixer({
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `a\nb`, opt).res, "a b", JSON.stringify(opt, null, 0));
    });
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - minimal, removeLineBreaks=off`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      replaceLineBreaks: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `a\nb`, opt).res, "a\nb", JSON.stringify(opt, null, 0));
    });
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - Unix style (LF or \\n)`,
  (t) => {
    mixer({
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, opt)
          .res,
        "tralala tralala2 tralala3 tralala4",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - Unix style (LF or \\n)`,
  (t) => {
    mixer({
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, opt)
          .res,
        "tralala tralala2 tralala3&nbsp;tralala4",
        JSON.stringify(opt, null, 0)
      );
    });

    t.equal(
      det1(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, {
        removeLineBreaks: true,
        removeWidows: true,
        convertEntities: true,
        eol: true,
      }).res,
      det1(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, {
        removeLineBreaks: true,
        removeWidows: true,
        convertEntities: true,
        eol: false,
      }).res,
      "53.01"
    );

    t.false(
      det1(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, {
        removeLineBreaks: true,
        removeWidows: true,
        convertEntities: true,
      }).applicableOpts.eol,
      "53.02"
    );

    t.false(
      det1(`\n\n\na\nb\nc\n\n\nd\n\n\n`, {
        removeLineBreaks: true,
        removeWidows: true,
        convertEntities: true,
      }).applicableOpts.replaceLineBreaks,
      "53.03"
    );

    t.false(
      det1(`\n\n\na\nb\nc\n\n\nd\n\n\n`, {
        removeLineBreaks: true,
        removeWidows: true,
        convertEntities: true,
      }).applicableOpts.useXHTML,
      "53.04"
    );

    t.match(
      det1(`\n\n\ntralala\ntralala2\ntralala3\n\n\ntralala4\n\n\n`, {
        removeLineBreaks: true,
        removeWidows: true,
        convertEntities: true,
      }),
      {
        res: "tralala tralala2 tralala3&nbsp;tralala4",
        applicableOpts: {
          fixBrokenEntities: false,
          removeWidows: true,
          convertEntities: true,
          convertDashes: false,
          convertApostrophes: false,
          replaceLineBreaks: false,
          removeLineBreaks: true,
          useXHTML: false,
          dontEncodeNonLatin: false,
          addMissingSpaces: false,
          convertDotsToEllipsis: false,
          stripHtml: false,
          eol: false,
        },
      },
      "53.05"
    );
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - DOS style (CRLF or \\r\\n)`,
  (t) => {
    mixer({
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\r\n\r\n\r\ntralala\r\ntralala2\r\ntralala3\r\n\r\n\r\ntralala4\r\n\r\n\r\n",
          opt
        ).res,
        "tralala tralala2 tralala3 tralala4",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `55 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - DOS style (CRLF or \\r\\n)`,
  (t) => {
    mixer({
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\r\n\r\n\r\ntralala\r\ntralala2\r\ntralala3\r\n\r\n\r\ntralala4\r\n\r\n\r\n",
          opt
        ).res,
        `tralala tralala2 tralala3${rawNbsp}tralala4`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `56 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - clasic Mac OS style (CR or \\r only)`,
  (t) => {
    mixer({
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `\r\r\rtralala\rtralala2\rtralala3\r\r\rtralala4\r\r\r`, opt)
          .res,
        "tralala tralala2 tralala3 tralala4",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `57 - ${`\u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m`} - clasic Mac OS style (CR or \\r only)`,
  (t) => {
    mixer({
      removeLineBreaks: true,
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `\r\r\rtralala\rtralala2\rtralala3\r\r\rtralala4\r\r\r`, opt)
          .res,
        "tralala tralala2 tralala3&nbsp;tralala4",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

// ==============================
// 06. opts.dontEncodeNonLatin
// ==============================

tap.test(
  `58 - ${`\u001b[${36}m${`opts.dontEncodeNonLatin`}\u001b[${39}m`} - doesn't encode non-Latin`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: true,
      dontEncodeNonLatin: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
          opt
        ).res,
        "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
        JSON.stringify(opt, null, 0)
      );
    });

    t.match(
      det1(
        "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
        {
          removeWidows: false,
          dontEncodeNonLatin: true,
        }
      ),
      {
        res:
          "Greek: \u03A1\u03CC\u03B9\u03C3\u03C4\u03BF\u03BD \u03AE\u03C4\u03B1\u03BD \u03B5\u03B4\u03CE / Russian: \u0420\u043E\u0438\u0441\u0442\u043E\u043D / Japanese: \u30ED\u30A4\u30B9\u30C8\u30F3 / Chinese: \u7F85\u4F0A\u65AF\u9813 / Hebrew: \u05E8\u05D5\u05D9\u05E1\u05D8\u05D5\u05DF / Arabic: \u0631\u0648\u064A\u0633\u062A\u0648\u0646",
        applicableOpts: {
          fixBrokenEntities: false,
          removeWidows: true,
          convertEntities: false,
          convertDashes: false,
          convertApostrophes: false,
          replaceLineBreaks: false,
          removeLineBreaks: false,
          useXHTML: false,
          dontEncodeNonLatin: true,
          addMissingSpaces: false,
          convertDotsToEllipsis: false,
          stripHtml: false,
          eol: false,
        },
      },
      "58"
    );

    t.end();
  }
);

// ==============================
// 07. Clearly errors
// ==============================

tap.test(
  `59 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off`,
  (t) => {
    mixer({
      removeWidows: false,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal.<br/>\n<br/>\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `60 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow&nbsp;removal.<br/>\n<br/>\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `61 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        `Very long line, long-enough to trigger widow${rawNbsp}removal.<br/>\n<br/>\nText.`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `62 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeLineBreaks=off`,
  (t) => {
    mixer({
      removeWidows: false,
      replaceLineBreaks: false,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal.\n\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `63 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: false,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow&nbsp;removal.\n\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `64 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      replaceLineBreaks: false,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        `Very long line, long-enough to trigger widow${rawNbsp}removal.\n\nText.`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `65 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, replaceLineBreaks=on`,
  (t) => {
    mixer({
      removeWidows: false,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal.<br>\n<br>\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `66 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, replaceLineBreaks=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow&nbsp;removal.<br>\n<br>\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `67 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, replaceLineBreaks=on, convertEntities=off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        `Very long line, long-enough to trigger widow${rawNbsp}removal.<br>\n<br>\nText.`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `68 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - LF`,
  (t) => {
    mixer({
      removeWidows: false,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a    Very long line, long-enough to trigger widow removal   \n\n. \u000a\n Text text text text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal. Text text text text.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `69 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - CR`,
  (t) => {
    mixer({
      removeWidows: false,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a    Very long line, long-enough to trigger widow removal   \r\r. \u000a\n Text text text text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal. Text text text text.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `70 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - CRLF`,
  (t) => {
    mixer({
      removeWidows: false,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a    Very long line, long-enough to trigger widow removal   \r\n\r\n. \u000a\n Text text text text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal. Text text text text.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `71 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, removeLineBreaks=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a    Very long line, long-enough to trigger widow removal .  \n \n \u000a\n Text text text text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal. Text text text&nbsp;text.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `72 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, convertEntities=off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a   Very long line, long-enough to trigger widow removal .  \n \n  \u000a\n Text text text text . ",
          opt
        ).res,
        `Very long line, long-enough to trigger widow removal. Text text text${rawNbsp}text.`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `73 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`,
  (t) => {
    t.equal(det(t, 0, `a. \na`).res, "a.<br/>\na", "73");
    t.end();
  }
);

tap.test(
  `74 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`,
  (t) => {
    t.equal(det(t, 0, `a . \na`).res, "a.<br/>\na", "74");
    t.end();
  }
);

tap.test(
  `75 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`,
  (t) => {
    t.equal(det(t, 0, `a , \na`).res, "a,<br/>\na", "75");
    t.end();
  }
);

tap.test(
  `76 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - checking line feed being replaced with space`,
  (t) => {
    mixer({
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaaa\u000Abbbbb`, opt).res,
        "aaaa bbbbb",
        JSON.stringify(opt, null, 0)
      );
    });

    t.end();
  }
);

// ==============================
// 08. COPING WITH MULTIPLE ENCODING
// ==============================

tap.test(
  `77 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `&amp;nbsp;`, opt).res,
        `${rawNbsp}`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `78 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `&amp;pound;`, opt).res,
        "£",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `79 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `&amp;amp;amp;amp;pound;`, opt).res,
        "£",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `80 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `&#x26;#xA9;`, opt).res,
        "©",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `81 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a&#x26;#x26;amp;b`, opt).res,
        "a&b",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `82 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`,
  (t) => {
    mixer({
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `&amp;nbsp;`, opt).res,
        "&nbsp;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `83 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`,
  (t) => {
    mixer({
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `&amp;pound;`, opt).res,
        "&pound;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `84 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`,
  (t) => {
    mixer({
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `&amp;amp;amp;amp;pound;`, opt).res,
        "&pound;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `85 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`,
  (t) => {
    mixer({
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `&#x26;#xA9;`, opt).res,
        "&copy;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `86 - ${`\u001b[${33}m${`multiple encoding`}\u001b[${39}m`} - recursive entity de-coding, convertEntities=on`,
  (t) => {
    mixer({
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a&#x26;#x26;amp;b`, opt).res,
        "a&amp;b",
        JSON.stringify(opt, null, 0)
      );
    });

    t.end();
  }
);

// ==============================
// 09. UL/LI TAGS
// ==============================

tap.test(
  `87 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - minimal case`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: false,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, "z <ul><li>y", opt).res,
        "z\ny",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `88 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, removeLineBreaks=on`,
  (t) => {
    mixer({
      removeLineBreaks: true,
      removeWidows: false,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
          opt
        ).res,
        "Text First point Second point Third point Text straight after",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `89 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=off`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: false,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<li>b`, opt).res,
        "a\nb",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `90 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=off`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: false,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
          opt
        ).res,
        "Text\nFirst point\nSecond point\nThird point\nText straight after",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `91 - ${`\u001b[${31}m${`ul/li tags`}\u001b[${39}m`} - adds missing spaces, replaceLineBreaks=on`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: true,
      useXHTML: true,
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
          opt
        ).res,
        "Text<br/>\nFirst point<br/>\nSecond point<br/>\nThird point<br/>\nText straight after",
        JSON.stringify(opt, null, 0)
      );
    });

    t.equal(
      det1(
        "Text <ul><li>First point</li><li>Second point</li><li>Third point</li></ul>Text straight after",
        {
          removeLineBreaks: false,
          removeWidows: false,
          replaceLineBreaks: true,
          useXHTML: true,
          stripHtml: true,
        }
      ).res,
      "Text<br/>\nFirst point<br/>\nSecond point<br/>\nThird point<br/>\nText straight after",
      "91"
    );

    t.end();
  }
);

// ==============================
// 10. AD-HOC
// ==============================

tap.test(
  `92 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `something ----> anything`, opt).res,
        "something ----> anything",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `93 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=on`,
  (t) => {
    mixer({
      convertEntities: true,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `something ----> anything`, opt).res,
        "something ----&gt; anything",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `94 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - improvised arrows are not mangled, convertEntities=off`,
  (t) => {
    mixer({
      convertEntities: false,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `something ---> anything --> everything -> thing`, opt).res,
        "something ---> anything --> everything -> thing",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `95 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - widow removal and single space between ] and (`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaaaaa bbbbbbb [cccccc] (ddddddd)`, opt).res,
        "aaaaaa bbbbbbb [cccccc]&nbsp;(ddddddd)",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `96 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - unlinked .co.uk in the text, removeWidows=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
          opt
        ).res,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `97 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - unlinked .co.uk in the text, removeWidows=off`,
  (t) => {
    mixer({
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
          opt
        ).res,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `98 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - consecutive empty lines full of whitespace symbols`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more visitors.",
          opt
        ).res,
        "Maybe we should register altenative website address, codsen.co.uk. This may or may not lead to more&nbsp;visitors.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `99 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - less than sign`,
  (t) => {
    mixer({
      convertEntities: true,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a < b`, opt).res,
        "a &lt; b",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `100 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - greater than sign`,
  (t) => {
    mixer({
      convertEntities: true,
      removeLineBreaks: true,
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a > b`, opt).res,
        "a &gt; b",
        JSON.stringify(opt, null, 0)
      );
    });

    t.match(
      det1(`a > b`, {
        convertEntities: true,
      }),
      {
        res: "a &gt; b",
        applicableOpts: {
          fixBrokenEntities: false,
          removeWidows: false,
          convertEntities: true,
          convertDashes: false,
          convertApostrophes: false,
          replaceLineBreaks: false,
          removeLineBreaks: false,
          useXHTML: false,
          dontEncodeNonLatin: false,
          addMissingSpaces: false,
          convertDotsToEllipsis: false,
          stripHtml: false,
          eol: false,
        },
      },
      "100"
    );
    t.end();
  }
);

tap.test(
  `101 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, CR requested`,
  (t) => {
    const source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
    const opts = {
      eol: "cr",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
      "101.01 - CR requested"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "101.02");
    t.end();
  }
);

tap.test(
  `102 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, LF requested`,
  (t) => {
    const source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
    const opts = {
      eol: "lf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "102.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "102.02");
    t.end();
  }
);

tap.test(
  `103 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CRLF present, CRLF requested`,
  (t) => {
    const source = `aaa\r\n\r\nbbb\r\n\r\nccc`;
    const opts = {
      eol: "crlf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
      "103.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "103.02");
    t.end();
  }
);

tap.test(
  `104 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, CR requested`,
  (t) => {
    const source = `aaa\n\nbbb\n\nccc`;
    const opts = {
      eol: "cr",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
      "104.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "104.02");
    t.end();
  }
);

tap.test(
  `105 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, LF requested`,
  (t) => {
    const source = `aaa\n\nbbb\n\nccc`;
    const opts = {
      eol: "lf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "105.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "105.02");
    t.end();
  }
);

tap.test(
  `106 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - LF present, CRLF requested`,
  (t) => {
    const source = `aaa\n\nbbb\n\nccc`;
    const opts = {
      eol: "crlf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
      "106.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "106.02");
    t.end();
  }
);

tap.test(
  `107 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, CR requested`,
  (t) => {
    const source = `aaa\r\rbbb\r\rccc`;
    const opts = {
      eol: "cr",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
      "107.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "107.02");
    t.end();
  }
);

tap.test(
  `108 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, LF requested`,
  (t) => {
    const source = `aaa\r\rbbb\r\rccc`;
    const opts = {
      eol: "lf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "108.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "108.02");
    t.end();
  }
);

tap.test(
  `109 - ${`\u001b[${34}m${`ad-hoc`}\u001b[${39}m`} - custom EOL - CR present, CRLF requested`,
  (t) => {
    const source = `aaa\r\rbbb\r\rccc`;
    const opts = {
      eol: "crlf",
    };
    t.equal(
      det(t, 0, source, opts).res,
      "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
      "109.01"
    );
    t.ok(det1(source, opts).applicableOpts.eol, "109.02");
    t.end();
  }
);
