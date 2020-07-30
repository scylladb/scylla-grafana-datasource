module.exports = {
    name: "ui-bootstrap",
    tests: [
      {
        name: "Modal Open",
        implicit: true,
        contextDependent: true,
        input: function(){
          $modal.open({
              templateUrl: "str",
              controller: function($scope) {},
              resolve: {
                  items: function(MyService) {},
                  data: function(a, b) {},
                  its: 42,
              },
              donttouch: function(me) {},
          });
        },
        expected: function(){
          $modal.open({
              templateUrl: "str",
              controller: ["$scope", function($scope) {}],
              resolve: {
                  items: ["MyService", function(MyService) {}],
                  data: ["a", "b", function(a, b) {}],
                  its: 42,
              },
              donttouch: function(me) {},
          });
        }
      },
      {
        name: "uibModal Open",
        contextDependent: true,
        implicit: true,
        input: function(){
          $uibModal.open({
              templateUrl: "str",
              controller: function($scope) {},
              resolve: {
                  items: function(MyService) {},
                  data: function(a, b) {},
                  its: 42,
              },
              donttouch: function(me) {},
          });
        },
        expected: function(){
          $uibModal.open({
              templateUrl: "str",
              controller: ["$scope", function($scope) {}],
              resolve: {
                  items: ["MyService", function(MyService) {}],
                  data: ["a", "b", function(a, b) {}],
                  its: 42,
              },
              donttouch: function(me) {},
          });
        }
      },
      {
        name: "Material Design Modal",
        implicit: true,
        contextDependent: true,
        input: function(){
          $mdDialog.show({
              templateUrl: "str",
              controller: function($scope) {},
              resolve: {
                  items: function(MyService) {},
                  data: function(a, b) {},
                  its: 42,
              },
              donttouch: function(me) {},
          });
        },
        expected: function(){
          $mdDialog.show({
              templateUrl: "str",
              controller: ["$scope", function($scope) {}],
              resolve: {
                  items: ["MyService", function(MyService) {}],
                  data: ["a", "b", function(a, b) {}],
                  its: 42,
              },
              donttouch: function(me) {},
          });
        }
      },
      {
        name: "Material Design Bottom Sheet",
        contextDependent: true,
        implicit: true,
        input: function(){
          $mdBottomSheet.show({
              templateUrl: "str",
              controller: function($scope) {},
              resolve: {
                  items: function(MyService) {},
                  data: function(a, b) {},
                  its: 42,
              },
              donttouch: function(me) {},
          });
        },
        expected: function(){
          $mdBottomSheet.show({
              templateUrl: "str",
              controller: ["$scope", function($scope) {}],
              resolve: {
                  items: ["MyService", function(MyService) {}],
                  data: ["a", "b", function(a, b) {}],
                  its: 42,
              },
              donttouch: function(me) {},
          });
        }
      },
      {
        name: "Material Design Toast",
        contextDependent: true,
        implicit: true,
        input: function(){
          $mdToast.show({
              templateUrl: "str",
              controller: function($scope) {},
              resolve: {
                  items: function(MyService) {},
                  data: function(a, b) {},
                  its: 42,
              },
              donttouch: function(me) {},
          });
        },
        expected: function(){
          $mdToast.show({
              templateUrl: "str",
              controller: ["$scope", function($scope) {}],
              resolve: {
                  items: ["MyService", function(MyService) {}],
                  data: ["a", "b", function(a, b) {}],
                  its: 42,
              },
              donttouch: function(me) {},
          });
        }
      },




    ]
}
