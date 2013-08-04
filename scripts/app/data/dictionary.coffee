angular.module("Verbose").factory 'Dictionary', ($resource)->
	baseUrl = "http://api.wordnik.com/v4"
	apiKey = 'c3b45323cb219cf66c5420b4aaa035b8bb6773d9ca99edf7f'

	return (word, query, type)->
		if type is "words"
			url = "#{baseUrl}/words.json/#{query}/#{word}"
		else
			url = "#{baseUrl}/word.json/#{word}/#{query}"

		$resource(url, {api_key:apiKey, useCanonical:true, caseSensitive:false})
