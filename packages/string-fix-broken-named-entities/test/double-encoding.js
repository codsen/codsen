import tap from "tap";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// helper functions
// -----------------------------------------------------------------------------

function cb(obj) {
  return obj.rangeValEncoded
    ? [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]
    : [obj.rangeFrom, obj.rangeTo];
}

// -----------------------------------------------------------------------------
// 05. multiple encoding
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - no consecutive &amp;`,
  (t) => {
    const inp1 = "&amp;";
    t.same(fix(inp1), [], "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp;`,
  (t) => {
    const inp1 = "&amp; &amp; &amp;";
    t.same(fix(inp1), [], "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`,
  (t) => {
    const inp1 = "&amp;&amp;&amp;";
    t.same(fix(inp1), [], "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`,
  (t) => {
    const inp1 = "abc&amp;&amp;&amp;xyz";
    t.same(fix(inp1), [], "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #1`,
  (t) => {
    const inp1 = "B&amp;Q";
    t.same(fix(inp1), [], "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #2`,
  (t) => {
    const inp1 = "text B&amp;Q text";
    t.same(fix(inp1), [], "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - no cb`,
  (t) => {
    const inp1 = "text&amp;nbsp;text";
    t.same(fix(inp1), [[4, 14, "&nbsp;"]], "07 - double encoded");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - with cb`,
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
            "08.01"
          );

          // same cb() callback as defined at the top of this file:
          return received.rangeValEncoded
            ? [received.rangeFrom, received.rangeTo, received.rangeValEncoded]
            : [received.rangeFrom, received.rangeTo];
        },
      }),
      [[4, 14, "&nbsp;"]],
      "08 - double encoded"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - triple encoded`,
  (t) => {
    const inp1 = "text&amp;amp;nbsp;text";
    t.same(fix(inp1), [[4, 18, "&nbsp;"]], "09.01");

    const inp2 = "text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text";
    t.same(fix(inp2), [[4, 54, "&nbsp;"]], "09.02");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand - no cb`,
  (t) => {
    const inp1 = "textamp;nbsp;text";
    t.same(fix(inp1), [[4, 13, "&nbsp;"]], "10.01");

    const inp2 = "text amp;nbsp;text";
    t.same(fix(inp2), [[5, 14, "&nbsp;"]], "10.02");

    const inp3 = "text\tamp;nbsp;text";
    t.same(fix(inp3), [[5, 14, "&nbsp;"]], "10.03");

    const inp4 = "text\namp;nbsp;text";
    t.same(fix(inp4), [[5, 14, "&nbsp;"]], "10.04");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand`,
  (t) => {
    const inp1 = "textamp;nbsp;text";
    t.same(fix(inp1), [[4, 13, "&nbsp;"]], "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #1`,
  (t) => {
    const inp1 = "abc &nbs;";
    t.same(fix(inp1), [[4, 9, "&nbsp;"]], "12");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #2`,
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
            "15.01"
          );
          return cb(received);
        },
      }),
      [[4, 9, "&nbsp;"]],
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #3`,
  (t) => {
    const inp1 = "abc &nbs; xyz";
    t.same(fix(inp1), [[4, 9, "&nbsp;"]], "14.01");
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
            "16.01"
          );
          return cb(received);
        },
      }),
      [[4, 9, "&nbsp;"]],
      "14.02"
    );

    const inp2 = "&nbs; xyz";
    t.same(fix(inp2), [[0, 5, "&nbsp;"]], "14.03");
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
            "16.04"
          );
          return cb(received);
        },
      }),
      [[0, 5, "&nbsp;"]],
      "14.04"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #4`,
  (t) => {
    const inp1 = "abc&nbs;";
    t.same(fix(inp1), [[3, 8, "&nbsp;"]], "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #5`,
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
            "18.01"
          );
          return cb(received);
        },
      }),
      [[3, 8, "&nbsp;"]],
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6`,
  (t) => {
    const inp1 = "abc&nbs; xyz";
    t.same(fix(inp1), [[3, 8, "&nbsp;"]], "17.01");
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
            "19.02"
          );
          return cb(received);
        },
      }),
      [[3, 8, "&nbsp;"]],
      "17.02"
    );

    const inp2 = "&nbs; xyz";
    t.same(fix(inp2), [[0, 5, "&nbsp;"]], "17.03");
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
            "19.05"
          );
          return cb(received);
        },
      }),
      [[0, 5, "&nbsp;"]],
      "17.04"
    );
    t.end();
  }
);
