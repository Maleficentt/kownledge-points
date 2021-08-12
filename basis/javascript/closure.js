var name = 'window'
var obj = {
  name: 'object',
  getName: function() {
    return function() {
      return this.name
    }
  }
}
console.log(obj.getName()()) // 'window'
// obj.getName()() 实际上是在全局作用域中调用了匿名函数， this 指向 window （严格模式下为 undefined ）
// ============================================

var identity = 'The Window'
let object = {
  identity: 'My Object',
  getIdentity() {
    return this.identity
  }
}
object.getIdentity() // 'My Object'
(object.getIdentity)() // 'My Object'
(object.getIdentity = object.getIdentity)() // 'The Window'
/**
 * object.getIdentity() 的 getIdentity 是在对象 object 的环境中执行的，所以 this 指向 object 
 * 按照规范， object.getIdentity 和 (object.getIdentity) 是相等的
 * (object.getIdentity = object.getIdentity)() 执行了一次赋值，然后再调用赋值后的结果，因为赋值表达式的值是函数本身，this 值不再与任何对象绑定，所以 this 指向 window  （严格模式下为 undefined ）
 */
// ============================================

function fun(n,o){
  console.log(o);
  return {
    fun: function(m){
      return fun(m,n);
    }
  };
}

var a = fun(0);  // undefined
a.fun(1);        // 0      
a.fun(2);        // 0
a.fun(3);        // 0

var b = fun(0).fun(1).fun(2).fun(3);  // undefined 0 1 2

var c = fun(0).fun(1);  // undefined 0 
c.fun(2);        // 1
c.fun(3);        // 1