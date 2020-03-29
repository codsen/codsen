const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 00. no error
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags`,
  (t) => {
    const gatheredErr = [];
    cparser(`<div></div>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    });
    t.same(gatheredErr, [], "00.01");
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`,
  (t) => {
    const gatheredErr = [];
    cparser(`<style>\n\n</style>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    });
    t.same(gatheredErr, [], "00.02");
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`,
  (t) => {
    const gatheredErr = [];
    cparser(`<div>\n\n</div>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    });
    t.same(gatheredErr, [], "00.03");
    t.end();
  }
);

// 01. basic
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - first tag is missing closing`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "01.01.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-missing-closing",
          idxFrom: 0,
          idxTo: 7,
        },
      ],
      "01.01.02"
    );
    t.is(gatheredErr.length, 1, "01.01.03");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - second tag is missing closing`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "01.02.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-missing-closing",
          idxFrom: 7,
          idxTo: 11,
        },
      ],
      "01.02.02"
    );
    t.is(gatheredErr.length, 1, "01.02.03");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - third tag is missing closing`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "01.03.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-missing-closing",
          idxFrom: 11,
          idxTo: 15,
        },
      ],
      "01.03.02"
    );
    t.is(gatheredErr.length, 1, "01.03.03");
    t.end();
  }
);

// 02.
