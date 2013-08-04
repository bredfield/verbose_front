angular.module("Verbose").factory 'Word', ($rootScope, angularFire, angularFireCollection)->
	wordService = {}
	words = []
	# user = $rootScope.user

	wordService.getAll = ()->
		words = store.get('words')
		return words

	wordService.getWord = (name)->
		allWords = wordService.getAll()
		word = _.find(allWords, {name:name})
		return word

	wordService.getRandomWord = ()->
		allWords = wordService.getAll()
		randomIndex = Math.floor(Math.random()*allWords.length)
		return allWords[randomIndex]

	wordService.toggleLearned = (word)->
		word.learned = !word.learned
		word.dateLearned = if word.learned then new Date() else null

		updateLocal()

	wordService.add = (newWord)->
		words.push newWord
		updateLocal()

	wordService.remove = (which)->
		pos = words.indexOf(which)
		words.splice(pos,1)
		updateLocal()

	updateLocal = ()->
		store.set('words', words)

	return wordService
