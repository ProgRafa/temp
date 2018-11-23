var archive = {content: '', name: '', type: '', len: ''};
var huffman = new Huffman();

let compact = () => {
    if(archive.content == '' || archive.content == undefined){
        return false;
    }
    let bits = '';
    let content = '';
    let cArchive;
    let heap;
    let root;
    
    heap = huffman.heapFrequency(archive.content);
    root = huffman.Tree(heap);

    for(let i in archive.content){
       bits += huffman.printTreeBin(root, archive.content[i]);
    }

    for(let i = 0; i < bits.length; i += 8){
        const eighBits = bits.slice(i, i + 8);
        content = content.concat(String.fromCharCode(parseInt(eighBits, 2)));
    }
    
    heap.forEach(item => {
        item[item.char] = item.frequency != undefined ? item.frequency: 1;

        delete item.char;
        delete item.frequency;
        delete item.ignore;
        delete item.length;
        delete item.leftLeaf;
        delete item.rightLeaf;
    });

    cArchive = "<HEADER>" + JSON.stringify(heap) + "</HEADER>";
    cArchive += "<BODY>" + content + "</BODY>";
    cArchive += "<FOOTER>{name:"+archive.name+",type:"+archive.type+"}</FOOTER>";
    download(archive.name.replace('.txt', '.huff'), cArchive);
}

checkHeader = () => {
    let header;
    let heap = new Array();
    let tree;
    let regexp = /<HEADER>\[(\{"[\w,.\s\\]+":\d+\},?)+\]<\/HEADER>/g;

    header = archive.content.match(regexp);

    if(header != null){
        regexp = /\[(\{"[\w,.\s\\]+":\d+\},?)+\]/g;
        header = header[0].match(regexp);
        header = JSON.parse(header);          
    }

    for(let i in header){
        for(let attr in header[i]){
            heap.push(new Node(header[i][attr], attr));
        }   
    }

    tree = huffman.Tree(heap);

    return tree;
}

descompact = () =>{
    if(archive.content == '' || archive.content == undefined){
        return false;
    }

    //expressão regular para capturar o body do arquivo
    let regexp = /<BODY>(.?\s?)*<\/BODY>/g;
    let content = archive.content;
    let dArchive;
    let root;
    let body;
    let bits = '';
    //verifica se o arquivo possui um header e se está correto
    root = checkHeader();
    //verifica o body do arquivo
    if(content.match(regexp) != null){
        body = content.match(regexp)[0];
        body = body.replace('<BODY>', '').replace('</BODY>', '');
    }else{
        body = '';
    }
    //transforma o conteúdo do body para uma string de bits
    for(let i in body){
        bits += body[i].charCodeAt().toString(2).padStart(8, '0');
    }
    //realiza o parse do texto compactado para o texto original
    dArchive = huffman.printTreeChar(root, bits);
    download(archive.name.replace('.huff', ''), dArchive);
} 

download = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

getContentArchive = () => {
    let file = event.target.files[0];
    let reader = new FileReader();
    
    reader.onload = function(evt){ 
        archive.name = document.getElementById('archive').value.split('\\').pop();
        archive.content = evt.target.result;
        archive.type = archive.name.split('.')[1];
        archive.len = evt.target.result.length;
    };

    reader.readAsText(file, 'UTF-8');
}   

window.onload = function(){
    let bntC = document.getElementById('btnCmp');
    let bntD = document.getElementById('btnDcmp');
    let bntArc = document.getElementById('archive');

    bntC.addEventListener('click', compact);
    bntD.addEventListener('click', descompact);
    bntArc.addEventListener('change', getContentArchive);
}