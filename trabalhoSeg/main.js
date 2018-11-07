
var translateLabel = function(id, value){
    var label = document.getElementById('l'+id);
    label.style.transform = 'translateY('+ value +'%)';
}

var checkInput = function(input){
    if(input.value != ''){
        translateLabel(input.id, 0);
    }else{
        translateLabel(input.id, 100);
    }
}

var img2Log = function(){
    var btnLog = document.getElementById('logon');

    btnLog.style.display = 'none';
}

window.onload = function(){
    img2Log();
}