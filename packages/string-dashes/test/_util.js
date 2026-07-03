import { mixer as originalMixer } from "test-mixer";
import { defaults } from "../dist/string-dashes.esm.js";

export function mixer(ref) {
  return originalMixer(ref, defaults);
}
