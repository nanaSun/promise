# 扒一扒PROMISE的原理，大家不要怕！

在前端的日常工作中，回调函数（callback）应该是见怪不怪了，但是当回调函数遇上了异步（async），这就令人发指了。那么异步是什么意思呢，简单地说就是不等你执行完，就先执行下方的代码了。

举个🌰：

我们最常用的异步操作应该是ajax了（想当初我第一次用ajax的时候，简直就是灾难。明明资源加载成功了，怎么就是没有调到资源中的数据呢？真令人头大啊。），只能等待加载完毕，再执行相关操作才能成功。因此我们看到的代码应该都是这样的。

```
/**
@param callback 回调函数
*/
function getData(url,callback){
    $.ajax({
        url:url,
        success:function(result){
            callback(result)；
        }
    });
}
//假设我有好多个ajax，每个ajax都需要上一个ajax的支持，于是……地狱出现了……
getData(url1,function(res){
    getData(url2,function(res){
        getData(url3,function(res){
            //终于可以干正事了
        })
    })
})
```

朋友们，回调地狱（callback Hell）了解下。

于是promise出现了，他的出现就是解决了回调地狱！他对异步的函数进行了封装，把回调变成了链式调用。

举个🌰：

```
function getData(url){
    return new Promise((resolve,reject)=>{
$.ajax({
        url:url,
        success:function(result){
            resolve(result)；
        },
        error:function(error){
            reject(error);
        }
    });
    })
}
getData(url1).then(function(res){
    return getData(url2)
}).then(function(res){
    return getData(url3)
}).then(function(res){
    //干正事啦！
})

```

确实。简洁了不少，至少不会被里三层外三层的括号弄晕。

但是当初我听到promise的时候，我内心是拒绝的。虽然内心拒绝，但是该来的还是要来的，该学的还是要学的，毕竟时代在进步，与时俱进还是很必要的！那么这个promise是怎么实现的呢？？？

### 实现一：状态

小伙伴们，这里promise可不是男女约会中浪漫的台词 ”I promise XXX“ ，而是一种规范，[点击此处获取规范](https://promisesaplus.com/)。不过这里的promise和现实生活中的promise一样，都有实现（fulfilled），拒绝（rejected）和等待（pending）这三种状态。

举个🌰：

假定 Mary 和 Mike 是一对情侣，半年前，Mike 向 Mary 承诺（promise）半年内完成他们的婚礼，但是直到现在 Mike 也没有做出行动，因此 Mary 表示她不会一直等待（pending）下去，于是他们分手了，那么这个承诺（promise）就是作废了（rejected）。如果这半年内 Mike 结了婚，那么现在 Mike 应该已经实现（fulfilled）了他对 Mary 的承诺（promise）。

所以说，所有的promise都有一个结果状态——实现（fulfilled）或者拒绝（rejected），而结果出来之前的状态就是等待（pending）。

[p1.js](https://github.com/nanaSun/promise/blob/master/p1.js)
```
//p1.js
function Promise(executor){
    let _=this;
    _.value=undefined;
    _.reason=undefined;
    _.state="pending"//大家一开始都是一样，等着吧
    function resolve(value){
        _.value=value//实现之后的感言
        _.state="fulfilled"//实现啦！
    }
    function reject(reason){
        _.reason=reason //给我一个被拒绝的理由
        _.state="rejected" //被拒绝了！
    }
    executor(resolve,reject)
}

//e.g
let Iagree=new Promise((resolve,reject)=>{
    resolve("我开心就同意了");//
})
let Idisagree=new Promise((resolve,reject)=>{
    reject("我不开心就拒绝了");
})
let noResult=new Promise((resolve,reject)=>{
})
console.log(Iagree.state,Idisagree.state,noResult.state)
```

### 实现二：添加then函数

不过我只知道一个状态有何用？我还要进行下一步哒！我们需要一个```then```，用于进行下一步的操作。

[p2.js](https://github.com/nanaSun/promise/blob/master/p2.js)
```
//p2.js
Promise.prototype.then=function(onFulfilled, onRejected){
    let _=this;
    if(_.state=="pending"){}
    if(_.state=="fulfilled"){
        onFulfilled(_.value)
    }
    if(_.state=="rejected"){
        onRejected(_.reason)
    }
}
//e.g
let Iagree=new Promise((resolve,reject)=>{
    resolve("我开心就同意了");//强行完成（fullfilled）
})
Iagree.then((data)=>{
    console.log(Iagree.state)
},(e)=>{
    console.log(e)
})
```

### 实现三：实现异步执行

不过这个都是同时进行，不是异步的。我们来瞅一眼异步～

这个时候我们需要把回调函数丢到resolve或者reject中，但是如果我们的后续方法很多呢？then好多次怎么办！将回调丢到的队列中，到时候Foreach一下逐个执行。

[p3.js](https://github.com/nanaSun/promise/blob/master/p3.js)
```
//p3.js
function Promise(executor){
    //....
    _.resolveCallbacks=[];//callbacks在pending中添加，fullfilled中执行
    _.rejectCallbacks=[];//callbacks在pending中添加，rejected中执行
    function resolve(value){
        //....
        _.resolveCallbacks.forEach((fn)=>fn())
    }
    function reject(reason){
       //....
        _.rejectCallbacks.forEach((fn)=>fn())
    }
    //....
}
Promise.prototype.then=function(onFulfilled, onRejected){
    let _=this;
    if(_.state=="pending"){
        //把回调方法塞进队列中
        _.resolveCallbacks.push(()=>{
            onFulfilled(_.value)
        })
        _.rejectCallbacks.push(()=>{
            onRejected(_.reason)
        })
    }
    //....
}
//e.g
let Iagree=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("我开心就同意了");
    },1000)
})

//为了防止多次then，所以回调方法需要丢入队列中，防止方法被覆盖。
Iagree.then((data)=>{
    console.log(Iagree.state)
},(e)=>{
    console.log(e)
})
Iagree.then((data)=>{
    console.log(Iagree.state+1)
},(e)=>{
    console.log(e)
})
```

### 实现四：实现链式调用

那么问题来了，如果我直接then，可不可以？像这这样：



```
Iagree.then((data)=>{
    ...
}).then((data)=>{
    ...
}).then((data)=>{
    ...
})
```

如果想要这样写，那么上一步的```then```必须返回一个promise对象才可以，不然哪里变出一个```then```方法。因此我们需要在```then```中```new```一个新的promise，用于下一个链式调用的```then```。


[p4.js](https://github.com/nanaSun/promise/blob/master/p4.js)
```
//p4.js
function resolvePromise(promise,x,resolve,reject){
    //如果x可能是一个promise
    if(x!==null&&(typeof x==="object"||typeof x==="function")){ 
        let then=x.then;
        //如果x是一个promise，因为promise都要有then函数的
        if(typeof then === "function"){
            //y表示x这个promise的值
            then.call(x,y=>{
                //继续遍历，直至返回值不是promise
                resolvePromise(promise,y,resolve,reject)
            },err=>{
                reject(err)
            })
        }else{
            //如果x是个普通对象，直接运行
            resolve(x)
            }
    }else{
        //如果x不是一个promise，也就是x是一个常量，直接运行
        resolve(x)
    }
}
Promise.prototype.then=function(onFulfilled, onRejected){
    let _=this;
    let promise2;
    //将当前promise的值传递到下一次then的调用中
    function resolveFunction(promise,resolve,reject){
        let x=onFulfilled(_.value)
        resolvePromise(promise,x,resolve,reject)
    }
    function rejectFunction(promise,resolve,reject){
        let x=onRejected(_.reason)
        resolvePromise(promise,x,resolve,reject)
    }
    promise2=new Promise((resolve,reject)=>{
        if(_.state=="pending"){
            //把回调方法塞进队列中
            _.resolveCallbacks.push(()=>{
                resolveFunction(promise2,resolve,reject)
            })
            _.rejectCallbacks.push(()=>{
                rejectFunction(promise2,resolve,reject)
            })
        }
        if(_.state=="fulfilled"){
            resolveFunction(promise2,resolve,reject)
        }
        if(_.state=="rejected"){
            rejectFunction(promise2,resolve,reject)
        }
    })
    return promise2
}
//e.g
let Iagree=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("我开心就同意了");
    },1000)
})

//为了防止多次then，所以回调方法需要丢入队列中，防止方法被覆盖。
Iagree.then((data)=>{
    console.log(data)
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("看心情干活");
        },1000)
    })
}).then((data)=>{
    console.log("前方返回一个promise："+data)
    return data+"，我是一个常量"
}).then((data)=>{
    console.log("常量返回："+data)
}).then((data)=>{
    console.log("前方无法返回："+data)
})
```

这样我们就可以愉快地用链式调用promise了，想想就美滋滋。
不过以上只是简单粗暴的实现promise的方式，只是一个原理，还有promise的一些规范需要完善[点击此处获取规范](https://promisesaplus.com/)。

### 符合promisesA+的规范

总结几点

* 该`try{}catch(){}`的地方都标记上，宁可错杀不放过。
* onFulfilled和onRejected的方法放入`setTimeout`之中，为了让他们变成“宏任务（macro-task）”。（应该是出于性能的考虑，之后再研究。）
* 然后加一个`Promise.defer = Promise.deferred = function(){}`方法，防止篡改。
* 接着导出promise，`module.exports=Promise`。
* 最后运行一波`promises-aplus-tests.cmd 你的promise.js`，然后一行行地检查你的代码，等到全部变绿（passing），恭喜你成功攻克promise！！

[p5.js](https://github.com/nanaSun/promise/blob/master/p5.js)
```
//参考p5.js
```