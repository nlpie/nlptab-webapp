angular.module('nlptabApp')
  .constant('nlptabConfig', {
    instanceName: 'default',
    esServer: 'http://localhost:9200',
    isSecure: true,
    isBio: false
  });
