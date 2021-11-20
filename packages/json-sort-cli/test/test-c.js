import fs from "fs-extra";
import path from "path";
import tap from "tap";
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

tap.test("01 - one sorted file", async (t) => {
  const sortedFile = `{\n  "a": 1,\n  "z": 2\n}\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), sortedFile);

  const output = await execa("./cli.js", [tempFolder, "-c"]).catch((err) =>
    t.fail(err)
  );
  t.equal(output.exitCode, 0, "01.01");

  t.strictSame(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    sortedFile,
    "01.02 - file is untouched though"
  );
  t.end();
});

tap.test("02 - one unsorted file", async (t) => {
  const unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  await execa("./cli.js", [tempFolder, "-c"])
    .then(() => {
      // this clause should never be reached
      t.fail("execa should have exited with non-zero code");
    })
    .catch((err) => t.equal(err.exitCode, 9, "02"));

  t.strictSame(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "02 - file is untouched though"
  );
  t.end();
});

tap.test("03 - 'dry' flag trumps 'ci' flag", async (t) => {
  const unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  const output = await execa("./cli.js", [tempFolder, "-c", "-d"]).catch(
    (err) => t.fail(err)
  );

  t.match(output.stdout, /try to sort/, "03.01");
  t.match(output.exitCode, 0, "03.02");
  t.strictSame(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "03.03 - file is untouched though"
  );
  t.end();
});

tap.test("04 - 'dry', arg order is backwards", async (t) => {
  const unsortedFile = `{\n  "z": 1,\n  "a": 2\n}\n`;

  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  const output = await execa("./cli.js", ["-d", tempFolder]).catch((err) =>
    t.fail(err)
  );

  t.match(output.stdout, /try to sort/, "04.01");
  t.match(output.exitCode, 0, "04.02");
  t.strictSame(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "04.03 - file is untouched though"
  );
  t.end();
});

tap.test(
  "05 - errors out when unsorted array within json, --ci & --arrays flags",
  async (t) => {
    const tempFolder = tempy.directory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));
    const pathOfTheTestfile = path.join(tempFolder, "sortme.json");

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

    const output = await execa("./cli.js", [tempFolder, "--ci", "--arrays"])
      .then(() => {
        // this line should never be reached
        t.fail("execa didn't exit with the non-zero code");
      })
      .catch((err) => err);
    await execaCommand(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));

    t.equal(output.exitCode, 9, "05.01");
    t.match(output.stdout, /Unsorted files:/, "05.02");
    t.end();
  }
);

tap.test("06 - unsorted array within json, --ci flag", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, "sortme.json");

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

  const output = await execa("./cli.js", [tempFolder, "--ci"]).catch((err) =>
    t.fail(err)
  );
  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));

  t.equal(output.exitCode, 0, "06.01");
  t.match(output.stdout, /All files were already sorted/, "06.02");
  t.end();
});

tap.test("07 - sorted nested plain object, --ci flag", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "b": "c",
    "d": "e"
  }
}`
  );

  const output = await execa("./cli.js", [tempFolder, "--ci"]).catch((err) =>
    t.fail(err)
  );
  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));

  t.equal(output.exitCode, 0, "07.01");
  t.match(output.stdout, /All files were already sorted/, "07.02");
  t.end();
});

tap.test("08 - unsorted nested plain object, --ci flag", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "d": "e",
    "b": "c"
  }
}`
  );

  const output = await execa("./cli.js", [tempFolder, "--ci"])
    .then(() => {
      // this line should never be reached
      t.fail("execa didn't exit with the non-zero code");
    })
    .catch((err) => err);
  // await execaCommand(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));

  t.equal(output.exitCode, 9, "08.01");
  t.match(output.stdout, /Unsorted files/, "08.02");
  t.match(output.stdout, /sortme\.json/, "08.03");
  t.end();
});

tap.test("09 - but requested copious tabs, --ci flag", async (t) => {
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "b": "c",
    "d": "e"
  }
}`
  );

  const output = await execa("./cli.js", [tempFolder, "-c", "-t", "-i 3"])
    .then(() => {
      // this line should never be reached
      t.fail("execa didn't exit with the non-zero code");
    })
    .catch((err) => err);
  // await execaCommand(`rm -rf ${tempFolder}`).catch((err) => t.fail(err));

  t.equal(output.exitCode, 9, "09.01");
  t.match(output.stdout, /Unsorted files/, "09.02");
  t.match(output.stdout, /sortme\.json/, "09.03");
  t.end();
});
