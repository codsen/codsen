const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const readFileAsync = promisify(fs.readFile);
const globby = require("globby");
const pReduce = require("p-reduce");
const isDirectory = require("is-d");
const { Linter } = require("../../dist/emlint.cjs.js");
const linter = new Linter();

// const messagePrefix = `\u001b[${90}m${"✨ emlint: "}\u001b[${39}m`;

function readUpdateAndWriteOverFile(receivedPath) {
  console.log(" ");
  console.log(
    `016 readUpdateAndWriteOverFile(): received "${`\u001b[${32}m${receivedPath}\u001b[${39}m`}"`
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
        `029 readUpdateAndWriteOverFile(): ${`\u001b[${33}m${`linting results:`}\u001b[${39}m`} ${JSON.stringify(
          contents,
          null,
          4
        )}`
      );
      return contents;
    })
    .catch((err) => {
      console.log(
        `039 ERROR! ${`\u001b[${33}m${`err`}\u001b[${39}m`} = ${JSON.stringify(
          err,
          null,
          4
        )}`
      );
    });
}

function processPaths(paths) {
  console.log(
    `050 processPaths received: ${`\u001b[${33}m${`paths`}\u001b[${39}m`} = ${JSON.stringify(
      paths,
      null,
      4
    )}`
  );
  return (
    globby(paths)
      .then((paths) => {
        console.log(
          `060 ${`\u001b[${33}m${`paths`}\u001b[${39}m`} = ${JSON.stringify(
            paths,
            null,
            4
          )}`
        );
        return pReduce(
          paths,
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

module.exports = processPaths;
