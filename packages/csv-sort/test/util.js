/* eslint no-unused-vars:0 */

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { splitEasy } from "csv-split-easy";
import crypto from "crypto";

import { sort } from "../dist/csv-sort.esm.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

const fixtures = path.join(__dirname, "fixtures");

function compare(equal, name, throws) {
  // first, ensure fixtures are not mangled
  let hashes = {
    "all-round-simples-trim":
      "8456d5c30077697469ba20be4575d3b782c7e7b53a8eb802fc5f42e12fb84ad0",
    "offset-column":
      "ada549b804ab7e7e5c365e443e73b8af4dda62c3fe76e0ca5fd29fd57aac635f",
    "simples-2d-trim":
      "fc837da00f187957949cbf06abf0be619429da56ed9336a9a8958abcae1ff57e",
    "simples-backwards":
      "f4dd1116166a841ecf99976b901ca6d682adc72e41d3533b6d489e87bd2ee008",
    "simples-blank-row-aboveheader":
      "53ccf1f5143cd29913111722aa4b34d3f5098a0d72d0168262d165fdb6123175",
    "simples-blank-row-bottom":
      "6fd66773dab085581e121d6d30d83a368748bb09b1f3b9c98928d915a21920b4",
    "simples-blank-row-middle":
      "3245e0d716475c2a7540eb978f6252b2476c2ef12202639424decef52ba01526",
    "simples-blank-row-top":
      "51bdf193da2afcdbff15defcf732eccf5cb00e1ed50fb51cdc983f5ca8836224",
    "simples-messed-up":
      "f0a5763e00de744f6a95bef1007823dbb1f9d34ded4c460deb6b2518147dd31b",
    "simples-no-header":
      "09b109ba5151b5f6d53e575aeec88c8aed447b0d2fbeaa31c8eefdfb26af183f",
    "simples-one-row-has-extra-cols-v2":
      "4408cce8e58ded0ffbcd5c213b5a0c08fcb4ab2322475c6facc489090ad8a5bf",
    "simples-one-row-has-extra-cols":
      "7fd82e7102326a95ea5459da79de05b5fc23067411f50488080644bbdc1dc8cb",
    simples: "da579795da2b2ff9aba459f5e0b415cdd8112a499860e15ea3d3974405e68c52",
    "throws-identical-numeric-cols":
      "fc8f753c86a1f23a94d0b7643a7aa2462e3998d4f4f24098870fd5f3507e5ccc",
    "throws-no-balance":
      "031ce07f16a2ae6717a1a6406c427a97b9cef3f544757f8a932a0d188aef1534",
    "throws-when-no-numeric-columns":
      "d703a73c9a6455e388c60e8dd60e1c0395e7f47374d3be0cddfb1105ba82e79c",
  };
  // every incoming file must have a hash or test will fail:
  if (!hashes[name]) {
    throw new Error(`csv-sort: the hash for ${name} is missing!`);
  }
  // check the hash
  let testSource = readFileSync(path.join(fixtures, `${name}.csv`), "utf8");

  equal(
    sha256(testSource),
    hashes[name],
    `inputs were mangled for fixture "${name}"`,
  );

  // then get onto real bizness
  if (throws) {
    return throws(() => {
      sort(testSource, "utf8");
    });
  }
  let actual = sort(testSource, "utf8").res;
  let expected = readFileSync(
    path.join(fixtures, `${name}.expected.csv`),
    "utf8",
  );
  return equal(actual, splitEasy(expected));
}

export default compare;
