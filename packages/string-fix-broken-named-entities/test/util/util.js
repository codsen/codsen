import {
  fixEnt as fixEntESM,
  allRules,
} from "../../dist/string-fix-broken-named-entities.esm";
import { fixEnt as fixEntCJS } from "../../dist/string-fix-broken-named-entities.cjs";
import { fixEnt as fixEntUMD } from "../../dist/string-fix-broken-named-entities.umd";

function fix(t, ...args) {
  // first, check does ESM produce the same output as CJS and UMD
  t.strictSame(
    fixEntCJS(...args),
    fixEntESM(...args),
    `CJS build is different from ESM! ${JSON.stringify(
      fixEntCJS(...args),
      null,
      4
    )}`
  );
  t.strictSame(
    fixEntUMD(...args),
    fixEntESM(...args),
    `CJS build is different from ESM! ${JSON.stringify(
      fixEntCJS(...args),
      null,
      4
    )}`
  );

  // then check, are all emitted rules present in "allRules"
  fixEntESM(...args).forEach((o) => {
    if (o && o.ruleName) {
      t.ok(
        allRules.includes(o.ruleName),
        `${o.ruleName} is not mentioned in allRules!`
      );
    }
  });
  // as long as coverage is 100%, this means, we prove that every raised
  // rule name will be among allRules[]

  // finally, return ESM for further testing:
  return fixEntESM(...args);
}

export default fix;
