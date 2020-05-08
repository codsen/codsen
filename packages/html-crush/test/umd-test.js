import tap from "tap";
import { crush, defaults, version } from "../dist/html-crush.umd";

tap.test("UMD build works fine", (t) => {
  t.equal(crush("<div>   <div>").result, "<div> <div>", "01.01");
  t.match(version, /\d+\.\d+\.\d+/, "01.02");
  t.ok(Object.keys(defaults).length, "01.03");
  t.end();
});
