#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const lectrc = JSON.parse(fs.readFileSync("./packages/.lectrc.json"));

// LIST OVERRIDES
// ==============

const flagshipLibsList = ["email-comb", "html-crush"];
const webApps = {
  "email-comb": "emailcomb.com",
  "html-crush": "htmlcrush.com"
};
const rangeLibsList = [
  "ranges-push",
  "ranges-apply",
  "ranges-merge",
  "ranges-sort",
  "string-range-expander"
];
const objectLibsList = [
  "ast-monkey",
  "ast-monkey-traverse",
  "json-comb-core",
  "json-variables",
  "object-merge-advanced"
];
const stringLibsList = [
  "string-strip-html",
  "easy-replace",
  "str-indexes-of-plus",
  "bitbucket-slug",
  "detect-is-it-html-or-xhtml",
  "email-all-chars-within-ascii",
  "html-table-patcher",
  "js-row-num"
];
const cliAppsList = [];

// FUNCTIONS
// =========

function getNpm(name) {
  return `[![${name} on npm](https://img.shields.io/npm/v/${name}.svg?style=flat-square)](https://www.npmjs.com/package/${name})`;
}

function getDescr(name) {
  return JSON.parse(
    fs.readFileSync(path.resolve(`./packages/${name}/package.json`))
  ).description.replace(/_/gm, "\\_");
}

function bucket(lib) {
  return `[packages/${lib}](https://bitbucket.org/codsen/codsen/src/master/packages/${lib}/)`;
}

function urlize(something) {
  if (typeof something === "string" && !something.startsWith("http")) {
    return `[${something}](https://${something})`;
  }
  return something;
}

function row(lib, webApp) {
  return `| \`${lib}\` | ${getDescr(lib)} |${
    webApp ? ` ${urlize(webApps[lib])} |` : ""
  } ${getNpm(lib)} | ${bucket(lib)} |`;
}

function topRow(webapp) {
  return `| Library's name | Purpose |${
    webapp ? "Web app |" : ""
  } Link on npm | Source code in monorepo |
| -------------- | ------- |${
    webapp ? " ------- |" : ""
  } ----------- | ----------------------- |`;
}

// READ ALL LIBS
// =============

const allPackages = fs.readdirSync(path.resolve("packages")).filter(file => {
  return fs.statSync(path.join("packages/", file)).isDirectory();
});

// COMPILE LISTS
// =============

// we want to retain the order of libraries as listed in overrides above, so
// we can't use a simple array.filter

// -------------------------------------

const filteredCliAppsList = Array.from(cliAppsList).filter(lib =>
  allPackages.includes(lib)
);
allPackages.forEach(lib => {
  if (
    cliAppsList.length &&
    cliAppsList.includes(lib) &&
    !flagshipLibsList.includes(lib) &&
    !rangeLibsList.includes(lib) &&
    !stringLibsList.includes(lib) &&
    !objectLibsList.includes(lib) &&
    !filteredCliAppsList.includes(lib)
  ) {
    filteredCliAppsList.push(lib);
  }
});
allPackages.forEach(lib => {
  if (
    lib.endsWith("-cli") &&
    !flagshipLibsList.includes(lib) &&
    !rangeLibsList.includes(lib) &&
    !stringLibsList.includes(lib) &&
    !objectLibsList.includes(lib) &&
    !filteredCliAppsList.includes(lib)
  ) {
    filteredCliAppsList.push(lib);
  }
});

// -------------------------------------

const filteredRangeLibsList = Array.from(rangeLibsList).filter(lib =>
  allPackages.includes(lib)
);
allPackages.forEach(lib => {
  if (
    rangeLibsList.length &&
    rangeLibsList.includes(lib) &&
    !flagshipLibsList.includes(lib) &&
    !objectLibsList.includes(lib) &&
    !stringLibsList.includes(lib) &&
    !cliAppsList.includes(lib) &&
    !filteredRangeLibsList.includes(lib)
  ) {
    filteredRangeLibsList.push(lib);
  }
});
allPackages.forEach(lib => {
  if (
    lib.startsWith("ranges-") &&
    !flagshipLibsList.includes(lib) &&
    !objectLibsList.includes(lib) &&
    !stringLibsList.includes(lib) &&
    !cliAppsList.includes(lib) &&
    !filteredRangeLibsList.includes(lib)
  ) {
    filteredRangeLibsList.push(lib);
  }
});

// -------------------------------------

const filteredStringLibsList = Array.from(stringLibsList).filter(lib =>
  allPackages.includes(lib)
);
allPackages.forEach(lib => {
  if (
    stringLibsList.length &&
    stringLibsList.includes(lib) &&
    !flagshipLibsList.includes(lib) &&
    !rangeLibsList.includes(lib) &&
    !objectLibsList.includes(lib) &&
    !cliAppsList.includes(lib) &&
    !filteredStringLibsList.includes(lib)
  ) {
    filteredStringLibsList.push(lib);
  }
});
allPackages.forEach(lib => {
  if (
    (lib.startsWith("string-") ||
      lib.startsWith("str-") ||
      lib.startsWith("csv-")) &&
    !flagshipLibsList.includes(lib) &&
    !rangeLibsList.includes(lib) &&
    !objectLibsList.includes(lib) &&
    !cliAppsList.includes(lib) &&
    !filteredStringLibsList.includes(lib)
  ) {
    filteredStringLibsList.push(lib);
  }
});

// -------------------------------------

const filteredObjectLibsList = Array.from(objectLibsList).filter(lib =>
  allPackages.includes(lib)
);
allPackages.forEach(lib => {
  if (
    objectLibsList.length &&
    objectLibsList.includes(lib) &&
    !flagshipLibsList.includes(lib) &&
    !rangeLibsList.includes(lib) &&
    !stringLibsList.includes(lib) &&
    !cliAppsList.includes(lib) &&
    !filteredObjectLibsList.includes(lib)
  ) {
    filteredObjectLibsList.push(lib);
  }
});
allPackages.forEach(lib => {
  if (
    (lib.startsWith("object-") ||
      lib.startsWith("obj-") ||
      lib.startsWith("ast-")) &&
    !flagshipLibsList.includes(lib) &&
    !rangeLibsList.includes(lib) &&
    !stringLibsList.includes(lib) &&
    !cliAppsList.includes(lib) &&
    !filteredObjectLibsList.includes(lib)
  ) {
    filteredObjectLibsList.push(lib);
  }
});

// -------------------------------------

const filteredOtherLibsList = allPackages.filter(
  lib =>
    !flagshipLibsList.includes(lib) &&
    !filteredRangeLibsList.includes(lib) &&
    !filteredStringLibsList.includes(lib) &&
    !filteredObjectLibsList.includes(lib) &&
    !filteredCliAppsList.includes(lib)
);

// ASSEMBLE THE TEMPLATE
// =====================

const template = `# 📦 Codsen 📦

    A lerna monorepo for our ${allPackages.length} npm libraries

## 💡 Table of Contents

- [Flagship Libraries](#markdown-header-flagship-libraries)
- [Range Libraries](#markdown-header-range-libraries)
- [String Processing Libraries](#markdown-header-string-processing-libraries)
- [Object Processing Libraries](#markdown-header-object-processing-libraries)
- [CLI Apps](#markdown-header-cli-apps)
- [Miscellaneous Libraries](#markdown-header-miscellaneous-libraries)
- [Licence](#markdown-header-licence)

## 🚢 Flagship Libraries

These libraries are the largest and most complex of them all. Their web apps are driven by UMD builds, usually consumed straight from npm, via the [unpkg CDN](https://unpkg.com).

${topRow(true)}
${flagshipLibsList.map(lib => row(lib, true)).join("\n")}

There are quite a few small libraries, so let's group them by a common purpose.

## 🎯 ${filteredRangeLibsList.length} Range Libraries

> _Range_ means an array of two text character index numbers, "from" and "to" (plus optional third element, string, which marks "what to add").

For example, "from the third character to the fourth character" could be marked with array \`[3, 4]\`.

There can be a **third element** in a range array, what to add instead of the range. For example, \`[10, 12, "add this"]\`. When there is no third element in the range array, like \`[10, 12]\`, that would mean "delete from index 10 to index 12". Empty third element is the same as if it was missing.

For example, a range \`[1, 3]\` in a string "\`abcdef\`" would mean \`bc\` because "b" is at index number 1 (counting starts at zero) and 3rd is "d". The beginning of the range is inclusive, and the ending is not. Hence, the result "bc".

Another example, if you want to replace "\`<placeholder>\`" with "John" in a string "\`Hi <placeholder>!\`", the range would be \`[3, 16, "John"]\`.

Now, if you have **many ranges**, you put them into an array. You get _an array of ranges_. Majority of \`range-\` libraries process such arrays of ranges: sort bunch of ranges, fix overlapping ranges and so on.

Practically, we need ranges when we process strings and want to "keep a note" of what needs to be deleted or replaced later. The idea is, instead of processing the string many times:

    "find out what needs to be done with a string" ->
    "mutate the string" ->
    "find out what more needs to be done with a string" ->
    "mutate the mutated string" ->
    ... and so on,

We only "compile a to-do list" — [push the ranges](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-push/) into an array. When we finish gathering them, we **do all the actions in one go**.

Performing string processing only once is better for both **performance** reasons (fewer actions = faster) and for **consistency** (in-between taking the notes, we operate on the original string instead of its previously mutated version).

If you think, strings are immutable in JavaScript — each change of a string means rewriting it in a computer memory. Let's say you want to add a letter and delete the same letter in a string which consists of a thousand characters. Both actions cancel each other out. However, if you do the string edits sequentially, you write a thousand characters to memory two times, after every amend. On the other hand, if you use _ranges_ approach, you'd only [create a new record](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-push/) in the computer memory, housing a couple of arrays, each consisting of couple index numbers. When you [process the ranges](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply), they would cancel each other out, and we would not write anything to the memory at all. Now, if you scale this — longer strings, more amends, and done many times — you'll soon feel the difference in performance.

${topRow()}
${filteredRangeLibsList.map(lib => row(lib)).join("\n")}

## 🎻 ${filteredStringLibsList.length} String Processing Libraries

They process string inputs, which might be text, code or something else as long as it is of a string type.

${topRow()}
${filteredStringLibsList.map(lib => row(lib)).join("\n")}

## 🔮 ${filteredObjectLibsList.length} Object Processing Libraries

When we say "object" we mean _a plain object_ in JavaScript, for example, \`{ name: "Bob" }\`. Usually, plain objects come from JSON files, and often they are deeply nested. The following libraries help us to traverse them, set and delete keys and compare objects.

"\`ast-\`" in the library's name below just emphasises that it really works on nested objects (so-called Abstract Syntax Trees that come from parsed things).

${topRow()}
${filteredObjectLibsList.map(lib => row(lib)).join("\n")}

## ✂️ ${filteredCliAppsList.length} CLI Apps

All the following libraries are command line applications. You install them using \`-g\` flag, for example, \`npm i -g json-sort-cli\`.

You use them in the Terminal (command line), for example:

![CLI app](https://bitbucket.org/codsen/codsen/raw/dcd51a7a32ee052e41cfaca3d0cbe8e606337c82/packages/email-all-chars-within-ascii-cli/media/mov2.gif)

${topRow()}
${filteredCliAppsList.map(lib => row(lib)).join("\n")}

## 🛠️ ${filteredOtherLibsList.length} Miscellaneous Libraries

${topRow()}
${filteredOtherLibsList.map(lib => row(lib)).join("\n")}

## 🤝 Contributing
${lectrc.contributing.restofit}

## 💼 Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

`;

fs.writeFile(
  "readme.md",
  template
    .replace("Like String.trim()", "Like `String.trim()`")
    .replace("like \\_.includes", "like `_.includes`")
    .replace("like \\_.pullAll", "like `_.pullAll`")
    .replace("tried to use this package", "tried to use a package")
    .replace(
      "The npm script",
      "The npm script within each package's `package.json`"
    )
    .replace(
      /%ISSUELINK%/gm,
      "https://bitbucket.org/codsen/codsen/issues/new?title=put%20package%20name%20here-%20put%20issue%20title%20here"
    )
    .replace(/ - /gm, " — "),
  err => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`monorepo readme OK`}\u001b[${39}m`);
  }
);
