import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no class, error level 0`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no class, error level 1`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no class, error level 2`,
  (t) => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy class`,
  (t) => {
    const str = `<table class='zz' class='w100p fl ha' id='yy aa'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<table class=" w100p">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table class="w100p">`, "05.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 14,
          idxTo: 15,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[14, 15]],
          },
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<table class="w100p ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table class="w100p">`, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 19,
          idxTo: 20,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[19, 20]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - one class, copious whitespace around`,
  (t) => {
    const str = `<table class="  w100p  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table class="w100p">`, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 14,
          idxTo: 23,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [14, 16],
              [21, 23],
            ],
          },
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - many classes, copious whitespace around`,
  (t) => {
    const str = `<table class="  w100p  ha \t fl  \n  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table class="w100p ha fl">`, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 14,
          idxTo: 35,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [14, 16],
              [30, 35],
            ],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 21,
          idxTo: 23,
          message: `Should be a single space.`,
          fix: {
            ranges: [[22, 23]],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 25,
          idxTo: 28,
          message: `Should be a single space.`,
          fix: {
            ranges: [[26, 28]],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<table class="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 14,
          idxTo: 17,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<table class="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 7,
          idxTo: 15,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 03. class name checks
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - healthy`,
  (t) => {
    const str = `<table class='ab cd ef' id='yy aa'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "11.01");
    t.strictSame(messages, [], "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - mix 1`,
  (t) => {
    const str = `<a class="b c\td\ne\t f \tg\t\th">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<a class="b c d e f g h">`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 13, // whole whitespace gap is reported but deletion is mininal
          idxTo: 14,
          message: `Should be a single space.`,
          fix: {
            ranges: [[13, 14, " "]], // replacement with space - notice 3rd arg
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 15,
          idxTo: 16,
          message: `Should be a single space.`,
          fix: {
            ranges: [[15, 16, " "]], // replacement with space - notice 3rd arg
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 17,
          idxTo: 19,
          message: `Should be a single space.`,
          fix: {
            ranges: [[17, 18]],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 20,
          idxTo: 22,
          message: `Should be a single space.`,
          fix: {
            ranges: [[21, 22]],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 23,
          idxTo: 25,
          message: `Should be a single space.`,
          fix: {
            ranges: [[23, 25, " "]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - mix 1`,
  (t) => {
    const str = `<table class='ab \t3a e.f' id='yy aa'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    // can fix:
    t.equal(
      applyFixes(str, messages),
      `<table class='ab 3a e.f' id='yy aa'>`,
      "13.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 16,
          idxTo: 18,
          message: `Should be a single space.`,
          fix: {
            ranges: [[17, 18]],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 18,
          idxTo: 20,
          message: `Wrong class name.`,
          fix: null,
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 21,
          idxTo: 24,
          message: `Wrong class name.`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - starts with dot`,
  (t) => {
    const str = `<table class=".abc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 14,
          idxTo: 18,
          message: `Wrong class name.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - only dot`,
  (t) => {
    const str = `<table class=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 14,
          idxTo: 15,
          message: `Wrong class name.`,
          fix: null,
        },
      ],
      "15.02"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - only dot`,
  (t) => {
    const str = `
<table class="aa bb cc dd">
<table class="aa bb aa bb cc aa dd \taa">
<table class="aa bb cc dd">
`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2,
      },
    });
    // can fix:
    t.equal(
      applyFixes(str, messages),
      `
<table class="aa bb cc dd">
<table class="aa bb cc dd">
<table class="aa bb cc dd">
`,
      "16.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-class",
          idxFrom: 49,
          idxTo: 51,
          message: `Duplicate class "aa".`,
          fix: {
            ranges: [[49, 52]],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 52,
          idxTo: 54,
          message: `Duplicate class "bb".`,
          fix: {
            ranges: [[52, 55]],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 58,
          idxTo: 60,
          message: `Duplicate class "aa".`,
          fix: {
            ranges: [[58, 61]],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 63,
          idxTo: 65,
          message: `Should be a single space.`,
          fix: {
            ranges: [[64, 65]],
          },
        },
        {
          ruleId: "attribute-validate-class",
          idxFrom: 65,
          idxTo: 67,
          message: `Duplicate class "aa".`,
          fix: {
            ranges: [[63, 67]],
          },
        },
      ],
      "16.02"
    );
    t.end();
  }
);
