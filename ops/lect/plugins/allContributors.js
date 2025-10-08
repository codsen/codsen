// lints/generates/refreshes the .all-contributorsrc

import { promises as fs } from "fs";
import writeFileAtomic from "write-file-atomic";

const ROY = {
  login: "revelt",
  name: "Roy Revelt",
  avatar_url: "https://avatars.githubusercontent.com/u/8344688?v=4",
  profile: "https://github.com/revelt",
  contributions: ["code", "test", "doc", "review"],
};
const ALL_CONTRIB_FILE = `.all-contributorsrc`;

async function allContrib({ state }) {
  let finalFileToWrite = {
    projectName: state.pack.name,
    projectOwner: "codsen",
    files: ["README.md"],
    imageSize: 100,
    contributors: [ROY],
  };

  try {
    let existingAllContribFile = JSON.parse(
      await fs.readFile(ALL_CONTRIB_FILE, "utf8"),
    );
    // console.log(
    //   `${`\u001b[${32}m${`read ${ALL_CONTRIB_FILE} OK`}\u001b[${39}m`}`
    // );
    if (!existingAllContribFile.contributors) {
      throw new Error(
        `lect: no "contributors" key in ${ALL_CONTRIB_FILE} - we'll reset it!`,
      );
    }

    // extract "contributors" key from existing file
    finalFileToWrite.contributors = existingAllContribFile.contributors;
  } catch (e) {
    // console.log(
    //   `${`\u001b[${31}m${`could not read ${ALL_CONTRIB_FILE}`}\u001b[${39}m`}`
    // );
  }

  // update Roy's record
  finalFileToWrite.contributors = finalFileToWrite.contributors.map((obj) => {
    if (obj.login === "revelt") {
      return ROY;
    }
    return obj;
  });

  // whatever the outcome, write what we've got
  try {
    await writeFileAtomic(
      ALL_CONTRIB_FILE,
      JSON.stringify(finalFileToWrite, null, 2),
    );
    // console.log(
    //   `lect ${ALL_CONTRIB_FILE} ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`
    // );
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write ${ALL_CONTRIB_FILE} - ${err}`);
    return Promise.reject(err);
  }
}

export default allContrib;
