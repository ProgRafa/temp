var setAlphabetCombo = function(){
	var btnGroup = document.createElement('div');
	var btn;
	var chk;
	btnGroup.className = 'btn-group btn-group-ajuste shadow-dark';
	btnGroup.setAttribute('data-toggle', 'buttons');
	for(var i in ALPHABET){
		btn = document.createElement('label');
		chk = document.createElement('input');
		btn.className = 'btn btn-primary btn-ajuste';
		btn.innerText = ALPHABET[i];
		chk.type = 'checkbox';
		chk.value = ALPHABET[i];
		chk.name = 'symbol';
		btn.append(chk);
		btn.addEventListener('click', btnActive);
		btnGroup.append(btn);
	}
	
	getById('alphabetData').append(btnGroup);
}

var clickInLine = function(){
	svg.removeLine(this);
}

var prosseguirOnClick = function(){
	svg.destroyFreeCells();
	svg.elementDraggableOff();
	document.body.removeEventListener('keydown', SVGraphEvents.keyDownCTRL);
	document.body.removeEventListener('keyup', SVGraphEvents.keyUpCTRL);
}

var pScrollY = 0;
var pScrollX = 0;
var mouseScroll = function(){
	if(pScrollY > 200)
		this.scrollTop += ((event.clientY - pScrollY) * 1.5);
	if(pScrollX > 500)
		this.scrollLeft += ((event.clientX - pScrollX) * 1.5);
	if(pScrollX < 200)
		this.scrollLeft += ((event.clientX - pScrollX) * 1.5);
	

	pScrollY = event.clientY;
	pScrollX = event.clientX;
}

var zoom = 1;
var ZoomIn = function(){
	try{
		zoom -= 0.1;
		let css = { transform: 'scale('+ zoom +') translateX(-32%) translateY(-100px)'};
		addStyle(getById('svg'), css)	
	}catch(ex){
		console.log(ex);
	}
}

var ZoomOut = function(){
	try{
		
		zoom += 0.1;
		let css = { transform: 'scale('+ zoom +') translateX(-32%) translateY(-100px)'};
		addStyle(getById('svg'), css)	
	}catch(ex){
		console.log(ex);
	}
}

window.onload = function(){
	let machine = getById('machine');
	
	//btn configs
	let btnExecutar = getById('executar');
	let btnSumState = getById('btnSumState');
	let btnSubState = getById('btnSubState');
	//btn controller
	let btnActiveScroll = getById('scroll');
	let btnZoom = getById('zoom');
	
	btnActiveScroll.addEventListener('click', function(){
		if(hasClass(btnActiveScroll, 'btn-primary')){
			machine.removeEventListener('mousemove', mouseScroll);
			removeClass(btnActiveScroll, 'btn-primary');
			addClass(btnActiveScroll, 'btn-outline-primary');
		}else{
			machine.addEventListener('mousemove', mouseScroll);
			removeClass(btnActiveScroll, 'btn-outline-primary');
			addClass(btnActiveScroll, 'btn-primary');
		}
	})
		
	btnSubState.addEventListener('click', function(){
		statesQtd = getById('statesQtd');
		
		if(statesQtd.value > 0){
			statesQtd.value = Number(statesQtd.value) - 1;
		}
	});
	btnSumState.addEventListener('click', function(){
		statesQtd = getById('statesQtd');
		
		if(statesQtd.value < 50){
			statesQtd.value = Number(statesQtd.value) + 1;
		}
	});
	
	STATES = [
	new State('R'), 
	new State('C1'),
	new State('C2'),
	new State('C3'),
	new State('C4'),
	new State('C5'),
	new State('C6'),
	new State('C7'),
	new State('C8'),
	new State('C9'),
	new State('C10'),
	new State('C11'),
	new State('C12'),
	new State('C13'),
	new State('C14'),
	new State('C15'),
	new State('C16')
	]; 
	

	ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	
	setAlphabetCombo();
	svg = new SVGraph(getById('machine'), STATES);
	svg.elementDraggableOn();
	states = getNodeList('.glass');
	document.body.addEventListener('keydown',SVGraphEvents.keyDownCTRL);
	document.body.addEventListener('keyup', SVGraphEvents.keyUpCTRL);
	
	btnZoom.addEventListener('click', function(){
		if(event.target.id == 'in'){
			svg.zoomIn();
		}else{
			svg.zoomOut();
		}
	})
}