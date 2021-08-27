import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util.js";

// no false positives
// -----------------------------------------------------------------------------

tap.test(`01 - no false positives`, (t) => {
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
    const messages1 = verify(t, str, {
      rules: {
        "character-encode": 2,
      },
    });
    t.strictSame(
      messages1,
      [],
      `${JSON.stringify(str, null, 0)} - default setting`
    );

    // const messages2 = verify(t, str, {
    //   rules: {
    //     "character-encode": [2, "named"],
    //   },
    // });
    // t.strictSame(
    //   messages2,
    //   [],
    //   `${JSON.stringify(str, null, 0)} - named setting`
    // );

    // const messages3 = verify(t, str, {
    //   rules: {
    //     "character-encode": [2, "numeric"],
    //   },
    // });
    // t.strictSame(
    //   messages3,
    //   [],
    //   `${JSON.stringify(str, null, 0)} - numeric setting`
    // );
  });
  t.end();
});

// basic tests, no config
// -----------------------------------------------------------------------------

tap.test(`02 - unencoded characters`, (t) => {
  const str = "£100";
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&pound;100", "02.02");
  t.end();
});

tap.test(`03 - unencoded characters`, (t) => {
  const str = "£100";
  const messages = verify(t, str, {
    rules: {
      all: 1,
    },
  });
  t.equal(applyFixes(str, messages), "&pound;100", "03");
  t.end();
});

tap.test(`04 - named`, (t) => {
  const str = "£100";
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "named"],
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&pound;100", "04.02");
  t.end();
});

tap.test(`05 - numeric`, (t) => {
  const str = "£100";
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "numeric"],
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&#xA3;100", "05.02");
  t.end();
});

tap.test(`06 - defaults`, (t) => {
  const str = "£100";
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2],
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&pound;100", "06.02");
  t.end();
});

tap.test(`07 - unrecognised`, (t) => {
  const str = "£100";
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "yo"],
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&pound;100", "07.02");
  t.end();
});

// email-unfriendly entities
// -----------------------------------------------------------------------------

tap.test(`08 - email not-friendly named char`, (t) => {
  const str = "\u0424"; // &Fcy; or Ф
  const messages = verify(t, str, {
    rules: {
      "character-encode": 1,
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&#x424;", "08.02");
  t.end();
});

tap.test(`09 - email not-friendly named char`, (t) => {
  const str = "\u0424"; // &Fcy; or Ф
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "named"],
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&#x424;", "09.02");
  t.end();
});

tap.test(`10 - email not-friendly named char`, (t) => {
  const str = "\u0424"; // &Fcy; or Ф
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "numeric"],
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&#x424;", "10.02");
  t.end();
});

// visible HTML-unfriendly chars
// -----------------------------------------------------------------------------

tap.test(`11 - brackets and quotes into named`, (t) => {
  const str = `><'"&`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "named"],
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&gt;&lt;'&quot;&amp;", "11.02");
  t.end();
});

tap.test(`12 - brackets and quotes into numeric`, (t) => {
  const str = `><'"&`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "numeric"],
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), "&#x3E;&#x3C;'&#x22;&#x26;", "12.02");
  t.end();
});

tap.test(`13`, (t) => {
  const str = `<span>£10</span>`;
  const fixed = `<span>&pound;10</span>`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "named"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "13.01");
  t.equal(messages.length, 1, "13.02");
  t.end();
});

tap.test(`14`, (t) => {
  const str = `<span>£10</span>`;
  const fixed = `<span>&#xA3;10</span>`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": [2, "numeric"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "14.01");
  t.equal(messages.length, 1, "14.02");
  t.end();
});

tap.test(`15 - within HTML comments`, (t) => {
  const str = `<!--£10 offer module starts-->`;
  const fixed = `<!--&pound;10 offer module starts-->`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "15.01");
  t.equal(messages.length, 1, "15.02");
  t.end();
});

tap.test(`16 - within not-outlook HTML comments`, (t) => {
  const str = `<!--[if !mso]><!-->£10<!--<![endif]-->`;
  const fixed = `<!--[if !mso]><!-->&pound;10<!--<![endif]-->`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "16.01");
  t.equal(messages.length, 1, "16.02");
  t.end();
});

tap.test(`17 - within outlook-only HTML comments`, (t) => {
  const str = `<!--[if mso]>£10<![endif]-->`;
  const fixed = `<!--[if mso]>&pound;10<![endif]-->`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "17.01");
  t.equal(messages.length, 1, "17.02");
  t.end();
});

tap.test(`18 - within CSS comments`, (t) => {
  const str = `<style>/*£10 offer module starts*/</style><body>z</body>`;
  const fixed = `<style>/*&pound;10 offer module starts*/</style><body>z</body>`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "18.01");
  t.equal(messages.length, 1, "18.02");
  t.end();
});

tap.test(`19 - ampersand as text, error`, (t) => {
  const str = `<table>
  <tr>
    <td>
      M&M'S
    </td>
  </tr>
</table>`;
  const fixed = `<table>
  <tr>
    <td>
      M&amp;M'S
    </td>
  </tr>
</table>`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "19.01");
  t.equal(messages.length, 1, "19.02");
  t.end();
});

tap.test(`20 - ampersand as text, off`, (t) => {
  const str = `<table>
  <tr>
    <td>
      M&M'S
    </td>
  </tr>
</table>`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": 0,
    },
  });
  t.strictSame(messages, [], "20");
  t.end();
});

tap.test(`21 - same but cleaned with Detergent`, (t) => {
  const str = `<table>
  <tr>
    <td>
      M&amp;M&rsquo;S
    </td>
  </tr>
</table>`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
    },
  });
  t.strictSame(messages, [], "21");
  t.end();
});

// 05. mixed rules
// -----------------------------------------------------------------------------

tap.test(`22 - broken closing comment, dash missing`, (t) => {
  const str = "a<!--b->c";
  const fixed = "a<!--b-->c";
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
      "comment-closing-malformed": 2,
    },
  });
  t.match(
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
  t.equal(applyFixes(str, messages), fixed, "22.02");
  t.end();
});

tap.test(`23`, (t) => {
  const str = `abc&amp;nbsp;def`;
  const messages = verify(t, str, {
    rules: {
      "character-encode": 2,
    },
  });
  t.strictSame(messages, [], "23");
  t.end();
});

tap.test(`24`, (t) => {
  const str = `abc&amp;nbsp;def`;
  const messages = verify(t, str, {
    rules: {
      "bad-html-entity-multiple-encoding": 2,
      "character-encode": 2,
    },
  });
  t.equal(applyFixes(str, messages), "abc&nbsp;def", "24.01");
  t.match(
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
  t.equal(messages.length, 1, "24.03");
  t.end();
});
