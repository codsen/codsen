import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";

// hard write all static files
// key files.write_hard from packages/ root .lectrc.json
async function hardWrite({ lectrc }) {
  const contentsToWriteHard = objectPath
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
    contentsToWriteHard.map((oneToDoObj) =>
      writeFileAtomic(oneToDoObj.name, oneToDoObj.contents)
    )
  );
}

export default hardWrite;
