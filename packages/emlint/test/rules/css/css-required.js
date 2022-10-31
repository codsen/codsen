import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import {
  // applyFixes,
  verify,
} from "../../../t-util/util.js";

// can't/won't apply the rule
// -----------------------------------------------------------------------------

test(`01 - rule disabled`, () => {
  let str = `<img />`;
  let messages = verify(not, str, {
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
  equal(messages, [], "01.01");
});

test(`02 - tag not present`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
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
  equal(messages, [], "02.01");
});

test(`03 - nothing enforced`, () => {
  let str = `<img />`;
  let messages = verify(not, str, {
    rules: {
      "css-required": [
        2,
        {
          img: {},
        },
      ],
    },
  });
  equal(messages, [], "03.01");
});

test(`04 - nothing enforced - null`, () => {
  let str = `<img />`;
  let messages = verify(not, str, {
    rules: {
      "css-required": [
        2,
        {
          img: null,
        },
      ],
    },
  });
  equal(messages, [], "04.01");
});

test(`05 - nothing enforced - undef`, () => {
  let str = `<img />`;
  let messages = verify(not, str, {
    rules: {
      "css-required": [
        2,
        {
          img: undefined,
        },
      ],
    },
  });
  equal(messages, [], "05.01");
});

test(`06 - all OK`, () => {
  let str = `<img style="display: block;" />`;
  let messages = verify(not, str, {
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
  equal(messages, [], "06.01");
});

test(`07 - bool false, one matched, one not`, () => {
  let str = `<img style="color: red;" />`;
  let messages = verify(not, str, {
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
  equal(messages, [], "07.01");
});

test(`08 - bool false, #2`, () => {
  let str = `<img style="display: inline-block;" />`;
  let messages = verify(not, str, {
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
  equal(messages, [], "08.01");
});

test(`09 - bool true`, () => {
  let str = `<img style="display: inline-block;" />`;
  let messages = verify(not, str, {
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
  equal(messages, [], "09.01");
});

test(`10 - all OK - number casted to string`, () => {
  let str = `<div style="line-height: 1;">`;
  let messages = verify(not, str, {
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
  equal(messages, [], "10.01");
});

// missing
// -----------------------------------------------------------------------------

test(`11`, () => {
  let str = `<img />`;
  let messages = verify(not, str, {
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
  compare(
    ok,
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
  equal(messages.length, 1, "11.01");
});

test(`12 - loose value check, style empty`, () => {
  let str = `<img style="" />`;
  let messages = verify(not, str, {
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
  compare(
    ok,
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
  equal(messages.length, 1, "12.01");
});

test(`13 - loose value check, style not empty`, () => {
  let str = `<img style="color: red;" />`;
  let messages = verify(not, str, {
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
  compare(
    ok,
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
  equal(messages.length, 1, "13.01");
});

test(`14 - loose value check, style not empty, one loosely matched`, () => {
  let str = `<img style="color: red;" />`;
  let messages = verify(not, str, {
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
  compare(
    ok,
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
  equal(messages.length, 1, "14.01");
});

test(`15 - strict value check, property missing`, () => {
  let str = `<img style="" />`;
  let messages = verify(not, str, {
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
  compare(
    ok,
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
  equal(messages.length, 1, "15.01");
});

test(`16 - strict value check, property present but has a wrong value`, () => {
  let str = `<img style="display:inline-block" />`;
  let messages = verify(not, str, {
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
  compare(
    ok,
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
  equal(messages.length, 1, "16.01");
});

test(`17 - strict value check, property present but has a missing value`, () => {
  let str = `<img style="display" />`;
  let messages = verify(not, str, {
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
  compare(
    ok,
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
  equal(messages.length, 1, "17.01");
});

test.run();
