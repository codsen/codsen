/**
 * detect-templating-language
 * Detects various templating languages present in string
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-templating-language/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.detectTemplatingLanguage = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /**
   * regex-is-jinja-nunjucks
   * Regular expression for detecting Jinja or Nunjucks code
   * Version: 1.1.1
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://codsen.com/os/regex-is-jinja-nunjucks/
   */
  var main = function main() {
    return /{%|{{|%}|}}/gi;
  };

  /**
   * regex-is-jsp
   * Regular expression for detecting JSP (Java Server Pages) code
   * Version: 1.1.1
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://codsen.com/os/regex-is-jsp/
   */
  var main$1 = function main() {
    return /<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi;
  };

  /**
   * regex-jinja-specific
   * Regular expression for detecting Python-specific Jinja code
   * Version: 1.0.1
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://codsen.com/os/regex-jinja-specific/
   */
  var main$2 = function main() {
    return /(set\s*[\w]+\s*=\s*namespace\()|({{['"][\w]+['"]\s+if)|(['"]%x?[+0]?[.>^<]?\d+[\w%]['"]\|format\()/gi;
  };

  function detectLang(str) {
    var name = null;

    if (typeof str !== "string") {
      throw new TypeError("detect-templating-language: [THROW_ID_01] Input must be string! It was given as ".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")."));
    }

    if (!str) {
      // early ending on empty string
      return {
        name: name
      };
    } // real action starts
    // ---------------------------------------------------------------------------


    if (main().test(str)) {
      name = "Nunjucks";

      if (main$2().test(str)) {
        name = "Jinja";
      }
    } else if (main$1().test(str)) {
      name = "JSP";
    }

    return {
      name: name
    };
  }

  return detectLang;

})));
