// avanotonly

import test from "ava";
import tokenizer1 from "../dist/codsen-tokenizer.umd";
import tokenizer2 from "../dist/codsen-tokenizer.cjs";

test("UMD build works fine", t => {
  const gathered = [];
  tokenizer1("<a>", obj => {
    gathered.push(obj);
  });
  t.truthy(gathered.length);
});

test("CJS build works fine", t => {
  const gathered = [];
  tokenizer2("<a>", obj => {
    gathered.push(obj);
  });
  t.truthy(gathered.length);
});
