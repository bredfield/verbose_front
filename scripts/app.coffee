Verbose = angular.module('Verbose',['ui.state','ui.bootstrap', 'ngResource', 'firebase'])
	.config ($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider)->
		if !store.get('words')
			store.set('words',[])

		appRoot = "scripts/app"

		$urlRouterProvider.otherwise("/")

		$stateProvider
			.state 'index',
				url:'/'
				templateUrl:"views/wordList.html"
				controller:'listCtrl'
			.state 'detail',
				url:'/words/:wordId'
				templateUrl:"#{appRoot}/detail/wordDetail.html"
				controller:'detailCtrl'
			.state 'search',
				url:'/search'
				templateUrl:"views/search.html"
				controller:"searchCtrl"
			.state 'quiz',
				url:'/quiz'
				templateUrl:"#{appRoot}/quiz/quiz.html"
				controller:"quizCtrl"

		# $httpProvider.defaults.headers.common.useXDomain = true
		delete $httpProvider.defaults.headers.common['X-Requested-With']

