import { isAttrNameChar } from "is-char-suitable-for-html-attr-name";
import { left } from "string-left-right";

function makeTheQuoteOpposite(quoteChar: string): string {
  return quoteChar === `'` ? `"` : `'`;
}

function ensureXIsNotPresentBeforeOneOfY(
  str: string,
  startingIdx: number,
  x: string,
  y: string[] = []
): boolean {
  console.log(`014e ensureXIsNotPresentBeforeOneOfY() called`);
  for (let i = startingIdx, len = str.length; i < len; i++) {
    console.log(`016e str[i] = ${str[i]}`);
    if (y.some((oneOfStr) => str.startsWith(oneOfStr, i))) {
      // it's escape clause, bracket or whatever was reached and yet,
      // "x" hasn't been encountered yet
      console.log(`020e return true`);
      return true;
    }
    if (str[i] === x) {
      // if "x" was found, that's it - falsey result
      console.log(`025e return false`);
      return false;
    }
  }
  // default result
  console.log(`030e return true`);
  return true;
}

// Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.
function xBeforeYOnTheRight(
  str: string,
  startingIdx: number,
  x: string,
  y: string
): boolean {
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
function plausibleAttrStartsAtX(str: string, start: number): boolean {
  console.log(
    `${`\u001b[${35}m${`plausibleAttrStartsAtX()`}\u001b[${39}m`} called, start = ${start}`
  );
  if (!isAttrNameChar(str[start]) || !start) {
    return false;
  }
  // const regex = /^[a-zA-Z0-9:-]*[=]?((?:'[^']*')|(?:"[^"]*"))/;
  let regex =
    /^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/;
  return regex.test(str.slice(start));
}

// difference is equal is required
function guaranteedAttrStartsAtX(str: string, start: number): boolean {
  console.log(
    `${`\u001b[${35}m${`guaranteedAttrStartsAtX()`}\u001b[${39}m`} called, start = ${start}`
  );
  if (!start || !isAttrNameChar(str[start])) {
    console.log(`081g return false`);
    return false;
  }
  // either quotes match or does not match but tag closing follows
  // const regex = /^[a-zA-Z0-9:-]*[=]?(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  let regex =
    /^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  console.log(`088g return ${regex.test(str.slice(start))}`);
  return regex.test(str.slice(start));
}

function findAttrNameCharsChunkOnTheLeft(
  str: string,
  i: number
): undefined | string {
  if (!isAttrNameChar(str[left(str, i) as number])) {
    return;
  }
  for (let y = i; y--; ) {
    console.log(
      `101 ${`\u001b[${36}m${`str[y]`}\u001b[${39}m`} = ${JSON.stringify(
        str[y],
        null,
        4
      )}`
    );
    if (str[y].trim().length && !isAttrNameChar(str[y])) {
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
  makeTheQuoteOpposite,
};
