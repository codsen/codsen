/**
 * object-all-values-equal-to
 * Does the AST/nested-plain-object/array/whatever contain only one kind of value?
 * Version: 1.9.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-all-values-equal-to/
 */

import e from"lodash.isplainobject";import r from"lodash.isequal";var t="1.9.1";function o(t,n,i){if(Array.isArray(t)){if(0===t.length)return!0;if(i.arraysMustNotContainPlaceholders&&t.length>0&&t.some((e=>r(e,n))))return!1;for(let e=t.length;e--;)if(!o(t[e],n,i))return!1;return!0}if(e(t)){const e=Object.keys(t);if(0===e.length)return!0;for(let r=e.length;r--;)if(!o(t[e[r]],n,i))return!1;return!0}return r(t,n)}function n(r,t,n){if(void 0===r)throw Error("object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument.");if(void 0===t)throw Error("object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument.");if(n&&!e(n))throw Error(`object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ${typeof n}, equal to:\n${JSON.stringify(n,null,4)}`);return o(r,t,{arraysMustNotContainPlaceholders:!0,...n})}export{n as allEq,t as version};
