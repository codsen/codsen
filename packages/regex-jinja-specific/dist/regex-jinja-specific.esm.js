/**
 * regex-jinja-specific
 * Regular expression for detecting Python-specific Jinja code
 * Version: 2.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-jinja-specific/
 */

var version = "2.0.0";

const version$1 = version;

function isJinjaSpecific() {
  return /(set\s*[\w]+\s*=\s*namespace\()|({{['"][\w]+['"]\s+if)|(['"]%x?[+0]?[.>^<]?\d+[\w%]['"]\|format\()/gi;
}

export { isJinjaSpecific, version$1 as version };
