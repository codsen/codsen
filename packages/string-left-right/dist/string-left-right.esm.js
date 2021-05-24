/**
 * @name string-left-right
 * @fileoverview Looks up the first non-whitespace character to the left/right of a given index
 * @version 4.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-left-right/}
 */

import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';

var version$1 = "4.1.0";

const version = version$1;
const RAWNBSP = "\u00A0";
function x(something) {
  const res = {
    value: something,
    hungry: false,
    optional: false
  };
  if ((res.value.endsWith("?*") || res.value.endsWith("*?")) && res.value.length > 2) {
    res.value = res.value.slice(0, res.value.length - 2);
    res.optional = true;
    res.hungry = true;
  } else if (res.value.endsWith("?") && res.value.length > 1) {
    res.value = res.value.slice(0, ~-res.value.length);
    res.optional = true;
  } else if (res.value.endsWith("*") && res.value.length > 1) {
    res.value = res.value.slice(0, ~-res.value.length);
    res.hungry = true;
  }
  return res;
}
function isNum(something) {
  return typeof something === "number";
}
function isStr(something) {
  return typeof something === "string";
}
function rightMain({
  str,
  idx = 0,
  stopAtNewlines = false,
  stopAtRawNbsp = false
}) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (!str[idx + 1]) {
    return null;
  }
  if (
  str[idx + 1] && (
  str[idx + 1].trim() ||
  stopAtNewlines &&
  "\n\r".includes(str[idx + 1]) ||
  stopAtRawNbsp &&
  str[idx + 1] === RAWNBSP)) {
    return idx + 1;
  }
  if (
  str[idx + 2] && (
  str[idx + 2].trim() ||
  stopAtNewlines &&
  "\n\r".includes(str[idx + 2]) ||
  stopAtRawNbsp &&
  str[idx + 2] === RAWNBSP)) {
    return idx + 2;
  }
  for (let i = idx + 1, len = str.length; i < len; i++) {
    if (
    str[i].trim() ||
    stopAtNewlines &&
    "\n\r".includes(str[i]) ||
    stopAtRawNbsp &&
    str[i] === RAWNBSP) {
      return i;
    }
  }
  return null;
}
function right(str, idx = 0) {
  return rightMain({
    str,
    idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}
function rightStopAtNewLines(str, idx) {
  return rightMain({
    str,
    idx,
    stopAtNewlines: true,
    stopAtRawNbsp: false
  });
}
function rightStopAtRawNbsp(str, idx) {
  return rightMain({
    str,
    idx,
    stopAtNewlines: false,
    stopAtRawNbsp: true
  });
}
function leftMain({
  str,
  idx,
  stopAtNewlines,
  stopAtRawNbsp
}) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (idx < 1) {
    return null;
  }
  if (
  str[~-idx] && (
  str[~-idx].trim() ||
  stopAtNewlines &&
  "\n\r".includes(str[~-idx]) ||
  stopAtRawNbsp &&
  str[~-idx] === RAWNBSP)) {
    return ~-idx;
  }
  if (
  str[idx - 2] && (
  str[idx - 2].trim() ||
  stopAtNewlines &&
  "\n\r".includes(str[idx - 2]) ||
  stopAtRawNbsp &&
  str[idx - 2] === RAWNBSP)) {
    return idx - 2;
  }
  for (let i = idx; i--;) {
    if (str[i] && (
    str[i].trim() ||
    stopAtNewlines &&
    "\n\r".includes(str[i]) ||
    stopAtRawNbsp &&
    str[i] === RAWNBSP)) {
      return i;
    }
  }
  return null;
}
function left(str, idx = 0) {
  return leftMain({
    str,
    idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}
function leftStopAtNewLines(str, idx) {
  return leftMain({
    str,
    idx,
    stopAtNewlines: true,
    stopAtRawNbsp: false
  });
}
function leftStopAtRawNbsp(str, idx) {
  return leftMain({
    str,
    idx,
    stopAtNewlines: false,
    stopAtRawNbsp: true
  });
}
function seq(direction, str, idx, opts, args) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (typeof idx !== "number") {
    idx = 0;
  }
  if (direction === "right" && !str[idx + 1] || direction === "left" && !str[~-idx]) {
    return null;
  }
  let lastFinding = idx;
  const gaps = [];
  let leftmostChar;
  let rightmostChar;
  let satiated;
  let i = 0;
  while (i < args.length) {
    if (!isStr(args[i]) || !args[i].length) {
      i += 1;
      continue;
    }
    const {
      value,
      optional,
      hungry
    } = x(args[i]);
    const whattsOnTheSide = direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    if (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase() || !opts.i && str[whattsOnTheSide] === value) {
      const temp = direction === "right" ? right(str, whattsOnTheSide) : left(str, whattsOnTheSide);
      if (hungry && (opts.i && str[temp].toLowerCase() === value.toLowerCase() || !opts.i && str[temp] === value)) {
        satiated = true;
      } else {
        i += 1;
      }
      if (typeof whattsOnTheSide === "number" && direction === "right" && whattsOnTheSide > lastFinding + 1) {
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && typeof whattsOnTheSide === "number" && whattsOnTheSide < ~-lastFinding) {
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
      i += 1;
      continue;
    } else if (satiated) {
      i += 1;
      satiated = undefined;
      continue;
    } else {
      return null;
    }
  }
  if (leftmostChar === undefined || rightmostChar === undefined) {
    return null;
  }
  return {
    gaps,
    leftmostChar,
    rightmostChar
  };
}
const seqDefaults = {
  i: false
};
function leftSeq(str, idx, ...args) {
  if (!args || !args.length) {
    throw new Error(`string-left-right/leftSeq(): only two input arguments were passed! Did you intend to use left() method instead?`);
  }
  let opts;
  if (isObj(args[0])) {
    opts = { ...seqDefaults,
      ...args.shift()
    };
  } else {
    opts = seqDefaults;
  }
  return seq("left", str, idx, opts, Array.from(args).reverse());
}
function rightSeq(str, idx, ...args) {
  if (!args || !args.length) {
    throw new Error(`string-left-right/rightSeq(): only two input arguments were passed! Did you intend to use right() method instead?`);
  }
  let opts;
  if (isObj(args[0])) {
    opts = { ...seqDefaults,
      ...args.shift()
    };
  } else {
    opts = seqDefaults;
  }
  return seq("right", str, idx, opts, args);
}
function chomp(direction, str, idx, opts, args = []) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (direction === "right" && !str[idx + 1] || direction === "left" && +idx === 0) {
    return null;
  }
  let lastRes = null;
  let lastIdx = null;
  do {
    lastRes = direction === "right" ? rightSeq(str, typeof lastIdx === "number" ? lastIdx : idx, ...args) : leftSeq(str, typeof lastIdx === "number" ? lastIdx : idx, ...args);
    if (lastRes !== null) {
      lastIdx = direction === "right" ? lastRes.rightmostChar : lastRes.leftmostChar;
    }
  } while (lastRes);
  if (lastIdx != null && direction === "right") {
    lastIdx += 1;
  }
  if (lastIdx === null) {
    return null;
  }
  if (direction === "right") {
    if (str[lastIdx] && str[lastIdx].trim()) {
      return lastIdx;
    }
    const whatsOnTheRight = right(str, lastIdx);
    if (!opts || opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        return lastIdx;
      }
      if (str.slice(lastIdx, whatsOnTheRight || str.length).trim() || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")) {
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (`\n\r`.includes(str[y])) {
            return y;
          }
        }
      } else {
        return whatsOnTheRight ? ~-whatsOnTheRight : str.length;
      }
    } else if (opts.mode === 1) {
      return lastIdx;
    } else if (opts.mode === 2) {
      const remainderString = str.slice(lastIdx);
      if (remainderString.trim() || remainderString.includes("\n") || remainderString.includes("\r")) {
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (str[y].trim() || `\n\r`.includes(str[y])) {
            return y;
          }
        }
      }
      return str.length;
    }
    return whatsOnTheRight || str.length;
  }
  if (str[lastIdx] && str[~-lastIdx] && str[~-lastIdx].trim()) {
    return lastIdx;
  }
  const whatsOnTheLeft = left(str, lastIdx);
  if (!opts || opts.mode === 0) {
    if (whatsOnTheLeft === lastIdx - 2) {
      return lastIdx;
    }
    if (str.slice(0, lastIdx).trim() || str.slice(0, lastIdx).includes("\n") || str.slice(0, lastIdx).includes("\r")) {
      for (let y = lastIdx; y--;) {
        if (`\n\r`.includes(str[y]) || str[y].trim()) {
          return y + 1 + (str[y].trim() ? 1 : 0);
        }
      }
    }
    return 0;
  }
  if (opts.mode === 1) {
    return lastIdx;
  }
  if (opts.mode === 2) {
    const remainderString = str.slice(0, lastIdx);
    if (remainderString.trim() || remainderString.includes("\n") || remainderString.includes("\r")) {
      for (let y = lastIdx; y--;) {
        if (str[y].trim() || `\n\r`.includes(str[y])) {
          return y + 1;
        }
      }
    }
    return 0;
  }
  return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0;
}
function chompLeft(str, idx, ...args) {
  if (!args.length || args.length === 1 && isObj(args[0])) {
    return null;
  }
  const defaults = {
    mode: 0
  };
  if (isObj(args[0])) {
    const opts = { ...defaults,
      ...clone(args[0])
    };
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && `0123`.includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error(`string-left-right/chompLeft(): [THROW_ID_01] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ${opts.mode} (type ${typeof opts.mode})`);
    }
    return chomp("left", str, idx, opts, clone(args).slice(1));
  }
  if (!isStr(args[0])) {
    return chomp("left", str, idx, defaults, clone(args).slice(1));
  }
  return chomp("left", str, idx, defaults, clone(args));
}
function chompRight(str, idx, ...args) {
  if (!args.length || args.length === 1 && isObj(args[0])) {
    return null;
  }
  const defaults = {
    mode: 0
  };
  if (isObj(args[0])) {
    const opts = { ...defaults,
      ...clone(args[0])
    };
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && `0123`.includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error(`string-left-right/chompRight(): [THROW_ID_02] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ${opts.mode} (type ${typeof opts.mode})`);
    }
    return chomp("right", str, idx, opts, clone(args).slice(1));
  }
  if (!isStr(args[0])) {
    return chomp("right", str, idx, defaults, clone(args).slice(1));
  }
  return chomp("right", str, idx, defaults, clone(args));
}

export { chompLeft, chompRight, left, leftSeq, leftStopAtNewLines, leftStopAtRawNbsp, right, rightSeq, rightStopAtNewLines, rightStopAtRawNbsp, version };
