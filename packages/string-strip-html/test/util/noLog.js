// import fs from "fs";
// import path from "path";
import { stripHtml as originalStripHtml } from "../../dist/string-strip-html.esm.js";

// the "log" output key's value is indeterminable so we omit that
function stripHtml(...args) {
  // let extractedInputs = new Set(
  //   JSON.parse(
  //     fs.readFileSync(path.resolve("./test/util/extractedInputs.json"), "utf8")
  //   )
  // );
  // if (typeof args[0] === "string" && args[0].trim().length > 3) {
  //   extractedInputs.add(args[0]);
  //   fs.writeFileSync(
  //     path.resolve("./test/util/extractedInputs.json"),
  //     JSON.stringify([...extractedInputs], null, 0)
  //   );
  // }

  let { result, ranges, allTagLocations, filteredTagLocations } =
    originalStripHtml(...args);
  return { result, ranges, allTagLocations, filteredTagLocations };
}

export { stripHtml };
