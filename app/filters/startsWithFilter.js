function stringStartsWith(string, prefix) {
  return string.toLowerCase().slice(0, prefix.length) == prefix.toLowerCase();
}

module.exports = function () {
  return function(items, letters) {
    if (letters === null) return false;
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (stringStartsWith(item.word, letters)) filtered.push(item);
    }
    return filtered;
  };
};
