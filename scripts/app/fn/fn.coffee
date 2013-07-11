Verbose = angular.module("Verbose")

Verbose.factory "generateUid", ()->
	return (separator)->
		delim = separator || "-"

		S4 = ()->
		    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)

		return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4())


Verbose.filter "capitalize", ()->
	return (text)->
		text.charAt(0).toUpperCase() + text.slice(1)