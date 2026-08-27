import { isLangCode } from "is-language-code";

declare const unknownInput: unknown;

const results = [
  isLangCode("sr-Latn"),
  isLangCode(),
  isLangCode(undefined),
  isLangCode(null),
  isLangCode(123),
  isLangCode(unknownInput),
];

for (const result of results) {
  if (result.res) {
    const message: null = result.message;
    void message;
  } else {
    const message: string = result.message;
    void message;
  }
}
