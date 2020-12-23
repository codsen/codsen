import tap from "tap";
import { includesWithGlob } from "../dist/array-includes-with-glob.umd";

tap.test("UMD build works fine", (t) => {
  t.equal(
    includesWithGlob("something", ["*thing", "zzz"], {
      arrayVsArrayAllMustBeFound: "all",
    }),
    false,
    "01"
  );
  t.end();
});
