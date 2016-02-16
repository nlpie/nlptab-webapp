'use strict';

var NAMES_MAP = {
  'uima.cas.Boolean': 'booleanFeatures',
  'uima.cas.Byte': 'byteFeatures',
  'uima.cas.Short': 'shortFeatures',
  'uima.cas.Integer': 'intFeatures',
  'uima.cas.Long': 'longFeatures',
  'uima.cas.Float': 'floatFeatures',
  'uima.cas.Double': 'doubleFeatures',
  'uima.cas.String': 'stringFeatures',
  'uima.cas.BooleanArray': 'BooleanArrayFeatures',
  'uima.cas.ByteArray': 'ByteArrayFeatures',
  'uima.cas.ShortArray': 'ShortArrayFeatures',
  'uima.cas.IntegerArray': 'IntegerArrayFeatures',
  'uima.cas.LongArray': 'LongArrayFeatures',
  'uima.cas.FloatArray': 'FloatArrayFeatures',
  'uima.cas.DoubleArray': 'DoubleArrayFeatures',
  'uima.cas.StringArray': 'StringArrayFeatures',
  'uima.cas.FloatList': 'FloatListFeatures',
  'uima.cas.IntegerList': 'IntegerListFeatures',
  'uima.cas.StringList': 'StringListFeatures'
};

angular.module('nlptabApp')
  .service('Type',
    /**
     * @class nlptabApp.common.Type
     * @description service for fetching type objects from elasticsearch.
     * @param $q angular Q service, injected.
     * @param Es elasticsearch service, injected.
     */
    function ($q, Es) {
      this.allInSystem = function (systemIndex, from, size, filter, source) {
        var search = {
          index: systemIndex,
          type: 'Type',
          body: {
            from: from,
            size: size,
            query: {},
            sort: [
              {
                'typeShortName.raw': {order: 'asc'}
              }
            ]
          }
        };
        if (filter && filter.length > 0) {
          search.body.query.match = {
            typeShortName: filter
          };
        } else {
          search.body.query.match_all = {};
        }

        if (source) {
          search.body._source = source;
        }

        return Es.search(search).then(function (result) {
          if (result && result.hits && result.hits.hits) {
            var sources = result.hits.hits.map(function (val) {
              return angular.extend(val._source, {
                _id: val._id
              });
            });
            return {total: result.hits.total, types: sources};
          } else {
            return {total: 0, types: []};
          }
        });
      };

      this.withName = function (systemIndex, typeName) {
        return Es.search({
          index: systemIndex,
          type: 'Type',
          body: {
            size: 1,
            query: {
              term: {
                typeName: typeName
              }
            }
          }
        }).then(function (body) {
          if (body && body.hits && body.hits.hits && body.hits.hits.length > 0) {
            return body.hits.hits[0]._source;
          } else {
            return $q.reject('not found');
          }
        });
      };

      this.findChildren = function (systemIndex, typeName) {
        return Es.search({
          index: systemIndex,
          type: 'Type',
          body: {
            size: 0,
            query: {
              term: {
                'parentTypes.raw': typeName
              }
            },
            aggs: {
              typeNames: {
                terms: {
                  field: 'typeName',
                  size: 0,
                  order: {
                    _term: 'asc'
                  }
                }
              }
            }
          }
        }).then(function (body) {
          if (body && body.aggregations && body.aggregations.typeNames && body.aggregations.typeNames.buckets) {
            return body.aggregations.typeNames.buckets.map(function (val) {
              return val.key;
            });
          } else {
            return $q.reject();
          }
        });
      };

      this.subclasses = function (systemIndex, superclassName) {
        return Es.search({
          index: systemIndex,
          type: 'Type',
          body: {
            size: 30,
            query: {
              term: {
                'parentTypes.raw': superclassName
              }
            }
          }
        }).then(function (body) {
          if (body && body.hits && body.hits.hits && body.hits.hits.length) {
            return body.hits.hits.map(function (val) {
              return val._source;
            });
          } else {
            return [];
          }
        });
      };

      this.mapFeatureName = function (feature) {
        var path = NAMES_MAP[feature.valueType];
        return path + '.' + feature.name.replace(/\./g, '_').replace(':', ';');
      };
    });
