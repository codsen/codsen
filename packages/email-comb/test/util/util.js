import { comb as comb1 } from "../../dist/email-comb.esm.js";

function comb(t, str, opts) {
  // compare the results of all builds
  const res = comb1(str, opts);

  if (Array.isArray(res.ranges) && !res.ranges.length) {
    t.fail("empty ranges should be null, not empty array!");
  }
  return res;
}

export { comb };
