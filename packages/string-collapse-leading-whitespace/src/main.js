function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
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
    `013 ${`\u001b[${33}m${`limitLinebreaksCount`}\u001b[${39}m`} = ${JSON.stringify(
      limitLinebreaksCount,
      null,
      4
    )}`
  );

  if (typeof str === "string") {
    //
    // STAGE 1. quick end - whole string is whitespace

    if (str.length === 0) {
      return "";
    } else if (str.trim() === "") {
      // find out how many linebreaks are there:
      const linebreakCount = (str.match(/\n/g) || []).length;
      if (linebreakCount) {
        // We can count the total because whole string is whitespace-only.
        // We can't do that if there are non-whitespace characters, because front
        // and end linebreak counts go separately.
        return "\n".repeat(Math.min(linebreakCount, limitLinebreaksCount));
      }
      return " ";
    }

    //
    // STAGE 2. Calculation.

    // Set the default to put in front:
    let startCharacter = "";
    // If there's some leading whitespace. Check first character:
    if (str[0].trim() === "") {
      startCharacter = " ";
      let lineBreakEncountered = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] === "\n") {
          lineBreakEncountered++;
        }
        if (str[i].trim().length !== 0) {
          break;
        }
      }
      if (lineBreakEncountered) {
        startCharacter = "\n".repeat(
          Math.min(lineBreakEncountered, limitLinebreaksCount)
        );
      }
    }

    // set the default to put in front:
    let endCharacter = "";
    // if there's some trailing whitespace
    if (str.slice(-1).trim() === "") {
      endCharacter = " ";
      let lineBreakEncountered = 0;
      for (let i = str.length; i--; ) {
        if (str[i] === "\n") {
          lineBreakEncountered++;
        }
        if (str[i].trim().length !== 0) {
          break;
        }
      }
      if (lineBreakEncountered) {
        endCharacter = "\n".repeat(
          Math.min(lineBreakEncountered, limitLinebreaksCount)
        );
      }
    }
    console.log(
      `083 ${`\u001b[${33}m${`startCharacter`}\u001b[${39}m`} = ${JSON.stringify(
        startCharacter,
        null,
        4
      )}`
    );
    console.log(
      `090 ${`\u001b[${33}m${`endCharacter`}\u001b[${39}m`} = ${JSON.stringify(
        endCharacter,
        null,
        4
      )}`
    );
    return startCharacter + str.trim() + endCharacter;
  }
  return str;
}

export default collapseLeadingWhitespace;
