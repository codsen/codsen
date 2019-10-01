import obc from "object-boolean-combinations";
import clone from "lodash.clonedeep";
import { defaultOpts } from "../dist/util.esm";
import isCI from "is-ci";

function mixer(ref) {
  // for quick testing, you can short-wire to test only one set of options, instead
  // of 512, 2024, or whatever count mixer produced.
  const quickie = true;

  if (!isCI && quickie) {
    if (ref) {
      return [ref];
    }
    return [defaultOpts];
  }

  // clone and delete defaultOptsWithoutStripHtmlButIgnoreTags
  // key from the defaults obj
  const preppedDefaults = clone(defaultOpts);
  delete preppedDefaults.stripHtmlButIgnoreTags;

  const res = obc(preppedDefaults, ref);
  if (
    ref &&
    ref.stripHtmlButIgnoreTags &&
    Array.isArray(ref.stripHtmlButIgnoreTags) &&
    ref.stripHtmlButIgnoreTags.length
  ) {
    res.forEach(obj => {
      obj.stripHtmlButIgnoreTags = clone(ref.stripHtmlButIgnoreTags);
    });
  } else {
    res.forEach(obj => {
      obj.stripHtmlButIgnoreTags = clone(defaultOpts.stripHtmlButIgnoreTags);
    });
  }
  return res;
}

const allCombinations = clone(mixer());

export { mixer, allCombinations };
