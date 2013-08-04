angular.module("Verbose").directive "swipe", ($timeout)->
	return {
		restrict:"E"
		link:(scope, node)->
			swipeNode = $("<div class='swipe'><div class='swipe-wrap'></div></div>")
			$(node).wrapInner(swipeNode)

			scope.swipe = Swipe($(node).find(".swipe")[0],
				continuous:false
			)

			$timeout ()-> 
				height = $(node).find(".swipe").height()
				$(node).find('.padding-wrapper').height height
	}