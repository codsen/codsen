/**
 * bitbucket-slug
 * Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/bitbucket-slug/
 */

import e from"lodash.deburr";function r(r){return"string"!=typeof r?"":`markdown-header-${e(r).replace(/\]\((.*?)\)/g,"").replace(/ [-]+ /gi," ").replace(/[^\w\d\s-]/g,"").replace(/\s+/g," ").toLowerCase().trim().replace(/ /g,"-")}`}export{r as bSlug};
