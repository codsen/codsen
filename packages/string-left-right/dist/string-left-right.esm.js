/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

function isNum(something) {
  return typeof something === "number";
}
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
    return idx + 1;
  } else if (str[idx + 2] && str[idx + 2].trim().length) {
    return idx + 2;
  }
  for (let i = idx + 1, len = str.length; i < len; i++) {
    if (str[i].trim().length) {
      return i;
    }
  }
  return null;
}
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
    return idx - 1;
  } else if (str[idx - 2] && str[idx - 2].trim().length) {
    return idx - 2;
  }
  for (let i = idx; i--; ) {
    if (str[i] && str[i].trim().length) {
      return i;
    }
  }
  return null;
}
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
    return null;
  }
  let lastFinding = idx;
  const gaps = [];
  let leftmostChar;
  let rightmostChar;
  for (let i = 0, len = args.length; i < len; i++) {
    if (!args[i].length) {
      continue;
    }
    const whattsOnTheSide =
      direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
      gaps.push([lastFinding + 1, whattsOnTheSide]);
    } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
      gaps.unshift([whattsOnTheSide + 1, lastFinding]);
    }
    if (str[whattsOnTheSide] === args[i]) {
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
    } else {
      return null;
    }
  }
  if (leftmostChar === undefined) {
    return null;
  }
  return { gaps, leftmostChar, rightmostChar };
}
function leftSeq(str, idx, ...args) {
  if (!args.length) {
    return left(str, idx);
  }
  return seq("left", str, idx, Array.from(args).reverse());
}
function rightSeq(str, idx, ...args) {
  if (!args.length) {
    return right(str, idx);
  }
  return seq("right", str, idx, args);
}
function chompRight(str, idx, ...args) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (!str[idx + 1]) {
    return null;
  }
  const defaults = {
    mode: 0
  };
  let opts;
  if (typeof args[0] === "object") {
    opts = Object.assign({}, defaults, args.shift());
  } else {
    opts = defaults;
  }
  if (!args.length) {
    return null;
  }
  let lastRes;
  let lastIdx;
  do {
    lastRes = rightSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args);
    if (lastRes) {
      lastIdx = lastRes.rightmostChar + 1;
    }
  } while (lastRes);
  if (!lastIdx) {
    return null;
  }
  if (str[lastIdx] && str[lastIdx].trim().length) {
    return lastIdx;
  }
  const whatsOnTheRight = right(str, lastIdx);
  if (opts.mode === 0) {
    if (!whatsOnTheRight) {
      return str.length;
    }
    if (whatsOnTheRight === lastIdx + 1) {
      return lastIdx;
    } else if (
      str.slice(lastIdx, whatsOnTheRight).includes("\n") ||
      str.slice(lastIdx, whatsOnTheRight).includes("\r")
    ) {
      for (let y = lastIdx, len = str.length; y < len; y++) {
        if (`\n\r`.includes(str[y])) {
          return y;
        }
      }
    } else {
      return whatsOnTheRight - 1;
    }
  } else if (opts.mode === 1) {
    return lastIdx;
  } else if (opts.mode === 2) {
    const remainderString = str.slice(
      lastIdx,
      whatsOnTheRight ? whatsOnTheRight : str.length
    );
    if (remainderString.includes("\n") || remainderString.includes("\r")) {
      for (let y = lastIdx, len = str.length; y < len; y++) {
        if (str[y].trim().length || `\n\r`.includes(str[y])) {
          return y;
        }
      }
    } else if (whatsOnTheRight) {
      return whatsOnTheRight;
    }
    return str.length;
  } else if (opts.mode === 3) {
    return whatsOnTheRight ? whatsOnTheRight : str.length;
  }
  return null;
}

export { left, right, rightSeq, leftSeq, chompRight };
