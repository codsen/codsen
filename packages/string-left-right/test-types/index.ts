import {
  leftStopAtNewLines,
  leftStopAtRawNbsp,
  rightStopAtNewLines,
  rightStopAtRawNbsp,
} from "string-left-right";

rightStopAtNewLines("ab");
rightStopAtNewLines("ab", 0);
rightStopAtNewLines("ab", null);
rightStopAtNewLines("ab", undefined);

rightStopAtRawNbsp("ab");
rightStopAtRawNbsp("ab", 0);
rightStopAtRawNbsp("ab", null);
rightStopAtRawNbsp("ab", undefined);

leftStopAtNewLines("ab");
leftStopAtNewLines("ab", 1);
leftStopAtNewLines("ab", null);
leftStopAtNewLines("ab", undefined);

leftStopAtRawNbsp("ab");
leftStopAtRawNbsp("ab", 1);
leftStopAtRawNbsp("ab", null);
leftStopAtRawNbsp("ab", undefined);
