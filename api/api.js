var rp = require('request-promise');

module.exports = class {

    constructor(baseUri, user, password){
        this.baseUri = baseUri;
        this.user = user;
        this.password = password;
    }

	async getCsrfToken(){
		var options = {
		    uri: `${this.baseUri}`,
			auth: {
				user: this.user,
				pass: this.password,
			},
			headers: {
				'X-CSRF-Token': 'Fetch'
			},
		    resolveWithFullResponse: true
		};

		let response = await rp(options);
		
		return {
			csrfToken: response.headers['x-csrf-token'],
			setCookie: response.headers['set-cookie'].join('; '),
		};
	}

	async get(entitySetName, qs){

		var options = {
		    uri: `${this.baseUri}/${entitySetName}`,
		    qs: {},
			auth: {
				user: this.user,
				pass: this.password,
			},
		    json: true
        };
        
        Object.assign(options.qs, qs, {'$format': 'json'});

		let body = await rp(options);
		
		return body.d.results;
	}

	async delete(uri){
		
		let csrfTokenData = await this.getCsrfToken()
		
		var options = {
			method: 'DELETE',
		    uri: `${uri}`,
			auth: {
				user: this.user,
				pass: this.password,
			},
		    json: true,
		    headers: {
		    	'x-csrf-token': csrfTokenData.csrfToken,
		    	'Cookie': csrfTokenData.setCookie,
		    }
		};

		return (await rp(options));
	}

	async post(entitySetName, body){
		
		let csrfTokenData = await this.getCsrfToken()
		
		var options = {
			method: 'POST',
		    uri: `${this.baseUri}/${entitySetName}`,
		    body: body,
			auth: {
				user: this.user,
				pass: this.password,
			},
		    json: true,
		    headers: {
		    	'x-csrf-token': csrfTokenData.csrfToken,
		    	'Cookie': csrfTokenData.setCookie,
		    }
		};

		return (await rp(options));
	}

	async patch(uri, body){
		
		let csrfTokenData = await this.getCsrfToken()
		
		var options = {
			method: 'PATCH',
		    uri: `${uri}`,
		    body: body,
			auth: {
				user: this.user,
				pass: this.password,
			},
		    json: true,
		    headers: {
		    	'x-csrf-token': csrfTokenData.csrfToken,
		    	'Cookie': csrfTokenData.setCookie,
		    }
		};

		return (await rp(options));
	}

}