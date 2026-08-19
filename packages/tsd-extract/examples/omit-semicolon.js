// Omit the trailing semicolon

import { strict as assert } from "node:assert";

import { extract } from "../dist/tsd-extract.esm.js";

assert.equal(
  extract('declare type Mode = "light" | "dark";', "Mode", { semi: false })
    .value,
  'declare type Mode = "light" | "dark"',
);
