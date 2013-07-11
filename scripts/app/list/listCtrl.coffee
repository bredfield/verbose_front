
angular.module("Verbose").controller 'listCtrl', ($scope, Word)->
	$scope.words = Word.getAll()

	$scope.query =
		learned:false

	$scope.$watch "query.learned", (val)=>
		$scope.learnedText = if $scope.query.learned then "Whoops, forgot" else "Learned it!"


	$scope.orderProp = "-dateAdded"

	$scope.setOrderBy = ()=>
		return $scope.orderProp

	$scope.remove = (word)->
		Word.remove(word)

	$scope.toggleLearned = (word)->
		Word.toggleLearned(word)