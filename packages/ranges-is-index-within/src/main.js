const isArr = Array.isArray;

function rangesIsIndexWithin(originalIndex, rangesArr, originalOpts) {
  const defaults = {
    inclusiveRangeEnds: false,
    returnMatchedRangeInsteadOfTrue: false,
  };

  const opts = Object.assign(Object.assign({}, defaults), originalOpts);
  if (!isArr(rangesArr)) {
    return false;
  }

  if (opts.returnMatchedRangeInsteadOfTrue) {
    return (
      rangesArr.find((arr) =>
        opts.inclusiveRangeEnds
          ? originalIndex >= arr[0] && originalIndex <= arr[1]
          : originalIndex > arr[0] && originalIndex < arr[1]
      ) || false
    );
  }
  return rangesArr.some((arr) =>
    opts.inclusiveRangeEnds
      ? originalIndex >= arr[0] && originalIndex <= arr[1]
      : originalIndex > arr[0] && originalIndex < arr[1]
  );
}

export default rangesIsIndexWithin;
