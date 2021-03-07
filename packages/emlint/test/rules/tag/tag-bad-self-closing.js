import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains");

// 1. basics
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - rule is off`,
  (t) => {
    const str = `<table/>`;
    const messages = verify(t, str, {
      rules: {
        "tag-bad-self-closing": 0,
      },
    });
    t.strictSame(messages, [], "01.01");
    t.equal(applyFixes(str, messages), str, "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - severity: warn`,
  (t) => {
    const str = `<table/>`;
    const fixed = `<table>`;
    const messages = verify(t, str, {
      rules: {
        "tag-bad-self-closing": 2,
      },
    });
    t.match(
      messages,
      [
        {
          ruleId: "tag-bad-self-closing",
          severity: 2,
          idxFrom: 6,
          idxTo: 7,
          message: "Remove the slash.",
          fix: {
            ranges: [[6, 7]],
          },
        },
      ],
      "02.01"
    );
    t.equal(applyFixes(str, messages), fixed, "02.02");
    t.equal(messages.length, 1, "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - with attributes`,
  (t) => {
    const str = `<table width="1" border="0" cellpadding="0" cellspacing="0"/>
  <tr/>
    <td/>
      x<br/>y
    </td/>
  </tr/>
</table/>`;
    const fixed = `<table width="1" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x<br/>y
    </td>
  </tr>
</table>`;
    const messages = verify(t, str, {
      rules: {
        "tag-bad-self-closing": 2,
      },
    });
    t.match(
      messages,
      [
        {
          severity: 2,
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom: 59,
          idxTo: 60,
          fix: {
            ranges: [[59, 60]],
          },
        },
        {
          severity: 2,
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom: 67,
          idxTo: 68,
          fix: {
            ranges: [[67, 68]],
          },
        },
        {
          severity: 2,
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom: 77,
          idxTo: 78,
          fix: {
            ranges: [[77, 78]],
          },
        },
        {
          severity: 2,
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom: 102,
          idxTo: 103,
          fix: {
            ranges: [[102, 103]],
          },
        },
        {
          severity: 2,
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom: 111,
          idxTo: 112,
          fix: {
            ranges: [[111, 112]],
          },
        },
        {
          severity: 2,
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom: 121,
          idxTo: 122,
          fix: {
            ranges: [[121, 122]],
          },
        },
      ],
      "03.01"
    );
    t.equal(applyFixes(str, messages), fixed, "03.02");
    t.equal(messages.length, 6, "03.03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - excessive whitespace in front`,
  (t) => {
    const str = `<div  />`;
    const fixed = `<div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-bad-self-closing": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "04.01");
    t.equal(messages.length, 1, "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - excessive whitespace in between`,
  (t) => {
    const str = `<div/    >`;
    const fixed = `<div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-bad-self-closing": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "05.01");
    t.equal(messages.length, 1, "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - excessive whitespace everywhere`,
  (t) => {
    const str = `<div   /    >`;
    const fixed = `<div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-bad-self-closing": 1,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "06.01");
    t.equal(messages.length, 1, "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - really excessive whitespace everywhere`,
  (t) => {
    const str = `<div\t\t\t\n\n\n\r\r\r\t\t\t/\t\t\t\r\r\r\r\r\r\r\r\t\t\t\t\t>`;
    const fixed = `<div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-bad-self-closing": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "07.01");
    t.equal(messages.length, 1, "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - group rule "tag" should be sensible`,
  (t) => {
    const str = `<div   /    >`;
    const fixed = `<div>`;
    const messages = verify(t, str, {
      rules: {
        tag: 2, // <---------- all "tag-*" rules
      },
    });
    t.equal(applyFixes(str, messages), fixed, "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - "all rules" setting should be sensible`,
  (t) => {
    const str = `<div   /    >`;
    const fixed = `<div>`;
    const messages = verify(t, str, {
      rules: {
        all: 2, // <---------- all rules
      },
    });
    t.equal(applyFixes(str, messages), fixed, "09");
    t.end();
  }
);
