import test from "ava";
import { generateShortname } from "../dist/util.esm";

test(`01.01 - \u001b[${33}m${`generateShortname`}\u001b[${39}m - turns indexes into strings`, t => {
  t.is(generateShortname(0), "a", "01.01.01");
  t.is(generateShortname(1), "b", "01.01.02");
  t.is(generateShortname(9999), "ntp", "01.01.03");
});
