import { compare } from "ast-compare";

// the plan is to consume the spread output of the function
function c(ok, thing1, thing2, ...args) {
  let res = compare(thing1, thing2, { verboseWhenMismatches: true });
  if (typeof res === "string") {
    return ok(false, res);
  }
  return ok(res, ...args);
}

export { c as compare };
