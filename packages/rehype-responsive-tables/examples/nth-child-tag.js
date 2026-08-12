// Find a numbered child element by tag name

import { strict as assert } from "node:assert";

import { getNthChildTag } from "../dist/rehype-responsive-tables.esm.js";

const tree = {
  children: [
    { type: "text", value: "\n" },
    { type: "element", tagName: "td", children: [] },
    { type: "element", tagName: "th", children: [] },
    { type: "element", tagName: "td", children: [] },
  ],
};

assert.equal(getNthChildTag(tree, "td", 1), tree.children[3]);
assert.equal(getNthChildTag(tree, "td", 2), null);
