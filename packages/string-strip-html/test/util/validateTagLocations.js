function validateTagLocations(t, str, tagLocations = []) {
  tagLocations.forEach(([from, to]) => {
    // check, does each tag location start and end on a bracket
    t.is(str[from], "<");
    t.is(str[to - 1], ">");
  });
}

export default validateTagLocations;
