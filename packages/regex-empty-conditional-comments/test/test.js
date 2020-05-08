import tap from "tap";
import r from "../dist/regex-empty-conditional-comments.esm";

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

<!--<![endif]-->`,
];

tap.test("matches each of comments", (t) => {
  // eslint-disable-next-line
  for (const comment of fixture) {
    t.match(comment, r());
  }

  t.notMatch(`<!--a-->`, r(), "01.01");
  t.notMatch(`<!--[if (gte mso 9)|(IE)]>z<![endif]-->`, r(), "01.02");
  t.notMatch("<!--[if (gte mso 9)|(IE)]>\n\t\tz\n<![endif]-->", r(), "01.03");
  t.notMatch(
    `<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`,
    r(),
    "01.04"
  );
  t.notMatch(
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
    r(),
    "01.05"
  );

  // as per https://stackoverflow.com/a/5983063/3943954
  t.notMatch(
    `<!--[if !mso]><!-- -->
  content targeted at non-outlook users goes here...
<!--<![endif]-->`,
    r(),
    "01.06"
  );

  t.end();
});

tap.test("returns comment on match", (t) => {
  t.same(
    "<html> <!--[if (gte mso 9)|(IE)]><![endif]--> <title>".match(r()),
    ["<!--[if (gte mso 9)|(IE)]><![endif]-->"],
    "02.01"
  );
  t.same(
    `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
  <xml>
  <![endif]-->`.match(r()),
    ["<!--[if !mso]><![endif]-->"],
    "02.02"
  );
  t.same(
    `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if !mso]><!-- -->

<!--<![endif]-->`.match(r()),
    [
      "<!--[if !mso]><![endif]-->",
      `<!--[if !mso]><!-- -->

<!--<![endif]-->`,
    ],
    "02.03"
  );
  t.end();
});

tap.test("deletes comments from code", (t) => {
  t.equal(
    `zzz <!--[if (gte mso 9)|(IE)]>\t<![endif]--> yyy <!-- does not touch this -->`.replace(
      r(),
      ""
    ),
    "zzz  yyy <!-- does not touch this -->",
    "03"
  );
  t.end();
});
