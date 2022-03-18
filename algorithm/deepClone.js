// 浅拷贝
function clone (target) {
  const result = {}
  for (const key in target) {
    result[key] = target[key]
  }
  return result
}

// 深拷贝基础版
function deepClone (target) {
  if (typeof target === 'object') {
    const result = {}
    for (const key in target) {
      result[key] = deepClone(target[key])
    }
    return result
  } else {
    return target
  }
}

// 考虑数组
function deepClone (target) {
  if (typeof target === 'object') {
    let result = Array.isArray(target) ? [] : {}
    for (const key in target) {
      result[key] = deepClone(target[key])
    }
    return result
  } else {
    return target
  }
}

// 循环引用（对象的属性间接或直接的引用了自身的情况）
// 额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系
// 当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回
/**
 * 检查map中有无克隆过的对象
 * 有 - 直接返回
 * 没有 - 将当前对象作为key，克隆对象作为value进行存储
 * 继续克隆
 */
function deepClone1 (target, map = new WeakMap()) {
  if (typeof target === 'object') {
    const result = Array.isArray(target) ? [] : {}
    if (map.get(target)) {
      return map.get(target)
    }
    map.set(target, result)
    for (const key in target) {
      result[key] = deepClone(target[key], map)
    }
    return result
  } else {
    return target
  }
}

// 性能优化
// for...in 效率低，while效率高
/**
 * 使用while实现遍历函数
 * @param {Array} array 
 * @param {Funtion} iterate 遍历器
 */
function forEach(array, iterate) {
  let index = -1
  const length = array.length
  while (++index < length) {
    iterate(array[index], index)
  }
  return array
}

function deepClone (target, map = new WeakMap()) {
  if (typeof target === 'object') {
    const isArray = Array.isArray(target)
    const result = isArray ? [] : {}
    if (map.get(target)) {
      return map.get(target)
    }
    map.set(target, result)
    const keys = isArray ? undefined : Object.keys(target)
    forEach(keys || target, (value, key) => {
      if (keys) {
        key = value
      }
      result[key] = deepClone(target[key], map)
    })
    return result
  } else {
    return target
  }
}

// 其他数据类型
/**
 * 判断引用类型
 * @param {*} target 
 * @returns 是否对象
 */
function isObject (target) {
  const type = typeof target
  return target !== null && (type === 'object' || type === 'function')
}
/**
 * 获取数据类型
 * @param {*} target 
 * @returns 数据类型
 */
function getType (target) {
  return Object.prototype.toString.call(target)
}
// 可继续遍历对象
const mapTag = '[object Map]'
const setTag = '[object Set]'
const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const argsTag = '[object Argumenets]'
// 不可继续遍历对象
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const numberTag = '[object Number]'
const regexpTag = '[object RegExp]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const funcTag = '[object Function]'
const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag]
/**
 * 获取初始化数据
 * @param {*} target 
 * @returns 
 */
function getInit (target) {
  const Ctor = target.constructor
  return new Ctor
  // 使用了原对象的构造方法，可以保留对象原型上的数据
}
/**
 * 克隆正则
 * @param {Refexp} target 
 * @returns 
 */
function cloneReg(target) {
  const reFlags = /\w*$/
  const result = new target.constructor(target.source, reFlags.exec(target))
  result.lastIndex = target.lastIndex
  return result
}
/**
 * 克隆Symbol
 * @param {Symbol} target 
 * @returns 
 */
function cloneSymbol (target) {
  return Object(Symbol.prototype.valueOf.call(target))
}
/**
 * 拷贝不可遍历的类型
 * @param {*} target 
 * @param {*} type 
 * @returns 
 */
function cloneOtherType (target, type) {
  const Ctor = target.constructor
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(target) // 使用构造函数和原始数据创建一个对象
    case regexpTag:
      return cloneReg(target)
    case symbolTag:
      return cloneSymbol(target)
    default:
      return null
  }
}
/**
 * 克隆函数
 * @param {Function} target 
 * @returns 
 */
function cloneFunction (target) {
  // 通过prototype来区分下箭头函数和普通函数，箭头函数是没有prototype的
  // 使用eval和函数字符串来重新生成一个箭头函数，注意这种方法是不适用于普通函数的
  // 使用正则来处理普通函数：分别使用正则取出函数体和函数参数，然后使用new Function ([arg1[, arg2[, ...argN]],] functionBody)构造函数重新构造一个新的函数
  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const paramReg = /(?<=\().+(?=\)\s+{)/
  const funcString = func.toString()
  if (func.prototype) { // 普通函数
    const param = paramReg.exec(funcString)
    const body = bodyReg.exec(funcString)
    if (body) { // 匹配到函数体：body[0]
      if (param) { // 匹配到参数：param[0]
        const paramArr = param[0].split(',')
        return new Function(...paramArr, body[0])
      } else {
        return new Function(body[0])
      }
    }
  } else { // 箭头函数
    return eval(funcString)
  }
}
function deepClone (target, map = new WeakMap()) {
  // 克隆原始类型
  if (!isObject(target)) {
    return target
  }
  // 获取数据类型
  const type = getType(target)

  // 初始化
  let result
  if (deepTag.includes(type)) {
    result = getInit(target)
  } else {
    return cloneOtherType(target, type)
  }

  // 防止循环引用
  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, result)

  // 克隆Set
  if (type === setTag) {
    target.forEach(value => {
      result.add(deepClone(value, map))
    })
    return result
  }

  // 克隆Map
  if (type === mapTag) {
    target.forEach((value, key) => {
      result.set(key, deepClone(value, map))
    })
    return result
  }

  // 克隆对象和数组
  const keys = type === arrayTag ? undefined : Object.keys(target)
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value
    }
    result[key] = deepClone(target[key], map)
  })
  return result
}
// test
const map = new Map()
map.set('dudu', '臭')
map.set('lulu', '香')
const set = new Set()
set.add('dudu')
set.add('lulu')
const target = {
  field1: 1,
  field2: undefined,
  field3: 'field3',
  field4: {
      child: 'child',
      child2: {
          child2: 'child2'
      }
  },
  field5: [2, 4, 6],
  empty: null,
  map,
  set,
  bool: new Boolean(true),
  num: new Number(8),
  str: new String('str'),
  symbol: Object(Symbol(1)),
  date: new Date(),
  reg: /\d+/,
  error: new Error(),
  func1: () => {
    console.log('I am lulu')
  },
  func2: function (a, b) {
    return a + b
  }
}
target.target = target
const cloneObj = deepClone(target)
console.log(cloneObj)
// cloneObj.field1 = 2
// cloneObj.field4.child = '_child'
// cloneObj.field4.child2.child2 = '_child2'
// cloneObj.field5[1] = 5
// console.log('target', target)
// console.log('cloneObj', cloneObj)
// console.time()
// const result = deepClone1(target)
// console.timeEnd()

// console.time()
// const result2 = deepClone(target)
// console.timeEnd()

