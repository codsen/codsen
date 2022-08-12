import { mixer } from "test-mixer";

import { defaults } from "../../dist/tsd-extract.esm.js";

function _mixerToExport(ref) {
  return mixer(ref, defaults);
}

// -----------------------------------------------------------------------------

export { _mixerToExport as mixer };
