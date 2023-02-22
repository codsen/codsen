import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { processThis, tiny } from "./util.js";

// code between TD and TD
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`code between ${`\u001b[${34}m${`TD`}\u001b[${39}m`} ${`\u001b[${33}m${`and`}\u001b[${39}m`} ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}`} - between two TD's`, () => {
  equal(
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
    "01.01"
  );
});

test(`02 - ${`\u001b[${33}m${`code between ${`\u001b[${34}m${`TD`}\u001b[${39}m`} ${`\u001b[${33}m${`and`}\u001b[${39}m`} ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}`} - 3 places`, () => {
  is(
    processThis(`<table>
<tr>
  x
  <td>
    1
  </td>
  y
  <td>
    2
  </td>
  z
</tr>
</table>`),
    tiny(`<table>
<tr>
  <td>
    x
  </td>
</tr>
<tr>
  <td>
    1
  </td>
</tr>
<tr>
  <td>
    y
  </td>
</tr>
<tr>
  <td>
    2
  </td>
</tr>
<tr>
  <td>
    z
  </td>
</tr>
</table>`),
    "02.01"
  );
});

test.run();
