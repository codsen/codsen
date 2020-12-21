/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.12.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

// If a string is given, put it into an array. Bypass everything else.
function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length > 0) {
      return [something];
    }

    return [];
  }

  return something;
}

export { arrayiffy };
