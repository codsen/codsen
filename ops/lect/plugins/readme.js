import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";
import arrayiffy from "../../helpers/arrayiffy.js";
import { esmBump } from "@codsen/data";

const hasPlayground = [
  "string-strip-html",
  "email-comb",
  "html-crush",
  "detergent",
  "is-language-code",
  "rehype-responsive-tables",
];

const separateNonESMPackages = {
  "tsd-extract": "tsd-extract-noesm",
};

async function readme({ state, quickTakeExample, lectrc }) {
  let badge1 = `<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center">`;

  let badge2 = `<img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center">`;

  let badge3 = `<img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">`;

  let esmNotice = `This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).${
    typeof esmBump === "object" && esmBump[state.pack.name]
      ? ` If you're not ready yet, install an older version of this program, ${
          esmBump[state.pack.name]
        } (\`npm i ${state.pack.name}@${esmBump[state.pack.name]}\`).`
      : ""
  }${
    separateNonESMPackages[state.pack.name]
      ? ` If you're not ready yet, use a non-ESM alternative, [${
          separateNonESMPackages[state.pack.name]
        }](https://www.npmjs.com/package/${
          separateNonESMPackages[state.pack.name]
        }).`
      : ""
  }`;

  // start setting up the final readme's string:
  let content = `# ${state.pack.name}

> ${state.pack.description}

<div class="package-badges">
  <a href="https://www.npmjs.com/package/${
    state.pack.name
  }" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/${
    state.pack.name
  }" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/${
    state.pack.name
  }" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/${
    state.pack.name
  }?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/${
      state.pack.name
    }.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
  <a href="https://liberamanifesto.com" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/libera-manifesto-lightgrey.svg?style=flat-square" alt="libera manifesto">
  </a>
</div>

## Install${state.pack?.exports ? `\n\n${esmNotice}` : ""}

\`\`\`bash
npm i${!state.isRollup && state.isBin ? " -g" : ""} ${state.pack.name}
\`\`\`${
    !state.isRollup && state.pack.bin
      ? `\n\nThen, call it from the command line using ${
          state.pack.bin && Object.keys(state.pack.bin).length > 1
            ? "one of the following keywords"
            : "keyword"
        }:

\`\`\`bash
${Object.keys(state.pack.bin).join("\n")}
\`\`\`
`
      : ""
  }${
    quickTakeExample
      ? `\n\n## Quick Take

\`\`\`js
${quickTakeExample}
\`\`\`\n\n`
      : ""
  }
## Documentation

Please [visit codsen.com](https://codsen.com/os/${
    state.pack.name
  }/) for a full description of the API.${
    hasPlayground.includes(state.pack.name)
      ? ` Also, try the [GUI playground](https://codsen.com/os/${state.pack.name}/play).`
      : ""
  }

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

`;

  // licence module
  let licenceExtras = objectPath.get(state.pack, "lect.licence.extras");

  content += `${
    lectrc.licence.header.length > 0 ? `${lectrc.licence.header}` : ""
  }`;
  content += `${
    lectrc.licence.restofit.length > 0 ? `\n\n${lectrc.licence.restofit}` : ""
  }`;

  if (
    licenceExtras &&
    Array.isArray(licenceExtras) &&
    (licenceExtras.length > 1 ||
      (typeof licenceExtras[0] === "string" && licenceExtras[0].trim().length))
  ) {
    content += `\n\n${arrayiffy(licenceExtras)
      .filter((singleExtra) => singleExtra.length > 0)
      .join("\n")}`;
  }

  content = content.replace(/%YEAR%/, String(new Date().getFullYear()));

  content += `\n\n${badge1} ${badge2} ${badge3}\n`;

  try {
    await writeFileAtomic("README.md", content);
    // console.log(`lect README.md ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write README.md - ${err}`);
    return Promise.reject(err);
  }
}

export default readme;
