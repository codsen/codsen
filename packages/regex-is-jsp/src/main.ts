import { version } from "../package.json";

function isJSP(): RegExp {
  return /<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi;
}

export { isJSP, version };
