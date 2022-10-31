import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.ignoreTagsWithTheirContents
// -----------------------------------------------------------------------------

test("01 - minimal, code blocks", () => {
  let source = `<code><div>x</div></code>`;
  equal(
    stripHtml(source),
    {
      result: "x",
      ranges: [
        [0, 11],
        [12, 25],
      ],
      allTagLocations: [
        [0, 6],
        [6, 11],
        [12, 18],
        [18, 25],
      ],
      filteredTagLocations: [
        [0, 6],
        [6, 11],
        [12, 18],
        [18, 25],
      ],
    },
    "01.01"
  );
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["code"],
    }),
    {
      result: source,
      ranges: null,
      allTagLocations: [
        [0, 6],
        [6, 11],
        [12, 18],
        [18, 25],
      ],
      filteredTagLocations: [],
    },
    "01.02"
  );
});

test("02 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(stripHtml(source).result, "x", "02.01");
});

test("03 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["table"],
    }).result,
    source,
    "03.01"
  );
});

test("04 - nested, code blocks", () => {
  let source = `<table width="100">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    `<tr>
    <td>
      x
    </td>
  </tr>`,
    "04.01"
  );
});

test("05 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["td"],
    }).result,
    `<td>
      x
    </td>`,
    "05.01"
  );
});

test("06 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["*"],
    }).result,
    source,
    "06.01"
  );
});

test("07 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["table", "td"],
    }).result,
    source,
    "07.01"
  );
});

test("08 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["table", "tr"],
    }).result,
    source,
    "08.01"
  );
});

test("09 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["td", "tr"],
    }).result,
    `<tr>
    <td>
      x
    </td>
  </tr>`,
    "09.01"
  );
});

test("10 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["td", "tr", "table"],
    }).result,
    source,
    "10.01"
  );
});

test("11 - contrived example of Venn-style ignored overlap", () => {
  let source = `a <div> b </div> c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> <div> j </div> k`;
  //                                  |--------------------------------------------|
  //                                                         |--------------------------------------------|
  equal(stripHtml(source).result, "a b c d e f g h i j k", "11.01");
});

// ERRONEOUS INPUTS
// -----------------------------------------------------------------------------

// the following test checks, does the "strip" flag deactivate
test("12 - minimal, to test the disabling of ignoring flags", () => {
  let source = `<code><div>x</div></code><div>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["code"],
    }).result,
    "<code><div>x</div></code>",
    "12.01"
  );
});

test("13 - contrived example of Venn-style ignored overlap", () => {
  let source = `a <div> b </div> c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> <div> j </div> k`;
  //                                  |--------------------------------------------|
  //                                                         |--------------------------------------------|
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr", "td"],
    }).result,
    `a b c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> j k`,
    "13.01"
  );
});

// insurance against a double opening
test("14 - two layers of the same tag, one closing missing", () => {
  let source = `<table><tr><tr><td>x</td></tr></table>a<div>b</div>c`;
  //                       |   |
  //                       !   !
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "<tr><td>x</td></tr> a b c",
    "14.01"
  );
});

test("15 - rogue opening tag", () => {
  let source = `<div>a</div> b <tr> c <div>d</div>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "a b c d",
    "15.01"
  );
});

test("16 - rogue closing tag", () => {
  let source = `<div>a</div> b </tr> c <div>d</div>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "a b c d",
    "16.01"
  );
});

test("17 - closing-opening", () => {
  let source = `<div>a</div> b </tr><tr> c <div>d</div>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "a b c d",
    "17.01"
  );
});

test("18 - closing-closing-opening", () => {
  let source = `</tr> <div>a</div> b </tr> c <div>d</div> <tr> <div>e</div>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "a b c d e",
    "18.01"
  );
});

test("19 - closing-opening-opening", () => {
  let source = `</tr> <div>a</div> b <tr> c <div>d</div> <tr> <div>e</div>`;
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "a b c d e",
    "19.01"
  );
});

test.run();
