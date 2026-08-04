// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.ignoreTagsWithTheirContents
// -----------------------------------------------------------------------------

test("001 - minimal, code blocks", () => {
  let source = "<code><div>x</div></code>";
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
    "001.01",
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
    "001.02",
  );
});

test("002 - nested, code blocks", () => {
  let source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  equal(stripHtml(source).result, "x", "002.01");
});

test("003 - nested, code blocks", () => {
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
    "003.01",
  );
});

test("004 - nested, code blocks", () => {
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
    "004.01",
  );
});

test("005 - nested, code blocks", () => {
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
    "005.01",
  );
});

test("006 - nested, code blocks", () => {
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
    "006.01",
  );
});

test("007 - nested, code blocks", () => {
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
    "007.01",
  );
});

test("008 - nested, code blocks", () => {
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
    "008.01",
  );
});

test("009 - nested, code blocks", () => {
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
    "009.01",
  );
});

test("010 - nested, code blocks", () => {
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
    "010.01",
  );
});

test("011 - contrived example of Venn-style ignored overlap", () => {
  let source =
    "a <div> b </div> c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> <div> j </div> k";
  //                                  |--------------------------------------------|
  //                                                         |--------------------------------------------|
  equal(stripHtml(source).result, "a b c d e f g h i j k", "011.01");
});

// ERRONEOUS INPUTS
// -----------------------------------------------------------------------------

// the following test checks, does the "strip" flag deactivate
test("012 - minimal, to test the disabling of ignoring flags", () => {
  let source = "<code><div>x</div></code><div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["code"],
    }).result,
    "<code><div>x</div></code>",
    "012.01",
  );
});

test("013 - contrived example of Venn-style ignored overlap", () => {
  let source =
    "a <div> b </div> c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> <div> j </div> k";
  //                                  |--------------------------------------------|
  //                                                         |--------------------------------------------|
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr", "td"],
    }).result,
    "a b c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> j k",
    "013.01",
  );
});

// insurance against a double opening
test("014 - two layers of the same tag, one closing missing", () => {
  let source = "<table><tr><tr><td>x</td></tr></table>a<div>b</div>c";
  //                       |   |
  //                       !   !
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "<tr><tr><td>x</td></tr> a b c",
    "014.01",
  );
});

test("015 - rogue opening tag", () => {
  let source = "<div>a</div> b <tr> c <div>d</div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "a b <tr> c d",
    "015.01",
  );
});

test("016 - rogue closing tag", () => {
  let source = "<div>a</div> b </tr> c <div>d</div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "a b </tr> c d",
    "016.01",
  );
});

test("017 - rogue self-closing tag", () => {
  let source = "<div>a</div> b <zz/> c <div>d</div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["zz"],
    }).result,
    "a b <zz/> c d",
    "017.01",
  );
});

test("018 - rogue two-slashes tag", () => {
  let source = "<div>a</div> b </zz/> c <div>d</div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["zz"],
    }).result,
    "a b </zz/> c d",
    "018.01",
  );
});

test("019 - closing-opening", () => {
  let source = "<div>a</div> b </tr><tr> c <div>d</div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "a b </tr><tr> c d",
    "019.01",
  );
});

test("020 - closing-closing-opening", () => {
  let source = "</tr> <div>a</div> b </tr> c <div>d</div> <tr> <div>e</div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "</tr> a b </tr> c d <tr> e",
    "020.01",
  );
});

test("021 - closing-opening-opening", () => {
  let source = "</tr> <div>a</div> b <tr> c <div>d</div> <tr> <div>e</div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "</tr> a b <tr> c d <tr> e",
    "021.01",
  );
});

test("022 - closing-opening-opening", () => {
  let source = "</tr> <div>a</div> b <tr> c <div>d</div> </tr> <div>e</div>";
  equal(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }).result,
    "</tr> a b <tr> c <div>d</div> </tr> e",
    "022.01",
  );
});

test("023 - custom tags, no attrs", () => {
  equal(
    stripHtml("a<MyTag />b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a<MyTag />b c",
    "023.01",
  );
  equal(
    stripHtml("a<MyTag/>b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a<MyTag/>b c",
    "023.02",
  );
  equal(
    stripHtml("a<MyTag >b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a<MyTag >b c",
    "023.03",
  );
  equal(
    stripHtml("a<MyTag>b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a<MyTag>b c",
    "023.04",
  );
  equal(
    stripHtml("a</MyTag>b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a</MyTag>b c",
    "023.05",
  );
  equal(
    stripHtml("a</MyTag/>b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a</MyTag/>b c",
    "023.06",
  );
});

test("024 - custom tags, with attrs", () => {
  equal(
    stripHtml("a<MyTag zzz />b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a<MyTag zzz />b c",
    "024.01",
  );
  equal(
    stripHtml("a<MyTag zzz/>b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a<MyTag zzz/>b c",
    "024.02",
  );
  equal(
    stripHtml("a<MyTag zzz >b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a<MyTag zzz >b c",
    "024.03",
  );
  equal(
    stripHtml("a<MyTag zzz>b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a<MyTag zzz>b c",
    "024.04",
  );
  equal(
    stripHtml("a</MyTag zzz>b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a</MyTag zzz>b c",
    "024.05",
  );
  equal(
    stripHtml("a</MyTag zzz/>b <div>c</div>", {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    "a</MyTag zzz/>b c",
    "024.06",
  );
});

test("025 - custom tags, with proper attrs", () => {
  equal(
    stripHtml('a<MyTag class="z" />b <div>c</div>', {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    'a<MyTag class="z" />b c',
    "025.01",
  );
  equal(
    stripHtml('a<MyTag class="z"/>b <div>c</div>', {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    'a<MyTag class="z"/>b c',
    "025.02",
  );
  equal(
    stripHtml('a<MyTag class="z" >b <div>c</div>', {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    'a<MyTag class="z" >b c',
    "025.03",
  );
  equal(
    stripHtml('a<MyTag class="z">b <div>c</div>', {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    'a<MyTag class="z">b c',
    "025.04",
  );
  equal(
    stripHtml('a</MyTag class="z">b <div>c</div>', {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    'a</MyTag class="z">b c',
    "025.05",
  );
  equal(
    stripHtml('a</MyTag class="z"/>b <div>c</div>', {
      ignoreTagsWithTheirContents: ["MyTag"],
    }).result,
    'a</MyTag class="z"/>b c',
    "025.06",
  );
});

test.run();
