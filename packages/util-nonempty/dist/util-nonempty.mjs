/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 2.10.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

import r from"lodash.isplainobject";var t="2.10.0";function e(t){return null!=t&&(Array.isArray(t)||"string"==typeof t?!!t.length:r(t)?!!Object.keys(t).length:"number"==typeof t)}export{e as nonEmpty,t as version};
