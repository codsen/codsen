import tap from "tap";
import cparser from "../dist/codsen-parser.esm";

// 01. simple cases
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - one tag only`,
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
      "01.01"
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
      "01.02"
    );
    t.is(gatheredErr.length, 1, "01.03");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - previous token is text-type`,
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
      "02.01"
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
      "02.02"
    );
    t.is(gatheredErr.length, 1, "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`simple`}\u001b[${39}m`} - previous token is tag-type`,
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
      "03.01"
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
      "03.02"
    );
    t.is(gatheredErr.length, 1, "03.03");
    t.end();
  }
);

// 02. all variations of a rogue tag, placed in other tag's formation
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - opening`,
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
      "04.01"
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
      "04.02"
    );
    t.is(gatheredErr.length, 1, "04.03");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - closing`,
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
      "05.01"
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
      "05.02"
    );
    t.is(gatheredErr.length, 2, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - void`,
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
      "06.01"
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
      "06.02"
    );
    t.is(gatheredErr.length, 1, "06.03");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - void, legit`,
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
      "07.01"
    );
    t.match(
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
      "07.02"
    );
    t.is(gatheredErr.length, 1, "07.03");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - text`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "08.01"
    );
    t.match(
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
      "08.02"
    );
    t.is(gatheredErr.length, 1, "08.03");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - opening - with whitespace`,
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
                //                          !!!
                //      the following token is not nested under "a":
                //                         !!!
                {
                  type: "text",
                  start: 49,
                  end: 50,
                  value: "\n",
                },
                // it's because following tag closes second layer behind,
                // first layer being parent "tr" and second layer being
                // grandparent "table"
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
      "09.01"
    );
    t.match(
      gatheredErr,
      [
        {
          ruleId: "tag-rogue",
          idxFrom: 46,
          idxTo: 49,
          tokenObj: {
            value: "<a>",
          },
        },
      ],
      "09.02"
    );
    t.is(gatheredErr.length, 1, "09.03");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - opening - with whitespace - insurance`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
      "10.01"
    );
    t.match(
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
      "10.02"
    );
    t.is(gatheredErr.length, 1, "10.03");
    t.end();
  }
);

tap.todo(
  `11 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - closing - with whitespace`,
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
      "11.01"
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
      "11.02"
    );
    t.is(gatheredErr.length, 1, "11.03");
    t.end();
  }
);

tap.todo(
  `12 - ${`\u001b[${32}m${`tag formation`}\u001b[${39}m`} - rogue tag in place of another tag - void - with whitespace`,
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
      "12.01"
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
      "12.02"
    );
    t.is(gatheredErr.length, 1, "12.03");
    t.end();
  }
);

// 03. rogue tag between tags
// -----------------------------------------------------------------------------

tap.todo(
  `13 - ${`\u001b[${36}m${`between tags`}\u001b[${39}m`} - rogue tag between tags - opening`,
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
      "13.01"
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
      "13.02"
    );
    t.is(gatheredErr.length, 1, "13.03");
    t.end();
  }
);

tap.todo(
  `14 - ${`\u001b[${36}m${`between tags`}\u001b[${39}m`} - rogue tag between tags - closing`,
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
      "14.01"
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
      "14.02"
    );
    t.is(gatheredErr.length, 1, "14.03");
    t.end();
  }
);

tap.todo(
  `15 - ${`\u001b[${36}m${`between tags`}\u001b[${39}m`} - rogue tag between tags - void`,
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
      "15.01"
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
      "15.02"
    );
    t.is(gatheredErr.length, 1, "15.03");
    t.end();
  }
);
