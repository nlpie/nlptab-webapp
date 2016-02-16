'use strict';

angular.module('nlptabApp')
    .directive('navbarLink', function () {
        return {
            restrict: 'A',
            require: '^navbar',
            link: function postLink(scope, element, attrs, navbarCtrl) {
                if (attrs.navbarLink === navbarCtrl.selectedLink) {
                    element.addClass('active');
                }
            }
        };
    });
