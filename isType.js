/**
 * @method
 * @param {type} string 检测类型
 * @returns {function} 检测方法
 * @desc 用于检测对象类型
 */
function isType(type){
    /**
     * @method
     * @param {content} anything 检测对象
     * @returns Boolean
     * @reference https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#Using_toString_to_detect_object_type
     */
    return function(content){
        let t = Object.prototype.toString.call(content).replace(/\[object\s|\]/g,"")
        return t === type
    }
}

let allTypes=['String','Undefined','Function','Number']
let typeUtil={}

allTypes.forEach(t=>{
    typeUtil['is'+t]=isType(t)
})

/*
@usage 
*   typeUtil.isFunction(function(){})
*   typeUtil.isString("aaa")
*/