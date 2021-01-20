// `entStartsWith`

import { strict as assert } from "assert";
import { entStartsWith } from "../dist/all-named-html-entities.esm.js";

// for perf reasons, they're pre-grouped by first two letters
assert.deepEqual(entStartsWith.A, {
  a: ["Aacute"],
  b: ["Abreve"],
  c: ["Acirc", "Acy"],
  E: ["AElig"],
  f: ["Afr"],
  g: ["Agrave"],
  l: ["Alpha"],
  m: ["Amacr"],
  M: ["AMP"],
  n: ["And"],
  o: ["Aogon", "Aopf"],
  p: ["ApplyFunction"],
  r: ["Aring"],
  s: ["Ascr", "Assign"],
  t: ["Atilde"],
  u: ["Auml"],
});

// query directly
assert.equal(entStartsWith.A.E[0], "AElig");
