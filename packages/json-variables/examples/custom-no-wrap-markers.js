// Configure markers that resolve variables without output wrapping

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    {
      wrapped: "%%_name_%%",
      unwrapped: "(( name ))",
      name: "Ada",
    },
    {
      headsNoWrap: "(( ",
      tailsNoWrap: " ))",
      wrapHeadsWith: "{{ ",
      wrapTailsWith: " }}",
    },
  ),
  { wrapped: "{{ Ada }}", unwrapped: "Ada", name: "Ada" },
);
