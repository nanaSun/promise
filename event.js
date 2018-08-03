/**
 * @object 
 * @desc 发布订阅
 */
let fs=require('fs')
console.log(fs)
let event={
    arr:[],
    res:[],
    /**
    * @method 
    * @param {fn} function 检测类型
    * @desc 订阅
    */
    on(fn){
        this.arr.push(fn)
    },
    /**
    * @method 
    * @param {data} anything 获得的数据
    * @desc 发布
    */
    emit(data){
        this.res.push(data)
        this.arr.forEach(fn=>fn(this.res))
    }
}
event.on((data)=>{
    if(data.length===2){
        console.log(data)
    }
})
fs.readFile('./promise/1.txt','utf-8',(err,data)=>{
    event.emit(data)
})
fs.readFile('./promise/2.txt','utf-8',(err,data)=>{
    event.emit(data)
})