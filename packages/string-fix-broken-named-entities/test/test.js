import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";
import rangesMerge from "ranges-merge";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

function cb(obj) {
  return obj.rangeValEncoded
    ? [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]
    : [obj.rangeFrom, obj.rangeTo];
}
function cbDecoded(obj) {
  return obj.rangeValEncoded
    ? [obj.rangeFrom, obj.rangeTo, obj.rangeValDecoded]
    : [obj.rangeFrom, obj.rangeTo];
}

test(`01.001 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - 1st input arg is wrong`, t => {
  t.notThrows(() => {
    fix("");
  });
  const error1 = t.throws(() => {
    fix();
  });
  t.regex(error1.message, /THROW_ID_01/);

  const error2 = t.throws(() => {
    fix(true);
  });
  t.regex(error2.message, /THROW_ID_01/);

  const error3 = t.throws(() => {
    fix(0);
  });
  t.regex(error3.message, /THROW_ID_01/);

  const error4 = t.throws(() => {
    fix(1);
  });
  t.regex(error4.message, /THROW_ID_01/);

  const error5 = t.throws(() => {
    fix(null);
  });
  t.regex(error5.message, /THROW_ID_01/);
});

test(`01.002 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - 2nd input arg is wrong`, t => {
  const error1 = t.throws(() => {
    fix("aaa", "bbb");
  });
  t.regex(error1.message, /THROW_ID_02/);
  t.regex(error1.message, /string-type/);

  const error2 = t.throws(() => {
    fix("aaa", true);
  });
  t.regex(error2.message, /THROW_ID_02/);
  t.regex(error2.message, /boolean-type/);

  // does not throw on falsey:
  t.notThrows(() => {
    fix("zzz", null);
  });
  t.notThrows(() => {
    fix("zzz", undefined);
  });
});

// -----------------------------------------------------------------------------
// 02. special attention to nbsp - people will type it by hand often, making mistakes
// -----------------------------------------------------------------------------

test(`02.001 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, tight`, t => {
  // encoded
  const inp1 = "zzznbsp;zzznbsp;";
  const outp1 = [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.01.01 - letter + nbsp");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.01.02 - letter + nbsp + cb");
});

test(`02.002 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, spaced`, t => {
  const inp2 = "zz nbsp;zz nbsp;";
  const outp2 = [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]];
  t.deepEqual(fix(inp2), outp2, "02.02.01 - space + nbsp");
  t.deepEqual(fix(inp2, { cb }), outp2, "02.02.02 - space + nbsp + cb");
});

test(`02.003 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, linebreaks`, t => {
  const inp3 = "zz\nnbsp;zz\nnbsp;";
  const outp3 = [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]];
  t.deepEqual(fix(inp3), outp3, "02.03.01 - line break + nbsp");
  t.deepEqual(fix(inp3, { cb }), outp3, "02.03.02 - line break + nbsp");
});

test(`02.004 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, isolated`, t => {
  const inp4 = "nbsp;";
  const outp4 = [[0, 5, "&nbsp;"]];
  t.deepEqual(fix(inp4), outp4, "02.04.01");
  t.deepEqual(fix(inp4, { cb }), outp4, "02.04.02");
});

test(`02.005 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, tight, repeated`, t => {
  const inp5 = "nbsp;zzznbsp;";
  const outp5 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]];
  t.deepEqual(fix(inp5), outp5, "02.05.01");
  t.deepEqual(fix(inp5, { cb }), outp5, "02.05.02");
});

test(`02.006 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, tight, repeated + decode`, t => {
  const inp1 = "zzznbsp;zzznbsp;";
  const outp1 = [[3, 8, "\xA0"], [11, 16, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.06.01 - letter + nbsp");
  t.deepEqual(
    fix(inp1, { decode: true, cb: cbDecoded }),
    outp1,
    "02.06.02 - letter + nbsp"
  );
  t.deepEqual(
    fix(inp1, { decode: false, cb: cbDecoded }),
    outp1,
    '02.06.03 - letter + nbsp - opposite "decode" setting, cb prevails'
  );
});

test(`02.007 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, spaced, repeated + decode`, t => {
  const inp2 = "zz nbsp;zz nbsp;";
  const outp2 = [[3, 8, "\xA0"], [11, 16, "\xA0"]];
  t.deepEqual(fix(inp2, { decode: true }), outp2, "02.07.01 - space + nbsp");
  t.deepEqual(
    fix(inp2, { decode: true, cb: cbDecoded }),
    outp2,
    "02.07.02 - space + nbsp"
  );
  t.deepEqual(
    fix(inp2, { decode: false, cb: cbDecoded }),
    outp2,
    "02.07.03 - space + nbsp"
  );
});

test(`02.008 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, linebreaks, repeated + decode`, t => {
  const inp1 = "zz\nnbsp;zz\nnbsp;";
  const outp1 = [[3, 8, "\xA0"], [11, 16, "\xA0"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.08.01 - line break + nbsp"
  );
  t.deepEqual(
    fix(inp1, { decode: true, cb: cbDecoded }),
    outp1,
    "02.08.02 - line break + nbsp"
  );
  t.deepEqual(
    fix(inp1, { decode: false, cb: cbDecoded }),
    outp1,
    "02.08.03 - line break + nbsp"
  );
});

test(`02.009 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, isolated + decode`, t => {
  const inp1 = "nbsp;";
  const outp1 = [[0, 5, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.09.01");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.09.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.09.03");
});

test(`02.010 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, no semicol + decode`, t => {
  const inp1 = "nbsp;zzznbsp;";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.10.01");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.10.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.10.03");
});

test(`02.011 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, isolated`, t => {
  const inp1 = "&nbspz &nbspz";
  const outp1 = [[0, 5, "&nbsp;"], [7, 12, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.11.01 - warmup");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.11.02 - warmup");
});

test(`02.012 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, spaced`, t => {
  const inp1 = "&nbspz; &nbspz;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.12.01 - warmup");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.12.02");
});

test(`02.013 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tight`, t => {
  const inp1 = "&nbspzzz&nbspzzz&nbsp";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.13.01 - surrounded by letters");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.13.02");
});

test(`02.014 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, dots`, t => {
  const inp1 = "&nbsp...&nbsp...&nbsp";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.14.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.14.02");
});

test(`02.015 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, line breaks`, t => {
  const inp1 = "&nbsp\n\n\n&nbsp\n\n\n&nbsp";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.15.01 - surrounded by line breaks");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.15.02");
});

test(`02.016 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, well spaced`, t => {
  const inp1 = "&nbsp   &nbsp   &nbsp";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.16.01 - surrounded by spaces");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.16.02");
});

test(`02.017 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, commas`, t => {
  const inp1 = "&nbsp,&nbsp,&nbsp";
  const outp1 = [[0, 5, "&nbsp;"], [6, 11, "&nbsp;"], [12, 17, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.17.01 - surrounded by colons");
  t.deepEqual(fix(inp1), outp1, "02.17.02");
});

test(`02.018 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, digits`, t => {
  const inp1 = "&nbsp123&nbsp123&nbsp";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.18.01 - surrounded by digits");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.18.02");
});

test(`02.019 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tabs`, t => {
  const inp1 = "&nbsp\t\t\t&nbsp\t\t\t&nbsp";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.19.01 - surrounded by tabs");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.19.02");
});

test(`02.020 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, letter + decode`, t => {
  const inp1 = "&nbspz &nbspz";
  const outp1 = [[0, 5, "\xA0"], [7, 12, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.20.01 - warmup");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.20.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.20.03");
});

test(`02.021 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, spaced + decode`, t => {
  const inp1 = "&nbspz; &nbspz;";
  const outp1 = [[0, 7, "\xA0"], [8, 15, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.21.01 - warmup");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.21.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.21.03");
});

test(`02.022 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tight + decode`, t => {
  const inp1 = "&nbspzzz&nbspzzz&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.22.01 - surrounded by letters"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.22.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.22.03");
});

test(`02.023 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, dots + decode`, t => {
  const inp1 = "&nbsp...&nbsp...&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.23.01 - surrounded by dots"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.23.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.23.03");
});

test(`02.024 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, line breaks + decode`, t => {
  const inp1 = "&nbsp\n\n\n&nbsp\n\n\n&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.24.01 - surrounded by line breaks"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.24.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.24.03");
});

test(`02.025 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, well spaced + decode`, t => {
  const inp1 = "&nbsp   &nbsp   &nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.25.01 - surrounded by spaces"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.25.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.25.03");
});

test(`02.026 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, commas + decode`, t => {
  const inp1 = "&nbsp,&nbsp,&nbsp";
  const outp1 = [[0, 5, "\xA0"], [6, 11, "\xA0"], [12, 17, "\xA0"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.26.01 - surrounded by colons"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.26.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.26.03");
});

test(`02.027 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, digits + decode`, t => {
  const inp1 = "&nbsp123&nbsp123&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.27.01 - surrounded by digits"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.27.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.27.03");
});

test(`02.028 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tabs + decode`, t => {
  const inp1 = "&nbsp\t\t\t&nbsp\t\t\t&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.28.01 - surrounded by tabs"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.28.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.28.03");
});

test(`02.029 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, no semicol, trailing letter`, t => {
  const inp1 = "nbspz";
  const outp1 = [[0, 4, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.29.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.29.01");
});

test(`02.030 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing letter, sandwitched`, t => {
  const inp1 = "nbspzzznbspzzznbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.30.01 - surrounded by letters");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.30.02");
});

test(`02.031 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing dots, sandwitched`, t => {
  const inp1 = "nbsp...nbsp...nbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.31.01 - surrounded by dots");
  t.deepEqual(fix(inp1), outp1, "02.31.02");
});

test(`02.032 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing linebreaks, sandwitched`, t => {
  const inp1 = "nbsp\n\n\nnbsp\n\n\nnbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.32.01 - surrounded by line breaks");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.32.02");
});

test(`02.033 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing whitespace chunks, sandwitched`, t => {
  const inp1 = "nbsp   nbsp   nbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.33.01 - surrounded by spaces");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.33.02");
});

test(`02.034 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing tight commas, sandwitched`, t => {
  const inp1 = "nbsp,nbsp,nbsp";
  const outp1 = [[0, 4, "&nbsp;"], [5, 9, "&nbsp;"], [10, 14, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.34.01 - surrounded by colons");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.34.02");
});

test(`02.035 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing digits, sandwitched`, t => {
  const inp1 = "nbsp123nbsp123nbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.35.01 - surrounded by digits");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.35.02");
});

test(`02.036 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing tight tabs, sandwitched`, t => {
  const inp1 = "nbsp\t\t\tnbsp\t\t\tnbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.36.01 - surrounded by tabs");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.36.02");
});

test(`02.037 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - repeated characters - complete set - \u001b[${36}m${`repeated`}\u001b[${39}m amp, tight, leading letters`, t => {
  const inp1 = "&&nbsp;x&&nbsp;y&&nbsp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.37.01 - duplicate ampersand");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.37.02");
});

test(`02.038 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate n`, t => {
  const inp1 = "&nnbsp;x&nnbsp;y&nnbsp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.38.01 - duplicate n");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.38.02");
});

test(`02.039 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate b`, t => {
  const inp1 = "&nbbsp;x&nbbsp;y&nbbsp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.39.01 - duplicate b");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.39.02");
});

test(`02.040 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate s`, t => {
  const inp1 = "&nbssp;x&nbssp;y&nbssp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.40.01 - duplicate s");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.40.02");
});

test(`02.041 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate p`, t => {
  const inp1 = "&nbspp;x&nbspp;y&nbspp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.41.01 - duplicate p");
  t.deepEqual(fix(inp1), outp1, "02.41.02");
});

test(`02.042 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol`, t => {
  const inp1 = "&nbsp;;x&nbsp;;y&nbsp;;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.42.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.42.02");
});

test(`02.043 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + n missing`, t => {
  const inp1 = "&&bsp;x&&bsp;y&&bsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.43.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.43.02");
});

test(`02.044 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + b missing`, t => {
  const inp1 = "&&nsp;x&&nsp;y&&nsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.44.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.44.02");
});

test(`02.045 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + s missing`, t => {
  const inp1 = "&&nbp;x&&nbp;y&&nbp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.45.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.45.02");
});

test(`02.046 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + p missing`, t => {
  const inp1 = "&&nbs;x&&nbs;y&&nbs;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.46.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.46.02");
});

test(`02.047 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand - semicol missing`, t => {
  const inp1 = "&&nbspx&&nbspy&&nbsp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.47.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.47.02");
});

test(`02.048 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - ampersand missing`, t => {
  // repeated n + ...
  const inp1 = "nnbsp;xnnbsp;ynnbsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.48.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.48.02");
});

test(`02.049 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - b missing`, t => {
  const inp1 = "&nnsp;x&nnsp;y&nnsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.49.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.49.02");
});

test(`02.050 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - s missing`, t => {
  const inp1 = "&nnbp;x&nnbp;y&nnbp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.50.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.50.02");
});

test(`02.051 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - s missing`, t => {
  const inp1 = "&nnbs;x&nnbs;y&nnbs;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.51.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.51.02");
});

test(`02.052 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - semicol missing`, t => {
  const inp1 = "&nnbspx&nnbspy&nnbsp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.52.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.52.02");
});

test(`02.053 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - ampersand missing`, t => {
  const inp1 = "nbbsp;xnbbsp;ynbbsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.53.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.53.02");
});

test(`02.054 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - n missing`, t => {
  const inp1 = "&bbsp;x&bbsp;y&bbsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.54.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.54.02");
});

test(`02.055 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - s missing`, t => {
  const inp1 = "&nbbp;x&nbbp;y&nbbp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.55.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.55.02");
});

test(`02.056 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - p missing`, t => {
  const inp1 = "&nbbs;x&nbbs;y&nbbs;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.56.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.56.02");
});

test(`02.057 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - semicol missing`, t => {
  const inp1 = "&nbbspx&nbbspy&nbbsp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.57.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.57.02");
});

test(`02.058 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - ampersand missing`, t => {
  const inp1 = "nbssp;xnbssp;ynbssp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.58.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.58.02");
});

test(`02.059 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - n missing`, t => {
  const inp1 = "&bssp;x&bssp;y&bssp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.59.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.59.02");
});

test(`02.060 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - b missing`, t => {
  const inp1 = "&nssp;x&nssp;y&nssp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.60.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.60.02");
});

test(`02.061 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - p missing`, t => {
  const inp1 = "&nbss;x&nbss;y&nbss;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.61.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.61.02");
});

test(`02.062 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - semicol missing`, t => {
  const inp1 = "&nbsspx&nbsspy&nbssp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.62.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.62.02");
});

test(`02.063 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - ampersand missing`, t => {
  const inp1 = "nbspp;xnbspp;ynbspp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.63.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.63.02");
});

test(`02.064 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - n missing`, t => {
  const inp1 = "&bspp;x&bspp;y&bspp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.64.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.64.02");
});

test(`02.065 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - b missing`, t => {
  const inp1 = "&nspp;x&nspp;y&nspp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.65.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.65.02");
});

test(`02.066 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - s missing`, t => {
  const inp1 = "&nbpp;x&nbpp;y&nbpp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.66.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.66.02");
});

test(`02.067 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - semicol missing`, t => {
  const inp1 = "&nbsppx&nbsppy&nbspp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.67.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.67.02");
});

test(`02.068 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - ampersand missing`, t => {
  const inp1 = "nbsp;;xnbsp;;ynbsp;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.68.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.68.02");
});

test(`02.069 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - n missing`, t => {
  const inp1 = "&bsp;;x&bsp;;y&bsp;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.69.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.69.02");
});

test(`02.070 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - b missing`, t => {
  const inp1 = "&nsp;;x&nsp;;y&nsp;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.70.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.70.02");
});

test(`02.071 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - s missing`, t => {
  const inp1 = "&nbp;;x&nbp;;y&nbp;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.71.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.71.02");
});

test(`02.072 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - p missing`, t => {
  const inp1 = "&nbs;;x&nbs;;y&nbs;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.72.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.72.02");
});

// dangerous stuff: missing ampersand and one letter (semicol present)

test(`02.073 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - letter on the left, EOL on the right`, t => {
  t.deepEqual(fix("zzzzbsp;"), [[4, 8, "&nbsp;"]], "02.73.01");
  t.deepEqual(fix("zzzznsp;"), [[4, 8, "&nbsp;"]], "02.73.02");
  t.deepEqual(fix("zzzznbp;"), [[4, 8, "&nbsp;"]], "02.73.03");
  t.deepEqual(fix("zzzznbs;"), [[4, 8, "&nbsp;"]], "02.73.04");
});

test(`02.074 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - letter on the right, EOL on the left`, t => {
  t.deepEqual(fix("bsp;zzzz"), [[0, 4, "&nbsp;"]], "02.74.01");
  t.deepEqual(fix("nsp;zzzz"), [[0, 4, "&nbsp;"]], "02.74.02");
  t.deepEqual(fix("nbp;zzzz"), [[0, 4, "&nbsp;"]], "02.74.03");
  t.deepEqual(fix("nbs;zzzz"), [[0, 4, "&nbsp;"]], "02.74.04");
});

test(`02.075 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - EOL on both sides`, t => {
  t.deepEqual(fix("bsp;"), [[0, 4, "&nbsp;"]], "02.75.01");
  t.deepEqual(fix("nsp;"), [[0, 4, "&nbsp;"]], "02.75.02");
  t.deepEqual(fix("nbp;"), [[0, 4, "&nbsp;"]], "02.75.03");
  t.deepEqual(fix("nbs;"), [[0, 4, "&nbsp;"]], "02.75.04");
});

test(`02.076 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - space on either side, letter on the left`, t => {
  t.deepEqual(fix("aaaa bsp;"), [[5, 9, "&nbsp;"]], "02.76.01");
  t.deepEqual(fix("aaaa nsp;"), [[5, 9, "&nbsp;"]], "02.76.02");
  t.deepEqual(fix("aaaa nbp;"), [[5, 9, "&nbsp;"]], "02.76.03");
  t.deepEqual(fix("aaaa nbs;"), [[5, 9, "&nbsp;"]], "02.76.04");
});

test(`02.077 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - space on either side, letter on the right`, t => {
  t.deepEqual(fix("bsp; aaaa"), [[0, 4, "&nbsp;"]], "02.77.01");
  t.deepEqual(fix("nsp; aaaa"), [[0, 4, "&nbsp;"]], "02.77.02");
  t.deepEqual(fix("nbp; aaaa"), [[0, 4, "&nbsp;"]], "02.77.03");
  t.deepEqual(fix("nbs; aaaa"), [[0, 4, "&nbsp;"]], "02.77.04");
});

test(`02.078 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - space on either side, letters outside`, t => {
  t.deepEqual(fix("aaaa bsp; aaaa"), [[5, 9, "&nbsp;"]], "02.78.01");
  t.deepEqual(fix("aaaa nsp; aaaa"), [[5, 9, "&nbsp;"]], "02.78.02");
  t.deepEqual(fix("aaaa nbp; aaaa"), [[5, 9, "&nbsp;"]], "02.78.03");
  t.deepEqual(fix("aaaa nbs; aaaa"), [[5, 9, "&nbsp;"]], "02.78.04");
});

test(`02.079 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling (ampersand missing), incomplete set`, t => {
  t.deepEqual(
    fix("aaaa bsp; aaaa", { decode: true }),
    [[5, 9, "\xA0"]],
    "02.79.01"
  );
  t.deepEqual(
    fix("aaaa nsp; aaaa", { decode: true }),
    [[5, 9, "\xA0"]],
    "02.79.02"
  );
  t.deepEqual(
    fix("aaaa nbp; aaaa", { decode: true }),
    [[5, 9, "\xA0"]],
    "02.79.03"
  );
  t.deepEqual(
    fix("aaaa nbs; aaaa", { decode: true }),
    [[5, 9, "\xA0"]],
    "02.79.04"
  );
});

test(`02.080 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`at least one of each of the set`}\u001b[${39}m [n, b, s, p] \u001b[${32}m${`is present, repetitions`}\u001b[${39}m - n trailing`, t => {
  // any repetitions whatsoever like &&&&&nnnbbbssssp;;;
  t.deepEqual(fix("aaa&nnnbbssssppp;nnn"), [[3, 17, "&nbsp;"]], "02.80.01");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;nnn"), [[3, 20, "&nbsp;"]], "02.80.02");
  t.deepEqual(fix("aaa&nnnbbssssppp nnn"), [[3, 16, "&nbsp;"]], "02.80.03");
  t.deepEqual(fix("aaa&nnnbbssssp nnn"), [[3, 14, "&nbsp;"]], "02.80.04");
  t.deepEqual(fix("aaa&nnnbbssssp,nnn"), [[3, 14, "&nbsp;"]], "02.80.05");
  t.deepEqual(fix("aaa&nnnbbssssp.nnn"), [[3, 14, "&nbsp;"]], "02.80.06");
  t.deepEqual(fix("aaa&nnnbbssssp?nnn"), [[3, 14, "&nbsp;"]], "02.80.07");
  t.deepEqual(fix("aaa&nnnbbssssp-nnn"), [[3, 14, "&nbsp;"]], "02.80.08");
  t.deepEqual(fix("aaa&nnnbbssssp;nnn"), [[3, 15, "&nbsp;"]], "02.80.09");
  t.deepEqual(fix("aaa&nnnbbssssp\nnnn"), [[3, 14, "&nbsp;"]], "02.80.10");
});

test(`02.081 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`at least one of each of the set`}\u001b[${39}m [n, b, s, p] \u001b[${32}m${`is present, repetitions`}\u001b[${39}m - b trailing`, t => {
  t.deepEqual(fix("aaa&nnnbbssssppp;bbb"), [[3, 17, "&nbsp;"]], "02.81.11");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;bbb"), [[3, 20, "&nbsp;"]], "02.81.12");
  t.deepEqual(fix("aaa&nnnbbssssppp bbb"), [[3, 16, "&nbsp;"]], "02.81.13");
  t.deepEqual(fix("aaa&nnnbbssssp bbb"), [[3, 14, "&nbsp;"]], "02.81.14");
  t.deepEqual(fix("aaa&nnnbbssssp,bbb"), [[3, 14, "&nbsp;"]], "02.81.15");
  t.deepEqual(fix("aaa&nnnbbssssp.bbb"), [[3, 14, "&nbsp;"]], "02.81.16");
  t.deepEqual(fix("aaa&nnnbbssssp?bbb"), [[3, 14, "&nbsp;"]], "02.81.17");
  t.deepEqual(fix("aaa&nnnbbssssp-bbb"), [[3, 14, "&nbsp;"]], "02.81.18");
  t.deepEqual(fix("aaa&nnnbbssssp;bbb"), [[3, 15, "&nbsp;"]], "02.81.19");
  t.deepEqual(fix("aaa&nnnbbssssp\nbbb"), [[3, 14, "&nbsp;"]], "02.81.20");
});

test(`02.082 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`at least one of each of the set`}\u001b[${39}m [n, b, s, p] \u001b[${32}m${`is present, repetitions`}\u001b[${39}m - s trailing`, t => {
  t.deepEqual(fix("aaa&nnnbbssssppp;sss"), [[3, 17, "&nbsp;"]], "02.82.21");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;sss"), [[3, 20, "&nbsp;"]], "02.82.22");
  t.deepEqual(fix("aaa&nnnbbssssppp sss"), [[3, 16, "&nbsp;"]], "02.82.23");
  t.deepEqual(fix("aaa&nnnbbssssp sss"), [[3, 14, "&nbsp;"]], "02.82.24");
  t.deepEqual(fix("aaa&nnnbbssssp,sss"), [[3, 14, "&nbsp;"]], "02.82.25");
  t.deepEqual(fix("aaa&nnnbbssssp.sss"), [[3, 14, "&nbsp;"]], "02.82.26");
  t.deepEqual(fix("aaa&nnnbbssssp?sss"), [[3, 14, "&nbsp;"]], "02.82.27");
  t.deepEqual(fix("aaa&nnnbbssssp-sss"), [[3, 14, "&nbsp;"]], "02.82.28");
  t.deepEqual(fix("aaa&nnnbbssssp;sss"), [[3, 15, "&nbsp;"]], "02.82.29");
  t.deepEqual(fix("aaa&nnnbbssssp\nsss"), [[3, 14, "&nbsp;"]], "02.82.30");
});

test(`02.083 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`at least one of each of the set`}\u001b[${39}m [n, b, s, p] \u001b[${32}m${`is present, repetitions`}\u001b[${39}m - p trailing`, t => {
  t.deepEqual(fix("aaa&nnnbbssssppp;ppp"), [[3, 17, "&nbsp;"]], "02.83.31");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;ppp"), [[3, 20, "&nbsp;"]], "02.83.32");
  t.deepEqual(fix("aaa&nnnbbssssppp ppp"), [[3, 16, "&nbsp;"]], "02.83.33");
  t.deepEqual(fix("aaa&nnnbbssssp ppp"), [[3, 14, "&nbsp;"]], "02.83.34");
  t.deepEqual(fix("aaa&nnnbbssssp,ppp"), [[3, 14, "&nbsp;"]], "02.83.35");
  t.deepEqual(fix("aaa&nnnbbssssp.ppp"), [[3, 14, "&nbsp;"]], "02.83.36");
  t.deepEqual(fix("aaa&nnnbbssssp?ppp"), [[3, 14, "&nbsp;"]], "02.83.37");
  t.deepEqual(fix("aaa&nnnbbssssp-ppp"), [[3, 14, "&nbsp;"]], "02.83.38");
  t.deepEqual(fix("aaa&nnnbbssssp;ppp"), [[3, 15, "&nbsp;"]], "02.83.39");
  t.deepEqual(fix("aaa&nnnbbssssp\nppp"), [[3, 14, "&nbsp;"]], "02.83.40");
});

test(`02.084 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`recursively encoded entities`}\u001b[${39}m - twice`, t => {
  const inp1 = "a&amp;nbsp;b";
  const outp1 = [[1, 11, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.84.01 - twice-encoded");
  t.deepEqual(rangesMerge(fix(inp1, { cb })), outp1, "02.84.02");
});

test(`02.085 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`recursively encoded entities`}\u001b[${39}m - thrice`, t => {
  const inp1 = "a&amp;amp;nbsp;b";
  const outp1 = [[1, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.85.01");
  t.deepEqual(rangesMerge(fix(inp1, { cb })), outp1, "02.85.02");
});

test(`02.086 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`recursively encoded entities`}\u001b[${39}m - quadruple`, t => {
  const inp1 = "a&amp;amp;amp;nbsp;b";
  const outp1 = [[1, 19, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.86.01");
  t.deepEqual(rangesMerge(fix(inp1, { cb })), outp1, "02.86.02");
});

test(`02.087 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`capital N, no ampersand, no semicolon`}\u001b[${39}m - leading semicolon, tight`, t => {
  const inp1 = "text;Nbsptext";
  const outp1 = [[5, 9, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.87.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.87.02");
});

test(`02.088 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`capital N, no ampersand, no semicolon`}\u001b[${39}m - leading space`, t => {
  const inp1 = "text Nbsptext";
  const outp1 = [[5, 9, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.88.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.88.02");
});

test(`02.089 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`capital N, no ampersand, no semicolon`}\u001b[${39}m - decoded`, t => {
  // decode
  const inp1 = "text;Nbsptext";
  const outp1 = [[5, 9, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.89.01");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.89.02");
});

test(`02.090 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`capital N, no ampersand, no semicolon`}\u001b[${39}m - leading space - decoded`, t => {
  const inp1 = "text Nbsptext";
  const outp1 = [[5, 9, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.90.01");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.90.02");
});

test(`02.091 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing semicolon when ampersand is present`}\u001b[${39}m - P capital`, t => {
  const inp1 = "&nBsPzzz&nBsPzzz";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.91.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.91.02");
});

test(`02.092 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing semicolon when ampersand is present`}\u001b[${39}m - S capital`, t => {
  const inp1 = "&NbSpzzz&NbSpzzz";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.92.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.92.02");
});

test(`02.093 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N capital`, t => {
  const inp1 = "textNbsp;texttextNbsp;text";
  const outp1 = [[4, 9, "&nbsp;"], [17, 22, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.93.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.93.02");
});

test(`02.094 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N & S capitals`, t => {
  const inp1 = "&&NbSpzzz&&NbSpzzz";
  const outp1 = [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.94.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.94.02");
});

test(`02.095 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N & S capitals, repetition`, t => {
  const inp1 = "&NbSspzzz&NbSspzzz";
  const outp1 = [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.95.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.95.02");
});

test(`02.096 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition`, t => {
  const inp1 = "&NbSsPzzz&NbSsPzzz";
  const outp1 = [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.96.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.96.02");
});

test(`02.097 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition, trailing space, tight`, t => {
  const inp1 = "&NbSsP zzz&NbSsP zzz";
  const outp1 = [[0, 6, "&nbsp;"], [10, 16, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.97.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.97.02");
});

test(`02.098 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition, trailing space, spaced`, t => {
  const inp1 = "&NbSsP zzz &NbSsP zzz";
  const outp1 = [[0, 6, "&nbsp;"], [11, 17, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.98.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.98.02");
});

test(`02.099 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - full set`, t => {
  const inp1 = "a&bnsp;b&nsbp;c&nspb;";
  const outp1 = [[1, 7, "&nbsp;"], [8, 14, "&nbsp;"], [15, 21, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.99.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.99.02");
});

test(`02.100 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - one missing`, t => {
  const inp1 = "abnsp;bnsbp;cnspb;";
  const outp1 = [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.100.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.100.02");
});

test(`02.101 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - n missing`, t => {
  const inp1 = "a&bsp;b&sbp;c&spb;";
  const outp1 = [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.101.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.101.02");
});

test(`02.102 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - b missing`, t => {
  const inp1 = "a&nsp;b&nsp;c&nsp;";
  const outp1 = [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.102.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.102.02");
});

test(`02.103 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - s missing`, t => {
  const inp1 = "a&bnp;b&nbp;c&npb;";
  const outp1 = [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.103.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.103.02");
});

test(`02.104 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - p missing`, t => {
  const inp1 = "a&bns;b&nsb;c&nsb;";
  const outp1 = [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.104.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.104.02");
});

test(`02.105 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - very very suspicious cases - last b is considered to be text`, t => {
  // when a sequence of more than four letters of a set is encountered,
  // if there is a full set of 4 characters (n, b, s and p) detected, fifth
  // and others will be assumed to be not a part of an entity, unless it's a
  // repetition.
  const inp1 = "a&bnspb";
  const outp1 = [[1, 6, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.105.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.105.02");
});

test(`02.106 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - very very suspicious cases - last z is considered to be text`, t => {
  const inp1 = "a&bnspz";
  const outp1 = [[1, 6, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.106.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.106.02");
});

test(`02.107 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - very very suspicious cases - last b is still considered to be text`, t => {
  const inp1 = "a&bnnspb";
  const outp1 = [[1, 7, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.107.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.107.02");
});

test(`02.108 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`n`}\u001b[${39}m-\u001b[${33}m${`b`}\u001b[${39}m-\u001b[${32}m${`s`}\u001b[${39}m-\u001b[${34}m${`p`}\u001b[${39}m set plus another letter`, t => {
  t.deepEqual(fix("&nbspx;"), [[0, 7, "&nbsp;"]], "02.108.01");
  t.deepEqual(fix("&nbspn;"), [[0, 7, "&nbsp;"]], "02.108.02");
  t.deepEqual(fix("&nbspb;"), [[0, 7, "&nbsp;"]], "02.108.03");
  t.deepEqual(fix("&nbsps;"), [[0, 7, "&nbsp;"]], "02.108.04");
  t.deepEqual(fix("&nbspp;"), [[0, 7, "&nbsp;"]], "02.108.05");
  t.deepEqual(fix("&nbsp.;"), [[0, 7, "&nbsp;"]], "02.108.06");
});

test(`02.109 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`n`}\u001b[${39}m-\u001b[${33}m${`b`}\u001b[${39}m-\u001b[${32}m${`s`}\u001b[${39}m-\u001b[${34}m${`p`}\u001b[${39}m set plus another letter plus semicols`, t => {
  const inp1 = "a&nbspl;;b";
  const outp1 = [[1, 9, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.109.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.109.02");
});

test(`02.110 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`n`}\u001b[${39}m-\u001b[${33}m${`b`}\u001b[${39}m-\u001b[${32}m${`s`}\u001b[${39}m-\u001b[${34}m${`p`}\u001b[${39}m with one letter missing plus another letter`, t => {
  t.deepEqual(fix("&nspx;"), [[0, 6, "&nbsp;"]], "02.110.01");
  t.deepEqual(fix("&nbpy;"), [[0, 6, "&nbsp;"]], "02.110.02");
  t.deepEqual(fix("&n_sp;"), [[0, 6, "&nbsp;"]], "02.110.03");
});

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

test(`03.001 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - do not touch healthy &nbsp;`, t => {
  t.deepEqual(fix("&nbsp;"), null, "03.001.01 - one, surrounded by EOL");
  t.deepEqual(fix("&nbsp; &nbsp;"), null, "03.001.02 - two, surrounded by EOL");
  t.deepEqual(fix("a&nbsp;b"), null, "03.001.03 - surrounded by letters");

  // decode
  t.deepEqual(
    fix("&nbsp;", { decode: true }),
    null,
    "03.001.04 - one, surrounded by EOL"
  );
  t.deepEqual(
    fix("&nbsp; &nbsp;", { decode: true }),
    null,
    "03.001.05 - two, surrounded by EOL"
  );
  t.deepEqual(
    fix("a&nbsp;b", { decode: true }),
    null,
    "03.001.06 - surrounded by letters"
  );
});

test(`03.002 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - more false positives`, t => {
  t.deepEqual(fix("insp;"), null, "03.002.01");
  t.deepEqual(fix("an insp;"), null, "03.002.02");
  t.deepEqual(fix("an inspp;"), null, "03.002.03");

  // decode on:
  t.deepEqual(fix("insp;", { decode: true }), null, "03.002.04");
  t.deepEqual(fix("an insp;", { decode: true }), null, "03.002.05");
  t.deepEqual(fix("an inspp;", { decode: true }), null, "03.002.06");
});

test(`03.003 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - first bug spotted - v1.0.1 release`, t => {
  t.deepEqual(fix("z&hairsp;y"), null, "03.003.01");
  t.deepEqual(fix("y&VeryThinSpace;z"), null, "03.003.02");

  // decode on:
  t.deepEqual(fix("z&hairsp;y", { decode: true }), null, "03.003.03");
  t.deepEqual(fix("y&VeryThinSpace;z", { decode: true }), null, "03.003.04");
});

// -----------------------------------------------------------------------------
// 04. other entities
// -----------------------------------------------------------------------------

test(`04.001 - ${`\u001b[${36}m${`various named HTML entities`}\u001b[${39}m`} - \u001b[${32}m${`various tests`}\u001b[${39}m - no decode`, t => {
  t.deepEqual(
    fix("text &ang text&ang text"),
    [[5, 9, "&ang;"], [14, 18, "&ang;"]],
    "04.001.01"
  );
  t.deepEqual(
    fix("text&angtext&angtext"),
    [[4, 8, "&ang;"], [12, 16, "&ang;"]],
    "04.001.02"
  );
  t.deepEqual(
    fix("text&angsttext&angsttext"),
    [[4, 10, "&angst;"], [14, 20, "&angst;"]],
    "04.001.03"
  );
  t.deepEqual(
    fix("text&pitext&pitext"),
    [[4, 7, "&pi;"], [11, 14, "&pi;"]],
    "04.001.04"
  );
  t.deepEqual(
    fix("text&pivtext&pivtext"),
    [[4, 8, "&piv;"], [12, 16, "&piv;"]],
    "04.001.05"
  );
  t.deepEqual(
    fix("text&Pitext&Pitext"),
    [[4, 7, "&Pi;"], [11, 14, "&Pi;"]],
    "04.001.06"
  );
  t.deepEqual(
    fix("text&sigmatext&sigmatext"),
    [[4, 10, "&sigma;"], [14, 20, "&sigma;"]],
    "04.001.07"
  );
  t.deepEqual(
    fix("text&subtext&subtext"),
    [[4, 8, "&sub;"], [12, 16, "&sub;"]],
    "04.001.08"
  );
  t.deepEqual(
    fix("text&suptext&suptext"),
    [[4, 8, "&sup;"], [12, 16, "&sup;"]],
    "04.001.09"
  );
  t.deepEqual(
    fix("text&thetatext&thetatext"),
    [[4, 10, "&theta;"], [14, 20, "&theta;"]],
    "04.001.10"
  );
  t.deepEqual(
    fix("a &thinsp b\n&thinsp\nc"),
    [[2, 9, "&thinsp;"], [12, 19, "&thinsp;"]],
    "04.001.11"
  );
  t.deepEqual(fix("&thinsp"), [[0, 7, "&thinsp;"]], "04.001.12");
  t.deepEqual(
    fix("&thinsp&thinsp"),
    [[0, 14, "&thinsp;&thinsp;"]],
    "04.001.13 - joins"
  );
});

test(`04.002 - ${`\u001b[${36}m${`various named HTML entities`}\u001b[${39}m`} - \u001b[${32}m${`various tests`}\u001b[${39}m - with decode`, t => {
  t.deepEqual(
    fix("text &ang text&ang text", { decode: true }),
    [[5, 9, "\u2220"], [14, 18, "\u2220"]],
    "04.002.01"
  );
  t.deepEqual(
    fix("text&angtext&angtext", { decode: true }),
    [[4, 8, "\u2220"], [12, 16, "\u2220"]],
    "04.002.02"
  );
  t.deepEqual(
    fix("text&angsttext&angsttext", { decode: true }),
    [[4, 10, "\xC5"], [14, 20, "\xC5"]],
    "04.002.03"
  );
  t.deepEqual(
    fix("text&pitext&pitext", { decode: true }),
    [[4, 7, "\u03C0"], [11, 14, "\u03C0"]],
    "04.002.04"
  );
  t.deepEqual(
    fix("text&pivtext&pivtext", { decode: true }),
    [[4, 8, "\u03D6"], [12, 16, "\u03D6"]],
    "04.002.05"
  );
  t.deepEqual(
    fix("text&Pitext&Pitext", { decode: true }),
    [[4, 7, "\u03A0"], [11, 14, "\u03A0"]],
    "04.002.06"
  );
  t.deepEqual(
    fix("text&sigmatext&sigmatext", { decode: true }),
    [[4, 10, "\u03C3"], [14, 20, "\u03C3"]],
    "04.002.07"
  );
  t.deepEqual(
    fix("text&subtext&subtext", { decode: true }),
    [[4, 8, "\u2282"], [12, 16, "\u2282"]],
    "04.002.08"
  );
  t.deepEqual(
    fix("text&suptext&suptext", { decode: true }),
    [[4, 8, "\u2283"], [12, 16, "\u2283"]],
    "04.002.09"
  );
  t.deepEqual(
    fix("text&thetatext&thetatext", { decode: true }),
    [[4, 10, "\u03B8"], [14, 20, "\u03B8"]],
    "04.002.10"
  );
  t.deepEqual(
    fix("a &thinsp b\n&thinsp\nc", { decode: true }),
    [[2, 9, "\u2009"], [12, 19, "\u2009"]],
    "04.002.11"
  );
  t.deepEqual(
    fix("&thinsp", { decode: true }),
    [[0, 7, "\u2009"]],
    "04.002.12"
  );
  t.deepEqual(
    fix("&thinsp&thinsp", { decode: true }),
    [[0, 14, "\u2009\u2009"]],
    "04.002.13 - joins"
  );
});

// -----------------------------------------------------------------------------
// 05. opts.cb
// -----------------------------------------------------------------------------

test(`05.001 - ${`\u001b[${31}m${`opts.cb`}\u001b[${39}m`} - \u001b[${33}m${`default callback`}\u001b[${39}m mimicking non-cb result`, t => {
  t.deepEqual(
    fix("zzznbsp;zzznbsp;", {
      cb
    }),
    [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]],
    "05.001 - letter + nbsp"
  );
});

test(`05.002 - ${`\u001b[${31}m${`opts.cb`}\u001b[${39}m`} - \u001b[${34}m${`emlint issue spec callback`}\u001b[${39}m `, t => {
  t.deepEqual(
    fix("zzznbsp;zzznbsp;", {
      cb: oodles => {
        // {
        //   fixName: "missing semicolon on &pi; (don't confuse with &piv;)",
        //   entityName: "pi",
        //   rangeFrom: i,
        //   rangeTo: i + 3,
        //   rangeValEncoded: "&pi;",
        //   rangeValDecoded: "\u03C0"
        // }
        return {
          name: oodles.fixName,
          position:
            oodles.rangeValEncoded != null
              ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded]
              : [oodles.rangeFrom, oodles.rangeTo]
        };
      }
    }),
    [
      {
        name: "malformed &nbsp;",
        position: [3, 8, "&nbsp;"]
      },
      {
        name: "malformed &nbsp;",
        position: [11, 16, "&nbsp;"]
      }
    ],
    "05.002"
  );
});

// Tend the following:
// aacute
// eacute
// zwj
