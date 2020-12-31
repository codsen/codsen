import tap from "tap";
import { isRel } from "../dist/is-relative-uri.umd";

tap.test("UMD build works fine", (t) => {
  [
    "//example.com/path/resource.txt",
    "/path/resource.txt",
    "path/resource.txt",
    "path/resource.html",
    "path/resource.html#fragment",
    "path/resource.html?z=1",
    "/path/resource.txt",
    "/path/resource.html#fragment",
    "/path/resource.html?z=1",
    "../resource.txt",
    "./resource.txt",
    "resource.txt",
    "#fragment",
  ].forEach((val) => {
    t.ok(isRel(val).res, val);
  });
  t.end();
});
