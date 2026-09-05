import { parseFragment } from "parse5";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { alts } from "../dist/html-img-alt.esm.js";

test("01 - decoded quotes stay inside the alt attribute", () => {
  const result = alts('<img src="x" alt="&quot;Hi&quot;">');
  equal(result, '<img src="x" alt="&quot;Hi&quot;" >', "01.01");
  equal(
    parseFragment(result).childNodes[0].attrs,
    [
      { name: "src", value: "x" },
      { name: "alt", value: '"Hi"' },
    ],
    "01.02",
  );
});

test("02 - repeated decoding cannot create an extra attribute", () => {
  for (const payload of [
    "&quot; data-extra=&quot;surprise",
    "&amp;quot; data-extra=&amp;quot;surprise",
    "&amp;amp;#34; data-extra=&amp;amp;#34;surprise",
  ]) {
    const result = alts(`<img src="x" alt="${payload}" title="kept">`);
    equal(
      parseFragment(result).childNodes[0].attrs,
      [
        { name: "src", value: "x" },
        { name: "alt", value: '" data-extra="surprise' },
        { name: "title", value: "kept" },
      ],
      "02.01",
    );
  }
});

test("03 - ampersands and revealed entity-like text retain their value", () => {
  for (const [input, value] of [
    ["Tom &amp; Jerry", "Tom & Jerry"],
    ["Tom &amp;amp; Jerry", "Tom & Jerry"],
    ["Tom & Jerry", "Tom & Jerry"],
    ["&amp;unknown;", "&unknown;"],
    ["&amp;amp;unknown;", "&unknown;"],
    ["&amp;lt;tag&amp;gt;", "<tag>"],
  ]) {
    const result = alts(`<img alt="${input}" src="x">`);
    equal(
      parseFragment(result).childNodes[0].attrs,
      [
        { name: "alt", value },
        { name: "src", value: "x" },
      ],
      "03.01",
    );
    equal(alts(result), result, "03.02");
  }
});

test("04 - fancy quotes are escaped after typography conversion", () => {
  const result = alts('<img alt="  “Hi” — someone’s &amp; company  "/>');
  equal(
    parseFragment(result).childNodes[0].attrs,
    [{ name: "alt", value: '"Hi" - someone\'s & company' }],
    "04.01",
  );
  equal(
    result,
    '<img alt="&quot;Hi&quot; - someone\'s &amp; company" />',
    "04.02",
  );
});

test("05 - disabling typography retains the existing encoded contents", () => {
  const input = '<img alt=" &amp;quot;Hi&amp;quot; ">';
  equal(
    alts(input, { unfancyTheAltContents: false }),
    '<img alt=" &amp;quot;Hi&amp;quot; " >',
    "05.01",
  );
});

test.run();
