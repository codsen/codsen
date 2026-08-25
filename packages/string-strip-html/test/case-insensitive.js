import { test } from "uvu";
import { equal } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("001 - default paired tags are case-insensitive", () => {
  equal(stripHtml("a<SCRIPT>x</SCRIPT>b").result, "a b", "001.01");
  equal(stripHtml("a<script>x</SCRIPT>b").result, "a b", "001.02");
  equal(stripHtml("a<StYlE>x</sTyLe>b").result, "a b", "001.03");
  equal(
    stripHtml('a<SCRIPT>if (x < y) { const tag = "<div>"; }</sCrIpT>b').result,
    "a b",
    "001.04",
  );
});

test("002 - configured paired tags are case-insensitive", () => {
  equal(
    stripHtml("a<DiV>x</dIv>b", {
      stripTogetherWithTheirContents: ["DIV"],
    }).result,
    "a b",
    "002.01",
  );
});

test("003 - href dumping matches mixed-case anchor tags", () => {
  equal(
    stripHtml('<A HREF="https://example.test">link</a>', {
      dumpLinkHrefsNearby: { enabled: true },
    }).result,
    "link https://example.test",
    "003.01",
  );
  equal(
    stripHtml('<a href="https://example.test">link</A>', {
      dumpLinkHrefsNearby: { enabled: true },
    }).result,
    "link https://example.test",
    "003.02",
  );
});

test("004 - every tag-list option is case-insensitive", () => {
  const sourceNames = [
    ["div", "div"],
    ["DIV", "DIV"],
    ["DiV", "dIv"],
  ];
  const optionNames = ["div", "DIV", "dIv"];

  for (const [openingName, closingName] of sourceNames) {
    const input = `a<${openingName}>x</${closingName}>b`;
    for (const optionName of optionNames) {
      equal(
        stripHtml(input, { ignoreTags: [optionName] }).result,
        input,
        "004.01",
      );
      equal(
        stripHtml(input, { onlyStripTags: [optionName] }).result,
        "a x b",
        "004.02",
      );
      equal(
        stripHtml(input, {
          ignoreTagsWithTheirContents: [optionName],
        }).result,
        input,
        "004.03",
      );
      equal(
        stripHtml(input, {
          stripTogetherWithTheirContents: [optionName],
        }).result,
        "a b",
        "004.04",
      );
    }
  }
});

test("005 - content-ignore pairs mixed-case nested tags", () => {
  const inputs = [
    "x<DiV><b>y</b></dIv>z",
    "x<DiV><DIV><b>y</b></div></dIv>z",
  ];

  for (const input of inputs) {
    equal(
      stripHtml(input, {
        ignoreTagsWithTheirContents: ["DIV"],
      }).result,
      input,
      "005.01",
    );
  }

  equal(
    stripHtml("x&lt;DiV&gt;<b>y</b>&lt;/dIv&gt;z", {
      ignoreTagsWithTheirContents: ["DIV"],
    }).result,
    "x<DiV><b>y</b></dIv>z",
    "005.02",
  );
});

test("006 - ignoreTags wins across option casing", () => {
  const input = "a<DiV>x</dIv>b";
  equal(
    stripHtml(input, {
      onlyStripTags: ["DIV"],
      ignoreTags: ["div"],
    }).result,
    input,
    "006.01",
  );
});

test("007 - incomplete standard tags match case-insensitively", () => {
  equal(stripHtml("<DIV", { ignoreTags: ["div"] }).result, "<DIV", "007.01");
  equal(
    stripHtml("</dIv", { ignoreTags: ["DIV"] }).result,
    "</dIv",
    "007.02",
  );
  equal(stripHtml("<DIV", { onlyStripTags: ["div"] }).result, "", "007.03");
  equal(
    stripHtml("</dIv", { onlyStripTags: ["DIV"] }).result,
    "",
    "007.04",
  );
});

test("008 - callbacks retain source tag-name casing", () => {
  const names = [];
  const actual = stripHtml("<DiV>x</dIv>", {
    onlyStripTags: ["DIV"],
    cb: ({ tag, rangesArr, proposedReturn }) => {
      names.push(tag.name);
      if (proposedReturn) {
        rangesArr.push(...proposedReturn);
      }
    },
  });

  equal(names, ["DiV", "dIv"], "008.01");
  equal(actual.result, "x", "008.02");
});

test("009 - custom tag names use the same case-insensitive contract", () => {
  const input = "a<MyTag>x</mYtAg>b";
  equal(
    stripHtml(input, { ignoreTags: ["mytag"] }).result,
    input,
    "009.01",
  );
  equal(
    stripHtml(input, { onlyStripTags: ["mytag"] }).result,
    "a x b",
    "009.02",
  );
  equal(
    stripHtml(input, { ignoreTagsWithTheirContents: ["mytag"] }).result,
    input,
    "009.03",
  );
  equal(
    stripHtml(input, { stripTogetherWithTheirContents: ["mytag"] }).result,
    "a b",
    "009.04",
  );
});

test.run();
