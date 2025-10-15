import { isStr } from "codsen-utils";

export function getTopmostKey(str: string): string {
  if (isStr(str) && str.length && str.indexOf(".") !== -1) {
    for (let i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
