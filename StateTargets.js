var btnActive = function(){
	var btn = event.currentTarget;

	if(btn.children[0].checked){
		addClass(btn, 'active');	
	}else{
		removeClass(btn, 'active');
	}
}

var setAlphabetCombo = function(){
	var btnGroup = document.createElement('div');
	var btn;
	var chk;
	btnGroup.className = 'btn-group btn-group-ajuste';
	btnGroup.setAttribute('data-toggle', 'buttons');
	for(var i in ALPHABET){
		btn = document.createElement('label');
		chk = document.createElement('input');
		btn.className = 'btn btn-outline-primary btn-ajuste';
		btn.innerText = ALPHABET[i];
		chk.type = 'checkbox';
		chk.name = 'symbol';
		btn.append(chk);
		btn.addEventListener('click', btnActive);
		btnGroup.append(btn);
	}
	
	getById('alphabetData').append(btnGroup);
}

var keyDownCTRL = function(){	
	try{
		states.forEach(node => {
			node.addEventListener('mouseover', mouseOver);
		});
	}catch(ex){
		console.log(ex);
	}
}

var keyUpCTRL = function(){
	try{
		addEventOnce(document.body, 'keydown', keyDownCTRL);

		if(selected){
			selected.style = 'none';
			selected = null;
		}
		states.forEach(node => {
			node.removeEventListener('mouseover', mouseOver);
		});
	}catch(ex){
		console.log(ex);
	}
}

var mouseOver = function(){
	let node = this;

	if(selected == null){
		selected = node;
		node.removeEventListener('mouseover', mouseOver);
		node.style = 'stroke: red; stroke-width: 3; transition: .2s all linear';
	}else{
		svg.createLine(selected, node, ['A', 'B']).addEventListener('click', clickInLine);
		selected.style = '';
		selected.addEventListener('mouseover', mouseOver);
		selected = null;
	}
}

var clickInLine = function(){
	svg.removeLine(this);
}

window.onload = function(){
	//var nodes = getById('nodesData');
	STATES = [
	new State('Q1'), 
	new State('Q2'),
	new State('Q3'),
	new State('Q4'),
	new State('Q5'),
	new State('Q5'),
	new State('Q5'),
	new State('Q5'),
	new State('Q5'),
	new State('Q5'),
	new State('Q5')];
	// {id : 'Q5', name : 'Q5'},
	// {id : 'Q6', name : 'Q6'},
	// {id : 'Q7', name : 'Q7'},
	// {id : 'Q8', name : 'Q8'},
	// {id : 'Q9', name : 'Q9'},
	// {id : 'Q10', name : 'Q10'}];
	//ALPHABET = sessionStorage.getItem('alphabet').split('');
	ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	//sessionStorage.removeItem('alphabet');
	
	//for(var item in sessionStorage){
		//if(sessionStorage.getItem(item) != undefined){
			//STATES.push(JSON.parse(sessionStorage.getItem(item)));
		//}
	//}
	
	//var statesNode = getNodeList('.state');
	
	//statesNode.forEach(item => {
		//item.addEventListener('click', clickInState);
	//});
	
	// var state = new State('Q1');
	// var state2 = new State('Q2');
	// var state3 = new State('Q3');
	// var state4 = new State('Q4');
	// var state5 = new State('Q5');
	// state.targets.push(
		// {id : 'Q2', keys : ['A', 'B']},
		// {id : 'Q3', keys : ['B', 'C']},
		// {id : 'Q4', keys : ['D', 'E']}		
	// );
	
	// state2.targets.push({id : 'Q5', keys : ['A', 'B']});
	// state3.targets.push({id : 'Q5', keys : ['A', 'B']});
	// state4.targets.push({id : 'Q5', keys : ['A', 'B']});
	
	setAlphabetCombo();
	svg = new SVGraph(getById('nodesData'), STATES);
	states = getNodeList('.svgState');
	addEventOnce(document.body, 'keydown',keyDownCTRL);
	document.body.addEventListener('keyup', keyUpCTRL);
	
	//svg.renderState(STATES, getById('nodesList'));
	//svg.freeCellsGenerate();
	//svg.drawLine();
	//console.log(svg.lineWidth(44, 131, 260, 294));
	
	// getNodeList('.circle').forEach(node => node.addEventListener('mouseover', function(){
		// console.log('position y: ' + event.clientY);
		// console.log('position x: ' + event.clientX);
	// }))
}