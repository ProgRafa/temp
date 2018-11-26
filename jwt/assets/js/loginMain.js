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
    let data = {
        login: document.getElementById('email').value,
        pass: document.getElementById('senha').value
      };

    if(data.login == '' || data.pass == ''){
        alert('Insira o email e senha');
        event.preventDefault();
        return false;
    }

    let header = { 
        "Content-Type" : "application/x-www-form-urlencoded"
    };
    request('http://localhost:4200/login', 'POST', header, data, 
        (evt) => {
            let xhr = evt.target;
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log(xhr.responseText);
                
                let json = JSON.parse(evt.target.responseText);

                for(let attr in json)
                    sessionStorage.setItem(attr, json[attr]);
                
                // xhr.open('GET', 'http://localhost:4200/users');
                // xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'));
                // xhr.send();

                // if(sessionStorage.getItem('auth'))
                //     alert('Bem Vindo!');
            }else if(xhr.readyState == 4 && xhr.status == 400){
                alert('Rota não encontrada: '+xhr.status);    
            }else if(xhr.readyState == 4 && xhr.status == 500){
                alert('Server Error: '+xhr.status);      
            }
        });   
}

var request = (route, method, header, data, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", callback);

    xhr.open(method, route);

    //monta o header
    for(let attr in header)
        xhr.setRequestHeader(attr, header[attr]);
    
    if(data != null)
        xhr.send(dataTypeForm(data));
    else
        xhr.send();
}

var dataTypeForm = (json) => {
    let form = '';

    for(let attr in json){
        if(form != '')
            form += '&';
        form = form.concat(attr, '=', json[attr]);
    }

    return form;
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

    let observable = setInterval(function(){
        if(sessionStorage.getItem('cpf') != null){
            window.location.href = './main.html';
            observable.clearInterval();
        }
    }, 500);

    let getObservable = setInterval(function(){
        console.log('get observable');
        if(sessionStorage.getItem('auth') != null){
            request('http://localhost:4200/users', 'GET', 
                {"Content-Type" : "application/x-www-form-urlencoded", "Authorization": sessionStorage.getItem('token')},
                null, 
                (evt) => {
                    let xhr = evt.target;
                    if(xhr.readyState == 4 && xhr.status == 200){
                        console.log(xhr.responseText);
                        
                        let json = JSON.parse(evt.target.responseText);

                        for(let attr in json)
                            sessionStorage.setItem(attr, json[attr]);
                    }else if(xhr.readyState == 4 && xhr.status == 400){
                        alert('Rota não encontrada: '+xhr.status);    
                    }else if(xhr.readyState == 4 && xhr.status == 500){
                        alert('Server Error: '+xhr.status);      
                    }
                });
                getObservable.clearInterval();
        }
    }, 500);
}