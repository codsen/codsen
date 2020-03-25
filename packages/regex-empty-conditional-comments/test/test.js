const t = require("tap");
const r = require("../dist/regex-empty-conditional-comments.cjs");

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

t.test("matches each of comments", (t) => {
  for (const comment of fixture) {
    t.match(comment, r());
  }

  t.notMatch(`<!--a-->`, r());
  t.notMatch(`<!--[if (gte mso 9)|(IE)]>z<![endif]-->`, r());
  t.notMatch("<!--[if (gte mso 9)|(IE)]>\n\t\tz\n<![endif]-->", r());
  t.notMatch(
    `<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`,
    r()
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
    r()
  );

  // as per https://stackoverflow.com/a/5983063/3943954
  t.notMatch(
    `<!--[if !mso]><!-- -->
  content targeted at non-outlook users goes here...
<!--<![endif]-->`,
    r()
  );

  t.end();
});

t.test("returns comment on match", (t) => {
  t.same("<html> <!--[if (gte mso 9)|(IE)]><![endif]--> <title>".match(r()), [
    "<!--[if (gte mso 9)|(IE)]><![endif]-->",
  ]);
  t.same(
    `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
  <xml>
  <![endif]-->`.match(r()),
    ["<!--[if !mso]><![endif]-->"]
  );
  t.same(
    `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if !mso]><!-- -->

<!--<![endif]-->`.match(r()),
    [
      "<!--[if !mso]><![endif]-->",
      `<!--[if !mso]><!-- -->

<!--<![endif]-->`,
    ]
  );
  t.end();
});

t.test("deletes comments from code", (t) => {
  t.equal(
    `zzz <!--[if (gte mso 9)|(IE)]>\t<![endif]--> yyy <!-- does not touch this -->`.replace(
      r(),
      ""
    ),
    "zzz  yyy <!-- does not touch this -->"
  );
  t.end();
});
