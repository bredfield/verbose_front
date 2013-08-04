angular.module("Verbose").factory 'Suggestion', ($http)->
	baseUrl = "https://www.macmillandictionary.com/api/v1"
	action = "/dictionaries/american/search/didyoumean"
	apiKey = '3iqW5S1yG1zl2qieARWLforJROD31OKi1Z39KQdpnVKakGWEPXpeS3wy8JihlFcZ'

	return (word)->
		$http.jsonp baseUrl+action+'/', 
			data:
				accessKey:"3iqW5S1yG1zl2qieARWLforJROD31OKi1Z39KQdpnVKakGWEPXpeS3wy8JihlFcZ"
				q:word
				entryNumber:10
			headers:
				accessKey:apiKey