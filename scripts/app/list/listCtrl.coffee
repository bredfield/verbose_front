
angular.module("Verbose").controller 'listCtrl', ($scope, Word, Suggestion)->
	$scope.words = Word.getAll()
	
	$scope.orderProp = 
		$:"-dateAdded"

	$scope.query =
		learned:false

	$scope.$watch "query.learned", (val)=>
		$scope.learnedText = if $scope.query.learned then "Whoops, forgot" else "Learned it!"
	

	$scope.remove = (word)->
		Word.remove(word)

	$scope.toggleLearned = (word)->
		Word.toggleLearned(word)
