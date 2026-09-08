import { test } from "uvu";
import { equal } from "uvu/assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const styles = ["\n", "\r\n", "\r"];
const withEol = (source, eol) => source.replace(/\n/g, eol);
const clean = (source, extras = false) =>
  cleanChangelogs(source, { extras }).res;
const bump = "**Note:** Version bump only for package example";

test("01 - bump-only release pruning preserves each line-ending and EOF style", () => {
  const source = `# Changelog\n\n## 2.0.0\n\n${bump}\n\n## 1.0.0\n\n- Published fix`;
  const expected = "# Changelog\n\n## 1.0.0\n\n- Published fix";
  for (const eol of styles) {
    for (const ending of ["", eol]) {
      const result = withEol(expected, eol) + ending;
      equal(
        clean(withEol(source, eol) + ending),
        result,
        `01.01 - ${JSON.stringify([eol, ending])}`,
      );
      equal(clean(result), result, `01.02 - ${JSON.stringify([eol, ending])}`);
    }
  }
});

test("02 - WIP filtering remains optional for LF CRLF and CR documents", () => {
  const source =
    "# Changelog\n\n## 2.0.0\n\n- WIP: unfinished\n- Published fix\n";
  const expected = "# Changelog\n\n## 2.0.0\n\n- Published fix\n";
  for (const eol of styles) {
    const input = withEol(source, eol);
    equal(clean(input, false), input, `02.01 - ${JSON.stringify(eol)}`);
    equal(
      clean(input, true),
      withEol(expected, eol),
      `02.02 - ${JSON.stringify(eol)}`,
    );
  }
});

test("03 - heading links SourceHut bullets and separators use physical lines consistently", () => {
  const source =
    "# Changelog\n\n# [2.0.0-beta.1](compare/(old)) (date)\n\n* Published fix\n\n* * *\n\n- See https://git.sr.ht/~owner/project/commits/abc\n";
  const ordinary =
    "# Changelog\n\n# [2.0.0-beta.1](compare/(old)) (date)\n\n- Published fix\n\n* * *\n\n- See https://git.sr.ht/~owner/project/commit/abc\n";
  const extras =
    "# Changelog\n\n## 2.0.0-beta.1 (date)\n\n- Published fix\n\n* * *\n\n- See https://git.sr.ht/~owner/project/commit/abc\n";
  for (const eol of styles) {
    const input = withEol(source, eol);
    equal(
      clean(input, false),
      withEol(ordinary, eol),
      `03.01 - ${JSON.stringify(eol)}`,
    );
    equal(
      clean(input, true),
      withEol(extras, eol),
      `03.02 - ${JSON.stringify(eol)}`,
    );
  }
});

test("04 - ordinary blank runs collapse without retaining carriage-return payload", () => {
  const source =
    "\n \t\n\n# Changelog\n\n \t\n\n## 1.0.0\n\n\n- Published fix\n\n \t\n";
  const expected = "# Changelog\n\n## 1.0.0\n\n- Published fix\n";
  for (const eol of styles) {
    const result = withEol(expected, eol);
    equal(
      clean(withEol(source, eol)),
      result,
      `04.01 - ${JSON.stringify(eol)}`,
    );
    equal(clean(result), result, `04.02 - ${JSON.stringify(eol)}`);
  }
});

test("05 - fenced literal payload and blank runs survive every line-ending style", () => {
  const source = `# Changelog\n\n\`\`\`md\n# Literal heading\n${bump}\n\n \t\n\n* WIP literal  \nhttps://git.sr.ht/~owner/project/commits/abc\n\`\`\`\n`;
  for (const eol of styles) {
    const input = withEol(source, eol);
    equal(clean(input, false), input, `05.01 - ${JSON.stringify(eol)}`);
    equal(clean(input, true), input, `05.02 - ${JSON.stringify(eol)}`);
  }
});

test("06 - indented and list-contained code retain their physical-line protection", () => {
  const source =
    "# Changelog\n\n    - WIP literal\n\n    * literal bullet  \n\n- Example\n\n  ```md\n  # Literal heading\n  - WIP literal\n  ```\n";
  for (const eol of styles) {
    const input = withEol(source, eol);
    equal(clean(input, false), input, `06.01 - ${JSON.stringify(eol)}`);
    equal(clean(input, true), input, `06.02 - ${JSON.stringify(eol)}`);
  }
});

test("07 - unclosed fenced payload keeps trailing blanks and EOF absence", () => {
  for (const tail of ["last  ", "last  \n\n \t\n\n"]) {
    const source = `# Changelog\n\n\`\`\`md\n- WIP literal\n${tail}`;
    for (const eol of styles) {
      const input = withEol(source, eol);
      equal(
        clean(input, true),
        input,
        `07.01 - ${JSON.stringify([eol, tail])}`,
      );
      equal(
        clean(clean(input, true), true),
        input,
        `07.02 - ${JSON.stringify([eol, tail])}`,
      );
    }
  }
});

test("08 - any CRLF boundary takes precedence over bare LF and CR boundaries", () => {
  const input = "# Changelog\r\r## 1.0.0\n\n* Published fix\r\n\r\n* * *\r";
  const expected =
    "# Changelog\r\n\r\n## 1.0.0\r\n\r\n- Published fix\r\n\r\n* * *\r\n";
  equal(clean(input), expected, "08.01");
  equal(clean(expected), expected, "08.02");
});

test("09 - LF takes precedence when mixed input contains no CRLF boundary", () => {
  const input = "# Changelog\r\r## 1.0.0\n\n* Published fix\r\r* * *\n";
  const expected = "# Changelog\n\n## 1.0.0\n\n- Published fix\n\n* * *\n";
  equal(clean(input), expected, "09.01");
  equal(clean(expected), expected, "09.02");
});

test("10 - selected mixed endings also normalize literal physical boundaries", () => {
  const input =
    "# Changelog\r\n\r\n```md\r# Literal heading\n\n \t\r\r- WIP literal  \n```\r";
  const expected =
    "# Changelog\r\n\r\n```md\r\n# Literal heading\r\n\r\n \t\r\n\r\n- WIP literal  \r\n```\r\n";
  equal(clean(input, false), expected, "10.01");
  equal(clean(input, true), expected, "10.02");
  equal(clean(expected, true), expected, "10.03");
});

test("11 - mixed-ending normalization does not invent an EOF newline", () => {
  const input = "# Changelog\r\r## 1.0.0\n\n* Published fix";
  const expected = "# Changelog\n\n## 1.0.0\n\n- Published fix";
  equal(clean(input), expected, "11.01");
  equal(clean(expected), expected, "11.02");
});

test("12 - empty and whitespace-only inputs retain their exact original bytes", () => {
  for (const input of [
    "",
    "\r",
    "\r\r",
    " \r\t\r\n",
    "\r \n\n",
    " \n\t\r\n\r ",
  ]) {
    equal(clean(input, false), input, `12.01 - ${JSON.stringify(input)}`);
    equal(clean(input, true), input, `12.02 - ${JSON.stringify(input)}`);
  }
});

test("13 - completely removed documents keep only their original EOF signal", () => {
  const source = `## 2.0.0\n\n${bump}\n\n## 1.0.0\n\n- WIP: unfinished`;
  for (const eol of styles) {
    for (const ending of ["", eol]) {
      equal(
        clean(withEol(source, eol) + ending, true),
        ending,
        `13.01 - ${JSON.stringify([eol, ending])}`,
      );
    }
  }
});

test("14 - CR-only HTML heading exclusions end before the next real heading", () => {
  const input =
    "# Changelog\r\r<div>\r## [0.1.0](keep)\r</div>\r\r## [1.2.3](compare)\r";
  const expected =
    "# Changelog\r\r<div>\r## [0.1.0](keep)\r</div>\r\r## 1.2.3\r";
  equal(clean(input, false), input, "14.01");
  equal(clean(input, true), expected, "14.02");
  equal(clean(expected, true), expected, "14.03");
});

test.run();
