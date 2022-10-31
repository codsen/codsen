import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { processThis, tiny } from "./util.js";

// 01. type #1 - code between two TR's or TR and TABLE
// this is an easier case than type #2.
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - the beginning`, () => {
  equal(
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

test(`02 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - the ending`, () => {
  equal(
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
    "02.01 - string after the tr - 1 col"
  );
});

test(`03 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - code between two tr's`, () => {
  equal(
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
    "03.01 - string between the tr's - 1 col"
  );
});

test(`04 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - mess within comment block`, () => {
  equal(
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
    "04.01 - notice comment is never closed, yet wrapping occurs before it"
  );
});

test(`05 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - commented-out code + raw code`, () => {
  equal(
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
    "05.01 - code + comments"
  );
});

test(`06 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - colspan=2`, () => {
  equal(
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
    "06.01"
  );
});

test(`07 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - detects centering, HTML align attribute`, () => {
  equal(
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
    "07.01 - string between the tr's - 1 col"
  );
});

test(`08 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - detects centering, inline CSS text-align`, () => {
  equal(
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
    "08.01 - string between the tr's - 1 col"
  );
});

test(`09 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - single quote as TD content`, () => {
  equal(
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
    "09.01"
  );
});

test(`10 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - styling via opts`, () => {
  equal(
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
    "10.01"
  );
});

test(`11 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - styling via opts, #2`, () => {
  equal(
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
    "11.01"
  );
});

// TODO
/*tttest(`12 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - styling via opts, #3`, () => {
  equal(
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
    "12.01"
  );
});*/

test(`12 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - deeper nesting`, () => {
  equal(
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
    "12.01"
  );
});

test(`13 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - deeper nesting`, () => {
  equal(
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
    "13.01"
  );
});

test.run();
