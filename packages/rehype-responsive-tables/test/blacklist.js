import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rehype } from "rehype";
import rehypeFormat from "rehype-format";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

// -----------------------------------------------------------------------------

test(`01 - lifts Bar, text`, () => {
  let input = `
<table>
  <thead>
    <tr>
      <th>Foo</th>
      <th>Bar</th>
      <th>Baz</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
      <td>c</td>
    </tr>
    <tr>
      <td>x</td>
      <td>y</td>
      <td>z</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table class="rrt-table">
  <thead>
    <tr>
      <th class="rrt-del-td">Foo</th>
      <th class="rrt-del-td">Bar</th>
      <th>Baz</th>
    </tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr-span">a</span><br>Bar: b</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td class="rrt-del-td">b</td>
      <td>c</td>
    </tr>
    <tr class="rrt-gap-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr-span">x</span><br>Bar: y</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td class="rrt-del-td">y</td>
      <td>z</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables, {
      up: ["Bar"],
    })
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "01");
});
