import { strict as assert } from "node:assert";
import { det } from "../dist/detergent.esm.js";

const source = String.raw`<b style="font-family:'\31  a';content:'&amp;'">x</b>`;
assert.equal(det(source).res, source);

const css = String.raw`<style>.a\31  a{content:"two  words &amp;"}</style>`;
const seen = [];
const result = det(`${css}<b>hello</b>`, {
  stripHtmlButIgnoreTags: ["style", "b"],
  cb: (text) => {
    seen.push(text);
    return text.toUpperCase();
  },
});
assert.equal(result.res, `${css}<b>HELLO</b>`);
assert.deepEqual(seen, ["hello"]);
