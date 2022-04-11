import includes from "lodash.includes";
import { version as v } from "../package.json";

const version: string = v;

interface Opts {
  msg: string;
  optsVarName: string;
}
const defaults: Opts = {
  msg: "",
  optsVarName: "given variable",
};

function arrObjOrBoth(
  str: string,
  originalOpts?: Partial<Opts>
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

  let opts = { ...defaults, ...originalOpts };

  if (opts?.msg && opts.msg.length) {
    opts.msg = `${opts.msg.trim()} `;
  }
  if (opts.optsVarName !== "given variable") {
    opts.optsVarName = `variable "${opts.optsVarName}"`;
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
    `${opts.msg}The ${opts.optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.`
  );
}

export { arrObjOrBoth, defaults, version };
