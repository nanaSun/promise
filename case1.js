let Promise=require("./promise1")
let fs=require("fs")

function newPromise(){
    return new Promise((resolve,reject)=>{
        resolve("bbbbbbb");
            // fs.readFile('./promise/1.txt','utf-8',(err,data)=>{
            //     if(err){
            //         reject(err)
            //     }else{
            //         resolve(data)
            //     }
            // })
    })
}

let i=0;
let b=newPromise().then((value)=>{
    console.log(value)
    return new Promise((resolve,reject)=>{
        resolve(new Promise((resolve,reject)=>{
            resolve("aaddddaa")
        }))
    })
})
b.then((value)=>{
    console.log(value)
})