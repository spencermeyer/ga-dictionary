var dictionary = require("../../data/dictionary");

module.exports = function() {
	var self      = this;
	self.query    = "";
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

	self.open = function(item){
		$('#definition').modal('show');
		$("#definition h4").text(item.word);
		$("#definition .modal-body").text(item.definition);
	};
};
