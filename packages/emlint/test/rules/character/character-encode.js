import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// no false positives
// -----------------------------------------------------------------------------

test(`01 - no false positives`, () => {
  [
    // whitespace
    ``,
    ` `,
    `\n\r\t`,
    // text
    `a`,
    `<span>a</span>`,
    `fsdhk\nfdfgh kj `,
    // healthy encoded entities
    `<span>&pound;</span>`,
    `<span>&pound;10</span>`,
    `<span>&#xA3;</span>`,
    `<span>&#xA3;10</span>`,
    // malformed encoded entities
    `<span>&nbs;</span>`,
    `<span>&nbsp</span>`,
    `<span>& nbsp;</span>`,
    //
    `abc&nbs;def`,
    `abc&nbspdef`,
    `abc& nbsp;def`,
    //
    `abc &nbs;def`,
    `abc &nbspdef`,
    `abc & nbsp;def`,
    //
    `abc&nbs; def`,
    `abc&nbsp def`,
    `abc& nbsp; def`,
    //
    `abc &nbs; def`,
    `abc &nbsp def`,
    `abc & nbsp; def`,
    // esp tags
    `{% if count > 1 %}{% if count > 1 %}`,
    `{% if count < 1 %}{% if count > 1 %}`,
    `{% if count < 1 %}{% if count < 1 %}`,
    `{% if count > 1 %}{% if count < 1 %}`,
    //
    `{{ a > b }}`,
    //
    `{%- if count > 1 -%}{%- if count > 1 -%}`,
    `{%- if count < 1 -%}{%- if count > 1 -%}`,
    `{%- if count < 1 -%}{%- if count < 1 -%}`,
    `{%- if count > 1 -%}{%- if count < 1 -%}`,
    `{%- set z = "x" -%}`,
    `<div class="x">{%- set z = "x" -%}</div>`,
    // broken comments
    `a<!--b->c`,
    `a<!-b->c`,
    `a<!-b-->c`,
    // `a<--b-->c`, // TODO
  ].forEach((str) => {
    let messages1 = verify(not, str, {
      rules: {
        "character-encode": 2,
      },
    });
    equal(messages1, [], `${JSON.stringify(str, null, 0)} - default setting`);

    // const messages2 = verify(not, str, {
    //   rules: {
    //     "character-encode": [2, "named"],
    //   },
    // });
    // equal(
    //   messages2,
    //   [],
    //   `${JSON.stringify(str, null, 0)} - named setting`
    // );

    // const messages3 = verify(not, str, {
    //   rules: {
    //     "character-encode": [2, "numeric"],
    //   },
    // });
    // equal(
    //   messages3,
    //   [],
    //   `${JSON.stringify(str, null, 0)} - numeric setting`
    // );
  });
});

// basic tests, no config
// -----------------------------------------------------------------------------

test(`02 - unencoded characters`, () => {
  let str = "£100";
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&pound;"]],
        },
      },
    ],
    "02.01"
  );
  equal(applyFixes(str, messages), "&pound;100", "02.01");
});

test(`03 - unencoded characters`, () => {
  let str = "£100";
  let messages = verify(not, str, {
    rules: {
      all: 1,
    },
  });
  equal(applyFixes(str, messages), "&pound;100", "03.01");
});

test(`04 - named`, () => {
  let str = "£100";
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "named"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&pound;"]],
        },
      },
    ],
    "04.01"
  );
  equal(applyFixes(str, messages), "&pound;100", "04.01");
});

test(`05 - numeric`, () => {
  let str = "£100";
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "numeric"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&#xA3;"]],
        },
      },
    ],
    "05.01"
  );
  equal(applyFixes(str, messages), "&#xA3;100", "05.01");
});

test(`06 - defaults`, () => {
  let str = "£100";
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&pound;"]],
        },
      },
    ],
    "06.01"
  );
  equal(applyFixes(str, messages), "&pound;100", "06.01");
});

test(`07 - unrecognised`, () => {
  let str = "£100";
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "yo"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded pound sign character.",
        fix: {
          ranges: [[0, 1, "&pound;"]],
        },
      },
    ],
    "07.01"
  );
  equal(applyFixes(str, messages), "&pound;100", "07.01");
});

// email-unfriendly entities
// -----------------------------------------------------------------------------

test(`08 - email not-friendly named char`, () => {
  let str = "\u0424"; // &Fcy; or Ф
  let messages = verify(not, str, {
    rules: {
      "character-encode": 1,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 1,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]],
        },
      },
    ],
    "08.01"
  );
  equal(applyFixes(str, messages), "&#x424;", "08.01");
});

test(`09 - email not-friendly named char`, () => {
  let str = "\u0424"; // &Fcy; or Ф
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "named"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]],
        },
      },
    ],
    "09.01"
  );
  equal(applyFixes(str, messages), "&#x424;", "09.01");
});

test(`10 - email not-friendly named char`, () => {
  let str = "\u0424"; // &Fcy; or Ф
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "numeric"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]],
        },
      },
    ],
    "10.01"
  );
  equal(applyFixes(str, messages), "&#x424;", "10.01");
});

// visible HTML-unfriendly chars
// -----------------------------------------------------------------------------

test(`11 - brackets and quotes into named`, () => {
  let str = `><'"&`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "named"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded greater than character.",
        fix: {
          ranges: [[0, 1, "&gt;"]],
        },
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        line: 1,
        message: "Unencoded less than character.",
        fix: {
          ranges: [[1, 2, "&lt;"]],
        },
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        message: "Unencoded double quotes character.",
        fix: {
          ranges: [[3, 4, "&quot;"]],
        },
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        line: 1,
        message: "Unencoded ampersand character.",
        fix: {
          ranges: [[4, 5, "&amp;"]],
        },
      },
    ],
    "11.01"
  );
  equal(applyFixes(str, messages), "&gt;&lt;'&quot;&amp;", "11.01");
});

test(`12 - brackets and quotes into numeric`, () => {
  let str = `><'"&`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "numeric"],
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded greater than character.",
        fix: {
          ranges: [[0, 1, "&#x3E;"]],
        },
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        line: 1,
        message: "Unencoded less than character.",
        fix: {
          ranges: [[1, 2, "&#x3C;"]],
        },
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        message: "Unencoded double quotes character.",
        fix: {
          ranges: [[3, 4, "&#x22;"]],
        },
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        line: 1,
        message: "Unencoded ampersand character.",
        fix: {
          ranges: [[4, 5, "&#x26;"]],
        },
      },
    ],
    "12.01"
  );
  equal(applyFixes(str, messages), "&#x3E;&#x3C;'&#x22;&#x26;", "12.01");
});

test(`13`, () => {
  let str = `<span>£10</span>`;
  let fixed = `<span>&pound;10</span>`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "named"],
    },
  });
  equal(applyFixes(str, messages), fixed, "13.01");
  equal(messages.length, 1, "13.02");
});

test(`14`, () => {
  let str = `<span>£10</span>`;
  let fixed = `<span>&#xA3;10</span>`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": [2, "numeric"],
    },
  });
  equal(applyFixes(str, messages), fixed, "14.01");
  equal(messages.length, 1, "14.02");
});

test(`15 - within HTML comments`, () => {
  let str = `<!--£10 offer module starts-->`;
  let fixed = `<!--&pound;10 offer module starts-->`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "15.01");
  equal(messages.length, 1, "15.02");
});

test(`16 - within not-outlook HTML comments`, () => {
  let str = `<!--[if !mso]><!-->£10<!--<![endif]-->`;
  let fixed = `<!--[if !mso]><!-->&pound;10<!--<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "16.01");
  equal(messages.length, 1, "16.02");
});

test(`17 - within outlook-only HTML comments`, () => {
  let str = `<!--[if mso]>£10<![endif]-->`;
  let fixed = `<!--[if mso]>&pound;10<![endif]-->`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "17.01");
  equal(messages.length, 1, "17.02");
});

test(`18 - within CSS comments`, () => {
  let str = `<style>/*£10 offer module starts*/</style><body>z</body>`;
  let fixed = `<style>/*&pound;10 offer module starts*/</style><body>z</body>`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "18.01");
  equal(messages.length, 1, "18.02");
});

test(`19 - ampersand as text, error`, () => {
  let str = `<table>
  <tr>
    <td>
      M&M'S
    </td>
  </tr>
</table>`;
  let fixed = `<table>
  <tr>
    <td>
      M&amp;M'S
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "19.01");
  equal(messages.length, 1, "19.02");
});

test(`20 - ampersand as text, off`, () => {
  let str = `<table>
  <tr>
    <td>
      M&M'S
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": 0,
    },
  });
  equal(messages, [], "20.01");
});

test(`21 - same but cleaned with Detergent`, () => {
  let str = `<table>
  <tr>
    <td>
      M&amp;M&rsquo;S
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
    },
  });
  equal(messages, [], "21.01");
});

// 05. mixed rules
// -----------------------------------------------------------------------------

test(`22 - broken closing comment, dash missing`, () => {
  let str = "a<!--b->c";
  let fixed = "a<!--b-->c";
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
      "comment-closing-malformed": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "comment-closing-malformed",
        severity: 2,
        idxFrom: 6,
        idxTo: 8,
        message: `Malformed closing comment tag.`,
        fix: {
          ranges: [[6, 8, "-->"]],
        },
      },
    ],
    "22.01"
  );
  equal(applyFixes(str, messages), fixed, "22.01");
});

test(`23`, () => {
  let str = `abc&amp;nbsp;def`;
  let messages = verify(not, str, {
    rules: {
      "character-encode": 2,
    },
  });
  equal(messages, [], "23.01");
});

test(`24`, () => {
  let str = `abc&amp;nbsp;def`;
  let messages = verify(not, str, {
    rules: {
      "bad-html-entity-multiple-encoding": 2,
      "character-encode": 2,
    },
  });
  equal(applyFixes(str, messages), "abc&nbsp;def", "24.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "bad-html-entity-multiple-encoding",
        severity: 2,
        idxFrom: 3,
        idxTo: 13,
        message: "HTML entity encoding over and over.",
        fix: {
          ranges: [[3, 13, "&nbsp;"]],
        },
      },
    ],
    "24.02"
  );
  equal(messages.length, 1, "24.02");
});

test.run();
