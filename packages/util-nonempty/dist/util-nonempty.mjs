/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 3.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

import r from"lodash.isplainobject";const t="3.0.4";function e(t){return null!=t&&(Array.isArray(t)||"string"==typeof t?!!t.length:r(t)?!!Object.keys(t).length:"number"==typeof t)}export{e as nonEmpty,t as version};
