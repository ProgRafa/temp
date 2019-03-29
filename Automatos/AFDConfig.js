var getNodeList = function(name){
	return document.querySelectorAll(name);
} 

var getById = function(id){
	return document.getElementById(id);
}

var addStyle = function(elemt, keyValue){
	if(elemt.style == ''){
		elemt.style = keyValue;
	}else{
		elemt.style += ';' + keyValue;
	}
}

var removeStyle = function(elemt, keyValue){
	var arrStyles = elemt.style.split(';');

	arrStyles.splice(arrStyles.indexOf(keyValue), 1);

	elemt.arrStyles = arrStyles.join(';');
}

var addClass = function(elemt, className){
	if(elemt.className == ''){
		elemt.className = className;
	}else{
		elemt.className += ' ' + className;
	}
}

var removeClass = function(elemt, className){
	var arrClass = elemt.className.split(' ');

	arrClass.splice(arrClass.indexOf(className), 1);

	elemt.className = arrClass.join(' ');
}

var addEventOnce = function (target, type, listener, addOptions, removeOptions) {
    target.addEventListener(type, function fn(event) {
        target.removeEventListener(type, fn, removeOptions);
        listener.apply(this, arguments);
    }, addOptions);
}

var renderAFD = function (states, father) {
	states.forEach(state => {
		var col = document.createElement("div");
		var newElement = document.createElement("div");
		
		col.className = 'col';
		newElement.className = 'state';
		newElement.id = state.id;
		newElement.innerText = state.name;
		father.appendChild(col);
		col.appendChild(newElement);
	});
};

var renderStateInfo = function(state){
	var inpName;
	var boolInitial;
	var boolFinal;
	var settar;
	var row;
	var option1;
	var option2;
	
	state.innerText = '';
	
	inpName = document.createElement('input');
	boolInitial = document.createElement('select');
	boolFinal = document.createElement('select');
	
	option1 = document.createElement('option');
	option2 = document.createElement('option');
	option1.innerText = 'Inicial';
	option1.value = 'true';
	
	option2.innerText = 'Não';
	option2.value = 'false';
	
	boolInitial.append(option1);
	boolInitial.append(option2);
	
	option1 = document.createElement('option');
	option2 = document.createElement('option');
	
	option1.innerText = 'Final';
	option1.value = 'true';
	
	option2.innerText = 'Não';
	option2.value = 'false';
	
	boolFinal.append(option1);
	boolFinal.append(option2);
	
	inpName.className = boolInitial.className = boolFinal.className = 'stateInfo';
	inpName.style = boolInitial.style = boolFinal.style = 'opacity: 0.5';
	
	settar = document.createElement('button');
	
	inpName.id = 'name.'+state.id;
	boolInitial.id = 'initial.'+state.id;
	boolFinal.id = 'final.'+state.id;
	inpName.placeholder = 'Nome do Estado';
	boolInitial.placeholder = 'Estado Inicial';
	boolFinal.placeholder = 'Estado Final';
	
	settar.id = 'settar';
	settar.className = 'btn btn-danger';
	settar.innerText = 'X';
	settar.style = 'width: 25px; height: 25px; padding: 0';
	
	row = document.createElement('div');
	row.className = 'row';
	row.append(settar);
	state.append(row);
	
	row = document.createElement('div');
	row.className = 'row';
	row.append(inpName);
	state.append(row);
	
	row = document.createElement('div');
	row.className = 'row';
	row.append(boolInitial);
	state.append(row);
	
	row = document.createElement('div');
	row.className = 'row';
	row.append(boolFinal);
	state.append(row);
	
	inpName.value = STATES[state.id].name;
	boolInitial.value = STATES[state.id].initial != null ? STATES[state.id].initial : 'true'; 
	boolFinal.value = STATES[state.id].final != null ? STATES[state.id].final : 'true'; 
	
	settar.addEventListener('click', function(){
		 var state = event.currentTarget.parentElement.parentElement;
		 setInfoState(state.id);
		 state.innerHTML = '';
		 state.className = 'state';
		 state.innerText = STATES[state.id].name;
		 setTimeout(function(){addEventOnce(state, 'click', clickInState)}, 300);
	});
}

var clickInState = function(event){
	var state = event.currentTarget;
	
	renderStateInfo(state);
	state.className = 'stateSelected';
}

var setInfoState = function(id){	
	STATES[id].id = id;
	STATES[id].name = getById('name.'+id).value;
	STATES[id].initial = getById('initial.'+id).value;
	STATES[id].final = getById('final.'+id).value;
	STATES[id].targets = [];
}

window.onload = function(){
	sessionStorage.clear();
	STATES = [];
	var afd;
	var btnSumState = getById('btnSumState');
	var btnSubState = getById('btnSubState');
	var btnConfig = getById('btnConfig');
	
	btnConfig.addEventListener('click', function(){
		var id = 0;
		STATES.forEach(state =>{
			sessionStorage.setItem('alphabet', getById('alphabet').value);
			sessionStorage.setItem(state.name, JSON.stringify(state));
			id++;
		});
		
		window.location.href = './StateTargets.html';
	});

	btnSubState.addEventListener('click', function(){
		statesQtd = getById('statesQtd');
		
		if(statesQtd.value > 0){
			statesQtd.value = Number(statesQtd.value) - 1;
			removeState();
		}
	});
	
	btnSumState.addEventListener('click', function(){
		statesQtd = getById('statesQtd');
		
		if(statesQtd.value < 50){
			statesQtd.value = Number(statesQtd.value) + 1;
			addState();
		}
	});
	
	var removeState = function(){
		var state =	STATES.pop();
		
		getById(state.id).remove();
	}
	
	var addState = function(){
		var statesQtd = getById('statesQtd');
		var states;
		var divSate;
	
		if(getById('corpo') != undefined)
			getById('corpo').remove();
	
		var corpo = document.createElement('div');
		corpo.id = 'corpo';
		corpo.className = 'row';
		getById('data').append(corpo);
	
		for(var i = 0; i < statesQtd.value - STATES.length; i++){
			state = {
				id: STATES.length,
				name: null,
				targets: [],
				initial: null,
				final: null
			} 
		
			STATES.push(state);
		}
	
		renderAFD(STATES, getById('corpo'));
	
		states = getNodeList('.state');
	
		states.forEach(item => {
			addEventOnce(item, 'click', clickInState);
		});
	}
}