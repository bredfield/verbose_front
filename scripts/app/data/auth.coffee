angular.module("Verbose").factory 'Auth', ($rootScope)->
	return (getUser)->
		console.log "asd"
		fb = new Firebase("https://verbose.firebaseio.com")
		auth = new FirebaseSimpleLogin fb, (error, user)->
			if getUser then return user
			if user
				$rootScope.user = user
				$rootScope.$emit "login", user
			else if error
				$rootScope.$emit "error", error
			else 
				$rootScope.$emit "logout"
