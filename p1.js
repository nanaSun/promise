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