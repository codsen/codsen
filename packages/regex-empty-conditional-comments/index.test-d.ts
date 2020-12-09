import { expectType } from "tsd";
import emptyCondCommentRegex = require(".");

expectType<RegExp>(emptyCondCommentRegex());
