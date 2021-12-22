function validateTagLocations(is, str, tagLocations = []) {
  tagLocations.forEach(([from, to]) => {
    // check, does each tag location start and end on a bracket
    is(str[from], "<");
    is(str[to - 1], ">");
  });
}

export default validateTagLocations;
