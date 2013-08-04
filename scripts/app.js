(function() {
  var Verbose;

  Verbose = angular.module('Verbose', ['ui.state', 'ui.bootstrap', 'ngResource', 'firebase']).config(function($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
    var appRoot;
    if (!store.get('words')) {
      store.set('words', []);
    }
    appRoot = "scripts/app";
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: "" + appRoot + "/login/login.html",
      controller: 'loginCtrl'
    }).state('index', {
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
    }).state('quiz', {
      url: '/quiz',
      templateUrl: "" + appRoot + "/quiz/quiz.html",
      controller: "quizCtrl"
    });
    return delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }).run(function($rootScope, $location, $state, Auth) {
    return $rootScope.$on("$stateChangeStart", function(event, next, current) {
      if (next.url === "login") {
        return;
      }
      if ($rootScope.user == null) {
        return $location.path('/login');
      }
    });
  });

}).call(this);

(function() {
  angular.module("Verbose").factory('Auth', function($rootScope) {
    return function(getUser) {
      var auth, fb;
      console.log("asd");
      fb = new Firebase("https://verbose.firebaseio.com");
      return auth = new FirebaseSimpleLogin(fb, function(error, user) {
        if (getUser) {
          return user;
        }
        if (user) {
          $rootScope.user = user;
          return $rootScope.$emit("login", user);
        } else if (error) {
          return $rootScope.$emit("error", error);
        } else {
          return $rootScope.$emit("logout");
        }
      });
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").factory('Dictionary', function($resource) {
    var apiKey, baseUrl;
    baseUrl = "http://api.wordnik.com/v4";
    apiKey = 'c3b45323cb219cf66c5420b4aaa035b8bb6773d9ca99edf7f';
    return function(word, query, type) {
      var url;
      if (type === "words") {
        url = "" + baseUrl + "/words.json/" + query + "/" + word;
      } else {
        url = "" + baseUrl + "/word.json/" + word + "/" + query;
      }
      return $resource(url, {
        api_key: apiKey,
        useCanonical: true,
        caseSensitive: false
      });
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").factory('Suggestion', function($http) {
    var action, apiKey, baseUrl;
    baseUrl = "https://www.macmillandictionary.com/api/v1";
    action = "/dictionaries/american/search/didyoumean";
    apiKey = '3iqW5S1yG1zl2qieARWLforJROD31OKi1Z39KQdpnVKakGWEPXpeS3wy8JihlFcZ';
    return function(word) {
      return $http.jsonp(baseUrl + action + '/', {
        data: {
          accessKey: "3iqW5S1yG1zl2qieARWLforJROD31OKi1Z39KQdpnVKakGWEPXpeS3wy8JihlFcZ",
          q: word,
          entryNumber: 10
        },
        headers: {
          accessKey: apiKey
        }
      });
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").factory('Word', function($rootScope, angularFire, angularFireCollection) {
    var manageUser, updateLocal, wordService, words;
    wordService = {};
    words = [];
    wordService.getAll = function() {
      var fire, user;
      user = manageUser();
      if (!user) {
        return;
      }
      fire = angularFireCollection("https://verbose.firebaseio.com/users/" + user.id + "/words");
      words = store.get('words');
      return words;
    };
    wordService.getWord = function(name) {
      var allWords, word;
      allWords = wordService.getAll();
      word = _.find(allWords, {
        name: name
      });
      return word;
    };
    wordService.getRandomWord = function() {
      var allWords, randomIndex;
      allWords = wordService.getAll();
      randomIndex = Math.floor(Math.random() * allWords.length);
      return allWords[randomIndex];
    };
    wordService.toggleLearned = function(word) {
      word.learned = !word.learned;
      word.dateLearned = word.learned ? new Date() : null;
      return updateLocal();
    };
    wordService.add = function(newWord) {
      var fire, user;
      user = $rootScope.user;
      fire = angularFireCollection("https://verbose.firebaseio.com/users/" + user.id + "/words");
      fire.add(newWord);
      return updateLocal();
    };
    wordService.remove = function(which) {
      var pos;
      pos = words.indexOf(which);
      fire.remove(which);
      words.splice(pos, 1);
      return updateLocal();
    };
    updateLocal = function() {
      return store.set('words', words);
    };
    manageUser = function() {
      var user;
      user = $rootScope.user;
      if (user == null) {
        return false;
      } else {
        return user;
      }
    };
    return wordService;
  });

}).call(this);

(function() {
  angular.module("Verbose").controller('detailCtrl', function($scope, $state, Word) {
    var _ref,
      _this = this;
    $scope.word = Word.getWord($state.params.wordId);
    $scope.dateLearned = (_ref = $scope.word.dateLearned) != null ? _ref : "Not yet learned";
    $scope.phrasesString = $scope.word.phrases.join(", ");
    $scope.synonymString = $scope.word.synonyms.join(", ");
    $scope.$watch("word.learned", function(val) {
      var _ref1;
      $scope.learnedText = val ? "Whoops, forgot" : "Learned it!";
      return $scope.dateLearned = (_ref1 = $scope.word.dateLearned) != null ? _ref1 : "Not yet learned";
    });
    $scope.remove = function(word) {
      return Word.remove(word);
    };
    return $scope.toggleLearned = function(word) {
      return Word.toggleLearned(word);
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
  angular.module("Verbose").directive("focused", function($timeout) {
    return {
      restrict: "A",
      link: function(scope, node) {
        return $timeout(function() {
          return $(node).focus();
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").directive("linedItem", function() {
    return {
      restrict: "A",
      link: function(scope, node) {
        node.addClass('li-lined');
        return node.append("<div class='border-bottom'/>");
      }
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").directive("swipe", function($timeout) {
    return {
      restrict: "E",
      link: function(scope, node) {
        var swipeNode;
        swipeNode = $("<div class='swipe'><div class='swipe-wrap'></div></div>");
        $(node).wrapInner(swipeNode);
        scope.swipe = Swipe($(node).find(".swipe")[0], {
          continuous: false
        });
        return $timeout(function() {
          var height;
          height = $(node).find(".swipe").height();
          return $(node).find('.padding-wrapper').height(height);
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").directive("vCenter", function($timeout) {
    return {
      restrict: "A",
      link: function(scope, node) {
        return setTimeout(function() {
          var child, nodeHeight, _i, _len, _ref, _results;
          node = $(node);
          nodeHeight = node.height();
          _ref = node.children();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            child = $(child);
            _results.push(child.css({
              "margin-top": (nodeHeight - child.height()) / 2
            }));
          }
          return _results;
        }, 100);
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
  angular.module("Verbose").controller('listCtrl', function($scope, Word, Suggestion) {
    var _this = this;
    $scope.words = Word.getAll();
    $scope.orderProp = {
      $: "-dateAdded"
    };
    $scope.query = {
      learned: false
    };
    $scope.$watch("query.learned", function(val) {
      return $scope.learnedText = $scope.query.learned ? "Whoops, forgot" : "Learned it!";
    });
    $scope.remove = function(word) {
      return Word.remove(word);
    };
    return $scope.toggleLearned = function(word) {
      return Word.toggleLearned(word);
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").controller('loginCtrl', function($scope, $rootScope, Auth, Word) {
    var auth;
    auth = Auth();
    $scope.login = function() {
      return auth.login("password", {
        email: $scope.loginForm.email,
        password: $scope.loginForm.password
      });
    };
    $scope.logout = function() {
      return auth.logout();
    };
    $rootScope.$on("login", function(e, user) {
      return $rootScope.user = user;
    });
    return $rootScope.$on("error", function(e, error) {
      return console.log(error);
    });
  });

}).call(this);

(function() {
  angular.module("Verbose").controller('quizCtrl', function($scope, Word) {
    $scope.newQuestion = function() {
      return $scope.word = Word.getRandomWord();
    };
    return $scope.submitAnswer = function() {
      console.log("asd");
      return console.log($scope.word.synonyms.indexOf($scope.guess));
    };
  });

}).call(this);

(function() {
  angular.module("Verbose").controller("searchCtrl", function($scope, $http, $state, $q, Word, Dictionary, generateUid) {
    $scope.searchWord = function(wordSearch) {
      $scope.wordSearch = wordSearch;
      return $scope.definitions = Dictionary(wordSearch, "definitions").query({}, function(data) {
        if (data.length === 0) {
          return Dictionary($scope.wordSearch, "search", "words").get({}, function(data) {
            if (data.searchResults.length > 1) {
              $scope.hasSuggestions = true;
              $scope.noWords = false;
            } else {
              $scope.hasSuggestions = false;
              $scope.noWords = true;
              return;
            }
            return $scope.suggestions = data.searchResults.map(function(d, i) {
              if (i !== 0) {
                return d.word;
              }
            });
          });
        } else {
          $scope.hasSuggestions = false;
          return $scope.noWords = false;
        }
      });
    };
    return $scope.addWord = function(definition) {
      var etymologies, hyphenation, phrases, relatedWords;
      etymologies = Dictionary(definition.word, "etymologies").query().$then();
      phrases = Dictionary(definition.word, "phrases").query().$then();
      hyphenation = Dictionary(definition.word, "hyphenation").query().$then();
      relatedWords = Dictionary(definition.word, "relatedWords").query({
        relationshipTypes: 'synonym'
      }).$then();
      return $q.all([etymologies, phrases, hyphenation, relatedWords]).then(function(data) {
        var hyphen, newWord, synonyms, text, _i, _len, _ref;
        etymologies = data[0].data;
        phrases = data[1].data.map(function(phrase) {
          return phrase.gram1 + " " + phrase.gram2;
        });
        hyphenation = "";
        _ref = data[2].data;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          hyphen = _ref[_i];
          text = hyphen.text;
          if (hyphen.type === "stress") {
            text = "<strong>" + text + "</strong>";
          }
          if (hyphen.seq !== 0) {
            text = "-" + text;
          }
          hyphenation += text;
        }
        synonyms = data[3].data[0].words;
        newWord = {
          id: generateUid(),
          name: definition.word,
          definition: definition.text,
          learned: false,
          partOfSpeech: definition.partOfSpeech,
          phrases: phrases,
          hyphenation: hyphenation,
          synonyms: synonyms,
          dateAdded: new Date(),
          dateLearned: null
        };
        Word.add(newWord);
        return $state.transitionTo('index');
      });
    };
  });

}).call(this);
