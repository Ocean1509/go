// 字符串转二进制

function charToBinary(text) {
    var code = "";
    for (let i of text) {
      // 字符编码
      let number = i.charCodeAt().toString(2);
      // 1 bytes = 8bit，将 number 不足8位的0补上
      for (let a = 0; a <= 8 - number.length; a++) {
         number = 0 + number;
      }
      code += number;
    }
    return code;
  }


  // 二进制转base64
  // 将二进制数据每 6bit 位替换成一个 base64 字符
function binaryTobase64(code) {
    let base64Code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let res = '';
    // 1 bytes = 8bit，6bit 位替换成一个 base64 字符
    // 所以每 3 bytes 的数据，能成功替换成 4 个 base64 字符
      
    // 对不足 24 bit (也就是 3 bytes) 的情况进行特殊处理
    if (code.length % 24 === 8) {
      code += '0000';
      res += '=='
    }
    if (code.length % 24 === 16) {
      code += '00';
      res += '='
    }
  
    let encode = '';
    // code 按 6bit 一组，转换为
    for (let i = 0; i < code.length; i += 6) {
      let item = code.slice(i, i + 6);
      encode += base64Code[parseInt(item, 2)];
    }
    return encode + res;
  }

  // node

  function transfer(str) {
    let base64Code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let buf = Buffer.from(str);
    let result = ""
    console.log(buf)
    for(let b of buf) {
      result += b.toString(2)
    }
    return result.match(/\d{6}/g).map(val => parseInt(val, 2)).map(val => base64Code[val]).join('')
  }

  console.log(transfer("dfds"))


