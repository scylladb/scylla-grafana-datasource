"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tileProps = exports.tileGroupProps = exports.isView = exports.isClassName = exports.isViews = exports.isValue = exports.isMaxDate = exports.isMinDate = exports.isCalendarType = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var calendarTypes = ['ISO 8601', 'US', 'Arabic', 'Hebrew'];
var allViews = ['century', 'decade', 'year', 'month'];

var isCalendarType = _propTypes["default"].oneOf(calendarTypes);

exports.isCalendarType = isCalendarType;

var isMinDate = function isMinDate(props, propName, componentName) {
  var minDate = props[propName];

  if (minDate) {
    if (!(minDate instanceof Date)) {
      return new Error("Invalid prop `".concat(propName, "` of type `").concat(_typeof(minDate), "` supplied to `").concat(componentName, "`, expected instance of `Date`."));
    }

    var maxDate = props.maxDate;

    if (maxDate && minDate > maxDate) {
      return new Error("Invalid prop `".concat(propName, "` of type `").concat(_typeof(minDate), "` supplied to `").concat(componentName, "`, minDate cannot be larger than maxDate."));
    }
  } // Everything is fine


  return null;
};

exports.isMinDate = isMinDate;

var isMaxDate = function isMaxDate(props, propName, componentName) {
  var maxDate = props[propName];

  if (maxDate) {
    if (!(maxDate instanceof Date)) {
      return new Error("Invalid prop `".concat(propName, "` of type `").concat(_typeof(maxDate), "` supplied to `").concat(componentName, "`, expected instance of `Date`."));
    }

    var minDate = props.minDate;

    if (minDate && maxDate < minDate) {
      return new Error("Invalid prop `".concat(propName, "` of type `").concat(_typeof(maxDate), "` supplied to `").concat(componentName, "`, maxDate cannot be smaller than minDate."));
    }
  } // Everything is fine


  return null;
};

exports.isMaxDate = isMaxDate;

var isValue = _propTypes["default"].oneOfType([_propTypes["default"].instanceOf(Date), _propTypes["default"].arrayOf(_propTypes["default"].instanceOf(Date))]);

exports.isValue = isValue;

var isViews = _propTypes["default"].arrayOf(_propTypes["default"].oneOf(allViews));

exports.isViews = isViews;

var isClassName = _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string)]);

exports.isClassName = isClassName;

var isView = function isView(props, propName, componentName) {
  var view = props[propName];
  var views = props.views;
  var allowedViews = views || allViews;

  if (view !== undefined && allowedViews.indexOf(view) === -1) {
    return new Error("Invalid prop `".concat(propName, "` of value `").concat(view, "` supplied to `").concat(componentName, "`, expected one of [").concat(allowedViews.map(function (a) {
      return "\"".concat(a, "\"");
    }).join(', '), "]."));
  } // Everything is fine


  return null;
};

exports.isView = isView;

isView.isRequired = function (props, propName, componentName) {
  var view = props[propName];

  if (!view) {
    return new Error("The prop `".concat(propName, "` is marked as required in `").concat(componentName, "`, but its value is `").concat(view, "`."));
  }

  return isView(props, propName, componentName);
};

var tileGroupProps = {
  activeStartDate: _propTypes["default"].instanceOf(Date).isRequired,
  hover: _propTypes["default"].instanceOf(Date),
  locale: _propTypes["default"].string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onClick: _propTypes["default"].func,
  onMouseOver: _propTypes["default"].func,
  tileClassName: _propTypes["default"].oneOfType([_propTypes["default"].func, isClassName]),
  tileContent: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].node]),
  value: isValue,
  valueType: _propTypes["default"].string
};
exports.tileGroupProps = tileGroupProps;
var tileProps = {
  activeStartDate: _propTypes["default"].instanceOf(Date).isRequired,
  classes: _propTypes["default"].arrayOf(_propTypes["default"].string).isRequired,
  date: _propTypes["default"].instanceOf(Date).isRequired,
  locale: _propTypes["default"].string,
  maxDate: isMaxDate,
  minDate: isMinDate,
  onClick: _propTypes["default"].func,
  onMouseOver: _propTypes["default"].func,
  style: _propTypes["default"].objectOf(_propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])),
  tileClassName: _propTypes["default"].oneOfType([_propTypes["default"].func, isClassName]),
  tileContent: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].node]),
  tileDisabled: _propTypes["default"].func
};
exports.tileProps = tileProps;