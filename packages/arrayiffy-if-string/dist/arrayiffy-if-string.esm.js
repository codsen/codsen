/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.11.28
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/arrayiffy-if-string
 */

function arrayiffyString(something) {
  if (typeof something === "string") {
    if (something.length > 0) {
      return [something];
    }
    return [];
  }
  return something;
}

export default arrayiffyString;
