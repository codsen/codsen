import { mergeAdvanced as m } from "../dist/object-merge-advanced.esm";

function mergeAdvanced(t, input1, input2, opts) {
  // 1. make sure callback overrides work
  const returnsAlwaysFirstOne = (i1) => i1;
  const returnsAlwaysSecondOne = (_i1, i2) => i2;
  t.strictSame(
    m(input1, input2, { ...opts, cb: returnsAlwaysFirstOne }),
    input1
  );
  t.strictSame(
    m(input1, input2, { ...opts, cb: returnsAlwaysSecondOne }),
    input2
  );
  // now hand over to inline tests...
  return m(input1, input2, opts);
}

export { mergeAdvanced };
