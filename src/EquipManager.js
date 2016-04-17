(function(NameSpace){
	var EquipmentManager = new NameSpace.Dan.Manager(NameSpace.HTML);
	
	EquipmentManager.build = function (physicBlock){
		equip = physicBlock;
		this.htmlInject.setCSS(equip, {position: 'absolute'});
		this.htmlInject.setData(equip,{
			type: 'equip'
		});
		this.htmlInject.setClass(equip, ['equip']);
		this.htmlInject.setHtmlPosition(equip);

		this.collection.addAndSetId(equip);

		return equip;
	}

	NameSpace.EquipmentManager = EquipmentManager;
})(this)