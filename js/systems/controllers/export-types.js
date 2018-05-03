'use strict';

angular.module('nlptabApp').controller('ExportTypesCtrl', function ($scope,  CasProcessingIndex, Type, nlptabConfig, $location, $uibModal) {

    $scope.isSecure = nlptabConfig.isSecure;

    $scope.pagination = {from: 0, size: 10};

    $scope.download = function () {
	console.log("DOWNLOAD");
    };

    $scope.fetchSystems = function () {
	CasProcessingIndex.all($scope.pagination).
	    then(function (result) {
		$scope.pagination.total = result.total;
		$scope.systems = result.casProcessingIndexes;
		$scope.fetchTypes();
	    });
    };

    $scope.fetchSystems();

    $scope.fetchTypes = function () {
	$scope.systems.map(function(val){
	    Type.querySystemTypes(val.index, { export: true } ).then(function(result){
		angular.extend(val, { types : result.types });
	    });
	});
    };

});
