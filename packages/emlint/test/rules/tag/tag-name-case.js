// rule: tag-name-case
// -----------------------------------------------------------------------------

const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");
// const astDeepContains = require("ast-deep-contains");

// 01. recognised tag name
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - opening tag`,
  (t) => {
    const str = `<tablE>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<table>");
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: "Bad tag name case.",
        fix: {
          ranges: [[1, 6, "table"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - opening tag with attrs`,
  (t) => {
    const str = `<tablE class="zzz">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table class="zzz">`);
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: "Bad tag name case.",
        fix: {
          ranges: [[1, 6, "table"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`,
  (t) => {
    const str = `</tablE>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "</table>");
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 2,
        idxTo: 7,
        message: "Bad tag name case.",
        fix: {
          ranges: [[2, 7, "table"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`,
  (t) => {
    const str = `</tablE/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "</table/>");
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 2,
        idxTo: 7,
        message: "Bad tag name case.",
        fix: {
          ranges: [[2, 7, "table"]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`,
  (t) => {
    const str = `<tablE/>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<table/>");
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: "Bad tag name case.",
        fix: {
          ranges: [[1, 6, "table"]],
        },
      },
    ]);
    t.end();
  }
);

// 02. DOCTYPE
// -----------------------------------------------------------------------------

// https://www.w3.org/QA/2002/04/valid-dtd-list.html
t.test(
  `02.01 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html5 doctype, correct`,
  (t) => {
    const str = `<!DOCTYPE html>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html5 doctype, incorrect case`,
  (t) => {
    const str = `<!doctype html>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html 4.01 doctype, correct`,
  (t) => {
    const str = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html 4.01 doctype, incorrect case`,
  (t) => {
    const str = `<!doctype HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 03. CDATA
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${32}m${`cdata`}\u001b[${39}m`} - cdata, correct`,
  (t) => {
    const str = `<![CDATA[x<y]]>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${32}m${`cdata`}\u001b[${39}m`} - cdata, incorrect case`,
  (t) => {
    const str = `<![cdata[x<y]]>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<![CDATA[x<y]]>");
    t.match(messages, [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Bad tag name case.",
        fix: {
          ranges: [[3, 8, "CDATA"]],
        },
      },
    ]);
    t.end();
  }
);
