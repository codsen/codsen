import obc from "object-boolean-combinations";
import clone from "lodash.clonedeep";
import isCI from "is-ci";
// import objectPath from "object-path";
import { defaultOpts } from "../../src/util";
// import string-collapse-white-space from "../dist/string-collapse-white-space.cjs";

function mixer(ref) {
  // for quick testing, you can short-wire to test only one set of options, instead
  // of 512, 2024, or whatever count mixer produced.
  const quickie = false;

  if (!isCI && quickie) {
    if (ref) {
      return [ref];
    }
    return [defaultOpts];
  }
  const preppedDefaults = clone(defaultOpts);

  // delete non-bool keys

  delete preppedDefaults.limitConsecutiveEmptyLinesTo;
  delete preppedDefaults.cb;

  const res = obc(preppedDefaults, ref);

  // restore keys in limitConsecutiveEmptyLinesTo:
  if (ref && ref.limitConsecutiveEmptyLinesTo) {
    res.forEach((obj) => {
      obj.limitConsecutiveEmptyLinesTo = ref.limitConsecutiveEmptyLinesTo;
    });
  } else {
    res.forEach((obj) => {
      obj.limitConsecutiveEmptyLinesTo =
        defaultOpts.limitConsecutiveEmptyLinesTo;
    });
  }

  // restore keys in cb:
  if (ref && ref.cb) {
    res.forEach((obj) => {
      obj.cb = ref.cb;
    });
  } else {
    res.forEach((obj) => {
      obj.cb = defaultOpts.cb;
    });
  }
  return res;
}

// -----------------------------------------------------------------------------

const allCombinations = clone(mixer());

export { mixer, allCombinations };
