import tap from "tap";
import { processThis, tiny } from "./util";

// false positives
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - tight comments`,
  (t) => {
    const str = `<!--zzz--><table><!--zzz-->
  <tr><!--zzz-->
    <td><!--zzz-->
      aaa<!--zzz-->
    </td><!--zzz-->
    <td><!--zzz-->
      aaa<!--zzz-->
    </td><!--zzz-->
  </tr><!--zzz-->
  </table><!--zzz-->`;
    t.same(processThis(str), tiny(str), "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - comments include line breaks`,
  (t) => {
    const str = `<!--zzz\nyyy--><table><!--zzz\nyyy-->
  <tr><!--zzz\nyyy-->
    <td><!--zzz\nyyy-->
      aaa<!--zzz\nyyy-->
    </td><!--zzz\nyyy-->
    <td><!--zzz\nyyy-->
      aaa<!--zzz\nyyy-->
    </td><!--zzz\nyyy-->
  </tr><!--zzz\nyyy-->
  </table><!--zzz\nyyy-->`;
    t.same(processThis(str), tiny(str), "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - comments include line breaks`,
  (t) => {
    const str = `<!--zzz\nyyy--><table><!--zzz\nyyy-->
<tr><!--zzz<table>zzz<tr>yyy-->
  <td><!--zzz</td>zzz<td>yyy-->
    aaa<!--zzz</td><td>yyy-->
  </td><!--zzz</td><td>yyy-->
  <td><!--zzz</td><td>yyy-->
    aaa<!--zzz</td><td>yyy-->
  </td><!--zzz<td></td>yyy-->
</tr><!--zzz<tr></tr><tr></tr><table>zzz</table>yyy-->
</table><!--zzz\nyyy-->`;
    t.same(processThis(str), tiny(str), "03");
    t.end();
  }
);
