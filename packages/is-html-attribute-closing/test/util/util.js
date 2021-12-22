function generateVariations(parts, n) {
  let arr = [];
  while (n--) {
    arr.push(parts);
  }
  let result = arr.reduce((acc1, val1) =>
    acc1.reduce(
      (acc2, val2) => acc2.concat(val1.map((val) => [].concat(val2, val))),
      []
    )
  );
  return result;
}

// extracts quotes and generates all variations of them
function combinations(str = "", quotesRef = `'"`) {
  let arr = str.trim().split(new RegExp(quotesRef.split("").join("|")));
  return generateVariations(quotesRef.split(""), arr.length - 1).map(
    (quotesArr) => {
      return arr.reduce(
        (acc, curr, idx) => `${acc}${curr}${quotesArr[idx] || ""}`,
        ""
      );
    }
  );
}

export { generateVariations, combinations };
