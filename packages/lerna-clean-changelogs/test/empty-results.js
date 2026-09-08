import { test } from "uvu";
import { equal } from "uvu/assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const bump = "**Note:** Version bump only for package example";

test("01 - a bump-only document without an EOF newline becomes empty", () => {
  for (const input of [bump, `## 1.0.0\n\n${bump}`]) {
    equal(cleanChangelogs(input).res, "", "01.01");
    equal(cleanChangelogs(input, { extras: false }).res, "", "01.02");
    equal(cleanChangelogs(input, { extras: true }).res, "", "01.03");
    equal(cleanChangelogs(cleanChangelogs(input).res).res, "", "01.04");
  }
});

test("02 - WIP-only documents become empty only with extras enabled", () => {
  for (const input of [
    "WIP",
    "- WIP: unfinished work",
    "## 1.0.0\n\n### Bug Fixes\n\n- WIP: unfinished work",
  ]) {
    equal(cleanChangelogs(input).res, input, "02.01");
    equal(cleanChangelogs(input, { extras: false }).res, input, "02.02");
    equal(cleanChangelogs(input, { extras: true }).res, "", "02.03");
    equal(
      cleanChangelogs(cleanChangelogs(input, { extras: true }).res, {
        extras: true,
      }).res,
      "",
      "02.04",
    );
  }
});

test("03 - multiple removable releases do not restore their original content", () => {
  const bumpOnly = `## 2.0.0\n\n${bump}\n\n## 1.0.0\n\n${bump}`;
  const wipRelease = "## 1.0.0\n\n- WIP: unfinished work";
  const mixed = `## 2.0.0\n\n${bump}\n\n${wipRelease}`;
  equal(cleanChangelogs(bumpOnly).res, "", "03.01");
  equal(cleanChangelogs(bumpOnly, { extras: false }).res, "", "03.02");
  equal(cleanChangelogs(bumpOnly, { extras: true }).res, "", "03.03");
  equal(cleanChangelogs(mixed).res, wipRelease, "03.04");
  equal(cleanChangelogs(mixed, { extras: false }).res, wipRelease, "03.05");
  equal(cleanChangelogs(mixed, { extras: true }).res, "", "03.06");
});

test("04 - removing all content preserves exactly one original EOF newline", () => {
  for (const eol of ["\n", "\r\n"]) {
    for (const ending of [eol, eol.repeat(3)]) {
      const bumpOnly = `## 1.0.0${eol}${eol}${bump}${ending}`;
      const wipOnly = `## 1.0.0${eol}${eol}- WIP: unfinished work${ending}`;
      equal(cleanChangelogs(bumpOnly).res, eol, "04.01");
      equal(cleanChangelogs(bumpOnly, { extras: false }).res, eol, "04.02");
      equal(cleanChangelogs(bumpOnly, { extras: true }).res, eol, "04.03");
      equal(cleanChangelogs(wipOnly, { extras: true }).res, eol, "04.04");
      equal(
        cleanChangelogs(cleanChangelogs(wipOnly, { extras: true }).res, {
          extras: true,
        }).res,
        eol,
        "04.05",
      );
    }
  }
});

test("05 - empty and whitespace-only inputs remain byte-identical", () => {
  for (const input of [
    "",
    " ",
    "\t",
    "\n",
    "\r",
    "\r\n",
    "\n \t\n\n",
    " \r\n\t\r\n ",
    "\u00a0",
  ]) {
    equal(cleanChangelogs(input).res, input, "05.01");
    equal(cleanChangelogs(input, { extras: false }).res, input, "05.02");
    equal(cleanChangelogs(input, { extras: true }).res, input, "05.03");
  }
});

test("06 - retained releases survive beside completely removed releases", () => {
  const retained = "## 1.0.0\n\n- Published fix";
  const input = `## 2.0.0\n\n${bump}\n\n${retained}\n- WIP: unfinished work`;
  const ordinary = `${retained}\n- WIP: unfinished work`;
  equal(cleanChangelogs(input).res, ordinary, "06.01");
  equal(cleanChangelogs(input, { extras: false }).res, ordinary, "06.02");
  equal(cleanChangelogs(input, { extras: true }).res, retained, "06.03");
  equal(cleanChangelogs(retained, { extras: true }).res, retained, "06.04");
});

test("07 - the document H1 remains when its releases become empty", () => {
  for (const eol of ["\n", "\r\n"]) {
    for (const ending of ["", eol]) {
      const input = `# Changelog${eol}${eol}## 2.0.0${eol}${eol}${bump}${eol}${eol}## 1.0.0${eol}${eol}- WIP: unfinished work${ending}`;
      const expected = `# Changelog${ending}`;
      equal(cleanChangelogs(input, { extras: true }).res, expected, "07.01");
      equal(cleanChangelogs(expected, { extras: true }).res, expected, "07.02");
    }
  }
});

test("08 - literal examples keep otherwise removable documents nonempty", () => {
  const retained = `## 1.0.0\n\n\`\`\`md\nWIP\n${bump}\n\`\`\``;
  const input = `## 2.0.0\n\n${bump}\n\n${retained}`;
  equal(cleanChangelogs(input).res, retained, "08.01");
  equal(cleanChangelogs(input, { extras: false }).res, retained, "08.02");
  equal(cleanChangelogs(input, { extras: true }).res, retained, "08.03");
  equal(cleanChangelogs(retained).res, retained, "08.04");
  equal(cleanChangelogs(retained, { extras: true }).res, retained, "08.05");
});

test.run();
