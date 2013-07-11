angular.module("Verbose").factory 'Word', ()->
	wordService = {}
	words = []

	wordService.getAll = ()->
		words = store.get('words')
		return words

	wordService.getWord = (name)->
		allWords = wordService.getAll()
		word = _.find(allWords, {name:name})
		console.log name
		return word

	wordService.toggleLearned = (word)->
		word.learned = !word.learned
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
