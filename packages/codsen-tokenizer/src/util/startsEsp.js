import { left, right } from "string-left-right";
import { flipEspTag, espChars, xBeforeYOnTheRight } from "./util";

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsEsp(str, i, token, layers, styleStarts) {
  console.log(
    `010 startsEsp(): RETURNS ${
      // 1. two consecutive esp characters - Liquid, Mailchimp etc.
      // {{ or |* and so on
      (espChars.includes(str[i]) &&
        str[i + 1] &&
        espChars.includes(str[i + 1]) &&
        token.type !== "rule" &&
        token.type !== "at" &&
        !(str[i] === "-" && "-{(".includes(str[i + 1])) &&
        !("})".includes(str[i]) && "-".includes(str[i + 1])) &&
        !(
          // insurance against repeated percentages
          (
            str[i] === "%" &&
            "0123456789".includes(str[left(str, i)]) &&
            (!str[i + 2] ||
              [`"`, `'`, ";"].includes(str[i + 2]) ||
              !str[i + 2].trim().length)
          )
        ) &&
        !(
          styleStarts &&
          ("{}".includes(str[i]) || "{}".includes(str[right(str, i)]))
        )) ||
      //
      // 2. html-like syntax - Responsys RPL and similar
      // <#if z> or </#if> and so on

      // normal opening tag
      (str[i] === "<" &&
        // and
        // either it's closing tag and what follows is ESP-char
        ((str[i + 1] === "/" && espChars.includes(str[i + 2])) ||
          // or
          // it's not closing and esp char follows right away
          espChars.includes(str[i + 1]))) ||
      //
      // 3. single character tails, for example RPL's closing curlies: ${zzz}
      // it's specifically a closing-kind character
      (`>})`.includes(str[i]) &&
        // heads include the opposite of it
        Array.isArray(layers) &&
        layers.length &&
        layers[layers.length - 1].type === "esp" &&
        layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) &&
        // insurance against "greater than", as in:
        // <#if product.weight > 100>
        (str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<")))
    }`
  );
  return (
    // 1. two consecutive esp characters - Liquid, Mailchimp etc.
    // {{ or |* and so on
    (espChars.includes(str[i]) &&
      str[i + 1] &&
      espChars.includes(str[i + 1]) &&
      token.type !== "rule" &&
      token.type !== "at" &&
      !(str[i] === "-" && "-{(".includes(str[i + 1])) &&
      !("})".includes(str[i]) && "-".includes(str[i + 1])) &&
      !(
        // insurance against repeated percentages
        (
          str[i] === "%" &&
          "0123456789".includes(str[left(str, i)]) &&
          (!str[i + 2] ||
            [`"`, `'`, ";"].includes(str[i + 2]) ||
            !str[i + 2].trim().length)
        )
      ) &&
      !(
        styleStarts &&
        ("{}".includes(str[i]) || "{}".includes(str[right(str, i)]))
      )) ||
    //
    // 2. html-like syntax - Responsys RPL and similar
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
    //
    // 3. single character tails, for example RPL's closing curlies: ${zzz}
    // it's specifically a closing-kind character
    (`>})`.includes(str[i]) &&
      // heads include the opposite of it
      Array.isArray(layers) &&
      layers.length &&
      layers[layers.length - 1].type === "esp" &&
      layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) &&
      // insurance against "greater than", as in:
      // <#if product.weight > 100>
      (str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<")))
  );
}

export default startsEsp;
