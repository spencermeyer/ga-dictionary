var dictionary = require("../../data/dictionary");

module.exports = function() {
	var self      = this;
	self.query    = null;
	self.all      = dictionary;
	self.letters  = 'abcdefghijklmnopqrstuvwxyz'.split('');
	self.selected = {};

	self.sort = function(query) {
		event.preventDefault();
		self.query = query;
	};

	self.define = function(item) {
		event.preventDefault();
		self.selected = item;
	};
};
