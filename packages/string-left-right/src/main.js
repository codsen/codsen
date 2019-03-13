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
  // if there are no arguments, it becomes right()
  if (!args.length) {
    console.log(`064 ${direction}Seq() becomes plain ${direction}()`);
    return direction === "right" ? right(str, idx) : left(str, idx);
  }
  if (
    (direction === "right" && !str[idx + 1]) ||
    (direction === "left" && !str[idx - 1])
  ) {
    // if next character on the particular side doesn't even exist, that's a quick end
    console.log(`072 RETURN null`);
    return null;
  }
  // we start to look on the particular side from index "idx".
  // From there on, each finding sets its index to "lastFinding" so that we
  // know where to start looking on from next. Any failed finding
  // in a sequence is instant return "null".
  let lastFinding = idx;
  console.log(`080 Set lastFinding = ${lastFinding}. Starting the loop.`);

  const holes = [];

  // go through all arguments
  for (let i = 0, len = args.length; i < len; i++) {
    if (!args[i].length) {
      continue;
    }
    console.log(
      `090 ${`\u001b[${36}m${`============= args[${i}]=${
        args[i]
      }`}\u001b[${39}m`}`
    );
    const whattsOnTheSide =
      direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    console.log(
      `097 SET whattsOnTheSide = ${whattsOnTheSide} (${str[whattsOnTheSide]})`
    );
    // if there was a gap, push it to holes array:
    if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
      holes.push([lastFinding + 1, whattsOnTheSide]);
    } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
      holes.unshift([whattsOnTheSide + 1, lastFinding]);
    }
    if (str[whattsOnTheSide] === args[i]) {
      console.log(`106 ${`\u001b[${32}m${args[i]} MATCHED!\u001b[${39}m`}`);
      lastFinding = whattsOnTheSide;
      console.log(`108 SET lastFinding = ${lastFinding}`);
    } else {
      console.log(`110 RETURN null`);
      return null;
    }
  }
  console.log(`114 FINAL holes = ${JSON.stringify(holes, null, 4)}`);

  return holes.length ? holes : true;
}

function leftSeq(str, idx, ...args) {
  return seq("left", str, idx, Array.from(args).reverse());
}

function rightSeq(str, idx, ...args) {
  return seq("right", str, idx, args);
}

export { left, right, rightSeq, leftSeq };
