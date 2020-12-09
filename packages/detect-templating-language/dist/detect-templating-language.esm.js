/**
 * detect-templating-language
 * Detects various templating languages present in string
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-templating-language/
 */

import isJinjaNunjucksRegex from 'regex-is-jinja-nunjucks';
import isJSP from 'regex-is-jsp';

function detectLang(str) {
  let name = null;
  if (typeof str !== "string") {
    throw new TypeError(
      `detect-templating-language: [THROW_ID_01] Input must be string! It was given as ${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str}).`
    );
  }
  if (!str) {
    return {
      name,
    };
  }
  if (isJinjaNunjucksRegex().test(str)) {
    name = "Nunjucks";
    const namespaces = /set\s*[\w]+\s*=\s*namespace\(/g;
    const backwardsPattern = /{{['"][w]+['"]\s+if/g;
    if (namespaces.test(str) || backwardsPattern.test(str)) {
      name = "Jinja";
    }
  } else if (isJSP().test(str)) {
    name = "JSP";
  }
  return {
    name,
  };
}

export default detectLang;
