import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm";
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
tap.test(`01`, (t) => {
  t.false(is(str11, 11, 18), "01");
  t.end();
});

tap.test(`02`, (t) => {
  t.false(is(str11, 11, 23), "02");
  t.end();
});

tap.test(`03`, (t) => {
  t.true(is(str11, 11, 24), "03");
  t.end();
});

// both single
const str12 = `<div style='float:'left''>z</div>`;
tap.test(`04`, (t) => {
  t.false(is(str12, 11, 18), "04");
  t.end();
});

tap.test(`05`, (t) => {
  t.false(is(str12, 11, 23), "05");
  t.end();
});

tap.test(`06`, (t) => {
  t.true(is(str12, 11, 24), "06");
  t.end();
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
tap.test(`07`, (t) => {
  t.false(is(str13, 11, 18), "07");
  t.end();
});

tap.test(`08`, (t) => {
  t.false(is(str13, 11, 23), "08");
  t.end();
});

tap.test(`09`, (t) => {
  t.true(is(str13, 11, 24), "09");
  t.end();
});

// single wrapping double
const str14 = `<div style='float:"left"'>z</div>`;
tap.test(`10`, (t) => {
  t.false(is(str14, 11, 18), "10");
  t.end();
});

tap.test(`11`, (t) => {
  t.false(is(str14, 11, 23), "11");
  t.end();
});

tap.test(`12`, (t) => {
  t.true(is(str14, 11, 24), "12");
  t.end();
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
tap.test(`13`, (t) => {
  t.false(is(str15, 11, 18), "13");
  t.end();
});

tap.test(`14`, (t) => {
  t.false(is(str15, 11, 23), "14");
  t.end();
});

tap.test(`15`, (t) => {
  t.true(is(str15, 11, 24), "15");
  t.end();
});

// double wrapping S-D
const str16 = `<div style="float:'left"">z</div>`;
tap.test(`16`, (t) => {
  t.false(is(str16, 11, 18), "16");
  t.end();
});

tap.test(`17`, (t) => {
  t.false(is(str16, 11, 23), "17");
  t.end();
});

tap.test(`18`, (t) => {
  t.true(is(str16, 11, 24), "18");
  t.end();
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
tap.test(`19`, (t) => {
  t.false(is(str21, 11, 18), "19");
  t.end();
});

tap.test(`20`, (t) => {
  t.false(is(str21, 11, 23), "20");
  t.end();
});

tap.test(`21`, (t) => {
  t.true(is(str21, 11, 24), "21");
  t.end();
});

tap.test(`22`, (t) => {
  t.false(is(str21, 11, 32), "22");
  t.end();
});

tap.test(`23`, (t) => {
  t.false(is(str21, 11, 37), "23");
  t.end();
});

// both single
const str22 = `<div style='float:'left'' align="left">z</div>`;
tap.test(`24`, (t) => {
  t.false(is(str22, 11, 18), "24");
  t.end();
});

tap.test(`25`, (t) => {
  t.false(is(str22, 11, 23), "25");
  t.end();
});

tap.test(`26`, (t) => {
  t.true(is(str22, 11, 24), "26");
  t.end();
});

tap.test(`27`, (t) => {
  t.false(is(str22, 11, 32), "27");
  t.end();
});

tap.test(`28`, (t) => {
  t.false(is(str22, 11, 37), "28");
  t.end();
});

// double wrapping single
const str23 = `<div style="float:'left'" align="left">z</div>`;
tap.test(`29`, (t) => {
  t.false(is(str23, 11, 18), "29");
  t.end();
});

tap.test(`30`, (t) => {
  t.false(is(str23, 11, 23), "30");
  t.end();
});

tap.test(`31`, (t) => {
  t.true(is(str23, 11, 24), "31");
  t.end();
});

tap.test(`32`, (t) => {
  t.false(is(str23, 11, 32), "32");
  t.end();
});

tap.test(`33`, (t) => {
  t.false(is(str23, 11, 37), "33");
  t.end();
});

// single wrapping double
const str24 = `<div style='float:"left"' align="left">z</div>`;
tap.test(`34`, (t) => {
  t.false(is(str24, 11, 18), "34");
  t.end();
});

tap.test(`35`, (t) => {
  t.false(is(str24, 11, 23), "35");
  t.end();
});

tap.test(`36`, (t) => {
  t.true(is(str24, 11, 24), "36");
  t.end();
});

tap.test(`37`, (t) => {
  t.false(is(str24, 11, 32), "37");
  t.end();
});

tap.test(`38`, (t) => {
  t.false(is(str24, 11, 37), "38");
  t.end();
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
tap.test(`39`, (t) => {
  t.false(is(str31, 11, 18), "39");
  t.end();
});

tap.test(`40`, (t) => {
  t.false(is(str31, 11, 23), "40");
  t.end();
});

tap.test(`41`, (t) => {
  t.true(is(str31, 11, 24), "41");
  t.end();
});

tap.test(`42`, (t) => {
  t.false(is(str31, 11, 32), "42");
  t.end();
});

tap.test(`43`, (t) => {
  t.false(is(str31, 11, 37), "43");
  t.end();
});

// both single
const str32 = `<div style='float:'left'' align="left'>z</div>`;
tap.test(`44`, (t) => {
  t.false(is(str32, 11, 18), "44");
  t.end();
});

tap.test(`45`, (t) => {
  t.false(is(str32, 11, 23), "45");
  t.end();
});

tap.test(`46`, (t) => {
  t.true(is(str32, 11, 24), "46");
  t.end();
});

tap.test(`47`, (t) => {
  t.false(is(str32, 11, 32), "47");
  t.end();
});

tap.test(`48`, (t) => {
  t.false(is(str32, 11, 37), "48");
  t.end();
});

// double wrapping single
const str33 = `<div style="float:'left'" align="left'>z</div>`;
tap.test(`49`, (t) => {
  t.false(is(str33, 11, 18), "49");
  t.end();
});

tap.test(`50`, (t) => {
  t.false(is(str33, 11, 23), "50");
  t.end();
});

tap.test(`51`, (t) => {
  t.true(is(str33, 11, 24), "51");
  t.end();
});

tap.test(`52`, (t) => {
  t.false(is(str33, 11, 32), "52");
  t.end();
});

tap.test(`53`, (t) => {
  t.false(is(str33, 11, 37), "53");
  t.end();
});

// single wrapping double
const str34 = `<div style='float:"left"' align="left'>z</div>`;
tap.test(`54`, (t) => {
  t.false(is(str34, 11, 18), "54");
  t.end();
});

tap.test(`55`, (t) => {
  t.false(is(str34, 11, 23), "55");
  t.end();
});

tap.test(`56`, (t) => {
  t.true(is(str34, 11, 24), "56");
  t.end();
});

tap.test(`57`, (t) => {
  t.false(is(str34, 11, 32), "57");
  t.end();
});

tap.test(`58`, (t) => {
  t.false(is(str34, 11, 37), "58");
  t.end();
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
tap.test(`59`, (t) => {
  t.false(is(str41, 11, 18), "59");
  t.end();
});

tap.test(`60`, (t) => {
  t.false(is(str41, 11, 23), "60");
  t.end();
});

tap.test(`61`, (t) => {
  t.true(is(str41, 11, 24), "61");
  t.end();
});

tap.test(`62`, (t) => {
  t.false(is(str41, 11, 32), "62");
  t.end();
});

tap.test(`63`, (t) => {
  t.false(is(str41, 11, 37), "63");
  t.end();
});

// both single
const str42 = `<div style='float:'left'' align='left">z</div>`;
tap.test(`64`, (t) => {
  t.false(is(str42, 11, 18), "64");
  t.end();
});

tap.test(`65`, (t) => {
  t.false(is(str42, 11, 23), "65");
  t.end();
});

tap.test(`66`, (t) => {
  t.true(is(str42, 11, 24), "66");
  t.end();
});

tap.test(`67`, (t) => {
  t.false(is(str42, 11, 32), "67");
  t.end();
});

tap.test(`68`, (t) => {
  t.false(is(str42, 11, 37), "68");
  t.end();
});

// double wrapping single
const str43 = `<div style="float:'left'" align='left">z</div>`;
tap.test(`69`, (t) => {
  t.false(is(str43, 11, 18), "69");
  t.end();
});

tap.test(`70`, (t) => {
  t.false(is(str43, 11, 23), "70");
  t.end();
});

tap.test(`71`, (t) => {
  t.true(is(str43, 11, 24), "71");
  t.end();
});

tap.test(`72`, (t) => {
  t.false(is(str43, 11, 32), "72");
  t.end();
});

tap.test(`73`, (t) => {
  t.false(is(str43, 11, 37), "73");
  t.end();
});

// single wrapping double
const str44 = `<div style='float:"left"' align='left">z</div>`;
tap.test(`74`, (t) => {
  t.false(is(str44, 11, 18), "74");
  t.end();
});

tap.test(`75`, (t) => {
  t.false(is(str44, 11, 23), "75");
  t.end();
});

tap.test(`76`, (t) => {
  t.true(is(str44, 11, 24), "76");
  t.end();
});

tap.test(`77`, (t) => {
  t.false(is(str44, 11, 32), "77");
  t.end();
});

tap.test(`78`, (t) => {
  t.false(is(str44, 11, 37), "78");
  t.end();
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
tap.test(`79`, (t) => {
  t.false(is(str51, 11, 18), "79");
  t.end();
});

tap.test(`80`, (t) => {
  t.false(is(str51, 11, 23), "80");
  t.end();
});

tap.test(`81`, (t) => {
  t.true(is(str51, 11, 24), "81");
  t.end();
});

tap.test(`82`, (t) => {
  t.false(is(str51, 11, 32), "82");
  t.end();
});

tap.test(`83`, (t) => {
  t.false(is(str51, 11, 37), "83");
  t.end();
});

// both single
const str52 = `<div style='float:'left'' align='left'>z</div>`;
tap.test(`84`, (t) => {
  t.false(is(str52, 11, 18), "84");
  t.end();
});

tap.test(`85`, (t) => {
  t.false(is(str52, 11, 23), "85");
  t.end();
});

tap.test(`86`, (t) => {
  t.true(is(str52, 11, 24), "86");
  t.end();
});

tap.test(`87`, (t) => {
  t.false(is(str52, 11, 32), "87");
  t.end();
});

tap.test(`88`, (t) => {
  t.false(is(str52, 11, 37), "88");
  t.end();
});

// double wrapping single
const str53 = `<div style="float:'left'" align='left'>z</div>`;
tap.test(`89`, (t) => {
  t.false(is(str53, 11, 18), "89");
  t.end();
});

tap.test(`90`, (t) => {
  t.false(is(str53, 11, 23), "90");
  t.end();
});

tap.test(`91`, (t) => {
  t.true(is(str53, 11, 24), "91");
  t.end();
});

tap.test(`92`, (t) => {
  t.false(is(str53, 11, 32), "92");
  t.end();
});

tap.test(`93`, (t) => {
  t.false(is(str53, 11, 37), "93");
  t.end();
});

// single wrapping double
const str54 = `<div style='float:"left"' align='left'>z</div>`;
tap.test(`94`, (t) => {
  t.false(is(str54, 11, 18), "94");
  t.end();
});

tap.test(`95`, (t) => {
  t.false(is(str54, 11, 23), "95");
  t.end();
});

tap.test(`96`, (t) => {
  t.true(is(str54, 11, 24), "96");
  t.end();
});

tap.test(`97`, (t) => {
  t.false(is(str54, 11, 32), "97");
  t.end();
});

tap.test(`98`, (t) => {
  t.false(is(str54, 11, 37), "98");
  t.end();
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
tap.test(`99`, (t) => {
  t.false(is(str6, 12, 13), "99.01");
  t.false(is(str6, 12, 17), "99.02");
  t.true(is(str6, 12, 18), "99.03");
  t.end();
});
