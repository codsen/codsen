// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

const fixture = [
  // outlook-only:
  "<![if mso]><![endif]>",
  "<![if gte mso 9]><![endif]>",
  "<![if (gte mso 9)|(IE)]><![endif]>",
  "<!--[if (gte mso 9)|(IE)]><![endif]-->",
  "<!--[if (gte mso 9)|(IE)]> <![endif]-->",
  "<!--[if (gte mso 9)|(IE)]>\t<![endif]-->",
  "<!--[if (gte mso 9)|(IE)]>\n<![endif]-->",
  "<!--[if !mso]><!-- --><!--<![endif]-->",
  `<!--[if (gte mso 9)|(IE)]>

<![endif]-->`,
  "<!--[if mso]><![endif]-->",
  "<!--[if mso]> <![endif]-->",
  `<!--[if mso]>

<![endif]-->`,
  `<!--[if gt mso 11]>

  <![endif]-->`,
  // with OR:
  `<!--[if (gte mso 9)|(IE)]>

<![endif]-->`,
  // non-Outlook-only:
  `<!--[if !mso]><!-- -->

<!--<![endif]-->`,
];

test("01 - matches each of comments", () => {
  for (const comment of fixture) {
    match(comment, emptyCondCommentRegex());
  }

  not.match("<!--a-->", emptyCondCommentRegex(), "01.01");
  not.match(
    "<!--[if (gte mso 9)|(IE)]>z<![endif]-->",
    emptyCondCommentRegex(),
    "01.02",
  );
  not.match(
    "<!--[if (gte mso 9)|(IE)]>\n\t\tz\n<![endif]-->",
    emptyCondCommentRegex(),
    "01.03",
  );
  not.match(
    `<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`,
    emptyCondCommentRegex(),
    "01.04",
  );
  not.match(
    `<!--[if (gte mso 9)|(IE)]>
  <table width="600" align="center" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td>
<![endif]-->
zzz
<!--[if (gte mso 9)|(IE)]>
      </td>
    </tr>
  </table>
<![endif]-->`,
    emptyCondCommentRegex(),
    "01.05",
  );

  // as per https://stackoverflow.com/a/5983063/3943954
  not.match(
    `<!--[if !mso]><!-- -->
  content targeted at non-outlook users goes here...
<!--<![endif]-->`,
    emptyCondCommentRegex(),
    "01.06",
  );
});

test("02 - returns comment on match", () => {
  equal(
    "<html> <!--[if (gte mso 9)|(IE)]><![endif]--> <title>".match(
      emptyCondCommentRegex(),
    ),
    ["<!--[if (gte mso 9)|(IE)]><![endif]-->"],
    "02.01",
  );
  equal(
    `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
  <xml>
  <![endif]-->`.match(emptyCondCommentRegex()),
    ["<!--[if !mso]><![endif]-->"],
    "02.02",
  );
  equal(
    `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if !mso]><!-- -->

<!--<![endif]-->`.match(emptyCondCommentRegex()),
    [
      "<!--[if !mso]><![endif]-->",
      `<!--[if !mso]><!-- -->

<!--<![endif]-->`,
    ],
    "02.03",
  );
});

test("03 - deletes comments from code", () => {
  equal(
    "zzz <!--[if (gte mso 9)|(IE)]>\t<![endif]--> yyy <!-- does not touch this -->".replace(
      emptyCondCommentRegex(),
      "",
    ),
    "zzz  yyy <!-- does not touch this -->",
    "03.01",
  );
});

test("04 - accepts only HTML ASCII whitespace as an empty body", () => {
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\t<![endif]-->"),
    true,
    "04.01",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\n<![endif]-->"),
    true,
    "04.02",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\f<![endif]-->"),
    true,
    "04.03",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\r<![endif]-->"),
    true,
    "04.04",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]> <![endif]-->"),
    true,
    "04.05",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\r\n<![endif]-->"),
    true,
    "04.06",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if !mso]><!--><!--<![endif]-->"),
    true,
    "04.07",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if !mso]><!-- -->\n<!--<![endif]-->"),
    true,
    "04.08",
  );

  equal(
    emptyCondCommentRegex().test("<!--[if mso]>!!!<![endif]-->"),
    false,
    "04.09",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>---<![endif]-->"),
    false,
    "04.10",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\v<![endif]-->"),
    false,
    "04.11",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\u00A0<![endif]-->"),
    false,
    "04.12",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\u2003<![endif]-->"),
    false,
    "04.13",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\u2028<![endif]-->"),
    false,
    "04.14",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>\uFEFF<![endif]-->"),
    false,
    "04.15",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]>&nbsp;<![endif]-->"),
    false,
    "04.16",
  );
});

test("05 - rejects malformed and repeated partial openers", () => {
  equal(emptyCondCommentRegex().test("<![if mso"), false, "05.01");
  equal(emptyCondCommentRegex().test("<![if mso]>"), false, "05.02");
  equal(
    emptyCondCommentRegex().test("<![if mso]><![endif]-->"),
    false,
    "05.03",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if mso]><![endif]>"),
    false,
    "05.04",
  );
  equal(
    emptyCondCommentRegex().test("<!--[if !mso]><!--><![endif]-->"),
    false,
    "05.05",
  );
  equal(
    emptyCondCommentRegex().test("<!--[iffy mso]><![endif]-->"),
    false,
    "05.06",
  );
  equal(emptyCondCommentRegex().test("<![if ".repeat(1000)), false, "05.07");
  equal(
    emptyCondCommentRegex().test("<!--[IF\nmso]><![ENDIF]-->"),
    true,
    "05.08",
  );
});

test("06 - exposes fresh global, case-insensitive regex state", () => {
  const comment = "<!--[if mso]><![endif]-->";
  const first = emptyCondCommentRegex();
  const second = emptyCondCommentRegex();

  equal(first.flags, "gi", "06.01");
  equal(first === second, false, "06.02");
  equal(first.lastIndex, 0, "06.03");
  equal(first.test(comment), true, "06.04");
  equal(first.lastIndex, comment.length, "06.05");
  equal(second.lastIndex, 0, "06.06");
  equal(first.test("not a comment"), false, "06.07");
  equal(first.lastIndex, 0, "06.08");

  const matchRegex = emptyCondCommentRegex();
  comment.match(matchRegex);
  equal(matchRegex.lastIndex, 0, "06.09");

  const replaceRegex = emptyCondCommentRegex();
  comment.replace(replaceRegex, "");
  equal(replaceRegex.lastIndex, 0, "06.10");
});

test.run();
