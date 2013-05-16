var should = require('should');

describe('commands', function() {
	var commands = require('../index').commands;
	
	describe('.search', function() {
		it('should search the registry for specified file', function(done) {
			commands.search('only.for.testing', function(err, framework) {
				should.not.exists(err);
				
				framework.should.have.property('type', 'test');
				framework.should.have.property('url', 'http://this.is/just/used/for/testing');
				
				done();
			});
		});
	});
});