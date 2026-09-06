import changelogTimeline from "remark-conventional-commit-changelog-timeline";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";

test("01 - the package exports a direct string renderer", () => {
  equal(typeof changelogTimeline, "function", "01.01");
  equal(
    changelogTimeline("- Released"),
    "\n<ul>\n  <li>Released</li>\n</ul>\n",
    "01.02",
  );
});

test("02 - empty input produces no markup", () => {
  equal(changelogTimeline(""), "", "02.01");
  equal(changelogTimeline(" \t\n\r\n"), "", "02.02");
});

test("03 - non-string inputs identify the invalid argument", () => {
  for (let input of [undefined, null, true, 1, [], {}, () => {}]) {
    throws(
      () => changelogTimeline(input),
      /^remark-conventional-commit-changelog-timeline\/changelogTimeline\(\): \[THROW_ID_01\]/,
    );
  }
});

test("04 - repeated calls do not share rendering state", () => {
  let markdown = "## 1.0.0 (2022-08-12)\n\n- Released";
  let first = changelogTimeline(markdown);
  changelogTimeline("# Change Log\n\n### Fixed\n\n- Something else");
  equal(changelogTimeline(markdown), first, "04.01");
});

test.run();
