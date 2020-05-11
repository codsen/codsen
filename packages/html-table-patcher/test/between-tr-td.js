import tap from "tap";
import { processThis, tiny } from "./util";

// 02. type #2 - code between TR and TD
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - first TD after TR`,
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
      "01 - str before tr - 1 col"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - colspan=2`,
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
      "02 - str before tr - colspan=2"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - align="center", one TD`,
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
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and ${`\u001b[${34}m${`TD`}\u001b[${39}m`}`}\u001b[${39}m`} - align="center" on one of two TD's`,
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
    t.end();
  }
);
