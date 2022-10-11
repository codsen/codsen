// Quick Take

import { strict as assert } from "assert";
import { rehype } from "rehype";
import rehypeFormat from "rehype-format";

import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
      <td>c</td>
    </tr>
  </tbody>
</table>
`;

let intended = `
<table class="rrt-table">
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr-span">a</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
      <td>c</td>
    </tr>
  </tbody>
</table>
`;

assert.equal(
  rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString(),
  intended
);
