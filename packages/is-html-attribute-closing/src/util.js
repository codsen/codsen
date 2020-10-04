import charSuitableForHTMLAttrName from "is-char-suitable-for-html-attr-name";
import { left } from "string-left-right";

function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x, y = []) {
  console.log(`005e ensureXIsNotPresentBeforeOneOfY() called`);
  for (let i = startingIdx, len = str.length; i < len; i++) {
    console.log(`007e str[i] = ${str[i]}`);
    if (y.some((oneOfStr) => str.startsWith(oneOfStr, i))) {
      // it's escape clause, bracket or whatever was reached and yet,
      // "x" hasn't been encountered yet
      console.log(`011e return true`);
      return true;
    }
    if (str[i] === x) {
      // if "x" was found, that's it - falsey result
      console.log(`016e return false`);
      return false;
    }
  }
  // default result
  console.log(`021e return true`);
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
    }
    if (str.startsWith(y, i)) {
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
  // const regex = /^[a-zA-Z0-9:-]*[=]?((?:'[^']*')|(?:"[^"]*"))/;
  const regex = /^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/;
  return regex.test(str.slice(start));
}

// difference is equal is required
function guaranteedAttrStartsAtX(str, start) {
  console.log(
    `${`\u001b[${35}m${`guaranteedAttrStartsAtX()`}\u001b[${39}m`} called, start = ${start}`
  );
  if (!charSuitableForHTMLAttrName(str[start]) || !start) {
    console.log(`066g return false`);
    return false;
  }
  // either quotes match or does not match but tag closing follows
  // const regex = /^[a-zA-Z0-9:-]*[=]?(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  const regex = /^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  console.log(`072g return ${regex.test(str.slice(start))}`);
  return regex.test(str.slice(start));
}

function findAttrNameCharsChunkOnTheLeft(str, i) {
  if (!charSuitableForHTMLAttrName(str[left(str, i)])) {
    return;
  }
  for (let y = i; y--; ) {
    console.log(
      `082 ${`\u001b[${36}m${`str[y]`}\u001b[${39}m`} = ${JSON.stringify(
        str[y],
        null,
        4
      )}`
    );
    if (str[y].trim().length && !charSuitableForHTMLAttrName(str[y])) {
      return str.slice(y + 1, i);
    }
  }
}

export {
  ensureXIsNotPresentBeforeOneOfY,
  xBeforeYOnTheRight,
  plausibleAttrStartsAtX,
  guaranteedAttrStartsAtX,
  findAttrNameCharsChunkOnTheLeft,
};
