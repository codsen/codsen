// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

// target cells by their thead column's contents
// -----------------------------------------------------------------------------

test("01 - markdown input - lifts Bar, text", () => {
  const input = `
| Foo | Bar | Baz |
|-----|-----|-----|
| a   | b   | c   |
| x   | y   | z   |
`.trim();

  const intended = `
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
      <td colspan="2"><span class="rrt-new-tr__span-top">a</span><br><span class="rrt-new-tr__span-other">Bar:</span> b</td>
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
      <td colspan="2"><span class="rrt-new-tr__span-top">x</span><br><span class="rrt-new-tr__span-other">Bar:</span> y</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td class="rrt-del-td">y</td>
      <td>z</td>
    </tr>
  </tbody>
</table>
`;

  const res = unified()
    .data("settings", { fragment: true })
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeResponsiveTables, {
      up: ["Bar"],
    })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .processSync(input);

  equal(res.value, intended, "01.01");
});

test.run();
