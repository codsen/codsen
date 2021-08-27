import tap from "tap";
import { generateVariations, combinations } from "./util.js";

tap.test(`01`, (t) => {
  t.strictSame(
    combinations(`<a href="zzz">`),
    [`<a href='zzz'>`, `<a href='zzz">`, `<a href="zzz'>`, `<a href="zzz">`],
    "01"
  );
  t.end();
});

tap.test(`02`, (t) => {
  t.strictSame(
    generateVariations([0, 1, 2], 2),
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    "02"
  );
  t.end();
});
