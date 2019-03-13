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

// let's combine left and right side sequence checks:
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
    console.log(`067 RETURN null`);
    return null;
  }
  // we start to look on the particular side from index "idx".
  // From there on, each finding sets its index to "lastFinding" so that we
  // know where to start looking on from next. Any failed finding
  // in a sequence is instant return "null".
  let lastFinding = idx;
  console.log(`075 Set lastFinding = ${lastFinding}. Starting the loop.`);

  const gaps = [];
  let leftmostChar;
  let rightmostChar;

  // go through all arguments
  for (let i = 0, len = args.length; i < len; i++) {
    if (!args[i].length) {
      continue;
    }
    console.log(
      `087 ${`\u001b[${36}m${`============= args[${i}]=${
        args[i]
      }`}\u001b[${39}m`}`
    );
    const whattsOnTheSide =
      direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    console.log(
      `094 SET whattsOnTheSide = ${whattsOnTheSide} (${str[whattsOnTheSide]})`
    );
    // if there was a gap, push it to gaps array:
    if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
      gaps.push([lastFinding + 1, whattsOnTheSide]);
    } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
      gaps.unshift([whattsOnTheSide + 1, lastFinding]);
    }
    if (str[whattsOnTheSide] === args[i]) {
      console.log(`103 ${`\u001b[${32}m${args[i]} MATCHED!\u001b[${39}m`}`);
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

      console.log(`111 SET lastFinding = ${lastFinding}`);
    } else {
      console.log(`113 RETURN null`);
      return null;
    }
  }
  console.log(`117 FINAL gaps = ${JSON.stringify(gaps, null, 4)}`);

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

export { left, right, rightSeq, leftSeq };
