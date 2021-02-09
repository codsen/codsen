/**
 * regex-is-jinja-nunjucks
 * Regular expression for detecting Jinja or Nunjucks code
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jinja-nunjucks/
 */

var version = "2.0.3";

const version$1 = version;

function isJinjaNunjucksRegex() {
  return /{%|{{|%}|}}/gi;
}

export { isJinjaNunjucksRegex, version$1 as version };
