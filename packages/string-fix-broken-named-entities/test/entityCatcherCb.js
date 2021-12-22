import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm.js";

//
//
//
//
//
//                                 &nbsp;
//
//
//
//
//

test(`01 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, with callback, no decode`, () => {
  let inp1 = "y &nbsp; z";
  let gatheredBroken = [];
  let gatheredHealthy = [];
  fix(inp1, {
    cb: (obj) => {
      let { name } = obj;
      gatheredBroken.push(name);
      return obj;
    },
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: false,
  });
  equal(gatheredHealthy, [[2, 8]], "01.01");
  equal(gatheredBroken, [], "01.02");
});

test(`02 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, without callback, no decode`, () => {
  let inp1 = "y &nbsp; z";
  let gatheredBroken = [];
  let gatheredHealthy = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: false,
  });
  equal(gatheredHealthy, [[2, 8]], "02.01");
  equal(gatheredBroken, [], "02.02");
});

test(`03 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, with callback, with decode`, () => {
  let inp1 = "y &nbsp; z";
  let gatheredBroken = [];
  let gatheredHealthy = [];
  fix(inp1, {
    cb: (obj) => {
      let { ruleName } = obj;
      gatheredBroken.push(ruleName);
      return obj;
    },
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: true,
  });
  equal(gatheredHealthy, [], "03.01");
  equal(gatheredBroken, ["bad-html-entity-encoded-nbsp"], "03.02");
});

test(`04 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, without callback, with decode`, () => {
  let inp1 = "y &nbsp; z";
  let gatheredHealthy = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: true,
  });
  equal(gatheredHealthy, [], "04"); // <- because it's encoded and user asked unencoded
});

test(`05 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - only healthy entities are pinged to entityCatcherCb`, () => {
  let inp1 = "y &nbsp; z &nsp;";
  let gatheredBroken = [];
  let gatheredHealthy = [];
  fix(inp1, {
    cb: (obj) => {
      let { ruleName } = obj;
      gatheredBroken.push(ruleName);
      return obj;
    },
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
  });
  equal(gatheredHealthy, [[2, 8]], "05.01");
  equal(gatheredBroken, ["bad-html-entity-malformed-nbsp"], "05.02");
});

//
//
//
//
//
//                               &isindot;
//
//
//
//
//

test(`06 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, with callback, no decode`, () => {
  let inp1 = "y &isindot; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    cb: (obj) => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false,
  });
  equal(gatheredEntityRanges, [[2, 11]], "06");
});

test(`07 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, without callback, no decode`, () => {
  let inp1 = "y &isindot; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false,
  });
  equal(gatheredEntityRanges, [[2, 11]], "07");
});

test(`08 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, with callback, with decode`, () => {
  let inp1 = "y &isindot; z";
  let gatheredHealthy = [];
  let gatheredBroken = [];
  fix(inp1, {
    cb: (obj) => {
      gatheredBroken.push(obj);
      return obj;
    },
    entityCatcherCb: (from, to) => gatheredBroken.push([from, to]),
    decode: true,
  });

  equal(gatheredHealthy, [], "08.01");
  equal(
    gatheredBroken[0],
    {
      ruleName: "bad-html-entity-encoded-isindot",
      entityName: "isindot",
      rangeFrom: 2,
      rangeTo: 11,
      rangeValEncoded: "&isindot;",
      rangeValDecoded: "⋵",
    },
    "08.02"
  );
});

test(`09 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, without callback, with decode`, () => {
  let inp1 = "y &isindot; z";
  let healthy = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => healthy.push([from, to]),
    decode: true,
  });

  equal(healthy, [], "09");
});

//
//
//
//
//
//                          &nsp; (broken &nbsp;)
//
//
//
//
//

test(`10 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, with callback, no decode`, () => {
  let inp1 = "y &nsp; z";
  let gatheredBroken = [];
  let gatheredHealthy = [];
  fix(inp1, {
    cb: (obj) => {
      let { ruleName } = obj;
      gatheredBroken.push(ruleName);
      return obj;
    },
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: false,
  });
  equal(gatheredBroken, ["bad-html-entity-malformed-nbsp"], "10.01");
  equal(gatheredHealthy, [], "10.02");
});

test(`11 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, without callback, no decode`, () => {
  let inp1 = "y &nsp; z";
  let gatheredHealthy = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: false,
  });
  equal(gatheredHealthy, [], "11");
});

test(`12 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, with callback, with decode`, () => {
  let inp1 = "y &nsp; z";
  let gatheredBroken = [];
  let gatheredHealthy = [];
  fix(inp1, {
    cb: (obj) => {
      let { ruleName } = obj;
      gatheredBroken.push(ruleName);
      return obj;
    },
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: true,
  });
  equal(gatheredBroken, ["bad-html-entity-malformed-nbsp"], "12.01");
  equal(gatheredHealthy, [], "12.02");
});

test(`13 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, without callback, with decode`, () => {
  let inp1 = "y &nsp; z";
  let gatheredHealthy = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: true,
  });
  equal(gatheredHealthy, [], "13");
});

//
//
//
//
//
//                               &abcdefg;
//
//
//
//
//

test(`14 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, with callback, no decode`, () => {
  let inp1 = "y &abcdefg; z";
  let gatheredBroken = [];
  let gatheredHealthy = [];
  fix(inp1, {
    cb: (obj) => {
      let { ruleName } = obj;
      gatheredBroken.push(ruleName);
      return obj;
    },
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: false,
  });
  equal(gatheredBroken, ["bad-html-entity-unrecognised"], "14.01");
  equal(gatheredHealthy, [], "14.02");
});

test(`15 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, without callback, no decode`, () => {
  let inp1 = "y &abcdefg; z";
  let gatheredHealthy = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: false,
  });
  equal(gatheredHealthy, [], "15");
});

test(`16 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, with callback, with decode`, () => {
  let inp1 = "y &abcdefg; z";
  let gatheredBroken = [];
  let gatheredHealthy = [];
  fix(inp1, {
    cb: (obj) => {
      let { ruleName } = obj;
      gatheredBroken.push(ruleName);
      return obj;
    },
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: true,
  });
  equal(gatheredBroken, ["bad-html-entity-unrecognised"], "16.01");
  equal(gatheredHealthy, [], "16.02");
});

test(`17 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, without callback, with decode`, () => {
  let inp1 = "y &abcdefg; z";
  let gatheredHealthy = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    decode: true,
  });
  equal(gatheredHealthy, [], "17");
});

//
//
//
//
//
//                           decimal numeric &#65;
//
//
//
//
//

test(`18 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, with callback, no decode`, () => {
  let inp1 = "y &#65; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    cb: (obj) => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false,
  });
  equal(gatheredEntityRanges, [[2, 7]], "18");
});

test(`19 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, without callback, no decode`, () => {
  let inp1 = "y &#65; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false,
  });
  equal(gatheredEntityRanges, [[2, 7]], "19");
});

test(`20 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, with callback, with decode`, () => {
  let inp1 = "y &#65; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    cb: (obj) => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true,
  });
  equal(gatheredEntityRanges, [[2, 7]], "20");
});

test(`21 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, without callback, with decode`, () => {
  let inp1 = "y &#65; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true,
  });
  equal(gatheredEntityRanges, [[2, 7]], "21");
});

//
//
//
//
//
//                           more ad hoc tests
//
//
//
//
//

test(`22 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one broken decimal numeric entity`, () => {
  let inp1 = "y &65; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true,
  });
  equal(gatheredEntityRanges, [[2, 6]], "22");
});

test(`23 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one broken decimal numeric entity`, () => {
  let inp1 = "y &#99999999999999999999; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true,
  });
  equal(gatheredEntityRanges, [[2, 25]], "23");
});

//
//
//
//
//
//                         hexidecimal numeric &x#A3;
//
//
//
//
//

test(`24 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, with callback, no decode`, () => {
  let inp1 = "y &x#A3; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    cb: (obj) => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false,
  });
  equal(gatheredEntityRanges, [[2, 8]], "24");
});

test(`25 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, without callback, no decode`, () => {
  let inp1 = "y &x#A3; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false,
  });
  equal(gatheredEntityRanges, [[2, 8]], "25");
});

test(`26 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, with callback, with decode`, () => {
  let inp1 = "y &x#A3; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    cb: (obj) => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true,
  });
  equal(gatheredEntityRanges, [[2, 8]], "26");
});

test(`27 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, without callback, with decode`, () => {
  let inp1 = "y &x#A3; z";
  let gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true,
  });
  equal(gatheredEntityRanges, [[2, 8]], "27");
});

test.run();
