"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getUserLocale = exports.getUserLocales = void 0;

var _lodash = _interopRequireDefault(require("lodash.once"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function filterDuplicates(arr) {
  return arr.filter(function (el, index, self) {
    return self.indexOf(el) === index;
  });
}

function fixLowercaseProperties(arr) {
  return arr.map(function (el) {
    if (!el || el.indexOf('-') === -1 || el.toLowerCase() !== el) {
      return el;
    }

    var splitEl = el.split('-');
    return "".concat(splitEl[0], "-").concat(splitEl[1].toUpperCase());
  });
}

function getUserLocalesInternal() {
  var languageList = [];

  if (typeof window !== 'undefined') {
    if (window.navigator.languages) {
      languageList = languageList.concat(window.navigator.languages);
    }

    if (window.navigator.language) {
      languageList.push(window.navigator.language);
    }

    if (window.navigator.userLanguage) {
      languageList.push(window.navigator.userLanguage);
    }

    if (window.navigator.browserLanguage) {
      languageList.push(window.navigator.browserLanguage);
    }

    if (window.navigator.systemLanguage) {
      languageList.push(window.navigator.systemLanguage);
    }
  }

  languageList.push('en-US'); // Fallback

  return fixLowercaseProperties(filterDuplicates(languageList));
}

var getUserLocales = (0, _lodash["default"])(getUserLocalesInternal);
exports.getUserLocales = getUserLocales;

function getUserLocaleInternal() {
  return getUserLocales()[0];
}

var getUserLocale = (0, _lodash["default"])(getUserLocaleInternal);
exports.getUserLocale = getUserLocale;
var _default = getUserLocale;
exports["default"] = _default;