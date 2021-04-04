import { comb as combUMD } from "../../dist/email-comb.umd";
import { comb as combESM } from "../../dist/email-comb.esm";
import { comb as combCJS } from "../../dist/email-comb.cjs";

function comb(t, str, opts) {
  // compare the results of all builds
  const res = combESM(str, opts);
  const resUMD = combUMD(str, opts);
  const resCJS = combCJS(str, opts);

  // ensure UMD build's output is identical
  t.equal(
    res.result,
    resUMD.result,
    `util/util.js: ${`\u001b[${31}m${`UMD build's output differs`}\u001b[${39}m`}`
  );
  // ensure CJS build's output is identical
  t.equal(
    res.result,
    resCJS.result,
    `util/util.js: ${`\u001b[${31}m${`UMD build's output differs`}\u001b[${39}m`}`
  );
  if (Array.isArray(res.ranges) && !res.ranges.length) {
    t.fail("empty ranges should be null, not empty array!");
  }
  return res;
}

export { comb };
