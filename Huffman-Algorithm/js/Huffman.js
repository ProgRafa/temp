class Huffman{
    constructor(){
    }

    heapFrequency(input, callback){
        try{
            let chars = new Array();
            let heap = new Array();
            let freq;
            let lenAnt;

            for(let i in input)
                chars.push(input[i]);  

            while(chars.length > 0){
                let temp = chars[0];
                lenAnt = chars.length;
                chars = chars.filter(charFil => charFil != temp);
                freq = lenAnt - chars.length;
                heap.push(new Node(freq, temp));
            }

            heap.sort((nodeA, nodeB) => nodeA.frequency - nodeB.frequency);

            if(callback != undefined)
                return callback(heap)
            else
                return heap;
        }catch(ex){
            console.log(ex);
        }
    }

    Tree(heap){
        try{
            let miNode1;
            let miNode2;
            let root;
            let node;
            let nodes = heap;

            while(nodes.length != 2){
                miNode1 = Huffman.minorNode(nodes);
                miNode2 = Huffman.minorNode(nodes);
            
                node = new Node(miNode1.frequency + miNode2.frequency, miNode1.char + miNode2.char);
                node.leftLeaf = miNode1;
                node.rightLeaf = miNode2;
                nodes = nodes.filter(n => n != miNode1 && n != miNode2);
                nodes.push(node);

                //nodes.sort((nodeA, nodeB) => nodeA.frequency - nodeB.frequency);
            }

            root = new Node(nodes[0].frequency + nodes[1].frequency, '*');
            root.leftLeaf = nodes[0];
            root.rightLeaf = nodes[1];
            
            return root;
        }catch(ex){
            console.log(ex);
        }
    }

    printTreeBin(root, char){
        try{   
            if(root == null)
                return '';
            if(root.char == char)
                return '';

            if(root.leftLeaf != null && root.leftLeaf.char.includes(char))
                return '0' + this.printTreeBin(root.leftLeaf, char);
            
            if(root.rightLeaf != null && root.rightLeaf.char.includes(char))
                return '1' + this.printTreeBin(root.rightLeaf, char);
        }catch(ex){
            console.log(ex);
        }
    }

    printTreeChar(root, bits){
        try{   
            let tree = JSON.parse(JSON.stringify(root));
            let word = '';
            tree.leftLeaf = root.leftLeaf;
            tree.rightLeaf = root.rightLeaf;

            for(let i in bits){
                if(bits[i] == '0')
                    tree = tree.leftLeaf;
                if(bits[i] == '1')
                    tree = tree.rightLeaf;
                if(tree.char.length == 1){  
                    word += tree.char;
                    tree = JSON.parse(JSON.stringify(root));
                    continue;
                }
            }

            return word;
        }catch(ex){
            console.log(ex);
        }
    }

    static minorNode(heap){
        try{
            let minor = new Node(0, '');

            heap.forEach(node => {
                if((minor.frequency > node.frequency || minor.frequency == 0) && !node.ignore){
                    minor.ignore = false;
                    minor = node;
                    node.ignore = true;
                }
            })

            return minor;
        }catch(ex){
            console.log(ex);
        }
    }
}