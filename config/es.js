let { Client: ESClient } = require('@elastic/elasticsearch');

class ElasticSearch {

    constructor() {
        this.client = new ESClient({ node: 'http://localhost:9200' })
    }

    getClient(){
        return this.client;
    }

};

module.exports = () => {
	let es = new ElasticSearch;
	return {
        Client: es.getClient(),
    };
};