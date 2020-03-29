const t = require("tap");
const cparser = require("../dist/codsen-parser.cjs");

// 01. all variations of a rogue tag, placed in other tag's formation
// -----------------------------------------------------------------------------

t.test("01.01 - rogue tag in place of another tag - opening", (t) => {
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
    "01.01.01"
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
    "01.01.02"
  );
  t.is(gatheredErr.length, 1, "01.01.03");
  t.end();
});

t.test("01.02 - rogue tag in place of another tag - closing", (t) => {
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
    "01.02.01"
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
    "01.02.02"
  );
  t.is(gatheredErr.length, 2, "01.02.03");
  t.end();
});

t.todo("01.03 - rogue tag in place of another tag - void", (t) => {
  const gatheredErr = [];
  t.match(
    cparser("<table><tr><td>x</td><br/></table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [],
    "01.03.01"
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
    "01.03.02"
  );
  t.is(gatheredErr.length, 1, "01.03.03");
  t.end();
});

t.todo("01.04 - rogue tag in place of another tag - void, legit", (t) => {
  const gatheredErr = [];
  t.match(
    cparser("<div><div><div>x</div><br/></div>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [],
    "01.04.01"
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
    "01.04.02"
  );
  t.is(gatheredErr.length, 1, "01.04.03");
  t.end();
});

t.todo("01.05 - rogue tag in place of another tag - text", (t) => {
  const gatheredErr = [];
  t.match(
    cparser("<table><tr><td>x</td>z</table>", {
      errCb: (errObj) => {
        gatheredErr.push(errObj);
      },
    }),
    [],
    "01.05.01"
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
    "01.05.02"
  );
  t.is(gatheredErr.length, 1, "01.05.03");
  t.end();
});

t.todo(
  "01.06 - rogue tag in place of another tag - opening - with whitespace",
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
      "01.06.01"
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
      "01.06.02"
    );
    t.is(gatheredErr.length, 1, "01.06.03");
    t.end();
  }
);

t.todo(
  "01.07 - rogue tag in place of another tag - closing - with whitespace",
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
      "01.07.01"
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
      "01.07.02"
    );
    t.is(gatheredErr.length, 1, "01.07.03");
    t.end();
  }
);

t.todo(
  "01.08 - rogue tag in place of another tag - void - with whitespace",
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
      "01.08.01"
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
      "01.08.02"
    );
    t.is(gatheredErr.length, 1, "01.08.03");
    t.end();
  }
);

// 02. between tags
// -----------------------------------------------------------------------------

t.todo("02.01 - rogue tag between tags", (t) => {
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
});
