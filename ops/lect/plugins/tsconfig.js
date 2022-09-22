import { promises as fs } from "fs";
import path from "path";
import writeFileAtomic from "write-file-atomic";

// writes TS configs
async function tsconfig({ state }) {
  // bail early if it's a CLI
  if (!state.isRollup) {
    fs.unlink(path.resolve("tsconfig.json"))
      .then(() => {
        console.log(
          `lect tsconfig.json ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`
        );
      })
      .catch(() => Promise.resolve(null));

    return Promise.resolve(null);
  }

  // read the old config, get "references" contents
  let oldReferences;
  let oldIncludes;
  try {
    let contents = JSON.parse(await fs.readFile("tsconfig.json", "utf8"));
    oldReferences = contents.references;
    oldIncludes = contents.include;
    // console.log(
    //   `${`\u001b[${33}m${`oldReferences`}\u001b[${39}m`} = ${JSON.stringify(
    //     oldReferences,
    //     null,
    //     4
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`oldIncludes`}\u001b[${39}m`} = ${JSON.stringify(
    //     oldIncludes,
    //     null,
    //     4
    //   )}`
    // );
  } catch (error) {
    console.log(`lect: could not extract old TS config contents: ${error}`);
  }
  if (!Array.isArray(oldReferences)) {
    oldReferences = [];
  }
  if (!Array.isArray(oldIncludes)) {
    oldIncludes = [];
  }

  let newTsConfig = {
    extends: "../../tsconfig.base.json",
    compilerOptions: {
      outDir: "dist",
    },
    include: [
      ...new Set([
        "src/**/*",
        "package.json",
        "../../ops/typedefs/common.ts",
        ...oldIncludes,
      ]),
    ],
    exclude: [".git", "node_modules"],
    references: oldReferences,
  };
  try {
    await writeFileAtomic(
      "tsconfig.json",
      `${JSON.stringify(newTsConfig, null, 2)}\n`
    );
    // happy path end - resolve
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write tsconfigs - ${err}`);
    return Promise.reject(err);
  }
}

export default tsconfig;
