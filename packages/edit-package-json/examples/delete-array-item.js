// Delete an array item by its dot-path index

import { strict as assert } from "node:assert";

import { del } from "../dist/edit-package-json.esm.js";

assert.equal(
  del('{"files":["dist","types","src"]}', "files.1"),
  '{"files":["dist","src"]}',
);
