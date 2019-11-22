// avanotonly

// rule: tag-name-case
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 01. recognised tag name
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${33}m${`recognised`}\u001b[${39}m`} - opening tag`, t => {
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

test(`01.02 - ${`\u001b[${33}m${`recognised`}\u001b[${39}m`} - opening tag with attrs`, t => {
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

test(`01.03 - ${`\u001b[${33}m${`recognised`}\u001b[${39}m`} - slash in front`, t => {
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

test(`01.04 - ${`\u001b[${33}m${`recognised`}\u001b[${39}m`} - slash in front`, t => {
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

test(`01.05 - ${`\u001b[${33}m${`recognised`}\u001b[${39}m`} - slash in front`, t => {
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
