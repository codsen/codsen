// rule: character-encode
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";

import { applyFixes } from "../../../t-util/util";

// 01. basic tests, no config
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`,
  (t) => {
    const str = "fsdhkfdfgh kj ";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 2,
      },
    });
    t.same(messages, [], "01.01");
    t.equal(applyFixes(str, messages), str, "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`,
  (t) => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded pound sign character.",
          fix: {
            ranges: [[0, 1, "&pound;"]],
          },
        },
      ],
      "02.01"
    );
    t.equal(applyFixes(str, messages), "&pound;100", "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`,
  (t) => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        all: 1,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 1,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded pound sign character.",
          fix: {
            ranges: [[0, 1, "&pound;"]],
          },
        },
      ],
      "03.01"
    );
    t.equal(applyFixes(str, messages), "&pound;100", "03.02");
    t.end();
  }
);

// 02. basic tests, no config
// -----------------------------------------------------------------------------

tap.test(
  `04 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - named`,
  (t) => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "named"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded pound sign character.",
          fix: {
            ranges: [[0, 1, "&pound;"]],
          },
        },
      ],
      "04.01"
    );
    t.equal(applyFixes(str, messages), "&pound;100", "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - numeric`,
  (t) => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "numeric"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded pound sign character.",
          fix: {
            ranges: [[0, 1, "&#xA3;"]],
          },
        },
      ],
      "05.01"
    );
    t.equal(applyFixes(str, messages), "&#xA3;100", "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - missing`,
  (t) => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded pound sign character.",
          fix: {
            ranges: [[0, 1, "&pound;"]],
          },
        },
      ],
      "06.01"
    );
    t.equal(applyFixes(str, messages), "&pound;100", "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - unrecognised`,
  (t) => {
    const str = "£100";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "yo"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded pound sign character.",
          fix: {
            ranges: [[0, 1, "&pound;"]],
          },
        },
      ],
      "07.01"
    );
    t.equal(applyFixes(str, messages), "&pound;100", "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - within ESP tag`,
  (t) => {
    const str = "{%- if count > 1 -%}{%- if count > 1 -%}";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 2,
      },
    });
    t.same(messages, [], "08.01");
    t.equal(applyFixes(str, messages), str, "08.02");
    t.end();
  }
);

// 03. Email-unfriendly entities
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`,
  (t) => {
    const str = "\u0424"; // &Fcy; or Ф
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 1,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 1,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded character.",
          fix: {
            ranges: [[0, 1, "&#x424;"]],
          },
        },
      ],
      "09.01"
    );
    t.equal(applyFixes(str, messages), "&#x424;", "09.02");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`,
  (t) => {
    const str = "\u0424"; // &Fcy; or Ф
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "named"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded character.",
          fix: {
            ranges: [[0, 1, "&#x424;"]],
          },
        },
      ],
      "10.01"
    );
    t.equal(applyFixes(str, messages), "&#x424;", "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`,
  (t) => {
    const str = "\u0424"; // &Fcy; or Ф
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "numeric"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded character.",
          fix: {
            ranges: [[0, 1, "&#x424;"]],
          },
        },
      ],
      "11.01"
    );
    t.equal(applyFixes(str, messages), "&#x424;", "11.02");
    t.end();
  }
);

// 04. visible HTML-unfriendly characters within ASCII
// -----------------------------------------------------------------------------

tap.test(
  `12 - ${`\u001b[${33}m${`HTML-unfriendly`}\u001b[${39}m`} - brackets and quotes into named`,
  (t) => {
    const str = `><'"&`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "named"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded greater than character.",
          fix: {
            ranges: [[0, 1, "&gt;"]],
          },
        },
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          line: 1,
          message: "Unencoded less than character.",
          fix: {
            ranges: [[1, 2, "&lt;"]],
          },
        },
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 3,
          idxTo: 4,
          line: 1,
          message: "Unencoded double quotes character.",
          fix: {
            ranges: [[3, 4, "&quot;"]],
          },
        },
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          line: 1,
          message: "Unencoded ampersand character.",
          fix: {
            ranges: [[4, 5, "&amp;"]],
          },
        },
      ],
      "12.01"
    );
    t.equal(applyFixes(str, messages), "&gt;&lt;'&quot;&amp;", "12.02");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`HTML-unfriendly`}\u001b[${39}m`} - brackets and quotes into numeric`,
  (t) => {
    const str = `><'"&`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": [2, "numeric"],
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 0,
          idxTo: 1,
          line: 1,
          message: "Unencoded greater than character.",
          fix: {
            ranges: [[0, 1, "&#x3E;"]],
          },
        },
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          line: 1,
          message: "Unencoded less than character.",
          fix: {
            ranges: [[1, 2, "&#x3C;"]],
          },
        },
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 3,
          idxTo: 4,
          line: 1,
          message: "Unencoded double quotes character.",
          fix: {
            ranges: [[3, 4, "&#x22;"]],
          },
        },
        {
          ruleId: "character-encode",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          line: 1,
          message: "Unencoded ampersand character.",
          fix: {
            ranges: [[4, 5, "&#x26;"]],
          },
        },
      ],
      "13.01"
    );
    t.equal(applyFixes(str, messages), "&#x3E;&#x3C;'&#x22;&#x26;", "13.02");
    t.end();
  }
);

// 05. mixed rules
// -----------------------------------------------------------------------------

tap.test(
  `14 - ${`\u001b[${33}m${`other issues`}\u001b[${39}m`} - broken closing comment, dash missing`,
  (t) => {
    const str = "a<!--b->c";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 2,
      },
    });
    t.same(messages, [], "14.01");
    t.equal(applyFixes(str, messages), str, "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`other issues`}\u001b[${39}m`} - broken closing comment, dash missing`,
  (t) => {
    const str = "a<!--b->c";
    const fixed = "a<!--b-->c";
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "character-encode": 2,
        "comment-closing-malformed": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 6,
          idxTo: 8,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[6, 8, "-->"]],
          },
        },
      ],
      "15.01"
    );
    t.equal(applyFixes(str, messages), fixed, "15.02");
    t.end();
  }
);
