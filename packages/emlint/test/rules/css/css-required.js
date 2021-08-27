import tap from "tap";
import {
  // applyFixes,
  verify,
} from "../../../t-util/util.js";

// can't/won't apply the rule
// -----------------------------------------------------------------------------

tap.test(`01 - rule disabled`, (t) => {
  const str = `<img />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        0,
        {
          img: {
            display: "block",
          },
        },
      ],
    },
  });
  t.strictSame(messages, [], "01");
  t.end();
});

tap.test(`02 - tag not present`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: "block",
          },
        },
      ],
    },
  });
  t.strictSame(messages, [], "02");
  t.end();
});

tap.test(`03 - nothing enforced`, (t) => {
  const str = `<img />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {},
        },
      ],
    },
  });
  t.strictSame(messages, [], "03");
  t.end();
});

tap.test(`04 - nothing enforced - null`, (t) => {
  const str = `<img />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: null,
        },
      ],
    },
  });
  t.strictSame(messages, [], "04");
  t.end();
});

tap.test(`05 - nothing enforced - undef`, (t) => {
  const str = `<img />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: undefined,
        },
      ],
    },
  });
  t.strictSame(messages, [], "05");
  t.end();
});

tap.test(`06 - all OK`, (t) => {
  const str = `<img style="display: block;" />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: "block",
          },
        },
      ],
    },
  });
  t.strictSame(messages, [], "06");
  t.end();
});

tap.test(`07 - bool false, one matched, one not`, (t) => {
  const str = `<img style="color: red;" />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: false,
            color: false,
          },
        },
      ],
    },
  });
  t.strictSame(messages, [], "07");
  t.end();
});

tap.test(`08 - bool false, #2`, (t) => {
  const str = `<img style="display: inline-block;" />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: false,
          },
        },
      ],
    },
  });
  t.strictSame(messages, [], "08");
  t.end();
});

tap.test(`09 - bool true`, (t) => {
  const str = `<img style="display: inline-block;" />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: true,
          },
        },
      ],
    },
  });
  t.strictSame(messages, [], "09");
  t.end();
});

tap.test(`10 - all OK - number casted to string`, (t) => {
  const str = `<div style="line-height: 1;">`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          div: {
            "line-height": 1,
          },
        },
      ],
    },
  });
  t.strictSame(messages, [], "10");
  t.end();
});

// missing
// -----------------------------------------------------------------------------

tap.test(`11`, (t) => {
  const str = `<img />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: "block",
          },
        },
      ],
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "css-required",
        severity: 2,
        idxFrom: 0,
        idxTo: 7,
        message: `Attribute "style" is missing.`,
        fix: null,
      },
    ],
    "11.01"
  );
  t.equal(messages.length, 1, "11.02");
  t.end();
});

tap.test(`12 - loose value check, style empty`, (t) => {
  const str = `<img style="" />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: true,
          },
        },
      ],
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "css-required",
        severity: 2,
        idxFrom: 5,
        idxTo: 13,
        message: `Property "display" is missing.`,
        fix: null,
      },
    ],
    "12.01"
  );
  t.equal(messages.length, 1, "12.02");
  t.end();
});

tap.test(`13 - loose value check, style not empty`, (t) => {
  const str = `<img style="color: red;" />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: true,
          },
        },
      ],
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "css-required",
        severity: 2,
        idxFrom: 5,
        idxTo: 24,
        message: `Property "display" is missing.`,
        fix: null,
      },
    ],
    "13.01"
  );
  t.equal(messages.length, 1, "13.02");
  t.end();
});

tap.test(
  `14 - loose value check, style not empty, one loosely matched`,
  (t) => {
    const str = `<img style="color: red;" />`;
    const messages = verify(t, str, {
      rules: {
        "css-required": [
          2,
          {
            img: {
              display: true,
              color: true,
            },
          },
        ],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "css-required",
          severity: 2,
          idxFrom: 5,
          idxTo: 24,
          message: `Property "display" is missing.`,
          fix: null,
        },
      ],
      "14.01"
    );
    t.equal(messages.length, 1, "14.02");
    t.end();
  }
);

tap.test(`15 - strict value check, property missing`, (t) => {
  const str = `<img style="" />`;
  const messages = verify(t, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {
            display: "block",
          },
        },
      ],
    },
  });
  t.match(
    messages,
    [
      {
        ruleId: "css-required",
        severity: 2,
        idxFrom: 5,
        idxTo: 13,
        message: `"display: block" is missing.`,
        fix: null,
      },
    ],
    "15.01"
  );
  t.equal(messages.length, 1, "15.02");
  t.end();
});

tap.test(
  `16 - strict value check, property present but has a wrong value`,
  (t) => {
    const str = `<img style="display:inline-block" />`;
    const messages = verify(t, str, {
      rules: {
        "css-required": [
          2,
          {
            img: {
              display: "block",
            },
          },
        ],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "css-required",
          severity: 2,
          idxFrom: 20,
          idxTo: 32,
          message: `Should be "block".`,
          fix: null,
        },
      ],
      "16.01"
    );
    t.equal(messages.length, 1, "16.02");
    t.end();
  }
);

tap.test(
  `17 - strict value check, property present but has a missing value`,
  (t) => {
    const str = `<img style="display" />`;
    const messages = verify(t, str, {
      rules: {
        "css-required": [
          2,
          {
            img: {
              display: "block",
            },
          },
        ],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "css-required",
          severity: 2,
          idxFrom: 12,
          idxTo: 19,
          message: `Missing value "block".`,
          fix: null,
        },
      ],
      "17.01"
    );
    t.equal(messages.length, 1, "17.02");
    t.end();
  }
);
