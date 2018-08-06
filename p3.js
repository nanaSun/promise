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
    if(_.state=="fulfilled"){
        onFulfilled(_.value)
    }
    if(_.state=="rejected"){
        onRejected(_.reason)
    }
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