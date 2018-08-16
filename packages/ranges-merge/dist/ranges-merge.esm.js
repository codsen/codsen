import sortRanges from 'ranges-sort';
import clone from 'lodash.clonedeep';

function mergeRanges(arrOfRanges) {
  if (!Array.isArray(arrOfRanges)) {
    return arrOfRanges;
  }
  const sortedRanges = sortRanges(
    clone(arrOfRanges).filter(
      rangeArr => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]
    )
  );
  for (let i = sortedRanges.length - 1; i > 0; i--) {
    if (
      sortedRanges[i][0] <= sortedRanges[i - 1][0] ||
      sortedRanges[i][0] <= sortedRanges[i - 1][1]
    ) {
      sortedRanges[i - 1][0] = Math.min(
        sortedRanges[i][0],
        sortedRanges[i - 1][0]
      );
      sortedRanges[i - 1][1] = Math.max(
        sortedRanges[i][1],
        sortedRanges[i - 1][1]
      );
      if (
        sortedRanges[i][2] !== undefined &&
        (sortedRanges[i - 1][0] >= sortedRanges[i][0] ||
          sortedRanges[i - 1][1] <= sortedRanges[i][1])
      ) {
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] !== undefined) {
            sortedRanges[i - 1][2] += sortedRanges[i][2];
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      }
      sortedRanges.splice(i, 1);
      i = sortedRanges.length;
    }
  }
  return sortedRanges;
}

export default mergeRanges;
