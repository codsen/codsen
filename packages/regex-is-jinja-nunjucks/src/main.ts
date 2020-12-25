import { version } from "../package.json";

function isJinjaNunjucksRegex(): RegExp {
  return /{%|{{|%}|}}/gi;
}
export { isJinjaNunjucksRegex, version };
