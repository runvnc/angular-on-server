var viewMod = angular.module('ngView', ['ngResource'], function($routeProvider, $locationProvider) {

  $routeProvider.when('/Catalog', {
    templateUrl: '/products.html',
    controller: ProductsCntl
  });
  $routeProvider.when('/Catalog/:type', {
    templateUrl: '/products.html',
    controller: ProductTypeCntl
  });

  $locationProvider.html5Mode(true);
});

function MainCntl($scope, $route, $routeParams, $location, $http) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  $scope.setLocation = function(url) {
    $scope.$location.path(url);
  }
}

function ProductsCntl($scope, $routeParams, $resource) {
  $scope.$resource = $resource;
  $scope.name = "ProductsCntl";
  $scope.params = $routeParams;
}

function ProductTypeCntl($scope, $routeParams) {
  $scope.name = "ProductTypeCntl";
  $scope.params = $routeParams;
}

viewMod.directive('prerendered',
  function($http, $templateCache, $route, $anchorScroll, $compile, $controller) {
  return {
    restrict: 'ECA',
    terminal: true,
    link: function(scope, element, attr) {
      var lastScope,
          onloadExp = attr.onload || '';

      scope.$on('$routeChangeSuccess', update);
      update();


      function destroyLastScope() {
        if (lastScope) {
          lastScope.$destroy();
          lastScope = null;
        }
      }

      function clearContent() {
        element.html('');
        destroyLastScope();
      }

      function update() {
        var locals = $route.current && $route.current.locals,
            template = locals && locals.$template;

        if (template) {
          element.html(template);
          destroyLastScope();

          var link = $compile(element.contents()),
              current = $route.current,
              controller;

          lastScope = current.scope = scope.$new();
          if (current.controller) {
            locals.$scope = lastScope;
            controller = $controller(current.controller, locals);
            element.children().data('$ngControllerController', controller);
          }

          link(lastScope);
          lastScope.$emit('$viewContentLoaded');
          lastScope.$eval(onloadExp);

          // $anchorScroll might listen on event...
          $anchorScroll();
        } else {
          //clearContent();
        }
      }
    }
  }
});

viewMod.directive('productList', function($resource) {
    return {
      restrict: 'E',
      replace: true,
      transclude: false,
      //scope: { products: { data: [ { name: 'test', price: 1 }] } },
      template: '<li ng-repeat="product in products">{{product.name}} {{product.price}}</li>',
      link: function(scope, element, attrs) {
        var Product = $resource('/products');
        scope.products = Product.query({type: scope.params.type}, function() { });
      }
    }
  });