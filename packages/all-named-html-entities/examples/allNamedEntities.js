// `allNamedEntities`

import { strict as assert } from "assert";
import { allNamedEntities } from "../dist/all-named-html-entities.esm.js";

// total named entities count:
assert.equal(Object.keys(allNamedEntities).length, 2125);

// show the first-one:
assert.equal(Object.keys(allNamedEntities).sort()[0], "AElig");

// &AElig; decoded:
assert.equal(allNamedEntities.AElig, "Æ");
