import { mixer } from "test-mixer";

import { defaults } from "../../dist/string-truncator.esm.js";

function mixerToExport(ref) {
  return mixer(ref, defaults);
}

// -----------------------------------------------------------------------------

export { mixerToExport as mixer };
