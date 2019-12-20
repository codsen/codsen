const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no align, error level 0`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 0
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no align, error level 1`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 1
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no align, error level 2`,
  t => {
    const str = `<table>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, wildcard`,
  t => {
    const str = `<table align='left'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
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
    const str = `<table align=" left">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table align="left">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
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
    const str = `<table align="left ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table align="left">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 18,
        idxTo: 19,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[18, 19]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around`,
  t => {
    const str = `<table align="   left  \t ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    t.equal(applyFixes(str, messages), `<table align="left">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 14,
        idxTo: 25,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [14, 17],
            [21, 25]
          ]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  t => {
    const str = `<table align="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 14,
        idxTo: 17,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  t => {
    const str = `<span align=".jpg">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 6,
        idxTo: 18,
        message: `Tag "span" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  t => {
    const str = `<zzz align=".jpg" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 5,
        idxTo: 17,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 04. wrong value - legend/caption
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${35}m${`legend/caption`}\u001b[${39}m`} - out of whack value`,
  t => {
    const str = `<legend align="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 15,
        idxTo: 22,
        message: `Unrecognised value: "tralala".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${35}m${`legend/caption`}\u001b[${39}m`} - legit string with extras`,
  t => {
    const str = `<caption align="top,">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 16,
        idxTo: 20,
        message: `Unrecognised value: "top,".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${35}m${`legend/caption`}\u001b[${39}m`} - wrong value, middle`,
  t => {
    const str = `<legend align="middle">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 15,
        idxTo: 21,
        message: `Unrecognised value: "middle".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${35}m${`legend/caption`}\u001b[${39}m`} - good value`,
  t => {
    const str = `<table class="zz" id="yy" align='left' valign="xx">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 05. wrong value - img
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${35}m${`img`}\u001b[${39}m`} - out of whack value`,
  t => {
    const str = `<img align="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 12,
        idxTo: 19,
        message: `Unrecognised value: "tralala".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${35}m${`img`}\u001b[${39}m`} - legit string with extras`,
  t => {
    const str = `<img align="top,">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 12,
        idxTo: 16,
        message: `Unrecognised value: "top,".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.03 - ${`\u001b[${35}m${`img`}\u001b[${39}m`} - wrong value, justify`,
  t => {
    const str = `<img align="justify">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 12,
        idxTo: 19,
        message: `Unrecognised value: "justify".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`05.04 - ${`\u001b[${35}m${`img`}\u001b[${39}m`} - good value`, t => {
  const str = `<img id="yy" align='bottom' class="zz">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

// 06. wrong value - table
// -----------------------------------------------------------------------------

t.test(
  `06.01 - ${`\u001b[${35}m${`table`}\u001b[${39}m`} - out of whack value`,
  t => {
    const str = `<table align="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 14,
        idxTo: 21,
        message: `Unrecognised value: "tralala".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${35}m${`table`}\u001b[${39}m`} - legit string with extras`,
  t => {
    const str = `<table align="left,">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 14,
        idxTo: 19,
        message: `Unrecognised value: "left,".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${35}m${`table`}\u001b[${39}m`} - wrong value, top`,
  t => {
    const str = `<table align="top">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 14,
        idxTo: 17,
        message: `Unrecognised value: "top".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`06.04 - ${`\u001b[${35}m${`table`}\u001b[${39}m`} - good value`, t => {
  const str = `<table id='yy' align='left' class='zz'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

// 07. wrong value - div
// -----------------------------------------------------------------------------

t.test(
  `07.01 - ${`\u001b[${35}m${`div`}\u001b[${39}m`} - out of whack value`,
  t => {
    const str = `<div align="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 12,
        idxTo: 19,
        message: `Unrecognised value: "tralala".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `07.02 - ${`\u001b[${35}m${`div`}\u001b[${39}m`} - legit string with extras`,
  t => {
    const str = `<div align="left,">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 12,
        idxTo: 17,
        message: `Unrecognised value: "left,".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `07.03 - ${`\u001b[${35}m${`div`}\u001b[${39}m`} - wrong value, top`,
  t => {
    const str = `<div align="top">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 12,
        idxTo: 15,
        message: `Unrecognised value: "top".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`07.04 - ${`\u001b[${35}m${`div`}\u001b[${39}m`} - good value`, t => {
  const str = `<div id='yy' align='left' class='zz'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

// 08. wrong value - td
// -----------------------------------------------------------------------------

t.test(
  `08.01 - ${`\u001b[${35}m${`td`}\u001b[${39}m`} - out of whack value`,
  t => {
    const str = `<td align="tralala">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 11,
        idxTo: 18,
        message: `Unrecognised value: "tralala".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `08.02 - ${`\u001b[${35}m${`td`}\u001b[${39}m`} - legit string with extras`,
  t => {
    const str = `<td class="zz" align="left," id='yy'>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 22,
        idxTo: 27,
        message: `Unrecognised value: "left,".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `08.03 - ${`\u001b[${35}m${`td`}\u001b[${39}m`} - wrong value, top`,
  t => {
    const str = `<td align="top">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-align": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-align",
        idxFrom: 11,
        idxTo: 14,
        message: `Unrecognised value: "top".`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`08.04 - ${`\u001b[${35}m${`td`}\u001b[${39}m`} - good value`, t => {
  const str = `<td id='yy' align='left' class='zz'>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-align": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});
