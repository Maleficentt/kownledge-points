// 继承

// 原型链继承
// function SuperType() {
//   this.property = true
//   this.colors = ['red', 'blue', 'green'] // 引用类型
// }
// SuperType.prototype.getSuperValue = function() {
//   return this.property
// }
// function SubType() {
//   this.subproperty = false
// }
// // 继承
// SubType.prototype = new SuperType()
// SubType.prototype.getSubValue = function() {
//   return this.subproperty
// }
// let instance1 = new SubType()
// console.log(instance1.getSuperValue()) // true
// instance1.colors.push('black')
// console.log(instance1.colors) // [ 'red', 'blue', 'green', 'black' ]
// let instance2 = new SubType()
// console.log(instance2.colors) // [ 'red', 'blue', 'green', 'black' ]

/**
 * 缺点：
 * 1、原型中包含的引用值会在所有实例间共享
 * 2、子类型在实例化时不能给父类型的构造函数传参
 */

// ============= 原型链继承 end ==============

// 盗用构造函数（对象伪装/经典继承）
// 基本思路：在子类构造函数中调用父类构造函数
// function SuperType(name) {
//   this.colors = ['red', 'blue', 'green'] // 引用类型
//   this.name = name
// }
// function SubType() {
//   // 继承
//   SuperType.call(this, 'Jqq')
// }
// let instance1 = new SubType()
// instance1.colors.push('black')
// console.log(instance1.colors) // [ 'red', 'blue', 'green', 'black' ]
// let instance2 = new SubType()
// console.log(instance2.colors) // [ 'red', 'blue', 'green', 'black' ]

/**
 * 优点：
 * 1、避免了引用类型的属性被所有实例共享
 * 2、子类型在实例化时可以给父类型的构造函数传参
 * 缺点：
 * 必须在构造函数中定义方法，因此函数不能重用，子类也不能访问父类原型上定义的方法
 */

// ============= 盗用构造函数 end ==============

// 组合继承（伪经典继承）
// 综合了原型链和盗用构造函数：使用原型链继承原型上的属性和方法，通过盗用构造函数继承实例属性
function SuperType(name) {
  this.colors = ['red', 'blue', 'green'] // 引用类型
  this.name = name
}
SuperType.prototype.sayName = function() {
  console.log(this.name)
}
function SubType(name, age) {
  SuperType.call(this, name) // 继承属性 第二次调用SuperType()
  this.age = age
}
// SubType.prototype = new SuperType() // 继承方法 第一次调用SuperType()
// // SubType.prototype.constructor = SubType // constructor 指向自身 ？？
// SubType.prototype.sayAge = function() {
//   console.log(this.age)
// }
// let instance1 = new SubType('Jqq', 18)
// instance1.colors.push('black')
// console.log(instance1.colors) // [ 'red', 'blue', 'green', 'black' ]
// instance1.sayName() // 'Jqq'
// instance1.sayAge() // 18
// console.log(instance1 instanceof SubType) // true
// console.log(instance1 instanceof SuperType) // true
// let instance2 = new SubType('Dudu', 19)
// console.log(instance2.colors) // [ 'red', 'blue', 'green' ]
// instance2.sayName() // 'Dudu'
// instance2.sayAge() // 19
// console.log(SubType.prototype.isPrototypeOf(instance2)) // true
// console.log(SuperType.prototype.isPrototypeOf(instance2)) // true
// console.log(SubType.prototype.constructor)

/**
 * 优点：
 * 1、弥补了原型链和盗用构造函数的不足
 * 2、保留了instanceof操作符和isPrototypeOf()方法识别合成对象的能力
 * 缺点：
 * 1、效率问题：父类构造函数始终会被调用两次，一次是在创建子类原型时，一次是在创建子类实例时（在子类构造函数中调用）
 */

// ============= 组合继承 end ==============

// 原型式继承
// 出发点：即使不自定义类型也可以通过原型实现对象之间的信息共享
function object(o) { // Object.create()的模拟实现
  function F() {}
  F.prototype = o
  return new F()
}
let person = {
  name: 'Jqq',
  friends: ['Lily', 'Rose']
}
let anotherPerson1 = object(person)
anotherPerson1.name = 'Gay'
anotherPerson1.friends.push('Leize')
let anotherPerson2 = object(person)
anotherPerson2.name = 'Linda'
anotherPerson2.friends.push('Rob')
console.log(person.friends) // [ 'Lily', 'Rose', 'Leize', 'Rob' ]

/**
 * ECMAScript 5 通过增加 Object.create()方法将原型式继承的概念规范化了。这个方法接收两个参数：作为新对象原型的对象，以及给新对象定义额外属性的对象（第二个可选）。在只有一个参数时，Object.create()与这里的 object()方法效果相同
 * Object.create()的第二个参数与 Object.defineProperties()的第二个参数一样：每个新增属性都通过各自的描述符来描述。以这种方式添加的属性会遮蔽原型对象上的同名属性
 */

/**
 * 适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合
 * 缺点：属性中包含的引用值始终会在相关对象间共享，与原型链继承类似
 */

// ============= 原型式继承 end ==============

// 寄生式继承
/**
 * 创建一个实现继承的函数，以某种方式增强对象，然后再返回这个对象
 * @param {Object} original 新对象的基准对象
 * @returns {Object}
 */
function createAnother(original) {
  let clone = object(original) // 通过调用函数创建一个新对象，同等于 let clone = Object.create(original)
  clone.sayHi = function() { // 以某种方式增强这个对象
    console.log('hi')
  }
  return clone
}
let anotherPerson3 = createAnother(person)
anotherPerson3.sayHi() // 'hi'

/**
 * 适合主要关注对象，而不在乎类型和构造函数的场景
 * 缺点：给对象添加函数会导致函数难以重用，与构造函数类似
 */

// ============= 寄生式继承 end ==============

// 寄生式组合继承
// 使用寄生式继承来继承父类原型，然后将返回的新对象赋值给子类原型
/**
 * 实现组合继承中的子类型原型赋值
 * @param {Function} subType 子类构造函数
 * @param {Function} superType 父类构造函数
 */
function inheritPrototype(subType, superType) {
  let prototype = object(superType.prototype) // 创建父类原型的一个副本对象 object = Object.create
  prototype.constructor = subType // 增强对象
  subType.prototype = prototype // 赋值对象
}
inheritPrototype(SubType, SuperType)
SubType.prototype.sayAge = function() {
  console.log(this.age)
}
const instance1 = new SubType('Jqq', 18)
instance1.sayAge() // 18

/**
 * 效率更高
 * 原型链仍然保持不变，instanceof操作符和isPrototypeOf()方法正常有效
 * 可以算是引用类型继承的最佳模式
 */

// ============= 寄生式组合继承 end ==============