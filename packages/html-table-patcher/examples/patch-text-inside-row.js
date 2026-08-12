// Move loose row text into its own cell and row

import { strict as assert } from "node:assert";

import { patcher } from "../dist/html-table-patcher.esm.js";

assert.equal(
  patcher(`<table>
  <tr>
    Condition
    <td>Content</td>
  </tr>
</table>`).result,
  `<table>
  <tr>
  <td>
    Condition
  </td>
</tr>
<tr>
<td>Content</td>
  </tr>
</table>`,
);
