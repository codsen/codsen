const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

t.test("01.01 - rogue closing - one tag only", t => {
  const gatheredErr = [];
  t.match(
    cparser("</a>", {
      errCb: errObj => {
        gatheredErr.push(errObj);
      }
    }),
    [
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 0,
        end: 4,
        children: []
      }
    ],
    "01.01.01"
  );
  t.same(
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 0,
        idxTo: 4
      }
    ],
    "01.01.02"
  );
  t.end();
});

t.test("01.02 - rogue closing - previous token is text-type", t => {
  const gatheredErr = [];
  t.match(
    cparser("<br>z</a>", {
      errCb: errObj => {
        gatheredErr.push(errObj);
      }
    }),
    [
      {
        type: "tag",
        tagName: "br",
        closing: false,
        start: 0,
        end: 4,
        children: []
      },
      {
        type: "text",
        start: 4,
        end: 5
      },
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 5,
        end: 9,
        children: []
      }
    ],
    "01.02.01"
  );
  t.same(
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 5,
        idxTo: 9
      }
    ],
    "01.02.02"
  );
  t.end();
});

t.test("01.03 - rogue closing - previous token is tag-type", t => {
  const gatheredErr = [];
  t.match(
    cparser("<br></a>", {
      errCb: errObj => {
        gatheredErr.push(errObj);
      }
    }),
    [
      {
        type: "tag",
        tagName: "br",
        closing: false,
        start: 0,
        end: 4,
        children: []
      },
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 4,
        end: 8,
        children: []
      }
    ],
    "01.03.01"
  );
  t.same(
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 4,
        idxTo: 8
      }
    ],
    "01.03.02"
  );
  t.end();
});
