angular.module("Verbose").directive "activeLink", ($location)->
	return {
		restrict:"A"
		link:(scope, node)->
			path = $(node).find('a').attr("href")
			path = path.substring(1)
			scope.location = $location

			scope.$watch "location.path()", (newPath)->
				method = if path == newPath then 'add' else 'remove'
				node["#{method}Class"]('active')
	}