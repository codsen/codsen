/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 3.0.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

import t from"lodash.isplainobject";const r="3.0.7";function e(r){return null!=r&&(Array.isArray(r)||"string"==typeof r?!!r.length:t(r)?!!Object.keys(r).length:"number"==typeof r)}export{e as nonEmpty,r as version};
