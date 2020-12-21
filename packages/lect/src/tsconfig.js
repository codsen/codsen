const writeFileAtomic = require("write-file-atomic");

// writes rollup.config.js
async function rollupConfig() {
  const newTsConfig = `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {},
  "include": ["./src/**/*"]
}
`;

  try {
    await writeFileAtomic("tsconfig.json", newTsConfig);
    // console.log(`lect tsconfig.json ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);
    // happy path end - resolve
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write tsconfig.json - ${err}`);
    return Promise.reject(err);
  }
}

module.exports = rollupConfig;
