/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.13.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length) {
      return [something];
    }

    return [];
  }

  return something;
}

export { arrayiffy };
