//Mensgens de erro
var illegalAssignMethod = function(args){
	let exception = {
		type: "illegal assign method",
		message: "All arguments are requireds."
	};
	
	if(args.length != args.callee.length)
		throw exception;
	for(i in args){
		protectInstanceOfObject(args[i]);
		protectUseNullObject(args[i]);
	}
}

var illegalVarType = function(_var, expected){
	let exception = {
		type: "Illegal var type.", 
		message: "Expected a type " + expected + " but received a type " + typeof _var + "."
	};
	
	if(typeof _var != expected)
		throw exception;
}

var protectInstanceOfObject = function(obj){
	let exception = {
		type: "Undefined Object", 
		message: "Cannot work with undefined object."
	};
	
	if(obj === undefined)
		throw exception;
}

var protectUseNullObject = function(obj){
	let exception = {
		type: "Null Object", 
		message: "Cannot work with null object."
	};
	
	if(obj === null)
		throw exception;
}