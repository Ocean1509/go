// JSON.stringify

// 规范
// string,number,boolean转换成基本类型
// Symbol, function, undefined在对象实例化过程会被忽略，在数组实例化过程会被当成null
// 不可枚举属性不会被序列化

function jsonStringify(obj) {
  let type = typeof(obj)
  if ((/symbol|function|undefined/).test(type)) return undefined
  if(!(/object/).test(type)) return String(obj)
  let join = []
  let arr = (obj && obj.constructor === Array);
  for(let k in obj) {
    let value = obj[k]
    let type = typeof value
    if((/symbol|function|undefined/).test(type)) continue
    if(/object/.test(type)) {
      value = jsonStringify(value)
    }
    join.push((arr ? "" : '"' + k + '":') + String(value));
  }
  return (arr ? "[" : "{") + String(join) + (arr ? "]" : "}")
}

console.log(jsonStringify({})); // '{}'
console.log(jsonStringify(true)); // 'true'
console.log(jsonStringify("foo")); // '"foo"'
console.log(jsonStringify([1, "false", false])); // '[1,"false",false]'
console.log(jsonStringify({
  x: 5
})); // '{"x":5}'

console.log(jsonStringify({
  x: 5,
  y: 6
}));
// "{"x":5,"y":6}"

console.log(jsonStringify([new Number(1), new String("false"), new Boolean(false)]));
// '[1,"false",false]'

console.log(jsonStringify({
  x: undefined,
  y: Object,
  z: Symbol("")
}));
// '{}'

console.log(jsonStringify([undefined, Object, Symbol("")]));
// // '[null,null,null]' 



// // undefined 

// // 不可枚举的属性默认会被忽略：
console.log(jsonStringify(
  Object.create(
    null, {
      x: {
        value: 'x',
        enumerable: false
      },
      y: {
        value: 'y',
        enumerable: true
      }
    }
  )
));

// "{"y":"y"}"
// JSON.stringify代码规范中还有一条：
// 转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。


// JSON.parse
// 两种实现方式
// eval容易出现xss漏洞，所以需要对字符串进行过滤
// eval 和 Function
eval('('+opt +')')
(new Function('return '+opt))()


// 针对xss
var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
if (
    rx_one.test(
        json
            .replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
    )
) {
    var obj = eval("(" +json + ")");
}