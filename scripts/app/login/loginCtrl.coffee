angular.module("Verbose").controller 'loginCtrl', ($scope, $rootScope, Auth, Word)->
	auth = Auth()
	$scope.login = ()->
		auth.login "password",
				email:$scope.loginForm.email
				password:$scope.loginForm.password

	$scope.logout = ()->
		auth.logout()

	$rootScope.$on "login", (e,user)->
		$rootScope.user = user
		# Word.add({name:"test"})

	$rootScope.$on "error", (e,error)->
		console.log error
