import tap from "tap";
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

tap.test(
  `01 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &nbsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { name } = obj;
        gatheredBroken.push(name);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredHealthy, [[2, 8]], "01.01");
    t.strictSame(gatheredBroken, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &nbsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredHealthy, [[2, 8]], "02.01");
    t.strictSame(gatheredBroken, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &nbsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredHealthy, [], "03.01");
    t.strictSame(gatheredBroken, ["bad-html-entity-encoded-nbsp"], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &nbsp; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredHealthy, [], "04"); // <- because it's encoded and user asked unencoded
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - only healthy entities are pinged to entityCatcherCb`,
  (t) => {
    const inp1 = "y &nbsp; z &nsp;";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    });
    t.strictSame(gatheredHealthy, [[2, 8]], "05.01");
    t.strictSame(gatheredBroken, ["bad-html-entity-malformed-nbsp"], "05.02");
    t.end();
  }
);

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

tap.test(
  `06 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &isindot; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredEntityRanges, [[2, 11]], "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &isindot; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredEntityRanges, [[2, 11]], "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &isindot; z";
    const gatheredHealthy = [];
    const gatheredBroken = [];
    fix(inp1, {
      cb: (obj) => {
        gatheredBroken.push(obj);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredBroken.push([from, to]),
      decode: true,
    });

    t.strictSame(gatheredHealthy, [], "08.01");
    t.match(
      gatheredBroken,
      [
        {
          ruleName: "bad-html-entity-encoded-isindot",
          entityName: "isindot",
          rangeFrom: 2,
          rangeTo: 11,
          rangeValEncoded: "&isindot;",
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &isindot; z";
    const healthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => healthy.push([from, to]),
      decode: true,
    });

    t.strictSame(healthy, [], "09");
    t.end();
  }
);

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

tap.test(
  `10 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &nsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredBroken, ["bad-html-entity-malformed-nbsp"], "10.01");
    t.strictSame(gatheredHealthy, [], "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &nsp; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredHealthy, [], "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &nsp; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredBroken, ["bad-html-entity-malformed-nbsp"], "12.01");
    t.strictSame(gatheredHealthy, [], "12.02");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &nsp; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredHealthy, [], "13");
    t.end();
  }
);

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

tap.test(
  `14 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &abcdefg; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredBroken, ["bad-html-entity-unrecognised"], "14.01");
    t.strictSame(gatheredHealthy, [], "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &abcdefg; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredHealthy, [], "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &abcdefg; z";
    const gatheredBroken = [];
    const gatheredHealthy = [];
    fix(inp1, {
      cb: (obj) => {
        const { ruleName } = obj;
        gatheredBroken.push(ruleName);
        return obj;
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredBroken, ["bad-html-entity-unrecognised"], "16.01");
    t.strictSame(gatheredHealthy, [], "16.02");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &abcdefg; z";
    const gatheredHealthy = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredHealthy, [], "17");
    t.end();
  }
);

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

tap.test(
  `18 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &#65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredEntityRanges, [[2, 7]], "18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &#65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredEntityRanges, [[2, 7]], "19");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &#65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredEntityRanges, [[2, 7]], "20");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &#65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredEntityRanges, [[2, 7]], "21");
    t.end();
  }
);

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

tap.test(
  `22 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one broken decimal numeric entity`,
  (t) => {
    const inp1 = "y &65; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredEntityRanges, [[2, 6]], "22");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one broken decimal numeric entity`,
  (t) => {
    const inp1 = "y &#99999999999999999999; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredEntityRanges, [[2, 25]], "23");
    t.end();
  }
);

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

tap.test(
  `24 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, with callback, no decode`,
  (t) => {
    const inp1 = "y &x#A3; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredEntityRanges, [[2, 8]], "24");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, without callback, no decode`,
  (t) => {
    const inp1 = "y &x#A3; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: false,
    });
    t.strictSame(gatheredEntityRanges, [[2, 8]], "25");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, with callback, with decode`,
  (t) => {
    const inp1 = "y &x#A3; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      cb: (obj) => obj,
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredEntityRanges, [[2, 8]], "26");
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, without callback, with decode`,
  (t) => {
    const inp1 = "y &x#A3; z";
    const gatheredEntityRanges = [];
    fix(inp1, {
      entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
      decode: true,
    });
    t.strictSame(gatheredEntityRanges, [[2, 8]], "27");
    t.end();
  }
);
