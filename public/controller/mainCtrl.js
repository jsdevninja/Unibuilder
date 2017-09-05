app.controller('mainCtrl', function($scope) {
    $scope.fff = 0;
    $scope.myFunc = function(num) {
      $scope.fff = num;
    }
});

app.config(function($routeProvider) {
  $routeProvider
    .when("/sample", {
      templateUrl : "sample.html"
    })
    .when("/jobs", {
      templateUrl : "jobs.html",
      controller : "jobs"
    })
    .when("/joblist", {
      templateUrl : "joblist.html",
      controller : "joblist"
    });
});

app.directive('onFinishRender', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      if(scope.$last === true) {
        $timeout(function() {
          scope.$emit(attr.onFinishRender);
        })
      }
    }
  }
});