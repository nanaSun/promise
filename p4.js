function Promise(executor){
    let _=this;
    _.value=undefined;
    _.reason=undefined;
    _.state="pending"//大家一开始都是一样，等着吧
    _.resolveCallbacks=[];//callbacks在pending中添加，fullfilled中执行
    _.rejectCallbacks=[];//callbacks在pending中添加，rejected中执行
    function resolve(value){
        _.value=value//实现之后的感言
        _.state="fulfilled"//实现啦！
        _.resolveCallbacks.forEach((fn)=>fn())
    }
    function reject(reason){
        _.reason=reason//给我一个被拒绝的理由
        _.state="rejected"//被拒绝了！
        _.rejectCallbacks.forEach((fn)=>fn())
    }
    executor(resolve,reject)
}
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