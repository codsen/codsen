import { strict as assert } from "node:assert";

import {
  nativeToUnicode,
  unicodeToNative,
} from "../dist/string-convert-indexes.esm.js";

const source = "\ud834\udf06aa";
const selection = { start: 2, end: 3, metadata: ["0"] };
const unicodeSelection = nativeToUnicode(source, selection);

assert.deepEqual(unicodeToNative(source, unicodeSelection), selection);
