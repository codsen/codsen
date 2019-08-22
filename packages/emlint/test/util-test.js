// avanotonly

import test from "ava";
import {
  charSuitableForAttrName,
  charSuitableForTagName,
  lowAsciiCharacterNames,
  attributeOnTheRight,
  onlyTheseLeadToThat,
  withinTagInnerspace,
  isUppercaseLetter,
  findClosingQuote,
  c1CharacterNames,
  tagOnTheRight,
  isLatinLetter,
  isLowercase,
  charIsQuote,
  encodeChar,
  isTagChar,
  isStr,
  log
} from "../dist/util.esm";

test(`01 - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - no offset`, t => {
  // R1 - xhtml tag ending that follows straight away
  t.true(withinTagInnerspace(`/  >`));
  t.true(withinTagInnerspace(`/>`));
  t.true(withinTagInnerspace(`/> `));
  t.true(withinTagInnerspace(`/> \t`));

  t.true(withinTagInnerspace(` /  >`));
  t.true(withinTagInnerspace(` />`));
  t.true(withinTagInnerspace(` /> `));
  t.true(withinTagInnerspace(` /> \t`));

  t.true(withinTagInnerspace(` \n /  >`));
  t.true(withinTagInnerspace(` \n />`));
  t.true(withinTagInnerspace(` \n /> `));
  t.true(withinTagInnerspace(` \n /> \t`));
  //
  // R2 - pt1. HTML ending and there's at least one atribute with equal+quotes
  t.true(withinTagInnerspace(` z="">`));
  t.true(withinTagInnerspace(` z="'>`));
  t.true(withinTagInnerspace(` z='">`));
  t.true(withinTagInnerspace(` z=''>`));

  t.true(withinTagInnerspace(` z="  ">`));
  t.true(withinTagInnerspace(` z='  ">`));
  t.true(withinTagInnerspace(` z="  '>`));
  t.true(withinTagInnerspace(` z='  '>`));

  t.true(withinTagInnerspace(` z=" /> ">`));
  t.true(withinTagInnerspace(` z=' /> ">`));
  t.true(withinTagInnerspace(` z=" /> '>`));
  t.true(withinTagInnerspace(` z=' /> '>`));

  t.true(withinTagInnerspace(` z=""/>`));
  t.true(withinTagInnerspace(` z='"/>`));
  t.true(withinTagInnerspace(` z="'/>`));
  t.true(withinTagInnerspace(` z=''/>`));

  t.true(withinTagInnerspace(` z="  "/>`));
  t.true(withinTagInnerspace(` z='  "/>`));
  t.true(withinTagInnerspace(` z="  '/>`));
  t.true(withinTagInnerspace(` z='  '/>`));

  t.true(withinTagInnerspace(` z=" /> "/>`));
  t.true(withinTagInnerspace(` z=' /> "/>`));
  t.true(withinTagInnerspace(` z=" /> '/>`));
  t.true(withinTagInnerspace(` z=' /> '/>`));

  t.true(withinTagInnerspace(` z=""/>`));
  t.true(withinTagInnerspace(` z='"/>`));
  t.true(withinTagInnerspace(` z="'/>`));
  t.true(withinTagInnerspace(` z=''/>`));

  t.true(withinTagInnerspace(` alt=""/>`));
  t.true(withinTagInnerspace(` alt='"/>`));
  t.true(withinTagInnerspace(` alt="'/>`));
  t.true(withinTagInnerspace(` alt=''/>`));
  //
  // R2 - pt2. there can be boolean attributes, no worries:
  t.true(withinTagInnerspace(` alt="" yoyo>`));
  t.true(withinTagInnerspace(` alt='" yoyo>`));
  t.true(withinTagInnerspace(` alt="' yoyo>`));
  t.true(withinTagInnerspace(` alt='' yoyo>`));

  t.true(withinTagInnerspace(` alt="" yoyo/>`));
  t.true(withinTagInnerspace(` alt='" yoyo/>`));
  t.true(withinTagInnerspace(` alt="' yoyo/>`));
  t.true(withinTagInnerspace(` alt='' yoyo/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop>`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop/>`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop />`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop />`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop />`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop />`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop / >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop / >`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop / >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop/ >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop/ >`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop/ >`));

  // R3 - pt.1 html tag ending that follows straight away, with a tag that follows
  t.true(withinTagInnerspace(` ><a>`));
  t.true(withinTagInnerspace(` ><a/>`));
  t.true(withinTagInnerspace(` ></a>`));

  t.true(withinTagInnerspace(` ><a bcd="ef">`));
  t.true(withinTagInnerspace(` ><a bcd='ef">`));
  t.true(withinTagInnerspace(` ><a bcd="ef'>`));
  t.true(withinTagInnerspace(` ><a bcd='ef'>`));

  t.true(withinTagInnerspace(` ><a bcd="ef"/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef"/>`));
  t.true(withinTagInnerspace(` ><a bcd="ef'/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef'/>`));

  t.true(withinTagInnerspace(` ><a bcd="ef" gh/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef" gh/>`));
  t.true(withinTagInnerspace(` ><a bcd="ef' gh/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef' gh/>`));

  t.true(withinTagInnerspace(` ><a bcd="ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` ><a bcd="ef" ghi="jkl"/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef' ghi='jkl'/>`));
  //
  // R3 - pt2. text in between
  t.true(withinTagInnerspace(` >xyz<a>`));

  t.true(withinTagInnerspace(` >img<img alt=""`));
  t.true(withinTagInnerspace(` >img<img alt='"`));
  t.true(withinTagInnerspace(` >img<img alt="'`));
  t.true(withinTagInnerspace(` >img<img alt=''`));

  t.true(withinTagInnerspace(` >xyz<a<`)); // unclosed tag "<a"
  t.true(withinTagInnerspace(` > xyz<a/>`));
  t.true(withinTagInnerspace(` >\nxyz</a>`));

  t.true(withinTagInnerspace(` >\txyz<a bcd="ef">`));
  t.true(withinTagInnerspace(` >\txyz<a bcd='ef">`));
  t.true(withinTagInnerspace(` >\txyz<a bcd="ef'>`));
  t.true(withinTagInnerspace(` >\txyz<a bcd='ef'>`));

  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd="ef"/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd='ef"/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd="ef'/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd='ef'/>`));

  t.true(withinTagInnerspace(` >\nxyz\n<a bcd="ef" gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd='ef" gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd="ef' gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd='ef' gh/>`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl">`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi='jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi='jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl"/>`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi='jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi='jkl'/>`));
  //
  // R3 - pt3. various
  t.true(withinTagInnerspace(` /><a>`));

  t.true(withinTagInnerspace(` z=""><a>`));
  t.true(withinTagInnerspace(` z='"><a>`));
  t.true(withinTagInnerspace(` z="'><a>`));
  t.true(withinTagInnerspace(` z=''><a>`));
  t.true(withinTagInnerspace(` z=""/><a>`));
  t.true(withinTagInnerspace(` z='"/><a>`));
  t.true(withinTagInnerspace(` z="'/><a>`));
  t.true(withinTagInnerspace(` z=''/><a>`));

  t.true(withinTagInnerspace(` z=""><a/>`));
  t.true(withinTagInnerspace(` z='"><a/>`));
  t.true(withinTagInnerspace(` z="'><a/>`));
  t.true(withinTagInnerspace(` z=''><a/>`));
  t.true(withinTagInnerspace(` z=""/><a/>`));
  t.true(withinTagInnerspace(` z='"/><a/>`));
  t.true(withinTagInnerspace(` z="'/><a/>`));
  t.true(withinTagInnerspace(` z=''/><a/>`));

  t.true(withinTagInnerspace(` z=""><a />`));
  t.true(withinTagInnerspace(` z='"><a />`));
  t.true(withinTagInnerspace(` z="'><a />`));
  t.true(withinTagInnerspace(` z=''><a />`));
  t.true(withinTagInnerspace(` z=""/><a />`));
  t.true(withinTagInnerspace(` z='"/><a />`));
  t.true(withinTagInnerspace(` z="'/><a />`));
  t.true(withinTagInnerspace(` z=''/><a />`));

  t.true(withinTagInnerspace(` z=""><a/ >`));
  t.true(withinTagInnerspace(` z='"><a/ >`));
  t.true(withinTagInnerspace(` z="'><a/ >`));
  t.true(withinTagInnerspace(` z=''><a/ >`));
  t.true(withinTagInnerspace(` z=""/><a/ >`));
  t.true(withinTagInnerspace(` z='"/><a/ >`));
  t.true(withinTagInnerspace(` z="'/><a/ >`));
  t.true(withinTagInnerspace(` z=''/><a/ >`));

  t.true(withinTagInnerspace(` z=""><a / >`));
  t.true(withinTagInnerspace(` z='"><a / >`));
  t.true(withinTagInnerspace(` z="'><a / >`));
  t.true(withinTagInnerspace(` z=''><a / >`));
  t.true(withinTagInnerspace(` z=""/><a / >`));
  t.true(withinTagInnerspace(` z='"/><a / >`));
  t.true(withinTagInnerspace(` z="'/><a / >`));
  t.true(withinTagInnerspace(` z=''/><a / >`));

  t.true(withinTagInnerspace(` alt=""/><a>`));
  t.true(withinTagInnerspace(` alt="'/><a>`));
  t.true(withinTagInnerspace(` alt='"/><a>`));
  t.true(withinTagInnerspace(` alt=''/><a>`));

  t.true(withinTagInnerspace(` >\n   <b>`));
  t.true(withinTagInnerspace(` />\n   <b>`));

  t.true(withinTagInnerspace(` z="">\n   <b>`));
  t.true(withinTagInnerspace(` z='">\n   <b>`));
  t.true(withinTagInnerspace(` z="'>\n   <b>`));
  t.true(withinTagInnerspace(` z=''>\n   <b>`));
  t.true(withinTagInnerspace(` z=""/>\n   <b>`));
  t.true(withinTagInnerspace(` z='"/>\n   <b>`));
  t.true(withinTagInnerspace(` z="'/>\n   <b>`));
  t.true(withinTagInnerspace(` z=''/>\n   <b>`));

  t.true(withinTagInnerspace(` z="" >\n   <b>`));
  t.true(withinTagInnerspace(` z='" >\n   <b>`));
  t.true(withinTagInnerspace(` z="' >\n   <b>`));
  t.true(withinTagInnerspace(` z='' >\n   <b>`));
  t.true(withinTagInnerspace(` z="" />\n   <b>`));
  t.true(withinTagInnerspace(` z='" />\n   <b>`));
  t.true(withinTagInnerspace(` z="' />\n   <b>`));
  t.true(withinTagInnerspace(` z='' />\n   <b>`));

  t.true(withinTagInnerspace(` z="" / >\n   <b>`));
  t.true(withinTagInnerspace(` z='" / >\n   <b>`));
  t.true(withinTagInnerspace(` z="' / >\n   <b>`));
  t.true(withinTagInnerspace(` z='' / >\n   <b>`));
  t.true(withinTagInnerspace(` z="" /  >\n   <b>`));
  t.true(withinTagInnerspace(` z='" /  >\n   <b>`));
  t.true(withinTagInnerspace(` z="' /  >\n   <b>`));
  t.true(withinTagInnerspace(` z='' /  >\n   <b>`));

  t.true(withinTagInnerspace(` alt=""/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='"/>\n   <b>`));
  t.true(withinTagInnerspace(` alt="'/>\n   <b>`));
  t.true(withinTagInnerspace(` alt=''/>\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n/>\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n/ >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' klm xyz \n >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt='" klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt="' klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt='' klm xyz \n >\n nop  <b>`));
  //
  // R4 - boolean attribute followed by slash followed by closing bracket
  t.true(withinTagInnerspace(` abc/>`));
  // R5 - full attribute with matching quotes:
  t.true(withinTagInnerspace(` abc="" def="">`));
  t.true(withinTagInnerspace(` abc='" def="">`));
  t.true(withinTagInnerspace(` abc="' def="">`));
  t.true(withinTagInnerspace(` abc='' def="">`));

  t.true(withinTagInnerspace(` abc="" def=""/>`));
  t.true(withinTagInnerspace(` abc='" def=""/>`));
  t.true(withinTagInnerspace(` abc="' def=""/>`));
  t.true(withinTagInnerspace(` abc='' def=""/>`));

  t.true(withinTagInnerspace(` abc="" def="" />`));
  t.true(withinTagInnerspace(` abc='" def="" />`));
  t.true(withinTagInnerspace(` abc="' def="" />`));
  t.true(withinTagInnerspace(` abc='' def="" />`));

  t.true(withinTagInnerspace(` abc="" def=""/ >`));
  t.true(withinTagInnerspace(` abc='" def=""/ >`));
  t.true(withinTagInnerspace(` abc="' def=""/ >`));
  t.true(withinTagInnerspace(` abc='' def=""/ >`));

  t.true(withinTagInnerspace(` abc="" def="" / >`));
  t.true(withinTagInnerspace(` abc='" def="" / >`));
  t.true(withinTagInnerspace(` abc="' def="" / >`));
  t.true(withinTagInnerspace(` abc='' def="" / >`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij'>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij'/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' />`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));

  t.true(withinTagInnerspace(` abc=' def='>`));
  t.true(withinTagInnerspace(` abc=" def='>`));
  t.true(withinTagInnerspace(` abc=' def=">`));
  t.true(withinTagInnerspace(` abc=" def=">`));

  t.true(withinTagInnerspace(` abc=' def='/>`));
  t.true(withinTagInnerspace(` abc=" def='/>`));
  t.true(withinTagInnerspace(` abc=' def="/>`));
  t.true(withinTagInnerspace(` abc=" def="/>`));

  t.true(withinTagInnerspace(` abc=' def=' />`));
  t.true(withinTagInnerspace(` abc=" def=' />`));
  t.true(withinTagInnerspace(` abc=' def=" />`));
  t.true(withinTagInnerspace(` abc=" def=" />`));

  t.true(withinTagInnerspace(` abc=' def='/ >`));
  t.true(withinTagInnerspace(` abc=" def='/ >`));
  t.true(withinTagInnerspace(` abc=' def="/ >`));
  t.true(withinTagInnerspace(` abc=" def="/ >`));

  t.true(withinTagInnerspace(` abc=' def=' / >`));
  t.true(withinTagInnerspace(` abc=" def=' / >`));
  t.true(withinTagInnerspace(` abc=' def=" / >`));
  t.true(withinTagInnerspace(` abc=" def=" / >`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij">`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij'>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij'/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij' />`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij' />`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij' />`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij" />`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' />`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/ >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij"/ >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" / >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" / >`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' / >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' / >`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' / >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij" /\n>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" /\n>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' /\n>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' /\n>`));

  // various
  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= >nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= />nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop</r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop<r/>`));
  // false:
  t.false(withinTagInnerspace(`tralala"/>\n   <b>`));
  t.false(withinTagInnerspace(`tralala'/>\n   <b>`));

  t.true(withinTagInnerspace(`tralala/>\n   <b>`));
  t.false(withinTagInnerspace(`= ef>`));
  t.false(withinTagInnerspace(`= ef>\n   <b>`));
  t.false(withinTagInnerspace(`= ef/>\n   <b>`));
  t.false(withinTagInnerspace(` = ef>`));
  t.false(withinTagInnerspace(` = ef>\n   <b>`));
  t.false(withinTagInnerspace(` = ef/>\n   <b>`));
  t.false(withinTagInnerspace(`=ef>`));
  t.false(withinTagInnerspace(`=ef>\n   <b>`));
  t.false(withinTagInnerspace(`=ef/>\n   <b>`));
});

test(`02 - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - with offset`, t => {
  const source1 = `<img src="zzz.jpg" alt=" height="100" border="0" style="display:block;"/>`;
  t.true(withinTagInnerspace(source1, 24), "02.01");
  t.true(withinTagInnerspace(source1, 25), "02.02");

  const source2 = `<img src="zzz.jpg" alt=" zzz" border="0" style="display:block;" alt=""/>`;
  t.false(withinTagInnerspace(source2, 24), "02.03");
  t.false(withinTagInnerspace(source2, 25), "02.04");

  const source3 = `<img src="zzz.jpg" alt=" <--- zzz" border="0" style="display:block;" alt=""/>`;
  t.false(withinTagInnerspace(source3, 24), "02.05");
  t.false(withinTagInnerspace(source3, 25), "02.06");

  // but this is within inner tag space:
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="border="0" style="display:block;" alt=""/>`,
      24
    ),
    "02.07 - missing space and closing quote"
  );
  t.true(withinTagInnerspace(`<img src="zzz.jpg" alt=">`, 24), "02.08");
  t.true(withinTagInnerspace(`<img src="zzz.jpg" alt="/>`, 24), "02.09");
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">\n`,
      //                       ^
      24
    ),
    "02.05-2"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">a`,
      //                       ^
      24
    ),
    "02.05-3"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="><`,
      //                       ^
      24
    ),
    "02.05-4"
  );
  t.false(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">a"`,
      //                       ^
      24
    ),
    "02.05-3"
  );

  // nobody puts /> at the beginning of a comment! It's a positive case.
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="/>`,
      //                       ^
      24
    ),
    "02.06"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="><aaa`,
      //                       ^
      24
    ),
    "02.07"
  );
});

test(`03 - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - broken code case #1`, t => {
  t.true(withinTagInnerspace(` alt= >aaa<b>`), "03.01");
  t.true(withinTagInnerspace(` alt= ><b>`), "03.02");
});

test(`04 - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - broken code case #2`, t => {
  const code = `<td abc='d e" fgh ijk="klm'/>`;
  //  -->                    ^
  t.true(withinTagInnerspace(code, 13), "04");
});

test(`05 - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd= ef=gh>zyx<i jkl= mn=op>`;
  //  -->              ^^
  t.true(withinTagInnerspace(code, 7), "05.01");
  t.true(withinTagInnerspace(code, 8), "05.02");
});

test(`06 - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd = ef ghi = jk lmn / >`;
  t.true(withinTagInnerspace(code, 2), "06.01");
  t.false(withinTagInnerspace(code, 6), "06.02");
  t.false(withinTagInnerspace(code, 8), "06.03");
  t.true(withinTagInnerspace(code, 11), "06.04");
  t.false(withinTagInnerspace(code, 15), "06.05");
  t.false(withinTagInnerspace(code, 17), "06.06");
  t.true(withinTagInnerspace(code, 20), "06.07");
  t.true(withinTagInnerspace(code, 24), "06.08");
});

test(`07 - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd=ef ghi='jk' lmn>`;
  t.false(withinTagInnerspace(code, 6), "07.01");
  t.false(withinTagInnerspace(code, 7), "07.02");
  t.true(withinTagInnerspace(code, 9), "07.03");
  t.true(withinTagInnerspace(code, 10), "07.04");
  t.false(withinTagInnerspace(code, 13), "07.05");
  t.false(withinTagInnerspace(code, 14), "07.06");
  t.false(withinTagInnerspace(code, 15), "07.07");
  t.false(withinTagInnerspace(code, 17), "07.09");
  t.true(withinTagInnerspace(code, 18), "07.10");
  t.true(withinTagInnerspace(code, 19), "07.11");
});

test(`11 - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - positive cases`, t => {
  t.true(!!attributeOnTheRight(`"">`), "11.01");
  t.true(!!attributeOnTheRight(`"" >`), "11.02");
  t.true(!!attributeOnTheRight(`""/>`), "11.03");
  t.true(!!attributeOnTheRight(`"" />`), "11.04");
  t.true(!!attributeOnTheRight(`"" / >`), "11.05");
  t.true(!!attributeOnTheRight(`""/ >`), "11.06");

  // ends with EOF
  t.true(!!attributeOnTheRight(`""`), "11.07");
  t.true(!!attributeOnTheRight(`"" `), "11.08");
  t.true(!!attributeOnTheRight(`"" \n`), "11.09");

  // attr without value follows
  t.true(!!attributeOnTheRight(`"" nowrap>`), "11.10");
  t.true(!!attributeOnTheRight(`"" nowrap/>`), "11.11");

  const s1 = `<img alt="sometext < more text = other/text" anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s1, 9), "11.12");
});

test(`12 - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - negative cases`, t => {
  t.false(attributeOnTheRight(`" attr1 atr2><img>`), "12.01");
  t.false(attributeOnTheRight(`">`), "12.02");
  t.false(attributeOnTheRight(`"/>`), "12.03");
  t.false(attributeOnTheRight(`" attr=""/>`), "12.04");
  t.false(attributeOnTheRight(`" attr1 attr2=""/>`), "12.05");
  t.false(attributeOnTheRight(`" attr1 attr/>`), "12.06");
  t.false(attributeOnTheRight(`" attr1 attr />`), "12.07");

  // single quote
  t.false(attributeOnTheRight(`' attr1 atr2><img>`), "12.08");
  t.false(attributeOnTheRight(`'>`), "12.09");
  t.false(attributeOnTheRight(`'/>`), "12.10");
  t.false(attributeOnTheRight(`' attr=""/>`), "12.11");
  t.false(attributeOnTheRight(`' attr=''/>`), "12.12");
  t.false(attributeOnTheRight(`' attr1 attr2=""/>`), "12.13");
  t.false(attributeOnTheRight(`' attr1 attr2=''/>`), "12.14");
  t.false(attributeOnTheRight(`' attr1 attr/>`), "12.15");
  t.false(attributeOnTheRight(`' attr1 attr />`), "12.16");
});

test(`13 - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - negative cases`, t => {
  const s1 = `<img alt="sometext < more text = other/text" anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s1, 9), "13.01");
  t.false(attributeOnTheRight(s1, 43), "13.02");
  t.true(!!attributeOnTheRight(s1, 56), "13.03");
  t.false(attributeOnTheRight(s1, 60), "13.04");
});

test(`14 - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - mismatching quotes`, t => {
  // mismatching quotes, minimal example:
  const s1 = `<a b="c' d="e"/><f g="h"/>`;
  t.true(!!attributeOnTheRight(s1, 5), "14.01");
  t.false(attributeOnTheRight(s1, 7), "14.02");
  t.true(!!attributeOnTheRight(s1, 11), "14.03");
  t.false(attributeOnTheRight(s1, 13), "14.04");
  t.true(!!attributeOnTheRight(s1, 21), "14.05");
  t.false(attributeOnTheRight(s1, 23), "14.06");

  const s2 = `<img alt="sometext < more text = other/text' anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s2, 9), "14.07");
  t.false(attributeOnTheRight(s2, 43), "14.08");
  t.true(!!attributeOnTheRight(s2, 56), "14.09");
  t.false(attributeOnTheRight(s2, 60), "14.10");
});

test(`15 - ${`\u001b[${33}m${`findClosingQuote()`}\u001b[${39}m`} - finds closing quote`, t => {
  const code1 = `<zzz alt=So, "a" > "b"'>\ntext <img>`;
  t.is(findClosingQuote(code1, 9), 22, "15.01");

  const code2 = `<zzz alt=">`;
  t.is(findClosingQuote(code2, 9), 10, "15.02");

  const code3 = `<zzz alt="/>`;
  t.is(findClosingQuote(code3, 9), 10, "15.03");

  const code4 = `<zzz alt=" />`;
  t.is(findClosingQuote(code4, 9), 10, "15.04");

  const code5 = `<zzz alt="><img alt="">`;
  t.is(findClosingQuote(code5, 9), 10, "15.05");

  const code6 = `<zzz alt="/><img alt="">`;
  t.is(findClosingQuote(code6, 9), 10, "15.06");

  const code7 = `<zzz alt=" /><img alt="">`;
  t.is(findClosingQuote(code7, 9), 10, "15.07");
});

test(`16 - ${`\u001b[${33}m${`findClosingQuote()`}\u001b[${39}m`} - mismatching quotes in attributes`, t => {
  const code1 = `<aaa bbb="ccc' ddd="eee"/>`;
  t.is(findClosingQuote(code1, 9), 13, "16.01");

  const code2 = `<aaa bbb='ccc" ddd="eee"/>`;
  t.is(findClosingQuote(code2, 9), 13, "16.02");

  const code3 = `<aaa bbb='ccc" ddd='eee'/>`;
  t.is(findClosingQuote(code3, 9), 13, "16.03");
});

test(`17 - ${`\u001b[${33}m${`findClosingQuote()`}\u001b[${39}m`} - mismatching quotes in attributes`, t => {
  const code1 = `<aaa bbb="ccc" ddd= eee="fff"/>`;
  t.is(findClosingQuote(code1, 9), 13, "17.01");
  t.is(findClosingQuote(code1, 25), 28, "17.02");
});

test(`18 - ${`\u001b[${33}m${`findClosingQuote()`}\u001b[${39}m`} - unclosed quote`, t => {
  const code = `<zzz alt="nnn="mmm">`;
  t.is(findClosingQuote(code, 9), 10, "18.01");
});

test(`19 - ${`\u001b[${33}m${`findClosingQuote()`}\u001b[${39}m`} - quotes missing`, t => {
  const code = `<a bcd=ef ghi='jk' lmn>`;
  t.is(findClosingQuote(code, 7), 9, "19.01");
  t.is(findClosingQuote(code, 14), 17, "19.02");
});

test(`20 - ${`\u001b[${33}m${`findClosingQuote()`}\u001b[${39}m`} - three quote-less attributes`, t => {
  const code = `<a bcd=ef ghj=kl mno=pqrs><img src="z.jpg">`;
  t.is(findClosingQuote(code, 7), 9, "20.01");
  t.is(findClosingQuote(code, 14), 16, "20.02");
  t.is(findClosingQuote(code, 21), 25, "20.03");
});

test(`40 - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - normal tag`, t => {
  const s1 = `<a>`;
  t.true(tagOnTheRight(s1), "40.01");
  t.true(tagOnTheRight(s1, 0), "40.02");

  const s2 = `<img>`;
  t.true(tagOnTheRight(s2), "40.03");
  t.true(tagOnTheRight(s2, 0), "40.04");

  const s3 = `<img alt="">`;
  t.true(tagOnTheRight(s3), "40.05");
  t.true(tagOnTheRight(s3, 0), "40.06");

  const s4 = `<img alt="zzz">`;
  t.true(tagOnTheRight(s4), "40.07");
  t.true(tagOnTheRight(s4, 0), "40.08");

  const s5 = `<td nowrap>`;
  t.false(tagOnTheRight(s5), "40.09"); // <---- false because no attributes with equal-quote found
  t.false(tagOnTheRight(s5, 0), "40.10");

  const s6 = `<td class="klm" nowrap>`;
  t.true(tagOnTheRight(s6), "40.11");
  t.true(tagOnTheRight(s6, 0), "40.12");

  const s7 = `<td nowrap class="klm">`;
  t.true(tagOnTheRight(s7), "40.13");

  const s8 = `<td nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap class="klm"`;
  t.true(tagOnTheRight(s8), "40.14");
});

test(`41 - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - closing tag`, t => {
  // closing tag
  const s1 = `</td>`;
  t.true(tagOnTheRight(s1), "41.01");
  t.true(tagOnTheRight(s1, 0), "41.02");

  const s2 = `</ td>`;
  t.true(tagOnTheRight(s2), "41.03");
  t.true(tagOnTheRight(s2, 0), "41.04");

  const s3 = `< / td>`;
  t.true(tagOnTheRight(s3), "41.05");
  t.true(tagOnTheRight(s3, 0), "41.06");

  const s4 = `</ td >`;
  t.true(tagOnTheRight(s4), "41.07");
  t.true(tagOnTheRight(s4, 0), "41.08");

  const s5 = `< / td >`;
  t.true(tagOnTheRight(s5), "41.09");
  t.true(tagOnTheRight(s5, 0), "41.10");
});

test(`42 - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s1 = `<br/>`;
  t.true(tagOnTheRight(s1), "42.01");
  t.true(tagOnTheRight(s1, 0), "42.02");

  const s2 = `< br/>`;
  t.true(tagOnTheRight(s2), "42.03");
  t.true(tagOnTheRight(s2, 0), "42.04");

  const s3 = `<br />`;
  t.true(tagOnTheRight(s3), "42.05");
  t.true(tagOnTheRight(s3, 0), "42.06");

  const s4 = `<br/ >`;
  t.true(tagOnTheRight(s4), "42.07");
  t.true(tagOnTheRight(s4, 0), "42.08");

  const s5 = `<br / >`;
  t.true(tagOnTheRight(s5), "42.09");
  t.true(tagOnTheRight(s5, 0), "42.10");

  const s6 = `< br / >`;
  t.true(tagOnTheRight(s6), "42.11");
  t.true(tagOnTheRight(s6, 0), "42.12");
});

test(`43 - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s1 = `<br class="a"/>`;
  t.true(tagOnTheRight(s1), "43.01");
  t.true(tagOnTheRight(s1, 0), "43.02");

  const s2 = `< br class="a"/>`;
  t.true(tagOnTheRight(s2), "43.03");
  t.true(tagOnTheRight(s2, 0), "43.04");

  const s3 = `<br class="a" />`;
  t.true(tagOnTheRight(s3), "43.05");
  t.true(tagOnTheRight(s3, 0), "43.06");

  const s4 = `<br class="a"/ >`;
  t.true(tagOnTheRight(s4), "43.07");
  t.true(tagOnTheRight(s4, 0), "43.08");

  const s5 = `<br class="a" / >`;
  t.true(tagOnTheRight(s5), "43.09");
  t.true(tagOnTheRight(s5, 0), "43.10");

  const s6 = `< br class="a" / >`;
  t.true(tagOnTheRight(s6), "43.11");
  t.true(tagOnTheRight(s6, 0), "43.12");

  const s7 = `< br class = "a"  id ='z' / >`;
  t.true(tagOnTheRight(s7), "43.13");
  t.true(tagOnTheRight(s7, 0), "43.14");

  const s8 = `< br class = "a'  id = "z' / >`;
  t.true(tagOnTheRight(s8), "43.15");
  t.true(tagOnTheRight(s8, 0), "43.16");
});

test(`44 - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - ad-hoc #1`, t => {
  const s1 = `<a b="ccc"<d>`;
  t.false(tagOnTheRight(s1, 6), "44.02");
  t.true(tagOnTheRight(s1, 10), "44.02");
});

test(`51 - ${`\u001b[${33}m${`onlyTheseLeadToThat()`}\u001b[${39}m`} - not greedy - default start idx - various validators`, t => {
  function notBracket(char) {
    return char !== ">";
  }

  const s1 = `<abc alt=here're various "characters" here>`;
  t.is(
    onlyTheseLeadToThat(
      s1,
      9,
      notBracket,
      char => {
        return char === ">";
      },
      null
    ),
    42,
    "51.01"
  );
});

test(`52 - ${`\u001b[${33}m${`onlyTheseLeadToThat()`}\u001b[${39}m`} - not greedy - default start idx - greedy selection`, t => {
  // we'll skip to last bracket followed by equal
  function notBracket(char) {
    return char !== ">";
  }

  const s1 = `<abc alt=a > b>blablabla<img alt="zzz">`;
  t.is(
    onlyTheseLeadToThat(
      s1,
      null,
      notBracket,
      char => {
        return char === ">";
      },
      char => {
        return char === "=";
      }
    ),
    14,
    "52.01"
  );
});

test(`61 - ${`\u001b[${32}m${`encodeChar()`}\u001b[${39}m`} - bad-character-unencoded-ampersand`, t => {
  const testsToRun = [
    // ["&", "&amp;", "bad-character-unencoded-ampersand"],
    ["<", "&lt;", "bad-character-unencoded-opening-bracket"],
    [">", "&gt;", "bad-character-unencoded-closing-bracket"],
    [`"`, "&quot;", "bad-character-unencoded-double-quotes"],
    ["`", "&#x60;", "bad-character-grave-accent"],
    ["\xA3", "&pound;", "bad-character-unencoded-pound"],
    ["\u20AC", "&euro;", "bad-character-unencoded-euro"],
    ["\xA2", "&cent;", "bad-character-unencoded-cent"]
  ];
  testsToRun.forEach(test => {
    t.deepEqual(
      encodeChar(`a${test[0]}b`, 1),
      {
        name: test[2],
        position: [[1, 2, test[1]]]
      },
      "61 - 1. character to encode"
    );
    t.is(encodeChar(`a&b`, 0), null, "61 - 2. nothing to encode");
    t.is(encodeChar(`a&b`, 2), null, "61 - 3. nothing to encode");
  });
});

test(`62 - ${`\u001b[${33}m${`charSuitableForTagName()`}\u001b[${39}m`} - all tests`, t => {
  t.true(charSuitableForTagName("a"));
  t.true(charSuitableForTagName(":"));
  t.false(charSuitableForTagName("_"));
  t.false(charSuitableForTagName("-"));
  t.false(charSuitableForTagName("."));
  t.false(charSuitableForTagName("{"));
});

test(`63 - ${`\u001b[${32}m${`charSuitableForAttrName()`}\u001b[${39}m`} - all tests`, t => {
  t.true(charSuitableForAttrName("a"));
  t.true(charSuitableForAttrName("_"));
  t.true(charSuitableForAttrName("-"));
  t.true(charSuitableForAttrName("{"));
  t.true(charSuitableForAttrName("/"));

  t.false(charSuitableForAttrName(`"`));
  t.false(charSuitableForAttrName(`'`));
  t.false(charSuitableForAttrName(`>`));
  t.false(charSuitableForAttrName(`<`));
  t.false(charSuitableForAttrName(`=`));
});

test(`64 - ${`\u001b[${33}m${`charIsQuote()`}\u001b[${39}m`} - all tests`, t => {
  t.false(charIsQuote("a"));
  t.false(charIsQuote("-"));
  t.false(charIsQuote(" "));

  t.true(charIsQuote(`"`));
  t.true(charIsQuote(`'`));
  t.true(charIsQuote("`"));
  t.true(charIsQuote("\u2018"));
  t.true(charIsQuote("\u2019"));
  t.true(charIsQuote("\u201C"));
  t.true(charIsQuote("\u201D"));
});

test(`65 - ${`\u001b[${32}m${`notTagChar()`}\u001b[${39}m`} - all tests`, t => {
  t.true(isTagChar("a"));
  t.false(isTagChar(">"));
  t.false(isTagChar("<"));
  t.false(isTagChar("="));
  const error1 = t.throws(() => {
    isTagChar("aa");
  });
  t.regex(error1.message, /input is not a single string character/);
});

test(`66 - ${`\u001b[${33}m${`isUppercaseLetter()`}\u001b[${39}m`} - all tests`, t => {
  t.true(isUppercaseLetter("A"));
  t.false(isUppercaseLetter("a"));
  t.false(isUppercaseLetter("\u0414")); // Cyrillic uppercase "D"
  t.false(isUppercaseLetter("\u0434")); // Cyrillic lowercase "d"

  t.false(isUppercaseLetter("1"));
  t.false(isUppercaseLetter("_"));
  t.false(isUppercaseLetter("("));
  t.false(isUppercaseLetter(" "));
});

test(`67 - ${`\u001b[${32}m${`isLowercase()`}\u001b[${39}m`} - all tests`, t => {
  t.false(isLowercase("A"));
  t.true(isLowercase("a"));
  t.false(isLowercase("\u0414")); // Cyrillic uppercase "D"
  t.true(isLowercase("\u0434")); // Cyrillic lowercase "d"
});

test(`68 - ${`\u001b[${33}m${`isStr()`}\u001b[${39}m`} - all tests`, t => {
  t.true(isStr("a"));
  t.false(isStr(1));
  t.false(isStr(true));
  t.false(isStr(null));
  t.false(isStr(undefined));
  t.false(isStr({}));
  t.false(isStr(["1"]));
});

test(`69 - ${`\u001b[${32}m${`lowAsciiCharacterNames[]`}\u001b[${39}m`}`, t => {
  t.true(lowAsciiCharacterNames.length > 0);
});

test(`70 - ${`\u001b[${33}m${`c1CharacterNames[]`}\u001b[${39}m`}`, t => {
  t.true(c1CharacterNames.length > 0);
});

test(`71 - ${`\u001b[${32}m${`log()`}\u001b[${39}m`}`, t => {
  t.true(typeof log === "function");
});

test(`72 - ${`\u001b[${33}m${`isLatinLetter()`}\u001b[${39}m`} - all tests`, t => {
  t.true(isLatinLetter("A"));
  t.true(isLatinLetter("a"));
  t.false(isLatinLetter("\u0414")); // Cyrillic uppercase "D"
  t.false(isLatinLetter("\u0434")); // Cyrillic lowercase "d"
});
