class Char {
    constructor(char){
        if(typeof char == 'number')
            char = String.fromCharCode(char);
              
        this.byte = char;
        this.bits = char.charCodeAt().toString(2).padStart(8, '0').split('');
        this.charCode10 = char.charCodeAt();
        this.charCode16 = char.charCodeAt().toString(16);
    }

    updateByte(value){
        this.byte = value;
        this.bits = parseInt(value.charCodeAt()).toString(2).padStart(8, '0').split('');
        this.charCode10 = value.charCodeAt();
        this.charCode16 = value.charCodeAt().toString(16);
    }

    updateBits(value){
        this.byte = String.fromCharCode(parseInt(value, 2));
        this.bits = value.padStart(8, '0');
        this.charCode10 = parseInt(value, 2);
        this.charCode16 = parseInt(value, 2).toString(16);
    }

    updateCharCode10(value){
        this.byte = String.fromCharCode(value);
        this.bits = parseInt(value).toString(2);
        this.charCode10 = value;
        this.charCode16 = parseInt(value, 10).toString(16);
    }

    updateCharCode16(value){
        this.byte = String.fromCharCode(value);
        this.charCode10 = parseInt(parseInt(value, 16).toString(10));
        this.bits = this.charCode10.toString(2).padStart(8, '0').split('');     
        this.charCode16 = value;
    }
}

class Integer{
    
    static encode_uint8(integer){
        return integer % 128;
    }

    static encode_uint16(integer){
        return integer % 256;
    }

    static encode_uint32(integer){
        return integer % 512;
    }
}