
angular.module("Verbose").controller 'detailCtrl', ($scope, $state, Word)->

	$scope.word = Word.getWord($state.params.wordId)
	$scope.dateLearned = $scope.word.dateLearned ? "Not yet learned"
	$scope.phrasesString = $scope.word.phrases.join ", "
	$scope.synonymString = $scope.word.synonyms.join ", "

	$scope.$watch "word.learned", (val)=>
		$scope.learnedText = if val then "Whoops, forgot" else "Learned it!"
		$scope.dateLearned = $scope.word.dateLearned ? "Not yet learned"

	$scope.remove = (word)->
		Word.remove(word)

	$scope.toggleLearned = (word)->
		Word.toggleLearned(word)