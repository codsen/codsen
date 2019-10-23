// avanotonly

import test from "ava";
import { allNamedEntities as allNamedEntities1 } from "../dist/all-named-html-entities.umd";
import { allNamedEntities as allNamedEntities2 } from "../dist/all-named-html-entities.cjs";

test("UMD build works fine", t => {
  t.truthy(Object.keys(allNamedEntities1).length);
});

test("CJS build works fine", t => {
  t.truthy(Object.keys(allNamedEntities2).length);
});
