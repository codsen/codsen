import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rehype } from "rehype";
import rehypeFormat from "rehype-format";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

// -----------------------------------------------------------------------------

test("01 - 2x2", () => {
  let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
    </tr>
    <tr>
      <td>c</td>
      <td>d</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table class="foo-table">
  <tbody>
    <tr class="foo-new-tr">
      <td class="foo-del-td"></td>
      <td><span class="rrt-new-tr__span-top">a</span></td>
    </tr>
    <tr>
      <td class="foo-del-td">a</td>
      <td>b</td>
    </tr>
    <tr class="foo-gap-tr">
      <td class="foo-del-td"></td>
      <td></td>
    </tr>
    <tr class="foo-new-tr">
      <td class="foo-del-td"></td>
      <td><span class="rrt-new-tr__span-top">c</span></td>
    </tr>
    <tr>
      <td class="foo-del-td">c</td>
      <td>d</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables, {
      tableClassName: "foo-table",
      newTrClassName: "foo-new-tr",
      hideTdClassName: "foo-del-td",
      gapTrClassName: "foo-gap-tr",
    })
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "01.01");
});

test.run();
