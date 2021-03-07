import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// 01. one entity of the list
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - group rule`, (t) => {
  const str = `abc&Intersection;def`;
  const messages = verify(t, str, {
    rules: {
      "bad-html-entity": 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&#x22C2;def", "01.01");
  t.match(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-not-email-friendly",
        severity: 2,
        idxFrom: 3,
        idxTo: 17,
        message: "Email-unfriendly named HTML entity.",
        fix: {
          ranges: [[3, 17, "&#x22C2;"]],
        },
      },
    ],
    "01.02"
  );
  t.end();
});

tap.test(`02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - exact rule`, (t) => {
  const str = `abc&Intersection;def`;
  const messages = verify(t, str, {
    rules: {
      "bad-named-html-entity-not-email-friendly": 1,
    },
  });
  t.equal(applyFixes(str, messages), "abc&#x22C2;def", "02.01");
  t.match(
    messages,
    [
      {
        ruleId: "bad-named-html-entity-not-email-friendly",
        severity: 1,
        idxFrom: 3,
        idxTo: 17,
        message: "Email-unfriendly named HTML entity.",
        fix: {
          ranges: [[3, 17, "&#x22C2;"]],
        },
      },
    ],
    "02.02"
  );
  t.end();
});

tap.test(
  `03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - through wildcard`,
  (t) => {
    const str = `abc&Intersection;def`;
    const messages = verify(t, str, {
      rules: {
        "bad-named-html-entity-not-email-*": 1,
      },
    });
    t.equal(applyFixes(str, messages), "abc&#x22C2;def", "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-not-email-friendly",
          severity: 1,
          idxFrom: 3,
          idxTo: 17,
          message: "Email-unfriendly named HTML entity.",
          fix: {
            ranges: [[3, 17, "&#x22C2;"]],
          },
        },
      ],
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - through wildcard`,
  (t) => {
    const str = `abc&Intersection;def`;
    const messages = verify(t, str, {
      rules: {
        "bad*": 1,
      },
    });
    t.equal(applyFixes(str, messages), "abc&#x22C2;def", "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-not-email-friendly",
          severity: 1,
          idxFrom: 3,
          idxTo: 17,
          message: "Email-unfriendly named HTML entity.",
          fix: {
            ranges: [[3, 17, "&#x22C2;"]],
          },
        },
      ],
      "04.02"
    );
    t.end();
  }
);
