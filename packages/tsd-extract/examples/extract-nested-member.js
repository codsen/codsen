// Extract a nested member

import { strict as assert } from "node:assert";

import { extract } from "../dist/tsd-extract.esm.js";

const source = `interface Options {
  output: {
    format: "json" | "text";
    pretty: boolean;
  };
}`;

assert.equal(
  extract(source, "Options.output").value,
  'output: {\n  format: "json" | "text";\n  pretty: boolean;\n};',
);
