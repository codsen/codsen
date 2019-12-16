import { left, right, leftSeq, rightSeq } from "string-left-right";
const isArr = Array.isArray;

function isStr(something) {
  return typeof something === "string";
}

const headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
};

const units = [
  "px",
  "em",
  "%",
  "rem",
  "cm",
  "mm",
  "in",
  "pt",
  "pc",
  "ex",
  "ch",
  "vw",
  "vmin",
  "vmax"
];

const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;

const padLeftIfTheresOnTheLeft = [":"];

function extractConfig(str) {
  console.log(
    `038 util ███████████████████████████████████████ extractConfig() ███████████████████████████████████████`
  );
  let extractedConfig = str;
  let rawContentAbove = "";
  let rawContentBelow = "";

  if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    console.log(`045 config calc - case #2`);

    if (
      str.indexOf(CONFIGTAIL) !== -1 &&
      str.indexOf(CONTENTHEAD) !== -1 &&
      str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)
    ) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_02] Config heads are after config tails!`
      );
    }
    let sliceFrom = str.indexOf(CONFIGHEAD) + CONFIGHEAD.length;
    let sliceTo = str.indexOf(CONFIGTAIL);
    // if there are opening CSS comments, include them:
    if (
      str[right(str, sliceFrom)] === "*" &&
      str[right(str, right(str, sliceFrom))] === "/"
    ) {
      sliceFrom = right(str, right(str, sliceFrom)) + 1;
    }
    // if there are closing CSS comments include them too:
    if (
      str[left(str, sliceTo)] === "*" &&
      str[left(str, left(str, sliceTo))] === "/"
    ) {
      sliceTo = left(str, left(str, sliceTo));
    }

    extractedConfig = str.slice(sliceFrom, sliceTo).trim();
    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      console.log(`075 util: return empty`);
      return {
        log: {
          count: 0
        },
        result: ""
      };
    }
    console.log(
      `084 util: ${`\u001b[${36}m${`extractedConfig.trim()`}\u001b[${39}m`} = "${extractedConfig.trim()}"`
    );
  } else if (
    str.includes(CONFIGHEAD) &&
    !str.includes(CONFIGTAIL) &&
    str.includes(CONTENTHEAD)
  ) {
    console.log(`091 config calc - case #3`);
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
    console.log(`107 config calc - case #4`);
    extractedConfig = str;

    // remove content head
    if (extractedConfig.includes(CONTENTHEAD)) {
      console.log(`112 CONTENTHEAD present`);
      // if content heads are present, cut off right after the closing comment
      // if such follows, or right after heads if not
      if (left(str, extractedConfig.indexOf(CONTENTHEAD))) {
        console.log(`116 - characters present on the left of contenthead`);
        let sliceTo = extractedConfig.indexOf(CONTENTHEAD);
        // if there are opening or closing comments, don't include those
        if (leftSeq(str, sliceTo, "/", "*")) {
          console.log(`120`);
          sliceTo = leftSeq(str, sliceTo, "/", "*").leftmostChar;
        }
        rawContentAbove = sliceTo === 0 ? "" : str.slice(0, sliceTo);
        console.log(
          `125 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
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
        `139 ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${JSON.stringify(
          sliceFrom,
          null,
          4
        )}`
      );
      if (rightSeq(extractedConfig, sliceFrom - 1, "*", "/")) {
        sliceFrom =
          rightSeq(extractedConfig, sliceFrom - 1, "*", "/").rightmostChar + 1;
      }
      let sliceTo = null;

      if (str.includes(CONTENTTAIL)) {
        console.log(`152 content tail detected`);
        sliceTo = str.indexOf(CONTENTTAIL);
        console.log(
          `155 ${`\u001b[${33}m${`sliceTo`}\u001b[${39}m`} = ${JSON.stringify(
            sliceTo,
            null,
            4
          )}`
        );
        // don't include comment on the left
        if (
          str[left(str, sliceTo)] === "*" &&
          str[left(str, left(str, sliceTo))] === "/"
        ) {
          sliceTo = left(str, left(str, sliceTo));
          console.log(
            `168 ${`\u001b[${33}m${`sliceTo`}\u001b[${39}m`} = ${JSON.stringify(
              sliceTo,
              null,
              4
            )}`
          );
        }

        // is there content afterwards?
        let contentAfterStartsAt =
          str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        console.log(
          `180 ${`\u001b[${33}m${`contentAfterStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            contentAfterStartsAt,
            null,
            4
          )}; slice: "${str.slice(contentAfterStartsAt)}"`
        );
        if (
          str[right(str, contentAfterStartsAt - 1)] === "*" &&
          str[right(str, right(str, contentAfterStartsAt - 1))] === "/"
        ) {
          contentAfterStartsAt =
            right(str, right(str, contentAfterStartsAt - 1)) + 1;
          console.log(
            `193 ${`\u001b[${33}m${`contentAfterStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
              contentAfterStartsAt,
              null,
              4
            )}; slice: "${str.slice(contentAfterStartsAt)}"`
          );
          // if there are non-whitespace characters, that's rawContentBelow
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

      console.log(
        `213 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`} = ${JSON.stringify(
          extractedConfig,
          null,
          4
        )}`
      );
    }

    // remove content tail
    else if (extractedConfig.includes(CONTENTTAIL)) {
      console.log(`223 CONTENTTAIL present`);

      const contentInFront = [];
      let stopFilteringAndPassAllLines = false;
      extractedConfig = extractedConfig
        .split("\n")
        .filter(rowStr => {
          if (!rowStr.includes("$$$") && !stopFilteringAndPassAllLines) {
            if (!stopFilteringAndPassAllLines) {
              contentInFront.push(rowStr);
            }
            return false;
          }
          // ... so the row contains $$$
          if (!stopFilteringAndPassAllLines) {
            stopFilteringAndPassAllLines = true;
            return true;
          }
          return true;
        })
        .join("\n");

      let sliceTo = extractedConfig.indexOf(CONTENTTAIL);

      if (leftSeq(extractedConfig, sliceTo, "/", "*")) {
        sliceTo = leftSeq(extractedConfig, sliceTo, "/", "*").leftmostChar;
      }
      extractedConfig = extractedConfig.slice(0, sliceTo).trim();

      if (contentInFront.length) {
        rawContentAbove = `${contentInFront.join("\n")}\n`;
      }

      // retrieve the content after content tails
      let contentAfterStartsAt;
      if (right(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length)) {
        console.log(`259 content after CONTENTTAIL detected`);
        contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (
          str[right(str, contentAfterStartsAt)] === "*" &&
          str[right(str, right(str, contentAfterStartsAt))] === "/"
        ) {
          contentAfterStartsAt =
            right(str, right(str, contentAfterStartsAt)) + 1;
          if (right(str, contentAfterStartsAt)) {
            rawContentBelow = str.slice(contentAfterStartsAt);
          }
        }
      }
    }

    console.log(
      `275 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
        rawContentAbove,
        null,
        4
      )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
        rawContentBelow,
        null,
        4
      )}`
    );

    console.log(
      `287 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`} = ${JSON.stringify(
        extractedConfig,
        null,
        4
      )}`
    );
  } else {
    console.log(`294 config calc - case #5`);

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
      if (
        !rowStr.includes("$$$") &&
        !rowStr.includes("{") &&
        !rowStr.includes(":")
      ) {
        gatheredLinesAboveTopmostConfigLine.push(rowStr);
        return false;
      }
      // but if it does contain $$$...
      stopFiltering = true;
      return true;
    });

    // now we need to separate any rows in the end that don't contain $$$
    for (let i = configLines.length; i--; ) {
      if (
        !configLines[i].includes("$$$") &&
        !configLines[i].includes("}") &&
        !configLines[i].includes(":")
      ) {
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
    `352 util ███████████████████████████████████████ extractConfig() ends ███████████████████████████████████████`
  );
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
  if (
    copyArr.length &&
    isStr(copyArr[copyArr.length - 1]) &&
    !copyArr[copyArr.length - 1].trim().length
  ) {
    do {
      copyArr.pop();
    } while (
      copyArr &&
      copyArr[copyArr.length - 1] &&
      !copyArr[copyArr.length - 1].trim().length
    );
  }
  return copyArr;
}

// takes string for example, .mt$$$ { margin-top: $$$px; }|3
// and extracts the parts after the pipe
// also, we use it for simpler format sources that come from wizard on the
// webapp, format .mt|0|500 - same business, extract digits between pipes
function extractFromToSource(str, fromDefault = 0, toDefault = 500) {
  let from = fromDefault;
  let to = toDefault;
  let source = str;

  let tempArr;
  if (
    str.lastIndexOf("}") > 0 &&
    str.slice(str.lastIndexOf("}") + 1).includes("|")
  ) {
    console.log(`398 util: closing curlie detected`);
    tempArr = str
      .slice(str.lastIndexOf("}") + 1)
      .split("|")
      .filter(val => val.trim().length)
      .map(val => val.trim())
      .filter(val =>
        String(val)
          .split("")
          .every(char => /\d/g.test(char))
      );
  } else if (str.includes("|")) {
    console.log(`410 util: else case with pipes`);
    tempArr = str
      .split("|")
      .filter(val => val.trim().length)
      .map(val => val.trim())
      .filter(val =>
        String(val)
          .split("")
          .every(char => /\d/g.test(char))
      );
  }

  console.log(
    `423 util: ${`\u001b[${33}m${`tempArr`}\u001b[${39}m`} = ${JSON.stringify(
      tempArr,
      null,
      4
    )}`
  );
  if (isArr(tempArr)) {
    if (tempArr.length === 1) {
      to = Number.parseInt(tempArr[0], 10);
    } else if (tempArr.length > 1) {
      from = Number.parseInt(tempArr[0], 10);
      to = Number.parseInt(tempArr[1], 10);
    }
  }

  console.log(`438 from=${from}; to=${to}`);

  // extract the source string - it's everything from zero to first pipe
  // that follows the last closing curly brace
  if (
    str.lastIndexOf("}") > 0 &&
    str.slice(str.lastIndexOf("}") + 1).includes("|")
  ) {
    source = str.slice(0, str.indexOf("|", str.lastIndexOf("}") + 1)).trimEnd();
    if (source.trim().startsWith("|")) {
      console.log(`448 util: crop leading pipe`);
      while (source.trim().startsWith("|")) {
        source = source.trimStart().slice(1);
      }
    }
  } else {
    console.log(`454 ${`\u001b[${36}m${`loop`}\u001b[${39}m`}`);
    let lastPipeWasAt = null;
    let firstNonPipeNonWhitespaceCharMet = false;
    let startFrom = 0;
    let endTo = str.length;

    // null is fresh state, true is met, false is pattern of only digits was broken
    let onlyDigitsAndWhitespaceBeenMet = null;

    for (let i = 0, len = str.length; i < len; i++) {
      console.log(
        `465 ${`\u001b[${36}m${`------ ${`str[${i}] = ${`\u001b[${35}m${
          str[i]
        }\u001b[${39}m`}`} ------`}\u001b[${39}m`}`
      );

      // first "cell" between pipes which contains only digits terminates the
      // loop; its opening pipe is "endTo", we slice up to it
      if ("0123456789".includes(str[i])) {
        // if it's digit...

        if (onlyDigitsAndWhitespaceBeenMet === null && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = true;
          console.log(`477 SET onlyDigitsAndWhitespaceBeenMet = true`);
        }
      } else {
        // if not digit...

        if (str[i] !== "|" && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = false;
          console.log(`484 SET onlyDigitsAndWhitespaceBeenMet = false`);
        }
      }

      // catch the last character
      if (!str[i + 1] && onlyDigitsAndWhitespaceBeenMet) {
        endTo = lastPipeWasAt;
        console.log(
          `492 SET ${`\u001b[${33}m${`endTo`}\u001b[${39}m`} = ${endTo}`
        );
      }

      // catch pipe
      if (str[i] === "|") {
        console.log(`498 ${`\u001b[${33}m${`pipe caught`}\u001b[${39}m`}`);
        if (onlyDigitsAndWhitespaceBeenMet) {
          endTo = lastPipeWasAt;
          console.log(
            `502 set endTo = ${endTo}; ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
          );
          break;
        }

        lastPipeWasAt = i;
        console.log(`508 SET lastPipeWasAt = ${lastPipeWasAt}`);

        // reset:
        onlyDigitsAndWhitespaceBeenMet = null;
        console.log(`512 SET onlyDigitsAndWhitespaceBeenMet = null`);
      } else if (!firstNonPipeNonWhitespaceCharMet && str[i].trim().length) {
        firstNonPipeNonWhitespaceCharMet = true;
        if (lastPipeWasAt !== null) {
          startFrom = lastPipeWasAt + 1;
          console.log(
            `518 SET ${`\u001b[${33}m${`startFrom`}\u001b[${39}m`} = ${startFrom}`
          );
        }
        console.log(
          `522 SET ${`\u001b[${33}m${`firstNonPipeNonWhitespaceCharMet`}\u001b[${39}m`} = ${firstNonPipeNonWhitespaceCharMet};`
        );
      }

      console.log(
        `527 ${`\u001b[${90}m${` ENDING
startFrom = ${startFrom}
endTo = ${endTo}
onlyDigitsAndWhitespaceBeenMet = ${onlyDigitsAndWhitespaceBeenMet}
lastPipeWasAt = ${lastPipeWasAt}
`}\u001b[${39}m`}`
      );
    }
    console.log(`535 startFrom = ${startFrom}; endTo = ${endTo}`);
    source = str.slice(startFrom, endTo).trimEnd();
    console.log(
      `538 FINAL ${`\u001b[${33}m${`source`}\u001b[${39}m`} = ${source}`
    );
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
  let lastPercentage = 0;
  console.log(`\n\n\n\n\n`);
  console.log(`557 util: ${`\u001b[${36}m${`===========`}\u001b[${39}m`}`);
  console.log(
    `559 util: prepLine(): str: "${`\u001b[${35}m${str}\u001b[${39}m`}";\n${`\u001b[${35}m${`generatedCount`}\u001b[${39}m`} = ${JSON.stringify(
      generatedCount,
      null,
      0
    )}`
  );

  // we need to extract the "from" and to "values"
  // the separator is vertical pipe, which is a legit CSS selector

  const [from, to, source] = extractFromToSource(str, 0, 500);

  console.log(
    `572 ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}\n${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}\n${`\u001b[${33}m${`source`}\u001b[${39}m`} = "${source}"\n`
  );

  //
  //
  //
  //           PART II. extract dollar-dollar-dollar positions and types
  //
  //
  //

  const subsetRange = subsetTo - subsetFrom;
  let res = "";

  // traverse
  for (let i = from; i <= to; i++) {
    let debtPaddingLen = 0;
    console.log("\n");
    console.log(
      `591 ███████████████████████████████████████ row i=${i} ███████████████████████████████████████\n`
    );
    // if (pad) {
    let startPoint = 0;
    for (let y = 0, len = source.length; y < len; y++) {
      const charcode = source[y].charCodeAt(0);
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`source[ ${y} ] = ${
          source[y].trim().length
            ? source[y]
            : JSON.stringify(source[y], null, 0)
        }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m`
      );

      // catch third dollar of three dollars in a row
      // -----------------------------------------------------------------------
      if (source[y] === "$" && source[y - 1] === "$" && source[y - 2] === "$") {
        console.log(
          `609 ${`\u001b[${33}m${`startPoint`}\u001b[${39}m`} = ${JSON.stringify(
            startPoint,
            null,
            4
          )}`
        );
        console.log(`615 $$$ caught`);
        // submit all the content up until now
        const restOfStr = source.slice(y + 1);
        console.log(
          `619 ${`\u001b[${33}m${`restOfStr`}\u001b[${39}m`} = ${JSON.stringify(
            restOfStr,
            null,
            4
          )}`
        );
        let unitFound;

        console.log(`627`);
        if (
          i === 0 &&
          units.some(unit => {
            if (restOfStr.startsWith(unit)) {
              unitFound = unit;
              return true;
            }
          }) &&
          (source[right(source, y + unitFound.length)] === "{" ||
            !source[y + unitFound.length + 1].trim().length)
        ) {
          console.log(`639 push: "${source.slice(startPoint, y - 2)}"`);
          console.log(
            `641 push also: "${
              pad
                ? String(i).padStart(
                    String(to).length - String(i).length + unitFound.length + 1
                  )
                : i
            }"`
          );
          res += `${source.slice(startPoint, y - 2)}${
            pad
              ? String(i).padStart(
                  String(to).length - String(i).length + unitFound.length + 1
                )
              : i
          }`;
          console.log(`656 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`);
          startPoint = y + 1 + (unitFound ? unitFound.length : 0);
        } else {
          // extract units if any follow the $$$
          let unitThatFollow;
          console.log(`661`);
          units.some(unit => {
            if (source.slice(y + 1).startsWith(unit)) {
              unitThatFollow = unit;
              console.log(`665 return true`);
              return true;
            }
          });
          console.log(
            `670 extracted ${`\u001b[${33}m${`unitThatFollow`}\u001b[${39}m`} = ${JSON.stringify(
              unitThatFollow,
              null,
              4
            )}`
          );

          if (
            !source[y - 3].trim().length ||
            padLeftIfTheresOnTheLeft.some(val =>
              source
                .slice(startPoint, y - 2)
                .trim()
                .endsWith(val)
            )
          ) {
            // if left-side padding can be possible:
            console.log(
              `688 source.slice(startPoint, y - 2) = "${source.slice(
                startPoint,
                y - 2
              )}"`
            );
            console.log(
              `694 push ${`${source.slice(startPoint, y - 2)}${
                pad
                  ? String(i).padStart(
                      String(to).length +
                        (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                    )
                  : i
              }`}`
            );
            // if the chunk we're adding starts with unit, we need to remove it
            // if it's zero'th row
            let temp = 0;
            if (i === 0) {
              units.some(unit => {
                if (`${source.slice(startPoint, y - 2)}`.startsWith(unit)) {
                  temp = unit.length;
                }
                return true;
              });
            }

            res += `${source.slice(startPoint + temp, y - 2)}${
              pad
                ? String(i).padStart(
                    String(to).length +
                      (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                  )
                : i
            }`;
            console.log(
              `724 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`
            );
          } else if (
            !source[y + 1].trim().length ||
            source[right(source, y)] === "{"
          ) {
            console.log(
              `731 push ${`${source.slice(startPoint, y - 2)}${
                pad
                  ? String(i).padEnd(
                      String(to).length +
                        (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                    )
                  : i
              }`}`
            );
            // if right-side padding can be possible:
            res += `${source.slice(startPoint, y - 2)}${
              pad
                ? String(i).padEnd(
                    String(to).length +
                      (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                  )
                : i
            }`;
            console.log(
              `750 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`
            );
          } else {
            console.log(`753 push ${`${source.slice(startPoint, y - 2)}${i}`}`);
            res += `${source.slice(startPoint, y - 2)}${i}`;
            console.log(
              `756 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`
            );

            // also, make a note of padding which we'll need to do later,
            // in front of the next opening curlie.
            // for example, range is 0-10, so 2 digit padding, and we have
            // .pt0px[lang|=en]
            // this zero above needs to be padded at the next available location
            // that is before opening curlie.
            //

            if (pad) {
              debtPaddingLen = String(to).length - String(i).length;
              console.log(
                `770 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`debtPaddingLen`}\u001b[${39}m`} = ${JSON.stringify(
                  debtPaddingLen,
                  null,
                  4
                )}`
              );
            }
          }
          startPoint = y + 1;
        }
      }

      // catch opening curlie
      // -----------------------------------------------------------------------
      if (source[y] === "{" && pad) {
        console.log(`785 opening curlie caught`);
        if (debtPaddingLen) {
          res += `${source.slice(startPoint, y)}${` `.repeat(debtPaddingLen)}`;
          startPoint = y;
          debtPaddingLen = 0;
          console.log(
            `791 SET startPoint = ${startPoint}; debtPaddingLen = ${debtPaddingLen}`
          );
        }
      }

      // catch the last character of a line
      if (!source[y + 1]) {
        console.log(`798 last character on a line!`);
        console.log(
          `800 ${`\u001b[${33}m${`startPoint`}\u001b[${39}m`} = ${JSON.stringify(
            startPoint,
            null,
            4
          )}`
        );
        let unitFound;
        const restOfStr = source.slice(startPoint);
        console.log(
          `809 restOfStr = "${restOfStr}" --- we'll check, does it start with any elements from units`
        );
        if (
          i === 0 &&
          units.some(unit => {
            if (restOfStr.startsWith(unit)) {
              unitFound = unit;
              return true;
            }
          })
        ) {
          console.log(
            `821 push "${source.slice(startPoint + unitFound.length)}"`
          );
          res += `${source.slice(startPoint + unitFound.length)}`;
          console.log(`824 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`);
        } else {
          console.log(`826 last char - submit "${source.slice(startPoint)}"`);
          res += `${source.slice(startPoint)}`;
          console.log(`828 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`);
        }
        // add line break
        res += `${i !== to ? "\n" : ""}`;
        console.log(
          `833 add line break ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`
        );
      }
    }
    generatedCount.count++;

    if (typeof progressFn === "function") {
      currentPercentageDone = Math.floor(
        subsetFrom + (i / (to - from)) * subsetRange
      );

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
    thingToBump.count++;
  }
  return str;
}

function prepConfig(
  str,
  progressFn,
  progressFrom,
  progressTo,
  trim = true,
  generatedCount,
  pad
) {
  // all rows will report the progress from progressFrom to progressTo.
  // For example, defaults 0 to 100.
  // If there are for example 5 rows, each row will iterate through
  // (100-0)/5 = 20 percent range. This means, progress bar will be jumpy:
  // it will pass rows without $$$ quick but ones with $$$ slow and granular.
  return trimBlankLinesFromLinesArray(
    str
      .split(/\r?\n/)
      .map((rowStr, i, arr) =>
        rowStr.includes("$$$")
          ? prepLine(
              rowStr,
              progressFn,
              progressFrom + ((progressTo - progressFrom) / arr.length) * i,
              progressFrom +
                ((progressTo - progressFrom) / arr.length) * (i + 1),
              generatedCount,
              pad
            )
          : bump(rowStr, generatedCount)
      ),
    trim
  ).join("\n");
}

export {
  prepLine,
  prepConfig,
  isStr,
  isArr,
  extractFromToSource,
  extractConfig,
  headsAndTails
};
