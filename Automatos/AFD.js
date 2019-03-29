var AFD = /** @class */ (function () {
    function AFD(word, alphabet, states) {
        this.word = word;
        this.alphabet = alphabet;
        this.states = states;
        this.wordCount = 0;
        this.currentState = null;
    }
    AFD.prototype.setter = function (states) {
        for (var i in states) {
            this.setInital(states[i]);
            this.setFinals(states[i]);
        }
        if (!this.initialState)
            throw "Não há estado inicial";
        if (!this.finalState)
            throw "Não há Estado(s) Final(is)";
    };
	
    AFD.prototype.setInital = function (state) {
        if(state.initial)
            this.initialState = state;
    };
	
    AFD.prototype.setFinals = function (state) {
        if(state.final)
            this.finalState.push(state);
    };
	
    AFD.prototype.swippingStates = function() {
        if (this.wordCount == this.alphabet.length) {
            document.getElementsByClassName('btn')[0].disabled = true;
            document.getElementById("keys").innerText += '}';
            if (this.checkIsValid()) {
                document.getElementById("auto").style = "background: rgba(10, 160, 60, 0.9);";
            }
            else {
                document.getElementById("auto").style = "background: rgba(160, 30, 30, 0.9);";
            }
            return;
        }
        this.updateBarWords(this.alphabet[this.wordCount]);
        var targets = this.currentState.targets;
        for (var i in targets) {
            if (this.searchKey(targets[i]['key'])) {
                this.wordCount++;
                document.getElementById(this.currentState.id).style = "background: orange";
                this.currentState = this.searchState(targets[i].targetState);
                document.getElementById(this.currentState.id).style = "background: red";
                return;
            }
        }
        throw "Palavra não pertence ao alfabeto";
    };
    AFD.prototype.searchKey = function (keys) {
        var sym = this.alphabet[this.wordCount];
        for (var j in keys) {
            if (sym == keys[j]) {
                return true;
            }
        }
        return false;
    };
    AFD.prototype.checkIsValid = function () {
        return this.currentState.final;
    };
    AFD.prototype.searchState = function (rot) {
        for (var i in this.states) {
            if (rot === this.states[i].name) {
                console.log(this.states[i]);
                return this.states[i];
            }
        }
    };
    AFD.prototype.updateBarWords = function (word) {
        document.getElementById("keys").innerText += word + ', ';
    };
    return AFD;
}());

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
	var arrStyles = elemt.getAttribute('style').split(';');

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
	var idx = arrClass.indexOf(className);
	
	if(idx > 0)
		arrClass.splice(idx, idx + 1);

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
		newElement.draggable = true;
		father.appendChild(col);
		col.appendChild(newElement);
	});
};