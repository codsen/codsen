import tap from "tap";
import fix from "./util/util";

// decode on

tap.test(
  `01 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode within ASCII range - A`,
  (t) => {
    const gathered = [];
    const inp1 = "&#65;";
    t.strictSame(
      fix(t, inp1, {
        decode: true,
        cb: (obj) => obj,
      }),
      [
        {
          ruleName: `bad-html-entity-encoded-numeric`,
          entityName: "#65",
          rangeFrom: 0,
          rangeTo: 5,
          rangeValEncoded: "&#65;",
          rangeValDecoded: "A",
        },
      ],
      "01.01"
    );
    t.strictSame(gathered, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`,
  (t) => {
    const gathered = [];
    const inp1 = "&#163;";
    t.strictSame(
      fix(t, inp1, {
        decode: true,
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-encoded-numeric`,
          entityName: "#163",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: "&#163;",
          rangeValDecoded: "\xA3",
        },
      ],
      "02.01"
    );
    t.strictSame(gathered, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - non-existing number`,
  (t) => {
    const gathered = [];
    const inp1 = "&#99999999999999999;";
    t.strictSame(
      fix(t, inp1, {
        decode: true,
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-numeric`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 20,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "03.01"
    );
    t.strictSame(gathered, [], "03.02");
    t.end();
  }
);

// decode off

tap.test(
  `04 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, within ASCII range - A`,
  (t) => {
    const gathered = [];
    const inp1 = "&#65;";
    t.strictSame(
      fix(t, inp1, {
        decode: false,
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "04.01"
    );
    t.strictSame(gathered, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - pound`,
  (t) => {
    const gathered = [];
    const inp1 = "&#163;";
    t.strictSame(
      fix(t, inp1, {
        decode: false,
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "05.01"
    );
    t.strictSame(gathered, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - non-existing number`,
  (t) => {
    const gathered = [];
    const inp1 = "&#99999999999999999;";
    t.strictSame(
      fix(t, inp1, {
        decode: false,
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-numeric`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 20,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "06.01"
    );
    t.strictSame(gathered, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - dollar instead of hash`,
  (t) => {
    const gathered = [];
    const inp1 = "&$65;";
    t.strictSame(
      fix(t, inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-numeric`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 5,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "07.01"
    );
    t.strictSame(gathered, [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decoding text with healthy numeric entities`,
  (t) => {
    const gathered = [];
    const inp1 = "something here &#163;";
    t.strictSame(
      fix(t, inp1, {
        cb: (obj) => obj,
        decode: false,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "08.01"
    );
    t.strictSame(
      fix(t, inp1, {
        cb: (obj) => obj,
        decode: true,
      }),
      [
        {
          ruleName: `bad-html-entity-encoded-numeric`,
          entityName: "#163",
          rangeFrom: 15,
          rangeTo: 21,
          rangeValEncoded: "&#163;",
          rangeValDecoded: "\xA3",
        },
      ],
      "08.02"
    );
    t.strictSame(fix(t, inp1, { decode: true }), [[15, 21, "\xA3"]], "08.03");
    t.strictSame(gathered, [], "08.04");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`,
  (t) => {
    const gathered = [];
    const inp1 = "&#xA3;";
    t.strictSame(fix(t, inp1, { decode: true }), [[0, 6, "\xA3"]], "09.01");
    t.strictSame(
      fix(t, inp1, {
        decode: true,
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-encoded-numeric`,
          entityName: "#xA3",
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: inp1,
          rangeValDecoded: "\xA3",
        },
      ],
      "09.02"
    );
    t.strictSame(gathered, [], "09.03");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, no decode - pound`,
  (t) => {
    const gathered = [];
    const inp1 = "&x#A3;";
    t.strictSame(
      fix(t, inp1, {
        decode: false,
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-numeric`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "10.01"
    );
    t.strictSame(gathered, [], "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, with decode - pound`,
  (t) => {
    const gathered = [];
    const inp1 = "&x#A3;";
    t.strictSame(fix(t, inp1, { decode: true }), [[0, 6]], "11.01");
    t.strictSame(
      fix(t, inp1, {
        decode: true,
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-numeric`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 6,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "11.02"
    );
    t.strictSame(gathered, [], "11.03");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - &#x pattern with hash missing`,
  (t) => {
    const gathered = [];
    const inp1 = "&x1000;";
    t.strictSame(
      fix(t, inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-numeric`,
          entityName: null,
          rangeFrom: 0,
          rangeTo: 7,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "12.01"
    );
    t.strictSame(gathered, [], "12.02");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - missing ampersand`,
  (t) => {
    const gathered = [];
    const inp1 = "abc#x26;def";
    t.strictSame(
      fix(t, inp1, {
        cb: (obj) => obj,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        {
          ruleName: `bad-html-entity-malformed-numeric`,
          entityName: null,
          rangeFrom: 3,
          rangeTo: 8,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "13.01"
    );
    t.strictSame(gathered, [], "13.02");
    t.end();
  }
);
