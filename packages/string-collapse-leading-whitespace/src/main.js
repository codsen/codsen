const rawNbsp = "\u00A0";

// this function filters the characters, does the "collapsing" and trimming
function push(arr, leftSide = true, charToPush) {
  // character has to be line break, space or non-breaking space - nothing
  // else is considered
  console.log(
    `008 ${`\u001b[${36}m${`push(): incoming ${JSON.stringify(
      charToPush,
      null,
      4
    )} (charcode=${charToPush.charCodeAt(0)})`}\u001b[${39}m`}`
  );
  if (
    // 1. it's \n or nbsp or space or some other whitespace char which would end up as space
    !charToPush.trim().length &&
    // 2. don't let sequences of spaces - \n or nbsp sequences are fine
    (!arr.length ||
      charToPush === "\n" ||
      charToPush === rawNbsp ||
      (leftSide ? arr[arr.length - 1] : arr[0]) !== " ") &&
    // 3. line trimming - only other linebreaks or nbsp's can follow linebreaks (per-line trim)
    (!arr.length ||
      (leftSide ? arr[arr.length - 1] : arr[0]) !== "\n" ||
      charToPush === "\n" ||
      charToPush === rawNbsp) // this last clause is line trimming
  ) {
    console.log(`028 inside clauses`);
    // don't let in spaces if array is empty
    // tabs would end up as spaces
    if (leftSide) {
      if (
        (charToPush === "\n" || charToPush === rawNbsp) &&
        arr.length &&
        arr[arr.length - 1] === " "
      ) {
        while (arr.length && arr[arr.length - 1] === " ") {
          arr.pop(); // remove the last element, space
        }
      }

      // 2. put in the end of arr
      console.log(`043 add in the end of arr`);
      arr.push(
        charToPush === rawNbsp || charToPush === "\n" ? charToPush : " "
      );
      console.log(`047 after pushing, arr = ${JSON.stringify(arr, null, 0)}`);
    } else {
      // 1. if last char in arr is space and line break is incoming, remove
      // all spaces from the end of arr either until it's empty or until the
      // last element is not a space
      if (
        (charToPush === "\n" || charToPush === rawNbsp) &&
        arr.length &&
        arr[0] === " "
      ) {
        while (arr.length && arr[0] === " ") {
          arr.shift(); // remove the first element, space
        }
      }

      // 2. put in front of arr
      console.log(`063 add in front`);
      arr.unshift(
        charToPush === rawNbsp || charToPush === "\n" ? charToPush : " "
      );
      console.log(`067 after pushing, arr = ${JSON.stringify(arr, null, 0)}`);
    }
  }
}

function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
  if (typeof str === "string" && str.length) {
    let windowsEol = false;
    if (str.includes("\r\n")) {
      windowsEol = true;
    }

    // without a fuss, set the max allowed line breaks as a leading/trailing whitespace:
    let limitLinebreaksCount;
    if (
      !originalLimitLinebreaksCount || // will avoid zero too
      typeof originalLimitLinebreaksCount !== "number"
    ) {
      limitLinebreaksCount = 1;
    } else {
      limitLinebreaksCount = originalLimitLinebreaksCount;
    }
    console.log(
      `090 ${`\u001b[${33}m${`limitLinebreaksCount`}\u001b[${39}m`} = ${JSON.stringify(
        limitLinebreaksCount,
        null,
        4
      )}`
    );
    let limit;

    //
    // STAGE 1. quick end - whole string is whitespace

    if (str.trim() === "") {
      const resArr = [];
      limit = limitLinebreaksCount;
      Array.from(str).forEach((char) => {
        if (char !== "\n" || limit) {
          if (char === "\n") {
            limit--;
            console.log(`108 limit now set to ${limit}`);
          }
          push(resArr, true, char);
        }
      });
      console.log(`113 resArr = ${JSON.stringify(resArr, null, 4)}`);
      // now trim the whitespace characters from the end which are not
      // non-breaking spaces:
      while (resArr.length > 1 && resArr[resArr.length - 1] === " ") {
        console.log(
          `${`\u001b[${36}m${`----------------------------------------------`}\u001b[${39}m`}`
        );
        console.log(`120 pop ${JSON.stringify(resArr.length - 1, null, 4)}`);
        resArr.pop();
        console.log(`122 resArr now = ${JSON.stringify(resArr, null, 4)}`);
      }
      console.log(
        `${`\u001b[${36}m${`----------------------------------------------`}\u001b[${39}m`}\n\n\n`
      );
      console.log(
        `128 FINAL ${`\u001b[${32}m${`resArr`}\u001b[${39}m`} = ${JSON.stringify(
          resArr,
          null,
          4
        )}`
      );
      return resArr.join("");
    }

    //
    // STAGE 2. Calculation.

    // Set the default to put in front:
    const startCharacter = [];
    limit = limitLinebreaksCount;
    // If there's some leading whitespace. Check first character:
    if (str[0].trim() === "") {
      console.log(`145 the first char is whitespace`);
      for (let i = 0, len = str.length; i < len; i++) {
        console.log(
          `${`\u001b[${36}m${`----------------------------------------------\niterating through: ${JSON.stringify(
            str[i],
            null,
            4
          )}`}\u001b[${39}m`}`
        );
        if (str[i].trim().length !== 0) {
          console.log(`155 break`);
          break;
        } else {
          if (str[i] !== "\n" || limit) {
            // limit the amount of linebreaks to "limitLinebreaksCount"
            if (str[i] === "\n") {
              limit--;
              console.log(`162 limit now set to ${limit}`);
            }
            console.log(`164 OK, pushing ${JSON.stringify(str[i], null, 4)}`);
            push(startCharacter, true, str[i]);
          }
        }
        console.log(
          `${`\u001b[${90}m${`----------\nending limit = ${limit}`}\u001b[${39}m`}`
        );
      }
      console.log(
        `${`\u001b[${36}m${`----------------------------------------------\n`}\u001b[${39}m`}`
      );
    }

    console.log(`${`\u001b[${90}m${`\n\n      *`}\u001b[${39}m`}`);
    console.log(`${`\u001b[${90}m${`now backwards`}\u001b[${39}m`}\n\n`);
    console.log(`${`\u001b[${90}m${`\n\n      *`}\u001b[${39}m`}`);

    // set the default to put in front:
    const endCharacter = [];
    limit = limitLinebreaksCount;
    // if there's some trailing whitespace
    if (str.slice(-1).trim() === "") {
      console.log(`186 the last char is whitespace`);
      for (let i = str.length; i--; ) {
        console.log(
          `${`\u001b[${36}m${`----------------------------------------------\niterating through: ${JSON.stringify(
            str[i],
            null,
            4
          )}`}\u001b[${39}m`}`
        );
        if (str[i].trim().length !== 0) {
          console.log(`196 break`);
          break;
        } else {
          if (str[i] !== "\n" || limit) {
            // limit the amount of linebreaks to "limitLinebreaksCount"
            if (str[i] === "\n") {
              limit--;
              console.log(`203 limit now set to ${limit}`);
            }
            console.log(`205 OK, pushing ${JSON.stringify(str[i], null, 4)}`);
            push(endCharacter, false, str[i]);
          }
        }
      }
      console.log(
        `${`\u001b[${36}m${`----------------------------------------------\n`}\u001b[${39}m`}`
      );
    }

    // -------------------------------------------------------------------------

    console.log(
      `218 ${`\u001b[${33}m${`startCharacter`}\u001b[${39}m`} = ${JSON.stringify(
        startCharacter.join(""),
        null,
        4
      )}`
    );
    console.log(
      `225 ${`\u001b[${33}m${`endCharacter`}\u001b[${39}m`} = ${JSON.stringify(
        endCharacter.join(""),
        null,
        4
      )}`
    );

    if (!windowsEol) {
      console.log(
        `234 RETURN ${JSON.stringify(
          startCharacter.join("") + str.trim() + endCharacter.join(""),
          null,
          4
        )}`
      );
      return startCharacter.join("") + str.trim() + endCharacter.join("");
    }
    return `${startCharacter.join("")}${str.trim()}${endCharacter.join(
      ""
    )}`.replace(/\n/g, "\r\n");
  }
  console.log(`246 just return whatever was given`);
  return str;
}

export default collapseLeadingWhitespace;
