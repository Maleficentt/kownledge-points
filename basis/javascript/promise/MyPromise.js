// 定义三个常量表示状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED  = 'rejected'

// 新建MyPromise类
class MyPromise {
  constructor (executor) {
    // executor是一个执行器，进入会立即执行
    // 传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      // 如果有错误，就直接reject
      this.reject(error)
    }
  }

  // 存储状态的变量，初始值是pending
  status = PENDING

  // 成功之后的值
  value = null
  // 失败之后的原因
  reason = null

  // 缓存成功与失败的回调
  // onFulfilledCallback = null
  // onRejectedCallback = null
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 箭头函数就可以让this指向当前实例对象
  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value
      // 当构造器中有异步代码时，判断成功回调是否存在，存在就调用
      // this.onFulfilledCallback && this.onFulfilledCallback(value)
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }
  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为失败
      this.status = REJECTED
      // 保存失败后的原因
      this.reason = reason
      // 当构造器中有异步代码时，判断失败回调是否存在，存在就调用
      // this.onRejectedCallback && this.onRejectedCallback(value)
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  // then的实现
  then (onFulfilled, onRejected) {
    // 如果then不传入参数，就使用默认函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    // then 方法要链式调用那么就需要返回一个 Promise 对象
    const promise2 = new MyPromise((resolve, reject) => {
      // 这里的内容在执行器中，会立即执行
      const fulfilledMicrotask = () => {
        // 创建一个微任务等待promise2完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = onFulfilled(this.value)
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            // 捕获错误
            reject(error)
          }
        })
      }
      const rejectedMicrotask = () => {
        // 创建一个微任务等待promise2完成初始化
        queueMicrotask(() => {
          try {
            // 获取失败回调函数的执行结果
            const x = onRejected(this.reason)
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            // 捕获错误
            reject(error)
          }
        })
      }
      // 判断状态
      if (this.status === FULFILLED) {
        // 调用成功回调，并把值返回
        // onFulfilled(this.value)
        fulfilledMicrotask()
      } else if (this.status === REJECTED) {
        // 调用失败回调，并把原因返回
        // onRejected(this.reason)
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 当构造器中有异步代码时，不知道后面状态的变化
        // 先将成功回调和失败回调存储起来
        // 等到执行的时候再传递
        // this.onFulfilledCallback = onFulfilled
        // this.onRejectedCallback = onRejected
        this.onFulfilledCallbacks.push(fulfilledMicrotask)
        this.onRejectedCallbacks.push(rejectedMicrotask)
      }
    })
    return promise2
  }

  // resolve 静态方法
  static resolve (parameter) {
    // 如果传入MyPromise就直接返回
    if (parameter instanceof MyPromise) {
      return parameter
    }
    return new MyPromise(resolve => {
      resolve(parameter)
    })
  }

  // reject 静态方法
  static reject (resaon) {
    return new MyPromise((resolve, reject) => {
      reject(resaon)
    })
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 判断是否return自身
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断x是否MyPromise 实例对象
  // 简化版
  // if (x instanceof MyPromise) {
  //   // 执行x，调用then方法，目的是将其状态变为fulfilled或者rejected
  //   // x.then(value => resolve(value), reason => reject(resaon))
  //   // 简化之后
  //   x.then(resolve, reject)
  // } else {
  //   resolve(x)
  // }

  // 按 Promise/A+ 规范
  if (typeof x === 'object' || typeof x === 'function') {
    if (x === null) {
      return resolve(x)
    }

    let then
    try {
      then = x.then
    } catch (error) {
      return reject(error)
    }

    if (typeof then === 'function') {
      let called = false
      try {
        then.call(
          x, // this 指向x
          // 如果resolvePromise以值y为参数被调用，则运行[[Resolve]](promise, y)
          y => {
            // 如果resolvePromise和rejectPromise均被调用
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量called
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject)
          },
          // 如果rejectPromise以原因r为参数被调用，则以原因r拒绝promise
          r => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return
        reject(error)
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x)
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x)
  }
}

MyPromise.deferred = function () {
  var result = {}
  result.promise = new MyPromise(function(resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

module.exports = MyPromise