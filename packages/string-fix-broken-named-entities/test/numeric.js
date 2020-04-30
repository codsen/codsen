import tap from "tap";
import fix from "../dist/string-fix-broken-named-entities.esm";

// decode on

tap.test(
  `11.001 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode within ASCII range - A`,
  (t) => {
    const inp1 = "&#65;";
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `encoded-numeric-html-entity-reference`,
          entityName: "#65",
          rangeFrom: 0,
          rangeTo: 5,
          rangeValEncoded: "&#65;",
          rangeValDecoded: "A",
        },
      ],
      "11.001"
    );
    t.end();
  }
);

tap.test(
  `11.002 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`,
  (t) => {
    const inp1 = "&#163;";
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `encoded-numeric-html-entity-reference`,
          entityName: "#163",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&#163;",
          rangeValDecoded: "\xA3",
        },
      ],
      "11.002"
    );
    t.end();
  }
);

tap.test(
  `11.003 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - non-existing number`,
  (t) => {
    const inp1 = "&#99999999999999999;";
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 20,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.003"
    );
    t.end();
  }
);

// decode off

tap.test(
  `11.004 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, within ASCII range - A`,
  (t) => {
    const inp1 = "&#65;";
    t.same(
      fix(inp1, {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "11.004"
    );
    t.end();
  }
);

tap.test(
  `11.005 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - pound`,
  (t) => {
    const inp1 = "&#163;";
    t.same(
      fix(inp1, {
        decode: false,
        cb: (obj) => obj,
      }),
      [],
      "11.005"
    );
    t.end();
  }
);

tap.test(
  `11.006 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - non-existing number`,
  (t) => {
    const inp1 = "&#99999999999999999;";
    t.same(
      fix(inp1, {
        decode: false,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 20,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.006"
    );
    t.end();
  }
);

tap.test(
  `11.007 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - dollar instead of hash`,
  (t) => {
    const inp1 = "&$65;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 5,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.007"
    );
    t.end();
  }
);

tap.test(
  `11.008 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decoding text with healthy numeric entities`,
  (t) => {
    const inp1 = "something here &#163;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
        decode: false,
      }),
      [],
      "11.008.001"
    );
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
        decode: true,
      }),
      [
        {
          ruleName: `encoded-numeric-html-entity-reference`,
          entityName: "#163",
          rangeFrom: 15,
          rangeTo: 21,
          rangeValEncoded: "&#163;",
          rangeValDecoded: "\xA3",
        },
      ],
      "11.008.002"
    );
    t.same(fix(inp1, { decode: true }), [[15, 21, "\xA3"]], "11.008.03");
    t.end();
  }
);

tap.test(
  `11.009 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`,
  (t) => {
    const inp1 = "&#xA3;";
    t.same(fix(inp1, { decode: true }), [[0, 6, "\xA3"]], "11.009.01");
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `encoded-numeric-html-entity-reference`,
          entityName: "#xA3",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: inp1,
          rangeValDecoded: "\xA3",
        },
      ],
      "11.009.02"
    );
    t.end();
  }
);

tap.test(
  `11.010 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, no decode - pound`,
  (t) => {
    const inp1 = "&x#A3;";
    t.same(
      fix(inp1, {
        decode: false,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.010"
    );
    t.end();
  }
);

tap.test(
  `11.011 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, with decode - pound`,
  (t) => {
    const inp1 = "&x#A3;";
    t.same(fix(inp1, { decode: true }), [[0, 6]], "11.011.01");
    t.same(
      fix(inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.011.02"
    );
    t.end();
  }
);

tap.test(
  `11.012 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - &#x pattern with hash missing`,
  (t) => {
    const inp1 = "&x1000;";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 7,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.012"
    );
    t.end();
  }
);

tap.test(
  `11.013 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - missing ampersand`,
  (t) => {
    const inp1 = "abc#x26;def";
    t.same(
      fix(inp1, {
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-malformed-numeric-character-entity`,
          entityName: null,
          rangeFrom: 3,
          rangeTo: 8,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.013"
    );
    t.end();
  }
);
