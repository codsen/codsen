import { promises as fs } from "node:fs";
import path from "node:path";
import objectPath from "object-path";

// delete all requested files
// key files.delete from packages/ root .lectrc.json
async function hardDelete({ lectrc, root = process.cwd() }) {
  const thingsToDelete = (objectPath.get(lectrc, "files.delete") || []).filter(
    (val) => {
      return val && val.trim() !== "";
    },
  );
  // if to-do list is empty, bail early:
  if (!thingsToDelete?.length) {
    return Promise.resolve(null);
  }

  for (const fileName of thingsToDelete) {
    try {
      await fs.unlink(path.resolve(root, fileName));
      console.log(
        `lect ${fileName} ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`,
      );
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
  return null;
}

export default hardDelete;
