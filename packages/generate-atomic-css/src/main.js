import { version } from "../package.json";
import { left, right, leftSeq, rightSeq } from "string-left-right";
import { prepConfig } from "./util";
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

  // find out what to generate
  let extractedConfig;
  if (opts.configOverride) {
    console.log(`042 config calc - case #1`);
    extractedConfig = opts.configOverride;
  } else if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    console.log(`045 config calc - case #2`);
    if (str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_02] Config heads are after config tails!`
      );
    }
    extractedConfig = str.slice(
      str.indexOf(CONFIGHEAD) + CONFIGHEAD.length,
      str.indexOf(CONFIGTAIL)
    );
  } else if (
    str.includes(CONFIGHEAD) &&
    !str.includes(CONFIGTAIL) &&
    str.includes(CONTENTHEAD)
  ) {
    console.log(`060 config calc - case #3`);
    if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_03] Config heads are after content heads!`
      );
    }
    extractedConfig = str.slice(
      str.indexOf(CONFIGHEAD) + CONFIGHEAD.length,
      str.indexOf(CONTENTHEAD)
    );
  } else {
    console.log(`071 config calc - case #4`);
    extractedConfig = str;
  }
  console.log(
    `075 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`} = ${JSON.stringify(
      extractedConfig,
      null,
      4
    )}`
  );

  // rightSeq use example:

  // rightSeq("abcdefghijklmnop", 2, "d"),
  // {
  //   gaps: [],
  //   leftmostChar: 3,
  //   rightmostChar: 3
  // }

  // either insert the generated CSS in between placeholders or just return the
  // generated CSS
  let frontPart = "";
  let endPart = "";
  if (opts.includeConfig || opts.includeHeadsAndTails) {
    // wrap with content heads:
    frontPart = `${CONTENTHEAD} */\n`;
    // and with content tails:
    endPart = `\n/* ${CONTENTTAIL} */`;
  }

  // tackle config
  if (opts.includeConfig) {
    frontPart = `/* ${CONFIGHEAD}\n${extractedConfig.trim()}\n${CONFIGTAIL}\n${frontPart}`;
  }

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
      `118 ${`\u001b[${33}m${`matchedOpeningCSSCommentOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
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
      if (left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar)) {
        // add that content at the top:
        frontPart = `${str.slice(
          0,
          left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar) + 1
        )}\n${frontPart}`;
      }
    }
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
      `150 ${`\u001b[${33}m${`matchedClosingCSSCommentOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
        matchedClosingCSSCommentOnTheRight,
        null,
        4
      )}`
    );

    if (
      matchedClosingCSSCommentOnTheRight &&
      matchedClosingCSSCommentOnTheRight.rightmostChar &&
      right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)
    ) {
      // add that content at the bottom:
      endPart = `${endPart}\n${str.slice(
        right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)
      )}`;
    }
  }

  return `${`${frontPart}${prepConfig(
    extractedConfig,
    opts.reportProgressFunc,
    opts.reportProgressFuncFrom,
    opts.reportProgressFuncTo
  )}${endPart}`.trimEnd()}\n`;
}

export { genAtomic, version, headsAndTails };
