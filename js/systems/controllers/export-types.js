'use strict';

angular.module('nlptabApp').controller('ExportTypesCtrl', function ($scope,  CasProcessingIndex, Type, nlptabConfig, $location, $uibModal) {

    $scope.isSecure = nlptabConfig.isSecure;

    $scope.pagination = {from: 0, size: 10};

    $scope.asAmicus = false;

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

    $scope.exportFile = function () {
	var ret = '';
	$scope.systems.map(function(sys){
	    sys.types.map(function(typ){
	     	ret += typ.typeName + "\n";
	    });
	});

	if (!$scope.asAmicus){
	    var objURL = URL.createObjectURL(new Blob([ret], {type: 'text/plain'}));
	    var a = document.createElement("a");
	    document.body.appendChild(a);
	    a.style = "display: none";
	    a.href = objURL;
	    a.download = "export.txt";
	    a.click();
	    window.URL.revokeObjectURL(objURL);
	    a.parentNode.removeChild(a);
	} else {
	    console.log("Not Implemented");
	}
    };

});
