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
        _.reason=reason//给我一个被拒绝的理由
        _.state="rejected"//被拒绝了！
    }
    executor(resolve,reject)
}
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