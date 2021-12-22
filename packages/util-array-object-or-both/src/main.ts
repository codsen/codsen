import includes from "lodash.includes";

interface Opts {
  msg?: string;
  optsVarName?: string;
}

function arrObjOrBoth(
  str: string,
  originalOpts?: Opts
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

  let defaults: Opts = {
    msg: "",
    optsVarName: "given variable",
  };
  let opts = { ...defaults, ...originalOpts };

  if (opts?.msg && opts.msg.length > 0) {
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

export { arrObjOrBoth };
