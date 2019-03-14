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
  const outp1 = [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.001.01 - letter + nbsp");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.001.02 - letter + nbsp + cb");
});

test(`02.002 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, spaced`, t => {
  const inp2 = "zz nbsp;zz nbsp;";
  const outp2 = [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]];
  t.deepEqual(fix(inp2), outp2, "02.002.01 - space + nbsp");
  t.deepEqual(fix(inp2, { cb }), outp2, "02.002.02 - space + nbsp + cb");
});

test(`02.003 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, linebreaks`, t => {
  const inp3 = "zz\nnbsp;zz\nnbsp;";
  const outp3 = [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]];
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
  const outp5 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]];
  t.deepEqual(fix(inp5), outp5, "02.005.01");
  t.deepEqual(fix(inp5, { cb }), outp5, "02.005.02");
});

test(`02.006 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, with semicol, tight, repeated + decode`, t => {
  const inp1 = "zzznbsp;zzznbsp;";
  const outp1 = [[3, 8, "\xA0"], [11, 16, "\xA0"]];
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
  const outp2 = [[3, 8, "\xA0"], [11, 16, "\xA0"]];
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
  const outp1 = [[3, 8, "\xA0"], [11, 16, "\xA0"]];
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
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.010.01");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.010.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.010.03");
});

test(`02.011 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, isolated`, t => {
  const inp1 = "&nbspz &nbspz";
  const outp1 = [[5, 5, ";"], [12, 12, ";"]];
  t.deepEqual(fix(inp1), outp1, "02.011.01 - warmup");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.011.02 - warmup");
});

test(`02.012 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, spaced`, t => {
  const inp1 = "&nbspz; &nbspz;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.012.01 - warmup");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.012.02");
});

test(`02.013 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tight`, t => {
  const inp1 = "&nbspzzz&nbspzzz&nbsp";
  const outp1 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(fix(inp1), outp1, "02.013.01 - surrounded by letters");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.013.02");
});

test(`02.014 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, dots`, t => {
  const inp1 = "&nbsp...&nbsp...&nbsp";
  const outp1 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(fix(inp1), outp1, "02.014.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.014.02");
});

test(`02.015 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, line breaks`, t => {
  const inp1 = "&nbsp\n\n\n&nbsp\n\n\n&nbsp";
  const outp1 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(fix(inp1), outp1, "02.015.01 - surrounded by line breaks");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.015.02");
});

test(`02.016 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, well spaced`, t => {
  const inp1 = "&nbsp   &nbsp   &nbsp";
  const outp1 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(fix(inp1), outp1, "02.016.01 - surrounded by spaces");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.016.02");
});

test(`02.017 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, commas`, t => {
  const inp1 = "&nbsp,&nbsp,&nbsp";
  const outp1 = [[5, 5, ";"], [11, 11, ";"], [17, 17, ";"]];
  t.deepEqual(fix(inp1), outp1, "02.017.01 - surrounded by colons");
  t.deepEqual(fix(inp1), outp1, "02.017.02");
});

test(`02.018 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, digits`, t => {
  const inp1 = "&nbsp123&nbsp123&nbsp";
  const outp1 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(fix(inp1), outp1, "02.018.01 - surrounded by digits");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.018.02");
});

test(`02.019 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tabs`, t => {
  const inp1 = "&nbsp\t\t\t&nbsp\t\t\t&nbsp";
  const outp1 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(fix(inp1), outp1, "02.019.01 - surrounded by tabs");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.019.02");
});

test(`02.020 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, letter + decode`, t => {
  const inp1 = "&nbspz &nbspz";
  const outp1 = [[0, 5, "\xA0"], [7, 12, "\xA0"]];
  const outp2 = [[5, 5, ";"], [12, 12, ";"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.020.01 - warmup");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.020.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp2, "02.020.03");
});

test(`02.021 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, spaced + decode`, t => {
  const inp1 = "&nbspz; &nbspz;";
  const outp1 = [[0, 7, "\xA0"], [8, 15, "\xA0"]];
  t.deepEqual(fix(inp1, { decode: true }), outp1, "02.021.01 - warmup");
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.021.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp1, "02.021.03");
});

test(`02.022 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tight + decode`, t => {
  const inp1 = "&nbspzzz&nbspzzz&nbsp";
  // if raw (unencoded) entity is requested (opts.decode === true), we have to
  // replace all entity characters:
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  // if encoded entity is requested (opts.decode === false), we only insert the
  // missing semicolon and call it a day:
  const outp2 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.022.01 - surrounded by letters"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.022.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp2, "02.022.03");
});

test(`02.023 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, dots + decode`, t => {
  const inp1 = "&nbsp...&nbsp...&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  const outp2 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.023.01 - surrounded by dots"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.023.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp2, "02.023.03");
});

test(`02.024 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, line breaks + decode`, t => {
  const inp1 = "&nbsp\n\n\n&nbsp\n\n\n&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  const outp2 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.024.01 - surrounded by line breaks"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.024.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp2, "02.024.03");
});

test(`02.025 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, well spaced + decode`, t => {
  const inp1 = "&nbsp   &nbsp   &nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  const outp2 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.025.01 - surrounded by spaces"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.025.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp2, "02.025.03");
});

test(`02.026 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, commas + decode`, t => {
  const inp1 = "&nbsp,&nbsp,&nbsp";
  const outp1 = [[0, 5, "\xA0"], [6, 11, "\xA0"], [12, 17, "\xA0"]];
  const outp2 = [[5, 5, ";"], [11, 11, ";"], [17, 17, ";"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.026.01 - surrounded by colons"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.026.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp2, "02.026.03");
});

test(`02.027 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, digits + decode`, t => {
  const inp1 = "&nbsp123&nbsp123&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  const outp2 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.027.01 - surrounded by digits"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.027.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp2, "02.027.03");
});

test(`02.028 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - amp, no semicol, tabs + decode`, t => {
  const inp1 = "&nbsp\t\t\t&nbsp\t\t\t&nbsp";
  const outp1 = [[0, 5, "\xA0"], [8, 13, "\xA0"], [16, 21, "\xA0"]];
  const outp2 = [[5, 5, ";"], [13, 13, ";"], [21, 21, ";"]];
  t.deepEqual(
    fix(inp1, { decode: true }),
    outp1,
    "02.028.01 - surrounded by tabs"
  );
  t.deepEqual(fix(inp1, { decode: true, cb: cbDecoded }), outp1, "02.028.02");
  t.deepEqual(fix(inp1, { decode: false, cb: cbDecoded }), outp2, "02.028.03");
});

test(`02.029 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${32}m${`correct spelling`}\u001b[${39}m - no amp, no semicol, trailing letter`, t => {
  const inp1 = "nbspz";
  const outp1 = [[0, 4, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.029.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.029.01");
});

test(`02.030 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing letter, sandwitched`, t => {
  const inp1 = "nbspzzznbspzzznbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.030.01 - surrounded by letters");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.030.02");
});

test(`02.031 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing dots, sandwitched`, t => {
  const inp1 = "nbsp...nbsp...nbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.031.01 - surrounded by dots");
  t.deepEqual(fix(inp1), outp1, "02.031.02");
});

test(`02.032 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing linebreaks, sandwitched`, t => {
  const inp1 = "nbsp\n\n\nnbsp\n\n\nnbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.032.01 - surrounded by line breaks");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.032.02");
});

test(`02.033 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing whitespace chunks, sandwitched`, t => {
  const inp1 = "nbsp   nbsp   nbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.033.01 - surrounded by spaces");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.033.02");
});

test(`02.034 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing tight commas, sandwitched`, t => {
  const inp1 = "nbsp,nbsp,nbsp";
  const outp1 = [[0, 4, "&nbsp;"], [5, 9, "&nbsp;"], [10, 14, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.034.01 - surrounded by colons");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.034.02");
});

test(`02.035 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing digits, sandwitched`, t => {
  const inp1 = "nbsp123nbsp123nbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.035.01 - surrounded by digits");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.035.02");
});

test(`02.036 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`no amp, no semicol`}\u001b[${39}m - trailing tight tabs, sandwitched`, t => {
  const inp1 = "nbsp\t\t\tnbsp\t\t\tnbsp";
  const outp1 = [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.036.01 - surrounded by tabs");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.036.02");
});

test(`02.037 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - repeated characters - complete set - \u001b[${36}m${`repeated`}\u001b[${39}m amp, tight, leading letters`, t => {
  const inp1 = "&&nbsp;x&&nbsp;y&&nbsp;";
  const outp1 = [[1, 2], [9, 10], [17, 18]];
  t.deepEqual(fix(inp1), outp1, "02.037.01 - duplicate ampersand");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.037.02");

  const inp2 = "&&&&nbsp;x&&&&nbsp;y&&&&nbsp;";
  const outp2 = [[1, 4], [11, 14], [21, 24]];
  t.deepEqual(fix(inp2), outp2, "02.037.01 - duplicate ampersand");
  t.deepEqual(fix(inp2, { cb }), outp2, "02.037.02");
});

test(`02.038 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate n`, t => {
  const inp1 = "&nnbsp;x&nnbsp;y&nnbsp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.038.01 - duplicate n");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.038.02");
});

test(`02.039 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate b`, t => {
  const inp1 = "&nbbsp;x&nbbsp;y&nbbsp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.039.01 - duplicate b");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.039.02");
});

test(`02.040 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate s`, t => {
  const inp1 = "&nbssp;x&nbssp;y&nbssp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.040.01 - duplicate s");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.040.02");
});

test(`02.041 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m characters - complete set - duplicate p`, t => {
  const inp1 = "&nbspp;x&nbspp;y&nbspp;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.041.01 - duplicate p");
  t.deepEqual(fix(inp1), outp1, "02.041.02");
});

test(`02.042 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol`, t => {
  const inp1 = "&nbsp;;x&nbsp;;y&nbsp;;";
  const outp1 = [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.042.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.042.02");
});

test(`02.043 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + n missing`, t => {
  const inp1 = "&&bsp;x&&bsp;y&&bsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  // t.deepEqual(fix(inp1), outp1, "02.043.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.043.02");
});

test(`02.044 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + b missing`, t => {
  const inp1 = "&&nsp;x&&nsp;y&&nsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.044.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.044.02");
});

test(`02.045 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + s missing`, t => {
  const inp1 = "&&nbp;x&&nbp;y&&nbp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.045.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.045.02");
});

test(`02.046 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand + p missing`, t => {
  const inp1 = "&&nbs;x&&nbs;y&&nbs;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.046.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.046.02");
});

test(`02.047 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m ampersand - semicol missing`, t => {
  const inp1 = "&&nbspx&&nbspy&&nbsp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.047.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.047.02");
});

test(`02.048 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - ampersand missing`, t => {
  // repeated n + ...
  const inp1 = "nnbsp;xnnbsp;ynnbsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.048.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.048.02");
});

test(`02.049 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - b missing`, t => {
  const inp1 = "&nnsp;x&nnsp;y&nnsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.049.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.049.02");
});

test(`02.050 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - s missing`, t => {
  const inp1 = "&nnbp;x&nnbp;y&nnbp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.050.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.050.02");
});

test(`02.051 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - s missing`, t => {
  const inp1 = "&nnbs;x&nnbs;y&nnbs;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.051.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.051.02");
});

test(`02.052 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m n - semicol missing`, t => {
  const inp1 = "&nnbspx&nnbspy&nnbsp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.052.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.052.02");
});

test(`02.053 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - ampersand missing`, t => {
  const inp1 = "nbbsp;xnbbsp;ynbbsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.053.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.053.02");
});

test(`02.054 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - n missing`, t => {
  const inp1 = "&bbsp;x&bbsp;y&bbsp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.054.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.054.02");
});

test(`02.055 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - s missing`, t => {
  const inp1 = "&nbbp;x&nbbp;y&nbbp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.055.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.055.02");
});

test(`02.056 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - p missing`, t => {
  const inp1 = "&nbbs;x&nbbs;y&nbbs;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.056.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.056.02");
});

test(`02.057 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m b - semicol missing`, t => {
  const inp1 = "&nbbspx&nbbspy&nbbsp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.057.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.057.02");
});

test(`02.058 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - ampersand missing`, t => {
  const inp1 = "nbssp;xnbssp;ynbssp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.058.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.058.02");
});

test(`02.059 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - n missing`, t => {
  const inp1 = "&bssp;x&bssp;y&bssp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.059.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.059.02");
});

test(`02.060 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - b missing`, t => {
  const inp1 = "&nssp;x&nssp;y&nssp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.060.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.060.02");
});

test(`02.061 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - p missing`, t => {
  const inp1 = "&nbss;x&nbss;y&nbss;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.061.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.061.02");
});

test(`02.062 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m s - semicol missing`, t => {
  const inp1 = "&nbsspx&nbsspy&nbssp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.062.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.062.02");
});

test(`02.063 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - ampersand missing`, t => {
  const inp1 = "nbspp;xnbspp;ynbspp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.063.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.063.02");
});

test(`02.064 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - n missing`, t => {
  const inp1 = "&bspp;x&bspp;y&bspp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.064.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.064.02");
});

test(`02.065 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - b missing`, t => {
  const inp1 = "&nspp;x&nspp;y&nspp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.065.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.065.02");
});

test(`02.066 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - s missing`, t => {
  const inp1 = "&nbpp;x&nbpp;y&nbpp;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.066.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.066.02");
});

test(`02.067 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m p - semicol missing`, t => {
  const inp1 = "&nbsppx&nbsppy&nbspp";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.067.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.067.02");
});

test(`02.068 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - ampersand missing`, t => {
  const inp1 = "nbsp;;xnbsp;;ynbsp;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.068.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.068.02");
});

test(`02.069 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - n missing`, t => {
  const inp1 = "&bsp;;x&bsp;;y&bsp;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.069.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.069.02");
});

test(`02.070 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - b missing`, t => {
  const inp1 = "&nsp;;x&nsp;;y&nsp;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.070.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.070.02");
});

test(`02.071 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - s missing`, t => {
  const inp1 = "&nbp;;x&nbp;;y&nbp;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.071.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.071.02");
});

test(`02.072 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${34}m${`incorrect spelling`}\u001b[${39}m - \u001b[${36}m${`repeated`}\u001b[${39}m semicol - p missing`, t => {
  const inp1 = "&nbs;;x&nbs;;y&nbs;;";
  const outp1 = [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]];
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
  const outp1 = [[2, 6]];
  t.deepEqual(fix(inp1), outp1, "02.084.01 - twice-encoded");
  t.deepEqual(rangesMerge(fix(inp1, { cb })), outp1, "02.084.02");
});

test(`02.085 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`recursively encoded entities`}\u001b[${39}m - thrice`, t => {
  const inp1 = "a&amp;amp;nbsp;b";
  const outp1 = [[2, 10]];
  t.deepEqual(fix(inp1), outp1, "02.085.01");
  t.deepEqual(rangesMerge(fix(inp1, { cb })), outp1, "02.085.02");
});

test(`02.086 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${31}m${`recursively encoded entities`}\u001b[${39}m - quadruple`, t => {
  const inp1 = "a&amp;amp;amp;nbsp;b";
  const outp1 = [[2, 14]];
  t.deepEqual(fix(inp1), outp1, "02.086.01");
  t.deepEqual(rangesMerge(fix(inp1, { cb })), outp1, "02.086.02");
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
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.091.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.091.02");
});

test(`02.092 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${35}m${`missing semicolon when ampersand is present`}\u001b[${39}m - S capital`, t => {
  const inp1 = "&NbSpzzz&NbSpzzz";
  const outp1 = [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.092.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.092.02");
});

test(`02.093 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N capital`, t => {
  const inp1 = "textNbsp;texttextNbsp;text";
  const outp1 = [[4, 9, "&nbsp;"], [17, 22, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.093.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.093.02");
});

test(`02.094 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N & S capitals`, t => {
  const inp1 = "&&NbSpzzz&&NbSpzzz";
  const outp1 = [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.094.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.094.02");
});

test(`02.095 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N & S capitals, repetition`, t => {
  const inp1 = "&NbSspzzz&NbSspzzz";
  const outp1 = [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.095.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.095.02");
});

test(`02.096 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition`, t => {
  const inp1 = "&NbSsPzzz&NbSsPzzz";
  const outp1 = [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.096.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.096.02");
});

test(`02.097 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition, trailing space, tight`, t => {
  const inp1 = "&NbSsP zzz&NbSsP zzz";
  const outp1 = [[0, 6, "&nbsp;"], [10, 16, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.097.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.097.02");
});

test(`02.098 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`ampersand present, no semicolon`}\u001b[${39}m - N, S & P capitals, repetition, trailing space, spaced`, t => {
  const inp1 = "&NbSsP zzz &NbSsP zzz";
  const outp1 = [[0, 6, "&nbsp;"], [11, 17, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.098.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.098.02");
});

test(`02.099 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${90}m${`swapped letters`}\u001b[${39}m - full set`, t => {
  const inp1 = "a&bnsp;b&nsbp;c&nspb;";
  const outp1 = [[1, 7, "&nbsp;"], [8, 14, "&nbsp;"], [15, 21, "&nbsp;"]];
  t.deepEqual(fix(inp1), outp1, "02.099.01");
  t.deepEqual(fix(inp1, { cb }), outp1, "02.099.02");
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

test(`02.111 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - missing semicolon gets reported as such`, t => {
  const inp5 = "aaa&nbspbbb";
  const outp5 = [
    {
      ruleName: "bad-named-html-entity-missing-semicolon",
      entityName: "nbsp",
      rangeFrom: 8,
      rangeTo: 8,
      rangeValEncoded: ";",
      rangeValDecoded: ";"
    }
  ];
  t.deepEqual(fix(inp5, { cb: obj => obj }), outp5, "02.111.02");
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
    [[0, 7, "&thinsp;"], [7, 14, "&thinsp;"]],
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
    [[0, 7, "\u2009"], [7, 14, "\u2009"]],
    "04.002.13 - joins"
  );
});

// -----------------------------------------------------------------------------
// 05. multiple encoding
// -----------------------------------------------------------------------------

test(`05.001 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - no consecutive &amp;`, t => {
  const inp1 = "&amp;";
  t.deepEqual(fix(inp1), null, "05.001");
});

test(`05.002 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp;`, t => {
  const inp1 = "&amp; &amp; &amp;";
  t.deepEqual(fix(inp1), null, "05.002");
});

test(`05.003 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`, t => {
  const inp1 = "&amp;&amp;&amp;";
  t.deepEqual(fix(inp1), null, "05.003");
});

test(`05.004 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - consecutive &amp; tight`, t => {
  const inp1 = "abc&amp;&amp;&amp;xyz";
  t.deepEqual(fix(inp1), null, "05.004");
});

test(`05.005 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #1`, t => {
  const inp1 = "B&amp;Q";
  t.deepEqual(fix(inp1), null, "05.005");
});

test(`05.006 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`&amp;`}\u001b[${39}m - B&Q #2`, t => {
  const inp1 = "text B&amp;Q text";
  t.deepEqual(fix(inp1), null, "05.006");
});

test(`05.007 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - double encoded - no cb`, t => {
  const inp1 = "text&amp;nbsp;text";
  t.deepEqual(fix(inp1), [[5, 9]], "05.007 - double encoded");
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
            entityName: "amp",
            rangeFrom: 5,
            rangeTo: 9,
            rangeValEncoded: null,
            rangeValDecoded: null
          },
          "05.008.01"
        );

        // same cb() callback as defined at the top of this file:
        return received.rangeValEncoded
          ? [received.rangeFrom, received.rangeTo, received.rangeValEncoded]
          : [received.rangeFrom, received.rangeTo];
      }
    }),
    [[5, 9]],
    "05.008.02 - double encoded"
  );
});

test(`05.009 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - triple encoded`, t => {
  const inp1 = "text&amp;amp;nbsp;text";
  t.deepEqual(fix(inp1), [[5, 13]], "05.009 - triple encoded");

  const inp2 = "text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text";
  t.deepEqual(fix(inp2), [[5, 49]], "05.009 - triple encoded");
});

test(`05.010 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand - no cb`, t => {
  const inp1 = "textamp;nbsp;text";
  t.deepEqual(fix(inp1), [[4, 8, "&"]], "05.010.01");

  const inp2 = "text amp;nbsp;text";
  t.deepEqual(fix(inp2), [[5, 9, "&"]], "05.010.02");

  const inp3 = "text\tamp;nbsp;text";
  t.deepEqual(fix(inp3), [[4, 9, " &"]], "05.010.03");

  const inp4 = "text\namp;nbsp;text";
  t.deepEqual(fix(inp4), [[5, 9, "&"]], "05.010.04");
});

test(`05.011 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nbsp`}\u001b[${39}m - combo with malformed nbsp - missing opening ampersand - cb`, t => {
  const inp1 = "textamp;nbsp;text";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "amp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-entity-multiple-encoding"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[4, 8, "&"]],
    "05.011.02"
  );
});

test(`05.012 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set`, t => {
  const inp1 = "textamp;nsp;text";
  t.deepEqual(fix(inp1), [[4, 12, "&nbsp;"]], "05.012");
});

test(`05.013 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - cb`, t => {
  const inp1 = "textamp;nsp;text";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "amp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-entity-multiple-encoding"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[4, 12, "&nbsp;"]],
    "05.013"
  );
});

test(`05.014 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - extreme #1`, t => {
  const inp1 = "text    a  m p   ; a  mp   ; a m   p   ;   n   s p    ;text";
  t.deepEqual(fix(inp1), [[5, 55, "&nbsp;"]], "05.014");
});

test(`05.015 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - extreme #1 - cb`, t => {
  const inp1 = "text    a  m p   ; a  mp   ; a m   p   ;   n   s p    ;text";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "amp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-entity-multiple-encoding"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[5, 55, "&nbsp;"]],
    "05.015"
  );
});

test(`05.016 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - extreme #2`, t => {
  const inp1 =
    "text    &  a  m p   ; a  mp   ; a m   p   ;    n   s p    ;text";
  t.deepEqual(fix(inp1), [[5, 59, "&nbsp;"]], "05.016");
});

test(`05.017 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`nsp`}\u001b[${39}m - missing ampersand + incomplete nbsp letter set - extreme #2 - cb`, t => {
  const inp1 =
    "text    &  a  m p   ; a  mp   ; a m   p   ;    n   s p    ;text";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "amp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-entity-multiple-encoding"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[5, 59, "&nbsp;"]],
    "05.017"
  );
});

test(`05.018 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #1`, t => {
  const inp1 = "abc &nbs;";
  t.deepEqual(fix(inp1), [[4, 9, "&nbsp;"]], "05.018");
});

test(`05.019 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #2`, t => {
  const inp1 = "abc &nbs;";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[4, 9, "&nbsp;"]],
    "05.019"
  );
});

test(`05.020 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #3`, t => {
  const inp1 = "abc &nbs; xyz";
  t.deepEqual(fix(inp1), [[4, 9, "&nbsp;"]], "05.020.01");
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[4, 9, "&nbsp;"]],
    "05.020.02"
  );

  const inp2 = "&nbs; xyz";
  t.deepEqual(fix(inp2), [[0, 5, "&nbsp;"]], "05.020.03");
  t.deepEqual(
    fix(inp2, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[0, 5, "&nbsp;"]],
    "05.020.04"
  );
});

test(`05.021 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #4`, t => {
  const inp1 = "abc&nbs;";
  t.deepEqual(fix(inp1), [[3, 8, "&nbsp;"]], "05.021");
});

test(`05.022 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #5`, t => {
  const inp1 = "abc&nbs;";
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-entity-malformed-nbsp"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[3, 8, "&nbsp;"]],
    "05.022"
  );
});

test(`05.023 - ${`\u001b[${34}m${`double-encoding`}\u001b[${39}m`} - \u001b[${32}m${`isolated nbs`}\u001b[${39}m - simple case #6`, t => {
  const inp1 = "abc&nbs; xyz";
  t.deepEqual(fix(inp1), [[3, 8, "&nbsp;"]], "05.023.01");
  t.deepEqual(
    fix(inp1, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-malformed-nbsp"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[3, 8, "&nbsp;"]],
    "05.023.02"
  );

  const inp2 = "&nbs; xyz";
  t.deepEqual(fix(inp2), [[0, 5, "&nbsp;"]], "05.023.03");
  t.deepEqual(
    fix(inp2, {
      cb: received => {
        t.deepEqual(
          received,
          {
            entityName: "nbsp",
            rangeFrom: 4,
            rangeTo: 8,
            rangeValDecoded: "&",
            rangeValEncoded: "&",
            ruleName: "bad-named-html-malformed-nbsp"
          },
          "05.011.01"
        );
        return cb(received);
      }
    }),
    [[0, 5, "&nbsp;"]],
    "05.023.04"
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
    [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]],
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
// 07. spaces within entities
// -----------------------------------------------------------------------------

// test(`07.001 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space after ampersand`, t => {
//   const inp5 = "& nbsp;";
//   const outp5 = [
//     {
//       ruleName: "bad-named-html-entity-malformed-nbsp",
//       entityName: "nbsp",
//       rangeFrom: 0,
//       rangeTo: 7,
//       rangeValEncoded: "&nbsp;",
//       rangeValDecoded: "\xA0"
//     }
//   ];
//   t.deepEqual(fix(inp5, { cb: obj => obj }), outp5, "07.001.01");
// });
//
// test(`07.002 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space before semicolon`, t => {
//   const inp5 = "&nbsp ;";
//   const outp5 = [
//     {
//       ruleName: "bad-named-html-entity-malformed-nbsp",
//       entityName: "nbsp",
//       rangeFrom: 0,
//       rangeTo: 7,
//       rangeValEncoded: "&nbsp;",
//       rangeValDecoded: "\xA0"
//     }
//   ];
//   t.deepEqual(fix(inp5, { cb: obj => obj }), outp5, "07.002.01");
// });
//
// test(`07.003 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - \u001b[${36}m${`nbsp`}\u001b[${39}m - space before semicolon`, t => {
//   const inp5 = "& nbsp ;";
//   const outp5 = [
//     {
//       ruleName: "bad-named-html-entity-malformed-nbsp",
//       entityName: "nbsp",
//       rangeFrom: 0,
//       rangeTo: 8,
//       rangeValEncoded: "&nbsp;",
//       rangeValDecoded: "\xA0"
//     }
//   ];
//   t.deepEqual(fix(inp5, { cb: obj => obj }), outp5, "07.003.01");
// });

// -----------------------------------------------------------------------------

// TODO:
// Tend the following:
// aacute
// eacute
// zwj
