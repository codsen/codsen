import { test } from "uvu";
import { equal } from "uvu/assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const prefix = "# Changelog\n\n";
const clean = (source, extras = true) =>
  cleanChangelogs(source, { extras }).res;

test("01 - complete raw SemVer labels preserve prerelease build and large numeric text", () => {
  for (const label of [
    "0.0.0",
    "2.0.0-beta.1",
    "2.0.0-00alpha.1",
    "2.0.0+build.007",
    "2.0.0-rc.1+build.007",
    "999999999999999999999.12345678901234567890.98765432109876543210",
  ]) {
    const input = `${prefix}## [${label}](compare) (2026-09-07)\n`;
    equal(clean(input, false), input, `01.01 - ${label}`);
    equal(
      clean(input),
      `${prefix}## ${label} (2026-09-07)\n`,
      `01.02 - ${label}`,
    );
  }
});

test("02 - invalid SemVer component spellings keep their original links", () => {
  for (const label of [
    "02.0.0",
    "2.00.0",
    "2.0.00",
    "2.0",
    "2.0.0.1",
    "2.0.0-01",
    "2.0.0-",
    "2.0.0-beta..1",
    "2.0.0+",
    "2.0.0+build..007",
    "2.0.0-α",
  ]) {
    const input = `${prefix}## [${label}](compare)\n`;
    equal(clean(input), input, `02.01 - ${label}`);
  }
});

test("03 - prefixed escaped entity-encoded and prose labels remain unchanged", () => {
  for (const label of [
    "v2.0.0",
    "V2.0.0",
    String.raw`2\.0\.0`,
    "2&#46;0&#46;0",
    "2.0.0 notes",
    " 2.0.0",
    "2.0.0 ",
  ]) {
    const input = `${prefix}## [${label}](compare)\n`;
    equal(clean(input), input, `03.01 - ${label}`);
  }
});

test("04 - root ATX headings accept one through six hashes and up to three spaces", () => {
  for (const indentation of ["", " ", "  ", "   "]) {
    for (let level = 1; level <= 6; level += 1) {
      const hashes = "#".repeat(level);
      const input = `${prefix}${indentation}${hashes} [2.0.0-rc.1](compare)\n`;
      // The existing extras rule demotes only an unindented body '# ' prefix.
      const resultingHashes = !indentation && level === 1 ? "##" : hashes;
      equal(
        clean(input, false),
        input,
        `04.01 - ${indentation.length}/${level}`,
      );
      equal(
        clean(input),
        `${prefix}${indentation}${resultingHashes} 2.0.0-rc.1\n`,
        `04.02 - ${indentation.length}/${level}`,
      );
    }
  }
});

test("05 - multiple spaces and tabs after the ATX marker are preserved", () => {
  for (const whitespace of ["  ", "\t", " \t  "]) {
    const input = `${prefix}##${whitespace}[2.0.0+build.7](compare)\n`;
    equal(
      clean(input),
      `${prefix}##${whitespace}2.0.0+build.7\n`,
      `05.01 - ${JSON.stringify(whitespace)}`,
    );
  }
});

test("06 - prose and malformed ATX prefixes do not become version headings", () => {
  for (const line of [
    "##[2.0.0](compare)",
    "####### [2.0.0](compare)",
    "Published ## [2.0.0](compare)",
    String.raw`\## [2.0.0](compare)`,
    "    ## [2.0.0](compare)",
    "\t## [2.0.0](compare)",
  ]) {
    const input = `${prefix}${line}\n`;
    equal(clean(input), input, `06.01 - ${line}`);
  }
});

test("07 - only the leading version link is removed from a heading", () => {
  const input = `${prefix}## [2.0.0](compare) and [1.0.0](older)\n`;
  equal(clean(input), `${prefix}## 2.0.0 and [1.0.0](older)\n`, "07.01");
  for (const line of [
    "## Release [2.0.0](compare)",
    "## **[2.0.0](compare)**",
    "## ![2.0.0](image)",
  ]) {
    equal(clean(`${prefix}${line}\n`), `${prefix}${line}\n`, `07.02 - ${line}`);
  }
});

test("08 - bare destinations consume their complete balanced parentheses", () => {
  for (const destination of [
    "https://example.com/compare/(old)...(new)",
    "compare/(one(two(three)))",
    "compare/(((((five)))))",
  ]) {
    equal(
      clean(`${prefix}## [2.0.0](${destination}) (date)\n`),
      `${prefix}## 2.0.0 (date)\n`,
      `08.01 - ${destination}`,
    );
  }
});

test("09 - escaped destination parentheses honor backslash parity", () => {
  for (const destination of [
    String.raw`compare/\(old\)`,
    String.raw`compare/\\(old)`,
    String.raw`compare/\\\(old\)`,
    String.raw`compare/a\)b`,
  ]) {
    equal(
      clean(`${prefix}## [2.0.0](${destination}) suffix\n`),
      `${prefix}## 2.0.0 suffix\n`,
      `09.01 - ${destination}`,
    );
  }
});

test("10 - angle destinations allow spaces and unbalanced parentheses", () => {
  for (const destination of [
    "<https://example.com/(unbalanced>",
    "<compare/a b>",
    "<compare/unbalanced)>",
    String.raw`<compare/a\>b>`,
    "<>",
  ]) {
    equal(
      clean(`${prefix}## [2.0.0](${destination}) tail\n`),
      `${prefix}## 2.0.0 tail\n`,
      `10.01 - ${destination}`,
    );
  }
});

test("11 - optional link titles end before the trailing heading text", () => {
  for (const title of [
    '"title (text)"',
    "'title'",
    "(title)",
    String.raw`"title \"quoted\""`,
    String.raw`(title \(text\))`,
  ]) {
    equal(
      clean(`${prefix}## [2.0.0](compare ${title}) (2026-09-07)\n`),
      `${prefix}## 2.0.0 (2026-09-07)\n`,
      `11.01 - ${title}`,
    );
  }
});

test("12 - empty destinations and surrounding link whitespace are supported", () => {
  for (const linkTail of [
    "()",
    "(   )",
    "( \tcompare \t)",
    "(compare\t'title'\t)",
    '(<compare/a b> "title")',
  ]) {
    equal(
      clean(`${prefix}## [2.0.0]${linkTail} tail\n`),
      `${prefix}## 2.0.0 tail\n`,
      `12.01 - ${linkTail}`,
    );
  }
});

test("13 - dates closing hashes and ordinary suffix spacing remain exact", () => {
  for (const suffix of [
    " (2026-09-07)",
    "  released today ###",
    "\t(date)  additional text",
    ") trailing unmatched parenthesis",
  ]) {
    equal(
      clean(`${prefix}## [2.0.0](compare)${suffix}\n`),
      `${prefix}## 2.0.0${suffix}\n`,
      `13.01 - ${suffix}`,
    );
  }
});

test("14 - malformed destinations and incomplete links remain unchanged", () => {
  for (const line of [
    "## [2.0.0](compare/(old)",
    "## [2.0.0](compare bad) tail",
    "## [2.0.0](<compare) tail",
    "## [2.0.0](<compare<a>) tail",
    "## [2.0.0](compare",
    "## [2.0.0] (compare)",
    "## 2.0.0](compare)",
    "## [2.0.0](compare\\ bad)",
  ]) {
    const input = `${prefix}${line}\n`;
    equal(clean(input), input, `14.01 - ${line}`);
  }
});

test("15 - malformed link titles cannot consume or rewrite partial links", () => {
  for (const line of [
    '## [2.0.0](compare "unclosed) tail',
    "## [2.0.0](compare 'unclosed) tail",
    "## [2.0.0](compare (unclosed) tail",
    '## [2.0.0](compare "title"junk) tail',
    "## [2.0.0](compare (outer (inner))) tail",
  ]) {
    const input = `${prefix}${line}\n`;
    equal(clean(input), input, `15.01 - ${line}`);
  }
});

test("16 - fenced and indented version-heading examples remain literal", () => {
  const input = `${prefix}\`\`\`md\n# [2.0.0-rc.1](compare/(old))\n\`\`\`\n\n    ## [2.0.0+build.007](compare)\n`;
  equal(clean(input, false), input, "16.01");
  equal(clean(input), input, "16.02");
});

test("17 - body H1 normalization retains its existing literal-prefix rule", () => {
  const input = `${prefix}# [2.0.0](compare)\n\n# Overview\n\n#\t[1.0.0](older)\n`;
  equal(clean(input, false), input, "17.01");
  equal(
    clean(input),
    `${prefix}## 2.0.0\n\n## Overview\n\n#\t1.0.0\n`,
    "17.02",
  );
  equal(clean("# [2.0.0](compare)\n"), "# 2.0.0\n", "17.03");
});

test("18 - disabling extras retains links while SourceHut correction still applies", () => {
  const input = `${prefix}## [2.0.0-beta.1](https://git.sr.ht/~owner/project/commits/abc) (date)\n`;
  equal(clean(input, false), input.replace("/commits/", "/commit/"), "18.01");
  equal(clean(input), `${prefix}## 2.0.0-beta.1 (date)\n`, "18.02");
});

test("19 - nested or escaped label delimiters do not expose partial versions", () => {
  for (const line of [
    "## [[2.0.0]](compare)",
    String.raw`## [2.0.0\]](compare)`,
    String.raw`## \[2.0.0](compare)`,
    "## [2.0.0][comparison]",
  ]) {
    const input = `${prefix}${line}\n`;
    equal(clean(input), input, `19.01 - ${line}`);
  }
});

test("20 - repeated calls preserve valid and malformed heading output and EOF style", () => {
  for (const eol of ["\n", "\r\n"]) {
    const source = `${prefix}## [2.0.0-rc.1+build.007](compare/(old)) (date)\n\n## [1.0.0](broken/(link)`;
    const expected =
      `${prefix}## 2.0.0-rc.1+build.007 (date)\n\n## [1.0.0](broken/(link)`.replace(
        /\n/g,
        eol,
      );
    const input = source.replace(/\n/g, eol);
    equal(clean(input), expected, `20.01 - ${JSON.stringify(eol)}`);
    equal(clean(expected), expected, `20.02 - ${JSON.stringify(eol)}`);
    equal(
      clean(`${input}${eol}`),
      `${expected}${eol}`,
      `20.03 - ${JSON.stringify(eol)}`,
    );
  }
});

test("21 - HTML blocks exclude only version-link unwrapping from ordinary cleanup", () => {
  const bump = "**Note:** Version bump only for package example";
  for (const [open, close] of [
    ["<pre>", "</pre>"],
    ["<!--", "-->"],
    ['<custom-data title="example">', "</custom-data>"],
  ]) {
    const input = `${prefix}${open}\n# [2.0.0+build.7](compare)\n# Overview\n${bump}\n- WIP: ordinary HTML text\nhttps://git.sr.ht/~owner/project/commits/abc\n${close}\n\n## [3.0.0](compare)\n\n- Published fix\n`;
    const ordinary = input
      .replace(`${bump}\n`, "")
      .replace("/commits/", "/commit/");
    equal(clean(input, false), ordinary, `21.01 - ${open}`);
    equal(
      clean(input),
      ordinary
        .replace("# [2.0.0+build.7]", "## [2.0.0+build.7]")
        .replace("# Overview", "## Overview")
        .replace("- WIP: ordinary HTML text\n", "")
        .replace("## [3.0.0](compare)", "## 3.0.0"),
      `21.02 - ${open}`,
    );
  }
});

test("22 - HTML-only heading exclusions rebase after leading ordinary whitespace", () => {
  const body = `${prefix}<div>\n## [1.0.0](compare)\n</div>\n\n## [2.0.0](compare)\n\n- Published fix\n`;
  const input = `\n \n  ${body}`;
  equal(clean(input, false), body, "22.01");
  equal(clean(input), body.replace("## [2.0.0](compare)", "## 2.0.0"), "22.02");
});

test("23 - quoted whitespace needs an explicit destination rather than a title-only fallback", () => {
  for (const tail of ['("a b")', "('a b')", "((a b))", '( "a b")']) {
    const input = `${prefix}## [2.0.0]${tail}\n`;
    equal(clean(input), input, `23.01 - ${tail}`);
  }
  for (const tail of ['(< > "title")', '(<> "a b")', '("title")']) {
    equal(
      clean(`${prefix}## [2.0.0]${tail}\n`),
      `${prefix}## 2.0.0\n`,
      `23.02 - ${tail}`,
    );
  }
});

test.run();
