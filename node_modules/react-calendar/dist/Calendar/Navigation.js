"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Navigation;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dates = require("../shared/dates");

var _dateFormatter = require("../shared/dateFormatter");

var _propTypes2 = require("../shared/propTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var className = 'react-calendar__navigation';

function Navigation(_ref) {
  var date = _ref.activeStartDate,
      drillUp = _ref.drillUp,
      formatMonthYear = _ref.formatMonthYear,
      locale = _ref.locale,
      maxDate = _ref.maxDate,
      minDate = _ref.minDate,
      navigationAriaLabel = _ref.navigationAriaLabel,
      navigationLabel = _ref.navigationLabel,
      next2AriaLabel = _ref.next2AriaLabel,
      next2Label = _ref.next2Label,
      nextAriaLabel = _ref.nextAriaLabel,
      nextLabel = _ref.nextLabel,
      prev2AriaLabel = _ref.prev2AriaLabel,
      prev2Label = _ref.prev2Label,
      prevAriaLabel = _ref.prevAriaLabel,
      prevLabel = _ref.prevLabel,
      setActiveStartDate = _ref.setActiveStartDate,
      view = _ref.view,
      views = _ref.views;
  var drillUpAvailable = views.indexOf(view) > 0;
  var shouldShowPrevNext2Buttons = view !== 'century';
  var previousActiveStartDate = (0, _dates.getBeginPrevious)(view, date);
  var previousActiveStartDate2 = shouldShowPrevNext2Buttons && (0, _dates.getBeginPrevious2)(view, date);
  var nextActiveStartDate = (0, _dates.getBeginNext)(view, date);
  var nextActiveStartDate2 = shouldShowPrevNext2Buttons && (0, _dates.getBeginNext2)(view, date);

  var prevButtonDisabled = function () {
    if (previousActiveStartDate.getFullYear() < 1000) {
      return true;
    }

    var previousActiveEndDate = (0, _dates.getEndPrevious)(view, date);
    return minDate && minDate >= previousActiveEndDate;
  }();

  var prev2ButtonDisabled = shouldShowPrevNext2Buttons && function () {
    if (previousActiveStartDate2.getFullYear() < 1000) {
      return true;
    }

    var previousActiveEndDate = (0, _dates.getEndPrevious2)(view, date);
    return minDate && minDate >= previousActiveEndDate;
  }();

  var nextButtonDisabled = maxDate && maxDate <= nextActiveStartDate;
  var next2ButtonDisabled = shouldShowPrevNext2Buttons && maxDate && maxDate <= nextActiveStartDate2;

  function onClickPrevious() {
    setActiveStartDate(previousActiveStartDate);
  }

  function onClickPrevious2() {
    setActiveStartDate(previousActiveStartDate2);
  }

  function onClickNext() {
    setActiveStartDate(nextActiveStartDate);
  }

  function onClickNext2() {
    setActiveStartDate(nextActiveStartDate2);
  }

  var label = function () {
    switch (view) {
      case 'century':
        return (0, _dates.getCenturyLabel)(date);

      case 'decade':
        return (0, _dates.getDecadeLabel)(date);

      case 'year':
        return (0, _dates.getYear)(date);

      case 'month':
        return formatMonthYear(locale, date);

      default:
        throw new Error("Invalid view: ".concat(view, "."));
    }
  }();

  return _react["default"].createElement("div", {
    className: className,
    style: {
      display: 'flex'
    }
  }, prev2Label !== null && shouldShowPrevNext2Buttons && _react["default"].createElement("button", {
    "aria-label": prev2AriaLabel,
    className: "".concat(className, "__arrow ").concat(className, "__prev2-button"),
    disabled: prev2ButtonDisabled,
    onClick: onClickPrevious2,
    type: "button"
  }, prev2Label), _react["default"].createElement("button", {
    "aria-label": prevAriaLabel,
    className: "".concat(className, "__arrow ").concat(className, "__prev-button"),
    disabled: prevButtonDisabled,
    onClick: onClickPrevious,
    type: "button"
  }, prevLabel), _react["default"].createElement("button", {
    "aria-label": navigationAriaLabel,
    className: "react-calendar__navigation__label",
    disabled: !drillUpAvailable,
    onClick: drillUp,
    style: {
      flexGrow: 1
    },
    type: "button"
  }, navigationLabel ? navigationLabel({
    date: date,
    view: view,
    label: label
  }) : label), _react["default"].createElement("button", {
    "aria-label": nextAriaLabel,
    className: "".concat(className, "__arrow ").concat(className, "__next-button"),
    disabled: nextButtonDisabled,
    onClick: onClickNext,
    type: "button"
  }, nextLabel), next2Label !== null && shouldShowPrevNext2Buttons && _react["default"].createElement("button", {
    "aria-label": next2AriaLabel,
    className: "".concat(className, "__arrow ").concat(className, "__next2-button"),
    disabled: next2ButtonDisabled,
    onClick: onClickNext2,
    type: "button"
  }, next2Label));
}

Navigation.defaultProps = {
  formatMonthYear: _dateFormatter.formatMonthYear,
  navigationAriaLabel: '',
  next2AriaLabel: '',
  next2Label: '»',
  nextAriaLabel: '',
  nextLabel: '›',
  prev2AriaLabel: '',
  prev2Label: '«',
  prevAriaLabel: '',
  prevLabel: '‹'
};
Navigation.propTypes = {
  activeStartDate: _propTypes["default"].instanceOf(Date).isRequired,
  drillUp: _propTypes["default"].func.isRequired,
  formatMonthYear: _propTypes["default"].func,
  locale: _propTypes["default"].string,
  maxDate: _propTypes["default"].instanceOf(Date),
  minDate: _propTypes["default"].instanceOf(Date),
  navigationAriaLabel: _propTypes["default"].string,
  navigationLabel: _propTypes["default"].func,
  next2AriaLabel: _propTypes["default"].string,
  next2Label: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),
  nextAriaLabel: _propTypes["default"].string,
  nextLabel: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),
  prev2AriaLabel: _propTypes["default"].string,
  prev2Label: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),
  prevAriaLabel: _propTypes["default"].string,
  prevLabel: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].node]),
  setActiveStartDate: _propTypes["default"].func.isRequired,
  view: _propTypes2.isView.isRequired,
  views: _propTypes2.isViews.isRequired
};