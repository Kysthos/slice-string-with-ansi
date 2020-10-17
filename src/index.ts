import ansiRegex from "ansi-regex";
import stripAnsi from "strip-ansi";

/**
 * Slices strings containing ansi characters.
 * Only the non-ansi text is taken into account,
 * so it's supposed to work the same as the string `slice` method
 * if used on a same text, but without ansi characters.
 * @param str String to slice.
 * @param start Start index, default: 0.
 * @param end End index, if not provided, length of the string is assumed.
 */
const sliceAnsi = (str: string, start: number = 0, end?: number) => {
  if (typeof str !== "string")
    throw new TypeError("First argument should be a string.");

  // store array of ansi character matches in the string
  const ansiMatches = str.match(ansiRegex());
  // if there's no matches, that means we can pass the string to the slice method
  // the same goes if we have start 0, and no end
  if (!ansiMatches || (start === 0 && end === void 0))
    return str.slice(start, end);

  // if end was not provided, just assign to it length of the string
  // here, it doesn't really matter if we use the length of the whole string
  // with ansi chars or only the length of non-ansi characters
  if (end === void 0) end = str.length;

  // if non-integer arguments were passed, truncate them to integers
  if (!Number.isInteger(start)) start = Math.trunc(start);
  if (!Number.isInteger(end)) end = Math.trunc(end);

  // if negative indexes were passed, convert them to regular indexes
  if (start < 0 || end < 0) {
    // we need to calculate the indexes relative to the non-ansi only
    const plainLen = stripAnsi(str).length;
    if (start < 0) start = plainLen + start;
    // I had to add once again the check for end
    // because typescript didn't know that end can't be undefined here
    if (end < 0) end = plainLen + end;
  }

  /** current index of the plain text */
  let plainTextIndex = 0;
  /** stores new sliced string */
  let sliced = "";
  /** current index of the whole string where we are at */
  let currIndex = 0;

  // iterate over all the instances of ansi chars in the string
  for (const match of ansiMatches) {
    // if we know, we don't need any more plain text
    // just add the ansi text and move on
    if (plainTextIndex >= end) {
      sliced += match;
      continue;
    }
    // find starting index of the current ansi string
    const index = str.indexOf(match, currIndex);
    // if there is some text before the ansi string, let's process it
    if (currIndex < index) {
      // let's loop through all the characters before the ansi string
      for (let stringIndex = currIndex; stringIndex < index; stringIndex++) {
        // if given character is within the desired index range, add it to the sliced string
        if (start <= plainTextIndex && plainTextIndex < end)
          sliced += str[stringIndex];
        plainTextIndex++;
      }
    }
    // add the ansi string to the sliced string
    sliced += match;
    // update current index of the file where we at
    currIndex = index + match.length;
  }

  return sliced;
};

export default sliceAnsi;
