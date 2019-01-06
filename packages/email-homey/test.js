// import childProcess from "child_process";
import execa from "execa";
import test from "ava";
import fs from "fs";
import path from "path";

test.serial("generates the homepage with correct folders", async t => {
  await fs.unlink("./fixtures/index.html", () => {});
  await execa.stdout("./cli.js", ["fixtures"]);
  t.deepEqual(
    fs.readFileSync(path.join(__dirname, "fixtures/index.html"), "utf8"),
    fs.readFileSync(path.join(__dirname, "fixtures/reference.html"), "utf8")
  );
  await fs.unlink("./fixtures/index.html", () => {});
});

test.serial("unused flags are OK", async t => {
  await fs.unlink("./fixtures/index.html", () => {});
  await execa.stdout("./cli.js", ["-x", "-y", "-z", "fixtures"]);
  t.deepEqual(
    fs.readFileSync(path.join(__dirname, "fixtures/index.html"), "utf8"),
    fs.readFileSync(path.join(__dirname, "fixtures/reference.html"), "utf8")
  );
  await fs.unlink("./fixtures/index.html", () => {});
});

test.serial("empty input", async t => {
  // default mode - says nothing
  t.is(await execa.stdout("./cli.js"), "");

  // loud mode - complains:
  t.regex(await execa.stdout("./cli.js", ["-l"]), /nothing to work with/i);
});

test.serial("too many directories given", async t => {
  // default mode - says nothing
  t.regex(
    await execa.stdout("./cli.js", ["fixtures", "fixtures2"]),
    /too many/i
  );
  t.regex(
    await execa.stdout("./cli.js", ["fixtures", "-l", "fixtures2"]),
    /too many/i
  );
  t.regex(
    await execa.stdout("./cli.js", [
      "fixtures",
      "-l",
      "-x",
      "-y",
      "-z",
      "fixtures2"
    ]),
    /too many/i
  );
});

test.serial("help and version flags work", async t => {
  t.regex(await execa.stdout("./cli.js", ["-v"]), /\d\.\d\.\d/i);
  t.regex(await execa.stdout("./cli.js", ["-h"]), /usage/i);
});
