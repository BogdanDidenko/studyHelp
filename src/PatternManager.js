(function(NameSpace){
	// TODO create class
	var PatternManager = new NameSpace.Dan.Manager(NameSpace.HTML);

	PatternManager.build = function(physicBlock){
		var pattern = physicBlock;
		this.htmlInject.setData(pattern,{
			type: 'pattern'
		});
		this.collection.addAndSetId(pattern);

		return pattern;
	};
	PatternManager.placedFinished = function(){
		this.htmlInject.defineHtmlPositions(this.collection.elems);
	};
	NameSpace.PatternManager = PatternManager;
})(this)