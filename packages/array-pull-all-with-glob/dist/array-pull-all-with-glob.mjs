/**
 * array-pull-all-with-glob
 * Like _.pullAll but with globs (wildcards)
 * Version: 5.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-pull-all-with-glob/
 */

import r from"matcher";const e="5.0.12";function t(e,t,n){if(!e.length)return[];if(!e.length||!t.length)return Array.from(e);const i="string"==typeof t?[t]:Array.from(t),o={caseSensitive:!0,...n};return Array.from(e).filter((e=>!i.some((t=>r.isMatch(e,t,{caseSensitive:o.caseSensitive})))))}export{t as pull,e as version};
