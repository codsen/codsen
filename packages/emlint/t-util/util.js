import { Linter } from "../dist/emlint.esm";
import { rApply } from "ranges-apply";

function applyFixes(str, messages) {
  if (!Array.isArray(messages) || !messages.length) {
    return str;
  }
  // So there are ranges. Let's gather all the ranges from all the
  // objects in "messages"
  return rApply(
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

function verify(t, str, opts) {
  const linter = new Linter();
  if (!t.runOnly) {
    // 1. ensure given string does not throw on "all"
    // setting - this is an automated check, a supplement
    t.doesNotThrow(() => {
      linter.verify(str, {
        rules: {
          all: 2,
        },
      });
    });
  }

  return linter.verify(str, opts);
}

export { applyFixes, verify };
