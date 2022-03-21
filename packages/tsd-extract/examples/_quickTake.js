// Quick Take

import { strict as assert } from "assert";
import { extract } from "../dist/tsd-extract.esm.js";

const { value } = extract(
  `interface Opts1 { foo: boolean };
interface Opts2 { bar: boolean };`,
  "Opts2"
);

assert.equal(value, "interface Opts2 { bar: boolean };");
