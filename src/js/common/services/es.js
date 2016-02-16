'use strict';

angular.module('nlptabApp').
    service('Es', function Es(esFactory, $location, nlptabConfig) {
        return esFactory({
            host: nlptabConfig.esServer
        });
    });
