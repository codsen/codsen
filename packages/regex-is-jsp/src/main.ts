import { version as v } from "../package.json";

const version: string = v;

function isJSP(): RegExp {
  return /<%|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp|\bxmlns(?::[^\s:="'<>/]+)?[ \t\r\n]*=[ \t\r\n]*(?:"http:\/\/java\.sun\.com\/JSP\/Page"|'http:\/\/java\.sun\.com\/JSP\/Page')/gi;
}

export { isJSP, version };
