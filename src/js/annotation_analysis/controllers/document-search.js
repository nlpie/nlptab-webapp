'use strict';
angular.module('nlptabApp')
    .controller('DocumentSearchCtrl', function ($scope, $routeParams, $location, Sofa, nlptabConfig) {
        $scope.pagination = {page: 1, itemsPerPage: 3};

        $scope.queryString = $routeParams.q || '';
        $scope.fetching = false;

        var escape = new RegExp(/([\-\&\|!\(\){}\[\]\^~*?:\\\+])/g);
        var remove = new RegExp(/(["\'])/g);

        var fetchSofas = function () {
            var removed = $scope.queryString.replace(remove, '');
            var queryString = removed.replace(escape, '\\$1');
            $location.search('q', $scope.queryString).replace();
            var from = ($scope.pagination.page - 1) * $scope.pagination.itemsPerPage;
            $scope.fetching = true;
            Sofa.containingPhraseInText(nlptabConfig.instanceName + 'search', queryString, from, $scope.pagination.itemsPerPage)
                .then(function (result) {
                    $scope.pagination.totalItems = result.total;

                    var ranges = [];
                    for (var i = 0; i < result.sofas.length; i++) {
                        var sofa = result.sofas[i];
                        var idx = sofa.text.toLowerCase().indexOf(removed.toLowerCase());
                        var end = idx + removed.length;
                        var range = { inner: { begin: idx, end: idx }, outer: { begin: idx, end: end } };
                        ranges.push(range);
                    }
                    $scope.sofas = result.sofas;
                    $scope.ranges = ranges;
                    $scope.fetching = false;
                });
        };

        $scope.$watch('queryString', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                fetchSofas();
            }
        });

        $scope.$watch('pagination.page', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                fetchSofas();
            }
        });

        fetchSofas($scope.queryString);
    });
