var should = require('should');

describe('utils', function() {
	var utils = require('../index').utils;
	
	describe('.parse', function() {
		it('should parse a filename', function() {
			var file;
			
			file = utils.parse('jquery.js');
			
			file.should.have.property('name', 'jquery');
			file.should.have.property('version', null);
			file.should.have.property('extension', 'js');
			
			file = utils.parse('jquery');
			
			file.should.have.property('name', 'jquery');
			file.should.have.property('version', null);
			file.should.have.property('extension', null);
			
			file = utils.parse('jquery-1.0.0');
			
			file.should.have.property('name', 'jquery');
			file.should.have.property('version', '1.0.0');
			file.should.have.property('extension', null);
			
			file = utils.parse('jquery-1.0.0.js');
			
			file.should.have.property('name', 'jquery');
			file.should.have.property('version', '1.0.0');
			file.should.have.property('extension', 'js');
			
			utils.parse('').should.be.false;
		});
	});
	
	describe('.getRequestFileName', function() {
		it('should return the filename from a request url', function() {
			utils.getRequestFileName('http://localhost/test.html?version=test').should.eql('test.html');
			utils.getRequestFileName('http://localhost/some-folder/test.html?version=test').should.eql('test.html');
			utils.getRequestFileName('http://localhost/some-folder/?version=test').should.eql('');
		});
	});
	
	describe('.getRequestDirName', function() {
		it('should return the dirname from a request url', function() {
			utils.getRequestDirName('http://localhost/test.html?version=test').should.eql('/');
			utils.getRequestDirName('http://localhost/some-folder/test.html?version=test').should.eql('/some-folder');
			utils.getRequestDirName('http://localhost/some-folder/some-more-folder/?version=test').should.eql('/some-folder/some-more-folder');
			utils.getRequestDirName('http://localhost/some-folder/?version=test').should.eql('/some-folder');
		});
		
		it('should combine multiple slashes to one', function() {
			utils.getRequestDirName('http://localhost//test.html?version=test').should.eql('/');
			utils.getRequestDirName('http://localhost/test//test.html?version=test').should.eql('/test');
		});
	});
});