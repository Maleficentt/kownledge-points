// bind()方法会创建一个新函数。当这个函数被调用时，bind()的第一个参数将作为运行时的this，之后的一序列参数将会在传递的实参前传入作为它的参数
// bind函数的两个特点
// 1.返回一个函数
// 2.可以传入参数(在bind的时候可以传参，在执行bind返回函数的时候也可以传参)
// 3.bind返回的函数作为构造函数时，bind时指定的this值会失效，但传入的参数依然生效

Function.prototype._bind = function(context) {
  // 调用bind的不是函数，要报错
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind - what is trying to be bound is not callable')
  }
  var self = this
  // 获取_bind函数从第二个参数到最后一个参数
  var args = Array.prototype.slice.call(arguments, 1)
  // return function() {
  //   // 获取返回函数传入的参数
  //   var bingArgs = Array.prototype.slice.call(arguments)
  //   return self.apply(context, args.concat(bingArgs)) // 绑定函数可能有返回值
  // }
  // 使用空函数进行中转，避免修改fBound.propotype时修改绑定函数的prototype
  var fNOP = function() {}
  var fBound = function() {
    var bindArgs = Array.prototype.slice.call(arguments)
    // this instanceof fBound ?
    // 当作为构造函数时，this指向实例，此时结果为true，将绑定函数的this指向该实例，可以让实例获得来自绑定函数的值
    // 当作为普通函数时，this指向window，此时结果为false，将绑定函数的this指向context
    return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs))
  }
  // 修改返回函数的propotype为绑定函数的prototype，实例就可以继承绑定函数的原型中的值
  fNOP.prototype = this.prototype
  fBound.prototype = new fNOP()
  return fBound
}

// test
var foo = {
  value: 1
};
var value = 2
function bar(name, age) {
  this.habbit = 'shopping'
  console.log(this.value);
  console.log(name)
  console.log(age)
  // return this.value
}
bar.prototype.friend = 'chashao'
var bindFoo1 = bar._bind(foo);
var bindFoo2 = bar._bind(foo, 'jqq');
bindFoo1();
bindFoo2(18);
console.log(bindFoo1())
var bindFoo = bar._bind(foo, 'jqq')
var obj = new bindFoo(18)
console.log(obj.habbit)
console.log(obj.friend)
