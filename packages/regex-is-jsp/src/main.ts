import { version as v } from "../package.json";
const version: string = v;

function isJSP(): RegExp {
  return /<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi;
}

export { isJSP, version };
