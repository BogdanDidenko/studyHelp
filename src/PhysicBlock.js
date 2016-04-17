(function(NameSpace){
	var Block = function(options){
			for(var k in options){
				this[k] = options[k];
			}
			this['instanceOf'] = 'Block';
		},
		AbstractBlock = {
			constructor: Block,
			setParametr: function(name, value) {
				this[name] = value;
			},
			clone: function(deep){
				var newBlock = new Block(this),
					child;

				if(this.link){
					newBlock.link = this.link.cloneNode();
				}

				if(deep && this.childs){
					newBlock.childs = [];
					this.childs.map(function(ch){
						child = ch.clone(deep)
						HTML.append(newBlock, child);
					})
					
					return newBlock;
				}

				return newBlock;
			}
		};

	Block.prototype = AbstractBlock;
	// If I need add specific workflow with tag need add that in under factory classes
	var TagFactory = function(type){
		this.type= type;
	};
	TagFactory.prototype.typeDictionary = {
		img: TagIMG,
		svg: function(){},
		div: TagDIV,
		input: TagInput
	}
	TagFactory.prototype.createBlock = function(options){
		return new this.typeDictionary[this.type](options);
	}
	/* Abstract class */
	function Tag(options){
		this.elem = NameSpace.HTML.createTag(options.tag);
		this.elem.style.cssText = '';
		this.InstanceBlock = new Block({
			tag: options.tag, 
			link: this.elem
		});
		NameSpace.HTML.setCSS(this.InstanceBlock, options.styles);
		NameSpace.HTML.setClass(this.InstanceBlock, ['internal']);
	}
	function TagIMG(options){
		Tag.call(this, options);
		this.elem.setAttribute("src", options.src);

		return this.InstanceBlock;
	}
	function TagInput(options){
		Tag.call(this, options);
		this.elem.value = options.value;
		return this.InstanceBlock;
	}
	function TagDIV(options){
		Tag.call(this, options);

		return this.InstanceBlock;
	}

	
	/* Remove UI hardcode */
	NameSpace.PhysicBlock = {
		createPhysicBlock: function(options) {
			var lowElem = NameSpace.HTML.createTag('div'),
				InstanceBlock,
				InternalBlock,
				tagFactory = new TagFactory(options.tag);

			InternalBlock = tagFactory.createBlock(options);
			
			InstanceBlock =  new Block({
				tag: 'div', 
				type: options.type,
				classes: options.classes,
				link: lowElem,
				rendered: false
			});
			InstanceBlock.instanceOf = 'PhysicBlock';
			NameSpace.HTML.setClass(InstanceBlock, options.classes);
			NameSpace.HTML.append(InstanceBlock, InternalBlock);

			return InstanceBlock;
		},
		createSimpleBlock: function(options){
			return new Block(options);
		}
	}
	
})(this)