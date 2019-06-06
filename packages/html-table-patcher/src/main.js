import rangesApply from "ranges-apply";
import Ranges from "ranges-push";
import htmlCommentRegex from "html-comment-regex";
import { version } from "../package.json";
const isArr = Array.isArray;

function isLetter(str) {
  return (
    typeof str === "string" &&
    str.length === 1 &&
    str.toUpperCase() !== str.toLowerCase()
  );
}
function isStr(something) {
  return typeof something === "string";
}

function deleteAllKindsOfComments(str) {
  if (isStr(str)) {
    return str.replace(htmlCommentRegex, "");
  }
  return str;
}

// opts
const defaults = {
  cssStylesContent: ""
};

function patcher(str, originalOpts) {
  // quick ending
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  const opts = Object.assign({}, defaults, originalOpts);
  if (
    opts.cssStylesContent &&
    (!isStr(opts.cssStylesContent) || !opts.cssStylesContent.trim().length)
  ) {
    opts.cssStylesContent = undefined;
  }

  let tableTagStartsAt = null;
  let tableTagEndsAt = null;

  let trOpeningStartsAt = null;
  let trOpeningEndsAt = null;
  let tdOpeningStartsAt = null;
  const tdOpeningEndsAt = null;

  let tdClosingStartsAt = null;
  let tdClosingEndsAt = null;
  let trClosingEndsAt = null;

  // this variable is true for the first encountered TR and is open until
  // that TR closes. We count TD's and also colspan values.
  let countTds = false;

  // td count itself
  let countVal = null;

  // detects, are there align="center" among counted TDs
  let centeredTdsDetected = false;

  let quotes = null;

  // gaps between TR's or TABLE AND TR (either closing or opening, both)
  const type1Gaps = new Ranges();

  // gaps between opening TR and opening TD
  const type2Gaps = new Ranges();

  // gaps between closing TD and another opening TD
  const type3Gaps = new Ranges();

  // gaps between closing TD and closing TR
  const type4Gaps = new Ranges();

  // we'll record table tag ranges and column count.
  // For example, [0, 25, 2] would mean that table which starts at index 0 and
  // ends at index 25 has two columns. It will be used later when wrapping
  // content with new rows, when setting colspan's.
  const tableColumnCounts = [];
  let tableColumnCount = [];

  //
  //                         .----------------.
  //                        | .--------------. |
  //                        | |     __       | |
  //                        | |    /  |      | |
  //                        | |    `| |      | |
  //                        | |     | |      | |
  //                        | |    _| |_     | |
  //                        | |   |_____|    | |
  //                        | |              | |
  //                        | '--------------' |
  //                         '----------------'
  //
  //        1. scan the input and identify what needs to be wrapped
  //

  outerLoop: for (let i = 0, len = str.length; i < len; i++) {
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${`\u001b[${31}m${
        str[i].trim() === ""
          ? str[i] === null
            ? "null"
            : str[i] === "\n"
            ? "line break"
            : str[i] === "\t"
            ? "tab"
            : "space"
          : str[i]
      }\u001b[${39}m`}`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m`
    );

    // catch HTML comments, so that we don't process the commented-out code
    if (
      str[i] === "<" &&
      str[i + 1] === "!" &&
      str[i + 2] === "-" &&
      str[i + 3] === "-"
    ) {
      // if an opening comment was detected, traverse until the closing
      for (let y = i; y < len; y++) {
        if (
          (str[y] === "-" && str[y + 1] === "-" && str[y + 2] === ">") ||
          str[y + 1] === undefined
        ) {
          // 1. offset the index, so we "jump over" those commented-out characters
          i = y + 2;
          // 2. break, jumping via the label straight into outer loop's next iteration:
          continue outerLoop;
        }
      }
    }

    // catch being within some quotes.
    // this ensures some cheeky characters within quotes (like URL's) don't
    // terminate the tag or otherwise mess things up.
    if (
      (str[i] === "'" || str[i] === '"') &&
      (str[i - 1] === "=" || (str[i - 1] === " " && str[i - 2] === "="))
    ) {
      console.log(`145 within quotes clauses`);
      if (!quotes) {
        quotes = {
          type: str[i],
          startedAt: i
        };
        console.log(
          `152 SET ${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${JSON.stringify(
            quotes,
            null,
            4
          )}`
        );
      }
    }
    // stop within quotes
    if (quotes && str[i] === quotes.type) {
      quotes = null;
      console.log(
        `164 SET ${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${quotes}`
      );
    }

    // catch the closing TD tag:
    if (
      !quotes &&
      str[i] === "<" &&
      str[i + 1] === "/" &&
      str[i + 2] === "t" &&
      str[i + 3] === "d"
    ) {
      // 1. set the marker
      tdClosingStartsAt = i;
      console.log(
        `179 SET ${`\u001b[${33}m${`tdOpeningStartsAt`}\u001b[${39}m`} = ${tdOpeningStartsAt}`
      );
      // 2. set the closing as well:
      if (str[i + 3] === ">") {
        tdClosingEndsAt = i + 3;
      } else {
        // WTF?
        for (let y = i + 3; y < len; y++) {
          if (str[y] === ">") {
            tdClosingEndsAt = y;
            console.log(
              `190 SET ${`\u001b[${33}m${`tdClosingEndsAt`}\u001b[${39}m`} = ${tdClosingEndsAt}`
            );
            i = y;
            console.log(`193 SET ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`);
            console.log("194 THEN CONTINUE OUTER");
            continue outerLoop;
          }
        }
      }
    }

    // catch the ending of an opening TD tag:
    if (
      !quotes &&
      str[i] === ">" &&
      tdOpeningStartsAt !== null &&
      tdOpeningStartsAt < i &&
      tableTagStartsAt === null &&
      tableTagEndsAt < i &&
      trOpeningStartsAt === null &&
      trOpeningEndsAt < i
    ) {
      console.log(
        `213 \u001b[${31}m${`ENDING OF AN OPENING TD TAG`}\u001b[${39}m`
      );
      // 1. catch align="center" if applicable, set "centeredTdsDetected"
      if (
        countTds &&
        (str.slice(tdOpeningStartsAt, i).includes('align="center"') ||
          str.slice(tdOpeningStartsAt, i).match(/text-align:\s*center/gi))
      ) {
        centeredTdsDetected = true;
        console.log(
          `223 SET ${`\u001b[${33}m${`centeredTdsDetected`}\u001b[${39}m`} = ${`\u001b[${32}m${`true`}\u001b[${39}m`}`
        );
      }

      // 2. reset the openingStarts marker because otherwise it will cause
      // false flags later on other closing brackets
      tdOpeningStartsAt = null;
    }

    // catch the opening TD tag:
    if (
      !quotes &&
      str[i] === "<" &&
      str[i + 1] === "t" &&
      str[i + 2] === "d" &&
      !isLetter(str[i + 3])
    ) {
      // 1. set the marker
      tdOpeningStartsAt = i;
      console.log(
        `243 SET ${`\u001b[${33}m${`tdOpeningStartsAt`}\u001b[${39}m`} = ${tdOpeningStartsAt}`
      );
      // 2. maybe there's content between last closing TD or opening TR and this?

      if (
        // if TR was in front and there's some code in-between that and this tag
        trOpeningEndsAt !== null &&
        (tdClosingEndsAt === null || tdClosingEndsAt < trOpeningEndsAt)
      ) {
        if (
          deleteAllKindsOfComments(str.slice(trOpeningEndsAt + 1, i)).trim()
            .length !== 0
        ) {
          console.log(`256 PUSH [${trOpeningEndsAt + 1}, ${i}] to type2Gaps`);
          type2Gaps.push(
            trOpeningEndsAt + 1,
            i,
            deleteAllKindsOfComments(str.slice(trOpeningEndsAt + 1, i)).trim()
          );
        }
      } else if (
        // if TD was in front and there's some code in-between that and this tag
        tdClosingEndsAt !== null &&
        (trClosingEndsAt === null || tdClosingEndsAt > trClosingEndsAt)
      ) {
        if (
          deleteAllKindsOfComments(str.slice(tdClosingEndsAt + 1, i)).trim()
            .length !== 0
        ) {
          // 1.
          console.log(`273 PUSH [${tdClosingEndsAt + 1}, ${i}] to type3Gaps`);
          type3Gaps.push(
            tdClosingEndsAt + 1,
            i,
            deleteAllKindsOfComments(str.slice(tdClosingEndsAt + 1, i)).trim()
          );
          // 2. turn off countTds
          // Imagine, we have <table>
          // <tr>
          // x
          // <td>1</td>
          // y
          // <td>2</td>
          // z
          // </tr>
          // </table>
          //
          // and we need to count how many columns does this table have, in order
          // to set colspans if needed.
          // Now, we count all TD's within first TR. But any non-tag contents
          // ("y") should terminate the counting because they will be wrapped
          // separately, in a new TR.
          // If we didn't reset countTds here, example above would get reported
          // as having 2 columns.
          if (countTds) {
            countTds = false;
            console.log(`299 SET countTds = false`);
          }
        }
      }

      // 3. bump the counter
      if (countTds) {
        if (countVal === null) {
          countVal = 1;
        } else {
          countVal++;
        }
        console.log(
          `312 BUMP ${`\u001b[${33}m${`countVal`}\u001b[${39}m`} now = ${countVal}`
        );
      }
    }

    // catch the closing table tag:
    if (
      !quotes &&
      str[i] === "<" &&
      str[i + 1] === "/" &&
      str[i + 2] === "t" &&
      str[i + 3] === "a" &&
      str[i + 4] === "b" &&
      str[i + 5] === "l" &&
      str[i + 6] === "e" &&
      str[i + 7] === ">"
    ) {
      // we don't even need to record the marker, we will capture the range
      // anyway, it's single-occurence only (unlike TR endings which can be
      // also used to capture content between TR tags)
      if (
        deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, i)).trim()
          .length !== 0
      ) {
        console.log(`336 PUSH [${trClosingEndsAt + 1}, ${i}] to type1Gaps`);
        type1Gaps.push(
          trClosingEndsAt + 1,
          i,
          deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, i)).trim()
        );
      }

      // reset tableColumnCount
      if (tableColumnCount) {
        // 1. if anything was captured in countVal (TD's counted), push it into
        // tableColumnCount, along ending index of the table.
        // We'll end up with array of:
        // [
        //    table's starting index,
        //    table's ending index,
        //    table's column (TD) count
        // ]
        if (countVal !== null) {
          tableColumnCounts.push([
            tableColumnCount[0],
            i + 7,
            countVal,
            centeredTdsDetected
          ]);
          console.log(
            `362 PUSH [${tableColumnCount[0]}, ${i +
              7}, ${countVal}, ${centeredTdsDetected}]`
          );
        }

        // 2. reset
        console.log(
          `369 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} tableColumnCount, countTds & countVal`
        );
        tableColumnCount = [];
        countTds = false;
        countVal = null;
        centeredTdsDetected = false;
      }
    }

    // catch the beginning+ending of the closing </tr>
    if (
      !quotes &&
      str[i] === "<" &&
      str[i + 1] === "/" &&
      str[i + 2] === "t" &&
      str[i + 3] === "r" &&
      str[i + 4] === ">"
    ) {
      // 1. maybe there was some code in front of this tag, after the last </td>?
      if (
        tdClosingEndsAt !== null &&
        deleteAllKindsOfComments(str.slice(tdClosingEndsAt + 1, i)).trim()
          .length !== 0
      ) {
        console.log(`393 PUSH [${tdClosingEndsAt + 1}, ${i}] to type4Gaps`);
        type4Gaps.push(
          tdClosingEndsAt + 1,
          i,
          deleteAllKindsOfComments(str.slice(tdClosingEndsAt + 1, i)).trim()
        );
      }

      // 2. set the ending marker
      trClosingEndsAt = i + 4;
      console.log(
        `404 SET ${`\u001b[${33}m${`trClosingEndsAt`}\u001b[${39}m`} = ${trClosingEndsAt}`
      );
      // 3. wipe the opening marker so that "ending of the opening" will not
      // activate afterwards (we've got a closing bracket):
      trOpeningStartsAt = null;
      console.log(
        `410 SET ${`\u001b[${33}m${`trOpeningStartsAt`}\u001b[${39}m`} = null`
      );

      // 4. tend TD counting
      if (countTds) {
        countTds = false;
        // but keep tableColumnCount[] in current state, its assembly will be
        // finished when ending of the current table is reached. It's because
        // TD column count is per table, not per row.
        console.log(
          `420 SET ${`\u001b[${33}m${`countTds`}\u001b[${39}m`} = false`
        );
      }

      // 5. offset the index head so that we don't traverse already-explored
      // next 4 characters:
      i += 4;
      continue;
    }

    // catch ending of an opening <tr
    if (
      !quotes &&
      str[i] === ">" &&
      trOpeningStartsAt !== null &&
      trOpeningStartsAt < i &&
      tableTagStartsAt === null &&
      tableTagEndsAt < i
    ) {
      // 1. set the marker
      trOpeningEndsAt = i;
      console.log(
        `442 SET ${`\u001b[${33}m${`trOpeningEndsAt`}\u001b[${39}m`} = ${trOpeningEndsAt}`
      );
      // 2. Find out, is it content between TR's or between TABLE and TR (different
      // markers need to be referenced)
      if (tableTagEndsAt !== null) {
        // check, were there non-whitespace characters between the end of the
        // opening table's tag and the beginning of this <tr>. If so, make a note
        // of this range.
        if (
          deleteAllKindsOfComments(
            str.slice(tableTagEndsAt + 1, trOpeningStartsAt)
          ).trim().length !== 0
        ) {
          console.log(
            `456 PUSH [${tableTagEndsAt +
              1}, ${trOpeningStartsAt}] to type1Gaps`
          );
          type1Gaps.push(
            tableTagEndsAt + 1,
            trOpeningStartsAt,
            deleteAllKindsOfComments(
              str.slice(tableTagEndsAt + 1, trOpeningStartsAt)
            ).trim()
          );
        }
        // reset the markers so that further closing brackets aren't flagged up
        // as false positives:
        console.log(`469 SET trOpeningStartsAt = null; tableTagEndsAt = null`);
        trOpeningStartsAt = null;
        tableTagEndsAt = null;
      } else if (trClosingEndsAt !== null) {
        if (
          deleteAllKindsOfComments(
            str.slice(trClosingEndsAt + 1, trOpeningStartsAt)
          ).trim().length !== 0
        ) {
          console.log(
            `479 PUSH [${trClosingEndsAt +
              1}, ${trOpeningStartsAt}, ${deleteAllKindsOfComments(
              str.slice(trClosingEndsAt + 1, trOpeningStartsAt)
            ).trim()}] to type1Gaps[]`
          );
          type1Gaps.push(
            trClosingEndsAt + 1,
            trOpeningStartsAt,
            deleteAllKindsOfComments(
              str.slice(trClosingEndsAt + 1, trOpeningStartsAt)
            ).trim()
          );
        }
        // wipe the trClosingEndsAt because we captured the range and it won't
        // be needed:
        trClosingEndsAt = null;
        console.log(`495 SET trClosingEndsAt = null`);
      }

      // 3. if the countTds is not on, enable it
      if (!countTds && countVal === null) {
        countTds = true;
        console.log(
          `502 SET ${`\u001b[${33}m${`countTds`}\u001b[${39}m`} = true`
        );
      }
    }

    // catch the beginning of the <tr
    if (
      !quotes &&
      str[i] === "<" &&
      str[i + 1] === "t" &&
      str[i + 2] === "r" &&
      !isLetter(str[i + 3])
    ) {
      // 1. maybe there was some code between this TR and TR before?
      console.log(`516 within catch the beginning of the <tr clauses`);
      if (
        trClosingEndsAt !== null &&
        tableTagEndsAt === null &&
        deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, i)).trim()
          .length !== 0
      ) {
        console.log(
          `524 PUSH [${trClosingEndsAt + 1}, ${i}, "${deleteAllKindsOfComments(
            str.slice(trClosingEndsAt + 1, i)
          ).trim()}"] to type1Gaps[]`
        );
        type1Gaps.push(
          trClosingEndsAt + 1,
          i,
          deleteAllKindsOfComments(str.slice(trClosingEndsAt + 1, i)).trim()
        );
        // wipe marker to prevent new false additions:
        trClosingEndsAt = null;
        console.log(
          `536 SET ${`\u001b[${33}m${`trClosingEndsAt`}\u001b[${39}m`} = ${trClosingEndsAt}`
        );
      }
      // 2. mark the beginning of TR
      trOpeningStartsAt = i;
      console.log(
        `542 SET ${`\u001b[${33}m${`trOpeningStartsAt`}\u001b[${39}m`} = ${trOpeningStartsAt}`
      );
    }

    // catch ending of the opening table tag
    if (
      !quotes &&
      str[i] === ">" &&
      tableTagStartsAt !== null &&
      tableTagStartsAt < i
    ) {
      tableTagEndsAt = i;
      console.log(
        `555 SET ${`\u001b[${33}m${`tableTagEndsAt`}\u001b[${39}m`} = ${tableTagEndsAt}`
      );

      // start assembling tableColumnCount
      if (!(isArr(tableColumnCount) && tableColumnCount.length)) {
        tableColumnCount.push(tableTagStartsAt);
        console.log(
          `562 PUSH ${tableTagStartsAt} to tableColumnCount=${JSON.stringify(
            tableColumnCount,
            null,
            0
          )}`
        );
      }

      // in order not to trigger this again and again, let's wipe the
      // "tableTagStartsAt" - it's not needed anyway and without it, this catch
      // clause won't activate any more, at least until new table tag opening..
      tableTagStartsAt = null;
      console.log(
        `575 SET ${`\u001b[${33}m${`tableTagStartsAt`}\u001b[${39}m`} = ${tableTagStartsAt}`
      );
    }

    // catch beginning of the <table
    if (
      !quotes &&
      str[i] === "<" &&
      str[i + 1] === "t" &&
      str[i + 2] === "a" &&
      str[i + 3] === "b" &&
      str[i + 4] === "l" &&
      str[i + 5] === "e" &&
      !isLetter(str[i + 6])
    ) {
      tableTagStartsAt = i;
      console.log(
        `592 SET ${`\u001b[${33}m${`tableTagStartsAt`}\u001b[${39}m`} = ${tableTagStartsAt}`
      );
    }

    console.log("---------");

    console.log(
      `599 ${
        tableTagStartsAt
          ? `${`\u001b[${90}m${`tableTagStartsAt`}\u001b[${39}m`} = ${tableTagStartsAt}; `
          : ""
      }${
        tableTagEndsAt
          ? `${`\u001b[${90}m${`tableTagEndsAt`}\u001b[${39}m`} = ${tableTagEndsAt}; `
          : ""
      }${
        trOpeningStartsAt
          ? `${`\u001b[${90}m${`trOpeningStartsAt`}\u001b[${39}m`} = ${trOpeningStartsAt}; `
          : ""
      }${
        trOpeningEndsAt
          ? `${`\u001b[${90}m${`trOpeningEndsAt`}\u001b[${39}m`} = ${trOpeningEndsAt}; `
          : ""
      }${
        tdOpeningStartsAt
          ? `${`\u001b[${90}m${`tdOpeningStartsAt`}\u001b[${39}m`} = ${tdOpeningStartsAt}; `
          : ""
      }${
        tdOpeningEndsAt
          ? `${`\u001b[${90}m${`tdOpeningEndsAt`}\u001b[${39}m`} = ${tdOpeningEndsAt}; `
          : ""
      }${
        tdClosingStartsAt
          ? `${`\u001b[${90}m${`tdClosingStartsAt`}\u001b[${39}m`} = ${tdClosingStartsAt}; `
          : ""
      }${
        tdClosingEndsAt
          ? `${`\u001b[${90}m${`tdClosingEndsAt`}\u001b[${39}m`} = ${tdClosingEndsAt}; `
          : ""
      }${
        trClosingEndsAt
          ? `${`\u001b[${90}m${`trClosingEndsAt`}\u001b[${39}m`} = ${trClosingEndsAt}; `
          : ""
      }`
    );
    // console.log(
    //   `${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${JSON.stringify(
    //     quotes,
    //     null,
    //     4
    //   )}`
    // );
    console.log(
      `645 ${
        type1Gaps.current()
          ? `${`\u001b[${90}m${`type1Gaps`}\u001b[${39}m`} = ${JSON.stringify(
              type1Gaps.current(),
              null,
              0
            )}`
          : ""
      }${
        type2Gaps.current()
          ? `${`\u001b[${90}m${`type2Gaps`}\u001b[${39}m`} = ${JSON.stringify(
              type2Gaps.current(),
              null,
              0
            )}`
          : ""
      }${
        type3Gaps.current()
          ? `${`\u001b[${90}m${`type3Gaps`}\u001b[${39}m`} = ${JSON.stringify(
              type3Gaps.current(),
              null,
              0
            )}`
          : ""
      }${
        type4Gaps.current()
          ? `${`\u001b[${90}m${`type4Gaps`}\u001b[${39}m`} = ${JSON.stringify(
              type4Gaps.current(),
              null,
              0
            )}`
          : ""
      }`
    );
    console.log(
      `680 ${`\u001b[${90}m${`countVal`}\u001b[${39}m`} = ${countVal}; ${`\u001b[${90}m${`countTds`}\u001b[${39}m`} = ${countTds}; ${`\u001b[${90}m${`centeredTdsDetected`}\u001b[${39}m`} = ${centeredTdsDetected}`
    );
    console.log(
      `683 ${`\u001b[${90}m${`tableColumnCount`}\u001b[${39}m`} = ${JSON.stringify(
        tableColumnCount,
        null,
        0
      )}`
    );
    console.log(
      `690 ${`\u001b[${90}m${`tableColumnCounts`}\u001b[${39}m`} = ${JSON.stringify(
        tableColumnCounts,
        null,
        0
      )}`
    );
    console.log(
      `697 ${`\u001b[${90}m${`quotes`}\u001b[${39}m`} = ${`\u001b[${
        quotes ? 32 : 21
      }m${JSON.stringify(quotes, null, 0)}\u001b[${39}m`}`
    );
  }

  //                             .----------------.
  //                            | .--------------. |
  //                            | |    _____     | |
  //                            | |   / ___ `.   | |
  //                            | |  |_/___) |   | |
  //                            | |   .'____.'   | |
  //                            | |  / /____     | |
  //                            | |  |_______|   | |
  //                            | |              | |
  //                            | '--------------' |
  //                             '----------------'
  //
  //                    2. insert the necessary TR's and TD's
  //

  // early ending:
  if (
    !type1Gaps.current() &&
    !type2Gaps.current() &&
    !type3Gaps.current() &&
    !type4Gaps.current()
  ) {
    return str;
  }

  const resRanges = new Ranges();

  if (type1Gaps.current()) {
    console.log(`731 type #1 gaps found, let's process them`);
    resRanges.push(
      type1Gaps.current().map(range => {
        if (typeof range[2] === "string" && range[2].length > 0) {
          let attributesToAdd = "";
          let tempColspanValIfFound;
          let addAlignCenter = false;
          if (
            isArr(tableColumnCounts) &&
            tableColumnCounts.length &&
            tableColumnCounts.some(refRange => {
              if (range[0] >= refRange[0] && range[0] <= refRange[1]) {
                // if TD count is 2 or more, grab it
                if (refRange[2] !== 1) {
                  tempColspanValIfFound = refRange[2];
                }
                // if any of TD's was centered, center all wrapping too
                if (refRange[3]) {
                  addAlignCenter = refRange[3];
                }
                return true;
              }
              return false;
            })
          ) {
            if (tempColspanValIfFound) {
              attributesToAdd += ` colspan="${tempColspanValIfFound}"`;
            }
            if (addAlignCenter) {
              attributesToAdd += ` align="center"`;
            }
            if (opts.cssStylesContent) {
              attributesToAdd += ` style="${opts.cssStylesContent}"`;
            }
          }
          return [
            range[0],
            range[1],
            `<tr><td${attributesToAdd}>${range[2].trim()}</td></tr>`
          ];
        }
        return range;
      })
    );
    console.log(
      `776 new resRanges = ${JSON.stringify(resRanges.current(), null, 4)}`
    );
  }
  if (type2Gaps.current()) {
    console.log(`780 type #2 gaps found, let's process them`);
    resRanges.push(
      type2Gaps.current().map(range => {
        if (typeof range[2] === "string" && range[2].length > 0) {
          let attributesToAdd = "";
          let tempColspanValIfFound;
          let addAlignCenter = false;
          if (
            isArr(tableColumnCounts) &&
            tableColumnCounts.length &&
            tableColumnCounts.some(refRange => {
              if (range[0] >= refRange[0] && range[0] <= refRange[1]) {
                // if TD count is 2 or more, grab it
                if (refRange[2] !== 1) {
                  tempColspanValIfFound = refRange[2];
                }
                // if any of TD's was centered, center all wrapping too
                if (refRange[3]) {
                  addAlignCenter = refRange[3];
                }
                return true;
              }
              return false;
            })
          ) {
            if (tempColspanValIfFound) {
              attributesToAdd += ` colspan="${tempColspanValIfFound}"`;
            }
            if (addAlignCenter) {
              attributesToAdd += ` align="center"`;
            }
            if (opts.cssStylesContent) {
              attributesToAdd += ` style="${opts.cssStylesContent}"`;
            }
          }
          return [
            range[0],
            range[1],
            `<td${attributesToAdd}>${range[2].trim()}</td></tr>\n<tr>`
          ];
        }
        return range;
      })
    );
    console.log(
      `825 new resRanges = ${JSON.stringify(resRanges.current(), null, 4)}`
    );
  }
  if (type3Gaps.current()) {
    console.log(`829 type #3 gaps found, let's process them`);
    resRanges.push(
      type3Gaps.current().map(range => {
        if (typeof range[2] === "string" && range[2].length > 0) {
          // type #3 doesn't ever need colspans because whole row is added
          return [
            range[0],
            range[1],
            `</tr>\n<tr><td>${range[2].trim()}</td></tr><tr>`
          ];
        }
        return range;
      })
    );
    console.log(
      `844 new resRanges = ${JSON.stringify(resRanges.current(), null, 4)}`
    );
  }
  if (type4Gaps.current()) {
    console.log(`848 type #4 gaps found, let's process them`);
    resRanges.push(
      type4Gaps.current().map(range => {
        if (typeof range[2] === "string" && range[2].length > 0) {
          // type #4 also doesn't ever need colspans
          return [range[0], range[1], `</tr><tr><td>${range[2].trim()}</td>`];
        }
        return range;
      })
    );
    console.log(
      `859 new resRanges = ${JSON.stringify(resRanges.current(), null, 4)}`
    );
  }

  if (resRanges.current()) {
    const finalRes = rangesApply(str, resRanges.current());
    console.log(`865 RETURN ${finalRes}`);
    return finalRes;
  }

  console.log(`869 RETURN ${str}`);
  return str;
}

export { patcher, defaults, version };
