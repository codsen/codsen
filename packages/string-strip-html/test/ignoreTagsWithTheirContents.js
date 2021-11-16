import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// opts.ignoreTagsWithTheirContents
// -----------------------------------------------------------------------------

tap.test("01 - minimal, code blocks", (t) => {
  const source = `<code><div>x</div></code>`;
  t.hasStrict(
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
  t.hasStrict(
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
  t.end();
});

tap.test("02 - nested, code blocks", (t) => {
  const source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(stripHtml(source), { result: "x" }, "02");
  t.end();
});

tap.test("03 - nested, code blocks", (t) => {
  const source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["table"],
    }),
    { result: source },
    "03"
  );
  t.end();
});

tap.test("04 - nested, code blocks", (t) => {
  const source = `<table width="100">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }),
    {
      result: `<tr>
    <td>
      x
    </td>
  </tr>`,
    },
    "04"
  );
  t.end();
});

tap.test("05 - nested, code blocks", (t) => {
  const source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["td"],
    }),
    {
      result: `<td>
      x
    </td>`,
    },
    "05"
  );
  t.end();
});

tap.test("06 - nested, code blocks", (t) => {
  const source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["*"],
    }),
    {
      result: source,
    },
    "06"
  );
  t.end();
});

tap.test("07 - nested, code blocks", (t) => {
  const source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["table", "td"],
    }),
    {
      result: source,
    },
    "07"
  );
  t.end();
});

tap.test("08 - nested, code blocks", (t) => {
  const source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["table", "tr"],
    }),
    {
      result: source,
    },
    "08"
  );
  t.end();
});

tap.test("09 - nested, code blocks", (t) => {
  const source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["td", "tr"],
    }),
    {
      result: `<tr>
    <td>
      x
    </td>
  </tr>`,
    },
    "09"
  );
  t.end();
});

tap.test("10 - nested, code blocks", (t) => {
  const source = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      x
    </td>
  </tr>
</table>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["td", "tr", "table"],
    }),
    {
      result: source,
    },
    "10"
  );
  t.end();
});

tap.test("11 - contrived example of Venn-style ignored overlap", (t) => {
  const source = `a <div> b </div> c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> <div> j </div> k`;
  //                                  |--------------------------------------------|
  //                                                         |--------------------------------------------|
  t.hasStrict(
    stripHtml(source),
    {
      result: "a b c d e f g h i j k",
    },
    "11"
  );
  t.end();
});

// ERRONEOUS INPUTS
// -----------------------------------------------------------------------------

// the following test checks, does the "strip" flag deactivate
tap.test("12 - minimal, to test the disabling of ignoring flags", (t) => {
  const source = `<code><div>x</div></code><div>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["code"],
    }),
    {
      result: "<code><div>x</div></code>",
    },
    "12"
  );
  t.end();
});

tap.test("13 - contrived example of Venn-style ignored overlap", (t) => {
  const source = `a <div> b </div> c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> <div> j </div> k`;
  //                                  |--------------------------------------------|
  //                                                         |--------------------------------------------|
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr", "td"],
    }),
    {
      result: `a b c <tr> <div> d </div> e <td> <div> f </div> g </tr> <div> h </div> i </td> j k`,
    },
    "13"
  );
  t.end();
});

// insurance against a double opening
tap.test("14 - two layers of the same tag, one closing missing", (t) => {
  const source = `<table><tr><tr><td>x</td></tr></table>a<div>b</div>c`;
  //                       |   |
  //                       !   !
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }),
    {
      result: "<tr><td>x</td></tr> a b c",
    },
    "14"
  );
  t.end();
});

tap.test("15 - rogue opening tag", (t) => {
  const source = `<div>a</div> b <tr> c <div>d</div>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }),
    {
      result: "a b c d",
    },
    "15"
  );
  t.end();
});

tap.test("16 - rogue closing tag", (t) => {
  const source = `<div>a</div> b </tr> c <div>d</div>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }),
    {
      result: "a b c d",
    },
    "16"
  );
  t.end();
});

tap.test("17 - closing-opening", (t) => {
  const source = `<div>a</div> b </tr><tr> c <div>d</div>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }),
    {
      result: "a b c d",
    },
    "17"
  );
  t.end();
});

tap.test("18 - closing-closing-opening", (t) => {
  const source = `</tr> <div>a</div> b </tr> c <div>d</div> <tr> <div>e</div>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }),
    {
      result: "a b c d e",
    },
    "18"
  );
  t.end();
});

tap.test("19 - closing-opening-opening", (t) => {
  const source = `</tr> <div>a</div> b <tr> c <div>d</div> <tr> <div>e</div>`;
  t.hasStrict(
    stripHtml(source, {
      ignoreTagsWithTheirContents: ["tr"],
    }),
    {
      result: "a b c d e",
    },
    "19"
  );
  t.end();
});
