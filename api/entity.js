module.exports = class {

    constructor(api, entitySetName){

        this.api = api;
        this.entitySetName = entitySetName;
    }

    entityUriFromKey(entityKey){

        let keyParts = []

        if ((typeof entityKey) === 'string')
            keyParts.push(entityKey)
        else{
            for (key in entityKey){
                keyParts.push(`${key}='${entityKey[key]}'`);
            }
        }

        return `${this.entitySetName}(${keyParts.join(',')})`;
    }

	async get(qs){
        return await this.api.get(this.entitySetName, qs);
	}

	async delete(uri){
        return await this.api.delete(uri);
	}

	async post(body){
        return await this.api.post(this.entitySetName, body);
	}

	async patch(uri, body){
        return await this.api.patch(uri, body);
	}

}