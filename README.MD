This was just an exercise to create a function that would be able to slice strings containing ansi characters. The idea is that the function will not change any ansi characters in the string operating only on "regular" characters, so basically the function should return the same text as string `slice` method would if called with the same `start` & `end` arguments and string, but without ansi characters.

# sliceAnsi(str[, start[, end])

- `str` [string] - string to be sliced
- `start` [number] - optional starting index for slicing, default: `0`.
- `end` [number] - optional end index for slicing, default: `str.length`.

Returns a `string`

`start` and `end` arguments are **not** actual indexes of the whole string. They are meant to be indexes of non-ansi part of the string.

Example:

```js
import chalk from "chalk";
import sliceAnsi from ".";

const plainString = "what a horrible day!";
const stringWithAnsi = chalk.red(plainString);

console.log(plainString);
console.log(stringWithAnsi);

console.log(plainString.slice(2, 12));
console.log(sliceAnsi(stringWithAnsi, 2, 12));
```
