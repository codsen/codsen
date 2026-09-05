// Decode an attribute value
import assert from "node:assert/strict";
import { decode } from "../dist/html-entity-codec.esm.js";

assert.equal(decode("&copy=1 &copy;", { context: "attribute" }), "&copy=1 ©");
