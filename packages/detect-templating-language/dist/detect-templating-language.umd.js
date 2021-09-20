/**
 * @name detect-templating-language
 * @fileoverview Detects various templating languages present in string
 * @version 3.0.2
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/detect-templating-language/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).detectTemplatingLanguage={})}(this,(function(e){"use strict";
/**
 * @name regex-is-jinja-nunjucks
 * @fileoverview Regular expression for detecting Jinja or Nunjucks code
 * @version 3.0.2
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-is-jinja-nunjucks/}
 */e.detectLang=function(e){let t=null;if("string"!=typeof e)throw new TypeError(`detect-templating-language: [THROW_ID_01] Input must be string! It was given as ${JSON.stringify(e,null,4)} (type ${typeof e}).`);return e?(/{%|{{|%}|}}/gi.test(e)?(t="Nunjucks",/(set\s*[\w]+\s*=\s*namespace\()|({{['"][\w]+['"]\s+if)|(['"]%x?[+0]?[.>^<]?\d+[\w%]['"]\|format\()/gi.test(e)&&(t="Jinja")):/<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi.test(e)&&(t="JSP"),{name:t}):{name:t}},e.version="3.0.2",Object.defineProperty(e,"__esModule",{value:!0})}));
