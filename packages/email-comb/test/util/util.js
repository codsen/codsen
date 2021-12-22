import { comb as comb1 } from "../../dist/email-comb.esm.js";

function comb(str, opts) {
  // compare the results of all builds
  let res = comb1(str, opts);

  if (Array.isArray(res.ranges) && !res.ranges.length) {
    throw new Error("empty ranges should be null, not empty array!");
  }
  return res;
}

export { comb };
