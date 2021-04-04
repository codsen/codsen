/**
 * @name arrayiffy-if-string
 * @fileoverview Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * @version 3.13.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/arrayiffy-if-string/}
 */

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
