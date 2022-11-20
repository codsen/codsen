import fs from "fs";
import crypto from "crypto";

export const read = (what, extension = "zz") => {
  return fs.readFileSync(`test/fixtures/${what}.${extension}`, "utf8");
};

export const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

export const pad = (num) => {
  return String(num + 1).padStart(2, "0");
};
