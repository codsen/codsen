/**
 * object-all-values-equal-to
 * Does the AST/nested-plain-object/array/whatever contain only one kind of value?
 * Version: 2.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-all-values-equal-to/
 */

import e from"lodash.isplainobject";import t from"lodash.isequal";const r="2.0.1";function n(r,o,i){if(Array.isArray(r)){if(0===r.length)return!0;if(i.arraysMustNotContainPlaceholders&&r.length>0&&r.some((e=>t(e,o))))return!1;for(let e=r.length;e--;)if(!n(r[e],o,i))return!1;return!0}if(e(r)){const e=Object.keys(r);if(0===e.length)return!0;for(let t=e.length;t--;)if(!n(r[e[t]],o,i))return!1;return!0}return t(r,o)}function o(t,r,o){if(void 0===t)throw new Error("object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument.");if(void 0===r)throw new Error("object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument.");if(o&&!e(o))throw new Error(`object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ${typeof o}, equal to:\n${JSON.stringify(o,null,4)}`);return n(t,r,{arraysMustNotContainPlaceholders:!0,...o})}export{o as allEq,r as version};
