// Lift every labelled column with a wildcard

import { strict as assert } from "node:assert";
import { rehype } from "rehype";

import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

const source = `<table>
  <thead><tr><th>Name</th><th>Role</th></tr></thead>
  <tbody><tr><td>Ada</td><td>Engineer</td></tr></tbody>
</table>`;

const result = rehype()
  .data("settings", { fragment: true })
  .use(rehypeResponsiveTables, { up: ["*"] })
  .processSync(source)
  .toString();

assert.equal(result.includes("Name:</span> Ada"), true);
assert.equal(result.includes("Role:</span> Engineer"), true);
