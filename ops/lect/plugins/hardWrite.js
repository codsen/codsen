import { promises as fs } from "fs";
import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";

function resolve(str) {
  return str.replace("%YEAR%", new Date().getFullYear());
}

// hard write all static files
// key files.write_hard from packages/ root .lectrc.json
async function hardWrite({ lectrc }) {
  let contentsToWriteHard = objectPath
    .get(lectrc, "files.write_hard")
    .filter((obj) => {
      return (
        obj.name &&
        obj.name.trim() !== "" &&
        obj.contents &&
        obj.contents.trim() !== ""
      );
    });

  // if to-do list is empty, bail early:
  if (!contentsToWriteHard || !contentsToWriteHard.length) {
    return Promise.resolve(null);
  }

  return Promise.all(
    contentsToWriteHard.map(async (oneToDoObj) => {
      try {
        await fs.readFile(resolve(oneToDoObj.name), "utf8").then((contents) => {
          if (contents.trim() !== resolve(oneToDoObj.contents).trim()) {
            // console.log(
            //   `034 lect/hardWrite: ${`\u001b[${32}m${`file ${oneToDoObj.name} exists but is incorrect; will write`}\u001b[${39}m`}`
            // );
            return writeFileAtomic(
              oneToDoObj.name,
              resolve(oneToDoObj.contents)
            );
          } else {
            // console.log(
            //   `042 lect/hardWrite: ${`\u001b[${32}m${`correct file ${oneToDoObj.name} already exists`}\u001b[${39}m`}`
            // );
            return Promise.resolve(null);
          }
        });
      } catch (error) {
        // file does not exist, so write it:
        // console.log(
        //   `050 lect/hardWrite: ${`\u001b[${32}m${`file ${oneToDoObj.name} does not exist, will write`}\u001b[${39}m`}`
        // );
        return writeFileAtomic(oneToDoObj.name, resolve(oneToDoObj.contents));
      }
    })
  );
}

export default hardWrite;
