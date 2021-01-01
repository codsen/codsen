import tap from "tap";
import { splitEasy } from "../dist/csv-split-easy.esm";

tap.test("01 - wrong input types causes throwing up", (t) => {
  t.throws(() => {
    splitEasy(null);
  }, "01.01");
  t.throws(() => {
    splitEasy(1);
  }, "01.02");
  t.throws(() => {
    splitEasy(undefined);
  }, "01.03");
  t.throws(() => {
    splitEasy();
  }, "01.04");
  t.throws(() => {
    splitEasy(true);
  }, "01.05");
  t.throws(() => {
    splitEasy(NaN);
  }, "01.06");
  t.throws(() => {
    splitEasy({ a: "a" });
  }, "01.07");
  t.throws(() => {
    splitEasy("a", 1); // opts are not object
  }, "01.08");
  t.doesNotThrow(() => {
    splitEasy("a"); // opts missing
  }, "01.09");
  t.throws(() => {
    const f = () => null;
    splitEasy(f);
  }, "01.10");
  t.end();
});
