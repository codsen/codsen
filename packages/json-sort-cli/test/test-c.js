import fs from "fs-extra";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { execa, execaCommand } from "execa";
import tempy from "tempy";
// import pMap from "p-map";
// import pack from "../package.json";
// import {
//   testFileContents,
//   sortedTestFileContents,
//   testFilePaths,
//   sortedTabbedTestFileContents,
//   minifiedContents,
//   prettifiedContents,
// } from "./util/data.js";

// -----------------------------------------------------------------------------

test("01 - one sorted file", async () => {
  let sortedFile = `{\n  "a": 1,\n  "z": 2\n}\n`;

  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), sortedFile);

  let output = await execa("./cli.js", [tempFolder, "-c"]).catch((err) => {
    throw new Error(err);
  });
  equal(output.exitCode, 0, "01.01");

  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    sortedFile,
    "01.02 - file is untouched though"
  );
});

test("02 - one unsorted file", async () => {
  let unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  await execa("./cli.js", [tempFolder, "-c"])
    .then(() => {
      // this clause should never be reached
      not.ok("execa should have exited with non-zero code");
    })
    .catch((err) => equal(err.exitCode, 9, "02"));

  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "02 - file is untouched though"
  );
});

test("03 - 'dry' flag trumps 'ci' flag", async () => {
  let unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", [tempFolder, "-c", "-d"]).catch(
    (err) => {
      throw new Error(err);
    }
  );

  match(output.stdout, /try to sort/, "03.01");
  equal(output.exitCode, 0, "03.02");
  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "03.03 - file is untouched though"
  );
});

test("04 - 'dry', arg order is backwards", async () => {
  let unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", ["-d", tempFolder]).catch((err) => {
    throw new Error(err);
  });

  match(output.stdout, /try to sort/, "04.01");
  equal(output.exitCode, 0, "04.02");
  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "04.03 - file is untouched though"
  );
});

test("05 - errors out when unsorted array within json, --ci & --arrays flags", async () => {
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
    pathOfTheTestfile,
    `{
  "keywords": [
    "utility",
    "app",
    "cli"
  ]
}`
  );

  let output = await execa("./cli.js", [tempFolder, "--ci", "--arrays"])
    .then(() => {
      // this line should never be reached
      not.ok("execa didn't exit with the non-zero code");
    })
    .catch((err) => err);
  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });

  equal(output.exitCode, 9, "05.01");
  match(output.stdout, /Unsorted files:/, "05.02");
});

test("06 - unsorted array within json, --ci flag", async () => {
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
    pathOfTheTestfile,
    `{
  "keywords": [
    "utility",
    "app",
    "cli"
  ]
}`
  );

  let output = await execa("./cli.js", [tempFolder, "--ci"]).catch((err) => {
    throw new Error(err);
  });
  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });

  equal(output.exitCode, 0, "06.01");
  match(output.stdout, /All files were already sorted/, "06.02");
});

test("07 - sorted nested plain object, --ci flag", async () => {
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "b": "c",
    "d": "e"
  }
}`
  );

  let output = await execa("./cli.js", [tempFolder, "--ci"]).catch((err) => {
    throw new Error(err);
  });
  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });

  equal(output.exitCode, 0, "07.01");
  match(output.stdout, /All files were already sorted/, "07.02");
});

test("08 - unsorted nested plain object, --ci flag", async () => {
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "d": "e",
    "b": "c"
  }
}`
  );

  let output = await execa("./cli.js", [tempFolder, "--ci"])
    .then(() => {
      // this line should never be reached
      not.ok("execa didn't exit with the non-zero code");
    })
    .catch((err) => err);
  // await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {throw new Error(err)});

  equal(output.exitCode, 9, "08.01");
  match(output.stdout, /Unsorted files/, "08.02");
  match(output.stdout, /sortme\.json/, "08.03");
});

test("09 - but requested copious tabs, --ci flag", async () => {
  let tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "b": "c",
    "d": "e"
  }
}`
  );

  let output = await execa("./cli.js", [tempFolder, "-c", "-t", "-i 3"])
    .then(() => {
      // this line should never be reached
      not.ok("execa didn't exit with the non-zero code");
    })
    .catch((err) => err);
  // await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {throw new Error(err)});

  equal(output.exitCode, 9, "09.01");
  match(output.stdout, /Unsorted files/, "09.02");
  match(output.stdout, /sortme\.json/, "09.03");
});

test.run();
