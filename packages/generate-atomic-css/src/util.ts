/* 1eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { left, right, leftSeq, rightSeq } from "string-left-right";
import { isStr, Obj } from "codsen-utils";

declare let DEV: boolean;

const headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS",
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
  "vmax",
];

const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;

const padLeftIfTheresOnTheLeft = [":"];

function extractConfig(
  str: string,
): [extractedConfig: string, rawContentAbove: string, rawContentBelow: string] {
  DEV &&
    console.log(
      `041 util ███████████████████████████████████████ extractConfig() ███████████████████████████████████████`,
    );
  let extractedConfig = str;
  let rawContentAbove = "";
  let rawContentBelow = "";

  if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    DEV && console.log(`048 config calc - case #2`);

    if (
      str.indexOf(CONFIGTAIL) !== -1 &&
      str.indexOf(CONTENTHEAD) !== -1 &&
      str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)
    ) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_02] Config heads are after config tails!`,
      );
    }
    let sliceFrom = str.indexOf(CONFIGHEAD) + CONFIGHEAD.length;
    let sliceTo = str.indexOf(CONFIGTAIL);
    // if there are opening CSS comments, include them:
    if (
      str[right(str, sliceFrom) as number] === "*" &&
      str[right(str, right(str, sliceFrom) as number) as number] === "/"
    ) {
      sliceFrom = (right(str, right(str, sliceFrom) as number) as number) + 1;
    }
    // if there are closing CSS comments include them too:
    if (
      str[left(str, sliceTo) as number] === "*" &&
      str[left(str, left(str, sliceTo) as number) as number] === "/"
    ) {
      sliceTo = left(str, left(str, sliceTo) as number) as number;
    }

    extractedConfig = str.slice(sliceFrom, sliceTo).trim();
    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      DEV && console.log(`078 util: return empty`);
      return [extractedConfig, rawContentAbove, rawContentBelow];
    }
    DEV &&
      console.log(
        `083 util: ${`\u001b[${36}m${`extractedConfig.trim()`}\u001b[${39}m`} = "${extractedConfig.trim()}"`,
      );
  } else if (
    str.includes(CONFIGHEAD) &&
    !str.includes(CONFIGTAIL) &&
    str.includes(CONTENTHEAD)
  ) {
    DEV && console.log(`090 config calc - case #3`);
    if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_03] Config heads are after content heads!`,
      );
    }
    extractedConfig = str.slice(
      str.indexOf(CONFIGHEAD) + CONFIGHEAD.length,
      str.indexOf(CONTENTHEAD),
    );
  } else if (
    !str.includes(CONFIGHEAD) &&
    !str.includes(CONFIGTAIL) &&
    (str.includes(CONTENTHEAD) || str.includes(CONTENTTAIL))
  ) {
    // strange case where instead of config heads/tails we have content heads/tails
    DEV && console.log(`106 config calc - case #4`);
    extractedConfig = str;

    // remove content head
    if (extractedConfig.includes(CONTENTHEAD)) {
      DEV && console.log(`111 CONTENTHEAD present`);
      // if content heads are present, cut off right after the closing comment
      // if such follows, or right after heads if not
      if (left(str, extractedConfig.indexOf(CONTENTHEAD))) {
        DEV &&
          console.log(`116 - characters present on the left of contenthead`);
        let sliceTo = extractedConfig.indexOf(CONTENTHEAD);
        // if there are opening or closing comments, don't include those
        if (leftSeq(str, sliceTo, "/", "*")) {
          DEV && console.log(`120`);
          sliceTo = (leftSeq(str, sliceTo, "/", "*") as any).leftmostChar;
        }
        rawContentAbove = sliceTo === 0 ? "" : str.slice(0, sliceTo);
        DEV &&
          console.log(
            `126 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
              rawContentAbove,
              null,
              4,
            )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
              rawContentBelow,
              null,
              4,
            )}`,
          );
      }

      let sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;
      DEV &&
        console.log(
          `141 ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${JSON.stringify(
            sliceFrom,
            null,
            4,
          )}`,
        );
      if (rightSeq(extractedConfig, sliceFrom - 1, "*", "/")) {
        sliceFrom =
          ((rightSeq(extractedConfig, sliceFrom - 1, "*", "/") as any)
            .rightmostChar as number) + 1;
      }
      let sliceTo = null;

      if (str.includes(CONTENTTAIL)) {
        DEV && console.log(`155 content tail detected`);
        sliceTo = str.indexOf(CONTENTTAIL);
        DEV &&
          console.log(
            `159 ${`\u001b[${33}m${`sliceTo`}\u001b[${39}m`} = ${JSON.stringify(
              sliceTo,
              null,
              4,
            )}`,
          );
        // don't include comment on the left
        if (
          str[left(str, sliceTo) as number] === "*" &&
          str[left(str, left(str, sliceTo) as number) as number] === "/"
        ) {
          sliceTo = left(str, left(str, sliceTo));
          DEV &&
            console.log(
              `173 ${`\u001b[${33}m${`sliceTo`}\u001b[${39}m`} = ${JSON.stringify(
                sliceTo,
                null,
                4,
              )}`,
            );
        }

        // is there content afterwards?
        let contentAfterStartsAt =
          str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        DEV &&
          console.log(
            `186 ${`\u001b[${33}m${`contentAfterStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
              contentAfterStartsAt,
              null,
              4,
            )}; slice: "${str.slice(contentAfterStartsAt)}"`,
          );
        if (
          str[right(str, contentAfterStartsAt - 1) as number] === "*" &&
          str[
            right(str, right(str, contentAfterStartsAt - 1) as number) as number
          ] === "/"
        ) {
          contentAfterStartsAt =
            (right(
              str,
              right(str, contentAfterStartsAt - 1) as number,
            ) as number) + 1;
          DEV &&
            console.log(
              `205 ${`\u001b[${33}m${`contentAfterStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
                contentAfterStartsAt,
                null,
                4,
              )}; slice: "${str.slice(contentAfterStartsAt)}"`,
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

      DEV &&
        console.log(
          `226 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`} = ${JSON.stringify(
            extractedConfig,
            null,
            4,
          )}`,
        );
    }

    // remove content tail
    else if (extractedConfig.includes(CONTENTTAIL)) {
      DEV && console.log(`236 CONTENTTAIL present`);

      let contentInFront: string[] = [];
      let stopFilteringAndPassAllLines = false;
      extractedConfig = extractedConfig
        .split("\n")
        .filter((rowStr) => {
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
        sliceTo = (leftSeq(extractedConfig, sliceTo, "/", "*") as any)
          .leftmostChar;
      }
      extractedConfig = extractedConfig.slice(0, sliceTo).trim();

      if (contentInFront.length) {
        rawContentAbove = `${contentInFront.join("\n")}\n`;
      }

      // retrieve the content after content tails
      let contentAfterStartsAt;
      if (right(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length)) {
        DEV && console.log(`273 content after CONTENTTAIL detected`);
        contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (
          str[right(str, contentAfterStartsAt) as number] === "*" &&
          str[
            right(str, right(str, contentAfterStartsAt) as number) as number
          ] === "/"
        ) {
          contentAfterStartsAt =
            (right(str, right(str, contentAfterStartsAt) as number) as number) +
            1;
          if (right(str, contentAfterStartsAt)) {
            rawContentBelow = str.slice(contentAfterStartsAt);
          }
        }
      }
    }

    DEV &&
      console.log(
        `293 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
          rawContentAbove,
          null,
          4,
        )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
          rawContentBelow,
          null,
          4,
        )}`,
      );

    DEV &&
      console.log(
        `306 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`} = ${JSON.stringify(
          extractedConfig,
          null,
          4,
        )}`,
      );
  } else {
    DEV && console.log(`313 config calc - case #5`);

    let contentHeadsRegex = new RegExp(
      `(\\/\\s*\\*\\s*)*${CONTENTHEAD}(\\s*\\*\\s*\\/)*`,
    );
    let contentTailsRegex = new RegExp(
      `(\\/\\s*\\*\\s*)*${CONTENTTAIL}(\\s*\\*\\s*\\/)*`,
    );
    let stopFiltering = false;
    let gatheredLinesAboveTopmostConfigLine: string[] = [];
    let gatheredLinesBelowLastConfigLine: string[] = [];

    // remove all lines above the first line which contains $$$

    let configLines: string[] = str.split("\n").filter((rowStr) => {
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
        gatheredLinesBelowLastConfigLine.unshift(configLines.pop() as string);
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

  DEV &&
    console.log(
      `372 util ███████████████████████████████████████ extractConfig() ends ███████████████████████████████████████`,
    );
  return [extractedConfig, rawContentAbove, rawContentBelow];
}

function trimBlankLinesFromLinesArray(
  lineArr: string[],
  trim = true,
): string[] {
  // killswitch is activated, do nothing
  if (!trim) {
    return lineArr;
  }
  let copyArr = Array.from(lineArr);
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
function extractFromToSource(
  str: string,
  fromDefault = 0,
  toDefault = 500,
): [from: number, to: number, source: string] {
  let from = fromDefault;
  let to = toDefault;
  let source = str;

  let tempArr;
  if (
    str.lastIndexOf("}") > 0 &&
    str.slice(str.lastIndexOf("}") + 1).includes("|")
  ) {
    DEV && console.log(`424 util: closing curlie detected`);
    tempArr = str
      .slice(str.lastIndexOf("}") + 1)
      .split("|")
      .filter((val) => val.trim().length)
      .map((val) => val.trim())
      .filter((val) =>
        String(val)
          .split("")
          .every((char) => /\d/g.test(char)),
      );
  } else if (str.includes("|")) {
    DEV && console.log(`436 util: else case with pipes`);
    tempArr = str
      .split("|")
      .filter((val) => val.trim().length)
      .map((val) => val.trim())
      .filter((val) =>
        String(val)
          .split("")
          .every((char) => /\d/g.test(char)),
      );
  }

  DEV &&
    console.log(
      `450 util: ${`\u001b[${33}m${`tempArr`}\u001b[${39}m`} = ${JSON.stringify(
        tempArr,
        null,
        4,
      )}`,
    );
  if (Array.isArray(tempArr)) {
    if (tempArr.length === 1) {
      to = Number.parseInt(tempArr[0], 10);
    } else if (tempArr.length > 1) {
      from = Number.parseInt(tempArr[0], 10);
      to = Number.parseInt(tempArr[1], 10);
    }
  }

  DEV && console.log(`465 from=${from}; to=${to}`);

  // extract the source string - it's everything from zero to first pipe
  // that follows the last closing curly brace
  if (
    str.lastIndexOf("}") > 0 &&
    str.slice(str.lastIndexOf("}") + 1).includes("|")
  ) {
    source = str.slice(0, str.indexOf("|", str.lastIndexOf("}") + 1)).trimEnd();
    if (source.trim().startsWith("|")) {
      DEV && console.log(`475 util: crop leading pipe`);
      while (source.trim().startsWith("|")) {
        source = source.trim().slice(1);
      }
    }
  } else {
    DEV && console.log(`481 ${`\u001b[${36}m${`loop`}\u001b[${39}m`}`);
    let lastPipeWasAt = null;
    let firstNonPipeNonWhitespaceCharMet = false;
    let startFrom = 0;
    let endTo = str.length;

    // null is fresh state, true is met, false is pattern of only digits was broken
    let onlyDigitsAndWhitespaceBeenMet = null;

    for (let i = 0, len = str.length; i < len; i++) {
      DEV &&
        console.log(
          `493 ${`\u001b[${36}m${`------ ${`str[${i}] = ${`\u001b[${35}m${str[i]}\u001b[${39}m`}`} ------`}\u001b[${39}m`}`,
        );

      // first "cell" between pipes which contains only digits terminates the
      // loop; its opening pipe is "endTo", we slice up to it
      if ("0123456789".includes(str[i])) {
        // if it's digit...

        if (onlyDigitsAndWhitespaceBeenMet === null && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = true;
          DEV && console.log(`503 SET onlyDigitsAndWhitespaceBeenMet = true`);
        }
      }
      // if not digit...
      else if (str[i] !== "|" && str[i].trim().length) {
        onlyDigitsAndWhitespaceBeenMet = false;
        DEV && console.log(`509 SET onlyDigitsAndWhitespaceBeenMet = false`);
      }

      // catch the last character
      if (!str[i + 1] && onlyDigitsAndWhitespaceBeenMet && lastPipeWasAt) {
        endTo = lastPipeWasAt;
        DEV &&
          console.log(
            `517 SET ${`\u001b[${33}m${`endTo`}\u001b[${39}m`} = ${endTo}`,
          );
      }

      // catch pipe
      if (str[i] === "|") {
        DEV &&
          console.log(`524 ${`\u001b[${33}m${`pipe caught`}\u001b[${39}m`}`);
        if (onlyDigitsAndWhitespaceBeenMet && lastPipeWasAt) {
          endTo = lastPipeWasAt;
          DEV &&
            console.log(
              `529 set endTo = ${endTo}; ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`,
            );
          break;
        }

        lastPipeWasAt = i;
        DEV && console.log(`535 SET lastPipeWasAt = ${lastPipeWasAt}`);

        // reset:
        onlyDigitsAndWhitespaceBeenMet = null;
        DEV && console.log(`539 SET onlyDigitsAndWhitespaceBeenMet = null`);
      } else if (!firstNonPipeNonWhitespaceCharMet && str[i].trim().length) {
        firstNonPipeNonWhitespaceCharMet = true;
        if (lastPipeWasAt !== null) {
          startFrom = lastPipeWasAt + 1;
          DEV &&
            console.log(
              `546 SET ${`\u001b[${33}m${`startFrom`}\u001b[${39}m`} = ${startFrom}`,
            );
        }
        DEV &&
          console.log(
            `551 SET ${`\u001b[${33}m${`firstNonPipeNonWhitespaceCharMet`}\u001b[${39}m`} = ${firstNonPipeNonWhitespaceCharMet};`,
          );
      }

      DEV &&
        console.log(
          `557 ${`\u001b[${90}m${` ENDING
startFrom = ${startFrom}
endTo = ${endTo}
onlyDigitsAndWhitespaceBeenMet = ${onlyDigitsAndWhitespaceBeenMet}
lastPipeWasAt = ${lastPipeWasAt}
`}\u001b[${39}m`}`,
        );
    }
    DEV && console.log(`565 startFrom = ${startFrom}; endTo = ${endTo}`);
    source = str.slice(startFrom, endTo).trimEnd();
    DEV &&
      console.log(
        `569 FINAL ${`\u001b[${33}m${`source`}\u001b[${39}m`} = ${source}`,
      );
  }

  return [from, to, source];
}

function prepLine(
  str: string,
  progressFn: null | ((percDone: number) => void),
  subsetFrom: number,
  subsetTo: number,
  generatedCount: Obj,
  pad: boolean,
): string {
  //
  //
  //
  //                PART I. Extract from, to and source values
  //
  //
  //

  let currentPercentageDone;
  let lastPercentage = 0;
  DEV && console.log(`\n\n\n\n\n`);
  DEV &&
    console.log(`596 util: ${`\u001b[${36}m${`===========`}\u001b[${39}m`}`);
  DEV &&
    console.log(
      `599 util: prepLine(): str: "${`\u001b[${35}m${str}\u001b[${39}m`}";\n${`\u001b[${35}m${`generatedCount`}\u001b[${39}m`} = ${JSON.stringify(
        generatedCount,
        null,
        0,
      )}`,
    );

  // we need to extract the "from" and to "values"
  // the separator is vertical pipe, which is a legit CSS selector

  let [from, to, source] = extractFromToSource(str, 0, 500);

  DEV &&
    console.log(
      `613 ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}\n${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}\n${`\u001b[${33}m${`source`}\u001b[${39}m`} = "${source}"\n`,
    );

  //
  //
  //
  //           PART II. extract dollar-dollar-dollar positions and types
  //
  //
  //

  let subsetRange = subsetTo - subsetFrom;
  let res = "";

  // traverse
  for (let i = from; i <= to; i++) {
    let debtPaddingLen = 0;
    DEV && console.log("\n");
    DEV &&
      console.log(
        `633 ███████████████████████████████████████ row i=${i} ███████████████████████████████████████\n`,
      );
    // if (pad) {
    let startPoint = 0;
    for (let y = 0, len = source.length; y < len; y++) {
      let charcode = source[y].charCodeAt(0);
      DEV &&
        console.log(
          `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`source[ ${y} ] = ${
            source[y].trim().length
              ? source[y]
              : JSON.stringify(source[y], null, 0)
          }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m`,
        );

      // catch third dollar of three dollars in a row
      // -----------------------------------------------------------------------
      if (source[y] === "$" && source[y - 1] === "$" && source[y - 2] === "$") {
        DEV &&
          console.log(
            `653 ${`\u001b[${33}m${`startPoint`}\u001b[${39}m`} = ${JSON.stringify(
              startPoint,
              null,
              4,
            )}`,
          );
        DEV && console.log(`659 $$$ caught`);
        // submit all the content up until now
        let restOfStr = source.slice(y + 1);
        DEV &&
          console.log(
            `664 ${`\u001b[${33}m${`restOfStr`}\u001b[${39}m`} = ${JSON.stringify(
              restOfStr,
              null,
              4,
            )}`,
          );
        let unitFound = "";

        DEV && console.log(`672`);
        if (
          i === 0 &&
          units.some((unit) => {
            if (restOfStr.startsWith(unit)) {
              unitFound = unit;
              return true;
            }
          }) &&
          (source[right(source, y + unitFound.length) as number] === "{" ||
            !source[y + unitFound.length + 1].trim().length)
        ) {
          DEV && console.log(`684 push: "${source.slice(startPoint, y - 2)}"`);
          DEV &&
            console.log(
              `687 push also: "${
                pad
                  ? String(i).padStart(
                      String(to).length -
                        String(i).length +
                        unitFound.length +
                        1,
                    )
                  : i
              }"`,
            );
          res += `${source.slice(startPoint, y - 2)}${
            pad
              ? String(i).padStart(
                  String(to).length - String(i).length + unitFound.length + 1,
                )
              : i
          }`;
          DEV &&
            console.log(
              `707 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`,
            );
          startPoint = y + 1 + (unitFound ? unitFound.length : 0);
        } else {
          // extract units if any follow the $$$
          let unitThatFollow = "";
          DEV && console.log(`713`);

          units.some((unit) => {
            if (source.startsWith(unit, y + 1)) {
              unitThatFollow = unit;
              DEV && console.log(`718 return true`);
              return true;
            }
          });
          DEV &&
            console.log(
              `724 extracted ${`\u001b[${33}m${`unitThatFollow`}\u001b[${39}m`} = ${JSON.stringify(
                unitThatFollow,
                null,
                4,
              )}`,
            );

          if (
            !source[y - 3].trim().length ||
            padLeftIfTheresOnTheLeft.some((val) =>
              source
                .slice(startPoint, y - 2)
                .trim()
                .endsWith(val),
            )
          ) {
            // if left-side padding can be possible:
            DEV &&
              console.log(
                `743 source.slice(startPoint, y - 2) = "${source.slice(
                  startPoint,
                  y - 2,
                )}"`,
              );
            DEV &&
              console.log(
                `750 push ${`${source.slice(startPoint, y - 2)}${
                  pad
                    ? String(i).padStart(
                        String(to).length +
                          (i === 0 && unitThatFollow
                            ? unitThatFollow.length
                            : 0),
                      )
                    : i
                }`}`,
              );
            // if the chunk we're adding starts with unit, we need to remove it
            // if it's zero'th row
            let temp = 0;
            if (i === 0) {
              units.some((unit) => {
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
                      (i === 0 && unitThatFollow ? unitThatFollow.length : 0),
                  )
                : i
            }`;
            DEV &&
              console.log(
                `783 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`,
              );
          } else if (
            !source[y + 1].trim().length ||
            source[right(source, y) as number] === "{"
          ) {
            DEV &&
              console.log(
                `791 push ${`${source.slice(startPoint, y - 2)}${
                  pad
                    ? String(i).padEnd(
                        String(to).length +
                          (i === 0 && unitThatFollow
                            ? +(unitThatFollow as any).length
                            : 0),
                      )
                    : i
                }`}`,
              );
            // if right-side padding can be possible:
            res += `${source.slice(startPoint, y - 2)}${
              pad
                ? String(i).padEnd(
                    String(to).length +
                      (i === 0 && unitThatFollow
                        ? +(unitThatFollow as any).length
                        : 0),
                  )
                : i
            }`;
            DEV &&
              console.log(
                `815 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`,
              );
          } else {
            DEV &&
              console.log(
                `820 push ${`${source.slice(startPoint, y - 2)}${i}`}`,
              );
            res += `${source.slice(startPoint, y - 2)}${i}`;
            DEV &&
              console.log(
                `825 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`,
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
              DEV &&
                console.log(
                  `840 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`debtPaddingLen`}\u001b[${39}m`} = ${JSON.stringify(
                    debtPaddingLen,
                    null,
                    4,
                  )}`,
                );
            }
          }
          startPoint = y + 1;
        }
      }

      // catch opening curlie
      // -----------------------------------------------------------------------
      if (source[y] === "{" && pad) {
        DEV && console.log(`855 opening curlie caught`);
        if (debtPaddingLen) {
          res += `${source.slice(startPoint, y)}${` `.repeat(debtPaddingLen)}`;
          startPoint = y;
          debtPaddingLen = 0;
          DEV &&
            console.log(
              `862 SET startPoint = ${startPoint}; debtPaddingLen = ${debtPaddingLen}`,
            );
        }
      }

      // catch the last character of a line
      if (!source[y + 1]) {
        DEV && console.log(`869 last character on a line!`);
        DEV &&
          console.log(
            `872 ${`\u001b[${33}m${`startPoint`}\u001b[${39}m`} = ${JSON.stringify(
              startPoint,
              null,
              4,
            )}`,
          );
        let unitFound = "";
        let restOfStr = source.slice(startPoint);
        DEV &&
          console.log(
            `882 restOfStr = "${restOfStr}" --- we'll check, does it start with any elements from units`,
          );
        if (
          i === 0 &&
          units.some((unit) => {
            if (restOfStr.startsWith(unit)) {
              unitFound = unit;
              return true;
            }
          })
        ) {
          DEV &&
            console.log(
              `895 push "${source.slice(startPoint + unitFound.length)}"`,
            );
          res += `${source.slice(startPoint + unitFound.length)}`;
          DEV &&
            console.log(
              `900 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`,
            );
        } else {
          DEV &&
            console.log(`904 last char - submit "${source.slice(startPoint)}"`);
          res += `${source.slice(startPoint)}`;
          DEV &&
            console.log(
              `908 ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`,
            );
        }
        // add line break
        res += `${i !== to ? "\n" : ""}`;
        DEV &&
          console.log(
            `915 add line break ${`\u001b[${32}m${`res = "${res}"`}\u001b[${39}m`}`,
          );
      }
    }

    (generatedCount.count as number) += 1;

    if (typeof progressFn === "function") {
      currentPercentageDone = Math.floor(
        subsetFrom + (i / (to - from)) * subsetRange,
      );

      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        progressFn(currentPercentageDone);
      }
    }
  }
  return res;
}

function bump(str: string, thingToBump: Obj): string {
  if (/\.\w/g.test(str)) {
    (thingToBump.count as number) += 1;
  }
  return str;
}

function prepConfig(
  str: string,
  progressFn: null | ((percDone: number) => void),
  progressFrom: number,
  progressTo: number,
  trim = true,
  generatedCount: Obj,
  pad: boolean,
): string {
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
              pad,
            )
          : bump(rowStr, generatedCount),
      ),
    trim,
  ).join("\n");
}

export {
  prepLine,
  prepConfig,
  isStr,
  extractFromToSource,
  extractConfig,
  headsAndTails,
};
