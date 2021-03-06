import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.umd";

tap.test("UMD build works fine", (t) => {
  const gathered = [];
  ct("<a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.ok(gathered.length, "01");
  t.end();
});
