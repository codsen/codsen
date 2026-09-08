// Match a JSP namespace declaration independently of the element prefix

import { strict as assert } from "node:assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

const source = '<page:root xmlns:page="http://java.sun.com/JSP/Page" />';

assert.equal(isJSP().test(source), true);
assert.deepEqual(source.match(isJSP()), [
  'xmlns:page="http://java.sun.com/JSP/Page"',
]);
assert.equal(
  isJSP().test('<page:root xmlns:page="http://java.sun.com/JSP/PageExtra" />'),
  false,
);
