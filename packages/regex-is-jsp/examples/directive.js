// Detect a JSP page directive

import { strict as assert } from "node:assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

assert.equal(isJSP().test('<%@ page contentType="text/html" %>'), true);
