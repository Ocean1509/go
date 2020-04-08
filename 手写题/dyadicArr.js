// 创建二维数组的方法

function createDyadic(l) {
  return Array.from(new Array(l), () => new Array(l).fill(false))
}