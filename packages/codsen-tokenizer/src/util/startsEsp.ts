import { right } from "string-left-right";

import {
  Token,
  Layer,
  LayerEsp,
  espChars,
  flipEspTag,
  veryEspChars,
  notVeryEspChars,
  punctuationChars,
  xBeforeYOnTheRight,
} from "./util";

declare let DEV: boolean;

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsEsp(
  str: string,
  i: number,
  token: Token,
  layers: Layer[],
  withinStyle: boolean,
): boolean {
  let res =
    // 1. two consecutive esp characters - Liquid, Mailchimp etc.
    // {{ or |* and so on
    (espChars.includes(str[i]) &&
      str[i + 1] &&
      espChars.includes(str[i + 1]) &&
      // ensure our suspected lump doesn't comprise only
      // of "notVeryEspChars" - real ESP tag |**| can
      // contain asterisk (*) but only asterisks can't
      // comprise an ESP tag. But curly braces can -
      // {{ and }} are valid Nunjucks heads/tails.
      // So not all ESP tag characters are equal.
      !(
        notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])
      ) &&
      // only "veryEspChars" group characters can
      // be repeated, like {{ and }} - other's can't
      // for example, ** is not real ESP heads
      (str[i] !== str[i + 1] || veryEspChars.includes(str[i])) &&
      token.type !== "rule" &&
      token.type !== "at" &&
      !(str[i] === "-" && "-{(".includes(str[i + 1])) &&
      !("})".includes(str[i]) && "-".includes(str[i + 1])) &&
      !(
        // insurance against repeated percentages
        //
        // imagine: "99%%."
        //             ^
        //      we're here
        (
          str[i] === "%" &&
          str[i + 1] === "%" &&
          "0123456789".includes(str[i - 1]) &&
          (!str[i + 2] ||
            punctuationChars.includes(str[i + 2]) ||
            !str[i + 2].trim().length)
        )
      ) &&
      !(
        withinStyle &&
        ("{}".includes(str[i]) || "{}".includes(str[right(str, i) as number]))
      )) ||
    //
    // 2. html-like syntax
    //
    // 2.1 - Responsys RPL and similar
    // <#if z> or </#if> and so on

    // normal opening tag
    (str[i] === "<" &&
      // and
      // either it's closing tag and what follows is ESP-char
      ((str[i + 1] === "/" && espChars.includes(str[i + 2])) ||
        // or
        // it's not closing and esp char follows right away
        (espChars.includes(str[i + 1]) &&
          // but no cheating, character must not be second-grade
          !["-"].includes(str[i + 1])))) ||
    // 2.2 - JSP (Java Server Pages)
    // <%@ page blablabla %>
    // <c:set var="someList" value="${jspProp.someList}" />
    (str[i] === "<" &&
      // covers majority of JSP tag cases
      (str[i + 1] === "%" ||
        // <jsp:
        str.startsWith("jsp:", i + 1) ||
        // <cms:
        str.startsWith("cms:", i + 1) ||
        // <c:
        str.startsWith("c:", i + 1))) ||
    str.startsWith("${jspProp", i) ||
    //
    // 3. single character tails, for example RPL's closing curlies: ${zzz}
    // it's specifically a closing-kind character
    (`>})`.includes(str[i]) &&
      // heads include the opposite of it
      Array.isArray(layers) &&
      layers.length &&
      layers[layers.length - 1].type === "esp" &&
      (layers[layers.length - 1] as LayerEsp).openingLump.includes(
        flipEspTag(str[i]),
      ) &&
      // insurance against "greater than", as in:
      // <#if product.weight > 100>
      (str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<"))) ||
    //
    // 4. comment closing in RPL-like templating languages, for example:
    // <#-- z -->
    (str[i] === "-" &&
      str[i + 1] === "-" &&
      str[i + 2] === ">" &&
      Array.isArray(layers) &&
      layers.length &&
      layers[layers.length - 1].type === "esp" &&
      (layers[layers.length - 1] as LayerEsp).openingLump[0] === "<" &&
      (layers[layers.length - 1] as LayerEsp).openingLump[2] === "-" &&
      (layers[layers.length - 1] as LayerEsp).openingLump[3] === "-");

  DEV && console.log(`126 startsEsp(): RETURNS ${!!res}`);
  return !!res;
}

export default startsEsp;
