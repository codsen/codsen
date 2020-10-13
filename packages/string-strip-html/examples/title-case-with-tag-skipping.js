/* eslint import/extensions:0, import/no-extraneous-dependencies:0 */

// Set the title case using `title` package
// https://www.npmjs.com/package/title

// This program will not touch any single tags (<br class="z"/> for example)
// or in case of paired tags, paired tags and content between

import { strict as assert } from "assert";
import title from "title";
import invertRanges from "../../ranges-invert";
import applyRanges from "../../ranges-apply";
import stripHtml from "../dist/string-strip-html.esm.js";

const rangesRegex = require("../../ranges-regex");

function tagAwareTitle(str) {
  const whitelist = ["eslint", "readme", "npm"];
  const { filteredTagLocations } = stripHtml(str, {
    stripTogetherWithTheirContents: ["*"],
  });
  // console.log(
  //   `020 tagAwareTitle(): ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} = ${JSON.stringify(
  //     filteredTagLocations,
  //     null,
  //     4
  //   )}`
  // );
  const inverted = invertRanges(
    filteredTagLocations.concat(
      whitelist.reduce((acc, curr) => {
        const rangesFindings = rangesRegex(new RegExp(curr, "gi"), str);
        if (rangesFindings) {
          return acc.concat(rangesFindings);
        }
        return acc;
      }, [])
    ),
    str.length
  );
  // console.log(
  //   `028 tagAwareTitle(): ${`\u001b[${33}m${`inverted`}\u001b[${39}m`} = ${JSON.stringify(
  //     inverted,
  //     null,
  //     4
  //   )}`
  // );

  if (Array.isArray(inverted) && inverted.length) {
    // take inverted ranges, for example, [[3, 4], [10, 15]]
    // and add third element, replacement, which is same character
    // indexes only processed through "title":
    return applyRanges(
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
  tagAwareTitle(`<span class="xyz">abc<span> defgh ESLint`),
  `<span class="xyz">abc<span> Defgh ESLint`
);
