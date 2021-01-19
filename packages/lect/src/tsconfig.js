const fs = require("fs").promises;
const path = require("path");
const writeFileAtomic = require("write-file-atomic");

// writes TS configs

async function tsconfig({ state }) {
  // bail early if it's a CLI
  if (state.isCLI) {
    fs.unlink(path.resolve("rollup.config.js"))
      .then(() => {
        console.log(
          `lect rollup.config.js ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`
        );
      })
      .catch(() => Promise.resolve(null));
    fs.unlink(path.resolve("tsconfig.json"))
      .then(() => {
        console.log(
          `lect tsconfig.json ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`
        );
      })
      .catch(() => Promise.resolve(null));

    return Promise.resolve(null);
  }

  const newTsConfig = `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {}
}
`;

  //   const newTsConfigBuild = `{
  //   "extends": "../../tsconfig.build.json",
  //   "compilerOptions": {},
  //   "include": ["./src/**/*"],
  // }
  // `;

  try {
    await writeFileAtomic("tsconfig.json", newTsConfig);
    // await writeFileAtomic("tsconfig.build.json", newTsConfigBuild);
    // console.log(`lect tsconfig.json ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);
    // happy path end - resolve
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write tsconfigs - ${err}`);
    return Promise.reject(err);
  }
}

module.exports = tsconfig;
