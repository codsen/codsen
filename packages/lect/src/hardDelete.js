const fs = require("fs").promises;
const { constants } = require("fs");
const path = require("path");
const objectPath = require("object-path");
const rimraf = require("rimraf");

// delete all requested files
// key files.delete from packages/ root .lectrc.json
async function hardDelete({ lectrc }) {
  rimraf(path.resolve(".nyc_output/"), {}, (e) => {
    if (e) {
      console.log(e);
    }
  });

  const thingsToDelete = (objectPath.get(lectrc, "files.delete") || []).filter(
    (val) => {
      return val && val.trim() !== "";
    }
  );
  // if to-do list is empty, bail early:
  if (!thingsToDelete || !thingsToDelete.length) {
    return Promise.resolve(null);
  }

  return Promise.all(
    thingsToDelete.map((fileName) =>
      fs
        .access(path.resolve(fileName), constants.F_OK)
        .then(() =>
          fs.unlink(fileName).then(() => {
            console.log(
              `lect ${fileName} ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`
            );
            return Promise.resolve(null);
          })
        )
        .catch(() => Promise.resolve(null))
    )
  );
}

module.exports = hardDelete;
