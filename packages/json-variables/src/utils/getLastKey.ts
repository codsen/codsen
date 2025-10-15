import { isStr } from "codsen-utils";

export function getLastKey(str: string): string {
  if (isStr(str) && str.length && str.indexOf(".") !== -1) {
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
