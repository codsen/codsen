// Quick Take

import { strict as assert } from "assert";
import { er } from "../dist/easy-replace.esm.js";

assert.equal(
  er(
    "&nBsp; NBsp &nbSP NbsP;",
    {
      leftOutsideNot: "",
      leftOutside: "",
      leftMaybe: ["&", "&amp;"],
      searchFor: "nbsp",
      rightMaybe: ";",
      rightOutside: "",
      rightOutsideNot: "",
      i: {
        searchFor: true,
      },
    },
    "&nbsp;"
  ),
  "&nbsp; &nbsp; &nbsp; &nbsp;"
);
