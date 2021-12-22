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

  let newTsConfig = `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {}
}
`;

  try {
    await writeFileAtomic("tsconfig.json", newTsConfig);
    // happy path end - resolve
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write tsconfigs - ${err}`);
    return Promise.reject(err);
  }
}

export default tsconfig;
