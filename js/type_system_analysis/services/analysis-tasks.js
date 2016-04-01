'use strict';

angular.module('nlptabApp')
  .service('AnalysisTasks', function ($q, Es, nlptabConfig, $http) {
    this.withId = function (id) {
      return Es.getSource({
        index: nlptabConfig.instanceName + 'analysis',
        type: 'AnalysisTask',
        id: id
      });
    };

    function FeatureValueMapping() {
      this.valueMappings = [];
    }

    FeatureValueMapping.prototype.removeValueMapping = function (index) {
      this.valueMappings.splice(index, 1);
    };

    FeatureValueMapping.prototype.addValueMapping = function () {
      this.valueMappings.push({});
    };

    this.createFeatureValueMapping = function () {
      return new FeatureValueMapping();
    };

    this.runAnalysis = function (hypothesisUnitOfAnalysis, referenceUnitOfAnalysis, featureValueMappings, description, hitMiss) {
      var config = {
        hypothesisUnitOfAnalysis: {
          selectedSystem: hypothesisUnitOfAnalysis.selectedSystem.index,
          selectedType: hypothesisUnitOfAnalysis.selectedType.typeName,
          filters: hypothesisUnitOfAnalysis.filters
        },
        referenceUnitOfAnalysis: {
          selectedSystem: referenceUnitOfAnalysis.selectedSystem.index,
          selectedType: referenceUnitOfAnalysis.selectedType.typeName,
          filters: referenceUnitOfAnalysis.filters
        },
        featureValueMappings: featureValueMappings,
        instance: nlptabConfig.instanceName,
        description: description,
        fuzzDistance: 0,
        hitMiss: hitMiss ? hitMiss ? 'true' : 'false' : 'false'
      };

      return $http.post(nlptabConfig.esServer + '/_nlptab-analysis', config);
    };
  });
