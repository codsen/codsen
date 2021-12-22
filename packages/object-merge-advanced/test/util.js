import { mergeAdvanced as m } from "../dist/object-merge-advanced.esm.js";

function mergeAdvanced(eq, input1, input2, opts) {
  // 1. make sure callback overrides work
  let returnsAlwaysFirstOne = (i1) => i1;
  let returnsAlwaysSecondOne = (_i1, i2) => i2;
  eq(m(input1, input2, { ...opts, cb: returnsAlwaysFirstOne }), input1);
  eq(m(input1, input2, { ...opts, cb: returnsAlwaysSecondOne }), input2);
  // now hand over to inline tests...
  return m(input1, input2, opts);
}

export { mergeAdvanced };
