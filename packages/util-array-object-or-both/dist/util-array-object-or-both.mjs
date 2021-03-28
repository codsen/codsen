/**
 * util-array-object-or-both
 * Validate and normalise user choice: array, object or both?
 * Version: 3.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-array-object-or-both/
 */

import e from"lodash.includes";function a(a,r){const t={msg:"",optsVarName:"given variable",...r};if(t&&t.msg&&t.msg.length>0&&(t.msg=`${t.msg.trim()} `),"given variable"!==t.optsVarName&&(t.optsVarName=`variable "${t.optsVarName}"`),e(["object","objects","obj","ob","o"],a.toLowerCase().trim()))return"object";if(e(["array","arrays","arr","aray","arr","a"],a.toLowerCase().trim()))return"array";if(e(["any","all","everything","both","either","each","whatever","whatevs","e"],a.toLowerCase().trim()))return"any";throw new TypeError(`${t.msg}The ${t.optsVarName} was customised to an unrecognised value: ${a}. Please check it against the API documentation.`)}export{a as arrObjOrBoth};
