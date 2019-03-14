function isNum(something) {
  return typeof something === "number";
}

// Looks what's the first non-whitespace character to the right of index "idx"
// on string "str". Returns index of that first non-whitespace character.
function right(str, idx) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (!str[idx + 1]) {
    return null;
  } else if (str[idx + 1] && str[idx + 1].trim().length) {
    // best case scenario - next character is non-whitespace:
    return idx + 1;
  } else if (str[idx + 2] && str[idx + 2].trim().length) {
    // second best case scenario - second next character is non-whitespace:
    return idx + 2;
  }
  // worst case scenario - traverse forwards
  for (let i = idx + 1, len = str.length; i < len; i++) {
    if (str[i].trim().length) {
      return i;
    }
  }
  return null;
}

// Finds the index of the first non-whitespace character on the left
function left(str, idx) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (idx < 1) {
    return null;
  } else if (str[idx - 1] && str[idx - 1].trim().length) {
    // best case scenario - next character is non-whitespace:
    return idx - 1;
  } else if (str[idx - 2] && str[idx - 2].trim().length) {
    // second best case scenario - second next character is non-whitespace:
    return idx - 2;
  }
  // worst case scenario - traverse backwards
  for (let i = idx; i--; ) {
    if (str[i] && str[i].trim().length) {
      return i;
    }
  }
  return null;
}

// Let's combine left and right side sequence checks.
// leftSeq and rightSeq matches the characters in that order, on the particular
// side of given index, disregarding the whitespace.
// It's a tool for matching when algorithm can be sabotaged by user's rogue
// spaces in the input. For example, & n b  s p ; --- it's still &nbsp; right?
// Practically, rogue spaces are single and we will tackle them all.
function seq(direction, str, idx, args) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (
    (direction === "right" && !str[idx + 1]) ||
    (direction === "left" && !str[idx - 1])
  ) {
    // if next character on the particular side doesn't even exist, that's a quick end
    console.log(`076 RETURN null`);
    return null;
  }
  // we start to look on the particular side from index "idx".
  // From there on, each finding sets its index to "lastFinding" so that we
  // know where to start looking on from next. Any failed finding
  // in a sequence is instant return "null".
  let lastFinding = idx;
  console.log(`084 Set lastFinding = ${lastFinding}. Starting the loop.`);

  const gaps = [];
  let leftmostChar;
  let rightmostChar;

  // go through all arguments
  for (let i = 0, len = args.length; i < len; i++) {
    if (!args[i].length) {
      continue;
    }
    console.log(
      `096 ${`\u001b[${36}m${`============= args[${i}]=${
        args[i]
      }`}\u001b[${39}m`}`
    );
    const whattsOnTheSide =
      direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    console.log(
      `103 SET whattsOnTheSide = ${whattsOnTheSide} (${str[whattsOnTheSide]})`
    );
    // if there was a gap, push it to gaps array:
    if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
      gaps.push([lastFinding + 1, whattsOnTheSide]);
    } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
      gaps.unshift([whattsOnTheSide + 1, lastFinding]);
    }
    if (str[whattsOnTheSide] === args[i]) {
      console.log(`112 ${`\u001b[${32}m${args[i]} MATCHED!\u001b[${39}m`}`);
      lastFinding = whattsOnTheSide;

      if (direction === "right") {
        if (leftmostChar === undefined) {
          leftmostChar = whattsOnTheSide;
        }
        rightmostChar = whattsOnTheSide;
      } else {
        if (rightmostChar === undefined) {
          rightmostChar = whattsOnTheSide;
        }
        leftmostChar = whattsOnTheSide;
      }

      console.log(`127 SET lastFinding = ${lastFinding}`);
    } else {
      console.log(`129 RETURN null`);
      return null;
    }
  }
  console.log(`133 FINAL gaps = ${JSON.stringify(gaps, null, 4)}`);

  // if all arguments in sequence were empty strings, we return falsey null:
  if (leftmostChar === undefined) {
    return null;
  }

  return { gaps, leftmostChar, rightmostChar };
}

function leftSeq(str, idx, ...args) {
  // if there are no arguments, it becomes left()
  if (!args.length) {
    return left(str, idx);
  }
  return seq("left", str, idx, Array.from(args).reverse());
}

function rightSeq(str, idx, ...args) {
  // if there are no arguments, it becomes right()
  if (!args.length) {
    return right(str, idx);
  }
  return seq("right", str, idx, args);
}

function chompRight(str, idx, ...args) {
  //
  // INSURANCE.
  //

  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (!str[idx + 1]) {
    return null;
  }

  //
  // OPTS.
  //

  // modes:
  // 0 - leave single space if possible
  // 1 - stop at first space, leave whitespace alone
  // 2 - aggressively chomp all whitespace except newlines
  // 3 - aggressively chomp all whitespace including newlines
  const defaults = {
    mode: 0
  };
  let opts;
  // now, the first element within args can be opts.
  // It's a plain object so it's easy to distinguish
  if (typeof args[0] === "object") {
    opts = Object.assign({}, defaults, args.shift());
  } else {
    opts = defaults;
  }
  if (!args.length) {
    console.log(`195 EARLY RETURN - no args!`);
    return null;
  }

  //
  // ACTION.
  //

  console.log(
    `204 ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
      args,
      null,
      4
    )}`
  );

  let lastRes;
  let lastIdx;
  do {
    console.log();
    console.log(
      `216 ${`\u001b[${90}m${`███████████████████████████████████████`}\u001b[${39}m`}\n`
    );
    lastRes = rightSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args);
    console.log(
      `220 ${`\u001b[${36}m${`lastRes = ${JSON.stringify(
        lastRes,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
    if (lastRes) {
      lastIdx = lastRes.rightmostChar + 1;
      console.log(
        `229 ${`\u001b[${36}m${`another sequence; confirmed! Now set `}\u001b[${39}m`} ${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${JSON.stringify(
          lastIdx,
          null,
          4
        )};`
      );
    }
  } while (lastRes);
  console.log();
  console.log(
    `239 ${`\u001b[${90}m${`███████████████████████████████████████`}\u001b[${39}m`} fin\n`
  );
  console.log(`241 ${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${lastIdx}`);

  if (!lastIdx) {
    // if nothing was matched
    return null;
  }

  // the last thing what's left to do is tackle the whitespace on the right.
  // Depending on opts.mode, there can be different ways.

  // quick ending - no whitespace on the right at all:
  if (str[lastIdx] && str[lastIdx].trim().length) {
    // if the character follows tightly right after,
    return lastIdx;
  }
  // Default, 0 is leave single space if possible or chomp up to nearest line
  // break character or chomp up to EOL
  const whatsOnTheRight = right(str, lastIdx);
  console.log(
    `260 SET ${`\u001b[${33}m${`whatsOnTheRight`}\u001b[${39}m`} = ${whatsOnTheRight}`
  );
  if (opts.mode === 0) {
    if (!whatsOnTheRight) {
      // if there's no non-whitespace character on the right,
      return str.length; // chomp up to the end
    }
    // so there are non-whitespace characters on the right.
    if (whatsOnTheRight === lastIdx + 1) {
      // if there's one whitespace character, Bob's your uncle here's
      // the final result
      console.log(`271 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${lastIdx}`);
      return lastIdx;
    } else if (
      str.slice(lastIdx, whatsOnTheRight).includes("\n") ||
      str.slice(lastIdx, whatsOnTheRight).includes("\r")
    ) {
      // if there are line break characters between current "lastIdx" we're on
      // and the first non-whitespace character on the right
      for (let y = lastIdx, len = str.length; y < len; y++) {
        if (`\n\r`.includes(str[y])) {
          return y;
        }
      }
    } else {
      console.log(
        `286 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${whatsOnTheRight - 1}`
      );
      return whatsOnTheRight - 1;
    }
  } else if (opts.mode === 1) {
    // mode 1 doesn't touch the whitespace, so it's quick:
    console.log(`1 RETURN ${lastIdx}`);
    return lastIdx;
  } else if (opts.mode === 2) {
    // mode 2 hungrily chomps all whitespace except newlines
    const remainderString = str.slice(
      lastIdx,
      whatsOnTheRight ? whatsOnTheRight : str.length
    );
    if (remainderString.includes("\n") || remainderString.includes("\r")) {
      // if there are line breaks, we need to loop to chomp up to them but not further
      for (let y = lastIdx, len = str.length; y < len; y++) {
        if (str[y].trim().length || `\n\r`.includes(str[y])) {
          console.log(`1 RETURN ${y}`);
          return y;
        }
      }
    } else if (whatsOnTheRight) {
      // we know there's a non-whitespace char at index "whatsOnTheRight", so Bob's your uncle that's result
      console.log(`1 RETURN ${whatsOnTheRight}`);
      return whatsOnTheRight;
    }
    // ELSE, last but not least, chomp to the end:
    console.log(`1 RETURN ${str.length}`);
    return str.length;
  } else if (opts.mode === 3) {
    // mode 3 is an aggro chomp - will chump all whitespace
    console.log(`1 RETURN ${whatsOnTheRight ? whatsOnTheRight : str.length}`);
    return whatsOnTheRight ? whatsOnTheRight : str.length;
  }

  // worst case, negative result:
  return null;
}

export { left, right, rightSeq, leftSeq, chompRight };
