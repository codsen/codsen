// Read lexical tokens from an isolated CSS region, retaining original offsets.

import { strict as assert } from "node:assert";

import { readCssToken } from "../dist/string-extract-class-names.esm.js";

const css = String.raw`@m\65 dia all{.a\,b{background:url(foo\/*bar*/baz)}}`;
const tokens = [];
for (let i = 0; i < css.length; ) {
  const token = readCssToken(css, i);
  tokens.push(token);
  i = token.range[1];
}

assert.equal(tokens[0].kind, "at-keyword");
assert.equal(tokens[0].value, "media");
assert.equal(tokens.find(({ kind }) => kind === "url").value, "foo/*bar*/baz");
assert.equal(
  tokens.some(({ kind }) => kind === "comment"),
  false,
);
assert.equal(tokens.map(({ raw }) => raw).join(""), css);
