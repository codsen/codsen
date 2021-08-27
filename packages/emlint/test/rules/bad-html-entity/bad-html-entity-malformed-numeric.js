import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. double encoding on nbsp
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`malformed numeric`}\u001b[${39}m`} - numeric entity outside of the range - group rule`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity": 2,
      },
    });
    t.equal(applyFixes(str, messages), "az", "01.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-html-entity-malformed-numeric",
          severity: 2,
          idxFrom: 1,
          idxTo: 21,
          message: "Malformed numeric entity.",
          fix: {
            ranges: [[1, 21]],
          },
        },
      ],
      "01.02"
    );
    t.equal(messages.length, 1, "01.03");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`malformed numeric`}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 1`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-malformed-numeric": 1,
      },
    });
    t.equal(applyFixes(str, messages), "az", "02.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-html-entity-malformed-numeric",
          severity: 1,
          idxFrom: 1,
          idxTo: 21,
          message: "Malformed numeric entity.",
          fix: {
            ranges: [[1, 21]],
          },
        },
      ],
      "02.02"
    );
    t.equal(messages.length, 1, "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`malformed numeric`}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 2`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-malformed-numeric": 2,
      },
    });
    t.equal(applyFixes(str, messages), "az", "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-html-entity-malformed-numeric",
          severity: 2,
          idxFrom: 1,
          idxTo: 21,
          message: "Malformed numeric entity.",
          fix: {
            ranges: [[1, 21]],
          },
        },
      ],
      "03.02"
    );
    t.equal(messages.length, 1, "03.03");
    t.end();
  }
);

// 02. dollar instead of a hash
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${32}m${`malformed numeric`}\u001b[${39}m`} - dollar instead of hash - rule by wildcard`,
  (t) => {
    const str = `_&$65;_`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-malformed-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), "__", "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-html-entity-malformed-numeric",
          severity: 2,
          idxFrom: 1,
          idxTo: 6,
          message: "Malformed numeric entity.",
          fix: {
            ranges: [[1, 6]],
          },
        },
      ],
      "04.02"
    );
    t.equal(messages.length, 1, "04.03");
    t.end();
  }
);

// 03. disabled rule
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${33}m${`disabled rule`}\u001b[${39}m`} - numeric entity outside of the range - group rule`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`disabled rule`}\u001b[${39}m`} - numeric entity outside of the range - exact rule, 0`,
  (t) => {
    const str = `a&#99999999999999999;z`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-malformed-numeric": [0],
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`disabled rule`}\u001b[${39}m`} - numeric entity outside of the range - exact rule, with other rules`,
  (t) => {
    const str = `a&#99999999999999999;z<br>`;
    const messages = verify(t, str, {
      rules: {
        "bad-html-entity-malformed-numeric": [0],
        "tag-void-slash": [1],
      },
    });
    t.equal(applyFixes(str, messages), "a&#99999999999999999;z<br/>", "07");
    t.end();
  }
);
