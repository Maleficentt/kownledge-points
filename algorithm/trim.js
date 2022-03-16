// 1.
String.prototype.trim = function () {
  return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}

// 2.
String.prototype.trim = function () {
  return this.replace(/^\s+/, '').replace(/\s+$/, '')
}

// 3.
String.prototype.trim = function () {
  return this.substring(Math.max(this.search(/\S/), 0),this.search(/\S\s*$/) + 1)
}

// 4.
String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, '')
}

// 5.
String.prototype.trim = function () {
  var str = this,
  whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000'
  for (var i = 0, len = str.length; i < len; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i)
      break
    }
  }
  for (i = str.length - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1)
      break
    }
  }
  return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''
}

// 6.
String.prototype.trim = function () {
  var str = this,
  str = str.replace(/^\s+/, '')
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1)
      break
    }
  }
  return str
}

const str = '  aa  bbb  cc  '
console.log(str.trim() + '|')

// 去掉中间的字符
String.prototype.trimMiddle = function () {
  return this.replace(/(\S)\s+(\b)/g,'$1$2')
  // 	\b 匹配一个单词边界，即字与空格间的位置
}

console.log(str.trimMiddle())