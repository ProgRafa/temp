class Node{
    constructor(freq, char){
        this.char = char;
        this.frequency = freq;
        this.length = null;  
        this.leftLeaf = null;
        this.rightLeaf = null;
    }
}

class BinaryTree{
    constructor(node){
        if(node.constructor === Node)
            this.root = node;
        
        if(node.constructor === Array){
            node.forEach(n => { 
                if(this.root == null)
                    this.root = n;
                else
                    this.insertNode(this.root, n)
            });
        }
        
    }

    print(root = this.root){
        try{
            if(root == null)
                return ;

            this.print(root.leftLeaf);
            console.log(root.frequency);
            this.print(root.rightLeaf);
        }catch(ex){
            console.log(ex);
        }
    }

    qtdElements(count = 1, root = this.root){
        try{
            if(root == null)
                return 0;

            count += this.qtdElements(1, root.leftLeaf);
            count += this.qtdElements(1, root.rightLeaf);

            return count;
        }catch(ex){
            console.log(ex);
        }
    }

    search(frequency, root = this.root){
        try{
            if(root == null)
                return null;

            if(root.frequency == frequency)
                return root;
            else if(root.frequency > frequency)
                return this.search(frequency, root.leftLeaf);
            else
                return this.search(frequency, root.rightLeaf);
        }catch(ex){
            console.log(ex);
        }
    }

    insertNode(root, node){
        try{
            if(root.frequency >= node.frequency){
                if(root.leftLeaf == null)
                    root.leftLeaf = node 
                else
                    this.insertNode(root.leftLeaf, node)
            }

            if(root.frequency < node.frequency){
                if(root.rightLeaf == null)
                    root.rightLeaf = node; 
                else
                    this.insertNode(root.rightLeaf, node)
            } 
            
            this.root = root;
        }catch(ex){
            console.log(ex);
        }
    }

    deleteNode(node, root = this.root){
        try{
            if(root == null)
                return null;

            if(root.frequency == node.frequency){
                return this.typeDelete(node);         
            }else if(root.frequency > node.frequency){
                root.leftLeaf = this.deleteNode(node, root.leftLeaf);
            }
            else{
                root.rightLeaf = this.deleteNode(node, root.rightLeaf); 
            }
        }catch(ex){
            console.log(ex);
        }
    }

    typeDelete(node){
        try{
            if(node.leftLeaf == null && node.rightLeaf == null)
                return null;
            
            if(node.leftLeaf != null && node.rightLeaf == null)
                return node.leftLeaf;
            
            if(node.leftLeaf == null && node.rightLeaf != null)
                return node.rightLeaf;

            if(node.leftLeaf != null && node.rightLeaf != null){
                let auxTree = new BinaryTree(node.leftLeaf);
                auxTree.insertNode(auxTree.root, node.rightLeaf);
                return auxTree.root;
            }
        }catch(ex){
            console.log(ex);
        }
    }     
}

window.onload = function(){
    nodes = new Array();
    let randomValues = new Array(50);

    for(let i = 0; i < 10; i++)
        randomValues[i] = parseInt((Math.random() * 200 + 1).toFixed(0));
    
        randomValues.forEach( value => nodes.push(new Node(value, String.fromCharCode(value))));


}