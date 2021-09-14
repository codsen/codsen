import fs from "fs";
import path from "path";

function getDirectories(p) {
  return fs.readdirSync(p).filter((file) => {
    return fs.statSync(`${p}/${file}`).isDirectory();
  });
}

const res = getDirectories("./packages").reduce((acc, curr) => {
  try {
    const allExamples = JSON.parse(
      fs.readFileSync(`./packages/${curr}/examples/api.json`, "utf8")
    );
    acc[curr] = allExamples;
  } catch (error) {
    console.log(`skipping ${curr} examples`);
  }
  return acc;
}, {});

fs.writeFile(
  path.resolve("stats/packageExamples.json"),
  JSON.stringify(res, null, 0),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(
      `\u001b[${32}m${`packageExamples.json written OK`}\u001b[${39}m`
    );
  }
);
