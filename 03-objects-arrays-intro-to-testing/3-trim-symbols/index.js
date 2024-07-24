/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size == undefined) return string;
  //if (size == 0) return "";
  let result = '';
  let currentChar = '';
  let currentCount = 0;

  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (char === currentChar) {
      currentCount++;
    } else {
      currentChar = char;
      currentCount = 1;
    }
    if (currentCount <= size) {
      result += char;
    }
  }
  return result;
}
