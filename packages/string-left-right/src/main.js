/* eslint no-param-reassign:0, no-bitwise:0 */

import isObj from "lodash.isplainobject";
import clone from "lodash.clonedeep";

// separates the value from flags
function x(something) {
  // console.log(
  //   `007 ${`\u001b[${35}m${`x() incoming "${something}"`}\u001b[${39}m`}`
  // );
  const res = {
    value: something,
    hungry: false,
    optional: false,
  };
  if (
    (res.value.endsWith("?*") || res.value.endsWith("*?")) &&
    res.value.length > 2
  ) {
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
  // console.log(
  //   `029 ${`\u001b[${35}m${`x() returning ${JSON.stringify(
  //     res,
  //     null,
  //     0
  //   )}`}\u001b[${39}m`}`
  // );
  return res;
}
function isNum(something) {
  return typeof something === "number";
}
function isStr(something) {
  return typeof something === "string";
}

//
//
//                        iiii                     hhhhhhh                     tttt
//                       i::::i                    h:::::h                  ttt:::t
//                        iiii                     h:::::h                  t:::::t
//                                                 h:::::h                  t:::::t
//   rrrrr   rrrrrrrrr  iiiiiii    ggggggggg   gggggh::::h hhhhh      ttttttt:::::ttttttt
//   r::::rrr:::::::::r i:::::i   g:::::::::ggg::::gh::::hh:::::hhh   t:::::::::::::::::t
//   r:::::::::::::::::r i::::i  g:::::::::::::::::gh::::::::::::::hh t:::::::::::::::::t
//   rr::::::rrrrr::::::ri::::i g::::::ggggg::::::ggh:::::::hhh::::::htttttt:::::::tttttt
//    r:::::r     r:::::ri::::i g:::::g     g:::::g h::::::h   h::::::h     t:::::t
//    r:::::r     rrrrrrri::::i g:::::g     g:::::g h:::::h     h:::::h     t:::::t
//    r:::::r            i::::i g:::::g     g:::::g h:::::h     h:::::h     t:::::t
//    r:::::r            i::::i g::::::g    g:::::g h:::::h     h:::::h     t:::::t    tttttt
//    r:::::r           i::::::ig:::::::ggggg:::::g h:::::h     h:::::h     t::::::tttt:::::t
//    r:::::r           i::::::i g::::::::::::::::g h:::::h     h:::::h     tt::::::::::::::t
//    r:::::r           i::::::i  gg::::::::::::::g h:::::h     h:::::h       tt:::::::::::tt
//    rrrrrrr           iiiiiiii    gggggggg::::::g hhhhhhh     hhhhhhh         ttttttttttt
//                                          g:::::g
//                              gggggg      g:::::g
//                              g:::::gg   gg:::::g
//                               g::::::ggg:::::::g
//                                gg:::::::::::::g
//                                  ggg::::::ggg
//                                     gggggg

// Looks what's the first non-whitespace character to the right of index "idx"
// on string "str". Returns index of that first non-whitespace character.
function rightMain(str, idx, stopAtNewlines) {
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
    str[idx + 1] &&
    ((!stopAtNewlines && str[idx + 1].trim()) ||
      (stopAtNewlines &&
        (str[idx + 1].trim() || "\n\r".includes(str[idx + 1]))))
  ) {
    // best case scenario - next character is non-whitespace:
    return idx + 1;
  }
  if (
    str[idx + 2] &&
    ((!stopAtNewlines && str[idx + 2].trim()) ||
      (stopAtNewlines &&
        (str[idx + 2].trim() || "\n\r".includes(str[idx + 2]))))
  ) {
    // second best case scenario - second next character is non-whitespace:
    return idx + 2;
  }
  // worst case scenario - traverse forwards
  for (let i = idx + 1, len = str.length; i < len; i++) {
    if (
      str[i] &&
      ((!stopAtNewlines && str[i].trim()) ||
        (stopAtNewlines && (str[i].trim() || "\n\r".includes(str[i]))))
    ) {
      return i;
    }
  }
  return null;
}

function right(str, idx) {
  return rightMain(str, idx, false);
}

function rightStopAtNewLines(str, idx) {
  return rightMain(str, idx, true);
}

//
//
//       lllllll                        ffffffffffffffff           tttt                    ((((((       ))))))
//       l:::::l                       f::::::::::::::::f       ttt:::t                  ((::::::(     )::::::))
//       l:::::l                      f::::::::::::::::::f      t:::::t                ((:::::::(       ):::::::))
//       l:::::l                      f::::::fffffff:::::f      t:::::t               (:::::::((         )):::::::)
//       l::::l     eeeeeeeeeeee     f:::::f       ffffffttttttt:::::ttttttt         (::::::(             )::::::)
//       l::::l   ee::::::::::::ee   f:::::f             t:::::::::::::::::t         (:::::(               ):::::)
//       l::::l  e::::::eeeee:::::eef:::::::ffffff       t:::::::::::::::::t         (:::::(               ):::::)
//       l::::l e::::::e     e:::::ef::::::::::::f       tttttt:::::::tttttt         (:::::(               ):::::)
//       l::::l e:::::::eeeee::::::ef::::::::::::f             t:::::t               (:::::(               ):::::)
//       l::::l e:::::::::::::::::e f:::::::ffffff             t:::::t               (:::::(               ):::::)
//       l::::l e::::::eeeeeeeeeee   f:::::f                   t:::::t               (:::::(               ):::::)
//       l::::l e:::::::e            f:::::f                   t:::::t    tttttt     (::::::(             )::::::)
//       l::::::le::::::::e          f:::::::f                  t::::::tttt:::::t     (:::::::((         )):::::::)
//       l::::::l e::::::::eeeeeeee  f:::::::f                  tt::::::::::::::t      ((:::::::(       ):::::::))
//       l::::::l  ee:::::::::::::e  f:::::::f                    tt:::::::::::tt        ((::::::(     )::::::)
//       llllllll    eeeeeeeeeeeeee  fffffffff                      ttttttttttt            ((((((       ))))))
//
//

// Finds the index of the first non-whitespace character on the left
function leftMain(str, idx, stopAtNewlines) {
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
    // ~- means minus one, in bitwise
    str[~-idx] &&
    ((!stopAtNewlines && str[~-idx].trim()) ||
      (stopAtNewlines && (str[~-idx].trim() || "\n\r".includes(str[~-idx]))))
  ) {
    // best case scenario - next character is non-whitespace:
    return ~-idx;
  }
  if (
    str[idx - 2] &&
    ((!stopAtNewlines && str[idx - 2].trim()) ||
      (stopAtNewlines &&
        (str[idx - 2].trim() || "\n\r".includes(str[idx - 2]))))
  ) {
    // second best case scenario - second next character is non-whitespace:
    return idx - 2;
  }
  // worst case scenario - traverse backwards
  for (let i = idx; i--; ) {
    if (
      str[i] &&
      ((!stopAtNewlines && str[i].trim()) ||
        (stopAtNewlines && (str[i].trim() || "\n\r".includes(str[i]))))
    ) {
      return i;
    }
  }
  return null;
}

function left(str, idx) {
  return leftMain(str, idx, false);
}

function leftStopAtNewLines(str, idx) {
  return leftMain(str, idx, true);
}

//
//
//                                                                           ((((((       ))))))
//                                                                         ((::::::(     )::::::))
//                                                                       ((:::::::(       ):::::::))
//                                                                      (:::::::((         )):::::::)
//            ssssssssss       eeeeeeeeeeee       qqqqqqqqq   qqqqq     (::::::(             )::::::)
//          ss::::::::::s    ee::::::::::::ee    q:::::::::qqq::::q     (:::::(               ):::::)
//        ss:::::::::::::s  e::::::eeeee:::::ee q:::::::::::::::::q     (:::::(               ):::::)
//        s::::::ssss:::::se::::::e     e:::::eq::::::qqqqq::::::qq     (:::::(               ):::::)
//         s:::::s  ssssss e:::::::eeeee::::::eq:::::q     q:::::q      (:::::(               ):::::)
//           s::::::s      e:::::::::::::::::e q:::::q     q:::::q      (:::::(               ):::::)
//              s::::::s   e::::::eeeeeeeeeee  q:::::q     q:::::q      (:::::(               ):::::)
//        ssssss   s:::::s e:::::::e           q::::::q    q:::::q      (::::::(             )::::::)
//        s:::::ssss::::::se::::::::e          q:::::::qqqqq:::::q      (:::::::((         )):::::::)
//        s::::::::::::::s  e::::::::eeeeeeee   q::::::::::::::::q       ((:::::::(       ):::::::))
//         s:::::::::::ss    ee:::::::::::::e    qq::::::::::::::q         ((::::::(     )::::::)
//          sssssssssss        eeeeeeeeeeeeee      qqqqqqqq::::::q           ((((((       ))))))
//                                                         q:::::q
//                                                         q:::::q
//                                                        q:::::::q
//                                                        q:::::::q
//                                                        q:::::::q
//                                                        qqqqqqqqq

// Let's combine left and right side sequence checks.
// leftSeq and rightSeq matches the characters in that order, on the particular
// side of given index, disregarding the whitespace.
// It's a tool for matching when algorithm can be sabotaged by user's rogue
// spaces in the input. For example, & n b  s p ; --- it's still &nbsp; right?
// Practically, rogue spaces are single and we will tackle them all.
function seq(direction, str, idx, opts, args) {
  console.log(`226 seq() called:`);
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (
    (direction === "right" && !str[idx + 1]) ||
    (direction === "left" && !str[~-idx])
  ) {
    // if next character on the particular side doesn't even exist, that's a quick end
    console.log(`238 RETURN null`);
    return null;
  }
  // we start to look on the particular side from index "idx".
  // From there on, each finding sets its index to "lastFinding" so that we
  // know where to start looking on from next. Any failed finding
  // in a sequence is instant return "null".
  let lastFinding = idx;
  console.log(`246 Set lastFinding = ${lastFinding}. Starting the loop.`);

  const gaps = [];
  let leftmostChar;
  let rightmostChar;

  let satiated; // used to prevent mismatching action kicking in when that
  // mismatching is after multiple hungry findings.

  // go through all arguments
  let i = 0;
  // we use while loop because for loop would not do in hungry matching cases,
  // where we need to repeat same step (hungrily matched character) few times.
  while (i < args.length) {
    console.log(
      `261 ${`\u001b[${34}m${`███████████████████████████████████████ seq() looping ${args[i]}`}\u001b[${39}m`}`
    );
    if (!isStr(args[i]) || !args[i].length) {
      console.log(
        `265 continue because ${JSON.stringify(
          args[i],
          null,
          4
        )} is not a non-empty string`
      );
      i += 1;
      continue;
    }
    console.log(
      `275 ${`\u001b[${36}m${`============= args[${i}]=${args[i]}`}\u001b[${39}m`}`
    );
    const { value, optional, hungry } = x(args[i]);
    console.log(
      `279 ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${JSON.stringify(
        value,
        null,
        4
      )}; ${`\u001b[${33}m${`optional`}\u001b[${39}m`} = ${JSON.stringify(
        optional,
        null,
        4
      )}; ${`\u001b[${33}m${`hungry`}\u001b[${39}m`} = ${JSON.stringify(
        hungry,
        null,
        4
      )};`
    );

    const whattsOnTheSide =
      direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    if (
      (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase()) ||
      (!opts.i && str[whattsOnTheSide] === value)
    ) {
      console.log(
        `301 SET whattsOnTheSide = ${whattsOnTheSide} (${str[whattsOnTheSide]})`
      );

      // OK, one was matched, we're in the right clauses (otherwise we'd skip
      // if it was optional or break the matching)
      // Now, it depends, is it a hungry match, because if so, we need to look
      // for more of these.
      const temp =
        direction === "right"
          ? right(str, whattsOnTheSide)
          : left(str, whattsOnTheSide);
      if (
        hungry &&
        ((opts.i && str[temp].toLowerCase() === value.toLowerCase()) ||
          (!opts.i && str[temp] === value))
      ) {
        // satiated means next iteration is allowed not to match anything
        satiated = true;
      } else {
        // move on
        i += 1;
      }

      // 1. first, tackle gaps

      // if there was a gap, push it to gaps array:
      if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
        console.log(`328 push gap [${lastFinding + 1}, ${whattsOnTheSide}]`);
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && whattsOnTheSide < ~-lastFinding) {
        console.log(`331 unshift gap [${whattsOnTheSide + 1}, ${lastFinding}]`);
        gaps.unshift([whattsOnTheSide + 1, lastFinding]);
      }
      console.log(`334 ${`\u001b[${32}m${value} MATCHED!\u001b[${39}m`}`);

      // 2. second, tackle the matching

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

      console.log(`352 SET lastFinding = ${lastFinding}`);
    } else if (optional) {
      console.log(
        `355 ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`} because it was optional`
      );
      i += 1;
      continue;
    } else if (satiated) {
      console.log(
        `361 ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`} because "satiated" is on`
      );
      i += 1;
      satiated = undefined;
      continue;
    } else {
      console.log(`367 RETURN null`);
      return null;
    }
  }
  console.log(
    `372 ${`\u001b[${34}m${`███████████████████████████████████████ seq() stops looping`}\u001b[${39}m`}`
  );
  console.log(`374 FINAL gaps = ${JSON.stringify(gaps, null, 4)}`);

  // if all arguments in sequence were empty strings, we return falsey null:
  if (leftmostChar === undefined) {
    console.log(`378 RETURN ${`\u001b[${33}m${`null`}\u001b[${39}m`}`);
    return null;
  }

  console.log(
    `383 RETURN ${`\u001b[${33}m${JSON.stringify(
      {
        gaps,
        leftmostChar,
        rightmostChar,
      },
      null,
      4
    )}\u001b[${39}m`}`
  );
  return { gaps, leftmostChar, rightmostChar };
}

//
//
//    lllllll
//    l:::::l
//    l:::::l
//    l:::::l
//     l::::l                  rrrrr   rrrrrrrrr            ssssssssss       eeeeeeeeeeee       qqqqqqqqq   qqqqq
//     l::::l                  r::::rrr:::::::::r         ss::::::::::s    ee::::::::::::ee    q:::::::::qqq::::q
//     l::::l                  r:::::::::::::::::r      ss:::::::::::::s  e::::::eeeee:::::ee q:::::::::::::::::q
//     l::::l  --------------- rr::::::rrrrr::::::r     s::::::ssss:::::se::::::e     e:::::eq::::::qqqqq::::::qq
//     l::::l  -:::::::::::::-  r:::::r     r:::::r      s:::::s  ssssss e:::::::eeeee::::::eq:::::q     q:::::q
//     l::::l  ---------------  r:::::r     rrrrrrr        s::::::s      e:::::::::::::::::e q:::::q     q:::::q
//     l::::l                   r:::::r                       s::::::s   e::::::eeeeeeeeeee  q:::::q     q:::::q
//     l::::l                   r:::::r                 ssssss   s:::::s e:::::::e           q::::::q    q:::::q
//    l::::::l                  r:::::r                 s:::::ssss::::::se::::::::e          q:::::::qqqqq:::::q
//    l::::::l                  r:::::r                 s::::::::::::::s  e::::::::eeeeeeee   q::::::::::::::::q
//    l::::::l                  r:::::r                  s:::::::::::ss    ee:::::::::::::e    qq::::::::::::::q
//    llllllll                  rrrrrrr                   sssssssssss        eeeeeeeeeeeeee      qqqqqqqq::::::q
//                                                                                                       q:::::q
//                                                                                                       q:::::q
//                                                                                                      q:::::::q
//                                                                                                      q:::::::q
//                                                                                                      q:::::::q
//                                                                                                      qqqqqqqqq

function leftSeq(str, idx, ...args) {
  // if there are no arguments, it becomes left()
  if (!args.length) {
    console.log(`424 leftSeq() calling left()`);
    return left(str, idx);
  }
  const defaults = {
    i: false,
  };
  let opts;
  if (isObj(args[0])) {
    opts = { ...defaults, ...args.shift() };
  } else {
    opts = defaults;
  }
  console.log(
    `437 leftSeq() ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  console.log(`444 leftSeq() calling seq()`);
  return seq("left", str, idx, opts, Array.from(args).reverse());
}

function rightSeq(str, idx, ...args) {
  // if there are no arguments, it becomes right()
  if (!args.length) {
    console.log(`451 rightSeq() calling right()`);
    return right(str, idx);
  }
  const defaults = {
    i: false,
  };
  let opts;
  if (isObj(args[0])) {
    opts = { ...defaults, ...args.shift() };
  } else {
    opts = defaults;
  }
  console.log(
    `464 rightSeq() ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(`470 rightSeq() calling seq()`);
  return seq("right", str, idx, opts, args);
}

//
//
//                       hhhhhhh
//                       h:::::h
//                       h:::::h
//                       h:::::h
//        cccccccccccccccch::::h hhhhh          ooooooooooo      mmmmmmm    mmmmmmm   ppppp   ppppppppp
//      cc:::::::::::::::ch::::hh:::::hhh     oo:::::::::::oo  mm:::::::m  m:::::::mm p::::ppp:::::::::p
//     c:::::::::::::::::ch::::::::::::::hh  o:::::::::::::::om::::::::::mm::::::::::mp:::::::::::::::::p
//    c:::::::cccccc:::::ch:::::::hhh::::::h o:::::ooooo:::::om::::::::::::::::::::::mpp::::::ppppp::::::p
//    c::::::c     ccccccch::::::h   h::::::ho::::o     o::::om:::::mmm::::::mmm:::::m p:::::p     p:::::p
//    c:::::c             h:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::m p:::::p     p:::::p
//    c:::::c             h:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::m p:::::p     p:::::p
//    c::::::c     ccccccch:::::h     h:::::ho::::o     o::::om::::m   m::::m   m::::m p:::::p    p::::::p
//    c:::::::cccccc:::::ch:::::h     h:::::ho:::::ooooo:::::om::::m   m::::m   m::::m p:::::ppppp:::::::p
//     c:::::::::::::::::ch:::::h     h:::::ho:::::::::::::::om::::m   m::::m   m::::m p::::::::::::::::p
//      cc:::::::::::::::ch:::::h     h:::::h oo:::::::::::oo m::::m   m::::m   m::::m p::::::::::::::pp
//        cccccccccccccccchhhhhhh     hhhhhhh   ooooooooooo   mmmmmm   mmmmmm   mmmmmm p::::::pppppppp
//                                                                                     p:::::p
//                                                                                     p:::::p
//                                                                                    p:::::::p
//                                                                                    p:::::::p
//                                                                                    p:::::::p
//                                                                                    ppppppppp
//

// chomp() lets you match sequences of characters with zero or more whitespace characters in between each,
// on left or right of a given string index, with optional granular control over surrounding
// whitespace-munching. Yes, that's a technical term.
function chomp(direction, str, idx, opts, args) {
  //
  // INSURANCE.
  //

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
    console.log(`518 there's no space to go further in this direction`);
    return null;
  }

  //
  // ACTION.
  //

  console.log(
    `527 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}; ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
      args,
      null,
      4
    )}`
  );

  let lastRes = null;
  let lastIdx = null;
  do {
    console.log();
    console.log(
      `543 ${`\u001b[${90}m${`███████████████████████████████████████ v`}\u001b[${39}m`}\n`
    );
    // console.log(
    //   `541 ${`\u001b[${36}m${`██`}\u001b[${39}m`} initial lastRes = ${JSON.stringify(
    //     direction === "right"
    //       ? rightSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args)
    //       : leftSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args),
    //     null,
    //     4
    //   )}`
    // );
    lastRes =
      direction === "right"
        ? rightSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args)
        : leftSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args);
    console.log();
    console.log(
      `560 ${`\u001b[${90}m${`███████████████████████████████████████ ^`}\u001b[${39}m`}\n`
    );
    console.log(
      `563 ${`\u001b[${36}m${`lastRes = ${JSON.stringify(
        lastRes,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
    if (lastRes !== null) {
      lastIdx =
        direction === "right" ? lastRes.rightmostChar : lastRes.leftmostChar;
      console.log(
        `573 ${`\u001b[${36}m${`another sequence; confirmed! Now set `}\u001b[${39}m`} ${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${JSON.stringify(
          lastIdx,
          null,
          4
        )};`
      );
    }
  } while (lastRes);
  if (lastIdx != null && direction === "right") {
    lastIdx += 1;
  }
  console.log();
  console.log(
    `586 ${`\u001b[${90}m${`███████████████████████████████████████`}\u001b[${39}m`} fin\n`
  );
  console.log(`588 ${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${lastIdx}`);

  if (lastIdx === null) {
    // if nothing was matched
    return null;
  }

  // the last thing what's left to do is tackle the whitespace on the right.
  // Depending on opts.mode, there can be different ways.

  if (direction === "right") {
    //
    //
    //
    //                           R I G H T
    //
    //
    //

    // quick ending - no whitespace on the right at all:
    if (str[lastIdx] && str[lastIdx].trim()) {
      // if the character follows tightly right after,
      console.log(`610 RETURN ${lastIdx}`);
      return lastIdx;
    }
    // Default, 0 is leave single space if possible or chomp up to nearest line
    // break character or chomp up to EOL
    const whatsOnTheRight = right(str, lastIdx);
    console.log(
      `617 SET ${`\u001b[${33}m${`whatsOnTheRight`}\u001b[${39}m`} = ${whatsOnTheRight}`
    );
    if (opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        // if there's one whitespace character, Bob's your uncle here's
        // the final result
        console.log(
          `624 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${lastIdx}`
        );
        return lastIdx;
      }
      if (
        str.slice(lastIdx, whatsOnTheRight || str.length).trim() ||
        str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") ||
        str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")
      ) {
        console.log(`633 loop`);
        // if there are line break characters between current "lastIdx" we're on
        // and the first non-whitespace character on the right
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (`\n\r`.includes(str[y])) {
            console.log(`638 RETURN ${y}`);
            return y;
          }
        }
      } else {
        console.log(
          `644 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${
            whatsOnTheRight ? ~-whatsOnTheRight : str.length
          }`
        );
        return whatsOnTheRight ? ~-whatsOnTheRight : str.length;
      }
    } else if (opts.mode === 1) {
      // mode 1 doesn't touch the whitespace, so it's quick:
      console.log(`652 RETURN ${lastIdx}`);
      return lastIdx;
    } else if (opts.mode === 2) {
      // mode 2 hungrily chomps all whitespace except newlines
      const remainderString = str.slice(lastIdx);
      console.log(
        `658 ${`\u001b[${33}m${`remainderString`}\u001b[${39}m`} = ${JSON.stringify(
          remainderString,
          null,
          4
        )}`
      );
      if (
        remainderString.trim() ||
        remainderString.includes("\n") ||
        remainderString.includes("\r")
      ) {
        // if there are line breaks, we need to loop to chomp up to them but not further
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (str[y].trim() || `\n\r`.includes(str[y])) {
            console.log(`672 RETURN ${y}`);
            return y;
          }
        }
      }
      // ELSE, last but not least, chomp to the end:
      console.log(`678 RETURN ${str.length}`);
      return str.length;
    }
    // ELSE - mode 3

    // mode 3 is an aggro chomp - will chump all whitespace
    console.log(`684 RETURN ${whatsOnTheRight || str.length}`);
    return whatsOnTheRight || str.length;

    //
    //
    //
    //                           R I G H T    E N D S
    //
    //
    //
  }
  //
  //
  //
  //                                L E F T
  //
  //
  //

  // quick ending - no whitespace on the left at all:
  if (str[lastIdx] && str[~-lastIdx] && str[~-lastIdx].trim()) {
    // if the non-whitespace character is on the left
    console.log(`706 RETURN ${lastIdx}`);
    return lastIdx;
  }

  // Default, 0 is leave single space if possible or chomp up to nearest line
  // break character or chomp up to index zero, start of the string
  const whatsOnTheLeft = left(str, lastIdx);
  console.log(
    `714 SET ${`\u001b[${33}m${`whatsOnTheLeft`}\u001b[${39}m`} = ${whatsOnTheLeft}`
  );
  if (opts.mode === 0) {
    if (whatsOnTheLeft === lastIdx - 2) {
      // if there's one whitespace character between here and next real character, Bob's your uncle here's
      // the final result
      console.log(`720 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${lastIdx}`);
      return lastIdx;
    }
    if (
      str.slice(0, lastIdx).trim() ||
      str.slice(0, lastIdx).includes("\n") ||
      str.slice(0, lastIdx).includes("\r")
    ) {
      console.log(
        `729 ${`\u001b[${36}m${`loop backwards from ${lastIdx}`}\u001b[${39}m`}`
      );
      // if there are line break characters between current "lastIdx" we're on
      // and the first non-whitespace character on the right
      for (let y = lastIdx; y--; ) {
        console.log(
          `735 ${`\u001b[${36}m${`str[${y}] = ${JSON.stringify(
            str[y],
            null,
            0
          )}`}\u001b[${39}m`}`
        );
        if (`\n\r`.includes(str[y]) || str[y].trim()) {
          console.log(`742 RETURN ${y + 1 + (str[y].trim() ? 1 : 0)}`);
          return y + 1 + (str[y].trim() ? 1 : 0);
        }
      }
    }
    // ELSE
    console.log(`748 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 0`);
    return 0;
  }
  if (opts.mode === 1) {
    // mode 1 doesn't touch the whitespace, so it's quick:
    console.log(`753 RETURN ${lastIdx}`);
    return lastIdx;
  }
  if (opts.mode === 2) {
    // mode 2 hungrily chomps all whitespace except newlines
    const remainderString = str.slice(0, lastIdx);
    if (
      remainderString.trim() ||
      remainderString.includes("\n") ||
      remainderString.includes("\r")
    ) {
      // if there are line breaks, we need to loop to chomp up to them but not further
      for (let y = lastIdx; y--; ) {
        if (str[y].trim() || `\n\r`.includes(str[y])) {
          console.log(`767 RETURN ${y + 1}`);
          return y + 1;
        }
      }
    }
    // ELSE, last but not least, chomp to the end:
    console.log(`773 RETURN 0`);
    return 0;
  }
  // ELSE - mode 3

  // mode 3 is an aggro chomp - will chump all whitespace
  console.log(`779 RETURN ${whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0}`);
  return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0;

  //
  //
  //
  //                            L E F T    E N D S
  //
  //
  //
}

//
//
//                       hhhhhhh                                                         LLLLLLLLLLL
//                       h:::::h                                                         L:::::::::L
//                       h:::::h                                                         L:::::::::L
//                       h:::::h                                                         LL:::::::LL
//        cccccccccccccccch::::h hhhhh          mmmmmmm    mmmmmmm   ppppp   ppppppppp     L:::::L
//      cc:::::::::::::::ch::::hh:::::hhh     mm:::::::m  m:::::::mm p::::ppp:::::::::p    L:::::L
//     c:::::::::::::::::ch::::::::::::::hh  m::::::::::mm::::::::::mp:::::::::::::::::p   L:::::L
//    c:::::::cccccc:::::ch:::::::hhh::::::h m::::::::::::::::::::::mpp::::::ppppp::::::p  L:::::L
//    c::::::c     ccccccch::::::h   h::::::hm:::::mmm::::::mmm:::::m p:::::p     p:::::p  L:::::L
//    c:::::c             h:::::h     h:::::hm::::m   m::::m   m::::m p:::::p     p:::::p  L:::::L
//    c:::::c             h:::::h     h:::::hm::::m   m::::m   m::::m p:::::p     p:::::p  L:::::L
//    c::::::c     ccccccch:::::h     h:::::hm::::m   m::::m   m::::m p:::::p    p::::::p  L:::::L         LLLLLL
//    c:::::::cccccc:::::ch:::::h     h:::::hm::::m   m::::m   m::::m p:::::ppppp:::::::pLL:::::::LLLLLLLLL:::::L
//     c:::::::::::::::::ch:::::h     h:::::hm::::m   m::::m   m::::m p::::::::::::::::p L::::::::::::::::::::::L
//      cc:::::::::::::::ch:::::h     h:::::hm::::m   m::::m   m::::m p::::::::::::::pp  L::::::::::::::::::::::L
//        cccccccccccccccchhhhhhh     hhhhhhhmmmmmm   mmmmmm   mmmmmm p::::::pppppppp    LLLLLLLLLLLLLLLLLLLLLLLL
//                                                                    p:::::p
//                                                                    p:::::p
//                                                                   p:::::::p
//                                                                   p:::::::p
//                                                                   p:::::::p
//                                                                   ppppppppp
//

function chompLeft(str, idx, ...args) {
  console.log(
    `819 chompLeft(): received ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
      args,
      null,
      4
    )}`
  );
  // if there are no arguments, null
  if (!args.length || (args.length === 1 && isObj(args[0]))) {
    console.log(`827 return null because there's nothing to match`);
    return null;
  }
  console.log(`830 chompLeft()`);

  //
  // OPTS.
  //

  // modes:
  // 0 - leave single space if possible
  // 1 - stop at first space, leave whitespace alone
  // 2 - aggressively chomp all whitespace except newlines
  // 3 - aggressively chomp all whitespace including newlines
  const defaults = {
    mode: 0,
  };
  // now, the first element within args can be opts.
  // It's a plain object so it's easy to distinguish
  if (isObj(args[0])) {
    const opts = { ...defaults, ...clone(args[0]) };
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
    console.log(`859 FINAL opts = ${JSON.stringify(opts, null, 4)}`);
    return chomp("left", str, idx, opts, clone(args).slice(1));
  }
  if (!isStr(args[0])) {
    console.log(`863 FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
    return chomp("left", str, idx, defaults, clone(args).slice(1));
  }
  // ELSE
  // all arguments are values to match, first element is not options object
  console.log(`868 FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
  return chomp("left", str, idx, defaults, clone(args));
}

//
//
//                      hhhhhhh                                                         RRRRRRRRRRRRRRRRR
//                      h:::::h                                                         R::::::::::::::::R
//                      h:::::h                                                         R::::::RRRRRR:::::R
//                      h:::::h                                                         RR:::::R     R:::::R
//       cccccccccccccccch::::h hhhhh          mmmmmmm    mmmmmmm   ppppp   ppppppppp     R::::R     R:::::R
//     cc:::::::::::::::ch::::hh:::::hhh     mm:::::::m  m:::::::mm p::::ppp:::::::::p    R::::R     R:::::R
//    c:::::::::::::::::ch::::::::::::::hh  m::::::::::mm::::::::::mp:::::::::::::::::p   R::::RRRRRR:::::R
//   c:::::::cccccc:::::ch:::::::hhh::::::h m::::::::::::::::::::::mpp::::::ppppp::::::p  R:::::::::::::RR
//   c::::::c     ccccccch::::::h   h::::::hm:::::mmm::::::mmm:::::m p:::::p     p:::::p  R::::RRRRRR:::::R
//   c:::::c             h:::::h     h:::::hm::::m   m::::m   m::::m p:::::p     p:::::p  R::::R     R:::::R
//   c:::::c             h:::::h     h:::::hm::::m   m::::m   m::::m p:::::p     p:::::p  R::::R     R:::::R
//   c::::::c     ccccccch:::::h     h:::::hm::::m   m::::m   m::::m p:::::p    p::::::p  R::::R     R:::::R
//   c:::::::cccccc:::::ch:::::h     h:::::hm::::m   m::::m   m::::m p:::::ppppp:::::::pRR:::::R     R:::::R
//    c:::::::::::::::::ch:::::h     h:::::hm::::m   m::::m   m::::m p::::::::::::::::p R::::::R     R:::::R
//     cc:::::::::::::::ch:::::h     h:::::hm::::m   m::::m   m::::m p::::::::::::::pp  R::::::R     R:::::R
//       cccccccccccccccchhhhhhh     hhhhhhhmmmmmm   mmmmmm   mmmmmm p::::::pppppppp    RRRRRRRR     RRRRRRR
//                                                                   p:::::p
//                                                                   p:::::p
//                                                                  p:::::::p
//                                                                  p:::::::p
//                                                                  p:::::::p
//                                                                  ppppppppp
//

function chompRight(str, idx, ...args) {
  console.log(
    `900 chompRight(): received ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
      args,
      null,
      4
    )}`
  );
  // if there are no arguments, null
  if (!args.length || (args.length === 1 && isObj(args[0]))) {
    console.log(`908 return null because there's nothing to match`);
    return null;
  }
  console.log(`911 chompRight()`);

  //
  // OPTS.
  //

  // modes:
  // 0 - leave single space if possible
  // 1 - stop at first space, leave whitespace alone
  // 2 - aggressively chomp all whitespace except newlines
  // 3 - aggressively chomp all whitespace including newlines
  const defaults = {
    mode: 0,
  };
  // now, the first element within args can be opts.
  // It's a plain object so it's easy to distinguish
  if (isObj(args[0])) {
    const opts = { ...defaults, ...clone(args[0]) };
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
    console.log(`940 FINAL opts = ${JSON.stringify(opts, null, 4)}`);
    return chomp("right", str, idx, opts, clone(args).slice(1));
  }
  if (!isStr(args[0])) {
    console.log(`944 FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
    return chomp("right", str, idx, defaults, clone(args).slice(1));
  }
  // ELSE
  // all arguments are values to match, first element is not options object
  console.log(`949 FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
  return chomp("right", str, idx, defaults, clone(args));
}

export {
  left,
  leftStopAtNewLines,
  right,
  rightStopAtNewLines,
  leftSeq,
  rightSeq,
  chompLeft,
  chompRight,
};
