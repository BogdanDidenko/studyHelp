(function(NameSpace){
	NameSpace.HTML = {
   		append: function(parent, elem) {
			if(typeof parent === 'object'){
				parent.childs = parent.childs || [];
				parent.childs.push(elem)
			}
			elem.parent = parent;
			return elem
		},
		render: function(elem, callbeck) {

			if(elem.childs){
				for(var i = 0; i < elem.childs.length; i += 1){
					this.render(elem.childs[i]);
				}
			}
			if(elem.parent){
				elem.parent.link.appendChild(elem.link);
				elem.rendered = true;
				if(elem.parent.rendered === true){
					if(callbeck)callbeck(elem);
				}
			}else{
				console.warn(elem + ' havent parent link');
			}
		},
		createTag: function(tagName){
			var tag;
			try{
				tag = document.createElement(tagName);
			}catch(e){
				console.warn('Error whent try create tag ' + tagName + ' - ' + e);
			}
			return tag;
		},
		setId: function(elem, id){
			elem.link.id = id;
		},
		setData: function(elem, data){
			for (var k in data){
				elem.link.dataset[k] = data[k];
			}
		},
		getData: function(elem, dataName){
			if(elem.toString() === '[object Object]'){
				return elem.link.dataset[dataName];
			}else{
				return elem.dataset[dataName];
			}	
		},
		remove: function(elem){
			if(elem.childs){
				delete elem.childs;
			};
			elem.link.parentNode.removeChild(elem.link);
		},
		setOverlayPosition: function(current, added){
			var curLink = current.link,
				addedLink = added.link;

			addedLink.style.position = 'absolute';
			addedLink.style.top = curLink.offsetTop + 'px';
			addedLink.style.left = curLink.offsetLeft+ 'px';
		},
		setCSS: function(elem, styles){
			for(var style in styles){
				elem.link.style.cssText += style + ':' + styles[style] + ';'
			}
		},
		setClass: function(elem, arrayClasses){
			var classList = elem.link.classList,
				classString;

			if(elem.classes === undefined){
				elem.classes = arrayClasses
			}else{
				for(var i = 0; i < arrayClasses.length; i+=1){
					if(elem.classes.indexOf(arrayClasses[i]) === -1){
						elem.classes.push(arrayClasses[i])
					}
				}
			};

			for(var i = 0; i < arrayClasses.length; i+=1){
				if(classList.contains(arrayClasses[i]) === false){
					classList.add(arrayClasses[i]);
				}
			}
			classString = Array.prototype.join.call(classList, ' ')
			if(classString !== elem.classes.join(' ')){
				console.warn('Classes in bissnes-object and in html-element not equal')
			}
			
		},
		defineHtmlPositions: function(blocks){
			var position, elem;
			for(var i = 0 ; i < blocks.length; i+=1){
				elem = blocks[i];
				if(!elem.position){
					position = {
						top: elem.link.offsetTop,
						left: elem.link.offsetLeft,
						transX: this.getData(elem, 'x') || 0,
						transY: this.getData(elem, 'y') || 0
					}
				}
				elem.position = position;
			}
		},
		setHtmlPosition: function(elem){
			var link = elem.link,
				position = elem.position;
			link.style.webkitTransform =
			link.style.transform = 
			'translate(' + position.transX + 'px, ' + position.transY + 'px)';
			this.setData(elem, {
				'x': position.transX,
				'y': position.transY
			});
			this.setCSS(elem, {
				top: position.top + 'px',
				left: position.left + 'px'
			});
		},
		getNodeInfo: function(node){
			var nodeInfo = {
				tag: node.tagName.toLowerCase(),
				classes: Array.prototype.join.call(node.classList, ' ').split(' '),
				id: this.getData(node, 'id'),
				type: this.getData(node, 'type'),
				rendered: true,
				link: node
			}
			return nodeInfo;
		}
	}
})(this)