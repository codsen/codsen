const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. simple cases
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - one tag only`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "01.01.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-missing-opening",
          idxFrom: 0,
          idxTo: 4,
        },
      ],
      "01.01.02"
    );
    t.is(gatheredErr.length, 1, "01.01.03");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - previous token is text-type`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "01.02.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-missing-opening",
          idxFrom: 5,
          idxTo: 9,
        },
      ],
      "01.02.02"
    );
    t.is(gatheredErr.length, 1, "01.02.03");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - previous token is tag-type`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "01.03.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-missing-opening",
          idxFrom: 4,
          idxTo: 8,
        },
      ],
      "01.03.02"
    );
    t.is(gatheredErr.length, 1, "01.03.03");
    t.end();
  }
);

// 02. all variations of a rogue tag, placed in other tag's formation
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - opening`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "02.01.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 21,
          idxTo: 24,
        },
      ],
      "02.01.02"
    );
    t.is(gatheredErr.length, 1, "02.01.03");
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - closing`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "02.02.01"
    );
    t.match(
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
      "02.02.02"
    );
    t.is(gatheredErr.length, 2, "02.02.03");
    t.end();
  }
);

t.only(
  `02.03 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - void`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "02.03.01"
    );
    t.match(
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
      "02.03.02"
    );
    t.is(gatheredErr.length, 1, "02.03.03");
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - void, legit`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "02.04.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-missing-closing",
          idxFrom: 0,
          idxTo: 5,
        },
      ],
      "02.04.02"
    );
    t.is(gatheredErr.length, 1, "02.04.03");
    t.end();
  }
);

t.todo(
  `02.05 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - text`,
  (t) => {
    const gatheredErr = [];
    t.match(
      cparser("<table><tr><td>x</td>z</table>", {
        errCb: (errObj) => {
          gatheredErr.push(errObj);
        },
      }),
      [],
      "02.05.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 21,
          idxTo: 24,
        },
      ],
      "02.05.02"
    );
    t.is(gatheredErr.length, 1, "02.05.03");
    t.end();
  }
);

t.todo(
  `02.06 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - opening - with whitespace`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      [],
      "02.06.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 21,
          idxTo: 24,
        },
      ],
      "02.06.02"
    );
    t.is(gatheredErr.length, 1, "02.06.03");
    t.end();
  }
);

t.todo(
  `02.07 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - closing - with whitespace`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "02.07.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 21,
          idxTo: 24,
        },
      ],
      "02.07.02"
    );
    t.is(gatheredErr.length, 1, "02.07.03");
    t.end();
  }
);

t.todo(
  `02.08 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - void - with whitespace`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "02.08.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 21,
          idxTo: 24,
        },
      ],
      "02.08.02"
    );
    t.is(gatheredErr.length, 1, "02.08.03");
    t.end();
  }
);

// 03. rogue tag between tags
// -----------------------------------------------------------------------------

t.todo(
  `03.01 - ${`\u001b[${36}m${`between tags`}\u001b[${39}m`} - rogue tag between tags - opening`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "03.01.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 21,
          idxTo: 24,
        },
      ],
      "03.01.02"
    );
    t.is(gatheredErr.length, 1, "03.01.03");
    t.end();
  }
);

t.todo(
  `03.02 - ${`\u001b[${36}m${`between tags`}\u001b[${39}m`} - rogue tag between tags - closing`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "03.02.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 21,
          idxTo: 24,
        },
      ],
      "03.02.02"
    );
    t.is(gatheredErr.length, 1, "03.02.03");
    t.end();
  }
);

t.todo(
  `03.03 - ${`\u001b[${36}m${`between tags`}\u001b[${39}m`} - rogue tag between tags - void`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "03.03.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 21,
          idxTo: 24,
        },
      ],
      "03.03.02"
    );
    t.is(gatheredErr.length, 1, "03.03.03");
    t.end();
  }
);
