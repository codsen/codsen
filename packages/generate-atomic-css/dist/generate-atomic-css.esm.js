/**
 * generate-atomic-css
 * Generate Atomic CSS
 * Version: 1.4.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/generate-atomic-css/
 */

import { right, left, leftSeq, rightSeq } from 'string-left-right';

var version = "1.4.0";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

function isStr(something) {
  return typeof something === "string";
}

const headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
};
const units = ["px", "em", "%", "rem", "cm", "mm", "in", "pt", "pc", "ex", "ch", "vw", "vmin", "vmax"];
const {
  CONFIGHEAD,
  CONFIGTAIL,
  CONTENTHEAD,
  CONTENTTAIL
} = headsAndTails;
const padLeftIfTheresOnTheLeft = [":"];

function extractConfig(str) {
  let extractedConfig = str;
  let rawContentAbove = "";
  let rawContentBelow = "";

  if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {

    if (str.indexOf(CONFIGTAIL) !== -1 && str.indexOf(CONTENTHEAD) !== -1 && str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)) {
      throw new Error(`generate-atomic-css: [THROW_ID_02] Config heads are after config tails!`);
    }

    let sliceFrom = str.indexOf(CONFIGHEAD) + CONFIGHEAD.length;
    let sliceTo = str.indexOf(CONFIGTAIL); // if there are opening CSS comments, include them:

    if (str[right(str, sliceFrom)] === "*" && str[right(str, right(str, sliceFrom))] === "/") {
      sliceFrom = right(str, right(str, sliceFrom)) + 1;
    } // if there are closing CSS comments include them too:


    if (str[left(str, sliceTo)] === "*" && str[left(str, left(str, sliceTo))] === "/") {
      sliceTo = left(str, left(str, sliceTo));
    }

    extractedConfig = str.slice(sliceFrom, sliceTo).trim();

    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      return [extractedConfig, rawContentAbove, rawContentBelow];
    }
  } else if (str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && str.includes(CONTENTHEAD)) {

    if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
      throw new Error(`generate-atomic-css: [THROW_ID_03] Config heads are after content heads!`);
    }

    extractedConfig = str.slice(str.indexOf(CONFIGHEAD) + CONFIGHEAD.length, str.indexOf(CONTENTHEAD));
  } else if (!str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && (str.includes(CONTENTHEAD) || str.includes(CONTENTTAIL))) {
    // strange case where instead of config heads/tails we have content heads/tails
    extractedConfig = str; // remove content head

    if (extractedConfig.includes(CONTENTHEAD)) { // if content heads are present, cut off right after the closing comment
      // if such follows, or right after heads if not

      if (left(str, extractedConfig.indexOf(CONTENTHEAD))) {
        let sliceTo = extractedConfig.indexOf(CONTENTHEAD); // if there are opening or closing comments, don't include those

        if (leftSeq(str, sliceTo, "/", "*")) {
          sliceTo = leftSeq(str, sliceTo, "/", "*").leftmostChar;
        }

        rawContentAbove = sliceTo === 0 ? "" : str.slice(0, sliceTo);
      }

      let sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;

      if (rightSeq(extractedConfig, sliceFrom - 1, "*", "/")) {
        sliceFrom = rightSeq(extractedConfig, sliceFrom - 1, "*", "/").rightmostChar + 1;
      }

      let sliceTo = null;

      if (str.includes(CONTENTTAIL)) {
        sliceTo = str.indexOf(CONTENTTAIL); // don't include comment on the left

        if (str[left(str, sliceTo)] === "*" && str[left(str, left(str, sliceTo))] === "/") {
          sliceTo = left(str, left(str, sliceTo));
        } // is there content afterwards?


        let contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

        if (str[right(str, contentAfterStartsAt - 1)] === "*" && str[right(str, right(str, contentAfterStartsAt - 1))] === "/") {
          contentAfterStartsAt = right(str, right(str, contentAfterStartsAt - 1)) + 1; // if there are non-whitespace characters, that's rawContentBelow
        }

        if (right(str, contentAfterStartsAt)) {
          rawContentBelow = str.slice(contentAfterStartsAt);
        }
      }

      if (sliceTo) {
        extractedConfig = extractedConfig.slice(sliceFrom, sliceTo).trim();
      } else {
        extractedConfig = extractedConfig.slice(sliceFrom).trim();
      }
    } // remove content tail
    else if (extractedConfig.includes(CONTENTTAIL)) {
        const contentInFront = [];
        let stopFilteringAndPassAllLines = false;
        extractedConfig = extractedConfig.split("\n").filter(rowStr => {
          if (!rowStr.includes("$$$") && !stopFilteringAndPassAllLines) {
            if (!stopFilteringAndPassAllLines) {
              contentInFront.push(rowStr);
            }

            return false;
          } // ... so the row contains $$$


          if (!stopFilteringAndPassAllLines) {
            stopFilteringAndPassAllLines = true;
            return true;
          }

          return true;
        }).join("\n");
        let sliceTo = extractedConfig.indexOf(CONTENTTAIL);

        if (leftSeq(extractedConfig, sliceTo, "/", "*")) {
          sliceTo = leftSeq(extractedConfig, sliceTo, "/", "*").leftmostChar;
        }

        extractedConfig = extractedConfig.slice(0, sliceTo).trim();

        if (contentInFront.length) {
          rawContentAbove = `${contentInFront.join("\n")}\n`;
        } // retrieve the content after content tails


        let contentAfterStartsAt;

        if (right(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length)) {
          contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

          if (str[right(str, contentAfterStartsAt)] === "*" && str[right(str, right(str, contentAfterStartsAt))] === "/") {
            contentAfterStartsAt = right(str, right(str, contentAfterStartsAt)) + 1;

            if (right(str, contentAfterStartsAt)) {
              rawContentBelow = str.slice(contentAfterStartsAt);
            }
          }
        }
      }
  } else {
    const contentHeadsRegex = new RegExp(`(\\/\\s*\\*\\s*)*${CONTENTHEAD}(\\s*\\*\\s*\\/)*`);
    const contentTailsRegex = new RegExp(`(\\/\\s*\\*\\s*)*${CONTENTTAIL}(\\s*\\*\\s*\\/)*`);
    let stopFiltering = false;
    const gatheredLinesAboveTopmostConfigLine = [];
    const gatheredLinesBelowLastConfigLine = []; // remove all lines above the first line which contains $$$

    const configLines = str.split("\n").filter(rowStr => {
      if (stopFiltering) {
        return true;
      }

      if (!rowStr.includes("$$$") && !rowStr.includes("{") && !rowStr.includes(":")) {
        gatheredLinesAboveTopmostConfigLine.push(rowStr);
        return false;
      } // but if it does contain $$$...


      stopFiltering = true;
      return true;
    }); // now we need to separate any rows in the end that don't contain $$$

    for (let i = configLines.length; i--;) {
      if (!configLines[i].includes("$$$") && !configLines[i].includes("}") && !configLines[i].includes(":")) {
        gatheredLinesBelowLastConfigLine.unshift(configLines.pop());
      } else {
        break;
      }
    }

    extractedConfig = configLines.join("\n").replace(contentHeadsRegex, "").replace(contentTailsRegex, "");

    if (gatheredLinesAboveTopmostConfigLine.length) {
      rawContentAbove = `${gatheredLinesAboveTopmostConfigLine.join("\n")}\n`;
    }

    if (gatheredLinesBelowLastConfigLine.length) {
      rawContentBelow = `\n${gatheredLinesBelowLastConfigLine.join("\n")}`;
    }
  }
  return [extractedConfig, rawContentAbove, rawContentBelow];
}

function trimBlankLinesFromLinesArray(lineArr, trim = true) {
  // killswitch is activated, do nothing
  if (!trim) {
    return lineArr;
  }

  const copyArr = Array.from(lineArr);

  if (copyArr.length && isStr(copyArr[0]) && !copyArr[0].trim().length) {
    do {
      copyArr.shift();
    } while (isStr(copyArr[0]) && !copyArr[0].trim().length);
  }

  if (copyArr.length && isStr(copyArr[copyArr.length - 1]) && !copyArr[copyArr.length - 1].trim().length) {
    do {
      copyArr.pop();
    } while (copyArr && copyArr[copyArr.length - 1] && !copyArr[copyArr.length - 1].trim().length);
  }

  return copyArr;
} // takes string for example, .mt$$$ { margin-top: $$$px; }|3
// and extracts the parts after the pipe
// also, we use it for simpler format sources that come from wizard on the
// webapp, format .mt|0|500 - same business, extract digits between pipes


function extractFromToSource(str, fromDefault = 0, toDefault = 500) {
  let from = fromDefault;
  let to = toDefault;
  let source = str;
  let tempArr;

  if (str.lastIndexOf("}") > 0 && str.slice(str.lastIndexOf("}") + 1).includes("|")) {
    tempArr = str.slice(str.lastIndexOf("}") + 1).split("|").filter(val => val.trim().length).map(val => val.trim()).filter(val => String(val).split("").every(char => /\d/g.test(char)));
  } else if (str.includes("|")) {
    tempArr = str.split("|").filter(val => val.trim().length).map(val => val.trim()).filter(val => String(val).split("").every(char => /\d/g.test(char)));
  }

  if (Array.isArray(tempArr)) {
    if (tempArr.length === 1) {
      to = Number.parseInt(tempArr[0], 10);
    } else if (tempArr.length > 1) {
      from = Number.parseInt(tempArr[0], 10);
      to = Number.parseInt(tempArr[1], 10);
    }
  } // extract the source string - it's everything from zero to first pipe
  // that follows the last closing curly brace

  if (str.lastIndexOf("}") > 0 && str.slice(str.lastIndexOf("}") + 1).includes("|")) {
    source = str.slice(0, str.indexOf("|", str.lastIndexOf("}") + 1)).trimEnd();

    if (source.trim().startsWith("|")) {

      while (source.trim().startsWith("|")) {
        source = source.trim().slice(1);
      }
    }
  } else {
    let lastPipeWasAt = null;
    let firstNonPipeNonWhitespaceCharMet = false;
    let startFrom = 0;
    let endTo = str.length; // null is fresh state, true is met, false is pattern of only digits was broken

    let onlyDigitsAndWhitespaceBeenMet = null;

    for (let i = 0, len = str.length; i < len; i++) { // first "cell" between pipes which contains only digits terminates the
      // loop; its opening pipe is "endTo", we slice up to it

      if ("0123456789".includes(str[i])) {
        // if it's digit...
        if (onlyDigitsAndWhitespaceBeenMet === null && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = true;
        }
      } // if not digit...
      else if (str[i] !== "|" && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = false;
        } // catch the last character


      if (!str[i + 1] && onlyDigitsAndWhitespaceBeenMet && lastPipeWasAt) {
        endTo = lastPipeWasAt;
      } // catch pipe


      if (str[i] === "|") {

        if (onlyDigitsAndWhitespaceBeenMet && lastPipeWasAt) {
          endTo = lastPipeWasAt;
          break;
        }

        lastPipeWasAt = i; // reset:

        onlyDigitsAndWhitespaceBeenMet = null;
      } else if (!firstNonPipeNonWhitespaceCharMet && str[i].trim().length) {
        firstNonPipeNonWhitespaceCharMet = true;

        if (lastPipeWasAt !== null) {
          startFrom = lastPipeWasAt + 1;
        }
      }
    }
    source = str.slice(startFrom, endTo).trimEnd();
  }

  return [from, to, source];
}

function prepLine(str, progressFn, subsetFrom, subsetTo, generatedCount, pad) {
  //
  //
  //
  //                PART I. Extract from, to and source values
  //
  //
  //
  let currentPercentageDone;
  let lastPercentage = 0; // we need to extract the "from" and to "values"
  // the separator is vertical pipe, which is a legit CSS selector

  const [from, to, source] = extractFromToSource(str, 0, 500); //
  //
  //
  //           PART II. extract dollar-dollar-dollar positions and types
  //
  //
  //

  const subsetRange = subsetTo - subsetFrom;
  let res = ""; // traverse

  for (let i = from; i <= to; i++) {
    let debtPaddingLen = 0; // if (pad) {

    let startPoint = 0;

    for (let y = 0, len = source.length; y < len; y++) {
      source[y].charCodeAt(0); // catch third dollar of three dollars in a row
      // -----------------------------------------------------------------------

      if (source[y] === "$" && source[y - 1] === "$" && source[y - 2] === "$") { // submit all the content up until now

        const restOfStr = source.slice(y + 1);
        let unitFound;

        if (i === 0 && // eslint-disable-next-line consistent-return, array-callback-return
        units.some(unit => {
          if (restOfStr.startsWith(unit)) {
            unitFound = unit;
            return true;
          }
        }) && (source[right(source, y + unitFound.length)] === "{" || !source[y + unitFound.length + 1].trim().length)) {
          res += `${source.slice(startPoint, y - 2)}${pad ? String(i).padStart(String(to).length - String(i).length + unitFound.length + 1) : i}`;
          startPoint = y + 1 + (unitFound ? unitFound.length : 0);
        } else {
          // extract units if any follow the $$$
          let unitThatFollow; // eslint-disable-next-line consistent-return, array-callback-return

          units.some(unit => {
            if (source.startsWith(unit, y + 1)) {
              unitThatFollow = unit;
              return true;
            }
          });

          if (!source[y - 3].trim().length || // eslint-disable-next-line
          padLeftIfTheresOnTheLeft.some(val => source.slice(startPoint, y - 2).trim().endsWith(val))) {
            // if left-side padding can be possible: // if the chunk we're adding starts with unit, we need to remove it
            // if it's zero'th row

            let temp = 0;

            if (i === 0) {
              // eslint-disable-next-line no-loop-func
              units.some(unit => {
                if (`${source.slice(startPoint, y - 2)}`.startsWith(unit)) {
                  temp = unit.length;
                }

                return true;
              });
            }

            res += `${source.slice(startPoint + temp, y - 2)}${pad ? String(i).padStart(String(to).length + (i === 0 && unitThatFollow ? unitThatFollow.length : 0)) : i}`;
          } else if (!source[y + 1].trim().length || source[right(source, y)] === "{") { // if right-side padding can be possible:

            res += `${source.slice(startPoint, y - 2)}${pad ? String(i).padEnd(String(to).length + (i === 0 && unitThatFollow ? unitThatFollow.length : 0)) : i}`;
          } else {
            res += `${source.slice(startPoint, y - 2)}${i}`; // also, make a note of padding which we'll need to do later,
            // in front of the next opening curlie.
            // for example, range is 0-10, so 2 digit padding, and we have
            // .pt0px[lang|=en]
            // this zero above needs to be padded at the next available location
            // that is before opening curlie.
            //

            if (pad) {
              debtPaddingLen = String(to).length - String(i).length;
            }
          }

          startPoint = y + 1;
        }
      } // catch opening curlie
      // -----------------------------------------------------------------------


      if (source[y] === "{" && pad) {

        if (debtPaddingLen) {
          res += `${source.slice(startPoint, y)}${` `.repeat(debtPaddingLen)}`;
          startPoint = y;
          debtPaddingLen = 0;
        }
      } // catch the last character of a line


      if (!source[y + 1]) {
        let unitFound;
        const restOfStr = source.slice(startPoint);

        if (i === 0 && // eslint-disable-next-line
        units.some(unit => {
          if (restOfStr.startsWith(unit)) {
            unitFound = unit;
            return true;
          }
        })) {
          res += `${source.slice(startPoint + unitFound.length)}`;
        } else {
          res += `${source.slice(startPoint)}`;
        } // add line break


        res += `${i !== to ? "\n" : ""}`;
      }
    } // eslint-disable-next-line no-param-reassign


    generatedCount.count += 1;

    if (typeof progressFn === "function") {
      currentPercentageDone = Math.floor(subsetFrom + i / (to - from) * subsetRange);

      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        progressFn(currentPercentageDone);
      }
    }
  }

  return res;
}

function bump(str, thingToBump) {
  if (/\.\w/g.test(str)) {
    // eslint-disable-next-line no-param-reassign
    thingToBump.count += 1;
  }

  return str;
}

function prepConfig(str, progressFn, progressFrom, progressTo, trim = true, generatedCount, pad) {
  // all rows will report the progress from progressFrom to progressTo.
  // For example, defaults 0 to 100.
  // If there are for example 5 rows, each row will iterate through
  // (100-0)/5 = 20 percent range. This means, progress bar will be jumpy:
  // it will pass rows without $$$ quick but ones with $$$ slow and granular.
  return trimBlankLinesFromLinesArray(str.split(/\r?\n/).map((rowStr, i, arr) => rowStr.includes("$$$") ? prepLine(rowStr, progressFn, progressFrom + (progressTo - progressFrom) / arr.length * i, progressFrom + (progressTo - progressFrom) / arr.length * (i + 1), generatedCount, pad) : bump(rowStr, generatedCount)), trim).join("\n");
}

const version$1 = version;
const defaults = {
  includeConfig: true,
  includeHeadsAndTails: true,
  pad: true,
  configOverride: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};

function genAtomic(str, originalOpts) {
  function trimIfNeeded(str2, opts = {}) {
    // if config and heads/tails are turned off, don't trim
    if (!opts.includeConfig && !opts.includeHeadsAndTails) {
      return str2;
    }
    return str2.trim();
  }

  if (typeof str !== "string") {
    throw new Error(`generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as "${JSON.stringify(str, null, 4)}" (type ${typeof str})`);
  }

  const {
    CONFIGHEAD,
    CONFIGTAIL,
    CONTENTHEAD,
    CONTENTTAIL
  } = headsAndTails;
  const generatedCount = {
    count: 0
  };
  const opts = { ...defaults,
    ...originalOpts
  };

  if (opts.includeConfig && !opts.includeHeadsAndTails) {
    // opts.includeConfig is a superset feature of opts.includeHeadsAndTails
    opts.includeHeadsAndTails = true;
  } // quick end if there are no $$$ in the input


  if (!opts.configOverride && !str.includes("$$$") && !str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && !str.includes(CONTENTHEAD) && !str.includes(CONTENTTAIL) || opts && opts.configOverride && typeof opts.configOverride === "string" && !opts.configOverride.includes("$$$") && !opts.configOverride.includes(CONFIGHEAD) && !opts.configOverride.includes(CONFIGTAIL) && !opts.configOverride.includes(CONTENTHEAD) && !opts.configOverride.includes(CONTENTTAIL)) {
    return {
      log: {
        count: 0
      },
      result: str
    };
  } // either insert the generated CSS in between placeholders or just return the
  // generated CSS


  let frontPart = "";
  let endPart = ""; // find out what to generate
  // eslint-disable-next-line prefer-const

  let [extractedConfig, rawContentAbove, rawContentBelow] = extractConfig(opts.configOverride ? opts.configOverride : str);

  if (typeof extractedConfig !== "string" || !extractedConfig.trim()) {
    return {
      log: {
        count: 0
      },
      result: ""
    };
  }

  if (opts.includeConfig || opts.includeHeadsAndTails) {
    // wrap with content heads:
    frontPart = `${CONTENTHEAD} */\n`;

    if (!opts.includeConfig) {
      frontPart = `/* ${frontPart}`;
    } // and with content tails:


    endPart = `\n/* ${CONTENTTAIL} */`;
  } // tackle config

  if (opts.includeConfig) {
    frontPart = `/* ${CONFIGHEAD}\n${extractedConfig.trim()}\n${CONFIGTAIL}\n${frontPart}`;
  } // maybe there was some content above?

  if (str.includes(CONFIGHEAD)) {

    if (left(str, str.indexOf(CONFIGHEAD)) != null) { // in normal cases, content should be between opening CSS comment +
      // CONFIGHEAD and CONFIGTAIL + closing CSS comment, we just have to mind
      // the whitespace

      let sliceUpTo = str.indexOf(CONFIGHEAD);

      if (str[left(str, sliceUpTo)] === "*" && str[left(str, left(str, sliceUpTo))] === "/") {
        sliceUpTo = left(str, left(str, sliceUpTo));
      }
      let putInFront = "/* ";

      if (str[right(str, sliceUpTo - 1)] === "/" && str[right(str, right(str, sliceUpTo - 1))] === "*" || frontPart.trim().startsWith("/*")) {
        putInFront = "";
      } //       console.log(`187 ASSEMBLING frontPart:\n
      // \n1. str.slice(0, sliceUpTo)="${str.slice(0, sliceUpTo)}"
      // \n2. putInFront="${putInFront}"
      // \n3. frontPart="${frontPart}"
      // `);


      frontPart = `${str.slice(0, sliceUpTo)}${putInFront}${frontPart}`;
    }
  }

  if (str.includes(CONFIGTAIL) && right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) { // extract content that follows CONFIGTAIL:

    let sliceFrom = str.indexOf(CONFIGTAIL) + CONFIGTAIL.length; // include closing comment:

    if (str[right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)] === "*" && str[right(str, right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length))] === "/") {
      sliceFrom = right(str, right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) + 1;
    } // in clean code case, opening head of content follows so let's check for it


    if (str.slice(right(str, sliceFrom - 1)).startsWith(CONTENTHEAD)) {
      const contentHeadsStartAt = right(str, sliceFrom);
      sliceFrom = contentHeadsStartAt || 0 + CONTENTHEAD.length;

      if (str[right(str, sliceFrom - 1)] === "*" && str[right(str, right(str, sliceFrom - 1))] === "/") {
        sliceFrom = right(str, right(str, sliceFrom - 1)) + 1;
      } // if CONTENTTAIL exists, jump over all the content


      if (str.includes(CONTENTTAIL)) {
        sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length; // tackle any closing comment that follows:

        if (str[right(str, sliceFrom)] === "*" && str[right(str, right(str, sliceFrom))] === "/") {
          sliceFrom = right(str, right(str, sliceFrom)) + 1;
        }
      }
    } // now, check, does this ending chunk already include the content heads,
    // GENERATE-ATOMIC-CSS-CONTENT-STARTS,
    // because if so, there will be duplication and we need to remove them

    const slicedFrom = str.slice(sliceFrom);

    if (slicedFrom.length && slicedFrom.includes(CONTENTTAIL)) {
      sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

      if (str[right(str, sliceFrom)] === "*" && str[right(str, right(str, sliceFrom))] === "/") {
        sliceFrom = right(str, right(str, sliceFrom)) + 1;
      }
    } //     console.log(`292 ASSEMBLE endPart:
    // \n1. endPart = "${endPart}"
    // \n2. bool str[sliceFrom] && right(str, sliceFrom - 1) = ${str[sliceFrom] &&
    //       right(str, sliceFrom - 1)}
    // \n3. str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(slicedFrom) : "" = "${
    //       str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(slicedFrom) : ""
    //     }"
    // \n4. sliceFrom = ${sliceFrom}
    // \n5. str.slice(${slicedFrom}) = ${`\u001b[${31}m${str.slice(
    //       slicedFrom
    //     )}\u001b[${39}m`}
    // `);


    endPart = `${endPart}${str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(sliceFrom) : ""}`;
  }

  if (typeof rawContentAbove === "string") {
    frontPart = `${rawContentAbove}${frontPart}`;
  }

  if (typeof rawContentBelow === "string") { // precaution if rawContentBelow ends but not starts with CSS comment

    if (rawContentBelow.trim().endsWith("/*") && !rawContentBelow.trim().startsWith("*/")) { // but leave leading whitespace intact

      let frontPart2 = "";

      if (typeof rawContentBelow === "string" && rawContentBelow[0] && !rawContentBelow[0].trim()) {
        frontPart2 = rawContentBelow.slice(0, right(rawContentBelow, 0) || 0);
      }

      rawContentBelow = `${frontPart2}/* ${rawContentBelow.trim()}`;
    }

    endPart = `${endPart}${rawContentBelow}`;
  }
  const finalRes = `${trimIfNeeded(`${frontPart}${prepConfig(extractedConfig, opts.reportProgressFunc, opts.reportProgressFuncFrom, opts.reportProgressFuncTo, true, // opts.includeConfig || opts.includeHeadsAndTails
  generatedCount, opts.pad)}${endPart}`, opts)}\n`;
  return {
    log: {
      count: generatedCount.count
    },
    result: finalRes
  };
}

export { defaults, extractFromToSource, genAtomic, headsAndTails, version$1 as version };
