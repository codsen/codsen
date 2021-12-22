import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

//
//
//
//
//
//
//
//
//
//
//
//                                 ~
//                               str1x
//                                 ~
//
//
//
//
//
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//
//
//
//
// both double
const str11 = `<div style="float:"left"">z</div>`;
test(`01`, () => {
  not.ok(isCl(str11, 11, 18), "01");
});

test(`02`, () => {
  not.ok(isCl(str11, 11, 23), "02");
});

test(`03`, () => {
  ok(isCl(str11, 11, 24), "03");
});

// both single
const str12 = `<div style='float:'left''>z</div>`;
test(`04`, () => {
  not.ok(isCl(str12, 11, 18), "04");
});

test(`05`, () => {
  not.ok(isCl(str12, 11, 23), "05");
});

test(`06`, () => {
  ok(isCl(str12, 11, 24), "06");
});

//
//
//
//
//
//
//
//
//
//
//
// double wrapping single
const str13 = `<div style="float:'left'">z</div>`;
test(`07`, () => {
  not.ok(isCl(str13, 11, 18), "07");
});

test(`08`, () => {
  not.ok(isCl(str13, 11, 23), "08");
});

test(`09`, () => {
  ok(isCl(str13, 11, 24), "09");
});

// single wrapping double
const str14 = `<div style='float:"left"'>z</div>`;
test(`10`, () => {
  not.ok(isCl(str14, 11, 18), "10");
});

test(`11`, () => {
  not.ok(isCl(str14, 11, 23), "11");
});

test(`12`, () => {
  ok(isCl(str14, 11, 24), "12");
});

//
//
//
//
//
//
//
//
//
//
//
// double wrapping D-S
const str15 = `<div style="float:"left'">z</div>`;
test(`13`, () => {
  not.ok(isCl(str15, 11, 18), "13");
});

test(`14`, () => {
  not.ok(isCl(str15, 11, 23), "14");
});

test(`15`, () => {
  ok(isCl(str15, 11, 24), "15");
});

// double wrapping S-D
const str16 = `<div style="float:'left"">z</div>`;
test(`16`, () => {
  not.ok(isCl(str16, 11, 18), "16");
});

test(`17`, () => {
  not.ok(isCl(str16, 11, 23), "17");
});

test(`18`, () => {
  ok(isCl(str16, 11, 24), "18");
});

//
//
//
//
//
//
//
//
//
//
//
//                                 ~
//                               str2x
//                                 ~
//
//
//
//
//
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//
//
//
//
// two attributes - second D-D
// -----------------------------------------------------------------------------

// both double
const str21 = `<div style="float:"left"" align="left">z</div>`;
test(`19`, () => {
  not.ok(isCl(str21, 11, 18), "19");
});

test(`20`, () => {
  not.ok(isCl(str21, 11, 23), "20");
});

test(`21`, () => {
  ok(isCl(str21, 11, 24), "21");
});

test(`22`, () => {
  not.ok(isCl(str21, 11, 32), "22");
});

test(`23`, () => {
  not.ok(isCl(str21, 11, 37), "23");
});

// both single
const str22 = `<div style='float:'left'' align="left">z</div>`;
test(`24`, () => {
  not.ok(isCl(str22, 11, 18), "24");
});

test(`25`, () => {
  not.ok(isCl(str22, 11, 23), "25");
});

test(`26`, () => {
  ok(isCl(str22, 11, 24), "26");
});

test(`27`, () => {
  not.ok(isCl(str22, 11, 32), "27");
});

test(`28`, () => {
  not.ok(isCl(str22, 11, 37), "28");
});

// double wrapping single
const str23 = `<div style="float:'left'" align="left">z</div>`;
test(`29`, () => {
  not.ok(isCl(str23, 11, 18), "29");
});

test(`30`, () => {
  not.ok(isCl(str23, 11, 23), "30");
});

test(`31`, () => {
  ok(isCl(str23, 11, 24), "31");
});

test(`32`, () => {
  not.ok(isCl(str23, 11, 32), "32");
});

test(`33`, () => {
  not.ok(isCl(str23, 11, 37), "33");
});

// single wrapping double
const str24 = `<div style='float:"left"' align="left">z</div>`;
test(`34`, () => {
  not.ok(isCl(str24, 11, 18), "34");
});

test(`35`, () => {
  not.ok(isCl(str24, 11, 23), "35");
});

test(`36`, () => {
  ok(isCl(str24, 11, 24), "36");
});

test(`37`, () => {
  not.ok(isCl(str24, 11, 32), "37");
});

test(`38`, () => {
  not.ok(isCl(str24, 11, 37), "38");
});

//
//
//
//
//
//
//
//
//
//
//
//                                 ~
//                               str3x
//                                 ~
//
//
//
//
//
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//
//
//
//
// two attributes - second D-S
// -----------------------------------------------------------------------------

// both double
const str31 = `<div style="float:"left"" align="left'>z</div>`;
test(`39`, () => {
  not.ok(isCl(str31, 11, 18), "39");
});

test(`40`, () => {
  not.ok(isCl(str31, 11, 23), "40");
});

test(`41`, () => {
  ok(isCl(str31, 11, 24), "41");
});

test(`42`, () => {
  not.ok(isCl(str31, 11, 32), "42");
});

test(`43`, () => {
  not.ok(isCl(str31, 11, 37), "43");
});

// both single
const str32 = `<div style='float:'left'' align="left'>z</div>`;
test(`44`, () => {
  not.ok(isCl(str32, 11, 18), "44");
});

test(`45`, () => {
  not.ok(isCl(str32, 11, 23), "45");
});

test(`46`, () => {
  ok(isCl(str32, 11, 24), "46");
});

test(`47`, () => {
  not.ok(isCl(str32, 11, 32), "47");
});

test(`48`, () => {
  not.ok(isCl(str32, 11, 37), "48");
});

// double wrapping single
const str33 = `<div style="float:'left'" align="left'>z</div>`;
test(`49`, () => {
  not.ok(isCl(str33, 11, 18), "49");
});

test(`50`, () => {
  not.ok(isCl(str33, 11, 23), "50");
});

test(`51`, () => {
  ok(isCl(str33, 11, 24), "51");
});

test(`52`, () => {
  not.ok(isCl(str33, 11, 32), "52");
});

test(`53`, () => {
  not.ok(isCl(str33, 11, 37), "53");
});

// single wrapping double
const str34 = `<div style='float:"left"' align="left'>z</div>`;
test(`54`, () => {
  not.ok(isCl(str34, 11, 18), "54");
});

test(`55`, () => {
  not.ok(isCl(str34, 11, 23), "55");
});

test(`56`, () => {
  ok(isCl(str34, 11, 24), "56");
});

test(`57`, () => {
  not.ok(isCl(str34, 11, 32), "57");
});

test(`58`, () => {
  not.ok(isCl(str34, 11, 37), "58");
});

//
//
//
//
//
//
//
//
//
//
//
//                                 ~
//                               str4x
//                                 ~
//
//
//
//
//
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//
//
//
//
// two attributes - second S-D
// -----------------------------------------------------------------------------

// both double
const str41 = `<div style="float:"left"" align='left">z</div>`;
test(`59`, () => {
  not.ok(isCl(str41, 11, 18), "59");
});

test(`60`, () => {
  not.ok(isCl(str41, 11, 23), "60");
});

test(`61`, () => {
  ok(isCl(str41, 11, 24), "61");
});

test(`62`, () => {
  not.ok(isCl(str41, 11, 32), "62");
});

test(`63`, () => {
  not.ok(isCl(str41, 11, 37), "63");
});

// both single
const str42 = `<div style='float:'left'' align='left">z</div>`;
test(`64`, () => {
  not.ok(isCl(str42, 11, 18), "64");
});

test(`65`, () => {
  not.ok(isCl(str42, 11, 23), "65");
});

test(`66`, () => {
  ok(isCl(str42, 11, 24), "66");
});

test(`67`, () => {
  not.ok(isCl(str42, 11, 32), "67");
});

test(`68`, () => {
  not.ok(isCl(str42, 11, 37), "68");
});

// double wrapping single
const str43 = `<div style="float:'left'" align='left">z</div>`;
test(`69`, () => {
  not.ok(isCl(str43, 11, 18), "69");
});

test(`70`, () => {
  not.ok(isCl(str43, 11, 23), "70");
});

test(`71`, () => {
  ok(isCl(str43, 11, 24), "71");
});

test(`72`, () => {
  not.ok(isCl(str43, 11, 32), "72");
});

test(`73`, () => {
  not.ok(isCl(str43, 11, 37), "73");
});

// single wrapping double
const str44 = `<div style='float:"left"' align='left">z</div>`;
test(`74`, () => {
  not.ok(isCl(str44, 11, 18), "74");
});

test(`75`, () => {
  not.ok(isCl(str44, 11, 23), "75");
});

test(`76`, () => {
  ok(isCl(str44, 11, 24), "76");
});

test(`77`, () => {
  not.ok(isCl(str44, 11, 32), "77");
});

test(`78`, () => {
  not.ok(isCl(str44, 11, 37), "78");
});

//
//
//
//
//
//
//
//
//
//
//
//                                 ~
//                               str5x
//                                 ~
//
//
//
//
//
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//
//
//
//
// two attributes - second S-S
// -----------------------------------------------------------------------------

// both double
const str51 = `<div style="float:"left"" align='left'>z</div>`;
test(`79`, () => {
  not.ok(isCl(str51, 11, 18), "79");
});

test(`80`, () => {
  not.ok(isCl(str51, 11, 23), "80");
});

test(`81`, () => {
  ok(isCl(str51, 11, 24), "81");
});

test(`82`, () => {
  not.ok(isCl(str51, 11, 32), "82");
});

test(`83`, () => {
  not.ok(isCl(str51, 11, 37), "83");
});

// both single
const str52 = `<div style='float:'left'' align='left'>z</div>`;
test(`84`, () => {
  not.ok(isCl(str52, 11, 18), "84");
});

test(`85`, () => {
  not.ok(isCl(str52, 11, 23), "85");
});

test(`86`, () => {
  ok(isCl(str52, 11, 24), "86");
});

test(`87`, () => {
  not.ok(isCl(str52, 11, 32), "87");
});

test(`88`, () => {
  not.ok(isCl(str52, 11, 37), "88");
});

// double wrapping single
const str53 = `<div style="float:'left'" align='left'>z</div>`;
test(`89`, () => {
  not.ok(isCl(str53, 11, 18), "89");
});

test(`90`, () => {
  not.ok(isCl(str53, 11, 23), "90");
});

test(`91`, () => {
  ok(isCl(str53, 11, 24), "91");
});

test(`92`, () => {
  not.ok(isCl(str53, 11, 32), "92");
});

test(`93`, () => {
  not.ok(isCl(str53, 11, 37), "93");
});

// single wrapping double
const str54 = `<div style='float:"left"' align='left'>z</div>`;
test(`94`, () => {
  not.ok(isCl(str54, 11, 18), "94");
});

test(`95`, () => {
  not.ok(isCl(str54, 11, 23), "95");
});

test(`96`, () => {
  ok(isCl(str54, 11, 24), "96");
});

test(`97`, () => {
  not.ok(isCl(str54, 11, 32), "97");
});

test(`98`, () => {
  not.ok(isCl(str54, 11, 37), "98");
});

//
//
//
//
//
//
//
//
//
//
//
//                                 ~
//                               str6
//                                 ~
//
//
//
//
//
//
//
//
//
//
//
//

const str6 = `<span width="'100'">`;
test(`99`, () => {
  not.ok(isCl(str6, 12, 13), "99.01");
  not.ok(isCl(str6, 12, 17), "99.02");
  ok(isCl(str6, 12, 18), "99.03");
});

test.run();
