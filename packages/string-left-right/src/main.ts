import { isPlainObject as isObj } from "codsen-utils";
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

// Indexes are exclusive UTF-16 boundaries. Only integer numbers are accepted;
// null and undefined retain the default boundary of zero.
function normalizeLeftIndex(strLength: number, idx: unknown): number | null {
  if (idx == null) {
    return 0;
  }
  if (typeof idx !== "number" || !Number.isInteger(idx) || idx < 0) {
    return null;
  }
  return idx > strLength ? strLength : idx;
}

// Rightward traversal additionally permits the boundary before index zero.
function normalizeIndex(strLength: number, idx: unknown): number | null {
  return idx === -1 ? -1 : normalizeLeftIndex(strLength, idx);
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
    res.value = res.value.slice(0, res.value.length - 1);
    res.optional = true;
  } else if (res.value.endsWith("*") && res.value.length > 1) {
    res.value = res.value.slice(0, res.value.length - 1);
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
  const normalizedIdx = normalizeIndex(str.length, idx);
  if (normalizedIdx === null) {
    return null;
  }
  idx = normalizedIdx;
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
  const normalizedIdx = normalizeIndex(str.length, idx);
  if (normalizedIdx === null || normalizedIdx + 1 >= str.length) {
    return null;
  }
  let i = normalizedIdx + 1;
  if (!isWhitespace(str.charCodeAt(i))) {
    return i;
  }
  i += 1;
  if (i >= str.length) {
    return null;
  }
  if (!isWhitespace(str.charCodeAt(i))) {
    return i;
  }
  for (i += 1; i < str.length; i++) {
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

export interface SeqOutput {
  gaps: [number, number][];
  leftmostChar: number;
  rightmostChar: number;
}

// Parse once per public call, including repeated chomp attempts. Empty strings
// remain deliberate skips; other non-string values invalidate the whole match.
function parseMatchers(
  args: unknown[],
  insensitive: boolean,
): SeparateValueFromFlags[] | null {
  let matchers: SeparateValueFromFlags[] = [];
  for (let arg of args) {
    if (typeof arg !== "string") {
      return null;
    }
    if (arg.length) {
      let matcher = separateValueFromFlags(arg);
      if (insensitive) {
        matcher.value = matcher.value.toLowerCase();
      }
      matchers.push(matcher);
    }
  }
  return matchers;
}

interface NeighborCache {
  boundary: number;
  index: number | null;
  newline: number | null;
}

// Chomp needs the first newline as well as the next solid code unit. Retaining
// this lookup also shares hungry lookahead with the next repetition attempt.
function chompNeighbor(
  direction: "left" | "right",
  str: string,
  boundary: number,
  cache: NeighborCache,
): number | null {
  if (cache.boundary === boundary) {
    return cache.index;
  }
  cache.boundary = boundary;
  cache.newline = null;
  let step = direction === "right" ? 1 : -1;
  for (let i = boundary + step; i >= 0 && i < str.length; i += step) {
    let code = str.charCodeAt(i);
    if (!isWhitespace(code)) {
      cache.index = i;
      return i;
    }
    if (cache.newline === null && (code === 10 || code === 13)) {
      cache.newline = i;
    }
  }
  cache.index = null;
  return null;
}

// Return only the consumed endpoint. Sequence calls opt into recording gaps
// and bounds; chomp calls allocate neither gap tuples nor sequence outputs.
function matchSequence(
  direction: "left" | "right",
  str: string,
  idx: number,
  matchers: SeparateValueFromFlags[],
  insensitive: boolean,
  result?: SeqOutput,
  cache?: NeighborCache,
): number | null {
  let lastFinding = idx;
  let neighbor: number | null | undefined;
  for (let { value, hungry, optional } of matchers) {
    let matched = false;
    do {
      if (neighbor === undefined) {
        neighbor = cache
          ? chompNeighbor(direction, str, lastFinding, cache)
          : direction === "right"
            ? right(str, lastFinding)
            : left(str, lastFinding);
      }
      if (
        neighbor === null ||
        (insensitive ? str[neighbor].toLowerCase() : str[neighbor]) !== value
      ) {
        if (!matched && !optional) {
          DEV && console.log(`RETURN null`);
          return null;
        }
        break;
      }
      DEV && console.log(`${`\u001b[${32}m${value} MATCHED!\u001b[${39}m`}`);
      if (result) {
        if (direction === "right") {
          if (neighbor > lastFinding + 1) {
            result.gaps.push([lastFinding + 1, neighbor]);
          }
          if (lastFinding === idx) {
            result.leftmostChar = neighbor;
          }
          result.rightmostChar = neighbor;
        } else {
          if (neighbor < lastFinding - 1) {
            result.gaps.push([neighbor + 1, lastFinding]);
          }
          if (lastFinding === idx) {
            result.rightmostChar = neighbor;
          }
          result.leftmostChar = neighbor;
        }
      }
      lastFinding = neighbor;
      neighbor = undefined;
      matched = true;
    } while (hungry);
  }
  return lastFinding === idx ? null : lastFinding;
}

function seq(
  direction: "left" | "right",
  str: string,
  idx: number,
  opts: Opts,
  args: unknown[],
): SeqOutput | null {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  let boundary = normalizeIndex(str.length, idx);
  if (
    boundary === null ||
    (direction === "left" && boundary < 0) ||
    (opts.i !== undefined && typeof opts.i !== "boolean")
  ) {
    return null;
  }
  let matchers = parseMatchers(args, !!opts.i);
  if (!matchers) {
    return null;
  }
  let result: SeqOutput = {
    gaps: [],
    leftmostChar: boundary,
    rightmostChar: boundary,
  };
  if (
    matchSequence(direction, str, boundary, matchers, !!opts.i, result) === null
  ) {
    return null;
  }
  if (direction === "left") {
    result.gaps.reverse();
  }
  DEV && console.log(`FINAL result`, result);
  return result;
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
function leftSeq(
  str: string,
  idx: number,
  ...args: unknown[]
): SeqOutput | null {
  if (!args.length) {
    throw new Error(
      `string-left-right/leftSeq(): [THROW_ID_01] only two input arguments were passed! Did you intend to use left() method instead?`,
    );
  }
  let opts: Opts;
  if (isObj(args[0])) {
    opts = { ...seqDefaults, ...(args.shift() as Opts) };
  } else {
    opts = seqDefaults;
  }
  DEV && console.log(`leftSeq() \u001b[33mopts\u001b[39m =`, opts);

  DEV && console.log(`leftSeq() calling seq()`);
  return seq("left", str, idx, opts, args.reverse());
}

function rightSeq(
  str: string,
  idx: number,
  ...args:
    | [value: string, ...values: string[]]
    | [opts: Opts, value: string, ...values: string[]]
): SeqOutput | null;
function rightSeq(
  str: string,
  idx: number,
  ...args: unknown[]
): SeqOutput | null {
  if (!args.length) {
    throw new Error(
      `string-left-right/rightSeq(): [THROW_ID_02] only two input arguments were passed! Did you intend to use right() method instead?`,
    );
  }
  let opts: Opts;
  if (isObj(args[0])) {
    opts = { ...seqDefaults, ...(args.shift() as Opts) };
  } else {
    opts = seqDefaults;
  }
  DEV && console.log(`rightSeq() \u001b[33mopts\u001b[39m =`, opts);
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

export interface ChompOpts {
  mode?: 0 | 1 | 2 | 3 | "0" | "1" | "2" | "3" | "" | null;
}

type ChompMode = 0 | 1 | 2 | 3;

function normalizeMode(mode: unknown): ChompMode | null {
  if (mode == null || mode === "") {
    return 0;
  }
  if (mode === "0" || mode === "1" || mode === "2" || mode === "3") {
    return +mode as ChompMode;
  }
  return mode === 0 || mode === 1 || mode === 2 || mode === 3 ? mode : null;
}

function describeMode(mode: unknown): string {
  // Avoid calling caller-owned conversion methods in a validation diagnostic.
  return typeof mode === "object" || typeof mode === "function"
    ? `<${typeof mode}>`
    : String(mode);
}

// chomp() lets you match sequences of characters with zero or more whitespace characters in between each,
// on left or right of a given string index, with optional granular control over surrounding
// whitespace-munching. Yes, that's a technical term.
function chomp(
  direction: "left" | "right",
  str: string,
  idx: number,
  mode: ChompMode,
  args: unknown[],
): number | null {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  let boundary = normalizeIndex(str.length, idx);
  if (boundary === null || (direction === "left" && boundary < 0)) {
    return null;
  }
  if (direction === "left") {
    args.reverse();
  }
  let matchers = parseMatchers(args, false);
  if (!matchers?.length) {
    return null;
  }
  let cache: NeighborCache = { boundary: -2, index: null, newline: null };
  let lastIdx: number | null = null;
  let next: number | null;
  let newline: number | null;
  for (;;) {
    // Save the first gap of this attempt: a later mandatory mismatch can leave
    // the cache beyond the last complete sequence. Tail modes use only this gap.
    next = chompNeighbor(direction, str, boundary, cache);
    newline = cache.newline;
    let endpoint = matchSequence(
      direction,
      str,
      boundary,
      matchers,
      false,
      undefined,
      cache,
    );
    if (endpoint === null) {
      break;
    }
    boundary = endpoint;
    lastIdx = endpoint;
    DEV &&
      console.log(
        `${`\u001b[${36}manother sequence; confirmed!\u001b[${39}m`}`,
        lastIdx,
      );
  }
  if (lastIdx === null) {
    return null;
  }
  let start = direction === "right" ? lastIdx + 1 : lastIdx;
  if (mode === 1) {
    return start;
  }
  // The failed repetition has already found the solid endpoint and nearest
  // CR/LF. No tail mode needs a second traversal or a temporary substring.
  if (mode !== 3 && newline !== null) {
    return direction === "right" ? newline : newline + 1;
  }
  if (direction === "right") {
    if (next === null) {
      return str.length;
    }
    return mode === 0 ? Math.max(start, next - 1) : next;
  }
  if (next === null) {
    return 0;
  }
  return mode === 0 ? Math.min(start, next + 2) : next + 1;
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
function chompLeft(
  str: string,
  idx: number,
  ...args: unknown[]
): number | null {
  DEV && console.log(`chompLeft(): received args`, args);
  let mode: ChompMode = 0;
  if (isObj(args[0])) {
    let inputMode = (args.shift() as ChompOpts).mode;
    let normalizedMode = normalizeMode(inputMode);
    if (normalizedMode === null) {
      throw new Error(
        `string-left-right/chompLeft(): [THROW_ID_03] opts.mode must be 0, 1, 2 or 3. Received ${describeMode(inputMode)} (type ${typeof inputMode})`,
      );
    }
    mode = normalizedMode;
  } else if (args.length && args[0] == null) {
    args.shift();
  }
  return chomp("left", str, idx, mode, args);
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
function chompRight(
  str: string,
  idx: number,
  ...args: unknown[]
): number | null {
  DEV && console.log(`chompRight(): received args`, args);
  let mode: ChompMode = 0;
  if (isObj(args[0])) {
    let inputMode = (args.shift() as ChompOpts).mode;
    let normalizedMode = normalizeMode(inputMode);
    if (normalizedMode === null) {
      throw new Error(
        `string-left-right/chompRight(): [THROW_ID_04] opts.mode must be 0, 1, 2 or 3. Received ${describeMode(inputMode)} (type ${typeof inputMode})`,
      );
    }
    mode = normalizedMode;
  } else if (args.length && args[0] == null) {
    args.shift();
  }
  return chomp("right", str, idx, mode, args);
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
