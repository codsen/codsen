import { version } from "../package.json";
import { left, right, leftSeq, rightSeq } from "string-left-right";
import { prepConfig, isStr, isArr } from "./util";
const headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
};

function genAtomic(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error(
      `generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as "${JSON.stringify(
        str,
        null,
        4
      )}" (type ${typeof str})`
    );
  }

  const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;
  const defaults = {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: true,
    configOverride: null,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100
  };

  const opts = Object.assign({}, defaults, originalOpts);
  if (opts.includeConfig && !opts.includeHeadsAndTails) {
    // opts.includeConfig is a superset feature of opts.includeHeadsAndTails
    opts.includeHeadsAndTails = true;
  }

  // quick end if there are no $$$ in the input
  if (
    (!opts.configOverride &&
      !str.includes("$$$") &&
      !str.includes(CONFIGHEAD) &&
      !str.includes(CONFIGTAIL) &&
      !str.includes(CONTENTHEAD) &&
      !str.includes(CONTENTTAIL)) ||
    (isStr(opts.configOverride) &&
      !opts.configOverride.includes("$$$") &&
      !opts.configOverride.includes(CONFIGHEAD) &&
      !opts.configOverride.includes(CONFIGTAIL) &&
      !opts.configOverride.includes(CONTENTHEAD) &&
      !opts.configOverride.includes(CONTENTTAIL))
  ) {
    console.log(`054 quick ending, no $$$ found, returning input str`);
    return str;
  }

  // either insert the generated CSS in between placeholders or just return the
  // generated CSS
  let frontPart = "";
  let endPart = "";

  let rawContentAbove = "";
  let rawContentBelow = "";

  // find out what to generate
  let extractedConfig;
  if (opts.configOverride) {
    console.log(`069 config calc - case #1`);
    extractedConfig = opts.configOverride;
  } else if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    console.log(`072 config calc - case #2`);

    if (
      str.indexOf(CONFIGTAIL) !== -1 &&
      str.indexOf(CONTENTHEAD) !== -1 &&
      str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)
    ) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_02] Config heads are after config tails!`
      );
    }
    extractedConfig = str.slice(
      str.indexOf(CONFIGHEAD) + CONFIGHEAD.length,
      str.indexOf(CONFIGTAIL)
    );
    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      console.log(`return empty`);
      return "";
    }
    console.log(`extractedConfig.trim() = "${extractedConfig.trim()}"`);
  } else if (
    str.includes(CONFIGHEAD) &&
    !str.includes(CONFIGTAIL) &&
    str.includes(CONTENTHEAD)
  ) {
    console.log(`097 config calc - case #3`);
    if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_03] Config heads are after content heads!`
      );
    }
    extractedConfig = str.slice(
      str.indexOf(CONFIGHEAD) + CONFIGHEAD.length,
      str.indexOf(CONTENTHEAD)
    );
  } else if (
    !str.includes(CONFIGHEAD) &&
    !str.includes(CONFIGTAIL) &&
    (str.includes(CONTENTHEAD) || str.includes(CONTENTTAIL))
  ) {
    // strange case where instead of config heads/tails we have content heads/tails
    console.log(`113 config calc - case #4`);
    extractedConfig = str;

    // remove content head
    if (extractedConfig.includes(CONTENTHEAD)) {
      console.log(`118 CONTENTHEAD present`);
      // if content heads are present, cut off right after the closing comment
      // if such follows, or right after heads if not
      if (left(str, extractedConfig.indexOf(CONTENTHEAD))) {
        console.log(`122`);
        let sliceTo = extractedConfig.indexOf(CONTENTHEAD);
        // if there are opening or closing comments, don't include those
        if (leftSeq(str, sliceTo, "/", "*")) {
          console.log(`126`);
          sliceTo = leftSeq(str, sliceTo, "/", "*").leftmostChar;
        }
        rawContentAbove = sliceTo === 0 ? "" : str.slice(0, sliceTo);
        console.log(
          `131 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
            rawContentAbove,
            null,
            4
          )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
            rawContentBelow,
            null,
            4
          )}`
        );
      }

      let sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;
      console.log(
        `145 ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${JSON.stringify(
          sliceFrom,
          null,
          4
        )}`
      );
      if (rightSeq(extractedConfig, sliceFrom - 1, "*", "/")) {
        sliceFrom =
          rightSeq(extractedConfig, sliceFrom - 1, "*", "/").rightmostChar + 1;
      }
      extractedConfig = extractedConfig.slice(sliceFrom).trim();
      console.log(
        `157 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`} = ${JSON.stringify(
          extractedConfig,
          null,
          4
        )}`
      );
    }

    // remove content tail
    if (extractedConfig.includes(CONTENTTAIL)) {
      let sliceTo = extractedConfig.indexOf(CONTENTTAIL);
      if (leftSeq(extractedConfig, sliceTo, "/", "*")) {
        sliceTo = leftSeq(extractedConfig, sliceTo, "/", "*").leftmostChar;
      }
      extractedConfig = extractedConfig.slice(0, sliceTo).trim();
    }

    console.log(
      `175 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`} = ${JSON.stringify(
        extractedConfig,
        null,
        4
      )}`
    );
  } else {
    console.log(`182 config calc - case #5`);

    const contentHeadsRegex = new RegExp(
      `(\\/\\s*\\*\\s*)*${CONTENTHEAD}(\\s*\\*\\s*\\/)*`
    );
    const contentTailsRegex = new RegExp(
      `(\\/\\s*\\*\\s*)*${CONTENTTAIL}(\\s*\\*\\s*\\/)*`
    );
    let stopFiltering = false;
    const gatheredLinesAboveTopmostConfigLine = [];
    const gatheredLinesBelowLastConfigLine = [];

    // remove all lines above the first line which contains $$$

    const configLines = str.split("\n").filter(rowStr => {
      if (stopFiltering) {
        return true;
      }
      if (!rowStr.includes("$$$")) {
        gatheredLinesAboveTopmostConfigLine.push(rowStr);
        return false;
      }
      // but if it does contain $$$...
      stopFiltering = true;
      return true;
    });

    // now we need to separate any rows in the end that don't contain $$$
    for (let i = configLines.length; i--; ) {
      if (!configLines[i].includes("$$$")) {
        gatheredLinesBelowLastConfigLine.unshift(configLines.pop());
      } else {
        break;
      }
    }

    extractedConfig = configLines
      .join("\n")
      .replace(contentHeadsRegex, "")
      .replace(contentTailsRegex, "");

    if (gatheredLinesAboveTopmostConfigLine.length) {
      rawContentAbove = `${gatheredLinesAboveTopmostConfigLine.join("\n")}\n`;
    }
    if (gatheredLinesBelowLastConfigLine.length) {
      rawContentBelow = `\n${gatheredLinesBelowLastConfigLine.join("\n")}`;
    }
  }

  console.log(
    `232 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`} = ${JSON.stringify(
      extractedConfig,
      null,
      4
    )}`
  );
  console.log(
    `239 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentAbove,
      null,
      4
    )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentBelow,
      null,
      4
    )}`
  );

  if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
    return "";
  }

  // rightSeq use example:

  // rightSeq("abcdefghijklmnop", 2, "d"),
  // {
  //   gaps: [],
  //   leftmostChar: 3,
  //   rightmostChar: 3
  // }

  if (opts.includeConfig || opts.includeHeadsAndTails) {
    // wrap with content heads:
    frontPart = `${CONTENTHEAD} */\n`;
    // and with content tails:
    endPart = `\n/* ${CONTENTTAIL} */`;
  }
  console.log("--------------------------------------------------");
  console.log(
    `271 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
  );

  // tackle config
  if (opts.includeConfig) {
    frontPart = `/* ${CONFIGHEAD}\n${extractedConfig.trim()}\n${CONFIGTAIL}\n${frontPart}`;
    console.log("--------------------------------------------------");
    console.log(
      `279 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  console.log(
    `284 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentAbove,
      null,
      4
    )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentBelow,
      null,
      4
    )}`
  );

  // maybe there was some content above?
  if (str.includes(CONFIGHEAD)) {
    // in normal cases, content should be between opening CSS comment and
    // CONFIGHEAD, we just have to mind the whitespace
    const matchedOpeningCSSCommentOnTheLeft = leftSeq(
      str,
      str.indexOf(CONFIGHEAD),
      "/",
      "*"
    );
    console.log(
      `306 ${`\u001b[${33}m${`matchedOpeningCSSCommentOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
        matchedOpeningCSSCommentOnTheLeft,
        null,
        4
      )}`
    );
    // if comment was found:
    if (
      matchedOpeningCSSCommentOnTheLeft &&
      matchedOpeningCSSCommentOnTheLeft.leftmostChar
    ) {
      console.log(
        `318 leftmostChar = ${matchedOpeningCSSCommentOnTheLeft.leftmostChar} - found clauses`
      );
      console.log(
        `321 left(str, ${
          matchedOpeningCSSCommentOnTheLeft.leftmostChar
        }) = ${left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar)}`
      );
      if (left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar) !== null) {
        // add that content at the top:
        frontPart = `${str.slice(
          0,
          matchedOpeningCSSCommentOnTheLeft.leftmostChar
        )}${
          frontPart.trim().startsWith("/*") ||
          (!opts.includeConfig && !opts.includeHeadsAndTails)
            ? ""
            : "/* "
        }${frontPart}`;
        console.log("--------------------------------------------------");
        console.log(
          `338 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
        );
      }
    }
  } else if (opts.includeHeadsAndTails && !frontPart.trim().startsWith("/*")) {
    // we might need to add opening CSS comment
    frontPart = `/* ${frontPart}`;
    console.log("--------------------------------------------------");
    console.log(
      `347 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }
  console.log(
    `351 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
  );

  console.log(
    `355 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentAbove,
      null,
      4
    )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentBelow,
      null,
      4
    )}`
  );

  if (isStr(rawContentAbove)) {
    console.log(`367 tackle pending rawContentAbove`);
    // precaution if rawContentAbove starts but not ends with CSS comment
    if (
      rawContentAbove.trim().startsWith("/*") &&
      !rawContentAbove.trim().endsWith("*/")
    ) {
      console.log(`373 add closing CSS comment block to rawContentAbove`);
      rawContentAbove = `${rawContentAbove.trim()} */${rawContentAbove.slice(
        left(rawContentAbove, rawContentAbove.length) + 1 // grab any trailing whitespace
      )}`;
    }

    frontPart = `${rawContentAbove}${frontPart}`;
    console.log("--------------------------------------------------");
    console.log(
      `382 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  // maybe there was some content below?
  if (str.includes(CONTENTTAIL)) {
    // CSS closing comment will follow our CONTENTTAIL, so we need to find
    // where exactly to cut off what follows that comment
    const matchedClosingCSSCommentOnTheRight = rightSeq(
      str,
      str.indexOf(CONTENTTAIL) + CONTENTTAIL.length,
      "*",
      "/"
    );
    console.log(
      `397 ${`\u001b[${33}m${`matchedClosingCSSCommentOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
        matchedClosingCSSCommentOnTheRight,
        null,
        4
      )}`
    );

    console.log(
      `405 right(str, ${
        matchedClosingCSSCommentOnTheRight.rightmostChar
      }) = ${right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)}`
    );
    if (
      matchedClosingCSSCommentOnTheRight &&
      matchedClosingCSSCommentOnTheRight.rightmostChar &&
      right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)
    ) {
      // add that content at the bottom:
      endPart = `${endPart}${str.slice(
        matchedClosingCSSCommentOnTheRight.rightmostChar + 1
      )}`;
      console.log("--------------------------------------------------");
      console.log(
        `420 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
      );
    }
  }

  if (isStr(rawContentBelow)) {
    console.log(`426 tackle pending rawContentBelow`);
    // precaution if rawContentBelow ends but not starts with CSS comment
    if (
      rawContentBelow.trim().endsWith("/*") &&
      !rawContentBelow.trim().startsWith("*/")
    ) {
      console.log(`432 add opening CSS comment block to rawContentBelow`);
      // but leave leading whitespace intact
      let frontPart = "";
      if (
        isStr(rawContentBelow) &&
        rawContentBelow[0] &&
        !rawContentBelow[0].trim().length
      ) {
        frontPart = rawContentBelow.slice(0, right(rawContentBelow, 0));
      }
      rawContentBelow = `${frontPart}/* ${rawContentBelow.trim()}`;
    }

    endPart = `${endPart}${rawContentBelow}`;
    console.log("--------------------------------------------------");

    console.log(
      `449 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  console.log("--------------------------------------------------");
  console.log(
    `455 FINAL ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
  );

  function trimIfNeeded(str) {
    // if config and heads/tails are turned off, don't trim
    if (!opts.includeConfig && !opts.includeHeadsAndTails) {
      console.log(`461 didn't trim`);
      return str;
    }
    console.log(`464 trim`);
    return str.trim();
  }

  const finalRes = `${trimIfNeeded(
    `${frontPart}${prepConfig(
      extractedConfig,
      opts.reportProgressFunc,
      opts.reportProgressFuncFrom,
      opts.reportProgressFuncTo,
      true // opts.includeConfig || opts.includeHeadsAndTails
    )}${endPart}`
  )}\n`;

  console.log(
    `479\n\n\nFINAL RES:
${`\u001b[${36}m${`███████████████████████████████████████`}\u001b[${39}m`}
${finalRes}
${`\u001b[${36}m${`███████████████████████████████████████`}\u001b[${39}m`}

`
  );

  return finalRes;
}

export { genAtomic, version, headsAndTails };
