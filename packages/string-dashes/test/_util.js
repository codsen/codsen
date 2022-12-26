import { defaults } from "../dist/string-dashes.esm.js";
import { mixer as originalMixer } from "test-mixer";

export function mixer(ref) {
  return originalMixer(ref, defaults);
}
