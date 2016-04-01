'use strict';

angular.module('nlptabApp')
    .directive('fsInstanceId', function () {
        return {
            template: '<a ng-if="fsId" ng-click="open()">{{fsId}} <span class="glyphicon glyphicon-new-window"></span></a>' +
                '<span ng-if="!fsId">null</span>',
            scope: {
                fsId: '=',
                systemIndex: '='
            },
            restrict: 'E',
            controller: function ($scope, $modal) {
                $scope.open = function () {
                    if ($scope.fsId) {
                        $modal.open({
                            templateUrl: './partials/common/fs-instance-modal.html',
                            controller: 'FsInstanceModalCtrl',
                            size: 'lg',
                            resolve: {
                                fsId: function () {
                                    return $scope.fsId;
                                },
                                systemIndex: function () {
                                    return $scope.systemIndex;
                                }
                            }
                        });
                    }
                };
            }
        };
    });
