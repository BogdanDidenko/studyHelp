(function(NameSpace){

	function finder(array, param, value){
		for(var i = 0; i < array.length; i += 1){
			if(array[i][param] == value){
				return {
					index: i,
					elem: array[i]
				}
			}
		}
	}

	var Dan = {
		Collection: function(){
			this.elems = [];
		},
		extend: function(childClass, parentClass){
			var mid = function(){},
				midProto;
			mid.prototype = parentClass.prototype;
			midProto = new mid();
			for(var k in childClass.prototype){
				if(childClass.prototype.hasOwnProperty(k))
				midProto[k] = childClass.prototype[k];
			}
			childClass.prototype = midProto;

			return childClass;
		}
	}
	Dan.Collection.prototype = {
		constructor: Dan.Collection,
		find: function(id) {
			var result = finder(this.elems, 'id', id);

			if(result){
				return result.elem;
			}else{
				return null;
			}
		},
		add: function(Element){
			Element.collection = this;
			Element.id = this.elems.length;
			this.elems.push(Element)
		},
		//TODO finish rewrite html ids when collection ellement was removed; 
		remove: function(id){
			var item = finder(this.elems, 'id', id);
			this.elems.splice(item.index, 1);
			for(var i = 0; i < this.elems.length; i += 1){
				this.elems[i].id = i;
			}
		}
	}
	
	var EllementCollection = function (htmlInject){
		Dan.Collection.call(this);
		this.htmlInject = htmlInject;
	}
	EllementCollection.prototype.removeWithLink = function(id){
		var equip = this.find(id);
		this.remove(id);
		this.htmlInject.remove(equip);
		for(var i = 0; i < this.elems.length; i +=1){
			this.htmlInject.setData(this.elems[i], {
				id: i
			});
		}
	};
	EllementCollection.prototype.addAndSetId = function(element){
		this.htmlInject.setData(element, {
			id: this.elems.length
		});
		this.add(element);
	};
	Dan.EllementCollection = Dan.extend(EllementCollection, Dan.Collection);

	Dan.Manager = function(htmlInject){
		this.htmlInject = htmlInject;
		this.collection = new Dan.EllementCollection(this.htmlInject);
	};
	Dan.Manager.prototype.findById = function(id){
		return this.collection.find(parseInt(id));
	};
	Dan.Manager.prototype.removeById = function(id){
		this.collection.removeWithLink(parseInt(id));
	};
	// clear abstract method
	Dan.Manager.prototype.placedFinished = function(){};
	NameSpace.Dan = Dan;
})(this)