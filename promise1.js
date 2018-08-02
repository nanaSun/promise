/**
 * @method
 * @param executor
 */
/**
 * 1.1 “promise” is an object or function with a then method whose behavior conforms to this specification.
 * 1.2 “thenable” is an object or function that defines a then method.
 */
function promise(executor){
    /**
     * 1.3 “value” is any legal JavaScript value (including undefined, a thenable, or a promise).
     * 1.4 “exception” is a value that is thrown using the throw statement.
     * 1.5 “reason” is a value that indicates why a promise was rejected.
     */
    let _=this;
    _.value=undefined;
    _.exception=undefined;
    _.reason=undefined;
    /**
     * 2.1 Promise States
     * A promise must be in one of three states: pending, fulfilled, or rejected.
     */
    _.state="pending"
    /**
     * 
     */
    _.resolvePromise=[];
    _.rejectPromise=[];
    function resolve(value){
        _.value=value
        _.state="fulfilled"
        _.resolvePromise.forEach((fn)=>fn())
    }
    function reject(reason){
        _.reason=reason
        _.state="rejected"
        _.rejectPromise.forEach((fn)=>fn())
    }
    try {
        executor(resolve,reject)
    } catch (e) {
        _.exception=e;
        reject(_.exception)
    }
    
}
/**
 * A promise must provide a then method to access its current or eventual value or reason.
 * A promise’s then method accepts two arguments:
 * promise.then(onFulfilled, onRejected)
 */
promise.prototype.then=function(onFulfilled, onRejected){
    let _=this;
    /**
     * When pending, a promise:
     * may transition to either the fulfilled or rejected state.
    */
    if(_.state=="pending"){
        _.resolvePromise.push(()=>{
            onFulfilled(_.value)
        })
        _.rejectPromise.push(()=>{
            onRejected(_.reason)
        })
    }
    /**
    * When fulfilled, a promise:
    * must not transition to any other state.
    * must have a value, which must not change.
    */
    if(_.state=="fulfilled"){
        onFulfilled(_.value)
    }
     /**
     * When rejected, a promise:
     * must not transition to any other state.
     * must have a reason, which must not change.
     */
    if(_.state=="rejected"){
        onRejected(_.reason)
    }
    
    
}

module.exports=promise
