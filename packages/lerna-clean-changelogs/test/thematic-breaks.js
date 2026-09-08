import { test } from "uvu";
import { equal } from "uvu/assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const prefix = "# Changelog\n\n";
const suffix = "\n\nRetained tail\n";
const clean = (source, extras = true) =>
  cleanChangelogs(source, { extras }).res;

test("01 - spaced and unspaced all-star thematic breaks retain their spelling", () => {
  for (const separator of [
    "***",
    "****",
    "*****",
    "* * *",
    "* **",
    "** *",
    "* * * *",
  ]) {
    const input = `${prefix}${separator}${suffix}`;
    for (const extras of [false, true]) {
      equal(
        clean(input, extras),
        input,
        `01.01 - extras ${extras} ${separator}`,
      );
    }
  }
});

test("02 - ASCII spaces and tabs inside and after separators remain exact", () => {
  for (const separator of [
    "*  *   *",
    "*\t*\t*",
    "* \t*\t *",
    "* * *  \t",
    "***\t ",
  ]) {
    const input = `${prefix}${separator}${suffix}`;
    equal(clean(input, false), input, `02.01 - ${JSON.stringify(separator)}`);
    equal(clean(input), input, `02.02 - ${JSON.stringify(separator)}`);
  }
});

test("03 - zero through three leading spaces do not change separator spelling", () => {
  for (const indentation of ["", " ", "  ", "   "]) {
    const input = `${prefix}${indentation}* * *${suffix}`;
    equal(clean(input, false), input, `03.01 - indent ${indentation.length}`);
    equal(clean(input), input, `03.02 - indent ${indentation.length}`);
  }
});

test("04 - a thematic break keeps adjacent lists separate", () => {
  const input = `${prefix}* First list\n\n* * *\n\n* Second list\n`;
  const expected = `${prefix}- First list\n\n* * *\n\n- Second list\n`;
  equal(clean(input, false), expected, "04.01");
  equal(clean(input), expected, "04.02");
  equal(clean(expected), expected, "04.03");
});

test("05 - a separator without surrounding blank lines still interrupts adjacent lists", () => {
  const input = `${prefix}* First list\n* * *\n* Second list\n`;
  const expected = `${prefix}- First list\n* * *\n- Second list\n`;
  equal(clean(input, false), expected, "05.01");
  equal(clean(input), expected, "05.02");
});

test("06 - list continuations survive on both sides of a thematic break", () => {
  const input = `${prefix}* First item\n  First continuation\n\n* * *\n\n* Second item\n  Second continuation\n`;
  const expected = `${prefix}- First item\n  First continuation\n\n* * *\n\n- Second item\n  Second continuation\n`;
  equal(clean(input, false), expected, "06.01");
  equal(clean(input), expected, "06.02");
});

test("07 - ordinary root list markers retain their existing normalization", () => {
  for (const line of [
    "* Item",
    "*  Item",
    "* \tItem",
    "* **bold**",
    "* *emphasis*",
  ]) {
    const input = `${prefix}${line}${suffix}`;
    const expected = `${prefix}-${line.slice(1)}${suffix}`;
    equal(clean(input, false), expected, `07.01 - ${line}`);
    equal(clean(input), expected, `07.02 - ${line}`);
  }
});

test("08 - indented and tab-separated list markers do not gain new normalization", () => {
  for (const line of [" * Item", "  * Item", "   * Item", "*\tItem"]) {
    const input = `${prefix}${line}${suffix}`;
    equal(clean(input, false), input, `08.01 - ${JSON.stringify(line)}`);
    equal(clean(input), input, `08.02 - ${JSON.stringify(line)}`);
  }
});

test("09 - two stars mixed markers text and escaped stars remain list near misses", () => {
  for (const line of [
    "* *",
    "* - *",
    "* * -",
    "* * * text",
    String.raw`* * \*`,
    "* * *x",
  ]) {
    const input = `${prefix}${line}${suffix}`;
    const expected = `${prefix}-${line.slice(1)}${suffix}`;
    equal(clean(input, false), expected, `09.01 - ${line}`);
    equal(clean(input), expected, `09.02 - ${line}`);
  }
});

test("10 - NBSP and form feed do not become thematic-break spacing", () => {
  for (const line of ["* \u00a0* *", "* *\u00a0 *", "* \f* *", "* *\f *"]) {
    const input = `${prefix}${line}${suffix}`;
    const expected = `${prefix}-${line.slice(1)}${suffix}`;
    equal(clean(input, false), expected, `10.01 - ${JSON.stringify(line)}`);
    equal(clean(input), expected, `10.02 - ${JSON.stringify(line)}`);
  }
});

test("11 - near misses without the existing asterisk-space prefix stay unchanged", () => {
  for (const line of [
    "**",
    "*+*",
    String.raw`\* * *`,
    "*\u00a0* *",
    "*\f* *",
  ]) {
    const input = `${prefix}${line}${suffix}`;
    equal(clean(input, false), input, `11.01 - ${JSON.stringify(line)}`);
    equal(clean(input), input, `11.02 - ${JSON.stringify(line)}`);
  }
});

test("12 - nested list markers and indented thematic breaks retain their spelling", () => {
  const input = `${prefix}* Parent\n  * Child\n\n  * * *\n\n  Retained continuation\n`;
  const expected = `${prefix}- Parent\n  * Child\n\n  * * *\n\n  Retained continuation\n`;
  equal(clean(input, false), expected, "12.01");
  equal(clean(input), expected, "12.02");
});

test("13 - fence and indented-code examples preserve their original asterisks", () => {
  const input = `${prefix}\`\`\`md\n* * *\n* ordinary literal\n\`\`\`\n\n    * * *\n    * ordinary literal\n\n\t* * *\n\t* ordinary literal\n`;
  equal(clean(input, false), input, "13.01");
  equal(clean(input), input, "13.02");
});

test("14 - separator spelling and normalized lists preserve EOL and EOF policy", () => {
  const input = `${prefix}* First list\n\n* * *\n\n* Second list`;
  const expected = `${prefix}- First list\n\n* * *\n\n- Second list`;
  for (const eol of ["\n", "\r\n"]) {
    for (const ending of ["", eol]) {
      const source = input.replace(/\n/g, eol) + ending;
      const result = expected.replace(/\n/g, eol) + ending;
      for (const extras of [false, true]) {
        equal(
          clean(source, extras),
          result,
          `14.01 - extras ${extras} ${JSON.stringify([eol, ending])}`,
        );
        equal(
          clean(result, extras),
          result,
          `14.02 - extras ${extras} ${JSON.stringify([eol, ending])}`,
        );
      }
    }
  }
});

test.run();
