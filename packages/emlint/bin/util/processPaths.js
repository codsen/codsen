import fs from "fs";
import path from "path";
import { promisify } from "util";
const readFileAsync = promisify(fs.readFile);
import { globby } from "globby";
import pReduce from "p-reduce";
import isDirectory from "is-d";
import { Linter } from "../../dist/emlint.esm.js";

const linter = new Linter();

// const messagePrefix = `\u001b[${90}m${"✨ emlint: "}\u001b[${39}m`;

function readUpdateAndWriteOverFile(receivedPath) {
  console.log(" ");
  console.log(
    `017 readUpdateAndWriteOverFile(): received "${`\u001b[${32}m${receivedPath}\u001b[${39}m`}"`
  );
  console.log(" ");
  readFileAsync(receivedPath, { encoding: "utf8" })
    .then((contents) =>
      linter.verify(contents, {
        rules: {
          all: 1,
        },
      })
    )
    .then((contents) => {
      console.log(
        `030 readUpdateAndWriteOverFile(): ${`\u001b[${33}m${`linting results:`}\u001b[${39}m`} ${JSON.stringify(
          contents,
          null,
          4
        )}`
      );
      return contents;
    })
    .catch((err) => {
      console.log(
        `040 ERROR! ${`\u001b[${33}m${`err`}\u001b[${39}m`} = ${JSON.stringify(
          err,
          null,
          4
        )}`
      );
    });
}

function processPaths(paths) {
  console.log(
    `051 processPaths received: ${`\u001b[${33}m${`paths`}\u001b[${39}m`} = ${JSON.stringify(
      paths,
      null,
      4
    )}`
  );
  return (
    globby(paths)
      .then((oneOfpaths) => {
        console.log(
          `061 ${`\u001b[${33}m${`oneOfpaths`}\u001b[${39}m`} = ${JSON.stringify(
            oneOfpaths,
            null,
            4
          )}`
        );
        return pReduce(
          oneOfpaths,
          (concattedTotal, singleDirOrFilePath) =>
            concattedTotal.concat(
              isDirectory(path.resolve(singleDirOrFilePath)).then((bool) =>
                bool
                  ? globby(singleDirOrFilePath, {
                      expandDirectories: {
                        files: ["*.html", "*.htm"],
                      },
                    })
                  : [path.resolve(singleDirOrFilePath)]
              )
            ),
          []
        );
      })
      // then reduce again, now actually concatenating them all together
      .then((received) =>
        pReduce(received, (total, single) => total.concat(single), [])
      )
      .then((pathsArr) =>
        pathsArr.filter((oneOfPaths) => !oneOfPaths.includes("node_modules"))
      )
      .then((pathsArr) =>
        pReduce(
          pathsArr,
          (errorsArr, singlePath) =>
            errorsArr.concat(readUpdateAndWriteOverFile(singlePath)),
          []
        )
      )
  );
}

export default processPaths;
