// concat + 递归
function flat (arr, depth = 1) {
  if (depth <= 0) { // 若depth <= 0，则直接返回
    return arr
  }
  let resultArr = []
  arr.forEach(item => {
    if (Array.isArray(item)) {
      resultArr = resultArr.concat(flat(item, depth - 1))
    } else {
      resultArr.push(item)
    }
  })
  return resultArr
}

// reduce + 递归
function flat (arr, depth = 1) {
  return depth > 0 ? arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur)
  }, []) : arr.slice()
}

// 使用堆栈
function flat (arr, depth = 1) {
  const stack = [...arr]
  const resultArr = []
  while (stack.length) {
    // 使用pop从stack中取出并移除值
    const next = stack.pop()
    if (Array.isArray(next)) {
      // 使用push送回内层数据中的元素，不会改动原始数据
      stack.push(...next)
    } else {
      resultArr.push(next)
    }
  }
  return resultArr.reverse()
}

// 使用Generator
function *flatGenerator (arr, depth = 1) {
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      yield* flatGenerator(item, depth - 1)
    } else {
      if (item !== undefined) {
        yield item
      }
    }
  }
}

function flat(arr, depth) {
  return [...flatGenerator(arr, depth)]
}

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5,, 'string', { name: 'dudu' }]
console.log(flat(arr))