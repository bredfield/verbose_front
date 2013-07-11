
angular.module("Verbose").controller 'detailCtrl', ($scope, $state, Word)->
	word = Word.getWord($state.params.wordId)

	$scope.word = if word? then word else {name:"Word not saved"}