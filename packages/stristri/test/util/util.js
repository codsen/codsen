import { mixer } from "test-mixer";
import rfdc from "rfdc";
import objectPath from "object-path";
import { stri as striApi, defaults } from "../../dist/stristri.esm.js";

const clone = rfdc();

function mixerToExport(ref) {
  return mixer(ref, defaults);
}

// t is passed node-tap test instance
// n is index number of a test - we need to run the resource-heavy
// test calculations only for the n === 0
function stri(assert, n, src, opts) {
  // If toggling any of the options makes a difference,
  // that option must be reported as "applicable". And on the opposite.
  let resolvedOpts = { ...defaults, ...opts };
  Object.keys(resolvedOpts).forEach((key) => {
    // only perform the check if "resolvedOpts" has the key's
    // value as boolean-type
    if (typeof resolvedOpts[key] === "boolean") {
      let obj1 = clone(resolvedOpts);
      objectPath.set(obj1, key, true);

      let obj2 = clone(resolvedOpts);
      objectPath.set(obj2, key, false);

      if (striApi(src, obj1).result !== striApi(src, obj2).result) {
        assert.ok(
          striApi(src, resolvedOpts).applicableOpts[key],
          `${`\u001b[${35}m${`applicableOpts.${key}`}\u001b[${39}m`} is reported wrongly: detergent yields different results on different opts.${key}:
  "${`\u001b[${33}m${JSON.stringify(
    striApi(src, obj1).result,
    null,
    4,
  )}\u001b[${39}m`}" (opts.${key}=true) and "${`\u001b[${33}m${JSON.stringify(
    striApi(src, obj2).result,
    null,
    4,
  )}\u001b[${39}m`}" (opts.${key}=false). Input was:\n${JSON.stringify(
    src,
    null,
    4,
  )}. Opts objects:\n\nobj1:\n${JSON.stringify(
    obj1,
    null,
    4,
  )}\nobj2:${JSON.stringify(obj2, null, 4)}\n`,
        );
      } else {
        assert.not.ok(
          striApi(src, resolvedOpts).applicableOpts[key],
          `${`\u001b[${35}m${`applicableOpts.${key}`}\u001b[${39}m`} is reported wrongly: detergent yields same results on different opts.${key}:
  "${`\u001b[${33}m${JSON.stringify(
    striApi(src, obj1).result,
    null,
    4,
  )}\u001b[${39}m`}". Input was:\n${JSON.stringify(
    src,
    null,
    4,
  )}. Opts objects:\n\nobj1:\n${JSON.stringify(
    obj1,
    null,
    4,
  )}\nobj2:${JSON.stringify(obj2, null, 4)}\n`,
        );
      }
    }
  });

  return striApi(src, opts);
}

export { stri, mixerToExport as mixer };
