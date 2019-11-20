// avanotonly

import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// helper functions
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

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

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
    fix("zzz", {});
  });
  t.notThrows(() => {
    fix("zzz", undefined);
  });
});

test(`01.003 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.cb is not function`, t => {
  const error1 = t.throws(() => {
    fix("aaa", { cb: "bbb" });
  });
  t.regex(error1.message, /THROW_ID_03/);
  t.regex(error1.message, /string/);
});

test(`01.004 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.progressFn is not function`, t => {
  const error1 = t.throws(() => {
    fix("aaa", { progressFn: "bbb" });
  });
  t.regex(error1.message, /THROW_ID_04/);
  t.regex(error1.message, /string/);
});

// -----------------------------------------------------------------------------
// 02. special attention to nbsp - people will type it by hand often, making mistakes
// -----------------------------------------------------------------------------

test(`02.001 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, tight`, t => {
  const inp1 = "zzznbsp;zzznbsp;";
  const outp1 = [
    [3, 8, "&nbsp;"],
    [11, 16, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.001.01 - letter + nbsp");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.001.02 - letter + nbsp + cb");
});

test(`02.002 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, spaced`, t => {
  const inp2 = "zz nbsp;zz nbsp;";
  const outp2 = [
    [3, 8, "&nbsp;"],
    [11, 16, "&nbsp;"]
  ];
  t.deepEqual(fix(inp2), outp2, "02.002.01 - space + nbsp");
  t.deepEqual(fix(inp2, { cb }), outp2, "02.002.02 - space + nbsp + cb");
});

test(`02.003 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, linebreaks`, t => {
  const inp3 = "zz\nnbsp;zz\nnbsp;";
  const outp3 = [
    [3, 8, "&nbsp;"],
    [11, 16, "&nbsp;"]
  ];
  t.deepEqual(fix(inp3), outp3, "02.003.01 - line break + nbsp");
  t.deepEqual(fix(inp3, { cb }), outp3, "02.003.02 - line break + nbsp");
});

test(`02.004 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, isolated`, t => {
  const inp4 = "nbsp;";
  const outp4 = [[0, 5, "&nbsp;"]];
  t.deepEqual(fix(inp4), outp4, "02.004.01");
  t.deepEqual(fix(inp4, { cb }), outp4, "02.004.02");
});

test(`02.005 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, tight, repeated`, t => {
  const inp5 = "nbsp;zzznbsp;";
  const outp5 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"]
  ];
  t.deepEqual(fix(inp5), outp5, "02.005.01");
  t.deepEqual(fix(inp5, { cb }), outp5, "02.005.02");
});

test(`02.006 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, tight, repeated + decode`, t => {
  const inp1 = "zzznbsp;zzznbsp;";
  const outp1 = [
    [3, 8, "\xA0"],
    [11, 16, "\xA0"]
  ];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.006.01 - letter + nbsp");
  t.deepEqual(
    fix(inp1, { decode: true, cb: cbDecoded }),
    outp1,
    "02.006.02 - letter + nbsp"
  );
  t.deepEqual(
    fix(inp1, { decode: false, cb: cbDecoded }),
    outp1,
    '02.06.03 - letter + nbsp - opposite "decode" setting, cb prevails'
  );
});

test(`02.007 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, spaced, repeated + decode`, t => {
  const inp2 = "zz nbsp;zz nbsp;";
  const outp2 = [
    [3, 8, "\xA0"],
    [11, 16, "\xA0"]
  ];
  t.deepEqual(fix(inp2, { decode: true }), outp2, "02.007.01 - space + nbsp");
  t.deepEqual(
    fix(inp2, { decode: true, cb: cbDecoded }),
    outp2,
    "02.007.02 - space + nbsp"
  );
  t.deepEqual(
    fix(inp2, { decode: false, cb: cbDecoded }),
    outp2,
    "02.007.03 - space + nbsp"
  );
});

test(`02.008 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, linebreaks, repeated + decode`, t => {
  const inp1 = "zz\nnbsp;zz\nnbsp;";
  const outp1 = [
    [3, 8, "\xA0"],
    [11, 16, "\xA0"]
  ];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.008.01 - line break + nbsp"
  );
  t.deepEqual(
    fix(inp1, { decode: true, cb: cbDecoded }),
    outp1,
    "02.008.02 - line break + nbsp"
  );
  t.deepEqual(
    fix(inp1, { decode: false, cb: cbDecoded }),
    outp1,
    "02.008.03 - line break + nbsp"
  );
});

test(`02.009 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, isolated + decode`, t => {
  const inp1 = "nbsp;";
  const outp1 = [[0, 5, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.009.01");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.009.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.009.03");
});

test(`02.010 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, no semicol + decode`, t => {
  const inp1 = "nbsp;zzznbsp;";
  const outp1 = [
    [0, 5, "\xA0"],
    [8, 13, "\xA0"]
  ];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.010.01");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.010.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.010.03");
});

test(`02.011 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, isolated`, t => {
  const inp1 = "&nbspz &nbspz";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [7, 12, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.011.01");
  // t.deepEqual(fix(inp1, { cb }), outp1, "02.011.02");
});

test(`02.012 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, spaced`, t => {
  const inp1 = "&nbspz; &nbspz;";
  const outp1 = [
    [0, 7, "&nbsp;"],
    [8, 15, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.012.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.012.02");
});

test(`02.013 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tight`, t => {
  const inp1 = "&nbspzzz&nbspzzz&nbsp";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [16, 21, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.013.01 - surrounded by letters");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.013.02");
});

test(`02.014 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, dots`, t => {
  const inp1 = "&nbsp...&nbsp...&nbsp";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [16, 21, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.014.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.014.02");
});

test(`02.015 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, line breaks`, t => {
  const inp1 = "&nbsp\n\n\n&nbsp\n\n\n&nbsp";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [16, 21, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.015.01 - surrounded by line breaks");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.015.02");
});

test(`02.016 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, well spaced`, t => {
  const inp1 = "&nbsp   &nbsp   &nbsp";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [16, 21, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.016.01 - surrounded by spaces");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.016.02");
});

test(`02.017 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, commas`, t => {
  const inp1 = "&nbsp,&nbsp,&nbsp";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [6, 11, "&nbsp;"],
    [12, 17, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.017.01 - surrounded by colons");
  t.deepEqual(fix(inp1), outp1, "02.017.02");
});

test(`02.018 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, digits`, t => {
  const inp1 = "&nbsp123&nbsp123&nbsp";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [16, 21, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.018.01 - surrounded by digits");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.018.02");
});

test(`02.019 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tabs`, t => {
  const inp1 = "&nbsp\t\t\t&nbsp\t\t\t&nbsp";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [16, 21, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.019.01 - surrounded by tabs");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.019.02");
});

test(`02.020 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - opts.decode is ignored if callback serves decoded`, t => {
  const inp1 = "&nbspz &nbspz";
  const outp1 = [
    [0, 5, "\xA0"],
    [7, 12, "\xA0"]
  ];
  // const outp2 = [[0, 5, "&nbsp;"], [7, 12, "&nbsp;"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.020.01 - warmup");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.020.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.020.03");
});

test(`02.021 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, spaced + decode`, t => {
  const inp1 = "&nbspz; &nbspz;";
  const outp1 = [
    [0, 7, "\xA0"],
    [8, 15, "\xA0"]
  ];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.021.01 - warmup");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.021.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.021.03");
});

test(`02.022 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tight + decode`, t => {
  const inp1 = "&nbspzzz&nbspzzz&nbsp";
  // if raw (unencoded) entity is requested (opts.decode === true), we have to
  // replace all entity characters:
  const outp1 = [
    [0, 5, "\xA0"],
    [8, 13, "\xA0"],
    [16, 21, "\xA0"]
  ];
  // const outp2 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.022.01 - surrounded by letters"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.022.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.022.03");
});

test(`02.023 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, dots + decode`, t => {
  const inp1 = "&nbsp...&nbsp...&nbsp";
  const outp1 = [
    [0, 5, "\xA0"],
    [8, 13, "\xA0"],
    [16, 21, "\xA0"]
  ];
  // const outp2 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.023.01 - surrounded by dots"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.023.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.023.03");
});

test(`02.024 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, line breaks + decode`, t => {
  const inp1 = "&nbsp\n\n\n&nbsp\n\n\n&nbsp";
  const outp1 = [
    [0, 5, "\xA0"],
    [8, 13, "\xA0"],
    [16, 21, "\xA0"]
  ];
  // const outp2 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.024.01 - surrounded by line breaks"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.024.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.024.03");
});

test(`02.025 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, well spaced + decode`, t => {
  const inp1 = "&nbsp   &nbsp   &nbsp";
  const outp1 = [
    [0, 5, "\xA0"],
    [8, 13, "\xA0"],
    [16, 21, "\xA0"]
  ];
  // const outp2 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.025.01 - surrounded by spaces"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.025.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.025.03");
});

test(`02.026 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, commas + decode`, t => {
  const inp1 = "&nbsp,&nbsp,&nbsp";
  const outp1 = [
    [0, 5, "\xA0"],
    [6, 11, "\xA0"],
    [12, 17, "\xA0"]
  ];
  // const outp2 = [[0, 5, "&nbsp;"], [6, 11, "&nbsp;"], [12, 17, "&nbsp;"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.026.01 - surrounded by colons"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.026.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.026.03");
});

test(`02.027 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, digits + decode`, t => {
  const inp1 = "&nbsp123&nbsp123&nbsp";
  const outp1 = [
    [0, 5, "\xA0"],
    [8, 13, "\xA0"],
    [16, 21, "\xA0"]
  ];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.027.01 - surrounded by digits"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.027.02");
});

test(`02.028 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tabs + decode`, t => {
  const inp1 = "&nbsp\t\t\t&nbsp\t\t\t&nbsp";
  const outp1 = [
    [0, 5, "\xA0"],
    [8, 13, "\xA0"],
    [16, 21, "\xA0"]
  ];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.028.01 - surrounded by tabs"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.028.02");
});

test(`02.029 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, no semicol, trailing letter`, t => {
  const inp1 = "nbspz";
  const outp1 = [[0, 4, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.029.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.029.01");
});

test(`02.030 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing letter, sandwitched`, t => {
  const inp1 = "nbspzzznbspzzznbsp";
  const outp1 = [
    [0, 4, "&nbsp;"],
    [7, 11, "&nbsp;"],
    [14, 18, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.030.01 - surrounded by letters");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.030.02");
});

test(`02.031 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing dots, sandwitched`, t => {
  const inp1 = "nbsp...nbsp...nbsp";
  const outp1 = [
    [0, 4, "&nbsp;"],
    [7, 11, "&nbsp;"],
    [14, 18, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.031.01 - surrounded by dots");
  t.deepEqual(fix(inp1), outp1, "02.031.02");
});

test(`02.032 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing linebreaks, sandwitched`, t => {
  const inp1 = "nbsp\n\n\nnbsp\n\n\nnbsp";
  const outp1 = [
    [0, 4, "&nbsp;"],
    [7, 11, "&nbsp;"],
    [14, 18, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.032.01 - surrounded by line breaks");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.032.02");
});

test(`02.033 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing whitespace chunks, sandwitched`, t => {
  const inp1 = "nbsp   nbsp   nbsp";
  const outp1 = [
    [0, 4, "&nbsp;"],
    [7, 11, "&nbsp;"],
    [14, 18, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.033.01 - surrounded by spaces");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.033.02");
});

test(`02.034 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing tight commas, sandwitched`, t => {
  const inp1 = "nbsp,nbsp,nbsp";
  const outp1 = [
    [0, 4, "&nbsp;"],
    [5, 9, "&nbsp;"],
    [10, 14, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.034.01 - surrounded by colons");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.034.02");
});

test(`02.035 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing digits, sandwitched`, t => {
  const inp1 = "nbsp123nbsp123nbsp";
  const outp1 = [
    [0, 4, "&nbsp;"],
    [7, 11, "&nbsp;"],
    [14, 18, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.035.01 - surrounded by digits");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.035.02");
});

test(`02.036 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing tight tabs, sandwitched`, t => {
  const inp1 = "nbsp\t\t\tnbsp\t\t\tnbsp";
  const outp1 = [
    [0, 4, "&nbsp;"],
    [7, 11, "&nbsp;"],
    [14, 18, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.036.01 - surrounded by tabs");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.036.02");
});

test(`02.037 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - repeated characters - complete set - \u001b[${36}m${`repeated`}\u001b[${39}m amp, tight, leading letters`, t => {
  const inp1 = "&&nbsp;x&&nbsp;y&&nbsp;";
  const outp1 = [];
  t.deepEqual(fix(inp1), outp1, "02.037.01 - duplicate ampersand");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.037.02");

  const inp2 = "&&&&nbsp;x&&&&nbsp;y&&&&nbsp;";
  const outp2 = [];
  t.deepEqual(fix(inp2), outp2, "02.037.03 - duplicate ampersand");
  t.deepEqual(fix(inp2, { cb }), outp2, "02.037.04");
});

test(`02.038 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate n`, t => {
  const inp1 = "&nnbsp;x&nnbsp;y&nnbsp;";
  const outp1 = [
    [0, 7, "&nbsp;"],
    [8, 15, "&nbsp;"],
    [16, 23, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.038.01 - duplicate n");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.038.02");
});

test(`02.039 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate b`, t => {
  const inp1 = "&nbbsp;x&nbbsp;y&nbbsp;";
  const outp1 = [
    [0, 7, "&nbsp;"],
    [8, 15, "&nbsp;"],
    [16, 23, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.039.01 - duplicate b");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.039.02");
});

test(`02.040 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate s`, t => {
  const inp1 = "&nbssp;x&nbssp;y&nbssp;";
  const outp1 = [
    [0, 7, "&nbsp;"],
    [8, 15, "&nbsp;"],
    [16, 23, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.040.01 - duplicate s");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.040.02");
});

test(`02.041 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate p`, t => {
  const inp1 = "&nbspp;x&nbspp;y&nbspp;";
  const outp1 = [
    [0, 7, "&nbsp;"],
    [8, 15, "&nbsp;"],
    [16, 23, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.041.01 - duplicate p");
  t.deepEqual(fix(inp1), outp1, "02.041.02");
});

test(`02.042 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol`, t => {
  const inp1 = "&nbsp;;x&nbsp;;y&nbsp;;";
  const outp1 = [
    [0, 7, "&nbsp;"],
    [8, 15, "&nbsp;"],
    [16, 23, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.042.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.042.02");
});

test(`02.043 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + n missing`, t => {
  const inp1 = "&&bsp;x&&bsp;y&&bsp;";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [15, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.043.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.043.02");
});

test(`02.044 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + b missing`, t => {
  const inp1 = "&&nsp;x&&nsp;y&&nsp;";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [15, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.044.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.044.02");
});

test(`02.045 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + s missing`, t => {
  const inp1 = "&&nbp;x&&nbp;y&&nbp;";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [15, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.045.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.045.02");
});

test(`02.046 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + p missing`, t => {
  const inp1 = "&&nbs;x&&nbs;y&&nbs;";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [15, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.046.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.046.02");
});

test(`02.047 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand - semicol missing`, t => {
  const inp1 = "&&nbspx&&nbspy&&nbsp";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [8, 13, "&nbsp;"],
    [15, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.047.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.047.02");
});

test(`02.048 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - ampersand missing`, t => {
  // repeated n + ...
  const inp1 = "nnbsp;xnnbsp;ynnbsp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.048.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.048.02");
});

test(`02.049 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - b missing`, t => {
  const inp1 = "&nnsp;x&nnsp;y&nnsp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.049.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.049.02");
});

test(`02.050 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - s missing`, t => {
  const inp1 = "&nnbp;x&nnbp;y&nnbp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.050.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.050.02");
});

test(`02.051 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - s missing`, t => {
  const inp1 = "&nnbs;x&nnbs;y&nnbs;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.051.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.051.02");
});

test(`02.052 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - semicol missing`, t => {
  const inp1 = "&nnbspx&nnbspy&nnbsp";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.052.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.052.02");
});

test(`02.053 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - ampersand missing`, t => {
  const inp1 = "nbbsp;xnbbsp;ynbbsp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.053.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.053.02");
});

test(`02.054 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - n missing`, t => {
  const inp1 = "&bbsp;x&bbsp;y&bbsp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.054.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.054.02");
});

test(`02.055 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - s missing`, t => {
  const inp1 = "&nbbp;x&nbbp;y&nbbp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.055.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.055.02");
});

test(`02.056 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - p missing`, t => {
  const inp1 = "&nbbs;x&nbbs;y&nbbs;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.056.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.056.02");
});

test(`02.057 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - semicol missing`, t => {
  const inp1 = "&nbbspx&nbbspy&nbbsp";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.057.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.057.02");
});

test(`02.058 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - ampersand missing`, t => {
  const inp1 = "nbssp;xnbssp;ynbssp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.058.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.058.02");
});

test(`02.059 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - n missing`, t => {
  const inp1 = "&bssp;x&bssp;y&bssp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.059.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.059.02");
});

test(`02.060 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - b missing`, t => {
  const inp1 = "&nssp;x&nssp;y&nssp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.060.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.060.02");
});

test(`02.061 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - p missing`, t => {
  const inp1 = "&nbss;x&nbss;y&nbss;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.061.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.061.02");
});

test(`02.062 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - semicol missing`, t => {
  const inp1 = "&nbsspx&nbsspy&nbssp";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.062.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.062.02");
});

test(`02.063 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - ampersand missing`, t => {
  const inp1 = "nbspp;xnbspp;ynbspp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.063.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.063.02");
});

test(`02.064 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - n missing`, t => {
  const inp1 = "&bspp;x&bspp;y&bspp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.064.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.064.02");
});

test(`02.065 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - b missing`, t => {
  const inp1 = "&nspp;x&nspp;y&nspp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.065.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.065.02");
});

test(`02.066 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - s missing`, t => {
  const inp1 = "&nbpp;x&nbpp;y&nbpp;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.066.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.066.02");
});

test(`02.067 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - semicol missing`, t => {
  const inp1 = "&nbsppx&nbsppy&nbspp";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.067.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.067.02");
});

test(`02.068 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - ampersand missing`, t => {
  const inp1 = "nbsp;;xnbsp;;ynbsp;;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.068.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.068.02");
});

test(`02.069 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - n missing`, t => {
  const inp1 = "&bsp;;x&bsp;;y&bsp;;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.069.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.069.02");
});

test(`02.070 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - b missing`, t => {
  const inp1 = "&nsp;;x&nsp;;y&nsp;;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.070.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.070.02");
});

test(`02.071 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - s missing`, t => {
  const inp1 = "&nbp;;x&nbp;;y&nbp;;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.071.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.071.02");
});

test(`02.072 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - p missing`, t => {
  const inp1 = "&nbs;;x&nbs;;y&nbs;;";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [7, 13, "&nbsp;"],
    [14, 20, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.072.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.072.02");
});

// dangerous stuff: missing ampersand and one letter (semicol present)

test(`02.073 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - letter on the left, EOL on the right`, t => {
  t.deepEqual(fix("zzzzbsp;"), [[4, 8, "&nbsp;"]], "02.073.01");
  t.deepEqual(fix("zzzznsp;"), [[4, 8, "&nbsp;"]], "02.073.02");
  t.deepEqual(fix("zzzznbp;"), [[4, 8, "&nbsp;"]], "02.073.03");
  t.deepEqual(fix("zzzznbs;"), [[4, 8, "&nbsp;"]], "02.073.04");
});

test(`02.074 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - letter on the right, EOL on the left`, t => {
  t.deepEqual(fix("bsp;zzzz"), [[0, 4, "&nbsp;"]], "02.074.01");
  t.deepEqual(fix("nsp;zzzz"), [[0, 4, "&nbsp;"]], "02.074.02");
  t.deepEqual(fix("nbp;zzzz"), [[0, 4, "&nbsp;"]], "02.074.03");
  t.deepEqual(fix("nbs;zzzz"), [[0, 4, "&nbsp;"]], "02.074.04");
});

test(`02.075 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - EOL on both sides`, t => {
  t.deepEqual(fix("bsp;"), [[0, 4, "&nbsp;"]], "02.075.01");
  t.deepEqual(fix("nsp;"), [[0, 4, "&nbsp;"]], "02.075.02");
  t.deepEqual(fix("nbp;"), [[0, 4, "&nbsp;"]], "02.075.03");
  t.deepEqual(fix("nbs;"), [[0, 4, "&nbsp;"]], "02.075.04");
});

test(`02.076 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - space on either side, letter on the left`, t => {
  t.deepEqual(fix("aaaa bsp;"), [[5, 9, "&nbsp;"]], "02.076.01");
  t.deepEqual(fix("aaaa nsp;"), [[5, 9, "&nbsp;"]], "02.076.02");
  t.deepEqual(fix("aaaa nbp;"), [[5, 9, "&nbsp;"]], "02.076.03");
  t.deepEqual(fix("aaaa nbs;"), [[5, 9, "&nbsp;"]], "02.076.04");
});

test(`02.077 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - space on either side, letter on the right`, t => {
  t.deepEqual(fix("bsp; aaaa"), [[0, 4, "&nbsp;"]], "02.077.01");
  t.deepEqual(fix("nsp; aaaa"), [[0, 4, "&nbsp;"]], "02.077.02");
  t.deepEqual(fix("nbp; aaaa"), [[0, 4, "&nbsp;"]], "02.077.03");
  t.deepEqual(fix("nbs; aaaa"), [[0, 4, "&nbsp;"]], "02.077.04");
});

test(`02.078 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing ampersand and one letter (semicol present)`}\u001b[${39}m - space on either side, letters outside`, t => {
  t.deepEqual(fix("aaaa bsp; aaaa"), [[5, 9, "&nbsp;"]], "02.078.01");
  t.deepEqual(fix("aaaa nsp; aaaa"), [[5, 9, "&nbsp;"]], "02.078.02");
  t.deepEqual(fix("aaaa nbp; aaaa"), [[5, 9, "&nbsp;"]], "02.078.03");
  t.deepEqual(fix("aaaa nbs; aaaa"), [[5, 9, "&nbsp;"]], "02.078.04");
});

test(`02.079 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling (ampersand missing), incomplete set`, t => {
  t.deepEqual(
    fix("aaaa bsp; aaaa", { decode: true }),
    [[5, 9, "\xA0"]],
    "02.079.01"
  );
  t.deepEqual(
    fix("aaaa nsp; aaaa", { decode: true }),
    [[5, 9, "\xA0"]],
    "02.079.02"
  );
  t.deepEqual(
    fix("aaaa nbp; aaaa", { decode: true }),
    [[5, 9, "\xA0"]],
    "02.079.03"
  );
  t.deepEqual(
    fix("aaaa nbs; aaaa", { decode: true }),
    [[5, 9, "\xA0"]],
    "02.079.04"
  );
});

test(`02.080 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`at least one of each of the set`}\u001b[${39}m [n, b, s, p] \u001b[${32}m${`is present, repetitions`}\u001b[${39}m - n trailing`, t => {
  // any repetitions whatsoever like &&&&&nnnbbbssssp;;;
  t.deepEqual(fix("aaa&nnnbbssssppp;nnn"), [[3, 17, "&nbsp;"]], "02.080.01");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;nnn"), [[3, 20, "&nbsp;"]], "02.080.02");
  t.deepEqual(fix("aaa&nnnbbssssppp nnn"), [[3, 16, "&nbsp;"]], "02.080.03");
  t.deepEqual(fix("aaa&nnnbbssssp nnn"), [[3, 14, "&nbsp;"]], "02.080.04");
  t.deepEqual(fix("aaa&nnnbbssssp,nnn"), [[3, 14, "&nbsp;"]], "02.080.05");
  t.deepEqual(fix("aaa&nnnbbssssp.nnn"), [[3, 14, "&nbsp;"]], "02.080.06");
  t.deepEqual(fix("aaa&nnnbbssssp?nnn"), [[3, 14, "&nbsp;"]], "02.080.07");
  t.deepEqual(fix("aaa&nnnbbssssp-nnn"), [[3, 14, "&nbsp;"]], "02.080.08");
  t.deepEqual(fix("aaa&nnnbbssssp;nnn"), [[3, 15, "&nbsp;"]], "02.080.09");
  t.deepEqual(fix("aaa&nnnbbssssp\nnnn"), [[3, 14, "&nbsp;"]], "02.080.10");
});

test(`02.081 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`at least one of each of the set`}\u001b[${39}m [n, b, s, p] \u001b[${32}m${`is present, repetitions`}\u001b[${39}m - b trailing`, t => {
  t.deepEqual(fix("aaa&nnnbbssssppp;bbb"), [[3, 17, "&nbsp;"]], "02.081.11");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;bbb"), [[3, 20, "&nbsp;"]], "02.081.12");
  t.deepEqual(fix("aaa&nnnbbssssppp bbb"), [[3, 16, "&nbsp;"]], "02.081.13");
  t.deepEqual(fix("aaa&nnnbbssssp bbb"), [[3, 14, "&nbsp;"]], "02.081.14");
  t.deepEqual(fix("aaa&nnnbbssssp,bbb"), [[3, 14, "&nbsp;"]], "02.081.15");
  t.deepEqual(fix("aaa&nnnbbssssp.bbb"), [[3, 14, "&nbsp;"]], "02.081.16");
  t.deepEqual(fix("aaa&nnnbbssssp?bbb"), [[3, 14, "&nbsp;"]], "02.081.17");
  t.deepEqual(fix("aaa&nnnbbssssp-bbb"), [[3, 14, "&nbsp;"]], "02.081.18");
  t.deepEqual(fix("aaa&nnnbbssssp;bbb"), [[3, 15, "&nbsp;"]], "02.081.19");
  t.deepEqual(fix("aaa&nnnbbssssp\nbbb"), [[3, 14, "&nbsp;"]], "02.081.20");
});

test(`02.082 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`at least one of each of the set`}\u001b[${39}m [n, b, s, p] \u001b[${32}m${`is present, repetitions`}\u001b[${39}m - s trailing`, t => {
  t.deepEqual(fix("aaa&nnnbbssssppp;sss"), [[3, 17, "&nbsp;"]], "02.082.21");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;sss"), [[3, 20, "&nbsp;"]], "02.082.22");
  t.deepEqual(fix("aaa&nnnbbssssppp sss"), [[3, 16, "&nbsp;"]], "02.082.23");
  t.deepEqual(fix("aaa&nnnbbssssp sss"), [[3, 14, "&nbsp;"]], "02.082.24");
  t.deepEqual(fix("aaa&nnnbbssssp,sss"), [[3, 14, "&nbsp;"]], "02.082.25");
  t.deepEqual(fix("aaa&nnnbbssssp.sss"), [[3, 14, "&nbsp;"]], "02.082.26");
  t.deepEqual(fix("aaa&nnnbbssssp?sss"), [[3, 14, "&nbsp;"]], "02.082.27");
  t.deepEqual(fix("aaa&nnnbbssssp-sss"), [[3, 14, "&nbsp;"]], "02.082.28");
  t.deepEqual(fix("aaa&nnnbbssssp;sss"), [[3, 15, "&nbsp;"]], "02.082.29");
  t.deepEqual(fix("aaa&nnnbbssssp\nsss"), [[3, 14, "&nbsp;"]], "02.082.30");
});

test(`02.083 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`at least one of each of the set`}\u001b[${39}m [n, b, s, p] \u001b[${32}m${`is present, repetitions`}\u001b[${39}m - p trailing`, t => {
  t.deepEqual(fix("aaa&nnnbbssssppp;ppp"), [[3, 17, "&nbsp;"]], "02.083.31");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;ppp"), [[3, 20, "&nbsp;"]], "02.083.32");
  t.deepEqual(fix("aaa&nnnbbssssppp ppp"), [[3, 16, "&nbsp;"]], "02.083.33");
  t.deepEqual(fix("aaa&nnnbbssssp ppp"), [[3, 14, "&nbsp;"]], "02.083.34");
  t.deepEqual(fix("aaa&nnnbbssssp,ppp"), [[3, 14, "&nbsp;"]], "02.083.35");
  t.deepEqual(fix("aaa&nnnbbssssp.ppp"), [[3, 14, "&nbsp;"]], "02.083.36");
  t.deepEqual(fix("aaa&nnnbbssssp?ppp"), [[3, 14, "&nbsp;"]], "02.083.37");
  t.deepEqual(fix("aaa&nnnbbssssp-ppp"), [[3, 14, "&nbsp;"]], "02.083.38");
  t.deepEqual(fix("aaa&nnnbbssssp;ppp"), [[3, 15, "&nbsp;"]], "02.083.39");
  t.deepEqual(fix("aaa&nnnbbssssp\nppp"), [[3, 14, "&nbsp;"]], "02.083.40");
});

test(`02.084 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`recursively encoded entities`}\u001b[${39}m - twice`, t => {
  const inp1 = "a&amp;nbsp;b";
  const outp1 = [[1, 11, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.084");
});

test(`02.085 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`recursively encoded entities`}\u001b[${39}m - thrice`, t => {
  const inp1 = "a&amp;amp;nbsp;b";
  const outp1 = [[1, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.085");
});

test(`02.086 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`recursively encoded entities`}\u001b[${39}m - quadruple`, t => {
  const inp1 = "a&amp;amp;amp;nbsp;b";
  const outp1 = [[1, 19, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.086.01");
});

test(`02.087 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`capital N, no ampersand, no semicolon`}\u001b[${39}m - leading semicolon, tight`, t => {
  const inp1 = "text;Nbsptext";
  const outp1 = [[5, 9, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.087.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.087.02");
});

test(`02.088 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`capital N, no ampersand, no semicolon`}\u001b[${39}m - leading space`, t => {
  const inp1 = "text Nbsptext";
  const outp1 = [[5, 9, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.088.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.088.02");
});

test(`02.089 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`capital N, no ampersand, no semicolon`}\u001b[${39}m - decoded`, t => {
  // decode
  const inp1 = "text;Nbsptext";
  const outp1 = [[5, 9, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.089.01");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.089.02");
});

test(`02.090 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`capital N, no ampersand, no semicolon`}\u001b[${39}m - leading space - decoded`, t => {
  const inp1 = "text Nbsptext";
  const outp1 = [[5, 9, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.090.01");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.090.02");
});

test(`02.091 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing semicolon when ampersand is present`}\u001b[${39}m - P capital`, t => {
  const inp1 = "&nBsPzzz&nBsPzzz";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.091.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.091.02");
});

test(`02.092 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing semicolon when ampersand is present`}\u001b[${39}m - S capital`, t => {
  const inp1 = "&NbSpzzz&NbSpzzz";
  const outp1 = [
    [0, 5, "&nbsp;"],
    [8, 13, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.092.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.092.02");
});

test(`02.093 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N capital`, t => {
  const inp1 = "textNbsp;texttextNbsp;text";
  const outp1 = [
    [4, 9, "&nbsp;"],
    [17, 22, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.093.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.093.02");
});

test(`02.094 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N & S capitals`, t => {
  const inp1 = "&&NbSpzzz&&NbSpzzz";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [10, 15, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.094.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.094.02");
});

test(`02.095 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N & S capitals, repetition`, t => {
  const inp1 = "&NbSspzzz&NbSspzzz";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [9, 15, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.095.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.095.02");
});

test(`02.096 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition`, t => {
  const inp1 = "&NbSsPzzz&NbSsPzzz";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [9, 15, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.096.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.096.02");
});

test(`02.097 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition, trailing space, tight`, t => {
  const inp1 = "&NbSsP zzz&NbSsP zzz";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [10, 16, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.097.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.097.02");
});

test(`02.098 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition, trailing space, spaced`, t => {
  const inp1 = "&NbSsP zzz &NbSsP zzz";
  const outp1 = [
    [0, 6, "&nbsp;"],
    [11, 17, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.098.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.098.02");
});

test(`02.099 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - full set`, t => {
  const inp1 = "a&bnsp;b&nsbp;c";
  const outp1 = [
    [1, 7, "&nbsp;"],
    [8, 14, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.099.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.099.02");
});

test(`02.100 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - one missing`, t => {
  const inp1 = "abnsp;bnsbp;c";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [7, 12, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.100.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.100.02");
});

test(`02.101 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - n missing`, t => {
  const inp1 = "a&bsp;b&sbp;c&spb;";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [7, 12, "&nbsp;"],
    [13, 18, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.101.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.101.02");
});

test(`02.102 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - b missing`, t => {
  const inp1 = "a&nsp;b&nsp;c&nsp;";
  const outp1 = [
    [1, 6, "&nbsp;"],
    [7, 12, "&nbsp;"],
    [13, 18, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.102.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.102.02");
});

test(`02.103 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - s missing`, t => {
  const inp1 = "a&mbsp;b&nbdp;c&nbsb;";
  const outp1 = [
    [1, 7, "&nbsp;"],
    [8, 14, "&nbsp;"],
    [15, 21, "&nbsp;"]
  ];
  t.deepEqual(fix(inp1), outp1, "02.103.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.103.02");
});

test(`02.104 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - p missing`, t => {
  const inp1 = "a&nbso;b&nbsl;c&nsbb;";
  const outp1 = [
    [1, 7, "&nbsp;"],
    [8, 14, "&nbsp;"],
    [15, 21, "&nbsp;"]
  ];
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

test(`02.111 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - missing semicolon gets reported as such`, t => {
  const inp5 = "aaa&nbspbbb";
  const outp5 = [
    {
      ruleName: "bad-named-html-entity-malformed-nbsp",
      entityName: "nbsp",
      rangeFrom: 3,
      rangeTo: 8,
      rangeValEncoded: "&nbsp;",
      rangeValDecoded: "\xA0"
    }
  ];
  t.deepEqual(fix(inp5, { cb: obj => obj }), outp5, "02.111");
});

test(`02.112 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`false positive`}\u001b[${39}m - &nspar;`, t => {
  const source = "a&nspar;b";
  t.deepEqual(fix(source), [], "02.112.01");
  t.deepEqual(fix(source, { cb }), [], "02.112.02 - cb");
});

test(`02.113 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`false positive`}\u001b[${39}m - &prnsim;`, t => {
  const source = "a&prnsim;b";
  t.deepEqual(fix(source), [], "02.113.01");
  t.deepEqual(fix(source, { cb }), [], "02.113.02 - cb");
});

test(`02.114 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`false positive`}\u001b[${39}m - &subplus;`, t => {
  const source = "a&subplus;b";
  t.deepEqual(fix(source), [], "02.114.01");
  t.deepEqual(fix(source, { cb }), [], "02.114.02 - cb");
});

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

test(`03.001 - ${`\u001b[${33}m${`insp`}\u001b[${39}m`} - false positives`, t => {
  t.deepEqual(fix("insp;"), [], "03.001.01");
  t.deepEqual(fix("an insp;"), [], "03.001.02");
  t.deepEqual(fix("an inspp;"), [], "03.001.03");

  // decode on:
  t.deepEqual(fix("insp;", { decode: true }), [], "03.001.04");
  t.deepEqual(fix("an insp;", { decode: true }), [], "03.001.05");
  t.deepEqual(fix("an inspp;", { decode: true }), [], "03.001.06");
});

test(`03.002 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - no decode requested`, t => {
  t.deepEqual(fix("&nbsp;"), [], "03.002.01 - one, surrounded by EOL");
  t.deepEqual(fix("&nbsp; &nbsp;"), [], "03.002.02 - two, surrounded by EOL");
  t.deepEqual(fix("a&nbsp;b"), [], "03.002.03 - surrounded by letters");
});

test(`03.003 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - default callback, decode`, t => {
  // controls:
  t.deepEqual(fix("&nbsp;"), [], "03.003.01");
  t.deepEqual(fix("&nbsp;", { decode: false }), [], "03.003.02");
  t.deepEqual(
    fix("&nbsp;", {
      decode: false,
      cb: obj => obj
    }),
    [],
    "03.003.03"
  );

  // the main check:
  t.deepEqual(fix("&nbsp;", { decode: true }), [[0, 6, "\xA0"]], "03.003.04");
});

test(`03.004 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - full callback, decode`, t => {
  // same as 03.003 except has a callback to ensure correct rule name is reported
  t.deepEqual(
    fix("&nbsp;", {
      decode: true,
      cb: obj => obj
    }),
    [
      {
        ruleName: `encoded-html-entity-nbsp`,
        entityName: "nbsp",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\xA0"
      }
    ],
    "03.004"
  );
});

test(`03.005 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - two, surrounded by EOL`, t => {
  t.deepEqual(
    fix("&nbsp; &nbsp;", { decode: true }),
    [
      [0, 6, "\xA0"],
      [7, 13, "\xA0"]
    ],
    "03.005"
  );
});

test(`03.006 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - surrounded by letters`, t => {
  t.deepEqual(fix("a&nbsp;b", { decode: true }), [[1, 7, "\xA0"]], "03.006");
});

test(`03.007 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - various - decode off`, t => {
  t.deepEqual(fix("z&hairsp;y"), [], "03.007.01");
  t.deepEqual(fix("y&VeryThinSpace;z"), [], "03.007.02");
});

test(`03.008 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - hairsp - decode on`, t => {
  t.deepEqual(
    fix("z&hairsp;y", { decode: true }),
    [[1, 9, "\u200A"]],
    "03.008"
  );
});

test(`03.009 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - VeryThinSpace - decode on`, t => {
  t.deepEqual(
    fix("y&VeryThinSpace;z", { decode: true }),
    [[1, 16, "\u200A"]],
    "03.009"
  );
});

test(`03.010 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - healthy &pound;`, t => {
  const inp1 = "&pound;";
  t.deepEqual(fix(inp1), [], "03.010.01");
  t.deepEqual(fix(inp1, { decode: true }), [[0, 7, "\xA3"]], "03.010.02");
});

// -----------------------------------------------------------------------------
// 04. other entities
// -----------------------------------------------------------------------------

test(`04.001 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`, t => {
  t.deepEqual(fix("z &ang; y"), [], "04.001.01");
  t.deepEqual(fix("z &angst; y"), [], "04.001.02");

  t.deepEqual(fix("z &ang y"), [[2, 6, "&ang;"]], "04.001.03");
  t.deepEqual(fix("z &angst y"), [[2, 8, "&angst;"]], "04.001.04");

  t.deepEqual(
    fix("x &ang y&ang z"),
    [
      [2, 6, "&ang;"],
      [8, 12, "&ang;"]
    ],
    "04.001.05"
  );
});

test(`04.002 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(
    fix("text&angtext&angtext"),
    [
      [4, 8, "&ang;"],
      [12, 16, "&ang;"]
    ],
    "04.002"
  );
});

test(`04.003 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(
    fix("text&angsttext&angsttext"),
    [
      [4, 10, "&angst;"],
      [14, 20, "&angst;"]
    ],
    "04.003.01 - spaces are obligatory"
  );
  t.deepEqual(fix("text&angst"), [[4, 10, "&angst;"]], "04.003.02");
  t.deepEqual(
    fix("text&angst text&angst text"),
    [
      [4, 10, "&angst;"],
      [15, 21, "&angst;"]
    ],
    "04.003.03"
  );
});

test(`04.004 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(
    fix("text&pitext&pitext"),
    [],
    "04.004 - won't fix, it's a dubious case"
  );
});

test(`04.005 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(
    fix("text&pivtext&pivtext"),
    [
      [4, 8, "&piv;"],
      [12, 16, "&piv;"]
    ],
    "04.005"
  );
});

test(`04.006 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(
    fix("text&Pitext&Pitext"),
    [],
    "04.006 - also won't fix, it's not conclusive"
  );
});

test(`04.007 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(fix("text&sigma text&sigma text"), [], "04.007 - not conclusive");
});

test(`04.008 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(fix("text&sub text&sub text"), [], "04.008");
});

test(`04.009 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(
    fix("text&suptext&suptext"),
    [
      [4, 8, "&sup;"],
      [12, 16, "&sup;"]
    ],
    "04.009"
  );
});

test(`04.010 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(fix("text&theta text&theta text"), [], "04.010");
});

test(`04.011 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - no decode, linebreaked`, t => {
  t.deepEqual(
    fix("a &thinsp b\n&thinsp\nc"),
    [
      [2, 9, "&thinsp;"],
      [12, 19, "&thinsp;"]
    ],
    "04.011"
  );
});

test(`04.012 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - no decode, tight`, t => {
  t.deepEqual(fix("&thinsp"), [[0, 7, "&thinsp;"]], "04.001.12");
  t.deepEqual(
    fix("&thinsp&thinsp"),
    [
      [0, 7, "&thinsp;"],
      [7, 14, "&thinsp;"]
    ],
    "04.012 - joins"
  );
});

// with decode

test(`04.013 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, spaced`, t => {
  t.deepEqual(
    fix("text &ang text&ang text", { decode: true }),
    [
      [5, 9, "\u2220"],
      [14, 18, "\u2220"]
    ],
    "04.013"
  );
});

test(`04.014 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(
    fix("text&angtext&angtext", { decode: true }),
    [
      [4, 8, "\u2220"],
      [12, 16, "\u2220"]
    ],
    "04.014"
  );
});

test(`04.015 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(
    fix("text&angst", { decode: true }),
    [[4, 10, "\xC5"]],
    "04.015.01"
  );
  t.deepEqual(
    fix("text&angst text&angst text", { decode: true }),
    [
      [4, 10, "\xC5"],
      [15, 21, "\xC5"]
    ],
    "04.015.02"
  );
  t.deepEqual(
    fix("text&angsttext&angsttext", { decode: true }),
    [
      [4, 10, "\xC5"],
      [14, 20, "\xC5"]
    ],
    "04.015.03"
  );
});

test(`04.016 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(fix("text&pi text&pi text", { decode: true }), [], "04.016");
});

test(`04.017 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(
    fix("text&pivtext&pivtext", { decode: true }),
    [
      [4, 8, "\u03D6"],
      [12, 16, "\u03D6"]
    ],
    "04.017"
  );
});

test(`04.018 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(fix("text&Pi text&Pi text", { decode: true }), [], "04.018");
});

test(`04.019 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(
    fix("text&sigma text&sigma text", { decode: true }),
    [],
    "04.019"
  );
});

test(`04.020 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(fix("text&sub text&sub text", { decode: true }), [], "04.020");
});

test(`04.021 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(
    fix("text&suptext&suptext", { decode: true }),
    [
      [4, 8, "\u2283"],
      [12, 16, "\u2283"]
    ],
    "04.021"
  );
});

test(`04.022 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(
    fix("text&theta text&theta text", { decode: true }),
    [],
    "04.022"
  );
});

test(`04.023 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, line breaked`, t => {
  t.deepEqual(
    fix("a &thinsp b\n&thinsp\nc", { decode: true }),
    [
      [2, 9, "\u2009"],
      [12, 19, "\u2009"]
    ],
    "04.023"
  );
});

test(`04.024 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, isolated`, t => {
  t.deepEqual(fix("&thinsp", { decode: true }), [[0, 7, "\u2009"]], "04.024");
});

test(`04.025 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, tight`, t => {
  t.deepEqual(
    fix("&thinsp&thinsp", { decode: true }),
    [
      [0, 7, "\u2009"],
      [7, 14, "\u2009"]
    ],
    "04.025.13 - joins"
  );
});

test(`04.026 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - \u001b[${32}m${`pound`}\u001b[${39}m - in front of semicolon`, t => {
  t.deepEqual(
    fix("&pound1;", { decode: false }),
    [[0, 6, "&pound;"]],
    "04.026.01"
  );
  t.deepEqual(fix("&pound1;", { decode: true }), [[0, 6, "\xA3"]], "04.026.02");
});

// -----------------------------------------------------------------------------
// 05. multiple encoding
// -----------------------------------------------------------------------------

test(`05.001 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - no consecutive &amp;`, t => {
  const inp1 = "&amp;";
  t.deepEqual(fix(inp1), [], "05.001");
});

test(`05.002 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp;`, t => {
  const inp1 = "&amp; &amp; &amp;";
  t.deepEqual(fix(inp1), [], "05.002");
});

test(`05.003 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`, t => {
  const inp1 = "&amp;&amp;&amp;";
  t.deepEqual(fix(inp1), [], "05.003");
});

test(`05.004 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`, t => {
  const inp1 = "abc&amp;&amp;&amp;xyz";
  t.deepEqual(fix(inp1), [], "05.004");
});

test(`05.005 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #1`, t => {
  const inp1 = "B&amp;Q";
  t.deepEqual(fix(inp1), [], "05.005");
});

test(`05.006 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #2`, t => {
  const inp1 = "text B&amp;Q text";
  t.deepEqual(fix(inp1), [], "05.006");
});

test(`05.007 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - no cb`, t => {
  const inp1 = "text&amp;nbsp;text";
  t.deepEqual(fix(inp1), [[4, 14, "&nbsp;"]], "05.007 - double encoded");
});

test(`05.008 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - with cb`, t => {
  const inp1 = "text&amp;nbsp;text";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            ruleName: "bad-named-html-entity-multiple-encoding",
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 14,
            rangeValEncoded: "&nbsp;",
            rangeValDecoded: "\xA0"
          },
          "05.008.01"
        );

        // same cb() callback as defined at the top of this file:
        return received.rangeValEncoded
          ? [received.rangeFrom, received.rangeTo, received.rangeValEncoded]
          : [received.rangeFrom, received.rangeTo];
      }
    }),
    [[4, 14, "&nbsp;"]],
    "05.008.02 - double encoded"
  );
});

test(`05.009 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - triple encoded`, t => {
  const inp1 = "text&amp;amp;nbsp;text";
  t.deepEqual(fix(inp1), [[4, 18, "&nbsp;"]], "05.009.01");

  const inp2 = "text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text";
  t.deepEqual(fix(inp2), [[4, 54, "&nbsp;"]], "05.009.02");
});

test(`05.010 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand - no cb`, t => {
  const inp1 = "textamp;nbsp;text";
  t.deepEqual(fix(inp1), [[4, 13, "&nbsp;"]], "05.010.01");

  const inp2 = "text amp;nbsp;text";
  t.deepEqual(fix(inp2), [[5, 14, "&nbsp;"]], "05.010.02");

  const inp3 = "text\tamp;nbsp;text";
  t.deepEqual(fix(inp3), [[5, 14, "&nbsp;"]], "05.010.03");

  const inp4 = "text\namp;nbsp;text";
  t.deepEqual(fix(inp4), [[5, 14, "&nbsp;"]], "05.010.04");
});

test(`05.011 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand`, t => {
  const inp1 = "textamp;nbsp;text";
  t.deepEqual(fix(inp1), [[4, 13, "&nbsp;"]], "05.011.01");

  const inp2 = "textamp;nsp;text";
  t.deepEqual(fix(inp2), [[4, 12, "&nbsp;"]], "05.011.02");
});

test(`05.012 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - extreme #2`, t => {
  const inp1 =
    "text    &  a  m p   ; a  mp   ; a m   p   ;    n   s p    ;text";
  t.deepEqual(fix(inp1), [[5, 59, "&nbsp;"]], "05.012");
});

test(`05.013 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - extreme #2 - cb`, t => {
  const inp1 =
    "text    &  a  m p   ; a  mp   ; a m   p   ;    n   s p    ;text";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 5,
            rangeTo: 59,
            rangeValDecoded: "\xA0",
            rangeValEncoded: "&nbsp;",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.013.01"
        );
        return cb(received);
      }
    }),
    [[5, 59, "&nbsp;"]],
    "05.013.02"
  );
});

test(`05.014 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #1`, t => {
  const inp1 = "abc &nbs;";
  t.deepEqual(fix(inp1), [[4, 9, "&nbsp;"]], "05.014");
});

test(`05.015 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #2`, t => {
  const inp1 = "abc &nbs;";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 9,
            rangeValDecoded: "\xA0",
            rangeValEncoded: "&nbsp;",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.015.01"
        );
        return cb(received);
      }
    }),
    [[4, 9, "&nbsp;"]],
    "05.015.02"
  );
});

test(`05.016 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #3`, t => {
  const inp1 = "abc &nbs; xyz";
  t.deepEqual(fix(inp1), [[4, 9, "&nbsp;"]], "05.016.01");
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 9,
            rangeValDecoded: "\xA0",
            rangeValEncoded: "&nbsp;",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.016.01"
        );
        return cb(received);
      }
    }),
    [[4, 9, "&nbsp;"]],
    "05.016.02"
  );

  const inp2 = "&nbs; xyz";
  t.deepEqual(fix(inp2), [[0, 5, "&nbsp;"]], "05.016.03");
  t.deepEqual(
    fix(inp2, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 0,
            rangeTo: 5,
            rangeValDecoded: "\xA0",
            rangeValEncoded: "&nbsp;",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.016.04"
        );
        return cb(received);
      }
    }),
    [[0, 5, "&nbsp;"]],
    "05.016.05"
  );
});

test(`05.017 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #4`, t => {
  const inp1 = "abc&nbs;";
  t.deepEqual(fix(inp1), [[3, 8, "&nbsp;"]], "05.017");
});

test(`05.018 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #5`, t => {
  const inp1 = "abc&nbs;";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 3,
            rangeTo: 8,
            rangeValDecoded: "\xA0",
            rangeValEncoded: "&nbsp;",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.018.01"
        );
        return cb(received);
      }
    }),
    [[3, 8, "&nbsp;"]],
    "05.018.02"
  );
});

test(`05.019 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6`, t => {
  const inp1 = "abc&nbs; xyz";
  t.deepEqual(fix(inp1), [[3, 8, "&nbsp;"]], "05.019.01");
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 3,
            rangeTo: 8,
            rangeValDecoded: "\xA0",
            rangeValEncoded: "&nbsp;",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.019.02"
        );
        return cb(received);
      }
    }),
    [[3, 8, "&nbsp;"]],
    "05.019.03"
  );

  const inp2 = "&nbs; xyz";
  t.deepEqual(fix(inp2), [[0, 5, "&nbsp;"]], "05.019.04");
  t.deepEqual(
    fix(inp2, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 0,
            rangeTo: 5,
            rangeValDecoded: "\xA0",
            rangeValEncoded: "&nbsp;",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.019.05"
        );
        return cb(received);
      }
    }),
    [[0, 5, "&nbsp;"]],
    "05.019.06"
  );
});

// -----------------------------------------------------------------------------
// 06. opts.cb
// -----------------------------------------------------------------------------

test(`06.001 - ${`\u001b[${31}m${`opts.cb`}\u001b[${39}m`} - \u001b[${33}m${`default callback`}\u001b[${39}m mimicking non-cb result`, t => {
  t.deepEqual(
    fix("zzznbsp;zzznbsp;", {
      cb
    }),
    [
      [3, 8, "&nbsp;"],
      [11, 16, "&nbsp;"]
    ],
    "06.001 - letter + nbsp"
  );
});

test(`06.002 - ${`\u001b[${31}m${`opts.cb`}\u001b[${39}m`} - \u001b[${33}m${`emlint issue spec`}\u001b[${39}m callback`, t => {
  t.deepEqual(
    fix("zzznbsp;zzznbsp;", {
      cb: oodles => {
        // {
        //   ruleName: "missing semicolon on &pi; (don't confuse with &piv;)",
        //   entityName: "pi",
        //   rangeFrom: i,
        //   rangeTo: i + 3,
        //   rangeValEncoded: "&pi;",
        //   rangeValDecoded: "\u03C0"
        // }
        return {
          name: oodles.ruleName,
          position:
            oodles.rangeValEncoded != null
              ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded]
              : [oodles.rangeFrom, oodles.rangeTo]
        };
      }
    }),
    [
      {
        name: "bad-named-html-entity-malformed-nbsp",
        position: [3, 8, "&nbsp;"]
      },
      {
        name: "bad-named-html-entity-malformed-nbsp",
        position: [11, 16, "&nbsp;"]
      }
    ],
    "06.002"
  );
});

// -----------------------------------------------------------------------------
// 07. opts.progressFn
// -----------------------------------------------------------------------------

test(`07.001 - ${`\u001b[${32}m${`opts.progressFn`}\u001b[${39}m`} - reports progress`, t => {
  t.deepEqual(
    fix(
      "text &ang text&ang text text &ang text&ang text text &ang text&ang text"
    ),
    [
      [5, 9, "&ang;"],
      [14, 18, "&ang;"],
      [29, 33, "&ang;"],
      [38, 42, "&ang;"],
      [53, 57, "&ang;"],
      [62, 66, "&ang;"]
    ],
    "07.001.01 - baseline"
  );

  let count = 0;
  t.deepEqual(
    fix(
      "text &ang text&ang text text &ang text&ang text text &ang text&ang text",
      {
        progressFn: percentageDone => {
          // console.log(`percentageDone = ${percentageDone}`);
          t.true(typeof percentageDone === "number");
          count++;
        }
      }
    ),
    [
      [5, 9, "&ang;"],
      [14, 18, "&ang;"],
      [29, 33, "&ang;"],
      [38, 42, "&ang;"],
      [53, 57, "&ang;"],
      [62, 66, "&ang;"]
    ],
    "07.001.02 - calls the progress function"
  );
  t.true(typeof count === "number" && count <= 101 && count > 0, "07.001.03");
});

// -----------------------------------------------------------------------------
// 08. ampersand missing
// -----------------------------------------------------------------------------

test(`08.001 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - \u001b[${32}m${`acute`}\u001b[${39}m vs \u001b[${32}m${`aacute`}\u001b[${39}m - no decode, spaced`, t => {
  t.deepEqual(fix("z &aacute; y"), [], "08.001.01");
  t.deepEqual(fix("z &acute; y"), [], "08.001.02");
});

test(`08.002 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - \u001b[${32}m${`acute`}\u001b[${39}m vs \u001b[${32}m${`aacute`}\u001b[${39}m - legit word same as entity name, ending with semicol`, t => {
  t.deepEqual(
    fix("Diagnosis can be acute; it is up to a doctor to"),
    [],
    "08.002"
  );
});

test(`08.003 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - minimal isolated, named, rarrpl`, t => {
  const inp1 = "rarrpl;";
  const outp1 = [[0, 7, "&rarrpl;"]];
  t.deepEqual(fix(inp1), outp1, "08.003.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "08.003.02");
});

test(`08.004 - ${`\u001b[${33}m${`missing amp`}\u001b[${39}m`} - &block; vs. display:block`, t => {
  const inp1 = `<img src=abc.jpg width=123 height=456 border=0 style=display:block; alt=xyz/>`;
  t.deepEqual(fix(inp1), [], "08.004");
});

// -----------------------------------------------------------------------------
// 09. spaces within entities
// -----------------------------------------------------------------------------

test(`09.001 - ${`\u001b[${35}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space after ampersand`, t => {
  const inp5 = "& nbsp;";
  const outp5 = [
    {
      ruleName: "bad-named-html-entity-malformed-nbsp",
      entityName: "nbsp",
      rangeFrom: 0,
      rangeTo: 7,
      rangeValEncoded: "&nbsp;",
      rangeValDecoded: "\xA0"
    }
  ];
  t.deepEqual(fix(inp5, { cb: obj => obj }), outp5, "09.001.01");
});

test(`09.002 - ${`\u001b[${35}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space before semicolon`, t => {
  const inp5 = "&nbsp ;";
  const outp5 = [
    {
      ruleName: "bad-named-html-entity-malformed-nbsp",
      entityName: "nbsp",
      rangeFrom: 0,
      rangeTo: 7,
      rangeValEncoded: "&nbsp;",
      rangeValDecoded: "\xA0"
    }
  ];
  t.deepEqual(fix(inp5, { cb: obj => obj }), outp5, "09.002.01");
});

test(`09.003 - ${`\u001b[${35}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space before and after semicolon`, t => {
  const inp5 = "& nbsp ;";
  const outp5 = [
    {
      ruleName: "bad-named-html-entity-malformed-nbsp",
      entityName: "nbsp",
      rangeFrom: 0,
      rangeTo: 8,
      rangeValEncoded: "&nbsp;",
      rangeValDecoded: "\xA0"
    }
  ];
  t.deepEqual(fix(inp5, { cb: obj => obj }), outp5, "09.003.01");
});

// -----------------------------------------------------------------------------
// 10. not broken HTML entities: unrecognised or recognised and correct
// -----------------------------------------------------------------------------

test(`10.001 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`unrecognised`}\u001b[${39}m - one`, t => {
  const inp1 = "abc &x  y z; def";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-unrecognised`,
        entityName: null,
        rangeFrom: 4,
        rangeTo: 12,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "10.001"
  );
});

test(`10.002 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - recognised broken entity`, t => {
  const inp1 = "abc &poumd; def";
  const outp1 = [[4, 11, "&pound;"]];
  t.deepEqual(fix(inp1), outp1, "10.002.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "10.002.02");
});

test(`10.003 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - recognised broken entity, cb() separately`, t => {
  const inp1 = "abc &p oumd; def";
  // const outp1 = [[4, 12, "&pound;"]];
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-pound`,
        entityName: "pound",
        rangeFrom: 4,
        rangeTo: 12,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3" // <= pound symbol
      }
    ],
    "10.003"
  );
});

test(`10.004 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entity but with whitespace`, t => {
  const inp1 = "abc &p ou\nnd; def";
  const outp1 = [[4, 13, "&pound;"]];
  t.deepEqual(fix(inp1), outp1, "10.004.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "10.004.02");
});

test(`10.005 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entity but with capital letter`, t => {
  const inp1 = "x &Pound; y";
  const outp1 = [[2, 9, "&pound;"]];
  t.deepEqual(fix(inp1), outp1, "10.005.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "10.005.02");
});

test(`10.006 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit healthy entity should not raise any issues`, t => {
  const inp1 = "abc &pound; def";
  t.deepEqual(fix(inp1), [], "10.006.01");
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [],
    "10.006"
  );
});

test(`10.007 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - combo of a sneaky legit semicolon and missing semicolon on entity`, t => {
  const inp1 = "x &Pound2; y";
  // const outp1 = [[2, 8, "&pound;"]];
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-pound`,
        entityName: "pound",
        rangeFrom: 2,
        rangeTo: 8,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3" // <= pound symbol
      }
    ],
    "10.007"
  );
});

test(`10.008 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - combo of a sneaky legit semicolon and missing semicolon on entity`, t => {
  const inp1 = "a&poUnd;b";
  const outp1 = [[1, 8, "&pound;"]];
  t.deepEqual(fix(inp1), outp1, "10.008");
});

test(`10.009 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - only first two characters match legit entity`, t => {
  const inp1 = "abc &pozzz; def";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-unrecognised`,
        entityName: null,
        rangeFrom: 4,
        rangeTo: 11,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "10.009"
  );
});

test(`10.010 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - case issues`, t => {
  const inp1 = "&Poun;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-pound`,
        entityName: "pound",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3" // <= pound symbol
      }
    ],
    "10.010"
  );
});

test(`10.011 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - space before semicolon`, t => {
  const oneOfBrokenEntities = "a&pound ;b";
  t.deepEqual(
    fix(oneOfBrokenEntities, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-pound`,
        entityName: "pound",
        rangeFrom: 1,
        rangeTo: 9,
        rangeValEncoded: "&pound;",
        rangeValDecoded: "\xA3" // <= pound symbol
      }
    ],
    "10.011"
  );
});

test(`10.012 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - twoheadrightarrow wrong case only`, t => {
  const inp1 = "a&twoheadRightarrow;b";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-twoheadrightarrow`,
        entityName: "twoheadrightarrow",
        rangeFrom: 1,
        rangeTo: 20,
        rangeValEncoded: "&twoheadrightarrow;",
        rangeValDecoded: "\u21A0"
      }
    ],
    "10.012"
  );
});

test(`10.013 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - legit entities with capital letter and known existing alternative with all lowercase`, t => {
  const inp1 = "x&A lpha;y";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-Alpha`,
        entityName: "Alpha",
        rangeFrom: 1,
        rangeTo: 9,
        rangeValEncoded: "&Alpha;",
        rangeValDecoded: "\u0391"
      }
    ],
    "10.013"
  );
});

test(`10.014 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &ac d;`, t => {
  const inp1 = "&ac d;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-acd`,
        entityName: "acd",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&acd;",
        rangeValDecoded: "\u223F"
      }
    ],
    "10.014"
  );
});

test(`10.015 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Acd;`, t => {
  const inp1 = "&Acd;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-acd`,
        entityName: "acd",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&acd;",
        rangeValDecoded: "\u223F"
      }
    ],
    "10.015"
  );
});

test(`10.016 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &Aelig; - ambiguous case`, t => {
  const inp1 = "&Aelig;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-unrecognised`,
        entityName: null,
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "10.016"
  );
});

test(`10.017 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &zwjn; - known broken entities come before regular checks where semicol might be missing`, t => {
  const inp1 = "&zwjn;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-named-html-entity-malformed-zwnj`,
        entityName: "zwnj",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&zwnj;",
        rangeValDecoded: "\u200C"
      }
    ],
    "10.017"
  );
});

test(`10.018 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc - &xcap; - named entity starts with x`, t => {
  const inp1 = "&xcap;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [],
    "10.018.01"
  );
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj,
      decode: true
    }),
    [
      {
        ruleName: `encoded-html-entity-xcap`,
        entityName: "xcap",
        rangeFrom: 0,
        rangeTo: inp1.length,
        rangeValEncoded: "&xcap;",
        rangeValDecoded: "\u22C2"
      }
    ],
    "10.018.02"
  );
});

test(`10.019 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 1`, t => {
  const inp1 = "&nbsp;&nbsp;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    []
  );
});

test(`10.020 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 2`, t => {
  const inputs = [
    "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;",
    "&nbsp; &nbsp; &nbsp; a &nbsp; &nbsp; &nbsp;",
    " &nbsp; &nbsp; &nbsp; a &nbsp; &nbsp; &nbsp; ",
    "&nbsp;a&nbsp;a&nbsp; a &nbsp;a&nbsp;a&nbsp;",
    "&nbsp;\n&nbsp;\n&nbsp;\n\na\n&nbsp;\n&nbsp;\n&nbsp;",
    "&nbsp;\r\n&nbsp;\r\n&nbsp;\r\n\r\na\r\n&nbsp;\r\n&nbsp;\r\n&nbsp;",
    "&nbsp;\r&nbsp;\r&nbsp;\r\ra\r&nbsp;\r&nbsp;\r&nbsp;",
    "&nbsp;\t&nbsp;\t&nbsp;\t\ta\t&nbsp;\t&nbsp;\t&nbsp;",
    "&nbsp;&nbsp;&nbsp; a &nbsp;&nbsp;&nbsp;"
  ];
  inputs.forEach((input, i) =>
    t.deepEqual(fix(input), [], `"${input}" - ${i}`)
  );
});

test(`10.021 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 3`, t => {
  const inp1 = "&NBSP;&NBSP;";
  t.deepEqual(fix(inp1), [
    [0, 6, "&nbsp;"],
    [6, 12, "&nbsp;"]
  ]);
});

test(`10.022 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 4`, t => {
  const inp1 = "&NBSP;&NBSP;&NBSP; a &NBSP;&NBSP;&NBSP;";
  t.deepEqual(fix(inp1), [
    [0, 6, "&nbsp;"],
    [6, 12, "&nbsp;"],
    [12, 18, "&nbsp;"],
    [21, 27, "&nbsp;"],
    [27, 33, "&nbsp;"],
    [33, 39, "&nbsp;"]
  ]);
});

test(`10.023 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 5`, t => {
  const inp1 = "&nbsp;&nbsp;&bsp; a &nbsp;&nnbsp;&nbsp;";
  t.deepEqual(fix(inp1), [
    [12, 17, "&nbsp;"],
    [26, 33, "&nbsp;"]
  ]);
});

test(`10.024 - ${`\u001b[${34}m${`other cases`}\u001b[${39}m`} - \u001b[${32}m${`recognised`}\u001b[${39}m - ad hoc 6`, t => {
  const inp1 = "&nbsp;&bsp;&nnbsp; a &nbsp;&nnbsp;&nnbsp;";
  t.deepEqual(fix(inp1), [
    [6, 11, "&nbsp;"],
    [11, 18, "&nbsp;"],
    [27, 34, "&nbsp;"],
    [34, 41, "&nbsp;"]
  ]);
});

// -----------------------------------------------------------------------------
// 11. numeric entities
// -----------------------------------------------------------------------------

// decode on

test(`11.001 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode within ASCII range - A`, t => {
  const inp1 = "&#65;";
  t.deepEqual(
    fix(inp1, {
      decode: true,
      cb: obj => obj
    }),
    [
      {
        ruleName: `encoded-numeric-html-entity-reference`,
        entityName: "#65",
        rangeFrom: 0,
        rangeTo: 5,
        rangeValEncoded: "&#65;",
        rangeValDecoded: "A"
      }
    ],
    "11.001"
  );
});

test(`11.002 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`, t => {
  const inp1 = "&#163;";
  t.deepEqual(
    fix(inp1, {
      decode: true,
      cb: obj => obj
    }),
    [
      {
        ruleName: `encoded-numeric-html-entity-reference`,
        entityName: "#163",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&#163;",
        rangeValDecoded: "\xA3"
      }
    ],
    "11.002"
  );
});

test(`11.003 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - non-existing number`, t => {
  const inp1 = "&#99999999999999999;";
  t.deepEqual(
    fix(inp1, {
      decode: true,
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-malformed-numeric-character-entity`,
        entityName: null,
        rangeFrom: 0,
        rangeTo: 20,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "11.003"
  );
});

// decode off

test(`11.004 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, within ASCII range - A`, t => {
  const inp1 = "&#65;";
  t.deepEqual(
    fix(inp1, {
      decode: false,
      cb: obj => obj
    }),
    [],
    "11.004"
  );
});

test(`11.005 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - pound`, t => {
  const inp1 = "&#163;";
  t.deepEqual(
    fix(inp1, {
      decode: false,
      cb: obj => obj
    }),
    [],
    "11.005"
  );
});

test(`11.006 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - non-existing number`, t => {
  const inp1 = "&#99999999999999999;";
  t.deepEqual(
    fix(inp1, {
      decode: false,
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-malformed-numeric-character-entity`,
        entityName: null,
        rangeFrom: 0,
        rangeTo: 20,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "11.006"
  );
});

test(`11.007 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - dollar instead of hash`, t => {
  const inp1 = "&$65;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-malformed-numeric-character-entity`,
        entityName: null,
        rangeFrom: 0,
        rangeTo: 5,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "11.007"
  );
});

test(`11.008 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decoding text with healthy numeric entities`, t => {
  const inp1 = "something here &#163;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj,
      decode: false
    }),
    [],
    "11.008.001"
  );
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj,
      decode: true
    }),
    [
      {
        ruleName: `encoded-numeric-html-entity-reference`,
        entityName: "#163",
        rangeFrom: 15,
        rangeTo: 21,
        rangeValEncoded: "&#163;",
        rangeValDecoded: "\xA3"
      }
    ],
    "11.008.002"
  );
  t.deepEqual(fix(inp1, { decode: true }), [[15, 21, "\xA3"]], "11.008.03");
});

test(`11.009 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`, t => {
  const inp1 = "&#xA3;";
  t.deepEqual(fix(inp1, { decode: true }), [[0, 6, "\xA3"]], "11.009.01");
  t.deepEqual(
    fix(inp1, {
      decode: true,
      cb: obj => obj
    }),
    [
      {
        ruleName: `encoded-numeric-html-entity-reference`,
        entityName: "#xA3",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: inp1,
        rangeValDecoded: "\xA3"
      }
    ],
    "11.009.02"
  );
});

test(`11.010 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, no decode - pound`, t => {
  const inp1 = "&x#A3;";
  t.deepEqual(
    fix(inp1, {
      decode: false,
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-malformed-numeric-character-entity`,
        entityName: null,
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "11.010"
  );
});

test(`11.011 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, with decode - pound`, t => {
  const inp1 = "&x#A3;";
  t.deepEqual(fix(inp1, { decode: true }), [[0, 6]], "11.011.01");
  t.deepEqual(
    fix(inp1, {
      decode: true,
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-malformed-numeric-character-entity`,
        entityName: null,
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "11.011.02"
  );
});

test(`11.012 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - &#x pattern with hash missing`, t => {
  const inp1 = "&x1000;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-malformed-numeric-character-entity`,
        entityName: null,
        rangeFrom: 0,
        rangeTo: 7,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "11.012"
  );
});

test(`11.013 - ${`\u001b[${33}m${`numeric entities`}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - missing ampersand`, t => {
  const inp1 = "abc#x26;def";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj
    }),
    [
      {
        ruleName: `bad-malformed-numeric-character-entity`,
        entityName: null,
        rangeFrom: 3,
        rangeTo: 8,
        rangeValEncoded: null,
        rangeValDecoded: null
      }
    ],
    "11.013"
  );
});

// -----------------------------------------------------------------------------
// 12. False positives
// -----------------------------------------------------------------------------

test(`12.001 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - legit pound, no decode`, t => {
  const inp1 = "one pound;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj,
      decode: false
    }),
    [],
    "12.001"
  );
});

test(`12.002 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - legit pound, no decode`, t => {
  const inp1 = "one pound;";
  t.deepEqual(
    fix(inp1, {
      cb: obj => obj,
      decode: true
    }),
    [],
    "12.002"
  );
});

// -----------------------------------------------------------------------------
// 13. opts.entityCatcherCb - all entities callback
// -----------------------------------------------------------------------------

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

test(`13.001 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, with callback, no decode`, t => {
  const inp1 = "y &nbsp; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 8]], "13.001");
});

test(`13.002 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, without callback, no decode`, t => {
  const inp1 = "y &nbsp; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 8]], "13.002");
});

test(`13.003 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, with callback, with decode`, t => {
  const inp1 = "y &nbsp; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 8]], "13.003");
});

test(`13.004 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - one named entity, without callback, with decode`, t => {
  const inp1 = "y &nbsp; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 8]], "13.004");
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

test(`13.005 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, with callback, no decode`, t => {
  const inp1 = "y &isindot; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 11]], "13.005");
});

test(`13.006 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, without callback, no decode`, t => {
  const inp1 = "y &isindot; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 11]], "13.006");
});

test(`13.007 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, with callback, with decode`, t => {
  const inp1 = "y &isindot; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 11]], "13.007");
});

test(`13.008 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`isindot`}\u001b[${39}m`} - one named entity, without callback, with decode`, t => {
  const inp1 = "y &isindot; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 11]], "13.008");
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

// Two ranges are reported below because we report everything straight away,
// upon finding, as opposed to issue ranges which get deduped

// For perf reasons, opts.entityCatcherCb can report the same range multiple times

test(`13.009 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, with callback, no decode`, t => {
  const inp1 = "y &nsp; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(
    gatheredEntityRanges,
    [
      [2, 7],
      [2, 7]
    ],
    "13.009"
  );
});

test(`13.010 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, without callback, no decode`, t => {
  const inp1 = "y &nsp; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(
    gatheredEntityRanges,
    [
      [2, 7],
      [2, 7]
    ],
    "13.010"
  );
});

test(`13.011 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, with callback, with decode`, t => {
  const inp1 = "y &nsp; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(
    gatheredEntityRanges,
    [
      [2, 7],
      [2, 7]
    ],
    "13.011"
  );
});

test(`13.012 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`nsp`}\u001b[${39}m`} - one broken entity, without callback, with decode`, t => {
  const inp1 = "y &nsp; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(
    gatheredEntityRanges,
    [
      [2, 7],
      [2, 7]
    ],
    "13.012"
  );
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

test(`13.013 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, with callback, no decode`, t => {
  const inp1 = "y &abcdefg; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 11]], "13.013");
});

test(`13.014 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, without callback, no decode`, t => {
  const inp1 = "y &abcdefg; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 11]], "13.014");
});

test(`13.015 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, with callback, with decode`, t => {
  const inp1 = "y &abcdefg; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 11]], "13.015");
});

test(`13.016 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`abcdefg`}\u001b[${39}m`} - one broken entity, without callback, with decode`, t => {
  const inp1 = "y &abcdefg; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 11]], "13.016");
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

test(`13.017 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, with callback, no decode`, t => {
  const inp1 = "y &#65; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 7]], "13.017");
});

test(`13.018 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, without callback, no decode`, t => {
  const inp1 = "y &#65; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 7]], "13.018");
});

test(`13.019 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, with callback, with decode`, t => {
  const inp1 = "y &#65; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 7]], "13.019");
});

test(`13.020 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one decimal numeric entity, without callback, with decode`, t => {
  const inp1 = "y &#65; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 7]], "13.020");
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

test(`13.021 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one broken decimal numeric entity`, t => {
  const inp1 = "y &65; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 6]], "13.021");
});

test(`13.022 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`#65`}\u001b[${39}m`} - one broken decimal numeric entity`, t => {
  const inp1 = "y &#99999999999999999999; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 25]], "13.022");
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

test(`13.021 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, with callback, no decode`, t => {
  const inp1 = "y &x#A3; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 8]], "13.021");
});

test(`13.022 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, without callback, no decode`, t => {
  const inp1 = "y &x#A3; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: false
  });
  t.deepEqual(gatheredEntityRanges, [[2, 8]], "13.022");
});

test(`13.023 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, with callback, with decode`, t => {
  const inp1 = "y &x#A3; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    cb: obj => obj,
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 8]], "13.023");
});

test(`13.024 - ${`\u001b[${36}m${`opts.entityCatcherCb`}\u001b[${39}m`} - ${`\u001b[${33}m${`x#A3`}\u001b[${39}m`} - one decimal numeric entity, without callback, with decode`, t => {
  const inp1 = "y &x#A3; z";
  const gatheredEntityRanges = [];
  fix(inp1, {
    entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
    decode: true
  });
  t.deepEqual(gatheredEntityRanges, [[2, 8]], "13.024");
});

// -----------------------------------------------------------------------------

// TODO:

// 1. Tend all commonly typed and mis-typed entities:
// aacute
// eacute
// zwnj

// 2. Challenge: an entity which is messed up, actually can't be used in named
// form at all and its numeric variant should be used instead. Does this library
// allow to override the result being written? (cb() probably does already).

// 3. Add automated unit test to check all named html entities, without amp
// and also test to check all without without semicolon.

// 4. Consider adding a new array of all entities which are definitely not part
// of any normal content. For example, "CapitalDifferentialD".
// Those should be patched up more aggresively.
// And on the opposite - dubious entities like "block;" can be part of legit text.
