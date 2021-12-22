import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { processThis, tiny } from "./util.js";

// false positives
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - tight comments`, () => {
  let str = `<!--zzz--><table><!--zzz-->
  <tr><!--zzz-->
    <td><!--zzz-->
      aaa<!--zzz-->
    </td><!--zzz-->
    <td><!--zzz-->
      aaa<!--zzz-->
    </td><!--zzz-->
  </tr><!--zzz-->
  </table><!--zzz-->`;
  equal(processThis(str), tiny(str), "01");
});

test(`02 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - comments include line breaks`, () => {
  let str = `<!--zzz\nyyy--><table><!--zzz\nyyy-->
  <tr><!--zzz\nyyy-->
    <td><!--zzz\nyyy-->
      aaa<!--zzz\nyyy-->
    </td><!--zzz\nyyy-->
    <td><!--zzz\nyyy-->
      aaa<!--zzz\nyyy-->
    </td><!--zzz\nyyy-->
  </tr><!--zzz\nyyy-->
  </table><!--zzz\nyyy-->`;
  equal(processThis(str), tiny(str), "02");
});

test(`03 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`}${`\u001b[${33}m${` - comments`}\u001b[${39}m`} - comments include line breaks`, () => {
  let str = `<!--111
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
  equal(processThis(str), tiny(str), "03");
});

test.run();
