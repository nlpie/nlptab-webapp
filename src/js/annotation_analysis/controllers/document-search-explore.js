'use strict';

angular.module('nlptabApp')
    .controller('DocumentSearchExploreCtrl', function ($scope, $routeParams, $location, $q, sofa, systems) {
        // scope properties
        var indexes = systems.casProcessingIndexes.map(function (obj) {
            return obj.index;
        });
        $scope.sofaIdentifier = $routeParams.sofaIdentifier;
        $scope.sofaText = sofa.text;
        $scope.textSpan = {
            begin: +$routeParams.begin,
            end: +$routeParams.end || $scope.sofaText.length
        };

        $scope.searchingAnnotatations = false;

        var updateRanges = function () {
            $scope.highlightedRange = {
                outer: $scope.textSpan
            };
            if ($scope.selectedAnnotationLocation) {
                $scope.highlightedRange.inner = {
                    begin: $scope.selectedAnnotationLocation.begin,
                    end: $scope.selectedAnnotationLocation.end
                };
            } else {
                $scope.highlightedRange.inner = {
                    begin: $scope.textSpan.begin,
                    end: $scope.textSpan.begin
                };
            }
        };

        $scope.$watch('textSpan', function () {
            if ($scope.selectedAnnotationLocation &&
                $scope.textSpan.begin >= $scope.selectedAnnotationLocation.begin) {
                delete $scope.selectedAnnotationLocation;
            }
            if ($scope.selectedAnnotationLocation &&
                $scope.textSpan.end <= $scope.selectedAnnotationLocation.end) {
                delete $scope.selectedAnnotationLocation;
            }
            $location.search('begin', $scope.textSpan.begin).replace();
            $location.search('end', $scope.textSpan.end).replace();
            updateRanges();
        }, true);

        $scope.selectTypeInSystem = function (typeInSystem, index) {
            if ($scope.selectedTypeInSystem === typeInSystem) {
                $scope.clearSelectedTypeInSystem();
            } else {
                $scope.selectedTypeInSystem = typeInSystem;
                $location.search('tindex', index).replace();
            }
        };

        $scope.clearSelectedTypeInSystem = function () {
            delete $scope.selectedAnnotationLocation;
            updateRanges();
            delete $scope.selectedTypeInSystem;
            $location.search('tindex', null).replace();
        };

        $scope.selectAnnotationLocation = function (annotationLocation) {
            $scope.selectedAnnotationLocation = annotationLocation;
            updateRanges();
        };

        $scope.clearSelectedText = function () {
            $scope.textSpan.begin = 0;
            $scope.textSpan.end = 0;
        };

        $scope.checkSelectedText = function () {
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            $scope.textSpan.begin = range.startOffset;
            $scope.textSpan.end = range.endOffset;
            selection.removeAllRanges();
        };

        updateRanges();
    });
