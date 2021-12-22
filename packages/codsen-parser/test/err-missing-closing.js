import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { cparser } from "../dist/codsen-parser.esm.js";

// 00. no error
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags`, () => {
  let gatheredErr = [];
  cparser(`<div></div>`, {
    errCb: (errObj) => gatheredErr.push(errObj),
  });
  equal(gatheredErr, [], "01");
});

test(`02 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`, () => {
  let gatheredErr = [];
  cparser(`<style>\n\n</style>`, {
    errCb: (errObj) => gatheredErr.push(errObj),
  });
  equal(gatheredErr, [], "02");
});

test(`03 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`, () => {
  let gatheredErr = [];
  cparser(`<div>\n\n</div>`, {
    errCb: (errObj) => gatheredErr.push(errObj),
  });
  equal(gatheredErr, [], "03");
});

// 01. basic
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - first tag is missing closing`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(`<table><tr><td>x</td></tr>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    }),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "tag",
            start: 7,
            end: 11,
            value: "<tr>",
            children: [
              {
                type: "tag",
                start: 11,
                end: 15,
                value: "<td>",
                children: [
                  {
                    type: "text",
                    start: 15,
                    end: 16,
                    value: "x",
                  },
                ],
              },
              {
                type: "tag",
                start: 16,
                end: 21,
                value: "</td>",
              },
            ],
          },
          {
            type: "tag",
            start: 21,
            end: 26,
            value: "</tr>",
          },
        ],
      },
    ],
    "04.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 0,
        idxTo: 7,
      },
    ],
    "04.02"
  );
  is(gatheredErr.length, 1, "04.03");
});

test(`05 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - second tag is missing closing`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(`<table><tr><td>x</td></table>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    }),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "tag",
            start: 7,
            end: 11,
            value: "<tr>",
            children: [
              {
                type: "tag",
                start: 11,
                end: 15,
                value: "<td>",
                children: [
                  {
                    type: "text",
                    start: 15,
                    end: 16,
                    value: "x",
                  },
                ],
              },
              {
                type: "tag",
                start: 16,
                end: 21,
                value: "</td>",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 21,
        end: 29,
        value: "</table>",
      },
    ],
    "05.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 7,
        idxTo: 11,
      },
    ],
    "05.02"
  );
  is(gatheredErr.length, 1, "05.03");
});

test(`06 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - third tag is missing closing`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(`<table><tr><td>x</tr></table>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    }),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "tag",
            start: 7,
            end: 11,
            value: "<tr>",
            children: [
              {
                type: "tag",
                start: 11,
                end: 15,
                value: "<td>",
                children: [
                  {
                    type: "text",
                    start: 15,
                    end: 16,
                    value: "x",
                  },
                ],
              },
            ],
          },
          {
            type: "tag",
            start: 16,
            end: 21,
            value: "</tr>",
          },
        ],
      },
      {
        type: "tag",
        start: 21,
        end: 29,
        value: "</table>",
      },
    ],
    "06.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 11,
        idxTo: 15,
      },
    ],
    "06.02"
  );
  is(gatheredErr.length, 1, "06.03");
});

test(`07 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - text + tag`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(`z <div>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    }),
    [
      {
        type: "text",
        start: 0,
        end: 2,
        value: "z ",
      },
      {
        type: "tag",
        start: 2,
        end: 7,
        value: "<div>",
        tagNameStartsAt: 3,
        tagNameEndsAt: 6,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
        children: [],
      },
    ],
    "07.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 2,
        idxTo: 7,
      },
    ],
    "07.02"
  );
  is(gatheredErr.length, 1, "07.03");
});

test(`08 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - two consecutive tags missing closing counterparts`, () => {
  let gatheredErr = [];
  cparser(
    `<table>
  <tr>
    <td>
      z
</table>`,
    {
      errCb: (errObj) => gatheredErr.push(errObj),
    }
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 19,
        idxTo: 23,
        tokenObj: {
          type: "tag",
          start: 19,
          end: 23,
          value: "<td>",
        },
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 10,
        idxTo: 14,
        tokenObj: {
          type: "tag",
          start: 10,
          end: 14,
          value: "<tr>",
        },
      },
    ],
    "08.01"
  );
  is(gatheredErr.length, 2, "08.02");
});

test(`09 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - two consecutive tags missing closing counterparts`, () => {
  let gatheredErr = [];
  cparser(
    `<table>
  <tr>
    <td>`,
    {
      errCb: (errObj) => gatheredErr.push(errObj),
    }
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 0,
        idxTo: 7,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 10,
        idxTo: 14,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 19,
        idxTo: 23,
      },
    ],
    "09.01"
  );
  is(gatheredErr.length, 3, "09.02");
});

test(`10 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`}`, () => {
  let gatheredErr = [];
  cparser(
    `<table>
  <tr>
    <td>
      z
</table>`,
    {
      errCb: (errObj) => gatheredErr.push(errObj),
    }
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 19,
        idxTo: 23,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 10,
        idxTo: 14,
      },
    ],
    "10.01"
  );
  is(gatheredErr.length, 2, "10.02");
});

test(`11 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - two missing with context`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(
      `<div>
<table>
  <tr>
    <td>
      z
</table>
<table>
  <tr>
    <td>
      z
</table>
</div>`,
      {
        errCb: (errObj) => gatheredErr.push(errObj),
      }
    ),
    [
      {
        type: "tag",
        start: 0,
        end: 5,
        value: "<div>",
        children: [
          {
            type: "text",
            start: 5,
            end: 6,
            value: "\n",
          },
          {
            type: "tag",
            start: 6,
            end: 13,
            value: "<table>",
            children: [
              {
                type: "text",
                start: 13,
                end: 16,
                value: "\n  ",
              },
              {
                type: "tag",
                start: 16,
                end: 20,
                value: "<tr>",
                children: [
                  {
                    type: "text",
                    start: 20,
                    end: 25,
                    value: "\n    ",
                  },
                  {
                    type: "tag",
                    start: 25,
                    end: 29,
                    value: "<td>",
                    children: [
                      {
                        type: "text",
                        start: 29,
                        end: 38,
                        value: "\n      z\n",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "tag",
            start: 38,
            end: 46,
            value: "</table>",
          },
          {
            type: "text",
            start: 46,
            end: 47,
            value: "\n",
          },
          {
            type: "tag",
            start: 47,
            end: 54,
            value: "<table>",
            children: [
              {
                type: "text",
                start: 54,
                end: 57,
                value: "\n  ",
              },
              {
                type: "tag",
                start: 57,
                end: 61,
                value: "<tr>",
                children: [
                  {
                    type: "text",
                    start: 61,
                    end: 66,
                    value: "\n    ",
                  },
                  {
                    type: "tag",
                    start: 66,
                    end: 70,
                    value: "<td>",
                    children: [
                      {
                        type: "text",
                        start: 70,
                        end: 79,
                        value: "\n      z\n",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "tag",
            start: 79,
            end: 87,
            value: "</table>",
          },
          {
            type: "text",
            start: 87,
            end: 88,
            value: "\n",
          },
        ],
      },
      {
        type: "tag",
        start: 88,
        end: 94,
        value: "</div>",
      },
    ],
    "11.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 25,
        idxTo: 29,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 16,
        idxTo: 20,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 66,
        idxTo: 70,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 57,
        idxTo: 61,
      },
    ],
    "11.02"
  );
  is(gatheredErr.length, 4, "11.03");
});

test(`12 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - left slash`, () => {
  let gatheredErr = [];
  cparser(`<td><\\td>`, {
    errCb: (errObj) => gatheredErr.push(errObj),
  });
  // equal(
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 0,
        idxTo: 4,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 4,
        idxTo: 9,
      },
    ],
    "12.01"
  );
  is(gatheredErr.length, 2, "12.02");
});

// 02. false alerts
// -----------------------------------------------------------------------------

test(`13 - ${`\u001b[${33}m${`false alerts`}\u001b[${39}m`} - healthy doctype`, () => {
  let gatheredErr = [];
  cparser(`<!doctype html>`, {
    errCb: (errObj) => gatheredErr.push(errObj),
  });
  equal(gatheredErr, [], "13");
});

test.run();
