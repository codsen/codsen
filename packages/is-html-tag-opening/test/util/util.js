import { mixer } from "test-mixer";
import { defaults } from "../../dist/is-html-tag-opening.esm";

function mixerToExport(ref) {
  return mixer({ ...ref }, defaults);
}

// -----------------------------------------------------------------------------

export { mixerToExport as mixer };
