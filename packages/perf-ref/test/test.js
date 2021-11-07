import tap from "tap";
import { perfRef } from "../dist/perf-ref.esm.js";

tap.test("01", (t) => {
  t.strictSame(perfRef(), "182014283915", "01");
  t.end();
});

tap.test("02 - it's naughty to pass any inputs but let's test anyway", (t) => {
  t.strictSame(perfRef(10), "39", "02");
  t.end();
});

tap.test("03", (t) => {
  t.strictSame(perfRef(999), "728568396", "03");
  t.end();
});
