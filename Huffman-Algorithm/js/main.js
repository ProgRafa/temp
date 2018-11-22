var text;

let compact = () => {
    let huffman = new Huffman();
    let input = text;
    let bits = '';
    let content = '';
    let archive;
    let heap;
    let root;
    
    heap = huffman.heapFrequency(input);
    root = huffman.Tree(heap);

    for(let i in input){
       bits += huffman.printTreeBin(root, input[i]);
    }
    for(let i = 0; i < bits.length; i += 8){
        const eighBits = bits.slice(i, i + 7);
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

    archive = "<HEADER>" + JSON.stringify(heap) + "</HEADER>";
    archive += "<BODY>" + content + "</BODY>";
    archive += "<FOOTER></FOOTER>";
    download('teste.txt', archive);
}

download = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=ASCII,' + encodeURIComponent(text));
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
        text = evt.target.result;
    };

    reader.readAsText(file, 'UTF-8');
}   

window.onload = function(){
    let bnt = document.getElementById('btnCmp');
    let bntArc = document.getElementById('archive');

    bnt.addEventListener('click', compact);
    bntArc.addEventListener('change', getContentArchive);
}