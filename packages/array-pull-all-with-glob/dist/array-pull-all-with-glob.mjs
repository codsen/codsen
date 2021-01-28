/**
 * array-pull-all-with-glob
 * Like _.pullAll but with globs (wildcards)
 * Version: 5.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-pull-all-with-glob/
 */

import r from"matcher";const e="5.0.1";function t(e,t,n){if(!e.length)return[];if(!e.length||!t.length)return Array.from(e);const i="string"==typeof t?[t]:Array.from(t),s={caseSensitive:!0,...n};return Array.from(e).filter((e=>!i.some((t=>r.isMatch(e,t,{caseSensitive:s.caseSensitive})))))}export{t as pull,e as version};
