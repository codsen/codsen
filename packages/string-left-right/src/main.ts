import { isInt, isPlainObject as isObj, isStr } from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  i?: boolean;
}

const RAWNBSP = "\u00A0";

function isWhitespace(charCode: number): boolean {
  return (
    charCode === 32 ||
    (charCode >= 9 && charCode <= 13) ||
    charCode === 160 ||
    charCode === 5760 ||
    (charCode >= 8192 && charCode <= 8202) ||
    charCode === 8232 ||
    charCode === 8233 ||
    charCode === 8239 ||
    charCode === 8287 ||
    charCode === 12288 ||
    charCode === 65279
  );
}

function normalizeLeftIndex(strLength: number, idx: unknown): number | null {
  if (idx == null) {
    return 0;
  }
  if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0) {
    return null;
  }
  return idx > strLength ? strLength : idx;
}

// separates the value from flags
interface SeparateValueFromFlags {
  value: string;
  hungry: boolean;
  optional: boolean;
}
function separateValueFromFlags(something: string): SeparateValueFromFlags {
  let res = {
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
  return res;
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

interface MainInputs {
  str: string;
  idx?: number | null;
  stopAtNewlines?: boolean;
  stopAtRawNbsp?: boolean;
}

function rightMain({
  str,
  idx = 0,
  stopAtNewlines = false,
  stopAtRawNbsp = false,
}: MainInputs): number | null {
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
    // next character exists
    str[idx + 1] &&
    // and...
    // it's solid
    (str[idx + 1].trim() ||
      // or it's a whitespace character, but...
      // stop at newlines is on
      (stopAtNewlines &&
        // and it's a newline
        "\n\r".includes(str[idx + 1])) ||
      // stop at raw nbsp is on
      (stopAtRawNbsp &&
        // and it's a raw nbsp
        str[idx + 1] === RAWNBSP))
  ) {
    // best case scenario - next character is non-whitespace:
    return idx + 1;
  }
  if (
    // second next character exists
    str[idx + 2] &&
    // and...
    // it's solid
    (str[idx + 2].trim() ||
      // it's a whitespace character and...
      // stop at newlines is on
      (stopAtNewlines &&
        // and it's a newline
        "\n\r".includes(str[idx + 2])) ||
      // stop at raw nbsp is on
      (stopAtRawNbsp &&
        // and it's a raw nbsp
        str[idx + 2] === RAWNBSP))
  ) {
    // second best case scenario - second next character is non-whitespace:
    return idx + 2;
  }
  // worst case scenario - traverse forwards
  for (let i = idx + 3, len = str.length; i < len; i++) {
    if (
      // it's solid
      str[i].trim() ||
      // it's a whitespace character and...
      // stop at newlines is on
      (stopAtNewlines &&
        // and it's a newline
        "\n\r".includes(str[i])) ||
      // stop at raw nbsp is on
      (stopAtRawNbsp &&
        // and it's a raw nbsp
        str[i] === RAWNBSP)
    ) {
      return i;
    }
  }
  return null;
}

function right(str: string, idx: number | null = 0): number | null {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  let char = str[idx + 1];
  if (!char) {
    return null;
  }
  if (!isWhitespace(char.charCodeAt(0))) {
    return idx + 1;
  }
  char = str[idx + 2];
  if (char && !isWhitespace(char.charCodeAt(0))) {
    return idx + 2;
  }
  for (let i = idx + 3, len = str.length; i < len; i++) {
    if (!isWhitespace(str.charCodeAt(i))) {
      return i;
    }
  }
  return null;
}

function rightStopAtNewLines(
  str: string,
  idx: number | null = 0,
): number | null {
  return rightMain({ str, idx, stopAtNewlines: true, stopAtRawNbsp: false });
}

function rightStopAtRawNbsp(
  str: string,
  idx: number | null = 0,
): number | null {
  return rightMain({ str, idx, stopAtNewlines: false, stopAtRawNbsp: true });
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
function leftMain({
  str,
  idx,
  stopAtNewlines,
  stopAtRawNbsp,
}: MainInputs): number | null {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  const normalizedIdx = normalizeLeftIndex(str.length, idx);
  if (normalizedIdx === null || normalizedIdx < 1) {
    return null;
  }
  let i = normalizedIdx - 1;
  let charCode = str.charCodeAt(i);
  if (
    !isWhitespace(charCode) ||
    (stopAtNewlines && (charCode === 10 || charCode === 13)) ||
    (stopAtRawNbsp && charCode === 160)
  ) {
    return i;
  }
  i -= 1;
  if (i < 0) {
    return null;
  }
  charCode = str.charCodeAt(i);
  if (
    !isWhitespace(charCode) ||
    (stopAtNewlines && (charCode === 10 || charCode === 13)) ||
    (stopAtRawNbsp && charCode === 160)
  ) {
    return i;
  }
  for (i -= 1; i >= 0; i--) {
    charCode = str.charCodeAt(i);
    if (
      !isWhitespace(charCode) ||
      (stopAtNewlines && (charCode === 10 || charCode === 13)) ||
      (stopAtRawNbsp && charCode === 160)
    ) {
      return i;
    }
  }
  return null;
}

function left(str: string, idx: number | null = 0): number | null {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  const normalizedIdx = normalizeLeftIndex(str.length, idx);
  if (normalizedIdx === null || normalizedIdx < 1) {
    return null;
  }
  let i = normalizedIdx - 1;
  if (!isWhitespace(str.charCodeAt(i))) {
    return i;
  }
  i -= 1;
  if (i < 0) {
    return null;
  }
  if (!isWhitespace(str.charCodeAt(i))) {
    return i;
  }
  for (i -= 1; i >= 0; i--) {
    if (!isWhitespace(str.charCodeAt(i))) {
      return i;
    }
  }
  return null;
}

function leftStopAtNewLines(
  str: string,
  idx: number | null = 0,
): number | null {
  return leftMain({ str, idx, stopAtNewlines: true, stopAtRawNbsp: false });
}

function leftStopAtRawNbsp(str: string, idx: number | null = 0): number | null {
  return leftMain({ str, idx, stopAtNewlines: false, stopAtRawNbsp: true });
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

interface SeqOutput {
  gaps: [number, number][];
  leftmostChar: number;
  rightmostChar: number;
}

function seq(
  direction: "left" | "right",
  str: string,
  idx: number,
  opts: Opts,
  args: any[],
): SeqOutput | null {
  DEV && console.log(`seq() called:`);
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (direction === "left") {
    let normalizedIdx = normalizeLeftIndex(str.length, idx);
    if (normalizedIdx === null) {
      return null;
    }
    idx = normalizedIdx;
  } else if (typeof idx !== "number") {
    idx = 0;
  }
  if (
    (direction === "right" && !str[idx + 1]) ||
    (direction === "left" && !str[~-idx])
  ) {
    // if next character on the particular side doesn't even exist, that's a quick end
    DEV && console.log(`RETURN null`);
    return null;
  }
  // we start to look on the particular side from index "idx".
  // From there on, each finding sets its index to "lastFinding" so that we
  // know where to start looking on from next. Any failed finding
  // in a sequence is instant return "null".
  let lastFinding = idx;
  DEV && console.log(`Set lastFinding = ${lastFinding}. Starting the loop.`);

  let gaps: [number, number][] = [];
  let leftmostChar: number | undefined;
  let rightmostChar: number | undefined;

  let satiated; // used to prevent mismatching action kicking in when that
  // mismatching is after multiple hungry findings.

  // go through all arguments
  let i = 0;
  // we use while loop because for loop would not do in hungry matching cases,
  // where we need to repeat same step (hungrily matched character) few times.
  while (i < args.length) {
    DEV &&
      console.log(
        `${`\u001b[${34}m${`███████████████████████████████████████ seq() looping ${args[i]}`}\u001b[${39}m`}; i = ${i}`,
      );
    if (!isStr(args[i]) || !(args[i] as string).length) {
      DEV &&
        console.log(
          `continue because ${JSON.stringify(
            args[i],
            null,
            4,
          )} is not a non-empty string`,
        );
      i += 1;
      continue;
    }
    DEV &&
      console.log(
        `${`\u001b[${36}m${`============= args[${i}]=${args[i]}`}\u001b[${39}m`}`,
      );
    let { value, optional, hungry } = separateValueFromFlags(args[i]);
    DEV &&
      console.log(
        `${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${JSON.stringify(
          value,
          null,
          4,
        )}; ${`\u001b[${33}m${`optional`}\u001b[${39}m`} = ${JSON.stringify(
          optional,
          null,
          4,
        )}; ${`\u001b[${33}m${`hungry`}\u001b[${39}m`} = ${JSON.stringify(
          hungry,
          null,
          4,
        )};`,
      );

    let whattsOnTheSide =
      direction === "right" ? right(str, lastFinding) : left(str, lastFinding);
    DEV &&
      console.log(
        `██ ${`\u001b[${33}m${`whattsOnTheSide`}\u001b[${39}m`} = ${JSON.stringify(
          whattsOnTheSide,
          null,
          4,
        )}`,
      );
    // right()/left() return null once there is no solid character left, and
    // str[null] is undefined - so the character has to be read out before it is
    // compared. The case-sensitive branch tolerated undefined because `===`
    // short-circuits, but the case-insensitive one called a method on it.
    let charOnTheSide = str[whattsOnTheSide as number];
    if (
      charOnTheSide !== undefined &&
      ((opts.i && charOnTheSide.toLowerCase() === value.toLowerCase()) ||
        (!opts.i && charOnTheSide === value))
    ) {
      DEV &&
        console.log(
          `SET whattsOnTheSide = ${whattsOnTheSide} (${charOnTheSide})`,
        );

      // OK, one was matched, we're in the right clauses (otherwise we'd skip
      // if it was optional or break the matching)
      // Now, it depends, is it a hungry match, because if so, we need to look
      // for more of these.
      let temp =
        direction === "right"
          ? right(str, whattsOnTheSide)
          : left(str, whattsOnTheSide);
      DEV &&
        console.log(
          `██ ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
            temp,
            null,
            4,
          )}`,
        );
      // same as above: a hungry flag on the last matchable character makes temp
      // null, so the lookahead character has to be read out before comparing.
      // The read stays behind `hungry` so a non-hungry argument does not pay
      // for an index lookup it never uses.
      let moreOfTheSame = false;
      if (hungry) {
        let charAtTemp = str[temp as number];
        moreOfTheSame =
          charAtTemp !== undefined &&
          ((opts.i && charAtTemp.toLowerCase() === value.toLowerCase()) ||
            (!opts.i && charAtTemp === value));
      }
      if (moreOfTheSame) {
        // satiated means next iteration is allowed not to match anything
        satiated = true;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`satiated`}\u001b[${39}m`} = ${JSON.stringify(
              satiated,
              null,
              4,
            )}`,
          );
      } else {
        // move on
        i += 1;
        satiated = undefined;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
              i,
              null,
              4,
            )}`,
          );
      }

      DEV &&
        console.log(
          `${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
            i,
            null,
            4,
          )}`,
        );

      // 1. first, tackle gaps

      // if there was a gap, push it to gaps array:
      if (
        typeof whattsOnTheSide === "number" &&
        direction === "right" &&
        whattsOnTheSide > lastFinding + 1
      ) {
        DEV && console.log(`push gap [${lastFinding + 1}, ${whattsOnTheSide}]`);
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (
        direction === "left" &&
        typeof whattsOnTheSide === "number" &&
        whattsOnTheSide < ~-lastFinding
      ) {
        DEV &&
          console.log(`unshift gap [${whattsOnTheSide + 1}, ${lastFinding}]`);
        gaps.unshift([whattsOnTheSide + 1, lastFinding]);
      }
      DEV && console.log(`${`\u001b[${32}m${value} MATCHED!\u001b[${39}m`}`);

      // 2. second, tackle the matching

      lastFinding = whattsOnTheSide as number;

      if (direction === "right") {
        if (leftmostChar === undefined) {
          leftmostChar = whattsOnTheSide as number;
        }
        rightmostChar = whattsOnTheSide as number;
      } else {
        if (rightmostChar === undefined) {
          rightmostChar = whattsOnTheSide as number;
        }
        leftmostChar = whattsOnTheSide as number;
      }

      DEV && console.log(`SET lastFinding = ${lastFinding}`);
    } else if (optional) {
      DEV &&
        console.log(
          `${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`} because it was optional`,
        );
      i += 1;
    } else if (satiated) {
      DEV &&
        console.log(
          `${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`} because "satiated" is on`,
        );
      i += 1;
      satiated = undefined;
    } else {
      DEV && console.log(`RETURN null`);
      return null;
    }
  }
  DEV &&
    console.log(
      `${`\u001b[${34}m${`███████████████████████████████████████ seq() stops looping`}\u001b[${39}m`}`,
    );
  DEV && console.log(`FINAL gaps = ${JSON.stringify(gaps, null, 4)}`);

  // if all arguments in sequence were empty strings, we return falsy null:
  if (leftmostChar === undefined || rightmostChar === undefined) {
    DEV && console.log(`RETURN ${`\u001b[${33}m${`null`}\u001b[${39}m`}`);
    return null;
  }

  DEV &&
    console.log(
      `RETURN ${`\u001b[${33}m${JSON.stringify(
        {
          gaps,
          leftmostChar,
          rightmostChar,
        },
        null,
        4,
      )}\u001b[${39}m`}`,
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

const seqDefaults: Opts = {
  i: false,
};

function leftSeq(
  str: string,
  idx: number,
  ...args:
    | [value: string, ...values: string[]]
    | [opts: Opts, value: string, ...values: string[]]
): SeqOutput | null;
function leftSeq(str: string, idx: number, ...args: any[]): SeqOutput | null {
  // if there are no arguments, it becomes left()
  if (!args?.length) {
    // DEV && console.log(`493 leftSeq() calling left()`);
    // return left(str, idx);
    throw new Error(
      `string-left-right/leftSeq(): [THROW_ID_01] only two input arguments were passed! Did you intend to use left() method instead?`,
    );
  }
  let opts;
  if (isObj(args[0])) {
    opts = { ...seqDefaults, ...args.shift() };
  } else {
    opts = seqDefaults;
  }
  DEV &&
    console.log(
      `leftSeq() ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );

  DEV && console.log(`leftSeq() calling seq()`);
  return seq("left", str, idx, opts, Array.from(args).reverse());
}

function rightSeq(
  str: string,
  idx: number,
  ...args:
    | [value: string, ...values: string[]]
    | [opts: Opts, value: string, ...values: string[]]
): SeqOutput | null;
function rightSeq(str: string, idx: number, ...args: any[]): SeqOutput | null {
  // if there are no arguments, it becomes right()
  if (!args?.length) {
    // DEV && console.log(`520 rightSeq() calling right()`);
    // return right(str, idx);
    throw new Error(
      `string-left-right/rightSeq(): [THROW_ID_02] only two input arguments were passed! Did you intend to use right() method instead?`,
    );
  }
  let opts;
  if (isObj(args[0])) {
    opts = { ...seqDefaults, ...args.shift() };
  } else {
    opts = seqDefaults;
  }
  DEV &&
    console.log(
      `rightSeq() ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );
  DEV && console.log(`rightSeq() calling seq()`);
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

interface ChompOpts {
  mode?: 0 | 1 | 2 | 3 | "0" | "1" | "2" | "3" | "" | null;
}

interface NormalizedChompOpts {
  mode?: 0 | 1 | 2 | 3;
}

// chomp() lets you match sequences of characters with zero or more whitespace characters in between each,
// on left or right of a given string index, with optional granular control over surrounding
// whitespace-munching. Yes, that's a technical term.
function chomp(
  direction: "left" | "right",
  str: string,
  idx: number,
  opts?: NormalizedChompOpts,
  args: any[] = [],
): number | null {
  //
  // INSURANCE.
  //

  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (direction === "left") {
    let normalizedIdx = normalizeLeftIndex(str.length, idx);
    if (normalizedIdx === null) {
      return null;
    }
    idx = normalizedIdx;
  } else if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (
    (direction === "right" && !str[idx + 1]) ||
    (direction === "left" && +idx === 0)
  ) {
    DEV && console.log(`there's no space to go further in this direction`);
    return null;
  }

  //
  // ACTION.
  //

  DEV &&
    console.log(
      `${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4,
      )}; ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
        args,
        null,
        4,
      )}`,
    );

  let lastRes = null;
  let lastIdx = null;
  do {
    DEV && console.log();
    DEV &&
      console.log(
        `${`\u001b[${90}m${`███████████████████████████████████████ v`}\u001b[${39}m`}\n`,
      );
    lastRes =
      direction === "right"
        ? rightSeq(
            str,
            typeof lastIdx === "number" ? lastIdx : idx,
            ...(args as [string, ...string[]]),
          )
        : leftSeq(
            str,
            typeof lastIdx === "number" ? lastIdx : idx,
            ...(args as [string, ...string[]]),
          );
    DEV && console.log();
    DEV &&
      console.log(
        `${`\u001b[${90}m${`███████████████████████████████████████ ^`}\u001b[${39}m`}\n`,
      );
    DEV &&
      console.log(
        `${`\u001b[${36}m${`lastRes = ${JSON.stringify(
          lastRes,
          null,
          4,
        )}`}\u001b[${39}m`}`,
      );
    if (lastRes !== null) {
      lastIdx =
        direction === "right" ? lastRes.rightmostChar : lastRes.leftmostChar;
      DEV &&
        console.log(
          `${`\u001b[${36}m${`another sequence; confirmed! Now set `}\u001b[${39}m`} ${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${JSON.stringify(
            lastIdx,
            null,
            4,
          )};`,
        );
    }
  } while (lastRes);
  if (lastIdx != null && direction === "right") {
    lastIdx += 1;
  }
  DEV && console.log();
  DEV &&
    console.log(
      `${`\u001b[${90}m${`███████████████████████████████████████`}\u001b[${39}m`} fin\n`,
    );
  DEV &&
    console.log(`${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${lastIdx}`);

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
    if (str[lastIdx]?.trim()) {
      // if the character follows tightly right after,
      DEV && console.log(`RETURN ${lastIdx}`);
      return lastIdx;
    }
    // Default, 0 is leave single space if possible or chomp up to nearest line
    // break character or chomp up to EOL
    let whatsOnTheRight = right(str, lastIdx);
    DEV &&
      console.log(
        `SET ${`\u001b[${33}m${`whatsOnTheRight`}\u001b[${39}m`} = ${whatsOnTheRight}`,
      );
    if (!opts || opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        // if there's one whitespace character, Bob's your uncle here's
        // the final result
        DEV &&
          console.log(`${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${lastIdx}`);
        return lastIdx;
      }
      if (
        str.slice(lastIdx, whatsOnTheRight || str.length).trim() ||
        str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") ||
        str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")
      ) {
        DEV && console.log(`loop`);
        // if there are line break characters between current "lastIdx" we're on
        // and the first non-whitespace character on the right
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (`\n\r`.includes(str[y])) {
            DEV && console.log(`RETURN ${y}`);
            return y;
          }
        }
      } else {
        DEV &&
          console.log(
            `${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${
              whatsOnTheRight ? ~-whatsOnTheRight : str.length
            }`,
          );
        return whatsOnTheRight ? ~-whatsOnTheRight : str.length;
      }
    } else if (opts.mode === 1) {
      // mode 1 doesn't touch the whitespace, so it's quick:
      DEV && console.log(`RETURN ${lastIdx}`);
      return lastIdx;
    } else if (opts.mode === 2) {
      // mode 2 hungrily chomps all whitespace except newlines
      let remainderString = str.slice(lastIdx);
      DEV &&
        console.log(
          `${`\u001b[${33}m${`remainderString`}\u001b[${39}m`} = ${JSON.stringify(
            remainderString,
            null,
            4,
          )}`,
        );
      if (
        remainderString.trim() ||
        remainderString.includes("\n") ||
        remainderString.includes("\r")
      ) {
        // if there are line breaks, we need to loop to chomp up to them but not further
        for (let y = lastIdx, len = str.length; y < len; y++) {
          if (str[y].trim() || `\n\r`.includes(str[y])) {
            DEV && console.log(`RETURN ${y}`);
            return y;
          }
        }
      }
      // ELSE, last but not least, chomp to the end:
      DEV && console.log(`RETURN ${str.length}`);
      return str.length;
    }
    // ELSE - mode 3

    // mode 3 is an aggro chomp - will chump all whitespace
    DEV && console.log(`RETURN ${whatsOnTheRight || str.length}`);
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
  if (str[lastIdx] && str[~-lastIdx]?.trim()) {
    // if the non-whitespace character is on the left
    DEV && console.log(`RETURN ${lastIdx}`);
    return lastIdx;
  }

  // Default, 0 is leave single space if possible or chomp up to nearest line
  // break character or chomp up to index zero, start of the string
  let whatsOnTheLeft = left(str, lastIdx);
  DEV &&
    console.log(
      `SET ${`\u001b[${33}m${`whatsOnTheLeft`}\u001b[${39}m`} = ${whatsOnTheLeft}`,
    );
  DEV &&
    console.log(
      `FIY, ${`\u001b[${33}m${`lastIdx`}\u001b[${39}m`} = ${lastIdx}`,
    );
  if (!opts || opts.mode === 0) {
    DEV && console.log();
    if (whatsOnTheLeft === lastIdx - 2) {
      // if there's one whitespace character between here and next real character, Bob's your uncle here's
      // the final result
      DEV &&
        console.log(`${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${lastIdx}`);
      return lastIdx;
    }
    if (
      str.slice(0, lastIdx).trim() ||
      str.slice(0, lastIdx).includes("\n") ||
      str.slice(0, lastIdx).includes("\r")
    ) {
      DEV &&
        console.log(
          `${`\u001b[${36}m${`loop backwards from ${lastIdx}`}\u001b[${39}m`}`,
        );
      // if there are line break characters between current "lastIdx" we're on
      // and the first non-whitespace character on the right
      for (let y = lastIdx; y--; ) {
        DEV &&
          console.log(
            `${`\u001b[${36}m${`str[${y}] = ${JSON.stringify(
              str[y],
              null,
              0,
            )}`}\u001b[${39}m`}`,
          );
        if (`\n\r`.includes(str[y]) || str[y].trim()) {
          DEV && console.log(`RETURN ${y + 1 + (str[y].trim() ? 1 : 0)}`);
          return y + 1 + (str[y].trim() ? 1 : 0);
        }
      }
    }
    // ELSE
    DEV && console.log(`${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 0`);
    return 0;
  }
  if (opts.mode === 1) {
    // mode 1 doesn't touch the whitespace, so it's quick:
    DEV && console.log(`RETURN ${lastIdx}`);
    return lastIdx;
  }
  if (opts.mode === 2) {
    // mode 2 hungrily chomps all whitespace except newlines
    let remainderString = str.slice(0, lastIdx);
    if (
      remainderString.trim() ||
      remainderString.includes("\n") ||
      remainderString.includes("\r")
    ) {
      // if there are line breaks, we need to loop to chomp up to them but not further
      for (let y = lastIdx; y--; ) {
        if (str[y].trim() || `\n\r`.includes(str[y])) {
          DEV && console.log(`RETURN ${y + 1}`);
          return y + 1;
        }
      }
    }
    // ELSE, last but not least, chomp to the end:
    DEV && console.log(`RETURN 0`);
    return 0;
  }
  // ELSE - mode 3

  // mode 3 is an aggro chomp - will chump all whitespace
  DEV &&
    console.log(`RETURN ${whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0}`);
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

function chompLeft(
  str: string,
  idx: number,
  ...args:
    | [value: string, ...values: string[]]
    | [opts: ChompOpts | null | undefined, value: string, ...values: string[]]
): number | null;
function chompLeft(str: string, idx: number, ...args: any[]): number | null {
  DEV &&
    console.log(
      `chompLeft(): received ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
        args,
        null,
        4,
      )}`,
    );
  // if there are no arguments, null
  if (!args.length || (args.length === 1 && isObj(args[0]))) {
    DEV && console.log(`return null because there's nothing to match`);
    return null;
  }
  DEV && console.log(`chompLeft()`);

  //
  // OPTS.
  //

  // modes:
  // 0 - leave single space if possible
  // 1 - stop at first space, leave whitespace alone
  // 2 - aggressively chomp all whitespace except newlines
  // 3 - aggressively chomp all whitespace including newlines
  let defaults: NormalizedChompOpts = {
    mode: 0,
  };
  // now, the first element within args can be opts.
  // It's a plain object so it's easy to distinguish
  if (isObj(args[0])) {
    let opts = { ...defaults, ...args[0] };
    if (!opts.mode) {
      opts.mode = 0;
    } else if (
      isStr(opts.mode) &&
      (opts.mode as string).length === 1 &&
      `0123`.includes(opts.mode)
    ) {
      opts.mode = +opts.mode as 0 | 1 | 2 | 3;
    } else if (!isInt(opts.mode) || opts.mode < 0 || opts.mode > 3) {
      throw new Error(
        `string-left-right/chompLeft(): [THROW_ID_03] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ${
          opts.mode
        } (type ${typeof opts.mode})`,
      );
    }
    DEV && console.log(`FINAL opts = ${JSON.stringify(opts, null, 4)}`);
    return chomp("left", str, idx, opts, args.slice(1));
  }
  if (!isStr(args[0])) {
    DEV && console.log(`FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
    return chomp("left", str, idx, defaults, args.slice(1));
  }
  // ELSE
  // all arguments are values to match, first element is not options object
  DEV && console.log(`FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
  return chomp("left", str, idx, defaults, args);
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

function chompRight(
  str: string,
  idx: number,
  ...args:
    | [value: string, ...values: string[]]
    | [opts: ChompOpts | null | undefined, value: string, ...values: string[]]
): number | null;
function chompRight(str: string, idx: number, ...args: any[]): number | null {
  DEV &&
    console.log(
      `chompRight(): received ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
        args,
        null,
        4,
      )}`,
    );
  // if there are no arguments, null
  if (!args.length || (args.length === 1 && isObj(args[0]))) {
    DEV && console.log(`return null because there's nothing to match`);
    return null;
  }
  DEV && console.log(`chompRight()`);

  //
  // OPTS.
  //

  // modes:
  // 0 - leave single space if possible
  // 1 - stop at first space, leave whitespace alone
  // 2 - aggressively chomp all whitespace except newlines
  // 3 - aggressively chomp all whitespace including newlines
  let defaults: NormalizedChompOpts = {
    mode: 0,
  };
  // now, the first element within args can be opts.
  // It's a plain object so it's easy to distinguish
  if (isObj(args[0])) {
    let opts = { ...defaults, ...args[0] };
    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && /^[0-3]$/.test(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10) as 0 | 1 | 2 | 3;
    } else if (!isInt(opts.mode) || opts.mode < 0 || opts.mode > 3) {
      throw new Error(
        `string-left-right/chompRight(): [THROW_ID_04] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ${
          opts.mode
        } (type ${typeof opts.mode})`,
      );
    }
    DEV && console.log(`FINAL opts = ${JSON.stringify(opts, null, 4)}`);
    return chomp("right", str, idx, opts, args.slice(1));
  }
  if (!isStr(args[0])) {
    DEV && console.log(`FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
    return chomp("right", str, idx, defaults, args.slice(1));
  }
  // ELSE
  // all arguments are values to match, first element is not options object
  DEV && console.log(`FINAL opts = ${JSON.stringify(defaults, null, 4)}`);
  return chomp("right", str, idx, defaults, args);
}

export {
  chompLeft,
  chompRight,
  left,
  leftSeq,
  leftStopAtNewLines,
  leftStopAtRawNbsp,
  right,
  rightSeq,
  rightStopAtNewLines,
  rightStopAtRawNbsp,
  version,
};
