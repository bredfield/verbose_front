angular.module("Verbose").directive "focused", ($timeout)->
	return {
		restrict:"A"
		link:(scope, node)->
			$timeout -> $(node).focus()
	}