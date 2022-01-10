import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";
import arrayiffy from "../../helpers/arrayiffy.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const webapps = require("../../data/webapps.json");
const esmBump = require("../../data/esmBump.json");

async function readme({ state, quickTakeExample, lectrc }) {
  let badge1 = `<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center">`;

  let badge2 = `<img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center">`;

  let badge3 = `<img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">`;

  let esmNotice = `The latest version is **ESM only**: Node 12+ is needed to use it and it must be \`import\`ed instead of \`require\`d.`;

  if (typeof esmBump === "object" && esmBump[state.pack.name]) {
    esmNotice += ` If your project is not on ESM yet and you want to use \`require\`, use an older version of this program, \`${
      esmBump[state.pack.name]
    }\`.`;
  }

  let play = "";
  if (webapps[state.pack.name] && !webapps[state.pack.name].url) {
    play = ` and even a test <a href="https://codsen.com/os/${state.pack.name}/play">playground</a>`;
  }

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

## Install${state.isRollup ? `\n\n${esmNotice}` : ""}

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
      ? `\n\n## Quick Take\n
\`\`\`js
${quickTakeExample}
\`\`\`\n\n`
      : ""
  }## Documentation

Please [visit codsen.com](https://codsen.com/os/${
    state.pack.name
  }/) for a full description of the API${play || ""}.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

`;

  // licence module
  let licenceExtras = objectPath.get(state.pack, "lect.licence.extras");

  content += `${
    lectrc.licence.header.length > 0 ? `${lectrc.licence.header}` : ""
  }`;
  content += `${
    lectrc.licence.restofit.length > 0
      ? `\n\n${lectrc.licence.restofit}\n\n`
      : ""
  }`;

  if (licenceExtras) {
    content += `\n${arrayiffy(licenceExtras)
      .filter((singleExtra) => singleExtra.length > 0)
      .join("\n")}`;
  }

  if (!content.endsWith("\n")) {
    content += "\n\n";
  }

  content = content.replace(/%YEAR%/, String(new Date().getFullYear()));

  content += `${badge1} ${badge2} ${badge3}\n\n`;

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
