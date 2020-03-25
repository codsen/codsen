const t = require("tap");
const fix = require("../dist/string-fix-broken-named-entities.cjs");

// -----------------------------------------------------------------------------
// helper functions
// -----------------------------------------------------------------------------

function cb(obj) {
  return obj.rangeValEncoded
    ? [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]
    : [obj.rangeFrom, obj.rangeTo];
}

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test(
  `01.001 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - 1st input arg is wrong`,
  (t) => {
    t.doesNotThrow(() => {
      fix("");
    });
    const error1 = t.throws(() => {
      fix();
    });
    t.match(error1.message, /THROW_ID_01/);

    const error2 = t.throws(() => {
      fix(true);
    });
    t.match(error2.message, /THROW_ID_01/);

    const error3 = t.throws(() => {
      fix(0);
    });
    t.match(error3.message, /THROW_ID_01/);

    const error4 = t.throws(() => {
      fix(1);
    });
    t.match(error4.message, /THROW_ID_01/);

    const error5 = t.throws(() => {
      fix(null);
    });
    t.match(error5.message, /THROW_ID_01/);
    t.end();
  }
);

t.test(
  `01.002 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - 2nd input arg is wrong`,
  (t) => {
    t.throws(() => {
      fix("aaa", "bbb");
    }, /THROW_ID_02/);

    t.throws(() => {
      fix("aaa", true);
    }, /THROW_ID_02/);

    // does not throw on falsey:
    t.doesNotThrow(() => {
      fix("zzz", {});
    });
    t.doesNotThrow(() => {
      fix("zzz", undefined);
    });
    t.end();
  }
);

t.test(
  `01.003 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.cb is not function`,
  (t) => {
    t.throws(() => {
      fix("aaa", { cb: "bbb" });
    }, /THROW_ID_03/);
    t.end();
  }
);

t.test(
  `01.004 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.progressFn is not function`,
  (t) => {
    t.throws(() => {
      fix("aaa", { progressFn: "bbb" });
    }, /THROW_ID_04/);
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

t.test(
  `03.001 - ${`\u001b[${33}m${`insp`}\u001b[${39}m`} - false positives`,
  (t) => {
    t.same(fix("insp;"), [], "03.001.01");
    t.same(fix("an insp;"), [], "03.001.02");
    t.same(fix("an inspp;"), [], "03.001.03");

    // decode on:
    t.same(fix("insp;", { decode: true }), [], "03.001.04");
    t.same(fix("an insp;", { decode: true }), [], "03.001.05");
    t.same(fix("an inspp;", { decode: true }), [], "03.001.06");
    t.end();
  }
);

t.test(
  `03.002 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - no decode requested`,
  (t) => {
    t.same(fix("&nbsp;"), [], "03.002.01 - one, surrounded by EOL");
    t.same(fix("&nbsp; &nbsp;"), [], "03.002.02 - two, surrounded by EOL");
    t.same(fix("a&nbsp;b"), [], "03.002.03 - surrounded by letters");
    t.end();
  }
);

t.test(
  `03.003 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - default callback, decode`,
  (t) => {
    // controls:
    t.same(fix("&nbsp;"), [], "03.003.01");
    t.same(fix("&nbsp;", { decode: false }), [], "03.003.02");
    t.same(
      fix("&nbsp;", {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "03.003.03"
    );

    // the main check:
    t.same(fix("&nbsp;", { decode: true }), [[0, 6, "\xA0"]], "03.003.04");
    t.end();
  }
);

t.test(
  `03.004 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - full callback, decode`,
  (t) => {
    // same as 03.003 except has a callback to ensure correct rule name is reported
    t.same(
      fix("&nbsp;", {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `encoded-html-entity-nbsp`,
          entityName: "nbsp",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&nbsp;",
          rangeValDecoded: "\xA0",
        },
      ],
      "03.004"
    );
    t.end();
  }
);

t.test(
  `03.005 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - two, surrounded by EOL`,
  (t) => {
    t.same(
      fix("&nbsp; &nbsp;", { decode: true }),
      [
        [0, 6, "\xA0"],
        [7, 13, "\xA0"],
      ],
      "03.005"
    );
    t.end();
  }
);

t.test(
  `03.006 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - surrounded by letters`,
  (t) => {
    t.same(fix("a&nbsp;b", { decode: true }), [[1, 7, "\xA0"]], "03.006");
    t.end();
  }
);

t.test(
  `03.007 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - various - decode off`,
  (t) => {
    t.same(fix("z&hairsp;y"), [], "03.007.01");
    t.same(fix("y&VeryThinSpace;z"), [], "03.007.02");
    t.end();
  }
);

t.test(
  `03.008 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - hairsp - decode on`,
  (t) => {
    t.same(fix("z&hairsp;y", { decode: true }), [[1, 9, "\u200A"]], "03.008");
    t.end();
  }
);

t.test(
  `03.009 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - VeryThinSpace - decode on`,
  (t) => {
    t.same(
      fix("y&VeryThinSpace;z", { decode: true }),
      [[1, 16, "\u200A"]],
      "03.009"
    );
    t.end();
  }
);

t.test(
  `03.010 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - healthy &pound;`,
  (t) => {
    const inp1 = "&pound;";
    t.same(fix(inp1), [], "03.010.01");
    t.same(fix(inp1, { decode: true }), [[0, 7, "\xA3"]], "03.010.02");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 04. other entities
// -----------------------------------------------------------------------------

t.test(
  `04.001 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.same(fix("z &ang; y"), [], "04.001.01");
    t.same(fix("z &angst; y"), [], "04.001.02");

    t.same(fix("z &ang y"), [[2, 6, "&ang;"]], "04.001.03");
    t.same(fix("z &angst y"), [[2, 8, "&angst;"]], "04.001.04");

    t.same(
      fix("x &ang y&ang z"),
      [
        [2, 6, "&ang;"],
        [8, 12, "&ang;"],
      ],
      "04.001.05"
    );
    t.end();
  }
);

t.test(
  `04.002 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&angtext&angtext"),
      [
        [4, 8, "&ang;"],
        [12, 16, "&ang;"],
      ],
      "04.002"
    );
    t.end();
  }
);

t.test(
  `04.003 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&angsttext&angsttext"),
      [
        [4, 10, "&angst;"],
        [14, 20, "&angst;"],
      ],
      "04.003.01 - spaces are obligatory"
    );
    t.same(fix("text&angst"), [[4, 10, "&angst;"]], "04.003.02");
    t.same(
      fix("text&angst text&angst text"),
      [
        [4, 10, "&angst;"],
        [15, 21, "&angst;"],
      ],
      "04.003.03"
    );
    t.end();
  }
);

t.test(
  `04.004 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&pitext&pitext"),
      [],
      "04.004 - won't fix, it's a dubious case"
    );
    t.end();
  }
);

t.test(
  `04.005 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&pivtext&pivtext"),
      [
        [4, 8, "&piv;"],
        [12, 16, "&piv;"],
      ],
      "04.005"
    );
    t.end();
  }
);

t.test(
  `04.006 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&Pitext&Pitext"),
      [],
      "04.006 - also won't fix, it's not conclusive"
    );
    t.end();
  }
);

t.test(
  `04.007 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(fix("text&sigma text&sigma text"), [], "04.007 - not conclusive");
    t.end();
  }
);

t.test(
  `04.008 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(fix("text&sub text&sub text"), [], "04.008");
    t.end();
  }
);

t.test(
  `04.009 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&suptext&suptext"),
      [
        [4, 8, "&sup;"],
        [12, 16, "&sup;"],
      ],
      "04.009"
    );
    t.end();
  }
);

t.test(
  `04.010 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(fix("text&theta text&theta text"), [], "04.010");
    t.end();
  }
);

t.test(
  `04.011 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - no decode, linebreaked`,
  (t) => {
    t.same(
      fix("a &thinsp b\n&thinsp\nc"),
      [
        [2, 9, "&thinsp;"],
        [12, 19, "&thinsp;"],
      ],
      "04.011"
    );
    t.end();
  }
);

t.test(
  `04.012 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(fix("&thinsp"), [[0, 7, "&thinsp;"]], "04.001.12");
    t.same(
      fix("&thinsp&thinsp"),
      [
        [0, 7, "&thinsp;"],
        [7, 14, "&thinsp;"],
      ],
      "04.012 - joins"
    );
    t.end();
  }
);

// with decode

t.test(
  `04.013 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, spaced`,
  (t) => {
    t.same(
      fix("text &ang text&ang text", { decode: true }),
      [
        [5, 9, "\u2220"],
        [14, 18, "\u2220"],
      ],
      "04.013"
    );
    t.end();
  }
);

t.test(
  `04.014 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("text&angtext&angtext", { decode: true }),
      [
        [4, 8, "\u2220"],
        [12, 16, "\u2220"],
      ],
      "04.014"
    );
    t.end();
  }
);

t.test(
  `04.015 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&angst", { decode: true }), [[4, 10, "\xC5"]], "04.015.01");
    t.same(
      fix("text&angst text&angst text", { decode: true }),
      [
        [4, 10, "\xC5"],
        [15, 21, "\xC5"],
      ],
      "04.015.02"
    );
    t.same(
      fix("text&angsttext&angsttext", { decode: true }),
      [
        [4, 10, "\xC5"],
        [14, 20, "\xC5"],
      ],
      "04.015.03"
    );
    t.end();
  }
);

t.test(
  `04.016 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&pi text&pi text", { decode: true }), [], "04.016");
    t.end();
  }
);

t.test(
  `04.017 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("text&pivtext&pivtext", { decode: true }),
      [
        [4, 8, "\u03D6"],
        [12, 16, "\u03D6"],
      ],
      "04.017"
    );
    t.end();
  }
);

t.test(
  `04.018 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&Pi text&Pi text", { decode: true }), [], "04.018");
    t.end();
  }
);

t.test(
  `04.019 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&sigma text&sigma text", { decode: true }), [], "04.019");
    t.end();
  }
);

t.test(
  `04.020 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&sub text&sub text", { decode: true }), [], "04.020");
    t.end();
  }
);

t.test(
  `04.021 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("text&suptext&suptext", { decode: true }),
      [
        [4, 8, "\u2283"],
        [12, 16, "\u2283"],
      ],
      "04.021"
    );
    t.end();
  }
);

t.test(
  `04.022 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&theta text&theta text", { decode: true }), [], "04.022");
    t.end();
  }
);

t.test(
  `04.023 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, line breaked`,
  (t) => {
    t.same(
      fix("a &thinsp b\n&thinsp\nc", { decode: true }),
      [
        [2, 9, "\u2009"],
        [12, 19, "\u2009"],
      ],
      "04.023"
    );
    t.end();
  }
);

t.test(
  `04.024 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, isolated`,
  (t) => {
    t.same(fix("&thinsp", { decode: true }), [[0, 7, "\u2009"]], "04.024");
    t.end();
  }
);

t.test(
  `04.025 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("&thinsp&thinsp", { decode: true }),
      [
        [0, 7, "\u2009"],
        [7, 14, "\u2009"],
      ],
      "04.025.13 - joins"
    );
    t.end();
  }
);

t.test(
  `04.026 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - \u001b[${32}m${`pound`}\u001b[${39}m - in front of semicolon`,
  (t) => {
    t.same(
      fix("&pound1;", { decode: false }),
      [[0, 6, "&pound;"]],
      "04.026.01"
    );
    t.same(fix("&pound1;", { decode: true }), [[0, 6, "\xA3"]], "04.026.02");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 05. multiple encoding
// -----------------------------------------------------------------------------

t.test(
  `05.001 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - no consecutive &amp;`,
  (t) => {
    const inp1 = "&amp;";
    t.same(fix(inp1), [], "05.001");
    t.end();
  }
);

t.test(
  `05.002 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp;`,
  (t) => {
    const inp1 = "&amp; &amp; &amp;";
    t.same(fix(inp1), [], "05.002");
    t.end();
  }
);

t.test(
  `05.003 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`,
  (t) => {
    const inp1 = "&amp;&amp;&amp;";
    t.same(fix(inp1), [], "05.003");
    t.end();
  }
);

t.test(
  `05.004 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`,
  (t) => {
    const inp1 = "abc&amp;&amp;&amp;xyz";
    t.same(fix(inp1), [], "05.004");
    t.end();
  }
);

t.test(
  `05.005 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #1`,
  (t) => {
    const inp1 = "B&amp;Q";
    t.same(fix(inp1), [], "05.005");
    t.end();
  }
);

t.test(
  `05.006 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #2`,
  (t) => {
    const inp1 = "text B&amp;Q text";
    t.same(fix(inp1), [], "05.006");
    t.end();
  }
);

t.test(
  `05.007 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - no cb`,
  (t) => {
    const inp1 = "text&amp;nbsp;text";
    t.same(fix(inp1), [[4, 14, "&nbsp;"]], "05.007 - double encoded");
    t.end();
  }
);

t.test(
  `05.008 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - with cb`,
  (t) => {
    const inp1 = "text&amp;nbsp;text";
    t.same(
      fix(inp1, {
        cb: (received) => {
          t.same(
            received,
            {
              ruleName: "bad-named-html-entity-multiple-encoding",
              entityName: "nbsp",
              rangeFrom: 4,
              rangeTo: 14,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0",
            },
            "05.008.01"
          );

          // same cb() callback as defined at the top of this file:
          return received.rangeValEncoded
            ? [received.rangeFrom, received.rangeTo, received.rangeValEncoded]
            : [received.rangeFrom, received.rangeTo];
        },
      }),
      [[4, 14, "&nbsp;"]],
      "05.008.02 - double encoded"
    );
    t.end();
  }
);

t.test(
  `05.009 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - triple encoded`,
  (t) => {
    const inp1 = "text&amp;amp;nbsp;text";
    t.same(fix(inp1), [[4, 18, "&nbsp;"]], "05.009.01");

    const inp2 = "text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text";
    t.same(fix(inp2), [[4, 54, "&nbsp;"]], "05.009.02");
    t.end();
  }
);

t.test(
  `05.010 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand - no cb`,
  (t) => {
    const inp1 = "textamp;nbsp;text";
    t.same(fix(inp1), [[4, 13, "&nbsp;"]], "05.010.01");

    const inp2 = "text amp;nbsp;text";
    t.same(fix(inp2), [[5, 14, "&nbsp;"]], "05.010.02");

    const inp3 = "text\tamp;nbsp;text";
    t.same(fix(inp3), [[5, 14, "&nbsp;"]], "05.010.03");

    const inp4 = "text\namp;nbsp;text";
    t.same(fix(inp4), [[5, 14, "&nbsp;"]], "05.010.04");
    t.end();
  }
);

t.test(
  `05.011 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand`,
  (t) => {
    const inp1 = "textamp;nbsp;text";
    t.same(fix(inp1), [[4, 13, "&nbsp;"]], "05.011.01");

    const inp2 = "textamp;nsp;text";
    t.same(fix(inp2), [[4, 12, "&nbsp;"]], "05.011.02");
    t.end();
  }
);

t.test(
  `05.012 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - extreme #2`,
  (t) => {
    const inp1 =
      "text    &  a  m p   ; a  mp   ; a m   p   ;    n   s p    ;text";
    t.same(fix(inp1), [[5, 59, "&nbsp;"]], "05.012");
    t.end();
  }
);

t.test(
  `05.013 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - extreme #2 - cb`,
  (t) => {
    const inp1 =
      "text    &  a  m p   ; a  mp   ; a m   p   ;    n   s p    ;text";
    t.same(
      fix(inp1, {
        cb: (received) => {
          t.same(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 5,
              rangeTo: 59,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-named-html-entity-malformed-nbsp",
            },
            "05.013.01"
          );
          return cb(received);
        },
      }),
      [[5, 59, "&nbsp;"]],
      "05.013.02"
    );
    t.end();
  }
);

t.test(
  `05.014 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #1`,
  (t) => {
    const inp1 = "abc &nbs;";
    t.same(fix(inp1), [[4, 9, "&nbsp;"]], "05.014");
    t.end();
  }
);

t.test(
  `05.015 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #2`,
  (t) => {
    const inp1 = "abc &nbs;";
    t.same(
      fix(inp1, {
        cb: (received) => {
          t.same(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 4,
              rangeTo: 9,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-named-html-entity-malformed-nbsp",
            },
            "05.015.01"
          );
          return cb(received);
        },
      }),
      [[4, 9, "&nbsp;"]],
      "05.015.02"
    );
    t.end();
  }
);

t.test(
  `05.016 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #3`,
  (t) => {
    const inp1 = "abc &nbs; xyz";
    t.same(fix(inp1), [[4, 9, "&nbsp;"]], "05.016.01");
    t.same(
      fix(inp1, {
        cb: (received) => {
          t.same(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 4,
              rangeTo: 9,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-named-html-entity-malformed-nbsp",
            },
            "05.016.01"
          );
          return cb(received);
        },
      }),
      [[4, 9, "&nbsp;"]],
      "05.016.02"
    );

    const inp2 = "&nbs; xyz";
    t.same(fix(inp2), [[0, 5, "&nbsp;"]], "05.016.03");
    t.same(
      fix(inp2, {
        cb: (received) => {
          t.same(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 0,
              rangeTo: 5,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-named-html-entity-malformed-nbsp",
            },
            "05.016.04"
          );
          return cb(received);
        },
      }),
      [[0, 5, "&nbsp;"]],
      "05.016.05"
    );
    t.end();
  }
);

t.test(
  `05.017 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #4`,
  (t) => {
    const inp1 = "abc&nbs;";
    t.same(fix(inp1), [[3, 8, "&nbsp;"]], "05.017");
    t.end();
  }
);

t.test(
  `05.018 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #5`,
  (t) => {
    const inp1 = "abc&nbs;";
    t.same(
      fix(inp1, {
        cb: (received) => {
          t.same(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 3,
              rangeTo: 8,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-named-html-entity-malformed-nbsp",
            },
            "05.018.01"
          );
          return cb(received);
        },
      }),
      [[3, 8, "&nbsp;"]],
      "05.018.02"
    );
    t.end();
  }
);

t.test(
  `05.019 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6`,
  (t) => {
    const inp1 = "abc&nbs; xyz";
    t.same(fix(inp1), [[3, 8, "&nbsp;"]], "05.019.01");
    t.same(
      fix(inp1, {
        cb: (received) => {
          t.same(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 3,
              rangeTo: 8,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-named-html-entity-malformed-nbsp",
            },
            "05.019.02"
          );
          return cb(received);
        },
      }),
      [[3, 8, "&nbsp;"]],
      "05.019.03"
    );

    const inp2 = "&nbs; xyz";
    t.same(fix(inp2), [[0, 5, "&nbsp;"]], "05.019.04");
    t.same(
      fix(inp2, {
        cb: (received) => {
          t.same(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 0,
              rangeTo: 5,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-named-html-entity-malformed-nbsp",
            },
            "05.019.05"
          );
          return cb(received);
        },
      }),
      [[0, 5, "&nbsp;"]],
      "05.019.06"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 06. opts.cb
// -----------------------------------------------------------------------------

t.test(
  `06.001 - ${`\u001b[${31}m${`opts.cb`}\u001b[${39}m`} - \u001b[${33}m${`default callback`}\u001b[${39}m mimicking non-cb result`,
  (t) => {
    t.same(
      fix("zzznbsp;zzznbsp;", {
        cb,
      }),
      [
        [3, 8, "&nbsp;"],
        [11, 16, "&nbsp;"],
      ],
      "06.001 - letter + nbsp"
    );
    t.end();
  }
);

t.test(
  `06.002 - ${`\u001b[${31}m${`opts.cb`}\u001b[${39}m`} - \u001b[${33}m${`emlint issue spec`}\u001b[${39}m callback`,
  (t) => {
    t.same(
      fix("zzznbsp;zzznbsp;", {
        cb: (oodles) => {
          // {
          //   ruleName: "missing semicolon on &pi; (don't confuse with &piv;)",
          //   entityName: "pi",
          //   rangeFrom: i,
          //   rangeTo: i + 3,
          //   rangeValEncoded: "&pi;",
          //   rangeValDecoded: "\u03C0"
          // }
          return {
            name: oodles.ruleName,
            position:
              oodles.rangeValEncoded != null
                ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded]
                : [oodles.rangeFrom, oodles.rangeTo],
          };
        },
      }),
      [
        {
          name: "bad-named-html-entity-malformed-nbsp",
          position: [3, 8, "&nbsp;"],
        },
        {
          name: "bad-named-html-entity-malformed-nbsp",
          position: [11, 16, "&nbsp;"],
        },
      ],
      "06.002"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 07. opts.progressFn
// -----------------------------------------------------------------------------

t.test(
  `07.001 - ${`\u001b[${32}m${`opts.progressFn`}\u001b[${39}m`} - reports progress`,
  (t) => {
    t.same(
      fix(
        "text &ang text&ang text text &ang text&ang text text &ang text&ang text"
      ),
      [
        [5, 9, "&ang;"],
        [14, 18, "&ang;"],
        [29, 33, "&ang;"],
        [38, 42, "&ang;"],
        [53, 57, "&ang;"],
        [62, 66, "&ang;"],
      ],
      "07.001.01 - baseline"
    );

    let count = 0;
    t.same(
      fix(
        "text &ang text&ang text text &ang text&ang text text &ang text&ang text",
        {
          progressFn: (percentageDone) => {
            // console.log(`percentageDone = ${percentageDone}`);
            t.ok(typeof percentageDone === "number");
            count++;
          },
        }
      ),
      [
        [5, 9, "&ang;"],
        [14, 18, "&ang;"],
        [29, 33, "&ang;"],
        [38, 42, "&ang;"],
        [53, 57, "&ang;"],
        [62, 66, "&ang;"],
      ],
      "07.001.02 - calls the progress function"
    );
    t.ok(typeof count === "number" && count <= 101 && count > 0, "07.001.03");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 08. ampersand missing
// -----------------------------------------------------------------------------

t.test(
  `08.001 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - \u001b[${32}m${`acute`}\u001b[${39}m vs \u001b[${32}m${`aacute`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.same(fix("z &aacute; y"), [], "08.001.01");
    t.same(fix("z &acute; y"), [], "08.001.02");
    t.end();
  }
);

t.test(
  `08.002 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - \u001b[${32}m${`acute`}\u001b[${39}m vs \u001b[${32}m${`aacute`}\u001b[${39}m - legit word same as entity name, ending with semicol`,
  (t) => {
    t.same(
      fix("Diagnosis can be acute; it is up to a doctor to"),
      [],
      "08.002"
    );
    t.end();
  }
);

t.test(
  `08.003 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - minimal isolated, named, rarrpl`,
  (t) => {
    const inp1 = "rarrpl;";
    const outp1 = [[0, 7, "&rarrpl;"]];
    t.same(fix(inp1), outp1, "08.003.01");
    t.same(fix(inp1, { cb }), outp1, "08.003.02");
    t.end();
  }
);

t.test(
  `08.004 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - &block; vs. display:block`,
  (t) => {
    const inp1 = `<img src=abc.jpg width=123 height=456 border=0 style=display:block; alt=xyz/>`;
    t.same(fix(inp1), [], "08.004");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 09. spaces within entities
// -----------------------------------------------------------------------------

t.test(
  `09.001 - ${`\u001b[${35}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space after ampersand`,
  (t) => {
    const inp5 = "& nbsp;";
    const outp5 = [
      {
        ruleName: "bad-named-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 0,
        rangeTo: 7,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\xA0",
      },
    ];
    t.same(fix(inp5, { cb: (obj) => obj }), outp5, "09.001.01");
    t.end();
  }
);

t.test(
  `09.002 - ${`\u001b[${35}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space before semicolon`,
  (t) => {
    const inp5 = "&nbsp ;";
    const outp5 = [
      {
        ruleName: "bad-named-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 0,
        rangeTo: 7,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\xA0",
      },
    ];
    t.same(fix(inp5, { cb: (obj) => obj }), outp5, "09.002.01");
    t.end();
  }
);

t.test(
  `09.003 - ${`\u001b[${35}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space before and after semicolon`,
  (t) => {
    const inp5 = "& nbsp ;";
    const outp5 = [
      {
        ruleName: "bad-named-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 0,
        rangeTo: 8,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\xA0",
      },
    ];
    t.same(fix(inp5, { cb: (obj) => obj }), outp5, "09.003.01");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 10. not broken HTML entities: unrecognised or recognised and correct
// -----------------------------------------------------------------------------

t.test(
  `10.001 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`unrecognised`}\u001b[${39}m - one`,
  (t) => {
    const inp1 = "abc &x  y z; def";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 4,
          rangeTo: 12,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "10.001"
    );
    t.end();
  }
);

t.test(
  `10.002 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - recognised broken entity`,
  (t) => {
    const inp1 = "abc &poumd; def";
    const outp1 = [[4, 11, "&pound;"]];
    t.same(fix(inp1), outp1, "10.002.01");
    t.same(fix(inp1, { cb }), outp1, "10.002.02");
    t.end();
  }
);

t.test(
  `10.003 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - recognised broken entity, cb() separately`,
  (t) => {
    const inp1 = "abc &p oumd; def";
    // const outp1 = [[4, 12, "&pound;"]];
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 4,
          rangeTo: 12,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "10.003"
    );
    t.end();
  }
);

t.test(
  `10.004 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entity but with whitespace`,
  (t) => {
    const inp1 = "abc &p ou\nnd; def";
    const outp1 = [[4, 13, "&pound;"]];
    t.same(fix(inp1), outp1, "10.004.01");
    t.same(fix(inp1, { cb }), outp1, "10.004.02");
    t.end();
  }
);

t.test(
  `10.005 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entity but with capital letter`,
  (t) => {
    const inp1 = "x &Pound; y";
    const outp1 = [[2, 9, "&pound;"]];
    t.same(fix(inp1), outp1, "10.005.01");
    t.same(fix(inp1, { cb }), outp1, "10.005.02");
    t.end();
  }
);

t.test(
  `10.006 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit healthy entity should not raise any issues`,
  (t) => {
    const inp1 = "abc &pound; def";
    t.same(fix(inp1), [], "10.006.01");
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [],
      "10.006"
    );
    t.end();
  }
);

t.test(
  `10.007 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - combo of a sneaky legit semicolon and missing semicolon on entity`,
  (t) => {
    const inp1 = "x &Pound2; y";
    // const outp1 = [[2, 8, "&pound;"]];
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 2,
          rangeTo: 8,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "10.007"
    );
    t.end();
  }
);

t.test(
  `10.008 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - combo of a sneaky legit semicolon and missing semicolon on entity`,
  (t) => {
    const inp1 = "a&poUnd;b";
    const outp1 = [[1, 8, "&pound;"]];
    t.same(fix(inp1), outp1, "10.008");
    t.end();
  }
);

t.test(
  `10.009 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - only first two characters match legit entity`,
  (t) => {
    const inp1 = "abc &pozzz; def";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 4,
          rangeTo: 11,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "10.009"
    );
    t.end();
  }
);

t.test(
  `10.010 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - case issues`,
  (t) => {
    const inp1 = "&Poun;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "10.010"
    );
    t.end();
  }
);

t.test(
  `10.011 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - space before semicolon`,
  (t) => {
    const oneOfBrokenEntities = "a&pound ;b";
    t.same(
      fix(oneOfBrokenEntities, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-pound`,
          entityName: "pound",
          rangeFrom: 1,
          rangeTo: 9,
          rangeValEncoded: "&pound;",
          rangeValDecoded: "\xA3", // <= pound symbol
        },
      ],
      "10.011"
    );
    t.end();
  }
);

t.test(
  `10.012 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - twoheadrightarrow wrong case only`,
  (t) => {
    const inp1 = "a&twoheadRightarrow;b";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-twoheadrightarrow`,
          entityName: "twoheadrightarrow",
          rangeFrom: 1,
          rangeTo: 20,
          rangeValEncoded: "&twoheadrightarrow;",
          rangeValDecoded: "\u21A0",
        },
      ],
      "10.012"
    );
    t.end();
  }
);

t.test(
  `10.013 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entities with capital letter and known existing alternative with all lowercase`,
  (t) => {
    const inp1 = "x&A lpha;y";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-Alpha`,
          entityName: "Alpha",
          rangeFrom: 1,
          rangeTo: 9,
          rangeValEncoded: "&Alpha;",
          rangeValDecoded: "\u0391",
        },
      ],
      "10.013"
    );
    t.end();
  }
);

t.test(
  `10.014 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &ac d;`,
  (t) => {
    const inp1 = "&ac d;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-acd`,
          entityName: "acd",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&acd;",
          rangeValDecoded: "\u223F",
        },
      ],
      "10.014"
    );
    t.end();
  }
);

t.test(
  `10.015 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Acd;`,
  (t) => {
    const inp1 = "&Acd;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-acd`,
          entityName: "acd",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&acd;",
          rangeValDecoded: "\u223F",
        },
      ],
      "10.015"
    );
    t.end();
  }
);

t.test(
  `10.016 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Aelig; - ambiguous case`,
  (t) => {
    const inp1 = "&Aelig;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-unrecognised`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "10.016"
    );
    t.end();
  }
);

t.test(
  `10.017 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &zwjn; - known broken entities come before regular checks where semicol might be missing`,
  (t) => {
    const inp1 = "&zwjn;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-named-html-entity-malformed-zwnj`,
          entityName: "zwnj",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&zwnj;",
          rangeValDecoded: "\u200C",
        },
      ],
      "10.017"
    );
    t.end();
  }
);

t.test(
  `10.018 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`,
  (t) => {
    const inp1 = "&xcap;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [],
      "10.018.01"
    );
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
        decode: true,
      }),
      [
        {
          ruleName: `encoded-html-entity-xcap`,
          entityName: "xcap",
          rangeFrom: 0,
          rangeTo: inp1.length,
          rangeValEncoded: "&xcap;",
          rangeValDecoded: "\u22C2",
        },
      ],
      "10.018.02"
    );
    t.end();
  }
);

t.test(
  `10.019 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 1`,
  (t) => {
    const inp1 = "&nbsp;&nbsp;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      []
    );
    t.end();
  }
);

t.test(
  `10.020 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 2`,
  (t) => {
    const inputs = [
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
      "&nbsp; &nbsp; &nbsp; a &nbsp; &nbsp; &nbsp;",
      " &nbsp; &nbsp; &nbsp; a &nbsp; &nbsp; &nbsp; ",
      "&nbsp;a&nbsp;a&nbsp; a &nbsp;a&nbsp;a&nbsp;",
      "&nbsp;\n&nbsp;\n&nbsp;\n\na\n&nbsp;\n&nbsp;\n&nbsp;",
      "&nbsp;\r\n&nbsp;\r\n&nbsp;\r\n\r\na\r\n&nbsp;\r\n&nbsp;\r\n&nbsp;",
      "&nbsp;\r&nbsp;\r&nbsp;\r\ra\r&nbsp;\r&nbsp;\r&nbsp;",
      "&nbsp;\t&nbsp;\t&nbsp;\t\ta\t&nbsp;\t&nbsp;\t&nbsp;",
      "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
    ];
    inputs.forEach((input, i) => t.same(fix(input), [], `"${input}" - ${i}`));
    t.end();
  }
);

t.test(
  `10.021 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 3`,
  (t) => {
    const inp1 = "&NBSP;&NBSP;";
    t.same(fix(inp1), [
      [0, 6, "&nbsp;"],
      [6, 12, "&nbsp;"],
    ]);
    t.end();
  }
);

t.test(
  `10.022 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 4`,
  (t) => {
    const inp1 = "&NBSP;&NBSP;&NBSP; a &NBSP;&NBSP;&NBSP;";
    t.same(fix(inp1), [
      [0, 6, "&nbsp;"],
      [6, 12, "&nbsp;"],
      [12, 18, "&nbsp;"],
      [21, 27, "&nbsp;"],
      [27, 33, "&nbsp;"],
      [33, 39, "&nbsp;"],
    ]);
    t.end();
  }
);

t.test(
  `10.023 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 5`,
  (t) => {
    const inp1 = "&nbsp;&nbsp;&bsp; a &nbsp;&nnbsp;&nbsp;";
    t.same(fix(inp1), [
      [12, 17, "&nbsp;"],
      [26, 33, "&nbsp;"],
    ]);
    t.end();
  }
);

t.test(
  `10.024 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 6`,
  (t) => {
    const inp1 = "&nbsp;&bsp;&nnbsp; a &nbsp;&nnbsp;&nnbsp;";
    t.same(fix(inp1), [
      [6, 11, "&nbsp;"],
      [11, 18, "&nbsp;"],
      [27, 34, "&nbsp;"],
      [34, 41, "&nbsp;"],
    ]);
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 11. numeric entities
// -----------------------------------------------------------------------------

// decode on

t.test(
  `11.001 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode within ASCII range - A`,
  (t) => {
    const inp1 = "&#65;";
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `encoded-numeric-html-entity-reference`,
          entityName: "#65",
          rangeFrom: 0,
          rangeTo: 5,
          rangeValEncoded: "&#65;",
          rangeValDecoded: "A",
        },
      ],
      "11.001"
    );
    t.end();
  }
);

t.test(
  `11.002 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`,
  (t) => {
    const inp1 = "&#163;";
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `encoded-numeric-html-entity-reference`,
          entityName: "#163",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&#163;",
          rangeValDecoded: "\xA3",
        },
      ],
      "11.002"
    );
    t.end();
  }
);

t.test(
  `11.003 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - non-existing number`,
  (t) => {
    const inp1 = "&#99999999999999999;";
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 20,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.003"
    );
    t.end();
  }
);

// decode off

t.test(
  `11.004 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, within ASCII range - A`,
  (t) => {
    const inp1 = "&#65;";
    t.same(
      fix(inp1, {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "11.004"
    );
    t.end();
  }
);

t.test(
  `11.005 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - pound`,
  (t) => {
    const inp1 = "&#163;";
    t.same(
      fix(inp1, {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "11.005"
    );
    t.end();
  }
);

t.test(
  `11.006 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - non-existing number`,
  (t) => {
    const inp1 = "&#99999999999999999;";
    t.same(
      fix(inp1, {
        decode: false,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 20,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.006"
    );
    t.end();
  }
);

t.test(
  `11.007 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - dollar instead of hash`,
  (t) => {
    const inp1 = "&$65;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 5,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.007"
    );
    t.end();
  }
);

t.test(
  `11.008 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decoding text with healthy numeric entities`,
  (t) => {
    const inp1 = "something here &#163;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
        decode: false,
      }),
      [],
      "11.008.001"
    );
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
        decode: true,
      }),
      [
        {
          ruleName: `encoded-numeric-html-entity-reference`,
          entityName: "#163",
          rangeFrom: 15,
          rangeTo: 21,
          rangeValEncoded: "&#163;",
          rangeValDecoded: "\xA3",
        },
      ],
      "11.008.002"
    );
    t.same(fix(inp1, { decode: true }), [[15, 21, "\xA3"]], "11.008.03");
    t.end();
  }
);

t.test(
  `11.009 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`,
  (t) => {
    const inp1 = "&#xA3;";
    t.same(fix(inp1, { decode: true }), [[0, 6, "\xA3"]], "11.009.01");
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `encoded-numeric-html-entity-reference`,
          entityName: "#xA3",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: inp1,
          rangeValDecoded: "\xA3",
        },
      ],
      "11.009.02"
    );
    t.end();
  }
);

t.test(
  `11.010 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, no decode - pound`,
  (t) => {
    const inp1 = "&x#A3;";
    t.same(
      fix(inp1, {
        decode: false,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.010"
    );
    t.end();
  }
);

t.test(
  `11.011 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, with decode - pound`,
  (t) => {
    const inp1 = "&x#A3;";
    t.same(fix(inp1, { decode: true }), [[0, 6]], "11.011.01");
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.011.02"
    );
    t.end();
  }
);

t.test(
  `11.012 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - &#x pattern with hash missing`,
  (t) => {
    const inp1 = "&x1000;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 7,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.012"
    );
    t.end();
  }
);

t.test(
  `11.013 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - missing ampersand`,
  (t) => {
    const inp1 = "abc#x26;def";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 3,
          rangeTo: 8,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.013"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 12. False positives
// -----------------------------------------------------------------------------

t.test(
  `12.001 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - legit pound, no decode`,
  (t) => {
    const inp1 = "one pound;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
        decode: false,
      }),
      [],
      "12.001"
    );
    t.end();
  }
);

t.test(
  `12.002 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - legit pound, no decode`,
  (t) => {
    const inp1 = "one pound;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
        decode: true,
      }),
      [],
      "12.002"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 13. opts.entityCatcherCb - all entities callback
// -----------------------------------------------------------------------------

//
//
//
//
//
//                                 &nbsp;
//
//
//
//
//

t.test(
  `13.001 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &nbsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { name } = obj;
        gatheredBroken.push(name);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.same(gatheredHealthy, [[2, 8]], "13.001.01");
    t.same(gatheredBroken, [], "13.001.02");
    t.end();
  }
);

t.test(
  `13.002 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &nbsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.same(gatheredHealthy, [[2, 8]], "13.002.01");
    t.same(gatheredBroken, [], "13.002.02");
    t.end();
  }
);

t.test(
  `13.003 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &nbsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.same(gatheredHealthy, [], "13.003.01");
    t.same(gatheredBroken, ["encoded-html-entity-nbsp"], "13.003.02");
    t.end();
  }
);

t.test(
  `13.004 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &nbsp; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.same(gatheredHealthy, [], "13.004.01"); // <- because it's encoded and user asked unencoded
    t.end();
  }
);

t.test(
  `13.005 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - only healthy entities are pinged to entityCatcherCb`,
  (t) => {
    const inp1 = "y &nbsp; z &nsp;";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    });
    t.same(gatheredHealthy, [[2, 8]], "13.005.01");
    t.same(
      gatheredBroken,
      ["bad-named-html-entity-malformed-nbsp"],
      "13.005.02"
    );
    t.end();
  }
);

//
//
//
//
//
//                               &isindot;
//
//
//
//
//

t.test(
  `13.005 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &isindot; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.same(gatheredEntityRanges, [[2, 11]], "13.005");
    t.end();
  }
);

t.test(
  `13.006 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &isindot; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.same(gatheredEntityRanges, [[2, 11]], "13.006");
    t.end();
  }
);

t.test(
  `13.007 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &isindot; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.same(gatheredEntityRanges, [[2, 11]], "13.007");
    t.end();
  }
);

t.test(
  `13.008 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &isindot; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.same(gatheredEntityRanges, [[2, 11]], "13.008");
    t.end();
  }
);

//
//
//
//
//
//                          &nsp; (broken &nbsp;)
//
//
//
//
//

t.test(
  `13.009 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &nsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.same(
      gatheredBroken,
      ["bad-named-html-entity-malformed-nbsp"],
      "13.009.01"
    );
    t.same(gatheredHealthy, [], "13.009.02");
    t.end();
  }
);

t.test(
  `13.010 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &nsp; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.same(gatheredHealthy, [], "13.010.02");
    t.end();
  }
);

t.test(
  `13.011 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &nsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.same(
      gatheredBroken,
      ["bad-named-html-entity-malformed-nbsp"],
      "13.011.01"
    );
    t.same(gatheredHealthy, [], "13.011.02");
    t.end();
  }
);

t.test(
  `13.012 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &nsp; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.same(gatheredHealthy, [], "13.012.02");
    t.end();
  }
);

//
//
//
//
//
//                               &abcdefg;
//
//
//
//
//

t.test(
  `13.013 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &abcdefg; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.same(gatheredBroken, ["bad-named-html-entity-unrecognised"], "13.013.01");
    t.same(gatheredHealthy, [], "13.013.02");
    t.end();
  }
);

t.test(
  `13.014 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &abcdefg; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.same(gatheredHealthy, [], "13.014");
    t.end();
  }
);

t.test(
  `13.015 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &abcdefg; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.same(gatheredBroken, ["bad-named-html-entity-unrecognised"], "13.015.01");
    t.same(gatheredHealthy, [], "13.015.02");
    t.end();
  }
);

t.test(
  `13.016 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &abcdefg; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.same(gatheredHealthy, [], "13.016");
    t.end();
  }
);

//
//
//
//
//
//                           decimal numeric &#65;
//
//
//
//
//

t.test(
  `13.017 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &#65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.same(gatheredEntityRanges, [[2, 7]], "13.017");
    t.end();
  }
);

t.test(
  `13.018 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &#65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.same(gatheredEntityRanges, [[2, 7]], "13.018");
    t.end();
  }
);

t.test(
  `13.019 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &#65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.same(gatheredEntityRanges, [[2, 7]], "13.019");
    t.end();
  }
);

t.test(
  `13.020 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &#65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.same(gatheredEntityRanges, [[2, 7]], "13.020");
    t.end();
  }
);

//
//
//
//
//
//                           more ad hoc tests
//
//
//
//
//

t.test(
  `13.021 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one broken decimal numeric entity`,
  (t) => {
    const inp1 = "y &65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.same(gatheredEntityRanges, [[2, 6]], "13.021");
    t.end();
  }
);

t.test(
  `13.022 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one broken decimal numeric entity`,
  (t) => {
    const inp1 = "y &#99999999999999999999; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.same(gatheredEntityRanges, [[2, 25]], "13.022");
    t.end();
  }
);

//
//
//
//
//
//                         hexidecimal numeric &x#A3;
//
//
//
//
//

t.test(
  `13.021 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &x#A3; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.same(gatheredEntityRanges, [[2, 8]], "13.021");
    t.end();
  }
);

t.test(
  `13.022 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &x#A3; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.same(gatheredEntityRanges, [[2, 8]], "13.022");
    t.end();
  }
);

t.test(
  `13.023 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &x#A3; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.same(gatheredEntityRanges, [[2, 8]], "13.023");
    t.end();
  }
);

t.test(
  `13.024 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &x#A3; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.same(gatheredEntityRanges, [[2, 8]], "13.024");
    t.end();
  }
);

// -----------------------------------------------------------------------------

// TODO:

// 1. Tend all commonly typed and mis-typed entities:
// aacute
// eacute
// zwnj

// 2. Challenge: an entity which is messed up, actually can't be used in named
// form at all and its numeric variant should be used instead. Does this library
// allow to override the result being written? (cb() probably does already).

// 3. Add automated unit test to check all named html entities, without amp
// and also test to check all without without semicolon.

// 4. Consider adding a new array of all entities which are definitely not part
// of any normal content. For example, "CapitalDifferentialD".
// Those should be patched up more aggresively.
// And on the opposite - dubious entities like "block;" can be part of legit text.
