import tap from "tap";
import { crush, defaults, version } from "../dist/html-crush.umd";

tap.test("UMD build works fine", (t) => {
  t.equal(crush("<div>   <div>").result, "<div> <div>");
  t.match(version, /\d+\.\d+\.\d+/);
  t.ok(Object.keys(defaults).length);
  t.end();
});
