import tap from "tap";
import { m } from "./util/util";

tap.test(
  `01 - ${`\u001b[${90}m${`adhoc 1`}\u001b[${39}m`} - a peculiar set of characters`,
  (t) => {
    t.strictSame(
      m(t, "<a>\n<<>", { removeLineBreaks: true }).result,
      "<a><<>",
      "01 - a peculiar set of characters"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${90}m${`adhoc 2`}\u001b[${39}m`} - another peculiar set of characters`,
  (t) => {
    t.strictSame(
      m(t, "You&rsquo;ve").result,
      "You&rsquo;ve",
      "02 - another peculiar set of characters"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${90}m${`adhoc 3`}\u001b[${39}m`} - yet another peculiar set of chars`,
  (t) => {
    const input = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
    const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><!--[if !mso]><!-- --><meta http-equiv="X-UA-Compatible" content="IE=edge"/><!--<![endif]--><meta name="format-detection" content="telephone=no"/><meta
name="viewport" zzz`;
    t.strictSame(
      m(t, input, {
        removeLineBreaks: true,
        breakToTheLeftOf: [],
      }).result,
      output,
      "03 - another peculiar set of characters"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${90}m${`adhoc 4`}\u001b[${39}m`} - result's keyset is consistent`,
  (t) => {
    t.equal(
      Object.keys(m(t, "")).length,
      Object.keys(m(t, "zzz")).length,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${90}m${`adhoc 5`}\u001b[${39}m`} - raw non-breaking spaces`,
  (t) => {
    t.strictSame(
      m(t, "\u00A0<x>\n\u00A0\u00A0<y>\u00A0", { removeLineBreaks: true })
        .result,
      "<x><y>",
      "05.01"
    );
    t.strictSame(
      m(t, "\u00A0<x>\n\u00A0\u00A0<y>\u00A0", { removeLineBreaks: false })
        .result,
      "<x>\n<y>",
      "05.02"
    );
    t.strictSame(
      m(t, "\u00A0<x/>\n\u00A0\u00A0<y/>\u00A0", { removeLineBreaks: true })
        .result,
      "<x/><y/>",
      "05.03"
    );
    t.strictSame(
      m(t, "\u00A0<x/>\n\u00A0\u00A0<y/>\u00A0", { removeLineBreaks: false })
        .result,
      "<x/>\n<y/>",
      "05.04"
    );
    t.strictSame(
      m(t, "\u00A0<x/>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: true })
        .result,
      "<x/></y>",
      "05.05"
    );
    t.strictSame(
      m(t, "\u00A0<x/>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: false })
        .result,
      "<x/>\n</y>",
      "05.06"
    );
    t.strictSame(
      m(t, "\u00A0</x>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: true })
        .result,
      "</x></y>",
      "05.07"
    );
    t.strictSame(
      m(t, "\u00A0</x>\n\u00A0\u00A0</y>\u00A0", { removeLineBreaks: false })
        .result,
      "</x>\n</y>",
      "05.08"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${90}m${`adhoc 6`}\u001b[${39}m`} - raw non-breaking spaces`,
  (t) => {
    const chunk = "    <script >   >]] > < div>";
    const res = "<script >   >]] > < div>";
    t.strictSame(m(t, chunk, { removeLineBreaks: true }).result, res, "06.01");
    t.strictSame(
      m(t, chunk, {
        removeLineBreaks: false,
        removeIndentations: true,
      }).result,
      res,
      "06.02"
    );
    t.strictSame(
      m(t, chunk, {
        removeLineBreaks: false,
        removeIndentations: false,
      }).result,
      chunk,
      "06.03"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${90}m${`adhoc 7`}\u001b[${39}m`} - line length control`,
  (t) => {
    const input = `<m>
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
    const output = `<m><n><o><p><x y z>\n<t><x><y><z klm`;
    t.strictSame(
      m(t, input, {
        lineLengthLimit: 20,
        removeLineBreaks: true,
        breakToTheLeftOf: [],
      }).result,
      output,
      "07"
    );
    t.end();
  }
);

tap.test(`08 - ${`\u001b[${90}m${`adhoc 8`}\u001b[${39}m`} - nunjucks`, (t) => {
  t.strictSame(
    m(t, "{%- length > 1 or length > 2 -%}", {
      removeLineBreaks: true,
    }).result,
    "{%- length > 1 or length > 2 -%}",
    "08"
  );
  t.end();
});

tap.only(`09 - ${`\u001b[${90}m${`adhoc 9`}\u001b[${39}m`} - nunjucks`, (t) => {
  const source =
    '{%- if (((not a.b) and (a.b | c("d") | e > 1)) or ((a.b) and (a.f | c("d") | e > 2))) -%}';
  t.strictSame(
    m(t, source, {
      removeLineBreaks: true,
    }).result,
    source,
    "09"
  );
  t.end();
});
