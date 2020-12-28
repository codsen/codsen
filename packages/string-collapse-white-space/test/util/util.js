import { mixer } from "test-mixer";
import { defaults } from "../../dist/string-collapse-white-space.esm";

function mixerToExport(ref) {
  return mixer(ref, defaults);
}

// -----------------------------------------------------------------------------

export { mixerToExport as mixer };
