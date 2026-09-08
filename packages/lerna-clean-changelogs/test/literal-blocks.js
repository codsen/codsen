import { test } from "uvu";
import { equal } from "uvu/assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const prefix = "# Changelog\n\n## 2.0.0\n\n";
const clean = (source, extras) => cleanChangelogs(source, { extras }).res;

test("01 - backtick fences preserve every changelog cleanup trigger", () => {
  const input = `${prefix}\`\`\`md
# Literal heading

**Note:** Version bump only for package example
- WIP: literal text
* literal bullet
## [1.2.3](https://example.com/compare)
\`\`\`
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `01.01 - extras ${extras}`);
  }
});

test("02 - tilde fences preserve text and allow backticks in their info string", () => {
  const input = `${prefix}~~~md \`example\` WIP
# Literal heading
**Note:** Version bump only for package example
* literal bullet
~~~
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `02.01 - extras ${extras}`);
  }
});

test("03 - shorter and different-character fences do not close the block", () => {
  const input = `${prefix}\`\`\`\`md
\`\`\`
~~~
**Note:** Version bump only for package example
- WIP: literal text
\`\`\`\`\`
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `03.01 - extras ${extras}`);
  }
});

test("04 - closing fences reject trailing text and accept trailing whitespace", () => {
  const input = `${prefix}~~~md
~~~ trailing text
**Note:** Version bump only for package example
~~~ \t

- WIP: actual entry
- Published fix
`;
  equal(clean(input, false), input, "04.01");
  equal(
    clean(input, true),
    input.replace("- WIP: actual entry\n", ""),
    "04.02",
  );
});

test("05 - up to three spaces indent a fence and a four-space fence stays payload", () => {
  const input = `${prefix}   \`\`\`md
    \`\`\`
**Note:** Version bump only for package example
   \`\`\`
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `05.01 - extras ${extras}`);
  }
});

test("06 - backticks in a backtick info string prevent a fence from opening", () => {
  const input = `${prefix}\`\`\`md\`invalid
- WIP: ordinary entry
- Published fix
`;
  equal(clean(input, false), input, "06.01");
  equal(
    clean(input, true),
    input.replace("- WIP: ordinary entry\n", ""),
    "06.02",
  );
});

test("07 - fewer than three markers do not protect ordinary entries", () => {
  for (const marker of ["``", "~~"]) {
    const input = `${prefix}${marker}\n- WIP: ordinary entry\n- Published fix\n`;
    equal(clean(input, false), input, `07.01 - ${marker}`);
    equal(
      clean(input, true),
      input.replace("- WIP: ordinary entry\n", ""),
      `07.02 - ${marker}`,
    );
  }
});

test("08 - literal blank runs and whitespace are preserved inside closed fences", () => {
  const input = `${prefix}\`\`\`text\nfirst  \n\n \t\n\nlast\t \n\`\`\`\n\n\n`;
  const expected = input.slice(0, -2);
  for (const extras of [false, true]) {
    equal(clean(input, extras), expected, `08.01 - extras ${extras}`);
    equal(clean(expected, extras), expected, `08.02 - extras ${extras}`);
  }
});

test("09 - SourceHut corrections apply outside literal fences only", () => {
  const url = "https://git.sr.ht/~owner/project/commits/abc123";
  const input = `${prefix}\`\`\`text\n${url}\n\`\`\`\n\n- See ${url}\n`;
  const expected = `${prefix}\`\`\`text\n${url}\n\`\`\`\n\n- See https://git.sr.ht/~owner/project/commit/abc123\n`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), expected, `09.01 - extras ${extras}`);
  }
});

test("10 - ordinary entries beside literal examples still receive cleanup", () => {
  const input = `${prefix}- WIP: actual entry

\`\`\`md
- WIP: literal text
**Note:** Version bump only for package example
\`\`\`

**Note:** Version bump only for package example

* Published fix
`;
  const expected = `${prefix}- WIP: actual entry

\`\`\`md
- WIP: literal text
**Note:** Version bump only for package example
\`\`\`

- Published fix
`;
  equal(clean(input, false), expected, "10.01");
  equal(
    clean(input, true),
    expected.replace("- WIP: actual entry\n\n", ""),
    "10.02",
  );
});

test("11 - indented code at the beginning keeps its initial indentation", () => {
  const input =
    "    # Literal heading\n    - WIP: literal text\n    * literal bullet\n";
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `11.01 - extras ${extras}`);
  }
});

test("12 - indented code preserves nonblank trailing spaces and EOF absence", () => {
  const input = `${prefix}    first  \n    - WIP: literal text\t  `;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `12.01 - extras ${extras}`);
  }
});

test("13 - indented code preserves internal blank runs and SourceHut spelling", () => {
  const input = `${prefix}    # Literal heading\n\n  \t\n\n    https://git.sr.ht/~owner/project/commits/abc123\n    - WIP: literal text\n`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `13.01 - extras ${extras}`);
  }
});

test("14 - four-space paragraph continuation remains ordinary prose", () => {
  const input = `${prefix}Published paragraph
    WIP continuation
    https://git.sr.ht/~owner/project/commits/abc123
`;
  const expected = input.replace("/commits/", "/commit/");
  equal(clean(input, false), expected, "14.01");
  equal(
    clean(input, true),
    expected.replace("    WIP continuation\n", ""),
    "14.02",
  );
});

test("15 - indented code stops before an unindented ordinary entry", () => {
  const input = `${prefix}    - WIP: literal text

- WIP: ordinary entry
- Published fix
`;
  equal(clean(input, false), input, "15.01");
  equal(
    clean(input, true),
    input.replace("- WIP: ordinary entry\n", ""),
    "15.02",
  );
});

test("16 - a fence directly on a bullet marker preserves its container spelling", () => {
  const input = `${prefix}* \`\`\`md
  # Literal heading
  - WIP: literal text
  https://git.sr.ht/~owner/project/commits/abc123
  \`\`\`
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `16.01 - extras ${extras}`);
  }
});

test("17 - fences in list continuation blocks preserve their contents", () => {
  const input = `${prefix}- Published example

  \`\`\`md
  # Literal heading
  - WIP: literal text


  \`\`\`
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `17.01 - extras ${extras}`);
  }
});

test("18 - ordered-list fences use the complete marker indentation", () => {
  const input = `${prefix}10. ~~~md
    # Literal heading
    - WIP: literal text
    https://git.sr.ht/~owner/project/commits/abc123
    ~~~
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `18.01 - extras ${extras}`);
  }
});

test("19 - nested list fences preserve cleanup-triggering content", () => {
  const input = `${prefix}- Parent
  - Child

    \`\`\`md
    # Literal heading
    - WIP: literal text
    \`\`\`
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `19.01 - extras ${extras}`);
  }
});

test("20 - blockquote fences preserve literal lines and blank quote markers", () => {
  const input = `${prefix}> \`\`\`md
> # Literal heading
> - WIP: literal text
>
>
> https://git.sr.ht/~owner/project/commits/abc123
> \`\`\`
`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `20.01 - extras ${extras}`);
  }
});

test("21 - nested blockquote and list containers preserve their fences", () => {
  for (const block of [
    "> > ~~~md\n> > # Literal heading\n> > - WIP: literal text\n> > ~~~\n",
    "> - ```md\n>   # Literal heading\n>   - WIP: literal text\n>   ```\n",
  ]) {
    const input = prefix + block;
    for (const extras of [false, true]) {
      equal(clean(input, extras), input, `21.01 - extras ${extras} ${block}`);
    }
  }
});

test("22 - missing blockquote markers end an unclosed contained fence", () => {
  const input = `${prefix}> \`\`\`md
> - WIP: literal text

- WIP: ordinary entry
- Published fix
`;
  equal(clean(input, false), input, "22.01");
  equal(
    clean(input, true),
    input.replace("- WIP: ordinary entry\n", ""),
    "22.02",
  );
});

test("23 - a sibling list item ends an unclosed list fence", () => {
  const input = `${prefix}- \`\`\`md
  - WIP: literal text
- WIP: ordinary sibling
- Published sibling
`;
  equal(clean(input, false), input, "23.01");
  equal(
    clean(input, true),
    input.replace("- WIP: ordinary sibling\n", ""),
    "23.02",
  );
});

test("24 - unclosed root fences preserve trailing payload and final newline state", () => {
  for (const tail of ["last  ", "last  \n", "last  \n\n \t\n\n"]) {
    const input = `${prefix}\`\`\`md\n- WIP: literal text\n${tail}`;
    for (const extras of [false, true]) {
      equal(
        clean(input, extras),
        input,
        `24.01 - extras ${extras} ${JSON.stringify(tail)}`,
      );
      equal(
        clean(clean(input, extras), extras),
        input,
        `24.02 - extras ${extras} ${JSON.stringify(tail)}`,
      );
    }
  }
});

test("25 - unclosed container fences preserve their final literal line", () => {
  for (const block of [
    "> ~~~md\n> - WIP: literal text  ",
    "- ```md\n  - WIP: literal text  ",
  ]) {
    const input = prefix + block;
    for (const extras of [false, true]) {
      equal(clean(input, extras), input, `25.01 - extras ${extras} ${block}`);
    }
  }
});

test("26 - literal preservation follows the document LF or CRLF style", () => {
  const source = `${prefix}\`\`\`md\n# Literal heading\n\n \t\n\n- WIP: literal text\n\`\`\`\n`;
  for (const eol of ["\n", "\r\n"]) {
    const input = source.replace(/\n/g, eol);
    for (const extras of [false, true]) {
      equal(
        clean(input, extras),
        input,
        `26.01 - extras ${extras} ${JSON.stringify(eol)}`,
      );
    }
  }
});

test("27 - blank lines after indented code use ordinary document EOF cleanup", () => {
  const code = `${prefix}    - WIP: literal text\n    last  `;
  const input = `${code}\n\n \t\n\n`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), `${code}\n`, `27.01 - extras ${extras}`);
  }
});

test("28 - a tab at the start of a document establishes indented code", () => {
  const input = "\t# Literal heading\n\t- WIP: literal text\n\tlast  \n";
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `28.01 - extras ${extras}`);
  }
});

test("29 - a fenced block can interrupt an ordinary paragraph", () => {
  const input = `${prefix}Published paragraph\n\`\`\`md\n- WIP: literal text\n\`\`\`\n`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `29.01 - extras ${extras}`);
  }
});

test("30 - leading ordinary whitespace rebases literal protection and preserves the document heading", () => {
  const body = `# Changelog

## 3.0.0

- WIP: ordinary entry

## 2.0.0

\`\`\`md
# Literal heading
- WIP: literal text
\`\`\`
`;
  const input = ` \n\t\n  ${body}`;
  equal(clean(input, false), body, "30.01");
  equal(
    clean(input, true),
    body.replace("## 3.0.0\n\n- WIP: ordinary entry\n\n", ""),
    "30.02",
  );
});

test("31 - apparent fences inside HTML blocks remain ordinary cleanup text", () => {
  const url = "https://git.sr.ht/~owner/project/commits/abc123";
  for (const [open, close] of [
    ["<pre>", "</pre>"],
    ["<!--", "-->"],
    ['<custom-data title="example">', "</custom-data>"],
  ]) {
    const input = `${prefix}${open}\n\`\`\`md\n- WIP: ordinary HTML text\n${url}\n\`\`\`\n${close}\n\n\`\`\`md\n# Literal heading\n- WIP: literal text\n${url}\n\`\`\`\n`;
    const expected = input.replace("/commits/", "/commit/");
    equal(clean(input, false), expected, `31.01 - ${open}`);
    equal(
      clean(input, true),
      expected.replace("- WIP: ordinary HTML text\n", ""),
      `31.02 - ${open}`,
    );
  }
});

test("32 - ending a blockquote paragraph permits a following ordered-list fence", () => {
  const input = `${prefix}> paragraph\n2. \`\`\`md\n   WIP\n   \`\`\`\n`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `32.01 - extras ${extras}`);
  }
});

test("33 - ending a bullet-list paragraph permits a following ordered-list fence", () => {
  const input = `${prefix}- paragraph\n2. \`\`\`md\n   WIP\n   \`\`\`\n`;
  for (const extras of [false, true]) {
    equal(clean(input, extras), input, `33.01 - extras ${extras}`);
  }
});

test("34 - an ordered marker other than one cannot interrupt an ordinary root paragraph", () => {
  const input = `${prefix}paragraph\n2. \`\`\`md\n   WIP\n   \`\`\`\n`;
  equal(clean(input, false), input, "34.01");
  equal(clean(input, true), input.replace("   WIP\n", ""), "34.02");
});

test("35 - a blank after an initially empty list item permits an independent fence", () => {
  for (const input of [
    "-\n\n  ```md\n WIP literal\n  ```\n",
    "2.\n\n   ```md\n WIP literal\n   ```\n",
    "> -\n>\n>   ```md\n> WIP literal\n>   ```\n",
  ]) {
    for (const extras of [false, true]) {
      equal(clean(input, extras), input, `35.01 - extras ${extras} ${input}`);
    }
  }
});

test.run();
