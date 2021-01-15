import tap from "tap";
import { cparser } from "../dist/codsen-parser.umd";

tap.test("UMD build works fine", (t) => {
  const gathered = [];
  cparser("<a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.ok(gathered.length, "01");
  t.end();
});
