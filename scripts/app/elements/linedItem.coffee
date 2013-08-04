angular.module("Verbose").directive "linedItem", ()->
	return {
		restrict:"A"
		link:(scope, node)->
			node.addClass('li-lined')
			node.append("<div class='border-bottom'/>")
	}