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

export type ArrayObjectOrBoth = "array" | "object" | "any";

function arrObjOrBoth(str: string, opts?: Partial<Opts>): ArrayObjectOrBoth {
  if (typeof str !== "string") {
    throw new TypeError(
      `util-array-object-or-both/arrObjOrBoth(): [THROW_ID_01] The first argument must be a string; it was ${typeof str}.`,
    );
  }

  let normalized = str.trim().toLowerCase();
  switch (normalized) {
    case "object":
    case "objects":
    case "obj":
    case "ob":
    case "o":
      return "object";
    case "array":
    case "arrays":
    case "arr":
    case "aray":
    case "a":
      return "array";
    case "any":
    case "all":
    case "everything":
    case "both":
    case "either":
    case "each":
    case "whatever":
    case "whatevs":
    case "e":
      return "any";
  }

  let msg = opts?.msg?.length ? `${opts.msg.trim()} ` : "";
  let optsVarName = opts?.optsVarName ?? defaults.optsVarName;
  if (optsVarName !== defaults.optsVarName) {
    optsVarName = `variable "${optsVarName}"`;
  }
  throw new TypeError(
    `util-array-object-or-both/arrObjOrBoth(): [THROW_ID_02] ${msg}The ${optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.`,
  );
}

export { arrObjOrBoth, defaults, version };
