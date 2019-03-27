/**
 * string-left-right
 * Look what's to the left or the right of a given index within a string
 * Version: 2.1.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
 */

import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';

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
function seq(direction, str, idx, opts, args) {
  console.log(`150 seq() called:`);
  console.log(`151 args: ${JSON.stringify([...arguments], null, 4)}`);
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
    console.log(`163 RETURN null`);
    return null;
  }
  let lastFinding = idx;
  console.log(`171 Set lastFinding = ${lastFinding}. Starting the loop.`);
  const gaps = [];
  let leftmostChar;
  let rightmostChar;
  for (let i = 0, len = args.length; i < len; i++) {
    if (!isStr(args[i]) || !args[i].length) {
      console.log(
        `181 continue because ${JSON.stringify(
          args[i],
          null,
          4
        )} is not a non-empty string`
      );
      continue;
    }
    console.log(
      `190 ${`\u001b[${36}m${`============= args[${i}]=${
        args[i]
      }`}\u001b[${39}m`}`
    );
    const { value, optional } = x(args[i]);
    console.log(
      `196 ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${JSON.stringify(
        value,
        null,
        4
      )}`
    );
    console.log(
      `203 ${`\u001b[${33}m${`optional`}\u001b[${39}m`} = ${JSON.stringify(
        optional,
        null,
        4
      )}`
    );
    const whattsOnTheSide =
      direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    if (
      (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase()) ||
      (!opts.i && str[whattsOnTheSide] === value)
    ) {
      console.log(
        `217 SET whattsOnTheSide = ${whattsOnTheSide} (${str[whattsOnTheSide]})`
      );
      if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
        console.log(`224 push gap [${lastFinding + 1}, ${whattsOnTheSide}]`);
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
        console.log(`227 unshift gap [${whattsOnTheSide + 1}, ${lastFinding}]`);
        gaps.unshift([whattsOnTheSide + 1, lastFinding]);
      }
      console.log(`230 ${`\u001b[${32}m${value} MATCHED!\u001b[${39}m`}`);
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
      console.log(`248 SET lastFinding = ${lastFinding}`);
    } else if (optional) {
      console.log(
        `251 ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`} because it was optional`
      );
      continue;
    } else {
      console.log(`255 RETURN null`);
      return null;
    }
  }
  console.log(`259 FINAL gaps = ${JSON.stringify(gaps, null, 4)}`);
  if (leftmostChar === undefined) {
    return null;
  }
  return { gaps, leftmostChar, rightmostChar };
}
function leftSeq(str, idx, ...args) {
  if (!args.length) {
    console.log(`297 leftSeq() calling left()`);
    return left(str, idx);
  }
  const defaults = {
    i: false
  };
  let opts;
  if (isObj(args[0])) {
    opts = Object.assign({}, defaults, args.shift());
  } else {
    opts = defaults;
  }
  console.log(
    `310 leftSeq() ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(`317 leftSeq() calling seq()`);
  return seq("left", str, idx, opts, Array.from(args).reverse());
}
function rightSeq(str, idx, ...args) {
  if (!args.length) {
    console.log(`324 rightSeq() calling right()`);
    return right(str, idx);
  }
  const defaults = {
    i: false
  };
  let opts;
  if (isObj(args[0])) {
    opts = Object.assign({}, defaults, args.shift());
  } else {
    opts = defaults;
  }
  console.log(
    `337 rightSeq() ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(`343 rightSeq() calling seq()`);
  return seq("right", str, idx, opts, args);
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
    console.log(`391 there's no space to go further in this direction`);
    return null;
  }
  console.log(
    `400 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}; ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
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
      `416 ${`\u001b[${90}m${`███████████████████████████████████████ v`}\u001b[${39}m`}\n`
    );
    lastRes =
      direction === "right"
        ? rightSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args)
        : leftSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args);
    console.log();
    console.log(
      `433 ${`\u001b[${90}m${`███████████████████████████████████████ ^`}\u001b[${39}m`}\n`
    );
    console.log(
      `436 ${`\u001b[${36}m${`lastRes = ${JSON.stringify(
        lastRes,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
    if (lastRes) {
      lastIdx =
        direction === "right" ? lastRes.rightmostChar : lastRes.leftmostChar;
      console.log(
        `446 ${`\u001b[${36}m${`another sequence; confirmed! Now set `}\u001b[${39}m`} ${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${JSON.stringify(
          lastIdx,
          null,
          4
        )};`
      );
    }
  } while (lastRes);
  if (lastIdx != null && direction === "right") {
    lastIdx++;
  }
  console.log();
  console.log(
    `459 ${`\u001b[${90}m${`███████████████████████████████████████`}\u001b[${39}m`} fin\n`
  );
  console.log(`461 ${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${lastIdx}`);
  if (!lastIdx) {
    return null;
  }
  if (direction === "right") {
    if (str[lastIdx] && str[lastIdx].trim().length) {
      console.log(`483 RETURN ${lastIdx}`);
      return lastIdx;
    }
    const whatsOnTheRight = right(str, lastIdx);
    console.log(
      `490 SET ${`\u001b[${33}m${`whatsOnTheRight`}\u001b[${39}m`} = ${whatsOnTheRight}`
    );
    if (opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        console.log(
          `497 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${lastIdx}`
        );
        return lastIdx;
      } else if (
        str.slice(lastIdx, whatsOnTheRight || str.length).trim().length ||
        str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") ||
        str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")
      ) {
        console.log(`505 loop`);
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (`\n\r`.includes(str[y])) {
            console.log(`510 RETURN ${y}`);
            return y;
          }
        }
      } else {
        console.log(
          `516 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${
            whatsOnTheRight ? whatsOnTheRight - 1 : str.length
          }`
        );
        return whatsOnTheRight ? whatsOnTheRight - 1 : str.length;
      }
    } else if (opts.mode === 1) {
      console.log(`524 RETURN ${lastIdx}`);
      return lastIdx;
    } else if (opts.mode === 2) {
      const remainderString = str.slice(lastIdx);
      console.log(
        `530 ${`\u001b[${33}m${`remainderString`}\u001b[${39}m`} = ${JSON.stringify(
          remainderString,
          null,
          4
        )}`
      );
      if (
        remainderString.trim().length ||
        remainderString.includes("\n") ||
        remainderString.includes("\r")
      ) {
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (str[y].trim().length || `\n\r`.includes(str[y])) {
            console.log(`544 RETURN ${y}`);
            return y;
          }
        }
      }
      console.log(`550 RETURN ${str.length}`);
      return str.length;
    }
    console.log(`556 RETURN ${whatsOnTheRight ? whatsOnTheRight : str.length}`);
    return whatsOnTheRight ? whatsOnTheRight : str.length;
  }
  if (str[lastIdx] && str[lastIdx - 1].trim().length) {
    console.log(`578 RETURN ${lastIdx}`);
    return lastIdx;
  }
  const whatsOnTheLeft = left(str, lastIdx);
  console.log(
    `586 SET ${`\u001b[${33}m${`whatsOnTheLeft`}\u001b[${39}m`} = ${whatsOnTheLeft}`
  );
  if (opts.mode === 0) {
    if (whatsOnTheLeft === lastIdx - 2) {
      console.log(`592 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${lastIdx}`);
      return lastIdx;
    } else if (
      str.slice(0, lastIdx).trim().length ||
      str.slice(0, lastIdx).includes("\n") ||
      str.slice(0, lastIdx).includes("\r")
    ) {
      console.log(
        `600 ${`\u001b[${36}m${`loop backwards from ${lastIdx}`}\u001b[${39}m`}`
      );
      for (let y = lastIdx; y--; ) {
        console.log(
          `606 ${`\u001b[${36}m${`str[${y}] = ${JSON.stringify(
            str[y],
            null,
            0
          )}`}\u001b[${39}m`}`
        );
        if (`\n\r`.includes(str[y]) || str[y].trim().length) {
          console.log(`613 RETURN ${y + 1 + (str[y].trim().length ? 1 : 0)}`);
          return y + 1 + (str[y].trim().length ? 1 : 0);
        }
      }
    }
    console.log(`619 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 0`);
    return 0;
  } else if (opts.mode === 1) {
    console.log(`623 RETURN ${lastIdx}`);
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
          console.log(`636 RETURN ${y + 1}`);
          return y + 1;
        }
      }
    }
    console.log(`642 RETURN 0`);
    return 0;
  }
  console.log(`648 RETURN ${whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0}`);
  return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0;
}
function chompLeft(str, idx, ...args) {
  console.log(
    `688 chompLeft(): received ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
      args,
      null,
      4
    )}`
  );
  if (!args.length || (args.length === 1 && isObj(args[0]))) {
    console.log(`696 return null because there's nothing to match`);
    return null;
  }
  console.log(`699 chompLeft()`);
  const defaults = {
    mode: 0
  };
  if (isObj(args[0])) {
    const opts = Object.assign({}, defaults, clone(args[0]));
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
    console.log(`728 FINAL opts = ${JSON.stringify(opts, null, 4)}`);
    return chomp("left", str, idx, opts, clone(args).slice(1));
  } else if (!isStr(args[0])) {
    console.log(`731 FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
    return chomp("left", str, idx, defaults, clone(args).slice(1));
  }
  console.log(`736 FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
  return chomp("left", str, idx, defaults, clone(args));
}
function chompRight(str, idx, ...args) {
  console.log(
    `768 chompRight(): received ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
      args,
      null,
      4
    )}`
  );
  if (!args.length || (args.length === 1 && isObj(args[0]))) {
    console.log(`776 return null because there's nothing to match`);
    return null;
  }
  console.log(`779 chompRight()`);
  const defaults = {
    mode: 0
  };
  if (isObj(args[0])) {
    const opts = Object.assign({}, defaults, clone(args[0]));
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
    console.log(`808 FINAL opts = ${JSON.stringify(opts, null, 4)}`);
    return chomp("right", str, idx, opts, clone(args).slice(1));
  } else if (!isStr(args[0])) {
    console.log(`811 FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
    return chomp("right", str, idx, defaults, clone(args).slice(1));
  }
  console.log(`816 FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
  return chomp("right", str, idx, defaults, clone(args));
}

export { chompLeft, chompRight, left, leftSeq, right, rightSeq };
