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
                next(data)
            })
        }
    }
    next();
})
// async function a() {
//     let r1 = await setTime("first",1)
//     console.log(r1)
//     let r2 = await setTime("second",2)
//     console.log(r2)
//     let r3 = await setTime("third",3)
//     console.log(r3)
// }
// a()