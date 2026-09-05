import { constants } from "node:fs";
import path from "node:path";
import { test } from "uvu";
import { equal, match } from "uvu/assert";
import { createFileOperations, processFiles } from "../process-files.js";

function fixture() {
  const events = [];
  const file = path.resolve("fixture.json");
  const contents = Buffer.from('{"z":1,"a":2}');
  const stat = {
    dev: 1n,
    ino: 2n,
    size: BigInt(contents.length),
    mtimeNs: 3n,
    ctimeNs: 4n,
    mode: 0o100644n,
    uid: 5n,
    gid: 6n,
    isFile: () => true,
    isSymbolicLink: () => false,
  };
  const readHandle = {
    stat: async () => stat,
    readFile: async () => contents,
    close: async () => events.push("read:close"),
  };
  const temporaryHandle = {
    writeFile: async (...args) => events.push(["temporary:write", ...args]),
    chmod: async (mode) => events.push(["temporary:chmod", mode]),
    stat: async () => stat,
    chown: async (...args) => events.push(["temporary:chown", ...args]),
    sync: async () => events.push("temporary:sync"),
    close: async () => events.push("temporary:close"),
  };
  const directoryHandle = {
    sync: async () => events.push("directory:sync"),
    close: async () => events.push("directory:close"),
  };
  const fs = {
    realpath: async () => file,
    lstat: async () => stat,
    open: async (target, flags, mode) => {
      events.push(["open", target, flags, mode]);
      if (flags === "wx") {
        return temporaryHandle;
      }
      return flags === "r" ? directoryHandle : readHandle;
    },
    rename: async (...args) => events.push(["rename", ...args]),
    unlink: async (target) => events.push(["unlink", target]),
  };
  return {
    contents,
    directoryHandle,
    events,
    file,
    fs,
    readHandle,
    snapshot: { contents, realPath: file, stat },
    stat,
    temporaryHandle,
  };
}

async function rejected(operation) {
  try {
    await operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to reject");
}

test("01 - each changed identity field prevents reading and closes the handle", async () => {
  const received = [];
  for (const field of ["dev", "ino", "size", "mtimeNs", "ctimeNs"]) {
    const state = fixture();
    state.readHandle.stat = async () => ({
      ...state.stat,
      [field]: state.stat[field] + 1n,
    });
    state.readHandle.readFile = async () => {
      throw new Error("A changed file must not be read");
    };
    const error = await rejected(() =>
      createFileOperations({ fs: state.fs }).read(state.file),
    );
    received.push([error.message, state.events.at(-1)]);
  }

  equal(
    received.map(([message, lastEvent]) => [
      message.startsWith("The file changed while it was being opened:"),
      lastEvent,
    ]),
    Array.from({ length: 5 }, () => [true, "read:close"]),
    "01.01",
  );
});

test("02 - a changed route prevents reading and still closes the handle", async () => {
  const state = fixture();
  let checks = 0;
  state.fs.realpath = async () =>
    ++checks === 1 ? state.file : path.resolve("other.json");
  state.readHandle.readFile = async () => {
    throw new Error("A changed route must not be read");
  };

  const error = await rejected(() =>
    createFileOperations({ fs: state.fs }).read(state.file),
  );

  match(error.message, /file route changed while opening/, "02.01");
  equal(state.events.at(-1), "read:close", "02.02");
});

test("03 - platforms without O_NOFOLLOW retain the snapshot checks", async () => {
  const state = fixture();
  const snapshot = await createFileOperations({
    fs: state.fs,
    noFollow: null,
  }).read(state.file);

  equal(snapshot, state.snapshot, "03.01");
  equal(
    state.events[0],
    ["open", state.file, constants.O_RDONLY, undefined],
    "03.02",
  );
  equal(state.events.at(-1), "read:close", "03.03");
});

test("04 - replacement preserves changed ownership before becoming visible", async () => {
  const received = [];
  for (const field of ["uid", "gid"]) {
    const state = fixture();
    state.temporaryHandle.stat = async () => ({
      ...state.stat,
      [field]: state.stat[field] + 1n,
    });
    await createFileOperations({ fs: state.fs }).write(
      state.file,
      "{}\n",
      state.snapshot,
    );
    const opened = state.events[0];
    match(
      path.basename(opened[1]),
      /^\.fixture\.json\.\d+\.[\da-f-]+\.tmp$/,
      "04.01",
    );
    received.push([
      opened.slice(2),
      state.events.slice(1, 6),
      state.events.find((event) => event[0] === "rename")[2],
      state.events.slice(-2),
    ]);
  }

  equal(
    received,
    Array.from({ length: 2 }, () => [
      ["wx", 0o644],
      [
        ["temporary:write", "{}\n", "utf8"],
        ["temporary:chmod", 0o644],
        ["temporary:chown", 5, 6],
        "temporary:sync",
        "temporary:close",
      ],
      path.resolve("fixture.json"),
      ["directory:sync", "directory:close"],
    ]),
    "04.02",
  );
});

test("05 - a last-minute route change removes the temporary file without renaming", async () => {
  const state = fixture();
  let checks = 0;
  state.fs.realpath = async () =>
    ++checks === 4 ? path.resolve("other.json") : state.file;
  const error = await rejected(() =>
    createFileOperations({ fs: state.fs }).write(
      state.file,
      "{}\n",
      state.snapshot,
    ),
  );

  match(error.message, /file route changed before commit/, "05.01");
  equal(
    state.events.some((event) => event[0] === "rename"),
    false,
    "05.02",
  );
  equal(state.events.at(-1), ["unlink", state.events[0][1]], "05.03");
});

test("06 - failed writes preserve the original error despite cleanup failures", async () => {
  const state = fixture();
  const failure = new Error("disk full");
  state.temporaryHandle.writeFile = async () => {
    throw failure;
  };
  state.temporaryHandle.close = async () => {
    state.events.push("temporary:close");
    throw new Error("close failed");
  };
  state.fs.unlink = async (target) => {
    state.events.push(["unlink", target]);
    throw new Error("unlink failed");
  };
  const error = await rejected(() =>
    createFileOperations({ fs: state.fs }).write(
      state.file,
      "{}\n",
      state.snapshot,
    ),
  );

  equal(error, failure, "06.01");
  equal(
    state.events.slice(1),
    ["temporary:close", ["unlink", state.events[0][1]]],
    "06.02",
  );
  equal(
    state.events.some((event) => event[0] === "rename"),
    false,
    "06.03",
  );
});

test("07 - a directory-sync failure does not undo an atomic replacement", async () => {
  const state = fixture();
  state.directoryHandle.sync = async () => {
    throw new Error("directory syncing is unsupported");
  };

  await createFileOperations({ fs: state.fs }).write(
    state.file,
    "{}\n",
    state.snapshot,
  );

  equal(
    state.events.filter((event) => event[0] === "rename").length,
    1,
    "07.01",
  );
  equal(state.events.at(-1), "directory:close", "07.02");
  equal(
    state.events.some((event) => event[0] === "unlink"),
    false,
    "07.03",
  );
});

test("08 - unexpected internal errors are not classified as file failures", async () => {
  const failure = new Error("unexpected changed accessor failure");
  const outcomes = [];
  const error = await rejected(() =>
    processFiles(["fixture.json"], {
      read: async () => "{}",
      transform: () => ({
        get changed() {
          throw failure;
        },
      }),
      onOutcome: (outcome) => outcomes.push(outcome),
    }),
  );

  equal(error, failure, "08.01");
  equal(outcomes, [], "08.02");
});

test.run();
