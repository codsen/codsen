import { version as v } from "../package.json";

const version: string = v;

function isJinjaSpecific(): RegExp {
  return /(\bset\s+[\w]+\s*=\s*namespace\()|(['"]%x?[+0]?[.>^<]?\d+[\w%]['"]\|format\()/gi;
}

export { isJinjaSpecific, version };
