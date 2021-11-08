/**
 * @name regex-is-jsp
 * @fileoverview Regular expression for detecting JSP (Java Server Pages) code
 * @version 3.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jsp/}
 */

var version$1 = "3.0.5";

const version = version$1;
function isJSP() {
  return /<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi;
}

export { isJSP, version };
