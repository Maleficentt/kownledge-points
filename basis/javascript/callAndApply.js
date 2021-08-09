// 模拟实现call
// call()方法在使用一个指定的this值和若干个指定的参数值的前提下调用某个函数
// var foo = {
//   value: 1
// }
// function bar() {
//   console.log(this.value)
// }

// bar.call(foo)
// 1. call改变了this的指向，指向foo
// 2. bar函数执行了

// 试想当调用 call 的时候，把 foo 对象改造成如下：
// var foo = {
//   value: 1,
//   bar: function() {
//       console.log(this.value)
//   }
// }
// foo.bar()
// 这样做给foo添加了一个属性，要使用delete把它删除

// 实现步骤
// 1.将函数设为对象的属性
// 2.执行该函数
// 3.删除该函数
// 4.解决call传入不定参数的问题（使用argumens）
Function.prototype._call = function(context) {
  // context = context || window // this参数可以传入null当为null时，视为指向window（浏览器环境下）
  // 首先获取调用call的函数，用this可以获取
  context.fn = this
  // call可以传入多个参数，从Arguments对象中取值
  var args = []
  // es3方式
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']')
  }
  var result = eval('context.fn(' + args + ')')
  // es6实现
  // for (var i = 1, len = arguments.length; i < len; i++) {
  //   args.push(arguments[i])
  // }
  // var result = context.fn(...args)
  delete context.fn
  return result // 当函数有返回值
}

// 模拟实现apply
// apply的实现跟call类似，传参不同
Function.prototype._apply = function(context, arr) {
  // context = context || window
  context.fn = this
  var result
  if (!arr) {
    result = context.fn()
  } else {
    // result = context.fn(...arr)
    var args = []
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('args[' + i + ']')
    }
    result = eval('context.fn(' + args + ')')
  }
  delete context.fn
  return result
}

// test
var foo = {
  value: 1
}
var value = 2
function bar(name, age) {
  console.log(this.value)
  // console.log(name)
  // console.log(age)
  return {
    value: this.value,
    name: name,
    age: age
  }
}
// bar._call(null)
bar._call(foo, 'jqq', 18)
console.log(bar._call(foo, 'jqq', 18))
bar._apply(foo)
bar._apply(foo, ['jqq', 18])
console.log(bar._apply(foo, ['jqq', 18]))