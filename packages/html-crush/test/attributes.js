// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { m } from "./util/util.js";

test("01 - preserves whitespace in double-quoted attribute values", () => {
  const input = '<div data-x="a   b">x</div>';
  const { result, ranges } = m(equal, input, { removeLineBreaks: true });

  equal(result, input, "01.01");
  equal(ranges, null, "01.02");
});

test("02 - preserves multiline single-quoted attribute values", () => {
  const input = "<div data-x='a\n   b'>x</div>";
  const { result, ranges } = m(equal, input, { removeLineBreaks: true });

  equal(result, input, "02.01");
  equal(ranges, null, "02.02");
});

test("03 - ignores comment-looking text in attribute values", () => {
  const input = '<div data-x="a<!-- note -->b">x</div>';
  const { applicableOpts, result, ranges } = m(equal, input, {
    removeHTMLComments: true,
    removeLineBreaks: true,
  });

  equal(result, input, "03.01");
  equal(ranges, null, "03.02");
  equal(applicableOpts.removeHTMLComments, false, "03.03");
});

test("04 - preserves templating, URL, and accessibility attribute data", () => {
  const input =
    '<a aria-label="a   b" data-template="{{ value   | trim }}" href="https://example.com/a  b">x</a>';
  const { result, ranges } = m(equal, input, { removeLineBreaks: true });

  equal(result, input, "04.01");
  equal(ranges, null, "04.02");
});

test("05 - still minifies recognized inline style attributes", () => {
  const input = '<div STYLE = " color: red; ">x</div>';
  const { result } = m(equal, input, { removeLineBreaks: true });

  equal(result, '<div STYLE = "color:red;">x</div>', "05.01");
});

test("06 - preserves an unmatched quoted attribute without throwing", () => {
  const input = '<div data-x="a   b';

  not.throws(() => m(equal, input, { removeLineBreaks: true }), "06.01");
  equal(m(equal, input, { removeLineBreaks: true }).result, input, "06.02");
});

test("07 - separates unquoted attribute values from a closing slash", () => {
  const inputs = [
    "<img src=x />",
    "<img src = x />",
    "<img src=x\n\t />",
    '<img alt="a = b" src=x />',
    "<input disabled value=x />",
    "<input value=a=b />",
    "<input value='quoted' data-x=unquoted />",
    "<img src=https://example.com/image/ />",
  ];
  const expected = [
    "<img src=x />",
    "<img src = x />",
    "<img src=x />",
    '<img alt="a = b" src=x />',
    "<input disabled value=x />",
    "<input value=a=b />",
    "<input value='quoted' data-x=unquoted />",
    "<img src=https://example.com/image/ />",
  ];

  equal(
    inputs.map((input) => m(equal, input, { removeLineBreaks: true }).result),
    expected,
    "07.01",
  );
  equal(
    inputs.map(
      (input) =>
        m(equal, input, { removeLineBreaks: true, lineLengthLimit: 0 }).result,
    ),
    expected,
    "07.02",
  );
});

test("08 - still removes optional whitespace before closing slashes", () => {
  const inputs = [
    "<br />",
    "<input disabled />",
    '<img src="x" />',
    "<img src='x' />",
    "<input value=x disabled />",
  ];

  equal(
    inputs.map((input) => m(equal, input, { removeLineBreaks: true }).result),
    [
      "<br/>",
      "<input disabled/>",
      '<img src="x"/>',
      "<img src='x'/>",
      "<input value=x disabled/>",
    ],
    "08.01",
  );
});

test("09 - preserves slashes already inside unquoted attribute values", () => {
  const inputs = ["<img src=x/>", "<img src=https://example.com/image/>"];

  equal(
    inputs.map((input) => m(equal, input, { removeLineBreaks: true }).result),
    inputs,
    "09.01",
  );
});

test.run();
