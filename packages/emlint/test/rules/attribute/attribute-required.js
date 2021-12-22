import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import {
  // applyFixes,
  verify,
} from "../../../t-util/util.js";

// -----------------------------------------------------------------------------

test(`01`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-required": 2,
    },
  });
  equal(messages, [], "01");
});

test(`02`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-required": [2],
    },
  });
  equal(messages, [], "02");
});

test(`03`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-required": [2, {}],
    },
  });
  equal(messages, [], "03");
});

test(`04`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-required": [
        2,
        {
          table: null,
        },
      ],
    },
  });
  equal(messages, [], "04");
});

test(`05`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-required": [
        2,
        {
          table: {},
        },
      ],
    },
  });
  equal(messages, [], "05");
});

test(`06`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-required": [
        2,
        {
          table: {
            cellpadding: false,
          },
        },
      ],
    },
  });
  equal(messages, [], "06");
});

test(`07`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-required": [
        2,
        {
          div: {
            cellpadding: false,
          },
        },
      ],
    },
  });
  equal(messages, [], "07");
});

// -----------------------------------------------------------------------------

test(`08`, () => {
  let str = `<table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-required": [
        2,
        {
          table: {
            cellpadding: true,
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
        ruleId: "attribute-required",
        severity: 2,
        idxFrom: 0,
        idxTo: 7,
        message: `Attribute "cellpadding" is missing.`,
        fix: null,
      },
    ],
    "08.01"
  );
  equal(messages.length, 1, "08.02");
});

test.run();
