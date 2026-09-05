// Decode HTML character references
import assert from "node:assert/strict";
import { decode } from "../dist/html-entity-codec.esm.js";

assert.equal(
  decode("Cat &amp; fiddle &#128572;&#127931;"),
  "Cat & fiddle 😼🎻",
);
