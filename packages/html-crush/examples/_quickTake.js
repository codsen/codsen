/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import { crush, defaults, version } from "../dist/html-crush.esm.js";

assert.equal(
  crush(
    `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      hi
    </td>
  </tr>
</table>`,
    { removeLineBreaks: true }
  ).result,
  `<table width="100" border="0" cellpadding="0" cellspacing="0"><tr><td> hi
</td></tr></table>`
);
