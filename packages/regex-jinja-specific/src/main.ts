import { version as v } from "../package.json";

const version: string = v;

function isJinjaSpecific(): RegExp {
  return /(\bset\s+[\w]+\s*=\s*namespace\s*\()|(\|\s*format\s*\()/gi;
}

export { isJinjaSpecific, version };
