import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { processThis, tiny } from "./util.js";

// 02. type #2 - code between TR and TD
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - first TD after TR`, () => {
  equal(
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
    "01 - str before tr - 1 col"
  );
});

test(`02 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - colspan=2`, () => {
  equal(
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
    "02 - str before tr - colspan=2"
  );
});

test(`03 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - align="center", one TD`, () => {
  equal(
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
    "03"
  );
});

test(`04 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - align="center" on one of two TD's`, () => {
  equal(
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
    <td colspan="2">
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
    "04"
  );
});

test.run();
