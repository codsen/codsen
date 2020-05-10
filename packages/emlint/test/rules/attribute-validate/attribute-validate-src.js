import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no src, error level 0`,
  (t) => {
    const str = `<img><div>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.same(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no src, error level 1`,
  (t) => {
    const str = `<img><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.same(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no src, error level 2`,
  (t) => {
    const str = `<img><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.same(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, img`,
  (t) => {
    const str = `<img src="https://codsen.com/test.png">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.same(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, script`,
  (t) => {
    const str = `<script src="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.same(messages, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, input`,
  (t) => {
    const str = `<input src="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.same(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, frame`,
  (t) => {
    const str = `<frame src="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.same(messages, [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, iframe`,
  (t) => {
    const str = `<iframe src="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "08.01");
    t.same(messages, [], "08.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div src="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-src",
          idxFrom: 5,
          idxTo: 29,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz src="https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-src",
          idxFrom: 5,
          idxTo: 29,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 03. wrong value
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<img src="zzz??">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-src",
          idxFrom: 10,
          idxTo: 15,
          message: `Should be an URI.`,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`,
  (t) => {
    const str = `<img src=" https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<img src="https://codsen.com">`,
      "12.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-src",
          idxFrom: 10,
          idxTo: 11,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[10, 11]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`,
  (t) => {
    // notice wrong tag name case:
    const str = `<IMG src=" zzz?? ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-src": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<IMG src="zzz??">`, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-src",
          idxFrom: 10,
          idxTo: 17,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [10, 11],
              [16, 17],
            ],
          },
        },
        {
          ruleId: "attribute-validate-src",
          idxFrom: 11,
          idxTo: 16,
          message: `Should be an URI.`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);
