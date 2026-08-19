// Allow a combining mark after the first character

import { strict as assert } from "node:assert";

import {
  isProduction4,
  isProduction4a,
} from "../dist/charcode-is-valid-xml-name-character.esm.js";

const combiningAcuteAccent = "\u0301";

assert.equal(isProduction4(combiningAcuteAccent), false);
assert.equal(isProduction4a(combiningAcuteAccent), true);
