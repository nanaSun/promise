function * gy(){
    console.log("zero")
    let fisrt=yield "first"
    console.log("fisrt",fisrt)
    let second=yield "second"
    console.log("second",second)
}
let ity= gy()
ity.next()
ity.next("second")
ity.next("third")