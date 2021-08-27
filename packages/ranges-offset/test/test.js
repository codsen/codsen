import tap from "tap";
import { rOffset } from "../dist/ranges-offset.esm.js";

tap.test(`01 - bool`, (t) => {
  t.strictSame(rOffset(true, 0), true, "01.01");
  t.strictSame(rOffset(true, 1), true, "01.02");
  t.strictSame(rOffset(true, 10), true, "01.03");
  t.end();
});

tap.test(`02 - null`, (t) => {
  t.strictSame(rOffset(null, 0), null, "02.01");
  t.strictSame(rOffset(null, 1), null, "02.02");
  t.strictSame(rOffset(null, 10), null, "02.03");
  t.end();
});

tap.test(`03 - empty array`, (t) => {
  t.strictSame(rOffset([], 0), [], "03.01");
  t.strictSame(rOffset([], 1), [], "03.02");
  t.strictSame(rOffset([], 10), [], "03.03");
  t.end();
});

tap.test(`04 - one empty range array`, (t) => {
  t.strictSame(rOffset([[]], 0), [[]], "04.01");
  t.strictSame(rOffset([[]], 1), [[]], "04.02");
  t.strictSame(rOffset([[]], 10), [[]], "04.03");
  t.end();
});

tap.test(`05`, (t) => {
  t.strictSame(rOffset([[0, 1]], 0), [[0, 1]], "05.01");
  t.strictSame(rOffset([[0, 1]], 1), [[1, 2]], "05.02");
  t.strictSame(rOffset([[0, 1]], 10), [[10, 11]], "05.03");
  t.end();
});

tap.test(`06 - missing offset value`, (t) => {
  t.strictSame(rOffset([[0, 1]]), [[0, 1]], "06.01");
  t.strictSame(rOffset([[1, 2]]), [[1, 2]], "06.02");
  t.strictSame(rOffset([[10, 11]]), [[10, 11]], "06.03");
  t.end();
});

tap.test(`07 - input args are not mutated`, (t) => {
  const input = [[0, 1]];
  t.strictSame(rOffset(input, 10), [[10, 11]], "07.01");
  t.strictSame(input, [[0, 1]], "07.02");
  t.end();
});
