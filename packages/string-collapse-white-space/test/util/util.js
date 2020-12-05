import mixer from "test-mixer";
import { defaultOpts } from "../../src/util";

function mixerToExport(ref) {
  return mixer(ref, defaultOpts);
}

// -----------------------------------------------------------------------------

export { mixerToExport as mixer };
