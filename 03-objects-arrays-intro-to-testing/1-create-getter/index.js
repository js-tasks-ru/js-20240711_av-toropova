/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const properties = path.split('.');

  function getter(obj, index = 0) {
    if (index >= properties.length) {
      return obj;
    }

    const currentProperty = properties[index];

    if (!obj.hasOwnProperty(currentProperty)) {
      return;
    }

    return getter(obj[currentProperty], index + 1);
  }

  return getter;
}
