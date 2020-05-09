import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// CDATA
// -----------------------------------------------------------------------------

tap.test("01 - CDATA - tight", (t) => {
  // surroundings are not a linebreaks
  t.same(
    stripHtml(`a<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>b`),
    "a b",
    "01"
  );
  t.end();
});

tap.test("02 - CDATA - normal", (t) => {
  t.same(
    stripHtml(`a <![CDATA[
  The <, &, ', and " can be used,
  *and* %MyParamEntity; can be expanded.
]]> b`),
    "a b",
    "02"
  );
  t.end();
});

tap.test("03 - CDATA - loose", (t) => {
  t.same(
    stripHtml(`a \t\t<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>       b`),
    "a b",
    "03"
  );
  t.end();
});

tap.test("04 - CDATA - single linebreaks", (t) => {
  // surroundings are linebreaks
  t.same(
    stripHtml(`a\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\nb`),
    "a\n\nb",
    "04"
  );
  t.end();
});

tap.test("05 - CDATA - excessive linebreaks", (t) => {
  t.same(
    stripHtml(`a\n\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\nb`),
    "a\n\nb",
    "05"
  );
  t.end();
});

tap.test("06 - CDATA - mixed linebreaks", (t) => {
  t.same(
    stripHtml(`a\n \t\n\n<![CDATA[
    The <, &, ', and " can be used,
    *and* %MyParamEntity; can be expanded.
  ]]>\n\n\n\t b`),
    "a\n\nb",
    "06"
  );
  t.end();
});
