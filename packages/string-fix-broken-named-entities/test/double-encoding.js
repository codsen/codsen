import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import fix from "./util/util.js";

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

test(`01 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - no consecutive &amp;`, () => {
  let inp1 = "&amp;";
  let gathered = [];
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "01.01"
  );
  equal(gathered, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp;`, () => {
  let gathered = [];
  let inp1 = "&amp; &amp; &amp;";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "02.01"
  );
  equal(gathered, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`, () => {
  let gathered = [];
  let inp1 = "&amp;&amp;&amp;";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "03.01"
  );
  equal(gathered, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`, () => {
  let gathered = [];
  let inp1 = "abc&amp;&amp;&amp;xyz";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "04.01"
  );
  equal(gathered, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #1`, () => {
  let gathered = [];
  let inp1 = "B&amp;Q";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "05.01"
  );
  equal(gathered, [], "05.02");
});

test(`06 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #2`, () => {
  let gathered = [];
  let inp1 = "text B&amp;Q text";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "06.01"
  );
  equal(gathered, [], "06.02");
});

test(`07 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - no cb`, () => {
  let gathered = [];
  let inp1 = "text&amp;nbsp;text";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[4, 14, "&nbsp;"]],
    "07.01 - double encoded"
  );
  equal(gathered, [], "07.02");
});

test(`08 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - with cb`, () => {
  let gathered = [];
  let inp1 = "text&amp;nbsp;text";
  equal(
    fix(ok, inp1, {
      cb: (received) => {
        equal(
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
  equal(gathered, [], "08.02");
});

test(`09 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - triple encoded`, () => {
  let gathered1 = [];
  let inp1 = "text&amp;amp;nbsp;text";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered1.push(idx);
      },
    }),
    [[4, 18, "&nbsp;"]],
    "09.01"
  );
  equal(gathered1, [], "09.02");

  let gathered2 = [];
  let inp2 = "text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text";
  equal(
    fix(ok, inp2, {
      textAmpersandCatcherCb: (idx) => {
        gathered2.push(idx);
      },
    }),
    [[4, 54, "&nbsp;"]],
    "09.03"
  );
  equal(gathered2, [], "09.04");
});

test(`10 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand - no cb`, () => {
  let gathered1 = [];
  let inp1 = "textamp;nbsp;text";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered1.push(idx);
      },
    }),
    [[4, 13, "&nbsp;"]],
    "10.01"
  );
  equal(gathered1, [], "10.02");

  let gathered2 = [];
  let inp2 = "text amp;nbsp;text";
  equal(
    fix(ok, inp2, {
      textAmpersandCatcherCb: (idx) => {
        gathered2.push(idx);
      },
    }),
    [[5, 14, "&nbsp;"]],
    "10.03"
  );
  equal(gathered2, [], "10.04");

  let gathered3 = [];
  let inp3 = "text\tamp;nbsp;text";
  equal(
    fix(ok, inp3, {
      textAmpersandCatcherCb: (idx) => {
        gathered3.push(idx);
      },
    }),
    [[5, 14, "&nbsp;"]],
    "10.05"
  );
  equal(gathered3, [], "10.06");

  let gathered4 = [];
  let inp4 = "text\namp;nbsp;text";
  equal(
    fix(ok, inp4, {
      textAmpersandCatcherCb: (idx) => {
        gathered4.push(idx);
      },
    }),
    [[5, 14, "&nbsp;"]],
    "10.07"
  );
  equal(gathered4, [], "10.08");
});

test(`11 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand`, () => {
  let gathered = [];
  let inp1 = "textamp;nbsp;text";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[4, 13, "&nbsp;"]],
    "11.01"
  );
  equal(gathered, [], "11.02");
});

test(`12 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #1`, () => {
  let gathered = [];
  let inp1 = "abc &nbs;";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[4, 9, "&nbsp;"]],
    "12.01"
  );
  equal(gathered, [], "12.02");
});

test(`13 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #2`, () => {
  let gathered = [];
  let inp1 = "abc &nbs;";
  equal(
    fix(ok, inp1, {
      cb: (received) => {
        equal(
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
  equal(gathered, [], "13.02");
});

test(`14 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #3`, () => {
  let gathered = [];
  let inp1 = "abc &nbs; xyz";
  equal(fix(ok, inp1), [[4, 9, "&nbsp;"]], "14.01");
  equal(
    fix(ok, inp1, {
      cb: (received) => {
        equal(
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
  equal(gathered, [], "14.03");
});

test(`15 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #3`, () => {
  let gathered = [];
  let inp1 = "&nbs; xyz";
  equal(fix(ok, inp1), [[0, 5, "&nbsp;"]], "15.01");
  equal(
    fix(ok, inp1, {
      cb: (received) => {
        equal(
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
  equal(gathered, [], "15.03");
});

test(`16 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #4`, () => {
  let gathered = [];
  let inp1 = "abc&nbs;";
  equal(
    fix(ok, inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[3, 8, "&nbsp;"]],
    "16.01"
  );
  equal(gathered, [], "16.02");
});

test(`17 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #5`, () => {
  let gathered = [];
  let inp1 = "abc&nbs;";
  equal(
    fix(ok, inp1, {
      cb: (received) => {
        equal(
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
  equal(gathered, [], "17.02");
});

test(`18 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6-1`, () => {
  let gathered = [];
  let inp1 = "abc&nbs; xyz";
  equal(fix(ok, inp1), [[3, 8, "&nbsp;"]], "18.01");
  equal(
    fix(ok, inp1, {
      cb: (received) => {
        equal(
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
  equal(gathered, [], "18.03");
});

test(`19 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6-2`, () => {
  let gathered = [];
  let inp1 = "&nbs; xyz";
  equal(fix(ok, inp1), [[0, 5, "&nbsp;"]], "19.01");
  equal(gathered, [], "19.02");
});

test(`20 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6-3`, () => {
  let gathered = [];
  let inp1 = "&nbs; xyz";
  equal(
    fix(ok, inp1, {
      cb: (received) => {
        equal(
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
  equal(gathered, [], "20.02");
});

test.run();
