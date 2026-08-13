import { promises as fs } from "node:fs";
import path from "node:path";
import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";

function resolve(str) {
  return str.replace("%YEAR%", new Date().getFullYear());
}

// hard write all static files
// key files.write_hard from packages/ root .lectrc.json
async function hardWrite({ lectrc, root = process.cwd() }) {
  const contentsToWriteHard = (
    objectPath.get(lectrc, "files.write_hard") || []
  ).filter((obj) => {
    return (
      obj.name &&
      obj.name.trim() !== "" &&
      obj.contents &&
      obj.contents.trim() !== ""
    );
  });

  // if to-do list is empty, bail early:
  if (!contentsToWriteHard?.length) {
    return Promise.resolve(null);
  }

  for (const oneToDoObj of contentsToWriteHard) {
    const filename = resolve(oneToDoObj.name);
    const absoluteFilename = path.resolve(root, filename);
    const expected = resolve(oneToDoObj.contents);
    let contents;
    try {
      contents = await fs.readFile(absoluteFilename, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
    if (contents === undefined || contents.trim() !== expected.trim()) {
      await writeFileAtomic(absoluteFilename, expected);
    }
  }
  return null;
}

export default hardWrite;
