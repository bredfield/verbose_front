angular.module("Verbose").factory 'Word', ($rootScope, angularFire, angularFireCollection)->
	wordService = {}
	words = []
	# user = $rootScope.user
	##if no user, redirect to login (JIC)
	# fire = angularFireCollection("https://verbose.firebaseio.com/users/#{user.id}/words")

	wordService.getAll = ()->
		user = manageUser()

		return if !user

		fire = angularFireCollection("https://verbose.firebaseio.com/users/#{user.id}/words")
		words = store.get('words')
		# words = fire
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
		# words.push newWord
		user = $rootScope.user
		fire = angularFireCollection("https://verbose.firebaseio.com/users/#{user.id}/words")
		fire.add newWord
		updateLocal()

	wordService.remove = (which)->
		pos = words.indexOf(which)
		fire.remove which
		words.splice(pos,1)
		updateLocal()

	updateLocal = ()->
		store.set('words', words)

	manageUser = ()->
		user = $rootScope.user
		if !user? then return false else return user


	return wordService
