function Promise(executor){
    let _=this;
    _.value=undefined;
    _.reason=undefined;
    _.state="pending"//大家一开始都是一样，等着吧
    _.resolveCallbacks=[];//callbacks在pending中添加，fullfilled中执行
    _.rejectCallbacks=[];//callbacks在pending中添加，rejected中执行
    function resolve(value){
        if (_.state !== 'pending') return
        _.value=value//实现之后的感言
        _.state="fulfilled"//实现啦！
        _.resolveCallbacks.forEach((fn)=>fn())
    }
    function reject(reason){
        if (_.state !== 'pending') return
        _.reason=reason//给我一个被拒绝的理由
        _.state="rejected"//被拒绝了！
        _.rejectCallbacks.forEach((fn)=>fn())
    }
    try {
        executor(resolve,reject)
    } catch (e) {
        reject(e)
    }
}
function resolvePromise(promise2,x,resolve,reject){
    
    //如果返回的x和原先的promise是同一个
    if(promise2 === x){
        return reject(new TypeError('Chaining cycle'));
    }
    let called;//用于检测resolve和reject只执行一次
    //如果x可能是一个promise
    if(x!==null && (typeof x=== 'object' || typeof x === 'function')){
        //如果x是一个promise，因为promise都要有then函数的
        try{
            let then=x.then;//point!此处需要捕获错误，有些不规范的object可能会报错
            if(typeof then === "function"){
                //y表示x这个promise的值
            
                then.call(x,y=>{
                    //继续遍历，直至返回值不是promise
                    if(called) return
                    called=true
                    resolvePromise(promise2,y,resolve,reject)
                },err=>{
                    if(called) return
                    called=true
                    reject(err)
                })
            }else{
                //如果x是个普通对象，直接运行
                resolve(x)
            }
        }catch(e){
            if(called) return
            called=true
            reject(e)
        }
    }else{
        //如果x不是一个promise，也就是x是一个常量，直接运行
        if(called) return
            called=true
        try{
            resolve(x)
        }catch(e){
            reject(e)
        }
    }
}
Promise.prototype.then=function(onFulfilled, onRejected){
    let _=this;
    /**
    * onFulfilled和onRejected都必须是一个方法
    */
    onFulfilled = typeof onFulfilled === 'function'?onFulfilled:val=>val;
    onRejected = typeof onRejected === 'function'?onRejected: err=>{throw err}
    
    let promise2;
    //将当前promise的值传递到下一次then的调用中
    
    promise2=new Promise((resolve,reject)=>{
        function resolveFunction(){
            setTimeout(() => {
                try{
                    let x=onFulfilled(_.value)
                    resolvePromise(promise2,x,resolve,reject)
                }catch(e){
                    reject(e)
                }
            },0)
        }
        function rejectFunction(){
            setTimeout(() => {
                try{
                    let x=onRejected(_.reason)
                    resolvePromise(promise2,x,resolve,reject)
                }catch(e){
                    reject(e)
                }
            },0)
        }
        if(_.state==="pending"){
            //把回调方法塞进队列中
            _.resolveCallbacks.push(()=>{
                resolveFunction()
            })
            _.rejectCallbacks.push(()=>{
                rejectFunction()
            })
        }
        if(_.state==="fulfilled"){
            resolveFunction()
        }
        if(_.state==="rejected"){
            rejectFunction()
        }
    })
    return promise2
}
Promise.defer = Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
module.exports=Promise