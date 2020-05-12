const execa = require("execa");
const tap = require("tap");
const fs = require("fs");
const path = require("path");

tap.test("generates the homepage with correct folders", async (t) => {
  await fs.unlink("./fixtures/index.html", () => {});
  await execa("./cli.js", ["fixtures"]);
  t.same(
    fs.readFileSync(path.join(__dirname, "fixtures/index.html"), "utf8"),
    fs.readFileSync(path.join(__dirname, "fixtures/reference.html"), "utf8"),
    "01"
  );
  await fs.unlink("./fixtures/index.html", () => {});
  t.end();
});

tap.test("unused flags are OK", async (t) => {
  await fs.unlink("./fixtures/index.html", () => {});
  await execa("./cli.js", ["-x", "-y", "-z", "fixtures"]);
  t.same(
    fs.readFileSync(path.join(__dirname, "fixtures/index.html"), "utf8"),
    fs.readFileSync(path.join(__dirname, "fixtures/reference.html"), "utf8"),
    "02"
  );
  await fs.unlink("./fixtures/index.html", () => {});
  t.end();
});

tap.test("empty input", async (t) => {
  // default mode - says nothing
  t.equal(await execa("./cli.js").then((obj) => obj.stdout), "", "03.01");

  // loud mode - complains:
  t.match(
    await execa("./cli.js", ["-l"]).then((obj) => obj.stdout),
    /nothing to work with/i,
    "03.02"
  );
  t.end();
});

tap.test("too many directories given", async (t) => {
  // default mode - says nothing
  t.match(
    await execa("./cli.js", ["fixtures", "fixtures2"]).then(
      (obj) => obj.stdout
    ),
    /too many/i,
    "04.01"
  );
  t.match(
    await execa("./cli.js", ["fixtures", "-l", "fixtures2"]).then(
      (obj) => obj.stdout
    ),
    /too many/i,
    "04.02"
  );
  t.match(
    await execa("./cli.js", [
      "fixtures",
      "-l",
      "-x",
      "-y",
      "-z",
      "fixtures2",
    ]).then((obj) => obj.stdout),
    /too many/i,
    "04.03"
  );
  t.end();
});

tap.test("help and version flags work", async (t) => {
  t.match(
    await execa("./cli.js", ["-v"]).then((obj) => obj.stdout),
    /\d\.\d\.\d/i,
    "05.01"
  );
  t.match(
    await execa("./cli.js", ["-h"]).then((obj) => obj.stdout),
    /usage/i,
    "05.02"
  );
  t.end();
});
