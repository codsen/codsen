// Add inline CSS to inserted table cells

import { strict as assert } from "node:assert";

import { patcher } from "../dist/html-table-patcher.esm.js";

assert.equal(
  patcher("<table>Message<tr><td>A</td><td>B</td></tr></table>", {
    cssStylesContent: "font-weight: bold;",
  }).result,
  `<table>
<tr>
  <td colspan="2" style="font-weight: bold;">
    Message
  </td>
</tr>
<tr><td>A</td><td>B</td></tr></table>`,
);
