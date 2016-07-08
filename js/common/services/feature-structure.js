'use strict';

angular.module('nlptabApp').service('FeatureStructure',
  /**
   * @class nlptabApp.common.FeatureStructure
   * @description service for fetching feature structures from elasticsearch.
   * @param $q angular promises service.
   * @param Es elasticsearch service
   * @constructor
   */
  function FeatureStructure($q, Es) {
    function mapSources(body) {
      return body.hits.hits.map(function (currentValue) {
        return angular.extend(currentValue._source, {
          '_index': currentValue._index,
          '_id': currentValue._id
        });
      });
    }

    this.withId = function (fsId, systemIndex) {
      var search = {};

      if (systemIndex) {
        search.index = systemIndex;
      }

      search.type = 'FeatureStructure';
      search.body = {
        query: {
          ids: {
            values: [
              fsId
            ]
          }
        },
        size: 1
      };

      var deferred = $q.defer();
      Es.search(search).then(function (body) {
        if (body && body.hits && body.hits.hits && body.hits.hits.length > 0) {
          deferred.resolve(angular.extend(body.hits.hits[0]._source, {
            _index: body.hits.hits[0]._index,
            _id: body.hits.hits[0]._id
          }));
        } else {
          deferred.resolve(null);
        }

      });
      return deferred.promise;
    };

    this.ofType = function (index, type, from, size) {
      return Es.search({
        index: index,
        type: 'FeatureStructure',
        body: {
          size: size,
          from: from,
          query: {
            match: {
              'types': type
            }
          }
        }
      }).then(function (body) {
        if (body && body.hits && body.hits.hits) {
          return {total: body.hits.total, featureStructures: mapSources(body)};
        } else {
          return $q.reject();
        }
      });
    };

    this.primaryTypesFor = function (systemIndex, type) {
      return Es.search({
        index: systemIndex,
        type: 'FeatureStructure',
        body: {
          size: 0,
          query: {
            term: {
              types: {
                value: type
              }
            }
          },
          aggs: {
            typeNames: {
              terms: {
                field: 'primaryType',
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

    /**
     * @param index
     * @param type
     * @param primaryTypes
     * @param {nlptabApp.common.PaginationInstance} pagination
     * @returns {*}
     */
    this.ofTypeWithoutPrimaryTypes = function (index, type, primaryTypes, pagination) {
      return Es.search({
        index: index,
        type: 'FeatureStructure',
        body: {
          size: pagination.getSize(),
          from: pagination.getFrom(),
          query: {
            bool: {
              must: [
                {
                  term: {
                    types: {
                      value: type
                    }
                  }
                }
              ],
              must_not: [
                {
                  terms: {
                    primaryType: primaryTypes
                  }
                }
              ]
            }
          }
        }
      }).then(function (body) {
        if (body && body.hits && body.hits.hits) {
          pagination.totalItems = body.hits.total;
          return mapSources(body);
        } else {
          return $q.reject();
        }
      });
    };

    this.termsNotIn = function (index, type, feature, terms, size) {
      var isBoolean = feature.indexOf('booleanFeatures') === 0;
      return Es.search({
        index: index,
        type: 'FeatureStructure',
        body: {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    types: type
                  }
                }
              ],
              must_not: [
                {
                  terms: {
                    feature: terms
                  }
                }
              ]
            }
          },
          aggs: {
            values: {
              terms: {
                field: feature,
                size: angular.isDefined(size) ? size : 10
              }
            },
            missingValues: {
              missing: {
                field: feature
              }
            }
          }
        }
      }).then(function (body) {
        var buckets = {};
        if (body && body.aggregations && body.aggregations.values) {
          buckets.values = body.aggregations.values.buckets;
          if (isBoolean) {
            buckets.values = buckets.values.map(function (bucket) {
              bucket.key = bucket.key === 'T';
              return bucket;
            });
          }
        }
        if (body && body.aggregations && body.aggregations.missingValues) {
          buckets.missing = body.aggregations.missingValues;
        }
        if (body && body.hits) {
          buckets.count = body.hits.total;
        }
        return buckets;
      });
    };

    this.termsAndMissingForFeature = function (index, type, feature, size) {
      var isBoolean = feature.indexOf('booleanFeatures') === 0;
      return Es.search({
        index: index,
        type: 'FeatureStructure',
        body: {
          size: 0,
          query: {
            term: {
              types: type
            }
          },
          aggs: {
            values: {
              terms: {
                field: feature,
                size: angular.isDefined(size) ? size : 10
              }
            },
            missingValues: {
              missing: {
                field: feature
              }
            }
          }
        }
      }).then(function (body) {
        var buckets = {};
        if (body && body.aggregations && body.aggregations.values) {
          buckets.values = body.aggregations.values.buckets;
          if (isBoolean) {
            buckets.values = buckets.values.map(function (bucket) {
              bucket.key = bucket.key === 'T';
              return bucket;
            });
          }
        }
        if (body && body.aggregations && body.aggregations.missingValues) {
          buckets.missing = body.aggregations.missingValues;
        }
        if (body && body.hits) {
          buckets.count = body.hits.total;
        }
        return buckets;
      });
    };

    this.termsMissingAndCardinalityForFeature = function (index, type, feature, size) {
      return Es.search({
        index: index,
        type: 'FeatureStructure',
        body: {
          size: 0,
          query: {
            term: {
              types: type
            }
          },
          aggs: {
            values: {
              terms: {
                field: feature,
                size: angular.isUndefined(size) ? 10 : size
              }
            },
            missingValues: {
              missing: {
                field: feature
              }
            },
            others: {
              cardinality: {
                field: feature,
                precision_threshold: 10000
              }
            }
          }
        }
      }).then(function (body) {
        var buckets = {};
        if (body && body.aggregations && body.aggregations.values) {
          buckets.values = body.aggregations.values.buckets;
        }
        if (body && body.aggregations && body.aggregations.missingValues) {
          buckets.missing = body.aggregations.missingValues;
        }
        if (body && body.aggregations && body.aggregations.others) {
          buckets.otherUniqueValues = body.aggregations.others;
        }
        if (body && body.hits) {
          buckets.count = body.hits.total;
        }
        return buckets;
      });
    };

    this.termsMissingCardinalityAndPercentilesForFeature = function (index, type, feature) {
      var deferred = $q.defer();

      Es.search({
        index: index,
        type: 'FeatureStructure',
        body: {
          size: 0,
          query: {
            term: {
              types: type
            }
          },
          aggs: {
            values: {
              terms: {
                field: feature
              }
            },
            missingValues: {
              missing: {
                field: feature
              }
            },
            others: {
              cardinality: {
                field: feature,
                precision_threshold: 10000
              }
            },
            percentiles: {
              percentiles: {
                field: feature
              }
            }
          }
        }
      }).then(function (body) {
        var buckets = {};
        if (body && body.aggregations && body.aggregations.values) {
          buckets.values = body.aggregations.values.buckets;
        }
        if (body && body.aggregations && body.aggregations.missingValues) {
          buckets.missing = body.aggregations.missingValues;
        }
        if (body && body.aggregations && body.aggregations.others) {
          buckets.otherUniqueValues = body.aggregations.others;
        }
        if (body && body.aggregations && body.aggregations.percentiles) {
          var percentiles = [];
          for (var percentile in body.aggregations.percentiles.values) {
            if (body.aggregations.percentiles.values.hasOwnProperty(percentile)) {
              percentiles.push({
                percentile: +percentile,
                count: body.aggregations.percentiles.values[percentile]
              });
            }
          }
          buckets.percentiles = percentiles;
        }
        if (body && body.hits) {
          buckets.count = body.hits.total;
        }
        deferred.resolve(buckets);
      });
      return deferred.promise;
    };

    this.countTotal = function (index) {
      var deferred = $q.defer();
      Es.search({
        index: index,
        type: 'FeatureStructure',
        search_type: 'count'
      }).then(function (body) {
        if (body && body.hits) {
          deferred.resolve(body.hits.total);
        }
      });
      return deferred.promise;
    };

    this.countOfType = function (index, type) {
      var deferred = $q.defer();
      Es.search({
        index: index,
        type: 'FeatureStructure',
        search_type: 'count',
        body: {
          query: {
            term: {
              types: type
            }
          }
        }
      }).then(function (body) {
        if (body && body.hits) {
          deferred.resolve(body.hits.total);
        }
      });
      return deferred.promise;
    };

    this.withTypeInSystemAtLocation = function (type, systemIndex, documentIdentifier, beginMin, beginMax, endMin, endMax, page) {
      var sBody = {
        size: 1,
        from: page - 1,
        query: {
          bool: {
            must: [
              {
                term: {
                  types: type
                }
              },
              {
                term: {
                  documentIdentifier: documentIdentifier
                }
              },
              {
                range: {
                  'primaryLocation.begin': {
                    gte: beginMin,
                    lte: beginMax
                  }
                }
              },
              {
                range: {
                  'primaryLocation.end': {
                    gte: endMin,
                    lte: endMax
                  }
                }
              }
            ]
          }
        }
      };
      sBody.sort = [
        {'primaryLocation.begin': 'asc'},
        {'primaryLocation.end': 'asc'}
      ];

      var deferred = $q.defer();
      Es.search({
        index: systemIndex,
        type: 'FeatureStructure',
        body: sBody
      }).then(function (body) {
        var featureStructure;
        var totalItems = 0;
        if (body && body.hits && body.hits.hits && body.hits.hits.length > 0) {
          var hit = body.hits.hits[0];
          featureStructure = hit._source;
          featureStructure._id = hit._id;
          totalItems = body.hits.total;
        }
        deferred.resolve({totalItems: totalItems, featureStructure: featureStructure});
      });

      return deferred.promise;
    };

    this.getTypesInRange = function (indexes, documentIdentifier, begin, end) {
      var sBody = {
        size: 0,
        'query': {
          bool: {
            must: [
              {
                range: {
                  'primaryLocation.begin': {
                    gte: begin,
                    lte: end
                  }
                }
              },
              {
                range: {
                  'primaryLocation.end': {
                    gte: begin,
                    lte: end
                  }
                }
              },
              {
                term: {
                  documentIdentifier: documentIdentifier
                }
              }
            ]
          }
        },
        'aggs': {
          'systemTerms': {
            'terms': {
              'field': 'system',
              'order': {
                '_term': 'asc'
              },
              'size': 0
            },
            'aggs': {
              'typeTerms': {
                'terms': {
                  'field': 'types',
                  'order': {
                    '_term': 'asc'
                  },
                  'size': 0
                }
              }
            }
          }
        }
      };
      var deferred = $q.defer();
      Es.search({
        index: indexes,
        type: 'FeatureStructure',
        search_type: 'count',
        body: sBody
      }).then(function (body) {
        var typeInSystems = [];
        if (body && body.aggregations && body.aggregations.systemTerms && body.aggregations.systemTerms.buckets) {
          var systemBuckets = body.aggregations.systemTerms.buckets;
          for (var i = 0; i < systemBuckets.length; i++) {
            var systemKey = systemBuckets[i].key;
            if (systemBuckets[i].typeTerms && systemBuckets[i].typeTerms.buckets) {
              var typeBuckets = systemBuckets[i].typeTerms.buckets;
              for (var j = 0; j < typeBuckets.length; j++) {
                typeInSystems.push({
                  systemIndex: systemKey,
                  type: typeBuckets[j].key,
                  count: typeBuckets[j].doc_count
                });
              }
            }
          }
        }
        deferred.resolve(typeInSystems);
      }, function (error) {
        deferred.reject();
      });

      return deferred.promise;
    };

    this.inSystemWithType = function (systemIndex, type, pagination) {
      return Es.search({
        index: systemIndex,
        type: 'FeatureStructure',
        body: {
          size: pagination.getSize(),
          from: pagination.getFrom(),
          query: {
            term: {
              types: type
            }
          }
        }
      }).then(function (result) {
        return {
          total: result.hits.total,
          featureStructures: mapSources(result)
        };
      });
    };

    var featureTypeMap = {
      'uima.cas.Boolean': 'booleanFeatures',
      'uima.cas.Byte': 'byteFeatures',
      'uima.cas.Double': 'doubleFeatures',
      'uima.cas.Float': 'floatFeatures',
      'uima.cas.Integer': 'intFeatures',
      'uima.cas.Long': 'longFeatures',
      'uima.cas.Short': 'shortFeatures',
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

    this.mapToEsFeature = function (feature) {
      return featureTypeMap[feature.valueType] + '.' + feature.name.replace(/\./g, '_').replace(':', ';');
    };
  });
