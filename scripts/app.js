(function() {
  var Verbose;

  Verbose = angular.module('Verbose', ['ui.state', 'ui.bootstrap']).config(function($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
    var appRoot;
    if (!store.get('words')) {
      store.set('words', []);
    }
    appRoot = "scripts/app";
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('index', {
      url: '/',
      templateUrl: "views/wordList.html",
      controller: 'listCtrl'
    }).state('detail', {
      url: '/words/:wordId',
      templateUrl: "" + appRoot + "/detail/wordDetail.html",
      controller: 'detailCtrl'
    }).state('search', {
      url: '/search',
      templateUrl: "views/search.html",
      controller: "searchCtrl"
    });
    $httpProvider.defaults.useXDomain = true;
    return delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });

}).call(this);

(function() {
  angular.module("Verbose").factory('Word', function() {
    var updateLocal, wordService, words;
    wordService = {};
    words = [];
    wordService.getAll = function() {
      words = store.get('words');
      return words;
    };
    wordService.getWord = function(name) {
      var allWords, word;
      allWords = wordService.getAll();
      word = _.find(allWords, {
        name: name
      });
      console.log(name);
      return word;
    };
    wordService.toggleLearned = function(word) {
      word.learned = !word.learned;
      return updateLocal();
    };
    wordService.add = function(newWord) {
      words.push(newWord);
      return updateLocal();
    };
    wordService.remove = function(which) {
      var pos;
      pos = words.indexOf(which);
      words.splice(pos, 1);
      return updateLocal();
    };
    updateLocal = function() {
      return store.set('words', words);
    };
    return wordService;
  });

}).call(this);

(function() {
  angular.module("Verbose").controller('detailCtrl', function($scope, $state, Word) {
    var word;
    word = Word.getWord($state.params.wordId);
    return $scope.word = word != null ? word : {
      name: "Word not saved"
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").directive("activeLink", function($location) {
    return {
      restrict: "A",
      link: function(scope, node) {
        var path;
        path = $(node).find('a').attr("href");
        path = path.substring(1);
        scope.location = $location;
        return scope.$watch("location.path()", function(newPath) {
          var method;
          method = path === newPath ? 'add' : 'remove';
          return node["" + method + "Class"]('active');
        });
      }
    };
  });

}).call(this);

(function() {
  var Verbose;

  Verbose = angular.module("Verbose");

  Verbose.factory("generateUid", function() {
    return function(separator) {
      var S4, delim;
      delim = separator || "-";
      S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4();
    };
  });

  Verbose.filter("capitalize", function() {
    return function(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").controller('listCtrl', function($scope, Word) {
    var _this = this;
    $scope.words = Word.getAll();
    $scope.query = {
      learned: false
    };
    $scope.$watch("query.learned", function(val) {
      return $scope.learnedText = $scope.query.learned ? "Whoops, forgot" : "Learned it!";
    });
    $scope.orderProp = "-dateAdded";
    $scope.setOrderBy = function() {
      return $scope.orderProp;
    };
    $scope.remove = function(word) {
      return Word.remove(word);
    };
    return $scope.toggleLearned = function(word) {
      return Word.toggleLearned(word);
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").controller("searchCtrl", function($scope, $http, $state, Word, generateUid) {
    $scope.words = Word.getAll();
    $scope.searchWord = function() {
      return $http({
        method: 'get',
        url: "http://api.wordnik.com/v4/word.json/" + $scope.wordSearch + "/definitions",
        params: {
          api_key: 'c3b45323cb219cf66c5420b4aaa035b8bb6773d9ca99edf7f',
          limit: 10
        },
        data: {
          api_key: 'c3b45323cb219cf66c5420b4aaa035b8bb6773d9ca99edf7f'
        }
      }).success(function(data) {
        return $scope.definitions = data;
      });
    };
    return $scope.addWord = function(definition) {
      var newWord;
      newWord = {
        id: generateUid(),
        name: definition.word,
        definition: definition.text,
        learned: false,
        partOfSpeech: definition.partOfSpeech,
        dateAdded: new Date()
      };
      console.log(newWord);
      Word.add(newWord);
      return $state.transitionTo('index');
    };
  });

}).call(this);
