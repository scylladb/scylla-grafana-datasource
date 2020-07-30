module.exports = {
  name: "Module dependent annotations",
  tests: [
  {
    name: "Injector invoke",
    contextDependent: true,
    implicit: true,
    input: function(){
      $injector.invoke(function($compile) {
          $compile(myElement)(scope);
      });
    },
    expected: function(){
      $injector.invoke(["$compile", function($compile) {
          $compile(myElement)(scope);
      }]);
    }
  },
  {
    name: "httpProvider",
    implicit: true,
    contextDependent: true,
    input: function(){
      $httpProvider.interceptors.push(function($scope) { a });
      $httpProvider.responseInterceptors.push(function($scope) { a }, function(a, b) { b }, function() { c });
    },
    expected: function(){
      $httpProvider.interceptors.push(["$scope", function($scope) { a }]);
      $httpProvider.responseInterceptors.push(["$scope", function($scope) { a }], ["a", "b", function(a, b) { b }], function() { c });
    }
  },
  {
    name: "$routeProvider",
    implicit: true,
    contextDependent: true,
    input: function(){
      $routeProvider.when("path", {
          controller: function($scope) { a }
      }).when("path2", {
              controller: function($scope) { b },
              resolve: {
                  zero: function() { a },
                  more: function($scope, $timeout) { b },
                  something: "else",
              },
              dontAlterMe: function(arg) {},
          });

    },
    expected: function(){
      $routeProvider.when("path", {
          controller: ["$scope", function($scope) { a }]
      }).when("path2", {
              controller: ["$scope", function($scope) { b }],
              resolve: {
                  zero: function() { a },
                  more: ["$scope", "$timeout", function($scope, $timeout) { b }],
                  something: "else",
              },
              dontAlterMe: function(arg) {},
          });
    }
  }
  ]
}
