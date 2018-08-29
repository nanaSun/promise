本文主要讲述迭代器（iterator）和生成器`*/yield`之间的联系和各自的用法，以及生成器的高配版本`aysnc/await`的使用。

大纲：

* 迭代器（iterator）
* 生成器 `*/yield`
* 异步版生成器 `aysnc/await`


## 迭代器（iterator）

先瞅瞅“迭代”，这个词是什么意思呢？每一次“过程”的重复，称之为迭代。不过迭代是会保留结果的，也就说每次都是以上一次迭代的结果为基准，开始下一次的迭代。举个例子，迭代这个词经常出现在产品开发之中，每个周期都会有产品的迭代开发，但是不可能每次都是从零开始做产品，肯定是基于上一版本的产品进行开发，也就是进行迭代。

从中我们可以整理出关于迭代的两个关键点：

* 过程是重复的
* 返回上一次的迭代结果

那么JS中的“迭代器”是个怎样的概念呢？

查看MDN中的概念：[传送地址](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)

> 个人观点：JS中的迭代器，就是一个数组对象，不断地调用`next`重复获取过程，然后每次都返回一个结果。等到没有东西可返回了，就终止。因此`next`的返回对象有两个属性`done`和`value`。`done`表示是否结束了，`value`表示当前迭代的结果。当`done`为`true`的时候，表示迭代已结束，这时候是没有返回结果的也就是没有`value`这个属性。

然而迭代器是有一系列的规范的：

查看MDN中的概念：[传送地址](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)

### 迭代器
* 关于迭代器，就是我们上面讨论的`next`方法，返回`done`和`value`（`done:true`时可以省略）两个参数。
```
function iteratorFunc(){
    let arr=[...arguments]
    let nIndex=0
    return {
        next:()=>{
            return nIndex<arr.length?
            {value:arr[nIndex++],done:false}:{done:true}
        }
    }
}
let a=iteratorFunc(1,2,3)
console.log(a.next())//{done:false,value:1}
console.log(a.next())//{done:false,value:2}
console.log(a.next())//{done:false,value:3}
console.log(a.next())//{done:true}
```

### 可迭代“对象”

* 关于可迭代“对象”，我们需要再对象上实现`@@iterator`方法，也就是`[Symbol.iterator]`，返回一个自定义的迭代方法，以表明这个对象是可以迭代的。有些JS内置的对象就是可迭代的，比如String，Array。

自带的可迭代事例：
```
let str="我是欢乐的迭代器"
let b=str[Symbol.iterator]()
console.log(b.next())//{value: "我", done: false}
console.log(b.next())//{value: "是", done: false}
console.log(b.next())//{value: "欢", done: false}
```

有没有很神奇啊！用了这么久的字符串，居然还有这种操作。他的效果等同于上方的自定义迭代方法。那么我们来写个自定义的迭代方法：

```
str[Symbol.iterator] = function() {
    return { // this is the iterator object, returning a single element, the string "bye"
      next: function() {
        this._index += 2
        if (this._index<str.length) {
          return { value: str[this._index], done: false };
        } else {
          return { done: true };
        }
      },
      _index:-2
    };
};
let c=str[Symbol.iterator]()
console.log(c.next())//{value: "我", done: false}
console.log(c.next())//{value: "欢", done: false}
console.log(c.next())//{value: "的", done: false}
console.log(c.next())//{value: "代", done: false}
console.log(c.next())//{done: true}
```
这里我写的迭代器是返回一个隔一个字符。运行成功~yeah~

## 生成器

感觉写迭代器还是很绕呢，于是出现了生成器(generator)，专门帮我们生成迭代器的存在。

```
function * g(){}
let it= g()
console.log(it.next())//{value: undefined, done: true}
```

看到熟悉的结构没有！`{value: undefined, done: true}`，不过我们没有值。这个时候要向大家推荐`*`的好基友`yield`，一个`yield`对应一个`next`的值。

我们改写下上方的字符串的迭代器：
```
str[Symbol.iterator]= function * (){
    let index=-2;
    while(index<this.length){
        index += 2
        yield this[index]
    }
}
let kk=str[Symbol.iterator]()
console.log(kk.next())//{value: "我", done: false}
console.log(kk.next())//{value: "欢", done: false}
console.log(kk.next())//{value: "的", done: false}
console.log(kk.next())//{value: "代", done: false}
```
是不是方便了很多。

我们带着几个疑问来看看生成器：
* `yield`的返回值是啥？
* 执行顺序？

实例代码：
```
function * gy(){
    console.log("zero")
    let fisrt=yield "first"
    console.log("fisrt",fisrt)
    let second=yield "first"
    console.log("second",second)
}
let ity= gy()
```
第一次执行`ity.next()`，只打印了`zero`

第二次执行`ity.next()`，只打印了`first undefined`

第三次执行`ity.next("third")`，只打印了`second third`

由此可见每次的next都止步于`yield`，就不再执行下去了。`yield`每次返回的都是当前`ity.next(value)`的`value`值。


## aysnc/await

我们来看看对于Promise这个对象的迭代器，我们该怎么处理。也就是每个迭代器都是异步的。

```
function setTime(value,id){
    return new Promise((r,j)=>setTimeout(() => {
        console.log(value)
        r(id)
    }, 10))
}
function *a(){
    let r1 = yield setTime("first",1)
    console.log(r1)
    let r2 =yield setTime("second",2)
    console.log(r2)
    let r3 =yield setTime("third",3)
    console.log(r3)
}
let k=a();
new Promise((resolve,reject)=>{
    function next(data){
        let {value,done}=k.next(data)
        //k.next()返回一个promise,因此可以then
        if(!done){
            value.then((data)=>{
                console.log(data)
                next(data)
            })
        }
    }
    next();
})
```
因为每个都是异步的，所以需要我们二次处理，这个时候`aysnc/await`就可以出场了。只需要把*/yield无缝改成aysnc/await即可。
```
async function a() {
    let r1 = await setTime("first",1)
    console.log(r1)
    let r2 = await setTime("second",2)
    console.log(r2)
    let r3 = await setTime("third",3)
    console.log(r3)
}
a()
```



