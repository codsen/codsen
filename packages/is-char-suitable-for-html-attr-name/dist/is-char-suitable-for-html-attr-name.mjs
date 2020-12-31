/**
 * is-char-suitable-for-html-attr-name
 * Is given character suitable to be in an HTML attribute's name?
 * Version: 1.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-char-suitable-for-html-attr-name/
 */

function t(t){return"string"==typeof t&&(t.charCodeAt(0)>96&&123>t.charCodeAt(0)||t.charCodeAt(0)>64&&91>t.charCodeAt(0)||t.charCodeAt(0)>47&&58>t.charCodeAt(0)||":"===t||"-"===t)}export{t as isAttrNameChar};
