import { test } from "uvu";
import { equal } from "uvu/assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const clean = (source) => cleanChangelogs(source, { extras: true }).res;
const bump = "**Note:** Version bump only for package example";

test("01 - repeated retained releases keep their original order among removed sections", () => {
  const entries = Array.from({ length: 1000 }, (_, index) => index + 1);
  const input = entries
    .map(
      (number) =>
        `## ${number}.0.0\n\n### Bug Fixes\n\n- WIP: unfinished ${number}\n* Retained fix ${number}\n\n## ${number}.0.1\n\n${bump}`,
    )
    .join("\n\n");
  const expected = entries
    .map(
      (number) =>
        `## ${number}.0.0\n\n### Bug Fixes\n\n- Retained fix ${number}`,
    )
    .join("\n\n");
  equal(clean(input), expected, "01.01");
  equal(clean(expected), expected, "01.02");
});

test("02 - repeated literal blank runs survive beside collapsed ordinary spacing", () => {
  const entries = Array.from({ length: 500 }, (_, index) => index + 1);
  const literal = (number) =>
    `\`\`\`md\n# Literal ${number}\n\n \t\n\n* WIP literal ${number}  \n\`\`\``;
  const input = entries
    .map((number) => `${literal(number)}\n\n\n- Ordinary ${number}`)
    .join("\n\n\n");
  const expected = entries
    .map((number) => `${literal(number)}\n\n- Ordinary ${number}`)
    .join("\n\n");
  equal(clean(input), expected, "02.01");
  equal(clean(expected), expected, "02.02");
});

test("03 - larger retained and empty results preserve LF CRLF and EOF absence", () => {
  const entries = Array.from({ length: 1000 }, (_, index) => index + 1);
  const retained = entries
    .map((number) => `- Retained note ${number}`)
    .join("\n");
  const removed = entries
    .map((number) => `## ${number}.0.0\n\n${bump}`)
    .join("\n\n");
  for (const eol of ["\n", "\r\n"]) {
    for (const ending of ["", eol]) {
      const retainedInput = `${retained.replace(/\n/g, eol)}${ending}`;
      equal(
        clean(retainedInput),
        retainedInput,
        `03.01 - ${JSON.stringify([eol, ending])}`,
      );
      equal(
        clean(`${removed.replace(/\n/g, eol)}${ending}`),
        ending,
        `03.02 - ${JSON.stringify([eol, ending])}`,
      );
    }
  }
});

test.run();
