import checkTypes from "check-types-mini";

function trimSpaces(s, originalOpts) {
  // insurance:
  if (typeof s !== "string") {
    throw new Error(
      `string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof s}, equal to:\n${JSON.stringify(
        s,
        null,
        4
      )}`
    );
  }
  // opts preparation:
  const defaults = {
    classicTrim: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: "string-trim-spaces-only: [THROW_ID_02*]"
  });
  // action:
  let newStart;
  let newEnd;
  console.log("025 about to check the length");
  if (s.length > 0) {
    if (
      (opts.classicTrim && s[0].trim().length === 0) ||
      (!opts.classicTrim && s[0] === " ")
    ) {
      console.log(
        `032 \u001b[${36}m${`traverse forwards to trim heads`}\u001b[${39}m`
      );
      for (let i = 0, len = s.length; i < len; i++) {
        console.log(
          `\u001b[${36}m${`036 ------ str[${i}] = ${s[i]}`}\u001b[${39}m`
        );
        if (
          (opts.classicTrim && s[i].trim().length !== 0) ||
          (!opts.classicTrim && s[i] !== " ")
        ) {
          newStart = i;
          console.log(
            `044 SET ${`\u001b[${33}m${`newStart`}\u001b[${39}m`} = ${JSON.stringify(
              newStart,
              null,
              4
            )}, then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
          );
          break;
        }
        // if we traversed the whole string this way and didn't stumble on a non-
        // space/whitespace character (depending on opts.classicTrim), this means
        // whole thing can be trimmed:
        if (i === s.length - 1) {
          // this means there are only spaces/whitespace from beginning to the end
          console.log("057");
          return {
            res: "",
            ranges: [[0, s.length]]
          };
        }
      }
    }

    // if we reached this far, check the last character - find out, is it worth
    // trimming the end of the given string:
    if (
      (opts.classicTrim && s[s.length - 1].trim().length === 0) ||
      (!opts.classicTrim && s[s.length - 1] === " ")
    ) {
      console.log(
        `073 \u001b[${36}m${`traverse backwards to trim tails`}\u001b[${39}m`
      );
      for (let i = s.length; i--; ) {
        console.log(
          `\u001b[${36}m${`077 ------ str[${i}] = ${s[i]}`}\u001b[${39}m`
        );
        if (
          (opts.classicTrim && s[i].trim().length !== 0) ||
          (!opts.classicTrim && s[i] !== " ")
        ) {
          newEnd = i + 1;
          console.log(
            `085 SET ${`\u001b[${33}m${`newEnd`}\u001b[${39}m`} = ${JSON.stringify(
              newEnd,
              null,
              4
            )}, then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
          );
          break;
        }
      }
    }
    console.log(
      `096 CURRENTLY, ${`\u001b[${33}m${`newStart`}\u001b[${39}m`} = ${JSON.stringify(
        newStart,
        null,
        4
      )}`
    );
    console.log(
      `103 CURRENTLY, ${`\u001b[${33}m${`newEnd`}\u001b[${39}m`} = ${JSON.stringify(
        newEnd,
        null,
        4
      )}`
    );
    if (newStart) {
      if (newEnd) {
        console.log("111 - returning trimmed both heads and tails");
        return {
          res: s.slice(newStart, newEnd),
          ranges: [[0, newStart], [newEnd, s.length]]
        };
      }
      console.log("117 - returning trimmed heads");
      return {
        res: s.slice(newStart),
        ranges: [[0, newStart]]
      };
    }
    if (newEnd) {
      console.log("124 - returning trimmed tails");
      return {
        res: s.slice(0, newEnd),
        ranges: [[newEnd, s.length]]
      };
    }
    // if we reached this far, there was nothing to trim:
    return {
      res: s, // return original string. No need to clone because it's string.
      ranges: []
    };
  }
  // if we reached this far, this means it's an empty string. In which case,
  // return empty values:
  return {
    res: "",
    ranges: []
  };
}

export default trimSpaces;
