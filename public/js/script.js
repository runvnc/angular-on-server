angular.module('ngView', [], function($routeProvider, $locationProvider) {
  $routeProvider.when('/Book/:bookId', {
    templateUrl: '/book.html',
    controller: BookCntl
  });
  $routeProvider.when('/Book/:bookId/ch/:chapterId', {
    templateUrl: '/chapter.html',
    controller: ChapterCntl
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

function MainCntl($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}

function BookCntl($scope, $routeParams) {
  $scope.name = "BookCntl";
  $scope.params = $routeParams;
}

function ChapterCntl($scope, $routeParams) {
  $scope.name = "ChapterCntl";
  $scope.params = $routeParams;
}