import { promises as fs } from "fs";
import path from "path";
import prettier from "prettier";
import writeFileAtomic from "write-file-atomic";
import decodeContent from "./decodeContent.js";

// bake examples API DIY makeshift-endpoint, a JSON file
// at ./examples/api.json
async function examples({ state }) {
  // CLI apps don't have examples, so resolve straight away
  if (!state.isRollup) {
    return Promise.resolve(null);
  }

  const titleRegexp = /\/\/\s(.*)/;
  const readFiles = async (dirname) => {
    try {
      let filenames = await fs.readdir(dirname);
      filenames = filenames.filter(
        (filename) => path.extname(filename) === ".js"
      );
      const filesPromiseArr = filenames.map((filename) => {
        return fs.readFile(dirname + filename, "utf-8");
      });
      const response = await Promise.all(filesPromiseArr);
      const res = filenames.reduce((acc, filename, currentIndex) => {
        let content = response[currentIndex]
          .replace(/\/\*\s*eslint[^*]*\*\//g, "")
          .trim()
          .replace(/\.\.\/dist\/([^.]+)\.esm(\.\w+)?/, "$1")
          .replace(/\.\.\/\.\.\/[^/]+\/dist\/([^.]+)\.cjs(\.\w+)?/, "$1")
          .replace(/\.\.\/\.\.\/[^/]+\/dist\/([^.]+)\.esm(\.\w+)?/, "$1")
          .replace(/"\.\.\/\.\.\/\.\.\/\.\.\//g, `"`)
          .replace(/"\.\.\/\.\.\/\.\.\//g, `"`)
          .replace(/"\.\.\/\.\.\//g, `"`)
          .replace(/"\.\.\//g, `"`)
          .replace(/\/dist\/[^.]+\.esm\.js/g, "");
        let title = null;
        if (content.startsWith("//") && titleRegexp.exec(content)) {
          title = titleRegexp.exec(content)[1];
          content = content.replace(titleRegexp, "").trim();
        }
        // console.log(
        //   `1258 lect: ${`\u001b[${33}m${`content`}\u001b[${39}m`} = ${content}`
        // );

        // encode curly braces because Eleventy will try to parse them
        // and all examples will break
        content = content.replace(/{/g, "&#x7B;").replace(/}/g, "&#x7D;");

        // lint the "content" again because we messed with the source code:
        prettier.resolveConfig("../../.prettierrc").then((options) => {
          prettier.check(decodeContent(content), {
            ...options,
            parser: "babel",
          });
        });

        acc[filename] = {
          title,
          content,
        };
        return acc;
      }, {});
      return res;
    } catch (error) {
      console.error(`lect: ${error}`);
    }
  };

  let examplesContents;
  try {
    examplesContents = await readFiles("./examples/");
  } catch (e) {
    // resolve with null - cli.js will see no error and will
    // understand there are no examples and will move on
    return Promise.resolve(null);
  }

  if (examplesContents) {
    try {
      await writeFileAtomic(
        "./examples/api.json",
        JSON.stringify(examplesContents, null, 0)
      );
      // console.log(`lect api.json ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);
      // happy path end - return all examples - readme will
      // need to show the Quick Take section with the primary example
      return Promise.resolve(examplesContents);
    } catch (err) {
      console.log(`lect: could not write examples api.json - ${err}`);
      return Promise.reject(err);
    }
  }
}

export default examples;
