class Byte{
    constructor(stream){
        this.byte = stream.toString().split('');
        this.bits = '';
        this.byLen = this.byte.length;

        this.encodeBinaryType();
    }

    encodeBinaryType(){
        for(let i = 0; i < this.byte.length; i++){
            this.bits += this.byte[i].charCodeAt().toString(2).padStart(8, '0');
        }

        this.biLen = this.bits.length;
    }

    
}

class AES{
    constructor(message, password){
        this.secret = new Byte(message);
        this.key = new Byte(password);
        this.SBox = new Array(255);
        let tempKey = this.key.bits;
        this.key.bits = new Array(128);
        let tempSecret = this.secret.bits;
        this.secret.bits = new Array(128);

        let x = 0;            

        this.createSBOX((x, n) => (x << n) | (x >> (8 - n)), (num) => num % 256, 1, 1);

        for(let i = 0; i < 16; i++){
            this.key.bits[i] = tempKey.slice(x, x + 8);
            this.secret.bits[i] = tempSecret.slice(x, x + 8);
            x += 8;    
        }
    }

    createSBOX(circleShift, uint8, u, i){
        //calcula o index do array SBOX
        i = i ^ (i << 1) ^ (i & 0x80 ? 0x1B : 0);
        
        i = uint8(i);

        //gera valores multiplos de 0xf6
        u ^= (u << 1);
        u ^= (u << 2);
        u ^= (u << 4);
        u ^= (u & 0x80 ? 0x09 : 0);

        u = uint8(u);

        // transformacao afim (affine transformation) 
        let iValue = u ^ circleShift(u, 1) ^ circleShift(u, 2) ^ circleShift(u, 3) ^ circleShift(u, 4) ^ 0x63;
        iValue = uint8(iValue);

        this.SBox[i] = iValue;
            
        if(i != 1){
            this.createSBOX((x, n) => (x << n) | (x >> (8 - n)), (num) => num % 256, u, i)
        }else{
            this.SBox[0] = 0x63;
        }
    }

    addRoundKey(state, expandedKey){

    }

    subBytes(x){
        x = x ^ (x << 1) ^ (x & 0x80 ? 0x1B : 0);
        let vi = x % 128;
        let si = x % 256;

        x = x % 256;

        this.secret.bits[vi] = this.secret.bits[vi] ^ this.SBox[si];

        if(x != 1){
            this.subBytes(x);    
        }else{
            this.secret.bits[0] = this.SBox[0]; 
        }
    }

    shiftRows(){
        let tempBit;

        for(let i = 4; i < 16; i += 4){
            tempBit = this.secret.bits[i];

            for(let j = i; j < (i + 3); j++){     
                this.secret.bits[j] = this.secret.bits[j + 1];
            }
            
            this.secret.bits[i + 3] = tempBit;
        }   
    }

    mixColumns(mix, uint8){
        const x = [2, 3, 1, 1, 1, 2, 3, 1, 1, 1, 2, 3, 3, 1, 1, 2];
        let col = 0;
        let row = 0;
        let v;
        let result;

        for(let i = 0; i < 16; i++){
            v = this.secret.bits[col];
            result = (v << x[row]) ^ (v << x[row + 1]) ^ (v << x[row + 2]) ^ x[row + 3];

            this.secret.bits[col] = result;

            if(col == 12){
                row = 4;
                col = 1;
            }
            else if(col == 13){
                row = 8;
                col = 2;
            }
            else if(col == 14){
                row = 12;
                col = 3;
            }
            else{
                col += 4;
            }
        } 
    }

    encodeAES(){
        this.subBytes(1);
        this.shiftRows();
        this.mixColumns();
        //this.addRoundKey();

        return this.secret.byte.join('').toString();
    }

    decodeAES(){

    }
}

window.onload = function(){
    teste = new AES('abcdefghijklmnop', 1234567890123456);

    console.log(teste);
}