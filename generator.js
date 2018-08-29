function iteratorFunc(){
    let arr=[...arguments]
    let nIndex=0
    return {
        next:()=>{
            return nIndex<arr.length?
            {value:arr[nIndex++],done:false}:{done:true}
        }
    }
}
let a=iteratorFunc(1,2,3)
// console.log(a.next())//{done:false,value:1}
// console.log(a.next())//{done:false,value:2}
// console.log(a.next())//{done:false,value:3}
// console.log(a.next())//{done:true}


let str=new String("我是欢乐的迭代器啊")
let b=str[Symbol.iterator]()
console.log(b.next())//{value: "我", done: false}
console.log(b.next())//{value: "是", done: false}
console.log(b.next())//{value: "欢", done: false}


str[Symbol.iterator] = function() {
    return { // this is the iterator object, returning a single element, the string "bye"
      next: function() {
        this._index += 2
        if (this._index<str.length) {
          return { value: str[this._index], done: false };
        } else {
          return { done: true };
        }
      },
      _index:-2
    };
  };
let c=str[Symbol.iterator]()
console.log(c.next())//{value: "我", done: false} 
console.log(c.next())//{value: "欢", done: false}
console.log(c.next())//{value: "的", done: false}
console.log(c.next())//{value: "代", done: false}
console.log(c.next())//{done: true}

function * g(){

}
let it= g()
console.log(it.next())

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


//可迭代对象。
str[Symbol.iterator]= function * (){
    let index=-2;
    while(index<this.length){
        index += 2
        yield this[index]
    }
}
let kk=str[Symbol.iterator]()
console.log(kk.next())//{value: "我", done: false}
console.log(kk.next())//{value: "欢", done: false}
console.log(kk.next())//{value: "的", done: false}
console.log(kk.next())//{value: "代", done: false}