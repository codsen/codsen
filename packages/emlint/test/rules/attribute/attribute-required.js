import tap from "tap";
import {
  // applyFixes,
  verify,
} from "../../../t-util/util";

// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-required": 2,
    },
  });
  t.strictSame(messages, [], "01");
  t.end();
});

tap.test(`02`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-required": [2],
    },
  });
  t.strictSame(messages, [], "02");
  t.end();
});

tap.test(`03`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-required": [2, {}],
    },
  });
  t.strictSame(messages, [], "03");
  t.end();
});

tap.test(`04`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-required": [
        2,
        {
          table: null,
        },
      ],
    },
  });
  t.strictSame(messages, [], "04");
  t.end();
});

tap.test(`05`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-required": [
        2,
        {
          table: {},
        },
      ],
    },
  });
  t.strictSame(messages, [], "05");
  t.end();
});

tap.test(`06`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
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
  t.strictSame(messages, [], "06");
  t.end();
});

tap.test(`07`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
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
  t.strictSame(messages, [], "07");
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`08`, (t) => {
  const str = `<table>`;
  const messages = verify(t, str, {
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
  t.match(
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
  t.equal(messages.length, 1, "08.02");
  t.end();
});
