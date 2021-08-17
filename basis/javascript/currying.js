// 柯里化
// 固定参数个数
function currying(func, args) {
  var arity = func.length; // func参数的个数
  var args = args || [];
  return function() {
      var _args = [].slice.call(arguments); // 将类数组转换成数组
      [].push.apply(_args, args);
      // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
      if (_args.length < arity) {
          return currying.call(this, func, _args);
      }
      // 参数收集完毕，则执行func
      return func.apply(this, _args);
  }
}

function add(a, b, c) {
  return a + b + c;
}

var add = currying(add);

console.log(add(1, 2, 3));
console.log(add(1)(2)(3));
console.log(add(1, 2)(3));
console.log(add(1)(2, 3));

// 无限参数的柯里化
// 实现一个add方法，使计算结果能够满足如下预期：
// add(1)(2)(3) = 6;
// add(1, 2, 3)(4) = 10;
// add(1)(2)(3)(4)(5) = 15;
function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = [].slice.call(arguments);

  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  var adder = function () {
      var _adder = function() {
          // [].push.apply(_args, [].slice.call(arguments));
          _args.push(...arguments);
          return _adder;
      };

      // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
      _adder.toString = function () {
          return _args.reduce(function (a, b) {
              return a + b;
          });
      }

      return _adder;
  }
  // return adder.apply(null, _args);
  return adder(..._args);
}

var a = add(1)(2)(3)(4);   // f 10
var b = add(1, 2, 3, 4);   // f 10
var c = add(1, 2)(3, 4);   // f 10
var d = add(1, 2, 3)(4);   // f 10

// 可以利用隐式转换的特性参与计算
console.log(a + 10); // 20
console.log(b + 20); // 30
console.log(c + 30); // 40
console.log(d + 40); // 50

// 也可以继续传入参数，得到的结果再次利用隐式转换参与计算
console.log(a(10) + 100);  // 120
console.log(b(10) + 100);  // 120
console.log(c(10) + 100);  // 120
console.log(d(10) + 100);  // 120