import tap from "tap";
import { processThis, tiny } from "./util.js";

// code between closing TD and closing TR
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`type 4`}\u001b[${39}m`}${`\u001b[${33}m${` - code closing TD and closing TR`}\u001b[${39}m`} - two tags`,
  (t) => {
    t.strictSame(
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
      "01 - 1 col"
    );
    t.end();
  }
);
