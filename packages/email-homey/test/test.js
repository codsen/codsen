import { execa } from "execa";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import fs from "fs";
import path from "path";

const dirname = path.resolve();

test("generates the homepage with correct folders", async () => {
  await fs.unlink("./fixtures/index.html", () => {});
  await execa("./cli.js", ["fixtures"]);
  equal(
    fs.readFileSync(path.join(dirname, "fixtures/index.html"), "utf8"),
    fs.readFileSync(path.join(dirname, "fixtures/reference.html"), "utf8"),
    "01.01",
  );
  await fs.unlink("./fixtures/index.html", () => {});
});

test("unused flags are OK", async () => {
  await fs.unlink("./fixtures/index.html", () => {});
  await execa("./cli.js", ["-x", "-y", "-z", "fixtures"]);
  equal(
    fs.readFileSync(path.join(dirname, "fixtures/index.html"), "utf8"),
    fs.readFileSync(path.join(dirname, "fixtures/reference.html"), "utf8"),
    "02.01",
  );
  await fs.unlink("./fixtures/index.html", () => {});
});

test("empty input", async () => {
  // default mode - says nothing
  equal(await execa("./cli.js").then((obj) => obj.stdout), "", "03.01");

  // loud mode - complains:
  match(
    await execa("./cli.js", ["-l"]).then((obj) => obj.stdout),
    /nothing to work with/i,
    "03.02",
  );
});

test("too many directories given", async () => {
  // default mode - says nothing
  match(
    await execa("./cli.js", ["fixtures", "fixtures2"]).then(
      (obj) => obj.stdout,
    ),
    /too many/i,
    "04.01",
  );
  match(
    await execa("./cli.js", ["fixtures", "-l", "fixtures2"]).then(
      (obj) => obj.stdout,
    ),
    /too many/i,
    "04.02",
  );
  match(
    await execa("./cli.js", [
      "fixtures",
      "-l",
      "-x",
      "-y",
      "-z",
      "fixtures2",
    ]).then((obj) => obj.stdout),
    /too many/i,
    "04.03",
  );
});

test("help and version flags work", async () => {
  match(
    await execa("./cli.js", ["-v"]).then((obj) => obj.stdout),
    /\d+\.\d+\.\d+/i,
    "05.01",
  );
  match(
    await execa("./cli.js", ["-h"]).then((obj) => obj.stdout),
    /usage/i,
    "05.02",
  );
});

test.run();
