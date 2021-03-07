import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains");

// 01. recognised tag name
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - opening tag`,
  (t) => {
    const str = `<tablE>`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<table>", "01.01");
    t.match(
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
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - opening tag with attrs`,
  (t) => {
    const str = `<tablE class="zzz">`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<table class="zzz">`, "02.01");
    t.match(
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
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`,
  (t) => {
    const str = `</tablE>`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "</table>", "03.01");
    t.match(
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
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`,
  (t) => {
    const str = `</tablE/>`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "</table/>", "04.01");
    t.match(
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
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`normal tag`}\u001b[${39}m`} - slash in front`,
  (t) => {
    const str = `<tablE/>`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<table/>", "05.01");
    t.match(
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
    t.end();
  }
);

// 02. DOCTYPE
// -----------------------------------------------------------------------------

// https://www.w3.org/QA/2002/04/valid-dtd-list.html
tap.test(
  `06 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html5 doctype, correct`,
  (t) => {
    const str = `<!DOCTYPE html>`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "06.01");
    t.strictSame(messages, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html5 doctype, incorrect case`,
  (t) => {
    const str = `<!doctype html>`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.strictSame(messages, [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html 4.01 doctype, correct`,
  (t) => {
    const str = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "08.01");
    t.strictSame(messages, [], "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`doctype`}\u001b[${39}m`} - html 4.01 doctype, incorrect case`,
  (t) => {
    const str = `<!doctype HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "09.01");
    t.strictSame(messages, [], "09.02");
    t.end();
  }
);

// 03. CDATA
// -----------------------------------------------------------------------------

tap.test(
  `10 - ${`\u001b[${32}m${`cdata`}\u001b[${39}m`} - cdata, correct`,
  (t) => {
    const str = `<![CDATA[x<y]]>`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "10.01");
    t.strictSame(messages, [], "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${32}m${`cdata`}\u001b[${39}m`} - cdata, incorrect case`,
  (t) => {
    const str = `<![cdata[x<y]]>`;
    const messages = verify(t, str, {
      rules: {
        "tag-name-case": 2,
      },
    });
    t.equal(applyFixes(str, messages), "<![CDATA[x<y]]>", "11.01");
    t.match(
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
    t.end();
  }
);
