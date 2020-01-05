import rangesApply from "ranges-apply";

function applyFixes(str, messages, offset = 0) {
  if (!Array.isArray(messages) || !messages.length) {
    return str;
  }
  // So there are ranges. Let's rather all the ranges from all the
  // objects in "messages"
  return rangesApply(
    str,
    messages.reduce((acc, curr) => {
      if (curr.fix && Array.isArray(curr.fix.ranges)) {
        // ranges will come as they will be served to
        // the outside consumers - with indexes offset
        // (offset number added) - so we need to subtract
        const minusOffset = curr.fix.ranges.map(([from, to, toAdd]) => [
          from - offset,
          to - offset,
          toAdd
        ]);
        return acc.concat(minusOffset);
      }
      // else - just return what's been gathered, same as do nothing
      return acc;
    }, [])
  );
}

export { applyFixes };
