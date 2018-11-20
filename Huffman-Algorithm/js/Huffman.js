class Huffman{
    constructor(){}

    hashFrequency(input){
        let chars = new Array();
        let nodes = new Array();
        let freq;
        let filter;

        for(let i in input)
            chars.push(new Char(input[i]));

        chars.forEach(char =>{
                freq = 0;
                if(nodes.length == 0 || nodes.find(node => node.char == char.charCode10) == undefined){
                    filter = chars.filter(compareChar => compareChar.charCode10 == char.charCode10);
                    freq = filter.length;
                    nodes.push(new Node(freq, char.charCode10));
                }
            }
        );    

        return nodes;
    }

    huffmanTree(input){
        let huffTree;
        let nodes;

        nodes = this.hashFrequency(input);
        huffTree = new BinaryTree(nodes);

        return huffTree;
    }

    huffmanTransformTree(input){
        let huffTree;
        let miNode1;
        let miNode2;
        
        huffTree = this.huffmanTree(input);
        miNode1 = this.minorNode(huffTree.root);

        //huffTree.deleteNode(miNode1);

        miNode2 = this.minorNode(huffTree.root);

        //huffTree.deleteNode(miNode2);

        console.log(huffTree);
        console.log(miNode1);
        console.log(miNode2);
    }

    minorNode(root){
        if(root.leftLeaf == null && root.rightLeaf == null)
            return root
        else if(root.leftLeaf != null)
            root = this.minorNode(root.leftLeaf);
        else if(root.rightLeaf != null)
            root = this.minorNode(root.rightLeaf);
            
        return root;
    }
}