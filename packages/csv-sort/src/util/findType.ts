function isNumeric(str: string): boolean {
  // if (typeof str === "number") {
  //   return true;
  // }
  // if (!String(str).trim()) {
  if (!str.trim()) {
    return false;
  }
  return Number(str) === Number(str);
}

const currencySigns = [
  "د.إ",
  "؋",
  "L",
  "֏",
  "ƒ",
  "Kz",
  "$",
  "ƒ",
  "₼",
  "KM",
  "৳",
  "лв",
  ".د.ب",
  "FBu",
  "$b",
  "R$",
  "฿",
  "Nu.",
  "P",
  "p.",
  "BZ$",
  "FC",
  "CHF",
  "¥",
  "₡",
  "₱",
  "Kč",
  "Fdj",
  "kr",
  "RD$",
  "دج",
  "kr",
  "Nfk",
  "Br",
  "Ξ",
  "€",
  "₾",
  "₵",
  "GH₵",
  "D",
  "FG",
  "Q",
  "L",
  "kn",
  "G",
  "Ft",
  "Rp",
  "₪",
  "₹",
  "ع.د",
  "﷼",
  "kr",
  "J$",
  "JD",
  "¥",
  "KSh",
  "лв",
  "៛",
  "CF",
  "₩",
  "₩",
  "KD",
  "лв",
  "₭",
  "₨",
  "M",
  "Ł",
  "Lt",
  "Ls",
  "LD",
  "MAD",
  "lei",
  "Ar",
  "ден",
  "K",
  "₮",
  "MOP$",
  "UM",
  "₨",
  "Rf",
  "MK",
  "RM",
  "MT",
  "₦",
  "C$",
  "kr",
  "₨",
  "﷼",
  "B/.",
  "S/.",
  "K",
  "₱",
  "₨",
  "zł",
  "Gs",
  "﷼",
  "￥",
  "lei",
  "Дин.",
  "₽",
  "R₣",
  "﷼",
  "₨",
  "ج.س.",
  "kr",
  "£",
  "Le",
  "S",
  "Db",
  "E",
  "฿",
  "SM",
  "T",
  "د.ت",
  "T$",
  "₤",
  "₺",
  "TT$",
  "NT$",
  "TSh",
  "₴",
  "USh",
  "$U",
  "лв",
  "Bs",
  "₫",
  "VT",
  "WS$",
  "FCFA",
  "Ƀ",
  "CFA",
  "₣",
  "﷼",
  "R",
  "Z$",
];

function findType(something: string): string {
  /* istanbul ignore next */
  if (typeof something !== "string") {
    throw new Error(
      `csv-sort/util/findType(): input must be string! Currently it's: ${typeof something}`
    );
  }
  if (isNumeric(something)) {
    return "numeric";
  }
  /* istanbul ignore next */
  if (
    currencySigns.some((singleSign) =>
      // We remove all known currency symbols one by one from this input string.
      // If at least one passes as numeric after the currency symbol-removing, it's numeric.
      isNumeric(something.replace(singleSign, "").replace(/[,.]/g, ""))
    )
  ) {
    return "numeric";
  }
  if (!something.trim()) {
    return "empty";
  }
  return "text";
}

export default findType;
