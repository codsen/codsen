// rule: bad-named-html-entity-unrecognised
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// 01. missing letters
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - group rule`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-unrecognised",
          severity: 1, // <------- unrecognised entities might be false positives so default level is "warning"!
          idxFrom: 3,
          idxTo: 7,
          message: "Unrecognised named entity.",
          fix: {
            ranges: [],
          },
        },
      ],
      "01.02"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 1`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-unrecognised": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-unrecognised",
          severity: 1,
          idxFrom: 3,
          idxTo: 7,
          message: "Unrecognised named entity.",
          fix: {
            ranges: [], // no fixes
          },
        },
      ],
      "02.02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 2`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-unrecognised": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-unrecognised",
          severity: 2,
          idxFrom: 3,
          idxTo: 7,
          message: "Unrecognised named entity.",
          fix: {
            ranges: [], // no fixes
          },
        },
      ],
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - rule by wildcard`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "bad-named-html-entity-unrecognised",
          severity: 1, // <---- default is warning
          idxFrom: 3,
          idxTo: 7,
          message: "Unrecognised named entity.",
          fix: {
            ranges: [], // no fixes
          },
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - group rule - off`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-html-entity": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.same(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - exact rule, severity level 0`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-unrecognised": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.same(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`unrecognised entity`}\u001b[${39}m`} - rule by wildcard - off`,
  (t) => {
    const str = `abc&yo;def`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "bad-named-html-entity-*": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.same(messages, [], "07.02");
    t.end();
  }
);
