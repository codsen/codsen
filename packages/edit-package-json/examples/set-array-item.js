// Replace an existing array item by its dot-path index

import { strict as assert } from "node:assert";

import { set } from "../dist/edit-package-json.esm.js";

assert.equal(
  set('{"files":["dist","src"]}', "files.1", "types"),
  '{"files":["dist","types"]}',
);
