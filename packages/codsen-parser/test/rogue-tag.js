import tap from "tap";
import { cparser } from "../dist/codsen-parser.esm";

// 01. simple cases
// -----------------------------------------------------------------------------

tap.todo(
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

tap.todo(
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

tap.todo(
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

tap.todo(`04 - rogue tag in place of another tag - opening`, (t) => {
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
  t.is(gatheredErr.length, 2, "04.03");
  t.end();
});

tap.todo(
  `05 - rogue tag in place of another tag - opening, with spaces`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
    t.match(
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
    t.is(gatheredErr.length, 2, "05.03");
    t.end();
  }
);

tap.todo(`06 - rogue tag in place of another tag - closing`, (t) => {
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
    "06.01"
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
    "06.02"
  );
  t.is(gatheredErr.length, 2, "06.03");
  t.end();
});

tap.todo(
  `07 - rogue tag in place of another tag - closing, with spaces`,
  (t) => {
    const gatheredErr = [];
    t.match(
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
    t.match(
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
    t.is(gatheredErr.length, 2, "07.03");
    t.end();
  }
);

tap.todo(`08 - rogue tag in place of another tag - void`, (t) => {
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
          type: "tag",
          start: 7,
          end: 11,
          value: "<tr>",
        },
      },
    ],
    "08.02"
  );
  t.is(gatheredErr.length, 1, "08.03");
  t.end();
});

tap.todo(`09 - rogue tag in place of another tag - void`, (t) => {
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
    "09.01"
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
    "09.02"
  );
  t.is(gatheredErr.length, 1, "09.03");
  t.end();
});

tap.todo(`10 - rogue tag in place of another tag - void, legit`, (t) => {
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
    "10.01"
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
    "10.02"
  );
  t.is(gatheredErr.length, 1, "10.03");
  t.end();
});

tap.todo(`11 - rogue tag in place of another tag - text`, (t) => {
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
    "11.01"
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
    "11.02"
  );
  t.is(gatheredErr.length, 1, "11.03");
  t.end();
});

tap.todo(
  `12 - rogue tag in place of another tag - opening - with whitespace`,
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
    t.match(
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
    t.is(gatheredErr.length, 2, "12.03");
    t.end();
  }
);

tap.todo(
  `13 - rogue tag in place of another tag - opening - with whitespace - insurance`,
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
      "13.01"
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
      "13.02"
    );
    t.is(gatheredErr.length, 1, "13.03");
    t.end();
  }
);

tap.todo(
  `14 - rogue tag in place of another tag - closing - with whitespace`,
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
      "14.01"
    );
    t.match(
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
    t.is(gatheredErr.length, 2, "14.03");
    t.end();
  }
);

tap.todo(
  `15 - rogue tag in place of another tag - void - with whitespace`,
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
      "15.01"
    );
    t.match(
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
    t.is(gatheredErr.length, 1, "15.03");
    t.end();
  }
);

// 03. rogue tag between tags
// -----------------------------------------------------------------------------

tap.todo(`16 - rogue tag between tags - opening`, (t) => {
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
    "16.01"
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
    "16.02"
  );
  t.is(gatheredErr.length, 2, "16.03");
  t.end();
});

tap.todo(`17 - rogue tag between tags - opening, spaced`, (t) => {
  const gatheredErr = [];
  t.match(
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
  t.match(
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
  t.is(gatheredErr.length, 2, "17.03");
  t.end();
});

tap.todo(`18 - rogue tag between tags - closing`, (t) => {
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
    "18.01"
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
    "18.02"
  );
  t.is(gatheredErr.length, 1, "18.03");
  t.end();
});

tap.todo(`19 - rogue tag between tags - closing, spaced`, (t) => {
  const gatheredErr = [];
  t.match(
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
  t.match(
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
  t.is(gatheredErr.length, 1, "19.03");
  t.end();
});

tap.todo(`20 - rogue tag between tags - void`, (t) => {
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
    "20.01"
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
    "20.02"
  );
  t.is(gatheredErr.length, 1, "20.03");
  t.end();
});

tap.todo(`21 - rogue tag between tags - void, spaced`, (t) => {
  const gatheredErr = [];
  t.match(
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
  t.match(
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
  t.is(gatheredErr.length, 1, "21.03");
  t.end();
});
