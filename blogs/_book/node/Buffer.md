![](../imgs/buffer.png)

```js
// 创建一个长度为 10、以零填充的 Buffer。
const buf1 = Buffer.alloc(10);

// 创建一个长度为 10 的 Buffer，
// 其中全部填充了值为 `1` 的字节。
const buf2 = Buffer.alloc(10, 1);

// 创建一个长度为 10、且未初始化的 buffer。
// 这个方法比调用 Buffer.alloc() 更快，
// 但返回的 Buffer 实例可能包含旧数据，
// 因此需要使用 fill()、write() 或其他能填充 Buffer 的内容的函数进行重写。
const buf3 = Buffer.allocUnsafe(10);

// 创建一个包含字节 [1, 2, 3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);

// 创建一个包含字节 [1, 1, 1, 1] 的 Buffer，
// 其中所有条目均使用 `(value & 255)` 进行截断以符合 0-255 的范围。
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// 创建一个 Buffer，其中包含字符串 'tést' 的 UTF-8 编码字节：没有指定编码，则默认用utf-8
// [0x74, 0xc3, 0xa9, 0x73, 0x74]（以十六进制表示）(默认)
// [116, 195, 169, 115, 116]（以十进制表示）
const buf6 = Buffer.from('tést');

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf7 = Buffer.from('tést', 'latin1');
```