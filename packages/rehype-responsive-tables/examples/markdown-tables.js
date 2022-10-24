// Renders markdown tables

import { strict as assert } from "assert";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

const markdownTable = `
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

let { value } = unified()
  .data("settings", { fragment: true })
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeResponsiveTables, {
    up: ["Bar"],
  })
  .use(rehypeFormat)
  .use(rehypeStringify)
  .processSync(markdownTable);

// default behaviour:
assert.equal(value, intended);
