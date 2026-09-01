// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { VFile } from "vfile";
import { runPerf } from "../../../ops/scripts/perf.js";
import fixTypography from "../dist/remark-typography.esm.js";

const callerDir = path.resolve(".");

function freshTree() {
  return {
    type: "root",
    children: [
      {
        type: "heading",
        depth: 2,
        children: [
          { type: "text", value: '"Release ' },
          {
            type: "emphasis",
            children: [{ type: "text", value: "three" }],
          },
          { type: "text", value: '" is ready...' },
        ],
      },
      ...Array.from({ length: 8 }, (_, index) => ({
        type: "paragraph",
        children: [
          { type: "text", value: `Batch ${index}: The ` },
          { type: "inlineCode", value: "compiler" },
          {
            type: "text",
            value: "'s 3 x 4 matrix - ... ",
          },
          {
            type: "link",
            url: "https://example.com/docs?size=3%20x%204",
            children: [{ type: "text", value: "Read the docs" }],
          },
          { type: "text", value: " keeps a deliberately long " },
          {
            type: "emphasis",
            children: [{ type: "text", value: "ending" }],
          },
        ],
      })),
    ],
  };
}

function visibleText(tree) {
  const values = [];
  const stack = [tree];

  while (stack.length) {
    const node = stack.pop();
    if (typeof node.value === "string") values.push(node.value);
    if (Array.isArray(node.children)) {
      for (let index = node.children.length - 1; index >= 0; index--) {
        stack.push(node.children[index]);
      }
    }
  }

  return values.join("");
}

const testme = () => {
  const tree = freshTree();
  const file = new VFile();
  fixTypography()(tree, file);
  return { file, tree };
};

// Audit the measured public-API path once before Benchmark.js repeats it.
const oneShot = testme();
const text = visibleText(oneShot.tree);
assert.match(text, /“Release three” is\u00A0ready…/);
assert.match(text, /compiler’s 3 × 4 matrix/);
assert.match(text, /—/);
assert.match(text, /long\u00A0ending/);
assert.equal(
  oneShot.tree.children[1].children[3].url,
  "https://example.com/docs?size=3%20x%204",
);

// action
if (!process.argv.includes("--audit")) runPerf(testme, callerDir);
