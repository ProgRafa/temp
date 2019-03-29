var getNodeList = function(name){
	return document.querySelectorAll(name);
} 

var getById = function(id){
	try{
		protectInstanceOfObject(document.getElementById(id));
		protectUseNullObject(document.getElementById(id));
		return document.getElementById(id);
	}catch(ex){
		console.log(ex)
		throw ex;
	}
}

var parseToCSS = function(obj){
	try{
		illegalVarType(obj, 'object');
		let objString = '';
		
		for(attr in obj){
			objString += attr + ':' + obj[attr] + ';';
		}
		
		return objString;
	}catch(ex){
		throw ex;
	}
}

var hasStyle = function(elemt, prop){
	try{
		illegalAssignMethod(arguments);
		
		let styles = elemt.getAttribute('style').split(';');
		let has = false;
		let css = {};
		styles.pop();
		styles.forEach(s => {
			css[s.split(':')[0].trim()] = s.split(':')[1].trim();
			if(css.hasOwnProperty(prop))
				has = true;
		});
		
		return has;
	}catch(ex){
		return ex;
	}
}

var addStyle = function(elemt, css){
	try{
		if(elemt.getAttribute('style') == null){
			elemt.style = parseToCSS(css);
		}else{
			elemt.style = elemt.getAttribute('style') + ';' + parseToCSS(css);
		}
	}catch(ex){
		throw ex;
	}
}

var removeStyle = function(elemt, prop){
	try{
		let stylesWithinProp = elemt.getAttribute('style').split(';');
		let stylesWithoutProp = new Array();
		//remove espaço em branco no array
		stylesWithinProp.pop();
		
		stylesWithinProp.forEach(style => { 		
			let css = {};
			css[style.split(':')[0].trim()] = style.split(':')[1].trim();
			
			if(css.hasOwnProperty(prop))
				stylesWithoutProp.push(css.attr + ':' + css.value);
		});

		elemt.style = stylesWithoutProp.join(';');
	}catch(ex){
		throw ex;
	}
}

var addClass = function(elemt, className){
	try{
		if(elemt.className == ''){
			elemt.className = className;
		}else{
			elemt.className += ' ' + className;
		}
	}catch(ex){
		throw ex;
	}
}

var hasClass = function(element, name){
	let arrClass = element.className.split(' '); 
	
	return arrClass.includes(name);
}

var removeClass = function(elemt, className){
	var arrClass = elemt.className.split(' ');
	var idx = arrClass.indexOf(className);
	
	if(idx > 0)
		arrClass.splice(idx, idx + 1);

	elemt.className = arrClass.join(' ');
}

//verifica se input está marcado
var isChecked = function(chk){
	if((chk != undefined  || chk != null) && chk.checked) return true;
		
	return false;	
}

//devolve um array com os inputs que estão marcados
var returnInputsIsChecked = function(inputs){
	let checkeds = [];

	inputs.forEach(input => { 
		if(isChecked(input)) 
			checkeds.push(input.value) 
	});
	
	return checkeds;
}

//desmarca os inputs marcados
var inputsUnchecked = function(inputs){
	inputs.forEach(input => { 
		if(isChecked(input)) 
			input.click(); 
	});
}

//toggle na ação de ativar botão 
var btnActive = function(){
	var btn = event.currentTarget;

	if(btn.children[0].checked){
		addClass(btn, 'active');	
	}else{
		removeClass(btn, 'active');
	}
}

//pega o conteudo de um input
var getInputContent = function(name){
	return getById(name).value;
}

//pega o conteudo html
var getHtmlContent = function(name){
	return getById(name).innerHtml;
}

//pega o conteudo de texto
var getHtmlContent = function(name){
	return getById(name).innerText;
}