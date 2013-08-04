
angular.module("Verbose").controller 'quizCtrl', ($scope, Word)->

	# $scope.newQuestion()

	$scope.newQuestion = ()->
		$scope.word = Word.getRandomWord()

	$scope.submitAnswer = ()->
		console.log "asd"
		console.log $scope.word.synonyms.indexOf $scope.guess 

	# $scope.words = Word.getAll()
	
	# $scope.orderProp = 
	# 	$:"-dateAdded"

	# $scope.query =
	# 	learned:false

	# $scope.$watch "query.learned", (val)=>
	# 	$scope.learnedText = if $scope.query.learned then "Whoops, forgot" else "Learned it!"
	

	# $scope.remove = (word)->
	# 	Word.remove(word)

	# $scope.toggleLearned = (word)->
	# 	Word.toggleLearned(word)