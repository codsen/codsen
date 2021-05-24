/**
 * @name regex-jinja-specific
 * @fileoverview Regular expression for detecting Python-specific Jinja code
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-jinja-specific/}
 */

var version$1 = "2.1.0";

const version = version$1;
function isJinjaSpecific() {
  return /(set\s*[\w]+\s*=\s*namespace\()|({{['"][\w]+['"]\s+if)|(['"]%x?[+0]?[.>^<]?\d+[\w%]['"]\|format\()/gi;
}

export { isJinjaSpecific, version };
