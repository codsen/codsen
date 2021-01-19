import { version as v } from "../package.json";
const version: string = v;

function isJinjaNunjucksRegex(): RegExp {
  return /{%|{{|%}|}}/gi;
}
export { isJinjaNunjucksRegex, version };
