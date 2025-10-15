import { isStr } from "codsen-utils";

export function goLevelUp(str: string): string {
  if (isStr(str) && str.length && str.indexOf(".") !== -1) {
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
