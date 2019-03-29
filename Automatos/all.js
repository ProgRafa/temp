var AFD = /** @class */ (function () {
    function AFD(word, alphabet, states) {
        this.word = word;
        this.alphabet = alphabet;
        this.states = states;
        this.finalState = new Array();
        this.wordCount = 0;
        this.renderAFD();
        this.setter(this.states);
        this.currentState = this.initialState;
        document.getElementById(this.initialState.id).style = "background: red";
        document.getElementById(this.initialState.id).className += " initial";
        for (var i in this.finalState)
            document.getElementById(this.finalState[i].id).className += " final";
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
    AFD.prototype.renderAFD = function () {
        for (var i in this.states) {
            var col = document.createElement("div");
            col.className = 'col';
            var newElement = document.createElement("div");
            newElement.className = 'state';
            newElement.id = this.states[i].id;
            newElement.innerText = this.states[i].name;
            document.getElementById('corpo').appendChild(col);
            col.appendChild(newElement);
        }
    };
    AFD.prototype.updateBarWords = function (word) {
        document.getElementById("keys").innerText += word + ', ';
    };
    return AFD;
}());

TABELA = [
    {
        father: 'q0',
        key: ['a', 'b'],
        targetState: 'q1'
    },
    {
        father: 'q1',
        key: ['b'],
        targetState: 'q2'
    },
    {
        father: 'q2',
        key: ['a', 'b'],
        targetState: 'q3'
    },
    {
        father: 'q3',
        key: ['a', 'b'],
        targetState: 'q3'
    }
];

ESTADOS = [
    {
        id: 0,
        name: 'q0',
        targets: [TABELA[0]],
        initial: true,
        final: false,
    },
    {
        id: 1,
        name: 'q1',
        targets: [TABELA[1]],
        initial: false,
        final: false,
    },
    {
        id: 2,
        name: 'q2',
        targets: [TABELA[2]],
        initial: false,
        final: true,
    },
    {
        id: 3,
        name: 'q3',
        targets: [TABELA[3]],
        initial: false,
        final: true,
    }
];

var teste = new AFD(['a', 'b', 'c'], ['a', 'b', 'b', 'a','b','b','b','b'], ESTADOS);