import tap from "tap";
import { crush } from "html-crush";
import { patcher, defaults, version } from "../dist/html-table-patcher.esm";

function processThis(str, opts) {
  const res =
    crush(patcher(str, opts), {
      lineLengthLimit: 0,
      removeLineBreaks: true,
    }).result || "";
  return res.replace(/\s*\n\s*/gm, "");
}

function tiny(something) {
  return crush(something, {
    lineLengthLimit: 0,
    removeLineBreaks: true,
  }).result.replace(/\s*\n\s*/gm, "");
}

// 01. type #1 - code between two TR's or TR and TABLE
// this is an easier case than type #2.
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - the beginning`,
  (t) => {
    t.same(
      processThis(`<table>
  zzz
  <tr>
    <td>
      something
    </td>
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr>
    <td>
      something
    </td>
  </tr>
</table>`),
      "01 - str before tr - 1 col"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - the ending`,
  (t) => {
    t.same(
      processThis(`<table>
  <tr>
    <td>
      something
    </td>
  </tr>
  zzz
</table>`),
      tiny(`<table>
  <tr>
    <td>
      something
    </td>
  </tr>
  <tr>
    <td>
      zzz
    </td>
  </tr>
</table>`),
      "02 - string after the tr - 1 col"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - code between two tr's`,
  (t) => {
    t.same(
      processThis(`<table>
<tr>
<td>
1
</td>
</tr>
zzz
<tr>
<td>
2
</td>
</tr>
</table>`),
      tiny(`<table>
<tr>
<td>
1
</td>
</tr>
<tr>
<td>
zzz
</td>
</tr>
<tr>
<td>
2
</td>
</tr>
</table>`),
      "03 - string between the tr's - 1 col"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - mess within comment block`,
  (t) => {
    t.same(
      processThis(`<table>
  zzz
  <!--<tr>
    <td>
      something
    </td>
    zzz
  </tr>-->
</table>`),
      tiny(`<table>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <!--<tr>
    <td>
      something
    </td>
    zzz
  </tr>-->
</table>`),
      "04 - notice comment is never closed, yet wrapping occurs before it"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - commented-out code + raw code`,
  (t) => {
    t.same(
      processThis(`<table>
  <tr>
    <td>
      something
    </td>
  </tr>
  zzz
  <tr>
    <td>
      else
    </td>
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td>
      something
    </td>
  </tr>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr>
    <td>
      else
    </td>
  </tr>
</table>`),
      "05 - code + comments"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - colspan=2`,
  (t) => {
    t.same(
      processThis(`<table>
  xyz
  <tr>
    <td>
      abc
    </td>
    <td>
      def
    </td>
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td colspan="2">
      xyz
    </td>
  </tr>
  <tr>
    <td>
      abc
    </td>
    <td>
      def
    </td>
  </tr>
</table>`),
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - detects centering, HTML align attribute`,
  (t) => {
    t.same(
      processThis(`<table>
<tr>
<td align="center">
1
</td>
</tr>
zzz
<tr>
<td>
2
</td>
</tr>
</table>`),
      tiny(`<table>
<tr>
<td align="center">
1
</td>
</tr>
<tr>
<td align="center">
zzz
</td>
</tr>
<tr>
<td>
2
</td>
</tr>
</table>`),
      "07 - string between the tr's - 1 col"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - detects centering, inline CSS text-align`,
  (t) => {
    t.same(
      processThis(`<table>
<tr>
<td style="text-align: center;">
1
</td>
</tr>
zzz
<tr>
<td>
2
</td>
</tr>
</table>`),
      tiny(`<table>
<tr>
<td style="text-align: center;">
1
</td>
</tr>
<tr>
<td align="center">
zzz
</td>
</tr>
<tr>
<td>
2
</td>
</tr>
</table>`),
      "08 - string between the tr's - 1 col"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - single quote as TD content`,
  (t) => {
    t.same(
      processThis(`<table>
<tr><td>a</td></tr>
{{ 0 }}
<tr><td>'</td></tr>
{{ 1 }}
<tr><td>s</td></tr>
</table>`),
      tiny(`<table>
<tr><td>a</td></tr>
<tr><td>{{ 0 }}</td></tr>
<tr><td>'</td></tr>
<tr><td>{{ 1 }}</td></tr>
<tr><td>s</td></tr>
</table>`),
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - styling via opts`,
  (t) => {
    t.same(
      processThis(
        `<table>
<tr><td>a</td></tr>
{{ 0 }}
<tr><td>'</td></tr>
{{ 1 }}
<tr><td>s</td></tr>
</table>`,
        {
          cssStylesContent:
            "background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;",
          alwaysCenter: true,
        }
      ),
      tiny(`<table>
<tr><td>a</td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">{{ 0 }}</td></tr>
<tr><td>'</td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">{{ 1 }}</td></tr>
<tr><td>s</td></tr>
</table>`),
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - styling via opts, #2`,
  (t) => {
    t.same(
      processThis(
        `<table>
{{ 0 }}
<tr><td>a</td></tr>
{{ 1 }}
<tr><td>b</td></tr>
{{ 2 }}
<tr><td>c</td></tr>
{{ 3 }}
</table>`,
        {
          cssStylesContent:
            "background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;",
          alwaysCenter: true,
        }
      ),
      tiny(`<table>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">{{ 0 }}</td></tr>
<tr><td>a</td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">{{ 1 }}</td></tr>
<tr><td>b</td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">{{ 2 }}</td></tr>
<tr><td>c</td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">{{ 3 }}</td></tr>
</table>`),
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - styling via opts, #3`,
  (t) => {
    t.same(
      processThis(
        `<table><tr><td></td></tr>
1
<tr><td>
  <table><tr><td>.</td></tr></table>
</td></tr>
2
<tr><td></td></tr></table>`,
        {
          cssStylesContent:
            "background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;",
          alwaysCenter: true,
        }
      ),
      tiny(`<table><tr><td></td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">1</td></tr>
<tr><td>
  <table><tr><td>.</td></tr></table>
</td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">2</td></tr>
<tr><td></td></tr></table>`),
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - deeper nesting`,
  (t) => {
    t.same(
      processThis(
        `<table><tr><td></td></tr>
1
<tr><td>
<table></table>
</td></tr>
2
<tr><td></td></tr></table>`,
        {
          cssStylesContent:
            "background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;",
          alwaysCenter: true,
        }
      ),
      tiny(`<table><tr><td></td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">1</td></tr>
<tr><td>
<table></table>
</td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">2</td></tr>
<tr><td></td></tr></table>`),
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - deeper nesting`,
  (t) => {
    t.same(
      processThis(
        `<table><tr><td></td></tr>
1
<tr><td>
<table><tr><td>
<table><tr><td>a</td></tr></table>
<table><tr><td>b</td></tr></table>
<table><tr><td>c</td></tr></table>
</td></tr></table>
</td></tr>
2
<tr><td></td></tr></table>`,
        {
          cssStylesContent:
            "background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;",
          alwaysCenter: true,
        }
      ),
      tiny(`<table><tr><td></td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">1</td></tr>
<tr><td>
<table><tr><td>
<table><tr><td>a</td></tr></table>
<table><tr><td>b</td></tr></table>
<table><tr><td>c</td></tr></table>
</td></tr></table>
</td></tr>
<tr><td align="center" style="background: coral; color: black; font-family: monospace; font-size: 16px; line-height: 1; text-align: center;">2</td></tr>
<tr><td></td></tr></table>`),
      "14"
    );
    t.end();
  }
);

// 02. type #2 - code between TR and TD
// -----------------------------------------------------------------------------

tap.test(
  `15 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - first TD after TR`,
  (t) => {
    t.same(
      processThis(`<table>
  <tr>
    zzz
    <td>
      something
    </td>
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr>
    <td>
      something
    </td>
  </tr>
</table>`),
      "15 - str before tr - 1 col"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - colspan=2`,
  (t) => {
    t.same(
      processThis(`<table>
  <tr>
    x
    <td>
      1
    </td>
    <td>
      2
    </td>
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td colspan="2">
      x
    </td>
  </tr>
  <tr>
    <td>
      1
    </td>
    <td>
      2
    </td>
  </tr>
</table>`),
      "16 - str before tr - colspan=2"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - align="center", one TD`,
  (t) => {
    t.same(
      processThis(`<table>
  <tr>
    x
    <td align="center">
      1
    </td>
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td align="center">
      x
    </td>
  </tr>
  <tr>
    <td align="center">
      1
    </td>
  </tr>
</table>`),
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - align="center" on one of two TD's`,
  (t) => {
    t.same(
      processThis(`<table>
  <tr>
    x
    <td align="center">
      1
    </td>
    <td>
      2
    </td>
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td colspan="2" align="center">
      x
    </td>
  </tr>
  <tr>
    <td align="center">
      1
    </td>
    <td>
      2
    </td>
  </tr>
</table>`),
      "18"
    );
    t.end();
  }
);

// 03. type #3 - code between TD and TD
// -----------------------------------------------------------------------------

tap.test(
  `19 - ${`\u001b[${32}m${`type 3`}\u001b[${39}m`}${`\u001b[${33}m${` - code between ${`\u001b[${34}m${`TD`}\u001b[${39}m`} ${`\u001b[${33}m${`and`}\u001b[${39}m`} ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}`} - between two TD's`,
  (t) => {
    t.same(
      processThis(`<table>
  <tr>
    <td>
      aaa
    </td>
    zzz
    <td>
      bbb
    </td>
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td>
      aaa
    </td>
  </tr>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr>
    <td>
      bbb
    </td>
  </tr>
</table>`),
      "19 - str before tr - 1 col"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`type 3`}\u001b[${39}m`}${`\u001b[${33}m${` - code between ${`\u001b[${34}m${`TD`}\u001b[${39}m`} ${`\u001b[${33}m${`and`}\u001b[${39}m`} ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}`} - 3 places`,
  (t) => {
    t.same(
      processThis(`<table>
<tr>
x
<td>1</td>
y
<td>2</td>
z
</tr>
</table>`),
      tiny(`<table>
<tr>
<td>x</td>
</tr>
<tr>
<td>1</td>
</tr>
<tr>
<td>y</td>
</tr>
<tr>
<td>2</td>
</tr>
<tr>
<td>z</td>
</tr>
</table>`),
      "20"
    );
    t.end();
  }
);

// 04. type #4 - code between closing TD and closing TR
// -----------------------------------------------------------------------------

tap.test(
  `21 - ${`\u001b[${35}m${`type 4`}\u001b[${39}m`}${`\u001b[${33}m${` - code closing TD and closing TR`}\u001b[${39}m`} - two tags`,
  (t) => {
    t.same(
      processThis(`<table>
  <tr>
    <td>
      aaa
    </td>
    zzz
  </tr>
</table>`),
      tiny(`<table>
  <tr>
    <td>
      aaa
    </td>
  </tr>
  <tr>
    <td>
      zzz
    </td>
  </tr>
</table>`),
      "21 - 1 col"
    );
    t.end();
  }
);

// 05. false positives
// -----------------------------------------------------------------------------

tap.test(
  `22 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - various HTML comments`,
  (t) => {
    const str1 = `<!--zzz--><table><!--zzz-->
  <tr><!--zzz-->
    <td><!--zzz-->
      aaa<!--zzz-->
    </td><!--zzz-->
    <td><!--zzz-->
      aaa<!--zzz-->
    </td><!--zzz-->
  </tr><!--zzz-->
  </table><!--zzz-->`;
    t.same(patcher(str1), str1, "22.01 - tight comments");

    const str2 = `<!--zzz\nyyy--><table><!--zzz\nyyy-->
  <tr><!--zzz\nyyy-->
    <td><!--zzz\nyyy-->
      aaa<!--zzz\nyyy-->
    </td><!--zzz\nyyy-->
    <td><!--zzz\nyyy-->
      aaa<!--zzz\nyyy-->
    </td><!--zzz\nyyy-->
  </tr><!--zzz\nyyy-->
  </table><!--zzz\nyyy-->`;
    t.same(patcher(str2), str2, "22.02 - comments include line breaks");

    const str3 = `<!--zzz\nyyy--><table><!--zzz\nyyy-->
<tr><!--zzz<table>zzz<tr>yyy-->
  <td><!--zzz</td>zzz<td>yyy-->
    aaa<!--zzz</td><td>yyy-->
  </td><!--zzz</td><td>yyy-->
  <td><!--zzz</td><td>yyy-->
    aaa<!--zzz</td><td>yyy-->
  </td><!--zzz<td></td>yyy-->
</tr><!--zzz<tr></tr><tr></tr><table>zzz</table>yyy-->
</table><!--zzz\nyyy-->`;
    t.same(patcher(str3), str3, "22.03 - comments include line breaks");
    t.end();
  }
);

// 06. checking API bits
// -----------------------------------------------------------------------------

tap.test(
  `23 - ${`\u001b[${34}m${`API bits`}\u001b[${39}m`} - defaults`,
  (t) => {
    t.ok(typeof defaults === "object", "23.01");
    t.ok(Object.keys(defaults).length > 0, "23.02");
    t.end();
  }
);

tap.test(`24 - ${`\u001b[${34}m${`API bits`}\u001b[${39}m`} - version`, (t) => {
  t.match(version, /\d*\.\d*\.\d*/, "24");
  t.end();
});
