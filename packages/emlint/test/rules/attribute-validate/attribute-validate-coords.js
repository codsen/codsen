import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no coords, error level 0`,
  (t) => {
    const str = `<area><a><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no coords, error level 1`,
  (t) => {
    const str = `<area><a><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no coords, error level 2`,
  (t) => {
    const str = `<area><a><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, area`,
  (t) => {
    const str = `<area shape="rect" coords="0,0,82,126" href="sun.html" alt="sun">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, a`,
  (t) => {
    const str = `<a href="venus.htm" shape="circle" coords="124,58,8">Venus</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div coords="50">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 5,
          idxTo: 16,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz coords="50" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 5,
          idxTo: 16,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

// 03. area
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rect, correct`,
  (t) => {
    const str = `<area shape="rect" coords="0,0,82,126" href="sun.htm" alt="Sun">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "08.01");
    t.strictSame(messages, [], "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rect, 1 coord`,
  (t) => {
    const str = `<area shape="rect" coords="0" href="sun.htm" alt="Sun">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 27,
          idxTo: 28,
          message: `There should be 4 values.`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rect, 3 coords`,
  (t) => {
    const str = `<area shape="rect" coords="0,82,126" href="sun.htm" alt="Sun">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 27,
          idxTo: 35,
          message: `There should be 4 values.`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rect, 5 coords`,
  (t) => {
    const str = `<area shape="rect" coords="0,0,0,82,126" href="sun.htm" alt="Sun">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "11.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 27,
          idxTo: 39,
          message: `There should be 4 values.`,
          fix: null,
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - circle, correct`,
  (t) => {
    const str = `<area shape="circle" coords="124,58,8" href="venus.htm" alt="Venus">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "12.01");
    t.strictSame(messages, [], "12.02");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - circle, 1 coord`,
  (t) => {
    const str = `<area shape="circle" coords="124" href="venus.htm" alt="Venus">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 29,
          idxTo: 32,
          message: `There should be 3 values.`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - circle, 4 coords`,
  (t) => {
    const str = `<area shape="circle" coords="0,124,58,8" href="venus.htm" alt="Venus">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 29,
          idxTo: 39,
          message: `There should be 3 values.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - poly, correct`,
  (t) => {
    const str = `<area shape="poly" coords="54,241,6,97,36,107,72,217"
          href="https://developer.mozilla.org/docs/Web/API"
          target="_blank" alt="Web APIs" />`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "15.01");
    t.strictSame(messages, [], "15.02");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - poly, uneven count`,
  (t) => {
    const str = `<area shape="poly" coords="54,241,6,97,36,107,72"
          href="https://developer.mozilla.org/docs/Web/API"
          target="_blank" alt="Web APIs" />`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 27,
          idxTo: 48,
          message: `Should be an even number of values but found 7.`,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - poly, only one`,
  (t) => {
    const str = `<area shape="poly" coords="54"
          href="https://developer.mozilla.org/docs/Web/API"
          target="_blank" alt="Web APIs" />`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 27,
          idxTo: 29,
          message: `Should be an even number of values but found 1.`,
          fix: null,
        },
      ],
      "17.02"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rogue letter`,
  (t) => {
    const str = `<area shape="rect" coords="0,82a,126" href="sun.htm" alt="Sun">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 31,
          idxTo: 32,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "18.02"
    );
    t.end();
  }
);

tap.test(`19 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rogue space`, (t) => {
  const str = `<area shape="rect" coords="0,82 ,126" href="sun.htm" alt="Sun">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  t.equal(
    applyFixes(str, messages),
    `<area shape="rect" coords="0,82,126" href="sun.htm" alt="Sun">`,
    "19.01"
  );
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-coords",
        idxFrom: 31,
        idxTo: 32,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[31, 32]],
        },
      },
    ],
    "19.02"
  );
  t.end();
});

tap.test(`20 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rogue space`, (t) => {
  const str = `<area shape="rect" coords="0,8.2,126" href="sun.htm" alt="Sun">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "20.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-coords",
        idxFrom: 30,
        idxTo: 32,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ],
    "20.02"
  );
  t.end();
});

// 04. a
// -----------------------------------------------------------------------------

tap.test(`21 - ${`\u001b[${33}m${`a`}\u001b[${39}m`} - a right value`, (t) => {
  const str = `<a href="sun.htm" shape="rect" coords="0,0,82,126">The Sun</a>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "21.01");
  t.strictSame(messages, [], "21.02");
  t.end();
});

tap.test(
  `22 - ${`\u001b[${33}m${`a`}\u001b[${39}m`} - circle, two values`,
  (t) => {
    const str = `<a href="venus.htm" shape="circle" coords="124,58">Venus</a>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-coords": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "22.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-coords",
          idxFrom: 43,
          idxTo: 49,
          message: `There should be 3 values.`,
          fix: null,
        },
      ],
      "22.02"
    );
    t.end();
  }
);
