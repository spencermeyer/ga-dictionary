var dictionary = require("../../data/dictionary");

module.exports = function() {
	var self      = this;
	self.query    = "";
	self.all      = dictionary;
	self.letters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	self.open = function(item){
		$('#definition').modal('show');
		$("#definition h4").text(item.word);
		$("#definition .modal-body").text(item.definition);
	};
};
