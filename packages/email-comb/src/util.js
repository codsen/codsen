// The function below adapted from:
// MIT License (MIT) Copyright © 2014 Caleb Brewer
// https://github.com/cazzer/gulp-selectors/blob/master/lib/utils/generate-shortname.js
function generateShortname(seed) {
  const library = "abcdefghijklmnopqrstuvwxyz";
  const libraryLength = 26; // not library.length but static, for perf reasons
  let prefix = "";
  //break the seed down if it is larger than the library
  if (seed >= libraryLength) {
    prefix = generateShortname(Math.floor(seed / libraryLength) - 1);
  }
  //return the prefixed shortname
  return prefix + library[seed % libraryLength];
}

export { generateShortname };
