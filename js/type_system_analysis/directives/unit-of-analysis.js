'use strict';

var collections = ['uima.cas.BooleanArray', 'uima.cas.ByteArray', 'uima.cas.ShortArray', 'uima.cas.IntegerArray',
  'uima.cas.LongArray', 'uima.cas.FloatArray', 'uima.cas.DoubleArray', 'uima.cas.StringArray', 'uima.cas.FloatList',
  'uima.cas.IntegerList', 'uima.cas.StringList'];


angular.module('nlptabApp')
  .directive('unitOfAnalysis', function () {
    return {
      templateUrl: '../../../partials/type_systems_analysis/unit-of-analysis.html',
      restrict: 'E',
      scope: {
        unitOfAnalysis: '=',
        systems: '=',
        addFeatureValueMapping: '='
      },
      controller: function ($scope, Type, $uibModal) {
        $scope.types = [];

        $scope.tree = [];

        $scope.filterOptions = ['equals', 'in'];

        $scope.fetchTypes = function (filter) {
          if ($scope.unitOfAnalysis.selectedSystem && $scope.unitOfAnalysis.selectedSystem.index) {
            Type.allInSystem($scope.unitOfAnalysis.selectedSystem.index, 0, 30, filter)
              .then(function (result) {
                $scope.types = result.types;
              });
          }
        };

        $scope.openTypeSelection = function () {
          $uibModal.open({
            templateUrl: '../../../partials/type_systems_analysis/type-selection-modal.html',
            controller: 'TypeSelectionModalCtrl',
            size: 'lg',
            resolve: {
              systemIndex: function () {
                return $scope.unitOfAnalysis.selectedSystem.index;
              },
              selectedType: function () {
                return function (selectedType) {
                  $scope.unitOfAnalysis.selectedType = selectedType;
                };
              }
            }
          });
        };

        $scope.$watch('unitOfAnalysis.selectedSystem', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            delete $scope.unitOfAnalysis.selectedType;
            $scope.fetchTypes('');
          }
        });

        var pushType = function (type, level, index) {
          Type.subclasses($scope.unitOfAnalysis.systemIndex, type.typeName)
            .then(function (result) {
              var i, j;
              var runningIndex = index;
              var added = [];
              for (j = 0; j < type.primitiveFeatures.length; j++) {
                added.push(type.primitiveFeatures[j].shortName);
                $scope.tree.splice(runningIndex, 0, {
                  feature: type.primitiveFeatures[j],
                  onType: type.typeName,
                  collection: collections.indexOf(type.primitiveFeatures[j].valueType) !== -1,
                  level: level,
                  primitive: true,
                  class: ['col-md-' + (12 - level), 'col-md-offset-' + level],
                  subclass: false
                });
                runningIndex++;
              }
              for (i = 0; i < result.length; i++) {
                for (j = 0; j < result[i].primitiveFeatures.length; j++) {
                  if (added.indexOf(result[i].primitiveFeatures[j].shortName) === -1) {
                    added.push(result[i].primitiveFeatures[j].shortName);
                    $scope.tree.splice(runningIndex, 0, {
                      feature: result[i].primitiveFeatures[j],
                      onType: result[i].typeName,
                      collection: collections.indexOf(result[i].primitiveFeatures[j].valueType) !== -1,
                      level: level,
                      primitive: true,
                      class: ['col-md-' + (12 - level), 'col-md-offset-' + level],
                      subclass: true
                    });
                    runningIndex++;
                  }
                }
              }
              for (j = 0; j < type.referenceFeatures.length; j++) {
                $scope.tree.splice(runningIndex, 0, {
                  feature: type.referenceFeatures[j],
                  collection: type.referenceFeatures[j].valueType.indexOf('[]') !== -1 || type.referenceFeatures[j].valueType === 'uima.cas.FSArray',
                  level: level,
                  primitive: false,
                  expanded: false,
                  sofa: type.referenceFeatures[j].shortName === 'sofa',
                  class: ['col-md-' + (12 - level), 'col-md-offset-' + level]
                });
                runningIndex++;
              }
            });
        };

        $scope.expandItem = function (index) {
          var item = $scope.tree[index];
          var valueType = item.feature.valueType;
          var arrIndex = valueType.indexOf('[]');
          if (arrIndex !== -1) {
            valueType = valueType.substring(0, arrIndex);
          }
          Type.withName($scope.unitOfAnalysis.selectedSystem.index, valueType)
            .then(function (result) {
              item.expanded = true;
              pushType(result, item.level + 1, index + 1);
            });
        };

        $scope.collapseItem = function (index) {
          var item = $scope.tree[index];
          item.expanded = false;
          var i = 0;
          while ($scope.tree[index + 1 + i] && $scope.tree[index + 1 + i].level === item.level + 1) {
            i++;
          }
          $scope.tree.splice(index + 1, i);
        };

        var getNestedPath = function (index) {
          var item = $scope.tree[index];
          var nestedPath;
          var level = item.level;
          var collection = item.collection;
          if (level !== 0) {
            nestedPath = [];
            var ptr = index - 1;
            while (level !== 0) {
              var parent = $scope.tree[ptr];
              if (parent.level === level - 1) {
                nestedPath.push(parent.feature.name);
                collection = item.collection || parent.collection;
                level--;
              }
              ptr--;
            }
          }
          return {item: item, nestedPath: nestedPath, collection: collection};
        };

        $scope.addFeature = function (index) {
          var __ret = getNestedPath(index);
          $scope.addFeatureValueMapping(__ret.item.feature, __ret.nestedPath, __ret.collection);
        };

        $scope.$watch('unitOfAnalysis.selectedType', function (value) {
          $scope.tree = [];
          if (value) {
            pushType(value, 0, 0);
          }
        });

        $scope.examples = function (index) {
          $uibModal.open({
            templateUrl: '../../../partials/type_systems_analysis/feature-examples-modal.html',
            controller: 'FeatureExamplesModalCtrl',
            size: 'lg',
            resolve: {
              systemIndex: function () {
                return $scope.unitOfAnalysis.selectedSystem.index;
              },
              type: function () {
                return $scope.tree[index].onType;
              },
              feature: function () {
                return $scope.tree[index].feature;
              }
            }
          });
        };

        $scope.addFilter = function (index) {
          var item = $scope.tree[index];
          var filter = {
            feature: item.feature.shortName,
            value: '',
            option: 'equals'
          };

          $scope.unitOfAnalysis.filters.push(filter);
        };

        $scope.deleteFilter = function (index) {
          $scope.unitOfAnalysis.filters.splice(index, 1);
        };
      }
    };
  });
