import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. type="only"
// -----------------------------------------------------------------------------

// For your reference:

// <!--[if mso]>
//     <img src="fallback"/>
// <![endif]-->

tap.test(
  `01 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - simple comment nested, tight`,
  (t) => {
    const str = `<!--[if mso]><!--tralala--><![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 13,
          idxTo: 17,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 24,
          idxTo: 27,
          message: `Don't nest comments.`,
          fix: null,
        },
      ],
      "01.02"
    );
    t.equal(messages.length, 2, "01.03");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - simple comment nested, mixed`,
  (t) => {
    const str = `<!--[if mso]>
    z <!--tralala--> y
<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 20,
          idxTo: 24,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 31,
          idxTo: 34,
          message: `Don't nest comments.`,
          fix: null,
        },
      ],
      "02.02"
    );
    t.equal(messages.length, 2, "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - two simple comments nested`,
  (t) => {
    const str = `<!--[if mso]>
    x <!--tralala--> z <!--tralala--> y
<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 20,
          idxTo: 24,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 31,
          idxTo: 34,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 37,
          idxTo: 41,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 48,
          idxTo: 51,
          message: `Don't nest comments.`,
          fix: null,
        },
      ],
      "03.02"
    );
    t.equal(messages.length, 4, "03.03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - two "only"-kind comments nested`,
  (t) => {
    const str = `<!--[if mso]>
    <img src="fallback"/>

<!--[if mso]>z<![endif]-->

<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 41,
          idxTo: 54,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 55,
          idxTo: 67,
          message: `Don't nest comments.`,
          fix: null,
        },
      ],
      "04.02"
    );
    t.equal(messages.length, 2, "04.03");
    t.end();
  }
);

// 02. type="not"
// -----------------------------------------------------------------------------

// For your reference:

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->

tap.test(
  `05 - ${`\u001b[${36}m${`type: not`}\u001b[${39}m`} - simple comment nested, tight`,
  (t) => {
    const str = `<!--[if mso]><!--><!--tralala--><!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 18,
          idxTo: 22,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 29,
          idxTo: 32,
          message: `Don't nest comments.`,
          fix: null,
        },
      ],
      "05.02"
    );
    t.equal(messages.length, 2, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`type: not`}\u001b[${39}m`} - simple comment nested, mixed`,
  (t) => {
    const str = `<!--[if mso]><!-->
    z <!--tralala--> y
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 25,
          idxTo: 29,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 36,
          idxTo: 39,
          message: `Don't nest comments.`,
          fix: null,
        },
      ],
      "06.02"
    );
    t.equal(messages.length, 2, "06.03");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`type: not`}\u001b[${39}m`} - two simple comments nested`,
  (t) => {
    const str = `<!--[if mso]><!-->
    x <!--tralala--> z <!--tralala--> y
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 25,
          idxTo: 29,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 36,
          idxTo: 39,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 42,
          idxTo: 46,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 53,
          idxTo: 56,
          message: `Don't nest comments.`,
          fix: null,
        },
      ],
      "07.02"
    );
    t.equal(messages.length, 4, "07.03");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`type: not`}\u001b[${39}m`} - two "only"-kind comments nested`,
  (t) => {
    const str = `<!--[if mso]><!-->
    <img src="fallback"/>

<!--[if mso]>z<![endif]-->

<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 46,
          idxTo: 59,
          message: `Don't nest comments.`,
          fix: null,
        },
        {
          ruleId: "comment-conditional-nested",
          severity: 2,
          idxFrom: 60,
          idxTo: 72,
          message: `Don't nest comments.`,
          fix: null,
        },
      ],
      "08.02"
    );
    t.equal(messages.length, 2, "08.03");
    t.end();
  }
);
