var selected = null;

class SVGraph {
	constructor(_parent, states){		
		this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.svg.id='svg';
		this.svg.setAttribute('width', 2000);
		this.svg.setAttribute('height', 600);
		this.states = states;
		this.inGraph = [];
		this.renderState();
		this.selected = null;
		let graph = this;
		
		_parent.append(this.svg);
	}
	
	renderState(){
		let graph = this;
		let lstIdx = graph.states.length - 1;
		for(let i = lstIdx; i >= 0; i--){
			let circle = SVGraph.createSVG('circle');
			let label = graph.renderLabel(graph.states[i].id);
			
			circle.id = graph.states[i].id;
			circle.setAttribute('class', 'svgState');
			circle.setAttribute('cx', '50%');
			circle.setAttribute('cy', 60);
			
			circle.addEventListener('mousedown', function(){ graph.mouseDownEvent(circle, label)});
			
			graph.svg.append(circle);
			graph.svg.append(label);		
		}
	}

	renderLabel(id){
		let label = SVGraph.createSVG('text');
		label.textContent = id;
		label.id = id;
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
		
		if(cx2 - cx1 > 0){
			cx2 -= 20;
		}else if(cx2 - cx1 < 0){
			cx2 += 20;		
		}
		
		if(cy2 - cy1 > 0){
			cy2 -= 20;
		}else if(cy2 - cy1 < 0){
			cy2 += 20;		
		}

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
		
		inState.remove();
		outState.remove();
		arrow.remove();
		
		let labelIn = getById(inState.id);
		let labelOut = getById(outState.id);

		this.svg.append(outState);
		this.svg.append(labelOut);
		this.svg.append(arrow);
		this.svg.append(inState);
		this.svg.append(labelIn);
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
	
	mouseDownEvent(_circle, _text){
		let parent = _circle.parentElement;
		let graph = this;		
		let _fn = () => {
			if(event.type == 'mousemove'){
				SVGraph.mouseMoveEvent(_circle, _text);
			}else{
				graph.mouseUpEvent(_circle, _text, graph, _fn);
			}
		};

		graph.freeCellsGenerate();
		_circle.remove();
		_text.remove();
		parent.append(_circle);
		
		_circle.addEventListener('mousemove', _fn);
		_circle.addEventListener('mouseup', _fn);
		//_circle.addEventListener('mouseleave', _fn);
	}
	
	static mouseMoveEvent(_circle){
		let CTM = getById('svg').getScreenCTM();
		let moveX = (event.clientX - CTM.e) / CTM.a;
		let moveY = (event.clientY - CTM.f) / CTM.d; 
		let coord = SVGraph.plugState(moveX, moveY);
		
		moveX = coord.x;
		moveY = coord.y;
		
		_circle.setAttribute('cx', moveX);
		_circle.setAttribute('cy', moveY);
	}
	
	mouseUpEvent(_circle, _text, graph, _fn){
		let parent = _circle.parentElement;
		let CTM = getById('svg').getScreenCTM();
		let moveX = (event.clientX - CTM.e) / CTM.a;
		let moveY = (event.clientY - CTM.f) / CTM.d; 
		let coord = SVGraph.plugState(moveX, moveY);
		
		_text.style.fill = 'rgba(0,0,0,0)';
		
		if(!coord.putInGraph){
			let animation = setTimeout(function(){
				_text.style.fill = 'white';
				_circle.style.transition = 'none';
				clearTimeout(animation);
			}, 500);
			_circle.style.transition = '.5s all linear';
			_circle.setAttribute('cx', '50%');
			_circle.setAttribute('cy', 60);
			_text.setAttribute('x', '50%');
			_text.setAttribute('y', 60);
		}else{
			let animation = setTimeout(function(){
				_text.style.fill = 'white';
				clearTimeout(animation);
			}, 10);
			_text.setAttribute('x', coord.x);
			_text.setAttribute('y', coord.y);
		}
		
		parent.append(_text);
		SVGraph.destroyFreeCells();
		
		_circle.removeEventListener('mousemove', _fn);
		_circle.removeEventListener('mouseup', _fn);
		_circle.removeEventListener('mouseleave', _fn);
	}
	
	static plugState(x, y){
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
	
	static createSVG(type){
		return document.createElementNS("http://www.w3.org/2000/svg", type);
	}
	
	static destroyFreeCells(){
		let circles = getNodeList('.freeCell');

		circles.forEach(circle => {
			circle.remove();
		});
	} 
	
	freeCellsGenerate(){
		let graph = this;
		let r = 30;
		let margin = 30;
		let padding = 60;
		let circle;
		let x = 0;
		let y = 0;
		
		for(let i = 0; i < 5; i++){
			for(let j = 0; j < 10; j++){
				circle = SVGraph.createSVG('circle');
				
				if(getById('pos'.concat(i, j)) == undefined){
					circle.id = 'pos'.concat(i, j);
			
					x = (j * (60 + margin)) + padding;
					y = (i * (60 + margin)) + 150;
					
					circle.setAttribute('cx', x); 
					circle.setAttribute('cy', y);
			
					circle.setAttribute('r', r);
					circle.setAttribute('class', 'freeCell');
					
					circle.append(graph.circleAnimation(x, y));
					graph.svg.append(circle);
				}
			}
		}
	}
	
	circleAnimation(x, y){
		let animation = SVGraph.createSVG('animateTransform');
		
		animation.setAttribute('attributeName', 'transform');
		animation.setAttribute('type', 'rotate');
		animation.setAttribute('from', '0 ' + x + ' ' + y);
		animation.setAttribute('to', '360 ' + x + ' ' + y);
		animation.setAttribute('dur', '5s');
		animation.setAttribute('repeatCount', 'indefinite');
		
		return animation;
	}
	
	drawState(){
		console.log('criou')
		let circle = event.currentTarget;
		let x = circle.getAttribute('cx');
		let y = circle.getAttribute('cy');

		circle.setAttribute('class', 'svgState');
	}
	
	drawLine(sOutput, sInput){
		let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		
		line.setAttribute('x1', sOutput.x); 
		line.setAttribute('y1', sOutput.y);
		line.setAttribute('x2', sInput.x); 
		line.setAttribute('y2', sInput.y);
		line.setAttribute('stroke', 'black');
		line.setAttribute('stroke-width', 4);
		
		this.svg.append(line);
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
		return this.targets.includes(item => item.id == id);
	}
	
	addTarget(t, k){
		this.targets.push({target : t, keys : k});
	}
	
	removeTarget(id){
		let idx = this.targets.findIndex(item => item.target == id);
		
		if(idx > -1){
			return this.targets.splice(idx, 1);	
		}

		return null;
	}
}

