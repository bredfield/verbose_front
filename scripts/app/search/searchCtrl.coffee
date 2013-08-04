
angular.module("Verbose").controller "searchCtrl", ($scope, $http, $state, $q, Word, Dictionary, generateUid)->
	
	$scope.searchWord = (wordSearch)->
		##update input model (for suggestion click)
		$scope.wordSearch = wordSearch

		$scope.definitions = Dictionary(wordSearch,"definitions").query {},(data)->

			if data.length == 0 
				Dictionary($scope.wordSearch, "search", "words").get {},(data)->
					if data.searchResults.length > 1
						$scope.hasSuggestions = true
						$scope.noWords = false
					else 
						$scope.hasSuggestions = false
						$scope.noWords = true
						return

					$scope.suggestions = data.searchResults.map (d,i)->
						if i != 0
							return d.word
			else
				$scope.hasSuggestions = false
				$scope.noWords = false


	$scope.addWord = (definition)->
		etymologies = Dictionary(definition.word, "etymologies").query().$then()
		phrases = Dictionary(definition.word, "phrases").query().$then()
		hyphenation = Dictionary(definition.word, "hyphenation").query().$then()
		relatedWords = Dictionary(definition.word, "relatedWords").query({relationshipTypes:'synonym'}).$then()
		
		$q.all([etymologies,phrases,hyphenation,relatedWords]).then (data)->
			etymologies = data[0].data
			phrases = data[1].data.map (phrase)->
				phrase.gram1 + " " + phrase.gram2
			hyphenation = ""

			for hyphen in data[2].data
				text = hyphen.text
				if hyphen.type == "stress" then text = "<strong>#{text}</strong>"
				if hyphen.seq != 0 then text = "-#{text}"
				hyphenation += text

			synonyms = data[3].data[0].words

			newWord = 
				id: generateUid()
				name:definition.word
				definition:definition.text
				learned:false
				partOfSpeech:definition.partOfSpeech
				phrases:phrases
				hyphenation:hyphenation
				synonyms:synonyms
				dateAdded:new Date()
				dateLearned:null

			Word.add(newWord)
			$state.transitionTo('index')
		

