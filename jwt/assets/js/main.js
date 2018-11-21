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

var logar = function(){
    var data = {
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
      };

    if(data.email == '' || data.password == ''){
        alert('Insira o email e senha');
        event.preventDefault();
        return false;
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState === 4) {
            console.log(this.responseText);
            if(xhr.status == 200){
                alert('Sucesso: '+this.responseText);
            }else if(xhr.status == 400){
                alert('Rota não encontrada: '+this.status);    
            }else{
                console.log(xhr.getResponseHeader("Content-Type"));
                alert('Server Error: '+ this.status);      
            }
        }
    });

    xhr.open("POST", "http://localhost:4200/login");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:4200/login');
    xhr.send("login="+data.email+"&pass="+data.senha);
    console.log(xhr.status);
    
}

var clear = function(){
    email = document.getElementById('email');
    password = document.getElementById('senha');

    email.value = '';
    password.value = '';
}

var img2Log = function(){
    var btnLog = document.getElementById('logon');
    var logado = document.getElementById('usuarioLogado');

    if(sessionStorage.getItem('user') != null){
        btnLog.style.display = 'none';  
        logado.innerText.replace('&nome', sessionStorage('user').nome);
        logado.style.display = '';
    }
}

window.onload = function(){
    img2Log();
    clear();
}