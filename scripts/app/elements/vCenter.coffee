angular.module("Verbose").directive "vCenter", ($timeout)->
	return {
		restrict:"A"
		link:(scope, node)->
			setTimeout ()->
				node = $(node)
				nodeHeight = node.height()

				for child in node.children()
					child = $(child)
					child.css "margin-top": (nodeHeight - child.height())/2
			,100
	}