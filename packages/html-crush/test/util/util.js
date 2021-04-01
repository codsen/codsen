import { mixer } from "test-mixer";
import { rApply } from "ranges-apply";
import { crush as crushUMD } from "../../dist/html-crush.umd";
import { crush as crushESM, defaults } from "../../dist/html-crush.esm";
import { crush as crushCJS } from "../../dist/html-crush.cjs";

// sugar-coat the mixer to avoid putting "defaults" everywhere
function mixerToExport(ref) {
  return mixer(ref, defaults);
}

function m(t, str, opts) {
  // check, do ranges really render into the result string
  const res = crushESM(str, opts);
  const resUMD = crushUMD(str, opts);
  const resCJS = crushCJS(str, opts);

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
  // Continue with ESM build's output
  t.equal(
    res.result,
    rApply(str, res.ranges),
    `ranges don't render into result string!\n\ninput string:\n${JSON.stringify(
      str,
      null,
      4
    )}\n\noutput string:\n${JSON.stringify(
      res.result,
      null,
      4
    )}\n\noutput ranges:\n${JSON.stringify(res.ranges, null, 4)}`
  );
  if (Array.isArray(res.ranges) && !res.ranges.length) {
    t.fail("empty ranges should be null, not empty array!");
  }
  return res;
}

export { m, mixerToExport as mixer };
