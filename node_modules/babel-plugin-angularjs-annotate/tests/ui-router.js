module.exports = {
  name: "ui-router",
  tests: [
    {
      name: "ui-router $stateProvider",
      contextDependent: true,
      implicit: true,
      input: function(){
        $stateProvider.state("myState", {
            resolve: {
                simpleObj: function() { a },
                promiseObj: function($scope, $timeout) { b },
                translations: "translations",
                objMethod(a) { a }
            },
            params: {
                simple: function($scope) {},
                inValue: { value: function($scope) {}, notThis: function($scope) {} },
            },
            views: {
                viewa: {
                    controller: function($scope, myParam) {},
                    controllerProvider: function($stateParams) {},
                    templateProvider: function($scope) {},
                    dontAlterMe: function(arg) {},
                    resolve: {
                        myParam: function($stateParams) {
                            return $stateParams.paramFromDI;
                        }
                    },
                },
                viewb: {
                    dontAlterMe: function(arg) {},
                    templateProvider: function($scope) {},
                    controller: function($scope) {},
                },
                viewc: {
                  dontAlterMe(arg) {},
                  templateProvider($scope) {},
                  controller($scope) {}
                },
                dontAlterMe: null,
            },
            controller: function($scope, simpleObj, promiseObj, translations) { c },
            controllerProvider: function($scope) { g },
            templateProvider: function($scope) { h },
            onEnter: function($scope) { d },
            onExit: function($scope) { e },
            dontAlterMe: function(arg) { f },
        }).state("myState2", {
                controller: function($scope) {},
            }).state({
                name: "myState3",
                controller: function($scope, simpleObj, promiseObj, translations) { c },
            });
      },
      expected: function(){
        $stateProvider.state("myState", {
            resolve: {
                simpleObj: function() { a },
                promiseObj: ["$scope", "$timeout", function($scope, $timeout) { b }],
                translations: "translations",
                objMethod: ["a", function(a) { a }]
            },
            params: {
                simple: ["$scope", function($scope) {}],
                inValue: { value: ["$scope", function($scope) {}], notThis: function($scope) {} },
            },
            views: {
                viewa: {
                    controller: ["$scope", "myParam", function($scope, myParam) {}],
                    controllerProvider: ["$stateParams", function($stateParams) {}],
                    templateProvider: ["$scope", function($scope) {}],
                    dontAlterMe: function(arg) {},
                    resolve: {
                        myParam: ["$stateParams", function($stateParams) {
                            return $stateParams.paramFromDI;
                        }]
                    },
                },
                viewb: {
                    dontAlterMe: function(arg) {},
                    templateProvider: ["$scope", function($scope) {}],
                    controller: ["$scope", function($scope) {}],
                },
                viewc: {
                  dontAlterMe(arg) {},
                  templateProvider: ["$scope", function($scope) {}],
                  controller: ["$scope", function($scope) {}]
                },
                dontAlterMe: null,
            },
            controller: ["$scope", "simpleObj", "promiseObj", "translations", function($scope, simpleObj, promiseObj, translations) { c }],
            controllerProvider: ["$scope", function($scope) { g }],
            templateProvider: ["$scope", function($scope) { h }],
            onEnter: ["$scope", function($scope) { d }],
            onExit: ["$scope", function($scope) { e }],
            dontAlterMe: function(arg) { f },
        }).state("myState2", {
                controller: ["$scope", function($scope) {}],
            }).state({
                name: "myState3",
                controller: ["$scope", "simpleObj", "promiseObj", "translations", function($scope, simpleObj, promiseObj, translations) { c }],
            });
      }
    },
    {
      name: "ui-router $urlRouterProvider",
      contextDependent: true,
      implicit: true,
      input: function(){
        $urlRouterProvider.when("/", function($match) { a; });
        $urlRouterProvider.otherwise("", function(a) { a; });
        $urlRouterProvider.rule(function(a) { a; }).anything().when("/", function($location) { a; });
      },
      expected: function(){
        $urlRouterProvider.when("/", ["$match", function($match) { a; }]);
        $urlRouterProvider.otherwise("", function(a) { a; });
        $urlRouterProvider.rule(function(a) { a; }).anything().when("/", ["$location", function($location) { a; }]);
      },
    },
    {
      name: "ui-router stateHelperProvider",
      contextDependent: true,
      implicit: true,
      input: function(){
        stateHelperProvider.setNestedState({
            controller: function($scope, simpleObj, promiseObj, translations) { c },

            children: [
                {
                    name: "a",
                    controller: function(a) {},
                    resolve: {
                        f: function($a) {},
                    },
                    children: [
                        {
                            name: "ab",
                            controller: function(ab) {},
                            resolve: {
                                f: function($ab) {},
                            },
                            children: [
                                {
                                    name: "abc",
                                    controller: function(abc) {},
                                    resolve: {
                                        f: function($abc) {},
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "b",
                    controller: function(b) {},
                    views: {
                        viewa: {
                            controller: function($scope, myParam) {},
                            controllerProvider: function($stateParams) {},
                            templateProvider: function($scope) {},
                            dontAlterMe: function(arg) {},
                            resolve: {
                                myParam: function($stateParams) {
                                    return $stateParams.paramFromDI;
                                }
                            },
                        },
                        viewb: {
                            dontAlterMe: function(arg) {},
                            templateProvider: function($scope) {},
                            controller: function($scope) {},
                        },
                        dontAlterMe: null,
                    },
                },
            ],
        });
        stateHelperProvider.setNestedState({
            controller: function($scope, simpleObj, promiseObj, translations) { c },
        }, true);

      },
      expected: function(){
        stateHelperProvider.setNestedState({
            controller: ["$scope", "simpleObj", "promiseObj", "translations", function($scope, simpleObj, promiseObj, translations) { c }],

            children: [
                {
                    name: "a",
                    controller: ["a", function(a) {}],
                    resolve: {
                        f: ["$a", function($a) {}],
                    },
                    children: [
                        {
                            name: "ab",
                            controller: ["ab", function(ab) {}],
                            resolve: {
                                f: ["$ab", function($ab) {}],
                            },
                            children: [
                                {
                                    name: "abc",
                                    controller: ["abc", function(abc) {}],
                                    resolve: {
                                        f: ["$abc", function($abc) {}],
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "b",
                    controller: ["b", function(b) {}],
                    views: {
                        viewa: {
                            controller: ["$scope", "myParam", function($scope, myParam) {}],
                            controllerProvider: ["$stateParams", function($stateParams) {}],
                            templateProvider: ["$scope", function($scope) {}],
                            dontAlterMe: function(arg) {},
                            resolve: {
                                myParam: ["$stateParams", function($stateParams) {
                                    return $stateParams.paramFromDI;
                                }]
                            },
                        },
                        viewb: {
                            dontAlterMe: function(arg) {},
                            templateProvider: ["$scope", function($scope) {}],
                            controller: ["$scope", function($scope) {}],
                        },
                        dontAlterMe: null,
                    },
                },
            ],
        });
        stateHelperProvider.setNestedState({
            controller: ["$scope", "simpleObj", "promiseObj", "translations", function($scope, simpleObj, promiseObj, translations) { c }],
        }, true);

      }
    }
  ]
}
