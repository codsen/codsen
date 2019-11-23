// avanotonly

// rule: tag-name-case
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 01. recognised tag name
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - opening tag`, t => {
  const str = `<tablE>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), "<table>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: "Bad tag name case.",
        fix: {
          ranges: [[1, 6, "table"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.02 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - opening tag with attrs`, t => {
  const str = `<tablE class="zzz">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), `<table class="zzz">`);
  deepContains(
    messages,
    [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: "Bad tag name case.",
        fix: {
          ranges: [[1, 6, "table"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.03 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`, t => {
  const str = `</tablE>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), "</table>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 2,
        idxTo: 7,
        message: "Bad tag name case.",
        fix: {
          ranges: [[2, 7, "table"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.04 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`, t => {
  const str = `</tablE/>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), "</table/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 2,
        idxTo: 7,
        message: "Bad tag name case.",
        fix: {
          ranges: [[2, 7, "table"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`01.05 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`, t => {
  const str = `<tablE/>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), "<table/>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 1,
        idxTo: 6,
        message: "Bad tag name case.",
        fix: {
          ranges: [[1, 6, "table"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// 02. DOCTYPE
// -----------------------------------------------------------------------------

// https://www.w3.org/QA/2002/04/valid-dtd-list.html
test(`02.01 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html5 doctype, correct`, t => {
  const str = `<!DOCTYPE html>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`02.02 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html5 doctype, incorrect case`, t => {
  const str = `<!doctype html>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), "<!DOCTYPE html>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 2,
        idxTo: 9,
        message: "Bad tag name case.",
        fix: {
          ranges: [[2, 9, "DOCTYPE"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

test(`02.03 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html 4.01 doctype, correct`, t => {
  const str = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`02.04 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html 4.01 doctype, incorrect case`, t => {
  const str = `<!doctype HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(
    applyFixes(str, messages),
    `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`
  );
  deepContains(
    messages,
    [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 2,
        idxTo: 9,
        message: "Bad tag name case.",
        fix: {
          ranges: [[2, 9, "DOCTYPE"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});

// 03. CDATA
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${32}m${`cdata`}\u001b[${39}m`} - cdata, correct`, t => {
  const str = `<![CDATA[x<y]]>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), str);
  t.deepEqual(messages, []);
});

test(`03.02 - ${`\u001b[${32}m${`cdata`}\u001b[${39}m`} - cdata, incorrect case`, t => {
  const str = `<![cdata[x<y]]>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "tag-name-case": 2
    }
  });
  t.is(applyFixes(str, messages), "<![CDATA[x<y]]>");
  deepContains(
    messages,
    [
      {
        ruleId: "tag-name-case",
        severity: 2,
        idxFrom: 3,
        idxTo: 8,
        message: "Bad tag name case.",
        fix: {
          ranges: [[3, 8, "CDATA"]]
        }
      }
    ],
    t.is,
    t.fail
  );
});
