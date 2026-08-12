// Span inserted table cells across the existing columns

import { strict as assert } from "node:assert";

import { patcher } from "../dist/html-table-patcher.esm.js";

assert.equal(
  patcher("<table>Message<tr><td>A</td><td>B</td></tr></table>").result,
  `<table>
<tr>
  <td colspan="2">
    Message
  </td>
</tr>
<tr><td>A</td><td>B</td></tr></table>`,
);
