import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// 01. recognised tag name
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - opening tag`, () => {
  let str = `<tablE>`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), "<table>", "01.01");
  compare(
    ok,
    messages,
    [
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
    ],
    "01.02"
  );
});

test(`02 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - opening tag with attrs`, () => {
  let str = `<tablE class="zzz">`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), `<table class="zzz">`, "02.01");
  compare(
    ok,
    messages,
    [
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
    ],
    "02.02"
  );
});

test(`03 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`, () => {
  let str = `</tablE>`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), "</table>", "03.01");
  compare(
    ok,
    messages,
    [
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
    ],
    "03.02"
  );
});

test(`04 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`, () => {
  let str = `</tablE/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), "</table/>", "04.01");
  compare(
    ok,
    messages,
    [
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
    ],
    "04.02"
  );
});

test(`05 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`, () => {
  let str = `<tablE/>`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), "<table/>", "05.01");
  compare(
    ok,
    messages,
    [
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
    ],
    "05.02"
  );
});

// 02. DOCTYPE
// -----------------------------------------------------------------------------

// https://www.w3.org/QA/2002/04/valid-dtd-list.html
test(`06 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html5 doctype, correct`, () => {
  let str = `<!DOCTYPE html>`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html5 doctype, incorrect case`, () => {
  let str = `<!doctype html>`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), str, "07.01");
  equal(messages, [], "07.02");
});

test(`08 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html 4.01 doctype, correct`, () => {
  let str = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  equal(messages, [], "08.02");
});

test(`09 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html 4.01 doctype, incorrect case`, () => {
  let str = `<!doctype HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), str, "09.01");
  equal(messages, [], "09.02");
});

// 03. CDATA
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${32}m${`cdata`}\u001b[${39}m`} - cdata, correct`, () => {
  let str = `<![CDATA[x<y]]>`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  equal(messages, [], "10.02");
});

test(`11 - ${`\u001b[${32}m${`cdata`}\u001b[${39}m`} - cdata, incorrect case`, () => {
  let str = `<![cdata[x<y]]>`;
  let messages = verify(not, str, {
    rules: {
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), "<![CDATA[x<y]]>", "11.01");
  compare(
    ok,
    messages,
    [
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
    ],
    "11.02"
  );
});

test.run();
