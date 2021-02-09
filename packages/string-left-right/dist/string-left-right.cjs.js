/**
 * string-left-right
 * Looks up the first non-whitespace character to the left/right of a given index
 * Version: 4.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-left-right/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var isObj = require('lodash.isplainobject');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

var version = "4.0.3";

var version$1 = version;
var RAWNBSP = "\xA0"; // separates the value from flags

function x(something) {
  // console.log(
  //   `007 ${`\u001b[${35}m${`x() incoming "${something}"`}\u001b[${39}m`}`
  // );
  var res = {
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
  } // console.log(
  //   `036 ${`\u001b[${35}m${`x() returning ${JSON.stringify(
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

function rightMain(_ref) {
  var str = _ref.str,
      _ref$idx = _ref.idx,
      idx = _ref$idx === void 0 ? 0 : _ref$idx,
      _ref$stopAtNewlines = _ref.stopAtNewlines,
      stopAtNewlines = _ref$stopAtNewlines === void 0 ? false : _ref$stopAtNewlines,
      _ref$stopAtRawNbsp = _ref.stopAtRawNbsp,
      stopAtRawNbsp = _ref$stopAtRawNbsp === void 0 ? false : _ref$stopAtRawNbsp;

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (!str[idx + 1]) {
    return null;
  }

  if ( // next character exists
  str[idx + 1] && ( // and...
  // it's solid
  str[idx + 1].trim() || // or it's a whitespace character, but...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[idx + 1]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx + 1] === RAWNBSP)) {
    // best case scenario - next character is non-whitespace:
    return idx + 1;
  }

  if ( // second next character exists
  str[idx + 2] && ( // and...
  // it's solid
  str[idx + 2].trim() || // it's a whitespace character and...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[idx + 2]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx + 2] === RAWNBSP)) {
    // second best case scenario - second next character is non-whitespace:
    return idx + 2;
  } // worst case scenario - traverse forwards


  for (var i = idx + 1, len = str.length; i < len; i++) {
    if ( // it's solid
    str[i].trim() || // it's a whitespace character and...
    // stop at newlines is on
    stopAtNewlines && // and it's a newline
    "\n\r".includes(str[i]) || // stop at raw nbsp is on
    stopAtRawNbsp && // and it's a raw nbsp
    str[i] === RAWNBSP) {
      return i;
    }
  }

  return null;
}

function right(str, idx) {
  if (idx === void 0) {
    idx = 0;
  }

  return rightMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}

function rightStopAtNewLines(str, idx) {
  return rightMain({
    str: str,
    idx: idx,
    stopAtNewlines: true,
    stopAtRawNbsp: false
  });
}

function rightStopAtRawNbsp(str, idx) {
  return rightMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: true
  });
} //
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


function leftMain(_ref2) {
  var str = _ref2.str,
      idx = _ref2.idx,
      stopAtNewlines = _ref2.stopAtNewlines,
      stopAtRawNbsp = _ref2.stopAtRawNbsp;

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (idx < 1) {
    return null;
  }

  if ( // ~- means minus one, in bitwise
  str[~-idx] && ( // either it's not a whitespace
  str[~-idx].trim() || // or it is whitespace, but...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[~-idx]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[~-idx] === RAWNBSP)) {
    // best case scenario - next character is non-whitespace:
    return ~-idx;
  } // if we reached this point, this means character on the left is whitespace -
  // fine - check the next character on the left, str[idx - 2]


  if ( // second character exists
  str[idx - 2] && ( // either it's not whitespace so Bob's your uncle here's non-whitespace character
  str[idx - 2].trim() || // it is whitespace, but...
  // stop at newlines is on
  stopAtNewlines && // it's some sort of a newline
  "\n\r".includes(str[idx - 2]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx - 2] === RAWNBSP)) {
    // second best case scenario - second next character is non-whitespace:
    return idx - 2;
  } // worst case scenario - traverse backwards


  for (var i = idx; i--;) {
    if (str[i] && ( // it's non-whitespace character
    str[i].trim() || // or it is whitespace character, but...
    // stop at newlines is on
    stopAtNewlines && // it's some sort of a newline
    "\n\r".includes(str[i]) || // stop at raw nbsp is on
    stopAtRawNbsp && // and it's a raw nbsp
    str[i] === RAWNBSP)) {
      return i;
    }
  }

  return null;
}

function left(str, idx) {
  if (idx === void 0) {
    idx = 0;
  }

  return leftMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}

function leftStopAtNewLines(str, idx) {
  return leftMain({
    str: str,
    idx: idx,
    stopAtNewlines: true,
    stopAtRawNbsp: false
  });
}

function leftStopAtRawNbsp(str, idx) {
  return leftMain({
    str: str,
    idx: idx,
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
    // if next character on the particular side doesn't even exist, that's a quick end
    return null;
  } // we start to look on the particular side from index "idx".
  // From there on, each finding sets its index to "lastFinding" so that we
  // know where to start looking on from next. Any failed finding
  // in a sequence is instant return "null".


  var lastFinding = idx;
  var gaps = [];
  var leftmostChar;
  var rightmostChar;
  var satiated; // used to prevent mismatching action kicking in when that
  // mismatching is after multiple hungry findings.
  // go through all arguments

  var i = 0; // we use while loop because for loop would not do in hungry matching cases,
  // where we need to repeat same step (hungrily matched character) few times.

  while (i < args.length) {

    if (!isStr(args[i]) || !args[i].length) {
      i += 1;
      continue;
    }

    var _x = x(args[i]),
        value = _x.value,
        optional = _x.optional,
        hungry = _x.hungry;
    var whattsOnTheSide = direction === "right" ? right(str, lastFinding) : left(str, lastFinding);

    if (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase() || !opts.i && str[whattsOnTheSide] === value) { // OK, one was matched, we're in the right clauses (otherwise we'd skip
      // if it was optional or break the matching)
      // Now, it depends, is it a hungry match, because if so, we need to look
      // for more of these.

      var temp = direction === "right" ? right(str, whattsOnTheSide) : left(str, whattsOnTheSide);

      if (hungry && (opts.i && str[temp].toLowerCase() === value.toLowerCase() || !opts.i && str[temp] === value)) {
        // satiated means next iteration is allowed not to match anything
        satiated = true;
      } else {
        // move on
        i += 1;
      } // 1. first, tackle gaps
      // if there was a gap, push it to gaps array:

      if (typeof whattsOnTheSide === "number" && direction === "right" && whattsOnTheSide > lastFinding + 1) {
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && typeof whattsOnTheSide === "number" && whattsOnTheSide < ~-lastFinding) {
        gaps.unshift([whattsOnTheSide + 1, lastFinding]);
      } // 2. second, tackle the matching

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
  } // if all arguments in sequence were empty strings, we return falsey null:

  if (leftmostChar === undefined || rightmostChar === undefined) {
    return null;
  }
  return {
    gaps: gaps,
    leftmostChar: leftmostChar,
    rightmostChar: rightmostChar
  };
} //
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


var seqDefaults = {
  i: false
};

function leftSeq(str, idx) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  // if there are no arguments, it becomes left()
  if (!args || !args.length) {
    // console.log(`493 leftSeq() calling left()`);
    // return left(str, idx);
    throw new Error("string-left-right/leftSeq(): only two input arguments were passed! Did you intend to use left() method instead?");
  }

  var opts;

  if (isObj__default['default'](args[0])) {
    opts = _objectSpread__default['default'](_objectSpread__default['default']({}, seqDefaults), args.shift());
  } else {
    opts = seqDefaults;
  }
  return seq("left", str, idx, opts, Array.from(args).reverse());
}

function rightSeq(str, idx) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  // if there are no arguments, it becomes right()
  if (!args || !args.length) {
    // console.log(`520 rightSeq() calling right()`);
    // return right(str, idx);
    throw new Error("string-left-right/rightSeq(): only two input arguments were passed! Did you intend to use right() method instead?");
  }

  var opts;

  if (isObj__default['default'](args[0])) {
    opts = _objectSpread__default['default'](_objectSpread__default['default']({}, seqDefaults), args.shift());
  } else {
    opts = seqDefaults;
  }
  return seq("right", str, idx, opts, args);
} // chomp() lets you match sequences of characters with zero or more whitespace characters in between each,
// on left or right of a given string index, with optional granular control over surrounding
// whitespace-munching. Yes, that's a technical term.


function chomp(direction, str, idx, opts, args) {
  if (args === void 0) {
    args = [];
  }

  //
  // INSURANCE.
  //
  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (direction === "right" && !str[idx + 1] || direction === "left" && +idx === 0) {
    return null;
  } //
  // ACTION.
  //
  var lastRes = null;
  var lastIdx = null;

  do {
    lastRes = direction === "right" ? rightSeq.apply(void 0, [str, typeof lastIdx === "number" ? lastIdx : idx].concat(args)) : leftSeq.apply(void 0, [str, typeof lastIdx === "number" ? lastIdx : idx].concat(args));

    if (lastRes !== null) {
      lastIdx = direction === "right" ? lastRes.rightmostChar : lastRes.leftmostChar;
    }
  } while (lastRes);

  if (lastIdx != null && direction === "right") {
    lastIdx += 1;
  }

  if (lastIdx === null) {
    // if nothing was matched
    return null;
  } // the last thing what's left to do is tackle the whitespace on the right.
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
      return lastIdx;
    } // Default, 0 is leave single space if possible or chomp up to nearest line
    // break character or chomp up to EOL


    var whatsOnTheRight = right(str, lastIdx);

    if (!opts || opts.mode === 0) {
      if (whatsOnTheRight === lastIdx + 1) {
        // if there's one whitespace character, Bob's your uncle here's
        // the final result
        return lastIdx;
      }

      if (str.slice(lastIdx, whatsOnTheRight || str.length).trim() || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")) { // if there are line break characters between current "lastIdx" we're on
        // and the first non-whitespace character on the right

        for (var y = lastIdx, len = str.length; y < len; y++) {
          if ("\n\r".includes(str[y])) {
            return y;
          }
        }
      } else {
        return whatsOnTheRight ? ~-whatsOnTheRight : str.length;
      }
    } else if (opts.mode === 1) {
      // mode 1 doesn't touch the whitespace, so it's quick:
      return lastIdx;
    } else if (opts.mode === 2) {
      // mode 2 hungrily chomps all whitespace except newlines
      var remainderString = str.slice(lastIdx);

      if (remainderString.trim() || remainderString.includes("\n") || remainderString.includes("\r")) {
        // if there are line breaks, we need to loop to chomp up to them but not further
        for (var _y = lastIdx, _len3 = str.length; _y < _len3; _y++) {
          if (str[_y].trim() || "\n\r".includes(str[_y])) {
            return _y;
          }
        }
      } // ELSE, last but not least, chomp to the end:
      return str.length;
    } // ELSE - mode 3
    // mode 3 is an aggro chomp - will chump all whitespace
    return whatsOnTheRight || str.length; //
    //
    //
    //                           R I G H T    E N D S
    //
    //
    //
  } //
  //
  //
  //                                L E F T
  //
  //
  //
  // quick ending - no whitespace on the left at all:


  if (str[lastIdx] && str[~-lastIdx] && str[~-lastIdx].trim()) {
    // if the non-whitespace character is on the left
    return lastIdx;
  } // Default, 0 is leave single space if possible or chomp up to nearest line
  // break character or chomp up to index zero, start of the string


  var whatsOnTheLeft = left(str, lastIdx);

  if (!opts || opts.mode === 0) {

    if (whatsOnTheLeft === lastIdx - 2) {
      // if there's one whitespace character between here and next real character, Bob's your uncle here's
      // the final result
      return lastIdx;
    }

    if (str.slice(0, lastIdx).trim() || str.slice(0, lastIdx).includes("\n") || str.slice(0, lastIdx).includes("\r")) { // if there are line break characters between current "lastIdx" we're on
      // and the first non-whitespace character on the right

      for (var _y2 = lastIdx; _y2--;) {

        if ("\n\r".includes(str[_y2]) || str[_y2].trim()) {
          return _y2 + 1 + (str[_y2].trim() ? 1 : 0);
        }
      }
    } // ELSE
    return 0;
  }

  if (opts.mode === 1) {
    // mode 1 doesn't touch the whitespace, so it's quick:
    return lastIdx;
  }

  if (opts.mode === 2) {
    // mode 2 hungrily chomps all whitespace except newlines
    var _remainderString = str.slice(0, lastIdx);

    if (_remainderString.trim() || _remainderString.includes("\n") || _remainderString.includes("\r")) {
      // if there are line breaks, we need to loop to chomp up to them but not further
      for (var _y3 = lastIdx; _y3--;) {
        if (str[_y3].trim() || "\n\r".includes(str[_y3])) {
          return _y3 + 1;
        }
      }
    } // ELSE, last but not least, chomp to the end:
    return 0;
  } // ELSE - mode 3
  // mode 3 is an aggro chomp - will chump all whitespace
  return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0; //
  //
  //
  //                            L E F T    E N D S
  //
  //
  //
} //
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


function chompLeft(str, idx) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key3 = 2; _key3 < _len4; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  } // if there are no arguments, null

  if (!args.length || args.length === 1 && isObj__default['default'](args[0])) {
    return null;
  } //
  // OPTS.
  //
  // modes:
  // 0 - leave single space if possible
  // 1 - stop at first space, leave whitespace alone
  // 2 - aggressively chomp all whitespace except newlines
  // 3 - aggressively chomp all whitespace including newlines

  var defaults = {
    mode: 0
  }; // now, the first element within args can be opts.
  // It's a plain object so it's easy to distinguish

  if (isObj__default['default'](args[0])) {
    var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), clone__default['default'](args[0]));

    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && "0123".includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error("string-left-right/chompLeft(): [THROW_ID_01] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as " + opts.mode + " (type " + typeof opts.mode + ")");
    }
    return chomp("left", str, idx, opts, clone__default['default'](args).slice(1));
  }

  if (!isStr(args[0])) {
    return chomp("left", str, idx, defaults, clone__default['default'](args).slice(1));
  } // ELSE
  // all arguments are values to match, first element is not options object
  return chomp("left", str, idx, defaults, clone__default['default'](args));
} //
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


function chompRight(str, idx) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 2 ? _len5 - 2 : 0), _key4 = 2; _key4 < _len5; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  } // if there are no arguments, null

  if (!args.length || args.length === 1 && isObj__default['default'](args[0])) {
    return null;
  } //
  // OPTS.
  //
  // modes:
  // 0 - leave single space if possible
  // 1 - stop at first space, leave whitespace alone
  // 2 - aggressively chomp all whitespace except newlines
  // 3 - aggressively chomp all whitespace including newlines

  var defaults = {
    mode: 0
  }; // now, the first element within args can be opts.
  // It's a plain object so it's easy to distinguish

  if (isObj__default['default'](args[0])) {
    var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), clone__default['default'](args[0]));

    if (!opts.mode) {
      opts.mode = 0;
    } else if (isStr(opts.mode) && "0123".includes(opts.mode)) {
      opts.mode = Number.parseInt(opts.mode, 10);
    } else if (!isNum(opts.mode)) {
      throw new Error("string-left-right/chompRight(): [THROW_ID_02] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as " + opts.mode + " (type " + typeof opts.mode + ")");
    }
    return chomp("right", str, idx, opts, clone__default['default'](args).slice(1));
  }

  if (!isStr(args[0])) {
    return chomp("right", str, idx, defaults, clone__default['default'](args).slice(1));
  } // ELSE
  // all arguments are values to match, first element is not options object
  return chomp("right", str, idx, defaults, clone__default['default'](args));
}

exports.chompLeft = chompLeft;
exports.chompRight = chompRight;
exports.left = left;
exports.leftSeq = leftSeq;
exports.leftStopAtNewLines = leftStopAtNewLines;
exports.leftStopAtRawNbsp = leftStopAtRawNbsp;
exports.right = right;
exports.rightSeq = rightSeq;
exports.rightStopAtNewLines = rightStopAtNewLines;
exports.rightStopAtRawNbsp = rightStopAtRawNbsp;
exports.version = version$1;
