import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains");

// 1. no config - nothing happens
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - off`, (t) => {
  const str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-is-present": 0,
    },
  });
  t.strictSame(messages, [], "01.01");
  t.equal(applyFixes(str, messages), str, "01.02");
  t.end();
});

tap.test(`02 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - warn`, (t) => {
  const str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-is-present": 1,
    },
  });
  t.strictSame(messages, [], "02.01");
  t.equal(applyFixes(str, messages), str, "02.02");
  t.end();
});

tap.test(`03 - ${`\u001b[${31}m${`no config`}\u001b[${39}m`} - err`, (t) => {
  const str = "<h1><div><zzz><yo><a></a><script></yo></h1>";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-is-present": 2,
    },
  });
  t.strictSame(messages, [], "03.01");
  t.equal(applyFixes(str, messages), str, "03.02");
  t.end();
});

// 02. flagging up tags by their names
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - flags one, exact match`,
  (t) => {
    const str = "<h1><div><zzz><yo><br/><a></a><script></yo></h1>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-is-present": [2, "h1"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-is-present",
          severity: 2,
          idxFrom: 0,
          idxTo: 4,
          message: "h1 is not allowed.",
          fix: {
            ranges: [[0, 4]],
          },
        },
        {
          ruleId: "tag-is-present",
          severity: 2,
          idxFrom: 43,
          idxTo: 48,
          message: "h1 is not allowed.",
          fix: {
            ranges: [[43, 48]],
          },
        },
      ],
      "04.01"
    );
    t.equal(
      applyFixes(str, messages),
      "<div><zzz><yo><br/><a></a><script></yo>",
      "04.02"
    );
    t.end();
  }
);

tap.only(
  `05 - ${`\u001b[${32}m${`config`}\u001b[${39}m`} - flags one, match by wildcard`,
  (t) => {
    const str = "<h1><div><zzz><yo><br/><a></a><script></yo></h1>";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-is-present": [2, "h*"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-is-present",
          severity: 2,
          idxFrom: 0,
          idxTo: 4,
          message: "h1 is not allowed.",
          fix: {
            ranges: [[0, 4]],
          },
        },
        {
          ruleId: "tag-is-present",
          severity: 2,
          idxFrom: 43,
          idxTo: 48,
          message: "h1 is not allowed.",
          fix: {
            ranges: [[43, 48]],
          },
        },
      ],
      "05.01"
    );
    t.equal(
      applyFixes(str, messages),
      "<div><zzz><yo><br/><a></a><script></yo>",
      "05.02"
    );
    t.end();
  }
);
