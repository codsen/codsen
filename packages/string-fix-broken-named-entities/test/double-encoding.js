import tap from "tap";
import fix from "./util/util";

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
    const gathered = [];
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "01.01"
    );
    t.strictSame(gathered, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp;`,
  (t) => {
    const gathered = [];
    const inp1 = "&amp; &amp; &amp;";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "02.01"
    );
    t.strictSame(gathered, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`,
  (t) => {
    const gathered = [];
    const inp1 = "&amp;&amp;&amp;";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "03.01"
    );
    t.strictSame(gathered, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`,
  (t) => {
    const gathered = [];
    const inp1 = "abc&amp;&amp;&amp;xyz";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "04.01"
    );
    t.strictSame(gathered, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #1`,
  (t) => {
    const gathered = [];
    const inp1 = "B&amp;Q";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "05.01"
    );
    t.strictSame(gathered, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #2`,
  (t) => {
    const gathered = [];
    const inp1 = "text B&amp;Q text";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "06.01"
    );
    t.strictSame(gathered, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - no cb`,
  (t) => {
    const gathered = [];
    const inp1 = "text&amp;nbsp;text";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 14, "&nbsp;"]],
      "07.01 - double encoded"
    );
    t.strictSame(gathered, [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - with cb`,
  (t) => {
    const gathered = [];
    const inp1 = "text&amp;nbsp;text";
    t.strictSame(
      fix(t, inp1, {
        cb: (received) => {
          t.strictSame(
            received,
            {
              ruleName: "bad-html-entity-multiple-encoding",
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
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 14, "&nbsp;"]],
      "08.01 - double encoded"
    );
    t.strictSame(gathered, [], "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - triple encoded`,
  (t) => {
    const gathered1 = [];
    const inp1 = "text&amp;amp;nbsp;text";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered1.push(idx);
        },
      }),
      [[4, 18, "&nbsp;"]],
      "09.01"
    );
    t.strictSame(gathered1, [], "09.02");

    const gathered2 = [];
    const inp2 = "text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text";
    t.strictSame(
      fix(t, inp2, {
        textAmpersandCatcherCb: (idx) => {
          gathered2.push(idx);
        },
      }),
      [[4, 54, "&nbsp;"]],
      "09.03"
    );
    t.strictSame(gathered2, [], "09.04");

    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand - no cb`,
  (t) => {
    const gathered1 = [];
    const inp1 = "textamp;nbsp;text";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered1.push(idx);
        },
      }),
      [[4, 13, "&nbsp;"]],
      "10.01"
    );
    t.strictSame(gathered1, [], "10.02");

    const gathered2 = [];
    const inp2 = "text amp;nbsp;text";
    t.strictSame(
      fix(t, inp2, {
        textAmpersandCatcherCb: (idx) => {
          gathered2.push(idx);
        },
      }),
      [[5, 14, "&nbsp;"]],
      "10.03"
    );
    t.strictSame(gathered2, [], "10.04");

    const gathered3 = [];
    const inp3 = "text\tamp;nbsp;text";
    t.strictSame(
      fix(t, inp3, {
        textAmpersandCatcherCb: (idx) => {
          gathered3.push(idx);
        },
      }),
      [[5, 14, "&nbsp;"]],
      "10.05"
    );
    t.strictSame(gathered3, [], "10.06");

    const gathered4 = [];
    const inp4 = "text\namp;nbsp;text";
    t.strictSame(
      fix(t, inp4, {
        textAmpersandCatcherCb: (idx) => {
          gathered4.push(idx);
        },
      }),
      [[5, 14, "&nbsp;"]],
      "10.07"
    );
    t.strictSame(gathered4, [], "10.08");

    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand`,
  (t) => {
    const gathered = [];
    const inp1 = "textamp;nbsp;text";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 13, "&nbsp;"]],
      "11.01"
    );
    t.strictSame(gathered, [], "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #1`,
  (t) => {
    const gathered = [];
    const inp1 = "abc &nbs;";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 9, "&nbsp;"]],
      "12.01"
    );
    t.strictSame(gathered, [], "12.02");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #2`,
  (t) => {
    const gathered = [];
    const inp1 = "abc &nbs;";
    t.strictSame(
      fix(t, inp1, {
        cb: (received) => {
          t.strictSame(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 4,
              rangeTo: 9,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-html-entity-malformed-nbsp",
            },
            "15.01"
          );
          return cb(received);
        },
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 9, "&nbsp;"]],
      "13.01"
    );
    t.strictSame(gathered, [], "13.02");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #3`,
  (t) => {
    const gathered = [];
    const inp1 = "abc &nbs; xyz";
    t.strictSame(fix(t, inp1), [[4, 9, "&nbsp;"]], "14.01");
    t.strictSame(
      fix(t, inp1, {
        cb: (received) => {
          t.strictSame(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 4,
              rangeTo: 9,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-html-entity-malformed-nbsp",
            },
            "16.01"
          );
          return cb(received);
        },
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 9, "&nbsp;"]],
      "14.02"
    );
    t.strictSame(gathered, [], "14.03");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #3`,
  (t) => {
    const gathered = [];
    const inp1 = "&nbs; xyz";
    t.strictSame(fix(t, inp1), [[0, 5, "&nbsp;"]], "15.01");
    t.strictSame(
      fix(t, inp1, {
        cb: (received) => {
          t.strictSame(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 0,
              rangeTo: 5,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-html-entity-malformed-nbsp",
            },
            "16.04"
          );
          return cb(received);
        },
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 5, "&nbsp;"]],
      "15.02"
    );
    t.strictSame(gathered, [], "15.03");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #4`,
  (t) => {
    const gathered = [];
    const inp1 = "abc&nbs;";
    t.strictSame(
      fix(t, inp1, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[3, 8, "&nbsp;"]],
      "16.01"
    );
    t.strictSame(gathered, [], "16.02");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #5`,
  (t) => {
    const gathered = [];
    const inp1 = "abc&nbs;";
    t.strictSame(
      fix(t, inp1, {
        cb: (received) => {
          t.strictSame(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 3,
              rangeTo: 8,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-html-entity-malformed-nbsp",
            },
            "18.01"
          );
          return cb(received);
        },
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[3, 8, "&nbsp;"]],
      "17.01"
    );
    t.strictSame(gathered, [], "17.02");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6-1`,
  (t) => {
    const gathered = [];
    const inp1 = "abc&nbs; xyz";
    t.strictSame(fix(t, inp1), [[3, 8, "&nbsp;"]], "18.01");
    t.strictSame(
      fix(t, inp1, {
        cb: (received) => {
          t.strictSame(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 3,
              rangeTo: 8,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-html-entity-malformed-nbsp",
            },
            "19.02"
          );
          return cb(received);
        },
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[3, 8, "&nbsp;"]],
      "18.02"
    );
    t.strictSame(gathered, [], "18.03");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6-2`,
  (t) => {
    const gathered = [];
    const inp1 = "&nbs; xyz";
    t.strictSame(fix(t, inp1), [[0, 5, "&nbsp;"]], "19.01");
    t.strictSame(gathered, [], "19.02");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6-3`,
  (t) => {
    const gathered = [];
    const inp1 = "&nbs; xyz";
    t.strictSame(
      fix(t, inp1, {
        cb: (received) => {
          t.strictSame(
            received,
            {
              entityName: "nbsp",
              rangeFrom: 0,
              rangeTo: 5,
              rangeValDecoded: "\xA0",
              rangeValEncoded: "&nbsp;",
              ruleName: "bad-html-entity-malformed-nbsp",
            },
            "19.05"
          );
          return cb(received);
        },
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 5, "&nbsp;"]],
      "20.01"
    );
    t.strictSame(gathered, [], "20.02");
    t.end();
  }
);
