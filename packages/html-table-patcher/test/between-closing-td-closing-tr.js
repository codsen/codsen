import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { processThis, tiny } from "./util.js";

// code between closing TD and closing TR
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${35}m${`type 4`}\u001b[${39}m`}${`\u001b[${33}m${` - code closing TD and closing TR`}\u001b[${39}m`} - two tags`, () => {
  equal(
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
    "01.01 - 1 col"
  );
});

test.run();
