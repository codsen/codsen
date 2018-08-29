import test from "ava";
import fix from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - various cases of wrong input arguments`, t => {
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

// -----------------------------------------------------------------------------
// 02. special attention to nbsp - people will type it by hand often, making mistakes
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - correct spelling, missing ampersand`, t => {
  t.deepEqual(
    fix("zzznbsp;zzznbsp;"),
    [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]],
    "02.01.01 - letter + nbsp"
  );
  t.deepEqual(
    fix("zz nbsp;zz nbsp;"),
    [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]],
    "02.01.02 - space + nbsp"
  );
  t.deepEqual(
    fix("zz\nnbsp;zz\nnbsp;"),
    [[3, 8, "&nbsp;"], [11, 16, "&nbsp;"]],
    "02.01.03 - line break + nbsp"
  );
  t.deepEqual(fix("nbsp;"), [[0, 5, "&nbsp;"]], "02.01.04");
  t.deepEqual(
    fix("nbsp;zzznbsp;"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]],
    "02.01.04"
  );
});

test(`02.02 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - correct spelling, missing semicol`, t => {
  t.deepEqual(fix("&nbspz"), [[0, 5, "&nbsp;"]], "02.02.00 - warmup");
  t.deepEqual(
    fix("&nbspzzz&nbspzzz&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.01 - surrounded by letters"
  );
  t.deepEqual(
    fix("&nbsp...&nbsp...&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.02 - surrounded by dots"
  );
  t.deepEqual(
    fix("&nbsp\n\n\n&nbsp\n\n\n&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.03 - surrounded by line breaks"
  );
  t.deepEqual(
    fix("&nbsp   &nbsp   &nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.04 - surrounded by spaces"
  );
  t.deepEqual(
    fix("&nbsp,&nbsp,&nbsp"),
    [[0, 5, "&nbsp;"], [6, 11, "&nbsp;"], [12, 17, "&nbsp;"]],
    "02.02.05 - surrounded by colons"
  );
  t.deepEqual(
    fix("&nbsp123&nbsp123&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.06 - surrounded by digits"
  );
  t.deepEqual(
    fix("&nbsp\t\t\t&nbsp\t\t\t&nbsp"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"], [16, 21, "&nbsp;"]],
    "02.02.07 - surrounded by tabs"
  );
});

test(`02.03 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - correct spelling, missing both ampersand and semicol`, t => {
  t.deepEqual(fix("nbspz"), [[0, 4, "&nbsp;"]], "02.03.00 - warmup");
  t.deepEqual(
    fix("nbspzzznbspzzznbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.01 - surrounded by letters"
  );
  t.deepEqual(
    fix("nbsp...nbsp...nbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.02 - surrounded by dots"
  );
  t.deepEqual(
    fix("nbsp\n\n\nnbsp\n\n\nnbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.03 - surrounded by line breaks"
  );
  t.deepEqual(
    fix("nbsp   nbsp   nbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.04 - surrounded by spaces"
  );
  t.deepEqual(
    fix("nbsp,nbsp,nbsp"),
    [[0, 4, "&nbsp;"], [5, 9, "&nbsp;"], [10, 14, "&nbsp;"]],
    "02.03.05 - surrounded by colons"
  );
  t.deepEqual(
    fix("nbsp123nbsp123nbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.06 - surrounded by digits"
  );
  t.deepEqual(
    fix("nbsp\t\t\tnbsp\t\t\tnbsp"),
    [[0, 4, "&nbsp;"], [7, 11, "&nbsp;"], [14, 18, "&nbsp;"]],
    "02.03.07 - surrounded by tabs"
  );
});

test(`02.04 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling (repeated characters), complete set`, t => {
  t.deepEqual(
    fix("&&nbsp;x&&nbsp;y&&nbsp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.01 - duplicate ampersand"
  );
  t.deepEqual(
    fix("&nnbsp;x&nnbsp;y&nnbsp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.02 - duplicate n"
  );
  t.deepEqual(
    fix("&nbbsp;x&nbbsp;y&nbbsp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.03 - duplicate b"
  );
  t.deepEqual(
    fix("&nbssp;x&nbssp;y&nbssp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.04 - duplicate s"
  );
  t.deepEqual(
    fix("&nbspp;x&nbspp;y&nbspp;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.05 - duplicate p"
  );
  t.deepEqual(
    fix("&nbsp;;x&nbsp;;y&nbsp;;"),
    [[0, 7, "&nbsp;"], [8, 15, "&nbsp;"], [16, 23, "&nbsp;"]],
    "02.04.06 - duplicate semicolon"
  );
});

test(`02.05 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling (repeated characters), incomplete set`, t => {
  // repeated ampersand + ...
  t.deepEqual(
    fix("&&bsp;x&&bsp;y&&bsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.01 - repeated ampersand + n missing"
  );
  t.deepEqual(
    fix("&&nsp;x&&nsp;y&&nsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.02 - repeated ampersand + b missing"
  );
  t.deepEqual(
    fix("&&nbp;x&&nbp;y&&nbp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.03 - repeated ampersand + s missing"
  );
  t.deepEqual(
    fix("&&nbs;x&&nbs;y&&nbs;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.04 - repeated ampersand + p missing"
  );
  t.deepEqual(
    fix("&&nbspx&&nbspy&&nbsp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.05 - repeated ampersand + semicol missing"
  );

  // repeated n + ...
  t.deepEqual(
    fix("nnbsp;xnnbsp;ynnbsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.06 - repeated n + ampersand missing"
  );
  t.deepEqual(
    fix("&nnsp;x&nnsp;y&nnsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.07 - repeated n + b missing"
  );
  t.deepEqual(
    fix("&nnbp;x&nnbp;y&nnbp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.08 - repeated n + s missing"
  );
  t.deepEqual(
    fix("&nnbs;x&nnbs;y&nnbs;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.09 - repeated n + p missing"
  );
  t.deepEqual(
    fix("&nnbspx&nnbspy&nnbsp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.10 - repeated n + semicol missing"
  );

  // repeated b + ...
  t.deepEqual(
    fix("nbbsp;xnbbsp;ynbbsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.11 - repeated b + ampersand missing"
  );
  t.deepEqual(
    fix("&bbsp;x&bbsp;y&bbsp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.12 - repeated b + n missing"
  );
  t.deepEqual(
    fix("&nbbp;x&nbbp;y&nbbp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.13 - repeated b + s missing"
  );
  t.deepEqual(
    fix("&nbbs;x&nbbs;y&nbbs;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.14 - repeated b + p missing"
  );
  t.deepEqual(
    fix("&nbbspx&nbbspy&nbbsp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.15 - repeated b + semicol missing"
  );

  // repeated s + ...
  t.deepEqual(
    fix("nbssp;xnbssp;ynbssp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.16 - repeated s + ampersand missing"
  );
  t.deepEqual(
    fix("&bssp;x&bssp;y&bssp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.17 - repeated s + n missing"
  );
  t.deepEqual(
    fix("&nssp;x&nssp;y&nssp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.18 - repeated s + b missing"
  );
  t.deepEqual(
    fix("&nbss;x&nbss;y&nbss;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.19 - repeated s + p missing"
  );
  t.deepEqual(
    fix("&nbsspx&nbsspy&nbssp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.20 - repeated s + semicol missing"
  );

  // repeated p + ...
  t.deepEqual(
    fix("nbspp;xnbspp;ynbspp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.21 - repeated p + ampersand missing"
  );
  t.deepEqual(
    fix("&bspp;x&bspp;y&bspp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.22 - repeated p + n missing"
  );
  t.deepEqual(
    fix("&nspp;x&nspp;y&nspp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.23 - repeated p + b missing"
  );
  t.deepEqual(
    fix("&nbpp;x&nbpp;y&nbpp;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.24 - repeated p + s missing"
  );
  t.deepEqual(
    fix("&nbsppx&nbsppy&nbspp"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.25 - repeated p + semicol missing"
  );

  // repeated semicol + ...
  t.deepEqual(
    fix("nbsp;;xnbsp;;ynbsp;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.26 - repeated semicol + ampersand missing"
  );
  t.deepEqual(
    fix("&bsp;;x&bsp;;y&bsp;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.27 - repeated semicol + n missing"
  );
  t.deepEqual(
    fix("&nsp;;x&nsp;;y&nsp;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.28 - repeated semicol + b missing"
  );
  t.deepEqual(
    fix("&nbp;;x&nbp;;y&nbp;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.29 - repeated semicol + s missing"
  );
  t.deepEqual(
    fix("&nbs;;x&nbs;;y&nbs;;"),
    [[0, 6, "&nbsp;"], [7, 13, "&nbsp;"], [14, 20, "&nbsp;"]],
    "02.05.30 - repeated semicol + p missing"
  );
});

test(`02.06 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - incorrect spelling (ampersand missing), incomplete set`, t => {
  // dangerous stuff: missing ampersand and one letter (semicol present)
  // 1. letter on one side, EOL on other:
  t.deepEqual(fix("zzzzbsp;"), [[4, 8, "&nbsp;"]], "02.06.01");
  t.deepEqual(fix("zzzznsp;"), [[4, 8, "&nbsp;"]], "02.06.02");
  t.deepEqual(fix("zzzznbp;"), [[4, 8, "&nbsp;"]], "02.06.03");
  t.deepEqual(fix("zzzznbs;"), [[4, 8, "&nbsp;"]], "02.06.04");

  t.deepEqual(fix("bsp;zzzz"), [[0, 4, "&nbsp;"]], "02.06.05");
  t.deepEqual(fix("nsp;zzzz"), [[0, 4, "&nbsp;"]], "02.06.06");
  t.deepEqual(fix("nbp;zzzz"), [[0, 4, "&nbsp;"]], "02.06.07");
  t.deepEqual(fix("nbs;zzzz"), [[0, 4, "&nbsp;"]], "02.06.08");

  // 2. EOL on both sides:
  t.deepEqual(fix("bsp;"), [[0, 4, "&nbsp;"]], "02.06.09");
  t.deepEqual(fix("nsp;"), [[0, 4, "&nbsp;"]], "02.06.10");
  t.deepEqual(fix("nbp;"), [[0, 4, "&nbsp;"]], "02.06.11");
  t.deepEqual(fix("nbs;"), [[0, 4, "&nbsp;"]], "02.06.12");

  // 3. space on either side:
  t.deepEqual(fix("aaaa bsp;"), [[5, 9, "&nbsp;"]], "02.06.13");
  t.deepEqual(fix("aaaa nsp;"), [[5, 9, "&nbsp;"]], "02.06.14");
  t.deepEqual(fix("aaaa nbp;"), [[5, 9, "&nbsp;"]], "02.06.15");
  t.deepEqual(fix("aaaa nbs;"), [[5, 9, "&nbsp;"]], "02.06.16");

  t.deepEqual(fix("bsp; aaaa"), [[0, 4, "&nbsp;"]], "02.06.17");
  t.deepEqual(fix("nsp; aaaa"), [[0, 4, "&nbsp;"]], "02.06.18");
  t.deepEqual(fix("nbp; aaaa"), [[0, 4, "&nbsp;"]], "02.06.19");
  t.deepEqual(fix("nbs; aaaa"), [[0, 4, "&nbsp;"]], "02.06.20");

  t.deepEqual(fix("aaaa bsp; aaaa"), [[5, 9, "&nbsp;"]], "02.06.21");
  t.deepEqual(fix("aaaa nsp; aaaa"), [[5, 9, "&nbsp;"]], "02.06.22");
  t.deepEqual(fix("aaaa nbp; aaaa"), [[5, 9, "&nbsp;"]], "02.06.23");
  t.deepEqual(fix("aaaa nbs; aaaa"), [[5, 9, "&nbsp;"]], "02.06.24");
});

test(`02.07 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - at least one of each of the set [n, b, s, p] is present, repetitions`, t => {
  // any repetitions whatsoever like &&&&&nnnbbbssssp;;;
  t.deepEqual(fix("aaa&nnnbbssssppp;nnn"), [[3, 17, "&nbsp;"]], "02.07.01");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;nnn"), [[3, 20, "&nbsp;"]], "02.07.02");
  t.deepEqual(fix("aaa&nnnbbssssppp nnn"), [[3, 16, "&nbsp;"]], "02.07.03");
  t.deepEqual(fix("aaa&nnnbbssssp nnn"), [[3, 14, "&nbsp;"]], "02.07.04");
  t.deepEqual(fix("aaa&nnnbbssssp,nnn"), [[3, 14, "&nbsp;"]], "02.07.05");
  t.deepEqual(fix("aaa&nnnbbssssp.nnn"), [[3, 14, "&nbsp;"]], "02.07.06");
  t.deepEqual(fix("aaa&nnnbbssssp?nnn"), [[3, 14, "&nbsp;"]], "02.07.07");
  t.deepEqual(fix("aaa&nnnbbssssp-nnn"), [[3, 14, "&nbsp;"]], "02.07.08");
  t.deepEqual(fix("aaa&nnnbbssssp;nnn"), [[3, 15, "&nbsp;"]], "02.07.09");
  t.deepEqual(fix("aaa&nnnbbssssp\nnnn"), [[3, 14, "&nbsp;"]], "02.07.10");

  t.deepEqual(fix("aaa&nnnbbssssppp;bbb"), [[3, 17, "&nbsp;"]], "02.07.11");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;bbb"), [[3, 20, "&nbsp;"]], "02.07.12");
  t.deepEqual(fix("aaa&nnnbbssssppp bbb"), [[3, 16, "&nbsp;"]], "02.07.13");
  t.deepEqual(fix("aaa&nnnbbssssp bbb"), [[3, 14, "&nbsp;"]], "02.07.14");
  t.deepEqual(fix("aaa&nnnbbssssp,bbb"), [[3, 14, "&nbsp;"]], "02.07.15");
  t.deepEqual(fix("aaa&nnnbbssssp.bbb"), [[3, 14, "&nbsp;"]], "02.07.16");
  t.deepEqual(fix("aaa&nnnbbssssp?bbb"), [[3, 14, "&nbsp;"]], "02.07.17");
  t.deepEqual(fix("aaa&nnnbbssssp-bbb"), [[3, 14, "&nbsp;"]], "02.07.18");
  t.deepEqual(fix("aaa&nnnbbssssp;bbb"), [[3, 15, "&nbsp;"]], "02.07.19");
  t.deepEqual(fix("aaa&nnnbbssssp\nbbb"), [[3, 14, "&nbsp;"]], "02.07.20");

  t.deepEqual(fix("aaa&nnnbbssssppp;sss"), [[3, 17, "&nbsp;"]], "02.07.21");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;sss"), [[3, 20, "&nbsp;"]], "02.07.22");
  t.deepEqual(fix("aaa&nnnbbssssppp sss"), [[3, 16, "&nbsp;"]], "02.07.23");
  t.deepEqual(fix("aaa&nnnbbssssp sss"), [[3, 14, "&nbsp;"]], "02.07.24");
  t.deepEqual(fix("aaa&nnnbbssssp,sss"), [[3, 14, "&nbsp;"]], "02.07.25");
  t.deepEqual(fix("aaa&nnnbbssssp.sss"), [[3, 14, "&nbsp;"]], "02.07.26");
  t.deepEqual(fix("aaa&nnnbbssssp?sss"), [[3, 14, "&nbsp;"]], "02.07.27");
  t.deepEqual(fix("aaa&nnnbbssssp-sss"), [[3, 14, "&nbsp;"]], "02.07.28");
  t.deepEqual(fix("aaa&nnnbbssssp;sss"), [[3, 15, "&nbsp;"]], "02.07.29");
  t.deepEqual(fix("aaa&nnnbbssssp\nsss"), [[3, 14, "&nbsp;"]], "02.07.30");

  t.deepEqual(fix("aaa&nnnbbssssppp;ppp"), [[3, 17, "&nbsp;"]], "02.07.31");
  t.deepEqual(fix("aaa&nnnbbssssppp;;;;ppp"), [[3, 20, "&nbsp;"]], "02.07.32");
  t.deepEqual(fix("aaa&nnnbbssssppp ppp"), [[3, 16, "&nbsp;"]], "02.07.33");
  t.deepEqual(fix("aaa&nnnbbssssp ppp"), [[3, 14, "&nbsp;"]], "02.07.34");
  t.deepEqual(fix("aaa&nnnbbssssp,ppp"), [[3, 14, "&nbsp;"]], "02.07.35");
  t.deepEqual(fix("aaa&nnnbbssssp.ppp"), [[3, 14, "&nbsp;"]], "02.07.36");
  t.deepEqual(fix("aaa&nnnbbssssp?ppp"), [[3, 14, "&nbsp;"]], "02.07.37");
  t.deepEqual(fix("aaa&nnnbbssssp-ppp"), [[3, 14, "&nbsp;"]], "02.07.38");
  t.deepEqual(fix("aaa&nnnbbssssp;ppp"), [[3, 15, "&nbsp;"]], "02.07.39");
  t.deepEqual(fix("aaa&nnnbbssssp\nppp"), [[3, 14, "&nbsp;"]], "02.07.40");
});

test(`02.08 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - recursively encoded entities`, t => {
  t.deepEqual(
    fix("a&amp;nbsp;b"),
    [[1, 11, "&nbsp;"]],
    "02.08.01 - twice-encoded"
  );
  t.deepEqual(
    fix("a&amp;amp;nbsp;b"),
    [[1, 15, "&nbsp;"]],
    "02.08.02 - triple-encoded"
  );
  t.deepEqual(
    fix("a&amp;amp;amp;nbsp;b"),
    [[1, 19, "&nbsp;"]],
    "02.08.02 - quadruple-encoded"
  );
});

test(`02.09 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - no ampersand, no semicolon`, t => {
  t.deepEqual(fix("text;Nbsptext"), [[5, 9, "&nbsp;"]], "02.09.01");
  t.deepEqual(fix("text Nbsptext"), [[5, 9, "&nbsp;"]], "02.09.02");
});

test(`02.10 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - ampersand present, no semicolon`, t => {
  // Fix missing semicolon when ampersand is present
  t.deepEqual(
    fix("&nBsPzzz&nBsPzzz"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]],
    "02.10.01"
  );
  t.deepEqual(
    fix("&NbSpzzz&NbSpzzz"),
    [[0, 5, "&nbsp;"], [8, 13, "&nbsp;"]],
    "02.10.02"
  );
  t.deepEqual(
    fix("textNbsp;texttextNbsp;text"),
    [[4, 9, "&nbsp;"], [17, 22, "&nbsp;"]],
    "02.10.05"
  );
  t.deepEqual(
    fix("&&NbSpzzz&&NbSpzzz"),
    [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]],
    "02.10.06"
  );
  t.deepEqual(
    fix("&NbSspzzz&NbSspzzz"),
    [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]],
    "02.10.07"
  );
  t.deepEqual(
    fix("&NbSsPzzz&NbSsPzzz"),
    [[0, 6, "&nbsp;"], [9, 15, "&nbsp;"]],
    "02.10.08"
  );
  t.deepEqual(
    fix("&NbSsP zzz&NbSsP zzz"),
    [[0, 6, "&nbsp;"], [10, 16, "&nbsp;"]],
    "02.10.09"
  );
  t.deepEqual(
    fix("&NbSsP zzz &NbSsP zzz"),
    [[0, 6, "&nbsp;"], [11, 17, "&nbsp;"]],
    "02.10.10"
  );
});

test(`02.11 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - swapped letters`, t => {
  // swapped letters, full set
  t.deepEqual(
    fix("a&bnsp;b&nsbp;c&nspb;"),
    [[1, 7, "&nbsp;"], [8, 14, "&nbsp;"], [15, 21, "&nbsp;"]],
    "02.11.01"
  );
  // swapped letters, one missing
  t.deepEqual(
    fix("abnsp;bnsbp;cnspb;"),
    [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]],
    "02.11.02 - ampersand missing"
  );
  t.deepEqual(
    fix("a&bsp;b&sbp;c&spb;"),
    [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]],
    "02.11.02 - n missing"
  );
  t.deepEqual(
    fix("a&nsp;b&nsp;c&nsp;"),
    [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]],
    "02.11.02 - b missing"
  );
  t.deepEqual(
    fix("a&bnp;b&nbp;c&npb;"),
    [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]],
    "02.11.02 - s missing"
  );
  t.deepEqual(
    fix("a&bns;b&nsb;c&nsb;"),
    [[1, 6, "&nbsp;"], [7, 12, "&nbsp;"], [13, 18, "&nbsp;"]],
    "02.11.02 - p missing"
  );
});

test(`02.12 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - very very suspicious cases`, t => {
  // 1. when a sequence of more than four letters of a set is encountered,
  // if there is a full set of 4 characters (n, b, s and p) detected, fifth
  // and others will be assumed to be not a part of an entity, unless it's a
  // repetition.
  t.deepEqual(
    fix("a&bnspb"),
    [[1, 6, "&nbsp;"]],
    "02.12.01 - last b is considered to be text"
  );
  t.deepEqual(
    fix("a&bnspz"),
    [[1, 6, "&nbsp;"]],
    "02.12.02 - last z is considered to be text"
  );
  t.deepEqual(
    fix("a&bnnspb"),
    [[1, 7, "&nbsp;"]],
    "02.12.03 - last b is still considered to be text"
  );
});

test(`02.13 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - n-b-s-p set plus another letter`, t => {
  t.deepEqual(fix("&nbspx;"), [[0, 7, "&nbsp;"]], "02.13.01");
  t.deepEqual(fix("&nbspn;"), [[0, 7, "&nbsp;"]], "02.13.02");
  t.deepEqual(fix("&nbspb;"), [[0, 7, "&nbsp;"]], "02.13.03");
  t.deepEqual(fix("&nbsps;"), [[0, 7, "&nbsp;"]], "02.13.04");
  t.deepEqual(fix("&nbspp;"), [[0, 7, "&nbsp;"]], "02.13.05");
  t.deepEqual(fix("&nbsp.;"), [[0, 7, "&nbsp;"]], "02.13.06");
  t.deepEqual(fix("a&nbspl;;b"), [[1, 9, "&nbsp;"]], "02.13.07");
});

test(`02.14 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - n-b-s-p with one letter missing plus another letter`, t => {
  t.deepEqual(fix("&nspx;"), [[0, 6, "&nbsp;"]], "02.14.01");
  t.deepEqual(fix("&nbpy;"), [[0, 6, "&nbsp;"]], "02.14.02");
  t.deepEqual(fix("&n_sp;"), [[0, 6, "&nbsp;"]], "02.14.03");
});

// -----------------------------------------------------------------------------
// 03. nothing to fix
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} - do not touch healthy &nbsp;`, t => {
  t.deepEqual(fix("&nbsp;"), null, "03.01.01 - one, surrounded by EOL");
  t.deepEqual(fix("&nbsp; &nbsp;"), null, "03.01.02 - two, surrounded by EOL");
  t.deepEqual(fix("a&nbsp;b"), null, "03.01.03 - surrounded by letters");
});

// -----------------------------------------------------------------------------
// 04. other entities
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${36}m${`various named HTML entities`}\u001b[${39}m`} - various tests`, t => {
  t.deepEqual(
    fix("text &ang text&ang text"),
    [[5, 9, "&ang;"], [14, 18, "&ang;"]],
    "04.01.01"
  );
  t.deepEqual(
    fix("text&angtext&angtext"),
    [[4, 8, "&ang;"], [12, 16, "&ang;"]],
    "04.01.02"
  );
  t.deepEqual(
    fix("text&angsttext&angsttext"),
    [[4, 10, "&angst;"], [14, 20, "&angst;"]],
    "04.01.03"
  );
  t.deepEqual(
    fix("text&pitext&pitext"),
    [[4, 7, "&pi;"], [11, 14, "&pi;"]],
    "04.01.04"
  );
  t.deepEqual(
    fix("text&pivtext&pivtext"),
    [[4, 8, "&piv;"], [12, 16, "&piv;"]],
    "04.01.05"
  );
  t.deepEqual(
    fix("text&Pitext&Pitext"),
    [[4, 7, "&Pi;"], [11, 14, "&Pi;"]],
    "04.01.06"
  );
  t.deepEqual(
    fix("text&sigmatext&sigmatext"),
    [[4, 10, "&sigma;"], [14, 20, "&sigma;"]],
    "04.01.07"
  );
  t.deepEqual(
    fix("text&subtext&subtext"),
    [[4, 8, "&sub;"], [12, 16, "&sub;"]],
    "04.01.08"
  );
  t.deepEqual(
    fix("text&suptext&suptext"),
    [[4, 8, "&sup;"], [12, 16, "&sup;"]],
    "04.01.09"
  );
  t.deepEqual(
    fix("text&thetatext&thetatext"),
    [[4, 10, "&theta;"], [14, 20, "&theta;"]],
    "04.01.10"
  );
  t.deepEqual(
    fix("a &thinsp b\n&thinsp\nc"),
    [[2, 9, "&thinsp;"], [12, 19, "&thinsp;"]],
    "04.01.11"
  );
  t.deepEqual(fix("&thinsp"), [[0, 7, "&thinsp;"]], "04.01.12");
  t.deepEqual(
    fix("&thinsp&thinsp"),
    [[0, 14, "&thinsp;&thinsp;"]],
    "04.01.13 - joins"
  );
});

// Tend the following:
// aacute
// eacute
// zwj
