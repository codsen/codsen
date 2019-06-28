/**
 * generate-atomic-css
 * Generate Atomic CSS
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css
 */

import split from 'split-lines';

var version = "1.0.0";

function prepLine(str) {
  const split = str.split("|");
  let from = 0;
  let to = 500;
  if (split[1]) {
    if (split[2]) {
      from = split[1];
      to = split[2];
    } else {
      to = split[1];
    }
  }
  let res = "";
  for (let i = from; i <= to; i++) {
    res += `${i === 0 ? "" : "\n"}${
      i === 0
        ? split[0].replace(
            /\$\$\$(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax)?/g,
            i
          )
        : split[0].replace(/\$\$\$/g, i)
    }`;
  }
  return res;
}
function prepConfig(str) {
  return split(str)
    .map(rowStr => (rowStr.includes("$$$") ? prepLine(rowStr) : rowStr))
    .join("\n");
}
function generateAtomicCss(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error(
      `generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as "${JSON.stringify(
        str,
        null,
        4
      )}" (type ${typeof str})`
    );
  }
  const CONFIGHEAD = "GENERATE-ATOMIC-CSS-CONFIG-STARTS";
  const CONFIGTAIL = "GENERATE-ATOMIC-CSS-CONFIG-ENDS";
  const CONTENTHEAD = "GENERATE-ATOMIC-CSS-CONTENT-STARTS";
  const CONTENTTAIL = "GENERATE-ATOMIC-CSS-CONTENT-ENDS";
  const defaults = {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: true,
    configOverride: null
  };
  const opts = Object.assign({}, defaults, originalOpts);
  let extractedConfig;
  if (opts.configOverride) {
    extractedConfig = opts.configOverride;
  } else if (
    str.includes(CONFIGHEAD) &&
    str.includes(CONFIGTAIL) &&
    str.includes(CONTENTHEAD) &&
    str.includes(CONTENTTAIL)
  ) {
    extractedConfig = str.slice(
      str.indexOf(CONFIGHEAD) + CONFIGHEAD.length,
      str.indexOf(CONFIGTAIL)
    );
  } else {
    throw new Error(
      `generate-atomic-css: [THROW_ID_01] The input string does not contain:\n${
        !str.includes(CONFIGHEAD) ? `* config heads, "${CONFIGHEAD}"\n` : ""
      }${!str.includes(CONFIGTAIL) ? `* config tails, "${CONFIGTAIL}"\n` : ""}${
        !str.includes(CONTENTHEAD) ? `* content heads, "${CONTENTHEAD}"\n` : ""
      }${
        !str.includes(CONTENTTAIL) ? `* content heads, "${CONTENTTAIL}"\n` : ""
      }`
    );
  }
  return `${str.slice(
    0,
    str.indexOf(CONTENTHEAD) + CONTENTHEAD.length
  )}${prepConfig(extractedConfig)}${str.slice(str.indexOf(CONTENTTAIL))}`;
}

export { generateAtomicCss, version };
