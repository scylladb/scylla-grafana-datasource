module.exports = {
  name: "Simple Tests (arrow functions)",
  tests: [
  {
    name: "Long form (arrow function)",
    input: function(){
      angular.module("MyMod").controller("MyCtrl", ($scope, $timeout) => {
      });
    },
    expected: function(){
      angular.module("MyMod").controller("MyCtrl", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "w/ dependencies (arrow function)",
    input: function(){
      angular.module("MyMod", ["OtherMod"]).controller("MyCtrl", ($scope, $timeout) => {
      });
    },
    expected: function(){
      angular.module("MyMod", ["OtherMod"]).controller("MyCtrl", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple controller (arrow function)",
    input: function(){
      myMod.controller("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.controller("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple service (arrow function)",
    input: function(){
      myMod.service("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.service("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple factory (arrow function)",
    input: function(){
      myMod.factory("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.factory("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple filter (arrow function)",
    input: function(){
      myMod.filter("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.filter("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple directive (arrow function)",
    input: function(){
      myMod.directive("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.directive("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple animation (arrow function)",
    input: function(){
      myMod.animation("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.animation("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple invoke (arrow function)",
    input: function(){
      myMod.invoke("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.invoke("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple store (arrow function)",
    input: function(){
      myMod.store("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.store("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple decorator (arrow function)",
    input: function(){
      myMod.decorator("foo", ($scope, $timeout) => {
      });
    },
    expected: function(){
      myMod.decorator("foo", ["$scope", "$timeout", ($scope, $timeout) => {
      }]);
    }
  },
  {
    name: "Simple component (arrow function)",
    input: function(){
      myMod.component("foo", {controller: ($scope, $timeout) => {}});
    },
    expected: function(){
      myMod.component("foo", {controller: ["$scope", "$timeout", ($scope, $timeout) => {}]});
    }
  },
  {
    name: "Implict config function (arrow function)",
    input: function(){
      // implicit config function
      angular.module("MyMod", ($interpolateProvider) => {});
      angular.module("MyMod", ["OtherMod"], ($interpolateProvider) => {});
      angular.module("MyMod", ["OtherMod"], ($interpolateProvider) => {}).controller("foo", ($scope) => {});
    },
    expected: function(){
      // implicit config function
      angular.module("MyMod", ["$interpolateProvider", ($interpolateProvider) => {}]);
      angular.module("MyMod", ["OtherMod"], ["$interpolateProvider", ($interpolateProvider) => {}]);
      angular.module("MyMod", ["OtherMod"], ["$interpolateProvider", ($interpolateProvider) => {}]).controller("foo", ["$scope", ($scope) => {}]);
    }
  },
  {
    name: "Object property (arrow function)",
    input: function(){
      // object property
      var myObj = {};
      myObj.myMod = angular.module("MyMod");
      myObj.myMod.controller("foo", ($scope, $timeout) => { a });

    },
    expected: function(){
      // object property
      var myObj = {};
      myObj.myMod = angular.module("MyMod");
      myObj.myMod.controller("foo", ["$scope", "$timeout", ($scope, $timeout) => { a }]);
    }
  },
  {
    name: "Simple invocations w/ no dependencies (arrow function)",
    input: function(){
      // no dependencies => no need to wrap the function in an array
      myMod.controller("foo", () => {
      });
      myMod.service("foo", () => {
      });
      myMod.factory("foo", () => {
      });
      myMod.directive("foo", () => {
      });
      myMod.filter("foo", () => {
      });
      myMod.animation("foo", () => {
      });
      myMod.invoke("foo", () => {
      });
      myMod.store("foo", () => {
      });
      myMod.decorator("foo", () => {
      });
      myMod.component("foo", {controller: () => {}});
    },
    expected: function(){
      // no dependencies => no need to wrap the function in an array
      myMod.controller("foo", () => {
      });
      myMod.service("foo", () => {
      });
      myMod.factory("foo", () => {
      });
      myMod.directive("foo", () => {
      });
      myMod.filter("foo", () => {
      });
      myMod.animation("foo", () => {
      });
      myMod.invoke("foo", () => {
      });
      myMod.store("foo", () => {
      });
      myMod.decorator("foo", () => {
      });
      myMod.component("foo", {controller: () => {}});
    }
  },
  {
    name: "Simple run/config (arrow function)",
    input: function(){
      // run, config don't take names
      myMod.run(($scope, $timeout) => {
      });
      angular.module("MyMod").run(($scope) => {
      });
      myMod.config(($scope, $timeout) => {
      });
      angular.module("MyMod").config(() => {
      });
    },
    expected: function(){
      // run, config don't take names
      myMod.run(["$scope", "$timeout", ($scope, $timeout) => {
      }]);
      angular.module("MyMod").run(["$scope", ($scope) => {
      }]);
      myMod.config(["$scope", "$timeout", ($scope, $timeout) => {
      }]);
      angular.module("MyMod").config(() => {
      });
    }
  },
  {
    name: "Directive return object (arrow function)",
    input: function(){
      // directive return object
      myMod.directive("foo", ($scope) => {
          return {
              controller: ($scope, $timeout) => {
                  bar;
              }
          }
      });
      myMod.directive("foo", ($scope) => {
          return {
              controller: () => {
                  bar;
              }
          }
      });
      myMod.directive("foo", ($scope) => ({
          controller: ($scope, $timeout) => {
              bar;
          }
      }));
    },
    expected: function(){
      // directive return object
      myMod.directive("foo", ["$scope", ($scope) => {
          return {
              controller: ["$scope", "$timeout", ($scope, $timeout) => {
                  bar;
              }]
          }
      }]);
      myMod.directive("foo", ["$scope", ($scope) => {
          return {
              controller: () => {
                  bar;
              }
          }
      }]);
      myMod.directive("foo", ["$scope", ($scope) => ({
          controller: ["$scope", "$timeout", ($scope, $timeout) => {
              bar;
          }]
      })]);
    }
  },
  {
    name: "Simple chaining (arrow function)",
    input: function(){
      myMod.directive("foo", ($a, $b) => {
          a;
      }).factory("foo", () => {
              b;
          }).config(($c) => {
              c;
          }).filter("foo", ($d, $e) => {
              d;
          }).animation("foo", ($f, $g) => {
              e;
          }).component("foo", {controller: ($scope, $timeout) => {
              i;
          }}).invoke("foo", ($f, $g) => {
              f;
          }).decorator("foo", ($f, $g) => {
              g;
          }).store("foo", ($f, $g) => {
              h;
          });
    },
    expected: function(){
      myMod.directive("foo", ["$a", "$b", ($a, $b) => {
          a;
      }]).factory("foo", () => {
              b;
          }).config(["$c", ($c) => {
              c;
          }]).filter("foo", ["$d", "$e", ($d, $e) => {
              d;
          }]).animation("foo", ["$f", "$g", ($f, $g) => {
              e;
          }]).component("foo", {controller: ["$scope", "$timeout", ($scope, $timeout) => {
              i;
          }]}).invoke("foo", ["$f", "$g", ($f, $g) => {
              f;
          }]).decorator("foo", ["$f", "$g", ($f, $g) => {
              g;
          }]).store("foo", ["$f", "$g", ($f, $g) => {
              h;
          }]);
    }
  },
  {
    name: "Less simple chaining (arrow function)",
    input: function(){
      angular.module("MyMod").directive("foo", ($a, $b) => {
          a;
      }).provider("foo", () => {
              return {
                  $get: ($scope, $timeout) => {
                      bar;
                  }};
          }).value("foo", "bar")
          .constant("foo", "bar")
          .bootstrap(element, [], {})
          .factory("foo", () => {
              b;
          }).config(($c) => {
              c;
          }).filter("foo", ($d, $e) => {
              d;
          }).animation("foo", ($f, $g) => {
              e;
          }).component("foo", {controller: ($scope, $timeout) => {
              i;
          }}).invoke("foo", ($h, $i) => {
              f;
          }).decorator("foo", ($h, $i) => {
              g;
          }).store("foo", ($f, $g) => {
              h;
          });
    },
    expected: function(){
      angular.module("MyMod").directive("foo", ["$a", "$b", ($a, $b) => {
          a;
      }]).provider("foo", () => {
              return {
                  $get: ["$scope", "$timeout", ($scope, $timeout) => {
                      bar;
                  }]};
          }).value("foo", "bar")
          .constant("foo", "bar")
          .bootstrap(element, [], {})
          .factory("foo", () => {
              b;
          }).config(["$c", ($c) => {
              c;
          }]).filter("foo", ["$d", "$e", ($d, $e) => {
              d;
          }]).animation("foo", ["$f", "$g", ($f, $g) => {
              e;
          }]).component("foo", {controller: ["$scope", "$timeout", ($scope, $timeout) => {
              i;
          }]}).invoke("foo", ["$h", "$i", ($h, $i) => {
              f;
          }]).decorator("foo", ["$h", "$i", ($h, $i) => {
              g;
          }]).store("foo", ["$f", "$g", ($f, $g) => {
              h;
          }]);
    }
  },
  {
    name: "$provide (arrow function)",
    input: function(){
      angular.module("myMod").controller("foo", () => {
          $provide.decorator("foo", ($scope) => {});
          $provide.service("foo", ($scope) => {});
          $provide.factory("foo", ($scope) => {});
          //$provide.provider
          $provide.provider("foo", {
              $get: ($scope, $timeout) => {}
          });
      });
    },
    expected: function(){
      angular.module("myMod").controller("foo", () => {
          $provide.decorator("foo", ["$scope", ($scope) => {}]);
          $provide.service("foo", ["$scope", ($scope) => {}]);
          $provide.factory("foo", ["$scope", ($scope) => {}]);
          //$provide.provider
          $provide.provider("foo", {
              $get: ["$scope", "$timeout", ($scope, $timeout) => {}]
          });
      });
    }
  },
  {
    name: "negative $provide (arrow function)",
    input: function(){
      function notInContext() {
          $provide.decorator("foo", ($scope) => {});
          $provide.service("foo", ($scope) => {});
          $provide.factory("foo", ($scope) => {});
          $provide.provider("foo", ($scope) => {
              this.$get = ($scope) => {};
              return { $get: ($scope, $timeout) => {}};
          });
          $provide.provider("foo", {
              $get: ($scope, $timeout) => {}
          });
      }
    },
    expected: function(){
      function notInContext() {
          $provide.decorator("foo", ($scope) => {});
          $provide.service("foo", ($scope) => {});
          $provide.factory("foo", ($scope) => {});
          $provide.provider("foo", ($scope) => {
              this.$get = ($scope) => {};
              return { $get: ($scope, $timeout) => {}};
          });
          $provide.provider("foo", {
              $get: ($scope, $timeout) => {}
          });
      }
    }
  },
  {
    name: "ControllerProvider (arrow function)",
    input: function(){
      angular.module("myMod").controller("foo", () => {
          $controllerProvider.register("foo", ($scope) => {});
      });
      function notInContext() {
          $controllerProvider.register("foo", ($scope) => {});
      }
    },
    expected: function(){
      angular.module("myMod").controller("foo", () => {
          $controllerProvider.register("foo", ["$scope", ($scope) => {}]);
      });
      function notInContext() {
          $controllerProvider.register("foo", ($scope) => {});
      }
    }
  },
  {
    name: "directive return object is only valid inside directive (arrow function)",
    input: function(){
      myMod.service("donttouch", () => {
          return {
              controller: ($scope, $timeout) => {
                  bar;
              }
          }
      });

      myMod.directive("donttouch", () => {
          foo.decorator("me", ($scope) => {
          });
      });
    },
    expected: function(){
      myMod.service("donttouch", () => {
          return {
              controller: ($scope, $timeout) => {
                  bar;
              }
          }
      });

      myMod.directive("donttouch", () => {
          foo.decorator("me", ["$scope", ($scope) => {
          }]);
      });
    }
  },
  {
    name: "IIFE-jumping with reference support (arrow function)",
    input: function(){
      var myCtrl = (function () {
          return ($scope) => {
          };
      })();
      angular.module("MyMod").controller("MyCtrl", myCtrl);
    },
    expected: function(){
      var myCtrl = (function () {
          return ($scope) => {
          };
      })();
      myCtrl.$inject = ["$scope"];
      angular.module("MyMod").controller("MyCtrl", myCtrl);
    }
  },
  {
    name: "advanced IIFE-jumping (with reference support) (arrow function)",
    input: function(){
      var myCtrl10 = (() => {
          "use strict";
          // the return statement can appear anywhere on the functions topmost level,
          // including before the myCtrl function definition
          var myCtrl = ($scope) =>{
              foo;
          }
          return myCtrl;
          post;
      })();
      angular.module("MyMod").controller("MyCtrl", myCtrl10);
    },
    expected: function(){
      var myCtrl10 = (() => {
          "use strict";
          // the return statement can appear anywhere on the functions topmost level,
          // including before the myCtrl function definition
          var myCtrl = ($scope) => {
              foo;
          }
          myCtrl.$inject = ["$scope"];
          return myCtrl;
          post;
      })();
      angular.module("MyMod").controller("MyCtrl", myCtrl10);
    }
  }
 ].map(t => { t.implicit=true; return t; })
};
