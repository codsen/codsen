const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no class, error level 0`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no class, error level 1`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no class, error level 2`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy class`,
  t => {
    const str = `<table class='zz' class='w100p fl ha' id='yy aa'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  t => {
    const str = `<table class=" w100p">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table class="w100p">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 14,
        idxTo: 15,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[14, 15]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  t => {
    const str = `<table class="w100p ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table class="w100p">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 19,
        idxTo: 20,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[19, 20]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - one class, copious whitespace around`,
  t => {
    const str = `<table class="  w100p  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table class="w100p">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 14,
        idxTo: 23,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [14, 16],
            [21, 23]
          ]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - many classes, copious whitespace around`,
  t => {
    const str = `<table class="  w100p  ha \t fl  \n  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table class="w100p ha fl">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 14,
        idxTo: 35,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [14, 16],
            [30, 35]
          ]
        }
      },
      {
        ruleId: "attribute-validate-class",
        idxFrom: 21,
        idxTo: 23,
        message: `Should be a single space.`,
        fix: {
          ranges: [[21, 23]]
        }
      },
      {
        ruleId: "attribute-validate-class",
        idxFrom: 25,
        idxTo: 28,
        message: `Should be a single space.`,
        fix: {
          ranges: [[25, 28]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  t => {
    const str = `<table class="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 14,
        idxTo: 17,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`,
  t => {
    const str = `<table class="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 14,
        idxTo: 14,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. class name checks
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - healthy`,
  t => {
    const str = `<table class='ab cd ef' id='yy aa'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - mix 1`,
  t => {
    const str = `<table class='ab \t3a e.f' id='yy aa'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    // can fix:
    t.equal(applyFixes(str, messages), `<table class='ab 3a e.f' id='yy aa'>`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 16,
        idxTo: 18,
        message: `Should be a single space.`,
        fix: {
          ranges: [[16, 18]]
        }
      },
      {
        ruleId: "attribute-validate-class",
        idxFrom: 18,
        idxTo: 20,
        message: `Wrong class name.`,
        fix: null
      },
      {
        ruleId: "attribute-validate-class",
        idxFrom: 21,
        idxTo: 24,
        message: `Wrong class name.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - starts with dot`,
  t => {
    const str = `<table class=".abc">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 14,
        idxTo: 18,
        message: `Wrong class name.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${35}m${`class name checks`}\u001b[${39}m`} - only dot`,
  t => {
    const str = `<table class=".">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-class": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-class",
        idxFrom: 14,
        idxTo: 15,
        message: `Wrong class name.`,
        fix: null
      }
    ]);
    t.end();
  }
);
