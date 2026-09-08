import { test } from "uvu";
import { equal } from "uvu/assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const clean = (source, extras = true) =>
  cleanChangelogs(source, { extras }).res;

test("01 - removing the first entry preserves the older release attribution", () => {
  const input = `# Changelog

## 2.0.0

- New published fix

## 1.0.0

- WIP: old unfinished work
- Old published fix
`;
  const expected = input.replace("- WIP: old unfinished work\n", "");
  equal(clean(input), expected, "01.01");
  equal(clean(expected), expected, "01.02");
});

test("02 - removing a middle entry keeps its release and category", () => {
  const input = `# Changelog

## 2.0.0

### Bug Fixes

- First published fix
- WIP: unfinished fix
- Last published fix
`;
  equal(clean(input), input.replace("- WIP: unfinished fix\n", ""), "02.01");
});

test("03 - removing the last entry keeps the preceding substantive content", () => {
  const input = `# Changelog

## 2.0.0

### Bug Fixes

- Published fix
- WIP: unfinished fix
`;
  equal(clean(input), input.replace("- WIP: unfinished fix\n", ""), "03.01");
});

test("04 - removing a sole category entry preserves its release siblings", () => {
  const input = `# Changelog

## 2.0.0

### Bug Fixes

- WIP: unfinished fix

### Features

- Published feature
`;
  equal(
    clean(input),
    `# Changelog

## 2.0.0

### Features

- Published feature
`,
    "04.01",
  );
});

test("05 - removing an empty category also prunes its now-empty release", () => {
  const input = `# Changelog

## 2.0.0

### Bug Fixes

- WIP: unfinished fix

## 1.0.0

- Published fix
`;
  const expected = `# Changelog

## 1.0.0

- Published fix
`;
  equal(clean(input), expected, "05.01");
  equal(clean(expected), expected, "05.02");
});

test("06 - a leading bump note cannot consume retained performance descendants", () => {
  const input = `# Changelog

## 2.0.0

**Note:** Version bump only for package example

### Performance Improvements

- Recorded a 20% higher normalized score (100,000 → 120,000).
`;
  const expected = input.replace(
    "**Note:** Version bump only for package example\n\n",
    "",
  );
  equal(clean(input, false), expected, "06.01");
  equal(clean(input, true), expected, "06.02");
  equal(clean(expected), expected, "06.03");
});

test("07 - a WIP-bearing heading survives when it owns direct content", () => {
  const input = `# Changelog

## WIP release

- Published fix
`;
  equal(clean(input), input, "07.01");
});

test("08 - a WIP-bearing heading survives when it owns nested content", () => {
  const input = `# Changelog

## WIP release

### WIP category

#### Details

- Published fix
`;
  equal(clean(input), input, "08.01");
});

test("09 - WIP-bearing headings with only deleted descendants are pruned", () => {
  const input = `# Changelog

## WIP release

### WIP category

- WIP: unfinished fix

## 1.0.0

- Published fix
`;
  equal(
    clean(input),
    `# Changelog

## 1.0.0

- Published fix
`,
    "09.01",
  );
});

test("10 - pre-existing empty headings outside the affected release survive", () => {
  const input = `# Changelog

## 3.0.0

### Empty category

## 2.0.0

- WIP: unfinished fix

## 1.0.0

- Published fix
`;
  equal(
    clean(input),
    input.replace("## 2.0.0\n\n- WIP: unfinished fix\n\n", ""),
    "10.01",
  );
});

test("11 - an untouched empty child survives inside an affected release", () => {
  const input = `# Changelog

## 2.0.0

### Empty category

### Bug Fixes

- WIP: unfinished fix
`;
  equal(
    clean(input),
    `# Changelog

## 2.0.0

### Empty category
`,
    "11.01",
  );
});

test("12 - the initial document heading survives removal of every entry", () => {
  equal(
    clean("# Changelog\n\n## 1.0.0\n\n- WIP: unfinished fix\n"),
    "# Changelog\n",
    "12.01",
  );
  equal(
    clean("# WIP changelog\n\n- WIP: unfinished fix\n"),
    "# WIP changelog\n",
    "12.02",
  );
});

test("13 - skipped heading levels retain their surviving descendant ownership", () => {
  const input = `# Changelog

## 2.0.0

#### Changes

- WIP: unfinished fix

###### Details

- Published fix
`;
  equal(clean(input), input.replace("- WIP: unfinished fix\n\n", ""), "13.01");
});

test("14 - extras retain the established broad case-insensitive WIP substring rule", () => {
  const input = `# Changelog

## 2.0.0

### Features

- Improve swipe action
- Mixed WiP placeholder
- Published feature
`;
  equal(clean(input, false), input, "14.01");
  equal(
    clean(input),
    input.replace("- Improve swipe action\n- Mixed WiP placeholder\n", ""),
    "14.02",
  );
});

test("15 - deleting a WIP line preserves its unmarked continuation and category", () => {
  const input = `# Changelog

## 2.0.0

### Bug Fixes

- WIP: unfinished fix
  Retained continuation text
- Published fix
`;
  equal(clean(input), input.replace("- WIP: unfinished fix\n", ""), "15.01");
});

test("16 - section removal preserves LF and CRLF formatting and idempotence", () => {
  const input =
    "\n  \n# Changelog\n\n\n## 2.0.0\n\n### Bug Fixes\n\n- WIP: unfinished fix\n- Published fix\n\n\n";
  const expected =
    "# Changelog\n\n## 2.0.0\n\n### Bug Fixes\n\n- Published fix\n";
  for (const eol of ["\n", "\r\n"]) {
    const formatted = expected.replace(/\n/g, eol);
    equal(
      clean(input.replace(/\n/g, eol)),
      formatted,
      `16.01 - ${JSON.stringify(eol)}`,
    );
    equal(clean(formatted), formatted, `16.02 - ${JSON.stringify(eol)}`);
  }
});

test("17 - retaining only the document title does not invent a final newline", () => {
  equal(
    clean("# Changelog\n\n## 1.0.0\n\n- WIP: unfinished fix"),
    "# Changelog",
    "17.01",
  );
});

test("18 - default bump-note removal keeps sibling entries at every position", () => {
  const note = "**Note:** Version bump only for package example";
  const prefix = "# Changelog\n\n## 2.0.0\n\n### Bug Fixes\n\n";
  for (const lines of [
    [note, "- First fix", "- Last fix"],
    ["- First fix", note, "- Last fix"],
    ["- First fix", "- Last fix", note],
  ]) {
    equal(
      clean(`${prefix}${lines.join("\n")}\n`, false),
      `${prefix}- First fix\n- Last fix\n`,
      `18.01 - note at ${lines.indexOf(note)}`,
    );
  }
});

test("19 - non-version H1 headings retain their H2 descendants", () => {
  const input = `# Changelog

# Category

**Note:** Version bump only for package example

## Details

- Published fix
`;
  equal(
    clean(input, false),
    input.replace("**Note:** Version bump only for package example\n\n", ""),
    "19.01",
  );
});

test("20 - mixed release depths preserve categories until the next release", () => {
  const input = `# Changelog

# 2.0.0

**Note:** Version bump only for package example

## Bug Fixes

- Published fix

## 1.0.0

**Note:** Version bump only for package example
`;
  equal(
    clean(input, false),
    `# Changelog

# 2.0.0

## Bug Fixes

- Published fix
`,
    "20.01",
  );
});

test("21 - ordinary peer headings cannot retain an otherwise empty release", () => {
  const input = `# Changelog

## 1.0.0

- WIP

## Credits

- Retained credit
`;
  equal(
    clean(input),
    `# Changelog

## Credits

- Retained credit
`,
    "21.01",
  );
});

test("22 - an initial H1 version heading remains a removable release", () => {
  equal(
    clean(
      "# 1.0.0\n\n**Note:** Version bump only for package example\n",
      false,
    ),
    "\n",
    "22.01",
  );
  equal(
    clean("# [1.0.0](https://example.com/release)\n\n- WIP: unfinished\n"),
    "\n",
    "22.02",
  );
});

test.run();
