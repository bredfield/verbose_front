Verbose = angular.module('Verbose',['ui.state','ui.bootstrap'])
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

		$httpProvider.defaults.useXDomain = true
		delete $httpProvider.defaults.headers.common['X-Requested-With']
