import { includes } from "lodash-es";
import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  msg: string;
  optsVarName: string;
}
const defaults: Opts = {
  msg: "",
  optsVarName: "given variable",
};

function arrObjOrBoth(
  str: string,
  opts?: Partial<Opts>,
): "array" | "object" | "any" {
  let onlyObjectValues = ["object", "objects", "obj", "ob", "o"];
  let onlyArrayValues = ["array", "arrays", "arr", "aray", "arr", "a"];
  let onlyAnyValues = [
    "any",
    "all",
    "everything",
    "both",
    "either",
    "each",
    "whatever",
    "whatevs",
    "e",
  ];

  let resolvedOpts: Opts = { ...defaults, ...opts };

  if (resolvedOpts?.msg && resolvedOpts.msg.length) {
    resolvedOpts.msg = `${resolvedOpts.msg.trim()} `;
  }
  if (resolvedOpts.optsVarName !== "given variable") {
    resolvedOpts.optsVarName = `variable "${resolvedOpts.optsVarName}"`;
  }

  if (includes(onlyObjectValues, str.toLowerCase().trim())) {
    return "object";
  }
  if (includes(onlyArrayValues, str.toLowerCase().trim())) {
    return "array";
  }
  if (includes(onlyAnyValues, str.toLowerCase().trim())) {
    return "any";
  }
  throw new TypeError(
    `${resolvedOpts.msg}The ${resolvedOpts.optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.`,
  );
}

export { arrObjOrBoth, defaults, version };
