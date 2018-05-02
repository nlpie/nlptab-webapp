'use strict';

angular.module('nlptabApp')
  .controller('SystemCtrl', function ($routeParams, $location, $scope, system, Type, CasProcessingIndex, $route) {
    $scope.systemIndex = $routeParams.systemIndex;
    $scope.system = system;

    $scope.infoActive = true;
    $scope.primitivesActive = false;
    $scope.referencesActive = false;
    $scope.instancesActive = false;
    $scope.deleteWarned = false;

    $scope.$watch(function () {
      return $location.search();
    }, function (value) {
      updateFromParams(value);
    }, true);

    var updateFromParams = function (value) {
      $scope.infoActive = !!value.info;
      $scope.primitivesActive = !!value.primitives;
      $scope.referencesActive = !!value.references;
      $scope.instancesActive = !!value.instances;
      if (value.type) {
        $scope.selectedTypeName = value.type;
      } else {
        delete $scope.selectedTypeName;
      }
    };

    updateFromParams($routeParams);

    $scope.deleteSystem = function () {
      if (!$scope.deleteWarned) {
        $scope.deleteWarned = true;
      } else {
        CasProcessingIndex.deleteSystem($scope.systemIndex)
          .then(function () {
            $location.path('/type-systems');
            $route.reload();
          });
      }
    };

    $scope.selectedInfo = function () {
      if ($scope.selectedTypeName) {
        clearTabs();
        $location.search('info', true).replace();
      }
    };

    $scope.selectedPrimitives = function () {
      if ($scope.selectedTypeName) {
        clearTabs();
        $location.search('primitives', true).replace();
      }
    };

    $scope.selectedReferences = function () {
      if ($scope.selectedTypeName) {
        clearTabs();
        $location.search('references', true).replace();
      }
    };

    $scope.selectedInstances = function () {
      if ($scope.selectedTypeName) {
        clearTabs();
        $location.search('instances', true).replace();
      }
    };

    var clearTabs = function () {
      $location.search('info', null).replace();
      $location.search('primitives', null).replace();
      $location.search('references', null).replace();
      $location.search('instances', null).replace();
    };

    $scope.selectType = function (type) {
      var name = type.typeName;
      if ($scope.selectedTypeName !== name) {
        $scope.selectedTypeName = name;
        $location.search('type', $scope.selectedTypeName).search('info', true).replace();
      } else {
        $scope.clearSelectedType();
      }
    };

    $scope.clearSelectedType = function () {
      delete $scope.selectedTypeName;
      clearTabs();
      $location.search('type', null).replace();
      $location.search('info', true).replace();
    };

    $scope.updateSelectedType = function (subdoc) {
	Type.updateType($scope.systemIndex, $scope.selectedType._id, subdoc);
    };

    $scope.$watch('selectedTypeName', function (newValue) {
      if (newValue) {
        Type.withName($scope.systemIndex, $scope.selectedTypeName).then(function (result) {
          $scope.selectedType = result;
        }, function (reason) {
          delete $scope.selectedType;
        });
      }
    });
  });
