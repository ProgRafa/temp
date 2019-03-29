var selected = null;

class SVGraphEvents{
	constructor(obj){
		svg = obj;
	}
	
	static addEventOnce(target, type, listener, json){
		let _fn = () => {
			listener(json);
			target.removeEventListener(type, _fn);
		}; 
		
		target.addEventListener(type, _fn);
	}
	
	static addEvent(target, type, listener, json){	
		let _fn = () => {
			listener(json);
		}; 
		json.fn = (_fn);
		
		target.addEventListener(type, _fn);
		
		return _fn;
	}
	
	static removeEvent(target, type, listener){
		target.removeEventListener(type, listener);
	}
	
	static mouseUpEvent(args){
		let graph = args['graph'];
		let circle = args['circle'];
		let bckg = getById('bck'+circle.id);
		let text = getById('label'+circle.id);
		let CTM = getById('svg').getScreenCTM();
		let moveX = (event.clientX - CTM.e) / CTM.a;
		let moveY = (event.clientY - CTM.f) / CTM.d; 
		let coord = graph.plugState(moveX, moveY);
		
		if(!coord.putInGraph){
			graph.updateElementPosition(circle, '50%', 60);
			graph.updateElementPosition(text, '50%', 60);
			graph.updateElementPosition(bckg, '50%', 60);
			bckg.setAttribute('style', 'transition: .5s all linear');
			circle.setAttribute('style', 'transition: .5s all linear');
		}else{
			graph.updateElementPosition(circle, coord.x, coord.y);
			graph.updateElementPosition(bckg, coord.x, coord.y);
			graph.updateElementPosition(text, coord.x, coord.y);
		}
		
		graph.linkAgain(circle);
		
		SVGraphEvents.removeEvent(circle, 'mousemove', args['mMoveFunct']);
		SVGraphEvents.removeEvent(circle, 'mouseup', args['fn']);
	}
	
	static mouseDownEvent(args){
		let graph = args['graph'];
		let circle = args['circle'];
		let bckg = getById('bck'+circle.id);
		let text = getById('label'+circle.id);
		let parent = circle.parentElement;
		
		
		graph.destroyLinks(circle.id);
		bckg.remove();
		circle.remove();
		text.remove();
		parent.append(bckg);
		parent.append(text);
		parent.append(circle);
		
		let fn = SVGraphEvents.addEvent(
			circle, 
			'mousemove', 
			SVGraphEvents.mouseMoveEvent, 
			{circle: circle, text: text, graph: graph}
		);

		SVGraphEvents.addEvent(
			circle, 
			'mouseup', 
			SVGraphEvents.mouseUpEvent,
			{circle: circle, graph: args['graph'], mDownFunct: args['mDownFunct'], mMoveFunct: fn}
		);
	}
	
	static mouseMoveEvent(args){
		let graph = args['graph'];
		let circle = args['circle'];
		let bckg = getById('bck'+circle.id);
		let text = getById('label'+circle.id);
		let CTM = getById('svg').getScreenCTM();
		let moveX = (event.clientX - CTM.e) / CTM.a;
		let moveY = (event.clientY - CTM.f) / CTM.d; 
		let coord = graph.plugState(moveX, moveY);

		graph.updateElementPosition(circle, coord.x, coord.y);
		graph.updateElementPosition(bckg, coord.x, coord.y);
		graph.updateElementPosition(text, coord.x, coord.y);
		
		circle.setAttribute('style', 'filter: url(#filterTo'+ circle.id +');transition: none;');
		bckg.setAttribute('style', 'transition: none;');
	}

	static keyDownCTRL(){
		try{
			this.removeEventListener('keydown', SVGraphEvents.keyDownCTRL);
			
			states.forEach(node => {
				node.addEventListener('mouseover', SVGraphEvents.mouseOver);
			});
		}catch(ex){
			console.log(ex);
		}
	}
	
	static keyUpCTRL(){
		try{
			document.body.addEventListener('keydown', SVGraphEvents.keyDownCTRL);

			if(selected){
				selected.style = 'none';
				selected = null;
			}
			states.forEach(node => {
				node.removeEventListener('mouseover', SVGraphEvents.mouseOver);
			});
		}catch(ex){
			console.log(ex);
		}
	}

	static mouseOver(){
		let node = this;

		if(selected == null){
			selected = node;
			node.removeEventListener('mouseover', SVGraphEvents.mouseOver);
			node.style = 'stroke: gray; stroke-width: 1; transition: .2s all linear';
		}else{
			let keys = returnInputsIsChecked(getNodeList('[name=symbol]'));
			
			// if(keys.length < 1){
				// SVGraphEvents.keyUpCTRL();
				// alert('Nenhum símbolo selecionado.');
			// }else{
				inputsUnchecked(getNodeList('[name=symbol]'));
				selected.addEventListener('mouseover', SVGraphEvents.mouseOver);
				svg.createLine(selected, node, []).addEventListener('click', clickInLine);
				selected.style = '';
				selected = null;
			//}
		}
	}	
}

class SVGraph {
	constructor(_parent, states){		
		this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.svg.id='svg';
		this.states = states;
		this.fn = [];
		this.instanceStateObject();
		this.scale = 1;
		_parent.append(this.svg);
	}
	
	static createSVG(type){
		return document.createElementNS("http://www.w3.org/2000/svg", type);
	}
	
	zoom(){
		try{
			let percent = (33 * (this.scale)) > 36 ? 36 : (33 * (this.scale));
			let css = { transform: 'scale('+ this.scale + ') translateX(-'+percent+'%)'};
			addStyle(this.svg, css);
		}catch(ex){
			console.log(ex);
		}
	}
	
	zoomIn(){
		try{
			if(this.scale > 0.6)
				this.scale -= 0.1;
			
			this.zoom();
		}catch(ex){
			console.log(ex);
		}
	}
	
	zoomOut(){
		try{
			if(this.scale < 1.5)
				this.scale += 0.1;
			
			this.zoom();
		}catch(ex){
			console.log(ex);
		}
	}
	
	updateElementPosition(elemnt, x, y){
		if(elemnt.tagName == 'circle'){
			elemnt.setAttribute('cx', x);
			elemnt.setAttribute('cy',y);
		}else if(elemnt.tagName == 'text'){
			elemnt.setAttribute('x', x);
			elemnt.setAttribute('y',y);
		}
	}
	
	elementDraggableOn(){
		let circle;
		let graph = this;
		for(let idx in this.states.reverse()){
			circle = getById(this.states[idx].id);
			this.fn.push(SVGraphEvents.addEvent(circle, 'mousedown', SVGraphEvents.mouseDownEvent, {circle: circle, graph: this}));
		}
		
		this.freeCellsGenerate();
	}
	
	elementDraggableOff(){
		try{
			let circle;
			let graph = this;
			for(let idx in this.states.reverse()){
				circle = getById(this.states[idx].id);
				SVGraphEvents.removeEvent(circle, 'mousedown', this.fn.pop(), {circle: circle, graph: this});
			}
			
			this.destroyFreeCells();
		}catch(ex){
			console.log(ex);
		}
	}
	
	instanceStateObject(){		
		for(let idx in this.states.reverse()){
			let circle = SVGraph.createSVG('circle');
			let id = this.states[idx].id;
			let label = this.renderLabel(id);
			
			circle = this.renderStateGlass(id, '50%', 60);
			circle.id = id;
			
			this.svg.append(circle);
			this.svg.append(label);		
		}
	}

	renderStateGlass(id, posX, poxY){
		let background = SVGraph.createSVG('circle');
		let circle = SVGraph.createSVG('circle');
		let design = SVGraph.createSVG('defs');
		
		background.id='bck'+id;
		background.setAttribute('cx', posX);
		background.setAttribute('cy', poxY);
		background.setAttribute('class', 'bck-state state-ray');
		
		circle.id = id;
		circle.setAttribute('cx', posX);
		circle.setAttribute('cy', poxY);
		circle.setAttribute('class', 'glass state-ray');
		
		let gradient = this.makeRadialGradient();
		circle.setAttribute('fill', 'url(#'+gradient.id+')');
		//let shadow = this.makeShadowDrop(id, posX, poxY);
		//circle.style = 'filter: url(#'+ shadow.id +')';
		
		design.append(gradient);
		//design.append(shadow);
		this.svg.append(background);
		this.svg.append(design);
		
		return circle;
	}
	
	makeRadialGradient(){
		let gradient = SVGraph.createSVG('radialGradient');
		let stop = SVGraph.createSVG('stop');
		
		gradient.id="gradienToQ1";
		gradient.setAttribute('cx', '50%');
		gradient.setAttribute('cy', '50%');
		gradient.setAttribute('r', '55%');
		gradient.setAttribute('fx', '50%');
		gradient.setAttribute('fy', '50%');
		
		gradient.append(this.makeStopToGradient('0%', 'stop-color:rgb(255,255,255); stop-opacity:.5'));
		gradient.append(this.makeStopToGradient('15%', 'stop-color:rgb(255,255,255); stop-opacity:.1'));
		gradient.append(this.makeStopToGradient('25%', 'stop-color:rgb(210,210,210); stop-opacity:.1'));
		gradient.append(this.makeStopToGradient('50%', 'stop-color:rgb(180,180,180); stop-opacity:.1'));
		gradient.append(this.makeStopToGradient('60%', 'stop-color:rgb(150,150,150); stop-opacity:.2'));
		gradient.append(this.makeStopToGradient('75%', 'stop-color:rgb(80,80,80); stop-opacity:.5'));
		gradient.append(this.makeStopToGradient('80%', 'stop-color:rgb(250,250,250); stop-opacity:1'));
		gradient.append(this.makeStopToGradient('100%', 'stop-color:rgb(20,20,20); stop-opacity:1'));

		return gradient;
	}
	
	makeStopToGradient(offset, style){
		let stop = SVGraph.createSVG('stop');
		stop.setAttribute('offset', offset);
		stop.style = style;
		
		return stop;
	}
	
	makeShadowDrop(id, posX, posY){
		let filter = SVGraph.createSVG('filter');
		let faGaussian = SVGraph.createSVG('feGaussianBlur');
		let feOffset = SVGraph.createSVG('feOffset');
		let feMerge = SVGraph.createSVG('feMerge');
		let feMergeNode = SVGraph.createSVG('feMergeNode');
		
		filter.id = 'filterTo'+id;
		filter.setAttribute('x', '-40%');
		filter.setAttribute('y', '-40%');
		filter.setAttribute('width', '180%');
		filter.setAttribute('height', '180%');
		filter.setAttribute('filterUnits', 'userSpaceOnUse');
		
		faGaussian.setAttribute('in', 'SourceAlpha');
		faGaussian.setAttribute('stdDeviation', '5');
		
		filter.append(faGaussian);

		feOffset.setAttribute('dx', '4');
		feOffset.setAttribute('dy', '4');
		filter.append(feOffset);
		
		feOffset = SVGraph.createSVG('feOffset');
		feOffset.setAttribute('dx', '-4');
		feOffset.setAttribute('dy', '-4');
		filter.append(feOffset);
		
		feMerge.append(feMergeNode);
		feMergeNode = SVGraph.createSVG('feMergeNode');
		feMergeNode.setAttribute('in', 'SourceGraphic');
		feMerge.append(feMergeNode);
		feMergeNode = SVGraph.createSVG('feMergeNode');
		feMergeNode.setAttribute('in', 'SourceGraphic');
		feMerge.append(feMergeNode);
		
		filter.append(feMerge);
		
		return filter;
	}
	
	renderLabel(id){
		let label = SVGraph.createSVG('text');
		label.textContent = id;
		label.id = 'label'+id;
		label.setAttribute('text-anchor', 'middle');
		label.setAttribute('class', 'svgLabel');
		label.setAttribute('x', '50%');
		label.setAttribute('y', 60);
		label.setAttribute('dy', '.3em');
		
		return label;
	}
	
	linkStates(idInState, idOutState, keys){
		let inState = this.states.find(state => state.id == idInState );
		
		inState.addTarget(idOutState, keys);
	}
	
	removeLinkState(idInState, idOutState){
		let inState = this.states.find(state => state.id == idInState );
		
		inState.removeTarget(idOutState);
	}
	
	removeLine(line){
		let idInState = line.id.split('-')[0];
		let idOutState = line.id.split('-')[1];

		this.removeLinkState(idInState, idOutState);
		
		line.remove();
		
		getById(line.id).remove();
	}
	
	createLine(selected, node, keys){
		let line = SVGraph.createSVG('line');
		let cx1 = Number(selected.getAttribute('cx'));
		let cy1 = Number(selected.getAttribute('cy'));
		let cx2 = Number(node.getAttribute('cx'));
		let cy2 = Number(node.getAttribute('cy'));
		line.id = selected.id + '-' + node.id;
		line.setAttribute('class', 'svg-link');
		let coord;
		
		if(cx2 - cx1 > 0){
			coord = this.findFinalXY(cx1, cy1, cx2, cy2, -1);
		}else if(cx2 - cx1 < 0){
			coord = this.findFinalXY(cx1, cy1, cx2, cy2, 1);		
		}else{
			if(cy2 - cy1 > 0){
				cy2 -= 40;
			}else{
				cy2 += 40;		
			}
		}
		
		cx2 = coord != undefined ? coord.x : cx2;
		cy2 = coord != undefined ? coord.y : cy2;
		
		line.setAttribute('x1', cx1);
		line.setAttribute('y1', cy1);
		line.setAttribute('x2', cx2);
		line.setAttribute('y2', cy2);
		
		line.addEventListener('mouseover', function(){ this.style = 'stroke: red; stroke-width: 4' });
		line.addEventListener('mouseleave', function(){ this.style = '' });
		this.linkStates(selected.id, node.id, keys);
		this.nodoArrowNodo(selected, node, line);
		
		this.svg.append(this.createLineHead(line.id, cx2, cy2, cx2 - cx1,  cy2 - cy1));
		
		return line;
	}
	
	nodoArrowNodo(inState, outState, arrow){
		let headArrow = getNodeList('polygon');
		let bckIn = getById('bck'+inState.id);
		let bckOut = getById('bck'+outState.id);
		let labelIn = getById('label'+inState.id);
		let labelOut = getById('label'+outState.id);
		bckIn.remove();
		bckOut.remove();
		inState.remove();
		outState.remove();
		arrow.remove();
		
		this.svg.append(arrow);
		this.svg.append(bckIn);
		this.svg.append(bckOut);
		this.svg.append(outState);
		this.svg.append(labelOut);
		this.svg.append(inState);
		this.svg.append(labelIn);
		
		headArrow.forEach(nodo =>{
			nodo.remove();
			this.svg.append(nodo);
		});
	}
	
	lineWidth(pointA, pointB){
		return Math.sqrt(Math.pow(pointA, 2) + Math.pow(pointB, 2));
	}
	
	universalEquationLine(xi, yi, xf, yf){
		let angleCoefficient = (yf - yi) / (xf - xi);
		let constant = yi - (angleCoefficient * xi);
		let UELine = new Object({c: constant, ac: angleCoefficient})
		Object.prototype.equation = function(x){
			return (this.ac * x) + this.c;
		};
		Object.prototype.angleInDegrees = function(){
			return (Math.atan(this.ac) * 180) / Math.PI;
		};
		Object.prototype.angleInRadians = function(){
			return Math.atan(this.ac);
		};
		
		return UELine;  
	}
	
	findFinalXY(xi, yi, xf, yf, inv){
		let cos = this.lineWidth(xf - xi, 0) / this.lineWidth(xf - xi, yi - yf);
		let x = inv * (cos * 40) + xf;
		let y = this.universalEquationLine(xi, yi, xf, yf).equation(x);
		
		return {x: x, y: y};
	}
	
	createLineHead(id, x, y, incidenseX, incidenseY){
		let triangle = SVGraph.createSVG('polygon');
		triangle.id = id;
		let p1;
		let p2;
		let p3;
		let points;
		let rX = Math.abs(incidenseX) / (Math.abs(incidenseX) + Math.abs(incidenseY));  
		let rY = Math.abs(incidenseY) / (Math.abs(incidenseX) + Math.abs(incidenseY));
		let menor;
		let fatorX;
		let fatorY;
		
		if(rX > rY)
			menor = rY;
		else
			menor = rX;
		
		let moveTotal = Math.round(10 * (1+menor)); 
		
		if(incidenseX > 0)
			fatorX = 1;
		else
			fatorX = -1;
		
		if(incidenseY > 0)
			fatorY = 1;
		else
			fatorY = -1;
		
		p1 = (x + Math.round(fatorX * moveTotal * rX)) + ',' + (y+ Math.round(fatorY * moveTotal * rY));
		moveTotal = Math.round(5 * (1+menor)); 
		p2 = (x + Math.round(fatorX * moveTotal * rY)) + ',' + (y + Math.round(-1 * fatorY * moveTotal * rX));
		p3 = (x + Math.round(-1 * fatorX * moveTotal * rY)) + ',' + (y + Math.round(fatorY * moveTotal * rX));
		
		points = p1 + ' ' + p2 + ' ' + p3;
		
		triangle.setAttribute('points', points);
		triangle.setAttribute('fill', 'red');
		triangle.setAttribute('stroke', 'red');
		triangle.setAttribute('stroke-width', 1);
		
		return triangle;
	}
	
	linkAgain(out){
		let state = this.states.find(item => item.id == out.id);
		let parent;
		
		this.states.forEach(item => {
			if(item.targets.findIndex(t => t.target == out.id) > -1){
				this.createLine(getById(item.id), getById(out.id), item.keys);
			}
		});
		
		state.targets.forEach(t => {
			this.createLine(getById(out.id), getById(t.target), t.keys);
		});
	}
	
	destroyLinks(id){
		let links = getNodeList('[id*=-'+id+']');
		
		links.forEach(node => {
			node.remove();
		});
		
		links = getNodeList('[id*='+id+'-]');
		
		links.forEach(node => {
			node.remove();
		});
	}
	
	plugState(x, y){
		let positionsFree = getNodeList('.freeCell');
		let cx, cy = 0;
		let put = false;
		let cell = null;
		
		positionsFree.forEach(item => {
			cx = Number(item.getAttribute('cx'));
			cy = Number(item.getAttribute('cy'));
		
			if((x > (cx - 20) && x < (cx + 20)) && 
			   (y > (cy - 20) && y < (cy + 20))){
				item.setAttribute('r', 40);
				cell = item;
				x = cx;
				y = cy;
				put = true;
			}else{
				item.setAttribute('r', 30);
			}
		});
		
		return { x : x, y : y, putInGraph : put, cell: cell };
	}
	
	destroyFreeCells(){
		let circles = getNodeList('.freeCell');

		circles.forEach(circle => {
			circle.remove();
		});
	} 
	
	freeCellsGenerate(){
		let graph = this;
		let r = 30;
		let margin = 100;
		let circle;
		let defs;
		let x = 0;
		let y = 0;
		let max = 30;
		
		defs = SVGraph.createSVG('defs');
		defs.append(graph.plugDesign());
		graph.svg.append(defs);
		
		for(let i = 0; i < max; i++){
			for(let j = 0; j < max; j++){
				circle = SVGraph.createSVG('circle');				
				circle.id = 'pos'.concat(i, j);
		
				x = (j * margin) + 32;
				y = (i * margin) + 200;
				
				circle.setAttribute('cx', x); 
				circle.setAttribute('cy', y);		
				circle.setAttribute('r', r);
				circle.setAttribute('class', 'freeCell glass-plug');

				graph.svg.append(circle);
			}
		}
		
		graph.svg.style = 'min-width:' + (max * margin + 32) + 'px';
		graph.svg.setAttribute('width', (max * margin + 32).toString() + 'px');
		graph.svg.setAttribute('height', (max * margin + 200).toString() + 'px');

	}
	
	plugDesign(){
		let gradient = SVGraph.createSVG('radialGradient');
	
		gradient.id="plugGradient";
		gradient.setAttribute('cx', '50%');
		gradient.setAttribute('cy', '50%');
		gradient.setAttribute('r', '50%');
		gradient.setAttribute('fx', '50%');
		gradient.setAttribute('fy', '50%');
		
		gradient.append(this.makeStopToGradient('0%', 'stop-color:rgb(255,255,255);stop-opacity:1'));
		gradient.append(this.makeStopToGradient('25%', 'stop-color:rgb(255,255,255);stop-opacity:1'));
		gradient.append(this.makeStopToGradient('30%', 'stop-color:rgb(110,110,110);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('35%', 'stop-color:rgb(210,210,210);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('40%', 'stop-color:rgb(150,150,150);stop-opacity:.2'));
		gradient.append(this.makeStopToGradient('45%', 'stop-color:rgb(210,210,210);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('50%', 'stop-color:rgb(110,110,110);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('55%', 'stop-color:rgb(210,210,210);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('60%', 'stop-color:rgb(110,110,110);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('65%', 'stop-color:rgb(210,210,210);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('70%', 'stop-color:rgb(110,110,110);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('75%', 'stop-color:rgb(210,210,210);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('80%', 'stop-color:rgb(110,110,110);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('85%', 'stop-color:rgb(210,210,210);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('90%', 'stop-color:rgb(110,110,110);stop-opacity:.6'));
		gradient.append(this.makeStopToGradient('100%', 'stop-color:rgb(110,110,110);stop-opacity:1'));

		return gradient;
	}
	
	circleAnimation(x, y, repeat){
		let animation = SVGraph.createSVG('animateTransform');
		
		animation.setAttribute('attributeName', 'transform');
		animation.setAttribute('type', 'rotate');
		animation.setAttribute('from', '0 ' + x + ' ' + y);
		animation.setAttribute('to', '360 ' + x + ' ' + y);
		animation.setAttribute('dur', '10s');
		animation.setAttribute('repeatCount', repeat);
		
		return animation;
	}
}

class State {
	constructor(id){
		this.id = id;
		this.name = id;
		this.targets = [];
		this._initial = false;
		this._final = false;
		this.x;
		this.y;
	}
	
	existTarget(id){
		let exist = this.targets.findIndex(item => item.target == id);
		exist = exist >= 0 ? true : false;
		return exist;
	}
	
	addTarget(t, k){
		if(!this.existTarget(t)){
			this.targets.push({target : t, keys : k});
		}
	}
	
	removeTarget(id){
		let idx = this.targets.findIndex(item => item.target == id);
		
		if(idx > -1){
			return this.targets.splice(idx, 1);	
		}

		return null;
	}
}