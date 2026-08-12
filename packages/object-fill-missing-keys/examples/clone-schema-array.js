// Clone a schema array when the input array is empty

import { strict as assert } from "node:assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

assert.deepEqual(
  fillMissing({ sections: [] }, { sections: [{ title: "", body: "" }] }),
  { sections: [{ title: "", body: "" }] },
);
