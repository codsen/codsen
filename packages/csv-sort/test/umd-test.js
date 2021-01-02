import tap from "tap";
import { sort } from "../dist/csv-sort.umd";

tap.test("UMD build works fine", (t) => {
  t.strictSame(
    sort(""),
    {
      res: [[""]],
      msgContent: null,
      msgType: null,
    },
    "01"
  );
  t.end();
});
