// 千分位分隔
function numFormat(num) {
  const numArr = num.toString().split('.')
  const intPartArr = numArr[0].split('').reverse()
  const resArr = []
  for (let i = 0; i < intPartArr.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      resArr.push(',')
    }
    resArr.push(intPartArr[i])
  }
  resArr.reverse()
  let res = resArr.join('')
  if (numArr[1]) {
    res += `.${numArr[1]}`
  }
  return res
}

function numFormat(num) {
  return num.toLocaleString()
}

function numFormat(num) {
  return num.toString().replace(/\d+/, (n) => { // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, $1 => $1 + ',')
  })
}

const num1 = 1234567894532
const num2 = 673439.4542
console.log(numFormat(num1))
console.log(numFormat(num2))