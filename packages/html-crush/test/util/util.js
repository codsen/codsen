// import fs from "fs";
// import path from "path";
import { mixer } from "test-mixer";
import { rApply } from "ranges-apply";

import { crush as crushESM, defaults } from "../../dist/html-crush.esm.js";

// sugar-coat the mixer to avoid putting "defaults" everywhere
function mixerToExport(ref) {
  return mixer(ref, defaults);
}

function m(equal, str, opts) {
  // let extractedInputs = new Set(
  //   JSON.parse(
  //     fs.readFileSync(path.resolve("./test/util/extractedInputs.json"), "utf8")
  //   )
  // );
  // if (str.trim().length > 3) {
  //   extractedInputs.add(str);
  //   fs.writeFileSync(
  //     path.resolve("./test/util/extractedInputs.json"),
  //     JSON.stringify([...extractedInputs], null, 0)
  //   );
  // }

  // check, do ranges really render into the result string
  let res = crushESM(str, opts);
  equal(
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
    throw new Error("empty ranges should be null, not empty array!");
  }
  return res;
}

export { m, mixerToExport as mixer };
