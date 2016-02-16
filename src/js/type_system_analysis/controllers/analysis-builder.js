'use strict';

angular.module('nlptabApp')
  .controller('AnalysisBuilderCtrl', function ($scope, $location, CasProcessingIndex, AnalysisTasks) {
    $scope.systems = [];

    $scope.firstUnitOfAnalysis = {};
    $scope.secondUnitOfAnalysis = {};
    $scope.featureValueMappings = [];
    $scope.onlyCompareMatches = false;

    $scope.description = '';

    $scope.fetchSystems = function () {
      CasProcessingIndex.all(0, 50)
        .then(function (result) {
          $scope.systems = result.casProcessingIndexes;
        });
    };

    var firstAvail = function (featureName) {
      var ind = 0;
      while ($scope.featureValueMappings[ind] && $scope.featureValueMappings[ind][featureName]) {
        ind++;
      }
      if (!$scope.featureValueMappings[ind]) {
        $scope.featureValueMappings.push(AnalysisTasks.createFeatureValueMapping());
      }
      return $scope.featureValueMappings[ind];
    };

    $scope.$watch('firstUnitOfAnalysis.selectedType', function () {
      for (var i = 0; i < $scope.featureValueMappings.length; i++) {
        $scope.featureValueMappings[i].hypothesisFeature = undefined;
      }
    });

    $scope.$watch('secondUnitOfAnalysis.selectedType', function () {
      for (var i = 0; i < $scope.featureValueMappings.length; i++) {
        $scope.featureValueMappings[i].referenceFeature = undefined;
      }
    });

    var updateEquivalences = function (featureValueMapping) {
      if (featureValueMapping.hypothesisFeature) {
        if (featureValueMapping.hypothesisIsCollection) {
          if (featureValueMapping.referenceIsCollection) {
            featureValueMapping.equivalence = 'any are in';
            featureValueMapping.equivalenceOptions = ['any are in', 'none are in', 'all are in', 'equals'];
          } else {
            featureValueMapping.equivalence = 'any are equal to';
            featureValueMapping.equivalenceOptions = ['any are equal to', 'none are equal to'];
          }
        } else {
          if (featureValueMapping.referenceIsCollection) {
            featureValueMapping.equivalence = 'is in';
            featureValueMapping.equivalenceOptions = ['is in', 'is not in'];
          } else {
            featureValueMapping.equivalence = 'equals';
            featureValueMapping.equivalenceOptions = ['equals', 'does not equal'];
          }
        }
      }
    };

    $scope.addHypothesisFeatureValueMapping = function (feature, nestedStructure, isCollection) {
      var featureValueMapping = firstAvail('hypothesisFeature');
      featureValueMapping.hypothesisFeature = {feature: feature, nestedStructure: nestedStructure};
      featureValueMapping.hypothesisIsCollection = isCollection;
      updateEquivalences(featureValueMapping);
    };

    $scope.addReferenceFeatureValueMapping = function (feature, nestedStructure, isCollection) {
      var featureValueMapping = firstAvail('referenceFeature');
      featureValueMapping.referenceFeature = {feature: feature, nestedStructure: nestedStructure};
      featureValueMapping.referenceIsCollection = isCollection;
      updateEquivalences(featureValueMapping);
    };

    $scope.fetchSystems();

    $scope.isReadyForAnalysis = function () {
      if (!$scope.firstUnitOfAnalysis.selectedType || !$scope.secondUnitOfAnalysis.selectedType) {
        return false;
      }
      var i;
      for (i = 0; i < $scope.featureValueMappings.length; i++) {
        var featureValueMapping = $scope.featureValueMappings[i];
        if (!featureValueMapping.hypothesisFeature || !featureValueMapping.referenceFeature) {
          return false;
        }
      }
      return true;
    };

    var removedFeature = function (index) {
      var featureValueMapping = $scope.featureValueMappings[index];
      featureValueMapping.valueMappings = [];
      if (!featureValueMapping.referenceFeature && !featureValueMapping.hypothesisFeature) {
        $scope.featureValueMappings.splice(index, 1);
      }
    };

    $scope.removeReferenceFeature = function (index) {
      $scope.featureValueMappings[index].referenceFeature = undefined;
      $scope.featureValueMappings[index].referenceIsCollection = undefined;
      removedFeature(index);
    };

    $scope.removeHypothesisFeature = function (index) {
      $scope.featureValueMappings[index].hypothesisFeature = undefined;
      $scope.featureValueMappings[index].hypothesisIsCollection = undefined;
      removedFeature(index);
    };

    $scope.submitAnalysis = function () {
      AnalysisTasks.runAnalysis($scope.firstUnitOfAnalysis, $scope.secondUnitOfAnalysis, $scope.featureValueMappings,
        $scope.description, $scope.onlyCompareMatches)
        .then(function (result) {
          $location.path('/analysis-progress/' + result.data.id);
        });
    };
  });
