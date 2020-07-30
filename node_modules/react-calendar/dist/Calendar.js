"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var _mergeClassNames = _interopRequireDefault(require("merge-class-names"));

var _Navigation = _interopRequireDefault(require("./Calendar/Navigation"));

var _CenturyView = _interopRequireDefault(require("./CenturyView"));

var _DecadeView = _interopRequireDefault(require("./DecadeView"));

var _YearView = _interopRequireDefault(require("./YearView"));

var _MonthView = _interopRequireDefault(require("./MonthView"));

var _dates = require("./shared/dates");

var _propTypes2 = require("./shared/propTypes");

var _utils = require("./shared/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var baseClassName = 'react-calendar';
var allViews = ['century', 'decade', 'year', 'month'];
var allValueTypes = [].concat(_toConsumableArray(allViews.slice(1)), ['day']);

var datesAreDifferent = function datesAreDifferent(date1, date2) {
  return date1 && !date2 || !date1 && date2 || date1 && date2 && date1.getTime() !== date2.getTime();
};
/**
 * Returns views array with disallowed values cut off.
 */


var getLimitedViews = function getLimitedViews(minDetail, maxDetail) {
  return allViews.slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);
};
/**
 * Determines whether a given view is allowed with currently applied settings.
 */


var isViewAllowed = function isViewAllowed(view, minDetail, maxDetail) {
  var views = getLimitedViews(minDetail, maxDetail);
  return views.indexOf(view) !== -1;
};
/**
 * Gets either provided view if allowed by minDetail and maxDetail, or gets
 * the default view if not allowed.
 */


var getView = function getView(view, minDetail, maxDetail) {
  if (isViewAllowed(view, minDetail, maxDetail)) {
    return view;
  }

  return getLimitedViews(minDetail, maxDetail).pop();
};
/**
 * Returns value type that can be returned with currently applied settings.
 */


var getValueType = function getValueType(maxDetail) {
  return allValueTypes[allViews.indexOf(maxDetail)];
};

var getValueFrom = function getValueFrom(value) {
  if (!value) {
    return null;
  }

  var rawValueFrom = value instanceof Array && value.length === 2 ? value[0] : value;

  if (!rawValueFrom) {
    return null;
  }

  var valueFromDate = new Date(rawValueFrom);

  if (isNaN(valueFromDate.getTime())) {
    throw new Error("Invalid date: ".concat(value));
  }

  return valueFromDate;
};

var getDetailValueFrom = function getDetailValueFrom(value, minDate, maxDate, maxDetail) {
  var valueFrom = getValueFrom(value);

  if (!valueFrom) {
    return null;
  }

  var detailValueFrom = (0, _dates.getBegin)(getValueType(maxDetail), valueFrom);
  return (0, _utils.between)(detailValueFrom, minDate, maxDate);
};

var getValueTo = function getValueTo(value) {
  if (!value) {
    return null;
  }

  var rawValueTo = value instanceof Array && value.length === 2 ? value[1] : value;

  if (!rawValueTo) {
    return null;
  }

  var valueToDate = new Date(rawValueTo);

  if (isNaN(valueToDate.getTime())) {
    throw new Error("Invalid date: ".concat(value));
  }

  return valueToDate;
};

var getDetailValueTo = function getDetailValueTo(value, minDate, maxDate, maxDetail) {
  var valueTo = getValueTo(value);

  if (!valueTo) {
    return null;
  }

  var detailValueTo = (0, _dates.getEnd)(getValueType(maxDetail), valueTo);
  return (0, _utils.between)(detailValueTo, minDate, maxDate);
};

var getDetailValueArray = function getDetailValueArray(value, minDate, maxDate, maxDetail) {
  if (value instanceof Array) {
    return value;
  }

  return [getDetailValueFrom(value, minDate, maxDate, maxDetail), getDetailValueTo(value, minDate, maxDate, maxDetail)];
};

var getActiveStartDate = function getActiveStartDate(props) {
  var activeStartDate = props.activeStartDate,
      maxDate = props.maxDate,
      maxDetail = props.maxDetail,
      minDate = props.minDate,
      minDetail = props.minDetail,
      value = props.value,
      view = props.view;
  var rangeType = getView(view, minDetail, maxDetail);
  var valueFrom = getDetailValueFrom(value, minDate, maxDate, maxDetail) || activeStartDate || new Date();
  return (0, _dates.getBegin)(rangeType, valueFrom);
};

var Calendar =
/*#__PURE__*/
function (_Component) {
  _inherits(Calendar, _Component);

  function Calendar() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Calendar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Calendar)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {});

    _defineProperty(_assertThisInitialized(_this), "setActiveStartDate", function (activeStartDate) {
      var onActiveDateChange = _this.props.onActiveDateChange;

      _this.setState({
        activeStartDate: activeStartDate
      }, function () {
        var view = _this.state.view;
        (0, _utils.callIfDefined)(onActiveDateChange, {
          activeStartDate: activeStartDate,
          view: view
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "drillDown", function (activeStartDate) {
      if (!_this.drillDownAvailable) {
        return;
      }

      var _this$props = _this.props,
          maxDetail = _this$props.maxDetail,
          minDetail = _this$props.minDetail,
          onDrillDown = _this$props.onDrillDown;
      var views = getLimitedViews(minDetail, maxDetail);

      _this.setState(function (prevState) {
        var nextView = views[views.indexOf(prevState.view) + 1];
        return {
          activeStartDate: activeStartDate,
          view: nextView
        };
      }, function () {
        var view = _this.state.view;
        (0, _utils.callIfDefined)(onDrillDown, {
          activeStartDate: activeStartDate,
          view: view
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "drillUp", function () {
      if (!_this.drillUpAvailable) {
        return;
      }

      var _this$props2 = _this.props,
          maxDetail = _this$props2.maxDetail,
          minDetail = _this$props2.minDetail,
          onDrillUp = _this$props2.onDrillUp;
      var views = getLimitedViews(minDetail, maxDetail);

      _this.setState(function (prevState) {
        var nextView = views[views.indexOf(prevState.view) - 1];
        var activeStartDate = (0, _dates.getBegin)(nextView, prevState.activeStartDate);
        return {
          activeStartDate: activeStartDate,
          view: nextView
        };
      }, function () {
        var _this$state = _this.state,
            activeStartDate = _this$state.activeStartDate,
            view = _this$state.view;
        (0, _utils.callIfDefined)(onDrillUp, {
          activeStartDate: activeStartDate,
          view: view
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onChange", function (value) {
      var _this$props3 = _this.props,
          onChange = _this$props3.onChange,
          selectRange = _this$props3.selectRange;
      var nextValue;
      var callback;

      if (selectRange) {
        var previousValue = _this.state.value; // Range selection turned on

        if (!previousValue || [].concat(previousValue).length !== 1 // 0 or 2 - either way we're starting a new array
        ) {
            // First value
            nextValue = (0, _dates.getBegin)(_this.valueType, value);
          } else {
          // Second value
          nextValue = (0, _dates.getValueRange)(_this.valueType, previousValue, value);

          callback = function callback() {
            return (0, _utils.callIfDefined)(onChange, nextValue);
          };
        }
      } else {
        // Range selection turned off
        nextValue = _this.getProcessedValue(value);

        callback = function callback() {
          return (0, _utils.callIfDefined)(onChange, nextValue);
        };
      }

      _this.setState({
        value: nextValue
      }, callback);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseOver", function (value) {
      _this.setState(function (prevState) {
        if (prevState.hover && prevState.hover.getTime() === value.getTime()) {
          return null;
        }

        return {
          hover: value
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseLeave", function () {
      _this.setState({
        hover: null
      });
    });

    return _this;
  }

  _createClass(Calendar, [{
    key: "getProcessedValue",

    /**
     * Gets current value in a desired format.
     */
    value: function getProcessedValue(value) {
      var _this$props4 = this.props,
          minDate = _this$props4.minDate,
          maxDate = _this$props4.maxDate,
          maxDetail = _this$props4.maxDetail,
          returnValue = _this$props4.returnValue;

      var processFunction = function () {
        switch (returnValue) {
          case 'start':
            return getDetailValueFrom;

          case 'end':
            return getDetailValueTo;

          case 'range':
            return getDetailValueArray;

          default:
            throw new Error('Invalid returnValue.');
        }
      }();

      return processFunction(value, minDate, maxDate, maxDetail);
    }
    /**
     * Called when the user uses navigation buttons.
     */

  }, {
    key: "renderContent",
    value: function renderContent() {
      var _this$props5 = this.props,
          calendarType = _this$props5.calendarType,
          locale = _this$props5.locale,
          maxDate = _this$props5.maxDate,
          minDate = _this$props5.minDate,
          renderChildren = _this$props5.renderChildren,
          selectRange = _this$props5.selectRange,
          tileClassName = _this$props5.tileClassName,
          tileContent = _this$props5.tileContent,
          tileDisabled = _this$props5.tileDisabled;
      var _this$state2 = this.state,
          activeStartDate = _this$state2.activeStartDate,
          hover = _this$state2.hover,
          value = _this$state2.value,
          view = _this$state2.view;
      var onMouseOver = this.onMouseOver,
          valueType = this.valueType;
      var commonProps = {
        activeStartDate: activeStartDate,
        hover: hover,
        locale: locale,
        maxDate: maxDate,
        minDate: minDate,
        onMouseOver: selectRange ? onMouseOver : null,
        tileClassName: tileClassName,
        tileContent: tileContent || renderChildren,
        // For backwards compatibility
        tileDisabled: tileDisabled,
        value: value,
        valueType: valueType
      };
      var clickAction = this.drillDownAvailable ? this.drillDown : this.onChange;

      switch (view) {
        case 'century':
          {
            var onClickDecade = this.props.onClickDecade;
            return _react["default"].createElement(_CenturyView["default"], _extends({
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickDecade)
            }, commonProps));
          }

        case 'decade':
          {
            var onClickYear = this.props.onClickYear;
            return _react["default"].createElement(_DecadeView["default"], _extends({
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickYear)
            }, commonProps));
          }

        case 'year':
          {
            var _this$props6 = this.props,
                formatMonth = _this$props6.formatMonth,
                onClickMonth = _this$props6.onClickMonth;
            return _react["default"].createElement(_YearView["default"], _extends({
              formatMonth: formatMonth,
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickMonth)
            }, commonProps));
          }

        case 'month':
          {
            var _this$props7 = this.props,
                formatShortWeekday = _this$props7.formatShortWeekday,
                onClickDay = _this$props7.onClickDay,
                onClickWeekNumber = _this$props7.onClickWeekNumber,
                showFixedNumberOfWeeks = _this$props7.showFixedNumberOfWeeks,
                showNeighboringMonth = _this$props7.showNeighboringMonth,
                showWeekNumbers = _this$props7.showWeekNumbers;
            var onMouseLeave = this.onMouseLeave;
            return _react["default"].createElement(_MonthView["default"], _extends({
              calendarType: calendarType,
              formatShortWeekday: formatShortWeekday,
              onClick: (0, _utils.mergeFunctions)(clickAction, onClickDay),
              onClickWeekNumber: onClickWeekNumber,
              onMouseLeave: onMouseLeave,
              showFixedNumberOfWeeks: showFixedNumberOfWeeks,
              showNeighboringMonth: showNeighboringMonth,
              showWeekNumbers: showWeekNumbers
            }, commonProps));
          }

        default:
          throw new Error("Invalid view: ".concat(view, "."));
      }
    }
  }, {
    key: "renderNavigation",
    value: function renderNavigation() {
      var showNavigation = this.props.showNavigation;

      if (!showNavigation) {
        return null;
      }

      var _this$props8 = this.props,
          formatMonthYear = _this$props8.formatMonthYear,
          locale = _this$props8.locale,
          maxDate = _this$props8.maxDate,
          maxDetail = _this$props8.maxDetail,
          minDate = _this$props8.minDate,
          minDetail = _this$props8.minDetail,
          navigationAriaLabel = _this$props8.navigationAriaLabel,
          navigationLabel = _this$props8.navigationLabel,
          next2AriaLabel = _this$props8.next2AriaLabel,
          next2Label = _this$props8.next2Label,
          nextAriaLabel = _this$props8.nextAriaLabel,
          nextLabel = _this$props8.nextLabel,
          prev2AriaLabel = _this$props8.prev2AriaLabel,
          prev2Label = _this$props8.prev2Label,
          prevAriaLabel = _this$props8.prevAriaLabel,
          prevLabel = _this$props8.prevLabel;
      var _this$state3 = this.state,
          activeStartDate = _this$state3.activeStartDate,
          view = _this$state3.view;
      return _react["default"].createElement(_Navigation["default"], {
        activeStartDate: activeStartDate,
        drillUp: this.drillUp,
        formatMonthYear: formatMonthYear,
        locale: locale,
        maxDate: maxDate,
        minDate: minDate,
        navigationAriaLabel: navigationAriaLabel,
        navigationLabel: navigationLabel,
        next2AriaLabel: next2AriaLabel,
        next2Label: next2Label,
        nextAriaLabel: nextAriaLabel,
        nextLabel: nextLabel,
        prev2AriaLabel: prev2AriaLabel,
        prev2Label: prev2Label,
        prevAriaLabel: prevAriaLabel,
        prevLabel: prevLabel,
        setActiveStartDate: this.setActiveStartDate,
        view: view,
        views: getLimitedViews(minDetail, maxDetail)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props9 = this.props,
          className = _this$props9.className,
          selectRange = _this$props9.selectRange;
      var value = this.state.value;
      var onMouseLeave = this.onMouseLeave;
      var valueArray = [].concat(value);
      return _react["default"].createElement("div", {
        className: (0, _mergeClassNames["default"])(baseClassName, selectRange && valueArray.length === 1 && "".concat(baseClassName, "--selectRange"), className)
      }, this.renderNavigation(), _react["default"].createElement("div", {
        className: "".concat(baseClassName, "__viewContainer"),
        onBlur: selectRange ? onMouseLeave : null,
        onMouseLeave: selectRange ? onMouseLeave : null
      }, this.renderContent()));
    }
  }, {
    key: "drillDownAvailable",
    get: function get() {
      var _this$props10 = this.props,
          maxDetail = _this$props10.maxDetail,
          minDetail = _this$props10.minDetail;
      var view = this.state.view;
      var views = getLimitedViews(minDetail, maxDetail);
      return views.indexOf(view) < views.length - 1;
    }
  }, {
    key: "drillUpAvailable",
    get: function get() {
      var _this$props11 = this.props,
          maxDetail = _this$props11.maxDetail,
          minDetail = _this$props11.minDetail;
      var view = this.state.view;
      var views = getLimitedViews(minDetail, maxDetail);
      return views.indexOf(view) > 0;
    }
  }, {
    key: "valueType",
    get: function get() {
      var maxDetail = this.props.maxDetail;
      return getValueType(maxDetail);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var minDate = nextProps.minDate,
          maxDate = nextProps.maxDate,
          minDetail = nextProps.minDetail,
          maxDetail = nextProps.maxDetail;
      var nextState = {};
      /**
       * If the next activeStartDate is different from the current one, update
       * activeStartDate (for display) and activeStartDateProps (for future comparisons)
       */

      var nextActiveStartDate = getActiveStartDate(nextProps);

      if (datesAreDifferent(nextActiveStartDate, prevState.activeStartDateProps)) {
        nextState.activeStartDate = nextActiveStartDate;
        nextState.activeStartDateProps = nextActiveStartDate;
      }
      /**
       * If the next view is different from the current one, and the previously set view is not
       * valid based on minDetail and maxDetail, get a new one.
       */


      var nextView = getView(nextProps.view, minDetail, maxDetail);

      if (nextView !== prevState.viewProps && !isViewAllowed(prevState.view, minDetail, maxDetail)) {
        nextState.view = nextView;
        nextState.viewProps = nextView;
      }
      /**
       * If the next value is different from the current one (with an exception of situation in
       * which values provided are limited by minDate and maxDate so that the dates are the same),
       * get a new one.
       */


      var values = [nextProps.value, prevState.valueProps];

      if (nextState.view // Allowed view changed
      || datesAreDifferent.apply(void 0, _toConsumableArray(values.map(function (value) {
        return getValueFrom(value, minDate, maxDate, maxDetail);
      }))) || datesAreDifferent.apply(void 0, _toConsumableArray(values.map(function (value) {
        return getValueTo(value, minDate, maxDate, maxDetail);
      })))) {
        nextState.value = nextProps.value;
        nextState.valueProps = nextProps.value;
      }

      if (!nextProps.selectRange && prevState.hover) {
        nextState.hover = null;
      }

      return nextState;
    }
  }]);

  return Calendar;
}(_react.Component);

exports["default"] = Calendar;
Calendar.defaultProps = {
  maxDetail: 'month',
  minDetail: 'century',
  returnValue: 'start',
  showNavigation: true,
  showNeighboringMonth: true,
  view: 'month'
};
Calendar.propTypes = {
  activeStartDate: _propTypes["default"].instanceOf(Date),
  calendarType: _propTypes2.isCalendarType,
  className: _propTypes2.isClassName,
  formatMonth: _propTypes["default"].func,
  formatMonthYear: _propTypes["default"].func,
  formatShortWeekday: _propTypes["default"].func,
  locale: _propTypes["default"].string,
  maxDate: _propTypes2.isMaxDate,
  maxDetail: _propTypes["default"].oneOf(allViews),
  minDate: _propTypes2.isMinDate,
  minDetail: _propTypes["default"].oneOf(allViews),
  navigationAriaLabel: _propTypes["default"].string,
  navigationLabel: _propTypes["default"].func,
  next2AriaLabel: _propTypes["default"].string,
  next2Label: _propTypes["default"].node,
  nextAriaLabel: _propTypes["default"].string,
  nextLabel: _propTypes["default"].node,
  onActiveDateChange: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  onClickDay: _propTypes["default"].func,
  onClickDecade: _propTypes["default"].func,
  onClickMonth: _propTypes["default"].func,
  onClickWeekNumber: _propTypes["default"].func,
  onClickYear: _propTypes["default"].func,
  onDrillDown: _propTypes["default"].func,
  onDrillUp: _propTypes["default"].func,
  prev2AriaLabel: _propTypes["default"].string,
  prev2Label: _propTypes["default"].node,
  prevAriaLabel: _propTypes["default"].string,
  prevLabel: _propTypes["default"].node,
  renderChildren: _propTypes["default"].func,
  // For backwards compatibility
  returnValue: _propTypes["default"].oneOf(['start', 'end', 'range']),
  selectRange: _propTypes["default"].bool,
  showFixedNumberOfWeeks: _propTypes["default"].bool,
  showNavigation: _propTypes["default"].bool,
  showNeighboringMonth: _propTypes["default"].bool,
  showWeekNumbers: _propTypes["default"].bool,
  tileClassName: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes2.isClassName]),
  tileContent: _propTypes["default"].oneOfType([_propTypes["default"].func, _propTypes["default"].node]),
  tileDisabled: _propTypes["default"].func,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes2.isValue]),
  view: _propTypes["default"].oneOf(allViews)
};
(0, _reactLifecyclesCompat.polyfill)(Calendar);