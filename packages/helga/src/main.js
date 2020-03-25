import unescapeJs from "unescape-js";
import { version } from "../package.json";

const defaults = {
  targetJSON: false,
};

function helga(str, originalOpts) {
  const opts = Object.assign({}, defaults, originalOpts);
  // console.log(
  //   `011 using ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );

  // 1. beautification:
  // ---------------------------------------------------------------------------
  const beautified = unescapeJs(str);

  // 2. minification:
  // ---------------------------------------------------------------------------
  let minified = unescapeJs(str);
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
