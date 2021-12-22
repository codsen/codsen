import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { cparser } from "../dist/codsen-parser.esm.js";

// 01. simple cases
// -----------------------------------------------------------------------------

test.skip(`01 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - one tag only`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("</a>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 0,
        end: 4,
        children: [],
      },
    ],
    "01.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 0,
        idxTo: 4,
      },
    ],
    "01.02"
  );
  is(gatheredErr.length, 1, "01.03");
});

test.skip(`02 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - previous token is text-type`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<br>z</a>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "br",
        closing: false,
        start: 0,
        end: 4,
        children: [],
      },
      {
        type: "text",
        start: 4,
        end: 5,
      },
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 5,
        end: 9,
        children: [],
      },
    ],
    "02.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 5,
        idxTo: 9,
      },
    ],
    "02.02"
  );
  is(gatheredErr.length, 1, "02.03");
});

test.skip(`03 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - previous token is tag-type`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<br></a>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "br",
        closing: false,
        start: 0,
        end: 4,
        children: [],
      },
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 4,
        end: 8,
        children: [],
      },
    ],
    "03.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 4,
        idxTo: 8,
      },
    ],
    "03.02"
  );
  is(gatheredErr.length, 1, "03.03");
});

// 02. all variations of a rogue tag, placed in other tag's formation
// -----------------------------------------------------------------------------

test.skip(`04 - rogue tag in place of another tag - opening`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table><tr><td>x</td><a></table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
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
              {
                type: "tag",
                start: 21,
                end: 24,
                value: "<a>",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 24,
        end: 32,
        value: "</table>",
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
        idxFrom: 21,
        idxTo: 24,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 7,
        idxTo: 11,
      },
    ],
    "04.02"
  );
  is(gatheredErr.length, 2, "04.03");
});

test.skip(`05 - rogue tag in place of another tag - opening, with spaces`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table> <tr> <td> x </td> <a> </table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "text",
            start: 7,
            end: 8,
            value: " ",
          },
          {
            type: "tag",
            start: 8,
            end: 12,
            value: "<tr>",
            children: [
              {
                type: "text",
                start: 12,
                end: 13,
                value: " ",
              },
              {
                type: "tag",
                start: 13,
                end: 17,
                value: "<td>",
                children: [
                  {
                    type: "text",
                    start: 17,
                    end: 20,
                    value: " x ",
                  },
                ],
              },
              {
                type: "tag",
                start: 20,
                end: 25,
                value: "</td>",
              },
              {
                type: "text",
                start: 25,
                end: 26,
                value: " ",
              },
              {
                type: "tag",
                start: 26,
                end: 29,
                value: "<a>",
              },
              {
                type: "text",
                start: 29,
                end: 30,
                value: " ",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 30,
        end: 38,
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
        idxFrom: 26,
        idxTo: 29,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 8,
        idxTo: 12,
      },
    ],
    "05.02"
  );
  is(gatheredErr.length, 2, "05.03");
});

test.skip(`06 - rogue tag in place of another tag - closing`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table><tr><td>x</td></a></table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
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
            end: 25,
            value: "</a>",
          },
        ],
      },
      {
        type: "tag",
        start: 25,
        end: 33,
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
        ruleId: "tag-missing-opening",
        idxFrom: 21,
        idxTo: 25,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 7,
        idxTo: 11,
      },
    ],
    "06.02"
  );
  is(gatheredErr.length, 2, "06.03");
});

test.skip(`07 - rogue tag in place of another tag - closing, with spaces`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table> <tr> <td> x </td> </a> </table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "text",
            start: 7,
            end: 8,
            value: " ",
          },
          {
            type: "tag",
            start: 8,
            end: 12,
            value: "<tr>",
            children: [
              {
                type: "text",
                start: 12,
                end: 13,
                value: " ",
              },
              {
                type: "tag",
                start: 13,
                end: 17,
                value: "<td>",
                children: [
                  {
                    type: "text",
                    start: 17,
                    end: 20,
                    value: " x ",
                  },
                ],
              },
              {
                type: "tag",
                start: 20,
                end: 25,
                value: "</td>",
              },
              {
                type: "text",
                start: 25,
                end: 26,
                value: " ",
              },
            ],
          },
          {
            type: "tag",
            start: 26,
            end: 30,
            value: "</a>",
          },
          {
            type: "text",
            start: 30,
            end: 31,
            value: " ",
          },
        ],
      },
      {
        type: "tag",
        start: 31,
        end: 39,
        value: "</table>",
      },
    ],
    "07.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 26,
        idxTo: 30,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 8,
        idxTo: 12,
      },
    ],
    "07.02"
  );
  is(gatheredErr.length, 2, "07.03");
});

test.skip(`08 - rogue tag in place of another tag - void`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table><tr><td>x</td><br/></table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
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
              {
                type: "tag",
                start: 21,
                end: 26,
                value: "<br/>",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 26,
        end: 34,
        value: "</table>",
      },
    ],
    "08.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 7,
        idxTo: 11,
        tokenObj: {
          type: "tag",
          start: 7,
          end: 11,
          value: "<tr>",
        },
      },
    ],
    "08.02"
  );
  is(gatheredErr.length, 1, "08.03");
});

test.skip(`09 - rogue tag in place of another tag - void`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table><tr><td>x</td><br/></table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
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
              {
                type: "tag",
                start: 21,
                end: 26,
                value: "<br/>",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 26,
        end: 34,
        value: "</table>",
      },
    ],
    "09.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 7,
        idxTo: 11,
        tokenObj: {
          type: "tag",
          start: 7,
          end: 11,
          value: "<tr>",
        },
      },
    ],
    "09.02"
  );
  is(gatheredErr.length, 1, "09.03");
});

test.skip(`10 - rogue tag in place of another tag - void, legit`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<div><div><div>x</div><br/></div>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        start: 0,
        end: 5,
        value: "<div>",
        children: [
          {
            type: "tag",
            start: 5,
            end: 10,
            value: "<div>",
            children: [
              {
                type: "tag",
                start: 10,
                end: 15,
                value: "<div>",
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
                end: 22,
                value: "</div>",
              },
              {
                type: "tag",
                start: 22,
                end: 27,
                value: "<br/>",
              },
            ],
          },
          // notice how the pairing is done hungrily - this div could close
          // parent too but if it can fit this early, it's placed asap:
          {
            type: "tag",
            start: 27,
            end: 33,
            value: "</div>",
          },
        ],
      },
    ],
    "10.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 0,
        idxTo: 5,
        tokenObj: {
          value: "<div>",
        },
      },
    ],
    "10.02"
  );
  is(gatheredErr.length, 1, "10.03");
});

test.skip(`11 - rogue tag in place of another tag - text`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table><tr><td>x</td>z</table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
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
              {
                type: "text",
                start: 21,
                end: 22,
                value: "z",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 22,
        end: 30,
        value: "</table>",
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
        idxFrom: 7,
        idxTo: 11,
        tokenObj: {
          value: "<tr>",
        },
      },
    ],
    "11.02"
  );
  is(gatheredErr.length, 1, "11.03");
});

test.skip(`12 - rogue tag in place of another tag - opening - with whitespace`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(
      `<table>
  <tr>
    <td>
      x
    </td>
    <a>
</table>`,
      {
        errCb: (errObj) => {
          gatheredErr.push(errObj);
        },
      }
    ),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "text",
            start: 7,
            end: 10,
            value: "\n  ",
          },
          {
            type: "tag",
            start: 10,
            end: 14,
            value: "<tr>",
            children: [
              {
                type: "text",
                start: 14,
                end: 19,
                value: "\n    ",
              },
              {
                type: "tag",
                start: 19,
                end: 23,
                value: "<td>",
                children: [
                  {
                    type: "text",
                    start: 23,
                    end: 36,
                    value: "\n      x\n    ",
                  },
                ],
              },
              {
                type: "tag",
                start: 36,
                end: 41,
                value: "</td>",
              },
              {
                type: "text",
                start: 41,
                end: 46,
                value: "\n    ",
              },
              {
                type: "tag",
                start: 46,
                end: 49,
                value: "<a>",
              },
              {
                type: "text",
                start: 49,
                end: 50,
                value: "\n",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 50,
        end: 58,
        value: "</table>",
      },
    ],
    "12.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 46,
        idxTo: 49,
        tokenObj: {
          value: "<a>",
        },
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 10,
        idxTo: 14,
        tokenObj: {
          value: "<tr>",
        },
      },
    ],
    "12.02"
  );
  is(gatheredErr.length, 2, "12.03");
});

test.skip(`13 - rogue tag in place of another tag - opening - with whitespace - insurance`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(
      // notice how anchor tag pair is complete!
      `<table>
  <tr>
    <td>
      x
    </td>
    <a>a</a></table>`,
      {
        errCb: (errObj) => {
          gatheredErr.push(errObj);
        },
      }
    ),
    [
      {
        type: "tag",
        start: 0,
        end: 7,
        value: "<table>",
        children: [
          {
            type: "text",
            start: 7,
            end: 10,
            value: "\n  ",
          },
          {
            type: "tag",
            start: 10,
            end: 14,
            value: "<tr>",
            children: [
              {
                type: "text",
                start: 14,
                end: 19,
                value: "\n    ",
              },
              {
                type: "tag",
                start: 19,
                end: 23,
                value: "<td>",
                children: [
                  {
                    type: "text",
                    start: 23,
                    end: 36,
                    value: "\n      x\n    ",
                  },
                ],
              },
              {
                type: "tag",
                start: 36,
                end: 41,
                value: "</td>",
              },
              {
                type: "text",
                start: 41,
                end: 46,
                value: "\n    ",
              },
              {
                type: "tag",
                start: 46,
                end: 49,
                value: "<a>",
                children: [
                  {
                    type: "text",
                    start: 49,
                    end: 50,
                    value: "a",
                  },
                ],
              },
              {
                type: "tag",
                start: 50,
                end: 54,
                value: "</a>",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 54,
        end: 62,
        value: "</table>",
      },
    ],
    "13.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 10,
        idxTo: 14,
        tokenObj: {
          value: "<tr>",
        },
      },
    ],
    "13.02"
  );
  is(gatheredErr.length, 1, "13.03");
});

test.skip(`14 - rogue tag in place of another tag - closing - with whitespace`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(
      `<table>
  <tr>
    <td>
      x
    </td>
    </a>
</table>`,
      {
        errCb: (errObj) => {
          gatheredErr.push(errObj);
        },
      }
    ),
    [],
    "14.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-opening",
        idxFrom: 46,
        idxTo: 50,
      },
      {
        ruleId: "tag-missing-closing",
        idxFrom: 10,
        idxTo: 14,
      },
    ],
    "14.02"
  );
  is(gatheredErr.length, 2, "14.03");
});

test.skip(`15 - rogue tag in place of another tag - void - with whitespace`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser(
      `<table>
<tr>
  <td>
    x
  </td>
  <br/>
</table>`,
      {
        errCb: (errObj) => {
          gatheredErr.push(errObj);
        },
      }
    ),
    [],
    "15.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-missing-closing",
        idxFrom: 8,
        idxTo: 12,
      },
    ],
    "15.02"
  );
  is(gatheredErr.length, 1, "15.03");
});

// 03. rogue tag between tags
// -----------------------------------------------------------------------------

test.skip(`16 - rogue tag between tags - opening`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table><tr><td>x</td><a></tr></table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 21,
        end: 24,
        children: [],
      },
    ],
    "16.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-rogue",
        idxFrom: 21,
        idxTo: 24,
      },
    ],
    "16.02"
  );
  is(gatheredErr.length, 2, "16.03");
});

test.skip(`17 - rogue tag between tags - opening, spaced`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table> <tr> <td> x </td> <a> </tr> </table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 21,
        end: 24,
        children: [],
      },
    ],
    "17.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-rogue",
        idxFrom: 21,
        idxTo: 24,
      },
    ],
    "17.02"
  );
  is(gatheredErr.length, 2, "17.03");
});

test.skip(`18 - rogue tag between tags - closing`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table><tr><td>x</td><a></tr></table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 21,
        end: 24,
        children: [],
      },
    ],
    "18.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-rogue",
        idxFrom: 21,
        idxTo: 24,
      },
    ],
    "18.02"
  );
  is(gatheredErr.length, 1, "18.03");
});

test.skip(`19 - rogue tag between tags - closing, spaced`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table> <tr> <td> x </td> <a> </tr> </table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 21,
        end: 24,
        children: [],
      },
    ],
    "19.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-rogue",
        idxFrom: 21,
        idxTo: 24,
      },
    ],
    "19.02"
  );
  is(gatheredErr.length, 1, "19.03");
});

test.skip(`20 - rogue tag between tags - void`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table><tr><td>x</td><a></tr></table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 21,
        end: 24,
        children: [],
      },
    ],
    "20.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-rogue",
        idxFrom: 21,
        idxTo: 24,
      },
    ],
    "20.02"
  );
  is(gatheredErr.length, 1, "20.03");
});

test.skip(`21 - rogue tag between tags - void, spaced`, () => {
  let gatheredErr = [];
  compare(
    ok,
    cparser("<table> <tr> <td> x </td> <a> </tr> </table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [
      {
        type: "tag",
        tagName: "a",
        closing: true,
        start: 21,
        end: 24,
        children: [],
      },
    ],
    "21.01"
  );
  compare(
    ok,
    gatheredErr,
    [
      {
        ruleId: "tag-rogue",
        idxFrom: 21,
        idxTo: 24,
      },
    ],
    "21.02"
  );
  is(gatheredErr.length, 1, "21.03");
});

test.run();
