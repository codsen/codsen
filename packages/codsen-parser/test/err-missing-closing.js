import tap from "tap";
import cparser from "../dist/codsen-parser.esm";

// 00. no error
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags`,
  (t) => {
    const gatheredErr = [];
    cparser(`<div></div>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    });
    t.same(gatheredErr, [], "01.01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`,
  (t) => {
    const gatheredErr = [];
    cparser(`<style>\n\n</style>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    });
    t.same(gatheredErr, [], "02.01");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`no error`}\u001b[${39}m`} - two tags, whitespace in between`,
  (t) => {
    const gatheredErr = [];
    cparser(`<div>\n\n</div>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    });
    t.same(gatheredErr, [], "03.01");
    t.end();
  }
);

// 01. basic
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - first tag is missing closing`,
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
      "04.01"
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
      "04.02"
    );
    t.is(gatheredErr.length, 1, "04.03");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - second tag is missing closing`,
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
      "05.01"
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
      "05.02"
    );
    t.is(gatheredErr.length, 1, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - third tag is missing closing`,
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
      "06.01"
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
      "06.02"
    );
    t.is(gatheredErr.length, 1, "06.03");
    t.end();
  }
);

// 02. false alerts
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${33}m${`false alerts`}\u001b[${39}m`} - healthy doctype`,
  (t) => {
    const gatheredErr = [];
    cparser(`<!doctype html>`, {
      errCb: (errObj) => gatheredErr.push(errObj),
    });
    t.same(gatheredErr, [], "07.01");
    t.end();
  }
);
