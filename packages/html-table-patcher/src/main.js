import rangesApply from "ranges-apply";
import Ranges from "ranges-push";
import htmlCommentRegex from "html-comment-regex";

function isLetter(str) {
  return (
    typeof str === "string" &&
    str.length === 1 &&
    str.toUpperCase() !== str.toLowerCase()
  );
}

function deleteAllKindsOfComments(str) {
  if (typeof str === "string") {
    return str.replace(htmlCommentRegex, "");
  }
  return str;
}

function patcher(str) {
  let tableTagStartsAt = null;
  let tableTagEndsAt = null;

  let trOpeningStartsAt = null;
  let trOpeningEndsAt = null;
  let tdOpeningStartsAt = null;
  const tdOpeningEndsAt = null;

  let tdClosingStartsAt = null;
  let tdClosingEndsAt = null;
  let trClosingEndsAt = null;

  let quotes = null;

  // gaps between TR's or TABLE AND TR (either closing or opening, both)
  const type1Gaps = new Ranges();

  // gaps between opening TR and opening TD
  const type2Gaps = new Ranges();

  // gaps between closing TD and another opening TD
  const type3Gaps = new Ranges();

  // gaps between closing TD and closing TR
  const type4Gaps = new Ranges();

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
    if (str[i] === "'" || str[i] === '"') {
      if (!quotes) {
        quotes = {
          type: str[i],
          startedAt: i
        };
        // console.log(
        //   `109 SET ${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${JSON.stringify(
        //     quotes,
        //     null,
        //     4
        //   )}`
        // );
      } else if (str[i] === quotes.type) {
        quotes = null;
        // console.log(
        //   `118 SET ${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${quotes}`
        // );
      }
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
        `134 SET ${`\u001b[${33}m${`tdOpeningStartsAt`}\u001b[${39}m`} = ${tdOpeningStartsAt}`
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
              `145 SET ${`\u001b[${33}m${`tdClosingEndsAt`}\u001b[${39}m`} = ${tdClosingEndsAt}`
            );
            i = y;
            console.log(`148 SET ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`);
            console.log("149 THEN CONTINUE OUTER");
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
        `168 \u001b[${31}m${`ENDING OF AN OPENING TD TAG`}\u001b[${39}m`
      );
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
        `186 SET ${`\u001b[${33}m${`tdOpeningStartsAt`}\u001b[${39}m`} = ${tdOpeningStartsAt}`
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
          console.log(`199 PUSH [${trOpeningEndsAt + 1}, ${i}] to type2Gaps`);
          type2Gaps.push(
            trOpeningEndsAt + 1,
            i,
            str.slice(trOpeningEndsAt + 1, i)
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
          console.log(`215 PUSH [${tdClosingEndsAt + 1}, ${i}] to type3Gaps`);
          type3Gaps.push(
            tdClosingEndsAt + 1,
            i,
            str.slice(tdClosingEndsAt + 1, i)
          );
        }
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
        console.log(`244 PUSH [${trClosingEndsAt + 1}, ${i}] to type1Gaps`);
        type1Gaps.push(
          trClosingEndsAt + 1,
          i,
          str.slice(trClosingEndsAt + 1, i)
        );
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
        console.log(`268 PUSH [${tdClosingEndsAt + 1}, ${i}] to type4Gaps`);
        type4Gaps.push(
          tdClosingEndsAt + 1,
          i,
          str.slice(tdClosingEndsAt + 1, i)
        );
      }

      // 2. set the ending marker
      trClosingEndsAt = i + 4;
      console.log(
        `279 SET ${`\u001b[${33}m${`trClosingEndsAt`}\u001b[${39}m`} = ${trClosingEndsAt}`
      );
      // 2. wipe the opening marker so that "ending of the opening" will not
      // activate afterwards (we've got a closing bracket):
      trOpeningStartsAt = null;
      console.log(
        `285 SET ${`\u001b[${33}m${`trOpeningStartsAt`}\u001b[${39}m`} = null`
      );
      // 3. offset the index head so that we don't traverse already-explored
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
        `305 SET ${`\u001b[${33}m${`trOpeningEndsAt`}\u001b[${39}m`} = ${trOpeningEndsAt}`
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
            `319 PUSH [${tableTagEndsAt +
              1}, ${trOpeningStartsAt}] to type1Gaps`
          );
          type1Gaps.push(
            tableTagEndsAt + 1,
            trOpeningStartsAt,
            str.slice(tableTagEndsAt + 1, trOpeningStartsAt)
          );
        }
        // reset the markers so that further closing brackets aren't flagged up
        // as false positives:
        console.log(`330 SET trOpeningStartsAt = null; tableTagEndsAt = null`);
        trOpeningStartsAt = null;
        tableTagEndsAt = null;
      } else if (trClosingEndsAt !== null) {
        if (
          deleteAllKindsOfComments(
            str.slice(trClosingEndsAt + 1, trOpeningStartsAt)
          ).trim().length !== 0
        ) {
          console.log(
            `340 PUSH [${trClosingEndsAt +
              1}, ${trOpeningStartsAt}] to type1Gaps[]`
          );
          type1Gaps.push(
            trClosingEndsAt + 1,
            trOpeningStartsAt,
            str.slice(trClosingEndsAt + 1, trOpeningStartsAt)
          );
        }
        // wipe the trClosingEndsAt because we captured the range and it won't
        // be needed:
        trClosingEndsAt = null;
        console.log(`352 SET trClosingEndsAt = null`);
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
      // 1. mark the beginning of TR
      trOpeningStartsAt = i;
      console.log(
        `367 SET ${`\u001b[${33}m${`trOpeningStartsAt`}\u001b[${39}m`} = ${trOpeningStartsAt}`
      );
      //
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
        `381 SET ${`\u001b[${33}m${`tableTagEndsAt`}\u001b[${39}m`} = ${tableTagEndsAt}`
      );

      // in order not to trigger this again and again, let's wipe the
      // "tableTagStartsAt" - it's not needed anyway and without it, this catch
      // clause won't activate any more, at least until new table tag opening..
      tableTagStartsAt = null;
      console.log(
        `389 SET ${`\u001b[${33}m${`tableTagStartsAt`}\u001b[${39}m`} = ${tableTagStartsAt}`
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
        `406 SET ${`\u001b[${33}m${`tableTagStartsAt`}\u001b[${39}m`} = ${tableTagStartsAt}`
      );
    }

    console.log("---------");
    console.log(
      `${
        tableTagStartsAt
          ? `${`\u001b[${33}m${`tableTagStartsAt`}\u001b[${39}m`} = ${tableTagStartsAt}; `
          : ""
      }${
        tableTagEndsAt
          ? `${`\u001b[${33}m${`tableTagEndsAt`}\u001b[${39}m`} = ${tableTagEndsAt}; `
          : ""
      }${
        trOpeningStartsAt
          ? `${`\u001b[${33}m${`trOpeningStartsAt`}\u001b[${39}m`} = ${trOpeningStartsAt}; `
          : ""
      }${
        trOpeningEndsAt
          ? `${`\u001b[${33}m${`trOpeningEndsAt`}\u001b[${39}m`} = ${trOpeningEndsAt}; `
          : ""
      }${
        tdOpeningStartsAt
          ? `${`\u001b[${33}m${`tdOpeningStartsAt`}\u001b[${39}m`} = ${tdOpeningStartsAt}; `
          : ""
      }${
        tdOpeningEndsAt
          ? `${`\u001b[${33}m${`tdOpeningEndsAt`}\u001b[${39}m`} = ${tdOpeningEndsAt}; `
          : ""
      }${
        tdClosingStartsAt
          ? `${`\u001b[${33}m${`tdClosingStartsAt`}\u001b[${39}m`} = ${tdClosingStartsAt}; `
          : ""
      }${
        tdClosingEndsAt
          ? `${`\u001b[${33}m${`tdClosingEndsAt`}\u001b[${39}m`} = ${tdClosingEndsAt}; `
          : ""
      }${
        trClosingEndsAt
          ? `${`\u001b[${33}m${`trClosingEndsAt`}\u001b[${39}m`} = ${trClosingEndsAt}; `
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
      `${
        type1Gaps.current()
          ? `${`\u001b[${33}m${`type1Gaps`}\u001b[${39}m`} = ${JSON.stringify(
              type1Gaps.current(),
              null,
              0
            )}`
          : ""
      }${
        type2Gaps.current()
          ? `${`\u001b[${33}m${`type2Gaps`}\u001b[${39}m`} = ${JSON.stringify(
              type2Gaps.current(),
              null,
              0
            )}`
          : ""
      }${
        type3Gaps.current()
          ? `${`\u001b[${33}m${`type3Gaps`}\u001b[${39}m`} = ${JSON.stringify(
              type3Gaps.current(),
              null,
              0
            )}`
          : ""
      }${
        type4Gaps.current()
          ? `${`\u001b[${33}m${`type4Gaps`}\u001b[${39}m`} = ${JSON.stringify(
              type4Gaps.current(),
              null,
              0
            )}`
          : ""
      }`
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
    resRanges.push(
      type1Gaps.current().map(range => {
        if (typeof range[2] === "string" && range[2].length > 0) {
          return [range[0], range[1], `<tr><td>${range[2].trim()}</td></tr>`];
        }
        return range;
      })
    );
  }
  if (type2Gaps.current()) {
    resRanges.push(
      type2Gaps.current().map(range => {
        if (typeof range[2] === "string" && range[2].length > 0) {
          return [range[0], range[1], `<td>${range[2].trim()}</td></tr>\n<tr>`];
        }
        return range;
      })
    );
  }
  if (type3Gaps.current()) {
    resRanges.push(
      type3Gaps.current().map(range => {
        if (typeof range[2] === "string" && range[2].length > 0) {
          return [
            range[0],
            range[1],
            `</tr>\n<tr><td>${range[2].trim()}</td></tr><tr>`
          ];
        }
        return range;
      })
    );
  }
  if (type4Gaps.current()) {
    resRanges.push(
      type4Gaps.current().map(range => {
        if (typeof range[2] === "string" && range[2].length > 0) {
          return [range[0], range[1], `</tr><tr><td>${range[2].trim()}</td>`];
        }
        return range;
      })
    );
  }

  if (resRanges.current()) {
    const finalRes = rangesApply(str, resRanges.current());
    console.log(`568 RETURN ${finalRes}`);
    return finalRes;
  }

  console.log(`572 RETURN ${str}`);
  return str;
}

export default patcher;
