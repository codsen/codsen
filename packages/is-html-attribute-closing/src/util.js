import charSuitableForHTMLAttrName from "is-char-suitable-for-html-attr-name";

function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x, y = []) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (y.some((oneOfStr) => str.startsWith(oneOfStr, i))) {
      // it's escape clause, bracket or whatever was reached and yet,
      // "x" hasn't been encountered yet
      return true;
    } else if (str[i] === x) {
      // if "x" was found, that's it - falsey result
      return false;
    }
  }
  // default result
  return true;
}

// Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.
function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      // if x was first, Bob's your uncle, that's truthy result
      return true;
    } else if (str.startsWith(y, i)) {
      // since we're in this clause, x failed, so if y matched,
      // this means y precedes x
      return false;
    }
  }
  // default result
  return false;
}

// Tells, is this a clean plausible attribute starting at given index
// <img alt="so-called "artists"class='yo'/>
//                              ^
//                            start
function plausibleAttrStartsAtX(str, start) {
  console.log(
    `${`\u001b[${35}m${`plausibleAttrStartsAtX()`}\u001b[${39}m`} called, start = ${start}`
  );
  if (!charSuitableForHTMLAttrName(str[start]) || !start) {
    return false;
  }
  const regex = /^[a-zA-Z0-9:-]*[=]?((?:'[^']*')|(?:"[^"]*"))/;
  return regex.test(str.slice(start));
}

// difference is equal is required
function guaranteedAttrStartsAtX(str, start) {
  console.log(
    `${`\u001b[${35}m${`plausibleAttrStartsAtX()`}\u001b[${39}m`} called, start = ${start}`
  );
  if (!charSuitableForHTMLAttrName(str[start]) || !start) {
    return false;
  }
  // either quotes match or does not match but tag closing follows
  // const regex = /^[a-zA-Z0-9:-]*=?((?:'[^']*')|(?:"[^"]*"))/;
  const regex = /^[a-zA-Z0-9:-]*=?(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  return regex.test(str.slice(start));
}

export {
  ensureXIsNotPresentBeforeOneOfY,
  xBeforeYOnTheRight,
  plausibleAttrStartsAtX,
  guaranteedAttrStartsAtX,
};
