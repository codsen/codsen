// CSS escapes identify the same class names as their decoded HTML values.
import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const result = comb(
  String.raw`<style>@m\65 dia all{.a\,b,.unused{color:red}}</style><body><div class="a,b">x</div></body>`,
);

assert.equal(
  result.result,
  String.raw`<style>@m\65 dia all{.a\,b{color:red}}</style><body><div class="a,b">x</div></body>`,
);
assert.deepEqual(result.allInHead, [".a,b", ".unused"]);
assert.deepEqual(result.allInBody, [".a,b"]);
assert.deepEqual(result.deletedFromHead, [".unused"]);
