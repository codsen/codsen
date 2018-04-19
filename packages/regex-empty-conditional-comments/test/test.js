import test from "ava";
import r from "../dist/regex-empty-conditional-comments.cjs";

const fixture = [
  // outlook-only:
  `<![if mso]><![endif]>`,
  `<![if gte mso 9]><![endif]>`,
  `<![if (gte mso 9)|(IE)]><![endif]>`,
  `<!--[if (gte mso 9)|(IE)]><![endif]-->`,
  `<!--[if (gte mso 9)|(IE)]> <![endif]-->`,
  `<!--[if (gte mso 9)|(IE)]>\t<![endif]-->`,
  `<!--[if (gte mso 9)|(IE)]>\n<![endif]-->`,
  `<!--[if !mso]><!-- --><!--<![endif]-->`,
  `<!--[if (gte mso 9)|(IE)]>

<![endif]-->`,
  `<!--[if mso]><![endif]-->`,
  `<!--[if mso]> <![endif]-->`,
  `<!--[if mso]>

<![endif]-->`,
  `<!--[if gt mso 11]>

  <![endif]-->`,
  // with OR:
  `<!--[if (gte mso 9)|(IE)]>

<![endif]-->`,
  // non-Outlook-only:
  `<!--[if !mso]><!-- -->

<!--<![endif]-->`
];

test("matches each of comments", t => {
  for (const comment of fixture) {
    t.regex(comment, r());
  }

  t.notRegex(`<!--a-->`, r());
  t.notRegex(`<!--[if (gte mso 9)|(IE)]>z<![endif]-->`, r());
  t.notRegex("<!--[if (gte mso 9)|(IE)]>\n\t\tz\n<![endif]-->", r());
  t.notRegex(
    `<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`,
    r()
  );
  t.notRegex(
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
    r()
  );

  // as per https://stackoverflow.com/a/5983063/3943954
  t.notRegex(
    `<!--[if !mso]><!-- -->
  content targeted at non-outlook users goes here...
<!--<![endif]-->`,
    r()
  );
});

test("returns comment on match", t => {
  t.deepEqual(
    "<html> <!--[if (gte mso 9)|(IE)]><![endif]--> <title>".match(r()),
    ["<!--[if (gte mso 9)|(IE)]><![endif]-->"]
  );
  t.deepEqual(
    `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
  <xml>
  <![endif]-->`.match(r()),
    ["<!--[if !mso]><![endif]-->"]
  );
  t.deepEqual(
    `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if !mso]><!-- -->

<!--<![endif]-->`.match(r()),
    [
      "<!--[if !mso]><![endif]-->",
      `<!--[if !mso]><!-- -->

<!--<![endif]-->`
    ]
  );
});

test("deletes comments from code", t => {
  t.is(
    `zzz <!--[if (gte mso 9)|(IE)]>\t<![endif]--> yyy <!-- does not touch this -->`.replace(
      r(),
      ""
    ),
    "zzz  yyy <!-- does not touch this -->"
  );
});
