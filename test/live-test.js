(function() {
  var Backbone, ajaxyModel, assert, describe, joe, models, modelsObject, pokemonModel, queryEngine, today, tomorrow, yesterday,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  queryEngine = this.queryEngine || require(__dirname + '/../lib/query-engine');

  assert = this.assert || require('assert');

  Backbone = this.Backbone || ((function() {
    try {
      return typeof require === "function" ? require('backbone') : void 0;
    } catch (_error) {}
  })()) || ((function() {
    try {
      return typeof require === "function" ? require('exoskeleton') : void 0;
    } catch (_error) {}
  })()) || ((function() {
    throw 'Need Backbone or Exoskeleton';
  })());

  joe = this.joe || require('joe');

  describe = joe.describe;

  today = new Date();

  today.setHours(0);

  today.setMinutes(0);

  today.setSeconds(0);

  tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  modelsObject = {
    index: {
      id: 'index',
      title: 'Index Page',
      content: 'welcome home',
      tags: [],
      position: 1,
      positionNullable: null,
      category: 1,
      date: today
    },
    jquery: {
      id: 'jquery',
      title: 'jQuery',
      content: 'this is about jQuery',
      tags: ['jquery'],
      position: 2,
      positionNullable: 2,
      category: 1,
      date: yesterday
    },
    history: {
      id: 'history',
      title: 'History.js',
      content: 'this is about History.js',
      tags: ['jquery', 'html5', 'history'],
      position: 3,
      positionNullable: 3,
      category: 1,
      date: tomorrow
    },
    docpad: {
      id: 'docpad',
      title: 'DocPad',
      content: 'this is about DocPad',
      tags: ['nodejs', 'html5'],
      position: 1,
      category: 2,
      date: today
    }
  };

  models = queryEngine.toArray(modelsObject);

  ajaxyModel = {
    id: 'ajaxy',
    title: 'jQuery Ajaxy',
    content: 'this is about jQuery Ajaxy',
    tags: ['jquery'],
    position: 4,
    category: 1,
    date: yesterday
  };

  pokemonModel = {
    id: 'pokemon',
    title: 'Pokemon',
    content: 'Gotta catch em all',
    tags: ['anime'],
    position: 4,
    category: 1,
    date: yesterday
  };

  describe('live', function(describe, it) {
    describe('queries', function(describe, it) {
      it('should only keep jquery related models', function() {
        var actual, expected, liveCollection;
        liveCollection = queryEngine.createLiveCollection().setQuery('only jquery related', {
          tags: {
            $has: ['jquery']
          }
        }).add(models);
        actual = liveCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history];
        return assert.deepEqual(actual, expected);
      });
      it('should support searching', function() {
        var actual, expected, liveCollection;
        liveCollection = queryEngine.createLiveCollection().setFilter('search', function(model, searchString) {
          var pass, searchRegex;
          searchRegex = queryEngine.createSafeRegex(searchString);
          pass = searchRegex.test(model.get('title')) || searchRegex.test(model.get('content'));
          return pass;
        }).setSearchString('about').add(models);
        actual = liveCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history, modelsObject.docpad];
        return assert.deepEqual(actual, expected);
      });
      return describe('pill searches', function(describe, it) {
        it('should support pill searches without spacing', function() {
          var actual, expected, liveCollection;
          liveCollection = queryEngine.createLiveCollection().setPill('id', {
            prefixes: ['id:', '#'],
            callback: function(model, value) {
              var pass, pillRegex;
              pillRegex = queryEngine.createSafeRegex(value);
              pass = pillRegex.test(model.get('id'));
              return pass;
            }
          }).setSearchString('id:index').add(models);
          actual = liveCollection.toJSON();
          expected = [modelsObject.index];
          return assert.deepEqual(actual, expected);
        });
        it('should support pill searches with null', function() {
          var actual, expected, liveCollection;
          liveCollection = queryEngine.createLiveCollection().setPill('positionNullable', {
            prefixes: ['positionNullable:'],
            callback: function(model, value) {
              var pass, pillRegex;
              pillRegex = queryEngine.createSafeRegex(value);
              pass = pillRegex.test(model.get('positionNullable'));
              return pass;
            }
          }).setSearchString('positionNullable:null').add(models);
          actual = liveCollection.toJSON();
          expected = [modelsObject.index];
          return assert.deepEqual(actual, expected);
        });
        it('should support pill searches with spacing', function() {
          var actual, expected, liveCollection;
          liveCollection = queryEngine.createLiveCollection().setPill('id', {
            prefixes: ['id:', '#'],
            callback: function(model, value) {
              var pass, pillRegex;
              pillRegex = queryEngine.createSafeRegex(value);
              pass = pillRegex.test(model.get('id'));
              return pass;
            }
          }).setSearchString('id: index').add(models);
          actual = liveCollection.toJSON();
          expected = [modelsObject.index];
          return assert.deepEqual(actual, expected);
        });
        it('should support pill searches with quotes', function() {
          var actual, expected, liveCollection;
          liveCollection = queryEngine.createLiveCollection().setPill('title', {
            prefixes: ['title:'],
            callback: function(model, value) {
              var pass;
              pass = value === model.get('title');
              return pass;
            }
          }).setSearchString('title:"Index Page"').add(models);
          actual = liveCollection.toJSON();
          expected = [modelsObject.index];
          return assert.deepEqual(actual, expected);
        });
        it('should support pill searches with OR pills', function() {
          var actual, expected, liveCollection;
          liveCollection = queryEngine.createLiveCollection().setPill('tag', {
            prefixes: ['tag:'],
            callback: function(model, value) {
              var pass;
              pass = __indexOf.call(model.get('tags'), value) >= 0;
              return pass;
            }
          }).setSearchString('tag:html5 tag:jquery').add(models);
          actual = liveCollection.toJSON();
          expected = [modelsObject.jquery, modelsObject.history, modelsObject.docpad];
          return assert.deepEqual(actual, expected);
        });
        it('should support pill searches with AND pills', function() {
          var actual, expected, liveCollection;
          liveCollection = queryEngine.createLiveCollection().setPill('tag', {
            logicalOperator: 'AND',
            prefixes: ['tag:'],
            callback: function(model, value) {
              var pass;
              pass = __indexOf.call(model.get('tags'), value) >= 0;
              return pass;
            }
          }).setSearchString('tag:html5 tag:jquery').add(models);
          actual = liveCollection.toJSON();
          expected = [modelsObject.history];
          return assert.deepEqual(actual, expected);
        });
        return it('should support pills searches with filters', function() {
          var actual, expected, liveCollection;
          liveCollection = queryEngine.createLiveCollection().setFilter('search', function(model, searchString) {
            var pass, searchRegex;
            searchRegex = queryEngine.createSafeRegex(searchString);
            pass = searchRegex.test(model.get('content'));
            return pass;
          }).setPill('category', {
            prefixes: ['category:'],
            callback: function(model, value) {
              var pass, pillRegex;
              pillRegex = queryEngine.createSafeRegex(value);
              pass = pillRegex.test(model.get('category'));
              return pass;
            }
          }).setSearchString('category:1 about').add(models);
          actual = liveCollection.toJSON();
          expected = [modelsObject.jquery, modelsObject.history];
          return assert.deepEqual(actual, expected);
        });
      });
    });
    describe('events', function(describe, it) {
      var liveCollection;
      liveCollection = queryEngine.createLiveCollection();
      it('when query is called on our liveCollection, it should successfully filter our models', function() {
        var actual, expected;
        liveCollection.add(models).setQuery('only jquery related', {
          tags: {
            $has: ['jquery']
          }
        }).query();
        actual = liveCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history];
        return assert.deepEqual(actual, expected);
      });
      it('when a model that passes our rules is added to our liveCollection, it should be added', function() {
        var actual, expected;
        liveCollection.add(ajaxyModel);
        actual = liveCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history, ajaxyModel];
        return assert.deepEqual(actual, expected);
      });
      it('when a model that fails our rules is added to our liveCollection, it should NOT be added', function() {
        var actual, expected;
        liveCollection.add(pokemonModel);
        actual = liveCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history, ajaxyModel];
        return assert.deepEqual(actual, expected);
      });
      it('when a model is removed from our liveCollection, it should be removed', function() {
        var actual, expected;
        liveCollection.remove(liveCollection.get('history'));
        actual = liveCollection.toJSON();
        expected = [modelsObject.jquery, ajaxyModel];
        return assert.deepEqual(actual, expected);
      });
      it('when a model is changed in our liveCollection (and no longer supports our rules), it should be removed', function() {
        var actual, expected;
        liveCollection.get('jquery').set('tags', []);
        actual = liveCollection.toJSON();
        expected = [ajaxyModel];
        return assert.deepEqual(actual, expected);
      });
      return it('when our liveCollection is reset, it should be empty', function() {
        var actual, expected;
        liveCollection.reset([]);
        actual = liveCollection.toJSON();
        expected = [];
        return assert.deepEqual(actual, expected);
      });
    });
    describe('parent collections', function(describe, it) {
      var childCollection, parentCollection;
      parentCollection = queryEngine.createCollection(models);
      it('should work with findAllLive with query', function() {
        var actual, childCollection, expected;
        childCollection = parentCollection.findAllLive({
          tags: {
            $has: ['jquery']
          }
        });
        actual = childCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history];
        return assert.deepEqual(actual, expected);
      });
      it('should work with findAllLive with query and comparator', function() {
        var actual, childCollection, expected;
        childCollection = parentCollection.findAllLive({
          tags: {
            $has: ['jquery']
          }
        }, {
          position: -1
        });
        actual = childCollection.toJSON();
        expected = [modelsObject.history, modelsObject.jquery];
        return assert.deepEqual(actual, expected);
      });
      childCollection = parentCollection.createLiveChildCollection();
      it('when query is called on our childCollection, it should successfully filter our parentCollection', function() {
        var actual, expected;
        childCollection.setQuery('only jquery related', {
          tags: {
            $has: ['jquery']
          }
        }).query();
        actual = childCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history];
        return assert.deepEqual(actual, expected);
      });
      it('when a model that passes our rules is added to the parentCollection, it should be added to the childCollection', function() {
        var actual, expected;
        parentCollection.add(ajaxyModel);
        actual = childCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history, ajaxyModel];
        return assert.deepEqual(actual, expected);
      });
      it('when a model that fails our rules is added to the parentCollection, it should NOT be added to the childCollection', function() {
        var actual, expected;
        parentCollection.add(pokemonModel);
        actual = childCollection.toJSON();
        expected = [modelsObject.jquery, modelsObject.history, ajaxyModel];
        return assert.deepEqual(actual, expected);
      });
      it('when a model is removed from our parentCollection, it should be removed from our childCollection', function() {
        var actual, expected;
        parentCollection.remove(parentCollection.get('history'));
        actual = childCollection.toJSON();
        expected = [modelsObject.jquery, ajaxyModel];
        return assert.deepEqual(actual, expected);
      });
      it('when a model is changed from our parentCollection (and no longer supports our rules), it should be removed from our childCollection', function() {
        var actual, expected;
        parentCollection.get('jquery').set('tags', []);
        actual = childCollection.toJSON();
        expected = [ajaxyModel];
        return assert.deepEqual(actual, expected);
      });
      it('when a model is changed from our parentCollection (and now supports our rules), it should be added to our childCollection', function() {
        var actual, expected;
        parentCollection.get('jquery').set('tags', ['jquery']);
        actual = childCollection.toJSON();
        expected = [ajaxyModel, modelsObject.jquery];
        return assert.deepEqual(actual, expected);
      });
      return it('when our parentCollection is reset, our childCollection should be reset too', function() {
        var actual, expected;
        parentCollection.reset([]);
        actual = childCollection.toJSON();
        expected = [];
        return assert.deepEqual(actual, expected);
      });
    });
    return describe('parent collections: many levels', function(describe, it) {
      var childCollectionLevel2, childCollectionLevel3, childCollectionLevel4, parentCollection;
      parentCollection = queryEngine.createCollection(models);
      childCollectionLevel2 = parentCollection.findAllLive({
        tags: {
          $has: ['jquery']
        }
      });
      childCollectionLevel3 = childCollectionLevel2.findAllLive({
        tags: {
          $has: ['html5']
        }
      });
      childCollectionLevel4 = childCollectionLevel3.findAllLive({
        category: 1
      });
      it('removes triggered by changes trickle through children correctly', function() {
        var actual, expected;
        parentCollection.where({
          id: 'history'
        })[0].set({
          'tags': ['html5', 'history']
        });
        actual = childCollectionLevel4.toJSON();
        expected = [];
        return assert.deepEqual(actual, expected);
      });
      return it('additions triggered by changes trickle through children correctly', function() {
        var actual, expected;
        parentCollection.where({
          id: 'history'
        })[0].set({
          'tags': ['jquery', 'html5', 'history']
        });
        actual = childCollectionLevel4.toJSON();
        expected = [modelsObject.history];
        return assert.deepEqual(actual, expected);
      });
    });
  });

  null;

}).call(this);
