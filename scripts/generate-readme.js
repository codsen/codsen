#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const lectrc = JSON.parse(fs.readFileSync("./packages/.lectrc.json"));
const today = new Date();
const year = today.getFullYear();

// LIST OVERRIDES
// ==============

const flagshipLibsList = ["email-comb", "html-crush", "detergent"];
const webApps = {
  "email-comb": "emailcomb.com",
  "html-crush": "htmlcrush.com",
  detergent: "detergent.io",
};
const rangeLibsList = [
  "ranges-push",
  "ranges-apply",
  "ranges-merge",
  "ranges-sort",
  "string-range-expander",
];
const objectLibsList = [
  "ast-monkey",
  "ast-monkey-traverse",
  "ast-monkey-util",
  "json-comb-core",
  "json-variables",
  "object-merge-advanced",
];
const stringLibsList = [
  "edit-package-json",
  "easy-replace",
  "str-indexes-of-plus",
  "bitbucket-slug",
  "email-all-chars-within-ascii",
  "js-row-num",
];
const cliAppsList = [
  "json-comb",
  "update-versions",
  "lerna-clean-changelogs-cli",
  "lerna-link-dep",
  "lect",
];
const lernaLibsList = [
  "lerna-clean-changelogs-cli",
  "lerna-link-dep",
  "update-versions",
];
const htmlLibsList = [
  "emlint",
  "string-strip-html",
  "detect-is-it-html-or-xhtml",
  "html-table-patcher",
  "is-html-tag-opening",
  "is-language-code",
  "is-media-descriptor",
  "is-relative-uri",
];

// note for future self - use package.json "private" key instead:
const ignoreList = [];

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
  return `[packages/${lib}](https://gitlab.com/codsen/codsen/tree/master/packages/${lib}/)`;
}

function urlize(something) {
  if (typeof something === "string" && !something.startsWith("http")) {
    return `[${something}](https://${something})`;
  }
  return something;
}

function row(lib, webApp) {
  return `| [\`${lib}\`](https://gitlab.com/codsen/codsen/tree/master/packages/${lib}/) | ${getDescr(
    lib
  )} |${webApp ? ` ${urlize(webApps[lib])} |` : ""} ${getNpm(lib)} | ${bucket(
    lib
  )} |`;
}

function topRow(webapp) {
  return `| Library's name | Purpose |${
    webapp ? " Web app |" : ""
  } the_link_to_npm | Source code in monorepo |
| -------------- | ------- |${
    webapp ? " ------- |" : ""
  } ----------- | ----------------------- |`;
}

// READ ALL LIBS
// =============

const allPackages = fs
  .readdirSync(path.resolve("packages"))
  .filter(
    (packageName) =>
      typeof packageName === "string" &&
      packageName.length &&
      fs.statSync(path.join("packages", packageName)).isDirectory() &&
      fs.statSync(path.join("packages", packageName, "package.json")) &&
      !JSON.parse(
        fs.readFileSync(
          path.join("packages", packageName, "package.json"),
          "utf8"
        )
      ).private
  );

function noListsInclude(lib) {
  return [
    cliAppsList,
    flagshipLibsList,
    rangeLibsList,
    objectLibsList,
    htmlLibsList,
    stringLibsList,
    cliAppsList,
    lernaLibsList,
  ].every((arr2) => !arr2.includes(lib));
}

// COMPILE LISTS
// =============

// we want to retain the order of libraries as listed in overrides above, so
// we can't use a simple array.filter

// -------------------------------------

const filteredFlagshipAppsList = Array.from(flagshipLibsList).filter((lib) =>
  allPackages.includes(lib)
);

// -------------------------------------

const filteredCliAppsList = Array.from(cliAppsList)
  .filter((lib) => allPackages.includes(lib) && !flagshipLibsList.includes(lib))
  .concat(
    allPackages.filter((lib) => lib.endsWith("-cli") && noListsInclude(lib))
  );

// -------------------------------------

const filteredRangeLibsList = Array.from(rangeLibsList)
  .filter((lib) => allPackages.includes(lib) && !flagshipLibsList.includes(lib))
  .concat(
    allPackages.filter(
      (lib) => lib.startsWith("ranges-") && noListsInclude(lib)
    )
  );
// console.log(
//   `${`\u001b[${33}m${`filteredRangeLibsList`}\u001b[${39}m`} = ${JSON.stringify(
//     filteredRangeLibsList,
//     null,
//     4
//   )}`
// );

// -------------------------------------

const filteredHtmlLibsList = Array.from(htmlLibsList)
  .filter((lib) => allPackages.includes(lib) && !flagshipLibsList.includes(lib))
  .concat(
    allPackages.filter(
      (lib) =>
        (lib.startsWith("html-") || lib.startsWith("css-")) &&
        noListsInclude(lib)
    )
  );
// console.log(
//   `${`\u001b[${33}m${`filteredHtmlLibsList`}\u001b[${39}m`} = ${JSON.stringify(
//     filteredHtmlLibsList,
//     null,
//     4
//   )}`
// );

// -------------------------------------

const filteredStringLibsList = Array.from(stringLibsList)
  .filter((lib) => allPackages.includes(lib) && !flagshipLibsList.includes(lib))
  .concat(
    allPackages.filter(
      (lib) =>
        (lib.startsWith("string-") ||
          lib.startsWith("str-") ||
          lib.startsWith("csv-")) &&
        noListsInclude(lib)
    )
  );
// console.log(
//   `${`\u001b[${33}m${`filteredStringLibsList`}\u001b[${39}m`} = ${JSON.stringify(
//     filteredStringLibsList,
//     null,
//     4
//   )}`
// );

// -------------------------------------

const filteredObjectLibsList = Array.from(objectLibsList)
  .filter((lib) => allPackages.includes(lib) && !flagshipLibsList.includes(lib))
  .concat(
    allPackages.filter(
      (lib) =>
        (lib.startsWith("object-") ||
          lib.startsWith("obj-") ||
          lib.startsWith("ast-")) &&
        noListsInclude(lib)
    )
  );
// console.log(
//   `${`\u001b[${33}m${`filteredObjectLibsList`}\u001b[${39}m`} = ${JSON.stringify(
//     filteredObjectLibsList,
//     null,
//     4
//   )}`
// );

// -------------------------------------

const filteredLernaLibsList = Array.from(lernaLibsList)
  .filter((lib) => allPackages.includes(lib) && !flagshipLibsList.includes(lib))
  .concat(
    allPackages.filter(
      (lib) =>
        lib.startsWith("lerna-") &&
        noListsInclude(lib) &&
        lib !== "lerna-clean-changelogs"
    )
  );
// console.log(
//   `${`\u001b[${33}m${`filteredLernaLibsList`}\u001b[${39}m`} = ${JSON.stringify(
//     filteredLernaLibsList,
//     null,
//     4
//   )}`
// );

// -------------------------------------

const filteredOtherLibsList = allPackages.filter(
  (lib) =>
    !flagshipLibsList.includes(lib) &&
    !filteredCliAppsList.includes(lib) &&
    !filteredRangeLibsList.includes(lib) &&
    !filteredStringLibsList.includes(lib) &&
    !filteredObjectLibsList.includes(lib) &&
    !filteredLernaLibsList.includes(lib)
);

// ASSEMBLE THE TEMPLATE
// =====================

const template = `# Codsen

    A lerna monorepo for our ${
      allPackages.length - ignoreList.length
    } npm libraries 📦📦📦

The aim of Codsen is to help people.

Use these programs, profit from them, use them as ingredients to make even greater projects.

🍻

## 💡 Table of Contents

- [Flagship Libraries](#-flagship-libraries)
- [Range Libraries](#-range-libraries)
- [HTML Processing Libraries](#-html-processing-libraries)
- [String Processing Libraries](#-string-processing-libraries)
- [Object Processing Libraries](#-object-processing-libraries)
- [Lerna Libraries](#-lerna-libraries)
- [CLI Apps](#%EF%B8%8F-cli-apps)
- [Miscellaneous Libraries](#%EF%B8%8F-miscellaneous-libraries)
- [Contributing](#-contributing)
- [Licence](#-licence)

**[⬆ back to top](#codsen)**

## 🚢 Flagship Libraries

${topRow(true)}
${filteredFlagshipAppsList.map((lib) => row(lib, true)).join("\n")}

Let's group all others by their purpose.

**[⬆ back to top](#codsen)**

## 🎯 Range Libraries

${filteredRangeLibsList.length} in total.

> _Range_ means an array of two text character index numbers, "from" and "to" (plus optional third element, string, which marks "what to add").

For example, "from the third character to the fourth character" could be marked with array \`[3, 4]\`.

There can be a **third element** in a range array, what to add instead of the range. For example, \`[10, 12, "add this"]\`. When there is no third element in the range array, like \`[10, 12]\`, that would mean "delete from index 10 to index 12". Empty third element is the same as if it was missing.

For example, a range \`[1, 3]\` in a string "\`abcdef\`" would mean \`bc\` because "b" is at index number 1 (counting starts at zero) and 3rd is "d". The beginning of the range is inclusive, and the ending is not. Hence, the result "bc".

Another example, if you want to replace "\`{placeholder}\`" with "John" in a string "\`Hi {placeholder}!\`"^, the range would be \`[3, 16, "John"]\`.

Now, if you have **many ranges**, you put them into an array. You get _an array of ranges_. Majority of \`range-\` libraries process such arrays of ranges: sort bunch of ranges, fix overlapping ranges and so on.

Practically, we need ranges when we process strings and want to "keep a note" of what needs to be deleted or replaced later. The idea is, instead of processing the string many times:

    "find out what needs to be done with a string" ->
    "mutate the string" ->
    "find out what more needs to be done with a string" ->
    "mutate the mutated string" ->
    ... and so on,

We only "compile a to-do list" — [push the ranges](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/) into an array. When we finish gathering them, we **do all the actions in one go**.

Performing string processing only once is better for both **performance** reasons (fewer actions = faster) and for **consistency** (in-between taking the notes, we operate on the original string instead of its previously mutated version).

If you think, strings are immutable in JavaScript — each change of a string means rewriting it in a computer memory. Let's say you want to add a letter and delete the same letter in a string which consists of a thousand characters. Both actions cancel each other out. However, if you do the string edits sequentially, you write a thousand characters to memory two times, after every amend. On the other hand, if you use _ranges_ approach, you'd only [create a new record](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/) in the computer memory, housing a couple of arrays, each consisting of couple index numbers. When you [process the ranges](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply), they would cancel each other out, and we would not write anything to the memory at all. Now, if you scale this — longer strings, more amends, and done many times — you'll soon feel the difference in performance.

${topRow()}
${filteredRangeLibsList.map((lib) => row(lib)).join("\n")}

**[⬆ back to top](#codsen)**

## 💰 HTML Processing Libraries

${filteredHtmlLibsList.length} in total.

They all process HTML and CSS. Except for \`html-table-patcher\`, all of them process HTML as a string, without parsing. Heck, we even had \`html-table-patcher\` done in non-parsing style on earlier versions but just because of time shortage went the parsing-way.

The whole idea is, if you don't parse the HTML, you can support broken or mixed code. Unless you write your parser, it becomes a bottleneck — parser throws here and there, and you can do nothing about it.

It is vital to support _broken code_ because this allows us to make broken code fixing programs.

It is equally vital to support _mixed code_ because both web page and email template HTML can contain anything from templating languages to programming languages. For example, Wordpress website has some HTML within PHP files. Another example, email templates are coded in Nunjucks templating language and \`.nunjucks\` files are HTML sprinkled with their templating literals. If tooling supports HTML mixed with _other things_, we will be able to process that HTML and skip those _other things_.

${topRow()}
${filteredHtmlLibsList.map((lib) => row(lib)).join("\n")}

**[⬆ back to top](#codsen)**

## 🎻 String Processing Libraries

${filteredStringLibsList.length} in total.

They process string inputs, which might be text, code or something else as long as it is of a string type.

${topRow()}
${filteredStringLibsList.map((lib) => row(lib)).join("\n")}

**[⬆ back to top](#codsen)**

## 🔮 Object Processing Libraries

${filteredObjectLibsList.length} in total.

When we say "object" we mean _a plain object_ in JavaScript, for example, \`{ name: "Bob" }\`. Usually, plain objects come from JSON files, and often they are deeply nested. The following libraries help us to traverse them, set and delete keys and compare objects.

"\`ast-\`" in the library's name below just emphasises that it really works on nested objects (so-called Abstract Syntax Trees that come from parsed things).

${topRow()}
${filteredObjectLibsList.map((lib) => row(lib)).join("\n")}

**[⬆ back to top](#codsen)**

## 🐉 Lerna Libraries

${filteredLernaLibsList.length} in total.

While maintaining this very monorepo we found that some essential tools were missing, so we created them!

If you also use Lerna monorepos, check these out:

${topRow()}
${filteredLernaLibsList.map((lib) => row(lib)).join("\n")}

**[⬆ back to top](#codsen)**

## ✂️ CLI Apps

${filteredCliAppsList.length} in total.

All the following libraries are command line applications. You install them using \`-g\` flag, for example, \`npm i -g json-sort-cli\`.

You use them in the Terminal (command line), for example:

![CLI app](packages/email-all-chars-within-ascii-cli/media/mov2.gif)

${topRow()}
${filteredCliAppsList.map((lib) => row(lib)).join("\n")}

**[⬆ back to top](#codsen)**

## 🛠️ Miscellaneous Libraries

${filteredOtherLibsList.length} in total.

${topRow()}
${filteredOtherLibsList.map((lib) => row(lib)).join("\n")}

**[⬆ back to top](#codsen)**

## 🤝 Contributing
${lectrc.contributing.restofit}

**[⬆ back to top](#codsen)**

## 💼 Licence

MIT License

Copyright (c) 2015-${year} Roy Revelt and other contributors

**[⬆ back to top](#codsen)**
`;

fs.writeFile(
  "README.md",
  template
    .replace("Like String.trim()", "Like `String.trim()`")
    .replace("like \\_.includes", "like `_.includes`")
    .replace("like \\_.pullAll", "like `_.pullAll`")
    .replace("tried to use this package", "tried to use a package")
    .replace(/the_link_to_npm/g, "The&nbsp;link&nbsp;to&nbsp;npm")
    .replace(
      "The npm script",
      "The npm script within each package's `package.json`"
    )
    .replace(
      /%ISSUELINK%/gm,
      "https://gitlab.com/codsen/codsen/issues/new?title=put%20package%20name%20here%20-%20put%20issue%20title%20here"
    )
    .replace(/ - /gm, " — "),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`monorepo readme OK`}\u001b[${39}m`);
  }
);
