// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { processThis, tiny } from "./util.js";

// code between closing TD and closing TR
// -----------------------------------------------------------------------------

test(`01 - type 4${`\u001b[${33}m${" - code closing TD and closing TR"}\u001b[${39}m`} - two tags`, () => {
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
    "01.01",
  );
});

test.run();
