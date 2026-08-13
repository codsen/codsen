function compareRankedDependencies(
  [leftName, leftCount],
  [rightName, rightCount],
) {
  if (leftCount !== rightCount) {
    return rightCount - leftCount;
  }
  if (leftName < rightName) {
    return -1;
  }
  if (leftName > rightName) {
    return 1;
  }
  return 0;
}

function topDependencies(dependencies, includeDependency, limit = 10) {
  return Object.entries(dependencies)
    .filter(([name]) => includeDependency(name))
    .sort(compareRankedDependencies)
    .slice(0, limit)
    .map(([name, count]) => ({ [name]: count }));
}

export { topDependencies };
