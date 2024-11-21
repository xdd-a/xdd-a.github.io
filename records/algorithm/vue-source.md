---
title: vue源码
date: 2024/11/11
author: xdd
---
[参考文献](https://vue-js.com/learn-vue/)

## 第一章、变化侦测篇

### Object 的变化侦测

#### 使 Object 数据变得 “可观测”
- 我们通过 Object.defineProperty() 方法为对象添加 getter 和 setter 方法
  - 当访问对象的属性时，getter 会被调用
  - 当修改对象的属性时，setter 会被调用
- 在 vue 中，定义了 `Observer` 类，在构造函数中，为对象自身设置了 `__ob__` 属性，value 是 `Observer 实例`
```js

class Observer {
    constructor(value){
        this.value = value;
        // 给 value 打上标记，表示已经转为响应式的了，避免重复操作。
        def(value, '__ob__', this);
        if(Array.isArray(value)){

        }else{
            // 如果是对象，则将对象中的所有属性，转为可观测的。
            this.walk(value);
        }
    }

    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }


    /**
     * 使一个对象转化成可观测对象
     * @param {Object} obj 要被转化成可观测对象的普通对象
     * @param {String} key 对象的某个属性
     * @param {*} val 对象的某个属性的值
     */
    defineReactive(obj,key,val){
        // 如果没传 val 则取 obj[key] 的值
        if(arguments.length === 2){
            val = obj[key];
        }

        // 如果 val 是对象，则递归调用 Observer 构造函数
        if(typeof val === "object"){
            new Observer(val);
        }

        Object.defineProperty(obj,key,{
            // 可枚举的。
            enumerable: true,
            // 可更改的。
            configurable: true,
            get() {
                console.log("我被读取了")
                return val;
            },
            set(newVal) {
                console.log("我被赋值了")
                if(val === newVal) return;
                val = newVal;
            }
        })
    }
}



```
#### 依赖收集
- 将对象变得可观测之后，我们又如何通知视图去发生变更呢？
  - 答案就是依赖收集，我们可以通过谁使用了该数据，就更新对应的视图。
  - 在 `getter` 的时候收集依赖，在 `setter` 的时候通知依赖更新
- 在 vue 中 是通过实现了一个 `Dep` 依赖管理类，在内部添加了一个 `depend` 方法来收集依赖，`notify` 方法来通知依赖更新
  - 之后在 `getter` 中，调用 `dep.depend()` 收集依赖
  - 在 `setter` 中，调用 `dep.notify()` 通知依赖进行更新

```js

class Dep {
    constructor(){
        this.subs = [];
    }

    addSub(sub){
        this.subs.push(sub);
    }

    depend(){
        if(window.target){
            this.addSub(window.target);
        }
    }


    notify(){
        const sub = this.subs.slice();
        for(let i = 0; i < subs.length; i++){
            subs[i].update();
        }
    }
}

class Observer {
    constructor(value){
        this.value = value;
        // 给 value 打上标记，表示已经转为响应式的了，避免重复操作。
        def(value, '__ob__', this);
        if(Array.isArray(value)){

        }else{
            // 如果是对象，则将对象中的所有属性，转为可观测的。
            this.walk(value);
        }
    }

    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i]);
        }
    }


    /**
     * 使一个对象转化成可观测对象
     * @param {Object} obj 要被转化成可观测对象的普通对象
     * @param {String} key 对象的某个属性
     * @param {*} val 对象的某个属性的值
     */
    defineReactive(obj,key,val){
        // 如果没传 val 则取 obj[key] 的值
        if(arguments.length === 2){
            val = obj[key];
        }

        // 如果 val 是对象，则递归调用 Observer 构造函数
        if(typeof val === "object"){
            new Observer(val);
        }

        Object.defineProperty(obj,key,{
            // 可枚举的。
            enumerable: true,
            // 可更改的。
            configurable: true,
            get() {
                console.log("我被读取了")
                新增 `dep.depend()`
                return val;
            },
            set(newVal) {
                console.log("我被赋值了")
                if(val === newVal) return;
                val = newVal;
                新增 `dep.notify()`
            }
        })
    }
}



```

#### 依赖到底是谁？
- 我们完成了依赖收集，但是我们收集的依赖到底是谁呢？
- 在 vue 中，实现了 `Watcher` 类，这个类的实例，就是依赖的那个 `谁`，谁用到了数据，我们就为谁创建一个 `Watcher`类实例，之后数据变化的时候，我们只需要通知依赖的`Watcher 实例`，由他去更新视图
- 实例化 `Watcher`类的时候，会先执行他的构造函数，在构造函数中，调用了一个方法 `this.get()` 的实例方法，将实例自身赋值给了全局的唯一对象 `window.target`。通过 `this.getter.call(vm,vm)`获取被依赖的数据,获取到数据之后相当于调用依赖的getter，然后调用dep.depend 收集依赖，将windwo.target的值存入依赖数组,然后清空window.target
- Watcher 将自身实例，设置到 `window.target` 中，然后读取数据，因为读了数据，所以会触发这个数据的 `getter`，紧接着 getter中会将window.target上的值加入依赖数组中，然后清空window.target
```js
class Watcher {
    constructor(vm,exOrFn,cb){
        this.vm = vm;
        this.exOrFn = exOrFn;
        this.cb = cb;
        this.getter = parsePath(exOrFn);
        this.value = this.get():
    }

    get(){
        window.target = this;
        let value = this.getter.call(vm,vm);
        window.target = undefined;
        return value;
    }

    const bailRe = /[^\w.$]/
    parsePath(exOrFn){
        if(typeof exOrFn === "function"){
            return exOrFn;
        }

        if(bailRe.test(exOrFn)){
            return;
        }

        const segments = exOrFn.split('.')
        return function(obj){
            for(let i = 0; i < segments.length; i++){
                if(!obj) return;
                obj = obj[segments[i]]
            }
            return obj;
        }
    }
}




```



### Array 的变化侦测

#### 在哪收集依赖？
- Array 类型的数据，还是在 `getter` 中进行收集,这是因为数据本身还是在data对象下的

#### 观测
- 通过对数组的原型方法进行重写来达到观测目的

```js
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

const methodsToPatch = ['push','pop','shift','unshift','splice','sort','reverse']

methodsToPatch.forEach(method => {
    const original = arrayProto[method]
    // 像数组的原型方法添加拦截，例如，每当执行array.push的时候，实际上执行的就是mutaor方法，这样就可以方便我们在mutaor方法中增加一些自定义的逻辑
    Object.defineProperty(arrayMethods,method, {
        enumerable: false,
        configurable: true,
        writeable: true,
        value:function mutator(...args){
                const result = original.apply(this, args)
                return result
             }
    })
})

// 改写一下 observer类,使得支持数组观测
class Observer {
    constructor(value){
        this.value = value;
        def(value, '__ob__', this);
        if(Array.isArray(value)){
            const augment = hasProto
            ? protoAugment
            : copyAugment
        // arrayMethods 就是基于数组原型创建的对象
        // arrayKeys 数组的每个方法
         augment(value, arrayMethods, arrayKeys)
        }else{
            this.walk(value);
        }
    }

    // 首先判断，当前浏览器环境是否支持 __proto__
    const hasProto = '__proto__' in {}
    // 如果支持的话，则直接将__proto__ 设置为arrayKey
    const protoAugment = (value, src, keys) => {
        value.__proto__ = src;
    }
    // 如果不支持，则通过 defineProperty 来进行设置
    const copyAugment = (value,src,keys)=>{
        for(let i = 0; i < keys.length; i++){
            const key = keys[i]
            // 将数组的每个方法，通过拦截器加到value上。
            def(value, key, src[key])
        }
    }
}

```

#### 依赖收集
- 数组的依赖收集是在 `getter` 中收集的，但是呢，数组的 `getter/setter` 方法都是在 `Observer` 类中添加的，所以依赖收集也应该在 `Observer` 类中进行
```js
class Observer {
    constructor(value){
        this.value = value;
        this.dep = new Dep();//增加一个依赖收集器
        def(value,'__ob__', this);
        if(Array.isArray(value)){
            const augment = hasProto
            ? protoAugment
            : copyAugment
            // arrayMethods 就是基于数组原型创建的对象
            // arrayKeys 数组的每个方法
            augment(value, arrayMethods, arrayKeys)
        }else{
            this.walk(value);
        }
    }
}






```