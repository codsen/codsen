import test from "ava";
import { patcher, defaults, version } from "../dist/html-table-patcher.esm";
import tiny from "tinyhtml";

function processThis(str) {
  return tiny(patcher(str));
}

// 01. type #1 - code between two TR's or TR and TABLE
// this is an easier case than type #2.
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - the beginning`, t => {
  t.deepEqual(
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
    "01.01 - str before tr - 1 col"
  );
});

test(`01.02 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - the ending`, t => {
  t.deepEqual(
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
    "01.02 - string after the tr - 1 col"
  );
});

test(`01.03 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - code between two tr's`, t => {
  t.deepEqual(
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
    "01.03 - string between the tr's - 1 col"
  );
});

test(`01.04 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - unfinished comment`, t => {
  t.deepEqual(
    processThis(`<table>
  zzz
  <tr><!--
    <td>
      something
    </td>
    zzz
  </tr>
</table>`),
    tiny(`<table>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr><!--
    <td>
      something
    </td>
    zzz
  </tr>
</table>`),
    "01.04 - notice comment is never closed, yet wrapping occurs before it"
  );
});

test(`01.05 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - commented-out code + raw code`, t => {
  t.deepEqual(
    processThis(`<table>
  <tr>
    <td>
      something
    </td>
  </tr>
  zzz<!--yyyy-->
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
    "01.05 - code + comments"
  );
});

test(`01.06 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - colspan=2`, t => {
  t.deepEqual(
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
  <tr><td colspan="2">xyz</td></tr>
  <tr>
    <td>
      abc
    </td>
    <td>
      def
    </td>
  </tr>
</table>`),
    "01.06"
  );
});

test(`01.07 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - detects centering, HTML align attribute`, t => {
  t.deepEqual(
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
    "01.07 - string between the tr's - 1 col"
  );
});

test(`01.08 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - detects centering, inline CSS text-align`, t => {
  t.deepEqual(
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
    "01.08 - string between the tr's - 1 col"
  );
});

test(`01.09 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - single quote as TD content`, t => {
  t.deepEqual(
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
    "01.09"
  );
});

// 02. type #2 - code between TR and TD
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${35}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TD`}\u001b[${39}m`} - first TD after TR`, t => {
  t.deepEqual(
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
    "02.01 - str before tr - 1 col"
  );
});

test(`02.02 - ${`\u001b[${35}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TD`}\u001b[${39}m`} - colspan=2`, t => {
  t.deepEqual(
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
    "02.02 - str before tr - colspan=2"
  );
});

test(`02.03 - ${`\u001b[${35}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TD`}\u001b[${39}m`} - align="center", one TD`, t => {
  t.deepEqual(
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
    "02.03"
  );
});

test(`02.04 - ${`\u001b[${35}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TD`}\u001b[${39}m`} - align="center" on one of two TD's`, t => {
  t.deepEqual(
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
    "02.04"
  );
});

// 03. type #3 - code between TD and TD
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${31}m${`type 3`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TD and TD`}\u001b[${39}m`} - between two TD's`, t => {
  t.deepEqual(
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
    "03.01 - str before tr - 1 col"
  );
});

test(`03.02 - ${`\u001b[${31}m${`type 3`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TD and TD`}\u001b[${39}m`} - 3 places`, t => {
  t.deepEqual(
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
    "03.02"
  );
});

// 04. type #4 - code between closing TD and closing TR
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${35}m${`type 4`}\u001b[${39}m`}${`\u001b[${33}m${` - code closing TD and closing TR`}\u001b[${39}m`} - two tags`, t => {
  t.deepEqual(
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
    "04.01 - 1 col"
  );
});

// 05. false positives
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - various HTML comments`, t => {
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
  t.deepEqual(patcher(str1), str1, "05.01.01 - tight comments");

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
  t.deepEqual(patcher(str2), str2, "05.01.02 - comments include line breaks");

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
  t.deepEqual(patcher(str3), str3, "05.01.03 - comments include line breaks");
});

test(`05.02 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - doctype`, t => {
  const str1 = `<!DOCTYPE html>$*%(*$&%(£&$(($£&))))<4873874795 html>lslhflsjhdfljshdlh&£^R*^$*&^@*&$^@£$*@^$*@&$^`;
  t.deepEqual(patcher(str1), str1, "05.02.01");

  const str2 = `<!DOCTYPE html>@£(&$\n^@£^\n$^ )<!DOCTYPE html>\n$*%(*$&\n%(£&$((\n$£&))))<4873874795 html>\nlslhflsjhdfljshdlh&£\n^R*^$*&^@*&$^@£$\n*@^$*@&$^`;
  t.deepEqual(patcher(str2), str2, "05.02.02");

  const str3 = `\n\n\n>£$<>@<>@\n£<$>@<£>$<>£<___£($\n(@£&$*&_>\n<!DOCTYPE html>@£(&$^@£^$^ )\n<!DOCTYPE html>$*%(*$&%(£\n&$(($£&))))<4873874795 html>lslhflsjhdfljshdlh&£^R*^$*&^@*&$\n^@£$*@^$*@&$^`;
  t.deepEqual(patcher(str3), str3, "05.02.03");
});

// 06. checking API bits
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${34}m${`API bits`}\u001b[${39}m`} - defaults`, t => {
  t.true(typeof defaults === "object", "06.01.01");
  t.true(Object.keys(defaults).length > 0, "06.01.02");
});

test(`06.02 - ${`\u001b[${34}m${`API bits`}\u001b[${39}m`} - version`, t => {
  t.regex(version, /\d*\.\d*\.\d*/, "06.02.01");
});
