// 双重循环
function unique (arr) {
  const resultArr = []
  for (let i = 0; i < arr.length; i++) {
    if (resultArr.length === 0) {
      resultArr.push(arr[i])
    } else {
      for (let j = 0; j < resultArr.length; j++) {
        if (arr[i] === resultArr[j]) {
          break
        }
        // 如果arr[i]是唯一的，那么执行完循环，j等于resultArr.length - 1
        if (j === resultArr.length - 1) {
          resultArr.push(arr[i])
        }
      }
    }
  }
  return resultArr
}

// indexOf / includes
function unique (arr) {
  const resultArr = []
  for (let i = 0; i < arr.length; i++) {
    // if (resultArr.indexOf(arr[i]) === -1) {
    if (!resultArr.includes(arr[i])) {
      resultArr.push(arr[i])
    }
  }
  return resultArr
}

// 排序后去重：与前一个值比较
function unique (arr) {
  const resultArr = []
  for (let i = 0; i < arr.length; i++) {
    if (!i || arr[i] !== arr[i - 1]) {
      resultArr.push(arr[i])
    }
  }
  return resultArr
}

// filter + indexOf
function unique (arr) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })
}

// filter + Map
function unique (arr) {
  const map = new Map()
  return arr.filter(item => {
    if (!map.has(item)) {
      map.set(item, 1)
      return true
    }
    // 简写：!map.has(item) && map.set(item, 1)
  })
}

// Set
function unique (arr) {
  // return Array.from(new Set(arr))
  return [...new Set(arr)]
}

const arr = [1, 1, 1, 2, 2, 3]
console.log(unique(arr))