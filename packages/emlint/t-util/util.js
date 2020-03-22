import rangesApply from "ranges-apply";

function applyFixes(str, messages) {
  if (!Array.isArray(messages) || !messages.length) {
    return str;
  }
  // So there are ranges. Let's gather all the ranges from all the
  // objects in "messages"
  return rangesApply(
    str,
    messages.reduce((acc, curr) => {
      if (curr.fix && Array.isArray(curr.fix.ranges)) {
        return acc.concat(curr.fix.ranges);
      }
      // just return what's been gathered, same as do nothing
      return acc;
    }, [])
  );
}

export { applyFixes };
