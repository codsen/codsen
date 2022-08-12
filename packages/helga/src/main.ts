import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Obj {
  [key: string]: any;
}
export interface Opts {
  targetJSON: boolean;
}
const defaults = {
  targetJSON: false,
};

const escapes: Obj = {
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  v: "\v",
  "'": "'",
  '"': '"',
  "\\": "\\",
  "0": "\0",
};

function unescape(str: string): string {
  return str.replace(/\\([bfnrtv'"\\0])/g, (match) => {
    DEV && console.log(`${`\u001b[${33}m${`match`}\u001b[${39}m`} = ${match}`);
    return (
      escapes[match] ||
      (match && (match.startsWith(`\\`) ? escapes[match.slice(1)] : ""))
    );
  });
}

function helga(
  str: string,
  originalOpts?: Partial<Opts>
): { minified: string; beautified: string } {
  let opts = { ...defaults, ...originalOpts };
  // DEV && console.log(
  //   `011 using ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );

  // 1. beautification:
  // ---------------------------------------------------------------------------
  let beautified = unescape(str);

  // 2. minification:
  // ---------------------------------------------------------------------------
  let minified = unescape(str);
  if (opts.targetJSON) {
    // if target is JSON, replace all tabs with two spaces, then JSON stringify
    minified = JSON.stringify(minified.replace(/\t/g, "  "), null, 0);
    // remove wrapper quotes
    minified = minified.slice(1, minified.length - 1);
  }

  // ---------------------------------------------------------------------------
  return {
    minified,
    beautified,
  };
}

export { helga, defaults, version };
