import {
  fixEnt as fixEntESM,
  allRules,
} from "../../dist/string-fix-broken-named-entities.esm.js";

function fix(ok, ...args) {
  // check, are all emitted rules present in "allRules"
  fixEntESM(...args).forEach((o) => {
    if (o && o.ruleName) {
      ok(
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
