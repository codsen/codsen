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
    t.strictSame(processThis(str), tiny(str), "01");
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
    t.strictSame(processThis(str), tiny(str), "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - comments include line breaks`,
  (t) => {
    const str = `<!--111
222--><table><!--333
444-->
<tr><!--555<table>666<tr>777-->
  <td><!--888</td>999<td>000-->
    aaa<!--bbb</td><td>ccc-->
  </td><!--ddd</td><td>eee-->
  <td><!--fff</td><td>ggg-->
    zzz<!--hhh</td><td>iii-->
  </td><!--jjj<td></td>kkk-->
</tr><!--lll<tr></tr><tr></tr><table>mmm</table>nnn-->
</table><!--ooo
ppp-->`;
    t.strictSame(processThis(str), tiny(str), "03");
    t.end();
  }
);
