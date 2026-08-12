// Center every inserted table cell

import { strict as assert } from "node:assert";

import { patcher } from "../dist/html-table-patcher.esm.js";

assert.equal(
  patcher("<table>Message<tr><td>A</td><td>B</td></tr></table>", {
    alwaysCenter: true,
  }).result,
  `<table>
<tr>
  <td colspan="2" align="center">
    Message
  </td>
</tr>
<tr><td>A</td><td>B</td></tr></table>`,
);
