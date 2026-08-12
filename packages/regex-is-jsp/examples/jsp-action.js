// Detect a JSP action tag

import { strict as assert } from "node:assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

assert.equal(
  isJSP().test('<jsp:useBean id="user" class="example.User" />'),
  true,
);
