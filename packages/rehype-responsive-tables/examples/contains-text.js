// Find exact text in a HAST tree

import { strict as assert } from "node:assert";

import { contains } from "../dist/rehype-responsive-tables.esm.js";

const tree = {
  type: "root",
  children: [
    {
      type: "element",
      tagName: "th",
      properties: {},
      children: [{ type: "text", value: " Role " }],
    },
  ],
};

assert.equal(contains(tree, "Role"), "Role");
assert.equal(contains(tree, ["Name", "Role"]), "Role");
assert.equal(contains(tree, "Missing"), undefined);
