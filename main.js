 (function(NameSpace){
   "use strict"

   var reqFrame = (function() {
		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
							  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		return requestAnimationFrame;
	})();

	var DBframes = {
		0 : {
			tag: "img",
			src: "images/term.png",
			type: 'pattern',
			styles: {
				width: '5rem',
				height: '5rem'
			}
		},
		1 : {
			tag: "img",
			src: "images/snow.png",
			type: 'pattern',
			styles: {
				width: '3rem',
				height: '3rem'
			}
		},
		2 : {
			tag: "img",
			src: "images/drop.png",
			type: 'pattern',
			styles: {
				width: '3rem',
				height: '3rem'
			}
		},
		4 : {
			tag: "input",
			value: "+1",
			type: 'pattern',
			styles: {
				width: '2rem',
				height: '2rem'
			}
		}
	
	}



	var BlockManager = {
		managerTypes: {
			pattern: NameSpace.PatternManager,
			equip: NameSpace.EquipmentManager
		},
		getConcreteManager: function(type){
			return this.managerTypes[type]
		},
		createPhysicBlocks: function(bloksInfo){
			var classes = ["draggable", "drag-drop", "yes-drop", "element"],
				physicBlock;
			for(var k in bloksInfo){
				bloksInfo[k].classes = classes;
				physicBlock = NameSpace.PhysicBlock.createPhysicBlock(bloksInfo[k]);
				this.placePhysicBlock(physicBlock);
			}
			this.placedFinished();
		},
		placePhysicBlock: function(physicBlock){
			var concreteManager = this.getConcreteManager(physicBlock.type),
				specificBlock = concreteManager.build(physicBlock);

			NameSpace.HTML.append({ link : document.getElementById("side-bar"), rendered: true}, specificBlock);
			NameSpace.HTML.render(specificBlock);

			return specificBlock;
			
		},
		removePlacedBlock: function(block){
			this.getConcreteManager(block.type).removeById(block.id);
		},
		createEquipment: function(block){
			var pattern = this.managerTypes.pattern.findById(block.id),
				clone = pattern.clone(true);
				clone.type = 'equip';
			return this.placePhysicBlock(clone);
		},
		createBlockByNode: function(node){
			var nodeInfo = NameSpace.HTML.getNodeInfo(node);
			return PhysicBlock.createSimpleBlock(nodeInfo);
		},
		findPhysicBlock: function(block){
			return this.getConcreteManager(block.type).findById(block.id);
		},
		placedFinished: function(){
			for(var m in this.managerTypes){
				if(this.managerTypes.hasOwnProperty(m)){
					this.managerTypes[m].placedFinished();
				}
			}
		}
	}

	BlockManager.createPhysicBlocks(DBframes);
	
	var i = 0;
	interact('.draggable')
	  .draggable({
		// enable inertial throwing,
		inertia: true,
		manualStart: true,
		// keep the element within the area of it's parent
		restrict: {
		  restriction: "#middle",
		  endOnly: true,
		  elementRect: { top: 1, left: 1, bottom: 1, right: 1 }
		},
		// enable autoScroll
		autoScroll: true,

		// call this function on every dragmove event
		onmove: dragMoveListener,
		// call this function on every dragend event
		onstart: function(event){

		},
		onend: onEnd
	}).on('move', function(event){
		var interaction = event.interaction;

		// if the pointer was moved while being held down
		// and an interaction hasn't started yet
		if (interaction.pointerIsDown && !interaction.interacting()) {
			var	link = event.currentTarget,
				block = BlockManager.createBlockByNode(link);
			if(block.type === 'pattern'){
				link = BlockManager.createEquipment(block).link;
			}
			
		  // insert the clone to the page
		  // TODO: position the clone appropriately

		  // start a drag interaction targeting the clone
		  interaction.start({ name: 'drag' },
							event.interactable,
							link);
		}
	});
	// TODO create target Object an move betwen that
	function dragMoveListener (event) {
		var target = event.target,
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
			y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

		// translate the element
		target.style.webkitTransform =
		target.style.transform =
		  'translate(' + x + 'px, ' + y + 'px)';

		// update the posiion attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	}

	function onEnd(event){
		var textEl = event.target.querySelector('p');
		  //console.log('')
		  var target = event.target;
		  var classList = target.classList;
		  var _x, _y,vectx, vecty, oneStepX, oneStepY,_frame, frame, finish = false;
		  var block ;
		  if(classList.toString().indexOf("can-drop") === -1){
			
			 function step(){
				if(finish)return;
				_x = parseInt(target.getAttribute('data-x'));
				_y = parseInt(target.getAttribute('data-y'));
				oneStepX = Math.abs(Math.ceil(_x / 10)) || 1;
				oneStepY = Math.abs(Math.ceil(_y / 10)) || 1;
				vectx = (_x > 0)? 1 : -1;
				vecty = (_y > 0)? 1 : -1;
				if(Math.abs(_x) > 0){
					target.style.webkitTransform =
					target.style.transform =
					  'translate(' + ((Math.abs(_x) - oneStepX) *vectx) + 'px, ' + _y + 'px)';
					target.setAttribute('data-x', (Math.abs(_x) - oneStepX) *vectx);
					frame = reqFrame(step);
				}else if(Math.abs(_x) <= 0){
					target.style.webkitTransform =
					target.style.transform =
					  'translate(0px, ' + _y + 'px)';
					target.setAttribute('data-x', 0);
				}

				if(Math.abs(_y) > 0){
					target.style.webkitTransform =
					target.style.transform =
					  'translate(' + _x  + 'px, ' +  ((Math.abs(_y) - oneStepY) *vecty)+ 'px)';
					target.setAttribute('data-y', (Math.abs(_y) - oneStepY) *vecty);
					frame = reqFrame(step);
				}else if(_y <=0){
					target.style.webkitTransform =
					target.style.transform =
					  'translate(' + _x  + 'px, 0px)';
					target.setAttribute('data-y', 0);
				}
				if(frame === _frame){
					finish = true;
					//debugger;
					block = BlockManager.createBlockByNode(target)
					BlockManager.removePlacedBlock(block);
				}
				_frame = frame;
			}
			frame = reqFrame(step);
		  }
	}
	var t = interact('.dropzone').dropzone({
	  // only accept elements matching this CSS selector
	  accept: '.yes-drop',
	  // Require a 75% element overlap for a drop to be possible
	  overlap: 0.75,

	  // listen for drop related events:

	  ondropactivate: function (event) {
		// add active dropzone feedback
		event.target.classList.add('drop-active');
	  },
	  ondragenter: function (event) {
		var draggableElement = event.relatedTarget,
			dropzoneElement = event.target;
		// feedback the possibility of a drop
		dropzoneElement.classList.add('drop-target');
		draggableElement.classList.add('can-drop');
	  },
	  ondragleave: function (event) {
		// remove the drop feedback style
		event.target.classList.remove('drop-target');
		event.relatedTarget.classList.remove('can-drop');  
	  },
	  ondrop: function (event) {

	  },
	  ondropdeactivate: function (event) {
		// remove active dropzone feedback
		event.target.classList.remove('drop-active');
		event.target.classList.remove('drop-target');
	  }
	});
})(this)