// Set the title case using `title` package

// This program will not touch any single tags (<br class="z"/> for example)
// or in case of paired tags, paired tags and content between

import { strict as assert } from "assert";
import title from "title";

import { rInvert } from "../../ranges-invert/dist/ranges-invert.esm.js";
import { rApply } from "../../ranges-apply/dist/ranges-apply.esm.js";
import { rRegex } from "../../ranges-regex/dist/ranges-regex.esm.js";
import { stripHtml } from "../dist/string-strip-html.esm.js";

function tagAwareTitle(str) {
  let whitelist = ["eslint", "readme", "npm"];
  let { filteredTagLocations } = stripHtml(str, {
    stripTogetherWithTheirContents: ["*"],
  });
  let inverted = rInvert(
    filteredTagLocations.concat(
      whitelist.reduce((acc, curr) => {
        let rangesFindings = rRegex(new RegExp(curr, "gi"), str);
        if (rangesFindings) {
          return acc.concat(rangesFindings);
        }
        return acc;
      }, [])
    ),
    str.length
  );

  if (Array.isArray(inverted) && inverted.length) {
    // take inverted ranges, for example, [[3, 4], [10, 15]]
    // and add third element, replacement, which is same character
    // indexes only processed through "title":
    return rApply(
      str,
      inverted.map(([from, to]) => [from, to, title(str.slice(from, to))])
    );
  }
  // otherwise, just apply title() on the whole string:
  return title(str);
}

// middle:
assert.equal(
  tagAwareTitle(`This is a title with some <code>code</code> in it`),
  `This Is a Title with Some <code>code</code> In It`
);

// leading:
assert.equal(
  tagAwareTitle(`<span class="xyz">abc</span> defgh ESLint`),
  `<span class="xyz">abc</span> Defgh ESLint`
);
