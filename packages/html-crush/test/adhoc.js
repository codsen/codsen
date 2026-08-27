// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { m } from "./util/util.js";

test(`01 - adhoc 1 - a peculiar set of characters`, () => {
  equal(
    m(equal, "<a>\n<<>", { removeLineBreaks: true }).result,
    "<a><<>",
    "01.01",
  );
});

test(`02 - adhoc 2 - another peculiar set of characters`, () => {
  equal(m(equal, "You&rsquo;ve").result, "You&rsquo;ve", "02.01");
});

test(`03 - adhoc 3 - yet another peculiar set of chars`, () => {
  let input = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="format-detection" content="telephone=no" />
<meta name="viewport" zzz`;
  let output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"/><!--<![endif]--><meta name="format-detection" content="telephone=no"/><meta
name="viewport" zzz`;
  equal(
    m(equal, input, {
      removeLineBreaks: true,
      breakToTheLeftOf: [],
    }).result,
    output,
    "03.01",
  );
});

test(`04 - adhoc 4 - result's keyset is consistent`, () => {
  equal(
    Object.keys(m(equal, "")).length,
    Object.keys(m(equal, "zzz")).length,
    "04.01",
  );
});

test(`05 - adhoc 5 - raw non-breaking spaces`, () => {
  equal(
    m(equal, "\u00A0<x>\n\u00A0\u00A0<y>\u00A0", { removeLineBreaks: true })
      .result,
    "<x><y>",
    "05.01",
  );
  equal(
    m(equal, "\u00A0<x>\n\u00A0\u00A0<y>\u00A0", { removeLineBreaks: false })
      .result,
    "<x>\n<y>",
    "05.02",
  );
  equal(
    m(equal, "\u00A0<x/>\n\u00A0\u00A0<y/>\u00A0", { removeLineBreaks: true })
      .result,
    "<x/><y/>",
    "05.03",
  );
  equal(
    m(equal, "\u00A0<x/>\n\u00A0\u00A0<y/>\u00A0", { removeLineBreaks: false })
      .result,
    "<x/>\n<y/>",
    "05.04",
  );
  equal(
    m(equal, "\u00A0<x/>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: true })
      .result,
    "<x/></y>",
    "05.05",
  );
  equal(
    m(equal, "\u00A0<x/>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: false })
      .result,
    "<x/>\n</y>",
    "05.06",
  );
  equal(
    m(equal, "\u00A0</x>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: true })
      .result,
    "</x></y>",
    "05.07",
  );
  equal(
    m(equal, "\u00A0</x>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: false })
      .result,
    "</x>\n</y>",
    "05.08",
  );
});

test(`06 - adhoc 6 - raw non-breaking spaces`, () => {
  let chunk = "    <script >   >]] > < div>";
  let res = "<script >   >]] > < div>";
  equal(m(equal, chunk, { removeLineBreaks: true }).result, res, "06.01");
  equal(
    m(equal, chunk, {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    res,
    "06.02",
  );
  equal(
    m(equal, chunk, {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    chunk,
    "06.03",
  );
});

test(`07 - adhoc 7 - line length control`, () => {
  let input = `<m>
<n>
<o>
<p>
<x
y
z>
<t>
<x>
<y>
<z klm`;
  let output = "<m><n><o><p><x y z>\n<t><x><y><z klm";
  equal(
    m(equal, input, {
      lineLengthLimit: 20,
      removeLineBreaks: true,
      breakToTheLeftOf: [],
    }).result,
    output,
    "07.01",
  );
});

test(`08 - adhoc 8 - nunjucks`, () => {
  equal(
    m(equal, "{%- length > 1 or length > 2 -%}", {
      removeLineBreaks: true,
    }).result,
    "{%- length > 1 or length > 2 -%}",
    "08.01",
  );
});

test(`09 - adhoc 9 - nunjucks`, () => {
  let source =
    '{%- if (((not a.b) and (a.b | c("d") | e > 1)) or ((a.b) and (a.f | c("d") | e > 2))) -%}';
  equal(
    m(equal, source, {
      removeLineBreaks: true,
    }).result,
    source,
    "09.01",
  );
});

test(`10 - astral letters keep tag-name prefixes ordinary`, () => {
  const source = "<script𐐀> x </script𐐀>";
  equal(m(equal, source).result, source, "10.01");
});

test.run();
