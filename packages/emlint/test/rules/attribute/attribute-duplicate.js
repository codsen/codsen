import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 00. false positives
// -----------------------------------------------------------------------------

tap.test(
  `00.01 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - one class each`,
  (t) => {
    const str = `<td class="z"><a class="z">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

tap.test(
  `00.02 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - duplicate but rule disabled`,
  (t) => {
    const str = `<td class="x" class="y"><a class="z" class="yo">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

tap.test(
  `00.03 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - unrecognised attr duplicated, rule disabled`,
  (t) => {
    const str = `<td yo="z" yo="tralalaa"><a mo="z" mo="haha">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

tap.test(
  `00.04 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - value-less attributes repeated`,
  (t) => {
    const str = `<td nowrap nowrap><a class="z">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 01. checks
// -----------------------------------------------------------------------------

tap.test(`01.01 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - off`, (t) => {
  const str = `<a class="bb" id="cc" class="dd">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-duplicate": 0,
    },
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

tap.test(
  `01.02 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - class merged`,
  (t) => {
    const str = `<a class="bb" id="bb" class="dd">`;
    const fixed = `<a class="bb dd" id="bb">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 2,
      },
    });
    // can fix, classes will be merged:
    t.equal(applyFixes(str, messages), fixed);
    t.match(messages, [
      {
        ruleId: "attribute-duplicate",
        idxFrom: 0,
        idxTo: 33,
        message: `Duplicate attribute "class".`,
      },
    ]);
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - id merged`,
  (t) => {
    const str = `<a class="cc" id="ee" id="dd" style="id" id="ff">`;
    const fixed = `<a class="cc" id="dd ee ff" style="id">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 2,
      },
    });
    // can fix, classes will be merged:
    t.equal(applyFixes(str, messages), fixed);
    t.match(messages, [
      {
        ruleId: "attribute-duplicate",
        idxFrom: 0,
        idxTo: 49,
        message: `Duplicate attribute "id".`,
      },
    ]);
    t.end();
  }
);

tap.test(`01.04 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - on`, (t) => {
  const str = `<a href="bb" href="bb" href="dd">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // can't fix "href":
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-duplicate", // second and onwards is reported, not first
      idxFrom: 13,
      idxTo: 22,
      message: `Duplicate attribute "href".`,
      fix: null,
    },
    {
      ruleId: "attribute-duplicate",
      idxFrom: 23,
      idxTo: 32,
      message: `Duplicate attribute "href".`,
      fix: null,
    },
  ]);
  t.end();
});

tap.test(
  `01.05 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - unrecognised attr duplicated, rule disabled`,
  (t) => {
    const str = `<td yo="z" yo="tralalaa"><a mo="z" mo="haha">z</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-duplicate": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-duplicate",
        idxFrom: 11,
        idxTo: 24,
        message: `Duplicate attribute "yo".`,
        fix: null,
      },
      {
        ruleId: "attribute-duplicate",
        idxFrom: 35,
        idxTo: 44,
        message: `Duplicate attribute "mo".`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 02. merging values
// -----------------------------------------------------------------------------

tap.test(`02.01 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - on`, (t) => {
  const str = `<a class="" class=" ll  \t nn " class="" class=" mm  kk  " id="" class="oo" id="uu" class="">`;
  const fixed = `<a class="kk ll mm nn oo" id="uu">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // will fix:
  t.equal(applyFixes(str, messages), fixed);
  t.end();
});
