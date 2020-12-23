/**
 * array-pull-all-with-glob
 * PullAllWithGlob - like _.pullAll but pulling stronger, with globs
 * Version: 4.13.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-pull-all-with-glob/
 */

import r from"matcher";var e="4.13.0";function t(e,t,i){if(!e.length)return[];if(!e.length||!t.length)return Array.from(e);const n="string"==typeof t?[t]:Array.from(t),o={caseSensitive:!0,...i};return Array.from(e).filter((e=>!n.some((t=>r.isMatch(e,t,{caseSensitive:o.caseSensitive})))))}export{t as pull,e as version};
