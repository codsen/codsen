function generateShortname(seed) {
  const library = "abcdefghijklmnopqrstuvwxyz";
  const libraryLength = 26;
  let prefix = "";
  if (seed >= libraryLength) {
    prefix = generateShortname(Math.floor(seed / libraryLength) - 1);
  }
  return prefix + library[seed % libraryLength];
}

export { generateShortname };
