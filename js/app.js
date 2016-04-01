'use strict';

var deps = ['ngRoute', 'elasticsearch', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'ngFileUpload'];

angular.module('nlptabApp', deps)
  .config(function ($routeProvider, nlptabConfig) {
    $routeProvider.when('/main', {
      templateUrl: function () {
        if (nlptabConfig.isBio) {
          return './partials/common/bio-main.html';
        } else {
          return './partials/common/main.html';
        }
      },
      reloadOnSearch: false
    }).when('/analysis', {
      templateUrl: './partials/type_systems_analysis/analysis.html',
      controller: 'AnalysisCtrl',
      reloadOnSearch: false
    }).when('/analysis-results', {
      templateUrl: './partials/type_systems_analysis/analysis-results.html',
      controller: 'AnalysisResultsCtrl',
      reloadOnSearch: false
    }).when('/analysis-results-explore/:matchCountsId', {
      templateUrl: './partials/type_systems_analysis/analysis-results-explore.html',
      controller: 'AnalysisResultsExploreCtrl',
      reloadOnSearch: false,
      resolve: {
        matchCounts: function (MatchCounts, $route) {
          return MatchCounts.withId($route.current.params.matchCountsId);
        }
      }
    }).when('/analysis-progress/:analysisId', {
      templateUrl: './partials/type_systems_analysis/analysis-progress.html',
      controller: 'AnalysisProgressCtrl',
      reloadOnSearch: false
    }).when('/analysis-builder', {
      templateUrl: './partials/type_systems_analysis/analysis-builder.html',
      controller: 'AnalysisBuilderCtrl',
      reloadOnSearch: false
    }).when('/document-search', {
      templateUrl: './partials/annotation_analysis/document-search.html',
      controller: 'DocumentSearchCtrl',
      reloadOnSearch: false
    }).when('/document-search/explore/:sofaIdentifier', {
      templateUrl: './partials/annotation_analysis/document-search-explore.html',
      controller: 'DocumentSearchExploreCtrl',
      reloadOnSearch: false,
      resolve: {
        sofa: function ($route, Sofa) {
          return Sofa.withSofaIdentifier(nlptabConfig.instanceName + 'search', $route.current.params.sofaIdentifier);
        },
        systems: function (CasProcessingIndex) {
          return CasProcessingIndex.all(0, 40);
        }
      }
    }).when('/type-systems', {
      templateUrl: './partials/systems/systems-list.html',
      controller: 'SystemsListCtrl',
      reloadOnSearch: false
    }).when('/system/:systemIndex', {
      templateUrl: './partials/systems/system.html',
      controller: 'SystemCtrl',
      reloadOnSearch: false,
      resolve: {
        system: function ($route, CasProcessingIndex) {
          return CasProcessingIndex.withIndexName($route.current.params.systemIndex);
        }
      }
    }).when('/system-builder', {
      templateUrl: './partials/systems/system-builder.html',
      controller: 'SystemBuilderCtrl',
      reloadOnSearch: false
    }).when('/system-task-progress/:index', {
      templateUrl: './partials/systems/system-task-progress.html',
      controller: 'SystemTaskProgressCtrl',
      reloadOnSearch: false
    }).otherwise({
      redirectTo: '/main'
    });
  });

require('./annotation_analysis/index');
require('./common/index');
require('./systems/index');
require('./type_system_analysis/index');
