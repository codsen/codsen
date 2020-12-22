const writeFileAtomic = require("write-file-atomic");

// writes TS configs

async function rollupConfig() {
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

module.exports = rollupConfig;
