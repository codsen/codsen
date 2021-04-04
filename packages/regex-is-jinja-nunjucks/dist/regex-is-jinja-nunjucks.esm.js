/**
 * @name regex-is-jinja-nunjucks
 * @fileoverview Regular expression for detecting Jinja or Nunjucks code
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jinja-nunjucks/}
 */

var version$1 = "2.0.14";

const version = version$1;
function isJinjaNunjucksRegex() {
  return /{%|{{|%}|}}/gi;
}

export { isJinjaNunjucksRegex, version };
