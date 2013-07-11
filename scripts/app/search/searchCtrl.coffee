
angular.module("Verbose").controller "searchCtrl", ($scope, $http, $state, Word, generateUid)->
	$scope.words = Word.getAll()

	$scope.searchWord = ()->
		$http(
			method:'get'
			url:"http://api.wordnik.com/v4/word.json/#{$scope.wordSearch}/definitions"
			params:
				api_key:'c3b45323cb219cf66c5420b4aaa035b8bb6773d9ca99edf7f'
				limit:10
			data: 
				api_key: 'c3b45323cb219cf66c5420b4aaa035b8bb6773d9ca99edf7f'
		).success (data)->
			$scope.definitions = data

	$scope.addWord = (definition)->
		newWord = 
			id: generateUid()
			name:definition.word
			definition:definition.text
			learned:false
			partOfSpeech:definition.partOfSpeech
			dateAdded:new Date()
		console.log newWord
		Word.add(newWord)
		$state.transitionTo('index')
