// Customise every generated class name

import { strict as assert } from "node:assert";
import { rehype } from "rehype";

import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

const source = `<table>
  <thead><tr><th>Name</th><th>Value</th></tr></thead>
  <tbody>
    <tr><td>First</td><td>1</td></tr>
    <tr><td>Second</td><td>2</td></tr>
  </tbody>
</table>`;

const result = rehype()
  .data("settings", { fragment: true })
  .use(rehypeResponsiveTables, {
    tableClassName: "responsive",
    newTrClassName: "label-row",
    hideTdClassName: "visually-hidden",
    gapTrClassName: "row-gap",
    newTrSpanTopClassName: "primary-label",
    newTrSpanOtherClassName: "secondary-label",
    up: ["Value"],
  })
  .processSync(source)
  .toString();

assert.equal(result.includes('class="responsive"'), true);
assert.equal(result.includes('class="label-row"'), true);
assert.equal(result.includes('class="visually-hidden"'), true);
assert.equal(result.includes('class="row-gap"'), true);
assert.equal(result.includes('class="primary-label"'), true);
assert.equal(result.includes('class="secondary-label"'), true);
