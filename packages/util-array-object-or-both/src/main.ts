import includes from "lodash.includes";

interface Opts {
  msg?: string;
  optsVarName?: string;
}

function arrObjOrBoth(
  str: string,
  originalOpts?: Opts
): "array" | "object" | "any" {
  const onlyObjectValues = ["object", "objects", "obj", "ob", "o"];
  const onlyArrayValues = ["array", "arrays", "arr", "aray", "arr", "a"];
  const onlyAnyValues = [
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

  const defaults: Opts = {
    msg: "",
    optsVarName: "given variable",
  };
  const opts = { ...defaults, ...originalOpts };

  if (opts && opts.msg && opts.msg.length > 0) {
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
