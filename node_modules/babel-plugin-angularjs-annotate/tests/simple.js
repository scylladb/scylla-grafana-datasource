module.exports = {
  name: "Simple Tests",
  tests: [
  {
    name: "Long form",
    implicit: true,
    input: function(){
      angular.module("MyMod").controller("MyCtrl", function($scope, $timeout) {
      });
    },
    expected: function(){
      angular.module("MyMod").controller("MyCtrl", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "w/ dependencies",
    implicit: true,
    input: function(){
      angular.module("MyMod", ["OtherMod"]).controller("MyCtrl", function($scope, $timeout) {
      });
    },
    expected: function(){
      angular.module("MyMod", ["OtherMod"]).controller("MyCtrl", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple controller",
    implicit: true,
    input: function(){
      myMod.controller("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.controller("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple service",
    implicit: true,
    input: function(){
      myMod.service("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.service("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple factory",
    implicit: true,
    input: function(){
      myMod.factory("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.factory("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple filter",
    implicit: true,
    input: function(){
      myMod.filter("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.filter("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple directive",
    implicit: true,
    input: function(){
      myMod.directive("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.directive("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple animation",
    implicit: true,
    input: function(){
      myMod.animation("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.animation("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple invoke",
    implicit: true,
    input: function(){
      myMod.invoke("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.invoke("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple store",
    implicit: true,
    input: function(){
      myMod.store("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.store("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple decorator",
    implicit: true,
    input: function(){
      myMod.decorator("foo", function($scope, $timeout) {
      });
    },
    expected: function(){
      myMod.decorator("foo", ["$scope", "$timeout", function($scope, $timeout) {
      }]);
    }
  },
  {
    name: "Simple component",
    implicit: true,
    input: function(){
      myMod.component("foo", {controller: function($scope, $timeout) {}});
    },
    expected: function(){
      myMod.component("foo", {controller: ["$scope", "$timeout", function($scope, $timeout) {}]});
    }
  },
  {
    name: "Implict config function",
    implicit: true,
    input: function(){
      // implicit config function
      angular.module("MyMod", function($interpolateProvider) {});
      angular.module("MyMod", ["OtherMod"], function($interpolateProvider) {});
      angular.module("MyMod", ["OtherMod"], function($interpolateProvider) {}).controller("foo", function($scope) {});
    },
    expected: function(){
      // implicit config function
      angular.module("MyMod", ["$interpolateProvider", function($interpolateProvider) {}]);
      angular.module("MyMod", ["OtherMod"], ["$interpolateProvider", function($interpolateProvider) {}]);
      angular.module("MyMod", ["OtherMod"], ["$interpolateProvider", function($interpolateProvider) {}]).controller("foo", ["$scope", function($scope) {}]);
    }
  },
  {
    name: "Object property",
    implicit: true,
    input: function(){
      // object property
      var myObj = {};
      myObj.myMod = angular.module("MyMod");
      myObj.myMod.controller("foo", function($scope, $timeout) { a });

    },
    expected: function(){
      // object property
      var myObj = {};
      myObj.myMod = angular.module("MyMod");
      myObj.myMod.controller("foo", ["$scope", "$timeout", function($scope, $timeout) { a }]);
    }
  },
  {
    name: "Simple invocations w/ no dependencies",
    implicit: true,
    input: function(){
      // no dependencies => no need to wrap the function in an array
      myMod.controller("foo", function() {
      });
      myMod.service("foo", function() {
      });
      myMod.factory("foo", function() {
      });
      myMod.directive("foo", function() {
      });
      myMod.filter("foo", function() {
      });
      myMod.animation("foo", function() {
      });
      myMod.invoke("foo", function() {
      });
      myMod.store("foo", function() {
      });
      myMod.decorator("foo", function() {
      });
      myMod.component("foo", {controller: function() {}});
    },
    expected: function(){
      // no dependencies => no need to wrap the function in an array
      myMod.controller("foo", function() {
      });
      myMod.service("foo", function() {
      });
      myMod.factory("foo", function() {
      });
      myMod.directive("foo", function() {
      });
      myMod.filter("foo", function() {
      });
      myMod.animation("foo", function() {
      });
      myMod.invoke("foo", function() {
      });
      myMod.store("foo", function() {
      });
      myMod.decorator("foo", function() {
      });
      myMod.component("foo", {controller: function() {}});
    }
  },
  {
    name: "Simple run/config",
    implicit: true,
    input: function(){
      // run, config don't take names
      myMod.run(function($scope, $timeout) {
      });
      angular.module("MyMod").run(function($scope) {
      });
      myMod.config(function($scope, $timeout) {
      });
      angular.module("MyMod").config(function() {
      });
    },
    expected: function(){
      // run, config don't take names
      myMod.run(["$scope", "$timeout", function($scope, $timeout) {
      }]);
      angular.module("MyMod").run(["$scope", function($scope) {
      }]);
      myMod.config(["$scope", "$timeout", function($scope, $timeout) {
      }]);
      angular.module("MyMod").config(function() {
      });
    }
  },
  {
    name: "Directive return object",
    implicit: true,
    input: function(){
      // directive return object
      myMod.directive("foo", function($scope) {
          return {
              controller: function($scope, $timeout) {
                  bar;
              }
          }
      });
      myMod.directive("foo", function($scope) {
          return {
              controller: function() {
                  bar;
              }
          }
      });
    },
    expected: function(){
      // directive return object
      myMod.directive("foo", ["$scope", function($scope) {
          return {
              controller: ["$scope", "$timeout", function($scope, $timeout) {
                  bar;
              }]
          }
      }]);
      myMod.directive("foo", ["$scope", function($scope) {
          return {
              controller: function() {
                  bar;
              }
          }
      }]);
    }
  },
  {
    name: "Simple chaining",
    implicit: true,
    input: function(){
      myMod.directive("foo", function($a, $b) {
          a;
      }).factory("foo", function() {
              b;
          }).config(function($c) {
              c;
          }).filter("foo", function($d, $e) {
              d;
          }).animation("foo", function($f, $g) {
              e;
          }).component("foo", {controller: function($scope, $timeout) {
              i;
          }}).invoke("foo", function($f, $g) {
              f;
          }).decorator("foo", function($f, $g) {
              g;
          }).store("foo", function($f, $g) {
              h;
          });
    },
    expected: function(){
      myMod.directive("foo", ["$a", "$b", function($a, $b) {
          a;
      }]).factory("foo", function() {
              b;
          }).config(["$c", function($c) {
              c;
          }]).filter("foo", ["$d", "$e", function($d, $e) {
              d;
          }]).animation("foo", ["$f", "$g", function($f, $g) {
              e;
          }]).component("foo", {controller: ["$scope", "$timeout", function($scope, $timeout) {
              i;
          }]}).invoke("foo", ["$f", "$g", function($f, $g) {
              f;
          }]).decorator("foo", ["$f", "$g", function($f, $g) {
              g;
          }]).store("foo", ["$f", "$g", function($f, $g) {
              h;
          }]);
    }
  },
  {
    name: "Less simple chaining",
    implicit: true,
    input: function(){
      angular.module("MyMod").directive("foo", function($a, $b) {
          a;
      }).provider("foo", function() {
              return {
                  $get: function($scope, $timeout) {
                      bar;
                  }};
          }).value("foo", "bar")
          .constant("foo", "bar")
          .bootstrap(element, [], {})
          .factory("foo", function() {
              b;
          }).config(function($c) {
              c;
          }).filter("foo", function($d, $e) {
              d;
          }).animation("foo", function($f, $g) {
              e;
          }).component("foo", {controller: function($scope, $timeout) {
              i;
          }}).invoke("foo", function($h, $i) {
              f;
          }).decorator("foo", function($h, $i) {
              g;
          }).store("foo", function($f, $g) {
              h;
          });
    },
    expected: function(){
      angular.module("MyMod").directive("foo", ["$a", "$b", function($a, $b) {
          a;
      }]).provider("foo", function() {
              return {
                  $get: ["$scope", "$timeout", function($scope, $timeout) {
                      bar;
                  }]};
          }).value("foo", "bar")
          .constant("foo", "bar")
          .bootstrap(element, [], {})
          .factory("foo", function() {
              b;
          }).config(["$c", function($c) {
              c;
          }]).filter("foo", ["$d", "$e", function($d, $e) {
              d;
          }]).animation("foo", ["$f", "$g", function($f, $g) {
              e;
          }]).component("foo", {controller: ["$scope", "$timeout", function($scope, $timeout) {
              i;
          }]}).invoke("foo", ["$h", "$i", function($h, $i) {
              f;
          }]).decorator("foo", ["$h", "$i", function($h, $i) {
              g;
          }]).store("foo", ["$f", "$g", function($f, $g) {
              h;
          }]);
    }
  },
  {
    name: "$provide",
    implicit: true,
    input: function(){
      angular.module("myMod").controller("foo", function() {
          $provide.decorator("foo", function($scope) {});
          $provide.service("foo", function($scope) {});
          $provide.factory("foo", function($scope) {});
          //$provide.provider
          $provide.provider("foo", function($scope) {
              this.$get = function($scope) {};
              return { $get: function($scope, $timeout) {}};
          });
          $provide.provider("foo", {
              $get: function($scope, $timeout) {}
          });
      });
    },
    expected: function(){
      angular.module("myMod").controller("foo", function() {
          $provide.decorator("foo", ["$scope", function($scope) {}]);
          $provide.service("foo", ["$scope", function($scope) {}]);
          $provide.factory("foo", ["$scope", function($scope) {}]);
          //$provide.provider
          $provide.provider("foo", ["$scope", function($scope) {
              this.$get = ["$scope", function($scope) {}];
              return { $get: ["$scope", "$timeout", function($scope, $timeout) {}]};
          }]);
          $provide.provider("foo", {
              $get: ["$scope", "$timeout", function($scope, $timeout) {}]
          });
      });
    }
  },
  {
    name: "negative $provide",
    implicit: true,
    input: function(){
      function notInContext() {
          $provide.decorator("foo", function($scope) {});
          $provide.service("foo", function($scope) {});
          $provide.factory("foo", function($scope) {});
          $provide.provider("foo", function($scope) {
              this.$get = function($scope) {};
              return { $get: function($scope, $timeout) {}};
          });
          $provide.provider("foo", {
              $get: function($scope, $timeout) {}
          });
      }
    },
    expected: function(){
      function notInContext() {
          $provide.decorator("foo", function($scope) {});
          $provide.service("foo", function($scope) {});
          $provide.factory("foo", function($scope) {});
          $provide.provider("foo", function($scope) {
              this.$get = function($scope) {};
              return { $get: function($scope, $timeout) {}};
          });
          $provide.provider("foo", {
              $get: function($scope, $timeout) {}
          });
      }
    }
  },
  {
    name: "ControllerProvider",
    implicit: true,
    input: function(){
      angular.module("myMod").controller("foo", function() {
          $controllerProvider.register("foo", function($scope) {});
      });
      function notInContext() {
          $controllerProvider.register("foo", function($scope) {});
      }
    },
    expected: function(){
      angular.module("myMod").controller("foo", function() {
          $controllerProvider.register("foo", ["$scope", function($scope) {}]);
      });
      function notInContext() {
          $controllerProvider.register("foo", function($scope) {});
      }
    }
  },
  {
    name: "directive return object is only valid inside directive",
    implicit: true,
    input: function(){
      myMod.service("donttouch", function() {
          return {
              controller: function($scope, $timeout) {
                  bar;
              }
          }
      });

      myMod.directive("donttouch", function() {
          foo.decorator("me", function($scope) {
          });
      });
    },
    expected: function(){
      myMod.service("donttouch", function() {
          return {
              controller: function($scope, $timeout) {
                  bar;
              }
          }
      });

      myMod.directive("donttouch", function() {
          foo.decorator("me", ["$scope", function($scope) {
          }]);
      });
    }
  },
  {
    name: "IIFE-jumping with reference support",
    implicit: true,
    input: function(){
      var myCtrl = (function () {
          return function($scope) {
          };
      })();
      angular.module("MyMod").controller("MyCtrl", myCtrl);
    },
    expected: function(){
      var myCtrl = (function () {
          return function($scope) {
          };
      })();
      myCtrl.$inject = ["$scope"];
      angular.module("MyMod").controller("MyCtrl", myCtrl);
    }
  },
  {
    name: "advanced IIFE-jumping (with reference support)",
    implicit: true,
    input: function(){
      var myCtrl10 = (function() {
          "use strict";
          // the return statement can appear anywhere on the functions topmost level,
          // including before the myCtrl function definition
          return myCtrl;
          function myCtrl($scope) {
              foo;
          }
          post;
      })();
      angular.module("MyMod").controller("MyCtrl", myCtrl10);
    },
    expected: function(){
      var myCtrl10 = (function() {
          "use strict";
          // the return statement can appear anywhere on the functions topmost level,
          // including before the myCtrl function definition
          myCtrl.$inject = ["$scope"];
          return myCtrl;
          function myCtrl($scope) {
              foo;
          }
          post;
      })();
      angular.module("MyMod").controller("MyCtrl", myCtrl10);
    }
  },
  {
    name: "injectable component templates/controller/templateurl",
    implicit: true,
    input: function(){
      angular.module("mod").component("cmp", {
        controller: function(a){},
        template: function(b){},
        templateUrl: function(c){},
      }).component("cmp2", {
        controller: "myCtrl",
        template: "tmpl",
        templateUrl: "template.html"
      });
    },
    expected: function(){
      angular.module("mod").component("cmp", {
        controller: ["a", function(a){}],
        template: ["b", function(b){}],
        templateUrl: ["c", function(c){}],
      }).component("cmp2", {
        controller: "myCtrl",
        template: "tmpl",
        templateUrl: "template.html"
      });
    }
  }
 ]
};
