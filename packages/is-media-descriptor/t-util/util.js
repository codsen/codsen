import fs from "fs";
import { rApply } from "ranges-apply";

function applyFixes(str, messages, offset = 0) {
  if (!Array.isArray(messages) || !messages.length) {
    return str;
  }
  // So there are ranges. Let's rather all the ranges from all the
  // objects in "messages"
  return rApply(
    str,
    messages.reduce((acc, curr) => {
      if (curr.fix && Array.isArray(curr.fix.ranges)) {
        // ranges will come as they will be served to
        // the outside consumers - with indexes offset
        // (offset number added) - so we need to subtract
        const minusOffset = curr.fix.ranges.map(([from, to, toAdd]) => [
          from - offset,
          to - offset,
          toAdd,
        ]);
        return acc.concat(minusOffset);
      }
      // else - just return what's been gathered, same as do nothing
      return acc;
    }, [])
  );
}

// -----------------------------------------------------------------------------

function writeSample(settingsObj) {
  const linkSample = (query, id) => `<!DOCTYPE html>
<html>
<head>
	<title>${id} link bad</title>
	<link rel="stylesheet" href="_red.css">
	<link media="${query}" rel="stylesheet" href="_green.css">
</head>
<body>
	<div class="container">
		if media queries work, background will be green
	</div>
</body>
</html>`;

  const mediaSample = (query, id) => `<!DOCTYPE html>
<html>
<head>
	<title>${id} media bad</title>
	<style type="text/css">
		.container {
			background-color: red;
		}
		@media ${query} {
			.container {
				background-color: green;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		if media queries work, background will be green
	</div>
</body>
</html>`;

  fs.writeFileSync(
    `test/samples/${settingsObj.id}_link_bad.html`,
    linkSample(settingsObj.str, settingsObj.id)
  );
  fs.writeFileSync(
    `test/samples/${settingsObj.id}_media_bad.html`,
    mediaSample(settingsObj.str, settingsObj.id)
  );
  if (settingsObj.fixed) {
    fs.writeFileSync(
      `test/samples/${settingsObj.id}_link_good.html`,
      linkSample(settingsObj.fixed, settingsObj.id)
    );
    fs.writeFileSync(
      `test/samples/${settingsObj.id}_media_good.html`,
      mediaSample(settingsObj.fixed, settingsObj.id)
    );
  }
}

// -----------------------------------------------------------------------------

export { applyFixes, writeSample };
