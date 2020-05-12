import tap from "tap";
import ct from "../dist/codsen-parser.umd";

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
