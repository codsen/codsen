/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 2.1.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

function x(something) {
  if (something.endsWith("?")) {
    return { value: something.slice(0, something.length - 1), optional: true };
  }
  return { value: something, optional: false };
}
function isNum(something) {
  return typeof something === "number";
}
function isStr(something) {
  return typeof something === "string";
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
    const { value, optional } = x(args[i]);
    const whattsOnTheSide =
      direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    if (str[whattsOnTheSide] === value) {
      if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
        gaps.unshift([whattsOnTheSide + 1, lastFinding]);
      }
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
    } else if (optional) {
      continue;
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
function chomp(direction, str, idx, opts, args) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (
    (direction === "right" && !str[idx + 1]) ||
    (direction === "left" && ((isNum(idx) && idx < 1) || idx === "0"))
  ) {
    return null;
  }
  let lastRes;
  let lastIdx;
  do {
    lastRes =
      direction === "right"
        ? rightSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args)
        : leftSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args);
    if (lastRes) {
      lastIdx =
        direction === "right"
          ? lastRes.rightmostChar + 1
          : lastRes.leftmostChar;
    }
  } while (lastRes);
  if (!lastIdx) {
    return null;
  }
  if (direction === "right") {
    if (str[lastIdx] && str[lastIdx].trim().length) {
      return lastIdx;
    }
    const whatsOnTheRight = right(str, lastIdx);
    if (opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        return lastIdx;
      } else if (
        str.slice(lastIdx, whatsOnTheRight || str.length).trim().length ||
        str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") ||
        str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")
      ) {
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (`\n\r`.includes(str[y])) {
            return y;
          }
        }
      } else {
        return whatsOnTheRight ? whatsOnTheRight - 1 : str.length;
      }
    } else if (opts.mode === 1) {
      return lastIdx;
    } else if (opts.mode === 2) {
      const remainderString = str.slice(lastIdx);
      if (
        remainderString.trim().length ||
        remainderString.includes("\n") ||
        remainderString.includes("\r")
      ) {
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (str[y].trim().length || `\n\r`.includes(str[y])) {
            return y;
          }
        }
      }
      return str.length;
    }
    return whatsOnTheRight ? whatsOnTheRight : str.length;
  }
  if (str[lastIdx] && str[lastIdx - 1].trim().length) {
    return lastIdx;
  }
  const whatsOnTheLeft = left(str, lastIdx);
  if (opts.mode === 0) {
    if (whatsOnTheLeft === lastIdx - 2) {
      return lastIdx;
    } else if (
      str.slice(0, lastIdx).trim().length ||
      str.slice(0, lastIdx).includes("\n") ||
      str.slice(0, lastIdx).includes("\r")
    ) {
      for (let y = lastIdx; y--; ) {
        if (`\n\r`.includes(str[y]) || str[y].trim().length) {
          return y + 1 + (str[y].trim().length ? 1 : 0);
        }
      }
    }
    return 0;
  } else if (opts.mode === 1) {
    return lastIdx;
  } else if (opts.mode === 2) {
    const remainderString = str.slice(0, lastIdx);
    if (
      remainderString.trim().length ||
      remainderString.includes("\n") ||
      remainderString.includes("\r")
    ) {
      for (let y = lastIdx; y--; ) {
        if (str[y].trim().length || `\n\r`.includes(str[y])) {
          return y + 1;
        }
      }
    }
    return 0;
  }
  return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0;
}
function chompLeft(str, idx, ...args) {
  if (!args.length || (args.length === 1 && typeof args[0] === "object")) {
    return null;
  }
  const defaults = {
    mode: 0
  };
  let opts;
  if (typeof args[0] === "object") {
    opts = Object.assign({}, defaults, args.shift());
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && `0123`.includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error(
        `string-left-right/chompLeft(): [THROW_ID_01] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ${
          opts.mode
        } (type ${typeof opts.mode})`
      );
    }
  } else {
    opts = defaults;
  }
  return chomp("left", str, idx, opts, args);
}
function chompRight(str, idx, ...args) {
  if (!args.length || (args.length === 1 && typeof args[0] === "object")) {
    return null;
  }
  const defaults = {
    mode: 0
  };
  let opts;
  if (typeof args[0] === "object") {
    opts = Object.assign({}, defaults, args.shift());
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && `0123`.includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error(
        `string-left-right/chompRight(): [THROW_ID_02] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ${
          opts.mode
        } (type ${typeof opts.mode})`
      );
    }
  } else {
    opts = defaults;
  }
  return chomp("right", str, idx, opts, args);
}

export { left, right, leftSeq, rightSeq, chompLeft, chompRight };
