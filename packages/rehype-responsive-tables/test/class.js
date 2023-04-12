import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rehype } from "rehype";
import rehypeFormat from "rehype-format";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

// -----------------------------------------------------------------------------

test("01 - 1x2", () => {
  let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
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
